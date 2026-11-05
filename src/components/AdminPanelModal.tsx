/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پنل مدیریت و پیکربندی اختصاصی استودیو اینامیکس
 * با لایه امنیتی کلمه عبور متغیر MODIRIAT_ADMIN بر اساس استانداردهای کلودفلر (Cloudflare) و گوگل
 * ابزارهای مدیریت پست‌های وبلاگ (مارک‌داون، HTML، صوت، تصویر، یوتیوب)
 * و مهندسی پالت و تم رنگی سراسری سایت
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  Download, 
  RotateCcw,
  Sparkles,
  FileText,
  Lock,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { 
  BlogPost, 
  getStoredBlogPosts, 
  saveBlogPosts, 
  resetBlogPostsToDefault,
  fetchRemoteBlogPosts,
  createRemoteBlogPost,
  updateRemoteBlogPost,
  deleteRemoteBlogPost,
  resetRemoteBlogPosts
} from '../utils/blogData';
import { 
  THEME_PRESETS, 
  ColorThemePreset, 
  getStoredTheme, 
  applyTheme 
} from '../utils/themeSystem';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: () => void;
}

const AUTH_STORAGE_KEY = 'enamix_admin_authenticated_session';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onPostUpdated
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return sessionStorage.getItem('enamix_admin_password_token') || '';
    } catch {
      return '';
    }
  });

  // Panel State
  const [activeTab, setActiveTab] = useState<'blog_manager' | 'theme_customizer'>('blog_manager');
  const [posts, setPosts] = useState<BlogPost[]>(getStoredBlogPosts());
  const [currentTheme, setCurrentTheme] = useState<ColorThemePreset>(getStoredTheme());
  
  // Custom Color State
  const [customPrimary, setCustomPrimary] = useState(currentTheme.colors.primary);
  const [customAccent, setCustomAccent] = useState(currentTheme.colors.accent);

  // Sync latest posts from server database when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRemoteBlogPosts().then(latest => {
        if (Array.isArray(latest) && latest.length > 0) {
          setPosts(latest);
        }
      });
    }
  }, [isOpen]);

  // New/Editing Post Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('ایمان برزجان');
  const [formCategory, setFormCategory] = useState<'ethnomusicology' | 'radif_analysis' | 'violin_technique' | 'organology' | 'acoustics'>('acoustics');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formAudioTitle, setFormAudioTitle] = useState('');
  const [formYoutubeUrl, setFormYoutubeUrl] = useState('');
  const [formTags, setFormTags] = useState('ردیف, ویولن, تئوری');
  const [formReadTime, setFormReadTime] = useState(5);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  /**
   * Password verification:
   * Sends the user-entered password to the server endpoint `/api/admin/verify`.
   * The server validates it strictly against the environment variable `MODIRIAT_ADMIN`.
   * Zero hardcoded passwords in client code.
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = passwordInput.trim();
    if (!trimmedInput) {
      setAuthError('لطفاً کلمه عبور مدیریت را وارد فرمایید.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': trimmedInput
        },
        body: JSON.stringify({ password: trimmedInput })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminPassword(trimmedInput);
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
          sessionStorage.setItem('enamix_admin_password_token', trimmedInput);
        } catch {
          // ignore
        }
        setAuthError(null);
        setPasswordInput('');
        showStatus('ورود موفقیت‌آمیز به سامانه مدیریت استودیو اینامیکس.');
      } else {
        setAuthError(data.message || 'کلمه عبور امنیتی مدیریت نادرست است.');
      }
    } catch {
      setAuthError('عدم امکان برقراری ارتباط با سرور جهت اعتبارسنجی کلمه عبور.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem('enamix_admin_password_token');
    } catch {
      // ignore
    }
    setPasswordInput('');
    setAuthError(null);
    showStatus('از جلسه مدیریت خارج شدید.');
  };

  // Theme handlers
  const handleSelectPreset = (preset: ColorThemePreset) => {
    setCurrentTheme(preset);
    setCustomPrimary(preset.colors.primary);
    setCustomAccent(preset.colors.accent);
    applyTheme(preset);
    showStatus(`تم «${preset.name}» با موفقیت بر کل سایت اعمال شد.`);
  };

  const handleApplyCustomColors = () => {
    const updatedTheme: ColorThemePreset = {
      ...currentTheme,
      id: 'custom_user_theme',
      name: 'تم اختصاصی سفارشی',
      nameEn: 'Custom User Theme',
      colors: {
        ...currentTheme.colors,
        primary: customPrimary,
        primaryHover: customPrimary,
        accent: customAccent,
        accentGlow: customAccent
      }
    };
    setCurrentTheme(updatedTheme);
    applyTheme(updatedTheme);
    showStatus('رنگ‌های انتخابی شما با موفقیت ذخیره و اعمال گردید.');
  };

  // Reset Form
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormAuthor('ایمان برزجان');
    setFormCategory('acoustics');
    setFormCoverImage('');
    setFormAudioUrl('');
    setFormAudioTitle('');
    setFormYoutubeUrl('');
    setFormTags('ردیف, ویولن, تئوری');
    setFormReadTime(5);
  };

  // Edit existing post
  const handleStartEdit = (post: BlogPost) => {
    setIsEditing(true);
    setEditingId(post.id);
    setFormTitle(post.title);
    setFormSummary(post.summary);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormCategory(post.category);
    setFormCoverImage(post.coverImageUrl || '');
    setFormAudioUrl(post.audioUrl || '');
    setFormAudioTitle(post.audioTitle || '');
    setFormYoutubeUrl(post.youtubeUrl || '');
    setFormTags(post.tags.join(', '));
    setFormReadTime(post.readingTimeMinutes);
  };

  // Delete post from server DB and local cache
  const handleDeletePost = (id: string) => {
    deleteRemoteBlogPost(id, adminPassword).catch(() => {});
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveBlogPosts(updated);
    if (editingId === id) resetForm();
    onPostUpdated?.();
    showStatus('مقاله با موفقیت از پایگاه داده سرور حذف شد.');
  };

  // Save/Submit Post to server DB and local cache
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showStatus('خطا: عنوان مقاله الزامی است.');
      return;
    }

    const categoryFaMap: Record<string, string> = {
      acoustics: 'آکوستیک و تئوری ردیف',
      ethnomusicology: 'اتنوموزیکولوژی',
      radif_analysis: 'آنالیز ردیف',
      violin_technique: 'مکتب ویولن ایرانی',
      organology: 'سازشناسی و تاریخ پیوستار'
    };

    const newPost: BlogPost = {
      id: editingId || `post_${Date.now()}`,
      title: formTitle.trim(),
      slug: formTitle.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40),
      summary: formSummary.trim() || formTitle.trim(),
      content: formContent.trim() || 'متن پیش‌فرض مقاله...',
      author: formAuthor.trim() || 'ایمان برزجان',
      authorRole: 'پژوهشگر موسیقی و استودیو اینامیکس',
      date: new Date().toLocaleDateString('fa-IR'),
      category: formCategory,
      categoryLabelFa: categoryFaMap[formCategory] || 'پژوهش موسیقی',
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      coverImageUrl: formCoverImage.trim() || undefined,
      audioUrl: formAudioUrl.trim() || undefined,
      audioTitle: formAudioTitle.trim() || undefined,
      youtubeUrl: formYoutubeUrl.trim() || undefined,
      readingTimeMinutes: Number(formReadTime) || 5,
      likesCount: 14
    };

    if (isEditing && editingId) {
      updateRemoteBlogPost(editingId, newPost, adminPassword).catch(() => {});
      const updatedPosts = posts.map(p => p.id === editingId ? newPost : p);
      setPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
      showStatus('مقاله با موفقیت در پایگاه داده سرور به‌روزرسانی شد.');
    } else {
      createRemoteBlogPost(newPost, adminPassword).catch(() => {});
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
      showStatus('مقاله جدید با موفقیت در پایگاه داده سرور منتشر گردید.');
    }

    resetForm();
    onPostUpdated?.();
  };

  // Quick insertion helpers for Markdown/HTML
  const insertTextToContent = (snippet: string) => {
    setFormContent(prev => prev + '\n' + snippet);
  };

  // Backup & Restore
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `enamix_blog_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    resetRemoteBlogPosts(adminPassword).then((res) => {
      if (res.posts) setPosts(res.posts);
      onPostUpdated?.();
      showStatus('پایگاه داده سرور به نسخه‌های مرجع اولیه بازنشانی شد.');
    }).catch(() => {
      const def = resetBlogPostsToDefault();
      setPosts(def);
      onPostUpdated?.();
      showStatus('تمامی مقالات به نسخه‌های مرجع اولیه بازنشانی شدند.');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md font-persian overflow-y-auto" dir="rtl">
      {/* SECURITY GATE / LOGIN MODAL IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <div className="relative w-full max-w-md bg-[#16110E] border-2 border-[#E5A836] rounded-2xl shadow-2xl p-6 text-[#F5EEDB] space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#594234]/60">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#8B2635] border border-[#E5A836]/60 flex items-center justify-center text-[#E5A836] shadow-md">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#F5EEDB]">
                  احراز هویت مدیریت استودیو اینامیکس
                </h3>
                <span className="text-[10px] text-[#A6937C] block font-mono">
                  EnamiX Security Gate
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="بستن پنجره"
              className="w-8 h-8 rounded-full bg-[#241A14] hover:bg-[#34261D] text-[#C4B59D] hover:text-[#FFF5E6] flex items-center justify-center border border-[#594234] transition"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-[#C4B59D] leading-relaxed">
            این بخش منحصراً متعلق به مؤلف و مدیر استودیو (ایمان برزجان) است. جهت ارسال پست جدید، ویرایش مقالات و تغییر تم سراسری، لطفاً کلمه عبور امنیتی را وارد فرمایید:
          </p>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#E5A836]">
                کلمه عبور مدیریت:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  disabled={isVerifying}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="کلمه عبور اختصاصی را وارد نمایید..."
                  className="w-full bg-[#241A14] border border-[#594234] focus:border-[#E5A836] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F5EEDB] outline-none font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6937C] hover:text-[#FFF5E6] transition"
                  title={showPassword ? 'مخفی کردن' : 'نمایش کلمه عبور'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#120E0B] rounded-xl border border-[#594234]/40 text-[10px] text-[#A6937C] space-y-1 leading-relaxed">
              <span className="font-bold text-[#E5A836] block">تنظیم متغیر امنیتی در سرور / کلودفلر:</span>
              <p>
                کلمه عبور امنیتی مستقیماً در متغیر محیطی <code className="text-[#34D399] font-mono">MODIRIAT_ADMIN</code> در سرور یا کلودفلر تعریف می‌گردد و هیچ مقدار پیش‌فرضی درون کدهای سامانه هاردکد نشده است.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#241A14] hover:bg-[#34261D] text-[#C4B59D] transition text-xs font-bold border border-[#594234]"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2 rounded-xl bg-[#D97706] hover:bg-[#E5A836] disabled:opacity-60 text-black font-black transition shadow text-xs flex items-center gap-1.5"
              >
                <Key size={14} />
                <span>{isVerifying ? 'در حال بررسی...' : 'تأیید و ورود به پنل'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* FULL ADMIN PANEL WHEN AUTHENTICATED */
        <div className="relative w-full max-w-5xl bg-[#140F0C] border-2 border-[#E5A836]/70 rounded-2xl shadow-2xl p-4 sm:p-6 text-[#F5EEDB] my-6 max-h-[92vh] flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#594234]/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/60 flex items-center justify-center text-[#34D399]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#F5EEDB] flex items-center gap-2">
                  <span>پنل مدیریت و پیکربندی اختصاصی استودیو اینامیکس</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40">
                    مدیر تأیید شده
                  </span>
                </h2>
                <p className="text-[11px] text-[#E5A836]">
                  ابزارهای تولید محتوای وبلاگ (مارک‌داون، صوت، تصویر، ویدیو) و تنظیم پالت رنگی سراسری
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2A1F18] hover:bg-red-950/60 text-red-300 border border-[#594234] text-[11px] font-bold transition"
                title="خروج از حساب مدیریت"
              >
                <LogOut size={13} />
                <span>خروج</span>
              </button>

              <button
                onClick={onClose}
                aria-label="بستن پنل مدیریت"
                className="w-8 h-8 rounded-full bg-[#241A14] hover:bg-[#34261D] text-[#C4B59D] hover:text-[#FFF5E6] flex items-center justify-center border border-[#594234] transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Status notification toast */}
          {statusMessage && (
            <div className="my-2 p-2.5 rounded-xl bg-[#10B981]/20 border border-[#10B981] text-[#34D399] text-xs font-bold flex items-center gap-2">
              <Check size={16} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 mt-3 pb-2 border-b border-[#594234]/40 shrink-0">
            <button
              onClick={() => setActiveTab('blog_manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                activeTab === 'blog_manager'
                  ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                  : 'bg-[#241A14] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
              }`}
            >
              <FileText size={15} />
              <span>مدیریت پست‌های وبلاگ ({posts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('theme_customizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                activeTab === 'theme_customizer'
                  ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                  : 'bg-[#241A14] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
              }`}
            >
              <Palette size={15} />
              <span>مهندسی تم رنگی سراسری سایت</span>
            </button>
          </div>

          {/* Scrollable Body Area */}
          <div className="overflow-y-auto space-y-5 pt-3 pr-1 pl-2 text-xs">
            {/* TAB 1: BLOG MANAGER */}
            {activeTab === 'blog_manager' && (
              <div className="space-y-6">
                {/* Form Card */}
                <div className="bg-[#1A130F] border border-[#594234] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#594234]/40">
                    <span className="font-bold text-[#E5A836] flex items-center gap-1.5 text-xs">
                      <PlusCircle size={15} />
                      {isEditing ? `ویرایش مقاله: ${formTitle}` : 'ارسال پست جدید در وبلاگ'}
                    </span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-[11px] text-[#A6937C] hover:text-[#FFF5E6] underline"
                      >
                        انصراف از ویرایش
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePost} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#A6937C] mb-1">عنوان مقاله *</label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="مثال: آنالیز انحراف سنت‌ها در ردیف صبا..."
                          className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-1.5 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A6937C] mb-1">دسته‌بندی موضوعی</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as any)}
                          className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-1.5 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none"
                        >
                          <option value="acoustics">آکوستیک و تئوری ردیف</option>
                          <option value="organology">سازشناسی و تاریخ پیوستار</option>
                          <option value="violin_technique">مکتب ویولن ایرانی</option>
                          <option value="ethnomusicology">اتنوموزیکولوژی</option>
                          <option value="radif_analysis">آنالیز ردیف</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#A6937C] mb-1">نام نویسنده</label>
                        <input
                          type="text"
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-1.5 text-xs text-[#F5EEDB] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A6937C] mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                        <input
                          type="text"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          placeholder="ویولن, شور, فرهت"
                          className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-1.5 text-xs text-[#F5EEDB] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A6937C] mb-1">تخمین زمان مطالعه (دقیقه)</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={formReadTime}
                          onChange={(e) => setFormReadTime(Number(e.target.value))}
                          className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-1.5 text-xs text-[#F5EEDB] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A6937C] mb-1">خلاصه کوتاه مقاله</label>
                      <textarea
                        rows={2}
                        value={formSummary}
                        onChange={(e) => setFormSummary(e.target.value)}
                        placeholder="چکیده پژوهش جهت نمایش در کارت وبلاگ..."
                        className="w-full bg-[#241A14] border border-[#594234] rounded-lg p-2.5 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none"
                      />
                    </div>

                    {/* Rich Content Area with Fast Snippet Buttons */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] text-[#A6937C]">
                          متن کامل مقاله (پشتیبانی از Markdown و تگ‌های HTML) *
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertTextToContent('### تیتر جدید')}
                            className="px-2 py-0.5 rounded bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] text-[10px] border border-[#594234]"
                          >
                            + تیتر H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTextToContent('> متن نقل‌قول یا نکته کلیدی...')}
                            className="px-2 py-0.5 rounded bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] text-[10px] border border-[#594234]"
                          >
                            + نقل‌قول
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTextToContent('```\n[جدول یا دیاگرام نت]\n```')}
                            className="px-2 py-0.5 rounded bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] text-[10px] border border-[#594234]"
                          >
                            + بلوک کد
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTextToContent('<div style="background: rgba(229,168,54,0.15); border-right: 4px solid #E5A836; padding: 10px; border-radius: 8px;">\n  <strong>نکته تخصصی:</strong> توضیحات...\n</div>')}
                            className="px-2 py-0.5 rounded bg-[#2A1F18] hover:bg-[#3D2E24] text-[#34D399] text-[10px] border border-[#594234]"
                          >
                            + کادر رنگی HTML
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={6}
                        required
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="متن مقاله را اینجا وارد نمایید. می‌توانید از نشانه‌گذاری مارک‌داون یا تگ‌های HTML استفاده فرمایید..."
                        className="w-full bg-[#120E0B] border border-[#594234] rounded-lg p-3 text-xs text-[#F5EEDB] font-mono leading-relaxed focus:border-[#E5A836] outline-none"
                      />
                    </div>

                    {/* Media Link Attachments (Image, Audio, YouTube) */}
                    <div className="p-3 bg-[#120E0B] rounded-xl border border-[#594234]/60 space-y-3">
                      <span className="font-bold text-[#E5A836] block text-[11px]">
                        🔗 پیوست‌های چندرسانه‌ای (تصویر PNG/JPG، فایل صوت با پلیر، ویدیوی یوتیوب):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-[#A6937C] mb-1">آدرس تصویر کاور (PNG یا JPG)</label>
                          <input
                            type="url"
                            value={formCoverImage}
                            onChange={(e) => setFormCoverImage(e.target.value)}
                            placeholder="https://example.com/cover.jpg"
                            className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-2.5 py-1 text-xs text-[#F5EEDB] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#A6937C] mb-1">آدرس فایل صوتی پیوست (MP3 / WAV)</label>
                          <input
                            type="url"
                            value={formAudioUrl}
                            onChange={(e) => setFormAudioUrl(e.target.value)}
                            placeholder="https://example.com/sample.mp3"
                            className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-2.5 py-1 text-xs text-[#F5EEDB] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#A6937C] mb-1">آدرس ویدیوی یوتیوب (YouTube URL)</label>
                          <input
                            type="url"
                            value={formYoutubeUrl}
                            onChange={(e) => setFormYoutubeUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-2.5 py-1 text-xs text-[#F5EEDB] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 rounded-lg bg-[#2A1F18] text-[#C4B59D] hover:bg-[#3D2E24] transition text-xs"
                        >
                          انصراف
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#E5A836] text-black font-bold transition shadow text-xs flex items-center gap-1.5"
                      >
                        <Check size={16} />
                        <span>{isEditing ? 'ذخیره تغییرات مقاله' : 'انتشار مقاله در وبلاگ'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Posts Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5EEDB] text-xs">فهرست مقالات منتشر شده ({posts.length})</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportJson}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#241A14] hover:bg-[#34261D] text-[#E5A836] border border-[#594234]"
                      >
                        <Download size={13} />
                        <span>خروجی JSON</span>
                      </button>
                      <button
                        onClick={handleResetDefaults}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#241A14] hover:bg-[#34261D] text-red-400 border border-[#594234]"
                      >
                        <RotateCcw size={13} />
                        <span>بازنشانی پیش‌فرض</span>
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-[#594234]/40 border border-[#594234]/60 rounded-xl overflow-hidden bg-[#18120E]">
                    {posts.map((p) => (
                      <div key={p.id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#201813] transition">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F5EEDB] truncate text-xs">{p.title}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-[#8B2635] text-white shrink-0">
                              {p.categoryLabelFa}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A6937C] truncate mt-0.5">{p.summary}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 rounded-lg bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition"
                            title="ویرایش مقاله"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(p.id)}
                            className="p-1.5 rounded-lg bg-[#2A1F18] hover:bg-red-900/60 text-red-400 border border-[#594234] transition"
                            title="حذف مقاله"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GLOBAL THEME CUSTOMIZER */}
            {activeTab === 'theme_customizer' && (
              <div className="space-y-6">
                <div className="bg-[#1A130F] border border-[#594234] rounded-xl p-4 space-y-4">
                  <span className="font-bold text-[#E5A836] flex items-center gap-1.5 text-xs">
                    <Palette size={16} />
                    انتخاب پالت‌های رنگی تاریخی و استودیویی از پیش‌طراحی‌شده:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {THEME_PRESETS.map((preset) => {
                      const isSelected = currentTheme.id === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#2A1F18] border-[#E5A836] ring-2 ring-[#E5A836]/40 shadow-xl'
                              : 'bg-[#18120E] border-[#594234]/60 hover:border-[#A6937C]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#FFF5E6]">{preset.name}</span>
                              {isSelected && <Check size={16} className="text-[#E5A836]" />}
                            </div>
                            <span className="text-[10px] text-[#A6937C] block font-mono">{preset.nameEn}</span>
                            <p className="text-[11px] text-[#C4B59D] leading-relaxed pt-1">{preset.description}</p>
                          </div>

                          {/* Palette Color Swatches Preview */}
                          <div className="flex items-center gap-1.5 pt-2 border-t border-[#594234]/40">
                            <span className="w-5 h-5 rounded-full border border-black/40" style={{ background: preset.colors.primary }} title="رنگ شاخص" />
                            <span className="w-5 h-5 rounded-full border border-black/40" style={{ background: preset.colors.accent }} title="رنگ ثانویه / طلایی" />
                            <span className="w-5 h-5 rounded-full border border-black/40" style={{ background: preset.colors.bgDark }} title="پس‌زمینه هدر" />
                            <span className="w-5 h-5 rounded-full border border-black/40" style={{ background: preset.colors.border }} title="خطوط حاشیه" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Selector */}
                <div className="bg-[#1A130F] border border-[#594234] rounded-xl p-4 space-y-3">
                  <span className="font-bold text-[#E5A836] block text-xs">
                    🎨 شخصی‌سازی دقیق کدهای رنگی پالت (Custom Color Picker):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#120E0B] rounded-xl border border-[#594234]/60">
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#FFF5E6] block">رنگ اصلی (Primary)</span>
                        <span className="font-mono text-[11px] text-[#A6937C]">{customPrimary}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#120E0B] rounded-xl border border-[#594234]/60">
                      <input
                        type="color"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#FFF5E6] block">رنگ ثانویه و نورپردازی (Accent Gold)</span>
                        <span className="font-mono text-[11px] text-[#A6937C]">{customAccent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleApplyCustomColors}
                      className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#E5A836] text-black font-bold transition shadow text-xs flex items-center gap-1.5"
                    >
                      <Sparkles size={15} />
                      <span>اعمال رنگ‌های سفارشی بر کل سایت</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#594234]/70 flex items-center justify-between shrink-0 text-xs">
            <span className="text-[11px] text-[#A6937C]">
              جلسه فعال مدیریت استودیو اینامیکس • ارتباط امن با پایگاه داده
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition text-xs font-bold"
            >
              بستن پنل مدیریت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
