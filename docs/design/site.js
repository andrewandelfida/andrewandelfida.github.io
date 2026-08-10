/* Shared trilingual dictionary + page behaviors for the Elfida & Andrei wedding site.
   Loaded by each concept page. UK is the default (rendered inline as streaming placeholder);
   this module is the single source of truth for all three languages and the switch behavior. */
(function () {
  var DICT = {
    uk: {
      langName: "Українська",
      eyebrow_families: "Разом зі своїми родинами",
      name_groom: "АНДРІЙ",
      connector: "та",
      name_bride: "ЕЛЬФІДА",
      hero_invite: "запрошують вас розділити радість свого весілля",
      date_full: "СУБОТА · 3 ЖОВТНЯ 2026",
      date_short: "3 ЖОВТНЯ 2026",
      month_year: "ЖОВТНЯ 2026",
      weekday: "СУБОТА",
      time_lead: "О 11:00",
      scroll_hint: "Гортайте вниз",
      verse_ref: "ЕКЛЕЗІЯСТ 4:9",
      verse_text: "Двом краще, ніж одному, бо мають хорошу нагороду за свою працю. Бо коли впадуть, то один підійме свого товариша.",
      story_kicker: "Наша історія",
      story_head: "Дорога, що привела нас сюди",
      story_body: "Ми зустрілися, молилися і зрозуміли, що Бог веде нас разом. Третього жовтня ми починаємо спільне життя перед Богом і людьми, яких любимо — і для нас буде честю, якщо ви будете поруч.",
      gallery_head: "Миті разом",
      gallery_sub: "Світлини з’являться після нашої фотосесії",
      schedule_head: "Розклад дня",
      schedule_sub: "Обидві частини — у Biserica „Harul”",
      sch1_time: "11:00",
      sch1_title: "Вінчання",
      sch1_venue: "Biserica „Harul”",
      sch1_note: "Урочиста церемонія в церкві",
      sch2_time: "13:00",
      sch2_title: "Святковий обід",
      sch2_venue: "у залі церкви",
      sch2_note: "Спільна трапеза та спілкування",
      loc_head: "Як дістатися",
      loc_venue: "Biserica „Harul”",
      loc_addr1: "с. Станівці (Stănești)",
      loc_addr2: "Чернівецька обл., 60432, Україна",
      loc_coords_label: "Координати",
      loc_dir_btn: "Прокласти маршрут",
      loc_maps_btn: "Відкрити в Google Maps",
      loc_copy_btn: "Копіювати координати",
      loc_copy_done: "Скопійовано ✓",
      loc_signal_note: "Ст榀нівці — село; на місці зв’язок може бути слабким. Збережіть адресу й координати заздалегідь.",
      info_head: "Корисна інформація",
      info_dress_t: "Дрес-код",
      info_dress_b: "Святковий стиль у природних, приглушених тонах. Оливкові, кремові та землисті відтінки будуть дуже доречні.",
      info_park_t: "Паркування",
      info_park_b: "Безкоштовне паркування біля церкви. Радимо приїхати за 20 хвилин до початку.",
      info_stay_t: "Проживання",
      info_stay_b: "Кілька варіантів ночівлі є в Чернівцях. Напишіть нам — і ми поділимося порадами.",
      rsvp_head: "Підтвердіть участь",
      rsvp_sub: "Будь ласка, дайте відповідь",
      rsvp_deadline: "до 19 вересня 2026",
      rsvp_name: "Ваше ім’я",
      rsvp_name_ph: "Ім’я та прізвище",
      rsvp_attend_q: "Чи будете ви з нами?",
      rsvp_yes: "Так, буду",
      rsvp_no: "На жаль, ні",
      rsvp_guests: "Кількість гостей",
      rsvp_diet: "Побажання щодо харчування",
      rsvp_diet_ph: "Алергії, вегетаріанство тощо",
      rsvp_send: "Надіслати відповідь",
      rsvp_thanks: "Дякуємо! Ми отримали вашу відповідь.",
      footer_names: "Андрій та Ельфіда",
      footer_date: "3 жовтня 2026 · Станівці",
      footer_verse: "Двом краще, ніж одному"
    },
    ro: {
      langName: "Română",
      eyebrow_families: "Împreună cu familiile noastre",
      name_groom: "ANDREI",
      connector: "și",
      name_bride: "ELFIDA",
      hero_invite: "vă invită să împărtășiți bucuria nunții noastre",
      date_full: "SÂMBĂTĂ · 3 OCTOMBRIE 2026",
      date_short: "3 OCTOMBRIE 2026",
      month_year: "OCTOMBRIE 2026",
      weekday: "SÂMBĂTĂ",
      time_lead: "ORA 11:00",
      scroll_hint: "Derulați în jos",
      verse_ref: "ECLESIASTUL 4:9",
      verse_text: "Mai bine doi decât unul, căci iau o plată cu atât mai bună pentru munca lor. Căci, dacă se întâmplă să cadă, se ridică unul pe altul.",
      story_kicker: "Povestea noastră",
      story_head: "Drumul care ne-a adus aici",
      story_body: "Ne-am întâlnit, ne-am rugat și am înțeles că Dumnezeu ne poartă împreună. Pe 3 octombrie începem viața împreună înaintea lui Dumnezeu și a celor pe care îi iubim — și ar fi o cinste să fiți alături de noi.",
      gallery_head: "Clipe împreună",
      gallery_sub: "Fotografiile vor apărea după ședința foto",
      schedule_head: "Programul zilei",
      schedule_sub: "Ambele părți — la Biserica „Harul”",
      sch1_time: "11:00",
      sch1_title: "Cununia",
      sch1_venue: "Biserica „Harul”",
      sch1_note: "Ceremonia solemnă în biserică",
      sch2_time: "13:00",
      sch2_title: "Recepția",
      sch2_venue: "la sala bisericii",
      sch2_note: "Masa festivă și părtășie",
      loc_head: "Locația",
      loc_venue: "Biserica „Harul”",
      loc_addr1: "s. Stănești (Станівці)",
      loc_addr2: "jud. Cernăuți, 60432, Ucraina",
      loc_coords_label: "Coordonate",
      loc_dir_btn: "Obține direcții",
      loc_maps_btn: "Deschide în Google Maps",
      loc_copy_btn: "Copiază coordonatele",
      loc_copy_done: "Copiat ✓",
      loc_signal_note: "Stănești este un sat; semnalul poate fi slab la sosire. Salvați din timp adresa și coordonatele.",
      info_head: "Informații utile",
      info_dress_t: "Ținuta",
      info_dress_b: "Ținută festivă în tonuri naturale, discrete. Nuanțele de oliv, crem și pământ se potrivesc de minune.",
      info_park_t: "Parcare",
      info_park_b: "Parcare gratuită lângă biserică. Vă recomandăm să ajungeți cu 20 de minute mai devreme.",
      info_stay_t: "Cazare",
      info_stay_b: "Există câteva opțiuni de cazare în Cernăuți. Scrieți-ne și vă vom împărtăși recomandări.",
      rsvp_head: "Confirmați prezența",
      rsvp_sub: "Vă rugăm să ne dați de știre",
      rsvp_deadline: "până pe 19 septembrie 2026",
      rsvp_name: "Numele dumneavoastră",
      rsvp_name_ph: "Nume și prenume",
      rsvp_attend_q: "Veți fi alături de noi?",
      rsvp_yes: "Da, particip",
      rsvp_no: "Din păcate, nu",
      rsvp_guests: "Număr de invitați",
      rsvp_diet: "Preferințe alimentare",
      rsvp_diet_ph: "Alergii, vegetarian etc.",
      rsvp_send: "Trimite răspunsul",
      rsvp_thanks: "Mulțumim! Am primit răspunsul dumneavoastră.",
      footer_names: "Andrei și Elfida",
      footer_date: "3 octombrie 2026 · Stănești",
      footer_verse: "Mai bine doi decât unul"
    },
    en: {
      langName: "English",
      eyebrow_families: "Together with our families",
      name_groom: "ANDREW",
      connector: "&",
      name_bride: "ELFIDA",
      hero_invite: "invite you to share the joy of our wedding day",
      date_full: "SATURDAY · 3 OCTOBER 2026",
      date_short: "3 OCTOBER 2026",
      month_year: "OCTOBER 2026",
      weekday: "SATURDAY",
      time_lead: "AT 11:00",
      scroll_hint: "Scroll down",
      verse_ref: "ECCLESIASTES 4:9",
      verse_text: "Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up the other.",
      story_kicker: "Our story",
      story_head: "The road that brought us here",
      story_body: "We met, we prayed, and we knew that God was drawing us together. On the third of October we begin our life as one, before God and the people we love — and it would be an honour to have you beside us.",
      gallery_head: "Moments together",
      gallery_sub: "Photographs will appear after our shoot",
      schedule_head: "The day",
      schedule_sub: "Both parts — at Biserica „Harul”",
      sch1_time: "11:00",
      sch1_title: "Ceremony",
      sch1_venue: "Biserica „Harul”",
      sch1_note: "The wedding service at the church",
      sch2_time: "13:00",
      sch2_title: "Reception",
      sch2_venue: "at the church hall",
      sch2_note: "A festive meal and fellowship",
      loc_head: "Getting there",
      loc_venue: "Biserica „Harul”",
      loc_addr1: "Stănești village (Станівці)",
      loc_addr2: "Chernivtsi region, 60432, Ukraine",
      loc_coords_label: "Coordinates",
      loc_dir_btn: "Get directions",
      loc_maps_btn: "Open in Google Maps",
      loc_copy_btn: "Copy coordinates",
      loc_copy_done: "Copied ✓",
      loc_signal_note: "Stănești is a rural village; signal may be weak on arrival. Save the address and coordinates ahead of time.",
      info_head: "Good to know",
      info_dress_t: "Dress code",
      info_dress_b: "Formal attire in natural, muted tones. Olive, cream and earthy shades will feel right at home.",
      info_park_t: "Parking",
      info_park_b: "Free parking beside the church. We suggest arriving about 20 minutes early.",
      info_stay_t: "Accommodation",
      info_stay_b: "There are a few places to stay in nearby Chernivtsi. Write to us and we will gladly share suggestions.",
      rsvp_head: "RSVP",
      rsvp_sub: "Please let us know",
      rsvp_deadline: "by 19 September 2026",
      rsvp_name: "Your name",
      rsvp_name_ph: "First and last name",
      rsvp_attend_q: "Will you be with us?",
      rsvp_yes: "Yes, I’ll be there",
      rsvp_no: "Sadly, no",
      rsvp_guests: "Number of guests",
      rsvp_diet: "Dietary notes",
      rsvp_diet_ph: "Allergies, vegetarian, etc.",
      rsvp_send: "Send RSVP",
      rsvp_thanks: "Thank you! We’ve received your reply.",
      footer_names: "Andrew & Elfida",
      footer_date: "3 October 2026 · Stănești",
      footer_verse: "Two are better than one"
    }
  };
  // fix a stray char that could sneak in
  DICT.uk.loc_signal_note = "Станівці — село; на місці зв’язок може бути слабким. Збережіть адресу й координати заздалегідь.";

  var COORDS = "48.0850197, 26.0520467";
  var LANG_TAG = { uk: "uk", ro: "ro", en: "en" };

  function applyLang(lang, root) {
    root = root || document;
    var d = DICT[lang] || DICT.uk;
    document.documentElement.lang = LANG_TAG[lang] || "uk";
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (d[k] != null) el.textContent = d[k];
    });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-ph");
      if (d[k] != null) el.setAttribute("placeholder", d[k]);
    });
    root.querySelectorAll("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.style.opacity = on ? "1" : "0.5";
      b.style.fontWeight = on ? "600" : "400";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("wed_lang", lang); } catch (e) {}
  }

  function wire(root) {
    root = root || document;
    var saved = "uk";
    try { saved = localStorage.getItem("wed_lang") || "uk"; } catch (e) {}
    if (!DICT[saved]) saved = "uk";

    root.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang"), root); });
    });

    root.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var lang = document.documentElement.lang || "uk";
        var doneTxt = (DICT[lang] || DICT.uk).loc_copy_done;
        var label = b.querySelector("[data-i18n]");
        var prev = label ? label.textContent : b.textContent;
        function done() {
          if (label) label.textContent = doneTxt; else b.textContent = doneTxt;
          setTimeout(function () { if (label) label.textContent = prev; else b.textContent = prev; }, 1800);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(COORDS).then(done, done);
        } else { done(); }
      });
    });

    root.querySelectorAll("form[data-rsvp]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var lang = document.documentElement.lang || "uk";
        var msg = f.querySelector("[data-rsvp-thanks]");
        if (msg) { msg.textContent = (DICT[lang] || DICT.uk).rsvp_thanks; msg.style.display = "block"; }
        var fields = f.querySelector("[data-rsvp-fields]");
        if (fields) fields.style.opacity = "0.45";
      });
    });

    // attending yes/no segmented toggle
    root.querySelectorAll("[data-attend-group]").forEach(function (g) {
      var hidden = g.querySelector("input[type=hidden]");
      g.querySelectorAll("[data-attend]").forEach(function (b) {
        b.addEventListener("click", function () {
          g.querySelectorAll("[data-attend]").forEach(function (o) {
            var on = o === b;
            o.style.background = on ? "#4E5539" : "transparent";
            o.style.color = on ? "#F7F3E9" : "#4E5539";
            o.setAttribute("aria-pressed", on ? "true" : "false");
          });
          if (hidden) hidden.value = b.getAttribute("data-attend");
        });
      });
    });

    // reveal-on-scroll, reduced-motion safe. Only hide once JS confirms it can reveal.
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = root.querySelectorAll("[data-reveal]");
    if (!reduce && "IntersectionObserver" in window) {
      items.forEach(function (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
        el.style.transition = "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)";
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.style.opacity = "1";
            en.target.style.transform = "none";
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      items.forEach(function (el) { io.observe(el); });
    }

    applyLang(saved, root);
  }

  window.WEDDING = { dict: DICT, coords: COORDS, applyLang: applyLang, init: wire };
})();
