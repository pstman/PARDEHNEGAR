/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پایگاه داده مقالات و وبلاگ پژوهشی پرده‌نگار • استودیو اینامیکس
 * پشتیبانی از متن Markdown و تگ‌های HTML، صوت با پلیر شیک، تصاویر PNG/JPG و ویدیوهای یوتیوب
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown & safe HTML supported
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
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
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
- گوش نوازندگان اصیل هیچ‌گاه فاصله‌ای با اندازه دقیق **۵۰ سنت** نمی‌نواخته است.

- برای مثال، در **دستگاه شور «لا»**، فاصله بین نت **لا** و **سی کُرُن** نه ۱۵۰ سنت، بلکه حدود **۱۳۵ تا ۱۴۰ سنت** است!

- در **دستگاه چهارگاه «دو»**، فاصله نت **دو** تا **رِ کُرُن** یک **دوم خنثی ($n \\approx 135\\text{ cents}$)** و سپس فاصله **رِ کُرُن** تا **می بکار** یک **دوم افزوده بزرگ ($P \\approx 270\\text{ cents}$)** است.


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

\`\`\`
[ C4 ] --- 135 cents (n) ---> [ D𝄳4 (ر کُرن) ] --- 270 cents (P) ---> [ E4 (می) ]
\`\`\`
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

\`\`\`html
<div style="background: rgba(229,168,54,0.1); border-left: 4px solid #E5A836; padding: 12px; border-radius: 8px;">
  <strong>خانواده نوازندگان لوتاری (Lăutari):</strong> نوازندگان محلی رومانی نغمه‌های حزن‌انگیز <em>Doina</em> را با سرانگشتان چابک بر روی تسامبال می‌نواختند؛ سبکی که یادآور آوازهای دشتی و گوشه عشاق در ردیف صبا است.
</div>
\`\`\`
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
- سیم ۱: **E5 (می)** = ۶۵۹.۲۵ هرتز

- سیم ۲: **A4 (لا)** = ۴۴۰.۰۰ هرتز

- سیم ۳: **D4 (رِ)** = ۲۹۳.۶۶ هرتز

- سیم ۴: **G3 (سل)** = ۱۹۶.۰۰ هرتز


اما در ردیف موسیقی ایرانی، برای بهره‌مندی از پدیده فیزیکی **تشدید همدلانه (Sympathetic Resonance)** و ایجاد واخوان‌های مخملی در پس‌زمینه آواز، سیم‌ها مطابق نت شاهد و ایست تغییر می‌کنند:

#### ۱. کوک دشتی و همایون در ر (رِ - لا - رِ - لا)
سیم اول به جای «می» به «ر» کوک می‌شود تا با سیم سوم هم‌صدا گردد. در نتیجه هنگام آرشه‌کشی روی سیم دوم، سیم اول و سوم نیز به ارتعاش درمی‌آیند و رنگ صدای شگفت‌انگیز مکتب پرویز یاحقی را خلق می‌کنند.

#### ۲. کوک اصفهان و چهارگاه در دو (می - لا - رِ - دو)
سیم چهارم که به طور طبیعی «سل» است، یک پرده و نیم بالا کشیده شده و روی «دو» تنظیم می‌گردد تا پایه تنال گام اصفهان را استوار سازد.

\`\`\`
کوک‌های شاخص ویولن ایرانی:
- شور و ابوعطا:  می - لا - ر - سل (کوک جهانی)

- دشتی و همایون: ر - لا - ر - سل  یا  ر - لا - ر - لا

- اصفهان و چهارگاه: می - لا - ر - دو

- سه‌گاه می:      می - لا - ر - سل (با می کرن روی سیم سوم)

\`\`\`
    `
  }
];

const BLOG_STORAGE_KEY = 'enamix_pardehnegar_blog_posts_v1';

export function getStoredBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_BLOG_POSTS;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Error saving blog posts to localStorage:', err);
  }
}

export function resetBlogPostsToDefault(): BlogPost[] {
  try {
    localStorage.removeItem(BLOG_STORAGE_KEY);
  } catch {
    // ignore
  }
  return INITIAL_BLOG_POSTS;
}

/**
 * Full-Stack API Integration
 * Fetches posts from server database (/api/blog/posts) with fallback to local cache
 */
export async function fetchRemoteBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/blog/posts');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        saveBlogPosts(data.posts);
        return data.posts;
      }
    }
  } catch (err) {
    console.warn('[Blog API] Server fetch failed, using local cache:', err);
  }
  return getStoredBlogPosts();
}

/**
 * Creates a new blog post in the server database (Admin authorized)
 */
export async function createRemoteBlogPost(
  postData: Partial<BlogPost>,
  adminPassword?: string
): Promise<{ success: boolean; post?: BlogPost; message?: string }> {
  try {
    const res = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword || ''
      },
      body: JSON.stringify(postData)
    });

    const data = await res.json();
    if (res.ok && data.success && data.post) {
      const current = getStoredBlogPosts();
      saveBlogPosts([data.post, ...current.filter(p => p.id !== data.post.id)]);
      return { success: true, post: data.post, message: data.message };
    }
    return { success: false, message: data.message || 'خطا در ثبت مقاله در سرور' };
  } catch (err: any) {
    console.warn('[Blog API] Server post failed, saving locally:', err);
    return { success: false, message: 'عدم ارتباط با سرور، عملیات به صورت محلی انجام شد.' };
  }
}

/**
 * Updates an existing blog post in the server database (Admin authorized)
 */
export async function updateRemoteBlogPost(
  id: string,
  postData: Partial<BlogPost>,
  adminPassword?: string
): Promise<{ success: boolean; post?: BlogPost; message?: string }> {
  try {
    const res = await fetch(`/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword || ''
      },
      body: JSON.stringify(postData)
    });

    const data = await res.json();
    if (res.ok && data.success && data.post) {
      const current = getStoredBlogPosts();
      saveBlogPosts(current.map(p => p.id === id ? data.post : p));
      return { success: true, post: data.post, message: data.message };
    }
    return { success: false, message: data.message || 'خطا در ویرایش مقاله در سرور' };
  } catch (err: any) {
    console.warn('[Blog API] Server update failed:', err);
    return { success: false, message: 'عدم ارتباط با سرور' };
  }
}

/**
 * Deletes a blog post from the server database (Admin authorized)
 */
export async function deleteRemoteBlogPost(
  id: string,
  adminPassword?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/blog/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword || ''
      }
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const current = getStoredBlogPosts();
      saveBlogPosts(current.filter(p => p.id !== id));
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || 'خطا در حذف مقاله از سرور' };
  } catch (err: any) {
    console.warn('[Blog API] Server delete failed:', err);
    return { success: false, message: 'عدم ارتباط با سرور' };
  }
}

/**
 * Resets the server database to the initial scholarly articles (Admin authorized)
 */
export async function resetRemoteBlogPosts(
  adminPassword?: string
): Promise<{ success: boolean; posts?: BlogPost[]; message?: string }> {
  try {
    const res = await fetch('/api/blog/reset', {
      method: 'POST',
      headers: {
        'x-admin-password': adminPassword || ''
      }
    });

    const data = await res.json();
    if (res.ok && data.success && data.posts) {
      saveBlogPosts(data.posts);
      return { success: true, posts: data.posts, message: data.message };
    }
  } catch (err) {
    console.warn('[Blog API] Server reset failed:', err);
  }
  const fallback = resetBlogPostsToDefault();
  return { success: true, posts: fallback, message: 'مقالات به صورت محلی بازنشانی شدند.' };
}
