/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * سامانه چندزبانه پرده‌نگار بر پایه زبان‌های کشورهای مسیر کوچ و پیوستار آکوستیک
 * Route of Migration Languages:
 * - fa: فارسی (Persian - پیش‌فرض و زبان مبدا فلات ایران)
 * - el: Ελληνικά (Greek - زبان بالکان، بیزانس و بوزوکی)
 * - ro: Română (Romanian - زبان کارپات، دانوب، تسامبال و دوینا)
 * - tr: Türkçe (Turkish - زبان آناتولی، ساز و مقامات عثمانی)
 * - ar: العربية (Arabic - زبان مقامات، تقاسیم، عود و قانون)
 * - en: English (Global academic & educational English)
 */

export type SupportedLanguage = 'fa' | 'el' | 'ro' | 'tr' | 'ar' | 'en';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
  regionDescription: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    flag: '🇮🇷',
    dir: 'rtl',
    regionDescription: 'فلات کهن ایران و خاستگاه ردیف دستگاهی'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    dir: 'ltr',
    regionDescription: 'حوزه بیزانس، دریای اژه، بالکان و ساز بوزوکی'
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    flag: '🇷🇴',
    dir: 'ltr',
    regionDescription: 'حوزه کارپات-دانوب، آواز دوئینا، تسامبال و لوتاری'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    regionDescription: 'پل آناتولی، مقامات عثمانی، کماهای هولدرین و ساز'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    regionDescription: 'مقامات شرقی، بین‌النهرین، عود و ادوار ایقاعی'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    regionDescription: 'International Scholarly & Ethnomusicological English'
  }
];

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  authorLabel: string;
  publisherLabel: string;
  advisorLabel: string;
  treatiseButton: string;
  exportPng: string;
  fullscreen: string;
  systemPlaceholder: string;
  scalePlaceholder: string;
  persianSystem: string;
  classicalSystem: string;
  tabKeysAndFingerboard: string;
  tabDaramads: string;
  tabCircleOfFifths: string;
  tabRhythmEngine: string;
  tabContinuumMap: string;
  tabTheoryGuide: string;
  tabBlog: string;
  playScale: string;
  stopScale: string;
  playMotif: string;
  stopMotif: string;
  centsGuideBtn: string;
  centsGuideTitle: string;
  timbrePiano: string;
  timbreViolin: string;
  timbreSantur: string;
  timbreTambal: string;
  timbreSetar: string;
  timbreBouzouki: string;
  timbreNey: string;
  timbreCaval: string;
  adminSubtleLink: string;
  adminTitle: string;
  themeCustomizer: string;
  languageSelect: string;
  statusReady: string;
  referenceFreq: string;
  readMore: string;
  audioPlayerTitle: string;
  videoEmbedTitle: string;
  backToArticles: string;
  searchArticles: string;
  filterAllCategories: string;
  allRightsReserved: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  fa: {
    appTitle: 'پرده‌نگار',
    appSubtitle: 'سامانه جامع انطباق پیانو، ویولن و ردیف موسیقی ایرانی',
    authorLabel: 'مؤلف و طراح',
    publisherLabel: 'استودیو اینامیکس (EnamiX)',
    advisorLabel: 'مشاور عالی',
    treatiseButton: 'دانشنامه و رساله پژوهشی (PDF)',
    exportPng: 'دانلود پوستر (PNG)',
    fullscreen: 'تمام‌صفحه',
    systemPlaceholder: 'لطفاً یک سیستم موسیقی (ایرانی یا غربی) را انتخاب کنید',
    scalePlaceholder: 'لطفاً یک دستگاه/آواز یا گام را انتخاب کنید',
    persianSystem: 'موسیقی دستگاهی ایران (۱۲ دستگاه و آواز)',
    classicalSystem: 'موسیقی دیاتونیک کلاسیک غرب (گام‌های ماژور و مینور)',
    tabKeysAndFingerboard: '🎹 کلاویه‌های ۵۱ گانه و گریف ویولن',
    tabDaramads: '🎶 تالار درآمدها و رپرتوار ردیف',
    tabCircleOfFifths: '⚙️ دایره پنجم‌ها و مهندسی هارمونی',
    tabRhythmEngine: '🥁 مولد ریتم، تمبک و مترونوم DAW',
    tabContinuumMap: '🗺️ پیوستار آکوستیک ایران تا دانوب (۲۱:۹)',
    tabTheoryGuide: '📖 دانشنامه ردیف و تئوری',
    tabBlog: '📰 وبلاگ و مقالات تخصصی',
    playScale: 'پخش گام کامل',
    stopScale: 'توقف پخش',
    playMotif: 'شنیدن گوشه/درآمد',
    stopMotif: 'توقف گوشه',
    centsGuideBtn: '🔬 بررسی سنت‌ها و تطبیق با رساله',
    centsGuideTitle: 'کالیبراسیون دقیق سنت‌ها و فواصل پنج‌گانه هرمز فرهت',
    timbrePiano: 'پیانو آکوستیک',
    timbreViolin: 'ویولن سولو',
    timbreSantur: 'سنتور کهن',
    timbreTambal: 'تسامبال رومانی',
    timbreSetar: 'سه‌تار ایرانی',
    timbreBouzouki: 'بوزوکی یونانی',
    timbreNey: 'نی هفت‌بند',
    timbreCaval: 'کاوال کارپات',
    adminSubtleLink: 'مدیریت و پیکربندی EnamiX',
    adminTitle: 'پنل مدیریت و پیکربندی اختصاصی استودیو اینامیکس',
    themeCustomizer: 'مهندسی تم رنگی سراسری',
    languageSelect: 'زبان پیوستار مهاجرت',
    statusReady: 'آماده نواختن • لطفاً یک سیستم موسیقی و دستگاه/گام را انتخاب نمایید',
    referenceFreq: 'فرکانس مرجع استاندارد: A4 = 440.0Hz',
    readMore: 'مطالعه مقاله کامل',
    audioPlayerTitle: 'صوت پژوهشی پیوست مقاله',
    videoEmbedTitle: 'ویدیوی یوتیوب پیوست',
    backToArticles: 'بازگشت به مقالات',
    searchArticles: 'جستجو در مقالات...',
    filterAllCategories: 'همه موضوعات',
    allRightsReserved: 'تمامی حقوق متعلق به مؤلف و استودیو اینامیکس است.'
  },
  el: {
    appTitle: 'PardehNegar',
    appSubtitle: 'Ολοκληρωμένο Σύστημα Αντιστοίχισης Πιάνου, Βιολιού & Περσικών Μακάμ',
    authorLabel: 'Συγγραφέας',
    publisherLabel: 'EnamiX Studio',
    advisorLabel: 'Επιστημονικός Σύμβουλος',
    treatiseButton: 'Επιστημονική Πραγματεία (PDF)',
    exportPng: 'Εξαγωγή Αφίσας (PNG)',
    fullscreen: 'Πλήρης Οθόνη',
    systemPlaceholder: 'Επιλέξτε ένα μουσικό σύστημα (Περσικό ή Δυτικό)',
    scalePlaceholder: 'Επιλέξτε ένα Dastgah ή Κλίμακα',
    persianSystem: 'Περσικό Σύστημα Ραντίφ (12 Dastgah & Avaz)',
    classicalSystem: 'Δυτική Διατονική Μουσική (Μείζονες & Ελάσσονες)',
    tabKeysAndFingerboard: '🎹 51 Πλήκτρα & Ταστιέρα Βιολιού',
    tabDaramads: '🎶 Ρεπερτόριο Daramad & Pishdaramad',
    tabCircleOfFifths: '⚙️ Κύκλος των Πεμπτών & Αρμονία',
    tabRhythmEngine: '🥁 Γεννήτρια Ρυθμών & Μετρονόμος DAW',
    tabContinuumMap: '🗺️ Ακουστικό Συνεχές: Ιράν έως Δούναβη',
    tabTheoryGuide: '📖 Εγκυκλοπαίδεια Θεωρίας & Radif',
    tabBlog: '📰 Άρθρα & Ερευνητικό Blog',
    playScale: 'Αναπαραγωγή Κλίμακας',
    stopScale: 'Διακοπή',
    playMotif: 'Ακρόαση Daramad',
    stopMotif: 'Διακοπή',
    centsGuideBtn: '🔬 Ανάλυση Cents & Μικροτονικότητας',
    centsGuideTitle: 'Ακριβής Βαθμονόμηση Cents & Θεωρία Farhat',
    timbrePiano: 'Ακουστικό Πιάνο',
    timbreViolin: 'Σόλο Βιολί',
    timbreSantur: 'Περσικό Santur',
    timbreTambal: 'Ρουμανικό Țambal',
    timbreSetar: 'Περσικό Setar',
    timbreBouzouki: 'Ελληνικό Μπουζούκι',
    timbreNey: 'Περσικό Ney',
    timbreCaval: 'Βαλκανικό Caval',
    adminSubtleLink: 'Διαχείριση EnamiX',
    adminTitle: 'Πίνακας Διαχείρισης EnamiX Studio',
    themeCustomizer: 'Χρωματικό Θέμα Συστήματος',
    languageSelect: 'Γλώσσα της Διαδρομής',
    statusReady: 'Έτοιμο • Επιλέξτε μουσικό σύστημα και κλίμακα',
    referenceFreq: 'Πρότυπη συχνότητα αναφοράς: A4 = 440.0Hz',
    readMore: 'Διαβάστε το πλήρες άρθρο',
    audioPlayerTitle: 'Συνοδευτικός Ήχος Έρευνας',
    videoEmbedTitle: 'Συνοδευτικό Βίντεο YouTube',
    backToArticles: 'Επιστροφή στα Άρθρα',
    searchArticles: 'Αναζήτηση άρθρων...',
    filterAllCategories: 'Όλες οι Κατηγορίες',
    allRightsReserved: 'Όλα τα δικαιώματα διατηρούνται από το EnamiX Studio.'
  },
  ro: {
    appTitle: 'PardehNegar',
    appSubtitle: 'Sistem de Convergență Acustică: Pian, Vioară & Moduri Muzicale',
    authorLabel: 'Autor & Creator',
    publisherLabel: 'Studioul EnamiX',
    advisorLabel: 'Consilier Științific',
    treatiseButton: 'Tratat de Cercetare (PDF)',
    exportPng: 'Export Poster (PNG)',
    fullscreen: 'Ecran Complet',
    systemPlaceholder: 'Selectați un sistem muzical (Persan sau Occidental)',
    scalePlaceholder: 'Selectați un Dastgah sau o Gamă',
    persianSystem: 'Sistemul Modal Persan (12 Dastgah & Avaz)',
    classicalSystem: 'Muzică Diatonică Occidentală (Majore & Minore)',
    tabKeysAndFingerboard: '🎹 51 Clape & Grif de Vioară',
    tabDaramads: '🎶 Repertoriu Daramad & Pishdaramad',
    tabCircleOfFifths: '⚙️ Cercul Cvintelor & Armonie',
    tabRhythmEngine: '🥁 Generator de Ritm & Metronom DAW',
    tabContinuumMap: '🗺️ Continuumul Acustic: Iran - Dunăre',
    tabTheoryGuide: '📖 Enciclopedie Teoretică & Etnomuzicologie',
    tabBlog: '📰 Blog & Articole Științifice',
    playScale: 'Redare Gamă Completă',
    stopScale: 'Oprire',
    playMotif: 'Ascultă Motivul Daramad',
    stopMotif: 'Oprire Motiv',
    centsGuideBtn: '🔬 Calibrare Cenți & Microtonalitate',
    centsGuideTitle: 'Analiza Precisă a Cenților și Intervalelor Farhat',
    timbrePiano: 'Pian Acustic',
    timbreViolin: 'Vioară Solo',
    timbreSantur: 'Santur Persan',
    timbreTambal: 'Țambal Mare Românesc',
    timbreSetar: 'Setar Tradițional',
    timbreBouzouki: 'Bouzouki Balcanic',
    timbreNey: 'Ney Tradițional',
    timbreCaval: 'Caval Păstoresc din Carpați',
    adminSubtleLink: 'Administrare EnamiX',
    adminTitle: 'Panou de Administrare Studioul EnamiX',
    themeCustomizer: 'Personalizare Cromatică Globală',
    languageSelect: 'Limba Rutei de Migrație',
    statusReady: 'Gata de redare • Selectați un sistem și o gamă',
    referenceFreq: 'Frecvență de referință: A4 = 440.0Hz',
    readMore: 'Citește articolul complet',
    audioPlayerTitle: 'Înregistrare Audio Anexată',
    videoEmbedTitle: 'Video Demonstrativ YouTube',
    backToArticles: 'Înapoi la Articole',
    searchArticles: 'Căutare articole...',
    filterAllCategories: 'Toate Categoriile',
    allRightsReserved: 'Toate drepturile sunt rezervate de Studioul EnamiX.'
  },
  tr: {
    appTitle: 'PardehNegar',
    appSubtitle: 'Piyano, Keman & Makam Akustik Uyumluluk Platformu',
    authorLabel: 'Yazar & Tasarımcı',
    publisherLabel: 'EnamiX Stüdyo',
    advisorLabel: 'Baş Danışman',
    treatiseButton: 'Araştırma Risalesi (PDF)',
    exportPng: 'Poster İndir (PNG)',
    fullscreen: 'Tam Ekran',
    systemPlaceholder: 'Lütfen bir müzik sistemi (Fars veya Batı) seçiniz',
    scalePlaceholder: 'Lütfen bir Destgah veya Dizi seçiniz',
    persianSystem: 'İran Radif Makam Sistemi (12 Destgah & Avaz)',
    classicalSystem: 'Batı Diyatonik Sistemi (Majör & Minör)',
    tabKeysAndFingerboard: '🎹 51 Tuş & Keman Klavyesi',
    tabDaramads: '🎶 Daramad & Peşrev Repertuarı',
    tabCircleOfFifths: '⚙️ Beşliler Çemberi & Armoni',
    tabRhythmEngine: '🥁 Ritim Üreteci & DAW Metronom',
    tabContinuumMap: '🗺️ Akustik Süreklilik: İran’dan Tuna’ya',
    tabTheoryGuide: '📖 Teori & Makam Ansiklopedisi',
    tabBlog: '📰 Makaleler & Uzman Blogu',
    playScale: 'Diziyi Çal',
    stopScale: 'Durdur',
    playMotif: 'Daramad Dinle',
    stopMotif: 'Durdur',
    centsGuideBtn: '🔬 Sent & Mikroton Kalibrasyonu',
    centsGuideTitle: 'Hürmüz Ferhat Aralıkları ve Sent Hassasiyeti',
    timbrePiano: 'Akustik Piyano',
    timbreViolin: 'Solo Keman',
    timbreSantur: 'İran Santuru',
    timbreTambal: 'Romanya Çambalı',
    timbreSetar: 'Klasik Setar',
    timbreBouzouki: 'Buzuki',
    timbreNey: 'Ney',
    timbreCaval: 'Balkan Kavalı',
    adminSubtleLink: 'EnamiX Yönetimi',
    adminTitle: 'EnamiX Stüdyo Yönetim Paneli',
    themeCustomizer: 'Genel Renk Teması Mühendisliği',
    languageSelect: 'Göç Yolu Dilleri',
    statusReady: 'Çalmaya hazır • Lütfen bir sistem ve makam seçiniz',
    referenceFreq: 'Standart referans frekansı: A4 = 440.0Hz',
    readMore: 'Makalenin devamını oku',
    audioPlayerTitle: 'Araştırma Eki Ses Kaydı',
    videoEmbedTitle: 'Ek YouTube Videosu',
    backToArticles: 'Makalelere Dön',
    searchArticles: 'Makalelerde ara...',
    filterAllCategories: 'Tüm Kategoriler',
    allRightsReserved: 'Tüm hakları EnamiX Stüdyo’ya aittir.'
  },
  ar: {
    appTitle: 'پرده‌نگار (پردینگار)',
    appSubtitle: 'المنظومة الشاملة لتوافق البيانو، الكمان والمقامات الإيرانية',
    authorLabel: 'المؤلف والمصمم',
    publisherLabel: 'استوديو إيناميكس (EnamiX)',
    advisorLabel: 'المستشار العلمي',
    treatiseButton: 'الموسوعة والرسالة البحثية (PDF)',
    exportPng: 'تحميل الملصق (PNG)',
    fullscreen: 'ملء الشاشة',
    systemPlaceholder: 'يرجى اختيار نظام موسيقي (إيراني أو غربي)',
    scalePlaceholder: 'يرجى اختيار مقام (دستكاه) أو سلم موسيقي',
    persianSystem: 'نظام الرديف والمقامات الإيرانية (١٢ دستكاه)',
    classicalSystem: 'الموسيقى الدياتونية الغربية (السلالم الكبيرة والصغيرة)',
    tabKeysAndFingerboard: '🎹 ٥١ مفتاح بيانو ومسطرة الكمان',
    tabDaramads: '🎶 بهو المداخل والموشحات والرديف',
    tabCircleOfFifths: '⚙️ دائرة الأخماس وهندسة التناغم',
    tabRhythmEngine: '🥁 مولد الإيقاع والمترونوم الاحترافي',
    tabContinuumMap: '🗺️ الامتداد الصوتي: من إيران إلى الدانوب',
    tabTheoryGuide: '📖 موسوعة النظريات والرديف الموسيقي',
    tabBlog: '📰 المدونة والمقالات التخصصية',
    playScale: 'عزف السلم كاملاً',
    stopScale: 'إيقاف السلم',
    playMotif: 'سماع المدخل (درآمد)',
    stopMotif: 'إيقاف',
    centsGuideBtn: '🔬 معايرة السنت وأرباع النغمات',
    centsGuideTitle: 'القياس الدقيق للأبعاد الموسيقية ونظرية هرمز فرهت',
    timbrePiano: 'بيانو أكوستيك',
    timbreViolin: 'كمان منفرد',
    timbreSantur: 'سنطور إيراني',
    timbreTambal: 'تسمبال روماني',
    timbreSetar: 'سيتار إيراني',
    timbreBouzouki: 'بوزوق يوناني',
    timbreNey: 'ناي',
    timbreCaval: 'كفال كارباتي',
    adminSubtleLink: 'إدارة EnamiX',
    adminTitle: 'لوحة التحكم وإدارة استوديو إيناميكس',
    themeCustomizer: 'تخصيص الثيم اللوني العام',
    languageSelect: 'لغات مسار الهجرة',
    statusReady: 'جاهز للعزف • يرجى اختيار النظام والمقام',
    referenceFreq: 'التردد المرجعي القياسي: A4 = 440.0Hz',
    readMore: 'قراءة المقال كاملاً',
    audioPlayerTitle: 'الملف الصوتي المرفق بالبحث',
    videoEmbedTitle: 'فيديو يوتيوب توضيحي',
    backToArticles: 'العودة للمقالات',
    searchArticles: 'بحث في المقالات...',
    filterAllCategories: 'جميع التصنيفات',
    allRightsReserved: 'جميع الحقوق محفوظة لاستوديو إيناميكس.'
  },
  en: {
    appTitle: 'PardehNegar',
    appSubtitle: 'Unified Acoustic Mapping of Piano, Violin Fingerboard & Persian Radif',
    authorLabel: 'Author & Designer',
    publisherLabel: 'EnamiX Studio',
    advisorLabel: 'Senior Advisor',
    treatiseButton: 'Scholarly Treatise & PDFs',
    exportPng: 'Export Poster (PNG)',
    fullscreen: 'Fullscreen',
    systemPlaceholder: 'Please select a musical system (Persian or Western)',
    scalePlaceholder: 'Please select a Dastgah/Avaz or Scale',
    persianSystem: 'Persian Radif System (12 Dastgahs & Avazes)',
    classicalSystem: 'Western Diatonic System (Major & Minor Scales)',
    tabKeysAndFingerboard: '🎹 51 Keys & Violin Fingerboard',
    tabDaramads: '🎶 Daramads & Repertoire Gallery',
    tabCircleOfFifths: '⚙️ Circle of Fifths & Diatonic Engineering',
    tabRhythmEngine: '🥁 Rhythm Generator & Studio DAW Metronome',
    tabContinuumMap: '🗺️ Eurasian Acoustic Continuum: Iran to Danube (21:9)',
    tabTheoryGuide: '📖 Comprehensive Theory & Encyclopedia',
    tabBlog: '📰 Research Articles & Blog',
    playScale: 'Play Full Scale',
    stopScale: 'Stop Scale',
    playMotif: 'Audition Daramad',
    stopMotif: 'Stop Daramad',
    centsGuideBtn: '🔬 Cents Calibration & Treatise Alignment',
    centsGuideTitle: 'Accurate Cents Deviation & Farhat’s 5 Neutral Intervals',
    timbrePiano: 'Acoustic Piano',
    timbreViolin: 'Solo Violin',
    timbreSantur: 'Persian Santur',
    timbreTambal: 'Romanian Țambal',
    timbreSetar: 'Persian Setar',
    timbreBouzouki: 'Greek Bouzouki',
    timbreNey: 'Persian Ney',
    timbreCaval: 'Carpathian Caval',
    adminSubtleLink: 'EnamiX Admin',
    adminTitle: 'EnamiX Studio Secret Configuration & Admin Panel',
    themeCustomizer: 'Global Palette & Color Engineering',
    languageSelect: 'Migration Route Languages',
    statusReady: 'Ready to play • Please select a musical system and scale',
    referenceFreq: 'Standard Reference Frequency: A4 = 440.0Hz',
    readMore: 'Read Full Article',
    audioPlayerTitle: 'Attached Scholarly Audio Recording',
    videoEmbedTitle: 'Attached YouTube Demonstration Video',
    backToArticles: 'Back to Articles',
    searchArticles: 'Search articles...',
    filterAllCategories: 'All Categories',
    allRightsReserved: 'All rights reserved by Author & EnamiX Studio.'
  }
};
