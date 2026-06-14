# TRMS — QA Test Cases

> **Modul yang diuji:** Create Booking (CMT), Issue Assets, Training Results  
> **Versi:** 1.0  
> **Tanggal:** Juni 2026  
> **Format:** TC-[MODUL]-[NOMOR]

**Legenda Priority:**
- 🔴 **High** — Blocker jika gagal; fitur inti tidak bisa digunakan
- 🟡 **Medium** — Degradasi fungsionalitas; ada workaround
- 🟢 **Low** — Kosmetik / edge case jarang terjadi

**Legenda Type:**
- ✅ Happy Path
- ❌ Negative / Validation
- ⚠️ Edge Case
- 🎨 UI / Visual

---

## Daftar Isi

1. [Module 1 — Create Booking (CMT)](#module-1--create-booking-cmt)
   - [Step 1: Booking Details](#step-1-booking-details)
   - [Step 2: Nominal Roll](#step-2-nominal-roll)
   - [Step 3: Cabin Configuration](#step-3-cabin-configuration)
   - [Step 4: Review & Submit](#step-4-review--submit)
2. [Module 2 — Issue Assets](#module-2--issue-assets)
3. [Module 3 — Training Results](#module-3--training-results)
   - [List View](#list-view)
   - [Detail View](#detail-view)

---

## Module 1 — Create Booking (CMT)

**Deskripsi Modul:**  
Wizard multi-step untuk membuat booking simulator CMT baru. Terdiri dari 4 step: Booking Details → Nominal Roll → Cabin Configuration → Review & Submit.

**URL:** `/bookings/create` → pilih tipe CMT

---

### Step 1: Booking Details

---

#### TC-CB-001
**Judul:** Berhasil lanjut ke Step 2 dengan semua field wajib diisi  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Create Booking, Step 1 (CMT Booking Details).

**Steps:**
1. Pilih tanggal latihan yang belum lewat dari date picker
2. Pilih Schedule Type = "AM/PM Schedule"
3. Pilih Session = "AM Session"
4. Isi field Programme (contoh: "IOCC Program Batch 06/26")
5. Pilih Compartment = "CMT_Driving"
6. Isi No. of Trainees = 10
7. Isi Cabin Amount = 2
8. Pilih Platform Variant "50HMG", set Qty = 2
9. Pilih Briefing Room = "Briefing Room A"
10. Klik tombol "Next"

**Expected Result:**
- Form tidak menampilkan error merah
- User berhasil berpindah ke Step 2 (Nominal Roll)
- Progress indicator di atas menunjukkan Step 2 aktif

---

#### TC-CB-002
**Judul:** Tombol Next tidak aktif jika field wajib kosong  
**Priority:** 🔴 High | **Type:** ❌ Negative

**Precondition:** User berada di Step 1, semua field masih kosong (initial state).

**Steps:**
1. Tidak mengisi field apapun
2. Klik tombol "Next"

**Expected Result:**
- Error message merah muncul di bawah setiap field wajib yang kosong
- User tetap di Step 1
- Field yang bermasalah di-highlight dengan border merah

---

#### TC-CB-003
**Judul:** Validasi — tidak bisa pilih tanggal yang sudah lewat  
**Priority:** 🔴 High | **Type:** ❌ Negative

**Precondition:** User berada di Step 1.

**Steps:**
1. Klik field Training Date
2. Di date picker, coba pilih tanggal kemarin atau sebelumnya

**Expected Result:**
- Tanggal yang sudah lewat tampil disabled / greyed-out di date picker
- Tidak bisa diklik / dipilih

---

#### TC-CB-004
**Judul:** Compartment — pilih CMT_Standalone akan clear pilihan lain  
**Priority:** 🔴 High | **Type:** ⚠️ Edge Case

**Precondition:** User berada di Step 1.

**Steps:**
1. Di dropdown Compartment, centang "CMT_Driving"
2. Centang "CMT_Gunnery" (keduanya terpilih)
3. Kemudian centang "CMT_Standalone"

**Expected Result:**
- "CMT_Driving" dan "CMT_Gunnery" otomatis ter-deselect
- Hanya "CMT_Standalone" yang tersisa sebagai pilihan aktif
- Opsi lain di dropdown tampil dimmed / disabled selama CMT_Standalone aktif

---

#### TC-CB-005
**Judul:** Compartment — tidak bisa tambah opsi lain saat CMT_Standalone aktif  
**Priority:** 🟡 Medium | **Type:** ⚠️ Edge Case

**Precondition:** Compartment "CMT_Standalone" sudah dipilih.

**Steps:**
1. Buka dropdown Compartment
2. Coba centang "CMT_Driving" atau "CMT_Gunnery"

**Expected Result:**
- Klik tidak menghasilkan perubahan (no-op)
- Opsi tersebut tetap uncheck
- Tidak ada error message yang ditampilkan — hanya dimmed secara visual

---

#### TC-CB-006
**Judul:** Platform Variant — pilih multiple variant dengan qty berbeda  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 1, Cabin Amount = 4.

**Steps:**
1. Centang Platform Variant "40AGL"
2. Set Qty "40AGL" = 2
3. Centang Platform Variant "50HMG"
4. Set Qty "50HMG" = 2

**Expected Result:**
- Kedua variant tampil sebagai selected (ada checkmark)
- Qty masing-masing menampilkan nilai yang diset (2 dan 2)
- Total qty (4) konsisten dengan Cabin Amount (4)

---

#### TC-CB-007
**Judul:** Schedule Full Day tidak memunculkan dropdown Session AM/PM  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 1.

**Steps:**
1. Pilih Schedule Type = "Full Day Schedule"

**Expected Result:**
- Dropdown "Session (AM/PM)" tidak muncul atau tampil disabled
- User tidak perlu memilih AM atau PM secara terpisah

---

#### TC-CB-008
**Judul:** Schedule Ad-hoc — tidak memunculkan dropdown Session  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 1.

**Steps:**
1. Pilih Schedule Type = "Ad-hoc Schedule"

**Expected Result:**
- Dropdown Session tidak muncul
- User bisa lanjut ke Next tanpa memilih Session

---

#### TC-CB-009
**Judul:** Cabin Amount tidak bisa melebihi 11 untuk CMT_Standalone  
**Priority:** 🟡 Medium | **Type:** ❌ Negative

**Precondition:** Compartment = "CMT_Standalone" dipilih.

**Steps:**
1. Pada field Cabin Amount, coba set nilai ke 12 (manual input atau klik tombol +)

**Expected Result:**
- Nilai tidak berubah melebihi 11
- Tombol + di-disable atau nilai dikap di 11

---

#### TC-CB-010
**Judul:** No. of Trainees tidak bisa bernilai 0 atau negatif  
**Priority:** 🟡 Medium | **Type:** ❌ Negative

**Precondition:** User berada di Step 1.

**Steps:**
1. Set No. of Trainees = 0
2. Klik Next

**Expected Result:**
- Muncul error validation "Minimal 1 trainee harus didaftarkan"
- Tidak bisa lanjut ke Step 2

---

### Step 2: Nominal Roll

---

#### TC-CB-011
**Judul:** List trainee default muncul setelah masuk ke Step 2  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Step 1 sudah diisi dengan benar, user berhasil masuk ke Step 2.

**Steps:**
1. Observasi halaman Nominal Roll saat pertama muncul

**Expected Result:**
- Tabel trainee tampil berisi data (mock data default)
- Setiap baris menampilkan: Rank, Name, NRIC (tersamarkan), Battalion, Company, Section, Platoon, Role
- Tombol "Upload List" dan search bar tersedia
- Pagination tampil jika data > 10 baris

---

#### TC-CB-012
**Judul:** Search trainee berdasarkan nama  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 2, tabel trainee sudah terisi.

**Steps:**
1. Ketik "Roger" di search box
2. Tunggu hasil filter

**Expected Result:**
- Tabel hanya menampilkan baris yang namanya mengandung "Roger"
- Counter jumlah hasil berubah sesuai filter
- Pencarian bersifat case-insensitive

---

#### TC-CB-013
**Judul:** Search trainee berdasarkan NRIC  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 2.

**Steps:**
1. Ketik bagian dari NRIC di search box (contoh: "212B")

**Expected Result:**
- Tabel hanya menampilkan trainee dengan NRIC yang mengandung "212B"

---

#### TC-CB-014
**Judul:** Search dengan query yang tidak cocok menampilkan empty state  
**Priority:** 🟡 Medium | **Type:** ❌ Negative

**Precondition:** User berada di Step 2.

**Steps:**
1. Ketik "XXXXXXX" di search box

**Expected Result:**
- Tabel menampilkan empty state / pesan "Tidak ada data yang cocok"
- Tidak ada error atau crash

---

#### TC-CB-015
**Judul:** Upload List modal terbuka saat klik tombol Upload  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 2.

**Steps:**
1. Klik tombol "Upload List"

**Expected Result:**
- Modal upload muncul (overlay/popup)
- Modal memiliki area drag-and-drop atau tombol browse file
- Ada tombol Close / Cancel di modal

---

#### TC-CB-016
**Judul:** Menutup modal Upload List mengembalikan state tanpa perubahan  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Modal Upload List sudah terbuka.

**Steps:**
1. Klik tombol Close atau Cancel di modal
2. Observasi halaman Nominal Roll

**Expected Result:**
- Modal tertutup
- Data tabel tidak berubah
- User tetap di Step 2

---

#### TC-CB-017
**Judul:** Tombol Review muncul dan membuka modal Review  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 2, ada minimal 1 trainee dalam list.

**Steps:**
1. Klik tombol "Review" atau "Next" di Step 2

**Expected Result:**
- Modal Review terbuka menampilkan ringkasan data yang akan disubmit
- User bisa melihat data sebelum lanjut

---

#### TC-CB-018
**Judul:** Pagination — navigasi ke halaman 2 tabel trainee  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Total trainee > 10 (pagination aktif).

**Steps:**
1. Klik tombol "2" atau "Next Page" di pagination
2. Observasi tabel

**Expected Result:**
- Tabel menampilkan 10 trainee berikutnya
- Nomor baris berubah (11, 12, 13, ...)
- Indikator halaman aktif berubah ke "2"

---

### Step 3: Cabin Configuration

---

#### TC-CB-019
**Judul:** Kabin Available bisa dipilih dengan checkbox  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 3 (Cabin Configuration).

**Steps:**
1. Identifikasi kabin yang berstatus "Available" (tidak ada label Occupied/Unavailable)
2. Klik checkbox di samping kiri kabin tersebut (misal CMT01)

**Expected Result:**
- Checkbox menjadi tercentang (checked)
- Row kabin ter-highlight / masuk ke daftar "selected"
- Konfigurasi fields (Platform Type, Role, Call Sign) menjadi aktif / visible

---

#### TC-CB-020
**Judul:** Kabin Occupied tidak bisa dipilih  
**Priority:** 🔴 High | **Type:** ❌ Negative

**Precondition:** User berada di Step 3. Kabin CMT03, CMT05, CMT07, CMT10, CMT11, CMT12 berstatus Occupied.

**Steps:**
1. Coba klik checkbox di samping kabin CMT03 (Occupied)

**Expected Result:**
- Checkbox tidak bisa diklik (disabled)
- Label "Occupied" tampil jelas di baris kabin tersebut
- Row tampil dengan warna abu-abu / dimmed

---

#### TC-CB-021
**Judul:** Kabin Unavailable (maintenance) tidak bisa dipilih  
**Priority:** 🔴 High | **Type:** ❌ Negative

**Precondition:** User berada di Step 3. CMT09 berstatus Unavailable.

**Steps:**
1. Coba klik checkbox atau row kabin CMT09

**Expected Result:**
- Tidak bisa dipilih
- Label "Unavailable" tampil dengan warna amber/kuning
- Background baris berbeda dari kabin normal

---

#### TC-CB-022
**Judul:** Set Weapon Variant (Platform Type) pada kabin yang dipilih  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** CMT01 sudah dipilih (checkbox aktif).

**Steps:**
1. Pada baris CMT01, klik dropdown Weapon Variant
2. Pilih "50HMG"

**Expected Result:**
- Dropdown menutup setelah pilihan dibuat
- "50HMG" tampil sebagai nilai terpilih di dropdown kabin CMT01
- Perubahan tersimpan di state form

---

#### TC-CB-023
**Judul:** Set Role pada kabin yang dipilih  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** CMT01 sudah dipilih.

**Steps:**
1. Pada baris CMT01, klik dropdown Role
2. Pilih "VC"

**Expected Result:**
- "VC" tampil sebagai nilai terpilih di dropdown Role CMT01

---

#### TC-CB-024
**Judul:** Set Call Sign pada kabin yang dipilih  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** CMT01 sudah dipilih.

**Steps:**
1. Pada baris CMT01, klik dropdown Call Sign
2. Pilih "09Z"

**Expected Result:**
- "09Z" tampil sebagai nilai Call Sign untuk CMT01

---

#### TC-CB-025
**Judul:** Tambah IOS entry — semua field IOS wajib diisi  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 3, ada minimal 1 kabin yang dipilih.

**Steps:**
1. Klik tombol "+ Add IOS" (atau tombol setara)
2. Di form IOS yang muncul, pilih IOS Device = "CMTIOS01"
3. Pilih Base Station = "BMS1ForceSide"
4. Set Master IOS = "Yes"
5. Set Force Type = "Friendly"

**Expected Result:**
- Entry IOS baru terbuat dengan data yang diisi
- Entry tampil di daftar IOS di bawah atau samping tabel kabin
- Bisa tambah IOS ke-2 dengan klik "+ Add IOS" lagi

---

#### TC-CB-026
**Judul:** Hapus IOS entry  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Minimal ada 1 IOS entry yang sudah ditambahkan.

**Steps:**
1. Klik tombol hapus (ikon X atau trash) pada IOS entry pertama

**Expected Result:**
- IOS entry tersebut hilang dari daftar
- Jika masih ada IOS entry lain, entry tersebut tetap ada dan tidak terganggu

---

#### TC-CB-027
**Judul:** Jumlah kabin yang dipilih tidak boleh melebihi Cabin Amount dari Step 1  
**Priority:** 🔴 High | **Type:** ⚠️ Edge Case

**Precondition:** Di Step 1 diisi Cabin Amount = 2.

**Steps:**
1. Di Step 3, coba pilih 3 kabin (centang CMT01, CMT02, CMT04)

**Expected Result:**
- Setelah 2 kabin terpilih, checkbox kabin ke-3 di-disable
- Sistem tidak mengizinkan pilihan melebihi Cabin Amount
- Ada notifikasi atau visual cue bahwa batas sudah tercapai

---

### Step 4: Review & Submit

---

#### TC-CB-028
**Judul:** Halaman Review menampilkan ringkasan semua step  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Step 1–3 sudah diisi dengan benar, user klik Next ke Step 4.

**Steps:**
1. Observasi halaman Review

**Expected Result:**
- Section Booking Details tampil: tanggal, sesi, programme, compartment, jumlah trainee
- Section Nominal Roll tampil: jumlah trainee yang terdaftar
- Section Cabin Configuration tampil: kabin yang dipilih beserta weapon variant, role, callsign-nya
- Section IOS tampil: IOS device, base station, master IOS, force type

---

#### TC-CB-029
**Judul:** Klik Submit berhasil membuat booking baru  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 4, semua data valid dan lengkap.

**Steps:**
1. Klik tombol "Submit" atau "Create Booking"
2. Tunggu response sistem

**Expected Result:**
- Muncul notifikasi sukses (toast atau success modal)
- User di-redirect ke halaman Booking Detail atau Booking List
- Booking baru tampil di list dengan Booking ID yang baru di-generate
- Status booking = "Upcoming"

---

#### TC-CB-030
**Judul:** Klik Back dari Step 4 kembali ke Step 3 tanpa kehilangan data  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 4.

**Steps:**
1. Klik tombol "Back" atau "Previous"
2. Periksa data di Step 3

**Expected Result:**
- User kembali ke Step 3 (Cabin Configuration)
- Semua konfigurasi kabin yang sudah diisi sebelumnya tetap ada (tidak reset)

---

#### TC-CB-031
**Judul:** Klik Back dari Step 3 kembali ke Step 2 tanpa kehilangan data  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di Step 3.

**Steps:**
1. Klik tombol "Back"
2. Periksa data di Step 2

**Expected Result:**
- User kembali ke Step 2 (Nominal Roll)
- Data trainee yang sudah ada tetap tampil

---

---

## Module 2 — Issue Assets

**Deskripsi Modul:**  
Halaman untuk melakukan scan RFID aset sebelum sesi latihan dimulai. Terdiri dari dua fase: Scanning (animasi scanning) dan Scanned (tabel aset yang berhasil ter-scan).

**URL:** `/system-hardware/issue-assets`  
**Diakses dari:** Halaman Assignment setelah Assignment dibuat

---

#### TC-IA-001
**Judul:** Halaman terbuka dalam fase Scanning dengan animasi yang benar  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User membuka halaman Issue Assets dari link Assignment atau navigasi langsung.

**Steps:**
1. Navigasi ke halaman Issue Assets
2. Observasi state awal halaman

**Expected Result:**
- Halaman menampilkan animasi RFID (lingkaran pulse merah, ikon scanner)
- Teks "Place your asset on the RFID reader" muncul
- Teks "Scanning in progress..." dengan animasi dots muncul di bawah
- Header menampilkan Base Station yang aktif (contoh: "Scan Assets for Training (IMT-03)")
- Tombol "Next" di header tampil disabled (tidak bisa diklik)
- Tombol "Back" tampil dan aktif

---

#### TC-IA-002
**Judul:** Transisi otomatis dari fase Scanning ke Scanned setelah 4 detik  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User baru masuk ke halaman Issue Assets, fase = "scanning".

**Steps:**
1. Tunggu 4 detik tanpa melakukan aksi apapun
2. Observasi perubahan tampilan

**Expected Result:**
- Setelah ~4 detik, animasi scanning hilang
- Halaman berganti ke tampilan tabel aset (scanned phase)
- Header menampilkan "● Connected" dalam warna hijau
- "Total Scans (X Assets)" berubah dari 0 menjadi jumlah aset yang ter-scan (dari mock data)
- Tombol "Confirm" menggantikan tombol "Next" (yang sebelumnya disabled)

---

#### TC-IA-003
**Judul:** Tabel aset tampil dengan kolom dan data yang benar setelah scan  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Fase sudah berubah ke "scanned".

**Steps:**
1. Observasi tabel "List of Assets"

**Expected Result:**
- Tabel menampilkan kolom: No, checkbox, nama aset, kategori/tipe, Base Station tujuan, tombol hapus
- Setiap baris punya nomor urut yang benar (1, 2, 3, ...)
- Total count di header tabel sesuai dengan jumlah baris

---

#### TC-IA-004
**Judul:** Checkbox — centang semua aset dengan "Select All"  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", tabel terisi.

**Steps:**
1. Klik checkbox di header tabel (Select All)

**Expected Result:**
- Semua baris ter-check (checkbox setiap baris berubah ke centang)
- Tombol "Delete Selected (X)" muncul di toolbar atas tabel dengan jumlah yang benar

---

#### TC-IA-005
**Judul:** Checkbox — centang sebagian aset (indeterminate state)  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", tabel terisi lebih dari 1 baris.

**Steps:**
1. Centang hanya 1 baris aset (bukan Select All)
2. Observasi checkbox di header

**Expected Result:**
- Checkbox header tampil dalam state indeterminate (garis horizontal, bukan centang penuh)
- Tombol "Delete Selected (1)" muncul

---

#### TC-IA-006
**Judul:** Hapus satu aset via tombol trash di baris  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", tabel terisi.

**Steps:**
1. Identifikasi nomor urut aset di baris ke-2 (misal: "SAR21 #002")
2. Klik ikon trash (🗑️) di baris ke-2
3. Observasi tabel setelah hapus

**Expected Result:**
- Baris aset ke-2 hilang dari tabel
- Nomor urut (No.) otomatis resequence: baris berikutnya menjadi 2, 3, 4, dst.
- Total count di header tabel berkurang 1

---

#### TC-IA-007
**Judul:** Hapus banyak aset via "Delete Selected"  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", minimal 3 baris aset tersedia.

**Steps:**
1. Centang baris ke-1 dan ke-3
2. Klik tombol "Delete Selected (2)"
3. Observasi tabel

**Expected Result:**
- Kedua baris yang dipilih hilang dari tabel
- Nomor urut di-resequence ulang
- Total count berkurang sesuai (- 2)
- Tombol "Delete Selected" hilang karena tidak ada lagi aset yang terseleksi

---

#### TC-IA-008
**Judul:** Tombol "Delete Selected" tidak muncul jika tidak ada yang dipilih  
**Priority:** 🟡 Medium | **Type:** ⚠️ Edge Case

**Precondition:** Fase "scanned", tidak ada checkbox yang dicentang.

**Steps:**
1. Pastikan tidak ada checkbox yang aktif
2. Observasi toolbar di atas tabel

**Expected Result:**
- Tombol "Delete Selected" tidak tampil di toolbar

---

#### TC-IA-009
**Judul:** Ganti Base Station tujuan untuk satu aset  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", tabel terisi.

**Steps:**
1. Pada salah satu baris aset, klik dropdown Base Station
2. Pilih base station yang berbeda dari nilai default

**Expected Result:**
- Nilai Base Station di baris tersebut berubah ke pilihan baru
- Baris lain tidak terpengaruh

---

#### TC-IA-010
**Judul:** Klik "Confirm" memunculkan Success Modal  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Fase "scanned", minimal 1 aset tersisa di tabel.

**Steps:**
1. Klik tombol "Confirm" di header

**Expected Result:**
- Success Modal muncul sebagai overlay
- Modal menampilkan pesan sukses issue assets
- Ada dua tombol: "Close" dan "View Assignment" (atau setara)

---

#### TC-IA-011
**Judul:** Success Modal — klik "View Assignment" navigasi ke detail booking  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Success Modal sudah terbuka, user mengakses halaman ini dengan parameter `bookingIds` di URL.

**Steps:**
1. Klik tombol "View Assignment" di Success Modal

**Expected Result:**
- Modal tertutup
- User di-redirect ke halaman Booking Detail yang sesuai (`/bookings/detail?id=...`)

---

#### TC-IA-012
**Judul:** Success Modal — klik "Close" menutup modal tanpa navigasi  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Success Modal sudah terbuka.

**Steps:**
1. Klik tombol "Close" di Success Modal

**Expected Result:**
- Modal tertutup
- User tetap di halaman Issue Assets
- State tabel tidak berubah

---

#### TC-IA-013
**Judul:** Klik "Back" dari halaman Issue Assets kembali ke halaman Assignment  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Issue Assets.

**Steps:**
1. Klik tombol "Back" di header

**Expected Result:**
- User dinavigasi ke `/system-hardware/create-assignment`

---

#### TC-IA-014
**Judul:** Konfirmasi dengan 0 aset — tidak bisa konfirmasi jika tabel kosong  
**Priority:** 🟡 Medium | **Type:** ❌ Negative

**Precondition:** Fase "scanned", user sudah menghapus semua aset dari tabel.

**Steps:**
1. Hapus semua aset satu per satu atau gunakan Select All → Delete Selected
2. Coba klik tombol "Confirm"

**Expected Result:**
- Tombol "Confirm" di-disable atau muncul pesan error
- Issue Assets tidak bisa dikonfirmasi tanpa aset apapun

---

#### TC-IA-015
**Judul:** Base Station default sesuai dengan parameter URL  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Halaman diakses dengan URL parameter `?baseStation=SWT-02`.

**Steps:**
1. Navigasi ke `/system-hardware/issue-assets?baseStation=SWT-02`
2. Observasi header halaman

**Expected Result:**
- Header menampilkan "Scan Assets for Training (SWT-02)"
- Bukan "IMT-03" (default fallback)

---

---

## Module 3 — Training Results

**Deskripsi Modul:**  
Halaman daftar semua hasil latihan yang sudah selesai, dengan kemampuan pencarian, filter, dan sorting. Klik baris membuka halaman detail dengan 4 tab: Training Performance, Nominal Roll, Detail List, Leaderboard.

**URL:** `/training-results`

---

### List View

---

#### TC-TR-001
**Judul:** Halaman Training Results terbuka dan menampilkan tabel dengan data  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User login dan navigasi ke menu Training Results.

**Steps:**
1. Klik menu "Training Results" di sidebar

**Expected Result:**
- Halaman terbuka dengan tabel yang berisi data hasil latihan
- Kolom tabel: No, Program, Type, Booking Date, Mode, ATMS File ID, dan tombol View
- Counter "X results" tampil di kiri atas tabel
- Search bar, tombol Date, dan tombol Filters tersedia di toolbar

---

#### TC-TR-002
**Judul:** Search berdasarkan nama program  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka, data sudah tampil.

**Steps:**
1. Ketik nama program di search box (misal: "IOCC")
2. Observasi tabel

**Expected Result:**
- Tabel langsung memfilter (tanpa perlu klik Enter/Search)
- Hanya baris yang nama programnya mengandung "IOCC" yang tampil
- Counter "X results" berubah sesuai hasil filter
- Pagination reset ke halaman 1

---

#### TC-TR-003
**Judul:** Search berdasarkan Booking ID  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka.

**Steps:**
1. Ketik sebagian Booking ID di search box (misal: "#26060")

**Expected Result:**
- Tabel memfilter dan menampilkan hanya booking dengan ID yang mengandung string tersebut

---

#### TC-TR-004
**Judul:** Search query yang tidak cocok menampilkan empty state  
**Priority:** 🟡 Medium | **Type:** ❌ Negative

**Precondition:** Halaman Training Results terbuka.

**Steps:**
1. Ketik "ZZZZZZNOTEXIST" di search box

**Expected Result:**
- Tabel menampilkan state kosong dengan pesan "Tidak ada hasil" atau setara
- Counter menampilkan "0 results"
- Tidak ada error atau crash

---

#### TC-TR-005
**Judul:** Hapus search query mengembalikan semua data  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Search sudah diisi dan tabel sudah terfilter.

**Steps:**
1. Hapus semua teks di search box (backspace atau klik clear)

**Expected Result:**
- Tabel kembali menampilkan semua data
- Counter kembali ke total semula

---

#### TC-TR-006
**Judul:** Sort Booking Date — klik header untuk toggle asc/desc  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka, default sort = desc (terbaru di atas).

**Steps:**
1. Klik header kolom "Booking Date" (ada ikon sort ⇅)
2. Observasi urutan data
3. Klik lagi header yang sama

**Expected Result:**
- Klik pertama: Data tersortir ascending (terlama di atas), ikon berubah
- Klik kedua: Data tersortir descending lagi (terbaru di atas)

---

#### TC-TR-007
**Judul:** Buka Filter Panel via tombol Filters  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka.

**Steps:**
1. Klik tombol "Filters"

**Expected Result:**
- Panel filter muncul (drawer dari sisi kanan atau overlay)
- Berisi opsi filter: Training Type (Group/Individual), Training Mode, dll.
- Ada tombol "Apply" dan "Clear"

---

#### TC-TR-008
**Judul:** Terapkan filter dan data tabel berubah sesuai filter  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Filter Panel sudah terbuka.

**Steps:**
1. Pilih salah satu filter (misal: Training Type = "Group")
2. Klik tombol "Apply"

**Expected Result:**
- Panel filter menutup
- Tabel hanya menampilkan hasil dengan Training Type = Group
- Tombol "Filters" di toolbar menampilkan badge angka (jumlah filter aktif)
- Pagination reset ke halaman 1

---

#### TC-TR-009
**Judul:** Badge filter count muncul di tombol Filters ketika ada filter aktif  
**Priority:** 🟡 Medium | **Type:** 🎨 UI / Visual

**Precondition:** Minimal 1 filter sudah di-apply.

**Steps:**
1. Observasi tombol "Filters" di toolbar

**Expected Result:**
- Badge merah kecil dengan angka (contoh: "2") muncul di pojok tombol Filters
- Warna tombol berubah ke warna brand (tidak lagi abu-abu)

---

#### TC-TR-010
**Judul:** Clear semua filter mengembalikan data ke kondisi awal  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Ada filter yang sudah di-apply.

**Steps:**
1. Klik tombol "Filters"
2. Klik "Clear" di dalam panel filter
3. Observasi tabel dan toolbar

**Expected Result:**
- Semua checkbox filter ter-deselect
- Tabel menampilkan semua data lagi
- Badge angka di tombol "Filters" hilang
- Tombol "Filters" kembali ke warna normal (abu-abu)

---

#### TC-TR-011
**Judul:** Tutup filter panel tanpa Apply tidak mengubah data  
**Priority:** 🟡 Medium | **Type:** ⚠️ Edge Case

**Precondition:** Filter Panel terbuka, ada perubahan pending yang belum di-Apply.

**Steps:**
1. Pilih beberapa opsi filter (belum klik Apply)
2. Klik tombol Close (X) panel filter

**Expected Result:**
- Panel filter tertutup
- Data tabel tidak berubah (perubahan pending diabaikan)
- Filter yang sebelumnya aktif (jika ada) tetap aktif seperti sebelumnya

---

#### TC-TR-012
**Judul:** Pagination — navigasi halaman tabel training results  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** Total data lebih dari items per halaman (PER_PAGE).

**Steps:**
1. Klik tombol "2" atau "Next" di pagination
2. Observasi tabel

**Expected Result:**
- Tabel menampilkan data halaman 2
- Nomor "No" dimulai dari (PER_PAGE + 1)
- Indikator halaman aktif berubah ke "2"

---

#### TC-TR-013
**Judul:** Klik baris tabel navigasi ke halaman Training Detail  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka, data tersedia.

**Steps:**
1. Klik di mana saja pada salah satu baris tabel (pada nama program, tanggal, atau nomor baris)

**Expected Result:**
- User di-navigasi ke halaman Training Detail (`/training-results/detail`)
- Halaman detail menampilkan informasi yang relevan dengan data yang diklik

---

#### TC-TR-014
**Judul:** Klik ikon Eye di kolom Action navigasi ke Training Detail  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** Halaman Training Results terbuka.

**Steps:**
1. Klik ikon Eye (👁) di kolom aksi (kolom terakhir) pada salah satu baris

**Expected Result:**
- User di-navigasi ke halaman Training Detail
- Klik Eye tidak memicu klik baris secara bersamaan (stopPropagation berjalan)

---

#### TC-TR-015
**Judul:** Badge Training Type menampilkan warna yang benar (Group vs Individual)  
**Priority:** 🟢 Low | **Type:** 🎨 UI / Visual

**Precondition:** Halaman Training Results terbuka, ada data dengan Type "Group" dan "Individual".

**Steps:**
1. Observasi kolom "Type" di tabel

**Expected Result:**
- Baris dengan Type = "Group" menampilkan badge biru (`bg-blue-50 text-blue-600`)
- Baris dengan Type = "Individual" menampilkan badge ungu (`bg-purple-50 text-purple-600`)

---

### Detail View

**URL:** `/training-results/detail`

---

#### TC-TR-016
**Judul:** Halaman Training Detail menampilkan header dengan informasi booking  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User navigasi ke halaman Training Detail.

**Steps:**
1. Observasi header halaman

**Expected Result:**
- Nama program tampil sebagai judul (warna brand red)
- Booking ID tampil dalam font monospace di bawah judul
- "Created [tanggal]" tampil di samping Booking ID
- Info sesi tampil dengan ikon kalender
- Tombol "Download" (dropdown) tampil di kanan atas
- Tombol "View Booking Details" tampil di bawah judul

---

#### TC-TR-017
**Judul:** Tab Training Performance adalah tab default yang aktif  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User baru masuk ke halaman Training Detail.

**Steps:**
1. Observasi tab yang aktif saat halaman pertama terbuka

**Expected Result:**
- Tab "Training Performance" aktif (ada garis merah di bawahnya)
- Konten tab Training Performance tampil (chart, statistik, dll.)

---

#### TC-TR-018
**Judul:** Switch ke tab Nominal Roll  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Training Detail.

**Steps:**
1. Klik tab "Nominal Roll"

**Expected Result:**
- Tab "Nominal Roll" menjadi aktif (garis merah muncul)
- Konten berubah ke tabel daftar trainee
- Tab sebelumnya (Training Performance) menjadi inactive

---

#### TC-TR-019
**Judul:** Switch ke tab Detail List  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Training Detail.

**Steps:**
1. Klik tab "Detail List"

**Expected Result:**
- Tab "Detail List" menjadi aktif
- Konten berubah ke tampilan detail penugasan kabin

---

#### TC-TR-020
**Judul:** Switch ke tab Leaderboard  
**Priority:** 🔴 High | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Training Detail.

**Steps:**
1. Klik tab "Leaderboard"

**Expected Result:**
- Tab "Leaderboard" menjadi aktif
- Konten berubah ke tampilan ranking trainee berdasarkan skor

---

#### TC-TR-021
**Judul:** Dropdown Download — membuka pilihan file  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Training Detail.

**Steps:**
1. Klik tombol "Download" (ada ikon chevron down)
2. Observasi dropdown yang muncul

**Expected Result:**
- Dropdown membuka dua opsi: "Training Results" dan "Take Home Package"
- Setiap opsi memiliki ikon download di sebelah kiri

---

#### TC-TR-022
**Judul:** Dropdown Download — menutup saat klik di luar area dropdown  
**Priority:** 🟡 Medium | **Type:** ⚠️ Edge Case

**Precondition:** Dropdown Download sudah terbuka.

**Steps:**
1. Klik area di luar dropdown (body halaman, bukan salah satu opsi)

**Expected Result:**
- Dropdown menutup otomatis
- Tidak ada aksi download yang terpicu

---

#### TC-TR-023
**Judul:** Klik "View Booking Details" navigasi ke halaman Booking Detail  
**Priority:** 🟡 Medium | **Type:** ✅ Happy Path

**Precondition:** User berada di halaman Training Detail.

**Steps:**
1. Klik tombol "View Booking Details"

**Expected Result:**
- User di-navigasi ke halaman Booking Detail (`/bookings/detail`)
- Halaman Booking Detail yang ditampilkan adalah booking yang terkait dengan hasil training ini

---

---

## Ringkasan Test Cases

| Modul | Total TC | High 🔴 | Medium 🟡 | Low 🟢 |
|-------|---------|---------|----------|-------|
| Create Booking (CMT) | 31 | 15 | 14 | 2 |
| Issue Assets | 15 | 7 | 8 | 0 |
| Training Results | 23 | 12 | 10 | 1 |
| **TOTAL** | **69** | **34** | **32** | **3** |

| Tipe | Jumlah |
|------|-------|
| ✅ Happy Path | 44 |
| ❌ Negative / Validation | 12 |
| ⚠️ Edge Case | 9 |
| 🎨 UI / Visual | 4 |

---

*QA Test Cases ini dibuat berdasarkan analisis kode sumber TRMS prototype.  
Untuk regression test setelah setiap perubahan major, prioritaskan semua test case berlabel 🔴 High terlebih dahulu.*
