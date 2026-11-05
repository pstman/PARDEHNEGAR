/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * تابلوهای کنده‌کاری مسین سبک رنسانس با خط و زبان فارسی
 */

export const SanturFacingTambalPlate: React.FC<{ activeInstrument?: 'santur' | 'tambal' | 'both' }> = ({
  activeInstrument = 'both',
}) => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#594234]/40 bg-[#F5EEDB] shadow-inner p-3 text-right" dir="rtl">
      <svg className="w-full h-full" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="etchHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#594234" strokeWidth="0.5" strokeOpacity="0.12" />
          </pattern>
        </defs>

        <rect width="600" height="450" fill="url(#etchHatch)" />

        {/* Ornate Inner Border Frame */}
        <rect x="12" y="12" width="576" height="426" fill="none" stroke="#781D22" strokeWidth="1.2" />
        <rect x="16" y="16" width="568" height="418" fill="none" stroke="#594234" strokeWidth="0.8" strokeDasharray="5 2" />

        {/* Plate Title Header in Persian */}
        <text x="300" y="38" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="15" fontWeight="900">
          لوح اول: سازهای زهی ضربه‌ای ذوزنقه‌ای
        </text>
        <text x="300" y="56" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="12" fontWeight="600">
          سنتور ایرانی (۷۲ سیم و ۱۸ خرک) در برابر تسامبال بزرگ دانوب (رومانی)
        </text>

        {/* Left Side: Iranian Santur */}
        <g id="santur-group" opacity={activeInstrument === 'tambal' ? 0.35 : 1} className="transition-opacity duration-300">
          <text x="150" y="82" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="13" fontWeight="800">
            سنتور کهن ایرانی
          </text>
          <text x="150" y="98" textAnchor="middle" fill="#1E555C" fontFamily="Vazirmatn, serif" fontSize="11">
            ۷۲ سیم • ۱۸ خرک چوب گردو
          </text>

          {/* Trapezoidal Soundbox (Santur) */}
          <polygon
            points="70,120 230,120 255,230 45,230"
            fill="#EAD9BA"
            stroke="#594234"
            strokeWidth="2"
          />
          <polygon
            points="76,126 224,126 247,224 53,224"
            fill="#DECAAA"
            stroke="#781D22"
            strokeWidth="1"
          />

          {/* Rosette Soundholes (Gol) */}
          <circle cx="110" cy="175" r="10" fill="#3D2B1F" stroke="#781D22" strokeWidth="1" />
          <circle cx="190" cy="175" r="10" fill="#3D2B1F" stroke="#781D22" strokeWidth="1" />
          <circle cx="110" cy="175" r="4" fill="#EAD9BA" />
          <circle cx="190" cy="175" r="4" fill="#EAD9BA" />

          {/* Santur String Courses */}
          {Array.from({ length: 9 }).map((_, i) => {
            const yOffset = 135 + i * 9.5;
            const xLeft = 65 + i * -2.2;
            const xRight = 235 + i * 2.2;
            return (
              <g key={i}>
                <line x1={xLeft} y1={yOffset} x2={xRight} y2={yOffset} stroke={i < 4 ? '#D97706' : '#594234'} strokeWidth={i < 4 ? '1.2' : '0.9'} />
                <circle cx={xLeft + 50} cy={yOffset} r="2.5" fill="#3D2B1F" />
                <circle cx={xRight - 50} cy={yOffset} r="2.5" fill="#3D2B1F" />
              </g>
            );
          })}

          {/* Delicate Persian Mezrāb */}
          <path
            d="M 60 270 Q 100 262 135 272 Q 150 276 160 274 Q 155 279 135 278 Q 100 270 60 275 Z"
            fill="#594234"
            stroke="#3D2B1F"
            strokeWidth="0.8"
          />
          <ellipse cx="75" cy="272" rx="4" ry="2.5" fill="#F5EEDB" stroke="#3D2B1F" strokeWidth="0.8" />
          <text x="110" y="295" textAnchor="middle" fill="#6B5344" fontFamily="Vazirmatn, serif" fontSize="10">
            مضراب ظریف چوب گردو با حلقه انگشت
          </text>
        </g>

        {/* Center Divider: Acoustic Continuum Arrow */}
        <g transform="translate(300, 200)">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#781D22" strokeWidth="1.5" />
          <path d="M 10 -4 L 16 0 L 10 4 Z" fill="#781D22" />
          <path d="M -10 -4 L -16 0 L -10 4 Z" fill="#781D22" />
          <circle cx="0" cy="0" r="14" fill="#F5EEDB" stroke="#D97706" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#781D22" fontSize="11" fontFamily="Cinzel, serif" fontWeight="700">☈</text>
          <text x="0" y="24" textAnchor="middle" fill="#781D22" fontSize="9" fontFamily="Vazirmatn, serif" fontWeight="700">
            سیر تبارشناسی
          </text>
        </g>

        {/* Right Side: Romanian Concert Țambal Mare */}
        <g id="tambal-group" opacity={activeInstrument === 'santur' ? 0.35 : 1} className="transition-opacity duration-300">
          <text x="450" y="82" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="13" fontWeight="800">
            تسامبال بزرگ رومانی (دانوب)
          </text>
          <text x="450" y="98" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="11">
            Țambal Mare • سیمبالوم کنسرتی
          </text>

          {/* Țambal Heavy Trapezoid Frame */}
          <polygon
            points="360,115 540,115 565,235 335,235"
            fill="#DDC7A5"
            stroke="#594234"
            strokeWidth="2.5"
          />
          <polygon
            points="366,122 534,122 557,228 343,228"
            fill="#CDAF86"
            stroke="#781D22"
            strokeWidth="1.2"
          />

          {/* Central Damper Bar (Pedal Mechanism) */}
          <rect x="446" y="122" width="8" height="106" fill="#3D2B1F" stroke="#781D22" strokeWidth="0.8" />
          <line x1="450" y1="228" x2="450" y2="255" stroke="#781D22" strokeWidth="2" />
          <rect x="435" y="255" width="30" height="7" rx="2" fill="#594234" stroke="#3D2B1F" strokeWidth="1" />

          {/* Dense Chromatic Courses */}
          {Array.from({ length: 14 }).map((_, i) => {
            const yOffset = 130 + i * 6.8;
            const xLeft = 356 + i * -1.2;
            const xRight = 544 + i * 1.2;
            return (
              <g key={i}>
                <line x1={xLeft} y1={yOffset} x2={xRight} y2={yOffset} stroke="#3D2B1F" strokeWidth="0.8" strokeOpacity="0.85" />
                <circle cx={xLeft + 35} cy={yOffset} r="1.8" fill="#781D22" />
                <circle cx={xRight - 35} cy={yOffset} r="1.8" fill="#781D22" />
              </g>
            );
          })}

          {/* Romanian Ciocănele */}
          <path
            d="M 370 274 L 435 274 Q 442 270 445 274 Q 442 278 435 274 Z"
            fill="#3D2B1F"
            stroke="#594234"
            strokeWidth="1.2"
          />
          <ellipse cx="438" cy="274" rx="7" ry="5" fill="#8B2635" stroke="#3D2B1F" strokeWidth="1" />
          <text x="440" y="295" textAnchor="middle" fill="#6B5344" fontFamily="Vazirmatn, serif" fontSize="10">
            چکش‌های سنگین چرمی چوکانله (Ciocănele)
          </text>
        </g>

        {/* Bottom Comparative Acoustic Waveform Chart in Persian */}
        <g transform="translate(40, 315)">
          <rect x="0" y="0" width="520" height="98" rx="4" fill="#F0E5D0" stroke="#594234" strokeWidth="1" />
          <text x="260" y="20" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="11" fontWeight="800">
            مقایسه طیف آکوستیک: ضربه اولیه (Attack) و تداوم رزونانس (Sustain)
          </text>

          {/* Santur Wave */}
          <path
            d="M 30 50 Q 50 30 70 50 T 110 50 T 150 50 T 190 50 T 230 50 T 270 50 T 310 50 T 350 50 T 390 50 T 430 50 T 470 50"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.8"
          />
          <text x="475" y="47" textAnchor="end" fill="#D97706" fontFamily="Vazirmatn, serif" fontSize="10" fontWeight="700">
            سنتور: طنین کشیده و پیوسته زنگ‌دار با ضربه نرم
          </text>

          {/* Țambal Wave */}
          <path
            d="M 30 75 Q 35 25 45 75 Q 55 90 70 75 Q 90 65 120 75 Q 160 70 210 75 Q 260 75 320 75 L 470 75"
            fill="none"
            stroke="#8B2635"
            strokeWidth="2"
          />
          <text x="475" y="77" textAnchor="end" fill="#8B2635" fontFamily="Vazirmatn, serif" fontSize="10" fontWeight="700">
            تسامبال: ضربه کوبنده و ریتمیک همراه با مهار پدال خفه‌کن
          </text>
        </g>
      </svg>
    </div>
  );
};

export const SetarBouzoukiTamburaPlate: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#594234]/40 bg-[#F5EEDB] shadow-inner p-3 text-right" dir="rtl">
      <svg className="w-full h-full" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
        <rect x="12" y="12" width="576" height="426" fill="none" stroke="#781D22" strokeWidth="1.2" />
        <rect x="16" y="16" width="568" height="418" fill="none" stroke="#594234" strokeWidth="0.8" strokeDasharray="5 2" />

        <text x="300" y="38" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="15" fontWeight="900">
          لوح دوم: سیر دگرگونی لوت‌های دسته‌بلند پرده‌دار
        </text>
        <text x="300" y="56" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="12" fontWeight="600">
          سه‌تار ایرانی، بوزوکی یونانی و تامبوریتزای اسلاوی حوضه دانوب
        </text>

        {/* Left: Persian Setar */}
        <g transform="translate(60, 75)">
          <text x="80" y="15" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="13" fontWeight="800">
            سه‌تار ایرانی
          </text>
          <text x="80" y="30" textAnchor="middle" fill="#1E555C" fontFamily="Vazirmatn, serif" fontSize="10">
            پرده‌های روده‌ای متحرک با ریزپرده
          </text>

          <rect x="76" y="40" width="8" height="230" fill="#6B4B35" stroke="#3D2B1F" strokeWidth="1" />
          <rect x="73" y="35" width="14" height="25" fill="#594234" stroke="#3D2B1F" strokeWidth="1" />
          <circle cx="68" cy="42" r="3" fill="#D97706" />
          <circle cx="92" cy="48" r="3" fill="#D97706" />
          <circle cx="68" cy="54" r="3" fill="#D97706" />
          <circle cx="92" cy="56" r="3" fill="#8B2635" />

          {[60, 75, 87, 95, 110, 125, 137, 148, 165, 180, 200, 220, 240].map((y, i) => (
            <g key={i}>
              <line x1="74" y1={y} x2="86" y2={y} stroke={i === 2 || i === 6 ? '#781D22' : '#DECAAA'} strokeWidth={i === 2 ? 2 : 1} />
              {(i === 2 || i === 6) && (
                <text x="96" y={y + 3} fill="#781D22" fontSize="8" fontFamily="Vazirmatn, serif" fontWeight="800">کُرُن (-۵۰¢)</text>
              )}
            </g>
          ))}

          <ellipse cx="80" cy="290" rx="36" ry="46" fill="#DDC7A5" stroke="#594234" strokeWidth="2" />
          <path d="M 68 280 A 4 4 0 0 1 76 280 A 4 4 0 0 1 84 280" fill="none" stroke="#781D22" strokeWidth="1" />
          <circle cx="80" cy="295" r="2" fill="#3D2B1F" />
          <text x="80" y="348" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            کاسه چوب توت و زخمه ناخن سبابه
          </text>
        </g>

        {/* Center: Greek Bouzouki */}
        <g transform="translate(230, 75)">
          <text x="80" y="15" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="13" fontWeight="800">
            بوزوکی یونانی
          </text>
          <text x="80" y="30" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            ساز سه‌تاره شهری رمبتیکو
          </text>

          <rect x="75" y="40" width="10" height="225" fill="#3D2B1F" stroke="#1C1917" strokeWidth="1" />
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1="75" y1={55 + i * 11} x2="85" y2={55 + i * 11} stroke="#C0C0C0" strokeWidth="1" />
          ))}

          <ellipse cx="80" cy="290" rx="42" ry="50" fill="#E2D1B3" stroke="#3D2B1F" strokeWidth="2" />
          <ellipse cx="80" cy="275" rx="20" ry="15" fill="#1C1917" stroke="#DECAAA" strokeWidth="1" />
          <circle cx="80" cy="275" r="8" fill="#DECAAA" />
          <text x="80" y="348" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            کاسه ترکه‌ای منبت و سیم‌های جفت
          </text>
        </g>

        {/* Right: Slavic Tamburitza */}
        <g transform="translate(410, 75)">
          <text x="75" y="15" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="13" fontWeight="800">
            تامبوریتزای بالکان
          </text>
          <text x="75" y="30" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            بیسیرنیتسا و براچ حوضه دانوب
          </text>

          <rect x="71" y="45" width="8" height="215" fill="#594234" stroke="#3D2B1F" strokeWidth="1" />
          <path
            d="M 50 260 C 50 240 100 240 100 260 C 115 315 35 315 50 260 Z"
            fill="#D4BFA0"
            stroke="#594234"
            strokeWidth="2"
          />
          <circle cx="75" cy="275" r="7" fill="#3D2B1F" stroke="#781D22" strokeWidth="0.8" />
          <text x="75" y="348" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10">
            لوت مضاربی پانونی و دانوبی
          </text>
        </g>

        {/* Bottom Annotation in Persian */}
        <g transform="translate(35, 375)">
          <rect x="0" y="0" width="530" height="44" rx="3" fill="#EDE0C8" stroke="#781D22" strokeWidth="0.8" />
          <text x="515" y="18" textAnchor="end" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="10" fontWeight="800">
            نکته ارگانولوژی سازها:
          </text>
          <text x="515" y="34" textAnchor="end" fill="#3D2B1F" fontFamily="Vazirmatn, serif" fontSize="10.5">
            پرده‌های روده‌ای سه‌تار امکان تغییر جایگاه فواصل ربع‌پرده‌ای (کُرُن و سُری) را به دست نوازنده می‌سپارند؛ با انتقال ساز به غرب، پرده‌ها ثابت و فلزی شدند اما تحریرهای آوازی همچنان ماهیت مدال را حفظ کردند.
          </text>
        </g>
      </svg>
    </div>
  );
};

export const NeyAndCavalPlate: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#594234]/40 bg-[#F5EEDB] shadow-inner p-3 text-right" dir="rtl">
      <svg className="w-full h-full" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
        <rect x="12" y="12" width="576" height="426" fill="none" stroke="#781D22" strokeWidth="1.2" />
        <rect x="16" y="16" width="568" height="418" fill="none" stroke="#594234" strokeWidth="0.8" strokeDasharray="5 2" />

        <text x="300" y="38" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, Noto Naskh Arabic, serif" fontSize="15" fontWeight="900">
          لوح سوم: فلوت‌های استخوانی و نای نیستان
        </text>
        <text x="300" y="56" textAnchor="middle" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="12" fontWeight="600">
          نی هفت‌بند ایرانی و عثمانی در برابر کاوال چوپانی حوضه کارپات-دانوب
        </text>

        {/* Top: Persian / Ottoman Ney */}
        <g transform="translate(50, 80)">
          <text x="460" y="18" textAnchor="end" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="12" fontWeight="800">
            نی هفت‌بند (Arundo donax) با دهانه باشپاره
          </text>
          <text x="20" y="18" textAnchor="start" fill="#1E555C" fontFamily="Vazirmatn, serif" fontSize="11">
            نیستان ایران و آیین سماع
          </text>

          {/* Başpare */}
          <path d="M 30 45 L 45 42 L 45 58 L 30 55 Z" fill="#3D2B1F" stroke="#781D22" strokeWidth="1" />
          <circle cx="32" cy="50" r="3" fill="#D97706" />

          {/* 9 Segment Reed Body */}
          <rect x="45" y="44" width="440" height="12" rx="2" fill="#E5CBA2" stroke="#594234" strokeWidth="1.5" />
          {[95, 145, 195, 245, 295, 345, 395, 445].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="41" x2={x} y2="59" stroke="#781D22" strokeWidth="2" />
              <rect x={x - 2} y="43" width="4" height="14" fill="#3D2B1F" fillOpacity="0.4" />
            </g>
          ))}

          {[270, 305, 335, 365, 395, 425].map((x, i) => (
            <circle key={i} cx={x} cy="50" r="3.2" fill="#3D2B1F" stroke="#781D22" strokeWidth="0.8" />
          ))}

          <path
            d="M 45 50 Q 150 30 250 50 T 450 50"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </g>

        {/* Middle: Romanian Balkan Pastoral Caval */}
        <g transform="translate(50, 190)">
          <text x="460" y="18" textAnchor="end" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="12" fontWeight="800">
            کاوال چوپانی کارپات (Cavalul ciobănesc)
          </text>
          <text x="20" y="18" textAnchor="start" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="11">
            آوازهای دوئینا و گام‌های باستانی
          </text>

          <path d="M 30 46 L 45 44 L 45 56 L 30 54 Z" fill="#6B4B35" stroke="#3D2B1F" strokeWidth="1" />
          <rect x="45" y="45" width="440" height="10" rx="1" fill="#C9A87E" stroke="#3D2B1F" strokeWidth="1.5" />
          <rect x="180" y="43" width="8" height="14" fill="#DECAAA" stroke="#781D22" strokeWidth="1" />
          <rect x="320" y="43" width="8" height="14" fill="#DECAAA" stroke="#781D22" strokeWidth="1" />

          {[220, 250, 275, 300, 325].map((x, i) => (
            <circle key={i} cx={x} cy="50" r="3" fill="#3D2B1F" stroke="#781D22" strokeWidth="0.8" />
          ))}

          {/* Devil's Holes */}
          {[375, 405, 435].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="50" r="2.5" fill="#781D22" stroke="#3D2B1F" strokeWidth="0.8" />
              <text x={x} y="68" textAnchor="middle" fill="#781D22" fontSize="8" fontFamily="Vazirmatn, serif">
                طنین
              </text>
            </g>
          ))}
          <text x="405" y="82" textAnchor="middle" fill="#781D22" fontSize="9" fontFamily="Vazirmatn, serif">
            "روزنه‌های تشدید طنین شیطان" (Găurile Dracului)
          </text>
        </g>

        {/* Bottom Acoustic Resonance Diagram in Persian */}
        <g transform="translate(40, 310)">
          <rect x="0" y="0" width="520" height="98" rx="4" fill="#F0E5D0" stroke="#594234" strokeWidth="1" />
          <text x="260" y="20" textAnchor="middle" fill="#781D22" fontFamily="Vazirmatn, serif" fontSize="11" fontWeight="800">
            فیزیک آکوستیک تطبیقی: صدای معنوی نی در برابر نوای چوپانی کاوال
          </text>

          <text x="505" y="44" textAnchor="end" fill="#3D2B1F" fontFamily="Vazirmatn, serif" fontSize="11">
            • <strong className="text-[#1E555C]">نی هفت‌بند:</strong> شیوه دندان‌لب امکان اجرای ۴ اکتاو کامل همراه با نغمه‌خوانی همزمان حنجره در بدنه ساز را فراهم می‌سازد.
          </text>
          <text x="505" y="66" textAnchor="end" fill="#3D2B1F" fontFamily="Vazirmatn, serif" fontSize="11">
            • <strong className="text-[#781D22]">کاوال کارپات:</strong> ستون استوانه‌ای چوبی با ۳ روزنه فرودین، رنگ صوتی بم و غمناک دوئینا را با هارمونیک‌های طبیعی پدید می‌آورد.
          </text>
          <text x="505" y="88" textAnchor="end" fill="#594234" fontFamily="Vazirmatn, serif" fontSize="10.5">
            هر دو ساز فاقد تیغه سوت هستند و نوازنده به طور مستقیم با لب و حنجره، ریزپرده‌ها را شکل می‌بخشد.
          </text>
        </g>
      </svg>
    </div>
  );
};
