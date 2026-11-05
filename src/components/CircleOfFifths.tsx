/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • دایره پنجم‌های تعاملی و مهندسی هارمونی (Circle of Fifths)
 * نسبت‌های ۳:۲ فیثاغورث، خوشه هارمونی (I - IV - V)، محور تریتون و اتصال آنی به کلاویه‌ها
 * طراح و مؤلف: ایمان برزجان | مشاور علمی: استاد بابک بختیاری
 */

import React, { useState } from 'react';
import { FIFTHS_WHEEL_DATA, FifthsPosition } from '../utils/pardeheNegarData';
import { audioEngine, TimbreType } from '../utils/audioEngine';

interface CircleOfFifthsProps {
  selectedScaleId: string;
  onSelectScale: (scaleId: string) => void;
  soundTimbre: TimbreType;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedScaleId,
  onSelectScale,
  soundTimbre
}) => {
  const [activeMode, setActiveMode] = useState<'family' | 'tritone'>('family');
  const [rotationAngle, setRotationAngle] = useState(0);

  // Find currently selected position
  const selectedIdx = Math.max(0, FIFTHS_WHEEL_DATA.findIndex(p => p.scaleId === selectedScaleId));
  const currentPos = FIFTHS_WHEEL_DATA[selectedIdx] || FIFTHS_WHEEL_DATA[0];

  const handleSelect = (pos: FifthsPosition, index: number) => {
    onSelectScale(pos.scaleId);
    // Smoothly rotate selected item toward the top
    const targetAngle = -index * 30;
    setRotationAngle(targetAngle);
  };

  const spinStep = (direction: 1 | -1) => {
    const nextIdx = (selectedIdx + direction + 12) % 12;
    handleSelect(FIFTHS_WHEEL_DATA[nextIdx], nextIdx);
  };

  const playTriad = () => {
    audioEngine.playTriadChord(currentPos.triadMidi, soundTimbre);
  };

  // Calculate cluster indices for family (IV is -1 step, V is +1 step)
  const subdominantIdx = (selectedIdx - 1 + 12) % 12;
  const dominantIdx = (selectedIdx + 1) % 12;
  const tritoneIdx = (selectedIdx + 6) % 12;

  return (
    <div className="w-full bg-[#181310] rounded-2xl border border-[#594234]/70 p-4 sm:p-6 shadow-2xl space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#594234]/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F5EEDB]">
                دایره پنجم‌های تعاملی و مهندسی هارمونی (Circle of Fifths)
              </h3>
              <p className="text-xs text-[#C4B59D]">
                قانون ریاضی نسبت‌های ۳:۲ فیثاغورث، خوشه آکوردهای همسایه (I - IV - V) و محور تریتون ۱۸۰ درجه
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbox */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveMode('family')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
              activeMode === 'family'
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                : 'bg-[#2A201A] text-[#C4B59D] border-[#594234] hover:bg-[#3D2E24]'
            }`}
          >
            📐 خوشه هارمونی (I - IV - V)
          </button>

          <button
            onClick={() => setActiveMode('tritone')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
              activeMode === 'tritone'
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                : 'bg-[#2A201A] text-[#C4B59D] border-[#594234] hover:bg-[#3D2E24]'
            }`}
          >
            ⚡ محور تریتون (۱۸۰°)
          </button>

          <button
            onClick={() => spinStep(1)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition"
            title="حرکت ساعت‌گرد به پنجم بعدی"
          >
            ↻ پنجم بعد (+1♯)
          </button>

          <button
            onClick={() => spinStep(-1)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition"
            title="حرکت پادساعت‌گرد به چهارم بعدی"
          >
            ↺ چهارم بعد (+1♭)
          </button>
        </div>
      </div>

      {/* Main Wheel & Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Interactive Rotating Wheel (5 cols on lg) */}
        <div className="lg:col-span-5 flex justify-center items-center py-2 relative">
          {/* Top Pointer Needle */}
          <div className="absolute top-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-[#E5A836] z-20 drop-shadow" />

          <div className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] relative">
            <svg
              viewBox="-170 -170 340 340"
              className="w-full h-full transition-transform duration-500 ease-out select-none"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <defs>
                <radialGradient id="wheelCenterGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2A1F18" />
                  <stop offset="100%" stopColor="#120E0B" />
                </radialGradient>
              </defs>

              {/* Background Outer Ring */}
              <circle cx="0" cy="0" r="160" fill="url(#wheelCenterGrad)" stroke="#594234" strokeWidth="3" />
              <circle cx="0" cy="0" r="115" fill="none" stroke="#594234" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="68" fill="#1C1612" stroke="#8B2635" strokeWidth="2" />

              {/* Connecting Lines for Tritone or Family */}
              {activeMode === 'tritone' && (
                <line
                  x1={138 * Math.sin((selectedIdx * 30 * Math.PI) / 180)}
                  y1={-138 * Math.cos((selectedIdx * 30 * Math.PI) / 180)}
                  x2={138 * Math.sin((tritoneIdx * 30 * Math.PI) / 180)}
                  y2={-138 * Math.cos((tritoneIdx * 30 * Math.PI) / 180)}
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              )}

              {activeMode === 'family' && (
                <polygon
                  points={`
                    ${138 * Math.sin((subdominantIdx * 30 * Math.PI) / 180)},${-138 * Math.cos((subdominantIdx * 30 * Math.PI) / 180)}
                    ${138 * Math.sin((selectedIdx * 30 * Math.PI) / 180)},${-138 * Math.cos((selectedIdx * 30 * Math.PI) / 180)}
                    ${138 * Math.sin((dominantIdx * 30 * Math.PI) / 180)},${-138 * Math.cos((dominantIdx * 30 * Math.PI) / 180)}
                  `}
                  fill="#8B2635"
                  fillOpacity="0.25"
                  stroke="#E5A836"
                  strokeWidth="2"
                />
              )}

              {/* 12 Sectors */}
              {FIFTHS_WHEEL_DATA.map((pos, idx) => {
                const angleDeg = idx * 30;
                const angleRad = (angleDeg * Math.PI) / 180;
                const isSelected = idx === selectedIdx;
                const isFamily = activeMode === 'family' && (idx === selectedIdx || idx === subdominantIdx || idx === dominantIdx);
                const isTritone = activeMode === 'tritone' && (idx === selectedIdx || idx === tritoneIdx);

                // Coordinates for outer (Major) and inner (Minor)
                const majorR = 138;
                const minorR = 92;

                const mx = majorR * Math.sin(angleRad);
                const my = -majorR * Math.cos(angleRad);

                const nix = minorR * Math.sin(angleRad);
                const niy = -minorR * Math.cos(angleRad);

                let outerFill = '#EDE0C8';
                let outerBg = '#2A201A';

                if (isSelected) {
                  outerFill = '#120E0B';
                  outerBg = '#F59E0B';
                } else if (isFamily) {
                  outerFill = '#FFF5E6';
                  outerBg = '#8B2635';
                } else if (isTritone) {
                  outerFill = '#FFF5E6';
                  outerBg = '#EF4444';
                }

                return (
                  <g
                    key={pos.scaleId}
                    onClick={() => handleSelect(pos, idx)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    style={{ transformOrigin: '0 0' }}
                  >
                    {/* Outer Circle (Major) */}
                    <circle
                      cx={mx}
                      cy={my}
                      r={isSelected ? 18 : 15}
                      fill={outerBg}
                      stroke={isSelected ? '#FFF' : '#594234'}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    <text
                      x={mx}
                      y={my + 4}
                      textAnchor="middle"
                      fill={outerFill}
                      fontSize={isSelected ? '12px' : '11px'}
                      fontWeight="bold"
                    >
                      {pos.major}
                    </text>

                    {/* Inner Circle (Relative Minor) */}
                    <circle
                      cx={nix}
                      cy={niy}
                      r={isSelected ? 14 : 12}
                      fill="#1E1712"
                      stroke={isSelected ? '#F59E0B' : '#3D2E24'}
                      strokeWidth="1"
                    />
                    <text
                      x={nix}
                      y={niy + 3.5}
                      textAnchor="middle"
                      fill={isSelected ? '#F59E0B' : '#A6937C'}
                      fontSize="9px"
                      fontWeight="600"
                    >
                      {pos.minor}
                    </text>
                  </g>
                );
              })}

              {/* Center Emblem */}
              <text x="0" y="-8" textAnchor="middle" fill="#E5A836" fontSize="10px" fontWeight="bold">
                ۳:۲
              </text>
              <text x="0" y="8" textAnchor="middle" fill="#C4B59D" fontSize="8px">
                فیثاغورث
              </text>
            </svg>
          </div>
        </div>

        {/* Detailed Mathematical & Harmonic Card (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#1F1914] rounded-xl border border-[#594234]/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#594234]/40 pb-3">
            <div>
              <span className="text-xs text-[#D97706] font-bold">گام دیاتونیک فعال:</span>
              <h4 className="text-lg font-black text-[#F5EEDB]">
                {currentPos.major} ماژور ({currentPos.solfege})
              </h4>
            </div>

            <button
              onClick={playTriad}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8B2635] hover:bg-[#A32D3F] text-[#FFF5E6] text-xs font-bold border border-[#E5A836] shadow transition self-start sm:self-auto"
            >
              <span>▶ پخش آکورد پایگی (Triad)</span>
            </button>
          </div>

          {/* 4 Stat Boxes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-[#140F0C] border border-[#594234]/40 space-y-1">
              <span className="text-[10.5px] text-[#A6937C] block font-bold">سرکلید (Key Signature):</span>
              <span className="text-xs font-bold text-[#E5A836]">{currentPos.sig}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#140F0C] border border-[#594234]/40 space-y-1">
              <span className="text-[10.5px] text-[#A6937C] block font-bold">مینور نسبی (Relative):</span>
              <span className="text-xs font-bold text-[#F5EEDB]">{currentPos.minor} ({currentPos.minorSol})</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#140F0C] border border-[#594234]/40 space-y-1">
              <span className="text-[10.5px] text-[#A6937C] block font-bold">محور تریتون متضاد (Tritone):</span>
              <span className="text-xs font-bold text-[#EF4444]">{currentPos.tritone} (۳ پرده)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#140F0C] border border-[#594234]/40 space-y-1">
              <span className="text-[10.5px] text-[#A6937C] block font-bold">فرمول آکوستیک:</span>
              <span className="text-xs font-mono text-[#10B981]">f × (3/2)ⁿ</span>
            </div>
          </div>

          {/* Harmonic Context Description */}
          <div className="p-3 rounded-lg bg-[#140F0C] border border-[#594234]/40 text-xs text-[#C4B59D] leading-relaxed">
            <strong className="text-[#E5A836]">تحلیل خانواده هارمونی {currentPos.major}:</strong>
            <br />
            • درجه ۱ (تونیک پایه): {currentPos.major}
            <br />
            • درجه ۴ (زیرنمایان / Subdominant): {FIFTHS_WHEEL_DATA[subdominantIdx].major}
            <br />
            • درجه ۵ (نمایان / Dominant): {FIFTHS_WHEEL_DATA[dominantIdx].major}
            <br />
            • سه آکورد مینور موازی: {currentPos.minor}، {FIFTHS_WHEEL_DATA[subdominantIdx].minor}، {FIFTHS_WHEEL_DATA[dominantIdx].minor}
          </div>
        </div>
      </div>
    </div>
  );
};
