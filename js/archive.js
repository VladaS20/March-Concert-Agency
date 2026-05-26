(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Счётчик карточек ── */
    var cards = document.querySelectorAll(".archive-card");
    var countEl = document.querySelector(".archive-hero__count span");
    if (countEl) countEl.textContent = cards.length;

    /* ── Пустое состояние ── */
    var emptyEl = document.querySelector(".archive-empty");
    if (emptyEl && cards.length === 0) {
      emptyEl.classList.add("archive-empty--visible");
    }

    /* ── Анимация карточек при появлении ── */
    /*
     * ВНИМАНИЕ: Базовая анимация секций (section--hidden/visible)
     * уже есть в main.js через IntersectionObserver.
     * Здесь добавляем только stagger-эффект для карточек архива —
     * каждая карточка появляется с небольшой задержкой.
     */
    if ("IntersectionObserver" in window) {
      var cardObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var card = entry.target;
              var index = parseInt(card.dataset.index || 0);
              setTimeout(function () {
                card.classList.add("archive-card--visible");
              }, index * 80);
              cardObserver.unobserve(card);
            }
          });
        },
        { threshold: 0.05 },
      );

      cards.forEach(function (card, i) {
        card.dataset.index = i;
        card.classList.add("archive-card--hidden");
        cardObserver.observe(card);
      });
    }
  });
})();
