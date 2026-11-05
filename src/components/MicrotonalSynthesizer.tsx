/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MODAL_CONTINUUM_SYSTEMS,
  ModalContinuumSystem,
  centsToFrequency,
} from '../utils/acousticMath';
import { audioEngine } from '../utils/audioEngine';

interface MicrotonalSynthesizerProps {
  onPlayingStateChange?: (isPlaying: boolean) => void;
  initialSystemId?: string;
}

export const MicrotonalSynthesizer: React.FC<MicrotonalSynthesizerProps> = ({
  onPlayingStateChange,
  initialSystemId = 'dastgah-shur',
}) => {
  const [selectedSystem, setSelectedSystem] = useState<ModalContinuumSystem>(
    MODAL_CONTINUUM_SYSTEMS.find(s => s.id === initialSystemId) || MODAL_CONTINUUM_SYSTEMS[0]
  );
  const [selectedTimbre, setSelectedTimbre] = useState<'santur' | 'tambal' | 'setar' | 'bouzouki' | 'ney' | 'caval'>('santur');
  const [activeNoteName, setActiveNoteName] = useState<string | null>(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const cancelPlaybackRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const sys = MODAL_CONTINUUM_SYSTEMS.find(s => s.id === initialSystemId);
    if (sys) setSelectedSystem(sys);
  }, [initialSystemId]);

  // Real-time Canvas Waveform Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const analyser = audioEngine.getAnalyser();
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : new Uint8Array(256);

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Antique parchment grid background
      ctx.fillStyle = '#F5EEDB';
      ctx.fillRect(0, 0, width, height);

      // Fine grid lines
      ctx.strokeStyle = 'rgba(89, 66, 52, 0.15)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(120, 29, 34, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#D97706';
        ctx.shadowColor = '#E5A836';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.beginPath();
        const t = performance.now() * 0.002;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.03 + t) * 12 + Math.sin(x * 0.08 - t) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePlaySingleNote = (semitones: number, centOffset: number, noteName: string) => {
    setActiveNoteName(noteName);
    audioEngine.playMicrotone(semitones, centOffset, selectedTimbre, 2.0);
    setTimeout(() => {
      setActiveNoteName(null);
    }, 1200);
  };

  const handlePlayScaleSequence = () => {
    if (isPlayingMelody) {
      if (cancelPlaybackRef.current) cancelPlaybackRef.current();
      setIsPlayingMelody(false);
      setActiveNoteName(null);
      if (onPlayingStateChange) onPlayingStateChange(false);
      return;
    }

    setIsPlayingMelody(true);
    if (onPlayingStateChange) onPlayingStateChange(true);

    const cancel = audioEngine.playScaleDemonstration(
      selectedSystem.id,
      (noteName) => {
        setActiveNoteName(noteName);
      },
      () => {
        setIsPlayingMelody(false);
        setActiveNoteName(null);
        if (onPlayingStateChange) onPlayingStateChange(false);
      }
    );

    cancelPlaybackRef.current = cancel;
  };

  useEffect(() => {
    return () => {
      if (cancelPlaybackRef.current) {
        cancelPlaybackRef.current();
      }
    };
  }, []);

  const timbrePersianNames: Record<string, string> = {
    santur: 'سنتور',
    tambal: 'تسامبال',
    setar: 'سه‌تار',
    bouzouki: 'بوزوکی',
    ney: 'نی',
    caval: 'کاوال',
  };

  return (
    <div className="w-full bg-[#1F1915] border border-[#594234]/60 rounded-xl p-5 shadow-2xl text-[#EDE0C8] text-right font-persian" dir="rtl">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#594234]/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D97706]">
              سینتی‌سایزر ریزپرده‌ای و تک‌وتر (مونوکورد)
            </span>
            <span className="text-xs text-[#594234]">·</span>
            <span className="text-xs text-[#E2D1B3]">موتور صوتی وب‌آدیو</span>
          </div>
          <h3 className="text-2xl font-bold text-[#F5EEDB] tracking-wide mt-1">
            {selectedSystem.persianName}
          </h3>
          <p className="text-sm text-[#C4B59D] mt-0.5">
            خاستگاه: {selectedSystem.originRegion} · سنت: {selectedSystem.culturalSphere} ({selectedSystem.historicalEra})
          </p>
        </div>

        {/* Timbre & Mode Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timbre Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#15110E] border border-[#594234]/60 rounded-lg">
            {(['santur', 'tambal', 'setar', 'bouzouki', 'ney', 'caval'] as const).map(timbre => (
              <button
                key={timbre}
                onClick={() => setSelectedTimbre(timbre)}
                className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap ${
                  selectedTimbre === timbre
                    ? 'bg-[#781D22] text-[#F5EEDB] shadow-sm font-bold'
                    : 'text-[#C4B59D] hover:text-[#F5EEDB]'
                }`}
                aria-label={`انتخاب رنگ صوتی ساز ${timbrePersianNames[timbre]}`}
              >
                {timbrePersianNames[timbre]}
              </button>
            ))}
          </div>

          {/* Play Sequence Button */}
          <button
            onClick={handlePlayScaleSequence}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md ${
              isPlayingMelody
                ? 'bg-[#8B2635] text-white hover:bg-[#9E2A2B]'
                : 'bg-[#D97706] text-[#1A120B] hover:bg-[#E5A836]'
            }`}
          >
            <span>{isPlayingMelody ? '■ توقف نمونه ملودی' : '▶ پخش ملودی پیوستار'}</span>
          </button>
        </div>
      </div>

      {/* Mode System Selector Tabs */}
      <div className="flex flex-wrap gap-2 py-3 border-b border-[#594234]/30">
        {MODAL_CONTINUUM_SYSTEMS.map(sys => {
          const isSelected = selectedSystem.id === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => {
                if (isPlayingMelody && cancelPlaybackRef.current) {
                  cancelPlaybackRef.current();
                  setIsPlayingMelody(false);
                }
                setSelectedSystem(sys);
              }}
              className={`px-3 py-1.5 text-xs rounded-md transition-all text-right whitespace-nowrap font-medium ${
                isSelected
                  ? 'bg-[#781D22]/80 border border-[#D97706] text-[#F5EEDB] font-bold shadow'
                  : 'bg-[#181310] border border-[#594234]/40 text-[#C4B59D] hover:text-[#F5EEDB] hover:border-[#594234]'
              }`}
            >
              {sys.persianName}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Keybed + Real-Time Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Left Column: Interactive Microtonal Keyboard */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#C4B59D]">
            <span>روی هر پرده یا کلاویه کلیک کنید تا بسامد دقیق ریزپرده را بشنوید:</span>
            <span className="text-[#D97706]">فواصل: {selectedSystem.intervalsDescription}</span>
          </div>

          {/* Microtonal Keys Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {selectedSystem.notes.map((note, i) => {
              const freq = centsToFrequency(note.semitonesFromC4, note.centOffset);
              const isMicrotonal = note.centOffset !== 0;
              const isActive = activeNoteName?.includes(note.name);

              return (
                <button
                  key={i}
                  onClick={() => handlePlaySingleNote(note.semitonesFromC4, note.centOffset, note.name)}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-between transition-all duration-150 text-center select-none ${
                    isActive
                      ? 'bg-[#8B2635] border-[#E5A836] text-white shadow-lg scale-95'
                      : isMicrotonal
                      ? 'bg-[#291F18] border-[#D97706]/70 text-[#F5EEDB] hover:bg-[#382B21]'
                      : 'bg-[#221A15] border-[#594234]/50 text-[#EDE0C8] hover:bg-[#2C221C]'
                  }`}
                  title={`${note.name} (${Math.round(freq * 10) / 10} Hz) - ${note.description}`}
                >
                  <div className="text-xs font-bold">
                    {note.name}
                  </div>

                  {isMicrotonal ? (
                    <span className="my-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D97706]/20 text-[#E5A836] border border-[#D97706]/40">
                      {note.centOffset > 0 ? `+${note.centOffset}¢` : `${note.centOffset}¢`}
                    </span>
                  ) : (
                    <span className="my-1.5 text-[10px] font-mono text-[#8C7A68]">
                      ۱۲-معتدل
                    </span>
                  )}

                  <div className="text-[11px] font-mono text-[#C4B59D]">
                    {Math.round(freq)} هرتز
                  </div>

                  <div className="text-[9.5px] text-[#E5A836] truncate max-w-full mt-1 font-medium">
                    {note.persianName}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Historical Theoretical Apparatus */}
          <div className="p-3 bg-[#17120F] border border-[#594234]/40 rounded-lg text-xs text-[#C4B59D] leading-relaxed">
            <strong className="text-[#D97706] text-[11.5px] font-bold">شرح اتنوموزیکولوژی: </strong>
            {selectedSystem.historicalNote}
          </div>
        </div>

        {/* Right Column: Real-Time Golden Acoustic Waveform Oscilloscope */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#D97706] font-bold">
            <span>نوسان زنده امواج آکوستیک</span>
            <span className="text-[11px] font-mono text-[#8C7A68]">{timbrePersianNames[selectedTimbre]}</span>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-[#594234] bg-[#F5EEDB] shadow-inner h-48">
            <canvas
              ref={canvasRef}
              width={380}
              height={192}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#1F1915]/85 backdrop-blur rounded text-[10.5px] font-mono text-[#E5A836]">
              {activeNoteName ? `نت فعال: ${activeNoteName}` : 'آماده به کار / میدان رزونانس'}
            </div>
          </div>

          {/* Microtone Tuning Reference Legend in Persian */}
          <div className="grid grid-cols-2 gap-2 text-[10.5px] text-[#C4B59D]">
            <div className="p-2 bg-[#17120F] rounded border border-[#594234]/30">
              <span className="text-[#D97706] font-bold block">کُرُن (𝄲 / 𝄫): ۵۰- سنت</span>
              فاصله خنثی ایرانی میان دوم کوچک و بزرگ
            </div>
            <div className="p-2 bg-[#17120F] rounded border border-[#594234]/30">
              <span className="text-[#1E555C] font-bold block">کما: ۲۲.۶- سنت</span>
              واحد کمای هولدرین ۵۳ قسمتی در مقام عثمانی
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
