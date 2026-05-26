// (function () {
//   "use strict";
//   document.addEventListener("DOMContentLoaded", function () {
//     var buyBtn = document.getElementById("buy-btn");
//     if (!buyBtn) return;

//     function updateSingleBuyBtn() {
//       if (window.innerWidth <= 992) {
//         if (buyBtn.getAttribute("href")) {
//           buyBtn.dataset.href = buyBtn.getAttribute("href");
//           buyBtn.removeAttribute("href");
//         }
//       } else {
//         if (!buyBtn.getAttribute("href") && buyBtn.dataset.href) {
//           buyBtn.setAttribute("href", buyBtn.dataset.href);
//         }
//       }
//     }

//     updateSingleBuyBtn();
//     window.addEventListener("resize", updateSingleBuyBtn);
//   });
// })();

document.getElementById('buy-btn').addEventListener('click', function(e) {
  e.preventDefault();
  radario.Widgets.Event({
    params: { textBtnColor: '#FFFFFF' },
    standalone: false,
    createButton: false,
    eventId: 2718589
  });
});
