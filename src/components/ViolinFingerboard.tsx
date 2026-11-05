/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • گریف و انگشت‌گذاری تعاملی ویولن (Violin Fingerboard)
 * نمایش بصری ۴ سیم، پوزیسیون‌های اول تا هفتم، انطباق با ۵۱ کلاویه پیانو و ردیف
 * طراح و مؤلف: ایمان برزجان | مشاور علمی: استاد بابک بختیاری
 */

import React, { useState } from 'react';
import { DastgahScale, ClassicalScale, ViolinStringKook } from '../utils/pardeheNegarData';
import { audioEngine, TimbreType, ArticulationType } from '../utils/audioEngine';

interface ViolinFingerboardProps {
  currentScale: DastgahScale | ClassicalScale;
  isPersian: boolean;
  soundTimbre: TimbreType;
  articulation: ArticulationType;
  namingMode: 'letter' | 'solfege';
  onNotePlayed: (noteName: string, midi: number, freq: number) => void;
}

interface FretDot {
  stringIdx: number; // 0 (string 1, highest) to 3 (string 4, lowest)
  semitonesFromNut: number; // 0 to 24 semitones up the fingerboard
  midi: number;
  pitchClass: number;
  positionName: string;
  fingerSuggestion: string;
}

export const ViolinFingerboard: React.FC<ViolinFingerboardProps> = ({
  currentScale,
  isPersian,
  soundTimbre,
  articulation,
  namingMode,
  onNotePlayed
}) => {
  const [activeFingerDot, setActiveFingerDot] = useState<string | null>(null);

  // Get active strings kook
  const kookStrings: ViolinStringKook[] = ('kookViolin' in currentScale && currentScale.kookViolin)
    ? currentScale.kookViolin
    : [
        { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
        { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
        { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
        { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
      ];

  // Positions along the fingerboard (0 to 19 semitones, covering up to 7th position)
  const semitoneSteps = 19;

  const getPositionLabel = (step: number): string => {
    if (step === 0) return 'سیم باز';
    if (step <= 4) return 'پوزیسیون ۱';
    if (step <= 7) return 'پوزیسیون ۲';
    if (step <= 10) return 'پوزیسیون ۳';
    if (step <= 13) return 'پوزیسیون ۴';
    if (step <= 16) return 'پوزیسیون ۵';
    return 'پوزیسیون ۶-۷';
  };

  const getFingerLabel = (step: number): string => {
    if (step === 0) return '۰ (باز)';
    if (step === 1 || step === 2) return 'انگشت ۱';
    if (step === 3 || step === 4) return 'انگشت ۲';
    if (step === 5 || step === 6) return 'انگشت ۳';
    if (step === 7) return 'انگشت ۴';
    return `پوزیسیون بالاتر (+${step})`;
  };

  const handleDotClick = (stringInfo: ViolinStringKook, semitones: number) => {
    const midi = stringInfo.midi + semitones;
    const pitchClass = midi % 12;

    const microCents = ('microCents' in currentScale && currentScale.microCents)
      ? currentScale.microCents[pitchClass] || 0
      : 0;

    const freq = audioEngine.midiToFreq(midi, microCents);
    audioEngine.playNote(midi, microCents, soundTimbre === 'piano' ? 'violin' : soundTimbre, articulation, 1.5);

    const dotId = `${stringInfo.stringNumber}-${semitones}`;
    setActiveFingerDot(dotId);
    window.setTimeout(() => setActiveFingerDot(null), 400);

    const noteNamesFa = ['دو', 'دو دیز', 'ر', 'ر دیز', 'می', 'فا', 'فا دیز', 'سل', 'سل دیز', 'لا', 'لا دیز', 'سی'];
    const noteNamesEn = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
    const name = namingMode === 'letter' ? noteNamesEn[pitchClass] : noteNamesFa[pitchClass];

    onNotePlayed(`ویولن - سیم ${stringInfo.stringNumber}: ${name} (گام ${getPositionLabel(semitones)})`, midi, freq);
  };

  return (
    <div className="w-full bg-[#1A1410] rounded-2xl border border-[#594234]/60 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#594234]/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎻</span>
            <h3 className="text-base font-bold text-[#F5EEDB]">
              نمای افقی گریف و انگشت‌گذاری ویولن (Violin Fingerboard)
            </h3>
          </div>
          <p className="text-xs text-[#C4B59D]">
            انطباق مستقیم ۴ سیم ویولن با درجات ردیف، نقاط شاهد و ایست، و پوزیسیون‌های اول تا هفتم (روی نقاط کلیک کنید تا صدا پخش شود)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1 text-[#EDE0C8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] inline-block shadow"></span>
            نوت شاهد
          </span>
          <span className="flex items-center gap-1 text-[#EDE0C8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block shadow"></span>
            نوت ایست
          </span>
          <span className="flex items-center gap-1 text-[#EDE0C8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] inline-block shadow"></span>
            شاهد و ایست
          </span>
          <span className="flex items-center gap-1 text-[#EDE0C8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block shadow"></span>
            درجات گام
          </span>
        </div>
      </div>

      {/* Interactive Fingerboard Canvas (Horizontal Scrollable) */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#594234] scrollbar-track-[#120E0B] py-2">
        <div className="min-w-[920px] bg-gradient-to-r from-[#17120E] via-[#211914] to-[#120E0B] rounded-xl border-2 border-[#594234] p-3 relative shadow-inner">
          {/* Position Bracket Indicators at Top */}
          <div className="grid grid-cols-[100px_repeat(19,1fr)] gap-1 text-center text-[10px] text-[#A6937C] font-mono border-b border-[#594234]/30 pb-1.5 mb-2">
            <div className="font-bold text-[#E5A836]">شیطانک / سیم</div>
            {Array.from({ length: semitoneSteps }).map((_, stepIdx) => {
              const semitone = stepIdx + 1;
              const isMajorPosition = [1, 3, 5, 7, 8, 10, 12].includes(semitone);
              return (
                <div
                  key={semitone}
                  className={`text-center font-bold ${isMajorPosition ? 'text-[#E5A836]' : 'text-[#7D6B5C]'}`}
                >
                  {semitone === 12 ? 'اکتاو' : `پ${semitone}`}
                </div>
              );
            })}
          </div>

          {/* 4 Strings Rows */}
          <div className="space-y-3">
            {kookStrings.map((str, strIdx) => {
              // String gauges: string 1 is thinnest (1.2px silver), string 4 is thickest (3.5px wound copper)
              const stringThicknesses = [1.5, 2.0, 2.8, 3.8];
              const stringColors = ['#E2E8F0', '#CBD5E1', '#E5A836', '#B45309'];

              return (
                <div
                  key={str.stringNumber}
                  className="grid grid-cols-[100px_repeat(19,1fr)] items-center gap-1 relative py-1"
                >
                  {/* Metal String Horizontal Line Overlay */}
                  <div
                    className="absolute left-[100px] right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 shadow-sm"
                    style={{
                      height: `${stringThicknesses[strIdx]}px`,
                      backgroundColor: stringColors[strIdx],
                      opacity: 0.8
                    }}
                  />

                  {/* Nut / Open String Button */}
                  <button
                    onClick={() => handleDotClick(str, 0)}
                    className="z-10 flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#2A201A] hover:bg-[#8B2635] text-[#F5EEDB] border border-[#594234] transition shadow text-xs font-bold text-right"
                    title={`کوک سیم ${str.stringNumber}: ${str.name} (${str.freq}Hz)`}
                  >
                    <span>سیم {str.stringNumber}</span>
                    <span className="font-mono text-[10px] text-[#D97706]">{str.noteName}</span>
                  </button>

                  {/* 19 Semitone Fret Positions */}
                  {Array.from({ length: semitoneSteps }).map((_, stepIdx) => {
                    const semitone = stepIdx + 1;
                    const midi = str.midi + semitone;
                    const pitchClass = midi % 12;
                    const inScale = currentScale.id === 'chromatic' || currentScale.notes.includes(pitchClass);

                    const dotId = `${str.stringNumber}-${semitone}`;
                    const isActive = activeFingerDot === dotId;

                    if (!inScale) {
                      return (
                        <div key={semitone} className="h-7 flex items-center justify-center z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3D2E24]/60" />
                        </div>
                      );
                    }

                    // Check if shahed or ist
                    let badgeColor = 'bg-[#D97706] text-black border-[#FDE68A]';
                    let roleTitle = 'درجه گام';

                    if (isPersian) {
                      const pScale = currentScale as DastgahScale;
                      const isShahed = pScale.shahedMidi !== undefined && (midi === pScale.shahedMidi || midi % 12 === pScale.shahedMidi % 12);
                      const isIst = pScale.istMidi !== undefined && (midi === pScale.istMidi || midi % 12 === pScale.istMidi % 12);

                      if (isShahed && isIst) {
                        badgeColor = 'bg-[#0EA5E9] text-white border-white';
                        roleTitle = 'هم شاهد و هم ایست';
                      } else if (isShahed) {
                        badgeColor = 'bg-[#8B5CF6] text-white border-white';
                        roleTitle = 'نوت شاهد';
                      } else if (isIst) {
                        badgeColor = 'bg-[#10B981] text-white border-white';
                        roleTitle = 'نوت ایست';
                      }
                    }

                    const noteNamesFa = ['دو', 'دو♯', 'ر', 'ر♯', 'می', 'فا', 'فا♯', 'سل', 'سل♯', 'لا', 'لا♯', 'سی'];
                    const noteNamesEn = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
                    const noteLabel = namingMode === 'letter' ? noteNamesEn[pitchClass] : noteNamesFa[pitchClass];

                    return (
                      <div key={semitone} className="h-7 flex items-center justify-center z-10">
                        <button
                          onClick={() => handleDotClick(str, semitone)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border transition-all transform hover:scale-125 shadow-md
                            ${badgeColor}
                            ${isActive ? 'scale-150 ring-2 ring-[#FFF5E6]' : ''}
                          `}
                          title={`سیم ${str.stringNumber} | ${getFingerLabel(semitone)} | ${roleTitle} (${noteLabel})`}
                        >
                          {noteLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Fret Position Markers (Dots along the neck at 3, 5, 7, 9, 12, 15) */}
          <div className="grid grid-cols-[100px_repeat(19,1fr)] gap-1 text-center pt-2 border-t border-[#594234]/30 mt-2">
            <div></div>
            {Array.from({ length: semitoneSteps }).map((_, stepIdx) => {
              const semitone = stepIdx + 1;
              const hasInlayDot = [3, 5, 7, 9, 15, 17].includes(semitone);
              const isDoubleDot = semitone === 12;

              return (
                <div key={semitone} className="flex justify-center items-center h-4">
                  {isDoubleDot && (
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5A836] shadow" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5A836] shadow" />
                    </div>
                  )}
                  {hasInlayDot && !isDoubleDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A6937C]/80" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
