/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • رساله جامع پژوهشی، دانشنامه آکادمیک و مراجع اتنوموزیکولوژی
 * استخراج و تحلیل جامع محتوای ۵ فایل پژوهشی PDF:
 * ۱. جهان صوتی ایرانی-دانوبی (پیوستار آکوستیک از فلات ایران تا حوضه کارپات-دانوب)
 * ۲. ایمان برزجان - تحلیل جامع و تطبیقی گام‌ها (ویرایش اختصاصی)
 * ۳. گزارش تحلیلی ردیف موسیقی ایرانی و سیستم فواصل هرمز فرهت (m, n, N, M, P)
 * ۴. ساختار و فیزیک گام ماژور، سرکلیدها و ارتعاش هارمونیک‌ها
 * ۵. گام‌های مینور (طبیعی، هارمونیک، ملودیک) در رپرتوار ویولن کلاسیک
 * همراه با پلیر صوتی اختصاصی و مدیریت هم‌زمانی صداها بدون تداخل با مترونوم
 * ناشر: استودیو اینامیکس (EnamiX) | مؤلف: ایمان برزجان
 */

import React, { useState, useEffect } from 'react';
import {
  SCHOLARLY_TREATISE_CHAPTERS,
  RESEARCH_PDF_DOCS,
  TreatiseChapter,
  AUTHOR_CREDITS
} from '../utils/pardeheNegarData';
import { audioEngine } from '../utils/audioEngine';

interface ResearchTreatiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: string;
}

export const ResearchTreatiseModal: React.FC<ResearchTreatiseModalProps> = ({
  isOpen,
  onClose,
  initialChapterId
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(initialChapterId || SCHOLARLY_TREATISE_CHAPTERS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chapters' | 'pdf_downloads' | 'tables'>('chapters');

  // Dedicated Treatise Audio Player State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.7);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Sync volume with dedicated treatise gain channel
  useEffect(() => {
    audioEngine.setTreatiseVolume(audioVolume);
  }, [audioVolume]);

  // Audio timer simulation for progress bar
  useEffect(() => {
    let interval: number | null = null;
    if (isAudioPlaying) {
      interval = window.setInterval(() => {
        setAudioProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 500);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAudioPlaying]);

  if (!isOpen) return null;

  const currentChapter: TreatiseChapter =
    SCHOLARLY_TREATISE_CHAPTERS.find(c => c.id === activeChapterId) || SCHOLARLY_TREATISE_CHAPTERS[0];

  const filteredChapters = SCHOLARLY_TREATISE_CHAPTERS.filter(ch =>
    ch.title.includes(searchQuery) ||
    ch.summary.includes(searchQuery) ||
    ch.fullContent.some(p => p.includes(searchQuery))
  );

  const toggleTreatiseAudio = () => {
    if (isAudioPlaying) {
      audioEngine.stopTreatiseAudio();
      setIsAudioPlaying(false);
    } else {
      audioEngine.startTreatiseAudio();
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in font-persian" dir="rtl">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#16110E] border-2 border-[#594234] rounded-2xl shadow-2xl overflow-hidden text-[#EDE0C8]">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[#1F1713] border-b border-[#594234]/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📚</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#F5EEDB]">
                  دانشنامه و رساله جامع پژوهشی پرده‌نگار
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2635] text-white font-bold border border-[#E5A836]/40">
                  {AUTHOR_CREDITS.publisher}
                </span>
              </div>
              <p className="text-xs text-[#C4B59D]">
                پژوهش و تألیف: {AUTHOR_CREDITS.author} | استخراج و یکپارچه‌سازی از ۵ رساله مرجع و متون اتنوموزیکولوژی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2A201A] hover:bg-[#8B2635] text-[#EDE0C8] hover:text-white transition flex items-center justify-center font-bold text-lg border border-[#594234]"
            aria-label="بستن دانشنامه"
          >
            ✕
          </button>
        </div>

        {/* Dedicated Audio Player Bar (Independent Audio Routing - Does not clash with Metronome) */}
        <div className="px-4 py-2.5 bg-[#201813] border-b border-[#594234]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={toggleTreatiseAudio}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow ${
                isAudioPlaying
                  ? 'bg-[#EF4444] text-white animate-pulse'
                  : 'bg-[#D97706] hover:bg-[#E5A836] text-black font-black'
              }`}
            >
              <span>{isAudioPlaying ? '⏸ توقف تحلیل صوتی' : '▶ پخش پادکست و نوای رساله'}</span>
            </button>

            <span className="text-[#C4B59D] text-[11px] truncate">
              {isAudioPlaying ? 'در حال پخش پس‌زمینه صوتی رساله (مستقل از مترونوم)' : 'هم‌گام با مطالعه به تحلیل و فضای مدال گوش فرا دهید'}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* Progress bar */}
            <div className="w-28 sm:w-36 h-2 bg-[#120E0B] rounded-full overflow-hidden border border-[#594234]/50">
              <div
                className="h-full bg-gradient-to-r from-[#D97706] to-[#E5A836] transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#E5A836]">ولوم:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-16 accent-[#E5A836] cursor-pointer"
                title="کنترل مستقل صدای رساله"
              />
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs: Chapters / PDF Downloads / Matrix Tables */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#19120E] border-b border-[#594234]/40 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeTab === 'chapters'
                ? 'bg-[#8B2635] text-white border border-[#E5A836]'
                : 'text-[#C4B59D] hover:bg-[#2A201A]'
            }`}
          >
            📖 فصول ۸ گانه رساله پژوهشی
          </button>

          <button
            onClick={() => setActiveTab('pdf_downloads')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === 'pdf_downloads'
                ? 'bg-[#8B2635] text-white border border-[#E5A836]'
                : 'text-[#C4B59D] hover:bg-[#2A201A]'
            }`}
          >
            <span>📥</span>
            <span>دانلود ۵ کتابچه و رساله PDF اصلی</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeTab === 'tables'
                ? 'bg-[#8B2635] text-white border border-[#E5A836]'
                : 'text-[#C4B59D] hover:bg-[#2A201A]'
            }`}
          >
            📊 ماتریس تطبیقی فواصل و ارگانولوژی
          </button>
        </div>

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 8 CHAPTERS OF THE RESEARCH MONOGRAPH */}
          {activeTab === 'chapters' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sidebar: Chapter Selection List */}
              <div className="lg:col-span-4 space-y-2 bg-[#1C1612] p-3 rounded-xl border border-[#594234]/60">
                <div className="text-xs font-bold text-[#E5A836] pb-1 border-b border-[#594234]/40 flex items-center justify-between">
                  <span>فهرست فصول رساله:</span>
                  <span className="text-[10px] text-[#A6937C]">۸ فصل مدون</span>
                </div>

                <div className="space-y-1.5 max-h-[60vh] overflow-y-auto scrollbar-none">
                  {filteredChapters.map(ch => {
                    const isActive = ch.id === activeChapterId;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChapterId(ch.id)}
                        className={`w-full p-2.5 rounded-lg text-right transition border flex flex-col gap-1 ${
                          isActive
                            ? 'bg-[#2A201A] border-[#E5A836] text-[#FFF5E6] shadow'
                            : 'bg-[#140F0C] border-[#594234]/30 text-[#C4B59D] hover:bg-[#1E1712]'
                        }`}
                      >
                        <div className="text-[10.5px] text-[#D97706] font-bold">
                          فصل {ch.chapterNumber}:
                        </div>
                        <div className="text-xs font-bold leading-tight">
                          {ch.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Reading Window */}
              <div className="lg:col-span-8 bg-[#18120E] p-5 sm:p-6 rounded-xl border border-[#594234]/70 space-y-5">
                <div className="border-b border-[#594234]/50 pb-3">
                  <div className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                    فصل {currentChapter.chapterNumber} از ۸ • رساله اختصاصی پرده‌نگار
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#F5EEDB] mt-1">
                    {currentChapter.title}
                  </h3>
                  <div className="text-xs text-[#E5A836] font-semibold mt-1">
                    {currentChapter.subtitle}
                  </div>
                </div>

                {/* Summary Callout */}
                <div className="p-3.5 rounded-xl bg-[#221A15] border-r-4 border-[#8B2635] text-xs sm:text-sm text-[#EDE0C8] leading-relaxed">
                  <strong>چکیده پژوهش: </strong>
                  {currentChapter.summary}
                </div>

                {/* Full Chapter Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#C4B59D]">
                  {currentChapter.fullContent.map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Chapter Key Table if Available */}
                {currentChapter.keyTable && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-[#E5A836]">
                      جدول مرجع و ماتریس تحلیلی این فصل:
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-[#594234]/60 bg-[#120E0B]">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead>
                          <tr className="bg-[#2A201A] text-[#F5EEDB] border-b border-[#594234]/60">
                            {currentChapter.keyTable.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#594234]/30">
                          {currentChapter.keyTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#1C1612]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5 text-[#EDE0C8]">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT PDF DOWNLOADS */}
          {activeTab === 'pdf_downloads' && (
            <div className="space-y-4">
              <div className="bg-[#201813] p-4 rounded-xl border border-[#594234]/60 text-xs text-[#C4B59D] space-y-1">
                <strong className="text-sm text-[#E5A836] block">
                  مخزن اسناد و رساله‌های مرجع پژوهشی (PDF)
                </strong>
                <p>
                  تمامی این ۵ رساله مستقیماً در پایگاه داده پرده‌نگار میزبانی شده و شامل تحلیل‌های تخصصی گام‌ها، فیزیک آکوستیک، سیستم هرمز فرهت، و اسناد اتنوموزیکولوژی است. روی هر کدام کلیک کنید تا فایل کامل دانلود و ذخیره گردد.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESEARCH_PDF_DOCS.map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-[#1C1612] border border-[#594234]/60 hover:border-[#E5A836] transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2A201A] text-[#D97706] border border-[#594234]/60">
                          PDF • {doc.fileSizeText}
                        </span>
                        <span className="text-[10px] text-[#A6937C] font-mono">
                          {doc.fileName.slice(0, 20)}...
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#F5EEDB]">
                        {doc.title}
                      </h4>

                      <div className="text-[11px] text-[#E5A836]">
                        {doc.author}
                      </div>

                      <p className="text-xs text-[#A6937C] leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <a
                      href={doc.downloadUrl}
                      download
                      className="w-full py-2 px-3 rounded-lg bg-[#8B2635] hover:bg-[#A32D3F] text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-[#E5A836]/40 shadow"
                    >
                      <span>📥</span>
                      <span>دانلود مستقیم رساله کامل (PDF)</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATRIX TABLES & INTERVALS */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              {/* Farhat Microtonal Intervals Matrix */}
              <div className="bg-[#1C1612] p-5 rounded-xl border border-[#594234]/70 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-2.5">
                  سیستم ۵ گانه فواصل هرمز فرهت در برابر ۲۴ ربع‌پرده کلنل وزیری
                </h3>
                <p className="text-xs text-[#C4B59D]">
                  تحلیل ریاضی اندازه‌گیری‌های تجربی در دانشگاه کمبریج روی ضبط‌های اساتید برجسته ردیف ایران:
                </p>

                <div className="overflow-x-auto rounded-xl border border-[#594234]/60">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead className="bg-[#2A201A] text-[#F5EEDB]">
                      <tr>
                        <th className="p-2.5">نماد</th>
                        <th className="p-2.5">نام علمی فاصله</th>
                        <th className="p-2.5">اندازه به سِنت (Cent)</th>
                        <th className="p-2.5">معادل ربع‌پرده وزیری</th>
                        <th className="p-2.5">نمونه در ردیف ۱۲ دستگاه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#594234]/30">
                      <tr>
                        <td className="p-2.5 font-bold text-[#EF4444]">m</td>
                        <td className="p-2.5">دوم کوچک (Minor Second)</td>
                        <td className="p-2.5 font-mono">۹۰ سنت</td>
                        <td className="p-2.5">۲ ربع‌پرده (۱۰۰ سنت)</td>
                        <td className="p-2.5">سی تا دو، فا تا سل بمل</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#F59E0B]">n</td>
                        <td className="p-2.5">دوم خنثی (Neutral Second)</td>
                        <td className="p-2.5 font-mono">۱۳۵ تا ۱۴۰ سنت</td>
                        <td className="p-2.5">۳ ربع‌پرده (۱۵۰ سنت)</td>
                        <td className="p-2.5">لا تا سی کُرن در دستگاه شور</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#10B981]">N</td>
                        <td className="p-2.5">دوم خنثای بزرگ (Neutral Plus)</td>
                        <td className="p-2.5 font-mono">۱۶۰ تا ۱۶۵ سنت</td>
                        <td className="p-2.5">۳.۵ ربع‌پرده</td>
                        <td className="p-2.5">فا تا سل سری در شور چپ‌کوک</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#3B82F6]">M</td>
                        <td className="p-2.5">دوم بزرگ (Major Second)</td>
                        <td className="p-2.5 font-mono">۲۰۴ سنت</td>
                        <td className="p-2.5">۴ ربع‌پرده (۲۰۰ سنت)</td>
                        <td className="p-2.5">دو تا ر در درآمد ماهور</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#8B5CF6]">P</td>
                        <td className="p-2.5">دوم افزوده (Plus Augmented)</td>
                        <td className="p-2.5 font-mono">۲۶۵ تا ۲۸۰ سنت</td>
                        <td className="p-2.5">۵ تا ۶ ربع‌پرده</td>
                        <td className="p-2.5">ر تا لا سری در همایون و چهارگاه</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Organological Bridge Table */}
              <div className="bg-[#1C1612] p-5 rounded-xl border border-[#594234]/70 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-[#E5A836] border-r-4 border-[#8B2635] pr-2.5">
                  ارگانولوژی تطبیقی سازهای جفت پیوستار آکوستیک
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#594234]/60">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead className="bg-[#2A201A] text-[#F5EEDB]">
                      <tr>
                        <th className="p-2.5">ساز مادر ایرانی</th>
                        <th className="p-2.5">ساز همتا در دانوب / بالکان</th>
                        <th className="p-2.5">دگرگونی آکوستیک و ساختاری</th>
                        <th className="p-2.5">نقش در پیوستار مدال</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#594234]/30">
                      <tr>
                        <td className="p-2.5 font-bold text-[#E5A836]">سنتور چوبی (۷۲ سیم)</td>
                        <td className="p-2.5 font-bold text-[#D97706]">تسمبال کنسرتی رومانی (Țambal)</td>
                        <td className="p-2.5">افزودن کلاف چدنی، سیستم دمپر پدالی و ۴ اکتاو وسعت</td>
                        <td className="p-2.5">موتور محرک ریتم‌های تند هورا و رپرتوار لوتاری</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#E5A836]">سه‌تار دسته‌بلند</td>
                        <td className="p-2.5 font-bold text-[#D97706]">بوزوکی و تامبوریتزا</td>
                        <td className="p-2.5">تبدیل پرده‌های روده به پرده‌های فلزی ثابت و مضراب مضاعف</td>
                        <td className="p-2.5">بیان سوزناک نغمات رببتیکو و پیوند آسیای صغیر به بالکان</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#E5A836]">نی هفت‌بند دندان‌نوازی</td>
                        <td className="p-2.5 font-bold text-[#D97706]">کاوال چوبی کارپات (Caval)</td>
                        <td className="p-2.5">لوله‌های متصل دو یا سه‌تکه با تنفس ممتد چوپانی</td>
                        <td className="p-2.5">خلق ناله‌های لغزنده و حزن‌انگیز آواز دوئینای رومانی</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="p-3 bg-[#19120E] border-t border-[#594234]/50 flex items-center justify-between text-xs text-[#A6937C]">
          <span>
            {AUTHOR_CREDITS.softwareName} • {AUTHOR_CREDITS.publisher}
          </span>
          <span>
            مؤلف: {AUTHOR_CREDITS.author} ({AUTHOR_CREDITS.authorWebsite})
          </span>
        </div>
      </div>
    </div>
  );
};
