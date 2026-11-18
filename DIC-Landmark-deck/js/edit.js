/* ============================================================
   Sửa chữ và ẩn slide ngay trên trang
   - Nút "Sửa chữ" góc dưới trái (chỉ hiện khi trang lưu được)
   - Bấm vào chữ bất kỳ để sửa; tự lưu sau khi ngừng gõ
   - Ẩn slide: slide đã ẩn bị bỏ qua khi trình chiếu, vẫn hiện trong chế độ sửa
   Dữ liệu sửa lưu ở kho dữ liệu của trang (db): edits/<slide>, meta/hidden
   ============================================================ */
(function () {
  'use strict';
  var ALLOWED = { B: 1, STRONG: 1, I: 1, EM: 1, SPAN: 1, BR: 1, SMALL: 1, MARK: 1, SUB: 1, SUP: 1 };
  var SKIP = 'svg, script, style, .mockhost, iframe, video, canvas, .sdoc, #ed-bar';
  var sections = Array.prototype.slice.call(document.querySelectorAll('#stage > .slide'));
  var reg = {};          /* key -> {el, orig, title} */
  var bySlide = new Map(); /* section -> [keys] */
  var db = null, editing = false, hidden = [], applied = {};

  function slug(t) { var h = 5381; for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return 's' + h.toString(36); }
  function hasOwnText(el) { for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false; }
  function sanitize(html) {
    var t = document.createElement('template'); t.innerHTML = String(html);
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 1) {
          if (!ALLOWED[c.tagName]) { c.replaceWith(document.createTextNode(c.textContent)); return; }
          Array.prototype.slice.call(c.attributes).forEach(function (a) { if (a.name !== 'class') c.removeAttribute(a.name); });
          walk(c);
        } else if (c.nodeType !== 3) c.remove();
      });
    })(t.content);
    var d = document.createElement('div'); d.appendChild(t.content); return d.innerHTML;
  }
  function collect(root, sec, title, list) {
    var picked = [];
    root.querySelectorAll('*').forEach(function (el) {
      if (el.closest(SKIP)) return;
      if (picked.some(function (p) { return p.contains(el); })) return;
      if (!hasOwnText(el)) return;
      picked.push(el);
    });
    picked.forEach(function (el) {
      var key = title + '|' + list.length;
      reg[key] = { el: el, orig: el.innerHTML, title: title, sec: sec };
      el.classList.add('ed-t');
      el.addEventListener('input', function () { queue(sec); });
      list.push(key);
    });
  }
  sections.forEach(function (sec) {
    var title = sec.getAttribute('data-title') || '';
    var list = [];
    collect(sec, sec, title, list);
    sec.querySelectorAll('.px-host').forEach(function (h) {
      if (!h.shadowRoot) return;
      var st = document.createElement('style');
      st.textContent = '.ed-on .ed-t:hover{outline:2px dashed rgba(255,214,102,.9);outline-offset:3px}.ed-on .ed-t:focus{outline:2px solid #FFD666;outline-offset:3px}';
      h.shadowRoot.appendChild(st);
      collect(h.shadowRoot, sec, title, list);
    });
    bySlide.set(sec, list);
  });

  /* ---------- áp dữ liệu đã lưu ---------- */
  function focusedEl() { var a = document.activeElement; while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement; return a; }
  function applyDoc(data) {
    if (!data || !data.texts) return;
    var f = focusedEl();
    Object.keys(data.texts).forEach(function (k) {
      var r = reg[k]; if (!r || r.el === f) return;
      var v = sanitize(data.texts[k]);
      if (r.el.innerHTML !== v) r.el.innerHTML = v;
      applied[k] = v;
    });
  }
  function applyHidden() {
    sections.forEach(function (s) { var off = hidden.indexOf(s.getAttribute('data-title')) >= 0; if (off) s.setAttribute('data-off', ''); else s.removeAttribute('data-off'); });
    if (window.deck && window.deck.refresh) window.deck.refresh(editing);
    renderBar();
  }

  /* ---------- lưu ---------- */
  var timers = new Map(), busy = new Map(), again = new Set();
  function queue(sec) { clearTimeout(timers.get(sec)); timers.set(sec, setTimeout(function () { save(sec); }, 800)); status('Đang gõ…'); }
  function save(sec) {
    if (!db) {
      var all = {}; try { all = JSON.parse(localStorage.getItem('deck-edits') || '{}'); } catch (e) {}
      var tx = {}; bySlide.get(sec).forEach(function (k) { var r = reg[k]; if (r.el.innerHTML !== r.orig) tx[k] = sanitize(r.el.innerHTML); });
      all[sec.getAttribute('data-title')] = tx;
      try { localStorage.setItem('deck-edits', JSON.stringify(all)); status('Đã lưu trên máy này'); } catch (e) { status('Không lưu được ở chế độ xem này'); }
      return;
    }
    if (busy.get(sec)) { again.add(sec); return; }
    var title = sec.getAttribute('data-title'), texts = {};
    bySlide.get(sec).forEach(function (k) { var r = reg[k]; if (r.el.innerHTML !== r.orig) texts[k] = sanitize(r.el.innerHTML); });
    busy.set(sec, true); status('Đang lưu…');
    db.doc('edits/' + slug(title)).set({ title: title, texts: texts, at: new Date().toISOString() })
      .then(function () { status('Đã lưu'); })
      .catch(function (e) { status('Không lưu được: ' + ((e && e.message) || 'lỗi') + '. Bạn cần quyền sửa trang.'); })
      .then(function () { busy.set(sec, false); if (again.has(sec)) { again.delete(sec); save(sec); } });
  }
  var hBusy = false;
  function saveHidden() {
    if (!db) { try { localStorage.setItem('deck-hidden', JSON.stringify(hidden)); status('Đã lưu trên máy này'); } catch (e) {} return; }
    if (hBusy) return; hBusy = true; status('Đang lưu…');
    db.doc('meta/hidden').set({ titles: hidden.slice() })
      .then(function () { status('Đã lưu'); }).catch(function () { status('Không lưu được danh sách ẩn'); })
      .then(function () { hBusy = false; });
  }

  /* ---------- thanh công cụ ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '#ed-btn{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:50;font:700 14px/1 Roboto,Arial,sans-serif;background:#fff;color:#163E92;border:0;border-radius:999px;padding:10px 16px;cursor:pointer;opacity:.9;box-shadow:0 10px 24px -8px rgba(0,0,0,.45);transition:opacity .2s}',
    '#ed-btn:hover,#ed-btn:focus-visible{opacity:1}',
    '#ed-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:60;display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:calc(100vw - 32px);font:500 13px/1.3 Roboto,Arial,sans-serif;color:#0E2A66;background:#fff;border-radius:14px;padding:8px 10px;box-shadow:0 20px 50px -10px rgba(0,0,0,.5)}',
    '#ed-bar b{font-weight:700;color:#C8392B;padding:0 4px}',
    '#ed-bar button{font:600 13px/1 Roboto,Arial,sans-serif;border:1px solid #D5DEEE;background:#F4F7FC;color:#0E2A66;border-radius:9px;padding:8px 11px;cursor:pointer}',
    '#ed-bar button.pri{background:#2B6BE0;border-color:#2B6BE0;color:#fff}',
    '#ed-bar button:focus-visible,#ed-btn:focus-visible{outline:2px solid #FFD666;outline-offset:2px}',
    '#ed-bar .st{color:#5A6F9C;min-width:90px}',
    '#ed-bar select{font:500 13px Roboto,Arial,sans-serif;border:1px solid #D5DEEE;border-radius:9px;padding:7px 8px;max-width:230px}',
    'body.ed-on .ed-t{cursor:text}',
    'body.ed-on .ed-t:hover{outline:2px dashed rgba(255,214,102,.9);outline-offset:3px}',
    'body.ed-on .ed-t:focus{outline:2px solid #FFD666;outline-offset:3px}',
    'body.ed-on .slide[data-off]::after{content:"ĐÃ ẨN · bỏ qua khi trình chiếu";position:absolute;left:50%;top:14px;transform:translateX(-50%);z-index:40;font:800 20px/1 Roboto,Arial,sans-serif;letter-spacing:.12em;color:#fff;background:#C8392B;padding:10px 18px;border-radius:10px}',
    '@media print{#ed-btn,#ed-bar{display:none}}'
  ].join('\n');
  document.head.appendChild(css);
  var btn = document.createElement('button'); btn.id = 'ed-btn'; btn.type = 'button'; btn.textContent = '✎ Sửa chữ'; btn.hidden = false;
  var bar = document.createElement('div'); bar.id = 'ed-bar'; bar.hidden = true;
  document.body.appendChild(btn); document.body.appendChild(bar);
  var stText = 'Bấm vào chữ để sửa';
  function status(t) { stText = t; var s = bar.querySelector('.st'); if (s) s.textContent = t; }
  function cur() { return window.deck && window.deck.current ? window.deck.current() : null; }
  function renderBar() {
    if (!editing) return;
    var s = cur(), t = s ? s.getAttribute('data-title') : '', off = hidden.indexOf(t) >= 0;
    var opts = hidden.map(function (h) { return '<option>' + h.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '</option>'; }).join('');
    bar.innerHTML = '<b>ĐANG SỬA</b><span class="st"></span>' +
      '<button type="button" data-a="hide">' + (off ? 'Hiện lại slide này' : 'Ẩn slide này') + '</button>' +
      '<button type="button" data-a="reset">Chữ gốc slide này</button>' +
      (hidden.length ? '<select aria-label="Slide đã ẩn" data-a="jump"><option value="">Slide đã ẩn (' + hidden.length + ')</option>' + opts + '</select>' : '') +
      '<button type="button" class="pri" data-a="done">Xong</button>';
    status(stText);
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.getAttribute('data-a'), s = cur(); if (!s) return;
    var t = s.getAttribute('data-title');
    if (a === 'done') return setEdit(false);
    if (a === 'hide') { var i = hidden.indexOf(t); if (i >= 0) hidden.splice(i, 1); else hidden.push(t); applyHidden(); saveHidden(); }
    if (a === 'reset') { bySlide.get(s).forEach(function (k) { reg[k].el.innerHTML = reg[k].orig; }); save(s); }
  });
  bar.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-a') !== 'jump' || !e.target.value) return;
    var sec = sections.filter(function (x) { return x.getAttribute('data-title') === e.target.value; })[0];
    var i = window.deck.slides.indexOf(sec); if (i >= 0) window.deck.go(i, 999);
  });
  function setEdit(on) {
    editing = on;
    document.body.classList.toggle('ed-on', on);
    sections.forEach(function (sec) { sec.querySelectorAll('.px-host').forEach(function (h) { var r = h.shadowRoot && h.shadowRoot.firstElementChild; if (h.shadowRoot) h.shadowRoot.querySelectorAll('.sl').forEach(function (x) { x.classList.toggle('ed-on', on); }); }); });
    Object.keys(reg).forEach(function (k) { if (on) reg[k].el.setAttribute('contenteditable', 'true'); else reg[k].el.removeAttribute('contenteditable'); });
    bar.hidden = !on; btn.hidden = on;
    if (window.deck && window.deck.refresh) window.deck.refresh(on);
    if (on) { stText = 'Bấm vào chữ để sửa'; var i = window.deck.slides.indexOf(cur()); window.deck.go(i < 0 ? 0 : i, 999); renderBar(); }
    else { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); timers.forEach(function (tm, sec) { clearTimeout(tm); save(sec); }); timers.clear(); }
  }
  btn.addEventListener('click', function () { setEdit(true); });
  window.addEventListener('hashchange', function () { setTimeout(renderBar, 0); });

  /* khi đang gõ: phím và cú bấm không chuyển slide */
  function inEditable(e) { var p = e.composedPath ? e.composedPath() : [e.target]; return p.some(function (n) { return n && n.isContentEditable; }); }
  window.addEventListener('keydown', function (e) { if (editing && (inEditable(e) || e.target.closest && e.target.closest('#ed-bar'))) e.stopPropagation(); }, true);
  window.addEventListener('click', function (e) {
    if (!editing) return;
    var p = e.composedPath ? e.composedPath() : [e.target];
    if (inEditable(e)) e.stopPropagation();
  }, true);
  window.addEventListener('keyup', function () { if (editing) setTimeout(renderBar, 0); });
  document.addEventListener('paste', function (e) {
    if (!editing || !inEditable(e)) return;
    e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, t);
  });
  /* đổi slide bằng nút bấm hay phím: cập nhật thanh công cụ */
  var lastCur = null; setInterval(function () { var c = cur(); if (editing && c !== lastCur) { lastCur = c; renderBar(); } }, 400);

  /* ---------- nối kho dữ liệu (chờ tối đa 10 giây), không có thì lưu trên máy ---------- */
  function useLocal() {
    try { var all = JSON.parse(localStorage.getItem('deck-edits') || '{}'); Object.keys(all).forEach(function (t) { applyDoc({ texts: all[t] }); }); } catch (e) {}
    try { var h = JSON.parse(localStorage.getItem('deck-hidden') || '[]'); if (Array.isArray(h) && h.length) { hidden = h; applyHidden(); } } catch (e) {}
  }
  function connect(d) {
    db = d;
    d.collection('edits').onSnapshot(function (qs) { qs.docs.forEach(function (doc) { if (doc.exists) applyDoc(doc.data()); }); }, function () {});
    d.doc('meta/hidden').onSnapshot(function (snap) {
      var t = snap.exists && snap.data() && snap.data().titles;
      hidden = Array.isArray(t) ? t.filter(function (x) { return typeof x === 'string'; }) : [];
      applyHidden();
    }, function () {});
  }
  var tries = 0;
  (function wait() {
    if (window.claude && window.claude.use) {
      window.claude.use('db').then(function (d) { if (d) connect(d); else useLocal(); }).catch(useLocal);
    } else if (++tries < 40) setTimeout(wait, 250);
    else useLocal();
  })();
})();
