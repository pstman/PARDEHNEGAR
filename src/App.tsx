/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • سامانه جامع انطباق پیانو، ویولن و ردیف موسیقی ایرانی
 * مؤلف و طراح: ایمان برزجان (imanbarzjan.ir)
 * ناشر رسمی: استودیو اینامیکس (EnamiX)
 * مشاور علمی و هنری: استاد بابک بختیاری
 * اثر تکمیلی: پیوستار آکوستیک ایران تا دانوب (Continuum Acusticum)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header, MainTabType } from './components/Header';
import { PianoKeyboard } from './components/PianoKeyboard';
import { ViolinFingerboard } from './components/ViolinFingerboard';
import { CircleOfFifths } from './components/CircleOfFifths';
import { DaramadGallery } from './components/DaramadGallery';
import { RhythmGenerator } from './components/RhythmGenerator';
import { ContinuumSubmodule } from './components/ContinuumSubmodule';
import { TheoryGuide } from './components/TheoryGuide';
import { ResearchTreatiseModal } from './components/ResearchTreatiseModal';
import { BlogSection } from './components/BlogSection';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MicrotonalCentsGuide } from './components/MicrotonalCentsGuide';
import {
  PERSIAN_DASTGAH_DATA,
  CLASSICAL_SCALES_DATA,
  DastgahScale,
  ClassicalScale,
  AUTHOR_CREDITS
} from './utils/pardeheNegarData';
import { audioEngine, TimbreType, ArticulationType } from './utils/audioEngine';
import { SupportedLanguage, TRANSLATIONS } from './utils/i18n';
import { getStoredTheme, applyTheme } from './utils/themeSystem';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('piano_violin');

  // No default preselection: user must discover and interact
  const [activeCategory, setActiveCategory] = useState<'persian' | 'classical' | ''>('');
  const [selectedPersianId, setSelectedPersianId] = useState<string>('');
  const [selectedClassicalId, setSelectedClassicalId] = useState<string>('');

  const [namingMode, setNamingMode] = useState<'letter' | 'solfege'>('letter');
  const [accidentalMode, setAccidentalMode] = useState<'auto' | 'both' | 'sharp' | 'flat'>('auto');
  const [soundTimbre, setSoundTimbre] = useState<TimbreType>('piano');
  const [articulation, setArticulation] = useState<ArticulationType>('glissando');

  const [highlightedMidi, setHighlightedMidi] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('آماده نواختن • لطفاً یک سیستم موسیقی و دستگاه/گام را انتخاب نمایید');
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const [isPlayingMotif, setIsPlayingMotif] = useState(false);

  // Global Treatise Modal State
  const [isTreatiseModalOpen, setIsTreatiseModalOpen] = useState(false);

  // Cents Guide Modal State
  const [isCentsGuideOpen, setIsCentsGuideOpen] = useState(false);

  // Admin Panel Modal State (Subtle link in footer)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Language state for Route of Migration
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fa');

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Apply stored theme on mount
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.fa;
  const isRtl = currentLanguage === 'fa' || currentLanguage === 'ar';

  // Current active scale object if selected
  const selectedPersianDastgah = PERSIAN_DASTGAH_DATA.find(d => d.id === selectedPersianId) || null;
  const selectedClassicalScale = CLASSICAL_SCALES_DATA.find(c => c.id === selectedClassicalId) || null;

  const currentScale: DastgahScale | ClassicalScale | null =
    activeCategory === 'persian'
      ? selectedPersianDastgah
      : (activeCategory === 'classical' ? selectedClassicalScale : null);

  const handleKeyPlayed = (noteName: string, midi: number, freq: number) => {
    setStatusText(`نواخته شد: ${noteName} | ${freq.toFixed(1)}Hz`);
    setHighlightedMidi(midi);
  };

  const handleCategoryChange = (cat: 'persian' | 'classical' | '') => {
    setActiveCategory(cat);
    if (cat === 'persian') {
      setSelectedPersianId('');
    } else if (cat === 'classical') {
      setSelectedClassicalId('');
    }
  };

  const handleSelectScaleChange = (id: string) => {
    if (activeCategory === 'persian') {
      setSelectedPersianId(id);
      const match = PERSIAN_DASTGAH_DATA.find(d => d.id === id);
      if (match) {
        setStatusText(`دستگاه انتخاب شد: ${match.name}`);
      }
    } else if (activeCategory === 'classical') {
      setSelectedClassicalId(id);
      const match = CLASSICAL_SCALES_DATA.find(c => c.id === id);
      if (match) {
        setStatusText(`گام انتخاب شد: ${match.name}`);
      }
    }
  };

  // Quick preset loader helper
  const handleQuickSelect = (category: 'persian' | 'classical', id: string) => {
    setActiveCategory(category);
    if (category === 'persian') {
      setSelectedPersianId(id);
    } else {
      setSelectedClassicalId(id);
    }
  };

  // Play fast ascending & descending scale
  const handleTogglePlayScale = () => {
    if (!currentScale) return;
    if (isPlayingScale) {
      audioEngine.stopAll();
      setIsPlayingScale(false);
      return;
    }

    setIsPlayingScale(true);
    const baseMidi = 60;
    const scaleNotes: number[] = [];

    const sortedPitchClasses = [...currentScale.notes].sort((a, b) => a - b);
    sortedPitchClasses.forEach(pc => {
      scaleNotes.push(baseMidi + pc);
    });
    scaleNotes.push(baseMidi + sortedPitchClasses[0] + 12);

    const microCents = ('microCents' in currentScale && currentScale.microCents)
      ? currentScale.microCents
      : {};

    audioEngine.playScaleSequence(
      scaleNotes,
      microCents,
      soundTimbre,
      articulation,
      (midi) => setHighlightedMidi(midi),
      () => setIsPlayingScale(false)
    );
  };

  // Play motif of current dastgah
  const handlePlayCurrentMotif = () => {
    if (activeCategory !== 'persian' || !selectedPersianDastgah) return;
    if (isPlayingMotif) {
      audioEngine.stopAll();
      setIsPlayingMotif(false);
      return;
    }

    setIsPlayingMotif(true);
    audioEngine.playScaleSequence(
      selectedPersianDastgah.motifMelody.map(m => m.midi),
      selectedPersianDastgah.microCents || {},
      soundTimbre,
      articulation,
      (midi) => setHighlightedMidi(midi),
      () => setIsPlayingMotif(false)
    );
  };

  // Export screenshot helper
  const handleExportPng = () => {
    setStatusText('در حال آماده‌سازی خروجی گرافیکی...');
    window.print();
  };

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen bg-[#0E0B09] text-[#F5EEDB] flex flex-col font-persian selection:bg-[#E5A836] selection:text-black"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Main Top Header Component */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportPng={handleExportPng}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenTreatise={() => setIsTreatiseModalOpen(true)}
        onOpenCentsGuide={() => setIsCentsGuideOpen(true)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Tab 1: 51-Key Piano & Violin Fingerboard Matching Engine */}
        {activeTab === 'piano_violin' && (
          <div className="space-y-6">
            {/* Top Control Bar & Dropdowns */}
            <div className="bg-[#18120E] border border-[#594234] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Main Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#E5A836] block">
                    ۱. سیستم موسیقی (ایرانی یا غربی):
                  </label>
                  <select
                    value={activeCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as 'persian' | 'classical' | '')}
                    className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-2 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none transition"
                  >
                    <option value="" disabled>
                      {t.systemPlaceholder}
                    </option>
                    <option value="persian">{t.persianSystem}</option>
                    <option value="classical">{t.classicalSystem}</option>
                  </select>
                </div>

                {/* 2. Sub-Category Scale/Dastgah Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#E5A836] block">
                    ۲. دستگاه، آواز یا گام مورد نظر:
                  </label>
                  <select
                    value={activeCategory === 'persian' ? selectedPersianId : selectedClassicalId}
                    onChange={(e) => handleSelectScaleChange(e.target.value)}
                    disabled={!activeCategory}
                    className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-2 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none transition disabled:opacity-40"
                  >
                    <option value="" disabled>
                      {t.scalePlaceholder}
                    </option>
                    {activeCategory === 'persian' &&
                      PERSIAN_DASTGAH_DATA.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    {activeCategory === 'classical' &&
                      CLASSICAL_SCALES_DATA.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 3. Instrument Timbre Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#E5A836] block">
                    ۳. ساز و جنس صدا (Timbre):
                  </label>
                  <select
                    value={soundTimbre}
                    onChange={(e) => setSoundTimbre(e.target.value as TimbreType)}
                    className="w-full bg-[#241A14] border border-[#594234] rounded-lg px-3 py-2 text-xs text-[#F5EEDB] focus:border-[#E5A836] outline-none transition"
                  >
                    <option value="piano">{t.timbrePiano}</option>
                    <option value="violin">{t.timbreViolin}</option>
                    <option value="santur">{t.timbreSantur}</option>
                    <option value="tambal">{t.timbreTambal}</option>
                    <option value="setar">{t.timbreSetar}</option>
                    <option value="bouzouki">{t.timbreBouzouki}</option>
                    <option value="ney">{t.timbreNey}</option>
                    <option value="caval">{t.timbreCaval}</option>
                  </select>
                </div>

                {/* 4. Playback Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleTogglePlayScale}
                    disabled={!currentScale}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow border disabled:opacity-40 ${
                      isPlayingScale
                        ? 'bg-[#EF4444] text-white border-red-400'
                        : 'bg-[#8B2635] hover:bg-[#A62F41] text-[#FFF5E6] border-[#E5A836]/60'
                    }`}
                  >
                    <span>{isPlayingScale ? '⏹' : '▶'}</span>
                    <span>{isPlayingScale ? t.stopScale : t.playScale}</span>
                  </button>

                  <button
                    onClick={() => setArticulation(articulation === 'glissando' ? 'staccato' : 'glissando')}
                    className="py-2 px-2.5 rounded-lg text-[11px] font-bold bg-[#2A1F18] hover:bg-[#3D2E24] text-[#C4B59D] border border-[#594234] transition"
                    title="تغییر نحوه آرشه‌کشی/نواختن: پیوسته یا مقطع"
                  >
                    {articulation === 'glissando' ? 'لگاتو' : 'استکاتو'}
                  </button>
                </div>
              </div>

              {/* Display Modes Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#594234]/40 flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#A6937C] text-[11px]">نمایش نام نوت‌ها:</span>
                  <div className="flex rounded-lg overflow-hidden border border-[#594234]">
                    <button
                      onClick={() => setNamingMode('letter')}
                      className={`px-2.5 py-1 text-xs font-bold transition ${
                        namingMode === 'letter' ? 'bg-[#8B2635] text-white' : 'bg-[#241A14] text-[#C4B59D]'
                      }`}
                    >
                      حروف لاتین (C, D, E)
                    </button>
                    <button
                      onClick={() => setNamingMode('solfege')}
                      className={`px-2.5 py-1 text-xs font-bold transition ${
                        namingMode === 'solfege' ? 'bg-[#8B2635] text-white' : 'bg-[#241A14] text-[#C4B59D]'
                      }`}
                    >
                      سلفژ (دو، ر، می)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#A6937C] text-[11px]">علائم عَرَضی:</span>
                  <div className="flex rounded-lg overflow-hidden border border-[#594234]">
                    {(['auto', 'both', 'sharp', 'flat'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setAccidentalMode(mode)}
                        className={`px-2 py-1 text-xs transition ${
                          accidentalMode === mode ? 'bg-[#D97706] text-black font-bold' : 'bg-[#241A14] text-[#C4B59D]'
                        }`}
                      >
                        {mode === 'auto' ? 'خودکار' : mode === 'both' ? 'هر دو (♯/♭)' : mode === 'sharp' ? 'فقط ♯' : 'فقط ♭'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* If NO scale selected: Interactive Discovery Welcome Card */}
            {!currentScale && (
              <div className="bg-gradient-to-b from-[#1C1510] to-[#120E0B] border-2 border-dashed border-[#594234] rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2A1F18] border border-[#E5A836] flex items-center justify-center mx-auto text-3xl">
                  🎼
                </div>
                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#F5EEDB]">
                    به سامانه تخصصی پرده‌نگار خوش آمدید
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C4B59D] leading-relaxed">
                    برای شروع کاوش آکوستیک، لطفاً از کادرهای بالا یک سیستم موسیقی و دستگاه یا گام را انتخاب نمایید، یا بر روی یکی از نمونه‌های پیشنهادی زیر کلیک فرمایید:
                  </p>
                </div>

                {/* Quick Discovery Pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                  <button
                    onClick={() => handleQuickSelect('persian', 'shor_la')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#E5A836] hover:text-white border border-[#E5A836]/40 text-xs font-bold transition shadow"
                  >
                    🎻 دستگاه شور «لا» (مادر ردیف)
                  </button>

                  <button
                    onClick={() => handleQuickSelect('persian', 'homayoun_sol')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#E5A836] hover:text-white border border-[#E5A836]/40 text-xs font-bold transition shadow"
                  >
                    👑 دستگاه همایون «سل»
                  </button>

                  <button
                    onClick={() => handleQuickSelect('persian', 'chahargah_do')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#E5A836] hover:text-white border border-[#E5A836]/40 text-xs font-bold transition shadow"
                  >
                    ⚔️ دستگاه چهارگاه «دو»
                  </button>

                  <button
                    onClick={() => handleQuickSelect('persian', 'segah_mi')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#E5A836] hover:text-white border border-[#E5A836]/40 text-xs font-bold transition shadow"
                  >
                    🕊️ دستگاه سه‌گاه «می»
                  </button>

                  <button
                    onClick={() => handleQuickSelect('classical', 'c_major')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#C4B59D] hover:text-white border border-[#594234] text-xs font-bold transition shadow"
                  >
                    🎹 دو ماژور (C Major دیاتونیک)
                  </button>

                  <button
                    onClick={() => handleQuickSelect('classical', 'a_minor')}
                    className="px-3 py-1.5 rounded-xl bg-[#241A14] hover:bg-[#8B2635] text-[#C4B59D] hover:text-white border border-[#594234] text-xs font-bold transition shadow"
                  >
                    🎼 لا مینور طبیعی (A Natural Minor)
                  </button>
                </div>
              </div>
            )}

            {/* Active Scale Details, Piano & Violin Display */}
            {currentScale && (
              <>
                {/* Scale Information Header Strip */}
                <div className="bg-[#201813] rounded-xl border border-[#594234]/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E5A836] inline-block animate-ping" />
                      <h3 className="text-sm sm:text-base font-black text-[#F5EEDB]">
                        {currentScale.name}
                      </h3>
                      {activeCategory === 'persian' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2635] text-white font-bold">
                          ردیف موسیقی ایرانی
                        </span>
                      )}
                    </div>
                    <p className="text-[#C4B59D]">
                      {currentScale.info}
                    </p>
                  </div>

                  {/* Extra Persian Details & Cents Analysis Button */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {activeCategory === 'persian' && selectedPersianDastgah && (
                      <>
                        <div className="flex items-center gap-1.5 bg-[#140F0C] px-2.5 py-1.5 rounded-lg border border-[#594234]/50">
                          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                          <span className="text-[#A6937C]">شاهد:</span>
                          <span className="font-bold text-[#EDE0C8]">{selectedPersianDastgah.shahedName}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#140F0C] px-2.5 py-1.5 rounded-lg border border-[#594234]/50">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          <span className="text-[#A6937C]">ایست:</span>
                          <span className="font-bold text-[#EDE0C8]">{selectedPersianDastgah.istName}</span>
                        </div>

                        <button
                          onClick={handlePlayCurrentMotif}
                          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow ${
                            isPlayingMotif
                              ? 'bg-[#EF4444] text-white'
                              : 'bg-[#D97706] text-black hover:bg-[#E5A836]'
                          }`}
                        >
                          <span>{isPlayingMotif ? '⏹' : '▶'}</span>
                          <span>شنیدن موتیف درآمد</span>
                        </button>
                      </>
                    )}

                    {/* Quick Cents Analysis Trigger */}
                    <button
                      onClick={() => setIsCentsGuideOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#140F0C] hover:bg-[#201813] text-[#38BDF8] border border-[#0284C7]/50 font-bold transition shadow flex items-center gap-1"
                      title="بررسی دقیق انحراف سنت‌ها و ابعاد پنج‌گانه هرمز فرهت"
                    >
                      <span>🔬</span>
                      <span>تحلیل سنت‌ها</span>
                    </button>
                  </div>
                </div>

                {/* 51-Key Piano Keyboard Component */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#E5A836] px-1">
                    <span>کلاویه‌های ۵۱ گانه پیانو (وسعت ۴ اکتاو کامل + ۳ کلید پایه):</span>
                    <span className="text-[#A6937C]">کلیک برای نواختن مستقیم هر نوت</span>
                  </div>
                  <PianoKeyboard
                    currentScale={currentScale}
                    isPersian={activeCategory === 'persian'}
                    namingMode={namingMode}
                    accidentalMode={accidentalMode}
                    soundTimbre={soundTimbre}
                    articulation={articulation}
                    highlightedMidi={highlightedMidi}
                    onKeyPlayed={handleKeyPlayed}
                  />
                </div>

                {/* Violin Fingerboard Component */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#E5A836] px-1">
                    <span>گریف ویولن، کوک‌های ۴ سیم و پرده‌بندی فواصل:</span>
                    <span className="text-[#A6937C]">سیم ۱ (می/زیر) تا سیم ۴ (سل/بم)</span>
                  </div>
                  <ViolinFingerboard
                    currentScale={currentScale}
                    isPersian={activeCategory === 'persian'}
                    soundTimbre={soundTimbre}
                    articulation={articulation}
                    namingMode={namingMode}
                    onNotePlayed={handleKeyPlayed}
                  />
                </div>
              </>
            )}

            {/* Real-time Status Strip */}
            <div className="bg-[#120E0B] p-3 rounded-xl border border-[#594234]/50 flex items-center justify-between text-xs text-[#A6937C]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                <span className="text-[#EDE0C8] font-bold">{statusText}</span>
              </div>
              <div className="text-[11px] text-[#E5A836]">
                {t.referenceFreq}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Circle of Fifths & Diatonic Engineering */}
        {activeTab === 'circle_fifths' && (
          <CircleOfFifths
            selectedScaleId={selectedClassicalId || 'c_major'}
            onSelectScale={(scaleId: string) => {
              setActiveCategory('classical');
              setSelectedClassicalId(scaleId);
            }}
            soundTimbre={soundTimbre}
          />
        )}

        {/* Tab 3: Comprehensive Daramad & Pishdaramad Gallery */}
        {activeTab === 'daramad_motifs' && (
          <DaramadGallery
            selectedDastgahId={selectedPersianId}
            onSelectDastgah={(dastgah) => {
              setActiveCategory('persian');
              setSelectedPersianId(dastgah.id);
            }}
            soundTimbre={soundTimbre}
            onOpenTreatise={() => setIsTreatiseModalOpen(true)}
          />
        )}

        {/* Tab 4: Upgraded Rhythm Generator & Metronome */}
        {activeTab === 'rhythm_engine' && (
          <RhythmGenerator onOpenTreatise={() => setIsTreatiseModalOpen(true)} />
        )}

        {/* Tab 5: Continuum Acusticum (21:9 Cartography Artwork) */}
        {activeTab === 'continuum_map' && (
          <ContinuumSubmodule />
        )}

        {/* Tab 6: Public Research Blog & Articles */}
        {activeTab === 'blog' && (
          <BlogSection onOpenTreatise={() => setIsTreatiseModalOpen(true)} />
        )}

        {/* Tab 7: Complete Educational Theory Guide & Bibliography */}
        {activeTab === 'theory_guide' && (
          <TheoryGuide onOpenTreatise={() => setIsTreatiseModalOpen(true)} />
        )}
      </main>

      {/* Global Research Treatise Modal (Integrated PDF chapters, downloads, and audio player) */}
      <ResearchTreatiseModal
        isOpen={isTreatiseModalOpen}
        onClose={() => setIsTreatiseModalOpen(false)}
      />

      {/* Microtonal Cents & Farhat Calibration Guide Modal */}
      <MicrotonalCentsGuide
        isOpen={isCentsGuideOpen}
        onClose={() => setIsCentsGuideOpen(false)}
        currentScale={selectedPersianDastgah}
      />

      {/* Admin Panel Modal (Discreet Configuration & Content Management) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Footer Credentials */}
      <footer className="w-full border-t border-[#594234]/50 bg-[#120E0B] py-6 px-4 text-center text-xs text-[#A6937C] space-y-2 font-persian">
        <p className="font-bold text-[#EDE0C8]">
          سامانه «پرده‌نگار» • سامانه انطباق ۵۱ کلاویه پیانو، گریف ویولن، ۱۲ دستگاه ردیف، دایره پنجم‌ها و پیوستار دانوب ({AUTHOR_CREDITS.softwareVersion})
        </p>
        <p className="text-[#E5A836]">
          طراح و مؤلف: <strong>{AUTHOR_CREDITS.author}</strong> ({AUTHOR_CREDITS.authorTitle}) | وب‌سایت: <a href={AUTHOR_CREDITS.authorWebsite} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#FFF5E6]">imanbarzjan.ir</a>
        </p>
        <p className="text-[#D97706]">
          ناشر و صاحب‌امتیاز رسمی: <strong>{AUTHOR_CREDITS.publisher}</strong>
        </p>
        <p className="text-[#34D399]">
          مشاور عالی علمی و هنری: <strong>{AUTHOR_CREDITS.advisor}</strong> ({AUTHOR_CREDITS.advisorTitle})
        </p>

        {/* Discreet & Subtle Admin Panel Link in Footer */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-[10px] text-[#594234] hover:text-[#C4B59D] transition inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 py-1 px-2.5 rounded-lg hover:bg-[#1E1612]"
            title="ورود به سامانه مدیریت استودیو اینامیکس"
          >
            <span>🔒</span>
            <span>{t.adminSubtleLink}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
