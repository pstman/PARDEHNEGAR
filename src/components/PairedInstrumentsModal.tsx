/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PAIRED_INSTRUMENT_STUDIES,
} from '../utils/acousticMath';
import {
  SanturFacingTambalPlate,
  SetarBouzoukiTamburaPlate,
  NeyAndCavalPlate,
} from './InstrumentIllustrations';
import { audioEngine } from '../utils/audioEngine';

interface PairedInstrumentsModalProps {
  studyId: string | null;
  onClose: () => void;
  onSelectAudioMode?: (modeId: string) => void;
}

export const PairedInstrumentsModal: React.FC<PairedInstrumentsModalProps> = ({
  studyId,
  onClose,
}) => {
  const [playingInstrument, setPlayingInstrument] = useState<string | null>(null);

  if (!studyId) return null;

  const study = PAIRED_INSTRUMENT_STUDIES.find(s => s.id === studyId) || PAIRED_INSTRUMENT_STUDIES[0];

  const handlePlaySample = (type: 'east' | 'west') => {
    setPlayingInstrument(type);
    if (study.id === 'santur-tambal') {
      audioEngine.playMicrotone(2, 0, type === 'east' ? 'santur' : 'tambal', 2.5);
    } else if (study.id === 'setar-bouzouki-tambura') {
      audioEngine.playMicrotone(2, -50, type === 'east' ? 'setar' : 'bouzouki', 2.0);
    } else {
      audioEngine.playMicrotone(2, 0, type === 'east' ? 'ney' : 'caval', 2.4);
    }
    setTimeout(() => setPlayingInstrument(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-persian" dir="rtl">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-parchment-texture border-2 border-[#594234] rounded-xl shadow-2xl p-6 text-[#3D2B1F] text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#EAD9BA] hover:bg-[#781D22] text-[#3D2B1F] hover:text-white transition font-bold text-lg border border-[#594234]/50"
          aria-label="بستن پنجره تطبیق سازها"
        >
          ×
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#781D22]/40 pb-4 pl-10">
          <div className="flex items-center gap-2 text-xs text-[#781D22] uppercase tracking-widest font-bold">
            <span>لوح ارگانولوژی و انطباق آکوستیک</span>
            <span>·</span>
            <span>پیوستار صوتی تاریخی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#781D22] mt-1">
            {study.persianTitle}
          </h2>
          <p className="text-sm italic text-[#594234] mt-0.5">
            {study.persianSubtitle}
          </p>
        </div>

        {/* Main Grid: Copperplate Engraving Plate + Organological Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Right Column: Copperplate Engraving Plate */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="shadow-lg rounded-lg overflow-hidden border border-[#594234]/50">
              {study.id === 'santur-tambal' && <SanturFacingTambalPlate />}
              {study.id === 'setar-bouzouki-tambura' && <SetarBouzoukiTamburaPlate />}
              {study.id === 'ney-caval' && <NeyAndCavalPlate />}
            </div>

            {/* Audio Audition Buttons */}
            <div className="flex items-center justify-center gap-3 p-3 bg-[#EAD9BA]/70 border border-[#594234]/30 rounded-lg">
              <button
                onClick={() => handlePlaySample('east')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded shadow transition flex items-center gap-1.5 ${
                  playingInstrument === 'east'
                    ? 'bg-[#8B2635] text-white'
                    : 'bg-[#D97706] text-[#1A120B] hover:bg-[#E5A836]'
                }`}
              >
                <span>🔊 شنیدن صدای {study.instrumentEast.name.split(' ')[0]}</span>
              </button>

              <span className="text-xs italic text-[#594234]">در برابر</span>

              <button
                onClick={() => handlePlaySample('west')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded shadow transition flex items-center gap-1.5 ${
                  playingInstrument === 'west'
                    ? 'bg-[#8B2635] text-white'
                    : 'bg-[#781D22] text-[#F5EEDB] hover:bg-[#8B2635]'
                }`}
              >
                <span>🔊 شنیدن صدای {study.instrumentWest.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {/* Left Column: Comparative Organological Specs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Eastern Archetype Card */}
            <div className="p-4 bg-[#EDE0C8] border border-[#594234]/40 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#781D22]">
                  {study.instrumentEast.name}
                </h4>
                <span className="text-[11px] text-[#594234] font-medium">
                  قطب خاستگاه شرقی
                </span>
              </div>
              <p className="text-xs text-[#6B5344] mt-0.5">
                سنت: {study.instrumentEast.culture}
              </p>

              <div className="mt-2 text-xs space-y-1.5 text-[#3D2B1F] leading-relaxed">
                <div><strong>رنگ صوتی:</strong> {study.instrumentEast.timbre}</div>
                <div><strong>کلاف‌های سیم / روزنه‌ها:</strong> {study.instrumentEast.stringsOrHoles}</div>
                <div><strong>ساختار و چوب:</strong> {study.instrumentEast.construction}</div>
                <div><strong>کوک و فواصل:</strong> {study.instrumentEast.tuning}</div>
              </div>
            </div>

            {/* Western / Danubian Derivative Card */}
            <div className="p-4 bg-[#EDE0C8] border border-[#594234]/40 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#781D22]">
                  {study.instrumentWest.name}
                </h4>
                <span className="text-[11px] text-[#594234] font-medium">
                  قطب تحول غربی (دانوب)
                </span>
              </div>
              <p className="text-xs text-[#6B5344] mt-0.5">
                سنت: {study.instrumentWest.culture}
              </p>

              <div className="mt-2 text-xs space-y-1.5 text-[#3D2B1F] leading-relaxed">
                <div><strong>رنگ صوتی:</strong> {study.instrumentWest.timbre}</div>
                <div><strong>کلاف‌های سیم / روزنه‌ها:</strong> {study.instrumentWest.stringsOrHoles}</div>
                <div><strong>ساختار و چوب:</strong> {study.instrumentWest.construction}</div>
                <div><strong>کوک و فواصل:</strong> {study.instrumentWest.tuning}</div>
              </div>
            </div>

            {/* Bridge Instruments Along the Path */}
            <div className="text-xs text-[#594234]">
              <strong className="text-[11.5px] text-[#781D22] block mb-1 font-bold">
                سازهای رابط و هم‌خانواده در امتداد شاهراه:
              </strong>
              <div className="flex flex-wrap gap-1.5">
                {study.bridgeInstruments.map((inst, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#DECAAA] text-[#3D2B1F] rounded border border-[#594234]/30 text-[11px] font-medium"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Historical & Acoustic Continuum Theory in Persian */}
        <div className="mt-5 p-4 bg-[#EAD9BA]/70 border border-[#781D22]/30 rounded-lg text-xs leading-relaxed text-[#3D2B1F]">
          <h4 className="text-xs font-bold text-[#781D22] uppercase tracking-wider mb-1">
            موسیقی‌شناسی تاریخی و سیر انتقال سازها
          </h4>
          <p>{study.acousticContinuumTheory}</p>
        </div>
      </div>
    </div>
  );
};
