(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var activeFilters = { city: null, month: null, event: null, venue: null };
    var allCards = document.querySelectorAll(".event-card");
    var filterTypes = ["city", "month", "event", "venue"];

    /* ── Открытие/закрытие дропдауна ── */
    document.querySelectorAll(".events-filter__btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var filter = btn.closest(".events-filter");
        var isOpen = filter.classList.contains("events-filter--open");
        closeAllDropdowns();
        if (!isOpen) filter.classList.add("events-filter--open");
      });
    });

    document.addEventListener("click", closeAllDropdowns);

    function closeAllDropdowns() {
      document.querySelectorAll(".events-filter").forEach(function (f) {
        f.classList.remove("events-filter--open");
      });
    }

    /* ── Выбор опции ── */
    document
      .querySelectorAll(".events-filter__option")
      .forEach(function (option) {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          var filter = option.closest(".events-filter");
          var filterType = filter.dataset.filter;
          var value = option.dataset.value;

          filter
            .querySelectorAll(".events-filter__option")
            .forEach(function (o) {
              o.classList.remove("events-filter__option--active");
            });

          if (activeFilters[filterType] === value) {
            activeFilters[filterType] = null;
            filter.classList.remove("events-filter--active");
            resetBtnLabel(filter);
          } else {
            option.classList.add("events-filter__option--active");
            activeFilters[filterType] = value;
            filter.classList.add("events-filter--active");
            updateBtnLabel(filter, option.textContent.trim());
          }

          filter.classList.remove("events-filter--open");
          applyFilters();
        });
      });

    function updateBtnLabel(filter, text) {
      var btn = filter.querySelector(".events-filter__btn");
      var textNode = btn.childNodes[0];
      if (textNode) textNode.textContent = text + " ";
    }

    function resetBtnLabel(filter) {
      var btn = filter.querySelector(".events-filter__btn");
      var label = (filter.dataset.label || filter.dataset.filter).toUpperCase();
      var textNode = btn.childNodes[0];
      if (textNode) textNode.textContent = label + " ";
    }

    /* ── Применить фильтры ── */
    function applyFilters() {
      var visibleCount = 0;

      allCards.forEach(function (card) {
        var show =
          (!activeFilters.city || card.dataset.city === activeFilters.city) &&
          (!activeFilters.month ||
            card.dataset.month === activeFilters.month) &&
          (!activeFilters.event ||
            card.dataset.event === activeFilters.event) &&
          (!activeFilters.venue || card.dataset.venue === activeFilters.venue);

        card.dataset.hidden = show ? "false" : "true";
        if (show) visibleCount++;
      });

      updateCount(visibleCount);
      toggleEmpty(visibleCount === 0);
      toggleClearBtn();
      updateFilterOptions();
    }

    /* ── Каскадное обновление опций фильтров ── */
    function updateFilterOptions() {
      filterTypes.forEach(function (currentType) {
        var availableValues = [];

        allCards.forEach(function (card) {
          var otherFiltersMatch = filterTypes.every(function (type) {
            if (type === currentType) return true;
            return (
              !activeFilters[type] || card.dataset[type] === activeFilters[type]
            );
          });

          if (otherFiltersMatch) {
            var val = card.dataset[currentType];
            if (val && availableValues.indexOf(val) === -1) {
              availableValues.push(val);
            }
          }
        });

        var filter = document.querySelector(
          '.events-filter[data-filter="' + currentType + '"]',
        );
        if (!filter) return;

        filter
          .querySelectorAll(".events-filter__option")
          .forEach(function (option) {
            var val = option.dataset.value;
            var isAvailable = availableValues.indexOf(val) !== -1;
            var isActive = activeFilters[currentType] === val;

            option.style.opacity = isAvailable ? "1" : "0.3";
            option.classList.toggle(
              "events-filter__option--disabled",
              !isAvailable,
            );

            if (isActive && !isAvailable) {
              option.classList.remove("events-filter__option--active");
              activeFilters[currentType] = null;
              filter.classList.remove("events-filter--active");
              resetBtnLabel(filter);
            }
          });
      });
    }

    /* ── Счётчик ── */
    function updateCount(count) {
      var el = document.querySelector(".events-list__count span");
      if (el) el.textContent = count;
    }

    /* ── Пустое состояние ── */
    function toggleEmpty(isEmpty) {
      var el = document.querySelector(".events-list__empty");
      if (el) el.classList.toggle("events-list__empty--visible", isEmpty);
    }

    /* ── Кнопка очистки ── */
    var clearAllBtn = document.querySelector(".events-filters__clear-all");

    function toggleClearBtn() {
      if (!clearAllBtn) return;
      var hasActive = filterTypes.some(function (type) {
        return activeFilters[type] !== null;
      });
      clearAllBtn.style.display = hasActive ? "inline-flex" : "none";
    }

    if (clearAllBtn) {
      clearAllBtn.style.display = "none";
      clearAllBtn.addEventListener("click", function () {
        activeFilters = { city: null, month: null, event: null, venue: null };
        document
          .querySelectorAll(".events-filter__option")
          .forEach(function (o) {
            o.classList.remove("events-filter__option--active");
            o.style.opacity = "1";
            // o.style.pointerEvents = "auto";
          });
        document.querySelectorAll(".events-filter").forEach(function (filter) {
          filter.classList.remove("events-filter--active");
          resetBtnLabel(filter);
        });
        applyFilters();
      });
    }

    /* ── Инициализация ── */
    updateCount(allCards.length);
    updateFilterOptions();
  });
})();
