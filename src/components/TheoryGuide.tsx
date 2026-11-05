/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • دانشنامه جامع نظری، جداول مرجع ردیف و تئوری موسیقی
 * متون و جداول علمی تألیف‌شده توسط ایمان برزجان با نظارت علمی و هنری استاد بابک بختیاری
 */

import React, { useState } from 'react';

interface TheoryGuideProps {
  onOpenTreatise?: () => void;
}

export const TheoryGuide: React.FC<TheoryGuideProps> = ({ onOpenTreatise }) => {
  const [activeTab, setActiveTab] = useState<'persian' | 'classical' | 'bibliography'>('persian');

  return (
    <div className="w-full bg-[#181310] rounded-2xl border border-[#594234]/70 p-5 sm:p-7 shadow-2xl space-y-6 font-persian" dir="rtl">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#594234]/40 pb-4">
        <div>
          <h2 className="text-xl font-black text-[#F5EEDB]">
            دانشنامه جامع پرده‌نگار • تئوری بنیادین، جداول مرجع و کتاب‌شناسی
          </h2>
          <p className="text-xs text-[#C4B59D]">
            پژوهش و تدوین: ایمان برزجان | ناشر: استودیو اینامیکس (EnamiX) | با نظارت علمی و هنری: استاد بابک بختیاری
          </p>
        </div>

        {/* Tab switchers and Quick Open Treatise */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenTreatise && (
            <button
              onClick={onOpenTreatise}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition bg-[#D97706] hover:bg-[#E5A836] text-black font-black flex items-center gap-1 shadow"
            >
              <span>📖</span>
              <span>مطالعه رساله و دانلود PDFها</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('persian')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
              activeTab === 'persian'
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                : 'bg-[#2A201A] text-[#C4B59D] border-[#594234] hover:bg-[#3D2E24]'
            }`}
          >
            🇮🇷 ردیف ۱۲ دستگاه و ویولن ایران
          </button>

          <button
            onClick={() => setActiveTab('classical')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
              activeTab === 'classical'
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                : 'bg-[#2A201A] text-[#C4B59D] border-[#594234] hover:bg-[#3D2E24]'
            }`}
          >
            🎼 گام‌های دیاتونیک، آن‌هارمونیک و دایره پنجم‌ها
          </button>

          <button
            onClick={() => setActiveTab('bibliography')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
              activeTab === 'bibliography'
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                : 'bg-[#2A201A] text-[#C4B59D] border-[#594234] hover:bg-[#3D2E24]'
            }`}
          >
            📚 کتاب‌شناسی و مکتب استاد یاحقی
          </button>
        </div>
      </div>

      {/* Persian Tab */}
      {activeTab === 'persian' && (
        <div className="space-y-6 text-[#EDE0C8] text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۱. شاکله جامع ۱۲ دستگاه و آواز ردیف ویولن ایران
            </h3>
            <p className="text-xs sm:text-sm text-[#C4B59D]">
              سامانه <strong>«پرده‌نگار»</strong> با نظارت علمی و هنری <strong>استاد بابک بختیاری</strong> و پدیدآوری <strong>ایمان برزجان</strong>، تمامی ۱۲ مقام رسمی ردیف ویولن ایران را بر مبنای اصل پایستگی خطابه نوت، گردش ملودی اصیل و کوک‌های دقیق ۴ سیم ساز (به ترتیب از سیم ۱ زیر به سیم ۴ بم) ساماندهی کرده است.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۲. تفاوت بنیادین «درآمد» با «پیش‌درآمد» در مکتب موسیقی ایرانی
            </h3>
            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 text-xs sm:text-sm space-y-2">
              <p>
                <strong className="text-[#E5A836]">درآمد (Daramad):</strong> بخش آوازی (غیرمتریک) و نخستین گوشه هر دستگاه که دانگ، نوت شاهد و ایست دستگاه را برای گوش شنونده تثبیت می‌کند.
              </p>
              <p>
                <strong className="text-[#E5A836]">پیش‌درآمد (Pishdaramad):</strong> قطعه‌ای ضربی و باشکوه در ریتم‌های وقارآمیز نظیر ۶/۴ یا ۴/۴ سنگین که آهنگساز در آغاز برنامه اجرا کرده و از گوشه‌های مهم دستگاه عبور کرده و دوباره به درآمد فرود می‌آید. این فرم حاصل نبوغ استادان غلامحسین درویش‌خان و رکن‌الدین مختاری است.
              </p>
            </div>
          </div>

          {/* Section 3: Table of 12 Dastgahs */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۳. جدول مرجع کوک‌های ۴ سیم ویولن در ۱۲ دستگاه و آواز ردیف
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#594234]/60">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-[#2A201A] text-[#F5EEDB]">
                  <tr>
                    <th className="p-2.5 border-b border-[#594234]">دستگاه / آواز</th>
                    <th className="p-2.5 border-b border-[#594234]">سرکلید و علامات ترکیبی</th>
                    <th className="p-2.5 border-b border-[#594234]">کوک سیم‌ها (از ۱ زیر به ۴ بم)</th>
                    <th className="p-2.5 border-b border-[#594234]">شاهد / ایست</th>
                    <th className="p-2.5 border-b border-[#594234]">پیش‌درآمد و موتیف شاخص</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#594234]/40 bg-[#140F0C]">
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۱. دستگاه شور «لا»</td>
                    <td className="p-2.5">سی کُرن (B𝄳)</td>
                    <td className="p-2.5 font-mono text-[11px]">می - لا - رِ - سل<br/>رِ - لا - رِ - سل<br/>رِ - لا - لا - سل</td>
                    <td className="p-2.5">شاهد: لا (A4)<br/>ایست: لا (A4)</td>
                    <td className="p-2.5">پیش‌درآمد شور درویش‌خان / شهنازی</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۲. آواز دشتی «می»</td>
                    <td className="p-2.5">سی کُرن (B𝄳)</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - لا</td>
                    <td className="p-2.5">شاهد: لا (A4)<br/>ایست: می (E4)</td>
                    <td className="p-2.5">پیش‌درآمد دشتی موسی معروفی</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۳. آواز دشتی «سی»</td>
                    <td className="p-2.5">فا سُری (F𝄲)</td>
                    <td className="p-2.5 font-mono text-[11px]">می - لا - می - لا<br/>می - لا - سی - سل</td>
                    <td className="p-2.5">شاهد: می (E5)<br/>ایست: سی (B4)</td>
                    <td className="p-2.5">گردش دشتی در منطقه چپ‌کوک</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۴. آواز بیات اصفهان</td>
                    <td className="p-2.5">سی کُرن - دو دیز</td>
                    <td className="p-2.5 font-mono text-[11px]">می - لا - رِ - لا</td>
                    <td className="p-2.5">شاهد: رِ (D5)<br/>ایست: لا (A4)</td>
                    <td className="p-2.5">پیش‌درآمد اصفهان مرتضی نی‌داوود</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۵. دستگاه همایون</td>
                    <td className="p-2.5">سی کُرن - دو دیز</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - لا<br/>رِ - لا - سی کُرن - فا سُری</td>
                    <td className="p-2.5">شاهد: رِ (D5)<br/>ایست: لا (A4)</td>
                    <td className="p-2.5">پیش‌درآمد همایون رکن‌الدین مختاری</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۶. آواز بیات تُرک (زند)</td>
                    <td className="p-2.5">سی کُرن (B𝄳)</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - دو - سل</td>
                    <td className="p-2.5">شاهد: دو (C5)<br/>ایست: فا (F4)</td>
                    <td className="p-2.5">پیش‌درآمد بیات ترک درویش‌خان</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۷. آواز افشاری «رِ»</td>
                    <td className="p-2.5">سی کُرن (نوت متغیر: می)</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - سل</td>
                    <td className="p-2.5">شاهد: فا (F4)<br/>ایست: رِ (D4)</td>
                    <td className="p-2.5">گوشه قرایی: فا سُری | عراق: فا دیز و سی بمل</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۸. دستگاه سه‌گاه</td>
                    <td className="p-2.5">فا سُری - سی کُرن</td>
                    <td className="p-2.5 font-mono text-[11px]">می - لا - رِ - فا سُری</td>
                    <td className="p-2.5">شاهد و ایست: فا سُری / می</td>
                    <td className="p-2.5">پیش‌درآمد سه‌گاه رکن‌الدین مختاری</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۹. دستگاه چهارگاه «رِ»</td>
                    <td className="p-2.5">سی کُرن - دو دیز - می کُرن - فا دیز</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - لا</td>
                    <td className="p-2.5">شاهد و ایست: رِ (D4/D5)</td>
                    <td className="p-2.5">پیش‌درآمد حماسی چهارگاه درویش‌خان</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۱۰. دستگاه نوا «رِ»</td>
                    <td className="p-2.5">سی کُرن (B𝄳)</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - لا</td>
                    <td className="p-2.5">شاهد و ایست: رِ (D4)</td>
                    <td className="p-2.5">پیش‌درآمد متفکرانه نوا علی‌اکبر شهنازی</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۱۱. دستگاه راست‌پنجگاه</td>
                    <td className="p-2.5">فا دیز (F♯)</td>
                    <td className="p-2.5 font-mono text-[11px]">رِ - لا - رِ - سل</td>
                    <td className="p-2.5">شاهد: فا دیز / سل</td>
                    <td className="p-2.5">بستر پرده‌گردانی به تمام دستگاه‌ها</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">۱۲. دستگاه ماهور (سل و رِ)</td>
                    <td className="p-2.5">ماهور سل: فا دیز<br/>ماهور ر: فا دیز - دو دیز</td>
                    <td className="p-2.5 font-mono text-[11px]">ماهور سل: رِ - لا - رِ - سل<br/>ماهور چپ: می - لا - رِ - لا</td>
                    <td className="p-2.5">سل (G4) / رِ (D4)</td>
                    <td className="p-2.5">پیش‌درآمد ماهور درویش‌خان</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Classical Diatonic Tab */}
      {activeTab === 'classical' && (
        <div className="space-y-6 text-[#EDE0C8] text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۱. ساختار گام‌های دیاتونیک، کلاویه‌ها و چیدمان نوت‌های موسیقی
            </h3>
            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 text-xs sm:text-sm space-y-2">
              <p>پیانو از تکرار الگوی منظم ۱۲ نیم‌پرده‌ای در قالب اکتاوها تشکیل شده است:</p>
              <ul className="list-disc list-inside space-y-1 text-[#C4B59D]">
                <li><strong>کلاویه‌های سفید (نوت‌های طبیعی / Natural):</strong> C, D, E, F, G, A, B (دو، ر، می، فا، سل، لا، سی)</li>
                <li><strong>کلاویه‌های مشکی (نیم‌پرده‌های کروماتیک):</strong> C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, A♯/B♭</li>
                <li><strong>فرمول بنیادی گام‌های ماژور دیاتونیک:</strong> پرده - پرده - نیم‌پرده - پرده - پرده - پرده - نیم‌پرده (W-W-H-W-W-W-H)</li>
              </ul>
            </div>
          </div>

          {/* Section 2 & 3: Enharmonic laws */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۲. چرا برای «می دیز (#E)» و «سی دیز (#B)» کلاویه مشکی مجزا نداریم؟
            </h3>
            <p className="text-xs sm:text-sm text-[#C4B59D]">
              فاصله‌بندی کلاویه‌های پیانو مبتنی بر نیم‌پرده‌های فیزیکی صوت است. بین اکثر نوت‌های مجاور سفید (مانند Do تا Re یا Fa تا Sol) فاصله <strong>یک پرده کامل</strong> است و یک کلاویه مشکی میان آن‌ها نیم‌پرده را تأمین می‌کند. اما فاصله طبیعی بین دو نوت <strong>E تا F (می تا فا)</strong> و همچنین <strong>B تا C (سی تا دو)</strong>، ذاتاً خودش <strong>نیم‌پرده</strong> است؛ بنابراین هیچ فضای فیزیکی بین آن‌ها وجود ندارد و این کلیدها مستقیماً به هم چسبیده‌اند.
            </p>
            <div className="p-3.5 rounded-xl bg-[#2A1F18] border border-[#E5A836]/40 text-xs text-[#FFF5E6]">
              📌 <strong>قانون توالی الفبایی در گام‌های دیاتونیک:</strong> در هر گام ماژور یا مینور ۷ نوتی، از هر یک از حروف هفت‌گانه الفبای موسیقی (A, B, C, D, E, F, G) <strong>دقیقاً باید یک‌بار</strong> استفاده شود؛ نه نام حرفی حذف می‌شود و نه نام هیچ حرفی دوبار تکرار می‌گردد. به همین دلیل در گام فا دیز ماژور نمی‌توان درجه هفتم را فا نامید و باید الزاماً <strong>می دیز (E♯)</strong> نامیده شود.
            </div>
          </div>

          {/* Section 4: Enharmonic Table */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۳. کدام گام‌های دیاتونیک دارای نوت‌های #E یا #B هستند؟
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#594234]/60">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-[#2A201A] text-[#F5EEDB]">
                  <tr>
                    <th className="p-2.5 border-b border-[#594234]">گام دیاتونیک</th>
                    <th className="p-2.5 border-b border-[#594234]">توالی درجات ۷ گانه</th>
                    <th className="p-2.5 border-b border-[#594234]">نوت آن‌هارمونیک</th>
                    <th className="p-2.5 border-b border-[#594234]">دلیل علمی عدم استفاده از نام طبیعی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#594234]/40 bg-[#140F0C]">
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">فا دیز ماژور (F♯ Major)</td>
                    <td className="p-2.5 font-mono">F♯ - G♯ - A♯ - B - C♯ - D♯ - <strong>E♯</strong></td>
                    <td className="p-2.5 font-bold text-[#10B981]">E♯ (می دیز)</td>
                    <td className="p-2.5">اگر درجه ۷ را F بنامیم، نام F دو بار در گام تکرار شده و نام حرف E غایب می‌ماند.</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">دو دیز مینور هارمونیک (C♯m)</td>
                    <td className="p-2.5 font-mono">C♯ - D♯ - E - F♯ - G♯ - A - <strong>B♯</strong></td>
                    <td className="p-2.5 font-bold text-[#10B981]">B♯ (سی دیز)</td>
                    <td className="p-2.5">درجه هفتم برای ساخت نوت محسوس (Leading Note) نیم‌پرده بالا می‌رود و B تبدیل به #B می‌شود.</td>
                  </tr>
                  <tr className="hover:bg-[#1E1712]">
                    <td className="p-2.5 font-bold text-[#E5A836]">دو دیز ماژور (C♯ Major)</td>
                    <td className="p-2.5 font-mono">C♯ - D♯ - <strong>E♯</strong> - F♯ - G♯ - A♯ - <strong>B♯</strong></td>
                    <td className="p-2.5 font-bold text-[#10B981]">هم E♯ و هم B♯</td>
                    <td className="p-2.5">تمام ۷ نوت گام دیز دارند و هر دو نوت آن‌هارمونیک در گام حضور دارند.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5 & 6: 12 Major & Minor Table */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۴. جدول مرجع ۱۲ گام ماژور، مینورهای نسبی و علامات سرکلید دایره پنجم‌ها
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#594234]/60">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-[#2A201A] text-[#F5EEDB]">
                  <tr>
                    <th className="p-2 border-b border-[#594234]">گام ماژور</th>
                    <th className="p-2 border-b border-[#594234]">مینور نسبی</th>
                    <th className="p-2 border-b border-[#594234]">علامات سرکلید</th>
                    <th className="p-2 border-b border-[#594234]">ترتیب دیزها یا بمل‌ها</th>
                    <th className="p-2 border-b border-[#594234]">آکورد پایگی (Triad)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#594234]/40 bg-[#140F0C] font-mono text-[11.5px]">
                  <tr><td className="p-2 font-bold text-[#E5A836]">C Major (دو)</td><td>A Minor (لا مینور)</td><td>بدون علامت (Natural)</td><td>-</td><td>C - E - G</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">G Major (سل)</td><td>E Minor (می مینور)</td><td>۱ دیز (1♯)</td><td>F♯</td><td>G - B - D</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">D Major (رِ)</td><td>B Minor (سی مینور)</td><td>۲ دیز (2♯)</td><td>F♯, C♯</td><td>D - F♯ - A</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">A Major (لا)</td><td>F♯ Minor (فا دیز مینور)</td><td>۳ دیز (3♯)</td><td>F♯, C♯, G♯</td><td>A - C♯ - E</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">E Major (می)</td><td>C♯ Minor (دو دیز مینور)</td><td>۴ دیز (4♯)</td><td>F♯, C♯, G♯, D♯</td><td>E - G♯ - B</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">B Major (سی)</td><td>G♯ Minor (سل دیز مینور)</td><td>۵ دیز (5♯)</td><td>F♯, C♯, G♯, D♯, A♯</td><td>B - D♯ - F♯</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">F♯ Major (فا دیز)</td><td>D♯ Minor (ر دیز مینور)</td><td>۶ دیز (6♯)</td><td>F♯..E♯</td><td>F♯ - A♯ - C♯</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">D♭ Major (رِ بمل)</td><td>B♭ Minor (سی بمل مینور)</td><td>۵ بمل (5♭)</td><td>B♭, E♭, A♭, D♭, G♭</td><td>D♭ - F - A♭</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">A♭ Major (لا بمل)</td><td>F Minor (فا مینور)</td><td>۴ بمل (4♭)</td><td>B♭, E♭, A♭, D♭</td><td>A♭ - C - E♭</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">E♭ Major (می بمل)</td><td>C Minor (دو مینور)</td><td>۳ بمل (3♭)</td><td>B♭, E♭, A♭</td><td>E♭ - G - B♭</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">B♭ Major (سی بمل)</td><td>G Minor (سل مینور)</td><td>۲ بمل (2♭)</td><td>B♭, E♭</td><td>B♭ - D - F</td></tr>
                  <tr><td className="p-2 font-bold text-[#E5A836]">F Major (فا)</td><td>D Minor (رِ مینور)</td><td>۱ بمل (1♭)</td><td>B♭</td><td>F - A - C</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 8: Orchestral Violin Tuning */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
              ۵. انطباق ۴ سیم ویولن با پیانو در استاندارد ارکسترال جهانی
            </h3>
            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 text-xs sm:text-sm space-y-2">
              <p>
                در موسیقی کلاسیک جهانی، کوک ۴ سیم ویولن بر مبنای فرکانس استاندارد دیاپازون بین‌المللی (A4 = 440 Hz) و فواصل پنجم درست است:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#C4B59D]">
                <li><strong>سیم ۴ (بم‌ترین نوت ساز):</strong> G3 (سل اکتاو ۳ - ۱۹۶ هرتز)</li>
                <li><strong>سیم ۳:</strong> D4 (رِ اکتاو ۴ - ۲۹۳.۶ هرتز)</li>
                <li><strong>سیم ۲:</strong> A4 (لا اکتاو ۴ - ۴۴۰ هرتز)</li>
                <li><strong>سیم ۱ (زیرترین سیم باز):</strong> E5 (می اکتاو ۵ - ۶۵۹.۲ هرتز)</li>
              </ul>
              <p className="text-xs text-[#E5A836] pt-1">
                گستره صوتی کامل ۵۱ کلاویه پرده‌نگار، تمام پوزیسیون‌های اول تا هفتم ویولن کلاسیک (تا A7) را پوشش می‌دهد.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bibliography Tab */}
      {activeTab === 'bibliography' && (
        <div className="space-y-5 text-[#EDE0C8] text-sm leading-relaxed">
          <h3 className="text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-3">
            کتاب‌شناسی، منابع مکتوب و سنت‌های اجرایی (مکتب استاد پرویز یاحقی)
          </h3>
          <p className="text-xs sm:text-sm text-[#C4B59D]">
            جهت شفافیت علمی، کلیه نوت‌ها، تم‌های درآمدی و فواصل شبیه‌سازی‌شده در سامانه «پرده‌نگار» مستقیماً از روی معتبرترین مراجع ردیف‌شناسی مکتوب و سنت‌های فاخر ویولن ایران اخذ شده است:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 space-y-1">
              <strong className="text-[#E5A836] block">۱. ردیف سازی و آوازی میرزا عبدالله (روایت نورعلی برومند):</strong>
              <p className="text-xs text-[#C4B59D]">مرجع رسمی هسته‌های ملودیک، تثبیت دانگ‌ها، نوت شاهد و فرود درآمدهای اصیل ایرانی.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 space-y-1">
              <strong className="text-[#E5A836] block">۲. کتاب «بیست و چهار پیش‌درآمد» (تدوین و نت‌نگاری استاد فرامرز پایور):</strong>
              <p className="text-xs text-[#C4B59D]">منبع تم‌های آغازین پیش‌درآمدهای تاریخی درویش‌خان، مرتضی نی‌داوود و رکن‌الدین مختاری.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 space-y-1">
              <strong className="text-[#E5A836] block">۳. کتاب «سرگذشت موسیقی ایران» (استاد روح‌الله خالقی):</strong>
              <p className="text-xs text-[#C4B59D]">مرجع مستند تاریخچه تحول فرم پیش‌‌درآمد از دوران قاجار و کنسرت‌های انجمن اخوّت.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 space-y-1">
              <strong className="text-[#E5A836] block">۴. کتاب «ردیف هفت دستگاه موسیقی ایران» (موسی معروفی):</strong>
              <p className="text-xs text-[#C4B59D]">مأخذ سنجش فواصل و ریزپرده‌های سُری و کُرن بر حسب سِنت.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1612] border border-[#8B5CF6]/50 space-y-1">
              <strong className="text-[#8B5CF6] block">۵. سنت‌های اجرایی و لحن‌شناسی «مکتب استاد پرویز یاحقی»:</strong>
              <p className="text-xs text-[#C4B59D]">
                کاربرد تخصصی واخوان‌های دوبل، استفاده بهینه از تشدید صدای سیم‌های جفت در کوک‌های خاص (مانند می-لا-ر-لا در اصفهان و ر-لا-ر-لا در دشتی و همایون) و گردش‌های درآمدی گیرا.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
