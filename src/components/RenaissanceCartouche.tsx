/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const RenaissanceCartouche: React.FC<{ x: number; y: number; width?: number; height?: number }> = ({
  x,
  y,
  width = 500,
  height = 205,
}) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none select-none">
      {/* Parchment backing plate with double border and drop shadow */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="6"
        fill="#F5EEDB"
        fillOpacity="0.96"
        stroke="#3D2B1F"
        strokeWidth="2.2"
      />
      <rect
        x="6"
        y="6"
        width={width - 12}
        height={height - 12}
        rx="4"
        fill="none"
        stroke="#781D22"
        strokeWidth="1.4"
      />
      <rect
        x="10"
        y="10"
        width={width - 20}
        height={height - 20}
        rx="2"
        fill="none"
        stroke="#D97706"
        strokeWidth="0.9"
        strokeDasharray="4 2"
      />

      {/* Decorative corner flourishes */}
      <path d="M 14 26 C 14 18, 18 14, 26 14" fill="none" stroke="#781D22" strokeWidth="1.8" />
      <path d="M 486 26 C 486 18, 482 14, 474 14" fill="none" stroke="#781D22" strokeWidth="1.8" />
      <path d="M 14 178 C 14 186, 18 190, 26 190" fill="none" stroke="#781D22" strokeWidth="1.8" />
      <path d="M 486 178 C 486 186, 482 190, 474 190" fill="none" stroke="#781D22" strokeWidth="1.8" />

      {/* Top strapwork ornament & sunburst */}
      <circle cx={width / 2} cy="0" r="15" fill="#F5EEDB" stroke="#781D22" strokeWidth="1.8" />
      <circle cx={width / 2} cy="0" r="8" fill="#D97706" />
      <path
        d={`M ${width / 2 - 45} 0 Q ${width / 2 - 22} -16 ${width / 2} -8 Q ${width / 2 + 22} -16 ${width / 2 + 45} 0`}
        fill="none"
        stroke="#3D2B1F"
        strokeWidth="1.4"
      />

      {/* Persian Primary Title Header */}
      <text
        x={width / 2}
        y="36"
        textAnchor="middle"
        fill="#781D22"
        fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
        fontSize="21"
        fontWeight="900"
      >
        پیوستار آکوستیک: جهان صوتی ایران تا دانوب
      </text>

      {/* Subtitle in Persian */}
      <text
        x={width / 2}
        y="58"
        textAnchor="middle"
        fill="#3D2B1F"
        fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
        fontSize="13"
        fontWeight="600"
      >
        از فلات کهن ایران و آناتولی تا شبه‌جزیره بالکان و حوضه کارپات-دانوب (رومانی)
      </text>

      {/* Hairline Divider with diamond center */}
      <line x1={width / 2 - 145} y1="70" x2={width / 2 - 16} y2="70" stroke="#781D22" strokeWidth="1" />
      <polygon
        points={`${width / 2},66 ${width / 2 + 6},70 ${width / 2},74 ${width / 2 - 6},70`}
        fill="#D97706"
      />
      <line x1={width / 2 + 16} y1="70" x2={width / 2 + 145} y2="70" stroke="#781D22" strokeWidth="1" />

      {/* Classical Latin Monochord Inscription */}
      <text
        x={width / 2}
        y="90"
        textAnchor="middle"
        fill="#0E4047"
        fontFamily="Cinzel, serif"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2"
      >
        CONTINUUM ACUSTICUM INDO-DANUBIANUM
      </text>

      {/* Research Dedication in Persian */}
      <text
        x={width / 2}
        y="116"
        textAnchor="middle"
        fill="#221A15"
        fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
        fontSize="12"
        fontWeight="600"
      >
        پژوهش اتنوموزیکولوژی در باب تلاقی دستگاه‌های ردیف، مقامات عثمانی و دوئینای لوتاری
      </text>

      <text
        x={width / 2}
        y="140"
        textAnchor="middle"
        fill="#594234"
        fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
        fontSize="11.5"
      >
        بر بنیاد رسالات صفی‌الدین ارموی، شاهزاده دیمیتری کانتمیر، بلا بارتوک و کنستانتین برائیلویو
      </text>

      {/* Inscription line */}
      <text
        x={width / 2}
        y="164"
        textAnchor="middle"
        fill="#781D22"
        fontFamily="Vazirmatn, Noto Naskh Arabic, serif"
        fontSize="11"
        fontWeight="700"
      >
        سنتور و تسامبال • سه‌تار و بوزوکی • نای و کاوال شبانی
      </text>

      {/* Bottom Academic Seal in Persian */}
      <text
        x={width / 2}
        y="186"
        textAnchor="middle"
        fill="#3D2B1F"
        fontFamily="Cinzel, Vazirmatn, serif"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="1.5"
      >
        در حقیقت یکتایی وتر • نسخه آکادمیک کارتوگرافی
      </text>
    </g>
  );
};
