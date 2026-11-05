/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AKSAK_METERS, AksakMeter } from '../utils/acousticMath';

export const AksakRhythmPlayer: React.FC = () => {
  const [selectedMeter, setSelectedMeter] = useState<AksakMeter>(AKSAK_METERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const playPercussionClick = (isAccent: boolean, isLong: boolean) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isAccent ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isAccent ? 380 : 260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + (isLong ? 0.08 : 0.04));

      gain.gain.setValueAtTime(isAccent ? 0.5 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isLong ? 0.09 : 0.05));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio might be blocked until gesture
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentBeatIndex(0);
      return;
    }

    if (selectedMeter.id === 'doina-rubato') {
      return;
    }

    const totalSubunits = selectedMeter.subdivisions.reduce((a, b) => a + b, 0);
    const subunitMs = (60 / selectedMeter.tempoBpm) * 1000;

    let subCount = 0;
    let groupIdx = 0;

    const interval = window.setInterval(() => {
      let cumulative = 0;
      let matchedGroup = -1;

      for (let i = 0; i < selectedMeter.subdivisions.length; i++) {
        if (subCount === cumulative) {
          matchedGroup = i;
          break;
        }
        cumulative += selectedMeter.subdivisions[i];
      }

      if (matchedGroup !== -1) {
        groupIdx = matchedGroup;
        setCurrentBeatIndex(groupIdx);
        const isLong = selectedMeter.subdivisions[groupIdx] === 3;
        const isAccent = groupIdx === 0 || isLong;
        playPercussionClick(isAccent, isLong);
      }

      subCount = (subCount + 1) % totalSubunits;
    }, subunitMs);

    timerRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, selectedMeter]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="w-full bg-[#1F1915] border border-[#594234]/60 rounded-xl p-5 shadow-2xl text-[#EDE0C8] text-right font-persian" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#594234]/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8B2635]">
              ایقاعات لنگ (Aksak)
            </span>
            <span className="text-xs text-[#594234]">·</span>
            <span className="text-xs text-[#E2D1B3]">پل‌های ریتمیک عثمانی و دانوب</span>
          </div>
          <h3 className="text-xl font-bold text-[#F5EEDB] mt-1">
            {selectedMeter.name}
          </h3>
          <p className="text-sm text-[#C4B59D] mt-0.5">
            خاستگاه: {selectedMeter.origin}
          </p>
        </div>

        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md ${
            isPlaying
              ? 'bg-[#8B2635] text-white hover:bg-[#9E2A2B]'
              : 'bg-[#781D22] text-[#F5EEDB] hover:bg-[#8B2635]'
          }`}
        >
          <span>{isPlaying ? '■ توقف مترونوم آکساک' : '▶ آغاز مترونوم آکساک'}</span>
        </button>
      </div>

      {/* Meter Selector Tabs */}
      <div className="flex flex-wrap gap-2 py-3 border-b border-[#594234]/30">
        {AKSAK_METERS.map(m => {
          const isSel = selectedMeter.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMeter(m);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium ${
                isSel
                  ? 'bg-[#781D22] text-[#F5EEDB] font-bold shadow'
                  : 'bg-[#181310] border border-[#594234]/40 text-[#C4B59D] hover:text-[#F5EEDB]'
              }`}
            >
              {m.name} ({m.timeSignature})
            </button>
          );
        })}
      </div>

      {/* Metric Subdivision Wheel and Interactive Pulse Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 items-center">
        {/* Visual Pulse Step Indicators */}
        <div className="md:col-span-8 flex flex-col gap-3">
          <div className="text-xs text-[#C4B59D]">
            آرایش ضرب‌آهنگ نامتقارن: ({selectedMeter.subdivisions.join(' + ')})
          </div>

          <div className="flex items-center gap-2">
            {selectedMeter.subdivisions.map((duration, idx) => {
              const isCurrent = isPlaying && currentBeatIndex === idx;
              const isExtended = duration === 3;

              return (
                <div
                  key={idx}
                  className={`flex-1 p-4 rounded-lg border text-center transition-all duration-100 flex flex-col items-center justify-center ${
                    isCurrent
                      ? 'bg-[#8B2635] border-[#E5A836] text-white scale-105 shadow-xl'
                      : isExtended
                      ? 'bg-[#291F18] border-[#D97706]/60 text-[#F5EEDB]'
                      : 'bg-[#1A1410] border-[#594234]/40 text-[#C4B59D]'
                  }`}
                  style={{ flexGrow: duration }}
                >
                  <div className="text-xl font-bold font-mono">
                    {duration}
                  </div>
                  <div className="text-[10.5px] tracking-wide mt-1 font-medium">
                    {isExtended ? 'کشیده (بلند)' : 'کوتاه (تند)'}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#C4B59D] mt-2 leading-relaxed">
            {selectedMeter.description}
          </p>
        </div>

        {/* Historic Insight Callout in Persian */}
        <div className="md:col-span-4 p-4 bg-[#17120F] border border-[#594234]/50 rounded-lg text-xs text-[#C4B59D] leading-relaxed">
          <h4 className="text-xs text-[#D97706] font-bold mb-1">
            پژوهش‌های بلابارتوک و کنستانتین برائیلویو:
          </h4>
          اتنوموزیکولوگ نامدار، کنستانتین برائیلویو، اصطلاح ترکی <em>ریتم آکساک</em> (به معنای لنگیدن) را برای تبیین این اوزان نامتقارن بالکان، آناتولی و دانوب برگزید و اثبات کرد این ضرب‌آهنگ‌ها یک پیوستار یکپارچه از آسیا تا قلب اروپا پدید آورده‌اند.
        </div>
      </div>
    </div>
  );
};
