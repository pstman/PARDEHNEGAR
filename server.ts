/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * سرور فول‌استک پرده‌نگار و پیوستار آکوستیک • استودیو اینامیکس
 * Full-stack Express server with Vite middleware, Server-side blog persistence,
 * and MODIRIAT_ADMIN security verification.
 * 
 * Designed for 100% unrestricted accessibility for clients from Iran and globally:
 * - Direct first-party API routes (/api/*) without third-party blocked services
 * - Persistent server-side database storage (data/blog_posts.json)
 * - Cloudflare Pages & Cloud Run production ready
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body Parser Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Database storage directory & file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'blog_posts.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed articles (Written by Iman Barzjan & EnamiX Studio)
const SEED_BLOG_POSTS = [
  {
    id: 'post_farhat_cents_analysis',
    title: 'تحلیل تطبیقی و آکوستیک فواصل سه‌گاه و چهارگاه: از ۲۴ ربع‌پرده مکانیکی تا فواصل خنثای هرمز فرهت',
    slug: 'farhat-neutral-intervals-segah-chahargah',
    summary: 'بررسی دقیق آزمایشگاهی انحراف سنت‌ها در ربع‌پرده‌های موسیقی ایرانی؛ چرا تقسیم ۲۴ قسمتی مساوی کلنل وزیری در اجرای استادان واقعی نبود و فواصل انعطاف‌پذیر پنج‌گانه فرهت حقیقت گریف ویولن را آشکار می‌سازد.',
    author: 'ایمان برزجان',
    authorRole: 'پژوهشگر موسیقی و طراح سامانه پرده‌نگار',
    date: '۱۴ آبان ۱۴۰۵',
    category: 'acoustics',
    categoryLabelFa: 'آکوستیک و تئوری ردیف',
    tags: ['هرمز فرهت', 'ریزپرده‌ها', 'چهارگاه', 'سه‌گاه', 'انحراف سنت', 'ویولن صبا'],
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/science/electronic_synth_tone_loop.ogg',
    audioTitle: 'نمونه صوتی مقایسه دوم خنثی (۱۳۵ سنت) در برابر دوم نیم‌پرده و دوم بزرگ',
    youtubeUrl: 'https://www.youtube.com/watch?v=k1b8zms9qYk',
    readingTimeMinutes: 7,
    likesCount: 142,
    isFeatured: true,
    content: `
### مقدمه و چالش تاریخی ربع‌پرده‌ها

در ابتدای قرن بیستم، علینقی وزیری با الهام از نظام اعتدال مساوی دوازده‌گانه باخ، گام ۲۴ ربع‌پرده‌ای را پیشنهاد داد. در این نظام تصوری، هر پرده به ۴ قسمت مساوی ۵۰ سنتی تقسیم می‌شد و علامت **کُرُن (𝄳)** نوت را ۵۰ سنت بم و **سُری (𝄲)** نوت را ۵۰ سنت زیر می‌نمود.

اما تجزیه و تحلیل دستگاهی ضبط‌های تاریخی نشان می‌دهد که:
* گوش نوازندگان اصیل هیچ‌گاه فاصله‌ای با اندازه دقیق **۵۰ سنت** نمی‌نواخته است.
* برای مثال، در **دستگاه شور «لا»**، فاصله بین نت **لا** و **سی کُرُن** نه ۱۵۰ سنت، بلکه حدود **۱۳۵ تا ۱۴۰ سنت** است!
* در **دستگاه چهارگاه «دو»**، فاصله نت **دو** تا **رِ کُرُن** یک **دوم خنثی ($n \\approx 135\\text{ cents}$)** و سپس فاصله **رِ کُرُن** تا **می بکار** یک **دوم افزوده بزرگ ($P \\approx 270\\text{ cents}$)** است.

---

### جدول تطبیقی فواصل پنج‌گانه هرمز فرهت با اعتدال مساوی

| نماد فاصله | نام انگلیسی | اندازه به سنت (Cents) | نمونه در ردیف ویولن |
| :---: | :---: | :---: | :---: |
| **m** | Minor Second | **۹۰ سنت** | سی بکار تا دو / فا تا سل بمل |
| **n** | Neutral Second | **۱۳۵ تا ۱۴۰ سنت** | لا تا سی کُرُن در شور / دو تا ر کُرن در چهارگاه |
| **N** | Plus Neutral Second | **۱۶۰ تا ۱۶۵ سنت** | سل تا لا کُرُن در مویه سه‌گاه |
| **M** | Major Second | **۲۰۴ سنت** | دو تا رِ در ماهور / فا تا سل در دشتی |
| **P** | Plus Augmented Second | **۲۶۵ تا ۲۸۰ سنت** | رِ کُرُن تا می در چهارگاه / لا کُرُن تا سی در همایون |

> **نکته کلیدی برای هنرجویان ویولن:** 
> انگشت اول روی سیم لا هنگام نواختن نوت **سی کُرُن** نباید دقیقاً در میانه راه سی بمل و سی بکار قرار گیرد؛ بلکه باید اندکی به سمت شیطانک ساز متمایل باشد تا فاصله ۱۳۵ سنتی شفاف و گوش‌نواز ایرانی حاصل شود.
    `
  },
  {
    id: 'post_continuum_santur_tambal',
    title: 'پیوستار آکوستیک اوراسیا: مهاجرت تاریخی سنتور کهن ایران تا تسامبال حوضه کارپات و رومانی',
    slug: 'acoustic-continuum-santur-to-tambal-romania',
    summary: 'چگونه سنتور ایرانی در امتداد شاهراه تاریخی ابریشم و بالکان به رومانی رسید و سازندگان بزرگ تسامبال کنسرتی (Țambal Mare) کالبد آن را دگرگون کردند.',
    author: 'ایمان برزجان',
    authorRole: 'پژوهشگر موسیقی و مؤلف پرده‌نگار',
    date: '۱۰ آبان ۱۴۰۵',
    category: 'organology',
    categoryLabelFa: 'سازشناسی و تاریخ پیوستار',
    tags: ['سنتور', 'تسامبال', 'پیوستار آکوستیک', 'رومانی', 'لوتاری', 'دیمیتری کانتمیر'],
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_festival_crowd.ogg',
    audioTitle: 'نوای همزمان سنتور ایرانی و تسامبال کنسرتی رومانی در ریتم ۹/۸ اکساک',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    readingTimeMinutes: 6,
    likesCount: 118,
    isFeatured: true,
    content: `
### از فلات ایران تا دشت‌های والاچیا و مولداوی

ساز **سنتور**، یکی از کهن‌ترین سازهای زهی-کوبه‌ای بشر است که نقوش برجسته آن در تمدن بابل و ایلام باستان به تصویر کشیده شده است. اما آنچه کمتر به آن پرداخته شده، سیر مسافرت آکوستیک این ساز در قرون وسطی و دوران عثمانی به سوی قلب اروپا است.

#### نقش تاریخی شاهزاده دیمیتری کانتمیر (کانتمیر اوغلو)
شاهزاده فرهیخته مولداوی، **دیمیتری کانتمیر (۱۶۷۳–۱۷۲۳)**، با نگارش کتاب علم الموسیقی نه تنها مقامات ایرانی و عثمانی را با الفبای ابجدی نت‌نویسی کرد، بلکه سازهای زهی را میان دربار استانبول و شاه‌نشین‌های رومانی به گردش درآورد.

#### تولد تسامبال بزرگ (Țambal Mare) در بوداپست و بخارست
در اواخر قرن نوزدهم، **یوژف شوندا (József Schunda)** در بوداپست با الهام از سنتورهای شرقی لوتاری‌ها:
1. پدال دمپر برای قطع رزونانس بی‌مهار سیم‌ها تعبیه کرد.
2. کلاف چدنی سنگین برای تحمل کشش ده‌ها سیم فولادی افزود.
3. وسعت صدادهی را از دو اکتاو به چهار اکتاو گسترش داد.
    `
  },
  {
    id: 'post_violin_tunings_saba_yahaghi',
    title: 'کوک‌های طلایی ویولن در موسیقی اصیل ایران: تحلیل فرکانسی، واخوان‌ها و سبک‌شناسی صبا و یاحقی',
    slug: 'golden-persian-violin-tunings-saba-yahaghi',
    summary: 'رمزگشایی از هارمونیک‌های سیم‌های آزاد ویولن در کوک‌های ر-لا-ر-سل، ر-لا-ر-لا و می-لا-ر-دو؛ چگونه آکوستیک ساز اروپایی با لحن گرم شرقی درآمیخت.',
    author: 'ایمان برزجان',
    authorRole: 'مدرس ویولن و مؤلف رپرتوار پرده‌نگار',
    date: '۵ آبان ۱۴۰۵',
    category: 'violin_technique',
    categoryLabelFa: 'مکتب ویولن ایرانی',
    tags: ['ویولن ایرانی', 'ابوالحسن صبا', 'پرویز یاحقی', 'کوک ساز', 'واخوان'],
    coverImageUrl: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/foley/paper_turn.ogg',
    audioTitle: 'طنین واخوان در کوک ر-لا-ر-لا روی پوزیسیون سوم ویولن',
    youtubeUrl: 'https://www.youtube.com/watch?v=0hX03w1F9m0',
    readingTimeMinutes: 8,
    likesCount: 165,
    isFeatured: false,
    content: `
### چرا ویولن در موسیقی ایرانی کوک‌های متعددی دارد؟

در موسیقی کلاسیک غربی، کوک ویولن همواره بر پایه فواصل پنجم درست ثابت است:
* سیم ۱: **E5 (می)** = ۶۵۹.۲۵ هرتز
* سیم ۲: **A4 (لا)** = ۴۴۰.۰۰ هرتز
* سیم ۳: **D4 (رِ)** = ۲۹۳.۶۶ هرتز
* سیم ۴: **G3 (سل)** = ۱۹۶.۰۰ هرتز

اما در ردیف موسیقی ایرانی، برای بهره‌مندی از پدیده فیزیکی **تشدید همدلانه (Sympathetic Resonance)** و ایجاد واخوان‌های مخملی در پس‌زمینه آواز، سیم‌ها مطابق نت شاهد و ایست تغییر می‌کنند:

#### ۱. کوک دشتی و همایون در ر (رِ - لا - رِ - لا)
سیم اول به جای «می» به «ر» کوک می‌شود تا با سیم سوم هم‌صدا گردد. در نتیجه هنگام آرشه‌کشی روی سیم دوم، سیم اول و سوم نیز به ارتعاش درمی‌آیند و رنگ صدای شگفت‌انگیز مکتب پرویز یاحقی را خلق می‌کنند.

#### ۲. کوک اصفهان و چهارگاه در دو (می - لا - رِ - دو)
سیم چهارم که به طور طبیعی «سل» است، یک پرده و نیم بالا کشیده شده و روی «دو» تنظیم می‌گردد تا پایه تنال گام اصفهان را استوار سازد.
    `
  }
];

// Helper: Read database from file
function readDbPosts(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
  }
  // Initialize file with seed posts if empty or missing
  writeDbPosts(SEED_BLOG_POSTS);
  return SEED_BLOG_POSTS;
}

// Helper: Write database to file (atomic write)
function writeDbPosts(posts: any[]): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(posts, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB_FILE:', err);
  }
}

// Helper: Security verification for MODIRIAT_ADMIN environment variable
function checkAdminAuth(req: Request): boolean {
  const adminPassword = (
    req.headers['x-admin-password'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    req.body?.adminPassword ||
    req.body?.password ||
    req.query?.adminPassword ||
    ''
  ).toString().trim();

  const configuredEnvPass = (
    process.env.MODIRIAT_ADMIN ||
    process.env.VITE_MODIRIAT_ADMIN ||
    ''
  ).trim();

  // Deny access if environment variable is not configured or password is empty
  if (!configuredEnvPass || !adminPassword) {
    return false;
  }

  // Matches strictly against the configured environment variable. Zero hardcoded passwords.
  return adminPassword === configuredEnvPass;
}

// --- REST API ENDPOINTS ---

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PardehNegar EnamiX Full-Stack Server',
    timestamp: new Date().toISOString()
  });
});

// Admin Password Verification
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const configuredEnvPass = (
    process.env.MODIRIAT_ADMIN ||
    process.env.VITE_MODIRIAT_ADMIN ||
    ''
  ).trim();

  if (!configuredEnvPass) {
    return res.status(403).json({
      success: false,
      message: 'متغیر محیطی MODIRIAT_ADMIN هنوز در تنظیمات سرور یا کلودفلر مقداردهی نشده است. لطفاً ابتدا در پنل کلودفلر متغیر MODIRIAT_ADMIN را با کلمه عبور دلخواه خود تنظیم نمایید.'
    });
  }

  if (checkAdminAuth(req)) {
    return res.json({ success: true, message: 'احراز هویت مدیریت موفقیت‌آمیز بود.' });
  }

  return res.status(401).json({ success: false, message: 'کلمه عبور امنیتی مدیریت نادرست است.' });
});

// Get all blog posts
app.get('/api/blog/posts', (_req: Request, res: Response) => {
  try {
    const posts = readDbPosts();
    res.json({ success: true, posts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single blog post by ID
app.get('/api/blog/posts/:id', (req: Request, res: Response) => {
  try {
    const posts = readDbPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
    }
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new blog post (Admin Only)
app.post('/api/blog/posts', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' });
  }

  try {
    const { 
      title, 
      summary, 
      content, 
      author, 
      category, 
      categoryLabelFa, 
      tags, 
      coverImageUrl, 
      audioUrl, 
      audioTitle, 
      youtubeUrl, 
      readingTimeMinutes 
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'عنوان مقاله الزامی است.' });
    }

    const posts = readDbPosts();
    const newPost = {
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
      likesCount: 1,
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    writeDbPosts(posts);

    return res.status(201).json({ success: true, post: newPost, message: 'مقاله جدید با موفقیت منتشر و در پایگاه داده ذخیره شد.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Update existing blog post (Admin Only)
app.put('/api/blog/posts/:id', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' });
  }

  try {
    const posts = readDbPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
    }

    const existing = posts[index];
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id, // prevent id overwrite
      updatedAt: new Date().toISOString()
    };

    posts[index] = updated;
    writeDbPosts(posts);

    return res.json({ success: true, post: updated, message: 'مقاله با موفقیت به‌روزرسانی شد.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Delete blog post (Admin Only)
app.delete('/api/blog/posts/:id', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' });
  }

  try {
    const posts = readDbPosts();
    const filtered = posts.filter(p => p.id !== req.params.id);
    if (filtered.length === posts.length) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد.' });
    }

    writeDbPosts(filtered);
    return res.json({ success: true, message: 'مقاله با موفقیت از پایگاه داده حذف شد.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Reset database to initial seed articles (Admin Only)
app.post('/api/blog/reset', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز: کلمه عبور مدیریت نادرست است.' });
  }

  try {
    writeDbPosts(SEED_BLOG_POSTS);
    return res.json({ success: true, posts: SEED_BLOG_POSTS, message: 'پایگاه داده مقالات به نسخه‌های مرجع اولیه بازنشانی شد.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- STATIC ASSETS & VITE INTEGRATION ---

async function startServer() {
  if (!isProduction) {
    // In development: mount Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve pre-built files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PardehNegar] Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[PardehNegar] Failed to start server:', err);
  process.exit(1);
});
