/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CompassRose: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 120 }) => {
  const r = size / 2;
  return (
    <g transform={`translate(${x - r}, ${y - r})`} className="pointer-events-none select-none opacity-85">
      {/* Outer rings */}
      <circle cx={r} cy={r} r={r - 4} fill="none" stroke="#781D22" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx={r} cy={r} r={r - 10} fill="none" stroke="#D97706" strokeWidth="1" />
      <circle cx={r} cy={r} r={r - 16} fill="none" stroke="#3D2B1F" strokeWidth="0.8" />

      {/* 32 Degree tick marks */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * 360) / 32;
        const rad = (angle * Math.PI) / 180;
        const isMajor = i % 8 === 0;
        const isSemi = i % 4 === 0;
        const len = isMajor ? 12 : isSemi ? 8 : 4;
        const x1 = r + (r - 16) * Math.cos(rad);
        const y1 = r + (r - 16) * Math.sin(rad);
        const x2 = r + (r - 16 - len) * Math.cos(rad);
        const y2 = r + (r - 16 - len) * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? '#781D22' : '#594234'}
            strokeWidth={isMajor ? 1.5 : 0.7}
          />
        );
      })}

      {/* 8 Cardinal and Intercardinal Star Points */}
      {/* North */}
      <polygon points={`${r},${r - (r - 16)} ${r + 6},${r - 10} ${r},${r}`} fill="#781D22" />
      <polygon points={`${r},${r - (r - 16)} ${r - 6},${r - 10} ${r},${r}`} fill="#D97706" />

      {/* South */}
      <polygon points={`${r},${r + (r - 16)} ${r - 6},${r + 10} ${r},${r}`} fill="#781D22" />
      <polygon points={`${r},${r + (r - 16)} ${r + 6},${r + 10} ${r},${r}`} fill="#D97706" />

      {/* East */}
      <polygon points={`${r + (r - 16)},${r} ${r + 10},${r - 6} ${r},${r}`} fill="#781D22" />
      <polygon points={`${r + (r - 16)},${r} ${r + 10},${r + 6} ${r},${r}`} fill="#D97706" />

      {/* West */}
      <polygon points={`${r - (r - 16)},${r} ${r - 10},${r + 6} ${r},${r}`} fill="#781D22" />
      <polygon points={`${r - (r - 16)},${r} ${r - 10},${r - 6} ${r},${r}`} fill="#D97706" />

      {/* Fleur-de-lis motif on North */}
      <path
        d={`M ${r} ${r - (r - 14)} C ${r - 7} ${r - (r - 8)}, ${r - 4} ${r - (r - 2)}, ${r} ${r - (r - 16)} C ${r + 4} ${r - (r - 2)}, ${r + 7} ${r - (r - 8)}, ${r} ${r - (r - 14)} Z`}
        fill="#D97706"
        stroke="#781D22"
        strokeWidth="0.5"
      />

      {/* Center boss */}
      <circle cx={r} cy={r} r="7" fill="#781D22" stroke="#F5EEDB" strokeWidth="1" />
      <circle cx={r} cy={r} r="3" fill="#D97706" />

      {/* Persian Cardinal Labels */}
      <text x={r} y={r - (r - 4)} textAnchor="middle" fill="#781D22" fontSize="12" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontWeight="800">
        شمال
      </text>
      <text x={r} y={r + r + 4} textAnchor="middle" fill="#594234" fontSize="11" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontWeight="700">
        جنوب
      </text>
      <text x={r + r + 6} y={r + 4} textAnchor="start" fill="#594234" fontSize="11" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontWeight="700">
        مشرق
      </text>
      <text x={r - r - 6} y={r + 4} textAnchor="end" fill="#594234" fontSize="11" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontWeight="700">
        مغرب
      </text>
    </g>
  );
};
