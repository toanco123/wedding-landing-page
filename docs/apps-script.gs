/* ==========================================================================
   apps-script.gs — Nhận RSVP từ trang cưới, ghi vào Google Sheet
   --------------------------------------------------------------------------
   File này KHÔNG chạy trong trang web. Bạn copy toàn bộ nội dung rồi dán vào
   Google Apps Script. Hướng dẫn từng bước: xem README mục 9.

   Tóm tắt 6 bước:
     1. Đăng nhập Google bằng Gmail CÁ NHÂN (đừng dùng email công ty —
        tài khoản công ty thường bị admin chặn bước 5).
     2. Tạo một Google Sheet mới, đặt tên gì cũng được.
     3. Trong Sheet: Tiện ích mở rộng → Apps Script.
     4. Xoá hết code mẫu, dán toàn bộ file này vào, bấm lưu.
     5. Triển khai → Tập hợp triển khai mới → loại "Ứng dụng web"
          · Thực thi với tư cách:  Tôi
          · Ai có quyền truy cập:  Bất kỳ ai          ← quan trọng
     6. Copy URL dạng https://script.google.com/macros/s/AKfy.../exec
        rồi dán vào  assets/js/config.js  →  rsvp.endpoint
   ========================================================================== */


/* Thứ tự cột trong Sheet. Muốn đổi thứ tự hay bớt cột thì sửa mảng này —
   hàng tiêu đề sẽ tự khớp theo. Tên phải trùng key mà trang web gửi lên. */
var COLUMNS = [
  'submittedAt',   // thời điểm khách bấm gửi (giờ máy khách)
  'name',          // họ tên khách tự nhập
  'phone',         // số điện thoại
  'attending',     // true = có đến, false = không đến được
  'guests',        // số người đi cùng (0 nếu không đến)
  'session',       // vu-quy | tiec | ca-hai
  'message',       // lời nhắn gửi cô dâu chú rể
  'lang',          // khách đang xem trang bằng tiếng gì (vi | en)
  'receivedAt'     // thời điểm server nhận được — do file này tự thêm
];

/* Tiêu đề tiếng Việt cho hàng đầu tiên, cho dễ đọc khi mở Sheet */
var HEADERS = {
  submittedAt: 'Thời điểm gửi',
  name:        'Họ và tên',
  phone:       'Số điện thoại',
  attending:   'Có tham dự',
  guests:      'Số khách',
  session:     'Buổi tham dự',
  message:     'Lời nhắn',
  lang:        'Ngôn ngữ',
  receivedAt:  'Thời điểm nhận'
};


/**
 * Trang web gọi vào đây mỗi khi khách bấm "Gửi xác nhận".
 * Trang gửi bằng Content-Type text/plain (để tránh preflight CORS),
 * nên dữ liệu JSON nằm trong e.postData.contents.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    data.receivedAt = new Date().toISOString();

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Lần chạy đầu tiên: tự tạo hàng tiêu đề
    if (sheet.getLastRow() === 0) {
      var titles = COLUMNS.map(function (key) { return HEADERS[key] || key; });
      sheet.appendRow(titles);
      sheet.getRange(1, 1, 1, titles.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Ghi một dòng theo đúng thứ tự COLUMNS
    sheet.appendRow(COLUMNS.map(function (key) {
      var v = data[key];
      if (v === undefined || v === null) return '';
      if (typeof v === 'boolean') return v ? 'Có' : 'Không';
      return v;
    }));

    return json({ ok: true });

  } catch (err) {
    // Ghi lại lỗi để xem trong Apps Script → Nhật ký thực thi
    console.error('RSVP lỗi: ' + err + ' | payload: ' +
      (e && e.postData ? e.postData.contents : '(rỗng)'));
    return json({ ok: false, error: String(err) });
  }
}


/**
 * Mở thẳng URL trên trình duyệt sẽ vào đây — dùng để kiểm tra đã deploy đúng chưa.
 * Thấy chữ "RSVP endpoint đang chạy" là được.
 */
function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint đang chạy.')
    .setMimeType(ContentService.MimeType.TEXT);
}


function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
