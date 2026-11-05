import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'ethnomusicology' | 'radif_analysis' | 'violin_technique' | 'organology' | 'acoustics';
  categoryLabelFa: string;
  tags: string[];
  coverImageUrl?: string;
  audioUrl?: string;
  audioTitle?: string;
  youtubeUrl?: string;
  readingTimeMinutes: number;
  likesCount: number;
  isFeatured?: boolean;
};

type Env = {
  KV_STORE: KVNamespace;
  MODIRIAT_ADMIN?: string;
};

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_farhat_cents_analysis',
    title: 'تحلیل تطبیقی و آکوستیک فواصل سه‌گاه و چهارگاه',
    slug: 'farhat-neutral-intervals-segah-chahargah',
    summary: 'بررسی دقیق آزمایشگاهی انحراف سنت‌ها در ربع‌پرده‌های موسیقی ایرانی.',
    author: 'ایمان برزجان',
    authorRole: 'پژوهشگر موسیقی و طراح سامانه پرده‌نگار',
    date: '۱۴ آبان ۱۴۰۵',
    category: 'acoustics',
    categoryLabelFa: 'آکوستیک و تئوری ردیف',
    tags: ['هرمز فرهت', 'ریزپرده‌ها', 'چهارگاه', 'سه‌گاه'],
    readingTimeMinutes: 7,
    likesCount: 142,
    content: '### مقدمه\n\nمتن مقاله...',
  }
];

const BLOG_STORAGE_KEY = 'enamix_pardehnegar_blog_posts_v1';

async function getKv(env: Env): Promise<KVNamespace> {
  if (!env?.KV_STORE) {
    throw new Error('KV_STORE binding is not configured');
  }
  return env.KV_STORE;
}

async function readDbPosts(env: Env): Promise<BlogPost[]> {
  try {
    const kv = await getKv(env);
    const raw = await kv.get(BLOG_STORAGE_KEY);
    if (!raw) return [...SEED_BLOG_POSTS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as BlogPost[];
    }
  } catch (err) {
    console.error('KV read failed:', err);
  }
  await writeDbPosts(env, SEED_BLOG_POSTS);
  return [...SEED_BLOG_POSTS];
}

async function writeDbPosts(env: Env, posts: BlogPost[]) {
  const kv = await getKv(env);
  await kv.put(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

function checkAdminAuth(req: Request, env: Env): boolean {
  const adminPassword = (
    req.headers['x-admin-password'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    req.body?.adminPassword ||
    req.body?.password ||
    req.query?.adminPassword ||
    ''
  ).toString().trim();

  const configuredEnvPass = (env.MODIRIAT_ADMIN || '').trim();

  if (!configuredEnvPass || !adminPassword) {
    return false;
  }

  return adminPassword === configuredEnvPass;
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PardehNegar EnamiX Cloudflare Worker',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/admin/verify', (req: Request, res: Response) => {
  const env = (req as any).env as Env;
  const configuredEnvPass = (env.MODIRIAT_ADMIN || '').trim();

  if (!configuredEnvPass) {
    return res.status(403).json({
      success: false,
      message: 'متغیر MODIRIAT_ADMIN هنوز تنظیم نشده است.'
    });
  }

  if (checkAdminAuth(req, env)) {
    return res.json({ success: true, message: 'احراز هویت مدیریت موفقیت‌آمیز بود.' });
  }

  return res.status(401).json({
    success: false,
    message: 'کلمه عبور امنیتی مدیریت نادرست است.'
  });
});

app.get('/api/blog/posts', async (req: Request, res: Response) => {
  try {
    const env = (req as any).env as Env;
    const posts = await readDbPosts(env);
    res.json({ success: true, posts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/blog/posts/:id', async (req: Request, res: Response) => {
  try {
    const env = (req as any).env as Env;
    const posts = await readDbPosts(env);
    const post = posts.find(p => p.id === req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
    }

    res.json({ success: true, post });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/blog/posts', async (req: Request, res: Response) => {
  const env = (req as any).env as Env;

  if (!checkAdminAuth(req, env)) {
    return res.status(401).json({
      success: false,
      message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.'
    });
  }

  try {
    const { title, summary, content, author, category, categoryLabelFa, tags, coverImageUrl, audioUrl, audioTitle, youtubeUrl, readingTimeMinutes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'عنوان مقاله الزامی است.'
      });
    }

    const posts = await readDbPosts(env);
    const newPost: BlogPost = {
      id: `post_${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40),
      summary: summary?.trim() || title.trim(),
      content: content?.trim() || '',
      author: author?.trim() || 'ایمان برزجان',
      authorRole: 'پژوهشگر موسیقی و استودیو اینامیکس',
      date: new Date().toLocaleDateString('fa-IR'),
      category: category || 'acoustics',
      categoryLabelFa: categoryLabelFa || 'پژوهش موسیقی',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []),
      coverImageUrl: coverImageUrl?.trim() || undefined,
      audioUrl: audioUrl?.trim() || undefined,
      audioTitle: audioTitle?.trim() || undefined,
      youtubeUrl: youtubeUrl?.trim() || undefined,
      readingTimeMinutes: Number(readingTimeMinutes) || 5,
      likesCount: 1
    };

    posts.unshift(newPost);
    await writeDbPosts(env, posts);

    return res.status(201).json({
      success: true,
      post: newPost,
      message: 'مقاله جدید با موفقیت در KV ذخیره شد.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/blog/posts/:id', async (req: Request, res: Response) => {
  const env = (req as any).env as Env;

  if (!checkAdminAuth(req, env)) {
    return res.status(401).json({
      success: false,
      message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.'
    });
  }

  try {
    const posts = await readDbPosts(env);
    const index = posts.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'مقاله مورد نظر یافت نشد.'
      });
    }

    const existing = posts[index];
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    posts[index] = updated;
    await writeDbPosts(env, posts);

    return res.json({
      success: true,
      post: updated,
      message: 'مقاله با موفقیت به‌روزرسانی شد.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/blog/posts/:id', async (req: Request, res: Response) => {
  const env = (req as any).env as Env;

  if (!checkAdminAuth(req, env)) {
    return res.status(401).json({
      success: false,
      message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.'
    });
  }

  try {
    const posts = await readDbPosts(env);
    const filtered = posts.filter(p => p.id !== req.params.id);

    if (filtered.length === posts.length) {
      return res.status(404).json({
        success: false,
        message: 'مقاله مورد نظر یافت نشد.'
      });
    }

    await writeDbPosts(env, filtered);

    return res.json({
      success: true,
      message: 'مقاله با موفقیت از KV حذف شد.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/blog/reset', async (req: Request, res: Response) => {
  const env = (req as any).env as Env;

  if (!checkAdminAuth(req, env)) {
    return res.status(401).json({
      success: false,
      message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.'
    });
  }

  try {
    await writeDbPosts(env, SEED_BLOG_POSTS);
    return res.json({
      success: true,
      posts: SEED_BLOG_POSTS,
      message: 'پایگاه داده مقالات به نسخه‌های مرجع اولیه بازنشانی شد.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const worker = app;
    (worker as any).env = env;
    return worker.handle(request);
  }
};
