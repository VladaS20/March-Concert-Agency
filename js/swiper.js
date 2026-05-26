(function () {
  "use strict";

  /* ── Слайдер афиши ── */
  var programSwiper = new Swiper(".program-swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      prevEl: ".program-swiper__btn--prev",
      nextEl: ".program-swiper__btn--next",
    },
    pagination: {
      el: ".program-swiper__pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 12 },
      576: { slidesPerView: 2, spaceBetween: 16 },
      992: { slidesPerView: 3, spaceBetween: 20 },
    },
  });
})();
