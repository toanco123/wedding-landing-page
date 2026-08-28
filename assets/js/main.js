/* ==========================================================================
   main.js — Hành vi tương tác
   --------------------------------------------------------------------------
   Bạn KHÔNG cần sửa file này. Mọi nội dung nằm ở config.js.

   Gồm: thanh nav, menu mobile, đếm ngược, hiện dần khi cuộn, vẽ dây leo,
        kiểm tra form RSVP, sao chép số tài khoản, accordion FAQ,
        bảng chọn theme, nút lên đầu trang.

   Lưu trữ: chỉ DUY NHẤT lựa chọn theme được ghi vào localStorage
   (khoá 'wedding-theme'). Ngôn ngữ không dùng storage — nó nằm trong URL
   (?lang=en) để link chia sẻ giữ đúng thứ tiếng.
   ========================================================================== */

(function () {
  'use strict';

  var W = window.Wedding;
  var CFG = W.config;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var live = $('#liveRegion');

  function announce(msg) { if (live) live.textContent = msg; }

  /* ── Khoá cuộn nền dùng chung ────────────────────────────────────────────
     Dùng bộ đếm chứ không dùng cờ bật/tắt: nếu menu và lightbox cùng mở,
     đóng cái này không được mở khoá cuộn của cái kia.
     Lưu scrollY rồi bù lại bằng style.top vì body.is-locked là position:fixed. */
  var lockCount = 0;
  var lockedScrollY = 0;

  function lockScroll(on) {
    if (on) {
      if (lockCount === 0) {
        lockedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.top = (-lockedScrollY) + 'px';
        document.body.classList.add('is-locked');
      }
      lockCount++;
    } else {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('is-locked');
        document.body.style.top = '';
        window.scrollTo(0, lockedScrollY);
      }
    }
  }

  /* ═══════════════════════════════════════════════════ 01. THANH NAV */

  var header = $('#siteHeader');
  var toTop  = $('#toTop');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 60);
    // Nút "lên đầu trang" chỉ hiện khi khách đã cuộn qua khoảng 80% màn hình đầu
    toTop.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  /* ═══════════════════════════════════════════════ 02. MENU MOBILE */

  var burger  = $('#navBurger');
  var navPanel = $('#siteNav');
  var menuOpen = false;

  // Thứ tự đúng như thứ tự Tab trên màn hình: logo → các link → đổi ngôn ngữ → nút menu
  function focusables() {
    return [$('.nav__brand')].concat($$('.nav__link'), [$('#themeBtn'), $('#langToggle'), burger])
      .filter(function (n) { return n && n.offsetParent !== null; });
  }

  function setMenu(open) {
    if (open === menuOpen) return;          // tránh khoá/mở khoá cuộn lệch cặp
    menuOpen = open;
    navPanel.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
    lockScroll(open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', W.t(open ? CFG.ui.closeMenu : CFG.ui.openMenu));

    if (open) {
      var first = $('.nav__link');
      if (first) first.focus();
      document.addEventListener('keydown', onMenuKey);
    } else {
      document.removeEventListener('keydown', onMenuKey);
    }
  }

  // Esc để đóng, Tab bị giữ lại trong menu khi đang mở
  function onMenuKey(e) {
    if (e.key === 'Escape') {
      setMenu(false);
      burger.focus();
      return;
    }
    if (e.key !== 'Tab') return;

    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last  = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  burger.addEventListener('click', function () { setMenu(!menuOpen); });

  // Đổi sang desktop khi menu đang mở → đóng lại để không kẹt trạng thái
  var wide = window.matchMedia('(min-width: 860px)');
  (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(
    function (e) { if (e.matches && menuOpen) setMenu(false); }
  );

  // Bấm link: đóng menu rồi tự cuộn tới section
  $$('.nav__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      requestAnimationFrame(function () {
        target.scrollIntoView({
          behavior: reduceMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  });

  /* ══════════════════════════════════════ 03. LINK ĐANG XEM (nav active) */

  var navLinks = $$('.nav__link');
  var watched = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute('data-section')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('data-section') === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    watched.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ═══════════════════════════════════════════ 04. CHUYỂN NGÔN NGỮ */

  $('#langToggle').addEventListener('click', function () {
    W.setLang(W.getLang() === 'vi' ? 'en' : 'vi');
  });

  W.onLangChange(function () {
    updateCountdown();                       // vẽ lại số + nhãn theo ngôn ngữ mới
    announce(W.getLang() === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English');
  });

  /* ═══════════════════════════════════════ 04b. BẢNG CHỌN THEME */

  var THEME_KEY  = 'wedding-theme';
  var themeBtn   = $('#themeBtn');
  var themePanel = $('#themePanel');
  var themeList  = $('#themeList');
  var themeDots  = $('#themeBtnDots');
  var themeIds   = Object.keys(WEDDING_THEMES);
  var themeAnimTimer = null;

  // Theme đang dùng: đoạn script trong <head> đã áp sẵn nếu có bản lưu trước đó
  var currentTheme = document.documentElement.getAttribute('data-theme') || WEDDING_THEME_DEFAULT;
  if (themeIds.indexOf(currentTheme) === -1) currentTheme = themeIds[0];

  function paintDots(box, swatch) {
    $$('i', box).forEach(function (dot, i) {
      dot.style.background = swatch[i] || swatch[swatch.length - 1];
    });
  }

  function applyTheme(id, animate) {
    var def = WEDDING_THEMES[id];
    if (!def) return;

    // Bật transition ~0.35s rồi tắt, để không đụng tới transition khác của trang
    if (animate && !reduceMotion.matches) {
      document.documentElement.classList.add('theme-anim');
      clearTimeout(themeAnimTimer);
      themeAnimTimer = setTimeout(function () {
        document.documentElement.classList.remove('theme-anim');
      }, 380);
    }

    Object.keys(def.tokens).forEach(function (k) {
      document.documentElement.style.setProperty(k, def.tokens[k]);
    });
    document.documentElement.setAttribute('data-theme', id);
    currentTheme = id;

    paintDots(themeDots, def.swatch);
    $$('.theme-opt', themeList).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme') === id));
    });

    // Trình duyệt ở chế độ riêng tư có thể chặn localStorage — bỏ qua, không lỗi
    try { localStorage.setItem(THEME_KEY, id); } catch (err) { /* bỏ qua */ }
  }

  // Dựng danh sách theme từ themes.js (thêm theme mới ở file đó là tự hiện ra đây)
  themeIds.forEach(function (id) {
    var li  = document.getElementById('tpl-theme-opt').content.firstElementChild.cloneNode(true);
    var btn = li.querySelector('.theme-opt');
    btn.setAttribute('data-theme', id);
    paintDots(btn.querySelector('.theme-opt__dots'), WEDDING_THEMES[id].swatch);
    btn.addEventListener('click', function () {
      applyTheme(id, true);
      announce(W.t(CFG.ui.themeTitle) + ': ' + W.t(WEDDING_THEMES[id].name));
    });
    themeList.appendChild(li);
  });

  function renderThemeNames() {
    $$('.theme-opt', themeList).forEach(function (b) {
      var def = WEDDING_THEMES[b.getAttribute('data-theme')];
      $('.theme-opt__name', b).textContent = W.t(def.name);
    });
    themeBtn.setAttribute('aria-label', W.t(CFG.ui.themeSwitch));
  }

  function setThemePanel(open) {
    themePanel.hidden = !open;
    themeBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      document.addEventListener('keydown', onThemeKey);
      document.addEventListener('click', onThemeOutside, true);
    } else {
      document.removeEventListener('keydown', onThemeKey);
      document.removeEventListener('click', onThemeOutside, true);
    }
  }

  function onThemeKey(e) {
    if (e.key === 'Escape') { setThemePanel(false); themeBtn.focus(); }
  }
  function onThemeOutside(e) {
    if (!e.target.closest('.theme-picker')) setThemePanel(false);
  }

  themeBtn.addEventListener('click', function () {
    setThemePanel(themePanel.hidden);
  });

  renderThemeNames();
  W.onLangChange(renderThemeNames);
  applyTheme(currentTheme, false);   // vẽ chấm màu + đánh dấu mục đang chọn

  /* ═════════════════════════════════════════════ 05. ĐẾM NGƯỢC */

  var cdGrid = $('#countdownGrid');
  var cdPast = $('#countdownPast');
  var cdNums = {
    days:    $('[data-cd="days"]'),
    hours:   $('[data-cd="hours"]'),
    minutes: $('[data-cd="minutes"]'),
    seconds: $('[data-cd="seconds"]')
  };
  var targetTime = new Date(CFG.wedding.dateISO).getTime();
  var cdTimer = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function updateCountdown() {
    if (isNaN(targetTime)) {           // dateISO trong config bị sai định dạng
      cdGrid.hidden = true;
      return;
    }

    var diff = targetTime - Date.now();

    if (diff <= 0) {                   // đã qua ngày cưới
      cdGrid.hidden = true;
      cdPast.hidden = false;
      if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
      return;
    }

    var s = Math.floor(diff / 1000);
    cdNums.days.textContent    = String(Math.floor(s / 86400));
    cdNums.hours.textContent   = pad(Math.floor(s / 3600) % 24);
    cdNums.minutes.textContent = pad(Math.floor(s / 60) % 60);
    cdNums.seconds.textContent = pad(s % 60);
  }

  updateCountdown();
  if (targetTime - Date.now() > 0) cdTimer = setInterval(updateCountdown, 1000);

  /* ══════════════════════════════════════════════ 05b. SLIDE ẢNH */

  var slideTrack  = $('#slideTrack');
  var slideDots   = $('#slideDots');
  var slideProg   = $('#slideProgress');
  var slideToggle = $('#slideToggle');
  var slides      = $$('.slide', slideTrack);
  var dots        = $$('.slideshow__dot', slideDots);
  var slideCount  = slides.length;

  var slideIndex   = 0;
  var slideTimer   = null;
  var slidePlaying = false;
  var slideLoaded  = [];      // đánh dấu ảnh nào đã nạp

  var SLIDE_MS = CFG.slideshow.intervalMs || 5200;
  slideProg.style.setProperty('--slide-duration', SLIDE_MS + 'ms');

  // Chỉ nạp ảnh khi sắp cần tới. Nhờ vậy mở trang chỉ tải 3 ảnh thay vì cả 6.
  function ensureSlideImage(i) {
    if (i < 0 || i >= slideCount || slideLoaded[i]) return;
    slideLoaded[i] = true;
    W.attachImage(
      slides[i].querySelector('img'),
      CFG.slideshow.items[i].src,
      'assets/img/placeholder/ph-' + ((i % 8) + 1) + '.svg'
    );
  }

  function showSlide(i, announceIt) {
    slideIndex = (i + slideCount) % slideCount;   // vòng lại đầu/cuối

    // Nạp ảnh đang xem + 2 ảnh kề để bấm tiếp/lùi là có ngay
    ensureSlideImage(slideIndex);
    ensureSlideImage(slideIndex + 1);
    ensureSlideImage(slideIndex - 1);
    if (slideIndex === 0) ensureSlideImage(slideCount - 1);
    if (slideIndex === slideCount - 1) ensureSlideImage(0);

    slides.forEach(function (el, n) {
      var on = n === slideIndex;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', String(!on));
    });
    dots.forEach(function (d, n) {
      if (n === slideIndex) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });

    restartProgress();

    if (announceIt) {
      announce(W.t(CFG.slideshow.label) + ': ' + (slideIndex + 1) + ' / ' + slideCount);
    }
  }

  // Khởi động lại vạch tiến trình: phải ép trình duyệt tính lại layout
  // (đọc offsetWidth) thì animation mới chạy lại từ đầu.
  function restartProgress() {
    slideProg.classList.remove('is-running');
    if (!slidePlaying || reduceMotion.matches) return;
    void slideProg.offsetWidth;
    slideProg.classList.add('is-running');
  }

  function setSlidePlaying(on, announceIt) {
    slidePlaying = on;
    clearInterval(slideTimer);
    slideTimer = null;

    if (on) slideTimer = setInterval(function () { showSlide(slideIndex + 1, false); }, SLIDE_MS);

    slideToggle.setAttribute('aria-pressed', String(!on));
    slideToggle.setAttribute('aria-label', W.t(on ? CFG.slideshow.pause : CFG.slideshow.play));
    $('use', slideToggle).setAttribute('href', on ? '#ic-pause' : '#ic-play');
    restartProgress();

    if (announceIt) announce(W.t(on ? CFG.slideshow.play : CFG.slideshow.pause));
  }

  // Khách tự bấm chuyển ảnh thì dừng tự chạy — tránh giật khỏi tay người dùng
  function slideManual(i) {
    if (slidePlaying) setSlidePlaying(false, false);
    showSlide(i, true);
  }

  $('#slidePrev').addEventListener('click', function () { slideManual(slideIndex - 1); });
  $('#slideNext').addEventListener('click', function () { slideManual(slideIndex + 1); });
  slideToggle.addEventListener('click', function () { setSlidePlaying(!slidePlaying, true); });

  slideDots.addEventListener('click', function (e) {
    var dot = e.target.closest('.slideshow__dot');
    if (dot) slideManual(parseInt(dot.getAttribute('data-goto'), 10));
  });

  // Phím mũi tên khi con trỏ bàn phím đang ở trong khu vực slide
  $('#moments').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); slideManual(slideIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); slideManual(slideIndex + 1); }
  });

  // Vuốt trái/phải trên điện thoại
  var touchX = null, touchY = null;
  var stage = $('#slideStage');
  stage.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    // Chỉ tính là vuốt ngang khi đi ngang đủ xa VÀ rõ hơn đi dọc,
    // nếu không sẽ cướp mất thao tác cuộn trang của khách.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      slideManual(slideIndex + (dx < 0 ? 1 : -1));
    }
    touchX = touchY = null;
  }, { passive: true });

  // Tạm dừng khi rê chuột vào hoặc khi tab bị ẩn (đỡ tốn pin, đỡ trôi ảnh oan)
  var pausedByHover = false;
  $('#moments').addEventListener('mouseenter', function () {
    if (slidePlaying) { pausedByHover = true; setSlidePlaying(false, false); }
  });
  $('#moments').addEventListener('mouseleave', function () {
    if (pausedByHover) { pausedByHover = false; setSlidePlaying(true, false); }
  });

  var pausedByHidden = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && slidePlaying) {
      pausedByHidden = true; setSlidePlaying(false, false);
    } else if (!document.hidden && pausedByHidden) {
      pausedByHidden = false; setSlidePlaying(true, false);
    }
  });

  // Nhãn nút tạm dừng cũng phải đổi khi khách chuyển ngôn ngữ
  W.onLangChange(function () {
    slideToggle.setAttribute('aria-label', W.t(slidePlaying ? CFG.slideshow.pause : CFG.slideshow.play));
  });

  showSlide(0, false);
  // Tôn trọng prefers-reduced-motion: không tự chạy, khách tự bấm chuyển
  setSlidePlaying(CFG.slideshow.autoplay && !reduceMotion.matches, false);

  /* ═══════════════════════════════════ 06. HIỆN DẦN KHI CUỘN (reveal) */

  var revealables = $$('[data-reveal]');

  // Các phần tử cùng cha xuất hiện lệch nhau một chút cho tự nhiên
  revealables.forEach(function (node) {
    var siblings = $$('[data-reveal]', node.parentElement)
      .filter(function (n) { return n.parentElement === node.parentElement; });
    if (siblings.length > 1) {
      var i = siblings.indexOf(node);
      node.style.setProperty('--delay', Math.min(i * 90, 360) + 'ms');
    }
  });

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    // Tôn trọng prefers-reduced-motion: hiện hết ngay, không quan sát gì cả
    revealables.forEach(function (n) { n.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (n) { revealObserver.observe(n); });

    // Lưới an toàn: nếu vì lý do nào đó (font tải xong làm xô lệch bố cục,
    // trình duyệt chưa kịp phát frame...) observer bỏ sót phần tử đang nằm
    // trong khung nhìn, thì phần tử đó sẽ bị kẹt ở opacity:0 — tức là khách
    // vào trang thấy nút CTA biến mất. Quét lại sau khi trang và font tải xong.
    var sweep = function () {
      revealables.forEach(function (n) {
        if (n.classList.contains('is-visible')) return;
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          n.classList.add('is-visible');
          revealObserver.unobserve(n);
        }
      });
    };

    window.addEventListener('load', sweep);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sweep);
    setTimeout(sweep, 1200);
  }

  /* ═══════════════════════════════════════ 07. VẼ DẦN ĐƯỜNG DÂY LEO */

  var timeline = $('#timeline');
  var vinePath = $('#vinePath');

  if (vinePath && timeline) {
    if (reduceMotion.matches) {
      vinePath.style.strokeDashoffset = '0';
    } else {
      vinePath.style.strokeDasharray = '1';
      vinePath.style.strokeDashoffset = '1';

      var ticking = false;
      var drawVine = function () {
        var r = timeline.getBoundingClientRect();
        var startAt = window.innerHeight * 0.82;   // bắt đầu vẽ khi timeline lên tới 82% màn hình
        var progress = (startAt - r.top) / (r.height * 0.78);
        vinePath.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, progress)));
        ticking = false;
      };
      var onScrollVine = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(drawVine);
      };

      drawVine();
      window.addEventListener('scroll', onScrollVine, { passive: true });
      window.addEventListener('resize', onScrollVine);
    }
  }

  /* ═══════════════════════════════════ 07b. XEM ẢNH PHÓNG TO (LIGHTBOX) */

  var lb        = $('#lightbox');
  var lbImage   = $('#lbImage');
  var lbCaption = $('#lbCaption');
  var lbCounter = $('#lbCounter');
  var galleryGrid = $('#galleryGrid');
  var tiles     = $$('.photo--tile', galleryGrid);

  var lbIndex   = 0;
  var lbOpen    = false;
  var lbOpener  = null;   // ô ảnh đã bấm, để trả focus về đúng chỗ khi đóng

  function lbSrcOf(i) {
    // Lấy src ĐANG hiển thị thật của ô ảnh, không lấy từ config:
    // attachImage() có thể đã đổi sang đuôi khác hoặc rơi về ảnh placeholder.
    var img = tiles[i].querySelector('img');
    return img.currentSrc || img.src;
  }

  function lbShow(i, announceIt) {
    lbIndex = (i + tiles.length) % tiles.length;      // vòng lại đầu/cuối

    lbImage.src = lbSrcOf(lbIndex);
    lbImage.alt = tiles[lbIndex].querySelector('img').alt || '';
    lbCaption.textContent = W.t(CFG.gallery.items[lbIndex].caption);
    lbCounter.textContent = (lbIndex + 1) + ' / ' + tiles.length;

    // Nạp sẵn 2 ảnh kề để bấm tiếp/lùi hiện ra ngay, không chớp trắng
    [lbIndex + 1, lbIndex - 1].forEach(function (n) {
      var k = (n + tiles.length) % tiles.length;
      var pre = new Image();
      pre.src = lbSrcOf(k);
    });

    if (announceIt) announce(lbCaption.textContent + ' — ' + lbCounter.textContent);
  }

  function lbFocusable() {
    return [$('#lbPrev'), $('#lbNext'), $('#lbClose')].filter(Boolean);
  }

  function lbKeydown(e) {
    if (e.key === 'Escape') {
      // Chặn lan ra ngoài để Esc không đóng nhầm menu hay bảng chọn theme
      e.stopPropagation();
      lbClose();
      return;
    }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); lbShow(lbIndex - 1, true); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lbIndex + 1, true); return; }

    if (e.key !== 'Tab') return;
    // Giữ Tab quẩn trong khung xem ảnh, không cho lọt ra trang phía sau
    var items = lbFocusable();
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function lbOpenAt(i, opener) {
    if (lbOpen) return;
    lbOpen = true;
    lbOpener = opener || null;

    lbShow(i, false);
    lb.hidden = false;
    void lb.offsetWidth;              // ép tính lại layout để transition chạy
    lb.classList.add('is-open');

    lockScroll(true);
    document.addEventListener('keydown', lbKeydown, true);
    $('#lbClose').focus();
  }

  function lbClose() {
    if (!lbOpen) return;
    lbOpen = false;

    lb.classList.remove('is-open');
    document.removeEventListener('keydown', lbKeydown, true);
    lockScroll(false);

    var hide = function () { lb.hidden = true; lbImage.removeAttribute('src'); };
    if (reduceMotion.matches) hide();
    else setTimeout(hide, 280);       // đợi hiệu ứng mờ dần xong mới ẩn hẳn

    if (lbOpener) { lbOpener.focus(); lbOpener = null; }
  }

  // Bấm vào ô ảnh trong album
  galleryGrid.addEventListener('click', function (e) {
    var tile = e.target.closest('.photo--tile');
    if (!tile) return;
    lbOpenAt(tiles.indexOf(tile), tile);
  });

  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1, true); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1, true); });

  // Bấm ra vùng nền tối thì đóng, nhưng bấm trúng ảnh thì không
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lightbox__figure')) lbClose();
  });

  // Vuốt ngang trên điện thoại
  var lbTouchX = null, lbTouchY = null;
  lb.addEventListener('touchstart', function (e) {
    lbTouchX = e.changedTouches[0].clientX;
    lbTouchY = e.changedTouches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (lbTouchX === null) return;
    var dx = e.changedTouches[0].clientX - lbTouchX;
    var dy = e.changedTouches[0].clientY - lbTouchY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      lbShow(lbIndex + (dx < 0 ? 1 : -1), true);
    }
    lbTouchX = lbTouchY = null;
  }, { passive: true });

  // Đổi ngôn ngữ lúc đang mở ảnh thì caption phải đổi theo
  W.onLangChange(function () {
    if (lbOpen) lbCaption.textContent = W.t(CFG.gallery.items[lbIndex].caption);
  });

  /* ═══════════════════════════════════════════════════ 08. FORM RSVP */

  var form        = $('#rsvpForm');
  var thanks      = $('#rsvpThanks');
  var guestsField = $('#guestsField');
  var sessionField= $('#sessionField');

  function attendValue() {
    var picked = form.querySelector('input[name="attend"]:checked');
    return picked ? picked.value : '';
  }

  // Chọn "không tham dự" → ẩn và bỏ qua phần số lượng khách + buổi tham dự
  function syncConditional() {
    var skip = attendValue() === 'no';
    guestsField.classList.toggle('is-hidden', skip);
    sessionField.classList.toggle('is-hidden', skip);
    if (skip) { clearError('errGuests'); clearError('errSession'); }
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'attend') syncConditional();
  });

  function showError(id, msg, field) {
    var box = document.getElementById(id);
    box.textContent = msg;
    box.hidden = false;
    if (field) field.setAttribute('aria-invalid', 'true');
  }

  function clearError(id, field) {
    var box = document.getElementById(id);
    if (box) { box.textContent = ''; box.hidden = true; }
    if (field) field.removeAttribute('aria-invalid');
  }

  function validate() {
    var E = CFG.rsvp.errors;
    var nameEl  = $('#rsvpName');
    var phoneEl = $('#rsvpPhone');
    var guestEl = $('#rsvpGuests');
    var firstBad = null;

    ['errName', 'errPhone', 'errAttend', 'errGuests', 'errSession'].forEach(function (id) { clearError(id); });
    [nameEl, phoneEl, guestEl].forEach(function (n) { n.removeAttribute('aria-invalid'); });

    // Họ tên
    if (nameEl.value.trim().length < 2) {
      showError('errName', W.t(E.name), nameEl);
      firstBad = firstBad || nameEl;
    }

    // Số điện thoại — bỏ dấu cách/chấm/gạch rồi mới kiểm tra
    var phone = phoneEl.value.replace(/[\s.\-()]/g, '');
    if (!/^(0\d{8,10}|\+84\d{8,10})$/.test(phone)) {
      showError('errPhone', W.t(E.phone), phoneEl);
      firstBad = firstBad || phoneEl;
    }

    // Có tham dự hay không
    var attend = attendValue();
    if (!attend) {
      showError('errAttend', W.t(E.attend));
      firstBad = firstBad || form.querySelector('input[name="attend"]');
    }

    // Hai trường chỉ bắt buộc khi khách có tới
    var guests = 0;
    var session = '';
    if (attend === 'yes') {
      guests = parseInt(guestEl.value, 10);
      if (isNaN(guests) || guests < 1 || guests > 10) {
        showError('errGuests', W.t(E.guests), guestEl);
        firstBad = firstBad || guestEl;
      }
      var pickedSession = form.querySelector('input[name="session"]:checked');
      session = pickedSession ? pickedSession.value : '';
      if (!session) {
        showError('errSession', W.t(E.session));
        firstBad = firstBad || form.querySelector('input[name="session"]');
      }
    }

    return {
      ok: !firstBad,
      firstBad: firstBad,
      data: {
        name: nameEl.value.trim(),
        phone: phone,
        attending: attend === 'yes',
        guests: attend === 'yes' ? guests : 0,
        session: session,
        message: $('#rsvpMessage').value.trim(),
        lang: W.getLang(),
        submittedAt: new Date().toISOString()
      }
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var result = validate();

    if (!result.ok) {
      if (result.firstBad) result.firstBad.focus();
      return;
    }

    // ── Chưa có backend: dữ liệu in ra Console (F12 → Console) ─────────────
    // Muốn gửi thật? Thay console.log bằng fetch() tới Formspree / Google
    // Apps Script / API của bạn — cấu trúc payload giữ nguyên là được.
    console.log('[RSVP] Dữ liệu khách gửi / guest submission:', result.data);

    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  });

  $('#rsvpReset').addEventListener('click', function () {
    form.reset();
    ['errName', 'errPhone', 'errAttend', 'errGuests', 'errSession'].forEach(function (id) { clearError(id); });
    $$('#rsvpForm [aria-invalid]').forEach(function (n) { n.removeAttribute('aria-invalid'); });
    syncConditional();
    thanks.hidden = true;
    form.hidden = false;
    $('#rsvpName').focus();
  });

  syncConditional();

  /* ═══════════════════════════════════ 09. SAO CHÉP SỐ TÀI KHOẢN */

  // navigator.clipboard chỉ chạy trên HTTPS/localhost — mở bằng file:// thì
  // rơi xuống execCommand để vẫn sao chép được.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; })
        .catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  var copyTimers = {};

  $('#giftList').addEventListener('click', function (e) {
    var btn = e.target.closest('.gift__copy');
    if (!btn) return;

    var value = btn.getAttribute('data-copy');
    var key   = btn.getAttribute('data-index');
    var label = $('.gift__copy-label', btn);
    var icon  = $('.gift__copy-icon use', btn);

    copyText(value).then(function (ok) {
      var msg = W.t(ok ? CFG.gifts.copiedLabel : CFG.gifts.copyFailed);
      label.textContent = msg;
      announce(msg + (ok ? ' — ' + value : ''));

      if (ok) {
        btn.classList.add('is-copied');
        icon.setAttribute('href', '#ic-check');
      }

      clearTimeout(copyTimers[key]);
      copyTimers[key] = setTimeout(function () {
        label.textContent = W.t(CFG.gifts.copyLabel);
        btn.classList.remove('is-copied');
        icon.setAttribute('href', '#ic-copy');
      }, 2400);
    });
  });

  /* ═════════════════════════════════════════ 09b. TRÌNH PHÁT NHẠC NỀN */

  var player = $('#player');

  if (CFG.music && CFG.music.enabled && CFG.music.tracks.length) {
    var audio       = $('#playerAudio');
    var playerFab   = $('#playerFab');
    var playerPanel = $('#playerPanel');
    var pToggle     = $('#playerToggle');
    var pMute       = $('#playerMute');
    var pVolume     = $('#playerVolume');
    var pTitle      = $('#playerTitle');
    var pComposer   = $('#playerComposer');
    var trackBtns   = $$('.player__track');

    var TRACKS    = CFG.music.tracks;
    var trackIdx  = 0;
    var isPlaying = false;

    player.hidden = false;
    audio.volume  = pVolume.value / 100;

    function paintTrack() {
      pTitle.textContent    = TRACKS[trackIdx].title;
      pComposer.textContent = TRACKS[trackIdx].composer;
      trackBtns.forEach(function (b, i) {
        if (i === trackIdx) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }

    function paintPlayState() {
      player.classList.toggle('is-playing', isPlaying);
      pToggle.setAttribute('aria-pressed', String(isPlaying));
      pToggle.setAttribute('aria-label', W.t(isPlaying ? CFG.music.pause : CFG.music.play));
      $('use', pToggle).setAttribute('href', isPlaying ? '#ic-pause' : '#ic-play');
    }

    // Chỉ gán src khi thực sự cần phát. audio có preload="none" nên mở trang
    // KHÔNG tải file mp3 nào (4 bài cộng lại ~23 MB).
    function loadTrack(i, andPlay) {
      trackIdx = (i + TRACKS.length) % TRACKS.length;
      audio.src = TRACKS[trackIdx].file;
      paintTrack();
      if (andPlay) startPlay();
    }

    function startPlay() {
      // play() trả về Promise và SẼ bị từ chối nếu trình duyệt chặn
      // (chưa có tương tác người dùng) hoặc file lỗi — phải bắt, nếu không
      // nút sẽ hiện "đang phát" trong khi thực tế im lặng.
      var p = audio.play();
      if (p && p.catch) {
        p.catch(function () {
          isPlaying = false;
          paintPlayState();
          announce(W.t(CFG.music.error));
        });
      }
    }

    pToggle.addEventListener('click', function () {
      if (isPlaying) {
        audio.pause();
      } else {
        if (!audio.getAttribute('src')) loadTrack(trackIdx, false);
        startPlay();
      }
    });

    $('#playerPrev').addEventListener('click', function () { loadTrack(trackIdx - 1, isPlaying); });
    $('#playerNext').addEventListener('click', function () { loadTrack(trackIdx + 1, isPlaying); });

    // Bấm thẳng vào bài bất kỳ trong danh sách
    $('#playerList').addEventListener('click', function (e) {
      var btn = e.target.closest('.player__track');
      if (!btn) return;
      loadTrack(parseInt(btn.getAttribute('data-track'), 10), true);
      announce(W.t(CFG.music.nowPlaying) + ': ' + TRACKS[trackIdx].title);
    });

    // Hết bài thì tự sang bài kế, hết danh sách thì quay lại bài đầu
    audio.addEventListener('ended', function () { loadTrack(trackIdx + 1, true); });

    audio.addEventListener('play',  function () { isPlaying = true;  paintPlayState(); });
    audio.addEventListener('pause', function () { isPlaying = false; paintPlayState(); });
    audio.addEventListener('error', function () {
      isPlaying = false; paintPlayState(); announce(W.t(CFG.music.error));
    });

    pVolume.addEventListener('input', function () {
      audio.volume = pVolume.value / 100;
      if (audio.muted && audio.volume > 0) { audio.muted = false; paintMute(); }
    });

    function paintMute() {
      pMute.setAttribute('aria-pressed', String(audio.muted));
      pMute.setAttribute('aria-label', W.t(audio.muted ? CFG.music.unmute : CFG.music.mute));
      $('use', pMute).setAttribute('href', audio.muted ? '#ic-volume-off' : '#ic-volume');
    }
    pMute.addEventListener('click', function () { audio.muted = !audio.muted; paintMute(); });

    // ── Mở/đóng bảng điều khiển ───────────────────────────────────────────
    function setPlayerPanel(open) {
      playerPanel.hidden = !open;
      playerFab.setAttribute('aria-expanded', String(open));
      playerFab.setAttribute('aria-label', W.t(open ? CFG.music.close : CFG.music.open));
      if (open) {
        document.addEventListener('keydown', playerKey);
        document.addEventListener('click', playerOutside, true);
      } else {
        document.removeEventListener('keydown', playerKey);
        document.removeEventListener('click', playerOutside, true);
      }
    }
    function playerKey(e) {
      if (e.key === 'Escape') { setPlayerPanel(false); playerFab.focus(); }
    }
    function playerOutside(e) {
      if (!e.target.closest('.player')) setPlayerPanel(false);
    }
    playerFab.addEventListener('click', function () { setPlayerPanel(playerPanel.hidden); });

    W.onLangChange(function () {
      paintPlayState();
      paintMute();
      playerFab.setAttribute('aria-label',
        W.t(playerPanel.hidden ? CFG.music.open : CFG.music.close));
    });

    paintTrack();
    paintPlayState();
    paintMute();
    playerFab.setAttribute('aria-label', W.t(CFG.music.open));
  }

  /* ═════════════════════════════════════════════ 10. ACCORDION FAQ */

  $('#faqList').addEventListener('click', function (e) {
    var btn = e.target.closest('.faq__q');
    if (!btn) return;
    var item = btn.closest('.faq__item');
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    item.classList.toggle('is-open', !open);
  });

})();
