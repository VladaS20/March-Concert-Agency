var burger = document.getElementById("burger");
var mobileMenu = document.getElementById("mobile-menu");
var mobileMenuClose = document.getElementById("mobile-menu-close");
var mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

function openMenu() {
  mobileMenu.classList.add("mobile-menu--open");
  mobileMenuOverlay.classList.add("mobile-menu__overlay--open");
  burger.classList.add("burger--open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("mobile-menu--open");
  mobileMenuOverlay.classList.remove("mobile-menu__overlay--open");
  burger.classList.remove("burger--open");
  document.body.style.overflow = "";
}

if (burger) {
  burger.addEventListener("click", function () {
    mobileMenu.classList.contains("mobile-menu--open")
      ? closeMenu()
      : openMenu();
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", closeMenu);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeMenu();
});

document.querySelectorAll(".mobile-menu__link").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});
