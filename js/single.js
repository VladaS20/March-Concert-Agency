// (function () {
//   "use strict";
//   //   document.addEventListener("DOMContentLoaded", function () {
//   //     var buyBtn = document.getElementById("buy-btn");
//   //     if (!buyBtn) return;

//   //     function updateSingleBuyBtn() {
//   //       if (window.innerWidth <= 992) {
//   //         if (buyBtn.getAttribute("href")) {
//   //           buyBtn.dataset.href = buyBtn.getAttribute("href");
//   //           buyBtn.removeAttribute("href");
//   //         }
//   //       } else {
//   //         if (!buyBtn.getAttribute("href") && buyBtn.dataset.href) {
//   //           buyBtn.setAttribute("href", buyBtn.dataset.href);
//   //         }
//   //       }
//   //     }

//   //     updateSingleBuyBtn();
//   //     window.addEventListener("resize", updateSingleBuyBtn);
//   //   });
//   // При клике на свою кнопку — кликаем по кнопке Radario
//   document.getElementById("buy-btn").addEventListener("click", function (e) {
//     e.preventDefault();
//     var radarioBtn = document.querySelector('[class*="radario"]');
//     if (radarioBtn) radarioBtn.click();
//   });
// })();
