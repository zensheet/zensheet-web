# Panduan Integrasi Database Ebook ZenSheet

Ikuti langkah mudah ini untuk menyambungkan Form Download Ebook ke Google Sheets Anda.

## Langkah 1: Siapkan Google Sheet
1. Buka [Google Sheets](https://sheets.google.com) baru.
2. Beri nama file, misal: **"Database Leads ZenSheet"**.
3. Di baris pertama (Header), isi kolom A sampai D dengan judul berikut:
   - **A1**: Timestamp
   - **B1**: Nama
   - **C1**: Email
   - **D1**: WhatsApp

## Langkah 2: Pasang Script Penerima Data
1. Di Google Sheet, klik menu **Extensions** > **Apps Script**.
2. Hapus semua kode yang ada, lalu **Copy & Paste** kode di bawah ini:

```javascript
var SHEET_NAME = "Sheet1"; // Pastikan sesuai nama Tab di bawah

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(ScriptApp.getScriptId());
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      if(header === 'Timestamp'){
        return new Date();
      }
      return e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```

3. Klik ikon **Disket 💾 (Save)**, beri nama proyek "ZenSheet Backend".

## Langkah 3: Deploy sebagai Web App
1. Klik tombol **Deploy** (biru di kanan atas) > **New Deployment**.
2. Klik ikon Roda Gigi ⚙️ > Pilih **Web App**.
3. Isi setting berikut:
   - **Description**: Ebook Lead Capture
   - **Execute as**: **Me (Your Email)**
   - **Who has access**: **Anyone** (Ini Wajib agar form website bisa kirim data).
4. Klik **Deploy**.
5. Berikan izin akses (**Authorize Access**) -> Pilih Akun Google -> Advanced -> Go to ... (unsafe) -> Allow.
6. **COPY** link URL yang muncul (Web App URL) yang berawalan `https://script.google.com/macros/s/...`.

## Langkah 4: Masukkan URL ke Website
1. Buka file `script.js` di folder website Anda.
2. Cari baris paling atas: `const SCRIPT_URL = "URL_GOOGLE_SCRIPT_ANDA_DISINI";`
3. Tempel (Paste) URL tadi di situ.
4. Simpan, dan Website siap panen leads! 🚀
