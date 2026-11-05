/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • کلاویه‌های ۵۱ گانه پیانو و انطباق با ویولن (از G3 تا A7)
 * طراح و مؤلف: ایمان برزجان | مشاور علمی: استاد بابک بختیاری
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NOTE_NAMES, DastgahScale, ClassicalScale } from '../utils/pardeheNegarData';
import { audioEngine, TimbreType, ArticulationType } from '../utils/audioEngine';

interface KeyModel {
  midi: number;
  pitchClass: number;
  octave: number;
  isBlack: boolean;
  natural?: string;
  sharp?: string;
  flat?: string;
  solfege: string;
  solfegeSharp?: string;
  solfegeFlat?: string;
  whiteIndex: number; // for layout calculation
}

interface PianoKeyboardProps {
  currentScale: DastgahScale | ClassicalScale;
  isPersian: boolean;
  namingMode: 'letter' | 'solfege';
  accidentalMode: 'auto' | 'both' | 'sharp' | 'flat';
  soundTimbre: TimbreType;
  articulation: ArticulationType;
  highlightedMidi: number | null;
  onKeyPlayed: (noteName: string, midi: number, freq: number) => void;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  currentScale,
  isPersian,
  namingMode,
  accidentalMode,
  soundTimbre,
  articulation,
  highlightedMidi,
  onKeyPlayed
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeMidis, setActiveMidis] = useState<Set<number>>(new Set());
  const [sliderVal, setSliderVal] = useState(0);
  const isPointerDownRef = useRef(false);
  const lastTriggeredMidiRef = useRef<number | null>(null);

  // Generate the 51 keys (MIDI 55 = G3 to MIDI 105 = A7)
  const keys: KeyModel[] = [];
  let whiteCount = 0;

  for (let midi = 55; midi <= 105; midi++) {
    const pitchClass = midi % 12;
    const info = NOTE_NAMES[pitchClass];
    const octave = Math.floor(midi / 12) - 1;

    if (!info.isBlack) {
      keys.push({
        midi,
        pitchClass,
        octave,
        isBlack: false,
        natural: info.natural,
        solfege: info.solfege,
        whiteIndex: whiteCount
      });
      whiteCount++;
    } else {
      keys.push({
        midi,
        pitchClass,
        octave,
        isBlack: true,
        sharp: info.sharp,
        flat: info.flat,
        solfege: info.solfege,
        solfegeSharp: info.solfegeSharp,
        solfegeFlat: info.solfegeFlat,
        whiteIndex: whiteCount - 1
      });
    }
  }

  const whiteKeyWidth = 46; // px
  const totalBoardWidth = whiteCount * whiteKeyWidth;

  // Check key role in current dastgah or scale
  const getKeyRole = useCallback((key: KeyModel) => {
    const isChrom = currentScale.id === 'chromatic';
    const inScale = isChrom || currentScale.notes.includes(key.pitchClass);

    if (!inScale) return { inScale: false, role: 'locked' };

    if (isPersian) {
      const pScale = currentScale as DastgahScale;
      const isShahed = pScale.shahedMidi !== undefined && (key.midi === pScale.shahedMidi || (key.midi % 12 === pScale.shahedMidi % 12));
      const isIst = pScale.istMidi !== undefined && (key.midi === pScale.istMidi || (key.midi % 12 === pScale.istMidi % 12));

      if (isShahed && isIst) return { inScale: true, role: 'both' };
      if (isShahed) return { inScale: true, role: 'shahed' };
      if (isIst) return { inScale: true, role: 'ist' };
      return { inScale: true, role: 'scale' };
    } else {
      const cScale = currentScale as ClassicalScale;
      const isTonic = cScale.tonicMidi !== undefined && (key.midi === cScale.tonicMidi || (key.midi % 12 === cScale.tonicMidi % 12));
      if (isTonic) return { inScale: true, role: 'tonic' };
      return { inScale: true, role: 'scale' };
    }
  }, [currentScale, isPersian]);

  // Violin string matching
  const getViolinStringTag = (midi: number): string | null => {
    if ('kookViolin' in currentScale && currentScale.kookViolin) {
      const match = currentScale.kookViolin.find(k => k.midi === midi);
      if (match) return `سیم ${match.stringNumber}`;
    }
    // Default orchestral tuning: E5 (76), A4 (69), D4 (62), G3 (55)
    if (!isPersian) {
      if (midi === 76) return 'سیم ۱';
      if (midi === 69) return 'سیم ۲';
      if (midi === 62) return 'سیم ۳';
      if (midi === 55) return 'سیم ۴';
    }
    return null;
  };

  const triggerNote = useCallback((key: KeyModel) => {
    const { inScale } = getKeyRole(key);
    if (!inScale) return;

    const microCents = ('microCents' in currentScale && currentScale.microCents)
      ? currentScale.microCents[key.pitchClass] || 0
      : 0;

    const freq = audioEngine.midiToFreq(key.midi, microCents);
    audioEngine.playNote(key.midi, microCents, soundTimbre, articulation, articulation === 'staccato' ? 0.22 : 1.6);

    // Visual pulse
    setActiveMidis(prev => new Set(prev).add(key.midi));
    window.setTimeout(() => {
      setActiveMidis(prev => {
        const next = new Set(prev);
        next.delete(key.midi);
        return next;
      });
    }, articulation === 'staccato' ? 180 : 360);

    const displayName = key.isBlack
      ? (accidentalMode === 'flat' ? key.flat : (accidentalMode === 'sharp' ? key.sharp : `${key.sharp}/${key.flat}`))
      : key.natural;
    onKeyPlayed(`${displayName} (اکتاو ${key.octave})`, key.midi, freq);
  }, [getKeyRole, currentScale, soundTimbre, articulation, accidentalMode, onKeyPlayed]);

  // Scroll synchronization
  const handleScroll = () => {
    if (!viewportRef.current) return;
    const maxScroll = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
    if (maxScroll > 0) {
      const pct = (viewportRef.current.scrollLeft / maxScroll) * 100;
      setSliderVal(Math.round(pct));
    }
  };

  const jumpToMidi = (targetMidi: number) => {
    const targetKey = keys.find(k => k.midi === targetMidi);
    if (!targetKey || !viewportRef.current) return;
    const targetLeft = targetKey.whiteIndex * whiteKeyWidth;
    viewportRef.current.scrollTo({ left: targetLeft - 80, behavior: 'smooth' });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    if (!viewportRef.current) return;
    const maxScroll = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
    viewportRef.current.scrollLeft = (val / 100) * maxScroll;
  };

  const stepScroll = (delta: number) => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  // Sync external highlight
  useEffect(() => {
    if (highlightedMidi !== null) {
      setActiveMidis(prev => new Set(prev).add(highlightedMidi));
      const tid = window.setTimeout(() => {
        setActiveMidis(prev => {
          const next = new Set(prev);
          next.delete(highlightedMidi);
          return next;
        });
      }, 350);
      return () => window.clearTimeout(tid);
    }
  }, [highlightedMidi]);

  // Pointer dragging across keys
  const getKeyFromPoint = (clientX: number, clientY: number): KeyModel | null => {
    const el = document.elementFromPoint(clientX, clientY);
    const keyEl = el ? el.closest('[data-midi]') : null;
    if (!keyEl) return null;
    const midi = Number(keyEl.getAttribute('data-midi'));
    return keys.find(k => k.midi === midi) || null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    const key = getKeyFromPoint(e.clientX, e.clientY);
    if (key) {
      lastTriggeredMidiRef.current = key.midi;
      triggerNote(key);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const key = getKeyFromPoint(e.clientX, e.clientY);
    if (key && key.midi !== lastTriggeredMidiRef.current) {
      lastTriggeredMidiRef.current = key.midi;
      triggerNote(key);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    lastTriggeredMidiRef.current = null;
  };

  return (
    <div className="w-full space-y-3">
      {/* Octave Jump Navigation & Slider */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1C1612] p-2.5 rounded-xl border border-[#594234]/50 shadow-md">
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => stepScroll(-240)}
            className="px-2.5 py-1 text-xs font-bold rounded bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234]/60 transition"
            title="کلاویه‌های بم‌تر"
          >
            ▶ بم‌تر
          </button>

          <button onClick={() => jumpToMidi(55)} className="px-2 py-1 text-xs rounded bg-[#2A201A] hover:bg-[#D97706] hover:text-black text-[#EDE0C8] font-bold border border-[#594234]/40 transition">اکتاو ۳</button>
          <button onClick={() => jumpToMidi(60)} className="px-2 py-1 text-xs rounded bg-[#2A201A] hover:bg-[#D97706] hover:text-black text-[#EDE0C8] font-bold border border-[#594234]/40 transition">اکتاو ۴ (میانی)</button>
          <button onClick={() => jumpToMidi(72)} className="px-2 py-1 text-xs rounded bg-[#2A201A] hover:bg-[#D97706] hover:text-black text-[#EDE0C8] font-bold border border-[#594234]/40 transition">اکتاو ۵</button>
          <button onClick={() => jumpToMidi(84)} className="px-2 py-1 text-xs rounded bg-[#2A201A] hover:bg-[#D97706] hover:text-black text-[#EDE0C8] font-bold border border-[#594234]/40 transition">اکتاو ۶</button>
          <button onClick={() => jumpToMidi(96)} className="px-2 py-1 text-xs rounded bg-[#2A201A] hover:bg-[#D97706] hover:text-black text-[#EDE0C8] font-bold border border-[#594234]/40 transition">اکتاو ۷ (اوج)</button>

          <button
            onClick={() => stepScroll(240)}
            className="px-2.5 py-1 text-xs font-bold rounded bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234]/60 transition"
            title="کلاویه‌های زیرتر"
          >
            زیرتر ◀
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-64">
          <span className="text-xs text-[#C4B59D] font-bold whitespace-nowrap">موقعیت نوار:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full accent-[#D97706] cursor-pointer"
          />
        </div>
      </div>

      {/* Piano Viewport */}
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full overflow-x-auto overflow-y-hidden rounded-2xl border-4 border-[#3D2C20] bg-[#120E0B] p-2.5 shadow-2xl relative select-none cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-[#594234] scrollbar-track-[#1A130E]"
        style={{ touchAction: 'none' }}
      >
        <div
          className="relative h-[230px] flex"
          style={{ width: `${totalBoardWidth}px` }}
        >
          {/* White keys */}
          {keys.filter(k => !k.isBlack).map(k => {
            const { inScale, role } = getKeyRole(k);
            const stringTag = getViolinStringTag(k.midi);
            const isActive = activeMidis.has(k.midi);

            // Microtonal label
            const microLabel = ('microLabels' in currentScale && currentScale.microLabels)
              ? currentScale.microLabels[k.pitchClass]
              : null;

            return (
              <div
                key={k.midi}
                data-midi={k.midi}
                className={`absolute top-0 rounded-b-lg border border-[#A6937C] transition-all flex flex-col justify-end items-center pb-2.5 text-center cursor-pointer shadow-sm
                  ${!inScale ? 'opacity-35 bg-[#B8ABA0] saturate-50' : ''}
                  ${isActive ? 'bg-[#FDE68A] shadow-inner scale-[0.98]' : 'bg-gradient-to-b from-[#FAF7F0] via-[#F3EDE2] to-[#E5DCCB] hover:brightness-105'}
                `}
                style={{
                  left: `${k.whiteIndex * whiteKeyWidth}px`,
                  width: `${whiteKeyWidth}px`,
                  height: '220px',
                  zIndex: 10
                }}
              >
                {/* Violin String Badge */}
                {stringTag && (
                  <div className="absolute top-2 w-full px-1">
                    <span className="inline-block w-full py-0.5 text-[9px] font-black rounded bg-[#8B2635] text-[#F5EEDB] shadow border border-[#F5EEDB]/40">
                      {stringTag}
                    </span>
                  </div>
                )}

                {/* Role indicator badge */}
                {role === 'shahed' && (
                  <span className="mb-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#8B5CF6] text-white shadow">
                    شاهد
                  </span>
                )}
                {role === 'ist' && (
                  <span className="mb-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#10B981] text-white shadow">
                    ایست
                  </span>
                )}
                {role === 'both' && (
                  <span className="mb-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#0EA5E9] text-white shadow">
                    شاهد/ایست
                  </span>
                )}
                {role === 'tonic' && (
                  <span className="mb-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-black shadow">
                    پایه (I)
                  </span>
                )}

                {/* Microtonal label */}
                {microLabel ? (
                  <span className="text-[10px] font-black text-[#B45309]">
                    {namingMode === 'letter' ? microLabel.letter : microLabel.solfege}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#1E293B]">
                    {namingMode === 'letter' ? `${k.natural}${k.octave}` : k.solfege}
                  </span>
                )}
              </div>
            );
          })}

          {/* Black keys */}
          {keys.filter(k => k.isBlack).map(k => {
            const { inScale, role } = getKeyRole(k);
            const stringTag = getViolinStringTag(k.midi);
            const isActive = activeMidis.has(k.midi);
            const blackWidth = 28;
            const leftPos = (k.whiteIndex * whiteKeyWidth) + whiteKeyWidth - (blackWidth / 2);

            const microLabel = ('microLabels' in currentScale && currentScale.microLabels)
              ? currentScale.microLabels[k.pitchClass]
              : null;

            return (
              <div
                key={k.midi}
                data-midi={k.midi}
                className={`absolute top-0 rounded-b-md border border-black/80 transition-all flex flex-col justify-end items-center pb-2 text-center cursor-pointer shadow-lg
                  ${!inScale ? 'opacity-30 bg-[#2D2825]' : ''}
                  ${isActive ? 'bg-[#D97706] scale-[0.97]' : 'bg-gradient-to-b from-[#2B231D] via-[#1F1915] to-[#120E0B] hover:brightness-125'}
                `}
                style={{
                  left: `${leftPos}px`,
                  width: `${blackWidth}px`,
                  height: '138px',
                  zIndex: 20
                }}
              >
                {/* String tag on black key */}
                {stringTag && (
                  <div className="absolute top-1.5 w-full px-0.5">
                    <span className="inline-block w-full py-0.5 text-[8px] font-black rounded bg-[#8B2635] text-white">
                      {stringTag}
                    </span>
                  </div>
                )}

                {/* Role badge */}
                {role === 'shahed' && (
                  <span className="mb-1 text-[8px] font-black px-1 py-0.5 rounded-full bg-[#8B5CF6] text-white">
                    شاهد
                  </span>
                )}
                {role === 'ist' && (
                  <span className="mb-1 text-[8px] font-black px-1 py-0.5 rounded-full bg-[#10B981] text-white">
                    ایست
                  </span>
                )}
                {role === 'both' && (
                  <span className="mb-1 text-[8px] font-black px-1 py-0.5 rounded-full bg-[#0EA5E9] text-white">
                    شاهد/ایست
                  </span>
                )}
                {role === 'tonic' && (
                  <span className="mb-1 text-[8px] font-black px-1 py-0.5 rounded-full bg-[#F59E0B] text-black">
                    I
                  </span>
                )}

                {/* Accidental text */}
                {microLabel ? (
                  <span className="text-[9px] font-black text-[#FDE68A]">
                    {namingMode === 'letter' ? microLabel.letter : microLabel.solfege}
                  </span>
                ) : (
                  <span className="text-[9.5px] font-semibold text-[#EDE0C8]">
                    {accidentalMode === 'flat'
                      ? k.flat
                      : accidentalMode === 'sharp'
                      ? k.sharp
                      : `${k.sharp || ''}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
