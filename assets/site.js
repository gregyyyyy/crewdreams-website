// Language: German for German-language browsers, English for everyone else. The choice is remembered.
(function () {
  // The support section moved from crewdreams.com/#support to its own FAQ page
  if (location.hash === '#support') { location.replace('faq.html'); return; }
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('cd-lang'); } catch (e) { /* storage blocked */ }
  var lang = saved || ((navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en');
  setLang(lang);

  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    var title = document.querySelector('meta[name="title-' + l + '"]');
    if (title) document.title = title.content;
    var btns = document.querySelectorAll('.lang button');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-l') === l ? 'true' : 'false');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang button');
    if (!b) return;
    var l = b.getAttribute('data-l');
    setLang(l);
    try { localStorage.setItem('cd-lang', l); } catch (err) { /* storage blocked */ }
  });

  document.addEventListener('DOMContentLoaded', function () {
    setLang(root.getAttribute('data-lang'));

    // Price in the visitor's currency (store prices). Unknown country: the general wording stays.
    var p = localPrice();
    if (p) {
      var ps = document.querySelectorAll('.price');
      for (var k = 0; k < ps.length; k++) {
        ps[k].textContent = ps[k].getAttribute('lang') === 'de'
          ? p.de[0] + ' im Monat oder ' + p.de[1] + ' im Jahr'
          : p.en[0] + ' a month or ' + p.en[1] + ' a year';
      }
      var notes = document.querySelectorAll('.price-note');
      for (var n = 0; n < notes.length; n++) notes[n].style.display = 'none';
    }
    // The sleep plan in the phone scrolls through once and back: distance = what does not fit
    var sc = document.querySelector('.scroller'), plan = sc && sc.querySelector('.plan');
    function dist() { if (plan) plan.style.setProperty('--dist', Math.max(0, plan.scrollHeight - sc.clientHeight + 20) + 'px'); }
    dist(); window.addEventListener('resize', dist);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.lang button')) setTimeout(dist, 50); });
    // A few stars in the night sky (fixed positions so the page looks the same every time)
    var sky = document.querySelector('.sky');
    if (sky) {
      var pts = [[6,12],[14,40],[22,8],[31,26],[39,52],[47,14],[55,34],[63,6],[71,22],[79,46],[86,10],[93,30],[97,58],[18,64],[52,68],[68,60],[84,72],[35,80],[9,86],[60,88]];
      for (var i = 0; i < pts.length; i++) {
        var s = document.createElement('i');
        s.style.left = pts[i][0] + '%'; s.style.top = pts[i][1] + '%';
        if (i % 3 === 0) { s.style.width = s.style.height = '3px'; s.style.opacity = '.8'; }
        sky.appendChild(s);
      }
    }
  });

  // Country from the browser language (de-CH, en-US …), otherwise from the time zone.
  function localPrice() {
    var EURO = ['AT','BE','CY','DE','EE','ES','FI','FR','GR','HR','IE','IT','LT','LU','LV','MT','NL','PT','SI','SK'];
    var c = '';
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length && !c; i++) { var m = /-([A-Za-z]{2})$/.exec(langs[i] || ''); if (m) c = m[1].toUpperCase(); }
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
    if (tz === 'Europe/Zurich') c = 'CH';
    else if (!c) {
      var TZ = { 'Europe/Vienna': 'AT', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
                 'Europe/Brussels': 'BE', 'Europe/Luxembourg': 'LU', 'Europe/Lisbon': 'PT', 'Europe/Dublin': 'IE', 'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR' };
      c = TZ[tz] || (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage)$/.test(tz) ? 'US' : '');
    }
    if (c === 'CH') return { de: ['CHF 1.00', 'CHF 10.00'], en: ['CHF 1.00', 'CHF 10.00'] };
    if (EURO.indexOf(c) >= 0) return { de: ['0,99 €', '9,99 €'], en: ['€0.99', '€9.99'] };
    if (c === 'US') return { de: ['0,99 $', '9,99 $'], en: ['$0.99', '$9.99'] };
    return null;
  }
})();
