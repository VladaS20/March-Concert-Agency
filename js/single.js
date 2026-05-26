(function () {
  'use strict';

  /* ── Синхронизация мета-данных hero из city-card ── */
  window.updateHeroMeta = function (city) {
    var cityCard = document.querySelector('.city-card[data-city="' + city + '"]');
    if (!cityCard) return;

    var values = cityCard.querySelectorAll('.city-card__value');
    var dateEl = cityCard.querySelector('.city-card__date');

    var cityName = values[0] ? values[0].textContent.trim() : '';
    var venue = values[1] ? values[1].textContent.trim() : '';
    var dayTime = values[2] ? values[2].textContent.trim() : '';
    var date = dateEl ? dateEl.textContent.trim() : '';

    var metaItems = document.querySelectorAll('.event-hero__meta-item');
    if (metaItems[1]) metaItems[1].querySelector('.event-hero__meta-value').textContent = cityName;
    if (metaItems[2]) metaItems[2].querySelector('.event-hero__meta-value').textContent = date ? date + ', ' + dayTime : dayTime;
    if (metaItems[3]) metaItems[3].querySelector('.event-hero__meta-value').textContent = venue;
  };

  /* ── Подстановка города в hero из URL-параметра ?city= ── */
  var cityNames = {
    sochi: 'Сочи',
    gelendzhik: 'Геленджик',
    novorossiysk: 'Новороссийск',
    lugansk: 'Луганск',
    donetsk: 'Донецк',
  };

  function updateHeroCityTag(city) {
    var tag = document.getElementById('hero-city-tag');
    if (!tag) return;
    tag.textContent = cityNames[city] || '';
  }

  var urlParams = new URLSearchParams(window.location.search);
  var cityFromUrl = urlParams.get('city');
  if (cityFromUrl) updateHeroCityTag(cityFromUrl);

  document.addEventListener('DOMContentLoaded', function () {
    if (cityFromUrl) {
      window.updateHeroMeta(cityFromUrl);
    } else {
      var firstTab = document.querySelector('.city-switcher__tab');
      if (firstTab && firstTab.dataset.city) {
        window.updateHeroMeta(firstTab.dataset.city);
      }
    }

    document.querySelectorAll('.city-switcher__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        updateHeroCityTag(tab.dataset.city);
      });
    });
  });
})();
