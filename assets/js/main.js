/* ============================================================
   Олимп Агро — интерактив сайта
   Без бэкенда: форма собирает письмо через почту/буфер обмена.
   ============================================================ */
(function () {
  "use strict";

  var PHONE_DISPLAY = "+7 (962) 447-47-17";
  var PHONE_RAW = "+79624474717";
  var EMAIL = "maxagro2014@yandex.ru";

  /* ---------- мобильное меню ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!nav) return;
    nav.hidden = true;
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.hidden;
      nav.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // при расширении окна до десктопа — закрываем оверлей
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1120) closeNav();
    });
  } else if (nav) {
    nav.hidden = false;
  }

  /* ---------- аккордеон (FAQ, «частые запросы») ---------- */
  document.querySelectorAll(".accordion__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---------- копирование телефона ---------- */
  document.querySelectorAll("[data-copy-phone]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (!navigator.clipboard) return; // пусть работает как обычная ссылка tel:
      e.preventDefault();
      navigator.clipboard.writeText(PHONE_DISPLAY).then(function () {
        var original = el.getAttribute("data-label") || el.textContent;
        el.textContent = "Номер скопирован";
        window.setTimeout(function () { el.textContent = original; }, 1800);
      }).catch(function () {
        window.location.href = "tel:" + PHONE_RAW;
      });
    });
  });

  /* ---------- форма запроса: сборка письма ---------- */
  var form = document.querySelector("[data-request-form]");
  if (form) {
    var status = form.querySelector(".form__status");
    var subjectEl = form.querySelector("[data-mail-subject]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var lines = [];
      Array.prototype.forEach.call(form.querySelectorAll("[data-field-label]"), function (input) {
        var value = (data.get(input.name) || "").toString().trim();
        if (value) lines.push(input.getAttribute("data-field-label") + ": " + value);
      });

      var subject = subjectEl
        ? subjectEl.value.trim()
        : "Запрос запчастей — сайт Олимп Агро";
      var body =
        "Здравствуйте!\n\n" +
        lines.join("\n") +
        "\n\n—\nОтправлено с сайта ООО «Олимп Агро».\n" +
        "Телефон для связи: " + PHONE_DISPLAY;

      var mailto = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      // 1. Копируем текст запроса в буфер — на случай, если почтовый клиент не откроется
      var copied = false;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(body).then(function () { copied = true; }, function () {});
      }

      // 2. Открываем почтовый клиент
      window.location.href = mailto;

      if (status) {
        status.setAttribute("data-state", "ok");
        status.textContent =
          "Открываем почтовый клиент с готовым письмом" +
          (copied ? " (текст запроса скопирован в буфер обмена)." : ".") +
          " Если письмо не отправилось — позвоните: " + PHONE_DISPLAY +
          " или напишите в мессенджер. Фото детали удобнее приложить в мессенджере.";
      }
    });
  }

  /* ---------- ссылки в мессенджеры ---------- */
  document.querySelectorAll("[data-messenger]").forEach(function (el) {
    var kind = el.getAttribute("data-messenger");
    var text = encodeURIComponent(
      "Здравствуйте! Нужна запчасть. Марка и модель техники: … Номер детали или фото: …"
    );
    var href = "";
    if (kind === "whatsapp") {
      href = "https://wa.me/" + PHONE_RAW.replace("+", "") + "?text=" + text;
    } else if (kind === "telegram") {
      href = "https://t.me/+" + PHONE_RAW.replace("+", "") + "?text=" + text;
    }
    if (href) el.href = href;
  });

  /* ---------- год в подвале ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
