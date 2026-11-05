/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * زیرمجموعه پیوستار آکوستیک: جهان صوتی ایران تا دانوب
 * اثر کارتوگرافی تاریخی رنسانس ۲۱:۹، مسیرهای ترانزیت مدال، سازهای جفت، و رساله آکادمیک
 */

import React, { useState, useRef } from 'react';
import { CartographicCanvas } from './CartographicCanvas';
import { MicrotonalSynthesizer } from './MicrotonalSynthesizer';
import { AksakRhythmPlayer } from './AksakRhythmPlayer';
import { PairedInstrumentsModal } from './PairedInstrumentsModal';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { ResearchTreatiseModal } from './ResearchTreatiseModal';
import {
  CartographicNode,
  TRANSMISSION_ROUTES,
  PAIRED_INSTRUMENT_STUDIES,
} from '../utils/acousticMath';
import { audioEngine } from '../utils/audioEngine';

export const ContinuumSubmodule: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('romani-diaspora');
  const [selectedNode, setSelectedNode] = useState<CartographicNode | null>(null);
  const [activeInstrumentPlate, setActiveInstrumentPlate] = useState<string | null>(null);
  const [isTreatiseOpen, setIsTreatiseOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [currentAudioPhase, setCurrentAudioPhase] = useState<string>('');

  const selectedRoute = TRANSMISSION_ROUTES.find(r => r.id === selectedRouteId);

  const handleToggleMasterAudio = () => {
    if (isAudioActive) {
      audioEngine.stopAll();
      setIsAudioActive(false);
      setCurrentAudioPhase('');
    } else {
      setIsAudioActive(true);
      audioEngine.playContinuumSuite(
        (phase) => setCurrentAudioPhase(phase),
        () => {
          setIsAudioActive(false);
          setCurrentAudioPhase('');
        }
      );
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Editorial Header */}
      <div className="text-center max-w-4xl mx-auto space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#D97706] font-bold">
          <span>اثر کارتوگرافی تاریخی و آکادمیک</span>
          <span aria-hidden="true">·</span>
          <span>سبک رنسانس و باروک</span>
          <span aria-hidden="true">·</span>
          <span>قالب عریض ۲۱:۹</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5EEDB] tracking-wide" style={{ textWrap: 'balance' }}>
          پیوستار آکوستیک: جهان صوتی فلات ایران تا حوضه دانوب
        </h2>

        <p className="text-xs sm:text-sm text-[#C4B59D]" style={{ textWrap: 'balance' }}>
          ردیابی مهاجرت‌های مدال، ارگانولوژی سازها و اوزان لنگ از فلات کهن ایران، از مسیر آناتولی و بالکان، تا حوضه کارپات و دانوب (رومانی)
        </p>

        {/* Action bar for continuum */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            onClick={() => setIsTreatiseOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#2A201A] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] text-xs font-bold transition shadow"
          >
            📖 مطالعه رساله پژوهشی و مراجع
          </button>

          <button
            onClick={handleToggleMasterAudio}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow flex items-center gap-2 ${
              isAudioActive
                ? 'bg-[#8B2635] text-white hover:bg-[#9E2A2B]'
                : 'bg-[#D97706] text-black hover:bg-[#E5A836]'
            }`}
          >
            <span>{isAudioActive ? '■ قطع صدای پیوستار' : '▶ شنیدن نوای پیوستار (سوییت کامل ۳۵ ثانیه)'}</span>
          </button>
        </div>

        {isAudioActive && currentAudioPhase && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201813] text-[#E5A836] border border-[#594234] text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
            <span>گوش فرادهید: {currentAudioPhase}</span>
          </div>
        )}
      </div>

      {/* 21:9 Cartographic Map */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#594234]/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#F5EEDB]">
              نقشه کارتوگرافی پیوستار (قالب عریض ۲۱:۹)
            </span>
            <span className="text-xs text-[#C4B59D] hidden sm:inline">
              · روی ایستگاه‌ها کلیک کنید یا خطوط درخشان را برای روشن‌شدن شاهراه‌ها انتخاب نمایید
            </span>
          </div>
          <div className="text-xs text-[#D97706]">
            مقیاس: ۱:۳,۵۰۰,۰۰۰ تصویر مرکاتور رنسانس
          </div>
        </div>

        <CartographicCanvas
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onOpenInstrumentPlate={setActiveInstrumentPlate}
          isPlayingAudio={isAudioActive}
        />

        {/* Route Narrative */}
        {selectedRoute && (
          <div className="p-4 bg-[#1F1915] border border-[#594234]/60 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: selectedRoute.color }}
                />
                <h3 className="text-base font-bold text-[#F5EEDB]">
                  {selectedRoute.persianName}
                </h3>
                <span className="text-xs text-[#C4B59D]">
                  ({selectedRoute.epoch})
                </span>
              </div>
              <p className="text-xs text-[#C4B59D] leading-relaxed max-w-4xl">
                {selectedRoute.historicalNarrative}
              </p>
              <div className="text-xs text-[#E5A836]">
                <strong>میراث و دستاورد موسیقایی: </strong>
                {selectedRoute.musicalContributions}
              </div>
            </div>

            <button
              onClick={() => setSelectedRouteId(null)}
              className="px-3 py-1.5 bg-[#2C221C] hover:bg-[#781D22] text-[#EDE0C8] text-xs rounded transition whitespace-nowrap"
            >
              پاک‌کردن فیلتر مسیر
            </button>
          </div>
        )}
      </section>

      {/* Paired Instrument Engraved Plates Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#594234]/40 pb-2">
          <span className="text-sm font-bold text-[#F5EEDB]">
            سازهای جفت و ارگانولوژی تطبیقی ایران و بالکان-دانوب
          </span>
          <span className="text-xs text-[#C4B59D]">
            لوحه‌های قلم‌زنی و مس‌نگاری تاریخی
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAIRED_INSTRUMENT_STUDIES.map(study => (
            <div
              key={study.id}
              className="p-4 bg-[#1F1915] border border-[#594234]/60 rounded-xl shadow-md space-y-3 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[#F5EEDB]">
                  {study.persianTitle}
                </h4>
                <div className="text-xs text-[#E5A836]">{study.persianSubtitle}</div>
                <p className="text-xs text-[#C4B59D] mt-2 line-clamp-3">
                  {study.acousticContinuumTheory}
                </p>
              </div>

              <button
                onClick={() => setActiveInstrumentPlate(study.id)}
                className="w-full py-2 bg-[#2C221C] hover:bg-[#8B2635] text-[#EDE0C8] text-xs font-bold rounded-lg border border-[#594234] transition"
              >
                بررسی لوحه قلم‌زنی و شنیدن طنین
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modals & Drawers */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {activeInstrumentPlate && (
        <PairedInstrumentsModal
          studyId={activeInstrumentPlate}
          onClose={() => setActiveInstrumentPlate(null)}
        />
      )}

      {isTreatiseOpen && (
        <ResearchTreatiseModal
          isOpen={isTreatiseOpen}
          onClose={() => setIsTreatiseOpen(false)}
        />
      )}
    </div>
  );
};
