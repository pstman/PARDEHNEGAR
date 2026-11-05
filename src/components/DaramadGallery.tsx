/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • تالار جامع درآمدها، پیش‌درآمدها، چهارمضراب‌ها و رپرتوار ردیف
 * شامل آثار استادان درویش‌خان، مرتضی نی‌داوود، علی‌اکبر شهنازی، رکن‌الدین مختاری، ابوالحسن صبا و رضا محجوبی
 * مؤلف: ایمان برزجان | ناشر: استودیو اینامیکس (EnamiX)
 */

import React, { useState } from 'react';
import { PERSIAN_DASTGAH_DATA, DastgahScale, ClassicalPieceRepertoire } from '../utils/pardeheNegarData';
import { audioEngine, TimbreType } from '../utils/audioEngine';

interface DaramadGalleryProps {
  selectedDastgahId: string;
  onSelectDastgah: (dastgah: DastgahScale) => void;
  soundTimbre: TimbreType;
  onOpenTreatise?: () => void;
}

export const DaramadGallery: React.FC<DaramadGalleryProps> = ({
  selectedDastgahId,
  onSelectDastgah,
  soundTimbre,
  onOpenTreatise
}) => {
  const [playingPieceId, setPlayingPieceId] = useState<string | null>(null);
  const [activeDastgahExpanded, setActiveDastgahExpanded] = useState<string>(selectedDastgahId || PERSIAN_DASTGAH_DATA[0].id);

  const handlePlayRepertoirePiece = (piece: ClassicalPieceRepertoire, dastgah: DastgahScale) => {
    if (playingPieceId === piece.id) {
      audioEngine.stopAll();
      setPlayingPieceId(null);
      return;
    }

    setPlayingPieceId(piece.id);
    onSelectDastgah(dastgah);

    audioEngine.playMotifMelody(
      piece.motifMelody,
      soundTimbre === 'piano' ? 'violin' : soundTimbre,
      115,
      undefined,
      () => setPlayingPieceId(null)
    );
  };

  return (
    <div className="w-full space-y-6 font-persian" dir="rtl">
      {/* Editorial Intro Banner */}
      <div className="bg-[#1C1612] rounded-2xl border border-[#594234]/60 p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎶</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#F5EEDB]">
                تالار جامع درآمدها، پیش‌درآمدها و موتیف‌های ماندگار ردیف ویولن ایران
              </h2>
              <p className="text-xs sm:text-sm text-[#C4B59D] leading-relaxed">
                رپرتوار اصیل و مستند شامل پیش‌درآمدهای باشکوه، درآمدهای آوازی و چهارمضراب‌های ۱۲ دستگاه و آواز ردیف.
                روی هر قطعه کلیک کنید تا نغمات آن پخش شده و بر روی کلاویه‌های ۵۱ گانه و گریف ویولن فعال گردد.
              </p>
            </div>
          </div>

          {onOpenTreatise && (
            <button
              onClick={onOpenTreatise}
              className="px-3.5 py-2 rounded-xl bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow"
            >
              <span>📖</span>
              <span>مطالعه رساله پژوهشی و مراجع</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of 12 Cards with Integrated Multi-Piece Repertoire */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSIAN_DASTGAH_DATA.map(dastgah => {
          const isSelected = selectedDastgahId === dastgah.id;
          const isExpanded = activeDastgahExpanded === dastgah.id;
          const repertoire = dastgah.repertoire || [];

          return (
            <div
              key={dastgah.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between space-y-3.5 shadow-lg relative
                ${isSelected
                  ? 'bg-[#221B16] border-[#E5A836] ring-1 ring-[#E5A836]/50'
                  : 'bg-[#181310] border-[#594234]/50 hover:border-[#8B2635] hover:bg-[#1D1713]'
                }
              `}
            >
              {/* Card Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#F5EEDB]">
                    {dastgah.name}
                  </h3>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5A836] text-black font-black">
                      فعال روی کلاویه‌ها
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#D97706] font-semibold">
                  {dastgah.pishdaramadTitle}
                </div>
              </div>

              {/* Badges: Witness & Pause */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#120E0B] border border-[#594234]/40 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] inline-block" />
                  <span className="text-[#A6937C]">شاهد:</span>
                  <span className="font-bold text-[#EDE0C8]">{dastgah.shahedName || '-'}</span>
                </div>

                <div className="p-2 rounded-lg bg-[#120E0B] border border-[#594234]/40 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                  <span className="text-[#A6937C]">ایست:</span>
                  <span className="font-bold text-[#EDE0C8]">{dastgah.istName || '-'}</span>
                </div>
              </div>

              {/* Violin Kook (4 Strings) */}
              <div className="p-2 rounded-lg bg-[#120E0B] border border-[#594234]/40 text-xs text-[#C4B59D] space-y-1">
                <span className="text-[10.5px] font-bold text-[#E5A836] block">کوک ۴ سیم ویولن:</span>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  {dastgah.kookViolin.map(str => (
                    <span key={str.stringNumber} className="bg-[#2A201A] px-1.5 py-0.5 rounded border border-[#594234]/60">
                      س{str.stringNumber}: {str.noteName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Explanatory text */}
              <p className="text-xs text-[#A6937C] leading-relaxed line-clamp-2">
                {dastgah.info}
              </p>

              {/* Multi-piece Repertoire Showcase */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#E5A836]">
                  <span>رپرتوار قطعات ({repertoire.length} قطعه استاندارد):</span>
                  <button
                    onClick={() => setActiveDastgahExpanded(isExpanded ? '' : dastgah.id)}
                    className="text-[11px] text-[#A6937C] hover:text-[#FFF5E6] underline"
                  >
                    {isExpanded ? 'بستن لیست ▲' : 'مشاهده همه ▼'}
                  </button>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-none pr-0.5">
                  {(isExpanded ? repertoire : repertoire.slice(0, 2)).map(piece => {
                    const isPiecePlaying = playingPieceId === piece.id;

                    return (
                      <div
                        key={piece.id}
                        className={`p-2 rounded-xl border text-xs transition flex items-center justify-between gap-2 ${
                          isPiecePlaying
                            ? 'bg-[#8B2635]/80 border-[#E5A836] text-white shadow-md'
                            : 'bg-[#140F0C] border-[#594234]/40 text-[#C4B59D] hover:bg-[#1E1712]'
                        }`}
                      >
                        <div className="truncate flex-1">
                          <div className="font-bold text-[#F5EEDB] truncate text-[11.5px]">
                            {piece.title}
                          </div>
                          <div className="text-[10px] text-[#A6937C] flex items-center gap-1.5">
                            <span>{piece.composer}</span>
                            <span>•</span>
                            <span className="text-[#D97706]">{piece.meter}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayRepertoirePiece(piece, dastgah)}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition flex items-center gap-1 shrink-0 ${
                            isPiecePlaying
                              ? 'bg-[#EF4444] text-white animate-pulse'
                              : 'bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234]'
                          }`}
                        >
                          <span>{isPiecePlaying ? '⏹ توقف' : '▶ پخش'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#594234]/40">
                <button
                  onClick={() => onSelectDastgah(dastgah)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition shadow flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#E5A836] text-black hover:bg-[#F59E0B]'
                      : 'bg-[#2A201A] hover:bg-[#3D2E24] text-[#EDE0C8] border border-[#594234]'
                  }`}
                >
                  <span>{isSelected ? '✓ در حال حاضر انتخاب شده است' : 'انتخاب این دستگاه برای کلاویه و گریف'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
