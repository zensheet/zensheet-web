# 📝 Google Sheets CMS - Setup Guide

Panduan lengkap setup Google Sheets sebagai CMS untuk website zensheet.my.id

---

## 🎯 Step 1: Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"Blank"** (buat sheet baru)
3. Rename sheet jadi: **"ZenSheet CMS"**

---

## 📋 Step 2: Buat 3 Tabs (Sheet)

### **Tab 1: Products**

Rename "Sheet1" jadi **"Products"**, lalu buat kolom:

| Column | Deskripsi | Contoh |
|--------|-----------|--------|
| **ID** | ID unik produk | `antigravity-ebook` |
| **Category** | Kategori produk | `AI GUIDE` |
| **Title** | Judul produk | `The Antigravity Developer` |
| **Description** | Deskripsi singkat | `Case Study Jujur: Dari ide mentah...` |
| **Price** | Harga (angka saja) | `50000` |
| **OldPrice** | Harga coret (opsional) | `99000` |
| **BuyLink** | Link pembelian | `https://lynk.id/...` |
| **ImageURL** | Link gambar (Google Drive) | `https://drive.google.com/...` |
| **Status** | Aktif/Tidak | `Active` atau `Inactive` |

**Contoh Data:**

```
ID                  | Category  | Title                      | Description           | Price  | OldPrice | BuyLink              | ImageURL                    | Status
antigravity-ebook   | AI GUIDE  | The Antigravity Developer  | Case Study Jujur...   | 50000  | 99000    | https://lynk.id/...  | https://drive.google.com... | Active
```

---

### **Tab 2: Hero**

Klik **"+"** di bawah untuk buat tab baru, rename jadi **"Hero"**:

| Column | Deskripsi | Contoh |
|--------|-----------|--------|
| **Section** | Nama section | `hero` |
| **MainHeading** | Heading utama | `Organize with Peace, Grow with Ease.` |
| **SubHeading** | Sub heading | `Koleksi tools digital premium...` |
| **Button1Text** | Teks tombol 1 | `Lihat Koleksi` |
| **Button2Text** | Teks tombol 2 | `Pelajari Lebih Lanjut` |

---

### **Tab 3: Features**

Buat tab baru, rename jadi **"Features"**:

| Column | Deskripsi | Contoh |
|--------|-----------|--------|
| **Icon** | Nama icon Feather | `download` |
| **Title** | Judul fitur | `Instant Clarity` |
| **Description** | Deskripsi fitur | `Akses langsung ke tools Anda...` |

---

## 📸 Step 3: Upload Gambar ke Google Drive

### **Cara Upload:**

1. Buka [Google Drive](https://drive.google.com)
2. Buat folder baru: **"ZenSheet Images"**
3. **Upload** gambar produk (drag & drop)
4. **Klik kanan** gambar → **"Get link"**
5. Set **"Anyone with the link"** → **"Viewer"**
6. **Copy link**, paste ke Google Sheets (kolom `ImageURL`)

### **Format Link Google Drive:**

Link asli:
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
```

**Ubah jadi** (untuk direct image):
```
https://drive.google.com/uc?export=view&id=1ABC123xyz
```

**Cara cepat:** Ganti `/file/d/` jadi `/uc?export=view&id=` dan hapus `/view?usp=sharing`

---

## ⚙️ Step 4: Setup Google Apps Script

1. Di Google Sheet, klik **Extensions** → **Apps Script**
2. **Hapus** code default
3. **Paste** code dari file `google-apps-script-cms.js` (akan saya buatkan)
4. Klik **"Save"** (💾 icon)
5. Klik **"Deploy"** → **"New deployment"**
6. Pilih type: **"Web app"**
7. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
8. Klik **"Deploy"**
9. **Copy** Web App URL (contoh: `https://script.google.com/macros/s/ABC123.../exec`)

---

## 🔗 Step 5: Update Website Config

1. Buka file `cms-config.js` (akan saya buatkan)
2. Ganti `YOUR_GOOGLE_SCRIPT_URL_HERE` dengan Web App URL dari Step 4
3. **Save** file
4. **Upload** ke website (Cloudflare Pages / GitHub Pages)

---

## ✅ Step 6: Test!

1. Buka website: `https://zensheet.my.id`
2. Produk harusnya load dari Google Sheets
3. Coba edit judul produk di Google Sheet
4. Refresh website (Ctrl + Shift + R untuk clear cache)
5. Perubahan harusnya muncul!

---

## 🎨 Tips Upload Gambar

### **Ukuran Gambar Ideal:**
- **Product cards:** 800x600px (landscape)
- **Format:** JPG atau PNG
- **File size:** Max 500KB (agar cepat load)

### **Tools Resize Gambar (Gratis):**
- [TinyPNG](https://tinypng.com) - compress gambar
- [Squoosh](https://squoosh.app) - resize & compress

---

## 🔄 Update Content

### **Edit Produk:**
1. Buka Google Sheet
2. Edit cell yang mau diubah (judul, harga, dll)
3. Refresh website (mungkin perlu clear cache)

### **Tambah Produk Baru:**
1. Tambah row baru di tab "Products"
2. Isi semua kolom
3. Set `Status` = `Active`
4. Refresh website

### **Hapus Produk:**
- Set `Status` = `Inactive` (produk tidak muncul di website)

---

## 🚨 Troubleshooting

**Produk tidak muncul?**
- Cek Web App URL di `cms-config.js` sudah benar
- Cek Google Sheet permission (Anyone with link can view)
- Clear browser cache (Ctrl + Shift + R)

**Gambar tidak muncul?**
- Cek link Google Drive sudah format direct image (`/uc?export=view&id=...`)
- Cek permission gambar (Anyone with link can view)

**Perubahan tidak muncul?**
- Clear cache browser
- Tunggu 1-2 menit (Google Apps Script cache)

---

Selesai! Website Anda sekarang punya CMS! 🎉
