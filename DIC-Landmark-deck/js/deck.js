/* ============================================================
   Deck engine · vanilla JS · không gọi mạng
   - Canvas 1920x1080 tự co theo cửa sổ
   - ← → Space PageUp PageDown Home End · F toàn màn hình · O lưới tổng quan
   - Hash #/n (slide, 1-based) và #/n/s (bước build)
   - Build: phần tử [data-build="k"] hiện khi bước >= k
   - Mock: <iframe data-src="..."> tải khi slide gần hiện, nhận postMessage {t:'step'|'play'|'pause'}
     iframe[data-auto="N:ms"] tự chạy vòng bước 0..N-1 cách nhau ms
   ============================================================ */
(function () {
  'use strict';
  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('#stage > .slide:not([data-off])'));
  var hud = document.getElementById('hud');
  var bar = document.getElementById('bar');
  var overview = document.getElementById('overview');
  var cur = 0, step = 0;

  /* ---------- scale ---------- */
  function vw() { return document.documentElement.clientWidth || window.innerWidth; }
  function vh() { return document.documentElement.clientHeight || window.innerHeight; }
  /* phóng to trong slide: Ctrl + cuộn chuột / chụm 2 ngón trên trackpad, phím + - 0, kéo để di chuyển */
  var base = { s: 1, l: 0, t: 0 }, Z = { z: 1, l: 0, t: 0 };
  function render() {
    var s = base.s * Z.z, l = Z.z === 1 ? base.l : Z.l, t = Z.z === 1 ? base.t : Z.t;
    stage.style.setProperty('--scale', s);
    stage.style.left = Math.round(l) + 'px'; stage.style.top = Math.round(t) + 'px';
    document.body.classList.toggle('zoomed', Z.z > 1);
  }
  function clampPan() {
    var w = 1920 * base.s * Z.z, h = 1080 * base.s * Z.z, W = vw(), H = vh();
    Z.l = Math.min(0, Math.max(W - w, Z.l)); Z.t = Math.min(0, Math.max(H - h, Z.t));
  }
  function zoomAt(nz, cx, cy) {
    nz = Math.max(1, Math.min(4, nz));
    var cl = Z.z === 1 ? base.l : Z.l, ct = Z.z === 1 ? base.t : Z.t, k = nz / Z.z;
    Z.l = cx - (cx - cl) * k; Z.t = cy - (cy - ct) * k; Z.z = nz;
    if (nz > 1) clampPan();
    render();
  }
  function resetZoom() { if (Z.z !== 1) { Z.z = 1; render(); } }
  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomAt(Z.z * Math.exp(-e.deltaY * 0.004), e.clientX, e.clientY); }
    else if (Z.z > 1) { e.preventDefault(); Z.l -= e.deltaX; Z.t -= e.deltaY; clampPan(); render(); }
  }, { passive: false });
  var drag = null, moved = false;
  stage.addEventListener('pointerdown', function (e) { if (Z.z > 1 && !e.target.closest('[contenteditable="true"], button, a')) { drag = { x: e.clientX, y: e.clientY, l: Z.l, t: Z.t }; moved = false; } });
  window.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true; Z.l = drag.l + dx; Z.t = drag.t + dy; clampPan(); render(); });
  window.addEventListener('pointerup', function () { drag = null; });
  var lastFit = '';
  function fit() {
    var w = vw(), h = vh();
    var key = w + 'x' + h;
    if (key === lastFit) return;
    lastFit = key;
    base.s = Math.min(w / 1920, h / 1080);
    base.l = (w - 1920 * base.s) / 2; base.t = (h - 1080 * base.s) / 2;
    if (Z.z > 1) clampPan();
    render();
  }
  window.addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);
  setInterval(fit, 700); fit();

  /* ---------- builds ---------- */
  /* Mặc định mỗi slide hiện trọn một lần bấm, không build từng bước.
     Muốn bấm từng bước cho slide nào thì thêm data-steps vào <section>. */
  function stepped(i) { return slides[i].hasAttribute('data-steps'); }
  function maxStep(i) {
    var m = 0;
    slides[i].querySelectorAll('[data-build]').forEach(function (el) { m = Math.max(m, +el.getAttribute('data-build') || 0); });
    slides[i].querySelectorAll('.mock').forEach(function (mk) {
      var n = mk.querySelectorAll(':scope > .panes > [data-pane]').length; if (n) m = Math.max(m, n - 1 + (+(mk.getAttribute('data-tab-offset') || 0)));
    });
    return m;
  }
  function applyBuilds() {
    var s = slides[cur];
    /* v1.2: slide Phần 1 chạy trong iframe, bước build gửi sang iframe */
    s.querySelectorAll('iframe[data-follow]').forEach(function (f) { if (f._loaded) post(f, { t: 'step', i: step }); });
    s.querySelectorAll('.mockhost').forEach(function (h) { if (window.mockStep) window.mockStep(h, step); });
    s.querySelectorAll('[data-build]').forEach(function (el) {
      var at = +el.getAttribute('data-build') || 0;
      var until = el.getAttribute('data-until');
      var on = step >= at && (until === null || step < +until);
      el.classList.toggle('on', on);
    });
    /* tab groups: [data-tab=k] and [data-pane=k] follow the current step (clamped) */
    s.querySelectorAll('.mock').forEach(function (m) {
      var tabs = m.querySelectorAll(':scope > .tabs > [data-tab]');
      var panes = m.querySelectorAll(':scope > .panes > [data-pane]');
      if (!panes.length) return;
      var k = Math.min(step, panes.length - 1);
      var off = +(m.getAttribute('data-tab-offset') || 0); /* bước bắt đầu của tab đầu tiên */
      k = Math.max(0, Math.min(panes.length - 1, step - off));
      tabs.forEach(function (t) { t.classList.toggle('on', +t.getAttribute('data-tab') === k); });
      s.querySelectorAll('.bullets li[data-tab]').forEach(function (t) { t.classList.toggle('on', +t.getAttribute('data-tab') === k); });
      panes.forEach(function (p) {
        var on = +p.getAttribute('data-pane') === k;
        p.classList.toggle('on', on);
        p.querySelectorAll('iframe').forEach(function (f) { on ? playFrame(f) : pauseFrame(f); });
      });
    });
  }

  /* ---------- iframes ---------- */
  var autoTimers = new Map();
  /* Lưu ý: mở từ file:// thì contentDocument của iframe là null (mỗi file một origin),
     nên trạng thái load phải theo dõi bằng cờ riêng, không đọc readyState. */
  function loadFrame(f) {
    if (f.getAttribute('src')) return;
    f._loaded = false; f._want = false;
    f.addEventListener('load', function () {
      f._loaded = true;
      if (f._want) sendPlay(f); else post(f, { t: 'pause' });
    });
    f.setAttribute('src', f.getAttribute('data-src'));
  }
  function post(f, msg) { try { f.contentWindow && f.contentWindow.postMessage(msg, '*'); } catch (e) {} }
  /* mock có ?step=n trong data-src thì giữ đúng bước đó, không ép về 0 */
  function sendPlay(f) { post(f, { t: 'play' }); if (!/[?&]step=/.test(f.getAttribute('data-src') || '')) post(f, { t: 'step', i: 0 }); if (f.hasAttribute('data-follow')) post(f, { t: 'step', i: step }); startAuto(f); }
  function playFrame(f) {
    loadFrame(f);
    f._want = true;
    if (f._loaded) sendPlay(f);
  }
  function pauseFrame(f) { f._want = false; if (f._loaded) post(f, { t: 'pause' }); stopAuto(f); }
  function startAuto(f) {
    stopAuto(f);
    var a = f.getAttribute('data-auto'); if (!a) return;
    var n = +a.split(':')[0], ms = +a.split(':')[1] || 4000, i = 0;
    var id = setInterval(function () { i = (i + 1) % n; post(f, { t: 'step', i: i }); }, ms);
    autoTimers.set(f, id);
  }
  function stopAuto(f) { if (autoTimers.has(f)) { clearInterval(autoTimers.get(f)); autoTimers.delete(f); } }
  /* V08: iframe[data-lazy] chỉ tải khi slide đang hiện (mock tự đo hộp bao lúc tải; tải trước khi slide còn
     display:none thì đo được 0 và tràn khung, ví dụ mock Copilot trong service). Các iframe khác vẫn tải trước. */
  function lazyOnly(f) { return f.hasAttribute('data-lazy'); }
  function preload() {
    slides.forEach(function (s, i) {
      if (Math.abs(i - cur) <= 1 && window.mockPrepare) s.querySelectorAll('.mockhost').forEach(window.mockPrepare);
      if (Math.abs(i - cur) <= 1) s.querySelectorAll('iframe[data-src]').forEach(function (f) { if (i === cur || !lazyOnly(f)) loadFrame(f); });
    });
  }
  function pauseAll(except) {
    slides.forEach(function (s, i) { if (i !== except) s.querySelectorAll('iframe[data-src]').forEach(pauseFrame); });
  }

  /* ---------- navigation ---------- */
  function apply(push) {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
    applyBuilds();
    pauseAll(cur);
    /* iframe không nằm trong pane (mock đơn) */
    slides[cur].querySelectorAll('.mock:not(:has([data-pane])) iframe[data-src], .solo iframe[data-src]').forEach(playFrame);
    preload();
    hud.textContent = (cur + 1) + ' / ' + slides.length + (stepped(cur) && maxStep(cur) ? '  ·  ' + step + '/' + maxStep(cur) : '');
    bar.style.width = ((cur + 1) / slides.length * 100) + '%';
    if (push !== false) {
      var h = '#/' + (cur + 1) + (step ? '/' + step : '');
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    if (overview.classList.contains('on')) renderOverview();
  }
  function go(i, s) {
    resetZoom();
    cur = Math.max(0, Math.min(slides.length - 1, i));
    step = stepped(cur) ? Math.max(0, Math.min(maxStep(cur), s || 0)) : maxStep(cur);
    apply();
  }
  function next() { resetZoom(); if (stepped(cur) && step < maxStep(cur)) { step++; apply(); } else if (cur < slides.length - 1) go(cur + 1, 0); }
  function prev() { resetZoom(); if (stepped(cur) && step > 0) { step--; apply(); } else if (cur > 0) go(cur - 1, maxStep(cur - 1)); }
  function parseHash() {
    var m = location.hash.match(/#\/(\d+)(?:\/(\d+))?/);
    if (m) { cur = Math.max(0, Math.min(slides.length - 1, +m[1] - 1)); step = +m[2] || 0; step = stepped(cur) ? Math.min(step, maxStep(cur)) : maxStep(cur); }
  }

  /* ---------- overview ---------- */
  function renderOverview() {
    var g = overview.querySelector('.g'); g.innerHTML = '';
    slides.forEach(function (s, i) {
      var o = document.createElement('div'); o.className = 'o' + (i === cur ? ' cur' : '');
      var type = (s.className.match(/s-[a-z]+/) || [''])[0];
      o.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + (s.hasAttribute('data-optional') ? ' · tuỳ chọn' : '') + '</b><span>' + (s.getAttribute('data-title') || '') + '</span><em>' + type + (maxStep(i) ? ' · ' + maxStep(i) + ' bước' : '') + '</em>';
      o.addEventListener('click', function () { overview.classList.remove('on'); go(i, 0); });
      g.appendChild(o);
    });
  }
  function toggleOverview() { overview.classList.toggle('on'); if (overview.classList.contains('on')) renderOverview(); }

  /* ---------- keys ---------- */
  /* Ctrl/Cmd + phím +, -, 0: phóng to trong slide thay vì phóng cả trang */
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    var k = e.key;
    if (k === '+' || k === '=') { e.preventDefault(); zoomAt(Z.z * 1.25, vw() / 2, vh() / 2); }
    else if (k === '-' || k === '_') { e.preventDefault(); zoomAt(Z.z / 1.25, vw() / 2, vh() / 2); }
    else if (k === '0') { e.preventDefault(); resetZoom(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); overview.classList.contains('on') ? null : next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
    else if (k === 'ArrowDown') { e.preventDefault(); go(cur + 1, 0); }
    else if (k === 'ArrowUp') { e.preventDefault(); go(cur - 1, 0); }
    else if (k === 'Home') { go(0, 0); }
    else if (k === 'End') { go(slides.length - 1, 0); }
    else if (k === '+' || k === '=') { e.preventDefault(); zoomAt(Z.z * 1.25, vw() / 2, vh() / 2); }
    else if (k === '-' || k === '_') { e.preventDefault(); zoomAt(Z.z / 1.25, vw() / 2, vh() / 2); }
    else if (k === '0') { resetZoom(); }
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
    else if (k === 'o' || k === 'O' || k === 'Escape') { if (k === 'Escape' && !overview.classList.contains('on')) return; toggleOverview(); }
  });
  /* click: nửa phải tiến, nửa trái lùi (trừ khi bấm vào tab) */
  stage.addEventListener('click', function (e) {
    if (e.target.closest('[data-tab]')) { var t = e.target.closest('[data-tab]'); var m = slides[cur].querySelector('.mock'); step = +t.getAttribute('data-tab') + (+((m && m.getAttribute('data-tab-offset')) || 0)); apply(); return; }
    if (e.target.closest('a, button, iframe')) return;
    if (Z.z > 1 || moved) { moved = false; return; }
    (e.clientX > window.innerWidth / 2) ? next() : prev();
  });
  window.addEventListener('hashchange', function () { parseHash(); apply(false); });
  overview.addEventListener('click', function (e) { if (e.target === overview) toggleOverview(); });

  /* ---------- start ---------- */
  parseHash();
  apply(false);
  window.deck = { go: go, next: next, prev: prev, slides: slides,
    current: function () { return slides[cur]; },
    /* dựng lại danh sách slide sau khi ẩn/hiện (all = gồm cả slide đã ẩn) */
    refresh: function (all) {
      var keep = slides[cur];
      document.querySelectorAll('#stage > .slide').forEach(function (x) { x.classList.remove('active'); });
      slides = Array.prototype.slice.call(document.querySelectorAll(all ? '#stage > .slide' : '#stage > .slide:not([data-off])'));
      window.deck.slides = slides;
      var i = slides.indexOf(keep); cur = i >= 0 ? i : Math.min(cur, slides.length - 1); step = Math.min(step, maxStep(cur));
      apply();
    } };
})();
