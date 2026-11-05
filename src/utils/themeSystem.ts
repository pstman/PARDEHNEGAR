/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * سیستم مهندسی تم و پالت رنگی سراسری استودیو اینامیکس
 * امکان تغییر پویا و پایدار تم با کلیدهای از پیش‌تعیین‌شده و انتخابی
 */

export interface ColorThemePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  colors: {
    primary: string; // Used for primary action buttons, active tab backgrounds
    primaryHover: string;
    accent: string; // Gold, amber, or secondary glow
    accentGlow: string;
    bgDark: string; // Header, footer, dark containers
    bgMain: string; // Deep page background
    border: string; // Subtle borders
    textLight: string;
    textMuted: string;
  };
}

export const THEME_PRESETS: ColorThemePreset[] = [
  {
    id: 'sassanid_gold',
    name: 'زرین ساسانی و عنابی (رسمی و باستانی)',
    nameEn: 'Sassanid Gold & Oxblood (Original Historic)',
    description: 'الهام‌گرفته از عهد رنسانس، نقشه پارچمنت و رنگ‌های گرم عنابی، زعفرانی و آبنوس.',
    colors: {
      primary: '#8B2635',
      primaryHover: '#A62F41',
      accent: '#E5A836',
      accentGlow: '#F59E0B',
      bgDark: '#16110E',
      bgMain: '#0E0B09',
      border: '#594234',
      textLight: '#F5EEDB',
      textMuted: '#C4B59D'
    }
  },
  {
    id: 'nishapur_turquoise',
    name: 'فیروزه نیشابور و لاجورد (ایرانی و شرقی)',
    nameEn: 'Nishapur Turquoise & Lapis',
    description: 'ترکیب فیروزه درخشان و لاجورد عمیق مساجد اصفهان و خراسان با کنتراست بلورین.',
    colors: {
      primary: '#0D6E6E',
      primaryHover: '#148C8C',
      accent: '#4FD1C5',
      accentGlow: '#38B2AC',
      bgDark: '#0B1617',
      bgMain: '#060E0F',
      border: '#234E52',
      textLight: '#E6FFFA',
      textMuted: '#A0AEC0'
    }
  },
  {
    id: 'carpathian_emerald',
    name: 'زمرد کارپات و کهربا (دانوب و بالکان)',
    nameEn: 'Carpathian Emerald & Danubian Amber',
    description: 'طبیعت کوهستان‌های سرسبز کارپات، چوب سازهای زهی و رودخانه پرخروش دانوب.',
    colors: {
      primary: '#1B4D3E',
      primaryHover: '#2A725D',
      accent: '#F6AD55',
      accentGlow: '#ED8936',
      bgDark: '#0F1A15',
      bgMain: '#08100C',
      border: '#2C4A3E',
      textLight: '#EDFDF5',
      textMuted: '#9AE6B4'
    }
  },
  {
    id: 'safavid_ruby',
    name: 'لعل صفوی و ارغوانی سلطنتی',
    nameEn: 'Safavid Ruby & Imperial Amethyst',
    description: 'شکوه یاقوت‌های تزیینی، پرده‌های مخمل اشرافی و رنگ‌های شاهانه درباری.',
    colors: {
      primary: '#701A75',
      primaryHover: '#86198F',
      accent: '#F472B6',
      accentGlow: '#EC4899',
      bgDark: '#170B1A',
      bgMain: '#0F0511',
      border: '#581C87',
      textLight: '#FDF2F8',
      textMuted: '#FBCFE8'
    }
  },
  {
    id: 'studio_obsidian',
    name: 'آبنوس و نقره استودیویی (مدرن و های‌تک)',
    nameEn: 'Studio Obsidian & Platinum Silver',
    description: 'فضای استودیوی صدابرداری فوق مدرن با رنگ‌های خنثی، تیتانیوم و نورپردازی کهربایی.',
    colors: {
      primary: '#27272A',
      primaryHover: '#3F3F46',
      accent: '#FBBF24',
      accentGlow: '#F59E0B',
      bgDark: '#111113',
      bgMain: '#09090B',
      border: '#3F3F46',
      textLight: '#FAFAFA',
      textMuted: '#A1A1AA'
    }
  }
];

const STORAGE_KEY = 'enamix_pardehnegar_theme_v1';

export function getStoredTheme(): ColorThemePreset {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.colors) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return THEME_PRESETS[0];
}

export function applyTheme(theme: ColorThemePreset) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Ignore storage errors
  }

  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--color-bg-dark', theme.colors.bgDark);
  root.style.setProperty('--color-bg-main', theme.colors.bgMain);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-text-light', theme.colors.textLight);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
}
