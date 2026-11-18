/* ============================================================
   CẤU HÌNH THEO KHÁCH · đổi khách chỉ cần sửa file này
   - logo: đường dẫn ảnh logo khách (PNG nền trong). Để trống thì hiện chữ wordmark.
   - peers: khách hàng cùng ngành đang dùng Base (logo + tên). Logo trống thì hiện ô chờ.
   - processes: danh mục quy trình theo nhóm. Mục có on:true là quy trình mẫu được vẽ lưu đồ.
   Các phần nội dung riêng ngành (pain, dữ liệu demo) nằm trong index.html, đánh dấu data-c-edit.
   ============================================================ */
window.CLIENT = {
  name: "DIC Star Landmark Vũng Tàu",
  short: "DIC Landmark",
  logo: "img/client/dic-landmark.png",  /* để trống thì hiện chữ wordmark */
  wordmark: "DIC LANDMARK",
  wordmarkSub: "HOTEL & APARTMENT · VŨNG TÀU",
  industry: "khách sạn, căn hộ dịch vụ",
  date: "11/2026",
  /* tên hiện trên ảnh phần mềm (đè lên tên khách cũ trong ảnh chụp) */
  flowName: "Quy trình Mua hàng - Thanh toán",   /* slide lưu đồ, kanban */
  formName: "Phiếu đề nghị sửa chữa, mua vật tư", /* slide phiếu giấy → phần mềm */
  /* ===== Màn hình phần mềm dựng bằng HTML (đổi theo ngành) ===== */
  demo: {
    pipeline: { name: "Khách đoàn, hội nghị, thuê dài hạn", stages: [
      { n: "Tiếp nhận yêu cầu", deals: [
        { t: "Hội thảo ra mắt sản phẩm · Mekong Xanh · 90 khách", c: "Huỳnh Quốc Bảo · Cty CP Thực phẩm Mekong Xanh", o: "Lê Huy", v: 165 },
        { t: "Lưu trú đoàn tài xế · Vận tải Hưng Thuận · 35 khách", c: "Trịnh Gia Huy · Cty TNHH Vận tải Hưng Thuận", o: "Linh", v: 185, late: "20 ngày" } ] },
      { n: "Tư vấn nhu cầu", deals: [
        { t: "Hội nghị khách hàng 2027 · Sao Mai · 200 khách", c: "Thanh Hà · Cty CP Sao Mai", o: "Phương Thảo", v: 489, tags: ["VIP", "Hội nghị"] },
        { t: "Thuê 4 căn 2PN, 12 tháng · Kỹ thuật Biển Đông", c: "Ngô Đức Mạnh · Cty TNHH Kỹ thuật Biển Đông", o: "Đỗ Ngọc Mai", v: 1080, tags: ["Thuê dài hạn"] },
        { t: "Đoàn khách Hàn Quốc · Du lịch Hải Đăng · 45 khách", c: "Kiều Anh Tuấn · Cty TNHH Du lịch Hải Đăng", o: "Ny", v: 240 } ] },
      { n: "Giữ chỗ tạm", deals: [
        { t: "Căn cho chuyên gia, 6 tháng · Cảng Sao Biển · 3 căn", c: "Võ Ngọc Hân · Cty CP Cảng Sao Biển", o: "Đỗ Ngọc Mai", v: 405 },
        { t: "Đại hội thường niên · Hiệp hội DN Gia Định · 220 khách", c: "Lý Thị Mỹ Dung · Hiệp hội DN Gia Định", o: "Trần Hà", v: 720, late: "còn 1 ngày", warn: true } ] },
      { n: "Khách xem địa điểm", deals: [
        { t: "Hội nghị đại lý miền Nam · Bảo hiểm Phú An · 110 khách", c: "Đoàn Thế Vinh · Cty CP Bảo hiểm Phú An", o: "Phan Yến", v: 420, late: "1 ngày" },
        { t: "Hội nghị khách hàng cuối năm · Dược Phương Nam An", c: "Đặng Thu Hà · Cty CP Dược Phương Nam An", o: "Phan Yến", v: 480, late: "16 ngày" } ] },
      { n: "Gửi báo giá", deals: [
        { t: "Year-end party · Tập đoàn Hưng Thịnh · 300 khách", c: "Phạm Quốc Khánh · Tập đoàn Hưng Thịnh", o: "Phương Thảo", v: 650 } ] },
      { n: "Hợp đồng, cọc", deals: [
        { t: "Thuê 3 căn 2PN, 6 tháng · Xây dựng Đông Á", c: "Hoàng Minh Tuấn · Cty TNHH Xây dựng Đông Á", o: "Tuấn Anh", v: 405, tags: ["Đã cọc"] } ] } ] },
    companies: [
      ["Cty CP Sao Mai", "Khách doanh nghiệp", "saomai.vn", "45 Lê Lợi, Vũng Tàu", "Phương Thảo", 3, "11/2026"],
      ["Cty CP Bảo hiểm Phú An", "Khách doanh nghiệp", "baohiemphuan.vn", "21 Nguyễn Du, Quận 1", "Phan Yến", 2, "10/2026"],
      ["Tập đoàn Hưng Thịnh", "Khách doanh nghiệp", "hungthinh.com.vn", "110 Hai Bà Trưng, Quận 3", "Phương Thảo", 4, "12/2025"],
      ["Cty TNHH Du lịch Hải Đăng", "Công ty tour", "haidangtravel.vn", "88 Thùy Vân, Vũng Tàu", "Ny", 6, "11/2026"],
      ["Đại lý Phương Nam Tour & Hotel", "Đại lý du lịch", "phuongnamtour.vn", "55 Trần Hưng Đạo, Phú Quốc", "Ny", 5, "09/2026"],
      ["Cty TNHH Kỹ thuật Biển Đông", "Khách thuê dài hạn", "biendongtech.vn", "12 Nguyễn Hữu Cảnh, Vũng Tàu", "Đỗ Ngọc Mai", 3, "11/2026"],
      ["Cty CP Cảng Sao Biển", "Khách thuê dài hạn", "cangsaobien.vn", "02 Hạ Long, Vũng Tàu", "Đỗ Ngọc Mai", 2, "11/2026"],
      ["Hiệp hội DN Gia Định", "Hiệp hội", "giadinhbiz.org.vn", "64 Phan Đăng Lưu, Bình Thạnh", "Trần Hà", 1, "12/2025"],
      ["Cty CP Dược Phương Nam An", "Khách doanh nghiệp", "duocnaman.vn", "132 Bạch Đằng, Tân Bình", "Phan Yến", 3, "11/2025"],
      ["Cty TNHH Vận tải Hưng Thuận", "Khách doanh nghiệp", "hungthuan.vn", "308 Nguyễn Văn Linh, Quận 7", "Linh", 8, "10/2026"],
      ["Cty TNHH Lữ hành Sao Việt", "Công ty tour", "saovettravel.vn", "86 Nguyễn Thị Minh Khai, Quận 3", "Ny", 4, "07/2026"],
      ["Cty CP Thực phẩm Mekong Xanh", "Khách doanh nghiệp", "mekongxanh.vn", "18 Hai Bà Trưng, Cần Thơ", "Lê Huy", 1, "03/2026"] ],
    chat: { inbox: "Tư vấn thuê căn hộ", channel: "Live Chat website", customer: "Hoàng Minh Tuấn",
      list: [["Hoàng Minh Tuấn", "Bạn tư vấn sẽ gửi danh sách căn trống…", "4m", "Đang chờ"], ["Trần Thị Bích Ngọc", "Dạ em cảm ơn chị Bích Ngọc…", "3m", "Đang chờ"], ["Khách website a077bb", "Dạ anh/chị dự kiến nhận căn từ ngày nào…", "2m", "Đang chờ"], ["Huy", "ok tư vấn đi", "2d", "Chưa trả lời"], ["Mai", "Cho em hỏi một chút là Mai đang qua…", "2d", "Đang chờ"]],
      msgs: [
        ["ai", "Dạ {short} xin chào anh/chị! Em là tư vấn căn hộ của {name}. Anh/chị cần thuê căn theo đêm, theo tháng hay dài hạn ạ?", "20:53"],
        ["c", "Chào em, công ty anh cần thuê 3 căn 2 phòng ngủ cho kỹ sư dự án, ở khoảng 6 tháng từ đầu tháng 1. Bên em còn căn không?", "20:53"],
        ["sys", "AI đã thêm nhãn Thuê dài hạn · Khách doanh nghiệp"],
        ["ai", "Dạ rất hân hạnh ạ! Căn 2 phòng ngủ bên em đủ nội thất, có dọn phòng hằng tuần, hồ bơi và phòng gym; thuê từ 6 tháng có giá theo tháng riêng.", "20:54"],
        ["ai", "Anh cho em xin tên công ty và số người ở mỗi căn nhé. Em ghi nhận để bạn tư vấn gửi danh sách căn trống và báo giá trong 30 phút giờ hành chính ạ.", "20:54"] ],
      fields: [["Nhu cầu", "Thuê dài hạn"], ["Số căn", "3 căn 2PN"], ["Thời gian", "6 tháng · từ 01/2027"], ["Khách", "Cty TNHH Xây dựng Đông Á"], ["Nguồn", "Website"], ["Phân công", "Đỗ Ngọc Mai"]] },
    kanban: { cols: [
      { n: "1. Tạo tờ trình mua hàng", k: "tay", cards: [
        { code: "REQ-2026-0005", t: "Thay 40 bộ chăn ga gối căn 2PN tầng 6–8", rows: 6, v: "114.300.000", why: "Thay mới định kỳ theo chuẩn buồng phòng", who: "Trần Tuấn Anh" },
        { t: "Bổ sung bình chữa cháy, đèn exit tầng hầm", rows: 2, v: "58.000.000", why: "Theo biên bản kiểm tra PCCC", who: "Lê Hùng" } ] },
      { n: "2. Trưởng bộ phận phê duyệt", k: "duyet", cards: [
        { t: "Máy pha cà phê cho nhà hàng tầng 1", rows: 3, v: "12.000.000", why: "Máy cũ hỏng", who: "Trần Tuấn Anh" },
        { t: "Văn phòng phẩm lễ tân tháng 11", rows: 1, v: "4.200.000", why: "Bộ phận lễ tân", who: "Nguyễn Lan", late: "Trễ 8 ngày 21 giờ", due: "04/11/2026" },
        { t: "Thay rèm căn 0712 theo yêu cầu chủ căn", rows: 2, v: "9.800.000", why: "Chủ căn đồng ý chi trả", who: "Lê Tâm" } ] },
      { n: "3. Kiểm tra tồn kho", k: "tay", cards: [
        { code: "REQ-2026-0004", t: "Đồ minibar, đồ dùng một lần tháng 12", rows: 4, v: "25.500.000", why: "Bổ sung tồn kho buồng phòng", who: "Trần Tuấn Anh" },
        { t: "Máy nén điều hoà căn 0815", rows: 3, v: "8.500.000", why: "Căn đang khoá vì hỏng", who: "Lê Hùng", late: "Trễ 10 ngày 21 giờ", due: "02/11/2026" } ] },
      { n: "4. AI kiểm tra ngân sách", k: "ai", cards: [
        { t: "Mua 120 khăn tắm cho hồ bơi", rows: 2, v: "21.600.000", why: "Mùa cao điểm Tết", who: "AI Agent" } ] },
      { n: "5. Giám đốc phê duyệt", k: "duyet", cards: [
        { code: "PR-2026-101", t: "Vật tư bảo trì thang máy số 2", rows: 5, v: "14.890.000", why: "Bảo trì định kỳ quý IV", who: "Trần Cẩm Hà", late: "Trễ 13 ngày 21 giờ", due: "30/10/2026" } ] },
      { n: "6. Mua hàng, thanh toán", k: "tay", cards: [
        { t: "Thanh toán hoá chất xử lý hồ bơi tháng 10", rows: 2, v: "20.000.000", why: "Đã nhận hàng", who: "Phan Phong" } ] } ] },
    form: { title: "Sửa máy lạnh căn 0815", rows: [["Nơi gửi", "Bộ phận Kỹ thuật"], ["Nơi nhận", "Ban giám đốc"], ["Mức độ yêu cầu", "Khẩn · trong 24 giờ"]],
      items: [["Máy nén điều hoà 2HP", "Cái", "1", "Thay máy nén căn 0815", "Sửa chữa"], ["Gas R32", "Bình", "2", "Nạp gas sau thay", "Bổ sung"], ["Công tháo lắp", "Lần", "1", "Thuê ngoài", "Sửa chữa"]],
      people: [["Quản lý trực tiếp", "@tam.kythuat"], ["Xác nhận của kế toán", "@ngoclan"], ["Phê duyệt của Ban giám đốc", "@giamdoc"], ["Người theo dõi", "@buongphong @letan"]] }
  },
  /* Bước 1 CRM: khách đến từ đâu (đổi theo ngành). c = màu, t = chữ trên ô, v = số lead tuần này */
  leadSources: [
    { n: "Quảng cáo Facebook", s: "Lead ads, tin nhắn quảng cáo", c: "#1877F2", t: "f", v: "38" },
    { n: "Google Ads, website", s: "Form đặt phòng, landing page", c: "#EA4335", t: "G", v: "21" },
    { n: "Fanpage Messenger", s: "Inbox, bình luận", c: "#0866FF", t: "m", v: "29" },
    { n: "Zalo OA", s: "Tin nhắn, form Zalo", c: "#0068FF", t: "Z", v: "17" },
    { n: "Hotline, khách đến trực tiếp", s: "Lễ tân, sales trực", c: "#22A06B", t: "☎", v: "11" },
    { n: "Đối tác, khách cũ giới thiệu", s: "Công ty tour, khách doanh nghiệp cũ", c: "#F5A524", t: "★", v: "8" }
  ],
  peersTitle: "khách sạn, căn hộ dịch vụ, du lịch",
  /* group: một tập đoàn quản lý nhiều cơ sở (props: tên cơ sở + nơi). Bỏ trống group nếu không có. */
  peerGroup: { name: "BelGroup Hospitality", logo: "img/peers/belgroup.png", note: "Quản lý và vận hành khách sạn, khu nghỉ dưỡng cao cấp tại Hội An, Đà Nẵng, Nha Trang, Phan Thiết",
    props: [
      { n: "Bel Marina Hoi An Resort", c: "Hội An" }, { n: "Emerald Hoi An Riverside Resort", c: "Hội An" }, { n: "The Signature Hoi An", c: "Hội An" },
      { n: "Legacy Hoi An Resort", c: "Hội An" }, { n: "Shining Riverside Hoi An", c: "Hội An" }, { n: "Oriental Boutique Hoi An", c: "Hội An" },
      { n: "Sen Village Hoi An", c: "Hội An" }, { n: "Lantern Boutique Hoi An", c: "Hội An" },
      { n: "Holiday Beach Hotel Danang", c: "Đà Nẵng" }, { n: "Yarra Ocean Suites Danang", c: "Đà Nẵng" },
      { n: "Vesna Hotel Nha Trang", c: "Nha Trang" }, { n: "Libra Hotel Nha Trang", c: "Nha Trang" }, { n: "Emerald Bay Hotel & Spa", c: "Nha Trang" },
      { n: "Phú Hải Beach Resort & Spa", c: "Phan Thiết" } ] },
  peers: [
    { name: "Nova Hotel & Resort World", logo: "img/peers/nova.png" },
    { name: "SAM Tuyền Lâm Golf & Resorts", logo: "img/peers/sam.png" },
    { name: "Terracotta Hotel & Resort", logo: "img/peers/terracotta.png" },
    { name: "Lan Rừng Beach Resort", logo: "img/peers/lanrung.png" },
    { name: "Hôtel Colline", logo: "img/peers/colline.png" }
  ],
  processes: [
    { group: "Toà nhà · Kỹ thuật", depts: "Kỹ thuật · An ninh · Vệ sinh", items: [
      { t: "Yêu cầu sửa chữa, căn khoá vì hỏng (OOO)", on: true },
      { t: "Bảo trì định kỳ: thang máy, hồ bơi, PCCC, máy phát" },
      { t: "Nhà thầu thi công, sửa chữa trong toà nhà" } ] },
    { group: "Lưu trú · Buồng phòng", depts: "Lễ tân · Buồng · Nhà hàng", items: [
      { t: "Bàn giao ca lễ tân, buồng phòng" },
      { t: "Khiếu nại của khách, đánh giá trên OTA" },
      { t: "Đồ thất lạc, kiểm minibar khi trả phòng" } ] },
    { group: "Chủ sở hữu căn hộ", depts: "Kinh doanh · Kế toán · CSKH", items: [
      { t: "Ký, gia hạn hợp đồng uỷ thác cho thuê" },
      { t: "Đối soát, chia doanh thu cho chủ căn" },
      { t: "Yêu cầu của chủ căn: sửa chữa, nội thất, ở lại căn" } ] },
    { group: "Mua hàng · Tài chính", depts: "Mua hàng · Kho · Kế toán", items: [
      { t: "Mua vật tư, đồ vải, minibar" },
      { t: "Đề nghị thanh toán, tạm ứng" },
      { t: "Duyệt giá phòng, chương trình khuyến mãi" } ] },
    { group: "Nhân sự", depts: "Nhân sự · Các bộ phận", items: [
      { t: "Tuyển dụng, nhân sự thời vụ mùa cao điểm" },
      { t: "Đổi ca, tăng ca, điều chuyển giữa các toà" },
      { t: "Đào tạo chuẩn vận hành mới cho nhân viên" } ] },
    { group: "Văn bản · Tập đoàn", depts: "Ban giám đốc · Hành chính", items: [
      { t: "Tờ trình lên DIC Hospitality, Tập đoàn" },
      { t: "Ban hành quy trình, tiêu chuẩn vận hành" },
      { t: "Công văn đến, đi với cơ quan, đối tác" } ] }
  ]
};

/* ---------- áp cấu hình vào trang (không cần sửa phần dưới) ---------- */
(function () {
  var C = window.CLIENT;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function plateHTML(h) {
    if (C.logo) return '<span class="lgp"><img src="' + esc(C.logo) + '" alt="' + esc(C.name) + '" style="height:' + h + 'px;width:auto;display:block"></span>';
    return '<span class="wm" style="--h:' + h + 'px"><b>' + esc(C.wordmark) + '</b><small>' + esc(C.wordmarkSub) + '</small></span>';
  }
  function fill(root) {
    root.querySelectorAll('.cl-plate').forEach(function (p) { p.innerHTML = plateHTML(+(p.getAttribute('data-h') || 40)); });
    root.querySelectorAll('[data-c]').forEach(function (e) { var k = e.getAttribute('data-c'); if (C[k] != null) e.textContent = C[k]; });
    root.querySelectorAll('.cl-src').forEach(function (box) {
      box.innerHTML = (C.leadSources || []).map(function (x) {
        return '<div class="src"><span class="ic" style="background:' + esc(x.c) + '">' + esc(x.t) + '</span><div><b>' + esc(x.n) + '</b><small>' + esc(x.s) + '</small></div><em>' + esc(x.v) + '</em></div>';
      }).join('');
    });
    root.querySelectorAll('.cl-peers').forEach(function (box) {
      var G = C.peerGroup, gh = '';
      if (G && G.name) {
        var cities = {}; (G.props || []).forEach(function (p) { (cities[p.c] = cities[p.c] || []).push(p.n); });
        gh = '<div class="pgw" data-build="0"><div class="pg-top">' + (G.logo ? '<img src="' + esc(G.logo) + '" alt="' + esc(G.name) + '">' : '<b>' + esc(G.name) + '</b>') +
          '<div><b>' + (G.props || []).length + ' cơ sở</b><small>' + esc(G.note || '') + '</small></div></div><div class="pg-tree">' +
          Object.keys(cities).map(function (k) { return '<div class="pg-city' + (cities[k].length > 4 ? ' big' : '') + '"><h6>' + esc(k) + '</h6>' + cities[k].map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>'; }).join('') + '</div></div>';
        box.classList.add('has-group');
      }
      box.innerHTML = gh + '<div class="pgrid">' + C.peers.map(function (p, i) {
        var lg = p.logo ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '">' : '<span class="ph-logo">Logo khách cùng ngành</span>';
        return '<div class="seac" data-build="1"><div class="lg' + (p.logo ? '' : ' empty') + '">' + lg + '</div><div class="nm">' + esc(p.name) + '</div></div>';
      }).join('') + '</div>';
    });
    root.querySelectorAll('.cl-proc').forEach(function (box) {
      box.innerHTML = C.processes.map(function (g) {
        return '<div class="pgrp"><h5>' + esc(g.group) + '<em>' + esc(g.depts || '') + '</em></h5><ul>' + g.items.map(function (it) {
          return '<li' + (it.on ? ' class="on"' : '') + '>' + esc(it.t) + (it.on ? '<i>MẪU</i>' : '') + '</li>';
        }).join('') + '</ul></div>';
      }).join('') + (box.classList.contains('cat') && C.processes.length % 2 ? '<div class="pgrp more"><b>+ Nhiều quy trình khác</b><span>Mỗi bộ phận còn hàng chục biểu mẫu, đề xuất, phê duyệt đang chạy trên giấy và Zalo.</span></div>' : '');
    });
  }
  fill(document);
  document.querySelectorAll('.px-host').forEach(function (h) { if (h.shadowRoot) fill(h.shadowRoot); });
  var t = document.querySelector('title'); if (t) t.textContent = 'Base.vn × ' + C.name;
})();
