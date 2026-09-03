/* ==========================================================================
   config.js — NGUỒN SỰ THẬT DUY NHẤT / SINGLE SOURCE OF TRUTH
   --------------------------------------------------------------------------
   BẠN CHỈ CẦN SỬA FILE NÀY. Không cần đụng tới render.js hay main.js.

   Quy ước:
   - Chuỗi song ngữ viết dạng  { vi: 'Tiếng Việt', en: 'English' }
   - Chuỗi không cần dịch (tên người, số tài khoản, địa chỉ) viết thẳng: 'abc'
   - Tìm nhanh bằng Ctrl+F với từ khoá:  ★ SỬA
   ========================================================================== */

const WEDDING_CONFIG = {

  /* ---------------------------------------------------------------- 01. META
     ★ SỬA: tiêu đề tab trình duyệt & mô tả khi chia sẻ link
     ---------------------------------------------------------------------- */
  meta: {
    title: {
      vi: 'Kiều Trang & Việt Toàn — Thiệp cưới',
      en: 'Kieu Trang & Viet Toan — Wedding Invitation',
    },
    description: {
      vi: 'Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại 19.12.2026 tại Bắc Giang.',
      en: 'We would be delighted to have you celebrate our wedding day on 19 December 2026 in Bac Giang.',
    },
  },

  /* -------------------------------------------------------------- 02. CẶP ĐÔI
     ★ SỬA: tên cô dâu, chú rể, hashtag đám cưới
     ---------------------------------------------------------------------- */
  couple: {
    bride: { name: 'Đoàn Kiều Trang',  short: 'Kiều Trang', initial: 'T' },
    groom: { name: 'Nguyễn Việt Toàn', short: 'Việt Toàn',  initial: 'T' },
    // Thứ tự hiển thị tên ở hero: 'bride-first' hoặc 'groom-first'
    order: 'bride-first',
    hashtag: '#KieuTrang_VietToan_2026',
  },

  /* --------------------------------------------------------- 03. NGÀY & NƠI
     ★ SỬA: dateISO là mốc để đồng hồ đếm ngược chạy. Định dạng:
        'YYYY-MM-DDTHH:mm:ss+07:00'  (+07:00 là múi giờ Việt Nam)
     ---------------------------------------------------------------------- */
  wedding: {
    dateISO: '2026-12-19T11:00:00+07:00',
    dateDisplay: { vi: '19 tháng 12, 2026', en: 'December 19, 2026' },
    dateShort:   { vi: '19.12.2026',        en: '19.12.2026' },
    weekday:     { vi: 'Thứ Bảy',           en: 'Saturday' },
    city:        { vi: 'Bắc Giang',         en: 'Bac Giang' },
  },

  /* ------------------------------------------------------------------ 04. NAV
     Menu điều hướng. `id` phải trùng với id của <section> trong index.html.
     ---------------------------------------------------------------------- */
  nav: [
    { id: 'story',   label: { vi: 'Chuyện chúng mình', en: 'Our Story' } },
    { id: 'events',  label: { vi: 'Sự kiện',           en: 'Events' } },
    { id: 'gallery', label: { vi: 'Album',             en: 'Gallery' } },
    { id: 'rsvp',    label: { vi: 'Xác nhận',          en: 'RSVP' } },
    { id: 'gifts',   label: { vi: 'Mừng cưới',         en: 'Gifts' } },
    { id: 'faq',     label: { vi: 'Hỏi đáp',           en: 'FAQ' } },
  ],

  /* ----------------------------------------------------------------- 05. HERO
     ★ SỬA: ảnh cưới lớn. Bỏ file vào assets/img/ rồi đổi đường dẫn bên dưới.
     Nếu file không tồn tại, trang tự hiện khung placeholder — layout không vỡ.
     ---------------------------------------------------------------------- */
  hero: {
    eyebrow:  { vi: 'Save the date', en: 'Save the date' },
    invite:   { vi: 'Chúng mình sắp về chung một nhà', en: 'We are getting married' },
    cta:      { vi: 'Xác nhận tham dự', en: 'Confirm attendance' },
    scroll:   { vi: 'Cuộn xuống', en: 'Scroll' },
    photo:    'assets/img/hero.jpg',
    photoAlt: { vi: 'Ảnh cưới của Kiều Trang và Việt Toàn', en: 'Wedding photo of Kieu Trang and Viet Toan' },
  },

  /* ------------------------------------------------------------ 05b. KHÁCH MỜI
     Thiệp riêng theo tên: thêm  ?guest=<tên khách>  vào cuối link.
     Ví dụ:  index.html?guest=Anh%20Nguy%E1%BB%85n%20V%C4%83n%20A

     Có tên  → hero hiện thêm dòng "Trân trọng kính mời / <tên>",
               footer đổi thành "Hẹn gặp <tên>".
     Không có → trang hiện bản chung y như cũ.

     Xưng hô gõ luôn vào tên khi tạo link: "Anh Nguyễn Văn A",
     "Gia đình Bác Bảy", "Cô Lan & Chú Hùng"...
     (Cách tạo link hàng loạt: xem README mục 10.)

     ★ SỬA: câu dẫn trước tên khách
     ---------------------------------------------------------------------- */
  guest: {
    enabled:   true,      // false = tắt hẳn, ?guest= trên link bị bỏ qua
    param:     'guest',   // tên tham số trên URL
    maxLength: 60,        // cắt bớt nếu ai đó dán chuỗi quá dài

    invite:   { vi: 'Trân trọng kính mời', en: 'We cordially invite' },
    farewell: { vi: 'Hẹn gặp',             en: 'See you,' },
  },

  /* ------------------------------------------------------------ 06. COUNTDOWN
     Nhãn của đồng hồ đếm ngược + lời nhắn khi đã qua ngày cưới.
     ---------------------------------------------------------------------- */
  countdown: {
    days:    { vi: 'Ngày',  en: 'Days' },
    hours:   { vi: 'Giờ',   en: 'Hours' },
    minutes: { vi: 'Phút',  en: 'Minutes' },
    seconds: { vi: 'Giây',  en: 'Seconds' },
    past:    { vi: 'Chúng mình đã là của nhau', en: 'We are married' },
  },

  /* ------------------------------------------------------- 06b. SLIDE ẢNH
     ★ SỬA: dải ảnh tự chuyển nằm ngay dưới màn hình đầu.
     Thả ảnh vào assets/img/ đúng tên slide-1.jpg … slide-6.jpg là tự nhận.
     Thêm/bớt ảnh thoải mái — chấm tròn điều hướng tự sinh theo số lượng.
     ---------------------------------------------------------------------- */
  slideshow: {
    eyebrow: { vi: 'Khoảnh khắc', en: 'Moments' },

    autoplay:   true,   // false = không tự chuyển, khách phải bấm
    intervalMs: 5200,   // bao lâu thì sang ảnh kế (mili giây)

    items: [
      { src: 'assets/img/slide-1.jpg', caption: { vi: 'Chiều vàng trên cánh đồng', en: 'Golden hour in the field' } },
      { src: 'assets/img/slide-2.jpg', caption: { vi: 'Sảnh tiệc trước giờ đón khách', en: 'The hall before the guests' } },
      { src: 'assets/img/slide-3.jpg', caption: { vi: 'Nơi chúng mình hay ngồi', en: 'Where we always sit' } },
      { src: 'assets/img/slide-4.jpg', caption: { vi: 'Cắt bánh cưới', en: 'Cutting the cake' } },
      { src: 'assets/img/slide-5.jpg', caption: { vi: 'Một buổi sáng bình thường', en: 'An ordinary morning' } },
      { src: 'assets/img/slide-6.jpg', caption: { vi: 'Hoa của mùa cưới', en: 'Flowers of the season' } },
    ],

    // Nhãn cho trình đọc màn hình và tooltip
    label:  { vi: 'Slide ảnh cưới', en: 'Wedding photo slideshow' },
    prev:   { vi: 'Ảnh trước', en: 'Previous photo' },
    next:   { vi: 'Ảnh tiếp theo', en: 'Next photo' },
    play:   { vi: 'Bật tự chuyển ảnh', en: 'Start slideshow' },
    pause:  { vi: 'Dừng tự chuyển ảnh', en: 'Pause slideshow' },
    goTo:   { vi: 'Xem ảnh số', en: 'Go to photo' },   // sẽ được nối thêm số thứ tự
  },

  /* ---------------------------------------------------- 07. CÂU CHUYỆN TÌNH YÊU
     ★ SỬA: 4 mốc thời gian. Thêm/bớt mốc thoải mái — đường dây leo tự dài ra.
     ---------------------------------------------------------------------- */
  story: {
    number:  '01',
    title:   { vi: 'Chuyện chúng mình', en: 'Our Story' },
    lead:    {
      vi: 'Bốn cột mốc nhỏ, một hành trình dài — và một lời hẹn cho suốt phần đời còn lại.',
      en: 'Four small milestones, one long journey — and a promise for all the years ahead.',
    },
    milestones: [
      {
        date:  { vi: 'Tháng 3, 2019', en: 'March 2019' },
        title: { vi: 'Lần đầu gặp nhau', en: 'The First Meeting' },
        body:  {
          vi: 'Một quán cà phê nhỏ trên phố cổ, trời mưa và chỉ còn đúng một chiếc bàn trống. Chúng mình ngồi chung, nói chuyện tới lúc quán đóng cửa mà vẫn chưa kịp hỏi tên nhau.',
          en: 'A small cafe in the old quarter, rain outside and exactly one table left. We shared it, talked until closing time, and still forgot to ask each other’s name.',
        },
      },
      {
        date:  { vi: 'Tháng 8, 2020', en: 'August 2020' },
        title: { vi: 'Chuyến đi đầu tiên', en: 'Our First Trip' },
        body:  {
          vi: 'Đà Lạt, hai chiếc xe máy và một tấm bản đồ vẽ tay. Lạc đường ba lần, cười nhiều hơn số lần lạc, và nhận ra đi cùng ai quan trọng hơn đi tới đâu.',
          en: 'Da Lat, two motorbikes and a hand-drawn map. We got lost three times, laughed more times than that, and learned that who you travel with matters more than where you go.',
        },
      },
      {
        date:  { vi: 'Tháng 5, 2023', en: 'May 2023' },
        title: { vi: 'Ngôi nhà nhỏ', en: 'A Home of Our Own' },
        body:  {
          vi: 'Căn hộ đầu tiên với ban công đủ chỗ cho mười hai chậu cây. Chúng mình học cách chia nhau việc nhà, chia nhau nỗi lo, và chia nhau những buổi sáng chủ nhật thật chậm.',
          en: 'Our first apartment, with a balcony just big enough for twelve potted plants. We learned to share the chores, share the worries, and share very slow Sunday mornings.',
        },
      },
      {
        date:  { vi: 'Tháng 2, 2026', en: 'February 2026' },
        title: { vi: 'Lời cầu hôn', en: 'The Proposal' },
        body:  {
          vi: 'Vẫn quán cà phê ấy, vẫn trời mưa, vẫn chiếc bàn cạnh cửa sổ. Lần này thì có thêm một chiếc nhẫn — và một câu trả lời không cần suy nghĩ.',
          en: 'The same cafe, the same rain, the same table by the window. This time there was a ring — and an answer that needed no thinking at all.',
        },
      },
    ],
  },

  /* --------------------------------------------------------- 08. SỰ KIỆN CƯỚI
     ★ SỬA: giờ, địa chỉ, và link Google Maps của 2 buổi lễ.
     Lấy link map: mở Google Maps → Chia sẻ → Sao chép liên kết.
     ---------------------------------------------------------------------- */
  events: {
    number: '02',
    title:  { vi: 'Sự kiện', en: 'The Celebrations' },
    lead:   {
      vi: 'Sự hiện diện của bạn là món quà quý nhất với gia đình chúng mình.',
      en: 'Your presence is the greatest gift our families could ask for.',
    },
    mapLabel: { vi: 'Xem bản đồ', en: 'View map' },
    items: [
      {
        kind:     { vi: 'Lễ Vu Quy', en: 'Bride’s Ceremony' },
        host:     { vi: 'Nhà gái', en: 'Bride’s family' },
        time:     '08:30',
        dateLine: { vi: 'Thứ Bảy, 19.12.2026', en: 'Saturday, 19 Dec 2026' },
        venue:    'Tư gia nhà gái',
        address:  'Số 128 đường Nguyễn Thị Lưu, P. Ngô Quyền, TP. Bắc Giang',
        mapUrl:   'https://maps.google.com/?q=Nguyen+Thi+Luu+Ngo+Quyen+Bac+Giang',
      },
      {
        kind:     { vi: 'Tiệc Cưới', en: 'Wedding Reception' },
        host:     { vi: 'Nhà trai', en: 'Groom’s family' },
        time:     '18:00',
        dateLine: { vi: 'Thứ Bảy, 19.12.2026', en: 'Saturday, 19 Dec 2026' },
        venue:    'Trung tâm tiệc cưới Bắc Giang Palace — Sảnh Ngọc Lan',
        address:  'Số 215 đường Hùng Vương, P. Ngô Quyền, TP. Bắc Giang',
        mapUrl:   'https://maps.google.com/?q=Hung+Vuong+Ngo+Quyen+Bac+Giang',
      },
    ],
  },

  /* ------------------------------------------------------------- 09. ALBUM ẢNH
     ★ SỬA: bỏ ảnh vào assets/img/ rồi đổi `src`.
     `area` là vị trí trong lưới masonry (a → h) — ĐỪNG đổi nếu không rành CSS.
     ---------------------------------------------------------------------- */
  gallery: {
    number: '03',
    title:  { vi: 'Album', en: 'Gallery' },
    lead:   {
      vi: 'Một vài khoảnh khắc chúng mình muốn giữ lại.',
      en: 'A few moments we wanted to keep.',
    },
    // Nhãn cho khung xem ảnh phóng to (lightbox)
    lightboxLabel: { vi: 'Xem ảnh phóng to', en: 'Photo viewer' },
    zoomLabel:     { vi: 'Phóng to ảnh',     en: 'Enlarge photo' },
    close:         { vi: 'Đóng',             en: 'Close' },
    prevPhoto:     { vi: 'Ảnh trước',        en: 'Previous photo' },
    nextPhoto:     { vi: 'Ảnh tiếp theo',    en: 'Next photo' },

    items: [
      { area: 'a', src: 'assets/img/photo-1.jpg', caption: { vi: 'Chiều bên hồ',     en: 'By the lake' } },
      { area: 'b', src: 'assets/img/photo-2.jpg', caption: { vi: 'Ngày thử áo',      en: 'The fitting day' } },
      { area: 'c', src: 'assets/img/photo-3.jpg', caption: { vi: 'Lời hẹn',          en: 'The promise' } },
      { area: 'd', src: 'assets/img/photo-4.jpg', caption: { vi: 'Hoa của ngày vui', en: 'Flowers for the day' } },
      { area: 'e', src: 'assets/img/photo-5.jpg', caption: { vi: 'Đôi nhẫn',         en: 'The rings' } },
      { area: 'f', src: 'assets/img/photo-6.jpg', caption: { vi: 'Bó hoa cưới',      en: 'The bridal bouquet' } },
      { area: 'g', src: 'assets/img/photo-7.jpg', caption: { vi: 'Bàn tiệc',         en: 'The reception table' } },
      { area: 'h', src: 'assets/img/photo-8.jpg', caption: { vi: 'Trong vườn',       en: 'In the garden' } },
    ],
  },

  /* -------------------------------------------------------------- 10. RSVP
     ★ SỬA: toàn bộ chữ trong form xác nhận tham dự, và `endpoint` — nơi
     nhận dữ liệu khách gửi lên.

     endpoint để RỖNG  → chưa nối backend, dữ liệu chỉ in ra Console (F12).
                          Trang vẫn chạy bình thường, khách vẫn thấy lời cảm ơn.
     endpoint có URL   → gửi thật bằng fetch(). Cách lấy URL: README mục 9.
     ---------------------------------------------------------------------- */
  rsvp: {
    number: '04',

    // ★ SỬA: dán URL Google Apps Script Web App vào đây (README mục 9)
    // Dạng: 'https://script.google.com/macros/s/AKfy..../exec'
    endpoint: '',
    title:  { vi: 'Xác nhận tham dự', en: 'Kindly RSVP' },
    lead:   {
      vi: 'Vui lòng phản hồi trước ngày 09.12.2026 để gia đình chúng mình chuẩn bị chu đáo nhất.',
      en: 'Please respond before 9 December 2026 so our families can prepare with care.',
    },
    fields: {
      name:     { vi: 'Họ và tên', en: 'Full name' },
      phone:    { vi: 'Số điện thoại', en: 'Phone number' },
      attend:   { vi: 'Bạn có tham dự được không?', en: 'Will you be able to join us?' },
      guests:   { vi: 'Số lượng khách', en: 'Number of guests' },
      session:  { vi: 'Bạn tham dự buổi nào?', en: 'Which celebration will you attend?' },
      message:  { vi: 'Lời nhắn gửi cô dâu chú rể', en: 'A message for the couple' },
    },
    placeholders: {
      name:    { vi: 'Nguyễn Văn A', en: 'Your name' },
      phone:   { vi: '09xx xxx xxx', en: '09xx xxx xxx' },
      message: { vi: 'Chúc hai bạn trăm năm hạnh phúc...', en: 'Wishing you a lifetime of happiness...' },
    },
    optional: { vi: 'không bắt buộc', en: 'optional' },
    attendOptions: [
      { value: 'yes', label: { vi: 'Có, mình sẽ đến', en: 'Yes, I will be there' } },
      { value: 'no',  label: { vi: 'Rất tiếc, mình không đến được', en: 'Sorry, I cannot make it' } },
    ],
    sessionOptions: [
      { value: 'vu-quy',  label: { vi: 'Lễ Vu Quy (buổi sáng)', en: 'Bride’s Ceremony (morning)' } },
      { value: 'tiec',    label: { vi: 'Tiệc Cưới (buổi tối)',  en: 'Reception (evening)' } },
      { value: 'ca-hai',  label: { vi: 'Cả hai buổi',           en: 'Both celebrations' } },
    ],
    submit:  { vi: 'Gửi xác nhận', en: 'Send confirmation' },
    // Chữ trên nút trong lúc đang gửi lên server
    sending: { vi: 'Đang gửi…',    en: 'Sending…' },
    errors: {
      name:    { vi: 'Vui lòng nhập họ tên (ít nhất 2 ký tự).', en: 'Please enter your name (at least 2 characters).' },
      phone:   { vi: 'Số điện thoại chưa đúng định dạng (VD: 0901234567).', en: 'That phone number does not look right (e.g. 0901234567).' },
      attend:  { vi: 'Vui lòng cho chúng mình biết bạn có đến được không.', en: 'Please let us know whether you can join.' },
      guests:  { vi: 'Số khách phải từ 1 đến 10 người.', en: 'Guest count must be between 1 and 10.' },
      session: { vi: 'Vui lòng chọn buổi bạn tham dự.', en: 'Please choose which celebration you will attend.' },
      // Hiện khi bấm gửi mà không tới được server (mất mạng, endpoint sai...)
      send:    {
        vi: 'Gửi không thành công. Bạn kiểm tra kết nối mạng rồi bấm gửi lại giúp mình nhé.',
        en: 'We could not send your response. Please check your connection and try again.',
      },
    },
    successTitle: { vi: 'Cảm ơn bạn rất nhiều!', en: 'Thank you so much!' },
    successBody:  {
      vi: 'Chúng mình đã nhận được phản hồi của bạn. Hẹn gặp bạn trong ngày vui sắp tới nhé!',
      en: 'We have received your response. We cannot wait to celebrate with you!',
    },
    successAgain: { vi: 'Gửi phản hồi khác', en: 'Send another response' },
  },

  /* --------------------------------------------------------- 11. MỪNG CƯỚI
     ★ SỬA: thông tin ngân hàng. Ảnh QR: bỏ file vào assets/img/ rồi đổi `qr`.
     Không có file QR thì trang hiện khung placeholder, không lỗi.
     ---------------------------------------------------------------------- */
  gifts: {
    number: '05',
    title:  { vi: 'Mừng cưới', en: 'Wedding Gifts' },
    lead:   {
      vi: 'Được gặp bạn trong ngày cưới đã là niềm vui trọn vẹn. Nếu bạn muốn gửi thêm lời chúc, chúng mình xin trân trọng đón nhận.',
      en: 'Having you there is already the whole gift. If you wish to send a blessing, we receive it with gratitude.',
    },
    copyLabel:  { vi: 'Sao chép số tài khoản', en: 'Copy account number' },
    copiedLabel:{ vi: 'Đã sao chép', en: 'Copied' },
    copyFailed: { vi: 'Không sao chép được — vui lòng chép tay', en: 'Copy failed — please copy manually' },
    qrHint:     { vi: 'Quét mã để chuyển khoản', en: 'Scan to transfer' },
    accounts: [
      {
        side:          { vi: 'Cô dâu', en: 'The Bride' },
        holder:        'DOAN KIEU TRANG',
        bank:          { vi: 'Ngân hàng Vietcombank — CN Bắc Giang', en: 'Vietcombank — Bac Giang Branch' },
        accountNumber: '0071 0001 234 567',
        qr:            'assets/img/qr-bride.png',
      },
      {
        side:          { vi: 'Chú rể', en: 'The Groom' },
        holder:        'NGUYEN VIET TOAN',
        bank:          { vi: 'Ngân hàng Techcombank — CN Bắc Giang', en: 'Techcombank — Bac Giang Branch' },
        accountNumber: '1903 6688 9900 12',
        qr:            'assets/img/qr-groom.png',
      },
    ],
  },

  /* ---------------------------------------------------------- 11b. NHẠC NỀN
     ★ SỬA: danh sách nhạc. Thả file vào assets/audio/ rồi đổi `file` bên dưới.

     LƯU Ý BẢN QUYỀN: nhạc pop hiện đại (Perfect, A Thousand Years, All of Me…)
     ĐỀU CÒN BẢN QUYỀN — nhúng lên web công khai là vi phạm. Bốn bài mặc định ở
     đây là nhạc cổ điển đã hết hạn bản quyền, bản thu tự do (chi tiết trong
     assets/audio/LICENSES.txt). Hai bản của Kevin MacLeod dùng giấy phép
     CC BY 3.0 — BẮT BUỘC giữ dòng ghi công `credit` hiển thị trên trang.
     ---------------------------------------------------------------------- */
  music: {
    enabled: true,          // false = ẩn hẳn trình phát nhạc

    label:      { vi: 'Nhạc nền',        en: 'Background music' },
    open:       { vi: 'Mở trình phát nhạc', en: 'Open music player' },
    close:      { vi: 'Đóng trình phát nhạc', en: 'Close music player' },
    play:       { vi: 'Phát nhạc',       en: 'Play' },
    pause:      { vi: 'Tạm dừng',        en: 'Pause' },
    prev:       { vi: 'Bài trước',       en: 'Previous track' },
    next:       { vi: 'Bài tiếp theo',   en: 'Next track' },
    mute:       { vi: 'Tắt tiếng',       en: 'Mute' },
    unmute:     { vi: 'Bật tiếng',       en: 'Unmute' },
    volume:     { vi: 'Âm lượng',        en: 'Volume' },
    nowPlaying: { vi: 'Đang phát',       en: 'Now playing' },
    chooseTrack:{ vi: 'Chọn bài',        en: 'Choose a track' },
    error:      { vi: 'Không phát được bài này', en: 'Could not play this track' },

    // Ghi công bắt buộc theo giấy phép CC BY 3.0 — đừng xoá
    credit: {
      vi: 'Nhạc: Kevin MacLeod (incompetech.com) — CC BY 3.0 · U.S. Air Force Band — Public Domain',
      en: 'Music: Kevin MacLeod (incompetech.com) — CC BY 3.0 · U.S. Air Force Band — Public Domain',
    },

    tracks: [
      { file: 'assets/audio/canon-in-d.mp3',    title: 'Canon in D',      composer: 'Johann Pachelbel' },
      { file: 'assets/audio/bridal-chorus.mp3', title: 'Bridal Chorus',   composer: 'Richard Wagner' },
      { file: 'assets/audio/wedding-march.mp3', title: 'Wedding March',   composer: 'Felix Mendelssohn' },
      { file: 'assets/audio/ave-maria.mp3',     title: 'Ave Maria',       composer: 'Franz Schubert' },
    ],
  },

  /* --------------------------------------------------------------- 12. FAQ
     ★ SỬA: câu hỏi thường gặp. Thêm/bớt tuỳ ý.
     ---------------------------------------------------------------------- */
  faq: {
    number: '06',
    title:  { vi: 'Hỏi đáp', en: 'Good to Know' },
    lead:   {
      vi: 'Vài điều nhỏ để ngày vui của chúng ta thật suôn sẻ.',
      en: 'A few small things to make the day run smoothly.',
    },
    items: [
      {
        q: { vi: 'Mình gửi xe ở đâu?', en: 'Where can I park?' },
        a: {
          vi: 'Trung tâm hội nghị có hầm gửi xe miễn phí cho khách mời, lối vào ở mặt đường Hùng Vương. Vui lòng nói với bảo vệ rằng bạn dự tiệc cưới sảnh Ngọc Lan. Nếu hầm đầy, bãi xe của toà nhà kế bên cách khoảng 100m.',
          en: 'The venue has free basement parking for guests, with the entrance on Hung Vuong street. Please tell the attendant you are attending the wedding in the Ngoc Lan hall. If it is full, there is an overflow lot about 100m away.',
        },
      },
      {
        q: { vi: 'Mình có thể dẫn trẻ nhỏ theo không?', en: 'Can I bring my children?' },
        a: {
          vi: 'Rất hoan nghênh! Chúng mình có khu vực riêng cho các bé cạnh sảnh tiệc, kèm ghế cao và thực đơn nhẹ. Bạn nhớ ghi số lượng bé vào phần "Số lượng khách" khi xác nhận tham dự nhé.',
          en: 'Absolutely! There is a dedicated area for little ones next to the main hall, with high chairs and a lighter menu. Please include them in the guest count when you RSVP.',
        },
      },
      {
        q: { vi: 'Mình nên mặc gì?', en: 'What should I wear?' },
        a: {
          vi: 'Trang phục lịch sự (semi-formal). Nếu bạn muốn hoà cùng tông màu của tiệc, những gam xanh sage, kem ngà, hồng đất hay nâu vàng sẽ rất hợp. Chúng mình chỉ xin nhường tông trắng cho cô dâu thôi ạ.',
          en: 'Semi-formal. If you would like to match the palette, sage green, ivory, dusty rose and warm brass all fit beautifully. We only ask that white be left to the bride.',
        },
      },
      {
        q: { vi: 'Mình đến muộn thì sao?', en: 'What if I arrive late?' },
        a: {
          vi: 'Không sao cả. Nghi lễ chính bắt đầu lúc 18:30, nên bạn cứ đến trước giờ đó là kịp. Nếu tới muộn hơn, bạn vui lòng vào bằng cửa hông để không cắt ngang phần lễ nhé.',
          en: 'No problem at all. The main ceremony begins at 6:30 PM, so arriving before then is perfect. If you are later than that, please use the side entrance so the ceremony is not interrupted.',
        },
      },
      {
        q: { vi: 'Mình có cần xác nhận không? Đến thẳng được không?', en: 'Do I need to RSVP, or can I just come?' },
        a: {
          vi: 'Bạn cứ đến, chúng mình luôn có chỗ. Nhưng nếu xác nhận trước ngày 09.12.2026 thì gia đình sẽ sắp bàn và chuẩn bị phần ăn chính xác hơn — sẽ đỡ vất vả hơn rất nhiều.',
          en: 'You are always welcome. But confirming before 9 December 2026 helps our families seat everyone and plan the catering properly — it makes a real difference.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------- 13. FOOTER
     ---------------------------------------------------------------------- */
  footer: {
    thanks: {
      vi: 'Cảm ơn bạn đã là một phần trong câu chuyện của chúng mình.',
      en: 'Thank you for being part of our story.',
    },
    signature: { vi: 'Hẹn gặp bạn', en: 'See you there' },
  },

  /* ------------------------------------------------------- 14. NHÃN CHUNG
     Chữ dùng ở nhiều nơi (nút menu, chuyển ngôn ngữ...).
     ---------------------------------------------------------------------- */
  ui: {
    skipToContent: { vi: 'Bỏ qua, tới nội dung chính', en: 'Skip to main content' },
    openMenu:      { vi: 'Mở menu', en: 'Open menu' },
    closeMenu:     { vi: 'Đóng menu', en: 'Close menu' },
    langSwitch:    { vi: 'Chuyển sang tiếng Anh', en: 'Switch to Vietnamese' },
    photoMissing:  { vi: 'Ảnh sẽ được cập nhật', en: 'Photo coming soon' },
    themeTitle:    { vi: 'Bảng màu', en: 'Colour theme' },
    themeSwitch:   { vi: 'Đổi bảng màu', en: 'Change colour theme' },
    backToTop:     { vi: 'Lên đầu trang', en: 'Back to top' },
  },
};
