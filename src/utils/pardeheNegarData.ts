/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پرده‌نگار • سامانه جامع انطباق پیانو، ویولن و ردیف موسیقی ایرانی
 * مؤلف و طراح: ایمان برزجان (Iman Barzjan - imanbarzjan.ir)
 * ناشر رسمی: استودیو اینامیکس (EnamiX)
 * مشاور علمی و هنری: استاد بابک بختیاری
 * 
 * داده‌های مرجع ۱۲ دستگاه و آواز ردیف ویولن، گام‌های دیاتونیک،
 * دایره پنجم‌ها، کوک‌های ۴ سیم ساز، رپرتوار پیش‌درآمدها و درآمدها،
 * اوزان لنگ اکساک، و فصول رساله پژوهشی دانشنامه‌ای
 */

export interface NoteInfo {
  natural?: string;
  sharp?: string;
  flat?: string;
  solfege: string;
  solfegeSharp?: string;
  solfegeFlat?: string;
  isBlack: boolean;
}

export const NOTE_NAMES: NoteInfo[] = [
  { natural: 'C', solfege: 'دو', isBlack: false },
  { sharp: 'C♯', flat: 'D♭', solfege: 'دو دیز / ر بمل', solfegeSharp: 'دو دیز', solfegeFlat: 'ر بمل', isBlack: true },
  { natural: 'D', solfege: 'ر', isBlack: false },
  { sharp: 'D♯', flat: 'E♭', solfege: 'ر دیز / می بمل', solfegeSharp: 'ر دیز', solfegeFlat: 'می بمل', isBlack: true },
  { natural: 'E', solfege: 'می', isBlack: false },
  { natural: 'F', solfege: 'فا', isBlack: false },
  { sharp: 'F♯', flat: 'G♭', solfege: 'فا دیز / سل بمل', solfegeSharp: 'فا دیز', solfegeFlat: 'سل بمل', isBlack: true },
  { natural: 'G', solfege: 'سل', isBlack: false },
  { sharp: 'G♯', flat: 'A♭', solfege: 'سل دیز / لا بمل', solfegeSharp: 'سل دیز', solfegeFlat: 'لا بمل', isBlack: true },
  { natural: 'A', solfege: 'لا', isBlack: false },
  { sharp: 'A♯', flat: 'B♭', solfege: 'لا دیز / سی بمل', solfegeSharp: 'لا دیز', solfegeFlat: 'سی بمل', isBlack: true },
  { natural: 'B', solfege: 'سی', isBlack: false }
];

export interface ViolinStringKook {
  stringNumber: number; // 1 to 4 (1 = E/chanta/highest, 4 = G/bam/lowest)
  name: string;
  noteName: string;
  freq: number;
  midi: number;
}

export interface MotifNote {
  midi: number;
  dur: number;
  centOffset?: number;
}

export interface ClassicalPieceRepertoire {
  id: string;
  title: string;
  composer: string;
  type: 'pishdaramad' | 'daramad' | 'chaharmezrab' | 'reng';
  meter: string;
  description: string;
  motifMelody: MotifNote[];
}

export interface DastgahScale {
  id: string;
  name: string;
  isPersian: boolean;
  notes: number[]; // pitch classes 0-11
  microCents?: Record<number, number>;
  microLabels?: Record<number, { letter: string; solfege: string }>;
  shahedMidi?: number;
  istMidi?: number;
  shahedName?: string;
  istName?: string;
  kookViolin: ViolinStringKook[];
  info: string;
  pishdaramadTitle: string;
  motifMelody: MotifNote[];
  repertoire: ClassicalPieceRepertoire[];
  sharpPref?: boolean;
}

export const PERSIAN_DASTGAH_DATA: DastgahScale[] = [
  {
    id: 'shor_la',
    name: 'دستگاه شور «لا» (مادر و پایه ردیف ویولن ایران)',
    isPersian: true,
    notes: [9, 11, 0, 2, 4, 5, 7],
    microCents: { 11: -45 },
    microLabels: { 11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' } },
    shahedMidi: 69,
    istMidi: 69,
    shahedName: 'لا ۴ (A4)',
    istName: 'لا ۴ (A4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'شور «لا»: سرکلید سی کُرن، بقیه نوت‌ها بکار. گردش نغمه و فرود شور حول نوت «لا». کوک‌های سه‌گانه: می-لا-ر-سل، ر-لا-ر-سل، و ر-لا-لا-سل.',
    pishdaramadTitle: 'پیش‌درآمد شور اثر درویش‌خان / علی‌اکبر شهنازی',
    motifMelody: [
      { midi: 69, dur: 0.6 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 72, dur: 0.5 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 69, dur: 0.7 },
      { midi: 67, dur: 0.4 },
      { midi: 69, dur: 1.0 }
    ],
    repertoire: [
      {
        id: 'pish_shor_darvish',
        title: 'پیش‌درآمد شور (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ وقارآمیز',
        description: 'شاهکار آغازین رپرتوار کلاسیک ایران، ملهم از دوران مشروطه با گردش در گوشه‌های شهناز و قرچه.',
        motifMelody: [
          { midi: 69, dur: 0.8 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 72, dur: 0.6 },
          { midi: 74, dur: 0.8 },
          { midi: 72, dur: 0.4 },
          { midi: 71, dur: 0.6, centOffset: -45 },
          { midi: 69, dur: 1.2 }
        ]
      },
      {
        id: 'pish_shor_neydavoud',
        title: 'پیش‌درآمد شور (استاد مرتضی نی‌داوود)',
        composer: 'مرتضی نی‌داوود',
        type: 'pishdaramad',
        meter: '۲/۴ مارش سنگین',
        description: 'ساختار ضربی محکم با موتیف‌های پرسش و پاسخی بر سیم‌های بم و زیر ویولن.',
        motifMelody: [
          { midi: 62, dur: 0.5 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 0.7 },
          { midi: 71, dur: 0.5, centOffset: -45 },
          { midi: 69, dur: 0.8 },
          { midi: 67, dur: 0.6 },
          { midi: 69, dur: 1.0 }
        ]
      },
      {
        id: 'pish_shor_shahnazi',
        title: 'پیش‌درآمد شور (استاد علی‌اکبر شهنازی)',
        composer: 'علی‌اکبر شهنازی',
        type: 'pishdaramad',
        meter: '۴/۴ مجلسی',
        description: 'تکنیک مضراب‌داری ناب مکتب میرزاحسینقلی همراه با طنین واخوان‌های باابهت.',
        motifMelody: [
          { midi: 69, dur: 0.6 },
          { midi: 72, dur: 0.4 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 69, dur: 0.6 },
          { midi: 67, dur: 0.5 },
          { midi: 65, dur: 0.5 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 1.2 }
        ]
      },
      {
        id: 'daramad_aval_shor',
        title: 'درآمد اول شور (خوارزمیان - ردیف ابوالحسن صبا)',
        composer: 'ردیف میرزا عبدالله / صبا',
        type: 'daramad',
        meter: 'آوازی (آزاد)',
        description: 'معرفی اصیل دانگ شور با تکیه بر نوت شاهد «لا» و کشش‌های کُرن بر «سی».',
        motifMelody: [
          { midi: 67, dur: 0.6 },
          { midi: 69, dur: 0.9 },
          { midi: 71, dur: 0.5, centOffset: -45 },
          { midi: 69, dur: 0.8 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 1.3 }
        ]
      },
      {
        id: 'daramad_salmak_shor',
        title: 'گوشه سلمک و فرود به شور',
        composer: 'ردیف سنتی',
        type: 'daramad',
        meter: 'آوازی',
        description: 'صعود به دانگ بالاتر و گردش روی درجات پنجم و ششم و سپس بازگشت دل‌نشین به شاهد.',
        motifMelody: [
          { midi: 72, dur: 0.6 },
          { midi: 74, dur: 0.7 },
          { midi: 76, dur: 0.8 },
          { midi: 74, dur: 0.5 },
          { midi: 72, dur: 0.6 },
          { midi: 71, dur: 0.6, centOffset: -45 },
          { midi: 69, dur: 1.4 }
        ]
      },
      {
        id: 'chaharmezrab_shor_saba',
        title: 'چهارمضراب شور در لا (استاد ابوالحسن صبا)',
        composer: 'ابوالحسن صبا',
        type: 'chaharmezrab',
        meter: '۶/۸ سریع و پرتحرک',
        description: 'شاهکار ویولن ایرانی با کاربرد آرشه‌کشی‌های مقطع و واخوان مداوم سیم دوم.',
        motifMelody: [
          { midi: 69, dur: 0.3 },
          { midi: 76, dur: 0.3 },
          { midi: 74, dur: 0.3 },
          { midi: 72, dur: 0.3 },
          { midi: 71, dur: 0.3, centOffset: -45 },
          { midi: 69, dur: 0.6 },
          { midi: 69, dur: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'dashti_mi',
    name: 'آواز دشتی «می» (متعلق به شور لا - لحن سوزناک و چوپانی)',
    isPersian: true,
    notes: [9, 11, 0, 2, 4, 5, 7],
    microCents: { 11: -45 },
    microLabels: { 11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' } },
    shahedMidi: 69,
    istMidi: 64,
    shahedName: 'لا ۴ (A4)',
    istName: 'می ۴ (E4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: D5 (رِ)', noteName: 'رِ', freq: 587.33, midi: 74 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: A3 (لا)', noteName: 'لا', freq: 220.00, midi: 57 }
    ],
    info: 'دشتی «می»: سرکلید سی کُرن، بقیه نوت‌ها بکار. نوت شاهد روی لا ۴ و نوت ایست روی می ۴. کوک ۴ سیم: رِ - لا - رِ - لا.',
    pishdaramadTitle: 'پیش‌درآمد دشتی موسی معروفی / درآمد دشتی استاد صبا',
    motifMelody: [
      { midi: 69, dur: 0.5 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 72, dur: 0.6 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 69, dur: 0.5 },
      { midi: 67, dur: 0.4 },
      { midi: 65, dur: 0.4 },
      { midi: 64, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_dashti_maroufi',
        title: 'پیش‌درآمد دشتی (استاد موسی معروفی)',
        composer: 'موسی معروفی',
        type: 'pishdaramad',
        meter: '۶/۸ سنگین و غمناک',
        description: 'تصویرگر حزن کوهستان‌های دشتستان با فرودهای پی‌درپی بر نت ایست «می».',
        motifMelody: [
          { midi: 69, dur: 0.7 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 72, dur: 0.6 },
          { midi: 69, dur: 0.5 },
          { midi: 67, dur: 0.4 },
          { midi: 64, dur: 1.2 }
        ]
      },
      {
        id: 'pish_dashti_darvish',
        title: 'پیش‌درآمد دشتی (غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۲/۴ ضربی',
        description: 'حرکت باوقار با تحریرهای ظریف بر گریف ویولن.',
        motifMelody: [
          { midi: 64, dur: 0.4 },
          { midi: 67, dur: 0.4 },
          { midi: 69, dur: 0.8 },
          { midi: 72, dur: 0.6 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 69, dur: 0.6 },
          { midi: 64, dur: 1.0 }
        ]
      },
      {
        id: 'daramad_dashti_saba',
        title: 'درآمد اول دشتی (حاجیانی - ابوالحسن صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'آغاز نوای سوزناک دشتی با مالش‌های آرشه و ارتعاش ویبراتو روی نوت شاهد.',
        motifMelody: [
          { midi: 69, dur: 0.8 },
          { midi: 71, dur: 0.5, centOffset: -45 },
          { midi: 69, dur: 0.7 },
          { midi: 67, dur: 0.5 },
          { midi: 65, dur: 0.5 },
          { midi: 64, dur: 1.4 }
        ]
      },
      {
        id: 'chaharmezrab_dashti_yahaghi',
        title: 'چهارمضراب دشتی در ر (مکتب استاد پرویز یاحقی)',
        composer: 'پرویز یاحقی',
        type: 'chaharmezrab',
        meter: '۶/۸ لرزان و درخشان',
        description: 'کاربرد کوک جفت سیم لا و ر با واخوان‌های طنین‌انداز و پوزیسیون سوم ویولن.',
        motifMelody: [
          { midi: 74, dur: 0.3 },
          { midi: 72, dur: 0.3 },
          { midi: 71, dur: 0.3, centOffset: -45 },
          { midi: 69, dur: 0.5 },
          { midi: 67, dur: 0.3 },
          { midi: 64, dur: 0.8 }
        ]
      }
    ]
  },
  {
    id: 'dashti_si',
    name: 'آواز دشتی «سی» (منطقه چپ‌کوک)',
    isPersian: true,
    notes: [11, 1, 2, 4, 6, 7, 9],
    microCents: { 1: 40, 6: 40 },
    microLabels: { 
      1: { letter: 'C𝄲 (دو سُری)', solfege: 'دو سُری' },
      6: { letter: 'F𝄲 (فا سُری)', solfege: 'فا سُری' }
    },
    shahedMidi: 76,
    istMidi: 71,
    shahedName: 'می ۵ (E5)',
    istName: 'سی ۴ (B4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: B4 (سی)', noteName: 'سی', freq: 493.88, midi: 71 },
      { stringNumber: 3, name: 'سیم ۳: E4 (می)', noteName: 'می', freq: 329.63, midi: 64 },
      { stringNumber: 4, name: 'سیم ۴: B3 (سی)', noteName: 'سی', freq: 246.94, midi: 59 }
    ],
    info: 'دشتی چپ‌کوک بر پایه می-سی. دو سُری (+۴۰ سنت) و فا سُری (+۴۰ سنت)، شاهد می ۵ و ایست سی ۴. کوک ساز: می-سی-می-سی.',
    pishdaramadTitle: 'پیش‌درآمد دشتی چپ‌کوک (مکتب ویولن صبا)',
    motifMelody: [
      { midi: 76, dur: 0.6 },
      { midi: 78, dur: 0.4, centOffset: 40 },
      { midi: 76, dur: 0.5 },
      { midi: 74, dur: 0.4 },
      { midi: 73, dur: 0.4, centOffset: 40 },
      { midi: 71, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_dashti_chap',
        title: 'پیش‌درآمد دشتی چپ‌کوک (مکتب استاد صبا)',
        composer: 'ابوالحسن صبا',
        type: 'pishdaramad',
        meter: '۶/۸ پرشور',
        description: 'ویژه صدای بانوان و ویولن در پوزیسیون‌های بالا با درخشش فا سُری.',
        motifMelody: [
          { midi: 71, dur: 0.5 },
          { midi: 74, dur: 0.5 },
          { midi: 76, dur: 0.8 },
          { midi: 78, dur: 0.5, centOffset: 30 },
          { midi: 76, dur: 0.7 },
          { midi: 71, dur: 1.2 }
        ]
      },
      {
        id: 'daramad_dashti_chap',
        title: 'درآمد دشتی سیم اول (چپ‌کوک)',
        composer: 'ردیف ویولن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'نواختن سوزناک روی سیم اول می با فرود آرام به نت سی.',
        motifMelody: [
          { midi: 76, dur: 0.8 },
          { midi: 74, dur: 0.5 },
          { midi: 72, dur: 0.5 },
          { midi: 71, dur: 1.3 }
        ]
      }
    ]
  },
  {
    id: 'abuata_do',
    name: 'آواز ابوعطا «دو» (دستان‌بندی شور لا)',
    isPersian: true,
    notes: [9, 11, 0, 2, 4, 5, 7],
    microCents: { 11: -45 },
    microLabels: { 11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' } },
    shahedMidi: 72,
    istMidi: 69,
    shahedName: 'دو ۵ (C5)',
    istName: 'لا ۴ (A4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'ابوعطا: متعلق به شور لا. نوت شاهد «دو»، نوت ایست «لا»، نوت متغیر «سی کُرن». اوج ابوعطا در گوشه نامدار «حجاز» است. کوک: می-لا-ر-سل.',
    pishdaramadTitle: 'پیش‌درآمد ابوعطا اثر درویش‌خان / گوشه حجاز',
    motifMelody: [
      { midi: 69, dur: 0.5 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 72, dur: 0.8 },
      { midi: 74, dur: 0.5 },
      { midi: 72, dur: 0.6 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 69, dur: 1.0 }
    ],
    repertoire: [
      {
        id: 'pish_abuata_darvish',
        title: 'پیش‌درآمد ابوعطا (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ سنگین',
        description: 'یکی از ماندگارترین پیش‌درآمدهای تاریخ با ملودی پرصلابت در گوشه سَیَخی و رامکلی.',
        motifMelody: [
          { midi: 72, dur: 0.7 },
          { midi: 74, dur: 0.5 },
          { midi: 72, dur: 0.5 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 69, dur: 0.8 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 1.1 }
        ]
      },
      {
        id: 'daramad_abuata_saba',
        title: 'درآمد اول ابوعطا (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'حرکت ظریف از لا به نوت دو و چرخش نغمگی پیرامون شاهد ابوعطا.',
        motifMelody: [
          { midi: 69, dur: 0.6 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 72, dur: 1.0 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 69, dur: 1.2 }
        ]
      },
      {
        id: 'gosheh_hejaz_abuata',
        title: 'گوشه اوج حجاز در ابوعطا',
        composer: 'ردیف کلاسیک',
        type: 'daramad',
        meter: 'آوازی پرشور',
        description: 'اوج آواز ابوعطا با شاهد قرار گرفتن درجه چهارم (ر) و ریزپرده می کرن.',
        motifMelody: [
          { midi: 74, dur: 0.8 },
          { midi: 75, dur: 0.5, centOffset: -40 },
          { midi: 77, dur: 0.7 },
          { midi: 75, dur: 0.5, centOffset: -40 },
          { midi: 74, dur: 1.3 }
        ]
      }
    ]
  },
  {
    id: 'afshari_do',
    name: 'آواز افشاری «دو» (شور لا - نغمه حماسی و اندوهناک)',
    isPersian: true,
    notes: [9, 11, 0, 2, 4, 5, 7],
    microCents: { 11: -45 },
    microLabels: { 11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' } },
    shahedMidi: 72,
    istMidi: 67,
    shahedName: 'دو ۵ (C5)',
    istName: 'سل ۴ (G4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'افشاری: متعلق به شور لا. نوت شاهد دو ۵، ایست روی سل ۴، ایست موقت روی ر ۴. نوت متغیر می کرن/بکار در گوشه عراق.',
    pishdaramadTitle: 'پیش‌درآمد افشاری درویش‌خان / تصنیف بهار دلکش',
    motifMelody: [
      { midi: 72, dur: 0.6 },
      { midi: 74, dur: 0.4 },
      { midi: 72, dur: 0.5 },
      { midi: 71, dur: 0.4, centOffset: -45 },
      { midi: 69, dur: 0.5 },
      { midi: 67, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_afshari_darvish',
        title: 'پیش‌درآمد افشاری (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ باشکوه',
        description: 'ریتم متین با عبور از گوشه‌های بیات راجه، قرایی و فرود استادانه به سل.',
        motifMelody: [
          { midi: 67, dur: 0.6 },
          { midi: 69, dur: 0.5 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 72, dur: 0.8 },
          { midi: 74, dur: 0.5 },
          { midi: 72, dur: 0.6 },
          { midi: 67, dur: 1.2 }
        ]
      },
      {
        id: 'pish_afshari_mokhtari',
        title: 'پیش‌درآمد افشاری (استاد رکن‌الدین مختاری)',
        composer: 'رکن‌الدین مختاری',
        type: 'pishdaramad',
        meter: '۲/۴ مارش درباری',
        description: 'ساختار هارمونیک مستحکم با آرشه‌های بریده و موتیف‌های منظم.',
        motifMelody: [
          { midi: 72, dur: 0.5 },
          { midi: 74, dur: 0.5 },
          { midi: 76, dur: 0.7 },
          { midi: 74, dur: 0.4 },
          { midi: 72, dur: 0.6 },
          { midi: 67, dur: 1.0 }
        ]
      },
      {
        id: 'daramad_afshari_saba',
        title: 'درآمد اول افشاری (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'تاکید بر کشش نوت شاهد دو و ایست بر نوت سل با بافتی تفکربرانگیز.',
        motifMelody: [
          { midi: 72, dur: 0.9 },
          { midi: 71, dur: 0.4, centOffset: -45 },
          { midi: 69, dur: 0.6 },
          { midi: 67, dur: 1.4 }
        ]
      }
    ]
  },
  {
    id: 'bayat_tork',
    name: 'آواز بیات ترک «فا» (بیات زند)',
    isPersian: true,
    notes: [9, 11, 0, 2, 4, 5, 7],
    microCents: { 11: -45 },
    microLabels: { 11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' } },
    shahedMidi: 65,
    istMidi: 65,
    shahedName: 'فا ۴ (F4)',
    istName: 'فا ۴ (F4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'بیات ترک (بیات زند): از متعلقات شور. نوت شاهد و ایست روی «فا». نوت متغیر سل. مناجات‌های اصیل در این آواز خوانده می‌شود.',
    pishdaramadTitle: 'پیش‌درآمد بیات ترک مرتضی نی‌داوود / گوشه دوگاه',
    motifMelody: [
      { midi: 65, dur: 0.5 },
      { midi: 67, dur: 0.4 },
      { midi: 69, dur: 0.6 },
      { midi: 67, dur: 0.4 },
      { midi: 65, dur: 1.0 }
    ],
    repertoire: [
      {
        id: 'pish_tork_neydavoud',
        title: 'پیش‌درآمد بیات ترک (استاد مرتضی نی‌داوود)',
        composer: 'مرتضی نی‌داوود',
        type: 'pishdaramad',
        meter: '۶/۴ عرفانی',
        description: 'فضای قدسی و باوقار بیات ترک با موتیف‌های روان در گوشه روح‌الارواح.',
        motifMelody: [
          { midi: 65, dur: 0.7 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 0.8 },
          { midi: 71, dur: 0.5, centOffset: -45 },
          { midi: 69, dur: 0.6 },
          { midi: 65, dur: 1.2 }
        ]
      },
      {
        id: 'pish_tork_darvish',
        title: 'پیش‌درآمد بیات ترک (غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۲/۴ ضربی شادمانه',
        description: 'ریتم پرامید و نغمه‌های شفاف در دایره نت شاهد فا.',
        motifMelody: [
          { midi: 60, dur: 0.4 },
          { midi: 62, dur: 0.4 },
          { midi: 65, dur: 0.8 },
          { midi: 67, dur: 0.5 },
          { midi: 65, dur: 1.0 }
        ]
      },
      {
        id: 'daramad_tork_dogah',
        title: 'درآمد اول بیات ترک (دوگاه - صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'تثبیت نوت فا به عنوان مرکز ثقل نغمه با گردش ملایم در درجات بم‌تر.',
        motifMelody: [
          { midi: 62, dur: 0.5 },
          { midi: 64, dur: 0.4 },
          { midi: 65, dur: 1.1 },
          { midi: 67, dur: 0.5 },
          { midi: 65, dur: 1.3 }
        ]
      }
    ]
  },
  {
    id: 'homayoun_sol',
    name: 'دستگاه همایون «سل» (شاهوار، فاخر و پر رمز و راز)',
    isPersian: true,
    notes: [7, 9, 11, 0, 2, 3, 5],
    microCents: { 9: -45 },
    microLabels: { 9: { letter: 'A𝄳 (لا کُرن)', solfege: 'لا کُرن' } },
    shahedMidi: 67,
    istMidi: 67,
    shahedName: 'سل ۴ (G4)',
    istName: 'سل ۴ (G4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: D5 (رِ)', noteName: 'رِ', freq: 587.33, midi: 74 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'همایون «سل»: لا کُرن (-۴۵ سنت)، سی بکار، دو بکار، رِ بکار، می بمل، فا بکار، سل بکار. دوم خنثی (سل تا لا کُرن ۱۳۵¢) و دوم افزوده (لا کُرن تا سی ۲۷۰¢). کوک رایج: رِ - لا - رِ - سل.',
    pishdaramadTitle: 'پیش‌درآمد همایون استاد رکن‌الدین مختاری',
    motifMelody: [
      { midi: 67, dur: 0.6 },
      { midi: 69, dur: 0.4, centOffset: -45 },
      { midi: 71, dur: 0.6 },
      { midi: 72, dur: 0.5 },
      { midi: 71, dur: 0.4 },
      { midi: 69, dur: 0.4, centOffset: -45 },
      { midi: 67, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_homayoun_mokhtari',
        title: 'پیش‌درآمد همایون (استاد رکن‌الدین مختاری)',
        composer: 'رکن‌الدین مختاری',
        type: 'pishdaramad',
        meter: '۶/۴ شاهوار',
        description: 'نمونه بارز فرم پیش‌درآمد ایرانی با عظمت و وقار اشرافی و گذر از شوشتری و بیداد.',
        motifMelody: [
          { midi: 67, dur: 0.8 },
          { midi: 69, dur: 0.5, centOffset: -45 },
          { midi: 71, dur: 0.7 },
          { midi: 72, dur: 0.8 },
          { midi: 74, dur: 0.5 },
          { midi: 72, dur: 0.6 },
          { midi: 67, dur: 1.3 }
        ]
      },
      {
        id: 'pish_homayoun_neydavoud',
        title: 'پیش‌درآمد همایون (استاد مرتضی نی‌داوود)',
        composer: 'مرتضی نی‌داوود',
        type: 'pishdaramad',
        meter: '۲/۴ مارش باابهت',
        description: 'تنظیم دقیق ضربی با استفاده از آرشه‌های پرده‌نگاری‌شده روی سیم سوم و چهارم.',
        motifMelody: [
          { midi: 62, dur: 0.5 },
          { midi: 67, dur: 0.8 },
          { midi: 69, dur: 0.5, centOffset: -45 },
          { midi: 71, dur: 0.8 },
          { midi: 67, dur: 1.1 }
        ]
      },
      {
        id: 'daramad_homayoun_saba',
        title: 'درآمد اول همایون (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'معرفی فاصله دوم نیم‌بزرگ بین سل و لا کرن و سوم بزرگ سی بکار.',
        motifMelody: [
          { midi: 67, dur: 0.9 },
          { midi: 69, dur: 0.5, centOffset: -45 },
          { midi: 71, dur: 0.8 },
          { midi: 69, dur: 0.5, centOffset: -45 },
          { midi: 67, dur: 1.4 }
        ]
      },
      {
        id: 'daramad_zang_shotor_homayoun',
        title: 'درآمد زنگ شتر در همایون',
        composer: 'ردیف سنتی',
        type: 'daramad',
        meter: 'ریتمیک تصویری',
        description: 'تصویرسازی زنگ کاروان با تکرار مقطع نت‌ها روی سیم‌های ر و لا.',
        motifMelody: [
          { midi: 74, dur: 0.3 },
          { midi: 72, dur: 0.3 },
          { midi: 71, dur: 0.3 },
          { midi: 69, dur: 0.4, centOffset: -45 },
          { midi: 67, dur: 0.8 }
        ]
      },
      {
        id: 'chaharmezrab_homayoun_samai',
        title: 'چهارمضراب همایون (حبیب سماعی / صبا)',
        composer: 'حبیب سماعی',
        type: 'chaharmezrab',
        meter: '۶/۸ سریع و شورانگیز',
        description: 'قطعه تکنیکی سنتور که توسط ابوالحسن صبا برای ویولن تنظیم گردید.',
        motifMelody: [
          { midi: 67, dur: 0.3 },
          { midi: 74, dur: 0.3 },
          { midi: 71, dur: 0.3 },
          { midi: 69, dur: 0.3, centOffset: -45 },
          { midi: 67, dur: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'esfahan_do',
    name: 'آواز بیات اصفهان «دو» (نغمه رمانتیک و لطیف)',
    isPersian: true,
    notes: [0, 2, 3, 5, 7, 8, 11],
    microCents: { 2: -45 },
    microLabels: { 2: { letter: 'D𝄳 (رِ کُرن)', solfege: 'رِ کُرن' } },
    shahedMidi: 60,
    istMidi: 60,
    shahedName: 'دو ۴ (C4)',
    istName: 'دو ۴ (C4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: C4 (دو)', noteName: 'دو', freq: 261.63, midi: 60 }
    ],
    info: 'اصفهان «دو»: رِ کُرن، می بمل، فا بکار، سل بکار، لا بمل، سی بکار، دو. احساسات تغزلی عمیق. کوک ویولن: می-لا-ر-دو یا می-لا-ر-لا.',
    pishdaramadTitle: 'پیش‌درآمد اصفهان مرتضی نی‌داوود / تصنیف نوای کاروان',
    motifMelody: [
      { midi: 60, dur: 0.5 },
      { midi: 62, dur: 0.4, centOffset: -45 },
      { midi: 63, dur: 0.6 },
      { midi: 65, dur: 0.5 },
      { midi: 67, dur: 0.7 },
      { midi: 65, dur: 0.4 },
      { midi: 63, dur: 0.5 },
      { midi: 60, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_esfahan_neydavoud',
        title: 'پیش‌درآمد اصفهان (استاد مرتضی نی‌داوود)',
        composer: 'مرتضی نی‌داوود',
        type: 'pishdaramad',
        meter: '۶/۸ سنگین و تغزلی',
        description: 'یکی از ماندگارترین ملودی‌های تاریخ موسیقی ایران که بعدها پایه تصنیف‌های نامدار شد.',
        motifMelody: [
          { midi: 60, dur: 0.6 },
          { midi: 62, dur: 0.4, centOffset: -45 },
          { midi: 63, dur: 0.7 },
          { midi: 65, dur: 0.5 },
          { midi: 67, dur: 0.9 },
          { midi: 65, dur: 0.4 },
          { midi: 63, dur: 0.6 },
          { midi: 60, dur: 1.2 }
        ]
      },
      {
        id: 'pish_esfahan_mahjoubi',
        title: 'پیش‌درآمد اصفهان (استاد رضا محجوبی)',
        composer: 'رضا محجوبی',
        type: 'pishdaramad',
        meter: '۴/۴ حزن‌انگیز',
        description: 'اثر نبوغ‌آمیز ویولن‌نواز افسانه‌ای با ناله‌های آرشه و طنین واخوان سیم چهارم.',
        motifMelody: [
          { midi: 67, dur: 0.7 },
          { midi: 68, dur: 0.5 },
          { midi: 67, dur: 0.6 },
          { midi: 65, dur: 0.5 },
          { midi: 63, dur: 0.6 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 60, dur: 1.3 }
        ]
      },
      {
        id: 'daramad_esfahan_saba',
        title: 'درآمد اول بیات اصفهان (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'پرده‌نگاری نغمه‌های رمانتیک اصفهان با تکیه بر سوم کوچک و دوم نیم‌بزرگ.',
        motifMelody: [
          { midi: 60, dur: 0.8 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 63, dur: 1.0 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 60, dur: 1.4 }
        ]
      },
      {
        id: 'reng_esfahan_darvish',
        title: 'رِنگ اصفهان (پریچهر و پریزاد - درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'reng',
        meter: '۶/۸ پایکوبی اصیل',
        description: 'قطعه ریتمیک پایانی کنسرت‌های اصفهان با سرعت بالا و ملودی شادمانه.',
        motifMelody: [
          { midi: 67, dur: 0.3 },
          { midi: 65, dur: 0.3 },
          { midi: 63, dur: 0.3 },
          { midi: 62, dur: 0.3, centOffset: -45 },
          { midi: 60, dur: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'segah_mi',
    name: 'دستگاه سه‌گاه «می» (حزن ملکوتی و امید)',
    isPersian: true,
    notes: [4, 5, 7, 9, 11, 0, 2],
    microCents: { 4: -45, 11: -45 },
    microLabels: {
      4: { letter: 'E𝄳 (می کُرن)', solfege: 'می کُرن' },
      11: { letter: 'B𝄳 (سی کُرن)', solfege: 'سی کُرن' }
    },
    shahedMidi: 64,
    istMidi: 64,
    shahedName: 'می کُرن ۴ (E𝄳4)',
    istName: 'می کُرن ۴ (E𝄳4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'سه‌گاه «می»: می کُرن (-۴۵ سنت)، فا بکار، سل بکار، لا بکار، سی کُرن (-۴۵ سنت)، دو بکار، رِ بکار. فاصله خنثای می کُرن تا فا (۱۴۵¢). کوک ساز: می-لا-ر-سل.',
    pishdaramadTitle: 'پیش‌درآمد سه‌گاه درویش‌خان / چهارمضراب زنگ شتر صبا',
    motifMelody: [
      { midi: 64, dur: 0.7, centOffset: -45 },
      { midi: 65, dur: 0.4 },
      { midi: 67, dur: 0.6 },
      { midi: 65, dur: 0.4 },
      { midi: 64, dur: 1.1, centOffset: -45 }
    ],
    repertoire: [
      {
        id: 'pish_segah_darvish',
        title: 'پیش‌درآمد سه‌گاه (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ سنگین و فاخر',
        description: 'یکی از درخشان‌ترین ساخته‌های درویش‌خان با هماهنگی کامل فرم و مایه سه‌گاه.',
        motifMelody: [
          { midi: 64, dur: 0.8, centOffset: -45 },
          { midi: 65, dur: 0.5 },
          { midi: 67, dur: 0.8 },
          { midi: 69, dur: 0.6 },
          { midi: 67, dur: 0.5 },
          { midi: 64, dur: 1.3, centOffset: -45 }
        ]
      },
      {
        id: 'pish_segah_shahnazi',
        title: 'پیش‌درآمد سه‌گاه (استاد علی‌اکبر شهنازی)',
        composer: 'علی‌اکبر شهنازی',
        type: 'pishdaramad',
        meter: '۴/۴ باصلابت',
        description: 'مضراب‌داری پرصلابت مکتب آقا علی‌اکبر فراهانی با چرخش در گوشه زابل و حصار.',
        motifMelody: [
          { midi: 62, dur: 0.5 },
          { midi: 64, dur: 0.8, centOffset: -45 },
          { midi: 67, dur: 0.8 },
          { midi: 65, dur: 0.4 },
          { midi: 64, dur: 1.2, centOffset: -45 }
        ]
      },
      {
        id: 'daramad_segah_saba',
        title: 'درآمد اول سه‌گاه (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'معرفی هسته عاطفی سه‌گاه بر نت می کرن با لرزش‌های آرشه و تحریر بلبلی.',
        motifMelody: [
          { midi: 64, dur: 1.0, centOffset: -45 },
          { midi: 65, dur: 0.5 },
          { midi: 67, dur: 0.7 },
          { midi: 65, dur: 0.4 },
          { midi: 64, dur: 1.5, centOffset: -45 }
        ]
      },
      {
        id: 'chaharmezrab_zang_shotor_segah',
        title: 'چهارمضراب زنگ شتر سه‌گاه (استاد ابوالحسن صبا)',
        composer: 'ابوالحسن صبا',
        type: 'chaharmezrab',
        meter: '۶/۸ سریع تصویری',
        description: 'شاهکار جاودانه موسیقی ایران در ترسیم حرکت کاروان در کویر با ویولن.',
        motifMelody: [
          { midi: 67, dur: 0.3 },
          { midi: 69, dur: 0.3 },
          { midi: 67, dur: 0.3 },
          { midi: 65, dur: 0.3 },
          { midi: 64, dur: 0.6, centOffset: -45 }
        ]
      }
    ]
  },
  {
    id: 'chahargah_do',
    name: 'دستگاه چهارگاه «دو» (نغمه سلحشوری، حماسی و جهشی)',
    isPersian: true,
    notes: [0, 2, 4, 5, 7, 9, 11],
    microCents: { 2: -45, 9: -45 },
    microLabels: {
      2: { letter: 'D𝄳 (رِ کُرن)', solfege: 'رِ کُرن' },
      9: { letter: 'A𝄳 (لا کُرن)', solfege: 'لا کُرن' }
    },
    shahedMidi: 60,
    istMidi: 60,
    shahedName: 'دو ۴ (C4)',
    istName: 'دو ۴ (C4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: C4 (دو)', noteName: 'دو', freq: 261.63, midi: 60 }
    ],
    info: 'چهارگاه «دو»: رِ کُرن (-۴۵ سنت)، می بکار، فا بکار، سل بکار، لا کُرن (-۴۵ سنت)، سی بکار، دو. ساختار قرینه با دو دانگ همسان: دوم خنثی (۱۳۵¢) + دوم افزوده (۲۷۰¢) + نیم‌پرده (۹۰¢). کوک ساز: می-لا-ر-دو.',
    pishdaramadTitle: 'پیش‌درآمد چهارگاه درویش‌خان / رضا محجوبی',
    motifMelody: [
      { midi: 60, dur: 0.6 },
      { midi: 62, dur: 0.4, centOffset: -45 },
      { midi: 64, dur: 0.7 },
      { midi: 65, dur: 0.5 },
      { midi: 64, dur: 0.4 },
      { midi: 62, dur: 0.4, centOffset: -45 },
      { midi: 60, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_chahargah_darvish',
        title: 'پیش‌درآمد چهارگاه (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ حماسی و باوقار',
        description: 'شناخته‌شده‌ترین پیش‌درآمد ایران با تم‌های افتخارآفرین و گذار به گوشه زابل و حصار.',
        motifMelody: [
          { midi: 60, dur: 0.8 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 64, dur: 0.9 },
          { midi: 65, dur: 0.6 },
          { midi: 67, dur: 0.8 },
          { midi: 64, dur: 0.6 },
          { midi: 60, dur: 1.3 }
        ]
      },
      {
        id: 'pish_chahargah_mahjoubi',
        title: 'پیش‌درآمد چهارگاه (استاد رضا محجوبی)',
        composer: 'رضا محجوبی',
        type: 'pishdaramad',
        meter: '۲/۴ مارش پرشور',
        description: 'شاهکار ویولن ایرانی با کاربرد تکیه‌های سریع و پاساژهای پرانرژی.',
        motifMelody: [
          { midi: 60, dur: 0.4 },
          { midi: 64, dur: 0.6 },
          { midi: 67, dur: 0.7 },
          { midi: 69, dur: 0.5, centOffset: -45 },
          { midi: 71, dur: 0.7 },
          { midi: 67, dur: 0.5 },
          { midi: 60, dur: 1.1 }
        ]
      },
      {
        id: 'daramad_chahargah_saba',
        title: 'درآمد اول چهارگاه (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی سلحشورانه',
        description: 'بیان حماسی با حرکت جهشی از دو به می و فرود پرطنین با رِ کُرن.',
        motifMelody: [
          { midi: 60, dur: 0.9 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 64, dur: 1.1 },
          { midi: 62, dur: 0.5, centOffset: -45 },
          { midi: 60, dur: 1.5 }
        ]
      },
      {
        id: 'chaharmezrab_chahargah_saba',
        title: 'چهارمضراب چهارگاه (استاد ابوالحسن صبا)',
        composer: 'ابوالحسن صبا',
        type: 'chaharmezrab',
        meter: '۶/۸ سریع آتشین',
        description: 'اوج تکنیک آرشه‌کشی و انگشت‌گذاری سریع در رپرتوار ویولن کلاسیک ایرانی.',
        motifMelody: [
          { midi: 60, dur: 0.3 },
          { midi: 67, dur: 0.3 },
          { midi: 64, dur: 0.3 },
          { midi: 62, dur: 0.3, centOffset: -45 },
          { midi: 60, dur: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'mahoor_sol',
    name: 'دستگاه ماهور «سل» (راست‌کوک - شادمانه و پرشکوه)',
    isPersian: true,
    notes: [7, 9, 11, 0, 2, 4, 6],
    shahedMidi: 67,
    istMidi: 67,
    shahedName: 'سل ۴ (G4)',
    istName: 'سل ۴ (G4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'ماهور «سل»: انطباق کامل بر گام سل ماژور غربی (فا دیز). فواصل مطبوع، نوت شاهد و ایست روی سل ۴. کوک استاندارد: می-لا-ر-سل.',
    pishdaramadTitle: 'پیش‌درآمد ماهور درویش‌خان / تصنیف مرغ سحر',
    motifMelody: [
      { midi: 67, dur: 0.6 },
      { midi: 69, dur: 0.4 },
      { midi: 71, dur: 0.5 },
      { midi: 72, dur: 0.5 },
      { midi: 74, dur: 0.7 },
      { midi: 72, dur: 0.4 },
      { midi: 67, dur: 1.0 }
    ],
    repertoire: [
      {
        id: 'pish_mahoor_darvish',
        title: 'پیش‌درآمد ماهور (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ مجلل و شاداب',
        description: 'یکی از شناخته‌شده‌ترین پیش‌درآمدهای موسیقی سنتی با گذر از گشایش، فیلی و شکسته.',
        motifMelody: [
          { midi: 67, dur: 0.7 },
          { midi: 71, dur: 0.5 },
          { midi: 74, dur: 0.8 },
          { midi: 72, dur: 0.4 },
          { midi: 71, dur: 0.6 },
          { midi: 67, dur: 1.2 }
        ]
      },
      {
        id: 'pish_mahoor_shahnazi',
        title: 'پیش‌درآمد ماهور (استاد علی‌اکبر شهنازی)',
        composer: 'علی‌اکبر شهنازی',
        type: 'pishdaramad',
        meter: '۲/۴ ضربی باوقار',
        description: 'شاهکار ردیف‌نوازی تار و ویولن با ملودی‌های پیوسته و باصلابت.',
        motifMelody: [
          { midi: 62, dur: 0.4 },
          { midi: 67, dur: 0.7 },
          { midi: 69, dur: 0.5 },
          { midi: 71, dur: 0.7 },
          { midi: 67, dur: 1.0 }
        ]
      },
      {
        id: 'daramad_aval_mahoor_rast',
        title: 'درآمد اول ماهور (درآمد راست - صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'افتتاح دستگاه ماهور با نغمات زلال و تثبیت دانگ اول با پرده‌نگاری دقیق.',
        motifMelody: [
          { midi: 67, dur: 0.9 },
          { midi: 69, dur: 0.5 },
          { midi: 71, dur: 0.8 },
          { midi: 69, dur: 0.4 },
          { midi: 67, dur: 1.4 }
        ]
      },
      {
        id: 'chaharmezrab_mahoor_saba',
        title: 'چهارمضراب ماهور در سل (استاد ابوالحسن صبا)',
        composer: 'ابوالحسن صبا',
        type: 'chaharmezrab',
        meter: '۶/۸ سریع و طرب‌انگیز',
        description: 'کاربرد تکنیک دوبل‌نت و آرشه‌کشی پیوسته لگاتو و استکاتو بر سیم‌های ویولن.',
        motifMelody: [
          { midi: 67, dur: 0.3 },
          { midi: 74, dur: 0.3 },
          { midi: 71, dur: 0.3 },
          { midi: 69, dur: 0.3 },
          { midi: 67, dur: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'mahoor_re',
    name: 'دستگاه ماهور «رِ» (چپ‌کوک)',
    isPersian: true,
    notes: [2, 4, 6, 7, 9, 11, 1],
    shahedMidi: 74,
    istMidi: 74,
    shahedName: 'رِ ۵ (D5)',
    istName: 'رِ ۵ (D5)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: D5 (رِ)', noteName: 'رِ', freq: 587.33, midi: 74 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'ماهور چپ‌کوک بر پایه رِ ۵. دو دیز و فا دیز (رِ ماژور غربی). نوت شاهد و ایست روی رِ ۵. کوک ساز: رِ-لا-رِ-سل.',
    pishdaramadTitle: 'پیش‌درآمد ماهور چپ‌کوک (مکتب ویولن صبا)',
    motifMelody: [
      { midi: 74, dur: 0.6 },
      { midi: 76, dur: 0.4 },
      { midi: 78, dur: 0.5 },
      { midi: 79, dur: 0.5 },
      { midi: 81, dur: 0.7 },
      { midi: 74, dur: 1.0 }
    ],
    repertoire: [
      {
        id: 'pish_mahoor_chap',
        title: 'پیش‌درآمد ماهور چپ‌کوک (مکتب صبا)',
        composer: 'ابوالحسن صبا',
        type: 'pishdaramad',
        meter: '۶/۸ شاداب',
        description: 'ویژه ویولن در پوزیسیون سوم با صدای بلورین بر سیم اول.',
        motifMelody: [
          { midi: 74, dur: 0.7 },
          { midi: 78, dur: 0.5 },
          { midi: 81, dur: 0.8 },
          { midi: 79, dur: 0.4 },
          { midi: 74, dur: 1.2 }
        ]
      }
    ]
  },
  {
    id: 'nava_re',
    name: 'دستگاه نوا «رِ» (آرامش‌بخش، متفکر و فیلسوفانه)',
    isPersian: true,
    notes: [2, 4, 5, 7, 9, 10, 0],
    microCents: { 4: -45 },
    microLabels: { 4: { letter: 'E𝄳 (می کُرن)', solfege: 'می کُرن' } },
    shahedMidi: 62,
    istMidi: 62,
    shahedName: 'رِ ۴ (D4)',
    istName: 'رِ ۴ (D4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'نوا «رِ»: می کُرن (-۴۵ سنت)، سی بمل، فا بکار، سل بکار، لا بکار، دو بکار. نغمه‌ای عمیق، شبانه و پاییزی. کوک ساز: می-لا-ر-سل.',
    pishdaramadTitle: 'پیش‌درآمد نوای مرتضی نی‌داوود / علی‌اکبر شهنازی',
    motifMelody: [
      { midi: 62, dur: 0.6 },
      { midi: 64, dur: 0.4, centOffset: -45 },
      { midi: 65, dur: 0.5 },
      { midi: 67, dur: 0.7 },
      { midi: 65, dur: 0.4 },
      { midi: 62, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_nava_neydavoud',
        title: 'پیش‌درآمد نوا (استاد مرتضی نی‌داوود)',
        composer: 'مرتضی نی‌داوود',
        type: 'pishdaramad',
        meter: '۶/۴ رازآلود و متین',
        description: 'سیر تفکربرانگیز در دستگاه نوا با گذار به گوشه‌های نیشابورک، نهفت و خجسته.',
        motifMelody: [
          { midi: 62, dur: 0.8 },
          { midi: 64, dur: 0.5, centOffset: -45 },
          { midi: 65, dur: 0.7 },
          { midi: 67, dur: 0.9 },
          { midi: 69, dur: 0.6 },
          { midi: 67, dur: 0.5 },
          { midi: 62, dur: 1.3 }
        ]
      },
      {
        id: 'pish_nava_shahnazi',
        title: 'پیش‌درآمد نوا (استاد علی‌اکبر شهنازی)',
        composer: 'علی‌اکبر شهنازی',
        type: 'pishdaramad',
        meter: '۲/۴ ضربی باابهت',
        description: 'ضرب‌آهنگ سنگین با موتیف‌های مقتدرانه بر سیم سوم و دوم ویولن.',
        motifMelody: [
          { midi: 55, dur: 0.5 },
          { midi: 62, dur: 0.8 },
          { midi: 64, dur: 0.5, centOffset: -45 },
          { midi: 65, dur: 0.7 },
          { midi: 62, dur: 1.1 }
        ]
      },
      {
        id: 'daramad_nava_saba',
        title: 'درآمد اول نوا (ردیف صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'آرامش عمیق شبانه با تکیه بر نوت رِ و لرزش‌های ملایم می کُرن.',
        motifMelody: [
          { midi: 62, dur: 1.0 },
          { midi: 64, dur: 0.5, centOffset: -45 },
          { midi: 65, dur: 0.8 },
          { midi: 64, dur: 0.5, centOffset: -45 },
          { midi: 62, dur: 1.4 }
        ]
      }
    ]
  },
  {
    id: 'rast_panjgah_fa',
    name: 'دستگاه راست‌پنجگاه «فا» (کهن‌ترین و جامع‌ترین دستگاه)',
    isPersian: true,
    notes: [5, 7, 9, 10, 0, 2, 4],
    shahedMidi: 65,
    istMidi: 65,
    shahedName: 'فا ۴ (F4)',
    istName: 'فا ۴ (F4)',
    kookViolin: [
      { stringNumber: 1, name: 'سیم ۱: E5 (می)', noteName: 'می', freq: 659.25, midi: 76 },
      { stringNumber: 2, name: 'سیم ۲: A4 (لا)', noteName: 'لا', freq: 440.00, midi: 69 },
      { stringNumber: 3, name: 'سیم ۳: D4 (رِ)', noteName: 'رِ', freq: 293.66, midi: 62 },
      { stringNumber: 4, name: 'سیم ۴: G3 (سل)', noteName: 'سل', freq: 196.00, midi: 55 }
    ],
    info: 'راست‌پنجگاه «فا»: سی بمل، بقیه نوت‌ها بکار. قابلیت مدولاسیون (مرکب‌خوانی) به تمامی دستگاه‌ها. کوک ساز: می-لا-ر-سل.',
    pishdaramadTitle: 'پیش‌درآمد راست‌پنجگاه اثر درویش‌خان / علی‌اکبر شهنازی',
    motifMelody: [
      { midi: 65, dur: 0.6 },
      { midi: 67, dur: 0.4 },
      { midi: 69, dur: 0.6 },
      { midi: 70, dur: 0.5 },
      { midi: 72, dur: 0.7 },
      { midi: 69, dur: 0.4 },
      { midi: 65, dur: 1.1 }
    ],
    repertoire: [
      {
        id: 'pish_rast_darvish',
        title: 'پیش‌درآمد راست‌پنجگاه (استاد غلامحسین درویش‌خان)',
        composer: 'درویش‌خان',
        type: 'pishdaramad',
        meter: '۶/۴ پادشاهی و شکوهمند',
        description: 'کامل‌ترین فرم پیش‌درآمد در رپرتوار موسیقی ایران با گردش در پروانه، نغمه و پنجگاه.',
        motifMelody: [
          { midi: 65, dur: 0.8 },
          { midi: 69, dur: 0.5 },
          { midi: 72, dur: 0.8 },
          { midi: 70, dur: 0.5 },
          { midi: 69, dur: 0.6 },
          { midi: 65, dur: 1.3 }
        ]
      },
      {
        id: 'pish_rast_shahnazi',
        title: 'پیش‌درآمد راست‌پنجگاه (استاد علی‌اکبر شهنازی)',
        composer: 'علی‌اکبر شهنازی',
        type: 'pishdaramad',
        meter: '۲/۴ ضربی اصیل',
        description: 'مضراب‌داری اشرافی با پیوند گوشه‌های راست، زنگوله و سپهر.',
        motifMelody: [
          { midi: 60, dur: 0.4 },
          { midi: 65, dur: 0.8 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 0.7 },
          { midi: 65, dur: 1.0 }
        ]
      },
      {
        id: 'daramad_rast_panjgah_saba',
        title: 'درآمد راست‌پنجگاه (درآمد راست و زنگوله - صبا)',
        composer: 'ابوالحسن صبا',
        type: 'daramad',
        meter: 'آوازی',
        description: 'آغاز جامع‌ترین دستگاه با نوای شفاف و پرده‌نگاری دقیق مرکز تنال فا.',
        motifMelody: [
          { midi: 65, dur: 1.0 },
          { midi: 67, dur: 0.5 },
          { midi: 69, dur: 0.8 },
          { midi: 67, dur: 0.4 },
          { midi: 65, dur: 1.5 }
        ]
      }
    ]
  }
];

export interface ClassicalScale {
  id: string;
  name: string;
  isPersian: false;
  notes: number[];
  tonicMidi: number;
  tonicName: string;
  accidentalType: 'natural' | 'sharp' | 'flat';
  accidentalCount: number;
  relativeMinor: string;
  info: string;
}

export const CLASSICAL_SCALES_DATA: ClassicalScale[] = [
  {
    id: 'c_major',
    name: 'دو ماژور (C Major) - طبیعی و بدون علامت',
    isPersian: false,
    notes: [0, 2, 4, 5, 7, 9, 11],
    tonicMidi: 60,
    tonicName: 'دو (C4)',
    accidentalType: 'natural',
    accidentalCount: 0,
    relativeMinor: 'لا مینور (A minor)',
    info: 'مبنای تمامی گام‌های دیاتونیک غربی بدون هیچ دیز یا بمل. فواصل: پرده-پرده-نیم‌پرده-پرده-پرده-پرده-نیم‌پرده.'
  },
  {
    id: 'g_major',
    name: 'سل ماژور (G Major) - یک دیز (F♯)',
    isPersian: false,
    notes: [7, 9, 11, 0, 2, 4, 6],
    tonicMidi: 67,
    tonicName: 'سل (G4)',
    accidentalType: 'sharp',
    accidentalCount: 1,
    relativeMinor: 'می مینور (E minor)',
    info: 'گام پنجم بالاتر از دو. سرکلید: یک دیز بر روی فا (F♯). انطباق ساختاری با ماهور راست‌کوک.'
  },
  {
    id: 'd_major',
    name: 'ر ماژور (D Major) - دو دیز (F♯, C♯)',
    isPersian: false,
    notes: [2, 4, 6, 7, 9, 11, 1],
    tonicMidi: 62,
    tonicName: 'رِ (D4)',
    accidentalType: 'sharp',
    accidentalCount: 2,
    relativeMinor: 'سی مینور (B minor)',
    info: 'گام درخشان و پرکاربرد کنسرتوهای ویولن (بتهوون، چایکوفسکی، برامس). سرکلید: فا دیز و دو دیز.'
  },
  {
    id: 'a_major',
    name: 'لا ماژور (A Major) - سه دیز (F♯, C♯, G♯)',
    isPersian: false,
    notes: [9, 11, 1, 2, 4, 6, 8],
    tonicMidi: 69,
    tonicName: 'لا (A4)',
    accidentalType: 'sharp',
    accidentalCount: 3,
    relativeMinor: 'فا دیز مینور (F♯ minor)',
    info: 'گام پرطنین و پرانرژی. سرکلید: فا دیز، دو دیز، سل دیز.'
  },
  {
    id: 'e_major',
    name: 'می ماژور (E Major) - چهار دیز (F♯, C♯, G♯, D♯)',
    isPersian: false,
    notes: [4, 6, 8, 9, 11, 1, 3],
    tonicMidi: 64,
    tonicName: 'می (E4)',
    accidentalType: 'sharp',
    accidentalCount: 4,
    relativeMinor: 'دو دیز مینور (C♯ minor)',
    info: 'گام زلال و بهاری (کنسرتو بهار ویوالدی). سرکلید: فا، دو، سل، ر دیز.'
  },
  {
    id: 'b_major',
    name: 'سی ماژور (B Major) - پنج دیز',
    isPersian: false,
    notes: [11, 1, 3, 4, 6, 8, 10],
    tonicMidi: 71,
    tonicName: 'سی (B4)',
    accidentalType: 'sharp',
    accidentalCount: 5,
    relativeMinor: 'سل دیز مینور (G♯ minor)',
    info: 'سرکلید: فا، دو، سل، ر، لا دیز. در دایره پنجم‌ها در ساعت ۵ قرار دارد.'
  },
  {
    id: 'f_sharp_major',
    name: 'فا دیز ماژور (F♯ Major) - شش دیز',
    isPersian: false,
    notes: [6, 8, 10, 11, 1, 3, 5],
    tonicMidi: 66,
    tonicName: 'فا دیز (F♯4)',
    accidentalType: 'sharp',
    accidentalCount: 6,
    relativeMinor: 'ر دیز مینور (D♯ minor)',
    info: 'آن‌هارمونیک (هم‌صدا) با سل بمل ماژور. نقطه مقابل دو ماژور در دایره پنجم‌ها (ساعت ۶).'
  },
  {
    id: 'c_sharp_major',
    name: 'دو دیز ماژور (C♯ Major) - هفت دیز',
    isPersian: false,
    notes: [1, 3, 5, 6, 8, 10, 0],
    tonicMidi: 61,
    tonicName: 'دو دیز (C♯4)',
    accidentalType: 'sharp',
    accidentalCount: 7,
    relativeMinor: 'لا دیز مینور (A♯ minor)',
    info: 'تمام هفت نوت دارای نشانه دیز هستند. آن‌هارمونیک با ر بمل ماژور.'
  },
  {
    id: 'f_major',
    name: 'فا ماژور (F Major) - یک بمل (B♭)',
    isPersian: false,
    notes: [5, 7, 9, 10, 0, 2, 4],
    tonicMidi: 65,
    tonicName: 'فا (F4)',
    accidentalType: 'flat',
    accidentalCount: 1,
    relativeMinor: 'ر مینور (D minor)',
    info: 'گام شبانی و آرامش‌بخش (سمفونی ۶ بتهوون). سرکلید: سی بمل (B♭).'
  },
  {
    id: 'b_flat_major',
    name: 'سی بمل ماژور (B♭ Major) - دو بمل (B♭, E♭)',
    isPersian: false,
    notes: [10, 0, 2, 3, 5, 7, 9],
    tonicMidi: 70,
    tonicName: 'سی بمل (B♭4)',
    accidentalType: 'flat',
    accidentalCount: 2,
    relativeMinor: 'سل مینور (G minor)',
    info: 'گام استاندارد سازهای بادی برنجی و چوبی. سرکلید: سی بمل و می بمل.'
  },
  {
    id: 'e_flat_major',
    name: 'می بمل ماژور (E♭ Major) - سه بمل (B♭, E♭, A♭)',
    isPersian: false,
    notes: [3, 5, 7, 8, 10, 0, 2],
    tonicMidi: 63,
    tonicName: 'می بمل (E♭4)',
    accidentalType: 'flat',
    accidentalCount: 3,
    relativeMinor: 'دو مینور (C minor)',
    info: 'گام حماسی اروئیکا و امپراتور بتهوون. سرکلید: سی، می، لا بمل.'
  },
  {
    id: 'a_flat_major',
    name: 'لا بمل ماژور (A♭ Major) - چهار بمل',
    isPersian: false,
    notes: [8, 10, 0, 1, 3, 5, 7],
    tonicMidi: 68,
    tonicName: 'لا بمل (A♭4)',
    accidentalType: 'flat',
    accidentalCount: 4,
    relativeMinor: 'فا مینور (F minor)',
    info: 'گام غنی و پرطنین رمانتیک (شوپن و لیست). سرکلید: سی، می، لا، ر بمل.'
  },
  {
    id: 'd_flat_major',
    name: 'ر بمل ماژور (D♭ Major) - پنج بمل',
    isPersian: false,
    notes: [1, 3, 5, 6, 8, 10, 0],
    tonicMidi: 61,
    tonicName: 'ر بمل (D♭4)',
    accidentalType: 'flat',
    accidentalCount: 5,
    relativeMinor: 'سی بمل مینور (B♭ minor)',
    info: 'کلر دو لون دبوسی. سرکلید: سی، می، لا، ر، سل بمل.'
  }
];

export interface FifthsPosition {
  angle: number;
  major: string;
  minor: string;
  accidentals: string;
  triadMidi: number[];
  tritone: string;
  color: string;
  scaleId: string;
  solfege: string;
  sig: string;
  minorSol: string;
}

export const FIFTHS_WHEEL_DATA: FifthsPosition[] = [
  { angle: 0, major: 'C', minor: 'Am', accidentals: 'طبیعی (۰)', triadMidi: [60, 64, 67], tritone: 'F♯ / G♭', color: '#E5A836', scaleId: 'c_major', solfege: 'دو', sig: 'طبیعی (بدون علامت)', minorSol: 'لا مینور' },
  { angle: 30, major: 'G', minor: 'Em', accidentals: '۱ دیز (F♯)', triadMidi: [67, 71, 74], tritone: 'C♯ / D♭', color: '#D97706', scaleId: 'g_major', solfege: 'سل', sig: '۱ دیز (فا دیز)', minorSol: 'می مینور' },
  { angle: 60, major: 'D', minor: 'Bm', accidentals: '۲ دیز (F♯, C♯)', triadMidi: [62, 66, 69], tritone: 'G♯ / A♭', color: '#B45309', scaleId: 'd_major', solfege: 'رِ', sig: '۲ دیز (فا، دو دیز)', minorSol: 'سی مینور' },
  { angle: 90, major: 'A', minor: 'F♯m', accidentals: '۳ دیز', triadMidi: [69, 73, 76], tritone: 'D♯ / E♭', color: '#92400E', scaleId: 'a_major', solfege: 'لا', sig: '۳ دیز (فا، دو، سل دیز)', minorSol: 'فا دیز مینور' },
  { angle: 120, major: 'E', minor: 'C♯m', accidentals: '۴ دیز', triadMidi: [64, 68, 71], tritone: 'A♯ / B♭', color: '#78350F', scaleId: 'e_major', solfege: 'می', sig: '۴ دیز (فا، دو، سل، ر دیز)', minorSol: 'دو دیز مینور' },
  { angle: 150, major: 'B', minor: 'G♯m', accidentals: '۵ دیز', triadMidi: [71, 75, 78], tritone: 'F', color: '#831843', scaleId: 'b_major', solfege: 'سی', sig: '۵ دیز', minorSol: 'سل دیز مینور' },
  { angle: 180, major: 'F♯/G♭', minor: 'D♯m/E♭m', accidentals: '۶ دیز / ۶ بمل', triadMidi: [66, 70, 73], tritone: 'C', color: '#8B2635', scaleId: 'f_sharp_major', solfege: 'فا دیز / سل بمل', sig: '۶ دیز / ۶ بمل (آن‌هارمونیک)', minorSol: 'ر دیز / می بمل مینور' },
  { angle: 210, major: 'D♭', minor: 'B♭m', accidentals: '۵ بمل', triadMidi: [61, 65, 68], tritone: 'G', color: '#4C1D95', scaleId: 'd_flat_major', solfege: 'ر بمل', sig: '۵ بمل', minorSol: 'سی بمل مینور' },
  { angle: 240, major: 'A♭', minor: 'Fm', accidentals: '۴ بمل', triadMidi: [68, 72, 75], tritone: 'D', color: '#1E3A8A', scaleId: 'a_flat_major', solfege: 'لا بمل', sig: '۴ بمل', minorSol: 'فا مینور' },
  { angle: 270, major: 'E♭', minor: 'Cm', accidentals: '۳ بمل', triadMidi: [63, 67, 70], tritone: 'A', color: '#065F46', scaleId: 'e_flat_major', solfege: 'می بمل', sig: '۳ بمل', minorSol: 'دو مینور' },
  { angle: 300, major: 'B♭', minor: 'Gm', accidentals: '۲ بمل', triadMidi: [70, 74, 77], tritone: 'E', color: '#047857', scaleId: 'b_flat_major', solfege: 'سی بمل', sig: '۲ بمل', minorSol: 'سل مینور' },
  { angle: 330, major: 'F', minor: 'Dm', accidentals: '۱ بمل (B♭)', triadMidi: [65, 69, 72], tritone: 'B', color: '#059669', scaleId: 'f_major', solfege: 'فا', sig: '۱ بمل (سی بمل)', minorSol: 'ر مینور' }
];

export interface RhythmStepHit {
  step: number;
  accent: 'strong' | 'medium' | 'weak';
  sound: 'tombak_tom' | 'tombak_bak' | 'daf' | 'clapper';
}

export interface RhythmPattern {
  id: string;
  name: string;
  category: 'persian' | 'balkan';
  timeSignature: string;
  subdivisions: number[];
  tempoDefault: number;
  description: string;
  countingText: string;
  mnemonicSyllables: string[];
  subdivisionLabels: string[];
  hits: RhythmStepHit[];
}

export const RHYTHM_PRESETS: RhythmPattern[] = [
  {
    id: 'chaharmezrab_6_8',
    name: 'چهارمضراب اصیل ایرانی (۶/۸ سریع)',
    category: 'persian',
    timeSignature: '6/8',
    subdivisions: [3, 3],
    tempoDefault: 126,
    description: 'ریتم پرتحرک و مطرب با تاکید بر ضرب‌های ۱ و ۴، ویژه چهارمضراب‌های صبا، یاحقی و بدیعی.',
    countingText: '۱ - ۲ - ۳ | ۴ - ۵ - ۶ (تُم - بَک - بَک | تا - بَک - بَک)',
    mnemonicSyllables: ['تُم', 'بَک', 'بَک', 'تا', 'بَک', 'بَک'],
    subdivisionLabels: ['ضرب ۱ (اصلی)', 'ضرب ۲', 'ضرب ۳', 'ضرب ۴ (فرعی)', 'ضرب ۵', 'ضرب ۶'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'weak', sound: 'tombak_bak' },
      { step: 3, accent: 'medium', sound: 'daf' },
      { step: 4, accent: 'weak', sound: 'tombak_bak' },
      { step: 5, accent: 'weak', sound: 'tombak_bak' }
    ]
  },
  {
    id: 'reng_6_8',
    name: 'رنگ اصیل ایرانی (۶/۸ سنگین و مجلسی)',
    category: 'persian',
    timeSignature: '6/8',
    subdivisions: [3, 3],
    tempoDefault: 104,
    description: 'قطعه پایانی کنسرت‌های ایرانی، باوقار و شادمانه، اثر استاد درویش‌خان و رکن‌الدین مختاری.',
    countingText: '۱ - ۲ - ۳ | ۴ - ۵ - ۶ (دا - ران - دی - ری - دان - دان)',
    mnemonicSyllables: ['تُم', 'بَک', 'بَک', 'دف', 'بَک', 'بَک'],
    subdivisionLabels: ['ضرب ۱ (سنگین)', 'ضرب ۲', 'ضرب ۳', 'ضرب ۴ (میانی)', 'ضرب ۵', 'ضرب ۶'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'weak', sound: 'tombak_bak' },
      { step: 3, accent: 'medium', sound: 'daf' },
      { step: 4, accent: 'weak', sound: 'tombak_bak' },
      { step: 5, accent: 'weak', sound: 'tombak_bak' }
    ]
  },
  {
    id: 'kereshmeh_3_4',
    name: 'کرشمه و تصنیف ۳/۴ (ناز و خرامان)',
    category: 'persian',
    timeSignature: '3/4',
    subdivisions: [1, 1, 1],
    tempoDefault: 92,
    description: 'وزن فاعلاتن فاعلاتن با خرامش ویژه که در تمام دستگاه‌های ردیف اجرا می‌شود.',
    countingText: '۱ - ۲ - ۳ (تُم - تا - تِ | فاعِلاتُن)',
    mnemonicSyllables: ['تُم', 'تا', 'تِ'],
    subdivisionLabels: ['ضرب ۱ (قوی)', 'ضرب ۲ (متوسط)', 'ضرب ۳ (ضعیف)'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'medium', sound: 'tombak_bak' },
      { step: 2, accent: 'weak', sound: 'daf' }
    ]
  },
  {
    id: 'zarbi_shur_2_4',
    name: 'ضربی شور و پایکوبی (۲/۴ متقارن)',
    category: 'persian',
    timeSignature: '2/4',
    subdivisions: [2, 2],
    tempoDefault: 116,
    description: 'ریتم تند و شفاف با ضرب‌های پرده‌نگاری تمبک و دف.',
    countingText: '۱ - و - ۲ - و (تُم - بَک - تا - بَک)',
    mnemonicSyllables: ['تُم', 'بَک', 'تا', 'بَک'],
    subdivisionLabels: ['ضرب ۱ (پایه)', 'و (بین‌ضرب)', 'ضرب ۲ (تاکید)', 'و (بین‌ضرب)'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'medium', sound: 'daf' },
      { step: 3, accent: 'weak', sound: 'tombak_bak' }
    ]
  },
  {
    id: 'ruchenitsa_7_8',
    name: 'روچنیتسا بالکان و دانوب (۷/۸ لنگ: ۲+۲+۳)',
    category: 'balkan',
    timeSignature: '7/8',
    subdivisions: [2, 2, 3],
    tempoDefault: 140,
    description: 'ضرب‌آهنگ رقص آیینی بالکان و رومانی با کشش ضرب سوم (کوتاه-کوتاه-بلند).',
    countingText: '۱-۲ ، ۱-۲ ، ۱-۲-۳ (کوتاه - کوتاه - بُلَند)',
    mnemonicSyllables: ['تُم', 'بَک', 'تُم', 'بَک', 'تَق', 'بَک', 'دف'],
    subdivisionLabels: ['ضرب ۱', 'ضرب ۲', 'ضرب ۳', 'ضرب ۴', 'ضرب ۵ (پرش)', 'ضرب ۶', 'ضرب ۷'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'medium', sound: 'tombak_tom' },
      { step: 3, accent: 'weak', sound: 'tombak_bak' },
      { step: 4, accent: 'strong', sound: 'clapper' },
      { step: 5, accent: 'weak', sound: 'tombak_bak' },
      { step: 6, accent: 'weak', sound: 'daf' }
    ]
  },
  {
    id: 'paidushko_5_8',
    name: 'پایدوشکو کارپات (۵/۸ لنگ: ۲+۳)',
    category: 'balkan',
    timeSignature: '5/8',
    subdivisions: [2, 3],
    tempoDefault: 150,
    description: 'رقص لنگان کارپات-دانوب با ساختار دوضربی نامتقارن (کوتاه-بلند).',
    countingText: '۱-۲ ، ۱-۲-۳ (کوتاه - بُلَند)',
    mnemonicSyllables: ['تُم', 'بَک', 'تَق', 'بَک', 'دف'],
    subdivisionLabels: ['ضرب ۱', 'ضرب ۲', 'ضرب ۳ (تاکید)', 'ضرب ۴', 'ضرب ۵'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'strong', sound: 'clapper' },
      { step: 3, accent: 'weak', sound: 'tombak_bak' },
      { step: 4, accent: 'weak', sound: 'daf' }
    ]
  },
  {
    id: 'daichovo_9_8',
    name: 'دایچوو هورو (۹/۸ لنگ: ۲+۲+۲+۳)',
    category: 'balkan',
    timeSignature: '9/8',
    subdivisions: [2, 2, 2, 3],
    tempoDefault: 160,
    description: 'ریتم چهاربخشی لنگ با پرش ضرب چهارم، پیونددهنده آناتولی به دانوب.',
    countingText: '۱-۲ ، ۱-۲ ، ۱-۲ ، ۱-۲-۳ (کوتاه - کوتاه - کوتاه - بُلَند)',
    mnemonicSyllables: ['تُم', 'بَک', 'تُم', 'بَک', 'تُم', 'بَک', 'تَق', 'دف', 'بَک'],
    subdivisionLabels: ['بخش ۱ (۲)', 'ضرب ۲', 'بخش ۲ (۲)', 'ضرب ۴', 'بخش ۳ (۲)', 'ضرب ۶', 'بخش ۴ (۳)', 'ضرب ۸', 'ضرب ۹'],
    hits: [
      { step: 0, accent: 'strong', sound: 'tombak_tom' },
      { step: 1, accent: 'weak', sound: 'tombak_bak' },
      { step: 2, accent: 'medium', sound: 'tombak_tom' },
      { step: 3, accent: 'weak', sound: 'tombak_bak' },
      { step: 4, accent: 'medium', sound: 'tombak_tom' },
      { step: 5, accent: 'weak', sound: 'tombak_bak' },
      { step: 6, accent: 'strong', sound: 'clapper' },
      { step: 7, accent: 'weak', sound: 'daf' },
      { step: 8, accent: 'weak', sound: 'tombak_bak' }
    ]
  }
];

export const AUTHOR_CREDITS = {
  softwareName: 'پرده‌نگار • سامانه جامع انطباق پیانو، ویولن و ردیف موسیقی ایرانی',
  softwareVersion: '3.5.0 (ویرایش پژوهشی دانشنامه‌ای)',
  author: 'ایمان برزجان',
  authorTitle: 'نرم‌افزارنویس، طراح سامانه‌های آموزشی موسیقی و پژوهشگر',
  authorWebsite: 'https://imanbarzjan.ir',
  publisher: 'استودیو اینامیکس (EnamiX)',
  publisherTitle: 'استودیو طراحی و تولید محتوای هوشمند موسیقی اینامیکس',
  advisor: 'استاد بابک بختیاری',
  advisorTitle: 'مدرس و نوازنده برجسته ویولن',
};

export interface TreatiseChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  fullContent: string[];
  keyTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface ResearchPdfDoc {
  id: string;
  fileName: string;
  title: string;
  author: string;
  fileSizeText: string;
  description: string;
  downloadUrl: string;
}

export const RESEARCH_PDF_DOCS: ResearchPdfDoc[] = [
  {
    id: 'pdf_continuum',
    fileName: 'iranian-danubian-sound-world_e4b86614.pdf',
    title: 'جهان صوتی ایرانی-دانوبی: پیوستار آکوستیک از فلات ایران تا حوضه کارپات-دانوب',
    author: 'پژوهش پیوستار آکوستیک • استودیو اینامیکس',
    fileSizeText: '۶.۱ مگابایت (PDF پژوهشی)',
    description: 'بررسی ارگانولوژی تطبیقی، مهاجرت‌های تاریخی سکایی و روما، تحلیل ریزپرده‌های کانتمیر اوغلو و فرم دوئینا.',
    downloadUrl: '/assets/aistudio/iranian-danubian-sound-world_e4b86614.pdf'
  },
  {
    id: 'pdf_scales_comparative',
    fileName: '_____________-_____________________________________________1aea055c.pdf',
    title: 'ایمان برزجان - تحلیل جامع و تطبیقی گام‌ها (ویرایش اختصاصی)',
    author: 'ایمان برزجان (استودیو اینامیکس)',
    fileSizeText: '۲۵۶ کیلوبایت (ویرایش اختصاصی مؤلف)',
    description: 'تحلیل ریاضی، آکوستیک و فیزیک اصوات گام‌های دیاتونیک، دانگ‌های فیثاغورثی، دایره پنجم‌ها و اعتدال مساوی در برابر اعتدال طبیعی.',
    downloadUrl: '/assets/aistudio/_____________-_____________________________________________1aea055c.pdf'
  },
  {
    id: 'pdf_farhat_report',
    fileName: '____________41d0f75c.pdf',
    title: 'گزارش تحلیلی ردیف موسیقی ایرانی و سیستم فواصل هرمز فرهت',
    author: 'رساله پژوهشی موسیقی دستگاهی',
    fileSizeText: '۵.۰ مگابایت (رساله کامل)',
    description: 'نقد ۲۴ ربع‌پرده کلنل وزیری و تبیین پنج فاصله بنیادین (m, n, N, M, P) هرمز فرهت به همراه تحلیل دانگ‌های ۱۲ دستگاه و آواز.',
    downloadUrl: '/assets/aistudio/____________41d0f75c.pdf'
  },
  {
    id: 'pdf_major',
    fileName: '______0c245aee.pdf',
    title: 'ساختار و هندسه گام ماژور، سرکلیدها و ارتعاش هارمونیک‌ها',
    author: 'رساله آموزشی ویولن و پیانو',
    fileSizeText: '۸.۱ مگابایت (نسخه مصور)',
    description: 'فرمول تتراکوردها، الگوی پرده‌ها و نیم‌پرده‌ها، پوزیسیون‌های گریف ویولن، و توالی دیزها و بمل‌ها در دایره پنجم‌ها.',
    downloadUrl: '/assets/aistudio/______0c245aee.pdf'
  },
  {
    id: 'pdf_minor',
    fileName: '______8c43f75e.pdf',
    title: 'گام‌های مینور (طبیعی، هارمونیک، ملودیک) در رپرتوار ویولن کلاسیک',
    author: 'رساله تکنیک‌های اجرایی و تئوری',
    fileSizeText: '۷.۵ مگابایت (نسخه مصور)',
    description: 'تغییرات درجه ششم و هفتم، حل فاصله دوم افزوده در هارمونیک، و الگوهای انگشت‌گذاری در کنسرتوهای باخ، مندلسون و برامس.',
    downloadUrl: '/assets/aistudio/______8c43f75e.pdf'
  }
];

export const SCHOLARLY_TREATISE_CHAPTERS: TreatiseChapter[] = [
  {
    id: 'ch1',
    chapterNumber: 1,
    title: 'پیوستار آکوستیک اوراسیا: مهاجرت مدال‌ها از زاگرس تا دانوب',
    subtitle: 'ردیابی تاریخی شاهراه‌های تبادل موسیقایی سکایی، روما و عثمانی',
    summary: 'پیوستار آکوستیک نشان می‌دهد که موسیقی فلات کهن ایران، آناتولی، شبه‌جزیره بالکان و حوزه کارپات-دانوب (رومانی)، نه جزایری مجزا، بلکه یک شبکه پیوسته صوتی همگن هستند.',
    fullContent: [
      'بررسی‌های تاریخی و اسنادی اتنوموزیکولوژی اثبات می‌کند که خطوط تماس فرهنگی اوراسیا در طول دو هزاره گذشته، تبادلات ژرفی در ساختار مدهای موسیقایی پدید آورده است. از مهاجرت اقوام ایرانی‌زبان سکایی و سرمتی در حوزه رود دانوب تا جابجایی کولی‌های هنرمند (طوایف روما) از خراسان به والاچیا و مولداوی، ساختارهای مشترکی چون آوازهای سیال (Parlando-Rubato) و ردیف‌های مقامی منتقل گشتند.',
      'شاهزاده دیمیتری کانتمیر (کانتمیر اوغلو، ۱۶۷۳–۱۷۲۳) به عنوان دانشمند حاکم مولداوی که در دربار عثمانی زیسته و تنبور دسته‌بلند می‌نواخت، با تدوین «کتاب علم الموسیقی» بیش از ۳۵۰ قطعه مقامی را ثبت نمود. وی مفاهیم دقیق کمای هولدرین و نغمه‌های خنیاگران ایرانی و بغدادی را مستقیماً به رومانی منتقل نمود.',
      'در رومانی، اصناف نوازندگان موروثی بنام «لوتاری» (Lăutari) این فواصل ریزپرده‌ای و تحریرهای پیچیده را در ارکسترهای محلی تاراف (Tarafs) و به ویژه با سازهایی چون ویلن، کوبزا و تسامبال زنده نگاه داشتند. آواز نامدار دوئینا (Doina) در کوه‌های کارپات، خواهر معنوی آواز دشتی و حیران کردی در فلات ایران است.'
    ],
    keyTable: {
      headers: ['منطقه جغرافیایی', 'سنت موسیقایی', 'ریزپرده و گرایش مدال', 'ساز شاخص حامل نغمه'],
      rows: [
        ['فلات کهن ایران', 'ردیف دستگاهی (شور، دشتی، همایون)', 'کُرُن (۴۵- سنت) و سُری (۳۰+ سنت)', 'کمانچه، ویولن ردیف، تار، سنتور'],
        ['آناتولی و بین‌النهرین', 'مقامات عثمانی و شرقی (راست، اوشاک)', 'کماهای ۹ تایی (۲۲.۶- سنت)', 'تنبور، بوزوکی، قانون، نی'],
        ['شبه‌جزیره بالکان', 'نغمه‌های هورو و رقص‌های اکساک', 'چهارم افزوده لیدیایی و ریزپرده نرم', 'گادولکا، تامبوریتزا، کاوال'],
        ['حوضه کارپات-دانوب (رومانی)', 'آواز دوئینا و رپرتوار لوتاری', 'لغزش‌های پورتمانتو و ریزپرده متغیر', 'ویلن لوتاری، تسامبال، کاوال چوبی']
      ]
    }
  },
  {
    id: 'ch2',
    chapterNumber: 2,
    title: 'سیستم فواصل ریزپرده‌ای هرمز فرهت و نقد ۲۴ ربع‌پرده کلنل وزیری',
    subtitle: 'پنج فاصله انعطاف‌پذیر تجربی (m, n, N, M, P) در تبیین علمی ردیف ایران',
    summary: 'پژوهش بنیادین دکتر هرمز فرهت در دانشگاه کمبریج نشان داد که ربع‌پرده‌های مکانیکی ۵۰ سنتی کلنل علینقی وزیری ساختگی بوده و گوش نوازندگان اصیل ایران از فواصل تجربی انعطاف‌پذیر بهره می‌برد.',
    fullContent: [
      'علینقی وزیری در اوایل قرن بیستم، با هدف تجددگرایی و تطبیق موسیقی ایرانی با سیستم اعتدال مساوی غرب، اکتاو را به ۲۴ ربع‌پرده مساوی ۵۰ سنتی تقسیم کرد و علائم سُری و کُرُن را وضع نمود. اما ضبط‌های تاریخی استادان صبا، برومند، مجد و یاحقی نشان می‌دهد که نوازندگان هیچ‌گاه فاصله‌ای با اندازه دقیق ۵۰ سنت اجرا نمی‌کردند.',
      'هرمز فرهت در رساله دوران‌ساز خود «The Dastgah Concept in Persian Music»، ساختار فواصل ردیف را به ۵ نوع دوم منعطف طبقه‌بندی نمود:',
      '۱. دوم کوچک (m - Minor Second): حدود ۹۰ سنت (نظیر سی بکار تا دو)',
      '۲. دوم خنثای کوچک (n - Neutral Second): حدود ۱۳۵ تا ۱۴۰ سنت (نظیر لا تا سی کُرن در شور)',
      '۳. دوم خنثای بزرگ (N - Plus Neutral Second): حدود ۱۶۰ تا ۱۶۵ سنت (نظیر فا تا سل سُری در شور چپ‌کوک)',
      '۴. دوم بزرگ (M - Major Second): حدود ۲۰۴ سنت (پرده کامل نظیر دو تا ر)',
      '۵. دوم افزوده (P - Plus Augmented Second): حدود ۲۶۵ تا ۲۸۰ سنت (نظیر ر تا لا سری در همایون و چهارگاه)',
      'همچنین در ردیف ایرانی، سه مفهوم تنال بنیادین حاکم است: نت شاهد (Shahed - نت مرکز ثقل جاذبه صوتی)، نت ایست (Ist - پایان‌بخش جملات آوازی)، و نت متغیر (Motagheyer - نتی که با تغییر موقعیت در گوشه‌ها دستخوش تغییر ربع‌پرده‌ای می‌شود).'
    ],
    keyTable: {
      headers: ['نماد فاصله', 'نام علمی فاصله', 'اندازه تقریبی (سنت)', 'نمونه عینی در ردیف ۱۲ دستگاه'],
      rows: [
        ['m', 'دوم کوچک (نیم‌پرده کروماتیک)', '۹۰ سنت', 'فا تا سل بمل، سی تا دو'],
        ['n', 'دوم خنثی (نیم‌بزرگ)', '۱۳۵ سنت', 'لا تا سی کُرُن در دستگاه شور'],
        ['N', 'دوم خنثای بزرگ', '۱۶۰ سنت', 'فا تا سل سُری در شور چپ‌کوک'],
        ['M', 'دوم بزرگ (پرده کامل)', '۲۰۴ سنت', 'دو تا رِ در درآمد ماهور'],
        ['P', 'دوم افزوده (پرده بزرگ)', '۲۷۰ سنت', 'سل تا لا سُری / فا دیز تا لا سُری در همایون و چهارگاه']
      ]
    }
  },
  {
    id: 'ch3',
    chapterNumber: 3,
    title: 'فیزیک و هندسه گام‌های ماژور غربی و دایره پنجم‌ها',
    subtitle: 'تحلیل تتراکوردها، سری هارمونیک‌ها و نظام اعتدال مساوی (12-TET)',
    summary: 'گام ماژور حاصل انطباق دو دانگ (تتراکورد) همسان با فاصله یک پرده کامل جداکننده است که پایه‌گذار هارمونی تونال دوره باروک و کلاسیک گردید.',
    fullContent: [
      'در رساله تحلیل جامع گام‌ها، ساختار گام ماژور بر مبنای توالی دقیق فواصل پرده و نیم‌پرده تعریف می‌شود: پرده - پرده - نیم‌پرده - پرده - پرده - پرده - نیم‌پرده (T-T-S-T-T-T-S).',
      'این ساختار از پیوند دو دانگ یکسان تشکیل یافته است: دانگ اول (دو - ر - می - فا) و دانگ دوم (سل - لا - سی - دو). فاصله میان دو دانگ که پرده جدایی‌ناپذیر تنظیمی (Diazeuxis) نامیده می‌شود، فاصله چهارم درست را به پنجم درست پیوند می‌زند.',
      'دایره پنجم‌ها (Circle of Fifths) شاهکار هندسه اصوات است؛ حرکتی دورانی در جهت عقربه‌های ساعت با فاصله پنجم درست (۷ نیم‌پرده) به سوی دیزها و در خلاف جهت با فاصله چهارم درست (۵ نیم‌پرده) به سوی بمل‌ها. در نظام اعتدال مساوی دوازده‌گانه (12-TET)، فاصله پنجم درست بر اندازه ۷۰۰ سنت تثبیت شده که اندکی (حدود ۲ سنت) از فاصله پنجم خالص فیثاغورثی (۷۰۲ سنت) تنگ‌تر است تا چرخه در گام دوازدهم دقیقاً بر نقطه آغازین بسته شود.'
    ]
  },
  {
    id: 'ch4',
    chapterNumber: 4,
    title: 'سیر دگرگونی گام‌های مینور (طبیعی، هارمونیک، ملودیک)',
    subtitle: 'رفتار آکوستیک درجه هفتم و ششم در کنسرتوهای ویولن باخ و پاگانینی',
    summary: 'گام مینور به دلیل نیاز هارمونیک به ایجاد محسوس (Leading Tone) دستخوش سه دگرگونی اساسی در طول تاریخ موسیقی گردیده است.',
    fullContent: [
      'گام مینور طبیعی (Natural Minor) بر پایه مد بومی ائولین یونانی استوار است که درجات سوم، ششم و هفتم آن نیم‌پرده کمتر از ماژور نظیر است. نبود محسوس کششی در فاصله یک‌پرده‌ای بین درجه هفتم و هشتم، آهنگسازان عصر رنسانس را ناگزیر ساخت تا درجه هفتم را به صورت عارضی نیم‌پرده بالا ببرند که منجر به پیدایش مینور هارمونیک (Harmonic Minor) گردید.',
      'با این حال، بالارفتن درجه هفتم فاصله‌ای ناهنجار و یک‌ونیم پرده‌ای (دوم افزوده) میان درجات ششم و هفتم ایجاد کرد. برای تسهیل آوازخوانی و آرشه‌کشی روان بر ویولن، درجه ششم نیز در حالت صعودی نیم‌پرده بالا برده شد و در حالت فرود به وضعیت طبیعی بازگشت که مینور ملودیک (Melodic Minor) را پدید آورد.',
      'در رپرتوار ویولن کلاسیک، مکاتب کارل فلش و پابلو کازالس نشان دادند که نوازنده ویولن در اجرای مینور ملودیک از اینتوناسیون بیانی (Expressive Intonation) بهره می‌برد؛ بدین معنا که نت محسوس را چند سنت بالاتر از اعتدال مساوی می‌نوازد تا کشش جاذبه صوتی به نت تونیک تقویت شود.'
    ]
  },
  {
    id: 'ch5',
    chapterNumber: 5,
    title: 'ارگانولوژی تطبیقی: سنتور به تسمبال، سه‌تار به بوزوکی، نی به کاوال',
    subtitle: 'مسیر دگرگونی کالبد فیزیکی سازها در گذر از فلات ایران به اروپا',
    summary: 'تحول فیزیکی کاسه، خرک‌ها، پل‌ها و سیم‌بندی سازها، آیینه تمام‌نمای نیازهای زیباشناختی جوامع در پهنه پیوستار صوتی اوراسیا است.',
    fullContent: [
      'سنتور ذوزنقه‌ای چوبی ایرانی با ۷۲ سیم و خرک‌های متحرک نه تایی، در قرون وسطی از مسیر امپراتوری بیزانس وارد اروپای شرقی شد. در مجارستان و رومانی، ژوزف شوندا با افزودن دمپر پدالی، کلاف بزرگ چدنی و افزایش وسعت صدا تا چهار اکتاو، ساز سنتی را به «تسمبال بزرگ کنسرتی» تبدیل کرد تا بتواند با ارکسترهای سمفونیک برابری کند.',
      'سه‌تار کهن ایرانی با کاسه گلابی‌شکل و دسته باریک پرده‌بندی‌شده از روده، در مسیر آناتولی به سازهای تامبورا و سایدوس تبدیل شد و با انتقال توسط مهاجران یونانی آسیای صغیر (ازمیر) ساز بوزوکی مدرن متولد گشت؛ سازی که در موسیقی رببتیکو یونان و رومانیایی جایگاهی مسلط یافت.',
      'نی هفت‌بند ایرانی که با شیوه دندان‌نوازی تنفس ممتد صدایی سوزناک و نایی تولید می‌کند، در استپ‌های بالکان و کوهستان کارپات به فلوت لوله‌ای بلند «کاوال» (Caval / Kaval) بدون زبانه دگرگون شد؛ سازی که چوپانان رومانی نغمه‌های حزن‌انگیز دوئینا را با آن خلق می‌کنند.'
    ]
  },
  {
    id: 'ch6',
    chapterNumber: 6,
    title: 'کوک‌های ردیف ویولن ایران و لحن‌شناسی مکتب استاد یاحقی',
    subtitle: 'واخوان‌های دوبل، تشدید هارمونیک سیم‌ها و تسلط بر گریف در ردیف صبا و یاحقی',
    summary: 'ورود ویولن به موسیقی دستگاهی ایران توسط علی‌نقی وزیری و ارتقای آن توسط ابوالحسن صبا و پرویز یاحقی، منجر به ابداع کوک‌های نبوغ‌آمیزی شد که آکوستیک ساز اروپایی را با روح مقامات ایرانی یگانه ساخت.',
    fullContent: [
      'بر خلاف موسیقی کلاسیک غرب که در آن کوک ویولن همواره بر فواصل پنجم درست ثابت است (می-لا-ر-سل)، در موسیقی ایرانی برای هر دستگاه کوکی اختصاصی تعبیه شده است تا از طنین سیم‌های آزاد واخوان (Sympathetic Resonance) حداکثر استفاده به عمل آید.',
      'در مکتب استاد پرویز یاحقی، استفاده از کوک‌های جفت‌سیم (نظیر ر-لا-ر-لا در دشتی و همایون، و می-لا-ر-لا در اصفهان) امکان اجرای دوبل‌نت‌های مخملی و درخشش واخوان‌های بم را فراهم می‌ساخت.',
      'ابوالحسن صبا با بازنویسی ردیف میرزا عبدالله برای ویولن در سه دوره مقدماتی، متوسطه و عالی، تکنیک‌های خاص آرشه‌کشی نظیر آرشه پرتابی (سالتاتو)، دراب‌های ریز، مالش‌های پوزیسیونی و سرش‌های ریزپرده‌ای را وارد مکتب نوازندگی نمود.'
    ]
  },
  {
    id: 'ch7',
    chapterNumber: 7,
    title: 'مهندسی ریتم‌های لنگ اکساک (Aksak) و ادوار ایقاعی تمبک',
    subtitle: 'ضرب‌آهنگ‌های نامتقارن ۷/۸، ۵/۸ و ۹/۸ به همراه هجاهای آموزشی و مترونوم استاندارد',
    summary: 'ریتم‌های لنگ یا اکساک (برگرفته از واژه ترکی به معنای لنگیدن) بر پایه سلول‌های دو ضربی (کوتاه) و سه ضربی (بلند) استوارند که از ایران تا دانوب نبض تپنده پایکوبی‌های آیینی بوده‌اند.',
    fullContent: [
      'کنستانتین برائیلویو، اتنوموزیکولوگ نامدار رومانیایی، نشان داد که ریتم‌های مناطق بالکان و کارپات برخلاف ریتم‌های متقارن اروپای غربی، بر ضرب‌های نامتساوی ۲ و ۳ استوارند. برای نمونه، ریتم روچنیتسا (۷/۸) به صورت ۲+۲+۳ (کوتاه-کوتاه-بلند) و ریتم پایدوشکو (۵/۸) به صورت ۲+۳ (کوتاه-بلند) اجرا می‌شوند.',
      'در موسیقی ایرانی نیز دورهای ایقاعی تمبک از طریق هجاهای آوایی کهن نظیر «تَنَن - تَنَن - تَنَنَن» یا هجاهای آموزشی مدرن استاد حسین تهرانی (تُم - بَک - تا - تِ - کِ) آموزش داده می‌شوند. تمبک با دو ضربه اصلی شامل صدای بم توخالی در میانه پوست (تُم) و صدای زیر تیز در کناره کمانه (بَک) ستون فقرات میزان‌های ۶/۸، ۲/۴ و رِنگ‌ها را شکل می‌دهد.',
      'برای تسلط هنرجویان، در کنار صدای کوبه‌ای تمبک و دف، وجود یک مترونوم خالص با فرکانس استودیویی استاندارد (مانند نرم‌افزارهای Cubase و ProTools با کلیک ۱۶۰۰ هرتز روی ضرب قوی و ۱۰۰۰ هرتز روی ضرب‌های ضعیف) ضرورت حیاتی دارد تا ضرب‌آهنگ درونی بدون خطا تثبیت شود.'
    ]
  },
  {
    id: 'ch8',
    chapterNumber: 8,
    title: 'سوابق تاریخی، آزمایش‌های میدانی و میراث خنیاگری مشترک',
    subtitle: 'همگرایی میراث ناملموس یونسکو میان فلات کهن ایران و حوزه رود دانوب',
    summary: 'ثبت جهانی ردیف موسیقی ایرانی و آواز دوئینای رومانی در فهرست میراث ناملموس یونسکو، مهر تاییدی بر یگانگی بن‌مایه‌های عاطفی و زیبایی‌شناختی این پیوستار هزارساله است.',
    fullContent: [
      'در سال ۲۰۰۹ میلادی، سازمان یونسکو آواز سوزناک دوئینا (Doina) رومانی و ردیف موسیقی دستگاهی ایران را به عنوان میراث ناملموس بشریت به ثبت رساند. هر دو فرم بر بیان آزاد، ناله‌های حزن‌انگیز فردی، بازتاب طبیعت، و نغمه‌پردازی مدال متکی هستند.',
      'همچنین ساز سنتور ایران و تسامبال کنسرتی رومانی، نمونه‌ای شگرف از سازگاری یک آلت موسیقی با اقلیم‌های فرهنگی گوناگون در بستر زمان به شمار می‌روند.',
      'سامانه جامع پرده‌نگار با گردآوری این گنجینه کم‌نظیر پژوهشی، ابزاری منحصربه‌فرد برای هنرجویان، استادان دانشگاه، پژوهشگران اتنوموزیکولوژی و نوازندگان ویولن فراهم آورده تا مرزهای تئوری، فناوری نرم‌افزاری و میراث هنری را به هم پیوند زنند.'
    ]
  }
];
