import { isAdmin, json, type PagesHandler } from '../../_shared/blogStore';

export const onRequestPost: PagesHandler = ({ request, env }) => {
  if (!env.MODIRIAT_ADMIN?.trim()) {
    return json({
      success: false,
      message: 'متغیر محیطی MODIRIAT_ADMIN در تنظیمات Cloudflare تعریف نشده است.'
    }, 403);
  }

  return isAdmin(request, env)
    ? json({ success: true, message: 'احراز هویت مدیریت موفقیت‌آمیز بود.' })
    : json({ success: false, message: 'کلمه عبور امنیتی مدیریت نادرست است.' }, 401);
};
