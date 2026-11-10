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
})();
