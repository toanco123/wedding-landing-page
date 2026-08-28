# Thiệp cưới online — Đoàn Kiều Trang & Nguyễn Việt Toàn

Trang mời cưới một trang (one-page), song ngữ Việt/English, 5 bảng màu chọn được,
chạy bằng HTML/CSS/JS thuần — **không cần cài đặt gì, không cần build**.

---

## 1. Chạy thử

**Cách nhanh nhất:** nháy đúp vào `index.html` là mở được ngay trong trình duyệt.

**Cách nên dùng khi phát triển** (một vài tính năng như sao chép số tài khoản
chạy chuẩn hơn khi có server):

```bash
cd đường/dẫn/tới/weeding-ladingpage
python3 -m http.server 8000
```

Rồi mở <http://localhost:8000>. Dừng server bằng `Ctrl + C`.

---

## 2. Sửa nội dung — chỉ cần mở **một** file

Toàn bộ chữ nghĩa, ngày giờ, địa chỉ, số tài khoản đều nằm trong:

```
assets/js/config.js
```

Mở bằng bất kỳ trình soạn thảo nào (VS Code, Notepad, TextEdit…), tìm dấu **`★ SỬA`**
(Ctrl+F) để nhảy tới từng nhóm. **Không cần đụng tới `render.js` hay `main.js`.**

| Muốn sửa gì | Tìm mục | Ghi chú |
|---|---|---|
| Tên cô dâu / chú rể | `02. CẶP ĐÔI` | `initial` là chữ cái trong monogram ở nav & footer |
| Ngày cưới, đồng hồ đếm ngược | `03. NGÀY & NƠI` | Xem kỹ mục 2.1 bên dưới |
| Menu điều hướng | `04. NAV` | `id` phải trùng `id` của `<section>` trong `index.html` |
| Ảnh hero, nút CTA | `05. HERO` | |
| Câu chuyện tình yêu | `07. CÂU CHUYỆN` | Thêm/bớt mốc thoải mái, đường dây leo tự dài ra |
| Giờ & địa chỉ 2 buổi lễ | `08. SỰ KIỆN` | Kèm link Google Maps |
| Album ảnh | `09. ALBUM ẢNH` | **Đừng đổi** `area` nếu không rành CSS |
| Chữ trong form RSVP | `10. RSVP` | Gồm cả các câu báo lỗi |
| Số tài khoản, ngân hàng, QR | `11. MỪNG CƯỚI` | |
| Câu hỏi thường gặp | `12. FAQ` | |
| Lời cảm ơn ở footer | `13. FOOTER` | |

### 2.1. Đổi ngày cưới (quan trọng)

Đồng hồ đếm ngược chạy theo đúng **một** dòng này:

```js
dateISO: '2026-12-19T11:00:00+07:00',
```

Định dạng: `YYYY-MM-DDTHH:mm:ss+07:00` (`+07:00` là múi giờ Việt Nam).
Sửa xong nhớ sửa luôn mấy dòng hiển thị ngay bên dưới (`dateDisplay`, `dateShort`,
`weekday`) và `dateLine` trong mục **08. SỰ KIỆN** — chúng chỉ là chữ hiển thị,
không tự đổi theo.

> Khi qua ngày cưới, đồng hồ tự thay bằng dòng chữ "Chúng mình đã là của nhau".

### 2.2. Chữ song ngữ

Mỗi chuỗi có 2 phiên bản:

```js
title: { vi: 'Chuyện chúng mình', en: 'Our Story' },
```

Thứ không cần dịch (tên người, số tài khoản, địa chỉ) thì viết thẳng một chuỗi:

```js
holder: 'DOAN KIEU TRANG',
```

Ngôn ngữ được ghi vào URL (`?lang=en`) nên link chia sẻ giữ đúng thứ tiếng.

---

## 3. Thay ảnh — chỉ cần **thả file vào thư mục**

Bỏ ảnh của bạn vào `assets/img/` với đúng các tên sau, trang tự nhận, **không phải sửa code**:

| Tên file | Dùng ở đâu | Tỉ lệ nên dùng |
|---|---|---|
| `hero.jpg` | Ảnh lớn màn hình đầu | Dọc (4:5 hoặc 3:4) |
| `slide-1.jpg` … `slide-6.jpg` | Slide ảnh tự chuyển (dưới màn hình đầu) | **Ngang 16:9** |
| `photo-1.jpg` | Album — ô lớn nằm ngang | Ngang 4:3 |
| `photo-2.jpg` | Album — ô dọc | Dọc 3:4 |
| `photo-3.jpg` | Album — ô vuông | 1:1 |
| `photo-4.jpg` | Album — ô dọc cao | Dọc 2:3 |
| `photo-5.jpg` | Album — ô lớn nằm ngang | Ngang 4:3 |
| `photo-6.jpg` | Album — ô rất cao | Dọc 9:16 |
| `photo-7.jpg` | Album — ô ngang dài | Ngang 2.8:1 |
| `photo-8.jpg` | Album — ô dọc | Dọc 3:4 |
| `qr-bride.png` | Mã QR cô dâu | Vuông |
| `qr-groom.png` | Mã QR chú rể | Vuông |

**Lưu ý:**

- Đuôi file linh hoạt: `.jpg`, `.jpeg`, `.png`, `.webp` đều được. Trang sẽ thử lần lượt.
- Ảnh nào **chưa có** thì tự hiện ảnh minh hoạ vẽ tay trong `assets/img/placeholder/`
  → layout không bao giờ vỡ.
- Muốn đặt tên khác? Sửa đường dẫn trong `config.js` (mục `05. HERO` và `09. ALBUM ẢNH`).
- Nên nén ảnh xuống dưới ~400KB mỗi tấm cho khách xem bằng 3G/4G. Trên macOS:

  ```bash
  sips -Z 1400 --setProperty formatOptions 70 anh-goc.jpg --out assets/img/hero.jpg
  ```

> Ảnh đang có sẵn trong thư mục là **ảnh mẫu miễn phí bản quyền** (nguồn StockSnap,
> giấy phép CC0) chỉ để bạn xem trước bố cục — hãy thay bằng ảnh cưới thật của mình.

---

## 4. Bảng màu (theme)

Trang có sẵn **5 bảng màu**, bấm nút 3 chấm màu trên thanh menu để đổi:

| Theme | Tông màu |
|---|---|
| **Mộc mạc** (mặc định) | xanh sage · kem · nâu gỗ |
| **Sang trọng** | trắng ngà · vàng đồng · nâu trầm |
| **Hồng phấn** | hồng phấn · trắng · xám nhạt |
| **Tối giản** | trắng · be · xám đá |
| **Mộng mơ** | lavender · trắng · bạc |

Lựa chọn được lưu vào trình duyệt (localStorage), khách quay lại vẫn giữ nguyên màu đã chọn.

### 4.1. Thêm một bảng màu mới

Mở `assets/js/themes.js`, copy nguyên một khối theme rồi sửa:

```js
ocean: {
  name: { vi: 'Biển xanh', en: 'Ocean' },
  swatch: ['#F4F9FB', '#7BA7B8', '#22323C'],   // 3 chấm xem trước: nền · phụ trợ · chữ
  tokens: {
    '--color-bg':   '#F4F9FB',
    '--color-text': '#22323C',
    // ... giữ nguyên TÊN các biến, chỉ đổi mã màu
  },
},
```

Lưu file, tải lại trang — theme mới tự xuất hiện trong bảng chọn.
**Không cần sửa file nào khác.**

Muốn đổi theme mặc định thì sửa dòng cuối `themes.js`:

```js
const WEDDING_THEME_DEFAULT = 'rustic';
```

### 4.2. Lưu ý về độ tương phản

Toàn bộ 5 theme sẵn có đã được kiểm tra đạt chuẩn **WCAG AA** (chữ ≥ 4.5:1, viền focus ≥ 3:1).
Nếu tự thêm theme, nên kiểm lại bằng <https://webaim.org/resources/contrastchecker/>
cho các cặp:

- `--color-text` / `--color-bg`
- `--color-text-muted` / `--color-bg`
- `--color-text-faint` / `--color-bg`
- `--color-secondary-text` / `--color-bg-alt`
- `--color-on-primary` / `--color-primary`
- `--color-accent` / `--color-bg` (chỉ cần ≥ 3:1, dùng cho viền focus)

---

## 5. Slide ảnh tự chuyển

Dải ảnh full-bleed nằm ngay dưới màn hình đầu, tự chuyển ảnh và **lặp vô hạn**.

**Khách dùng được bằng:** nút lùi/tiến · bấm thẳng vào chấm tròn · phím mũi tên
trái/phải · **vuốt ngang trên điện thoại** · nút tạm dừng.

Slide tự dừng khi: khách rê chuột vào, khách bấm chuyển tay, hoặc chuyển sang
tab khác (đỡ tốn pin). Máy bật "giảm chuyển động" thì không tự chạy.

### Sửa nội dung

Mở `assets/js/config.js`, tìm mục **`06b. SLIDE ẢNH`**:

```js
slideshow: {
  autoplay:   true,   // false = không tự chuyển, khách phải bấm
  intervalMs: 5200,   // bao lâu sang ảnh kế (mili giây)
  items: [
    { src: 'assets/img/slide-1.jpg', caption: { vi: '…', en: '…' } },
    …
  ],
}
```

- **Thay ảnh:** thả file vào `assets/img/` đúng tên `slide-1.jpg` … `slide-6.jpg`
- **Thêm/bớt ảnh:** thêm/bớt dòng trong `items` — số chấm tròn tự tăng giảm theo
- **Ảnh nên dùng khổ ngang 16:9**; ảnh dọc vẫn chạy nhưng sẽ bị cắt nhiều ở desktop

> Chỉ 3 ảnh được tải khi mở trang, các ảnh còn lại tải dần khi khách bấm tới —
> để khách xem bằng 3G/4G không phải chờ tải cả 6 ảnh.

---

## 6. Xem ảnh phóng to (lightbox)

Bấm vào bất kỳ ô ảnh nào trong Album là mở khung xem cỡ lớn.

**Đóng bằng:** nút X · phím `Esc` · bấm ra vùng nền tối
**Chuyển ảnh bằng:** nút mũi tên · phím `←` `→` · vuốt ngang trên điện thoại

Không cần cấu hình gì — lightbox tự dùng đúng danh sách ảnh trong mục
`09. ALBUM ẢNH` của `config.js`. Thêm/bớt ảnh ở đó là lightbox tự theo.

Nhãn chữ (Đóng / Ảnh trước / Ảnh tiếp theo) nằm cùng mục đó nếu bạn muốn sửa.

---

## 7. Nhạc nền

Nút nốt nhạc ở **góc trái dưới** màn hình. Bấm vào mở bảng điều khiển: phát/dừng,
bài trước/sau, **bấm thẳng vào bài bất kỳ**, tắt tiếng, chỉnh âm lượng.
Hết bài tự sang bài kế, hết danh sách quay lại bài đầu.

### 7.1. Vì sao nhạc không tự phát?

Đây là chủ ý, không phải lỗi. Trình duyệt **chặn** tự phát nhạc có tiếng khi
khách chưa tương tác — và tự phát cũng làm phiền người đang ở nơi yên tĩnh.
Khách phải bấm nút, đó là cách đúng.

### 7.2. Thay nhạc

Thả file vào `assets/audio/` rồi sửa mục **`11b. NHẠC NỀN`** trong `config.js`:

```js
tracks: [
  { file: 'assets/audio/canon-in-d.mp3', title: 'Canon in D', composer: 'Johann Pachelbel' },
  …
],
```

Muốn ẩn hẳn trình phát: đặt `enabled: false` trong cùng mục đó.

### 7.3. ⚠️ Bản quyền nhạc — đọc kỹ

Các bài cưới pop nổi tiếng (*Perfect*, *A Thousand Years*, *All of Me*,
*Marry You*…) **đều còn bản quyền**. Nhúng lên web công khai là vi phạm, và
Facebook/YouTube có thể chặn link của bạn.

Bốn bài mặc định là **nhạc cổ điển đã hết hạn bản quyền**, bản thu tự do —
cũng chính là nhạc cưới nổi tiếng nhất thế giới:

| Bài | Nhạc sĩ | Giấy phép |
|---|---|---|
| Canon in D | Pachelbel | CC BY 3.0 — Kevin MacLeod |
| Bridal Chorus ("Here Comes the Bride") | Wagner | CC BY 3.0 — Kevin MacLeod |
| Wedding March | Mendelssohn | Public Domain |
| Ave Maria | Schubert | Public Domain — U.S. Air Force Band |

Chi tiết nguồn từng bài: `assets/audio/LICENSES.txt`.

> **Hai bài CC BY 3.0 BẮT BUỘC phải ghi công hiển thị được trên trang.**
> Dòng ghi công nằm ở đáy bảng nhạc (`music.credit` trong config) — **đừng xoá**.
> Nếu bạn thay hết bằng nhạc của mình thì mới được bỏ dòng đó.

---

## 8. Hiệu ứng vệt trái tim theo con trỏ

Rê chuột trên trang sẽ để lại các trái tim nhỏ bay lên rồi mờ dần. Màu trái tim
**tự lấy từ theme đang chọn**, nên đổi theme là tim đổi màu ngay lập tức.

Toàn bộ hiệu ứng nằm gọn trong **một file duy nhất**: `assets/js/heart-cursor.js`
(file này tự chèn CSS của nó, không phụ thuộc file nào khác).

### 5.1. Tắt / bật hiệu ứng

Chọn 1 trong 2 cách:

- Mở `assets/js/heart-cursor.js`, đổi dòng đầu khối cấu hình thành `enabled: false`
- Hoặc xoá dòng này trong `index.html`:
  ```html
  <script src="assets/js/heart-cursor.js" defer></script>
  ```

Muốn thử nhanh mà không sửa file, gõ trong Console trình duyệt (F12):

```js
HeartCursor.stop()      // tạm dừng
HeartCursor.start()     // bật lại
HeartCursor.toggle()    // đảo trạng thái
HeartCursor.config      // xem/sửa cấu hình, đổi là ăn ngay
```

### 5.2. Các thông số chỉnh được

Mở `assets/js/heart-cursor.js`, khối `★ SỬA Ở ĐÂY` ngay đầu file:

| Thông số | Mặc định | Ý nghĩa |
|---|---|---|
| `spawnEveryMs` | `85` | Tốc độ tạo tim. Số **nhỏ hơn = tim dày hơn** (40 rất dày, 150 thưa) |
| `minDistance` | `16` | Chuột phải đi đủ bao nhiêu px mới tạo tim mới |
| `maxOnScreen` | `26` | Trần số tim cùng lúc — chặn lag khi rê chuột nhanh |
| `sizeMin` / `sizeMax` | `9` / `19` | Khoảng kích thước tim (px), mỗi tim random trong khoảng này |
| `jitter` | `7` | Độ lệch ngẫu nhiên quanh vị trí con trỏ |
| `lifetimeMs` | `1150` | Tim sống bao lâu rồi biến mất |
| `riseMin` / `riseMax` | `46` / `84` | Bay lên bao nhiêu px |
| `driftMax` | `26` | Độ dạt ngang trái/phải |
| `rotateMax` | `26` | Độ nghiêng tối đa |
| `colorTokens` | 3 token | Lấy màu từ biến theme nào. Muốn 1 màu thì để `['--color-accent']` |
| `opacity` | `0.85` | Độ đậm tối đa |
| `hideDefaultCursor` | `false` | `true` = ẩn luôn con trỏ mặc định (**không khuyến khích**, khó dùng) |
| `onlyWithMouse` | `true` | Tự tắt trên điện thoại/tablet (không có con trỏ chuột) |
| `respectReducedMotion` | `true` | Tự tắt khi hệ điều hành bật "giảm chuyển động" |

### 5.3. Vì sao không gây lag

- Handler `mousemove` chỉ ghi lại toạ độ, **không** tạo phần tử nào. Việc nặng gom
  vào `requestAnimationFrame`, nên mỗi khung hình chỉ xử lý đúng một lần dù chuột
  bắn ra hàng trăm sự kiện mỗi giây.
- Không có vòng lặp chạy nền: chuột đứng yên thì không xin khung hình nào cả.
- Màu theme được đệm lại, chỉ đọc lại khi bạn đổi theme (đọc `getComputedStyle`
  mỗi lần tạo tim sẽ ép trình duyệt tính lại layout → chậm).
- Mỗi trái tim tự xoá khỏi DOM khi bay xong, kèm một hẹn giờ dự phòng.
- Có trần `maxOnScreen`; tự tắt hẳn trên thiết bị cảm ứng.
- Lớp chứa dùng `pointer-events: none` nên **không bao giờ** chắn click hay
  cản việc bôi đen chữ.

---

## 9. Form RSVP — dữ liệu đi đâu?

**Hiện tại chưa nối backend.** Khi khách bấm gửi, dữ liệu được in ra Console
(mở bằng `F12` → tab *Console*):

```js
[RSVP] Dữ liệu khách gửi / guest submission: {
  name: 'Nguyễn Văn A', phone: '0901234567', attending: true,
  guests: 2, session: 'tiec', message: '...', lang: 'vi',
  submittedAt: '2026-08-28T...'
}
```

### Nối vào nơi nhận thật

Mở `assets/js/main.js`, tìm `console.log('[RSVP]`, thay bằng lời gọi `fetch()`.
Giữ nguyên cấu trúc `result.data` là được. Ví dụ với [Formspree](https://formspree.io) (miễn phí):

```js
fetch('https://formspree.io/f/MÃ_CỦA_BẠN', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(result.data)
});
```

Muốn đổ thẳng vào Google Sheets thì dùng Google Apps Script Web App, cách gọi tương tự.

---

## 10. Đưa trang lên mạng

Trang là file tĩnh nên host ở đâu cũng được, đều **miễn phí**:

| Dịch vụ | Cách làm |
|---|---|
| **Netlify Drop** | Vào <https://app.netlify.com/drop>, kéo cả thư mục dự án thả vào. Xong. |
| **Vercel** | `npx vercel` trong thư mục dự án |
| **GitHub Pages** | Đẩy code lên GitHub → Settings → Pages → chọn nhánh `main` |

Sau khi có link, gửi cho khách kèm ngôn ngữ mong muốn:
`https://ten-mien-cua-ban.com/?lang=en`

---

## 11. Cấu trúc dự án

```
weeding-ladingpage/
├── index.html                    Khung trang + các hình SVG vẽ tay + <template>
├── README.md                     File bạn đang đọc
└── assets/
    ├── css/styles.css            Toàn bộ giao diện. Màu sắc chỉ khai báo ở :root
    ├── js/
    │   ├── config.js         ★   NỘI DUNG — file duy nhất bạn cần sửa
    │   ├── themes.js         ★   BẢNG MÀU — sửa khi muốn thêm theme
    │   ├── render.js             Đổ dữ liệu từ config vào DOM + song ngữ
    │   ├── main.js               Đếm ngược, menu, RSVP, sao chép TK, FAQ, theme
    │   └── heart-cursor.js   ★   HIỆU ỨNG TIM — độc lập, xoá được tuỳ ý
    └── audio/                    4 bài nhạc + LICENSES.txt (nguồn & giấy phép)
    └── img/
        ├── hero.jpg, photo-1..8.jpg, slide-1..6.jpg  ← thả ảnh của bạn vào đây
        └── placeholder/               Ảnh minh hoạ khi chưa có ảnh thật
```

---

## 12. Những gì trang này làm được

- Đồng hồ đếm ngược chạy thật tới giờ cưới
- Song ngữ Việt / English, giữ trong URL khi chia sẻ link
- 5 bảng màu, đổi tức thì, nhớ lựa chọn của khách
- Timeline câu chuyện có đường dây leo vẽ dần khi cuộn
- Album ảnh bố cục bất đối xứng (desktop) / masonry 2 cột (mobile)
- Slide ảnh tự chuyển, lặp vô hạn, vuốt được trên điện thoại
- Xem ảnh phóng to: phím mũi tên, Esc, vuốt ngang
- Nhạc nền 4 bài, chọn bài tuỳ ý, chỉnh âm lượng
- Form RSVP có kiểm tra dữ liệu, tự ẩn bớt ô khi khách chọn "không tham dự"
- Sao chép số tài khoản 1 chạm (chạy cả khi mở bằng `file://`)
- FAQ dạng accordion, nút cuộn lên đầu trang
- Vệt trái tim bay theo con trỏ, đồng bộ màu với theme
- Chạy tốt trên điện thoại, dùng được bằng bàn phím, tôn trọng
  `prefers-reduced-motion` (khách bật chế độ giảm chuyển động sẽ không thấy hiệu ứng)

## 13. Những gì **chưa** làm

- Chưa có backend nhận RSVP (xem mục 9)
- Ảnh QR đang là khung minh hoạ — cần thay bằng ảnh QR thật của bạn
