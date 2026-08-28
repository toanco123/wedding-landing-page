/* ==========================================================================
   themes.js — CẤU HÌNH BẢNG MÀU (theme)
   --------------------------------------------------------------------------
   File này CHỈ chứa dữ liệu màu. Không có logic nào ở đây, nên bạn có thể
   thêm/sửa/xoá theme thoải mái mà không sợ vỡ trang.

   ─── THÊM MỘT THEME MỚI ───────────────────────────────────────────────────
   1. Copy nguyên một khối theme bên dưới, đổi khoá (ví dụ 'ocean').
   2. Đổi các mã màu trong `tokens`. Giữ nguyên TÊN các biến --color-*.
   3. Sửa `name` (tên hiện trong bảng chọn) và `swatch`
      (3 màu chấm tròn xem trước: nền · màu phụ trợ · màu chữ).
   4. Xong. Trang tự thêm theme đó vào bảng chọn, không cần sửa file nào khác.

   ─── LƯU Ý VỀ TƯƠNG PHẢN ──────────────────────────────────────────────────
   Toàn bộ màu ở đây đã được kiểm tra đạt chuẩn WCAG AA (chữ ≥ 4.5:1,
   viền focus ≥ 3:1). Nếu tự thêm theme, nên kiểm lại bằng
   https://webaim.org/resources/contrastchecker/ cho các cặp:
     --color-text / --color-bg          --color-text-faint / --color-bg
     --color-text-muted / --color-bg    --color-secondary-text / --color-bg-alt
     --color-on-primary / --color-primary  --color-accent / --color-bg (≥ 3:1)
   ========================================================================== */

const WEDDING_THEMES = {
  /* ── Mộc mạc — xanh sage · kem · nâu gỗ ─────────────────────── */
  rustic: {
    name: { vi: 'Mộc mạc', en: 'Rustic Garden' },
    swatch: ['#FAF7F1', '#A9895B', '#3B4433'],
    tokens: {
      '--color-bg':             '#FAF7F1',
      '--color-bg-alt':         '#F1ECE1',
      '--color-bg-soft':        '#F6F1E7',
      '--color-bg-blur':        'rgba(250,247,241,.72)',
      '--color-bg-blur-on':     'rgba(250,247,241,.92)',
      '--color-surface':        'rgba(255,255,255,.50)',
      '--color-text':           '#3B4433',
      '--color-text-muted':     '#55624A',
      '--color-text-faint':     '#646D5D',
      '--color-primary':        '#3B4433',
      '--color-on-primary':     '#FAF7F1',
      '--color-secondary':      '#A9895B',
      '--color-secondary-text': '#82663E',
      '--color-accent':         '#BD7467',
      '--color-accent-pale':    '#E7CDC6',
      '--color-line':           'rgba(59,68,51,.16)',
      '--color-line-soft':      'rgba(59,68,51,.08)',
      '--color-hover-tint':     'rgba(85,98,74,.07)',
      '--color-overlay':      'rgba(20,23,17,.94)',
      '--color-scrim':          'rgba(20,23,17,.62)',
      '--color-on-scrim':       '#FAF7F1',
      '--color-error':          '#B3261E',
    },
  },

  /* ── Sang trọng — trắng ngà · vàng đồng · nâu trầm ─────────────────────── */
  classic: {
    name: { vi: 'Sang trọng', en: 'Classic Gold' },
    swatch: ['#FBF8F2', '#B99055', '#3A2E23'],
    tokens: {
      '--color-bg':             '#FBF8F2',
      '--color-bg-alt':         '#F3EDE2',
      '--color-bg-soft':        '#F7F2E8',
      '--color-bg-blur':        'rgba(251,248,242,.72)',
      '--color-bg-blur-on':     'rgba(251,248,242,.92)',
      '--color-surface':        'rgba(255,255,255,.52)',
      '--color-text':           '#3A2E23',
      '--color-text-muted':     '#5C4938',
      '--color-text-faint':     '#786753',
      '--color-primary':        '#3A2E23',
      '--color-on-primary':     '#FBF8F2',
      '--color-secondary':      '#B99055',
      '--color-secondary-text': '#866530',
      '--color-accent':         '#8C5A3C',
      '--color-accent-pale':    '#E3D2B8',
      '--color-line':           'rgba(58,46,35,.16)',
      '--color-line-soft':      'rgba(58,46,35,.08)',
      '--color-hover-tint':     'rgba(92,73,56,.07)',
      '--color-overlay':      'rgba(20,16,12,.94)',
      '--color-scrim':          'rgba(20,16,12,.62)',
      '--color-on-scrim':       '#FBF8F2',
      '--color-error':          '#B3261E',
    },
  },

  /* ── Hồng phấn — hồng phấn · trắng · xám nhạt ─────────────────────── */
  blush: {
    name: { vi: 'Hồng phấn', en: 'Romantic Blush' },
    swatch: ['#FDF8F8', '#B98A93', '#4A3A3D'],
    tokens: {
      '--color-bg':             '#FDF8F8',
      '--color-bg-alt':         '#F8EDED',
      '--color-bg-soft':        '#FBF3F3',
      '--color-bg-blur':        'rgba(253,248,248,.72)',
      '--color-bg-blur-on':     'rgba(253,248,248,.92)',
      '--color-surface':        'rgba(255,255,255,.55)',
      '--color-text':           '#4A3A3D',
      '--color-text-muted':     '#6E565B',
      '--color-text-faint':     '#7F676C',
      '--color-primary':        '#8E5F68',
      '--color-on-primary':     '#FDF8F8',
      '--color-secondary':      '#B98A93',
      '--color-secondary-text': '#925E68',
      '--color-accent':         '#C37081',
      '--color-accent-pale':    '#F0D3DA',
      '--color-line':           'rgba(74,58,61,.16)',
      '--color-line-soft':      'rgba(74,58,61,.08)',
      '--color-hover-tint':     'rgba(110,86,91,.07)',
      '--color-overlay':      'rgba(25,20,21,.94)',
      '--color-scrim':          'rgba(25,20,21,.62)',
      '--color-on-scrim':       '#FDF8F8',
      '--color-error':          '#B3261E',
    },
  },

  /* ── Tối giản — trắng · be · xám đá ─────────────────────── */
  minimal: {
    name: { vi: 'Tối giản', en: 'Modern Minimal' },
    swatch: ['#FFFFFF', '#A99C88', '#2E3033'],
    tokens: {
      '--color-bg':             '#FFFFFF',
      '--color-bg-alt':         '#F4F2EE',
      '--color-bg-soft':        '#FAF8F5',
      '--color-bg-blur':        'rgba(255,255,255,.72)',
      '--color-bg-blur-on':     'rgba(255,255,255,.92)',
      '--color-surface':        'rgba(248,247,244,.80)',
      '--color-text':           '#2E3033',
      '--color-text-muted':     '#55585C',
      '--color-text-faint':     '#6B6E72',
      '--color-primary':        '#2E3033',
      '--color-on-primary':     '#FFFFFF',
      '--color-secondary':      '#A99C88',
      '--color-secondary-text': '#766B54',
      '--color-accent':         '#6B7076',
      '--color-accent-pale':    '#DCD9D3',
      '--color-line':           'rgba(46,48,51,.16)',
      '--color-line-soft':      'rgba(46,48,51,.08)',
      '--color-hover-tint':     'rgba(85,88,92,.07)',
      '--color-overlay':      'rgba(16,16,17,.94)',
      '--color-scrim':          'rgba(16,16,17,.62)',
      '--color-on-scrim':       '#FFFFFF',
      '--color-error':          '#B3261E',
    },
  },

  /* ── Mộng mơ — lavender · trắng · bạc ─────────────────────── */
  fairy: {
    name: { vi: 'Mộng mơ', en: 'Fairy Tale' },
    swatch: ['#FBFAFE', '#A9A2C4', '#3B3550'],
    tokens: {
      '--color-bg':             '#FBFAFE',
      '--color-bg-alt':         '#F1EFF9',
      '--color-bg-soft':        '#F7F5FC',
      '--color-bg-blur':        'rgba(251,250,254,.72)',
      '--color-bg-blur-on':     'rgba(251,250,254,.92)',
      '--color-surface':        'rgba(255,255,255,.55)',
      '--color-text':           '#3B3550',
      '--color-text-muted':     '#5B5378',
      '--color-text-faint':     '#6E678A',
      '--color-primary':        '#574B7C',
      '--color-on-primary':     '#FBFAFE',
      '--color-secondary':      '#A9A2C4',
      '--color-secondary-text': '#6F669A',
      '--color-accent':         '#8B7BC0',
      '--color-accent-pale':    '#DAD4EC',
      '--color-line':           'rgba(59,53,80,.16)',
      '--color-line-soft':      'rgba(59,53,80,.08)',
      '--color-hover-tint':     'rgba(91,83,120,.07)',
      '--color-overlay':      'rgba(20,18,28,.94)',
      '--color-scrim':          'rgba(20,18,28,.62)',
      '--color-on-scrim':       '#FBFAFE',
      '--color-error':          '#B3261E',
    },
  },
};

/* Theme dùng khi khách vào lần đầu (phải trùng một khoá ở trên) */
const WEDDING_THEME_DEFAULT = 'rustic';
