/* Chạy các khung srcdoc (hiệu ứng nền, dải icon) của slide Phần 1 ngay trong Shadow DOM, không dùng iframe. */
(function () {
  'use strict';
  function run(host) {
    if (host._done) return; host._done = true;
    var src = host.getAttribute('data-srcdoc') || '';
    var doc = new DOMParser().parseFromString(src, 'text/html');
    var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n');
    (css.match(/@font-face\s*\{[^}]*\}/g) || []).forEach(function (f) {
      var st = document.createElement('style'); st.textContent = f; document.head.appendChild(st);
    });
    css = css.replace(/(^|[\s,{}])(html|body)(?![-\w])/g, '$1.sbody');
    var codes = Array.prototype.map.call(doc.querySelectorAll('script'), function (s) { var c = s.textContent; s.remove(); return c; });
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + css + '\n:host{display:block}.sbody{position:absolute;inset:0;margin:0}</style><div class="sbody">' + doc.body.innerHTML + '</div>';
    var fakeDoc = {
      getElementById: function (id) { return root.getElementById(id); },
      querySelector: function (q) { return root.querySelector(q); },
      querySelectorAll: function (q) { return root.querySelectorAll(q); }
    };
    var w = host.offsetWidth || parseFloat(host.style.width) || 1920, h = host.offsetHeight || parseFloat(host.style.height) || 1080;
    codes.forEach(function (code) {
      try { new Function('document', 'innerWidth', 'innerHeight', 'addEventListener', code)(fakeDoc, w, h, function () {}); }
      catch (e) { if (window.console) console.warn('p1inline', e); }
    });
  }
  function scan() {
    document.querySelectorAll('.px-host').forEach(function (h) {
      var r = h.shadowRoot; if (!r) return;
      r.querySelectorAll('.sdoc').forEach(run);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(scan, 0); });
  else setTimeout(scan, 0);
  window.addEventListener('load', scan);
})();
/* Video trong Shadow DOM: đổi data: sang blob (Safari không phát mp4 từ data URI), phát khi slide hiện */
(function () {
  function vids() {
    var out = [];
    document.querySelectorAll('.px-host').forEach(function (h) {
      if (h.shadowRoot) h.shadowRoot.querySelectorAll('video').forEach(function (v) { out.push([h, v]); });
    });
    return out;
  }
  function prep(v) {
    if (v._prep) return; v._prep = true;
    v.muted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.loop = true;
    var src = v.getAttribute('src') || '';
    if (src.indexOf('data:') === 0) {
      try {
        var i = src.indexOf(','), meta = src.slice(5, i), b64 = src.slice(i + 1);
        var bin = atob(b64), n = bin.length, u8 = new Uint8Array(n);
        for (var k = 0; k < n; k++) u8[k] = bin.charCodeAt(k);
        v.src = URL.createObjectURL(new Blob([u8], { type: meta.split(';')[0] || 'video/mp4' }));
      } catch (e) {}
    }
  }
  function sync() {
    vids().forEach(function (p) {
      var h = p[0], v = p[1], sl = h.closest('.slide'); prep(v);
      var on = !sl || sl.classList.contains('active');
      if (on) { var r = v.play(); if (r && r.catch) r.catch(function () {}); } else v.pause();
    });
  }
  function start() {
    sync();
    var mo = new MutationObserver(sync);
    document.querySelectorAll('.slide').forEach(function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 50); });
  else setTimeout(start, 50);
})();
