/* =============================================================================
   ALL COPY, IN ALL FOUR LANGUAGES.

   Keys marked [design] are ported VERBATIM from docs/design/site.js, which the
   design handoff names as the source of truth for wording. Do not "improve"
   them without asking the couple.

   Keys marked [new] did not exist in the prototype — they cover the real map
   and the accessibility affordances the prototype stubbed out. These are the
   strings most worth a native-speaker review before the invitations are
   printed.

   Keys marked [couple] are the couple's own words, supplied directly and used
   verbatim. [couple-uk], [couple-en] and [couple-de] are TRANSLATIONS of a
   [couple] string — they carry the same meaning but nobody has verified the
   wording, so they are the other thing worth a native speaker's glance.

   German was added after the other three. Its [design] keys are therefore not
   ported from the design handoff — there was nothing to port — so every German
   string is a translation and none of it is pinned by the prototype.
   ========================================================================== */

import type { Locale, Localized } from './types';

/* -----------------------------------------------------------------------------
   ⚠ SCRIPTURE — READ BEFORE EDITING

   The brief specifies Ecclesiastes 4:9 in Ohienko (uk), Cornilescu (ro) and
   WEB (en). Those three strings below are the ones the couple supplied in
   docs/design/site.js and are reproduced here EXACTLY, character for
   character. They have NOT been machine-translated, regenerated or "corrected"
   from memory, and they must not be.

   The German reading is the one exception: the brief named no German edition,
   so the wording below follows Schlachter 2000, which is the German text
   closest in shape to the three already here. It is the ONE scripture string
   on this page that did not come from the couple, and it needs checking
   against a printed copy before it is trusted — see the flag below.

   FLAG FOR THE COUPLE: these readings are close to, but not word-for-word
   identical with, the published editions named above — for example the
   Romanian here reads "se ridică unul pe altul" where Cornilescu prints
   "se scoală unul pe altul". Please check all three against your own copies of
   Ohienko / Cornilescu / WEB — and the German against Schlachter 2000 or
   whichever German edition you prefer, Luther 2017 reads differently — then
   paste in the exact wording you want printed. Whatever you paste here is what
   the site will show.
-------------------------------------------------------------------------------- */

const VERSE: Localized = {
  uk: 'Двом краще, ніж одному, бо мають хорошу нагороду за свою працю. Бо коли впадуть, то один підійме свого товариша.',
  ro: 'Mai bine doi decât unul, căci iau o plată cu atât mai bună pentru munca lor. Căci, dacă se întâmplă să cadă, se ridică unul pe altul.',
  en: 'Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up the other.',
  de: 'Zwei sind besser als einer allein, weil sie einen guten Lohn haben für ihre Mühe. Denn wenn sie fallen, so hilft der eine dem anderen auf.',
};

export interface Dictionary {
  readonly [key: string]: string;
}

const uk = {
  /* ---- meta ---------------------------------------------------------- */
  langName: 'Українська', // [design]
  langShort: 'УКР', // [new]
  lang_switch_label: 'Оберіть мову', // [new]
  doc_title: 'Андрій та Ельфіда · 3 жовтня 2026', // [new]
  meta_description:
    'Запрошення на весілля Андрія та Ельфіди — 3 жовтня 2026, Biserica „Harul”, с. Станівці, Чернівецька обл.', // [new]
  skip_link: 'Перейти до основного вмісту', // [new]

  /* ---- hero ---------------------------------------------------------- */
  eyebrow_families: 'Разом зі своїми родинами', // [design]
  name_groom: 'АНДРІЙ', // [design]
  connector: 'та', // [design]
  name_bride: 'ЕЛЬФІДА', // [design]
  hero_invite: 'запрошують вас розділити радість свого весілля', // [design]
  date_full: 'СУБОТА · 3 ЖОВТНЯ 2026', // [design]
  date_short: '3 ЖОВТНЯ 2026', // [design]
  month_year: 'ЖОВТНЯ 2026', // [design]
  weekday: 'СУБОТА', // [design]
  time_lead: 'О 11:00', // [design]
  scroll_hint: 'Гортайте вниз', // [design]
  doves_alt: 'Голуби із серцем', // [new]

  /* ---- verse --------------------------------------------------------- */
  verse_ref: 'ЕКЛЕЗІЯСТ 4:9', // [design]
  verse_text: VERSE.uk, // [design] — see the scripture note above

  /* ---- story --------------------------------------------------------- */
  story_kicker: 'Наша історія', // [design]
  story_head: 'Дорога, що привела нас сюди', // [design]
  story_body:
    'Ми молилися, і Бог дивовижним чином звів наші дороги та поблагословив нас дійти до цього дня і одружитися. Третього жовтня ми починаємо спільне життя перед Богом — і для нас буде честю, якщо ви будете поруч.', // [couple-uk]

  /* ---- gallery ------------------------------------------------------- */
  gallery_head: 'Миті разом', // [design]

  /* ---- schedule ------------------------------------------------------ */
  schedule_head: 'Розклад дня', // [design]
  schedule_sub: 'Обидві частини — у Biserica „Harul”', // [design]
  sch1_title: 'Вінчання', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'Урочиста церемонія в церкві', // [design]
  sch2_title: 'Святковий обід', // [design]
  sch2_venue: 'у залі церкви', // [design]
  sch2_note: 'Спільна трапеза та спілкування', // [design]
  rsvp_note:
    'Просимо повідомити нас до 19 вересня, якщо ви не зможете бути на весіллі.', // [couple-uk]
  rsvp_phone_lead: 'Телефонуйте або пишіть:', // [new]
  rsvp_phone_label: 'Зателефонувати за номером', // [new] — screen-reader prefix
  /* Sentence case, not the hero's АНДРІЙ / ЕЛЬФІДА: this is a name beside a
     number, not a title. */
  rsvp_name_groom: 'Андрій', // [new]
  rsvp_name_bride: 'Ельфіда', // [new]

  /* ---- location ------------------------------------------------------ */
  loc_head: 'Як дістатися', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 'с. Станівці (Stănești)', // [design]
  loc_addr2: 'Чернівецька обл., 60432, Україна', // [design]
  loc_dir_btn: 'Прокласти маршрут', // [design]
  loc_maps_btn: 'Відкрити в Google Maps', // [design]
  loc_waze_btn: 'Відкрити у Waze', // [new]
  loc_copy_btn: 'Копіювати координати', // [design]
  loc_copy_done: 'Скопійовано ✓', // [design]
  map_label: 'Мапа: Biserica „Harul”, с. Станівці', // [new]
  map_show: 'Показати мапу', // [new]
  map_loading: 'Завантаження мапи…', // [new]
  map_error: 'Мапу не вдалося завантажити. Скористайтеся кнопками для прокладання маршруту.', // [new]

  /* ---- footer -------------------------------------------------------- */
  footer_names: 'Андрій та Ельфіда', // [design]
  footer_date: '3 жовтня 2026 · Станівці', // [design]
  footer_verse: 'Двом краще, ніж одному', // [design]
} as const;

/** Every locale must define exactly the same keys as Ukrainian. */
type Keys = keyof typeof uk;
type Strings = Record<Keys, string>;

const ro: Strings = {
  langName: 'Română', // [design]
  langShort: 'ROM', // [new]
  lang_switch_label: 'Alegeți limba', // [new]
  doc_title: 'Andrei și Elfida · 3 octombrie 2026', // [new]
  meta_description:
    'Invitație la nunta lui Andrei și a Elfidei — 3 octombrie 2026, Biserica „Harul”, s. Stănești, regiunea Cernăuți.', // [new]
  skip_link: 'Sari la conținutul principal', // [new]

  eyebrow_families: 'Împreună cu familiile noastre', // [design]
  name_groom: 'ANDREI', // [design]
  connector: 'și', // [design]
  name_bride: 'ELFIDA', // [design]
  hero_invite: 'vă invită să împărtășiți bucuria nunții noastre', // [design]
  date_full: 'SÂMBĂTĂ · 3 OCTOMBRIE 2026', // [design]
  date_short: '3 OCTOMBRIE 2026', // [design]
  month_year: 'OCTOMBRIE 2026', // [design]
  weekday: 'SÂMBĂTĂ', // [design]
  time_lead: 'ORA 11:00', // [design]
  scroll_hint: 'Derulați în jos', // [design]
  doves_alt: 'Porumbei cu o inimă', // [new]

  verse_ref: 'ECLESIASTUL 4:9', // [design]
  verse_text: VERSE.ro, // [design] — see the scripture note above

  story_kicker: 'Povestea noastră', // [design]
  story_head: 'Drumul care ne-a adus aici', // [design]
  /*
   * Supplied by the couple in Romanian. The Ukrainian and English versions of
   * this key are translations of THIS text, not the other way round — if you
   * change the meaning here, change all three.
   */
  story_body:
    'Ne-am rugat, iar Dumnezeu ne-a încrucișat drumurile într-un mod minunat și ne-a binecuvântat să ajungem până aici, să ne căsătorim. Pe 3 octombrie începem viața împreună înaintea lui Dumnezeu — și ar fi o cinste să fiți alături de noi.', // [couple]

  gallery_head: 'Clipe împreună', // [design]

  schedule_head: 'Programul zilei', // [design]
  schedule_sub: 'Ambele părți — la Biserica „Harul”', // [design]
  sch1_title: 'Cununia', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'Ceremonia solemnă în biserică', // [design]
  sch2_title: 'Recepția', // [design]
  sch2_venue: 'la sala bisericii', // [design]
  sch2_note: 'Masa festivă și părtășie', // [design]
  /* Printed on the physical invitation; reproduced word for word. */
  rsvp_note:
    'Vă rugăm să ne anunțați până pe 19 septembrie dacă nu veți putea participa la nuntă.', // [couple]
  rsvp_phone_lead: 'Ne puteți suna sau scrie la:', // [new]
  rsvp_phone_label: 'Sunați la numărul', // [new] — screen-reader prefix
  rsvp_name_groom: 'Andrei', // [new]
  rsvp_name_bride: 'Elfida', // [new]

  loc_head: 'Locația', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 's. Stănești (Станівці)', // [design]
  loc_addr2: 'jud. Cernăuți, 60432, Ucraina', // [design]
  loc_dir_btn: 'Obține direcții', // [design]
  loc_maps_btn: 'Deschide în Google Maps', // [design]
  loc_waze_btn: 'Deschide în Waze', // [new]
  loc_copy_btn: 'Copiază coordonatele', // [design]
  loc_copy_done: 'Copiat ✓', // [design]
  map_label: 'Hartă: Biserica „Harul”, s. Stănești', // [new]
  map_show: 'Arată harta', // [new]
  map_loading: 'Se încarcă harta…', // [new]
  map_error: 'Harta nu a putut fi încărcată. Folosiți butoanele pentru indicații rutiere.', // [new]

  footer_names: 'Andrei și Elfida', // [design]
  footer_date: '3 octombrie 2026 · Stănești', // [design]
  footer_verse: 'Mai bine doi decât unul', // [design]
};

const en: Strings = {
  langName: 'English', // [design]
  langShort: 'ENG', // [new]
  lang_switch_label: 'Choose a language', // [new]
  doc_title: 'Andrew & Elfida · 3 October 2026', // [new]
  meta_description:
    'Wedding invitation for Andrew and Elfida — 3 October 2026, Biserica „Harul”, Stănești village, Chernivtsi region, Ukraine.', // [new]
  skip_link: 'Skip to main content', // [new]

  eyebrow_families: 'Together with our families', // [design]
  name_groom: 'ANDREW', // [design]
  connector: '&', // [design]
  name_bride: 'ELFIDA', // [design]
  hero_invite: 'invite you to share the joy of our wedding day', // [design]
  date_full: 'SATURDAY · 3 OCTOBER 2026', // [design]
  date_short: '3 OCTOBER 2026', // [design]
  month_year: 'OCTOBER 2026', // [design]
  weekday: 'SATURDAY', // [design]
  time_lead: 'AT 11:00', // [design]
  scroll_hint: 'Scroll down', // [design]
  doves_alt: 'Doves with a heart', // [new]

  verse_ref: 'ECCLESIASTES 4:9', // [design]
  verse_text: VERSE.en, // [design] — see the scripture note above

  story_kicker: 'Our story', // [design]
  story_head: 'The road that brought us here', // [design]
  story_body:
    'We prayed, and God crossed our paths in a wonderful way and blessed us to reach this day and be married. On the third of October we begin our life together before God — and it would be an honour to have you beside us.', // [couple-en]

  gallery_head: 'Moments together', // [design]

  schedule_head: 'The day', // [design]
  schedule_sub: 'Both parts — at Biserica „Harul”', // [design]
  sch1_title: 'Ceremony', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'The wedding service at the church', // [design]
  sch2_title: 'Reception', // [design]
  sch2_venue: 'at the church hall', // [design]
  sch2_note: 'A festive meal and fellowship', // [design]
  rsvp_note:
    'Please let us know by 19 September if you will not be able to join us.', // [couple-en]
  rsvp_phone_lead: 'Call or message us on:', // [new]
  rsvp_phone_label: 'Call', // [new] — screen-reader prefix
  rsvp_name_groom: 'Andrew', // [new]
  rsvp_name_bride: 'Elfida', // [new]

  loc_head: 'Getting there', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 'Stănești village (Станівці)', // [design]
  loc_addr2: 'Chernivtsi region, 60432, Ukraine', // [design]
  loc_dir_btn: 'Get directions', // [design]
  loc_maps_btn: 'Open in Google Maps', // [design]
  loc_waze_btn: 'Open in Waze', // [new]
  loc_copy_btn: 'Copy coordinates', // [design]
  loc_copy_done: 'Copied ✓', // [design]
  map_label: 'Map: Biserica „Harul”, Stănești', // [new]
  map_show: 'Show map', // [new]
  map_loading: 'Loading map…', // [new]
  map_error: 'The map could not be loaded. Use the directions buttons on this page.', // [new]

  footer_names: 'Andrew & Elfida', // [design]
  footer_date: '3 October 2026 · Stănești', // [design]
  footer_verse: 'Two are better than one', // [design]
};

/*
 * German. Added after the site shipped in the other three languages, for the
 * guests who read German more comfortably than Ukrainian, Romanian or English.
 *
 * Two conventions differ from the other locales and are deliberate:
 *   · Dates carry the ordinal point — "3. Oktober 2026", not "3 Oktober 2026".
 *   · The verse reference uses a comma — "PREDIGER 4,9" — which is how German
 *     editions cite chapter and verse. The other three use a colon because
 *     their own conventions do.
 *
 * The venue name stays "Biserica „Harul”" verbatim, quotation marks included:
 * it is a proper name on a Ukrainian church, the same in every language here,
 * and the printed invitation shows it that way too.
 *
 * Addressing is formal (Sie). The guests reading this column are the couple's
 * German-speaking relatives and church contacts, and a wedding invitation is
 * the one place where German still expects it.
 */
const de: Strings = {
  langName: 'Deutsch',
  langShort: 'DEU',
  lang_switch_label: 'Sprache wählen',
  doc_title: 'Andrei und Elfida · 3. Oktober 2026',
  meta_description:
    'Hochzeitseinladung von Andrei und Elfida — 3. Oktober 2026, Biserica „Harul”, Dorf Stănești, Region Tscherniwzi, Ukraine.',
  skip_link: 'Zum Hauptinhalt springen',

  eyebrow_families: 'Gemeinsam mit unseren Familien',
  name_groom: 'ANDREI',
  connector: 'und',
  name_bride: 'ELFIDA',
  hero_invite: 'laden Sie ein, die Freude unseres Hochzeitstages zu teilen',
  date_full: 'SAMSTAG · 3. OKTOBER 2026',
  date_short: '3. OKTOBER 2026',
  month_year: 'OKTOBER 2026',
  weekday: 'SAMSTAG',
  time_lead: 'UM 11:00 UHR',
  scroll_hint: 'Nach unten scrollen',
  doves_alt: 'Tauben mit einem Herz',

  verse_ref: 'PREDIGER 4,9',
  verse_text: VERSE.de, // see the scripture note above — this one needs checking

  story_kicker: 'Unsere Geschichte',
  story_head: 'Der Weg, der uns hierher geführt hat',
  story_body:
    'Wir haben gebetet, und Gott hat unsere Wege auf wunderbare Weise zusammengeführt und uns gesegnet, bis hierher zu kommen und zu heiraten. Am 3. Oktober beginnen wir unser gemeinsames Leben vor Gott — und es wäre uns eine Ehre, wenn Sie an unserer Seite wären.', // [couple-de]

  gallery_head: 'Gemeinsame Momente',

  schedule_head: 'Der Tagesablauf',
  schedule_sub: 'Beide Teile — in der Biserica „Harul”',
  sch1_title: 'Trauung',
  sch1_venue: 'Biserica „Harul”',
  sch1_note: 'Der Traugottesdienst in der Kirche',
  sch2_title: 'Empfang',
  sch2_venue: 'im Gemeindesaal der Kirche',
  sch2_note: 'Festessen und Gemeinschaft',
  rsvp_note:
    'Bitte geben Sie uns bis zum 19. September Bescheid, falls Sie nicht bei der Hochzeit dabei sein können.', // [couple-de]
  rsvp_phone_lead: 'Rufen Sie uns an oder schreiben Sie uns:',
  rsvp_phone_label: 'Anrufen unter', // screen-reader prefix
  rsvp_name_groom: 'Andrei',
  rsvp_name_bride: 'Elfida',

  loc_head: 'Anfahrt',
  loc_venue: 'Biserica „Harul”',
  loc_addr1: 'Dorf Stănești (Станівці)',
  loc_addr2: 'Region Tscherniwzi, 60432, Ukraine',
  loc_dir_btn: 'Route berechnen',
  loc_maps_btn: 'In Google Maps öffnen',
  loc_waze_btn: 'In Waze öffnen',
  loc_copy_btn: 'Koordinaten kopieren',
  loc_copy_done: 'Kopiert ✓',
  map_label: 'Karte: Biserica „Harul”, Stănești',
  map_show: 'Karte anzeigen',
  map_loading: 'Karte wird geladen…',
  map_error: 'Die Karte konnte nicht geladen werden. Nutzen Sie die Schaltflächen für die Route auf dieser Seite.',

  footer_names: 'Andrei und Elfida',
  footer_date: '3. Oktober 2026 · Stănești',
  footer_verse: 'Zwei sind besser als einer',
};

export const STRINGS: Record<Locale, Strings> = { uk, ro, en, de };
export type StringKey = Keys;
