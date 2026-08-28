/* ==========================================================================
   heart-cursor.js — Vệt trái tim bay theo con trỏ chuột
   --------------------------------------------------------------------------
   File này ĐỘC LẬP HOÀN TOÀN: tự chèn CSS của mình, không phụ thuộc file nào
   khác. Muốn tắt hẳn hiệu ứng thì làm 1 trong 2 cách:
     • Đặt  enabled: false  ở phần cấu hình ngay bên dưới, HOẶC
     • Xoá dòng <script src="assets/js/heart-cursor.js"> trong index.html

   (Đây là file DUY NHẤT trong dự án tự chèn CSS thay vì viết trong
    styles.css — cố ý làm vậy để hiệu ứng gỡ ra/lắp vào chỉ bằng 1 dòng.)

   Điều khiển lúc chạy, gõ trong Console trình duyệt:
     HeartCursor.stop()      tạm dừng
     HeartCursor.start()     bật lại
     HeartCursor.toggle()    đảo trạng thái
     HeartCursor.config      xem/sửa cấu hình ngay lập tức
   ========================================================================== */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     ★ SỬA Ở ĐÂY — toàn bộ tuỳ chỉnh nằm trong khối này
     ══════════════════════════════════════════════════════════════════════ */
  var CONFIG = {

    enabled: true,            // false = tắt hẳn hiệu ứng

    // ── Tần suất tạo tim ────────────────────────────────────────────────
    spawnEveryMs: 85,         // cách nhau tối thiểu bao nhiêu ms mới tạo tim mới
                              //   (số NHỎ hơn = tim dày hơn; 40 = rất dày, 150 = thưa)
    minDistance: 16,          // chuột phải đi được ít nhất bao nhiêu px mới tạo tim
                              //   (tránh dồn cả đống tim tại chỗ khi rê chuột chậm)
    maxOnScreen: 26,          // trần số tim cùng lúc trên màn hình (chặn lag)

    // ── Kích thước & hình dáng ──────────────────────────────────────────
    sizeMin: 9,               // cạnh nhỏ nhất của trái tim (px)
    sizeMax: 19,              // cạnh lớn nhất
    jitter: 7,                // độ lệch ngẫu nhiên quanh vị trí con trỏ (px)

    // ── Chuyển động ─────────────────────────────────────────────────────
    lifetimeMs: 1150,         // tim sống bao lâu rồi biến mất
    riseMin: 46,              // bay lên tối thiểu bao nhiêu px
    riseMax: 84,              // bay lên tối đa
    driftMax: 26,             // độ dạt ngang tối đa (trái/phải ngẫu nhiên)
    rotateMax: 26,            // độ nghiêng tối đa (độ)

    // ── Màu sắc ─────────────────────────────────────────────────────────
    // Lấy màu từ chính biến CSS của hệ theme, nên đổi theme là tim đổi màu ngay.
    // Muốn tim chỉ một màu thì để đúng 1 token, VD: ['--color-accent']
    colorTokens: ['--color-accent', '--color-secondary', '--color-primary'],
    opacity: 0.85,            // độ đậm tối đa của tim (0 → 1)

    // ── Hành vi ─────────────────────────────────────────────────────────
    hideDefaultCursor: false, // true = ẩn luôn con trỏ mặc định
                              //   (khuyên để false — ẩn con trỏ gây khó dùng)
    onlyWithMouse: true,      // true = chỉ chạy trên máy có chuột thật,
                              //   tự tắt trên điện thoại/tablet (không có con trỏ)
    respectReducedMotion: true, // true = tự tắt khi hệ điều hành bật
                                //   "giảm chuyển động" (yêu cầu accessibility)
    zIndex: 200,              // nav=100, bảng theme=120, nút lên đầu trang=90
  };
  /* ══════════════════════ HẾT PHẦN CẦN SỬA ══════════════════════════════ */


  /* ─────────────────────────── Điều kiện chạy ─────────────────────────── */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Máy có chuột thật (không phải cảm ứng). Điện thoại sẽ không khớp điều kiện này.
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function allowed() {
    if (!CONFIG.enabled) return false;
    if (CONFIG.respectReducedMotion && reduceMotion.matches) return false;
    if (CONFIG.onlyWithMouse && !finePointer.matches) return false;
    return true;
  }


  /* ──────────────────────────── CSS tự chèn ───────────────────────────── */

  var styleEl = document.createElement('style');
  styleEl.setAttribute('data-heart-cursor', '');
  styleEl.textContent =
    '.heart-cursor-layer{position:fixed;inset:0;overflow:hidden;' +
      // pointer-events:none để lớp này KHÔNG BAO GIỜ chắn click hay bôi đen chữ
      'pointer-events:none;contain:layout paint}' +
    '.heart-cursor-layer *{pointer-events:none}' +
    '.heart-cursor-heart{position:absolute;transform:translate(-50%,-50%);' +
      'will-change:transform,opacity}' +
    '.heart-cursor-heart svg{display:block;width:100%;height:100%;fill:currentColor}' +
    'html.heart-cursor-hide-native,html.heart-cursor-hide-native *{cursor:none!important}';
  document.head.appendChild(styleEl);


  /* ───────────────────────── Lớp chứa & mẫu trái tim ──────────────────── */

  var layer = document.createElement('div');
  layer.className = 'heart-cursor-layer';
  layer.setAttribute('aria-hidden', 'true');   // thuần trang trí, trình đọc màn hình bỏ qua
  layer.style.zIndex = String(CONFIG.zIndex);

  // Dựng SẴN một trái tim mẫu rồi cloneNode cho mỗi lần tạo — nhanh hơn nhiều
  // so với parse lại chuỗi HTML mỗi lần.
  var heartTemplate = document.createElement('span');
  heartTemplate.className = 'heart-cursor-heart';
  heartTemplate.innerHTML =
    '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
    '<path d="M12 21.1 3.8 12.9a5.5 5.5 0 0 1 0-7.8 5.5 5.5 0 0 1 7.8 0l.4.4.4-.4a5.5 5.5 0 0 1 7.8 7.8Z"/>' +
    '</svg>';


  /* ──────────── Màu theo theme (có bộ nhớ đệm + tự làm mới) ───────────── */

  var colorCache = null;

  function colors() {
    if (colorCache) return colorCache;
    var cs = getComputedStyle(document.documentElement);
    colorCache = CONFIG.colorTokens
      .map(function (token) { return cs.getPropertyValue(token).trim(); })
      .filter(Boolean);
    if (!colorCache.length) colorCache = ['currentColor'];
    return colorCache;
  }

  // Đổi theme = ghi lại các biến --color-* vào thuộc tính style của <html>
  // (xem applyTheme trong main.js) và đặt data-theme. Quan sát đúng hai thứ đó
  // rồi xoá cache → trái tim tiếp theo đã mang màu mới, không cần tải lại trang.
  // Đọc getComputedStyle mỗi lần tạo tim sẽ ép trình duyệt tính lại layout,
  // nên phải đệm như thế này.
  if (window.MutationObserver) {
    new MutationObserver(function () { colorCache = null; })
      .observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'style'],
      });
  }


  /* ──────────────────────────── Tạo một trái tim ──────────────────────── */

  function rand(min, max) { return min + Math.random() * (max - min); }

  function spawn(x, y) {
    // Chạm trần thì bỏ qua, không tạo thêm (chặn lag khi rê chuột rất nhanh)
    if (layer.childElementCount >= CONFIG.maxOnScreen) return;

    var el = heartTemplate.cloneNode(true);
    var size = rand(CONFIG.sizeMin, CONFIG.sizeMax);
    var list = colors();

    el.style.width  = size.toFixed(1) + 'px';
    el.style.height = size.toFixed(1) + 'px';
    el.style.left   = (x + rand(-CONFIG.jitter, CONFIG.jitter)).toFixed(1) + 'px';
    el.style.top    = (y + rand(-CONFIG.jitter, CONFIG.jitter)).toFixed(1) + 'px';
    el.style.color  = list[(Math.random() * list.length) | 0];

    layer.appendChild(el);

    var rise   = rand(CONFIG.riseMin, CONFIG.riseMax);
    var drift  = rand(-CONFIG.driftMax, CONFIG.driftMax);
    var rot    = rand(-CONFIG.rotateMax, CONFIG.rotateMax);
    var life   = CONFIG.lifetimeMs * rand(0.85, 1.15);

    function remove() { if (el.parentNode) el.parentNode.removeChild(el); }

    // Web Animations API: mỗi trái tim có thông số riêng nên dùng animate()
    // gọn hơn nhiều so với việc sinh @keyframes động.
    if (typeof el.animate === 'function') {
      var anim = el.animate([
        { transform: 'translate(-50%,-50%) scale(.45) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%,-50%) scale(1) rotate(' + (rot * 0.35).toFixed(1) + 'deg)',
          opacity: CONFIG.opacity, offset: 0.2 },
        { transform: 'translate(calc(-50% + ' + drift.toFixed(1) + 'px), calc(-50% - ' +
                     rise.toFixed(1) + 'px)) scale(.7) rotate(' + rot.toFixed(1) + 'deg)',
          opacity: 0 },
      ], {
        duration: life,
        easing: 'cubic-bezier(.22,.61,.36,1)',
        fill: 'forwards',
      });
      // .finished bị "reject" nếu animation bị huỷ → truyền remove cho cả 2 nhánh
      if (anim.finished) anim.finished.then(remove, remove);
      else anim.onfinish = remove;
    } else {
      el.style.opacity = String(CONFIG.opacity);   // trình duyệt quá cũ: hiện rồi xoá
    }

    // Lưới an toàn: kể cả animation không bao giờ báo kết thúc (tab bị ẩn,
    // trình duyệt lạ...) thì phần tử vẫn bị dọn khỏi DOM.
    setTimeout(remove, life + 400);
  }


  /* ─────────── Điều phối: gom mousemove, mỗi khung hình tối đa 1 tim ──── */

  var pointerX = 0, pointerY = 0;
  var lastX = null, lastY = null;
  var lastSpawnAt = 0;
  var rafId = null;
  var running = false;

  function now() {
    return (window.performance && performance.now) ? performance.now() : new Date().getTime();
  }

  // Chạy đúng MỘT lần cho mỗi khung hình có chuyển động chuột.
  // Cố ý KHÔNG dùng vòng lặp rAF tự quay: khi chuột đứng yên thì không xin
  // khung hình nào cả — đỡ tốn pin và không cần bộ đếm "nhàn rỗi" rắc rối.
  function flush() {
    rafId = null;
    if (!running) return;                    // stop() được gọi ngay trước khung này

    if (now() - lastSpawnAt < CONFIG.spawnEveryMs) return;

    var moved = (lastX === null)
      ? Infinity
      : Math.sqrt(Math.pow(pointerX - lastX, 2) + Math.pow(pointerY - lastY, 2));
    if (moved < CONFIG.minDistance) return;

    spawn(pointerX, pointerY);
    lastSpawnAt = now();
    lastX = pointerX;
    lastY = pointerY;
  }

  // Handler CỰC NHẸ: chỉ ghi toạ độ rồi xin một khung hình nếu chưa xin.
  // Chuột bắn ra hàng trăm sự kiện mỗi giây cũng chỉ tốn 1 lần xử lý mỗi khung,
  // nên trang không bao giờ khựng vì hiệu ứng này.
  function onMove(e) {
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (rafId !== null || !running) return;
    rafId = requestAnimationFrame(flush);
  }

  // Chuột rời cửa sổ thì reset mốc, tránh vẽ một vệt dài vô lý khi quay lại
  function onLeave() { lastX = lastY = null; }


  /* ────────────────────────────── API công khai ───────────────────────── */

  function start() {
    if (running || !allowed()) return;
    running = true;
    if (!layer.parentNode) document.body.appendChild(layer);
    if (CONFIG.hideDefaultCursor) document.documentElement.classList.add('heart-cursor-hide-native');
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
  }

  function stop() {
    running = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    document.documentElement.classList.remove('heart-cursor-hide-native');
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    if (layer.parentNode) layer.parentNode.removeChild(layer);
    lastX = lastY = null;
  }

  function toggle() { running ? stop() : start(); }

  window.HeartCursor = {
    config: CONFIG,
    start: start,
    stop: stop,
    toggle: toggle,
    isRunning: function () { return running; },
  };

  // Người dùng đổi thiết lập "giảm chuyển động" giữa chừng thì tôn trọng ngay
  var onPrefChange = function () { allowed() ? start() : stop(); };
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onPrefChange);
  if (finePointer.addEventListener) finePointer.addEventListener('change', onPrefChange);

  start();
})();
