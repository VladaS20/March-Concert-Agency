(function () {
  "use strict";

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href");
    if (!id || id === "#") return;

    // пропускаем ссылки виджета radario
    if (id.indexOf("/") !== -1) return;

    try {
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {}
  });
  /* ── Horizontal scroll gallery (drag) ── */

  function initDragScroll(el) {
    if (!el) return;
    var pos = { left: 0, x: 0 };
    var isDragging = false;
    var velocity = 0;
    var lastX = 0;
    var rafId = null;

    el.addEventListener("mousedown", function (e) {
      isDragging = true;
      pos = { left: el.scrollLeft, x: e.clientX };
      lastX = e.clientX;
      velocity = 0;
      if (rafId) cancelAnimationFrame(rafId);
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      velocity = lastX - e.clientX;
      lastX = e.clientX;
      el.scrollLeft = pos.left + (pos.x - e.clientX);
    });

    document.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
      inertiaScroll();
    });

    function inertiaScroll() {
      if (Math.abs(velocity) < 0.5) return;
      velocity *= 0.92;
      el.scrollLeft += velocity;
      rafId = requestAnimationFrame(inertiaScroll);
    }

    el.addEventListener(
      "touchstart",
      function (e) {
        pos = { left: el.scrollLeft, x: e.touches[0].clientX };
        lastX = e.touches[0].clientX;
        velocity = 0;
        if (rafId) cancelAnimationFrame(rafId);
      },
      { passive: true },
    );

    el.addEventListener(
      "touchmove",
      function (e) {
        velocity = lastX - e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        el.scrollLeft = pos.left + (pos.x - e.touches[0].clientX);
      },
      { passive: true },
    );

    el.addEventListener(
      "touchend",
      function () {
        inertiaScroll();
      },
      { passive: true },
    );
  }

  function initCarouselDots(track, dotsContainer) {
    if (!track || !dotsContainer) return;
    var cards = track.querySelectorAll(".program__card");
    if (!cards.length) return;

    function getVisibleCount() {
      return Math.round(track.offsetWidth / cards[0].offsetWidth);
    }

    function getStepsCount() {
      return Math.max(1, cards.length - getVisibleCount() + 1);
    }

    function buildDots() {
      var steps = getStepsCount();
      dotsContainer.innerHTML = "";
      for (var i = 0; i < steps; i++) {
        (function (index) {
          var dot = document.createElement("button");
          dot.className =
            "carousel__dot" + (index === 0 ? " carousel__dot--active" : "");
          dot.addEventListener("click", function () {
            if (!cards[index]) return; // <- вот эта строка добавляется
            track.scrollTo({
              left: cards[index].offsetLeft - track.offsetLeft,
              behavior: "smooth",
            });
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function updateDots() {
      var scrollLeft = track.scrollLeft;
      var steps = getStepsCount();
      var activeIndex = 0;
      var minDist = Infinity;

      for (var i = 0; i < steps; i++) {
        if (!cards[i]) continue; // защита от undefined
        var cardLeft = cards[i].offsetLeft - track.offsetLeft;
        var dist = Math.abs(scrollLeft - cardLeft);
        if (dist < minDist) {
          minDist = dist;
          activeIndex = i;
        }
      }

      dotsContainer
        .querySelectorAll(".carousel__dot")
        .forEach(function (dot, i) {
          dot.classList.toggle("carousel__dot--active", i === activeIndex);
        });
    }

    buildDots();
    track.addEventListener("scroll", updateDots);
    window.addEventListener("resize", function () {
      buildDots();
      updateDots();
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    /* ── Drag scroll for gallery ── */
    initDragScroll(document.querySelector(".scroll-gallery"));
    initDragScroll(document.querySelector(".program__grid"));
    initCarouselDots(
      document.querySelector(".program__grid"),
      document.querySelector(".program__dots"),
    );
    function updateCardWidth() {
      var grid = document.querySelector(".program__grid");
      if (!grid) return;
      var cards = grid.querySelectorAll(".program__card");
      if (!cards.length) return;

      var width = window.innerWidth;
      var cardWidth;

      if (width <= 380) {
        cardWidth = 260;
      } else if (width <= 576) {
        cardWidth = 280;
      } else if (width <= 768) {
        cardWidth = 300;
        // } else if (width <= 992) {
        //   cardWidth = 360;
      } else {
        cardWidth = 340;
      }

      cards.forEach(function (card) {
        card.style.flex = "0 0 " + cardWidth + "px";
      });
    }

    updateCardWidth();
    window.addEventListener("resize", function () {
      updateCardWidth();
      // пересчитываем точки пагинации после смены размера
      initCarouselDots(
        document.querySelector(".program__grid"),
        document.querySelector(".program__dots"),
      );
    });

    /* ── Переключатель городов ── */
    var cityTabs = document.querySelectorAll(".city-switcher__tab");
    var cityCards = document.querySelectorAll(".city-card");

    function switchCity(city) {
      cityTabs.forEach(function (t) {
        t.classList.toggle(
          "city-switcher__tab--active",
          t.dataset.city === city,
        );
      });
      cityCards.forEach(function (c) {
        c.classList.toggle("city-card--active", c.dataset.city === city);
      });
      try {
        localStorage.setItem("selected_city", city);
      } catch (e) {}
    }

    cityTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        switchCity(tab.dataset.city);
      });
    });

    // Собираем доступные города из HTML динамически
    var availableCities = [];
    cityTabs.forEach(function (tab) {
      if (tab.dataset.city) availableCities.push(tab.dataset.city);
    });

    function findCity(cityName) {
      if (!cityName) return null;
      var normalized = cityName.toLowerCase().trim();
      return (
        availableCities.find(function (c) {
          return c.toLowerCase() === normalized;
        }) || null
      );
    }

    // 1. Параметр из URL
    var urlParams = new URLSearchParams(window.location.search);
    var cityFromUrl = urlParams.get("city");

    if (
      cityFromUrl &&
      document.querySelector('.city-card[data-city="' + cityFromUrl + '"]')
    ) {
      switchCity(cityFromUrl);
      try {
        localStorage.setItem("selected_city", cityFromUrl);
      } catch (e) {}

      // 2. localStorage
    } else {
      var savedCity = null;
      try {
        savedCity = localStorage.getItem("selected_city");
      } catch (e) {}

      var foundSaved = findCity(savedCity);
      if (foundSaved) {
        switchCity(foundSaved);

        // 3. IP
      } else if (
        window.location.hostname !== "127.0.0.1" &&
        window.location.hostname !== "localhost"
      ) {
        fetch("https://ipapi.co/json/")
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            var detected = findCity(data.city);
            if (detected) switchCity(detected);
          })
          .catch(function () {});
      }
    }

    // FAQ
    var faqItems = document.querySelectorAll(".faq__item");

    faqItems.forEach(function (item) {
      var summary = item.querySelector(".faq__question");
      var answer = item.querySelector(".faq__answer");

      answer.style.maxHeight = "0";
      answer.style.overflow = "hidden";
      answer.style.paddingBottom = "0";
      answer.style.transition =
        "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.5s ease";

      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = item.hasAttribute("open");

        // плавно закрыть все — сначала фиксируем текущую высоту, потом анимируем к 0
        faqItems.forEach(function (el) {
          var a = el.querySelector(".faq__answer");
          if (el.hasAttribute("open")) {
            a.style.maxHeight = a.scrollHeight + 40 + "px";
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                a.style.maxHeight = "0";
                a.style.paddingBottom = "0";
              });
            });
            el.removeAttribute("open");
          }
        });

        // открыть текущий если был закрыт
        if (!isOpen) {
          item.setAttribute("open", "");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              answer.style.maxHeight = answer.scrollHeight + 40 + "px";
              answer.style.paddingBottom = "20px";
            });
          });
        }
      });
    });
    /* ── Ticket day tabs ── */
    var tabs = document.querySelectorAll(".tickets__day-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("tickets__day-tab--active");
        });
        tab.classList.add("tickets__day-tab--active");
      });
    });

    /* ── Lazy-load t-bgimg elements (keep compat with Tilda JS) ── */
    function loadBgImages() {
      var elems = document.querySelectorAll(".t-bgimg[data-original]");
      elems.forEach(function (el) {
        var src = el.getAttribute("data-original");
        if (src) {
          // Convert CDN URLs to local img/ path
          var fname = src.split("/").pop();
          el.style.backgroundImage = "url('img/" + fname + "')";
        }
      });
    }
    loadBgImages();

    /* ── Page transition fade ── */
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.4s ease";
    requestAnimationFrame(function () {
      document.body.style.opacity = "1";
    });

    /* ── Ticketscloud widget init ── */
    if (
      typeof window.ticketscloud_url !== "undefined" &&
      document.getElementById("ticketscloud-widget")
    ) {
      // Widget will load via tcwidget.js
    }

    /* ── Simple entrance animations for sections ── */
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("section--visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      document
        .querySelectorAll("section, .artists__card, .tickets__card, .faq__item")
        .forEach(function (el) {
          el.classList.add("section--hidden");
          observer.observe(el);
        });
    }
    var buyBtn = document.getElementById("buy-btn");
    var buyBtnHref = "#afisha/0749190c0da7c0a8adcceffeaf8fcfb56b714478377da2b";

    function updateBuyBtn() {
      if (!buyBtn) return;
      if (window.innerWidth <= 992) {
        buyBtn.removeAttribute("href");
      } else {
        buyBtn.setAttribute("href", buyBtnHref);
      }
    }

    updateBuyBtn();
    window.addEventListener("resize", updateBuyBtn);
  });

  /* ── Маска телефона ── */
  var phoneInput = document.querySelector('.corporate__input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      var val = e.target.value.replace(/\D/g, "");
      if (val.length === 0) {
        e.target.value = "";
        return;
      }
      if (val[0] === "7" || val[0] === "8") val = val.slice(1);
      var result = "+7";
      if (val.length > 0) result += " (" + val.slice(0, 3);
      if (val.length >= 3) result += ") " + val.slice(3, 6);
      if (val.length >= 6) result += "-" + val.slice(6, 8);
      if (val.length >= 8) result += "-" + val.slice(8, 10);
      e.target.value = result;
    });

    phoneInput.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && e.target.value === "+7") {
        e.target.value = "";
      }
    });

    phoneInput.addEventListener("focus", function (e) {
      if (!e.target.value) e.target.value = "+7";
    });
  }

  /* ── Валидация email ── */
  var emailInput = document.querySelector('.corporate__input[name="email"]');
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      var val = emailInput.value.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (val && !isValid) {
        emailInput.style.borderColor = "#e05a5a";
      } else {
        emailInput.style.borderColor = "";
      }
    });

    emailInput.addEventListener("input", function () {
      emailInput.style.borderColor = "";
    });
  }
  document.querySelectorAll(".program__card-buy-bg").forEach(function (bg) {
    bg.addEventListener("click", function (e) {
      e.stopPropagation();
      var wrapper = bg.closest(".program__card-buy-wrapper");
      var isOpen = wrapper.classList.contains("buy--open");
      // закрыть все
      document
        .querySelectorAll(".program__card-buy-wrapper")
        .forEach(function (w) {
          w.classList.remove("buy--open");
        });
      if (!isOpen) wrapper.classList.add("buy--open");
    });
  });

  document.addEventListener("click", function () {
    document
      .querySelectorAll(".program__card-buy-wrapper")
      .forEach(function (w) {
        w.classList.remove("buy--open");
      });
  });
})();
