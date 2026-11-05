/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • سامانه جامع انطباق پیانو، ویولن و ردیف موسیقی ایرانی
 * هدر و نوار ناوبری اصلی با انتخابگر زبان‌های مسیر کوچ، وبلاگ و کالیبراسیون سنت‌ها
 * طراح و مؤلف: ایمان برزجان (imanbarzjan.ir)
 * ناشر رسمی: استودیو اینامیکس (EnamiX)
 * مشاور علمی و هنری: استاد بابک بختیاری
 */

import React, { useState } from 'react';
import { AUTHOR_CREDITS } from '../utils/pardeheNegarData';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS 
} from '../utils/i18n';
import { Globe, BookOpen, Sliders, FileText, Download, Maximize2 } from 'lucide-react';

export type MainTabType = 
  | 'piano_violin' 
  | 'daramad_motifs' 
  | 'circle_fifths' 
  | 'rhythm_engine' 
  | 'continuum_map' 
  | 'theory_guide' 
  | 'blog';

interface HeaderProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onExportPng: () => void;
  onToggleFullscreen: () => void;
  onOpenTreatise: () => void;
  onOpenCentsGuide: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onExportPng,
  onToggleFullscreen,
  onOpenTreatise,
  onOpenCentsGuide,
  currentLanguage,
  onSelectLanguage
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.fa;
  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="w-full bg-[#16110E]/95 backdrop-blur-md border-b border-[#594234]/50 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3 space-y-3 font-persian">
      {/* Top Credentials & Title Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Brand and Version */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎻</span>
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#F5EEDB] tracking-wide flex items-center gap-2">
                <span>{t.appTitle}</span>
                <span className="text-[#E5A836] font-normal text-xs hidden sm:inline">| {t.appSubtitle}</span>
              </h1>
            </div>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2635]/80 text-[#FFF5E6] font-bold border border-[#E5A836]/40">
            {AUTHOR_CREDITS.softwareVersion}
          </span>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#201813] text-[#E5A836] font-bold border border-[#594234]/70">
            {AUTHOR_CREDITS.publisher}
          </span>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Migration Route Languages Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#241A14] hover:bg-[#34261D] text-[#E5A836] border border-[#594234] transition shadow-sm font-bold"
              title={t.languageSelect}
            >
              <Globe size={14} className="text-[#E5A836]" />
              <span>{currentLangMeta.flag}</span>
              <span className="text-xs">{currentLangMeta.nativeName}</span>
              <span className="text-[9px] text-[#A6937C]">▼</span>
            </button>

            {isLangMenuOpen && (
              <div 
                className="absolute left-0 mt-1.5 w-56 bg-[#1A130F] border border-[#E5A836]/60 rounded-xl shadow-2xl py-1 z-50 divide-y divide-[#594234]/40"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#A6937C]">
                  {t.languageSelect} (زبان‌های مسیر کوچ)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-[#2A1F18] transition ${
                      currentLanguage === lang.code ? 'text-[#E5A836] font-bold bg-[#2A1F18]/60' : 'text-[#C4B59D]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-[#A6937C]">({lang.name})</span>
                    </div>
                    {currentLanguage === lang.code && <span className="text-[#E5A836]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cents & Microtones Calibration Button */}
          <button
            onClick={onOpenCentsGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F1914] hover:bg-[#2C231C] text-[#38BDF8] border border-[#0284C7]/50 font-bold transition shadow-sm"
            title="بررسی دقیق انحراف سنت‌ها و ابعاد پنج‌گانه هرمز فرهت"
          >
            <Sliders size={14} />
            <span className="hidden sm:inline">{t.centsGuideBtn}</span>
            <span className="sm:hidden">سنت‌ها</span>
          </button>

          {/* Quick Open Treatise Modal Button */}
          <button
            onClick={onOpenTreatise}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#E5A836] text-black font-black transition shadow"
            title="مطالعه رساله پژوهشی و مراجع دانشنامه‌ای"
          >
            <BookOpen size={14} />
            <span>{t.treatiseButton}</span>
          </button>

          {/* Snapshot & Fullscreen Actions */}
          <button
            onClick={onExportPng}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition"
            title={t.exportPng}
          >
            <Download size={14} />
            <span className="hidden md:inline">{t.exportPng}</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1 p-1.5 rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#C4B59D] border border-[#594234] transition"
            title={t.fullscreen}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => onSelectTab('piano_violin')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'piano_violin'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabKeysAndFingerboard}
        </button>

        <button
          onClick={() => onSelectTab('daramad_motifs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'daramad_motifs'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabDaramads}
        </button>

        <button
          onClick={() => onSelectTab('circle_fifths')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'circle_fifths'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabCircleOfFifths}
        </button>

        <button
          onClick={() => onSelectTab('rhythm_engine')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'rhythm_engine'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabRhythmEngine}
        </button>

        <button
          onClick={() => onSelectTab('continuum_map')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'continuum_map'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabContinuumMap}
        </button>

        <button
          onClick={() => onSelectTab('blog')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border flex items-center gap-1.5 ${
            activeTab === 'blog'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          <FileText size={14} className="text-[#E5A836]" />
          <span>{t.tabBlog}</span>
        </button>

        <button
          onClick={() => onSelectTab('theory_guide')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
            activeTab === 'theory_guide'
              ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-md'
              : 'bg-[#221A15] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
          }`}
        >
          {t.tabTheoryGuide}
        </button>
      </nav>
    </header>
  );
};
