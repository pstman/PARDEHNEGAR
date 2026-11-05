/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * منطق ریاضی و آکوستیک پیوستار صوتی فلات ایران تا دانوب:
 * نسبت‌های فواصل میکروتنال (ریزپرده‌ها)، سری هارمونیک، اوزان ایقاعی لنگ (آکساک) و مختصات کارتوگرافی.
 */

export interface MicrotonalNote {
  name: string;
  persianName: string;
  romanianName?: string;
  centOffset: number; // انحراف بر حسب سنت نسبت به گام معتدل ۱۲ نیم‌پرده‌ای
  semitonesFromC4: number;
  description: string;
}

export interface ModalContinuumSystem {
  id: string;
  name: string;
  persianName: string;
  historicalEra: string;
  originRegion: string;
  culturalSphere: string;
  fundamentalHz: number;
  notes: MicrotonalNote[];
  intervalsDescription: string;
  rhythmicContext: string;
  historicalNote: string;
}

// ثوابت فواصل میکروتنال (ریزپرده‌ها بر حسب سنت)
export const MICROTONAL_CONSTANTS = {
  PERSIAN_KORON: -50,       // کُرُن (کاهش حدود نیم‌پرده معتدل یا ربع پرده / دوم خنثی)
  PERSIAN_SORI: 50,         // سُری (افزایش حدود ربع پرده)
  OTTOMAN_KOMA: -22.64,     // ۱ کمای هولدرین (پایه سیستم ۵۳ قسمتی عثمانی)
  OTTOMAN_BAKIYE: -90.22,   // بقّیه فیثاغورثی (۲۵۶/۲۴۳)
  SYNTONIC_COMMA: 21.51,    // کمای دیدیموس (۸۱/۸۰)
  MUJANNAB: 156.0,          // مجنّب فارابی
  PYTHAGOREAN_OCTAVE: 1200,
};

/**
 * تبدیل موقعیت نت و انحراف سِنت به بسامد هرتز
 */
export function centsToFrequency(semitonesFromC4: number, centOffset = 0, baseA4 = 440): number {
  const c4Hz = baseA4 * Math.pow(2, -9 / 12);
  const totalCents = semitonesFromC4 * 100 + centOffset;
  return c4Hz * Math.pow(2, totalCents / 1200);
}

/**
 * محاسبه سری هارمونیک‌ها و فروپاشی صوتی سازها
 */
export function calculateHarmonicSeries(
  fundamentalHz: number,
  count = 8,
  decayType: 'struck_metallic' | 'struck_wood' | 'plucked_gut' | 'plucked_steel' | 'reed_flute' | 'bone_flute' = 'struck_metallic'
): Array<{ harmonic: number; frequency: number; amplitude: number; centDeviation: number }> {
  const result: Array<{ harmonic: number; frequency: number; amplitude: number; centDeviation: number }> = [];

  for (let n = 1; n <= count; n++) {
    const frequency = fundamentalHz * n;
    const exactCents = 1200 * Math.log2(n);
    const nearest12TetSemitone = Math.round(exactCents / 100);
    const centDeviation = Math.round(exactCents - nearest12TetSemitone * 100);

    let amplitude = 1 / n;
    if (decayType === 'struck_metallic') {
      amplitude = Math.pow(1 / n, 0.75) * (n % 2 === 0 ? 0.9 : 1.1);
    } else if (decayType === 'struck_wood') {
      amplitude = Math.pow(1 / n, 1.2);
    } else if (decayType === 'plucked_gut') {
      amplitude = Math.pow(1 / n, 1.4);
    } else if (decayType === 'plucked_steel') {
      amplitude = Math.pow(1 / n, 0.85);
    } else if (decayType === 'reed_flute') {
      amplitude = n % 2 === 1 ? Math.pow(1 / n, 0.8) : Math.pow(1 / n, 2.0);
    } else if (decayType === 'bone_flute') {
      amplitude = Math.pow(1 / n, 1.1);
    }

    result.push({
      harmonic: n,
      frequency: Math.round(frequency * 100) / 100,
      amplitude: Math.min(1, Math.max(0, amplitude)),
      centDeviation,
    });
  }

  return result;
}

/**
 * اوزان ایقاعی لنگ (آکساک) در امتداد پیوستار عثمانی-بالکان-دانوب
 */
export interface AksakMeter {
  id: string;
  name: string;
  persianName: string;
  timeSignature: string;
  subdivisions: number[];
  origin: string;
  tempoBpm: number;
  description: string;
}

export const AKSAK_METERS: AksakMeter[] = [
  {
    id: 'ruchenitsa-7-8',
    name: 'راچنیتسا / ژامپاراله (۷/۸)',
    persianName: 'وزن هفت‌هشتم لنگ (۲+۲+۳)',
    timeSignature: '۷/۸',
    subdivisions: [2, 2, 3],
    origin: 'تراکیه بالکان و دوبروجای رومانی',
    tempoBpm: 240,
    description: 'الگوی ریتمیک کوتاه-کوتاه-کشیده که ریتم‌های زیبک آناتولی را به ژامپاراله دانوبی در موسیقی لوتاری رومانی پیوند می‌دهد.',
  },
  {
    id: 'pajdusko-5-8',
    name: 'پایدوشکو / روستمول (۵/۸)',
    persianName: 'وزن پنج‌هشتم لنگ (۲+۳)',
    timeSignature: '۵/۸',
    subdivisions: [2, 3],
    origin: 'کوه‌های بالکان و جلگه والاچیا',
    tempoBpm: 200,
    description: 'دو ضرب نامتقارن تند و کند که بازتابنده گام‌های چوپانی و ضرب‌آهنگ اسب‌های سوارکاران کهن استپ‌های سکایی است.',
  },
  {
    id: 'karsilama-9-8',
    name: 'کارشی‌لاما / جادانیاسکا (۹/۸)',
    persianName: 'وزن نه‌هشتم لنگ (۲+۲+۲+۳)',
    timeSignature: '۹/۸',
    subdivisions: [2, 2, 2, 3],
    origin: 'دربار استانبول تا بزم‌های خنیاگران لوتاری مولداوی',
    tempoBpm: 220,
    description: 'یکی از شاخص‌ترین اوزان لنگ عثمانی و خنیاگران کولی: سه گام کوتاه جفت که با یک جهش کشیده رقص به اوج می‌رسد.',
  },
  {
    id: 'doina-rubato',
    name: 'دوئینا / آواز بدون متر (Parlando-Rubato)',
    persianName: 'آواز آزاد و سیال بدون وزن متریک',
    timeSignature: 'آزاد',
    subdivisions: [1],
    origin: 'از فلات ایران تا کوهستان کارپات رومانی',
    tempoBpm: 60,
    description: 'مرثیه و شکواییه آوازی آزاد با تزیینات غنی، ریزپرده‌ها و ناله‌های کشیده، در انطباق کامل با روح آواز دستگاهی ایران و حیران کردی.',
  },
];

/**
 * دستگاه‌ها و نظام‌های مدال در پهنه پیوستار
 */
export const MODAL_CONTINUUM_SYSTEMS: ModalContinuumSystem[] = [
  {
    id: 'dastgah-shur',
    name: 'Dastgāh-e Shūr',
    persianName: 'دستگاه شور (مادر دستگاه‌های ایرانی)',
    historicalEra: 'دوره ساسانی، صفوی تا قاجار',
    originRegion: 'فلات ایران (اصفهان و شیراز)',
    culturalSphere: 'موسیقی دستگاهی و ردیف کهن ایران',
    fundamentalHz: 293.66, // D4
    notes: [
      { name: 'ر ۴ (D4)', persianName: 'درآمد (پایه / شاهد)', centOffset: 0, semitonesFromC4: 2, description: 'نت شاهد و پایه آغازین دستگاه شور' },
      { name: 'می ۴ کُرُن (E4 Koron)', persianName: 'گوشه (می کرن، ۵۰- سنت)', centOffset: -50, semitonesFromC4: 4, description: 'دوم خنثی (کاهش ۵۰ سنت)، مدار اصلی شور و ناله محوری' },
      { name: 'فا ۴ (F4)', persianName: 'اوج', centOffset: 0, semitonesFromC4: 5, description: 'سوم کوچک' },
      { name: 'سل ۴ (G4)', persianName: 'فرود (محور واخوان)', centOffset: 0, semitonesFromC4: 7, description: 'چهارم درست و نت طنین‌آفرین' },
      { name: 'لا ۴ (A4)', persianName: 'سلمک', centOffset: 0, semitonesFromC4: 9, description: 'پنجم درست' },
      { name: 'سی بمل ۴ (Bb4)', persianName: 'ملا نازی', centOffset: 0, semitonesFromC4: 10, description: 'ششم کوچک' },
      { name: 'دو ۵ (C5)', persianName: 'کرشمه (فرود به اکتاو)', centOffset: 0, semitonesFromC4: 12, description: 'هفتم کوچک و حرکت به اکتاو' },
    ],
    intervalsDescription: '۱ - ۳/۴ پرده (کُرُن) - ۳/۴ پرده - ۱ - ۱ - ۱/۲ - ۱',
    rhythmicContext: 'آغاز با آواز سیال روباتو و تداوم با ضرب‌آهنگ چهارمضراب ۶/۸',
    historicalNote: 'شور که "مادر دستگاه‌های موسیقی ایران" نام دارد، با مهاجرت نوازندگان به غرب به مقام عشاق عثمانی و نغمه‌های دوئینای دانوب رومانی راه یافت.',
  },
  {
    id: 'makam-rast',
    name: 'Makam Rast',
    persianName: 'مقام راست (سنت درباری عثمانی)',
    historicalEra: 'قرن ۱۴ تا ۱۹ میلادی',
    originRegion: 'آناتولی و قسطنطنیه / استانبول',
    culturalSphere: 'دربار عثمانی، سرای سلطنتی و سماع مولویه',
    fundamentalHz: 261.63, // C4
    notes: [
      { name: 'دو ۴ (راست)', persianName: 'قرار (نت پایه)', centOffset: 0, semitonesFromC4: 0, description: 'قرار و پایه نغمه راست' },
      { name: 'ر ۴ (دوگاه)', persianName: 'دوگاه', centOffset: 0, semitonesFromC4: 2, description: 'دوم بزرگ' },
      { name: 'می ۴ سه‌گاه', persianName: 'سه‌گاه (کاهش ۱ کما ~ ۲۳- سنت)', centOffset: -22.6, semitonesFromC4: 4, description: 'می کما-بمل: ریزپرده سه‌گاه با کسر کمای هولدرین' },
      { name: 'فا ۴ (چهارگاه)', persianName: 'چهارگاه', centOffset: 0, semitonesFromC4: 5, description: 'چهارم درست' },
      { name: 'سل ۴ (نوا)', persianName: 'نوا (گوچلو / نمایان)', centOffset: 0, semitonesFromC4: 7, description: 'نمایان و تکیه‌گاه ملودیک' },
      { name: 'لا ۴ (حسینی)', persianName: 'حسینی', centOffset: 0, semitonesFromC4: 9, description: 'ششم بزرگ' },
      { name: 'سی ۴ اوج', persianName: 'اوج (کاهش ۱ کما ~ ۲۳- سنت)', centOffset: -22.6, semitonesFromC4: 11, description: 'سی کما-بمل: ریزپرده اوج' },
      { name: 'دو ۵ (گردانیه)', persianName: 'گردانیه (اوج اکتاو)', centOffset: 0, semitonesFromC4: 12, description: 'اکتاو فوقانی' },
    ],
    intervalsDescription: 'ثلاثی راست با ریزپرده‌های هولدرین ۵۳ قسمتی',
    rhythmicContext: 'ایقاع دویک (۸/۸) و سماعی (۶/۸)',
    historicalNote: 'فرمول‌بندی شده توسط صفی‌الدین ارموی و شاهزاده دیمیتری کانتمیر مولداویایی در کتاب "علم الموسیقی".',
  },
  {
    id: 'byzantine-echos-2',
    name: 'Byzantine Echos II',
    persianName: 'اکوس دوم بیزانسی (Ἦχος Δεύτερος)',
    historicalEra: 'قرن ۸ تا ۱۵ میلادی',
    originRegion: 'تسالونیکی، کوه آتوس و صومعه‌های بالکان',
    culturalSphere: 'سرودخوانی ارتدوکس شرقی و اکتااکوس',
    fundamentalHz: 293.66, // D4
    notes: [
      { name: 'ر ۴ (Di)', persianName: 'پایه نغمه با واخوان ایسون', centOffset: 0, semitonesFromC4: 2, description: 'پایه با همراهی واخوان حنجره‌ای' },
      { name: 'می بمل ۴+ (Ke)', persianName: 'کروماتیک نرم (۳۳+ سنت)', centOffset: 33, semitonesFromC4: 3, description: 'دوم کروماتیک نرم بالاتر از می بمل' },
      { name: 'فا دیز ۴- (Zo)', persianName: 'سوم فرودین با کما (۲۰- سنت)', centOffset: -20, semitonesFromC4: 6, description: 'فا دیز با انحراف ملایم' },
      { name: 'سل ۴ (Ni)', persianName: 'تکیه‌گاه نمایان', centOffset: 0, semitonesFromC4: 7, description: 'چهارم محوری' },
      { name: 'لا ۴ (Pa)', persianName: 'پل صعودی', centOffset: 0, semitonesFromC4: 9, description: 'پنجم درست' },
      { name: 'سی بمل ۴+ (Vou)', persianName: 'گام کروماتیک فوقانی (۲۰+ سنت)', centOffset: 20, semitonesFromC4: 10, description: 'ششم با ریزپرده' },
      { name: 'دو ۵ (Ga)', persianName: 'فرود علیا', centOffset: 0, semitonesFromC4: 12, description: 'فرود اکتاو' },
    ],
    intervalsDescription: 'جنس کروماتیک نرم با واخوان دینامیک ایسون',
    rhythmicContext: 'سرود ملودیک کشیده و پرتحریر استیشراری',
    historicalNote: 'واسطه انتقال لحن‌های آسیای صغیر به شاهزاده‌نشین‌های والاچیا و مولداوی در حوضه دانوب.',
  },
  {
    id: 'romanian-doina-carpathian',
    name: 'Carpathian Doina',
    persianName: 'دوئینا و مقام لوتاری کارپات (رومانی)',
    historicalEra: 'قرن ۱۶ تا ۲۰ میلادی',
    originRegion: 'کوه‌های کارپات (مارامورش، مولداوی و والاچیا)',
    culturalSphere: 'موسیقی شبانی کهن دانوب و خنیاگران روما (لوتاری)',
    fundamentalHz: 293.66, // D4
    notes: [
      { name: 'ر ۴', persianName: 'پایه نهایی (Finalis)', romanianName: 'Finalis', centOffset: 0, semitonesFromC4: 2, description: 'پایه صوتی پایدار' },
      { name: 'می ۴', persianName: 'درجه گذر', romanianName: 'Trecere', centOffset: 0, semitonesFromC4: 4, description: 'دوم بزرگ' },
      { name: 'فا ۴+', persianName: 'سوم خنثی با ریزپرده (۳۵+ سنت)', romanianName: 'Sfert de ton', centOffset: 35, semitonesFromC4: 5, description: 'پل صوتی میان سوم کوچک و بزرگ مشابه حالت‌های شور' },
      { name: 'سل دیز ۴', persianName: 'چهارم افزوده آکوستیک کارپاتی', romanianName: 'Cvartă mărită', centOffset: 0, semitonesFromC4: 8, description: 'چهارم لیدیایی شاخص کوهستان کارپات' },
      { name: 'لا ۴', persianName: 'نمایان با لرزش تسامبال', romanianName: 'Dominantă', centOffset: 0, semitonesFromC4: 9, description: 'پنجم درست با طنین شفاف زهی' },
      { name: 'سی ۴-', persianName: 'ششم انعطاف‌پذیر (۳۰- سنت)', romanianName: 'Sextă flexibilă', centOffset: -30, semitonesFromC4: 11, description: 'تحریرهای ریزپرده‌ای غمناک' },
      { name: 'دو ۵', persianName: 'فرود ماقبل اکتاو', romanianName: 'Subtonică', centOffset: 0, semitonesFromC4: 12, description: 'فرود پایانی' },
    ],
    intervalsDescription: 'گام آکوستیک لیدین-دومینانت همراه با تحریرهای لغزان ریزپرده‌ای',
    rhythmicContext: 'آواز آزاد دوئینا که به رقص‌های شتابان ۷/۸ و سربا منتهی می‌شود',
    historicalNote: 'ثبت شده توسط بلا بارتوک و کنستانتین برائیلویو به عنوان بازمانده مستقیم نغمه‌های باستانی شرق در دره‌های منزوی کارپات.',
  },
];

/**
 * ایستگاه‌ها و شهرهای کارتوگرافی (viewBox 0 0 2100 900)
 */
export interface CartographicNode {
  id: string;
  nameLatin: string;
  namePersian: string;
  nameOriginal: string;
  region: string;
  x: number;
  y: number;
  instruments: string[];
  musicalTradition: string;
  historicalSignificance: string;
}

export const CARTOGRAPHIC_NODES: CartographicNode[] = [
  // حوضه کارپات-دانوب (رومانی و شمال غرب)
  {
    id: 'node-maramures',
    nameLatin: 'Maramures & Bucovina',
    namePersian: 'مارامورش و بوکووینا',
    nameOriginal: 'Maramureș (România)',
    region: 'شمال کوه‌های کارپات',
    x: 420,
    y: 240,
    instruments: ['کاوال (Caval)', 'فلویر چوپانی', 'تسامبال کوچک', 'کمانچه بوقی'],
    musicalTradition: 'هورای دراز (Hora Lungă) و آوازهای شبانی دوئینا با فلوت‌های باستانی',
    historicalSignificance: 'دژ کوهستانی منزوی که بازمانده فواصل کهن پنچ‌صدایی سکایی و داسی را در خود حفظ کرده است.',
  },
  {
    id: 'node-bucharest',
    nameLatin: 'Bucharest & Curtea de Arges',
    namePersian: 'بخارست و کورتیا د ارجش',
    nameOriginal: 'București (Valahia)',
    region: 'جلگه دانوب (والاچیا)',
    x: 520,
    y: 380,
    instruments: ['تسامبال بزرگ ارکسترال', 'نای پن‌فلوت', 'کوبزا', 'کمانچه و ویلن'],
    musicalTradition: 'موسیقی شهری خنیاگران لوتاری با تلفیق مقام‌های شرقی و سازبندی درباری',
    historicalSignificance: 'دربارهای اشرافی بویار که خنیاگران کولی در آن مقامات عثمانی کانتمیر را با نغمه‌های دانوبی درآمیختند.',
  },
  {
    id: 'node-iasi',
    nameLatin: 'Iasi & Bessarabia',
    namePersian: 'یاش و بسارابیا',
    nameOriginal: 'Iași (Moldova)',
    region: 'شرق کارپات و حوضه رود پروت',
    x: 590,
    y: 280,
    instruments: ['تسامبال', 'فلویر بزرگ', 'کوبزا زهی'],
    musicalTradition: 'لقاح صوتی موسیقی لوتاری و نغمه‌های کلزمر شرقی',
    historicalSignificance: 'پایتخت شاهزاده دیمیتری کانتمیر، حاکم مولداوی و نظریه‌پرداز نامدار موسیقی دربار عثمانی.',
  },

  // شبه جزیره بالکان
  {
    id: 'node-sarajevo',
    nameLatin: 'Sarajevo & Mostar',
    namePersian: 'سارایوو و موستار',
    nameOriginal: 'Сарајево (Bosna)',
    region: 'آلپ دیناریک (بوسنی)',
    x: 350,
    y: 440,
    instruments: ['ساز / شارگیا', 'تامبورا', 'گوسله', 'نی'],
    musicalTradition: 'سودالینکا (برگرفته از واژه سودای عثمانی و شعر پرشور غنایی)',
    historicalSignificance: 'پیوند تصنیف‌های حماسی اسلاوی با لحن سودازده و مالیخولیایی شهری عثمانی.',
  },
  {
    id: 'node-thessaloniki',
    nameLatin: 'Thessalonica & Mount Athos',
    namePersian: 'تسالونیکی و کوه آتوس',
    nameOriginal: 'Θεσσαλονίκη',
    region: 'مقدونیه اژه و یونان شمالی',
    x: 490,
    y: 530,
    instruments: ['بوزوکی', 'لیره اژه‌ای', 'قانون', 'نی'],
    musicalTradition: 'رمبتیکو و نظام نغمگی کلیسایی اکتااکوس بیزانس',
    historicalSignificance: 'کلان‌شهری که پناهندگان آسیای صغیر موسیقی کافه‌های ازمیر و عثمانی را به بوزوکی شهری رمبتیکو آوردند.',
  },

  // آناتولی و تنگه‌ها
  {
    id: 'node-istanbul',
    nameLatin: 'Constantinopolis / Istanbul',
    namePersian: 'استانبول / قسطنطنیه',
    nameOriginal: 'قسطنطينيه / İstanbul',
    region: 'بسفر و دریای مرمره',
    x: 740,
    y: 450,
    instruments: ['تنبور', 'نی', 'سنتور عثمانی', 'کمانچه رومی', 'کودوم'],
    musicalTradition: 'موسیقی کلاسیک سرای عثمانی و مارش‌های مهترخان نظامی',
    historicalSignificance: 'کانون اعظم تلفیق فرهنگی که در آن استادان ایرانی، یونانی، ارمنی و عرب نظام مقام را مدون ساختند.',
  },
  {
    id: 'node-konya',
    nameLatin: 'Iconium / Konya',
    namePersian: 'قونیه (مدفن مولانا)',
    nameOriginal: 'قونیه (Konya)',
    region: 'فلات مرکزی آناتولی',
    x: 910,
    y: 520,
    instruments: ['نی هفت‌بند', 'کودوم', 'رباب مولویه'],
    musicalTradition: 'آیین سماع مولویه و اشعار عرفانی جلال‌الدین محمد بلخی رومی',
    historicalSignificance: 'خاستگاه عرفانی که در آن "نی" تجسم روح مشتاق انسان در اشتیاق بازگشت به نیستان ازلی است.',
  },
  {
    id: 'node-diyarbakir',
    nameLatin: 'Amida / Diyarbakir',
    namePersian: 'دیاربکر / آمد',
    nameOriginal: 'دیاربکر / Amed',
    region: 'حوضه دجله علیا',
    x: 1140,
    y: 540,
    instruments: ['آواز دنگبژ', 'دودوک / می', 'دف', 'باغلاما'],
    musicalTradition: 'روایت‌گری حماسی دنگبژ و مرثیه‌های مدال بین‌النهرین',
    historicalSignificance: 'چهارراه ریزپرده‌های آوازی کردی، ارمنی، سریانی و ترکی.',
  },

  // قفقاز و شمال غرب ایران
  {
    id: 'node-tabriz',
    nameLatin: 'Tauris / Tabriz',
    namePersian: 'تبریز و ارومیه',
    nameOriginal: 'تبریز (آذربایجان)',
    region: 'دریاچه ارومیه و ارسباران',
    x: 1390,
    y: 480,
    instruments: ['تار', 'کمانچه', 'بالابان', 'قاوال'],
    musicalTradition: 'مقام آذربایجانی و خنیاگری عاشیقی',
    historicalSignificance: 'زادگاه صفی‌الدین ارموی؛ پیوندگاه حیاتی جاده ابریشم میان قفقاز و فلات مرکزی ایران.',
  },

  // فلات مرکزی ایران
  {
    id: 'node-rayy',
    nameLatin: 'Rhagae / Rayy (Tehran)',
    namePersian: 'ری باستان (تهران)',
    nameOriginal: 'ری (تهران باستان)',
    region: 'دامنه‌های جنوبی البرز',
    x: 1580,
    y: 510,
    instruments: ['سه‌تار', 'سنتور', 'نی', 'تنبک'],
    musicalTradition: 'ردیف کلاسیک دستگاهی و آیین‌های تعزیه',
    historicalSignificance: 'دیار ابن‌سینا و رازی که در رسالات طبیعیات خود نسبت‌های آکوستیک تارهای مرتعش را تبیین نمودند.',
  },
  {
    id: 'node-isfahan',
    nameLatin: 'Aspadana / Isfahan',
    namePersian: 'اصفهان (نصف جهان)',
    nameOriginal: 'اصفهان (عالی‌قاپو)',
    region: 'فلات مرکزی و زاینده‌رود',
    x: 1680,
    y: 630,
    instruments: ['سنتور', 'سه‌تار', 'کمانچه', 'بربط / عود', 'نی'],
    musicalTradition: 'ردیف مکتب اصفهان، آواز اصفهان و قطعات چهارمضراب',
    historicalSignificance: 'نگین تمدن صفوی؛ اتاق موسیقی کاخ عالی‌قاپو با مقرنس‌های تنگ‌بری برای تنظیم طنین آکوستیک سازها.',
  },
  {
    id: 'node-shiraz',
    nameLatin: 'Shiraz / Fars',
    namePersian: 'شیراز و پارس کهن',
    nameOriginal: 'شیراز (فارس)',
    region: 'دامنه‌های زاگرس جنوبی',
    x: 1780,
    y: 720,
    instruments: ['سه‌تار', 'نی', 'سنتور'],
    musicalTradition: 'غزل‌خوانی حافظ و سعدی در ماهور، شور و سه‌گاه',
    historicalSignificance: 'مهد فرهنگ ایرانی؛ سرچشمه اوزان عروضی که ریتم و جمله‌بندی موسیقی دستگاهی را شکل بخشیده‌اند.',
  },
];

/**
 * سه شاهراه تاریخی مهاجرت و انتقال موسیقایی
 */
export interface TransmissionRoute {
  id: string;
  name: string;
  persianName: string;
  subtitlePersian: string;
  epoch: string;
  color: string;
  glowColor: string;
  svgPath: string;
  keyStops: string[];
  musicalContributions: string;
  historicalNarrative: string;
}

export const TRANSMISSION_ROUTES: TransmissionRoute[] = [
  {
    id: 'scythian-alan',
    name: 'مسیر استپ‌های سکایی و آلانی',
    persianName: 'شاهراه باستانی سکاها و آلان‌ها',
    subtitlePersian: 'از استپ‌های ایرانی تا جلگه دانوب',
    epoch: 'سده هشتم پیش از میلاد تا سده دهم میلادی',
    color: '#D97706', // طلای زعفرانی
    glowColor: 'rgba(217, 119, 6, 0.45)',
    svgPath: 'M 1850 490 Q 1550 310 1200 240 T 750 200 T 420 240 L 520 380',
    keyStops: ['استپ‌های آسیای مرکزی', 'سرزمین سرمت‌ها', 'شمال قفقاز', 'حوضه رود دنیستر', 'مارامورش کارپات', 'جلگه دانوب'],
    musicalContributions: 'اصطکاک آرشه موی اسب بر زه، آکوستیک فلوت‌های استخوانی، نقالی‌های حماسی، و لغزش‌های میکروتنال در آواز چوپانی.',
    historicalNarrative: 'اقوام کوچ‌نشین ایرانی‌زبان سکایی، سرمتی و آلانی با عبور از دشت‌های شمال دریای سیاه و خزر به حوضه دانوب رسیدند. آنان فلوت‌های استخوانی و سازهای زهی کهنی را همراه آوردند که بازتاب طنین آن‌ها هنوز در آواز باستانی "هورای دراز" در شمال رومانی شنیده می‌شود.',
  },
  {
    id: 'romani-diaspora',
    name: 'مسیر مهاجرت روما (کولی‌ها)',
    persianName: 'مسیر مهاجرت خنیاگران روما (لوتاری‌ها)',
    subtitlePersian: 'از خراسان و فارس تا دربار شاهزادگان والاچیا و مولداوی',
    epoch: 'قرن یازدهم تا پانزدهم میلادی',
    color: '#8B2635', // لعل جگری
    glowColor: 'rgba(139, 38, 53, 0.45)',
    svgPath: 'M 1820 740 Q 1650 620 1390 480 T 1140 540 T 910 520 T 740 450 T 490 530 T 520 380 L 590 280',
    keyStops: ['خراسان و فارس', 'تبریز', 'آناتولی', 'تسالونیکی', 'والاچیا (رومانی)', 'مولداوی'],
    musicalContributions: 'تکنیک‌های مضراب‌نوازی ماهرانه سنتور و تسامبال، ناله‌های ویلن با ریزپرده‌ها، تزیینات تند ریتم‌های لنگ و آوازهای غمناک.',
    historicalNarrative: 'خنیاگران مهاجر با جذب مقام‌ها و دستگاه‌های موسیقی دربار ایران و ملودی‌های بیزانسی، آن‌ها را از طریق آناتولی به بالکان رساندند. در سرزمین رومانی، آنان اصناف موروثی "لوتاری" را پی‌ریزی کردند و شالوده موسیقی بومی و درباری حوضه دانوب را دگرگون ساختند.',
  },
  {
    id: 'ottoman-saray',
    name: 'مدارهای درباری و صوفیانه عثمانی',
    persianName: 'مدارهای فرهنگی و درباری عثمانی',
    subtitlePersian: 'از اصفهان تا استانبول، بلگراد و بخارست',
    epoch: 'قرن پانزدهم تا نوزدهم میلادی',
    color: '#1E555C', // فیروزه‌ای تیره لاجوردی
    glowColor: 'rgba(30, 85, 92, 0.45)',
    svgPath: 'M 1680 630 Q 1450 560 1140 540 T 910 520 T 740 450 T 520 380 T 350 440',
    keyStops: ['اصفهان', 'قونیه (مولویه)', 'سرای سلطنتی استانبول', 'ادرنه', 'بخارست (دربار فیناریوت)', 'سارایوو'],
    musicalContributions: 'نظام مدون مقامات، تقسیمات ۵۳ قسمتی کما، رپرتوار عرفانی نی، سنتورنوازی مجلسی و ادوار ریتمیک آکساک.',
    historicalNarrative: 'گروه‌های نظامی مهترخان عثمانی، خانقاه‌های دراویش مولویه و دربار شاهزادگان یک زبان موسیقایی مشترک از مرزهای صفوی تا دانوب پدید آوردند. شاهزاده دیمیتری کانتمیر مولداویایی این رپرتوار فاخر را با خط نت‌نگاری ابداعی خود ثبت و میان شرق و غرب پل زد.',
  },
];

/**
 * ارگانولوژی و سازشناسی تطبیقی سازهای جفت
 */
export interface PairedInstrumentStudy {
  id: string;
  title: string;
  persianTitle: string;
  subtitle: string;
  persianSubtitle: string;
  instrumentEast: {
    name: string;
    culture: string;
    timbre: string;
    construction: string;
    stringsOrHoles: string;
    tuning: string;
  };
  instrumentWest: {
    name: string;
    culture: string;
    timbre: string;
    construction: string;
    stringsOrHoles: string;
    tuning: string;
  };
  bridgeInstruments: string[];
  acousticContinuumTheory: string;
  audioModeId: string;
}

export const PAIRED_INSTRUMENT_STUDIES: PairedInstrumentStudy[] = [
  {
    id: 'santur-tambal',
    title: 'Santur & Țambal',
    persianTitle: 'سنتور ایرانی و تسامبال رومانیایی',
    subtitle: 'The Trapezoidal Hammered Chordophone Corridor',
    persianSubtitle: 'شاهراه سازهای زهی ضربه‌ای ذوزنقه‌ای',
    instrumentEast: {
      name: 'سنتور ایرانی (Santur)',
      culture: 'موسیقی دستگاهی و ردیف کهن دربار ایران',
      timbre: 'طنین اثیری، زنگ‌دار، پایدار با درخشش کریستالی ۷۲ سیم',
      construction: 'جعبه رزونانس ذوزنقه‌ای از چوب گردو یا توت؛ ۷۲ سیم فلزی در گروه‌های ۴تایی بر روی ۱۸ خرک چوبی مدور؛ نواخته شده با مضراب‌های ظریف و سبک چوب گردو.',
      stringsOrHoles: '۷۲ سیم (۱۸ کلاف ۴تایی: ۹ کلاف برنجی بم + ۹ کلاف فولادی زیر)',
      tuning: 'کوک دستگاهی منطبق بر ردیف (مانند شور با می کُرُن)',
    },
    instrumentWest: {
      name: 'تسامبال رومانیایی (Țambal Mare & Mic)',
      culture: 'خنیاگران لوتاری دانوب و سیمبالوم مجارستان',
      timbre: 'ضربه پرکاسیو و کوبنده با رزونانس کروماتیک و پدال خفه‌کن',
      construction: 'بدنه بزرگ از صنوبر و افرا؛ تسامبال بزرگ کنسرت که در ۱۸۷۴ توسط شوندا ابداع شد با سیستم پدال دمپر؛ نواخته شده با چکش‌های چوبی پوشیده از پنبه یا چرم (چوکانله).',
      stringsOrHoles: 'تا بیش از ۱۲۵ سیم در ۳۵ ردیف کروماتیک',
      tuning: 'تعدیل کروماتیک سازگار با مدولاسیون‌های شتابان رقص‌های لنگ',
    },
    bridgeInstruments: ['سنتور عثمانی', 'سنتور ارمنی', 'ساندوری یونانی', 'سیمبالوم مجاری', 'تسیمبالی اوکراینی'],
    acousticContinuumTheory: 'یک خط مستقیم تبارشناختی سنتور ایرانی را از طریق آناتولی و یونان به تسامبال دانوبی رومانی پیوند می‌دهد. با حرکت ساز به سمت غرب، مضراب‌های سبک و اشرافی با چکش‌های سنگین چرمی جایگزین شد و ساز درون‌گرای مجلسی به موتور ریتمیک تپنده ارکستر لوتاری بدل گشت.',
    audioModeId: 'dastgah-shur',
  },
  {
    id: 'setar-bouzouki-tamburitza',
    title: 'Setar, Bouzouki & Tamburitza',
    persianTitle: 'سه‌تار، بوزوکی و تامبوریتزا',
    subtitle: 'The Long-Necked Fretted Lute Evolution',
    persianSubtitle: 'سیر تحول لوت‌های دسته‌بلند پرده‌دار',
    instrumentEast: {
      name: 'سه‌تار ایرانی (Setar)',
      culture: 'خلوت عرفانی و موسیقی مجلسی ایران',
      timbre: 'صدای صمیمی، طنین‌دار، با وزوز زنگوله‌ای ناخن بر سیم‌ها',
      construction: 'کاسه ترکه یا یک‌تکه چوب توت با صفحه نازک صنوبر؛ دسته بلند گردو با ۲۵ تا ۲۸ پرده روده‌ای متحرک که فواصل کُرُن و سُری را ایجاد می‌کنند.',
      stringsOrHoles: '۴ سیم فلزی (با افزودن سیم چهارم یا سیم مشتاق توسط مشتاق‌علی‌شاه)',
      tuning: 'دو - سل - دو - دو (آرایش واخوان کلاسیک)',
    },
    instrumentWest: {
      name: 'بوزوکی یونانی و تامبوریتزای اسلاوی',
      culture: 'رمبتیکو بالکان و فولکلور دشت پانونی دانوب',
      timbre: 'روشن، تیز، شفاف چون زنگوله، با آرپژها و تریمولوی تند مضراب',
      construction: 'کاسه کاسه‌ای منبت‌کاری شده با پرده‌های ثابت فلزی؛ تامبوریتزاهای بیسیرنیتسا و براچ نقش کنترپوان و ریتم شفاف را ایفا می‌کنند.',
      stringsOrHoles: 'سه‌تایی (Trichordo) با کوک ر-لا-ر یا چهارتایی (Tetrachordo)',
      tuning: 'کوک معتدل همراه با ناله‌ها و تحریرهای میکروتنال سنتی آوازی',
    },
    bridgeInstruments: ['تنبور عثمانی', 'باغلاما / ساز آناتولی', 'تنبور کردی', 'چیفتلی آلبانیایی', 'کوبزای رومانی'],
    acousticContinuumTheory: 'خانواده کهن تنبور بین‌النهرین و ایران، از آناتولی عبور کرد و به "ساز حقیقت" صوفیان و عاشیقان بدل گشت. با ورود به بالکان و اژه، این ساز پوست انداخت و به بوزوکی و تامبوریتزا بدل شد، اما ماهیت ملودیک متکی بر سیم واخوان را برای همیشه در بطن خود حفظ کرد.',
    audioModeId: 'makam-rast',
  },
  {
    id: 'ney-caval',
    title: 'Ney & Caval',
    persianTitle: 'نی هفت‌بند و کاوال شبانی',
    subtitle: 'The Breath of the Reed & the Bone Pastoral Flute',
    persianSubtitle: 'دمیدن در نای و فلوت استخوانی چوپانان',
    instrumentEast: {
      name: 'نی هفت‌بند ایرانی و عثمانی (Ney)',
      culture: 'ردیف سنتی ایران و آیین‌های سماع مولویه',
      timbre: 'هوایی، تنیده با بافت تنفس انسان، با چندصدایی و دوصدایی حنجره‌ای',
      construction: 'ساقه طبیعی نی غول‌پیکر (Arundo donax) با ۹ بند؛ ۶ سوراخ در جلو و ۱ سوراخ شستی در پشت؛ با شیوه دندان‌لب یا سرنی باشپاره استخوانی.',
      stringsOrHoles: '۶ + ۱ روزنه صوتی در ۷ اکتاو و رجیستر صوتی',
      tuning: 'سری هارمونیک طبیعی لوله باز همراه با انحرافات ظریف زاویه دمیدن',
    },
    instrumentWest: {
      name: 'کاوال رومانیایی و بالکان (Caval)',
      culture: 'موسیقی شبانی کارپات و تراکیه بلغارستان',
      timbre: 'مخملین، بم‌خوان، غنی از بازآوایی‌های هارمونیک و ناله‌های دوئینا',
      construction: 'استوانه چوبی سه تکه از چوب زبان‌گنجشک یا استخوان با لب پخ‌خورده بدون تیغه باد؛ دارای ۵ روزنه انگشت‌گذاری و ۳ روزنه تشدید آکوستیک موسوم به "سوراخ‌های شیطان".',
      stringsOrHoles: '۸ روزنه (۵ روزنه انگشت‌گذاری + ۳ روزنه طنین)',
      tuning: 'گام‌های مدال با درجات متغیر چهارم و هفتم برای سوز و گداز دوئینا',
    },
    bridgeInstruments: ['کاوال آناتولی', 'کاوال بلغاری', 'کاوال مقدونی', 'فلویر بی‌پایه رومانی', 'بلول ارمنی'],
    acousticContinuumTheory: 'آکوستیک فلوت‌های لب‌به‌لب بدون قطعه سوت، کهن‌ترین فناوری صوتی بشر است. هم نی ایرانی و هم کاوال کارپات متکی بر شکافتن مستقیم جریان هوا بر لبه تیز دهانه هستند که تسلط بی‌نهایت بر ریزپرده‌ها و هم‌نوازی زمزمه حنجره هنگام دمیدن را ممکن می‌سازد.',
    audioModeId: 'romanian-doina-carpathian',
  },
];
