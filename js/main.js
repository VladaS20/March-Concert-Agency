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

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Переключатель городов ── */
    var cityTabs = document.querySelectorAll(".city-switcher__tab");
    var cityCards = document.querySelectorAll(".city-card");

    // function updateBuyBtnForCity(city) {
    //   var cityCard = document.querySelector(
    //     '.city-card[data-city="' + city + '"]',
    //   );
    //   if (!cityCard) return;

    //   var eventId = parseInt(cityCard.dataset.eventId);
    //   if (!eventId) return;

    //   // пересоздаём контейнер
    //   var container = document.getElementById("radario-btn-container");
    //   if (container) container.innerHTML = "";

    //   // создаём виджет с нужным eventId
    //   radario.Widgets.Event({
    //     params: { textBtnColor: "#FFFFFF" },
    //     standalone: false,
    //     createButton: true,
    //     eventId: eventId,
    //   });

    //   // вешаем клик на свою кнопку — она кликает по кнопке Radario
    //   var buyBtn = document.getElementById("buy-btn");
    //   if (buyBtn) {
    //     buyBtn.onclick = function (e) {
    //       e.preventDefault();
    //       var radarioBtn = document.querySelector('[class*="radario"]');
    //       if (radarioBtn) radarioBtn.click();
    //     };
    //   }
    // }

    function updateBuyBtnForCity(city) {
      var cityCard = document.querySelector(
        '.city-card[data-city="' + city + '"]',
      );
      if (!cityCard) return;

      var eventId = parseInt(cityCard.dataset.eventId);
      if (!eventId) return;

      // сохраняем текущий eventId глобально
      window._currentEventId = eventId;

      // удаляем старый скрипт виджета если есть
      var oldScript = document.getElementById("radario-event-script");
      if (oldScript) oldScript.remove();

      // очищаем контейнер
      var container = document.getElementById("radario-btn-container");
      if (container) container.innerHTML = "";

      // создаём новый скрипт динамически — это единственный способ
      // пересоздать виджет Radario без перезагрузки страницы
      var script = document.createElement("script");
      script.id = "radario-event-script";
      script.textContent =
        'radario.Widgets.Event({params:{textBtnColor:"#FFFFFF"},standalone:false,createButton:true,eventId:' +
        eventId +
        "});";
      document.body.appendChild(script);

      // вешаем клик на кнопку buy-btn
      var buyBtn = document.getElementById("buy-btn");
      if (buyBtn) {
        buyBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          setTimeout(function () {
            // ищем кнопку Radario по атрибуту data-event-id или классу
            var radarioBtns = document.querySelectorAll('[class*="radario"]');
            var radarioBtn = null;
            radarioBtns.forEach(function(b) {
              if (b.tagName === 'BUTTON' || b.tagName === 'A') {
                radarioBtn = b;
              }
            });
            if (radarioBtn) radarioBtn.click();
          }, 150);
        };
      }
    }

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

      if (typeof updateHeroMeta === "function") updateHeroMeta(city);
      updateBuyBtnForCity(city); // вызываем напрямую
    }

    window.switchCity = switchCity;

    // document.addEventListener("click", function (e) {
    //   var btn = e.target.closest(".city-card__btn");
    //   if (!btn) return;

    //   e.preventDefault();
    //   e.stopPropagation();

    //   var card = btn.closest(".city-card");
    //   if (!card) return;

    //   var eventId = parseInt(card.dataset.eventId);
    //   if (!eventId) return;

    //   if (typeof radario === "undefined" || !radario.Widgets) return;

    //   radario.Widgets.Event({
    //     params: { textBtnColor: "#FFFFFF" },
    //     standalone: false,
    //     createButton: false,
    //     eventId: eventId,
    //   });
    // });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".city-card__btn");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      var card = btn.closest(".city-card");
      if (!card) return;

      // переключаем город — это пересоздаёт виджет с нужным eventId
      if (typeof switchCity === "function") {
        switchCity(card.dataset.city);
      }

      // увеличенная задержка чтобы скрипт виджета успел выполниться
      setTimeout(function () {
        var radarioBtns = document.querySelectorAll('[class*="radario"]');
        var radarioBtn = null;
        radarioBtns.forEach(function(b) {
          if (b.tagName === 'BUTTON' || b.tagName === 'A') {
            radarioBtn = b;
          }
        });
        if (radarioBtn) radarioBtn.click();
      }, 200);
    });

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

    function updateBuyBtn() {
      var buyBtns = document.querySelectorAll(".page-nav__buy-btn");
      buyBtns.forEach(function (btn) {
        // пропускаем кнопки с Radario onclick — они управляются через updateBuyBtnForCity
        if (btn.dataset.radario === "true") return;

        if (window.innerWidth <= 992) {
          if (btn.getAttribute("href")) {
            btn.dataset.href = btn.getAttribute("href");
            btn.removeAttribute("href");
          }
        } else {
          if (!btn.getAttribute("href") && btn.dataset.href) {
            btn.setAttribute("href", btn.dataset.href);
          }
        }
      });
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

  // При клике на свою кнопку — кликаем по кнопке Radario
  // document.getElementById("buy-btn").addEventListener("click", function (e) {
  //   e.preventDefault();
  //   var radarioBtn = document.querySelector('[class*="radario"]');
  //   if (radarioBtn) radarioBtn.click();
  // });

  /* ── Обработчик кнопки buy-btn через Radario eventId ── */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("#buy-btn");
    if (!btn) return;
    if (btn.dataset.radario !== "true") return;

    e.preventDefault();
    e.stopPropagation();

    var eventId = parseInt(btn.dataset.eventId);
    if (!eventId) return;

    if (typeof radario === "undefined" || !radario.Widgets) return;

    radario.Widgets.Event({
      params: { textBtnColor: "#FFFFFF" },
      standalone: false,
      createButton: false,
      eventId: eventId,
    });
  });
})();
