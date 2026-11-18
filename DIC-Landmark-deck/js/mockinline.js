/* Mock chạy ngay trong trang (Shadow DOM) thay cho iframe, để xem được trong khung preview chặn iframe.
   Dữ liệu mock: window.MOCKS = { "mocks/app-x.html": "<html…>" } (nạp từ js/mocks-data.js). */
(function () {
  'use strict';
  var M = window.MOCKS || {};
  var fonts = {};
  if (M.__fonts) { var fst = document.createElement('style'); fst.textContent = M.__fonts; document.head.appendChild(fst); }
  function has(list, i) { return (' ' + list + ' ').indexOf(' ' + i + ' ') >= 0; }

  function build(host) {
    if (host._root) return host._root;
    var html = M[host.getAttribute('data-mock')];
    if (!html) return null;
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n');
    (css.match(/@font-face\s*\{[^}]*\}/g) || []).forEach(function (f) {
      if (fonts[f]) return; fonts[f] = 1;
      var st = document.createElement('style'); st.textContent = f; document.head.appendChild(st);
    });
    css = css.replace(/(^|[\s,{}>+~(])(html|body)(?![-\w])/g, '$1.mk-body').replace(/100vh/g, '100%').replace(/100vw/g, '100%');
    Array.prototype.forEach.call(doc.querySelectorAll('script'), function (s) { s.remove(); });
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + css +
      '\n:host{display:block;position:absolute;inset:0;overflow:hidden}' +
      '.mk-body{position:absolute;inset:0;margin:0;padding:0;background:transparent;overflow:hidden}' +
      '.wrap{position:absolute!important;inset:0;display:flex;align-items:center;justify-content:center;padding:0}</style>' +
      '<div class="mk-body">' + doc.body.innerHTML + '</div>';
    host._root = root; host._cur = -1;
    fit(host);
    show(host, host._want || 0);
    return root;
  }

  function fit(host) {
    var r = host._root; if (!r) return;
    var cv = r.querySelector('.mk-window.cv'), sc = r.querySelector('.scaler');
    var w = host.offsetWidth, h = host.offsetHeight; if (!w || !h || !cv) return;
    var s = Math.min(w / 1440, h / 880);
    cv.style.transform = 'scale(' + s + ')';
    if (sc) { sc.style.width = 1440 * s + 'px'; sc.style.height = 880 * s + 'px'; }
  }

  function show(host, i) {
    host._want = i;
    var r = host._root; if (!r) return;
    i = Math.max(0, +i || 0); if (i === host._cur) return; host._cur = i;
    r.querySelector('.mk-body').setAttribute('data-step', i);
    r.querySelectorAll('[data-s],[data-from],[data-until]').forEach(function (e) {
      var on = true, s = e.getAttribute('data-s'), f = e.getAttribute('data-from'), u = e.getAttribute('data-until');
      if (s !== null) on = has(s, i); if (f !== null) on = on && i >= +f; if (u !== null) on = on && i < +u;
      var cls = e.hasAttribute('data-fade') ? 'st-fade' : 'st-hide';
      var was = !e.classList.contains(cls); e.classList.toggle(cls, !on);
      if (on && !was) { e.classList.remove('rvx'); void e.offsetWidth; e.classList.add('rvx'); }
    });
    r.querySelectorAll('[data-hi]').forEach(function (e) { e.classList.toggle('hi', has(e.getAttribute('data-hi'), i)); });
    r.querySelectorAll('[data-hiai]').forEach(function (e) { e.classList.toggle('hi-ai', has(e.getAttribute('data-hiai'), i)); });
    r.querySelectorAll('.cursor[data-pos]').forEach(function (c) {
      var p = JSON.parse(c.getAttribute('data-pos')), k = null;
      for (var j = i; j >= 0; j--) if (p[j]) { k = p[j]; break; }
      if (k) { c.style.opacity = 1; c.style.left = k[0] + 'px'; c.style.top = k[1] + 'px'; } else c.style.opacity = 0;
    });
  }

  function mapStep(host, i) {
    var m = host.getAttribute('data-map'); if (!m) return i;
    var a = m.split(/\s+/); return +(a[Math.min(i, a.length - 1)] || 0);
  }
  window.mockStep = function (host, i) { build(host); fit(host); show(host, mapStep(host, i)); };
  window.mockPrepare = function (host) { build(host); fit(host); };
  window.addEventListener('resize', function () { document.querySelectorAll('.mockhost').forEach(fit); });
})();
