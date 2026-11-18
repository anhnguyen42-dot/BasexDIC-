/* Màn hình phần mềm Base dựng bằng HTML, chữ lấy từ window.CLIENT.demo
   Đặt <div class="am" data-mock="pipeline|companies|chat|kanban|form"></div> trong slide. */
(function () {
  var C = window.CLIENT || {}, D = C.demo || {};
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sub(s) { return e(s).replace(/\{(\w+)\}/g, function (m, k) { return e(C[k] || ''); }); }
  var PAL = ['#3B5BDB', '#C2255C', '#E8590C', '#2B8A3E', '#7048E8', '#0B7285', '#5C7CFA', '#D9480F'];
  function ini(n) { var p = String(n).trim().split(/\s+/).filter(function (w) { return /^[\p{L}]/u.test(w); }); if (!p.length) p = ['?']; return ((p.length > 1 ? p[p.length - 2][0] : '') + p[p.length - 1][0]).toUpperCase(); }
  function av(n, i) { var h = 0; for (var k = 0; k < n.length; k++) h = (h * 31 + n.charCodeAt(k)) >>> 0; return '<i class="qav" style="background:' + PAL[(i != null ? i : h) % PAL.length] + '">' + e(ini(n)) + '</i>'; }
  function money(m) { return '₫' + (m * 1e6).toLocaleString('en-US'); }
  var IC = {
    home: '<path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/>', pipe: '<path d="M4 5h16M4 5v14M10 5v10M16 5v6"/>', bld: '<path d="M4 20V5h10v15M14 9h6v11M7 9h3M7 13h3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/>', inbox: '<path d="M4 4h16v16H4zM4 14h5l1 2h4l1-2h5"/>', chart: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>', cal: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>', fire: '<path d="M12 3c3 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-3 1-6 1-9z"/>',
    list: '<path d="M4 6h16M4 12h16M4 18h16"/>', chk: '<path d="M5 12l4 4 10-10"/>', bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>'
  };
  function ic(n, c) { return '<svg class="qic' + (c ? ' ' + c : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (IC[n] || '') + '</svg>'; }
  function top() { return '<div class="am-top"><b class="am-logo"><i></i>Base.vn</b><span class="am-q">' + ic('search') + 'Tìm kiếm tất cả…<kbd>⌘K</kbd></span><span class="am-me">' + av(C.short || 'B', 0) + '</span></div>'; }
  function rail(on) {
    var it = [['home', 'Trang chủ'], ['pipe', 'Pipeline'], ['bld', 'Công ty'], ['user', 'Liên hệ'], ['inbox', 'Hộp thư'], ['chart', 'Báo cáo']];
    return '<div class="am-rail">' + it.map(function (x) { return '<span class="' + (x[1] === on ? 'on' : '') + '">' + ic(x[0]) + x[1] + '</span>'; }).join('') + '</div>';
  }

  var R = {};
  R.pipeline = function () {
    var p = D.pipeline || { stages: [] }, all = 0, cnt = 0;
    p.stages.forEach(function (s) { s.deals.forEach(function (d) { all += d.v; cnt++; }); });
    var cols = p.stages.map(function (s) {
      var sum = 0; s.deals.forEach(function (d) { sum += d.v; });
      return '<div class="qpc"><div class="qpch"><b>' + e(s.n) + '</b><em>' + s.deals.length + '</em><small>' + money(sum) + ' · ' + Math.round(sum / (all || 1) * 100) + '% của pipeline</small></div>' +
        s.deals.map(function (d) {
          return '<div class="qpd' + (d.late ? (d.warn ? ' w' : ' l') : '') + '">' + (d.tags ? '<div class="qtg">' + d.tags.map(function (t) { return '<span>' + e(t) + '</span>'; }).join('') + '</div>' : '') +
            '<b>' + e(d.t) + '</b><small>' + e(d.c) + '</small><div class="qpf">' + av(d.o) + '<span>' + e(d.o) + '</span>' +
            (d.late ? '<em class="' + (d.warn ? 'w' : '') + '">' + ic(d.warn ? 'cal' : 'fire') + e(d.late) + '</em>' : '') + '<strong>' + money(d.v) + '</strong></div></div>';
        }).join('') + '</div>';
    }).join('');
    return top() + '<div class="am-body">' + rail('Pipeline') + '<div class="am-main"><div class="am-bar"><b>' + e(C.short) + ' · ' + e(p.name) + '</b><span><b>' + cnt + '</b> thương vụ · Tổng: <b>' + money(all) + '</b></span><i class="qbtn">+ Thêm thương vụ</i></div><div class="qpcs">' + cols + '</div></div></div>';
  };
  R.companies = function () {
    var rows = (D.companies || []).map(function (r, i) {
      return '<tr><td><span class="qcn">' + av(r[0], i) + '<b>' + e(r[0]) + '</b></span></td><td><span class="qchip">' + e(r[1]) + '</span></td><td class="qlk">' + e(r[2]) + '</td><td>' + e(r[3]) + '</td><td><span class="qcn">' + av(r[4]) + e(r[4]) + '</span></td><td class="qnr">' + r[5] + '</td><td>' + e(r[6]) + '</td></tr>';
    }).join('');
    return top() + '<div class="am-body">' + rail('Công ty') + '<div class="am-main"><div class="am-bar"><b>Công ty</b><span><b>' + (D.companies || []).length + '</b> công ty</span><i class="qbtn">+ Thêm công ty</i></div>' +
      '<div class="qtw"><table class="am-t"><thead><tr><th>Tên công ty</th><th>Phân loại</th><th>Website</th><th>Địa chỉ</th><th>Phụ trách</th><th>Thương vụ</th><th>Gần nhất</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></div>';
  };
  R.chat = function () {
    var c = D.chat || { list: [], msgs: [], fields: [] };
    var list = c.list.map(function (r, i) { return '<div class="qcl' + (r[0] === c.customer ? ' on' : '') + '">' + av(r[0], i + 2) + '<div><b>' + e(r[0]) + '<small>' + e(r[2]) + '</small></b><span>' + e(r[1]) + '</span><em class="' + (r[3] === 'Chưa trả lời' ? 'r' : '') + '">' + e(r[3]) + '</em></div></div>'; }).join('');
    var msgs = c.msgs.map(function (m) {
      if (m[0] === 'sys') return '<div class="qms">' + ic('bolt') + sub(m[1]) + '</div>';
      return '<div class="qmg ' + m[0] + '">' + (m[0] === 'c' ? av(c.customer, 0) : '') + '<p>' + sub(m[1]) + '<small>' + e(m[2] || '') + '</small></p></div>';
    }).join('');
    var f = c.fields.map(function (x) { return '<div class="qfr"><span>' + e(x[0]) + '</span><b>' + e(x[1]) + '</b></div>'; }).join('');
    return top() + '<div class="am-body qch"><div class="qchl"><div class="qchh">Hội thoại</div><div class="qtabs"><b>Tất cả</b><span>Mới</span><span>Cần trả lời</span><span>Đang chờ</span></div>' + list + '</div>' +
      '<div class="qchm"><div class="qchh">' + av(c.customer, 0) + e(c.customer) + '<i class="qbtn g">Đã chuyển Sales</i></div><div class="qmsgs">' + msgs + '</div></div>' +
      '<div class="qchr"><div class="qchh"><b>' + e(C.short) + ' · ' + e(c.inbox) + '</b><small>' + e(c.channel) + '</small></div><div class="qaiu">' + ic('bolt') + 'AI đã cập nhật ' + c.fields.length + ' trường</div>' + f + '</div></div>';
  };
  R.kanban = function () {
    var k = D.kanban || { cols: [] };
    var cols = k.cols.map(function (col) {
      return '<div class="qkc"><div class="qkch ' + (col.k || '') + '">' + (col.k === 'ai' ? ic('bolt') : ic('chk')) + '<b>' + e(col.n) + '</b><em>' + col.cards.length + '</em></div>' +
        col.cards.map(function (d) {
          return '<div class="qkd' + (d.late ? ' lt8' : '') + '">' + (d.late ? '<div class="qkl">' + e(d.late) + '</div><span class="qkr"></span>' : '') +
            '<div class="qkb">' + (d.code ? '<small class="qcd">' + e(d.code) + '</small>' : '') + '<b>' + e(d.t) + '</b>' + (d.due ? '<em>' + ic('cal') + e(d.due) + ' · 00:00</em>' : '') +
            '<div class="qkv"><span>Bảng đề nghị</span><i>' + d.rows + ' hàng</i></div><div class="qkv"><span>Giá trị dự kiến</span>' + e(d.v) + '</div><div class="qkv"><span>Lý do</span>' + e(d.why) + '</div>' +
            '<div class="qpf">' + av(d.who) + '<span>' + e(d.who) + '</span></div></div></div>';
        }).join('') + '</div>';
    }).join('');
    return '<div class="qkt"><span class="kt-i">' + ic('pipe') + '</span><b>' + e(C.short) + ' - ' + e(C.flowName) + '</b><i class="qbtn">+ Công việc mới</i></div>' +
      '<div class="qktabs"><span>Pipeline</span><b>Kanban</b><span>Bảng</span><span>Quy trình</span><span>Báo cáo</span></div><div class="qkcs">' + cols + '</div>';
  };
  R.form = function () {
    var f = D.form || { rows: [], items: [], people: [] };
    var row = function (l, v, g) { return '<div class="qff"><label>' + l + ' *</label><span class="' + (g ? 'g' : '') + '">' + v + '</span></div>'; };
    var items = f.items.map(function (r, i) { return '<tr><td>' + ('0' + (i + 1)).slice(-2) + '</td>' + r.map(function (x) { return '<td>' + e(x) + '</td>'; }).join('') + '</tr>'; }).join('');
    return '<div class="qfm">' + row('Tên đề xuất', e(f.title)) + row('Nhóm đề xuất', e(C.short) + ' - ' + e(C.formName), 1) + f.rows.map(function (r) { return row(e(r[0]), e(r[1])); }).join('') +
      '<div class="qff col"><label>Thông tin yêu cầu *</label><table><thead><tr><th>#</th><th>Tên vật tư, thiết bị</th><th>Đơn vị</th><th>SL</th><th>Mô tả chi tiết</th><th>Lý do</th></tr></thead><tbody>' + items + '</tbody></table></div>' +
      f.people.map(function (r) { return row(e(r[0]), e(r[1]), 1); }).join('') + '<div class="qfbt"><i class="qbtn">Gửi đề xuất</i></div></div>';
  };

  document.querySelectorAll('.am[data-mock]').forEach(function (el) {
    var f = R[el.getAttribute('data-mock')];
    if (f) { try { el.innerHTML = f(); } catch (err) { el.textContent = 'Lỗi dựng màn hình: ' + err.message; } }
  });
})();
