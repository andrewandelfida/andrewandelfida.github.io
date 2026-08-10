/* =============================================================================
   ALL COPY, IN ALL THREE LANGUAGES.

   Keys marked [design] are ported VERBATIM from docs/design/site.js, which the
   design handoff names as the source of truth for wording. Do not "improve"
   them without asking the couple.

   Keys marked [new] did not exist in the prototype — they cover the real map
   and the accessibility affordances the prototype stubbed out. These are the
   strings most worth a native-speaker review before the invitations are
   printed.
   ========================================================================== */

import type { Locale, Localized } from './types';

/* -----------------------------------------------------------------------------
   ⚠ SCRIPTURE — READ BEFORE EDITING

   The brief specifies Ecclesiastes 4:9 in Ohienko (uk), Cornilescu (ro) and
   WEB (en). The strings below are the ones the couple supplied in
   docs/design/site.js and are reproduced here EXACTLY, character for
   character. They have NOT been machine-translated, regenerated or "corrected"
   from memory, and they must not be.

   FLAG FOR THE COUPLE: these readings are close to, but not word-for-word
   identical with, the published editions named above — for example the
   Romanian here reads "se ridică unul pe altul" where Cornilescu prints
   "se scoală unul pe altul". Please check all three against your own copies of
   Ohienko / Cornilescu / WEB and paste in the exact wording you want printed.
   Whatever you paste here is what the site will show.
-------------------------------------------------------------------------------- */

const VERSE: Localized = {
  uk: 'Двом краще, ніж одному, бо мають хорошу нагороду за свою працю. Бо коли впадуть, то один підійме свого товариша.',
  ro: 'Mai bine doi decât unul, căci iau o plată cu atât mai bună pentru munca lor. Căci, dacă se întâmplă să cadă, se ridică unul pe altul.',
  en: 'Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up the other.',
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
    'Ми зустрілися, молилися і зрозуміли, що Бог веде нас разом. Третього жовтня ми починаємо спільне життя перед Богом і людьми, яких любимо — і для нас буде честю, якщо ви будете поруч.', // [design]

  /* ---- gallery ------------------------------------------------------- */
  gallery_head: 'Миті разом', // [design]
  gallery_sub: 'Світлини з’являться після нашої фотосесії', // [design]

  /* ---- schedule ------------------------------------------------------ */
  schedule_head: 'Розклад дня', // [design]
  schedule_sub: 'Обидві частини — у Biserica „Harul”', // [design]
  sch1_title: 'Вінчання', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'Урочиста церемонія в церкві', // [design]
  sch2_title: 'Святковий обід', // [design]
  sch2_venue: 'у залі церкви', // [design]
  sch2_note: 'Спільна трапеза та спілкування', // [design]

  /* ---- location ------------------------------------------------------ */
  loc_head: 'Як дістатися', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 'с. Станівці (Stănești)', // [design]
  loc_addr2: 'Чернівецька обл., 60432, Україна', // [design]
  loc_coords_label: 'Координати', // [design]
  loc_dir_btn: 'Прокласти маршрут', // [design]
  loc_maps_btn: 'Відкрити в Google Maps', // [design]
  loc_waze_btn: 'Відкрити у Waze', // [new]
  loc_copy_btn: 'Копіювати координати', // [design]
  loc_copy_done: 'Скопійовано ✓', // [design]
  loc_signal_note:
    'Станівці — село; на місці зв’язок може бути слабким. Збережіть адресу й координати заздалегідь.', // [design]
  map_label: 'Мапа: Biserica „Harul”, с. Станівці', // [new]
  map_show: 'Показати мапу', // [new]
  map_loading: 'Завантаження мапи…', // [new]
  map_error: 'Мапу не вдалося завантажити. Скористайтеся координатами та кнопками вище.', // [new]

  /* ---- practical info ------------------------------------------------ */
  info_head: 'Корисна інформація', // [design]
  info_dress_t: 'Дрес-код', // [design]
  info_dress_b:
    'Святковий стиль у природних, приглушених тонах. Оливкові, кремові та землисті відтінки будуть дуже доречні.', // [design]
  info_park_t: 'Паркування', // [design]
  info_park_b:
    'Безкоштовне паркування біля церкви. Радимо приїхати за 20 хвилин до початку.', // [design]
  info_stay_t: 'Проживання', // [design]
  info_stay_b:
    'Кілька варіантів ночівлі є в Чернівцях. Напишіть нам — і ми поділимося порадами.', // [design]

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
  story_body:
    'Ne-am întâlnit, ne-am rugat și am înțeles că Dumnezeu ne poartă împreună. Pe 3 octombrie începem viața împreună înaintea lui Dumnezeu și a celor pe care îi iubim — și ar fi o cinste să fiți alături de noi.', // [design]

  gallery_head: 'Clipe împreună', // [design]
  gallery_sub: 'Fotografiile vor apărea după ședința foto', // [design]

  schedule_head: 'Programul zilei', // [design]
  schedule_sub: 'Ambele părți — la Biserica „Harul”', // [design]
  sch1_title: 'Cununia', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'Ceremonia solemnă în biserică', // [design]
  sch2_title: 'Recepția', // [design]
  sch2_venue: 'la sala bisericii', // [design]
  sch2_note: 'Masa festivă și părtășie', // [design]

  loc_head: 'Locația', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 's. Stănești (Станівці)', // [design]
  loc_addr2: 'jud. Cernăuți, 60432, Ucraina', // [design]
  loc_coords_label: 'Coordonate', // [design]
  loc_dir_btn: 'Obține direcții', // [design]
  loc_maps_btn: 'Deschide în Google Maps', // [design]
  loc_waze_btn: 'Deschide în Waze', // [new]
  loc_copy_btn: 'Copiază coordonatele', // [design]
  loc_copy_done: 'Copiat ✓', // [design]
  loc_signal_note:
    'Stănești este un sat; semnalul poate fi slab la sosire. Salvați din timp adresa și coordonatele.', // [design]
  map_label: 'Hartă: Biserica „Harul”, s. Stănești', // [new]
  map_show: 'Arată harta', // [new]
  map_loading: 'Se încarcă harta…', // [new]
  map_error: 'Harta nu a putut fi încărcată. Folosiți coordonatele și butoanele de mai sus.', // [new]

  info_head: 'Informații utile', // [design]
  info_dress_t: 'Ținuta', // [design]
  info_dress_b:
    'Ținută festivă în tonuri naturale, discrete. Nuanțele de oliv, crem și pământ se potrivesc de minune.', // [design]
  info_park_t: 'Parcare', // [design]
  info_park_b:
    'Parcare gratuită lângă biserică. Vă recomandăm să ajungeți cu 20 de minute mai devreme.', // [design]
  info_stay_t: 'Cazare', // [design]
  info_stay_b:
    'Există câteva opțiuni de cazare în Cernăuți. Scrieți-ne și vă vom împărtăși recomandări.', // [design]

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
    'We met, we prayed, and we knew that God was drawing us together. On the third of October we begin our life as one, before God and the people we love — and it would be an honour to have you beside us.', // [design]

  gallery_head: 'Moments together', // [design]
  gallery_sub: 'Photographs will appear after our shoot', // [design]

  schedule_head: 'The day', // [design]
  schedule_sub: 'Both parts — at Biserica „Harul”', // [design]
  sch1_title: 'Ceremony', // [design]
  sch1_venue: 'Biserica „Harul”', // [design]
  sch1_note: 'The wedding service at the church', // [design]
  sch2_title: 'Reception', // [design]
  sch2_venue: 'at the church hall', // [design]
  sch2_note: 'A festive meal and fellowship', // [design]

  loc_head: 'Getting there', // [design]
  loc_venue: 'Biserica „Harul”', // [design]
  loc_addr1: 'Stănești village (Станівці)', // [design]
  loc_addr2: 'Chernivtsi region, 60432, Ukraine', // [design]
  loc_coords_label: 'Coordinates', // [design]
  loc_dir_btn: 'Get directions', // [design]
  loc_maps_btn: 'Open in Google Maps', // [design]
  loc_waze_btn: 'Open in Waze', // [new]
  loc_copy_btn: 'Copy coordinates', // [design]
  loc_copy_done: 'Copied ✓', // [design]
  loc_signal_note:
    'Stănești is a rural village; signal may be weak on arrival. Save the address and coordinates ahead of time.', // [design]
  map_label: 'Map: Biserica „Harul”, Stănești', // [new]
  map_show: 'Show map', // [new]
  map_loading: 'Loading map…', // [new]
  map_error: 'The map could not be loaded. Use the coordinates and buttons above.', // [new]

  info_head: 'Good to know', // [design]
  info_dress_t: 'Dress code', // [design]
  info_dress_b:
    'Formal attire in natural, muted tones. Olive, cream and earthy shades will feel right at home.', // [design]
  info_park_t: 'Parking', // [design]
  info_park_b: 'Free parking beside the church. We suggest arriving about 20 minutes early.', // [design]
  info_stay_t: 'Accommodation', // [design]
  info_stay_b:
    'There are a few places to stay in nearby Chernivtsi. Write to us and we will gladly share suggestions.', // [design]

  footer_names: 'Andrew & Elfida', // [design]
  footer_date: '3 October 2026 · Stănești', // [design]
  footer_verse: 'Two are better than one', // [design]
};

export const STRINGS: Record<Locale, Strings> = { uk, ro, en };
export type StringKey = Keys;
