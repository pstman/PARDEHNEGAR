/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ScholarlyTreatiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScholarlyTreatiseModal: React.FC<ScholarlyTreatiseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-persian" dir="rtl">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-parchment-texture border-2 border-[#594234] rounded-xl shadow-2xl p-6 sm:p-8 text-[#3D2B1F] text-right">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#EAD9BA] hover:bg-[#781D22] text-[#3D2B1F] hover:text-white transition font-bold text-lg border border-[#594234]/50"
          aria-label="بستن رساله پژوهشی"
        >
          ×
        </button>

        {/* Treatise Title Lockup */}
        <div className="text-center border-b border-[#781D22]/30 pb-5">
          <div className="text-xs uppercase tracking-widest font-bold text-[#781D22]">
            رساله آکادمیک اتنوموزیکولوژی • نسخه پژوهشی
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#781D22] mt-1">
            پیوستار آکوستیک: از فلات ایران تا حوضه دانوب
          </h2>
          <p className="text-sm italic text-[#594234] mt-1">
            بررسی سیر تاریخی، فواصل میکروتنال (ریزپرده‌ها)، اوزان لنگ و ارگانولوژی سازها
          </p>
          <div className="text-xs text-[#6B5344] mt-2">
            در حقیقت یکتایی وتر • آکادمی پژوهش‌های موسیقایی ایران و دانوب
          </div>
        </div>

        {/* Multi-chapter Academic Essay */}
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-[#2C221C]">
          {/* Chapter 1: Dimitrie Cantemir */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-[#781D22]">
              فصل اول: شاهزاده دیمیتری کانتمیر (کانتمیر اوغلو)؛ پل پیونددهنده
            </h3>
            <p>
              در اواخر سده هفدهم و اوایل سده هجدهم میلادی، دربار قسطنطنیه (استانبول) شاهد نبوغ شاهزاده‌ای از دیار مولداوی در حوضه دانوب بود: <strong>دیمیتری کانتمیر (۱۶۷۳–۱۷۲۳ میلادی)</strong>. کانتمیر که در نواختن تنبور دسته‌بلند استادی یگانه بود، رپرتوار کلاسیک سرای عثمانی را فراگرفت و کتاب نامدار <em>«کتاب علم الموسیقی»</em> را نگاشت. او با ابداع یک خط نت‌نگاری الفبایی منحصربه‌فرد، بیش از ۳۵۰ پیشرو و سماعی درباری را از گزند فراموشی ابدی نجات داد.
            </p>
            <p>
              هنگامی که کانتمیر به عنوان حاکم مولداوی به شهر یاش بازگشت، این مبانی تئوریک دقیق در باب فواصل کما و مدولاسیون‌های مقامی را با خود به حوضه دانوب آورد؛ جایی که خنیاگران بومی و کولی (لوتاری‌ها) این مقامات را با نغمه‌های چوپانی و آوازهای سوزناک رومانی درآمیختند.
            </p>
          </section>

          {/* Chapter 2: The Romani Lăutari */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-[#781D22]">
              فصل دوم: مهاجرت خنیاگران روما و اصناف موروثی لوتاری
            </h3>
            <p>
              شاهراه مهاجرت تاریخی اقوام روما (کولی‌ها) از شمال غرب هندوستان، خراسان و فلات ایران، با گذر از آناتولی به شاهزاده‌نشین‌های والاچیا و مولداوی در رومانی، یکی از شگفت‌انگیزترین کانال‌های انتقال صوتی تاریخ بشر به شمار می‌آید.
            </p>
            <p>
              در رومانی، خنیاگران موروثی اصناف «لوتاری» (برگرفته از واژه لئوتا یا عود/بربط) را تشکیل دادند. آنان فواصل حزن‌انگیز ریزپرده‌ای، آوازهای سیال بدون متر (parlando-rubato) و تحریرهای غنی موسیقی ایرانی و عثمانی را در بدنه سازهایی چون ویلن، کوبزا و تسامبال زنده نگه داشتند. تکامل سنتور ذوزنقه‌ای ایرانی به تسامبال کنسرتی رومانی، نیروی محرکه رقص‌های تند و پرشور لوتاری و نوحه‌های دوئینا را به وجود آورد.
            </p>
          </section>

          {/* Chapter 3: The Scythian-Alanic Pastoral Substratum */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-[#781D22]">
              فصل سوم: ریشه‌های کهن استپ‌های سکایی و پیوند با دوئینا
            </h3>
            <p>
              بسیار پیش از دوران عثمانی، اقوام کوچ‌نشین ایرانی‌زبان سکایی، سرمتی و آلانی از استپ‌های شمال دریای سیاه به جلگه‌های پایین‌دست دانوب مهاجرت نمودند. اتنوموزیکولوگ‌های برجسته‌ای نظیر بلا بارتوک و کنستانتین برائیلویو تصریح کرده‌اند که نغمه‌های باستانی «هورای دراز» در منطقه مارامورش و آواز سوزناک «دوئینا» در کوهستان کارپات، انطباق‌های ساختاری شگفت‌آوری با آوازهای دستگاهی ایران، آواز حیران کردی و ردیف کهن دارند: فواصل لغزان ریزپرده‌ای، نوای فلوت‌های استخوانی و چوبی کاوال، و فرودهای مالیخولیایی.
            </p>
          </section>

          {/* Chapter 4: Comparative Microtonal Matrix */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-[#781D22]">
              فصل چهارم: جدول تطبیقی فواصل و ریزپرده‌های پیوستار
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[#594234]/40 bg-[#EDE0C8]">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-[#DECAAA] border-b border-[#594234]/40 text-[#781D22] font-bold">
                    <th className="p-2.5">سنت موسیقایی</th>
                    <th className="p-2.5">ریزپرده شاخص</th>
                    <th className="p-2.5">انحراف به سِنت (Cent)</th>
                    <th className="p-2.5">نقش آکوستیک و زیبایی‌شناسی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#594234]/20">
                  <tr>
                    <td className="p-2.5 font-bold text-[#781D22]">ردیف موسیقی دستگاهی ایران (دستگاه شور)</td>
                    <td className="p-2.5">کُرُن (𝄲 / 𝄫)</td>
                    <td className="p-2.5 font-mono">۵۰- سنت</td>
                    <td className="p-2.5">دوم خنثی؛ هسته عاطفی و احساس سوزناک دستگاه شور و آواز دشتی</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#1E555C]">مقام عثمانی (راست و سه‌گاه)</td>
                    <td className="p-2.5">کمای هولدرین (Koma)</td>
                    <td className="p-2.5 font-mono">۲۲.۶- سنت</td>
                    <td className="p-2.5">یک‌نهم پرده کامل در تقسیمات ۵۳ قسمتی؛ طنین عرفانی آیین سماع مولویه</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#3D2B1F]">سرودخوانی بیزانسی (اکوس دوم)</td>
                    <td className="p-2.5">کروماتیک نرم</td>
                    <td className="p-2.5 font-mono">۳۳+ سنت</td>
                    <td className="p-2.5">کشش صوتی حنجره در برابر واخوان مداوم و ثابت ایسون</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#8B2635]">دوئینای کارپات و لوتاری (رومانی)</td>
                    <td className="p-2.5">چهارم افزوده آکوستیک لیدیایی</td>
                    <td className="p-2.5 font-mono">۳۵+ / ۶۰۰+ سنت</td>
                    <td className="p-2.5">چهارم افزوده لیدیایی و ناله‌های لغزنده ریزپرده‌ای بر ویلن و کاوال</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer Bibliography */}
        <div className="mt-6 pt-4 border-t border-[#781D22]/20 text-xs text-[#6B5344]">
          <strong>منابع و ماخذ:</strong> دیمیتری کانتمیر، <em>کتاب علم الموسیقی</em> (حدود ۱۷۰۰ میلادی)؛ کنستانتین برائیلویو، <em>ریتم آکساک</em> (پاریس، ۱۹۵۱)؛ بلا بارتوک، <em>موسیقی محلی رومانیایی</em> (۱۹۶۷)؛ هرمز فرهت، <em>مفهوم دستگاه در موسیقی ایرانی</em> (کمبریج، ۱۹۹۰).
        </div>
      </div>
    </div>
  );
};
