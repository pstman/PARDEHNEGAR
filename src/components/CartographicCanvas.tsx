/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  CARTOGRAPHIC_NODES,
  TRANSMISSION_ROUTES,
  CartographicNode,
} from '../utils/acousticMath';
import { CompassRose } from './CompassRose';
import { RenaissanceCartouche } from './RenaissanceCartouche';

interface CartographicCanvasProps {
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string | null) => void;
  selectedNode: CartographicNode | null;
  onSelectNode: (node: CartographicNode | null) => void;
  onOpenInstrumentPlate: (plateId: string) => void;
  isPlayingAudio: boolean;
}

export const CartographicCanvas: React.FC<CartographicCanvasProps> = ({
  selectedRouteId,
  onSelectRoute,
  selectedNode,
  onSelectNode,
  onOpenInstrumentPlate,
  isPlayingAudio,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<CartographicNode | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.8, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full aspect-[21/9] overflow-hidden rounded-xl border-2 border-[#594234] bg-parchment-texture shadow-2xl select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Antique Vignette Shadow Overlay */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(45,30,20,0.6)] z-20" />

      {/* On-Map Zoom and View Controls (Persian) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 p-1 bg-[#F5EEDB]/92 backdrop-blur border border-[#594234]/60 rounded-lg shadow-md">
        <button
          onClick={() => handleZoom(0.2)}
          className="w-8 h-8 flex items-center justify-center text-[#781D22] hover:bg-[#EAD9BA] rounded transition font-bold text-base"
          title="بزرگ‌نمایی نقشه"
          aria-label="بزرگ‌نمایی در نقشه تاریخی"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-8 h-8 flex items-center justify-center text-[#781D22] hover:bg-[#EAD9BA] rounded transition font-bold text-base"
          title="کوچک‌نمایی نقشه"
          aria-label="کوچک‌نمایی در نقشه تاریخی"
        >
          −
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2.5 h-8 flex items-center justify-center text-[#594234] hover:bg-[#EAD9BA] rounded transition text-xs font-semibold font-persian"
          title="بازنشانی بزرگ‌نمایی"
          aria-label="بازنشانی بزرگ‌نمایی نقشه"
        >
          بازنشانی نما
        </button>
      </div>

      {/* Route Quick Legend Ribbon in Canvas (Persian) */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 p-1.5 bg-[#F5EEDB]/92 backdrop-blur border border-[#594234]/60 rounded-lg shadow-md text-xs font-persian">
        <span className="text-[#781D22] font-bold px-1.5">شاهراه‌های تاریخی:</span>
        {TRANSMISSION_ROUTES.map(route => {
          const isActive = selectedRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(isActive ? null : route.id)}
              className={`px-3 py-1 rounded transition whitespace-nowrap flex items-center gap-1.5 font-medium ${
                isActive
                  ? 'bg-[#781D22] text-[#F5EEDB] shadow-sm font-bold'
                  : 'text-[#3D2B1F] hover:bg-[#E6D7BA]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: route.color }}
              />
              <span>{route.persianName.split(' ')[0]} {route.persianName.split(' ')[1] || ''}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Panoramic Artwork */}
      <svg
        viewBox="0 0 2100 900"
        className="w-full h-full transform transition-transform duration-75"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Sea water pattern */}
          <pattern id="seaHatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 0 4 Q 2 2 4 4 T 8 4" fill="none" stroke="#1E555C" strokeWidth="0.5" strokeOpacity="0.25" />
          </pattern>

          {/* Golden glow filter */}
          <filter id="goldenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Sea Water Bodies (Persian Names) */}
        {/* دریای سیاه (Black Sea / Pontus Euxinus) */}
        <path
          d="M 680 340 C 740 310, 830 330, 930 350 C 970 380, 980 430, 920 440 C 860 450, 770 470, 720 450 C 670 430, 640 380, 680 340 Z"
          fill="#C8DEDD"
          fillOpacity="0.65"
          stroke="#1E555C"
          strokeWidth="1.2"
        />
        <path
          d="M 680 340 C 740 310, 830 330, 930 350 C 970 380, 980 430, 920 440 C 860 450, 770 470, 720 450 C 670 430, 640 380, 680 340 Z"
          fill="url(#seaHatch)"
        />
        <text x="810" y="395" textAnchor="middle" fill="#0E4047" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="16" fontWeight="700">
          دریای سیاه (پونتوس اوکسینوس)
        </text>

        {/* دریای کاسپین / خزر (Caspian Sea) */}
        <path
          d="M 1260 260 C 1310 220, 1370 250, 1400 310 C 1430 400, 1440 500, 1410 540 C 1370 560, 1330 520, 1310 460 C 1280 380, 1240 320, 1260 260 Z"
          fill="#C8DEDD"
          fillOpacity="0.65"
          stroke="#1E555C"
          strokeWidth="1.2"
        />
        <path
          d="M 1260 260 C 1310 220, 1370 250, 1400 310 C 1430 400, 1440 500, 1410 540 C 1370 560, 1330 520, 1310 460 C 1280 380, 1240 320, 1260 260 Z"
          fill="url(#seaHatch)"
        />
        <text x="1350" y="390" textAnchor="middle" fill="#0E4047" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="16" fontWeight="700">
          دریای کاسپین (خزر / هیرکان)
        </text>

        {/* دریای اژه و مدیترانه (Aegean Sea) */}
        <path
          d="M 440 470 C 490 460, 560 480, 560 550 C 530 620, 480 660, 430 680 C 370 650, 400 560, 440 470 Z"
          fill="#C8DEDD"
          fillOpacity="0.55"
          stroke="#1E555C"
          strokeWidth="1"
        />
        <text x="480" y="590" textAnchor="middle" fill="#0E4047" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="15" fontWeight="700">
          دریای اژه
        </text>

        {/* خلیج فارس (Persian Gulf) */}
        <path
          d="M 1660 760 C 1740 730, 1850 780, 1920 830 C 1870 870, 1750 860, 1660 760 Z"
          fill="#C8DEDD"
          fillOpacity="0.65"
          stroke="#1E555C"
          strokeWidth="1.2"
        />
        <text x="1780" y="810" textAnchor="middle" fill="#0E4047" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="16" fontWeight="800">
          خلیج فارس (Sinus Persicus)
        </text>

        {/* 2. Major River Systems (Persian) */}
        {/* رود دانوب (Danube / Ister / Dunărea) */}
        <path
          d="M 220 320 Q 340 330 430 360 T 520 380 T 630 360 T 670 340"
          fill="none"
          stroke="#2A6F78"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text x="440" y="348" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="13" fontWeight="700">
          رود دانوب (ایستر باستان)
        </text>

        {/* رود دنیستر (Dniester) */}
        <path
          d="M 500 180 Q 560 210 610 270 T 670 320"
          fill="none"
          stroke="#2A6F78"
          strokeWidth="1.8"
        />
        <text x="560" y="235" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="600">
          رود دنیستر
        </text>

        {/* رودهای دجله و فرات (Tigris & Euphrates) */}
        <path
          d="M 1080 500 Q 1150 560 1280 680 T 1550 760"
          fill="none"
          stroke="#2A6F78"
          strokeWidth="2"
        />
        <path
          d="M 1040 520 Q 1110 590 1220 710 T 1520 780"
          fill="none"
          stroke="#2A6F78"
          strokeWidth="1.6"
        />
        <text x="1200" y="620" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="13" fontWeight="700">
          رودهای دجله و فرات (بین‌النهرین)
        </text>

        {/* رودهای کورا و ارس (Kura & Aras) */}
        <path
          d="M 1220 440 Q 1280 460 1340 460 T 1410 490"
          fill="none"
          stroke="#2A6F78"
          strokeWidth="1.6"
        />
        <text x="1300" y="445" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="600">
          رود ارس و کورا
        </text>

        {/* 3. Mountain Ranges (Persian) */}
        {/* کوه‌های کارپات (Montes Carpatici) */}
        <g stroke="#594234" strokeWidth="1" fill="#DECAAA">
          <path d="M 380 200 L 400 170 L 420 200 L 440 165 L 460 200 L 490 180 L 510 210 Z" />
          <path d="M 460 220 L 480 190 L 500 230 L 530 200 L 560 240 Z" />
          <path d="M 480 270 L 505 240 L 530 280 L 550 250 L 580 290 Z" />
          <text x="440" y="155" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="13" fontWeight="800">
            کوه‌های کارپات (رومانی)
          </text>
        </g>

        {/* کوه‌های بالکان (هموس) */}
        <g stroke="#594234" strokeWidth="1" fill="#DECAAA">
          <path d="M 380 430 L 410 400 L 440 435 L 470 410 L 510 440 Z" />
          <text x="440" y="405" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="700">
            رشته‌کوه بالکان
          </text>
        </g>

        {/* کوه‌های توروس و پونتیک (آناتولی) */}
        <g stroke="#594234" strokeWidth="1" fill="#DECAAA">
          <path d="M 820 470 L 850 440 L 880 475 L 920 450 L 960 480 L 1020 460 L 1060 490 Z" />
          <path d="M 860 550 L 890 520 L 930 555 L 970 530 L 1020 560 Z" />
          <text x="940" y="515" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="700">
            کوه‌های توروس و پونتیک (آناتولی)
          </text>
        </g>

        {/* رشته‌کوه زاگرس (ایران غربی) */}
        <g stroke="#594234" strokeWidth="1" fill="#DECAAA">
          <path d="M 1320 520 L 1350 480 L 1380 530 L 1420 490 L 1460 540 L 1510 500 L 1570 560 L 1640 600 L 1720 680 Z" />
          <text x="1500" y="530" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="14" fontWeight="800">
            رشته‌کوه زاگرس
          </text>
        </g>

        {/* رشته‌کوه البرز (شمال ایران / کرانه خزر) */}
        <g stroke="#594234" strokeWidth="1" fill="#DECAAA">
          <path d="M 1420 530 L 1460 490 L 1510 535 L 1580 480 L 1660 520 L 1740 500 Z" />
          <text x="1560" y="475" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="13" fontWeight="800">
            رشته‌کوه البرز
          </text>
        </g>

        {/* 4. Rhumb Lines radiating across the canvas */}
        <g stroke="#594234" strokeWidth="0.4" strokeOpacity="0.25">
          {Array.from({ length: 16 }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / 16;
            return (
              <line
                key={`bs-${i}`}
                x1={810}
                y1={400}
                x2={810 + 1200 * Math.cos(rad)}
                y2={400 + 1200 * Math.sin(rad)}
              />
            );
          })}
          {Array.from({ length: 16 }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / 16;
            return (
              <line
                key={`cs-${i}`}
                x1={1350}
                y1={390}
                x2={1350 + 1200 * Math.cos(rad)}
                y2={390 + 1200 * Math.sin(rad)}
              />
            );
          })}
        </g>

        {/* 5. Antique Vignette Details: Ships & Sea Monsters */}
        <g transform="translate(860, 360) scale(0.65)" stroke="#3D2B1F" strokeWidth="1" fill="#DECAAA">
          <path d="M 0 20 C 15 25, 45 25, 60 20 L 50 35 L 10 35 Z" />
          <line x1="20" y1="20" x2="20" y2="2" stroke="#3D2B1F" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="-5" stroke="#3D2B1F" strokeWidth="1.5" />
          <path d="M 20 5 Q 30 10 20 18 Z" fill="#F5EEDB" />
          <path d="M 40 -2 Q 52 5 40 15 Z" fill="#F5EEDB" />
        </g>

        <g transform="translate(1330, 430) scale(0.55)" stroke="#1E555C" strokeWidth="1.2" fill="none">
          <path d="M 0 0 Q 15 -15 30 0 T 60 0 T 90 0" />
          <path d="M 5 0 Q 10 -8 20 0" fill="#C8DEDD" />
          <path d="M 35 0 Q 40 -8 50 0" fill="#C8DEDD" />
        </g>

        {/* 6. Grand Cartouche and Compass Rose */}
        <RenaissanceCartouche x={50} y={40} width={500} height={205} />
        <CompassRose x={1920} y={200} size={150} />

        {/* 7. Illuminated Migration & Transmission Routes (Persian Labels) */}
        {TRANSMISSION_ROUTES.map(route => {
          const isSelected = selectedRouteId === route.id;
          const isFaded = selectedRouteId !== null && !isSelected;

          return (
            <g
              key={route.id}
              onClick={() => onSelectRoute(isSelected ? null : route.id)}
              className="cursor-pointer group"
              opacity={isFaded ? 0.25 : 1}
            >
              <path
                d={route.svgPath}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? 10 : 6}
                strokeOpacity={isSelected ? 0.6 : 0.3}
                filter="url(#goldenGlow)"
              />
              <path
                d={route.svgPath}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? 3.5 : 2.2}
                strokeDasharray={isSelected ? '8 4' : '6 3'}
                className={isSelected ? 'animate-pulse' : ''}
              />

              {/* Persian Banner along the route */}
              <text fill={route.color} fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="700">
                <textPath href={`#path-${route.id}`} startOffset="30%" method="align">
                  ✦ {route.persianName} ✦
                </textPath>
              </text>
              <path id={`path-${route.id}`} d={route.svgPath} fill="none" stroke="none" />
            </g>
          );
        })}

        {/* 8. Floating Golden Microtonal Acoustic Wave Diagrams Across Borders (Persian) */}
        {/* موج ریزپرده‌های کرن و کما میان آناتولی و قفقاز */}
        <g transform="translate(1050, 360)">
          <path
            d="M 0 30 Q 30 5 60 30 T 120 30 T 180 30 T 240 30 T 300 30"
            fill="none"
            stroke="#D97706"
            strokeWidth={isPlayingAudio ? 2.5 : 1.8}
            filter="url(#goldenGlow)"
            className={isPlayingAudio ? 'animate-pulse' : ''}
          />
          <circle cx="60" cy="30" r="5" fill="#D97706" stroke="#FFF" strokeWidth="1" />
          <text x="60" y="14" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="800">
            کُرُن (۵۰- سنت)
          </text>
          <circle cx="180" cy="30" r="5" fill="#1E555C" stroke="#FFF" strokeWidth="1" />
          <text x="180" y="52" textAnchor="middle" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="800">
            کما (۲۲.۶- سنت)
          </text>
        </g>

        {/* موج ایقاع لنگ آکساک بر فراز دانوب */}
        <g transform="translate(560, 480)">
          <path
            d="M 0 20 L 15 5 L 30 20 L 45 5 L 60 20 L 75 5 L 90 20 L 115 -2 L 140 20"
            fill="none"
            stroke="#8B2635"
            strokeWidth={isPlayingAudio ? 2.5 : 1.8}
            filter="url(#crimsonGlow)"
          />
          <text x="70" y="40" textAnchor="middle" fill="#8B2635" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="800">
            ایقاع لنگ آکساک (۲+۲+۲+۳)
          </text>
        </g>

        {/* موج چهارم افزوده لیدیایی دوئینا در کارپات */}
        <g transform="translate(320, 260)">
          <path
            d="M 0 20 Q 25 0 50 20 Q 75 40 100 20 Q 130 5 160 20"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
          <circle cx="100" cy="20" r="4" fill="#D97706" />
          <text x="100" y="8" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="11" fontWeight="800">
            چهارم افزوده دوئینا (#۴)
          </text>
        </g>

        {/* 9. Paired Instrument Corridor Medallions (Persian Labels) */}
        {/* مدالیون ۱: سنتور در برابر تسامبال */}
        <g
          transform="translate(680, 220)"
          className="cursor-pointer group"
          onClick={() => onOpenInstrumentPlate('santur-tambal')}
        >
          <circle cx="0" cy="0" r="34" fill="#F5EEDB" stroke="#781D22" strokeWidth="2" filter="url(#goldenGlow)" />
          <circle cx="0" cy="0" r="29" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
          <polygon points="-14,-8 14,-8 18,10 -18,10" fill="#DECAAA" stroke="#3D2B1F" strokeWidth="1" />
          <line x1="-10" y1="1" x2="10" y2="1" stroke="#781D22" strokeWidth="1" />
          <text x="0" y="46" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="800">
            سنتور ⇄ تسامبال
          </text>
          <text x="0" y="60" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            (کلیک برای بررسی تابلوی ارگانولوژی)
          </text>
        </g>

        {/* مدالیون ۲: سه‌تار در برابر بوزوکی و تامبوریتزا */}
        <g
          transform="translate(820, 620)"
          className="cursor-pointer group"
          onClick={() => onOpenInstrumentPlate('setar-bouzouki-tambura')}
        >
          <circle cx="0" cy="0" r="34" fill="#F5EEDB" stroke="#1E555C" strokeWidth="2" filter="url(#goldenGlow)" />
          <circle cx="0" cy="0" r="29" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="-4" y1="-16" x2="-4" y2="8" stroke="#3D2B1F" strokeWidth="1.5" />
          <ellipse cx="-4" cy="10" rx="9" ry="11" fill="#DECAAA" stroke="#3D2B1F" strokeWidth="1" />
          <text x="0" y="46" textAnchor="middle" fill="#1E555C" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="800">
            سه‌تار ⇄ بوزوکی
          </text>
          <text x="0" y="60" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            (کلیک برای بررسی تابلوی سازشناسی)
          </text>
        </g>

        {/* مدالیون ۳: نی هفت‌بند در برابر کاوال چوپانی */}
        <g
          transform="translate(1180, 430)"
          className="cursor-pointer group"
          onClick={() => onOpenInstrumentPlate('ney-caval')}
        >
          <circle cx="0" cy="0" r="34" fill="#F5EEDB" stroke="#D97706" strokeWidth="2" filter="url(#goldenGlow)" />
          <circle cx="0" cy="0" r="29" fill="none" stroke="#781D22" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="-14" y1="-14" x2="14" y2="14" stroke="#594234" strokeWidth="2" />
          <line x1="14" y1="-14" x2="-14" y2="14" stroke="#781D22" strokeWidth="2" />
          <text x="0" y="46" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="12" fontWeight="800">
            نی ⇄ کاوال
          </text>
          <text x="0" y="60" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            (کلیک برای بررسی تابلوی فلوت‌ها)
          </text>
        </g>

        {/* 10. Interactive Cartographic Nodes (Persian Primary) */}
        {CARTOGRAPHIC_NODES.map(node => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => onSelectNode(isSelected ? null : node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulsing ring */}
              <circle
                cx="0"
                cy="0"
                r={isSelected || isHovered ? 22 : 13}
                fill={isSelected ? '#781D22' : '#D97706'}
                fillOpacity={isSelected ? 0.4 : 0.2}
                stroke={isSelected ? '#781D22' : '#D97706'}
                strokeWidth={isSelected ? 1.8 : 0.9}
                className={isSelected ? 'animate-ping' : ''}
              />

              {/* Core Node Marker */}
              <circle cx="0" cy="0" r="6.5" fill="#F5EEDB" stroke="#594234" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3.5" fill={isSelected ? '#781D22' : '#D97706'} />

              {/* Node City Label in Persian */}
              <text
                x="0"
                y="-13"
                textAnchor="middle"
                fill="#221A15"
                fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
                fontSize={isSelected ? 13 : 11}
                fontWeight="800"
                className="drop-shadow-sm select-none"
              >
                {node.namePersian}
              </text>

              {/* Latin/Local transcription below */}
              <text
                x="0"
                y="19"
                textAnchor="middle"
                fill="#594234"
                fontFamily="EB Garamond, serif"
                fontSize="9.5"
                fontStyle="italic"
                className="select-none"
              >
                {node.nameLatin}
              </text>
            </g>
          );
        })}

        {/* 11. Ornate Border Frame with Renaissance Graticules */}
        <rect x="6" y="6" width="2088" height="888" fill="none" stroke="#594234" strokeWidth="3" />
        <rect x="14" y="14" width="2072" height="872" fill="none" stroke="#781D22" strokeWidth="1.5" />
        <rect x="18" y="18" width="2064" height="864" fill="none" stroke="#D97706" strokeWidth="0.8" strokeDasharray="8 4" />

        {/* Corner Renaissance Rosettes */}
        {[
          { cx: 18, cy: 18 },
          { cx: 2082, cy: 18 },
          { cx: 18, cy: 882 },
          { cx: 2082, cy: 882 },
        ].map((corner, i) => (
          <g key={i}>
            <circle cx={corner.cx} cy={corner.cy} r="14" fill="#F5EEDB" stroke="#781D22" strokeWidth="1.5" />
            <circle cx={corner.cx} cy={corner.cy} r="8" fill="#D97706" />
            <circle cx={corner.cx} cy={corner.cy} r="3" fill="#3D2B1F" />
          </g>
        ))}

        {/* Degree Markings */}
        {Array.from({ length: 42 }).map((_, i) => {
          const x = 50 + i * 48;
          return (
            <g key={`top-tick-${i}`}>
              <line x1={x} y1="6" x2={x} y2="14" stroke="#594234" strokeWidth={i % 5 === 0 ? 1.5 : 0.6} />
              <line x1={x} y1="886" x2={x} y2="894" stroke="#594234" strokeWidth={i % 5 === 0 ? 1.5 : 0.6} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
