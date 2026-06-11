# TRMS — Kamus Istilah & Panduan Konsep

> Dokumen ini menjelaskan setiap istilah yang digunakan dalam sistem TRMS,  
> lengkap dengan analogi agar mudah dipahami oleh siapa saja — teknis maupun non-teknis.  
> Terakhir diperbarui: Juni 2026

---

## Daftar Isi

1. [Gambaran Besar Sistem](#1-gambaran-besar-sistem)
2. [Platform Latihan](#2-platform-latihan)
3. [Fasilitas & Perangkat](#3-fasilitas--perangkat)
4. [Booking & Penjadwalan](#4-booking--penjadwalan)
5. [Nominal Roll](#5-nominal-roll)
6. [Role Kru Kendaraan](#6-role-kru-kendaraan)
7. [Kendaraan & Platform Tempur](#7-kendaraan--platform-tempur)
8. [Callsign](#8-callsign)
9. [Proses Onboarding (Hari H)](#9-proses-onboarding-hari-h)
10. [Detail List](#10-detail-list)
11. [Hasil Latihan](#11-hasil-latihan)
12. [Status Booking](#12-status-booking)
13. [Organisasi & Personel](#13-organisasi--personel)
14. [Istilah Tambahan](#14-istilah-tambahan)
15. [Alur Lengkap (Ringkasan Visual)](#15-alur-lengkap-ringkasan-visual)

---

## 1. Gambaran Besar Sistem

### TRMS — Training Resource Management System

**Apa itu?**  
Sistem digital untuk mengelola semua aktivitas latihan militer di fasilitas simulator — mulai dari pemesanan jadwal, pendaftaran peserta, konfigurasi perangkat, hingga pencatatan hasil latihan.

**Analoginya:**  
Bayangkan sebuah **hotel besar khusus simulator**. TRMS adalah sistem manajemen hotel tersebut — mulai dari booking kamar, check-in tamu, pengaturan fasilitas, hingga laporan siapa saja yang menginap dan bagaimana hasilnya.

---

## 2. Platform Latihan

Terdapat beberapa jenis "arena latihan" yang berbeda dalam sistem ini. Masing-masing punya cara kerja dan perangkat tersendiri.

---

### CMT — Combat Mission Trainer

**Apa itu?**  
Simulator berbasis **kabin** (ruangan tertutup menyerupai interior kendaraan tempur). Di dalamnya, tim kru berlatih mengoperasikan kendaraan lapis baja secara realistis.

**Analoginya:**  
Seperti **flight simulator pilot** — tetapi untuk kru tank/kendaraan tempur. Seluruh kru masuk ke dalam "ruangan" yang meniru kondisi di dalam kendaraan nyata, lalu menjalankan misi latihan di lingkungan virtual.

**Ciri khas:**
- Setiap kabin = 1 kendaraan tempur virtual
- Satu sesi bisa melibatkan banyak kabin sekaligus
- Dioperasikan oleh Instructor via IOS

---

### CTT — Crew Training Trainer

**Apa itu?**  
Simulator berbasis **cluster** (kelompok stasiun latihan). Fokus pada pelatihan kru secara individual atau kelompok kecil untuk skill spesifik.

**Analoginya:**  
Seperti **laboratorium komputer** — setiap orang duduk di stasiun masing-masing dan mengerjakan latihan yang sama. Instruktur bisa memantau semua stasiun sekaligus.

**Ciri khas:**
- Setiap cluster = kelompok trainee dengan penugasan spesifik
- Lebih fokus ke skill individual dibanding misi tim

---

### CMT+CTT — Kombinasi

**Apa itu?**  
Sesi latihan yang menggabungkan CMT dan CTT dalam satu booking. Ini adalah tipe latihan paling kompleks karena melibatkan dua jenis simulator sekaligus.

**Aturan penting:**  
Proses **Onboarding** (check-in peserta) **hanya ada** pada tipe CMT+CTT. Booking CMT saja atau CTT saja tidak memiliki alur onboarding.

---

### IMT — Indoor Marksmanship Trainer

**Apa itu?**  
Simulator untuk latihan menembak senjata ringan (SAR21, M16, dll.) di dalam ruangan.

**Analoginya:**  
Seperti **shooting range virtual** — prajurit berlatih menembak dengan senjata yang terhubung ke layar simulasi, tanpa peluru nyata.

---

### SWT — Shooter Weapon Trainer

**Apa itu?**  
Simulator untuk latihan senjata berat atau sistem senjata spesifik.

**Analoginya:**  
Versi lebih canggih dari IMT, tetapi untuk senjata yang lebih besar atau kompleks.

---

## 3. Fasilitas & Perangkat

### Cabin (Kabin)

**Apa itu?**  
Ruangan fisik berbentuk menyerupai interior kendaraan tempur (Terrex, dll.). Di dalamnya ada kursi, layar, dan kontrol yang meniru kendaraan nyata.

**Analoginya:**  
Seperti **kamar hotel premium** — setiap kabin punya nomor, kapasitas, dan peralatan tersendiri. Satu booking bisa memesan beberapa kabin sekaligus.

**Contoh:** CMT01, CMT02, CMT03, CMT04

---

### Cluster

**Apa itu?**  
Kelompok stasiun latihan untuk CTT. Satu cluster terdiri dari beberapa seat/kursi yang digunakan bersamaan.

**Analoginya:**  
Seperti **meja besar di perpustakaan** — satu cluster bisa digunakan oleh beberapa orang sekaligus untuk latihan yang sama.

**Contoh:** CTT01, CTT04

---

### IOS — Instructor Operator Station

**Apa itu?**  
Perangkat komputer khusus yang digunakan oleh instruktur untuk **mengontrol dan memantau** simulator selama sesi berlangsung. Setiap kabin CMT memiliki IOS tersendiri.

**Analoginya:**  
Seperti **panel kontrol kokpit di balik layar** — instruktur bisa mengubah skenario latihan, memantau performa kru, menghentikan atau memulai ulang misi, semuanya dari IOS.

**Contoh:** CMTIOS01, CMTIOS02, CMTIOS03, CMTIOS04

**Catatan:**  
Dalam sistem, setiap kabin harus di-assign ke satu IOS device. Satu IOS tidak bisa dipakai untuk dua kabin berbeda di waktu yang sama.

---

### Base Station

**Apa itu?**  
Stasiun pusat yang menghubungkan semua simulator dalam satu jaringan latihan. Mengkoordinasikan komunikasi antar kabin.

**Analoginya:**  
Seperti **menara kontrol bandara** — semua pesawat (kabin) berkomunikasi melalui satu titik pusat ini.

**Contoh:** SWT-01, SWT-02, IMT-01, IMT-02

---

### RFID Reader & Antenna

**Apa itu?**  
Perangkat hardware untuk mendeteksi dan melacak aset fisik (senjata, peralatan) menggunakan teknologi radio.

**Analoginya:**  
Seperti **sensor pintu di toko** — setiap peralatan punya "chip" kecil, dan reader otomatis mendeteksi ketika peralatan masuk atau keluar ruangan.

---

## 4. Booking & Penjadwalan

### Booking

**Apa itu?**  
Reservasi resmi untuk menggunakan fasilitas simulator pada tanggal dan waktu tertentu, oleh unit tertentu, dengan jumlah trainee tertentu.

**Analoginya:**  
Seperti **reservasi restoran** — kamu memesan meja (fasilitas), untuk berapa orang (trainee), pada jam berapa (jadwal), dan menu apa (jenis latihan).

**Data dalam booking:**
- Tanggal & waktu
- Jenis sesi (Full Day / Half Day / AM Session / PM Session)
- Program & courseware
- Jumlah trainee
- Jenis kendaraan
- Assignment ID (untuk aset yang disiapkan)

---

### Booking ID

**Apa itu?**  
Kode unik untuk setiap booking, dibuat otomatis oleh sistem.

**Format:** `#YYmmdd-CMT001`  
**Contoh:** `#260604-CMT001` = booking CMT ke-1 pada tanggal 4 Juni 2026

---

### Courseware

**Apa itu?**  
Modul atau kurikulum latihan yang digunakan dalam sesi. Menentukan skenario, target, dan standar kelulusan.

**Analoginya:**  
Seperti **silabus mata pelajaran** — setiap sesi latihan mengikuti satu courseware tertentu yang sudah ditentukan.

**Contoh:** `IOCC_2(TRX)`, `Component Type Training B`

---

### Assignment

**Apa itu?**  
Proses penugasan aset fisik (senjata, peralatan) untuk booking tertentu. Sebelum latihan bisa dimulai, aset harus sudah di-assign.

**Analoginya:**  
Seperti **peminjaman alat dari gudang** — sebelum kelas praktik, setiap kelompok harus mengambil peralatan yang sudah dicatat. Assignment adalah formulir peminjamannya.

---

### Issue Assets

**Apa itu?**  
Proses pengeluaran aset fisik dari gudang ke lapangan untuk digunakan dalam sesi latihan.

**Analoginya:**  
Proses **checkout barang dari gudang** — aset dipindai (RFID), dicatat, dan diserahkan ke unit yang berlatih.

---

### Return Assets

**Apa itu?**  
Proses pengembalian aset setelah sesi latihan selesai.

**Analoginya:**  
Proses **pengembalian barang ke gudang** — semua peralatan dipindai kembali dan status dikembalikan ke "available".

---

## 5. Nominal Roll

**Apa itu?**  
Daftar resmi semua trainee yang akan mengikuti sesi latihan, beserta data lengkap masing-masing (nama, NRIC, pangkat, role).

**Analoginya:**  
Seperti **daftar hadir resmi** atau **manifest penumpang pesawat** — setiap orang yang masuk fasilitas harus terdaftar secara resmi sebelumnya.

**Data per trainee:**
- Nama
- NRIC (nomor identitas nasional)
- Pangkat (Rank)
- Role dalam kendaraan (VC, VO, dll.)
- Unit asal

**Proses:**  
Nominal roll di-upload sebelum hari H, lalu dikonfirmasi saat onboarding (check-in fisik).

---

### NRIC — National Registration Identity Card

**Apa itu?**  
Nomor identitas resmi warga negara Singapura, digunakan untuk identifikasi trainee.

**Analoginya:**  
Seperti **NIK** di Indonesia — nomor unik yang mengidentifikasi setiap individu.

**Format dalam sistem:** `T6535925H` (sebagian disamarkan: `*****925H`)

---

### Rank (Pangkat)

Pangkat militer trainee. Menentukan posisi hierarki dalam unit.

| Kode | Kepanjangan | Setara Sipil |
|------|-------------|--------------|
| REC | Recruit | Pegawai baru/magang |
| PTE | Private | Staf junior |
| CPL | Corporal | Staf |
| SGT | Sergeant | Supervisor |
| WO | Warrant Officer | Manajer |
| MAJ | Major | Senior Manager |

---

## 6. Role Kru Kendaraan

Setiap trainee dalam sebuah kabin CMT memiliki role spesifik yang merepresentasikan posisi mereka di dalam kendaraan tempur nyata.

**Analoginya:**  
Seperti **kru kapal** — ada kapten, navigator, mekanik, dan penjaga — setiap orang punya tanggung jawab yang berbeda.

---

### VC — Vehicle Commander

**Apa itu?**  
Komandan kendaraan. Bertanggung jawab atas keseluruhan misi dan keputusan taktis.

**Analoginya:**  
**Kapten kapal** — yang memutuskan ke mana kapal berlayar dan apa yang harus dilakukan dalam situasi apapun.

---

### VO — Vehicle Operator

**Apa itu?**  
Pengemudi/operator kendaraan. Mengeksekusi perintah komandan dalam mengendalikan kendaraan.

**Analoginya:**  
**Pilot/pengemudi** — yang secara fisik menjalankan kendaraan sesuai arahan komandan.

---

### TC/PC — Trainer Commander / Platoon Commander

**Apa itu?**  
Komandan peleton atau instruktur senior yang mengawasi beberapa kendaraan sekaligus dalam satu operasi.

**Analoginya:**  
**Manajer lapangan** — mengawasi beberapa tim (kendaraan) sekaligus dan memastikan koordinasi berjalan baik.

---

### SC — Section Commander

**Apa itu?**  
Komandan seksi — memimpin sub-unit yang lebih kecil dari peleton.

**Analoginya:**  
**Team leader** — memimpin kelompok kecil dan melapor ke Platoon Commander.

---

### SO — Section Officer / System Operator

**Apa itu?**  
Operator sistem senjata atau petugas seksi yang menangani sistem spesifik di dalam kendaraan.

**Analoginya:**  
**Spesialis teknis** — ahli untuk sistem tertentu (senjata, komunikasi, navigasi).

---

## 7. Kendaraan & Platform Tempur

### Platform Type

**Apa itu?**  
Jenis kendaraan tempur yang disimulasikan di dalam kabin. Menentukan konfigurasi simulator, senjata, dan skenario latihan.

---

### Terrex ICV (Infantry Carrier Vehicle)

**Apa itu?**  
Kendaraan lapis baja pengangkut infanteri utama SAF.

**Analoginya:**  
Seperti **bus lapis baja** yang bisa bertempur — mengangkut prajurit ke zona tempur dan memberikan dukungan tembakan.

**Varian:**
| Kode | Senjata | Analogi |
|------|---------|---------|
| Terrex 50 HMG | Senapan mesin berat .50 cal | Versi persenjataan berat |
| Terrex 40 AGL | Automatic Grenade Launcher 40mm | Versi peluncur granat |

---

### L2SG

**Apa itu?**  
Singkatan untuk sistem senjata atau platform spesifik yang digunakan dalam latihan CTT.

---

### PCSV — Protected Combat Support Vehicle

**Apa itu?**  
Kendaraan pendukung tempur yang dilindungi lapis baja.

**Varian:**
- **PCSV Mortar** — versi dengan sistem mortar untuk dukungan tembakan tidak langsung

---

## 8. Callsign

**Apa itu?**  
Kode identifikasi taktis yang digunakan selama operasi/latihan. Ada dua level:

1. **Cabin Callsign** — identifikasi untuk seluruh kabin/kendaraan
2. **Individual Callsign** — identifikasi untuk peran tertentu dalam kabin

**Analoginya:**  
Seperti **nomor meja di restoran + nama pesanan** — nomor meja adalah cabin callsign (semua yang duduk di meja 11 = "11Z"), sedangkan nama pesanan adalah individual callsign (orang yang pesan steak = "11", yang pesan salad = "11A").

**Contoh:**
| Kabin | Cabin Callsign | Individual (TC) | Individual (SO) |
|-------|---------------|-----------------|-----------------|
| CMT01 | 11Z | 11 | 11A |
| CMT02 | 11SZ | 11S | — |
| CTT04 | 14SZ | 14S | 14B |

---

## 9. Proses Onboarding (Hari H)

**Apa itu?**  
Proses check-in resmi trainee ke fasilitas simulator pada hari latihan berlangsung. **Hanya ada untuk booking tipe CMT+CTT.**

**Analoginya:**  
Seperti **proses check-in di bandara** — setiap penumpang (trainee) harus check-in, kursi (kabin) dikonfirmasi, dan semua sistem siap sebelum pesawat (latihan) bisa berangkat.

**Langkah-langkah:**

```
1. Scan ID Trainee
   └── Sistem membaca NRIC via scanner
   └── Membandingkan dengan nominal roll
   └── Menandai hadir/tidak hadir

2. Konfirmasi Attendance
   └── Daftar hadir dikonfirmasi
   └── Trainee yang tidak terdaftar dicatat

3. Konfigurasi Lane/Kabin
   └── Trainee di-assign ke kabin masing-masing
   └── IOS device dikonfirmasi siap

4. Generate Detail List
   └── Daftar final penugasan per kabin dibuat
   └── Siap untuk mulai latihan
```

**Status tombol di sistem:**
- Booking **Upcoming** → tombol bertuliskan **"Start Onboarding"**
- Booking **Ongoing** → tombol bertuliskan **"Continue Session"**

---

## 10. Detail List

**Apa itu?**  
Dokumen/tampilan yang menunjukkan penugasan lengkap setiap trainee ke kabin tertentu, lengkap dengan role, callsign, dan data kursus.

**Analoginya:**  
Seperti **denah tempat duduk konser atau pernikahan** — siapa duduk di meja mana, dengan siapa, dan peran apa yang mereka mainkan.

**Isi Detail List:**

| Kolom | Penjelasan |
|-------|-----------|
| Cabin/Cluster | Kabin atau cluster tempat trainee berlatih |
| Role | Peran trainee di kendaraan (VC, VO, dll.) |
| Name | Nama trainee |
| NRIC | Nomor identitas |
| Rank | Pangkat |
| Platform Type | Jenis kendaraan yang disimulasikan |
| Callsign | Kode taktis |
| Batch | Angkatan/gelombang kursus |
| Course | Kode kursus (courseware) |
| Unit | Satuan asal trainee |

**Proses generate:**  
Detail List tidak bisa di-generate sembarangan. Sistem mengharuskan:
1. ✅ Nominal Roll sudah di-upload
2. ✅ Cabin Configuration sudah selesai

Baru kemudian bisa di-generate dan sesi latihan bisa dimulai.

---

## 11. Hasil Latihan

### Marksman

**Apa itu?**  
Trainee yang mencapai skor tertinggi dalam latihan menembak/misi — di atas standar "lulus" biasa.

**Analoginya:**  
Seperti **predikat cum laude** — bukan hanya lulus, tapi lulus dengan nilai sangat baik.

---

### Pass / Fail

**Apa itu?**  
Status kelulusan trainee dalam satu sesi latihan berdasarkan standar minimum yang ditetapkan courseware.

---

### Batch

**Apa itu?**  
Kode angkatan atau gelombang pelatihan. Menunjukkan kapan trainee mengikuti program kursus tertentu.

**Contoh:** `06/26` = angkatan bulan Juni tahun 2026

---

### Course

**Apa itu?**  
Kode program pelatihan yang sedang diikuti trainee.

**Contoh:** `IOCC_2(TRX)` = Initial Operator Crew Course 2, untuk platform Terrex

---

## 12. Status Booking

Status menunjukkan di mana posisi sebuah booking dalam siklus hidupnya.

```
[Dibuat] → Upcoming → Ongoing → Completed
                    ↘ Cancelled
           Upcoming → Overdue (jika melewati tanggal tanpa dimulai)
           Ongoing  → Return Assets (aset belum dikembalikan)
```

| Status | Artinya | Analogi |
|--------|---------|---------|
| **Upcoming** | Booking sudah dikonfirmasi, latihan belum dimulai | Tiket pesawat sudah dibeli, belum boarding |
| **Ongoing** | Sesi latihan sedang berlangsung | Pesawat sedang terbang |
| **Completed** | Sesi selesai, semua aset dikembalikan | Pesawat sudah landing, semua beres |
| **Return Assets** | Sesi selesai tapi ada aset yang belum dikembalikan | Sudah landing tapi koper belum diklaim |
| **Cancelled** | Booking dibatalkan sebelum hari H | Tiket dibatalkan |
| **Overdue** | Booking melewati tanggal tapi tidak pernah dimulai | Tiket expired, tidak dipakai |

---

## 13. Organisasi & Personel

### Unit

**Apa itu?**  
Satuan militer yang mengirimkan trainee untuk berlatih.

**Contoh:** `1SIR` (1st Singapore Infantry Regiment), `2SIR`

**Analoginya:**  
Seperti **departemen dalam perusahaan** — setiap departemen mengirim karyawannya untuk mengikuti training.

---

### Instructor / Operator

**Apa itu?**  
Personel yang menjalankan simulator dari IOS. Bertugas mengatur skenario, memantau performa trainee, dan memberikan feedback.

**Analoginya:**  
Seperti **guru di kelas** — yang mengontrol materi, memantau murid, dan menilai hasil.

---

### Briefing Room

**Apa itu?**  
Ruangan fisik di fasilitas yang digunakan untuk briefing sebelum sesi latihan dimulai.

**Analoginya:**  
Seperti **ruang tunggu/ruang briefing** sebelum masuk ke simulator — di sini instruktur menjelaskan skenario dan ekspektasi.

---

### ATMS File

**Apa itu?**  
File data dari sistem ATMS (Army Training Management System) yang di-import ke TRMS. Berisi informasi kursus, trainee, dan program latihan dari sistem pusat.

**Analoginya:**  
Seperti **file Excel dari HR** yang di-import ke sistem absensi — data sudah ada di sistem pusat, tinggal di-sync.

---

## 14. Istilah Tambahan

### Training Mode

**Apa itu?**  
Pendekatan atau metode latihan yang digunakan dalam sesi.

**Contoh:** `Marksmanship` (latihan menembak), `Tactical` (latihan taktis)

---

### Training Type

**Apa itu?**  
Apakah latihan dilakukan secara **Group** (beberapa trainee bersama) atau **Individual** (satu per satu).

---

### Section Type

**Apa itu?**  
Kategori booking: **Standalone** (mandiri, satu unit saja) atau **Integrated** (gabungan beberapa unit).

---

### Session Type

Pembagian waktu sesi dalam satu hari:

| Kode | Waktu | Arti |
|------|-------|------|
| Full Day | 08:00 – 18:00 | Seharian penuh |
| AM Session | 08:00 – 13:00 | Sesi pagi |
| PM Session | 13:00 – 18:00 | Sesi sore |

---

### Cabin Configuration

**Apa itu?**  
Proses pengaturan teknis sebelum sesi dimulai — menghubungkan setiap kabin ke IOS device dan base station yang tepat.

**Analoginya:**  
Seperti **setup ruang meeting** — memastikan setiap komputer terhubung ke proyektor yang benar, kamera aktif, dan semua kabel tersambung sebelum rapat dimulai.

---

## 15. Alur Lengkap (Ringkasan Visual)

```
SEBELUM HARI H
══════════════
Unit mengajukan booking
        │
        ▼
Operator membuat booking di TRMS
  ├── Isi detail (tanggal, program, trainee count)
  ├── Upload Nominal Roll (siapa saja yang ikut)
  ├── Konfigurasi Cabin (assign IOS + base station)
  └── Review & Submit → Status: UPCOMING

        │
        ▼
Issue Assets
  └── Aset fisik (senjata, peralatan) di-assign ke booking
      via RFID scan → Assignment dibuat


HARI H (untuk CMT+CTT)
═══════════════════════
Start Onboarding → Status: ONGOING
        │
        ▼
Scan ID Trainee
  └── NRIC dipindai, dibandingkan dengan nominal roll
        │
        ▼
Konfirmasi Attendance
  └── Siapa hadir, siapa absen, siapa tidak terdaftar
        │
        ▼
Generate Detail List
  └── Penugasan final: siapa di kabin mana, role apa
        │
        ▼
SESI LATIHAN BERJALAN
  └── Instruktur monitor dari IOS
  └── Timer berjalan, performa dicatat


SETELAH SESI
════════════
Hasil dicatat (Pass/Fail/Marksman per trainee)
        │
        ▼
Return Assets → aset dipindai kembali ke gudang
        │
        ▼
Status: COMPLETED
  └── Data tersimpan di Training Results
```

---

*Dokumen ini dibuat untuk membantu semua pihak — teknis maupun non-teknis — memahami terminologi yang digunakan dalam sistem TRMS. Jika ada istilah baru yang belum tercakup, silakan tambahkan ke dokumen ini.*
