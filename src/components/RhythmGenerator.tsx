/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • مولد ریتم و ضرب‌آهنگ‌های اصیل ایران و پیوستار دانوب
 * شبیه‌سازی تمبک، دف، توآکا، و مترونوم خالص استودیویی (Cubase/DAW Standard Click)
 * همراه با چراغ‌های بصری (LED) و هجاهای آموزشی ضرب‌ها
 * مؤلف: ایمان برزجان | استودیو اینامیکس (EnamiX)
 */

import React, { useState, useEffect, useRef } from 'react';
import { RHYTHM_PRESETS, RhythmPattern } from '../utils/pardeheNegarData';
import { audioEngine } from '../utils/audioEngine';

interface RhythmGeneratorProps {
  onOpenTreatise?: () => void;
}

export type PlaybackSoundMode = 'both' | 'metronome_only' | 'percussion_only';

export const RhythmGenerator: React.FC<RhythmGeneratorProps> = ({ onOpenTreatise }) => {
  const [selectedPattern, setSelectedPattern] = useState<RhythmPattern>(RHYTHM_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState<number>(RHYTHM_PRESETS[0].tempoDefault);
  const [activeStep, setActiveStep] = useState<number>(-1);

  // Sound playback mode: both, metronome only, or percussion only
  const [soundMode, setSoundMode] = useState<PlaybackSoundMode>('both');
  const [percussionVolume, setPercussionVolume] = useState<number>(0.85);
  const [metronomeVolume, setMetronomeVolume] = useState<number>(0.9);

  const timerRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  // Update volumes
  useEffect(() => {
    audioEngine.setMetronomeVolume(metronomeVolume);
  }, [metronomeVolume]);

  useEffect(() => {
    audioEngine.setVolume(percussionVolume);
  }, [percussionVolume]);

  // Update tempo when pattern changes
  const handleSelectPattern = (pat: RhythmPattern) => {
    setSelectedPattern(pat);
    setTempo(pat.tempoDefault);
    currentStepRef.current = 0;
    setActiveStep(-1);
  };

  // Metronome tick loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveStep(-1);
      return;
    }

    const totalSteps = selectedPattern.hits.length;
    // Step duration in ms: in 6/8, 7/8 or 2/4, each step represents the subdivision beat
    const stepDurationMs = (60 / tempo) * 1000 * 0.5;

    timerRef.current = window.setInterval(() => {
      const stepIdx = currentStepRef.current % totalSteps;
      const hit = selectedPattern.hits[stepIdx];

      if (hit) {
        const isAccentFirst = stepIdx === 0 || hit.accent === 'strong';

        // 1. Play Pure Metronome Click if enabled
        if (soundMode === 'both' || soundMode === 'metronome_only') {
          audioEngine.playMetronomeClick(stepIdx === 0 ? 'high' : 'low', metronomeVolume);
        }

        // 2. Play Percussion if enabled
        if (soundMode === 'both' || soundMode === 'percussion_only') {
          const percVol = hit.accent === 'strong' ? 0.95 : (hit.accent === 'medium' ? 0.72 : 0.45);
          audioEngine.playPercussion(hit.sound, percVol * percussionVolume);
        }
      }

      setActiveStep(stepIdx);
      currentStepRef.current = (stepIdx + 1) % totalSteps;
    }, stepDurationMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, tempo, selectedPattern, soundMode, metronomeVolume, percussionVolume]);

  const togglePlay = () => {
    audioEngine.initContext();
    setIsPlaying(prev => !prev);
  };

  const handleTapTempo = () => {
    const now = Date.now();
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }
    if (tapTimesRef.current.length >= 2) {
      const diffs = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        diffs.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const calculatedBpm = Math.round(60000 / avgMs);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setTempo(calculatedBpm);
      }
    }
  };

  return (
    <div className="w-full bg-[#181310] rounded-2xl border border-[#594234]/70 p-5 sm:p-6 shadow-2xl space-y-6 font-persian" dir="rtl">
      {/* Title & Master Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#594234]/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥁</span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5EEDB]">
              مولد ریتم، مترونوم خالص استودیویی و ضرب‌آهنگ‌های سنتی
            </h3>
            <p className="text-xs text-[#C4B59D]">
              شبیه‌سازی تمبک، دف، توآکای دانوب و کلیک استاندارد DAW (مانند کیوبیس) با چراغ‌های همگام و هجاهای آموزشی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenTreatise && (
            <button
              onClick={onOpenTreatise}
              className="px-3 py-2 rounded-xl bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <span>📖</span>
              <span>تئوری ریتم در رساله</span>
            </button>
          )}

          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition shadow-lg ${
              isPlaying
                ? 'bg-[#EF4444] text-white hover:bg-[#DC2626] ring-2 ring-white/50 animate-pulse'
                : 'bg-[#8B2635] text-[#FFF5E6] hover:bg-[#A32D3F] border border-[#E5A836]'
            }`}
          >
            <span>{isPlaying ? '⏹ توقف ریتم' : '▶ آغاز ضرب‌آهنگ'}</span>
          </button>
        </div>
      </div>

      {/* Sound Output Mode Switcher: Pure Metronome vs Percussion */}
      <div className="p-3.5 bg-[#201914] rounded-xl border border-[#594234]/60 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E5A836]">حالت پخش صوتی:</span>
            <div className="flex items-center gap-1.5 bg-[#140F0C] p-1 rounded-lg border border-[#594234]/50">
              <button
                onClick={() => setSoundMode('both')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  soundMode === 'both'
                    ? 'bg-[#8B2635] text-white'
                    : 'text-[#C4B59D] hover:text-white'
                }`}
              >
                همگام (تمبک + مترونوم)
              </button>

              <button
                onClick={() => setSoundMode('metronome_only')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                  soundMode === 'metronome_only'
                    ? 'bg-[#D97706] text-black font-black'
                    : 'text-[#C4B59D] hover:text-white'
                }`}
              >
                <span>⏱</span>
                <span>فقط مترونوم خالص (Click)</span>
              </button>

              <button
                onClick={() => setSoundMode('percussion_only')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  soundMode === 'percussion_only'
                    ? 'bg-[#8B2635] text-white'
                    : 'text-[#C4B59D] hover:text-white'
                }`}
              >
                فقط سازهای کوبه‌ای
              </button>
            </div>
          </div>

          {/* Volume channel adjustments */}
          <div className="flex items-center gap-4 text-xs text-[#C4B59D]">
            {(soundMode === 'both' || soundMode === 'metronome_only') && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#E5A836]">ولوم مترونوم:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={metronomeVolume}
                  onChange={(e) => setMetronomeVolume(Number(e.target.value))}
                  className="w-20 accent-[#E5A836] cursor-pointer"
                  title="بلندی صدای کلیک مترونوم"
                />
              </div>
            )}

            {(soundMode === 'both' || soundMode === 'percussion_only') && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#E5A836]">ولوم تمبک/دف:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={percussionVolume}
                  onChange={(e) => setPercussionVolume(Number(e.target.value))}
                  className="w-20 accent-[#8B2635] cursor-pointer"
                  title="بلندی صدای سازهای کوبه‌ای"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Category Switcher */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#E5A836] block">انتخاب الگوی ریتمیک اصیل:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {RHYTHM_PRESETS.map(pat => {
            const isSelected = selectedPattern.id === pat.id;
            return (
              <button
                key={pat.id}
                onClick={() => handleSelectPattern(pat)}
                className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-[#2A201A] border-[#E5A836] text-[#FFF5E6] ring-1 ring-[#E5A836]/40'
                    : 'bg-[#140F0C] border-[#594234]/40 text-[#C4B59D] hover:bg-[#1E1712]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5EEDB] truncate">{pat.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1612] text-[#D97706] border border-[#594234]/60">
                    {pat.timeSignature}
                  </span>
                </div>
                <div className="text-[10.5px] text-[#A6937C] truncate">
                  {pat.category === 'persian' ? '🇮🇷 وزن ردیف ایران' : '🇷🇴 لنگ اکساک دانوب'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Animated Step Sequencer with LED Pulse Indicators and Counting Text */}
      <div className="bg-[#140F0C] rounded-xl border border-[#594234]/60 p-4 sm:p-5 space-y-4">
        {/* Metrical Info and Counting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#594234]/40 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[#E5A836] font-bold text-sm">میزان‌بندی: {selectedPattern.timeSignature}</span>
              <span className="text-[#C4B59D] text-xs">({selectedPattern.description})</span>
            </div>
            <div className="text-xs text-[#E5A836] font-mono font-bold tracking-wide">
              شمارش و هجاهای آموزشی: <span className="text-[#FFF5E6] bg-[#2A201A] px-2 py-0.5 rounded border border-[#594234]/60">{selectedPattern.countingText}</span>
            </div>
          </div>
          <div className="text-left text-[#A6937C] text-[11px] whitespace-nowrap">
            تقسیمات ضربی: {selectedPattern.subdivisions.join(' + ')}
          </div>
        </div>

        {/* Pulse Grid with Glowing LED Lights */}
        <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 pt-1 pb-2">
          {selectedPattern.hits.map((hit, idx) => {
            const isStepActive = activeStep === idx;
            const isStrong = hit.accent === 'strong';
            const isMedium = hit.accent === 'medium';
            const syllable = selectedPattern.mnemonicSyllables[idx] || '';

            let soundLabel = 'بک';
            let soundBg = 'border-[#594234]';
            if (hit.sound === 'tombak_tom') {
              soundLabel = 'تُم (بم)';
              soundBg = 'border-[#8B2635]';
            } else if (hit.sound === 'daf') {
              soundLabel = 'دف';
              soundBg = 'border-[#D97706]';
            } else if (hit.sound === 'clapper') {
              soundLabel = 'توآکا';
              soundBg = 'border-[#10B981]';
            }

            return (
              <div
                key={idx}
                className={`rounded-xl border p-2.5 text-center transition-all flex flex-col justify-between items-center h-28 relative ${soundBg} ${
                  isStepActive
                    ? 'bg-[#E5A836] text-black scale-105 shadow-xl ring-2 ring-[#FFF5E6]'
                    : isStrong
                    ? 'bg-[#2A201A] text-[#FFF5E6]'
                    : isMedium
                    ? 'bg-[#1F1813] text-[#EDE0C8]'
                    : 'bg-[#17120E] text-[#A6937C]'
                }`}
              >
                {/* Step number */}
                <span className="text-[10px] font-mono font-black">
                  ضرب {idx + 1}
                </span>

                {/* LED Visual Indicator Light */}
                <div className="relative flex items-center justify-center my-1">
                  <div
                    className={`w-5 h-5 rounded-full transition-all duration-75 flex items-center justify-center ${
                      isStepActive
                        ? 'bg-[#FFF5E6] ring-4 ring-[#E5A836] shadow-[0_0_15px_#E5A836] scale-125'
                        : isStrong
                        ? 'bg-[#EF4444] shadow-[0_0_6px_#EF4444]'
                        : isMedium
                        ? 'bg-[#F59E0B] shadow-[0_0_4px_#F59E0B]'
                        : 'bg-[#374151]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isStepActive ? 'bg-[#D97706]' : 'bg-black/40'}`} />
                  </div>
                </div>

                {/* Educational Mnemonic Syllable */}
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-black tracking-tight ${
                    isStepActive ? 'text-black' : (isStrong ? 'text-[#E5A836]' : 'text-[#EDE0C8]')
                  }`}>
                    «{syllable}»
                  </span>
                  <span className={`text-[9.5px] mt-0.5 ${isStepActive ? 'text-black/80 font-bold' : 'text-[#A6937C]'}`}>
                    {soundLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tempo Slider & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#1F1914] p-3.5 rounded-xl border border-[#594234]/50">
        <div className="sm:col-span-8 flex items-center gap-3">
          <span className="text-xs font-bold text-[#C4B59D] whitespace-nowrap">سرعت تمپو (BPM):</span>
          <input
            type="range"
            min="45"
            max="220"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full accent-[#E5A836] cursor-pointer"
          />
          <span className="font-mono text-base font-black text-[#E5A836] w-12 text-left">
            {tempo}
          </span>
        </div>

        <div className="sm:col-span-4 flex items-center justify-end gap-2">
          <button
            onClick={handleTapTempo}
            className="px-3 py-1.5 rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#EDE0C8] border border-[#594234] text-xs font-bold transition shadow"
            title="چند بار با ریتم دلخواه کلیک کنید"
          >
            👆 تپ تمپو (Tap)
          </button>

          <button
            onClick={() => setTempo(selectedPattern.tempoDefault)}
            className="px-2.5 py-1.5 rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#A6937C] border border-[#594234] text-xs transition"
            title="بازنشانی به تمپوی پیش‌فرض"
          >
            پیش‌فرض
          </button>
        </div>
      </div>
    </div>
  );
};
