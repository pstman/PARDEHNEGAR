import dotenv from 'dotenv';
import { INITIAL_BLOG_POSTS, type BlogPost } from './src/utils/blogData';

dotenv.config();

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  KV_STORE: KVNamespace;
  MODIRIAT_ADMIN?: string;
}

const BLOG_STORAGE_KEY = 'enamix_pardehnegar_blog_posts_v1';

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function getKv(env: Env): KVNamespace {
  if (!env?.KV_STORE) {
    throw new Error('KV_STORE binding is not configured. Add the Cloudflare KV binding in wrangler.toml and in the Cloudflare dashboard.');
  }
  return env.KV_STORE;
}

async function ensureSeedData(env: Env): Promise<BlogPost[]> {
  const kv = getKv(env);
  const existing = await kv.get(BLOG_STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as BlogPost[];
      }
    } catch {
      // Ignore invalid storage and repopulate below.
    }
  }

  await kv.put(BLOG_STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
  return INITIAL_BLOG_POSTS;
}

async function readDbPosts(env: Env): Promise<BlogPost[]> {
  const kv = getKv(env);
  const stored = await kv.get(BLOG_STORAGE_KEY);

  if (!stored) {
    await kv.put(BLOG_STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
    return INITIAL_BLOG_POSTS;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as BlogPost[];
    }
  } catch (error) {
    console.error('[KV] invalid blog payload, restoring seed data:', error);
  }

  await kv.put(BLOG_STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
  return INITIAL_BLOG_POSTS;
}

async function writeDbPosts(env: Env, posts: BlogPost[]): Promise<void> {
  const kv = getKv(env);
  await kv.put(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

function checkAdminAuth(req: Request, env: Env): boolean {
  const headerPassword =
    req.headers.get('x-admin-password') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  const configuredEnvPass = (env.MODIRIAT_ADMIN || '').trim();
  const suppliedPassword = headerPassword.trim();

  if (!configuredEnvPass || !suppliedPassword) {
    return false;
  }

  return suppliedPassword === configuredEnvPass;
}

async function getRequestBody<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (url.pathname === '/api/health') {
      return json({
        status: 'ok',
        service: 'PardehNegar Cloudflare Worker',
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === '/api/admin/verify' && method === 'POST') {
      const configuredEnvPass = (env.MODIRIAT_ADMIN || '').trim();
      if (!configuredEnvPass) {
        return json({
          success: false,
          message: 'متغیر محیطی MODIRIAT_ADMIN در تنظیمات Cloudflare تعریف نشده است.'
        }, 403);
      }

      if (checkAdminAuth(request, env)) {
        return json({ success: true, message: 'احراز هویت مدیریت موفقیت‌آمیز بود.' });
      }

      return json({ success: false, message: 'کلمه عبور امنیتی مدیریت نادرست است.' }, 401);
    }

    if (url.pathname === '/api/blog/posts' && method === 'GET') {
      try {
        const posts = await ensureSeedData(env);
        return json({ success: true, posts });
      } catch (error: any) {
        return json({ success: false, error: error.message }, 500);
      }
    }

    if (url.pathname === '/api/blog/posts' && method === 'POST') {
      if (!checkAdminAuth(request, env)) {
        return json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' }, 401);
      }

      try {
        const body = await getRequestBody<Record<string, any>>(request);
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        if (!title) {
          return json({ success: false, message: 'عنوان مقاله الزامی است.' }, 400);
        }

        const posts = await readDbPosts(env);
        const newPost: BlogPost = {
          id: `post_${Date.now()}`,
          title,
          slug: title.toLowerCase().replace(/\s+/g, '-').slice(0, 40),
          summary: typeof body.summary === 'string' && body.summary.trim() ? body.summary.trim() : title,
          content: typeof body.content === 'string' ? body.content.trim() : '',
          author: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : 'ایمان برزجان',
          authorRole: 'پژوهشگر موسیقی و استودیو اینامیکس',
          date: new Date().toLocaleDateString('fa-IR'),
          category: body.category || 'acoustics',
          categoryLabelFa: body.categoryLabelFa || 'پژوهش موسیقی',
          tags: Array.isArray(body.tags)
            ? body.tags
            : (typeof body.tags === 'string' ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []),
          coverImageUrl: body.coverImageUrl || undefined,
          audioUrl: body.audioUrl || undefined,
          audioTitle: body.audioTitle || undefined,
          youtubeUrl: body.youtubeUrl || undefined,
          readingTimeMinutes: Number(body.readingTimeMinutes) || 5,
          likesCount: 1,
          createdAt: new Date().toISOString()
        };

        posts.unshift(newPost);
        await writeDbPosts(env, posts);

        return json({ success: true, post: newPost, message: 'مقاله جدید با موفقیت در Cloudflare KV ذخیره شد.' }, 201);
      } catch (error: any) {
        return json({ success: false, error: error.message }, 500);
      }
    }

    const postMatch = url.pathname.match(/^\/api\/blog\/posts\/([^/]+)$/);
    if (postMatch) {
      const id = decodeURIComponent(postMatch[1]);

      if (method === 'GET') {
        try {
          const posts = await readDbPosts(env);
          const post = posts.find((item) => item.id === id);
          if (!post) {
            return json({ success: false, message: 'مقاله مورد نظر یافت نشد.' }, 404);
          }
          return json({ success: true, post });
        } catch (error: any) {
          return json({ success: false, error: error.message }, 500);
        }
      }

      if (method === 'PUT') {
        if (!checkAdminAuth(request, env)) {
          return json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' }, 401);
        }

        try {
          const posts = await readDbPosts(env);
          const index = posts.findIndex((item) => item.id === id);
          if (index === -1) {
            return json({ success: false, message: 'مقاله مورد نظر یافت نشد.' }, 404);
          }

          const body = await getRequestBody<Record<string, any>>(request);
          const updated = {
            ...posts[index],
            ...body,
            id: posts[index].id,
            updatedAt: new Date().toISOString()
          };

          posts[index] = updated;
          await writeDbPosts(env, posts);

          return json({ success: true, post: updated, message: 'مقاله با موفقیت در Cloudflare KV به‌روزرسانی شد.' });
        } catch (error: any) {
          return json({ success: false, error: error.message }, 500);
        }
      }

      if (method === 'DELETE') {
        if (!checkAdminAuth(request, env)) {
          return json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' }, 401);
        }

        try {
          const posts = await readDbPosts(env);
          const filtered = posts.filter((item) => item.id !== id);
          if (filtered.length === posts.length) {
            return json({ success: false, message: 'مقاله مورد نظر یافت نشد.' }, 404);
          }

          await writeDbPosts(env, filtered);
          return json({ success: true, message: 'مقاله با موفقیت از Cloudflare KV حذف شد.' });
        } catch (error: any) {
          return json({ success: false, error: error.message }, 500);
        }
      }
    }

    if (url.pathname === '/api/blog/reset' && method === 'POST') {
      if (!checkAdminAuth(request, env)) {
        return json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' }, 401);
      }

      try {
        await writeDbPosts(env, INITIAL_BLOG_POSTS);
        return json({ success: true, posts: INITIAL_BLOG_POSTS, message: 'پایگاه داده مقالات به نسخه‌های مرجع اولیه بازنشانی شد.' });
      } catch (error: any) {
        return json({ success: false, error: error.message }, 500);
      }
    }

    return json({ success: false, message: 'Not found' }, 404);
  }
};
