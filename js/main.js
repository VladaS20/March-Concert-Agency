/* ═══════════════════════════════════════════════════════
   Шоу КРУЧЕ — главный JS файл (БЭМ)
═══════════════════════════════════════════════════════ */

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
    } catch (err) {
      // невалидный селектор — просто пропускаем
    }
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

  // function initCarouselDots(track, dotsContainer) {
  //   if (!track || !dotsContainer) return;
  //   var cards = track.querySelectorAll(".program__card");
  //   if (!cards.length) return;

  //   dotsContainer.innerHTML = "";
  //   cards.forEach(function (_, i) {
  //     var dot = document.createElement("button");
  //     dot.className =
  //       "carousel__dot" + (i === 0 ? " carousel__dot--active" : "");
  //     dot.addEventListener("click", function () {
  //       track.scrollTo({
  //         left: cards[i].offsetLeft - track.offsetLeft,
  //         behavior: "smooth",
  //       });
  //     });
  //     dotsContainer.appendChild(dot);
  //   });

  //   track.addEventListener("scroll", function () {
  //     var center = track.scrollLeft + track.offsetWidth / 2;
  //     var activeIndex = 0;
  //     var minDist = Infinity;
  //     cards.forEach(function (card, i) {
  //       var cardCenter =
  //         card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
  //       var dist = Math.abs(center - cardCenter);
  //       if (dist < minDist) {
  //         minDist = dist;
  //         activeIndex = i;
  //       }
  //     });
  //     dotsContainer
  //       .querySelectorAll(".carousel__dot")
  //       .forEach(function (dot, i) {
  //         dot.classList.toggle("carousel__dot--active", i === activeIndex);
  //       });
  //   });
  // }
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
  });
})();
