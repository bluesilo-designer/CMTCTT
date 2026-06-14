# TRMS — Kamus Istilah & Panduan Konsep

> Dokumen ini menjelaskan setiap istilah yang digunakan dalam sistem TRMS,  
> lengkap dengan analogi, contoh nyata, dan penjelasan "mengapa ini penting"  
> agar mudah dipahami oleh siapa saja — teknis maupun non-teknis.  
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
10. [Detail List](#10-detail-list) · [Training Batch](#training-batch-batch-pelaksanaan-cmt)
11. [Hasil Latihan](#11-hasil-latihan)
12. [Status Booking](#12-status-booking)
13. [Organisasi & Personel](#13-organisasi--personel)
14. [Istilah Tambahan](#14-istilah-tambahan)
15. [Alur Lengkap (Ringkasan Visual)](#15-alur-lengkap-ringkasan-visual)
16. [PRD — Booking Flow CMT (Standalone)](#16-prd--booking-flow-cmt-standalone)
17. [Panduan Step-by-Step: Membuat Booking](#17-panduan-step-by-step-membuat-booking)

---

## 1. Gambaran Besar Sistem

### TRMS — Training Resource Management System

**Apa itu?**  
Sistem digital terpusat untuk mengelola seluruh siklus hidup latihan militer di fasilitas simulator — mulai dari pemesanan jadwal, pendaftaran peserta, konfigurasi perangkat simulator, hingga pencatatan hasil latihan dan pengembalian aset.

**Siapa yang menggunakannya?**
- **Operator / Admin Fasilitas** — membuat dan mengelola booking, mengatur konfigurasi simulator
- **Instruktur** — menjalankan sesi latihan melalui IOS, memantau performa trainee
- **Unit Militer (Pemohon)** — mengajukan jadwal latihan untuk prajurit mereka
- **Manajemen** — memantau utilisasi fasilitas, melihat rekap hasil latihan

**Mengapa dibutuhkan?**  
Tanpa TRMS, seluruh proses ini dilakukan manual — spreadsheet, telepon, dan formulir kertas. Akibatnya: jadwal bentrok, aset hilang tidak tercatat, data trainee tidak akurat, dan laporan hasil latihan memakan waktu berhari-hari. TRMS mendigitalisasi seluruh alur ini dalam satu platform.

**Analoginya:**  
Bayangkan sebuah **hotel besar khusus simulator**. TRMS adalah sistem manajemen hotel tersebut — mulai dari booking kamar, check-in tamu, pengaturan fasilitas, hingga laporan siapa saja yang menginap dan bagaimana hasilnya. Bedanya: "tamunya" adalah prajurit, dan "kamarnya" adalah kabin simulator senilai jutaan dolar.

---

## 2. Platform Latihan

Terdapat beberapa jenis "arena latihan" yang berbeda dalam sistem ini. Masing-masing punya cara kerja, perangkat, dan alur manajemen yang berbeda di TRMS.

---

### CMT — Combat Mission Trainer

**Apa itu?**  
Simulator berbasis **kabin** (ruangan fisik tertutup yang meniru interior kendaraan tempur lapis baja). Di dalamnya, sebuah tim kru lengkap berlatih mengoperasikan kendaraan — dari pengemudian, penembakan, hingga koordinasi taktis — semua dalam lingkungan virtual yang realistis.

**Apa yang terjadi di dalam kabin?**  
Kabin CMT dilengkapi dengan kursi yang identik dengan kendaraan asli, layar 360° yang menampilkan medan perang virtual, panel kontrol dan senjata yang berfungsi sama seperti aslinya, serta sistem audio surround untuk menambah kesan realistis. Trainee benar-benar tidak bisa membedakan apakah ini latihan atau misi nyata dari sisi pengalaman sensorik.

**Analoginya:**  
Seperti **flight simulator pilot** — tetapi untuk kru kendaraan tempur lapis baja. Seorang pilot bisa berlatih mendarat di cuaca badai tanpa risiko nyata; begitu pula kru CMT bisa berlatih skenario pertempuran tanpa menempatkan nyawa atau kendaraan mahal dalam bahaya.

**Ciri khas dalam sistem:**
- Setiap kabin = 1 kendaraan tempur virtual (CMT01, CMT02, dst.)
- Satu sesi bisa menjalankan banyak kabin **secara bersamaan** dan saling terhubung dalam satu skenario misi
- Setiap kabin dikendalikan oleh instruktur dari IOS terpisah
- Tidak ada aset fisik (senjata, peralatan) yang perlu dikeluarkan — hanya konfigurasi software

---

### CTT — Crew Training Trainer

**Apa itu?**  
Simulator berbasis **cluster** (kelompok stasiun latihan individual). Berbeda dengan CMT yang melatih satu tim dalam satu kabin, CTT melatih setiap trainee **secara individual** di stasiun masing-masing untuk skill teknis yang spesifik, seperti pengenalan sistem senjata, prosedur darurat, atau familiarisasi sistem elektronik kendaraan.

**Apa yang terjadi di CTT?**  
Setiap trainee duduk di satu stasiun (kursi + layar + kontrol terbatas). Instruktur dari satu IOS bisa memantau semua stasiun sekaligus, memberikan tugas yang sama ke semua orang, atau tugas berbeda per individu. Ini cocok untuk pelatihan skill dasar sebelum trainee masuk ke kabin CMT yang lebih kompleks.

**Analoginya:**  
Seperti **laboratorium komputer** — setiap mahasiswa punya komputernya masing-masing, dosen memonitor dari meja guru. CTT adalah "kelas teori + praktik dasar" sebelum masuk ke "simulator penuh" (CMT).

**Ciri khas:**
- Setiap cluster = satu grup stasiun trainee (CTT01, CTT04, dll.)
- Lebih fokus ke skill individual dan prosedural dibanding misi tim
- Lebih efisien untuk melatih banyak orang sekaligus pada skill yang sama

---

### CMT+CTT — Sesi Gabungan

**Apa itu?**  
Sesi latihan yang menggabungkan CMT dan CTT dalam **satu booking terintegrasi**. Sebagian trainee berlatih di kabin CMT (misi tim), sebagian lagi berlatih di cluster CTT (skill individual), dan semua ini dikoordinasikan dalam satu sesi yang sama.

**Mengapa ini lebih kompleks?**  
Karena ada dua jenis simulator berbeda yang harus dikonfigurasi secara bersamaan, jumlah trainee lebih banyak, dan perlu ada koordinasi antara instruktur CMT dan CTT. Itulah sebabnya CMT+CTT adalah satu-satunya tipe yang memiliki alur **Onboarding penuh** (scan NRIC, konfirmasi kehadiran, generate detail list secara real-time di hari H).

**Aturan penting:**  
Proses **Onboarding** (check-in peserta pada hari H) **hanya ada** pada tipe CMT+CTT. Booking CMT saja melakukan proses pre-configuration di hari sebelumnya via Sync.

---

### IMT — Indoor Marksmanship Trainer

**Apa itu?**  
Simulator untuk latihan menembak senjata ringan (SAR21, M16, Ultimax, dll.) di dalam ruangan tanpa menggunakan peluru nyata. Senjata fisik dihubungkan ke sistem sensor yang mendeteksi arah bidikan dan mensimulasikan dampak tembakan di layar.

**Mengapa penting?**  
Latihan menembak di lapangan terbuka membutuhkan lahan khusus, amunisi mahal, kondisi cuaca yang tepat, dan prosedur keamanan yang panjang. IMT memungkinkan latihan kapan saja, lebih hemat, dan dengan feedback yang lebih kaya (data akurasi, waktu reaksi, pola tembakan bisa direkam dan dianalisis).

**Analoginya:**  
Seperti **shooting range virtual** — prajurit berlatih menembak dengan senjata asli yang terhubung ke layar simulasi. Senjata terasa nyata di tangan, tapi tidak ada peluru yang melayang.

**Aset yang dikelola:** Senjata ringan (SAR21, M16, dll.) merupakan aset fisik yang harus dikeluarkan dari gudang (Issue) dan dikembalikan (Return) setiap sesi.

---

### SWT — Shooter Weapon Trainer

**Apa itu?**  
Simulator untuk latihan sistem senjata yang lebih besar dan kompleks dibanding IMT — seperti senapan mesin berat, peluncur granat, sistem anti-tank, atau senjata kendaraan. SWT biasanya terhubung dengan stasiun fisik yang lebih besar dan memerlukan konfigurasi lane (jalur latihan) yang spesifik.

**Perbedaan SWT vs IMT:**

| Aspek | IMT | SWT |
|-------|-----|-----|
| Jenis senjata | Senjata ringan (SAR21, M16) | Senjata berat / sistem senjata (GPMG, Spike, dll.) |
| Konfigurasi | Lane sederhana | Lane kompleks dengan parameter senjata |
| Skala | Individual | Kelompok / sistem |

**Aset yang dikelola:** Sama seperti IMT, SWT melibatkan Issue dan Return aset fisik setiap sesi.

---

## 3. Fasilitas & Perangkat

### Cabin (Kabin)

**Apa itu?**  
Unit fisik berupa ruangan tertutup yang mereplikasi interior kendaraan tempur (Terrex ICV, dll.) secara detail. Di dalamnya terdapat kursi awak lengkap, layar-layar yang menampilkan pandangan dari dalam kendaraan, panel kontrol yang berfungsi, sistem senjata simulasi, dan sistem audio.

**Mengapa setiap kabin punya nomor?**  
Karena setiap kabin adalah aset mahal yang perlu dijadwalkan, dirawat, dan dipantau. Penomoran memungkinkan operator mengetahui kabin mana yang sedang dipakai, mana yang kosong, dan mana yang sedang dalam maintenance. Jika kabin CMT09 rusak, sistem akan menandainya sebagai *Unavailable* agar tidak ter-booking.

**Status kabin:**
- **Available** — Bebas digunakan, bisa dipilih dalam booking
- **Occupied** — Sedang digunakan oleh booking lain pada waktu yang sama
- **Unavailable** — Tidak bisa digunakan, misalnya sedang maintenance atau kerusakan teknis

**Contoh:** CMT01, CMT02, CMT03 … CMT12

---

### Cluster

**Apa itu?**  
Satuan pengelompokan stasiun latihan untuk CTT. Satu cluster terdiri dari beberapa seat/terminal yang digunakan bersamaan oleh sekelompok trainee.

**Perbedaan Cluster vs Cabin:**  
Kabin CMT adalah satu unit besar untuk **satu tim** (5–6 orang dalam satu "kendaraan"). Cluster CTT adalah kumpulan stasiun untuk **beberapa individu** yang masing-masing berdiri sendiri tetapi dikoordinasikan sebagai satu grup oleh instruktur.

**Analoginya:**  
Seperti **satu blok meja di ruang ujian** — semua orang di blok itu mengerjakan soal yang sama, tapi masing-masing di lembar jawabannya sendiri. Instruktur memantau satu blok sekaligus.

**Contoh:** CTT01, CTT04

---

### IOS — Instructor Operator Station

**Apa itu?**  
Komputer workstation khusus yang digunakan instruktur untuk **mengontrol, memantau, dan mengintervensi** sesi latihan yang berjalan di dalam kabin/cluster. IOS adalah "jembatan" antara instruktur di luar dan trainee di dalam simulator.

**Apa yang bisa dilakukan dari IOS?**
- Memilih dan menjalankan skenario misi
- Mengubah kondisi skenario secara real-time (cuaca, musuh, tingkat kesulitan)
- Melihat feed video dari dalam kabin
- Memantau posisi, kesehatan, dan status senjata setiap kendaraan simulasi
- Menghentikan, menjeda, atau mengulang misi
- Memberikan brief / debrief audio ke trainee
- Merekam sesi untuk review pasca-latihan

**Mengapa setiap kabin harus punya IOS sendiri?**  
Karena instruktur perlu memantau dan merespons setiap kabin secara independen. Jika satu instruktur memegang dua kabin, ia tidak bisa memantau keduanya secara bersamaan saat situasi kritis. Aturan sistem: **satu IOS = satu kabin, satu waktu**.

**Catatan teknis:** Dalam konfigurasi besar, ada konsep **Master IOS** — IOS yang mengkoordinasikan beberapa IOS slave. Master IOS biasanya dipegang oleh instruktur senior atau Platoon Commander.

**Contoh:** CMTIOS01, CMTIOS02, CMTIOS03, CMTIOS04

---

### Base Station

**Apa itu?**  
Server/infrastruktur jaringan pusat yang menghubungkan semua simulator (kabin, cluster, IOS) dalam satu ekosistem latihan yang terintegrasi. Base Station memastikan semua kabin berjalan dalam satu "dunia virtual" yang sama — posisi, komunikasi, dan event antar kendaraan saling terlihat.

**Mengapa penting?**  
Tanpa Base Station, kabin-kabin CMT hanya bisa latihan sendiri-sendiri dalam isolasi. Base Station memungkinkan 4 kabin bergerak bersama dalam formasi, berkomunikasi via radio simulasi, dan melihat posisi satu sama lain — persis seperti operasi militer nyata.

**Analoginya:**  
Seperti **server game multiplayer** — pemain (kabin) terkoneksi ke server yang sama sehingga bisa berinteraksi dalam dunia yang sama. Tanpa server, setiap pemain hanya bisa main offline sendiri-sendiri.

**Contoh konfigurasi:** SWT-01, SWT-02 (untuk SWT), IMT-01, IMT-02 (untuk IMT)

---

### Master IOS & Force Type

**Master IOS:**  
IOS yang berperan sebagai koordinator utama dalam sesi multi-kabin. Instruktur di Master IOS bisa melihat overview semua kabin dan memberikan instruksi global ke seluruh tim.

**Force Type:**  
Identifikasi apakah kabin tersebut berperan sebagai pasukan **Friendly** (tim sendiri) atau **Opposing** (musuh/lawan) dalam skenario latihan. Satu sesi CMT bisa memiliki beberapa kabin Friendly dan beberapa kabin Opposing untuk menciptakan skenario pertempuran yang lebih realistis.

---

### RFID Reader & Antenna

**Apa itu?**  
Perangkat hardware yang mendeteksi dan mencatat pergerakan aset fisik (senjata, peralatan) menggunakan teknologi Radio Frequency Identification. Setiap aset dilengkapi tag RFID kecil; ketika melewati reader, sistem otomatis mencatat kapan dan ke mana aset tersebut bergerak.

**Mengapa penting dalam konteks TRMS?**  
Untuk IMT dan SWT, puluhan senjata bisa keluar-masuk fasilitas setiap hari. Tanpa RFID, tracking manual sangat rawan kesalahan — senjata bisa tertinggal, tidak dikembalikan, atau dicatat salah. RFID otomatisasi proses ini sehingga akurat dan real-time.

**Analoginya:**  
Seperti **sensor ERP di jalan tol** — kendaraan (aset) tidak perlu berhenti, sistem otomatis membaca dan mencatat saat mereka lewat. Bedanya, ini untuk senjata bukan mobil.

---

## 4. Booking & Penjadwalan

### Booking

**Apa itu?**  
Reservasi resmi dan terdokumentasi untuk menggunakan fasilitas simulator pada tanggal, waktu, dan konfigurasi tertentu. Booking adalah "kontrak" antara unit pemohon dan fasilitas simulator.

**Mengapa perlu sistem booking?**  
Fasilitas simulator adalah aset mahal dan terbatas. Pada hari yang sama, bisa ada 5 unit berbeda yang ingin menggunakan CMT. Tanpa sistem booking yang ketat, akan terjadi konflik penggunaan, alokasi yang tidak adil, dan perencanaan logistik yang kacau.

**Apa saja yang didefinisikan dalam satu booking:**
- **Siapa** — unit/satuan yang berlatih, nama instruktur
- **Kapan** — tanggal dan sesi (AM/PM/Full Day)
- **Apa** — jenis platform (CMT/CTT/IMT/SWT), courseware yang digunakan
- **Berapa** — jumlah trainee, jumlah kabin/lane yang dibutuhkan
- **Bagaimana** — tipe kendaraan, variant senjata, konfigurasi IOS

**Analoginya:**  
Seperti **reservasi studio rekaman** — kamu memesan ruangan (kabin/lane), untuk berapa musisi (trainee), pada jam berapa, dengan peralatan apa (platform/senjata), dan akan merekam lagu apa (courseware/skenario).

---

### Booking ID

**Apa itu?**  
Kode referensi unik yang dihasilkan sistem secara otomatis saat booking dibuat. Digunakan sebagai identifikasi di semua dokumen, laporan, dan komunikasi terkait booking tersebut.

**Format:** `#YYmmdd-[TYPE]NNN`  
**Contoh:**
- `#260604-CMT001` = Booking CMT ke-1 pada tanggal 4 Juni 2026
- `#260604-SWT003` = Booking SWT ke-3 pada tanggal yang sama

---

### Courseware

**Apa itu?**  
Paket konten latihan terstruktur yang menentukan: skenario yang dimainkan, objektif yang harus dicapai, standar kelulusan, dan materi assessment. Courseware adalah "kurikulum" dari satu sesi latihan.

**Mengapa ini penting?**  
Berbeda courseware = berbeda latihan yang dilakukan, berbeda standar penilaian, dan berbeda konfigurasi simulator yang dibutuhkan. Instruktur harus memilih courseware yang tepat sesuai level dan kebutuhan trainee.

**Contoh courseware:**
- `IOCC_2(TRX)` — Initial Operator Crew Course Level 2, untuk platform Terrex. Digunakan untuk kru Terrex yang baru pertama kali latihan di CMT.
- `Component Type Training B` — Pelatihan komponen spesifik tipe B
- `Tactical Maneuvering Advanced` — Manuver taktis tingkat lanjut

---

### Assignment

**Apa itu?**  
Dokumen digital yang mencatat aset fisik mana saja (senjata, peralatan, aksesori) yang dialokasikan untuk booking tertentu. Assignment dibuat sebelum hari latihan, sebagai persiapan logistik.

**Alur Assignment:**
1. Operator melihat kebutuhan booking (misal: 10 SAR21, 2 GPMG)
2. Sistem mengecek stok aset yang available
3. Operator membuat Assignment — "booking ini akan menggunakan aset nomor X, Y, Z"
4. Pada hari H, petugas gudang mengambil aset sesuai Assignment dan melakukan Issue

**Analoginya:**  
Seperti **Purchase Order dalam procurement** — dokumen yang menyatakan "kita butuh ini, untuk keperluan ini, pada tanggal ini". Belum berarti barangnya sudah berpindah tangan, tapi sudah ada komitmen alokasi.

---

### Issue Assets

**Apa itu?**  
Proses fisik pengeluaran aset dari gudang ke tangan unit yang berlatih, dicatat secara digital melalui scan RFID. Issue hanya bisa dilakukan setelah Assignment ada.

**Langkah-langkah:**
1. Petugas scan tag RFID aset satu per satu
2. Sistem memverifikasi: aset ini memang dialokasikan untuk booking ini?
3. Jika ya, status aset berubah dari "In Storage" menjadi "In Use"
4. Catatan waktu dan operator yang mengeluarkan tersimpan otomatis

**Mengapa harus via RFID, tidak manual?**  
Manual rawan human error — salah catat nomor serial, lupa mencatat satu item, atau perbedaan interpretasi kondisi aset. RFID eliminasi ambiguitas: aset terbaca atau tidak terbaca, tidak ada "grey area".

---

### Return Assets

**Apa itu?**  
Proses pengembalian aset dari lapangan ke gudang setelah sesi latihan selesai, dicatat via RFID. Booking tidak bisa ditandai "Completed" sepenuhnya jika masih ada aset yang belum dikembalikan.

**Apa yang dicek saat return?**
- Apakah semua aset yang di-issue sudah kembali?
- Kondisi aset (ada kerusakan?)
- Apakah jumlahnya sama dengan yang di-issue?

**Jika ada aset yang tidak kembali:** Status booking akan masuk ke **"Return Assets"** — status khusus yang menandakan sesi sudah selesai tapi ada aset outstanding yang perlu diselesaikan.

---

## 5. Nominal Roll

**Apa itu?**  
Daftar resmi dan terverifikasi semua personel (trainee) yang akan mengikuti sesi latihan, lengkap dengan data identitas dan penugasan role mereka. Nominal Roll adalah "manifest" dari sebuah sesi latihan.

**Mengapa Nominal Roll begitu kritis?**  
1. **Keamanan fasilitas** — Hanya orang yang terdaftar yang boleh masuk ke area simulator. Fasilitas militer tidak bisa membiarkan orang masuk tanpa verifikasi.
2. **Konfigurasi simulator** — Sistem perlu tahu siapa yang akan duduk di posisi mana (VC, VO, TC, dll.) untuk menyiapkan konfigurasi kabin yang tepat.
3. **Akuntabilitas aset** — Setiap trainee bertanggung jawab atas aset yang ia gunakan. Nominal roll menjadi referensi jika ada aset yang hilang atau rusak.
4. **Pelaporan hasil** — Hasil latihan (Pass/Fail/Marksman) dilampirkan ke nama trainee di nominal roll, bukan hanya "kelompok anonim".

**Data per trainee:**
| Field | Keterangan |
|-------|-----------|
| Nama lengkap | Nama sesuai kartu identitas militer |
| NRIC | Nomor identitas nasional (disamarkan sebagian di sistem) |
| Pangkat (Rank) | REC, PTE, CPL, SGT, WO, MAJ, dst. |
| Role | Posisi dalam kendaraan (VC, VO, TC/PC, SC, SO) |
| Unit | Satuan asal (1SIR, 2SIR, dst.) |
| Batch | Angkatan kursus (06/26 = Juni 2026) |
| Course | Kode kursus yang sedang diikuti |

**Proses:**  
Nominal Roll biasanya disiapkan **H-1 atau lebih awal** oleh unit. Di-upload ke TRMS, kemudian dikonfirmasi saat onboarding (CMT+CTT) atau saat Generate Detail List (CMT Standalone).

**Konsekuensi jika tidak lengkap:**  
Sistem tidak akan mengizinkan Generate Detail List. Trainee yang tidak terdaftar tidak akan mendapat penugasan kabin dan tidak bisa mengikuti sesi.

---

### NRIC — National Registration Identity Card

**Apa itu?**  
Nomor identitas nasional resmi Singapura. Dalam konteks TRMS, digunakan sebagai primary key untuk identifikasi trainee — terutama saat scan di onboarding.

**Mengapa NRIC, bukan nama?**  
Nama bisa duplikat (ada banyak "Muhammad Ali"), tapi NRIC selalu unik. Sistem menggunakan NRIC untuk memastikan trainee yang hadir di hari H adalah orang yang sama dengan yang terdaftar di nominal roll.

**Format dalam sistem:** `T6535925H`  
**Format yang ditampilkan (privacy):** `****925H` — 4 digit awal disamarkan untuk melindungi data pribadi.

---

### Rank (Pangkat)

Pangkat menentukan posisi hierarki trainee dalam unit dan **secara tidak langsung** mempengaruhi role yang cocok untuk mereka dalam simulasi.

| Kode | Kepanjangan | Setara Sipil | Biasanya berperan sebagai |
|------|-------------|--------------|--------------------------|
| REC | Recruit | Magang / New hire | VO (operator dasar) |
| PTE | Private | Staf junior | VO, SO |
| CPL | Corporal | Staf | VO, VC |
| SGT | Sergeant | Supervisor | VC, SC |
| WO | Warrant Officer | Senior Manager | SC, TC |
| MAJ | Major | General Manager | TC/PC (Platoon Commander) |
| LTC | Lieutenant Colonel | Director | Observer / Evaluator |

> Catatan: Penugasan role tidak selalu mengikuti pangkat secara kaku — tergantung kebutuhan latihan dan kebijakan unit. Tabel di atas adalah pola umum.

---

## 6. Role Kru Kendaraan

Setiap trainee dalam kabin CMT menjalankan **satu peran spesifik** yang merepresentasikan posisi mereka di dalam kendaraan tempur nyata. Dalam satu kabin bisa ada 3–6 trainee dengan role yang berbeda, semuanya harus berkoordinasi untuk menyelesaikan misi.

**Mengapa role penting dalam sistem TRMS?**  
Karena simulator dikonfigurasi berbeda untuk setiap role — kursi yang berbeda, tampilan layar yang berbeda, kontrol yang berbeda. Data role di Nominal Roll digunakan untuk memetakan siapa duduk di mana dan mendapatkan pengalaman latihan yang sesuai posisinya.

**Analoginya:**  
Seperti **kru kapal perang** — kapten, navigator, juru tembak, dan teknisi mesin semuanya berada di kapal yang sama, tapi masing-masing punya stasiun, tanggung jawab, dan training yang berbeda.

---

### VC — Vehicle Commander

**Apa itu?**  
Komandan kendaraan. Posisi tertinggi dalam hierarki satu kabin. Bertanggung jawab atas seluruh misi kendaraan — dari perencanaan rute, pengambilan keputusan taktis, hingga koordinasi dengan kendaraan lain dan komandan peleton.

**Dalam simulator, VC:**
- Berkomunikasi via radio dengan kendaraan lain dan dengan TC/PC
- Memutuskan kapan menembak, kapan mundur, kapan maju
- Mengarahkan VO untuk manuver kendaraan
- Memonitor seluruh kondisi kendaraan dan situasi sekitar

**Analoginya:**  
**Kapten pesawat** — yang membuat semua keputusan penting dan bertanggung jawab atas keselamatan seluruh awak.

---

### VO — Vehicle Operator

**Apa itu?**  
Pengemudi kendaraan. Mengeksekusi seluruh perintah gerakan dari VC — maju, mundur, belok, berhenti, manuver taktis. VO juga bertanggung jawab atas kondisi mekanis kendaraan.

**Dalam simulator, VO:**
- Mengendalikan kemudi dan kecepatan kendaraan via panel kontrol
- Memonitor dashboard kendaraan (bahan bakar, suhu mesin, kondisi ban)
- Melaporkan anomali ke VC
- Mengeksekusi manuver penghindaran saat diserang

**Analoginya:**  
**Kopilot / pengemudi truk** — yang menjalankan kendaraan sesuai instruksi komandan.

---

### TC/PC — Troop Commander / Platoon Commander

**Apa itu?**  
Komandan yang mengawasi **beberapa kendaraan sekaligus** dalam satu operasi. TC/PC biasanya berada di salah satu kabin CMT tetapi koordinasinya mencakup seluruh peleton.

**Dalam simulator, TC/PC:**
- Menerima briefing misi dari tingkat yang lebih tinggi
- Mendelegasikan objektif ke masing-masing VC
- Memantau progress semua kendaraan di bawah komandonya
- Mengkoordinasikan serangan atau mundur bersamaan
- Berkomunikasi dengan IOS/instruktur jika ada evaluasi

**Analoginya:**  
**Manajer lapangan proyek konstruksi** — mengawasi beberapa tim yang bekerja secara bersamaan di lokasi yang berbeda-beda tetapi menuju satu tujuan yang sama.

---

### SC — Section Commander

**Apa itu?**  
Komandan seksi yang memimpin sub-unit lebih kecil dari peleton (biasanya 2–3 kendaraan). SC berada di bawah TC/PC dan di atas VC individual.

**Dalam simulator, SC:**
- Mengkoordinasikan pergerakan 2–3 kendaraan dalam satu seksi
- Menjembatani komunikasi antara VC dan TC/PC
- Membuat keputusan taktis tingkat seksi jika TC/PC tidak dapat dihubungi

**Analoginya:**  
**Team lead dalam tim engineering** — memimpin sub-tim, melapor ke manajer (TC), dan mengkoordinasikan anggota (VC).

---

### SO — Section Officer / System Operator

**Apa itu?**  
Operator sistem khusus dalam kendaraan — biasanya menangani sistem senjata, komunikasi, atau sistem elektronik spesifik yang memerlukan keahlian teknis tersendiri.

**Dalam simulator, SO:**
- Mengoperasikan sistem senjata sekunder atau sistem targeting
- Mengelola komunikasi elektronik kendaraan
- Mendukung VC dengan informasi teknis dari sistem on-board

**Analoginya:**  
**Teknisi/spesialis sistem di kapal selam** — bertanggung jawab atas satu atau beberapa sistem kritis yang butuh fokus penuh.

---

## 7. Kendaraan & Platform Tempur

### Platform Type

**Apa itu?**  
Jenis kendaraan tempur yang disimulasikan di dalam kabin CMT. Platform Type menentukan seluruh konfigurasi simulator — layout kabin, sistem kontrol, jenis senjata yang tersedia, karakteristik pergerakan kendaraan, dan skenario yang relevan.

**Mengapa pemilihan Platform Type penting?**  
Karena satu kabin CMT secara fisik bisa dikonfigurasi untuk mensimulasikan kendaraan yang berbeda (Terrex, L2SG, PCSV). Ketika operator memilih Platform Type saat membuat booking, sistem tahu konfigurasi software apa yang harus di-load ke kabin tersebut.

---

### Terrex ICV — Infantry Carrier Vehicle

**Apa itu?**  
Kendaraan lapis baja beroda 8 yang merupakan tulang punggung infanteri mekanis SAF (Singapore Armed Forces). Terrex dirancang untuk mengangkut tim infanteri ke zona tempur sambil memberikan perlindungan dan dukungan tembakan.

**Karakteristik kunci:**
- Amfibi (bisa bergerak di darat dan air)
- Dilengkapi sistem senjata terpasang di turret
- Kapasitas: 3 awak + 9 pasukan infanteri

**Varian yang ada di CMT:**
| Varian | Sistem Senjata | Peran Taktis |
|--------|---------------|--------------|
| **Terrex 50 HMG** | Heavy Machine Gun .50 cal (12.7mm) | Dukungan tembakan berat, anti-material |
| **Terrex 40 AGL** | Automatic Grenade Launcher 40mm | Area suppression, anti-infantry |

**Mengapa ada dua varian?**  
Setiap varian punya karakteristik tembakan, jarak efektif, dan situasi penggunaan yang berbeda. Trainee perlu familiar dengan keduanya karena penugasan lapangan bisa ke varian apapun.

---

### L2SG — Light Strike Vehicle (Singapore)

**Apa itu?**  
Kendaraan ringan berkecepatan tinggi yang dirancang untuk operasi pengintaian, patroli cepat, dan strike dalam formasi kecil. Lebih ringan dan lincah dibanding Terrex, tapi perlindungan lebih terbatas.

**Karakteristik kunci:**
- Mobilitas tinggi, cocok untuk medan berbeda
- Sistem senjata lebih ringan dibanding Terrex
- Biasanya beroperasi dalam kelompok kecil yang bergerak cepat

**Dalam konteks CMT:**  
L2SG sering digunakan dalam skenario pengintaian atau operasi khusus di mana kecepatan dan kelincahan lebih penting dari proteksi.

---

### PCSV — Protected Combat Support Vehicle

**Apa itu?**  
Kendaraan lapis baja khusus untuk peran pendukung tempur — bukan untuk pertempuran garis depan, tapi untuk mendukung operasi dari belakang garis.

**Varian:**
- **PCSV Mortar** — Dilengkapi sistem mortar untuk tembakan tidak langsung (indirect fire). Kru tidak melihat target secara langsung, tetapi menembak berdasarkan koordinat yang diberikan observer.

**Mengapa PCSV penting dalam latihan CMT?**  
Dalam operasi multi-kendaraan yang realistis, tidak semua kendaraan bertempur langsung. Ada yang berperan memberikan dukungan tembakan jarak jauh. PCSV Mortar memungkinkan skenario koordinasi antara kendaraan penyerang (Terrex) dan kendaraan pendukung (PCSV Mortar).

---

## 8. Callsign

**Apa itu?**  
Kode identifikasi pendek yang digunakan selama operasi/latihan untuk menggantikan nama, nomor unit, atau identitas panjang lainnya. Callsign mempercepat komunikasi radio dan menjaga kerahasiaan identitas asli.

**Mengapa callsign, bukan nama?**  
Di lingkungan tempur atau latihan yang intense, "CMT01 with Terrex 50HMG, Vehicle Commander SGT Ahmad bin Yusof" terlalu panjang untuk dikomunikasikan via radio. "11Z" jauh lebih cepat dan mudah diingat.

**Dua level callsign dalam sistem CMT:**

**1. Cabin Callsign (Callsign Kabin)**  
Identifikasi untuk seluruh kendaraan/kabin sebagai satu unit. Semua anggota kru di kabin itu berada di bawah satu callsign kabin.

**2. Individual Callsign (Callsign Individu)**  
Identifikasi untuk peran-peran tertentu di dalam kabin. Tidak semua role punya individual callsign — biasanya hanya TC/PC (yang perlu dihubungi langsung oleh komandan atas) dan SO (untuk koordinasi teknis).

**Contoh struktur callsign:**
| Kabin | Cabin Callsign | Individual TC/PC | Individual SO |
|-------|---------------|------------------|---------------|
| CMT01 | 11Z | 11 | 11A |
| CMT02 | 11SZ | 11S | — |
| CMT04 | 14SZ | 14S | 14B |

**Cara membacanya:**  
"11Z" = kendaraan nomor 11 dengan suffix Z (Z biasanya menandakan kendaraan commander atau lead vehicle). "11" = callsign TC di kendaraan 11. "11A" = operator alfa di kendaraan 11.

---

## 9. Proses Onboarding (Hari H)

**Apa itu?**  
Proses check-in dan verifikasi resmi trainee ke fasilitas simulator pada hari latihan berlangsung. **Khusus untuk booking tipe CMT+CTT.** Onboarding memastikan bahwa orang yang hadir secara fisik sesuai dengan yang terdaftar di nominal roll, dan penugasan kabin final dikonfirmasi.

**Mengapa perlu proses onboarding formal?**  
Karena perbedaan antara yang terdaftar dan yang hadir sangat umum terjadi — ada yang sakit mendadak, ada pengganti last-minute, ada yang terdaftar double. Tanpa verifikasi formal di hari H, konfigurasi simulator akan salah, laporan hasil latihan tidak akurat, dan akuntabilitas fasilitas terganggu.

**Analoginya:**  
Seperti **proses boarding pesawat** — tiket sudah dibeli jauh-jauh hari (booking), tapi di gate bandara kamu tetap harus scan boarding pass (NRIC scan) untuk konfirmasi bahwa kamu memang yang punya tiket itu dan benar-benar hadir.

**Langkah-langkah onboarding CMT+CTT:**

```
1. SCAN ID TRAINEE
   ├── Petugas men-scan NRIC trainee via reader
   ├── Sistem mengecek: apakah NRIC ini ada di Nominal Roll?
   ├── Jika ada → status: PRESENT (hadir)
   ├── Jika tidak ada → ditandai: WALK-IN (tidak terdaftar)
   └── Jika terdaftar tapi tidak scan → status: ABSENT (absen)

2. KONFIRMASI ATTENDANCE
   ├── Daftar hadir difinalisasi
   ├── Walk-in diputuskan: masukkan ke sesi atau tolak?
   └── Absen dicatat untuk laporan unit

3. GENERATE DETAIL LIST
   ├── Berdasarkan siapa yang hadir, sistem membuat penugasan kabin final
   ├── Siapa di CMT01, siapa di CMT02, dengan role apa
   └── Detail List dikirim ke IOS masing-masing kabin

4. START SESSION
   └── Instruktur memulai sesi dari IOS → Status booking: ONGOING
```

**Status tombol di sistem berdasarkan status booking:**
- Booking **Upcoming** → tombol: **"Start Onboarding"**
- Booking **Ongoing** → tombol: **"Continue Session"**

---

## 10. Detail List

**Apa itu?**  
Dokumen/tampilan terstruktur yang menunjukkan penugasan final setiap trainee ke kabin tertentu — siapa duduk di mana, dengan role apa, callsign apa, dan menggunakan platform jenis apa. Detail List adalah "blueprint" eksekusi dari sebuah sesi latihan CMT.

**Apa bedanya Detail List dengan Nominal Roll?**

| Aspek | Nominal Roll | Detail List |
|-------|-------------|------------|
| Dibuat kapan | Sebelum hari H (H-1 atau lebih) | Setelah Nominal Roll & Cabin Config siap |
| Isinya | Daftar trainee + data identitas | Penugasan spesifik trainee ke kabin |
| Levelnya | "Siapa yang akan datang" | "Siapa duduk di mana, dengan peran apa" |
| Analoginya | Daftar tamu undangan | Denah tempat duduk acara |

**Analoginya:**  
Seperti **denah tempat duduk di pernikahan besar** — daftar tamu sudah ada sejak undangan dikirim (Nominal Roll), tapi siapa duduk di meja berapa, bersama siapa, baru ditentukan mendekati hari H berdasarkan konfirmasi kehadiran (Detail List).

**Isi setiap cabin card dalam Detail List:**
| Field | Penjelasan |
|-------|-----------|
| Cabin ID | CMT01, CMT02, dst. |
| Platform Type | Jenis kendaraan (Terrex 50HMG, Terrex 40AGL, L2SG, PCSV Mortar) |
| Callsign | Kode taktis kabin |
| Role per trainee | VC, VO, TC/PC, SC, SO |
| Nama, NRIC, Rank | Identitas trainee |
| Batch & Course | Angkatan dan kode kursus |
| Unit | Satuan asal |

**Fitur pada halaman Detail List:**
- **Klik card** → buka modal detail trainee per kabin (dengan navigasi ← →)
- **Configure** → drag-and-drop trainee antar kabin (dengan constraint role)
- **Export** → unduh Detail List dalam format file
- **Download** → download versi printable

**Aturan Configure (Drag-and-Drop):**  
Trainee hanya bisa dipindah ke kabin lain yang memiliki **slot dengan role yang sama**. Misalnya, seorang VC tidak bisa dipindah ke kabin yang semua slot-nya sudah terisi atau tidak memiliki slot VC. Ini memastikan komposisi kru setiap kabin tetap valid secara operasional.

---

### Training Batch (Batch Pelaksanaan CMT)

**Apa itu?**  
Pembagian trainee menjadi beberapa **gelombang pelaksanaan** ketika jumlah total trainee melebihi kapasitas kabin yang tersedia dalam satu putaran. Berbeda dengan "Batch angkatan" (kode 06/26), Training Batch adalah pembagian operasional — siapa berlatih putaran ke-1, siapa putaran ke-2, dst. Kabin yang sama digunakan bergantian oleh setiap batch.

**Mengapa diperlukan?**  
Fasilitas CMT memiliki jumlah kabin terbatas (misalnya 4 kabin). Setiap kabin hanya bisa diisi sejumlah role tertentu per putaran (misalnya 3 role). Jika unit mengirim 30 trainee tapi kapasitas sekali putaran hanya 12, maka 30 trainee tersebut harus dibagi menjadi beberapa batch yang bergantian menggunakan kabin yang sama.

**Formula Kapasitas:**

```
Kapasitas per batch = Jumlah Kabin × Jumlah Role per Kabin
Jumlah Batch        = ⌈Jumlah Trainee ÷ Kapasitas⌉  (dibulatkan ke atas)
```

**Contoh nyata (skenario 3 Batch):**

```
4 kabin × 3 role/kabin = 12 kapasitas

30 trainee ÷ 12 = 2.5 → dibulatkan ke atas = 3 batch

Batch 1 — 12 trainee, 4 kabin (penuh)
  CMT01: 3 trainee (VO, VC, TC)
  CMT02: 3 trainee (VO, VC, TC)
  CMT03: 3 trainee (VO, VC, TC)
  CMT04: 3 trainee (VO, VC, TC)

Batch 2 — 12 trainee, 4 kabin (penuh)
  CMT01–CMT04: sama, trainee berbeda

Batch 3 — 6 trainee, 2 kabin terisi + 2 kabin tidak terpakai (partial)
  CMT01: 3 trainee (VO, VC, TC)
  CMT02: 3 trainee (VO, VC, TC)
  CMT03: UNUSED  ← slot kosong
  CMT04: UNUSED  ← slot kosong
```

**Batch terakhir yang partial:**  
Jika jumlah trainee tidak habis dibagi kapasitas, batch terakhir bersifat **partial** — sebagian kabin terisi, sisanya tidak terpakai. Di sistem, kabin yang tidak terpakai ditampilkan sebagai card placeholder **"UNUSED"** agar operator tahu slot tersebut memang kosong (bukan error).

**Visual di halaman Detail List:**

| Elemen UI | Keterangan |
|-----------|-----------|
| **Bar formula kuning** | `4 cabins × 3 roles/cabin = 12 capacity \| 30 trainees ÷ 12 = 3 batches (last batch: 6 trainees)` |
| **Seksi per batch** | Label "Batch 1", "Batch 2", "Batch 3" dengan sub-header jumlah trainee dan kabin |
| **Badge partial** | Batch terakhir yang tidak penuh diberi badge amber "(partial)" |
| **Card UNUSED** | Kabin yang tidak terisi di batch partial tampil sebagai placeholder abu-abu |
| **Demo Switcher** | Floating pill di bawah halaman — developer bisa switch skenario 1/2/3 batch untuk testing |

**Kaitannya dengan penjadwalan waktu:**  
Setiap batch menggunakan kabin yang sama secara bergiliran. Batch 1 berlatih lebih dulu, kemudian keluar, lalu Batch 2 masuk, dst. Urutan dan jeda waktu antar batch dikomunikasikan oleh instruktur di luar sistem — TRMS hanya mengelola **penugasan trainee per batch**, bukan scheduling waktu fisiknya.

**Analoginya:**  
Seperti **ujian mengemudi di sebuah sirkuit** yang hanya punya 4 kendaraan. Jika ada 30 calon pengemudi, mereka dibagi menjadi beberapa sesi — 12 orang dulu, kemudian 12 berikutnya, kemudian sisa 6 (yang mana 2 kendaraan akan kosong di sesi terakhir).

---

## 11. Hasil Latihan

### Pass / Fail

**Apa itu?**  
Status kelulusan seorang trainee dalam satu sesi latihan, ditentukan berdasarkan apakah ia mencapai standar minimum yang ditetapkan oleh courseware.

**Bagaimana ditentukan?**  
Setiap courseware mendefinisikan kriteria kelulusan — bisa berupa skor minimum, jumlah objektif yang berhasil diselesaikan, atau waktu penyelesaian. Sistem IOS merekam performa trainee sepanjang sesi, dan pada akhir sesi mengevaluasi apakah standar tercapai.

**Konsekuensi fail:**  
Trainee yang fail biasanya perlu mengulang sesi (remediation) sebelum dianggap qualified untuk operasi nyata. Ini dicatat di Training Results dan dilaporkan ke unit.

---

### Marksman

**Apa itu?**  
Predikat tambahan di atas "Pass" — diberikan kepada trainee yang tidak hanya lulus, tetapi mencapai skor tertinggi atau menyelesaikan semua objektif dengan performa sangat baik, jauh di atas standar minimum.

**Mengapa ada kategori ini?**  
Tidak semua trainee yang lulus punya kemampuan yang sama. Marksman mengidentifikasi individu-individu terbaik yang bisa dipertimbangkan untuk penugasan khusus, menjadi instruktur, atau mengikuti kursus lanjutan.

**Analoginya:**  
Seperti **predikat Cum Laude** — bukan sekedar lulus, tapi lulus dengan pencapaian luar biasa yang diakui secara formal.

---

### Batch

**Apa itu?**  
Kode angkatan atau gelombang pelatihan yang menunjukkan kapan trainee bergabung dengan program kursus tertentu. Batch penting untuk tracking progres dan pengelompokan trainee dalam sistem.

**Format:** `MM/YY`  
**Contoh:** `06/26` = batch bulan Juni tahun 2026

**Mengapa ini perlu dicatat?**  
Unit dan fasilitas perlu tahu apakah seluruh batch sudah menyelesaikan sertifikasi tertentu. Jika dari batch Juni 2026 ada 30 trainee dan baru 22 yang lulus, artinya masih ada 8 yang perlu dijadwalkan ulang.

---

### Course (Kode Kursus)

**Apa itu?**  
Kode identifikasi program pelatihan formal yang sedang diikuti trainee, biasanya merujuk pada kurikulum yang sudah ditetapkan oleh institusi militer.

**Contoh:**
- `IOCC_2(TRX)` = **I**nitial **O**perator **C**rew **C**ourse Level **2**, untuk platform **TRX** (Terrex). Kursus wajib bagi kru Terrex baru.
- `IOCC_1(TRX)` = Level 1 (dasar), sebelum Level 2
- `ATC_CMT` = Advanced Tactical Course untuk CMT

---

## 12. Status Booking

Status menunjukkan di mana posisi sebuah booking dalam siklus hidupnya. Setiap transisi status dipicu oleh aksi spesifik di sistem.

```
[Dibuat]
   │
   ▼
UPCOMING ──────────────────────── CANCELLED (dibatalkan sebelum hari H)
   │                                    
   │  (Start Onboarding / sesi dimulai)
   ▼
ONGOING
   │
   ├──── RETURN ASSETS (sesi selesai, aset belum semua dikembalikan)
   │              │
   │              │ (semua aset kembali)
   │              ▼
   └──────────── COMPLETED
   
UPCOMING ──── OVERDUE (tanggal terlewat, sesi tidak pernah dimulai)
```

| Status | Artinya | Aksi yang memicunya | Apa yang bisa dilakukan |
|--------|---------|--------------------|-----------------------|
| **Upcoming** | Booking terkonfirmasi, latihan belum dimulai | Submit booking → approval | Edit data, Generate Detail List, Sync |
| **Ongoing** | Sesi aktif berjalan | Klik "Start Onboarding" / mulai sesi | Monitor, Continue Session |
| **Completed** | Sesi selesai sempurna | Semua aset dikembalikan | Lihat Training Results |
| **Return Assets** | Sesi selesai tapi aset outstanding | Otomatis setelah sesi berakhir | Kembalikan aset yang tersisa |
| **Cancelled** | Booking dibatalkan | Operator klik Cancel | — |
| **Overdue** | Tanggal terlewat tanpa mulai | Otomatis oleh sistem saat tanggal berlalu | Reschedule atau cancel |

---

## 13. Organisasi & Personel

### Unit

**Apa itu?**  
Satuan militer (regiment, batalion, atau sub-unit) yang mengajukan dan mengikuti sesi latihan. Unit adalah "pelanggan" dari fasilitas simulator.

**Mengapa unit penting dalam TRMS?**  
Karena laporan Training Results dikompilasi per unit — komandan unit perlu tahu berapa persen prajuritnya yang sudah tersertifikasi, batch mana yang belum, dan unit mana yang punya performa terbaik.

**Contoh:** `1SIR` (1st Singapore Infantry Regiment), `2SIR`, `3SIR`

---

### Instructor / Operator

**Apa itu?**  
Personel terlatih yang bertanggung jawab menjalankan sesi latihan dari IOS. Ada dua level:

**Operator (Operator Fasilitas):**  
Staf fasilitas yang mengelola sistem TRMS — membuat booking, konfigurasi awal, memastikan semua perangkat siap. Mereka bekerja sebelum dan sesudah sesi, bukan selama sesi aktif.

**Instructor (Instruktur Sesi):**  
Personel yang menjalankan simulator secara aktif selama sesi — mengendalikan skenario dari IOS, memberikan arahan real-time, mengevaluasi performa trainee, dan memberikan debriefing. Instruktur biasanya dari unit militer, bukan dari staf fasilitas.

**Mengapa pemisahan ini penting?**  
Fasilitas bertanggung jawab atas kesiapan perangkat; unit bertanggung jawab atas kualitas latihan. Keduanya perlu koordinasi tapi punya akuntabilitas berbeda.

---

### Briefing Room

**Apa itu?**  
Ruang fisik di dalam fasilitas simulator yang digunakan untuk pre-session briefing dan post-session debriefing. Instruktur menjelaskan skenario, objektif, dan aturan keselamatan sebelum trainee masuk ke kabin.

**Mengapa penting?**  
Trainee yang masuk kabin tanpa briefing yang memadai tidak akan tahu apa yang harus dilakukan, membuang waktu sesi yang mahal. Briefing Room memastikan semua orang memulai dengan pemahaman yang sama.

**Data di sistem:** Briefing Room mana yang digunakan dicatat di booking untuk pengaturan ruangan dan mencegah double-booking ruang yang sama.

---

### ATMS File

**Apa itu?**  
File data terstruktur yang di-export dari ATMS (Army Training Management System) — sistem pusat manajemen pelatihan militer Singapura — dan di-import ke TRMS. File ini berisi data trainee, kursus yang sedang diambil, dan rencana pelatihan yang sudah disahkan.

**Mengapa perlu impor dari ATMS?**  
TRMS bukan satu-satunya sistem yang mencatat data pelatihan. ATMS adalah "sistem sumber kebenaran" (source of truth) untuk seluruh program pelatihan militer. TRMS perlu sinkron dengan ATMS agar data trainee, kursus, dan sertifikasi tidak ada yang "double input" atau tidak konsisten.

**Analoginya:**  
Seperti **sinkronisasi kalender kerja dari HR system ke kalender pribadi** — data sudah ada di sistem pusat (ATMS), tinggal di-sync ke alat kerja sehari-hari (TRMS).

---

## 14. Istilah Tambahan

### Training Mode

**Apa itu?**  
Pendekatan atau metodologi latihan yang mendefinisikan *bagaimana* sesi dijalankan — apakah fokus pada ketepatan tembakan, manuver taktis, pengambilan keputusan, atau prosedur standar.

**Contoh:**
| Mode | Penjelasan |
|------|-----------|
| `Simulation` | Mode simulasi penuh — semua aspek kendaraan dan skenario berjalan realistis |
| `Marksmanship` | Fokus pada keakuratan tembakan — skenario disederhanakan, emphasis pada teknik menembak |
| `Tactical` | Fokus pada pengambilan keputusan taktis dan koordinasi antar kendaraan |
| `Familiarization` | Mode pengenalan untuk trainee baru — kecepatan lebih lambat, skenario lebih mudah |

---

### Training Type

**Apa itu?**  
Menentukan apakah sesi dijalankan untuk **satu trainee/satu kendaraan** (Individual) atau **beberapa kendaraan bersama-sama** dalam satu operasi yang terkoordinasi (Group).

| Tipe | Penjelasan | Kapan digunakan |
|------|-----------|-----------------|
| **Individual** | Satu kabin, fokus pada skill kru tersebut | Sertifikasi dasar, remediation |
| **Group** | Multi-kabin dalam satu skenario | Latihan taktis, evaluasi koordinasi tim |

---

### Section Type

**Apa itu?**  
Menentukan apakah sesi hanya untuk satu unit (**Standalone**) atau melibatkan beberapa unit berbeda dalam satu fasilitas pada waktu yang sama (**Integrated**).

| Tipe | Penjelasan | Implikasi |
|------|-----------|-----------|
| **Standalone** | Satu unit, satu booking | Lebih mudah koordinasi |
| **Integrated** | Beberapa unit, satu sesi bersama | Perlu koordinasi antar unit, IOS terpisah per unit |

---

### Session Type

Pembagian slot waktu dalam satu hari operasional:

| Kode | Waktu | Durasi | Kapasitas |
|------|-------|--------|-----------|
| **AM Session** | 08:00 – 13:00 | 5 jam | Kursus setengah hari |
| **PM Session** | 13:00 – 18:00 | 5 jam | Kursus setengah hari |
| **Full Day** | 08:00 – 18:00 | 10 jam | Kursus intensif / multi-modul |

**Mengapa ini perlu?**  
Fasilitas simulator mahal dan terbatas. Dengan membagi hari ke dua slot, satu kabin bisa digunakan dua unit berbeda dalam satu hari — memaksimalkan utilisasi fasilitas.

---

### Cabin Configuration (dalam konteks Booking Detail)

**Apa itu?**  
Tab di halaman Booking Detail CMT yang digunakan operator untuk mengatur penugasan teknis setiap kabin sebelum sesi dimulai. Ini berbeda dari konfigurasi fisik perangkat — ini adalah pengaturan **data** yang akan dikirim ke IOS.

**Yang dikonfigurasi:**
1. **Kabin mana yang digunakan** — pilih dari daftar kabin yang available (tidak occupied, tidak unavailable)
2. **Platform Type** — jenis kendaraan untuk kabin tersebut (Terrex 50HMG, dll.)
3. **Role** — satu atau lebih role yang akan ada di kabin ini (bisa multi-select)
4. **Call Sign** — callsign taktis kabin
5. **IOS Assignment** — IOS mana yang mengontrol kabin ini, base station mana yang digunakan, apakah Master IOS, Force Type (Friendly/Opposing)

**Konsekuensi jika tidak dikonfigurasi:**  
Detail List tidak bisa di-generate. Sistem tidak akan tahu kendaraan apa yang ada di kabin mana, sehingga tidak bisa memetakan trainee ke posisi yang tepat.

---

## 15. Alur Lengkap (Ringkasan Visual)

### A. Booking CMT Standalone

```
SEBELUM HARI H — Persiapan (bisa H-7 sampai H-1)
══════════════════════════════════════════════════

Unit mengajukan kebutuhan latihan
        │
        ▼
Operator membuat booking CMT di TRMS
  ├─ Step 1 — Booking Details
  │   (tanggal, sesi AM/PM/Full, program, jumlah trainee,
  │    jenis platform, courseware)
  │
  ├─ Step 2 — Nominal Roll
  │   (upload daftar trainee: nama, NRIC, pangkat, role, unit)
  │
  ├─ Step 3 — Cabin Configuration
  │   (pilih kabin CMT01-CMT12, set Platform Type + Role + Call Sign,
  │    assign IOS device + Base Station + Master IOS + Force Type)
  │
  └─ Submit → Status: UPCOMING

        │
        ▼
Booking Detail — Tab "Detail List"
  ├─ Cek prasyarat: Nominal Roll ✅ + Cabin Config ✅
  ├─ Centang konfirmasi
  └─ Klik "Generate Detail List"
     → Penugasan trainee per kabin dibuat
     → Card grid muncul (CMT01, CMT02, dst.)

        │
        ▼
Tombol [Sync] muncul di header
  ├─ Jika ada perubahan data → [Cancel] [Confirm]
  │   └─ Confirm → popup → Yes, Update → kembali ke [Sync]
  │
  └─ Klik [Sync] → popup konfirmasi → Yes, Sync
     → Tombol [Start Onboarding] muncul

        │
        ▼
HARI H
  └─ Klik [Start Onboarding] → Status: ONGOING
     → Instruktur menjalankan sesi dari IOS
     → Timer berjalan, performa trainee direkam

        │
        ▼
Status: COMPLETED
  └─ Hasil (Pass/Fail/Marksman) per trainee tersimpan di Training Results
```

---

### B. Booking CMT+CTT

```
SEBELUM HARI H
══════════════
[Proses create booking sama dengan CMT Standalone]
        │
        ▼
HARI H — Onboarding (real-time)
  ├─ Klik [Start Onboarding] → Status: ONGOING
  ├─ Scan NRIC trainee satu per satu
  ├─ Konfirmasi attendance (hadir / absen / walk-in)
  ├─ Generate Detail List (berdasarkan siapa yang hadir)
  └─ Sesi dimulai langsung dari IOS

        │
        ▼
Status: COMPLETED
```

---

### C. Booking SWT / IMT

```
SEBELUM HARI H
══════════════
[Create booking → Upcoming]
        │
        ▼
Issue Assets
  └─ Senjata/peralatan dikeluarkan dari gudang via RFID scan

        │
        ▼
HARI H — Sesi dimulai → Status: ONGOING
        │
        ▼
Sesi selesai
        │
        ▼
Return Assets
  └─ Semua aset dipindai kembali ke gudang
        │
        ▼
Status: COMPLETED
```

---

## 16. PRD — Booking Flow CMT (Standalone)

> Bagian ini menjelaskan **product requirement** untuk alur booking CMT Standalone  
> dari sudut pandang sistem — state apa yang ada, transisi apa yang memicunya,  
> dan tombol apa yang muncul di setiap kondisi.

---

### 16.1 Perbedaan CMT vs Booking Type Lain

| Aspek | CMT Standalone | SWT / IMT | CMT+CTT |
|-------|---------------|-----------|---------|
| Issue Assets | ✗ Tidak ada | ✅ Ada | ✅ Ada |
| Return Assets | ✗ Tidak ada | ✅ Ada | ✅ Ada |
| Detail List | ✅ Di-generate sebelum hari H | ✗ Tidak ada | ✅ Di-generate saat onboarding hari H |
| Sync ke IOS | ✅ Eksplisit — operator harus konfirmasi | ✗ Tidak ada | ✗ Otomatis saat onboarding |
| Onboarding (scan NRIC) | ✗ Tidak ada | ✗ Tidak ada | ✅ Ada |
| Tombol Start Onboarding | Muncul **setelah Sync** dikonfirmasi | ✗ Tidak ada | ✅ Langsung tersedia |

**Mengapa CMT tidak punya Issue/Return Assets?**  
CMT adalah simulator murni berbasis software dan hardware tetap (kabin tidak bergerak ke mana-mana). Tidak ada peralatan fisik yang perlu "dipinjamkan" kepada trainee. Konfigurasi dilakukan melalui software IOS, bukan pengeluaran fisik aset.

**Mengapa CMT tidak punya onboarding scan NRIC?**  
Untuk CMT Standalone, verifikasi trainee dilakukan di awal (saat Nominal Roll diupload dan Detail List di-generate), bukan di hari H. Ini karena sesi CMT cenderung lebih terstruktur dan trainee-nya sudah pasti hadir (unit kecil, sudah dikonfirmasi). CMT+CTT lebih besar dan dinamis sehingga butuh verifikasi real-time di hari H.

---

### 16.2 Tab pada Halaman Booking Detail CMT

| Tab | Isi | Siapa yang menggunakannya |
|-----|-----|--------------------------|
| **Booking Details** | Informasi umum: tanggal, sesi, program, courseware, trainee count, jadwal | Semua pihak untuk referensi |
| **Nominal Rolls** | Daftar trainee — bisa tambah/hapus individual, upload bulk | Operator sebelum hari H |
| **Cabin Configuration** | Pilih kabin, assign Platform Type/Role/Call Sign, setup IOS | Operator teknis |
| **Detail List** | Generate, lihat, configure, export penugasan trainee per kabin | Operator final, instruktur |

**Urutan pengerjaan yang benar:**  
Nominal Rolls → Cabin Configuration → Detail List  
Keduanya (Nominal Roll + Cabin Config) harus selesai sebelum Detail List bisa di-generate.

---

### 16.3 State Machine — Tombol di Header Booking Detail CMT

Setelah booking CMT dibuat dan berstatus Upcoming, tombol di header mengikuti alur berikut:

```
STATE 1: DETAIL LIST BELUM DI-GENERATE
  ─────────────────────────────────────
  Header: [tidak ada tombol aksi khusus]
  Aksi: Pergi ke tab Detail List, lengkapi prasyarat, klik Generate

STATE 2: DETAIL LIST SUDAH DI-GENERATE (tidak ada perubahan)
  ─────────────────────────────────────────────────────────────
  Header: [Sync]
  Aksi: Klik Sync untuk mengirim Detail List ke IOS

STATE 3: DETAIL LIST SUDAH DI-GENERATE + DATA BERUBAH
  ─────────────────────────────────────────────────────────────
  (dipicu oleh: edit trainee di Nominal Roll, ATAU
   edit kabin/IOS di Cabin Configuration)
  Header: [Cancel]  [Confirm]
  ├─ Cancel → buang perubahan, kembali ke STATE 2 [Sync]
  └─ Confirm → popup "Confirm Update" → 
      ├─ Batal → tetap di STATE 3
      └─ Yes, Update → kembali ke STATE 2 [Sync]

STATE 4: SYNC DIKONFIRMASI
  ─────────────────────────────────────────────────────────────
  (dipicu oleh: klik Sync → popup → Yes, Sync)
  Header: [Start Onboarding]
  ├─ Klik Start Onboarding → masuk ke sesi latihan
  └─ Jika ada perubahan data baru → kembali ke STATE 3
```

**Diagram transisi:**

```
[Generate] ──▶ STATE 2: SYNC ──▶ [klik Sync] ──▶ STATE 4: START ONBOARDING
                   ▲                                          │
                   │ [Cancel]                     [edit data lagi]
                   │      ↓                                   ↓
                   └── STATE 3: CONFIRM + CANCEL ◀────────────┘
                              │
                              └─ [Confirm → Yes, Update] ──▶ STATE 2
```

---

### 16.4 Detail List — Prasyarat Generate

Sistem memblokir Generate Detail List jika salah satu dari berikut belum terpenuhi:

| Prasyarat | Kondisi yang diperlukan |
|-----------|------------------------|
| **Nominal Roll** | Minimal ada trainee terdaftar dengan role yang valid |
| **Cabin Configuration** | Minimal ada satu kabin ter-select dengan Platform Type, Role, dan Call Sign terisi |

**Apa yang terjadi jika tetap dipaksa generate tanpa prasyarat?**  
Tombol Generate tidak akan aktif. Sistem menampilkan checklist visual — prasyarat yang belum terpenuhi ditandai merah, yang sudah selesai ditandai hijau.

---

### 16.5 Detail List — Struktur Data per Kabin

Setiap card kabin dalam Detail List menampilkan:

| Field | Penjelasan | Contoh |
|-------|-----------|--------|
| **Cabin ID** | Nomor kabin fisik | CMT01 |
| **Platform Type** | Jenis kendaraan simulasi | Terrex 50 HMG |
| **Callsign** | Kode taktis kabin | 11Z |
| **Jumlah Trainee** | Berapa orang di kabin ini | 5 |
| **Role badges** | Role apa saja yang ada | VC, VO, TC/PC, SC, SO |

**Klik card → View Detail Modal:**  
Tabel lengkap semua trainee di kabin tersebut: Role, Nama, NRIC, Pangkat, Callsign individual, Batch, Course, Unit. Navigasi antar kabin dengan tombol ← dan →.

**Configure (drag-and-drop):**  
- Trainee bisa digeser dari satu kabin ke kabin lain
- **Constraint:** Hanya bisa dipindah ke kabin yang punya trainee dengan role yang sama (bukan destinasi yang sudah penuh atau tidak punya role yang cocok)
- Tujuan: Penyesuaian last-minute jika ada pertimbangan taktis atau operasional

---

### 16.6 Sync — Penjelasan Lengkap

**Apa yang terjadi secara teknis saat Sync?**  
Detail List yang sudah final dikirimkan ke IOS di setiap kabin. Masing-masing IOS menerima data: siapa yang akan duduk di kabin ini, role mereka apa, callsign mereka apa. IOS kemudian memuat konfigurasi yang sesuai — skenario yang tepat, posisi kamera yang tepat, parameter evaluasi yang tepat.

**Mengapa Sync perlu konfirmasi (popup)?**  
Karena Sync adalah aksi **satu arah yang signifikan** — setelah Detail List terkirim ke IOS, mengubah data lagi berarti harus mengirim ulang (re-sync). Konfirmasi memastikan operator benar-benar yakin data sudah final sebelum mengirim, menghindari IOS menerima data yang salah atau setengah jadi.

**Apa yang berubah setelah Sync:**
1. Tombol [Sync] hilang dari header
2. Tombol [Start Onboarding] muncul
3. Jika ada perubahan data setelah Sync → operator harus Confirm perubahan tersebut terlebih dahulu sebelum bisa kembali ke state siap mulai

**Analoginya:**  
Sync seperti **kirim email briefing ke semua peserta rapat** — setelah email terkirim, kalau ada revisi, kamu harus kirim email lagi dengan revisi tersebut dan minta semua orang baca ulang. Tidak bisa "edit" email yang sudah terkirim begitu saja.

---

### 16.7 Cabin Configuration — Aturan Bisnis Lengkap

| Kondisi Kabin | Tampilan di UI | Apa yang bisa dilakukan |
|--------------|---------------|------------------------|
| **Available** | Checkbox bisa dipilih, dropdown aktif | Pilih, set Platform Type/Role/Call Sign |
| **Occupied** | Teks *Occupied* abu-abu, tidak ada checkbox | Tidak bisa dipilih — sedang dipakai booking lain |
| **Unavailable** | Background amber, teks *Unavailable* kuning | Tidak ada checkbox — misal: CMT09 sedang maintenance |

**Aturan Platform Type Quota:**  
Jika saat membuat booking operator memilih "2 unit Terrex 50HMG dan 2 unit Terrex 40AGL", maka di Cabin Configuration sistem akan membatasi: tidak boleh ada lebih dari 2 kabin yang di-assign ke Terrex 50HMG, dan tidak boleh lebih dari 2 yang di-assign ke Terrex 40AGL. Ini mencegah mismatch antara rencana booking dan eksekusi.

**Aturan Maksimum Kabin:**  
Jumlah kabin yang bisa dipilih dibatasi oleh `cabinAmount` yang diisi saat Booking Details. Jika booking untuk 4 kabin, maka hanya 4 yang bisa di-select, walaupun ada lebih banyak yang available.

**Aturan IOS:**  
- Setiap IOS yang ditambahkan harus memiliki: IOS Device, Base Station, Master IOS (Yes/No), dan Force Type (Friendly/Opposing)
- Satu IOS bisa menangani satu blok kabin yang dipilih
- Jika ada lebih banyak kabin dari kapasitas satu IOS, operator bisa tambah IOS ke-2, ke-3, dst.

---

---

## 17. Panduan Step-by-Step: Membuat Booking

> Panduan ini menjelaskan **cara membuat booking baru** dari awal hingga sesi dimulai,  
> untuk setiap tipe platform. Ikuti urutan langkah ini agar tidak ada yang terlewat.

---

### A. CMT Standalone — Panduan Lengkap

```
FASE 1 — BUAT BOOKING (H-7 sampai H-1)
FASE 2 — SIAPKAN DETAIL LIST (H-1)
FASE 3 — SYNC KE IOS (H-1)
FASE 4 — MULAI SESI (Hari H)
```

---

#### FASE 1 — Membuat Booking Baru

**Cara masuk:**  
Dashboard → tombol **"+ New Booking"** → pilih tipe **CMT**

---

**Step 1 — Booking Details**

Isi informasi umum sesi latihan.

| Field | Yang Harus Diisi | Catatan |
|-------|-----------------|---------|
| **Training Date** | Tanggal sesi latihan | Pilih dari date picker |
| **Session** | AM / PM / Full Day | AM = 08:00–13:00, PM = 13:00–18:00 |
| **Programme** | Nama program latihan unit | Pilih dari dropdown atau ketik |
| **Courseware** | Kode skenario yang akan dilatih | Contoh: `IOCC_2(TRX)` |
| **Section Type** | Standalone atau Integrated | Standalone = 1 unit; Integrated = multi-unit |
| **Training Type** | Individual atau Group | Individual = 1 kabin; Group = multi-kabin |
| **Training Mode** | Simulation / Marksmanship / Tactical / dst | Tentukan fokus sesi |
| **No. of Trainees** | Jumlah peserta total | Hitung semua trainee yang akan hadir |
| **Cabin Amount** | Jumlah kabin yang dibutuhkan | Maksimal = jumlah kabin available |
| **Platform Type + Qty** | Jenis kendaraan + berapa unit | Contoh: 2× Terrex 50HMG, 2× Terrex 40AGL |
| **Instructor** | Nama instruktur yang bertugas | Pilih dari daftar |
| **Unit** | Satuan asal peserta | Contoh: 1SIR, 2SIR |
| **Briefing Room** | Ruang briefing yang digunakan | Pastikan belum double-booked |

> **Tip:** Field **Cabin Amount** dan **Platform Type Qty** harus konsisten.  
> Jika Cabin Amount = 4, maka total Qty semua Platform Type juga harus = 4.

Klik **"Next"** untuk lanjut ke Step 2.

---

**Step 2 — Nominal Roll**

Daftarkan semua trainee yang akan mengikuti sesi.

**Dua cara menambah trainee:**

**Cara A — Import dari ATMS (Recommended untuk grup besar):**
1. Klik tombol **"Import ATMS File"**
2. Upload file `.xlsx` atau `.csv` yang di-export dari ATMS
3. Sistem otomatis membaca kolom: Nama, NRIC, Pangkat, Unit, Role, Batch, Course
4. Preview data muncul — review, pastikan tidak ada yang salah format
5. Klik **"Confirm Import"**

**Cara B — Tambah Manual (untuk individu atau koreksi):**
1. Klik tombol **"+ Add Trainee"**
2. Isi form:
   - **Name** — Nama lengkap
   - **NRIC** — Format: `T6535925H`
   - **Rank** — Pilih dari dropdown (REC, PTE, CPL, SGT, WO, MAJ, dll.)
   - **Role** — VC / VO / TC-PC / SC / SO
   - **Unit** — Satuan asal
   - **Batch** — Format MM/YY (contoh: `06/26`)
   - **Course** — Kode kursus (contoh: `IOCC_2(TRX)`)
3. Klik **"Add"**

**Yang harus dicek sebelum lanjut:**
- [ ] Semua trainee sudah terdaftar
- [ ] Setiap trainee sudah punya Role yang valid
- [ ] Total trainee sesuai dengan `No. of Trainees` di Step 1
- [ ] Tidak ada NRIC duplikat

**Mengedit atau menghapus trainee:**  
Setiap baris punya ikon edit (✏️) dan hapus (🗑️). Bisa diedit kapan saja selama booking masih Upcoming.

Klik **"Next"** untuk lanjut ke Step 3.

---

**Step 3 — Cabin Configuration**

Tentukan kabin mana yang dipakai dan konfigurasi teknisnya.

**Bagian A — Pilih Kabin:**

1. Daftar kabin (CMT01 sampai CMT12) tampil dengan status:
   - **Available** — bisa dipilih (centang kotak di kiri)
   - **Occupied** — abu-abu, tidak bisa dipilih (sudah dipakai booking lain di waktu yang sama)
   - **Unavailable** — amber, tidak bisa dipilih (maintenance/kerusakan)
2. Centang kabin yang dibutuhkan, sesuai jumlah `Cabin Amount`
3. Sistem akan mencegah memilih lebih dari `Cabin Amount`

**Bagian B — Konfigurasi per Kabin (muncul setelah kabin dipilih):**

Untuk **setiap kabin** yang dipilih, isi:

| Field | Yang Harus Diisi | Contoh |
|-------|-----------------|--------|
| **Platform Type** | Jenis kendaraan untuk kabin ini | Terrex 50 HMG |
| **Role(s)** | Role apa saja yang ada di kabin ini | VC, VO, TC/PC |
| **Call Sign** | Callsign taktis untuk kabin ini | 11Z |

> **Aturan Platform Type Quota:**  
> Jika di Step 1 kamu pilih "2× Terrex 50HMG", maka maksimal hanya 2 kabin yang bisa di-set ke Terrex 50HMG. Sistem otomatis memblokir jika melebihi quota.

**Bagian C — Konfigurasi IOS (untuk setiap kabin):**

Klik **"+ Add IOS"** di bawah konfigurasi kabin:

| Field | Yang Harus Diisi | Keterangan |
|-------|-----------------|-----------|
| **IOS Device** | Pilih dari daftar IOS tersedia | Contoh: CMTIOS01 |
| **Base Station** | Server network yang digunakan | Contoh: BS-CMT-01 |
| **Master IOS** | Yes / No | Yes = IOS ini koordinator utama |
| **Force Type** | Friendly / Opposing | Menentukan "pihak mana" kendaraan ini dalam misi |

> **Catatan:** Satu IOS bisa di-assign ke satu atau beberapa kabin. Jika ada banyak kabin, bisa tambah IOS ke-2, ke-3, dst. dengan klik **"+ Add IOS"** lagi.

Klik **"Next"** untuk lanjut ke Review.

---

**Step 4 — Review & Submit**

Halaman ringkasan semua data yang diisi.

**Cek ulang:**
- [ ] Tanggal dan sesi sudah benar
- [ ] Jumlah trainee di Nominal Roll sesuai
- [ ] Semua kabin sudah terkonfigurasi (Platform Type, Role, Callsign, IOS)
- [ ] Total Platform Type Qty sesuai Cabin Amount

Klik **"Submit Booking"**

→ **Status booking: UPCOMING**  
→ Booking ID otomatis terbuat (contoh: `#260604-CMT001`)  
→ Kamu akan diarahkan ke halaman **Booking Detail**

---

#### FASE 2 — Generate Detail List

> Dilakukan di halaman **Booking Detail → Tab "Detail List"**  
> Bisa dilakukan H-1 atau lebih awal, selama Nominal Roll dan Cabin Config sudah lengkap.

**Langkah-langkah:**

1. Buka booking yang baru dibuat → klik tab **"Detail List"**
2. Sistem menampilkan **checklist prasyarat**:
   - ✅ Nominal Roll: sudah ada trainee dengan role valid
   - ✅ Cabin Configuration: sudah ada kabin dengan Platform Type + Role + Callsign
3. Jika kedua prasyarat hijau, klik **"Generate Detail List"**
4. Sistem otomatis memetakan trainee ke kabin berdasarkan role
5. **Card grid** muncul — setiap card = satu kabin dengan ringkasan trainee di dalamnya
6. Klik card untuk melihat detail lengkap (nama, NRIC, role, callsign per trainee)
7. Gunakan tombol **← →** di modal untuk navigasi antar kabin

**Jika ingin mengubah penugasan:**  
Klik **"Configure"** → drag-and-drop trainee antar kabin (hanya bisa ke kabin yang punya role yang sama).

**Setelah puas dengan susunan trainee:**  
Header menampilkan tombol **[Sync]** — lanjut ke Fase 3.

---

#### FASE 3 — Sync ke IOS

> Mengirim Detail List yang sudah final ke semua IOS.

1. Di header halaman Booking Detail, klik tombol **[Sync]**
2. Popup **"Confirm Sync"** muncul:
   > *"Are you sure you want to sync? This will finalise the current Detail List and enable onboarding."*
3. Klik **"Yes, Sync"**
4. Tombol [Sync] hilang dari header
5. Tombol **[Start Onboarding]** muncul

> **Jika ada perubahan data setelah Sync:**  
> Header berubah ke **[Cancel] [Confirm]**.  
> Klik **Confirm** → popup → **"Yes, Update"** → kembali ke state [Sync].  
> Perlu klik Sync lagi untuk mengirim ulang data yang sudah diubah.

---

#### FASE 4 — Hari H: Mulai Sesi

1. Pada hari latihan, buka booking yang sudah Sync
2. Klik tombol **[Start Onboarding]**
3. Status booking berubah menjadi **ONGOING**
4. Instruktur menjalankan sesi dari masing-masing IOS
5. Setelah sesi selesai → status **COMPLETED**
6. Training Results (Pass/Fail/Marksman per trainee) tersimpan otomatis

---

### B. CMT+CTT — Panduan Lengkap

**Perbedaan utama dari CMT Standalone:**  
- Proses Create Booking dan konfigurasi **sama** dengan CMT Standalone (ada Step 1–4)
- **Tidak ada Generate Detail List sebelum hari H**
- Detail List baru di-generate **pada hari H saat onboarding**, berdasarkan siapa yang benar-benar hadir

---

#### FASE 1 — Membuat Booking (sama dengan CMT)

Ikuti langkah Step 1–4 seperti CMT Standalone di atas.  
Satu perbedaan di Step 1: pilih tipe **CMT+CTT** (bukan CMT saja).  
→ Status: **UPCOMING**

---

#### FASE 2 — Hari H: Onboarding Real-Time

1. Buka booking → klik **[Start Onboarding]**
2. Status: **ONGOING** — layar onboarding terbuka

**Proses scan kehadiran:**

```
Untuk setiap trainee yang datang:
  1. Petugas scan kartu NRIC trainee via RFID reader
  2. Sistem cek: apakah NRIC ini ada di Nominal Roll?
     ├─ ✅ Ada → STATUS: PRESENT (nama muncul hijau di daftar)
     ├─ ❌ Tidak ada → STATUS: WALK-IN
     │   → Operator bisa putuskan: izinkan atau tolak
     └─ Terdaftar tapi tidak scan → STATUS: ABSENT (otomatis)
```

**Konfirmasi attendance:**
- Review daftar hadir — siapa Present, siapa Absent, siapa Walk-In
- Walk-In bisa ditambahkan secara manual jika disetujui
- Klik **"Confirm Attendance"**

**Generate Detail List:**
- Berdasarkan siapa yang hadir (bukan Nominal Roll penuh)
- Klik **"Generate Detail List"**
- Penugasan kabin dibuat real-time
- Instruktur di setiap IOS langsung menerima data

**Mulai sesi:**
- Klik **"Start Session"** → instruktur aktifkan simulator dari IOS
- Status tetap **ONGOING** sampai sesi selesai
- → Status: **COMPLETED**

---

### C. SWT — Panduan Lengkap

```
FASE 1 — BUAT BOOKING
FASE 2 — ISSUE ASSETS (sebelum atau saat hari H)
FASE 3 — MULAI SESI (Hari H)
FASE 4 — RETURN ASSETS (setelah sesi)
```

---

#### FASE 1 — Membuat Booking SWT

Dashboard → **"+ New Booking"** → pilih **SWT**

**Step 1 — Booking Details (khusus SWT):**

| Field | Keterangan |
|-------|-----------|
| **Training Date** | Tanggal sesi |
| **Session** | AM / PM / Full Day |
| **Lane Configuration** | Jumlah lane yang digunakan |
| **Weapon System** | Jenis sistem senjata (GPMG, Spike, dst.) |
| **No. of Trainees** | Jumlah peserta |
| **Courseware** | Kode skenario SWT |
| **Instructor** | Instruktur bertugas |

**Step 2 — Nominal Roll:**  
Sama seperti CMT — tambah trainee manual atau import dari ATMS.

**Step 3 — Assignment:**  
Sistem meminta konfirmasi aset yang akan digunakan:
1. Pilih jenis aset dari daftar tersedia (GPMG, tripod, aksesori)
2. Sistem mengecek stok aset yang tidak sedang digunakan
3. Konfirmasi Assignment — aset "dipesan" untuk booking ini

Klik **"Submit"** → Status: **UPCOMING**

---

#### FASE 2 — Issue Assets

> Dilakukan **sebelum atau pada pagi hari H**, di counter gudang fasilitas.

1. Petugas gudang buka halaman **Issue Assets** untuk booking ini
2. Untuk setiap aset dalam Assignment:
   - Ambil aset dari rak
   - Scan tag RFID aset via reader
   - Sistem konfirmasi: aset ini cocok dengan Assignment ✅
   - Status aset berubah: **In Storage → In Use**
3. Setelah semua aset ter-scan, klik **"Confirm Issue"**
4. Tanda terima digital digenerate — petugas dan unit bisa download

> **Jika scan gagal (RFID tidak terbaca):**  
> Petugas bisa input nomor serial manual sebagai override, tapi harus ada approval supervisor.

---

#### FASE 3 — Mulai Sesi (Hari H)

1. Buka booking → klik **"Start Session"**
2. Status: **ONGOING**
3. Trainee menggunakan sistem senjata di lane masing-masing
4. Instruktur monitor dari IOS SWT
5. Setelah sesi selesai → klik **"End Session"**
6. Status otomatis berubah ke **RETURN ASSETS** (karena aset belum dikembalikan)

---

#### FASE 4 — Return Assets

> Harus diselesaikan **di hari yang sama** setelah sesi, sebelum fasilitas tutup.

1. Petugas gudang buka halaman **Return Assets** untuk booking ini
2. Trainee/unit mengembalikan aset ke counter
3. Untuk setiap aset:
   - Scan tag RFID aset
   - Sistem cek: aset ini memang ter-issue untuk booking ini? ✅
   - Catat kondisi aset (Normal / Perlu Servis / Rusak)
   - Status aset: **In Use → In Storage**
4. Setelah semua aset kembali → klik **"Confirm Return"**
5. Status booking: **COMPLETED**

> **Jika ada aset yang tidak kembali:**  
> Sistem akan menandai aset tersebut sebagai **Outstanding**. Unit bertanggung jawab untuk melaporkan dan menyelesaikan kasus ini. Booking tidak bisa Completed sampai semua aset Outstanding diselesaikan (dikembalikan atau dilaporkan hilang).

---

### D. IMT — Panduan Lengkap

Alur IMT **identik dengan SWT**, dengan perbedaan:

| Aspek | IMT | SWT |
|-------|-----|-----|
| Jenis senjata | SAR21, M16, Ultimax (senjata ringan) | GPMG, Spike, senjata berat |
| Konfigurasi lane | Sederhana, per shooters | Lebih kompleks, per weapon system |
| Jumlah aset per trainee | 1 senjata + aksesori | 1–2 sistem senjata + perlengkapan |

**Semua langkah (Buat Booking → Issue → Sesi → Return) sama persis dengan SWT.**  
Hanya pilih tipe **IMT** saat membuat booking baru.

---

### E. Ringkasan Perbandingan Alur per Tipe

```
CMT STANDALONE
  Create Booking → Nominal Roll → Cabin Config → Submit
  → (H-1) Generate Detail List → Sync ke IOS
  → (Hari H) Start Onboarding → ONGOING → COMPLETED

CMT+CTT
  Create Booking → Nominal Roll → Cabin Config → Submit
  → (Hari H) Start Onboarding → Scan NRIC → Generate Detail List → ONGOING → COMPLETED

SWT / IMT
  Create Booking → Nominal Roll → Assignment → Submit
  → Issue Assets → (Hari H) Start Session → ONGOING → End Session
  → Return Assets → COMPLETED
```

---

### F. Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|---------------------|--------|
| Tombol "Generate Detail List" tidak aktif | Nominal Roll kosong ATAU Cabin Config belum lengkap | Cek checklist prasyarat di tab Detail List |
| Kabin tidak bisa dipilih (abu-abu) | Status Occupied — sedang dipakai booking lain | Pilih kabin lain, atau cek konflik jadwal |
| Kabin tidak bisa dipilih (amber) | Status Unavailable — maintenance | Hubungi operator fasilitas untuk status kabin |
| Tidak bisa menambah Platform Type ke kabin | Quota Platform Type sudah penuh | Kurangi assignment di kabin lain, atau ubah Qty di Step 1 |
| RFID scan tidak terbaca | Tag RFID rusak atau baterai low | Input nomor serial manual + minta approval supervisor |
| Trainee tidak bisa di-drag ke kabin lain | Role tidak cocok dengan slot yang tersedia | Cek role trainee vs role yang dibutuhkan kabin tujuan |
| Status booking stuck di "Return Assets" | Masih ada aset yang belum dikembalikan / di-scan | Scan semua aset yang outstanding, atau eskalasi ke supervisor |

---

*Dokumen ini dibuat untuk membantu semua pihak — teknis maupun non-teknis — memahami terminologi dan alur kerja sistem TRMS. Dokumen ini adalah living document — perbarui setiap kali ada perubahan sistem atau terminologi baru.*
