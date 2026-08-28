/* ==========================================================================
   render.js — Đổ dữ liệu từ config.js vào DOM + xử lý song ngữ VI/EN
   --------------------------------------------------------------------------
   Bạn KHÔNG cần sửa file này. Mọi nội dung nằm ở config.js.

   Cách hoạt động:
   - Cấu trúc DOM được dựng MỘT LẦN lúc tải trang (renderStructure).
   - Khi đổi ngôn ngữ chỉ chạy lại applyI18n() để thay chữ,
     nên form đang điền dở hay FAQ đang mở đều không bị reset.

   Ba thuộc tính đánh dấu trong HTML:
     data-i18n="đường.dẫn"            → textContent = bản dịch theo ngôn ngữ
     data-bind="đường.dẫn"            → textContent = giá trị thô (tên, số TK...)
     data-i18n-attr="alt:đường.dẫn"   → gán bản dịch vào thuộc tính (nhiều cái
                                        thì ngăn bằng dấu phẩy)
   ========================================================================== */

window.Wedding = (function () {
  'use strict';

  // config.js khai báo `const WEDDING_CONFIG` — const ở top-level KHÔNG gắn vào
  // window, nên phải tham chiếu thẳng tên biến (hai file cùng global scope).
  var CFG = WEDDING_CONFIG;
  var LANGS = ['vi', 'en'];
  var lang = 'vi';
  var langHooks = [];

  /* ------------------------------------------------------------ tiện ích */

  // Lấy giá trị theo đường dẫn kiểu 'story.milestones.0.title'
  function get(path) {
    return String(path).split('.').reduce(function (acc, key) {
      return (acc === null || acc === undefined) ? acc : acc[key];
    }, CFG);
  }

  // Trả về chuỗi theo ngôn ngữ hiện tại; chuỗi thường thì trả nguyên vẹn
  function t(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return value[lang] !== undefined ? value[lang] : (value.vi || '');
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function tpl(id) {
    var node = document.getElementById(id);
    return node.content.firstElementChild.cloneNode(true);
  }

  function mark(node, sel, type, path) {
    var target = sel ? node.querySelector(sel) : node;
    if (target) target.setAttribute(type, path);
    return target;
  }

  /* --------------------------------------------------------------- ẢNH
     Thứ tự thử: đường dẫn trong config → cùng tên nhưng đuôi khác →
     cuối cùng là ảnh placeholder trong assets/img/placeholder/.

     Nhờ vậy bạn chỉ cần thả ảnh vào assets/img/ với đúng tên
     (hero.jpg, photo-1.jpg, ...) là trang tự dùng ảnh thật, không sửa code.
     Đuôi .jpg / .jpeg / .png / .webp đều nhận.                            */

  var EXT = ['jpg', 'jpeg', 'png', 'webp'];

  function candidates(path) {
    if (!path) return [];
    var list = [path];
    var m = /^(.*)\.([a-z0-9]+)$/i.exec(path);
    if (m) {
      EXT.forEach(function (e) {
        var alt = m[1] + '.' + e;
        if (list.indexOf(alt) === -1) list.push(alt);
      });
    }
    return list;
  }

  function attachImage(img, path, placeholder) {
    var queue = candidates(path);
    var i = 0;
    var figure = img.closest('.photo, .gift__qr');

    function next() {
      if (i < queue.length) {
        img.src = queue[i++];
      } else {
        img.removeEventListener('error', next);
        img.src = placeholder;
        if (figure) figure.setAttribute('data-placeholder', 'true');
      }
    }

    img.addEventListener('error', next);
    img.addEventListener('load', function () {
      img.removeEventListener('error', next);
    }, { once: true });
    next();
  }

  /* ------------------------------------------------- DỰNG DOM (một lần) */

  function renderNav() {
    var list = document.getElementById('navList');
    CFG.nav.forEach(function (item, i) {
      var li = tpl('tpl-nav-link');
      var a = li.querySelector('.nav__link');
      a.href = '#' + item.id;
      a.setAttribute('data-i18n', 'nav.' + i + '.label');
      a.setAttribute('data-section', item.id);
      list.appendChild(li);
    });
  }

  function renderHero() {
    attachImage(
      document.getElementById('heroPhoto'),
      CFG.hero.photo,
      'assets/img/placeholder/ph-hero.svg'
    );
    document.getElementById('heroPhoto')
      .setAttribute('data-i18n-attr', 'alt:hero.photoAlt');
  }

  function renderSlideshow() {
    var track = document.getElementById('slideTrack');
    var dots  = document.getElementById('slideDots');
    var items = CFG.slideshow.items;

    items.forEach(function (item, i) {
      var fig = tpl('tpl-slide');
      fig.setAttribute('data-index', i);
      // Nhãn "3 / 6" cho trình đọc màn hình biết đang ở ảnh nào
      fig.setAttribute('aria-label', (i + 1) + ' / ' + items.length);

      var img = fig.querySelector('img');
      img.setAttribute('data-i18n-attr', 'alt:slideshow.items.' + i + '.caption');
      // KHÔNG gắn src ở đây. main.js chỉ nạp ảnh đang xem và 2 ảnh kề bên,
      // tránh tải cả 6 ảnh (~1,4 MB) ngay khi mở trang trên 3G/4G.
      mark(fig, '.slide__caption', 'data-i18n', 'slideshow.items.' + i + '.caption');
      track.appendChild(fig);

      var li  = tpl('tpl-slide-dot');
      var btn = li.querySelector('.slideshow__dot');
      btn.setAttribute('data-goto', i);
      btn.setAttribute('data-i18n-attr', 'aria-label:slideshow.goTo');
      btn.setAttribute('data-goto-number', i + 1);
      dots.appendChild(li);
    });
  }

  function renderTracks() {
    if (!CFG.music || !CFG.music.enabled) return;
    var list = document.getElementById('playerList');
    CFG.music.tracks.forEach(function (track, i) {
      var li  = tpl('tpl-track');
      var btn = li.querySelector('.player__track');
      btn.setAttribute('data-track', i);
      // Tên bài và tên nhạc sĩ là danh từ riêng → data-bind (không dịch)
      mark(li, '.player__track-title',    'data-bind', 'music.tracks.' + i + '.title');
      mark(li, '.player__track-composer', 'data-bind', 'music.tracks.' + i + '.composer');
      list.appendChild(li);
    });
  }

  function renderTimeline() {
    var list = document.getElementById('timelineList');
    CFG.story.milestones.forEach(function (_, i) {
      var li = tpl('tpl-milestone');
      var base = 'story.milestones.' + i + '.';
      mark(li, '.milestone__date',  'data-i18n', base + 'date');
      mark(li, '.milestone__title', 'data-i18n', base + 'title');
      mark(li, '.milestone__body',  'data-i18n', base + 'body');
      list.appendChild(li);
    });
  }

  function renderEvents() {
    var wrap = document.getElementById('eventList');
    CFG.events.items.forEach(function (ev, i) {
      var card = tpl('tpl-event');
      var base = 'events.items.' + i + '.';
      mark(card, '.event__host',     'data-i18n', base + 'host');
      mark(card, '.event__kind',     'data-i18n', base + 'kind');
      mark(card, '.event__dateline', 'data-i18n', base + 'dateLine');
      mark(card, '.event__time',     'data-bind', base + 'time');
      mark(card, '.event__venue',    'data-bind', base + 'venue');
      mark(card, '.event__address',  'data-bind', base + 'address');

      var link = card.querySelector('.event__map');
      link.href = ev.mapUrl;
      link.querySelector('span').setAttribute('data-i18n', 'events.mapLabel');
      // Nêu rõ đây là link tới bản đồ của địa điểm nào (cho trình đọc màn hình)
      link.setAttribute('data-i18n-attr', 'aria-label:events.mapLabel');

      wrap.appendChild(card);
    });
  }

  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    CFG.gallery.items.forEach(function (item, i) {
      var fig = tpl('tpl-gallery-item');
      fig.setAttribute('data-area', item.area);
      var img = fig.querySelector('img');
      img.setAttribute('data-i18n-attr', 'alt:gallery.items.' + i + '.caption');
      attachImage(img, item.src, 'assets/img/placeholder/ph-' + ((i % 8) + 1) + '.svg');
      mark(fig, '.photo__caption', 'data-i18n', 'gallery.items.' + i + '.caption');
      grid.appendChild(fig);
    });
  }

  function renderChoices(containerId, options, name, errorId) {
    var box = document.getElementById(containerId);
    options.forEach(function (opt, i) {
      var label = tpl('tpl-choice');
      var input = label.querySelector('input');
      input.name = name;
      input.value = opt.value;
      input.id = name + '-' + opt.value;
      input.setAttribute('aria-describedby', errorId);
      label.setAttribute('for', input.id);
      mark(label, '.choice__text', 'data-i18n',
        'rsvp.' + (name === 'attend' ? 'attendOptions' : 'sessionOptions') + '.' + i + '.label');
      box.appendChild(label);
    });
  }

  function renderRsvp() {
    renderChoices('attendChoices',  CFG.rsvp.attendOptions,  'attend',  'errAttend');
    renderChoices('sessionChoices', CFG.rsvp.sessionOptions, 'session', 'errSession');
    document.getElementById('rsvpName')
      .setAttribute('data-i18n-attr', 'placeholder:rsvp.placeholders.name');
    document.getElementById('rsvpPhone')
      .setAttribute('data-i18n-attr', 'placeholder:rsvp.placeholders.phone');
    document.getElementById('rsvpMessage')
      .setAttribute('data-i18n-attr', 'placeholder:rsvp.placeholders.message');
  }

  function renderGifts() {
    var wrap = document.getElementById('giftList');
    CFG.gifts.accounts.forEach(function (acc, i) {
      var card = tpl('tpl-gift');
      var base = 'gifts.accounts.' + i + '.';
      mark(card, '.gift__side',    'data-i18n', base + 'side');
      mark(card, '.gift__bank',    'data-i18n', base + 'bank');
      mark(card, '.gift__qr-hint', 'data-i18n', 'gifts.qrHint');
      mark(card, '.gift__holder',  'data-bind', base + 'holder');
      mark(card, '.gift__number',  'data-bind', base + 'accountNumber');
      mark(card, '.gift__copy-label', 'data-i18n', 'gifts.copyLabel');

      var qr = card.querySelector('.gift__qr img');
      qr.alt = '';
      attachImage(qr, acc.qr, 'assets/img/placeholder/ph-qr.svg');

      // Copy số tài khoản dạng chỉ chữ số — dán vào app ngân hàng là dùng được ngay
      var btn = card.querySelector('.gift__copy');
      btn.setAttribute('data-copy', String(acc.accountNumber).replace(/\s+/g, ''));
      btn.setAttribute('data-index', i);

      wrap.appendChild(card);
    });
  }

  function renderFaq() {
    var wrap = document.getElementById('faqList');
    CFG.faq.items.forEach(function (_, i) {
      var item = tpl('tpl-faq-item');
      var btn = item.querySelector('.faq__q');
      var panel = item.querySelector('.faq__panel');
      btn.id = 'faq-q-' + i;
      panel.id = 'faq-p-' + i;
      btn.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', btn.id);
      mark(item, '.faq__q-text', 'data-i18n', 'faq.items.' + i + '.q');
      mark(item, '.faq__a',      'data-i18n', 'faq.items.' + i + '.a');
      wrap.appendChild(item);
    });
  }

  function renderStructure() {
    renderNav();
    renderHero();
    renderSlideshow();
    renderTracks();
    renderTimeline();
    renderEvents();
    renderGallery();
    renderRsvp();
    renderGifts();
    renderFaq();
  }

  /* ---------------------------------------------------- ÁP DỤNG NGÔN NGỮ */

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(get(node.getAttribute('data-i18n')));
    });

    document.querySelectorAll('[data-bind]').forEach(function (node) {
      var v = get(node.getAttribute('data-bind'));
      node.textContent = (v === null || v === undefined) ? '' : String(v);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
      node.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length < 2) return;
        node.setAttribute(bits[0].trim(), t(get(bits.slice(1).join(':').trim())));
      });
    });

    // Chấm điều hướng slide: nhãn là "Xem ảnh số" + số thứ tự.
    // Phải chạy SAU vòng lặp data-i18n-attr ở trên vì nó vừa ghi đè aria-label.
    document.querySelectorAll('[data-goto-number]').forEach(function (btn) {
      btn.setAttribute('aria-label',
        t(CFG.slideshow.goTo) + ' ' + btn.getAttribute('data-goto-number'));
    });

    // Thẻ <html lang>, tiêu đề tab và mô tả khi chia sẻ link
    document.documentElement.lang = lang;
    document.title = t(CFG.meta.title);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t(CFG.meta.description));

    // Trạng thái nút chuyển ngôn ngữ
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.setAttribute('aria-label', t(CFG.ui.langSwitch));
      toggle.querySelectorAll('[data-lang-opt]').forEach(function (opt) {
        opt.classList.toggle('is-on', opt.getAttribute('data-lang-opt') === lang);
      });
    }

    // Nút mở/đóng menu (nhãn đổi theo trạng thái)
    var burger = document.getElementById('navBurger');
    if (burger) {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-label', t(open ? CFG.ui.closeMenu : CFG.ui.openMenu));
    }
  }

  function setLang(next) {
    if (LANGS.indexOf(next) === -1 || next === lang) return;
    lang = next;
    applyI18n();

    // Giữ ngôn ngữ trong URL để link chia sẻ mở đúng thứ tiếng.
    // (Không dùng localStorage/sessionStorage.)
    try {
      var url = new URL(window.location.href);
      if (lang === 'vi') url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    } catch (e) { /* file:// ở vài trình duyệt không cho replaceState */ }

    langHooks.forEach(function (fn) { fn(lang); });
  }

  function initLangFromUrl() {
    try {
      var q = new URL(window.location.href).searchParams.get('lang');
      if (q && LANGS.indexOf(q) !== -1) lang = q;
    } catch (e) { /* bỏ qua */ }
  }

  /* --------------------------------------------------------------- KHỞI ĐỘNG */

  initLangFromUrl();
  renderStructure();
  applyI18n();

  return {
    config: CFG,
    get: get,
    t: t,
    applyI18n: applyI18n,
    attachImage: attachImage,   // main.js dùng để nạp ảnh slide khi cần
    setLang: setLang,
    getLang: function () { return lang; },
    onLangChange: function (fn) { langHooks.push(fn); }
  };
})();
