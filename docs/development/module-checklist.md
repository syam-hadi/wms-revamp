# Module Implementation Checklist

Checklist ini akan menjadi standar resmi repository WMS dan digunakan oleh seluruh Backend Developer maupun AI Assistant sebagai acuan Definition of Done (DoD).

## Definition of Done (DoD)

Suatu module hanya boleh dianggap selesai apabila **seluruh item Mandatory telah terpenuhi**. Jika suatu item bersifat Optional namun diimplementasikan, maka item tersebut harus mengikuti kaidah yang ada.

## Common Mistakes

Berikut adalah kesalahan yang sering dilakukan developer ketika membuat module baru:

1. **Exposing Raw Entity:** Mengembalikan/expose raw Entity (representasi Database) langsung dari Controller. Harus selalu menggunakan Contract dan Mapper.
2. **Fat Controller:** Menaruh Business Logic di dalam Controller. Controller hanya bertugas mengatur request dan mereturn response, seluruh logika bisnis harus ada di Service.
3. **Mismatched Architecture:** Menyalin code dari module lain tanpa menyesuaikan nama class/interface (copy-paste error) sehingga terjadi architecture drift.
4. **Missing Pagination:** Lupa menambahkan limit/offset pada method `findMany`, sehingga rentan terhadap performa dan serangan out of memory (OOM).
5. **Missing API Property:** Lupa menyertakan decorator `@ApiProperty()` pada DTO yang mengakibatkan OpenAPI/Swagger SDK gagal menghasilkan schema yang benar.
6. **No DB Transaction on Mutiple Writes:** Mengeksekusi multiple write operation yang saling bergantung tanpa menggunakan Database Transaction, sehingga berisiko partial failure.
7. **Instantiating Redis Directly:** Membuat instance Redis Client baru (contoh: `new Redis()`) di dalam module. Seharusnya menggunakan `CacheService` bawaan arsitektur Golden Template.
8. **Stale Cache:** Lupa melakukan invalidasi cache (delete cache key) saat melakukan Update/Delete pada service.

## Review Flow

Module Development ↓
Self Review ↓
Architecture Review ↓
Performance Review ↓
Swagger Review ↓
Regression Review ↓
Approved

---

## 1. Database Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Prisma Model** | Mandatory | Merepresentasikan tabel secara konkret di DB | `model Tax { ... }` pada `schema.prisma` |
| **Migration** | Mandatory | Melacak dan mereplikasi perubahan struktur DB dengan aman | Harus membuat file migrasi `yarn prisma migrate dev --name create_tax_table` |
| **Naming Convention** | Mandatory | Menjaga konsistensi struktur penamaan di PostgreSQL | Menggunakan snake_case: `@@map("mst_taxes")`, field: `created_at` |
| **Primary Key** | Mandatory | Setiap record harus dapat diidentifikasi secara unik | Menggunakan UUID: `id String @id @default(uuid()) @db.Uuid` |
| **Foreign Key** | Mandatory | Menjaga referential integrity antar relasi tabel | Definisi relasi misal `company_id String @db.Uuid` |
| **Soft Delete** | Mandatory | Mencegah data loss tak disengaja di level database | Harus ada field `deleted_at DateTime?` |
| **Audit Fields** | Mandatory | Mengetahui jejak history siapa yang merubah data | Harus ada `created_by`, `updated_by` |
| **Index** | Mandatory | Mempercepat pencarian data jika filter field sering dipakai | `@@index([company_id])` atau `@@index([created_at])` |
| **Unique Constraint** | Optional | Mencegah inkonsistensi redundansi data (misal: code tidak boleh sama) | `@@unique([company_id, code])` |
| **Default Value** | Optional | Meminimalisir bug null exception jika value wajar punya default | `is_active Boolean @default(true)` |

## 2. Entity Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Mengikuti BaseEntity** | Mandatory | Menjamin tersedianya field fundamental spt `id` dan audit field | `export class TaxEntity extends BaseEntity { ... }` |
| **Tidak memiliki ApiProperty** | Mandatory | Entity adalah persistence layer, dilarang tembus sampai Swagger | Dilarang keras memakai `@ApiProperty()` di layer Entity |
| **Tidak memiliki business logic** | Mandatory | Entity harus berupa class anemic (hanya membawa state data DB) | Jangan ada kompleks method atau dependency injection di Entity |
| **Hanya persistence model** | Mandatory | Memisahkan data DB murni dari presentasi | Representasi persis dari Prisma model tanpa ditambahkan relasi luar yang tidak perlu |

## 3. Contract Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Response Contract** | Mandatory | Standar struktur response payload API ke Client/Frontend | Class `TaxResponse` |
| **Create Contract** | Mandatory | Standar struktur input (DTO) ketika User men-submit data baru | Class `CreateTaxRequest` |
| **Update Contract** | Mandatory | Standar struktur input (DTO) untuk edit/patch data | Class `UpdateTaxRequest` (gunakan `PartialType` bila relevan) |
| **ApiProperty lengkap** | Mandatory | Syarat agar Frontend SDK generation bisa mengetahui bentuk payload | Semua property harus memiliki `@ApiProperty(...)` |
| **Nullable benar** | Mandatory | OpenAPI menginformasikan apakah property bisa mereturn null | `@ApiProperty({ nullable: true })` |
| **Required benar** | Mandatory | Menentukan opsional vs wajib pada form swagger dan SDK | `@ApiProperty({ required: false })` jika property opsional |
| **Example bila diperlukan** | Optional | Memudahkan tester mengisi input via Swagger UI langsung | `@ApiProperty({ example: 'TAX-PPN' })` |
| **Tidak expose Entity** | Mandatory | Mencegah informasi rahasia DB (seperti password hash) bocor | Type dari property tidak boleh mengambil Class dari Entity |

## 4. Validation Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Create Validation** | Mandatory | Melindungi sistem dari input sampah/berbahaya saat pembuatan | Menggunakan decorator Validation di `CreateTaxRequest` |
| **Update Validation** | Mandatory | Melindungi payload pembaruan data | Menggunakan decorator Validation di `UpdateTaxRequest` |
| **Required Validation** | Mandatory | Data yang not-null di DB wajib dilengkapi saat request masuk | Menggunakan `@IsNotEmpty()` untuk field non-nullable |
| **Max Length** | Mandatory | Menghindari error Postgres value too long / SQL injection overflow | `@MaxLength(100)` pada field teks |
| **Min Length** | Optional | Memastikan user tidak menginput whitespace / kosong | `@MinLength(3)` |
| **Decimal Validation** | Optional | Memastikan string numeric valid / tipe data presisi desimal | `@IsNumber()` atau `@IsNumberString()` |
| **Enum Validation** | Optional | Memaksa client mengirim parameter dari set pilihan yang sah | `@IsEnum(TaxType)` |
| **UUID Validation** | Mandatory | Memastikan relasi ID adalah uuid valid untuk DB postgresql | `@IsUUID()` pada id maupun foreign-key id |
| **Duplicate Validation** | Mandatory | Mencegah Prisma melempar error unik ke console | Panggil unique checker repo dari Service (bukan Class Validator) |
| **Business Validation** | Optional | Verifikasi logika sistem (contoh stok cukup, status enable) | Dilakukan dalam method Service sebelum repo call |

## 5. Mapper Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Entity → Contract** | Mandatory | Translasi standar dari persistence model ke API presentation | `static toResponse(entity: TaxEntity): TaxResponse` |
| **Contract → Response** | Mandatory | Konversi dari layer Service (biasanya membalikkan Entity/Logic Object) menjadi Response | Penggunaan mapper standar di Controller atau Service |
| **Tidak expose Entity** | Mandatory | Menjaga prinsip Clean Architecture (Dependency Rule) | Signature Mapper mereturn DTO/Contract, bukan sebaliknya |
| **Mapping nullable benar** | Mandatory | Null safety, tidak men-trigger "Cannot read property of null" | `name: entity.name ?? ""` jika kontrak melarang null |

## 6. Repository Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **create** | Mandatory | Abstraksi penyimpanan data satu pintu | `create(data: Prisma.TaxCreateInput): Promise<TaxEntity>` |
| **update** | Mandatory | Abstraksi modifikasi data eksisting | `update(id: string, data: Prisma.TaxUpdateInput)` |
| **delete / soft delete** | Mandatory | Standarisasi method untuk mematikan/menghapus record | `softDelete(id: string, deletedBy: string)` mengupdate `deleted_at` |
| **findById** | Mandatory | Query spesifik mengambil satu record berdasarkan PK | `findById(id: string): Promise<TaxEntity | null>` |
| **findMany** | Mandatory | Query dengan opsi filter dan search | Menerima pagination parameters dan custom filters |
| **duplicate checker** | Mandatory | Utility helper khusus pengecekan constraint DB di repository | `countByCode(code: string, excludeId?: string)` |
| **pagination** | Mandatory | Mengkalkulasi total data, page saat ini untuk meta response | Sesuai kontrak `BaseQueryContract` (page, perPage) |
| **transaction** | Optional | Support prisma transaction injection jika butuh atomic writes | Argumen `tx?: Prisma.TransactionClient` |

## 7. Service Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Business validation** | Mandatory | Otak dari sistem berada di service | Validasi status record, cek limit, dll lalu throw Exception |
| **Duplicate validation** | Mandatory | Cek duplikasi record sebelum di insert | Lempar `ConflictException` (409) jika melanggar unique constraint |
| **Error handling** | Mandatory | Menormalisasi error Prisma ke standard HTTP Error | Gunakan Exception filter atau throw `NotFoundException` |
| **Audit field** | Mandatory | Melengkapi jejak audit berdasarkan User request context | Menyuntikkan user ID ke property `created_by` / `updated_by` |
| **Transaction** | Optional | Menjamin atomicity ketika banyak tabel terkena imbas | `this.prisma.$transaction(async (tx) => { ... })` |
| **Cache** | Optional | Mengintegrasikan Redis caching layer demi kecepatan fetching | `this.cacheService.remember(...)` |
| **Logging bila diperlukan** | Optional | Audit trail manual di console/ELK jika flow berisiko | `this.logger.log('Process XYZ Started')` |

## 8. Cache Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Cache Key** | Mandatory | Format string terisolasi per tabel (menghindari tabrakan) | Gunakan pola baku: `taxes:company_${companyId}:list` |
| **Cache TTL** | Mandatory | Mencegah penumpukan cache tak terpakai selamanya di RAM | `ttl: 3600` (satu jam, sesuai policy) |
| **Menggunakan CacheService** | Mandatory | Wajib memanggil singleton provider dari platform inti | Inject `CacheService` di constructor Service terkait |
| **remember()** | Optional | Pattern lazy-loading fetch ke DB | `this.cacheService.remember(key, ttl, fetcherCb)` |
| **invalidate()** | Optional | Menghapus satu item dari cache secara presisi | `this.cacheService.del(key)` setelah modifikasi data |
| **invalidateMany()** | Optional | Menghapus set key sejenis akibat pembaruan massal | `this.cacheService.delByPattern('taxes:*')` |
| **Refresh bila diperlukan** | Optional | Strategi pembaruan data secara asinkron tanpa ditunggu client | Background workers |

> **Catatan Cache:** Tidak semua module wajib menggunakan cache. Pertimbangkan module yang read-heavy (contoh: Master Data statis) sebagai target mandatory penggunaan Cache, sedangkan module write-heavy tidak direkomendasikan.

## 9. Controller Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **CRUD lengkap** | Mandatory | Menyediakan standar API manipulasi module RESTful penuh | Mengimplementasikan method GET, POST, PATCH, DELETE |
| **HTTP Status benar** | Mandatory | Memberikan status code spesifik untuk semantik jaringan yang baik | Gunakan `@HttpCode(200)` untuk OK, 201 untuk Create, 204 Delete |
| **ApiTags** | Mandatory | Mengkategorikan endpoint di Swagger UI | `@ApiTags('Master Tax')` pada Controller class |
| **ApiOperation** | Mandatory | Menyajikan judul endpoint dalam dokumentasi | `@ApiOperation({ summary: 'Create Tax' })` |
| **operationId** | Mandatory | Sangat penting untuk Next.js SDK, menjadi nama method Typescript | `@ApiOperation({ summary: 'Get Tax', operationId: 'getTaxes' })` |
| **ApiGenericResponse** | Mandatory | Memberikan pembungkus metadata sukses/error dari core template | `@ApiGenericResponse(TaxResponse)` decorator custom template |
| **Request DTO** | Mandatory | Routing request body dan params ke validasi kontrak | `@Body() req: CreateTaxRequest`, `@Query() filter: TaxFilter` |
| **Response DTO** | Mandatory | Signature dari endpoint controller mengembalikan tipe class kontrak | `Promise<TaxResponse>` atau generic base response wrapper |

## 10. Swagger Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **docs-json valid** | Mandatory | Harus tervalidasi saat fetch JSON dari `/docs-json` | Pastikan tidak ada error circular dependency |
| **operationId lengkap** | Mandatory | Mencegah generator menamakan method dengan default ngawur | Semua endpoint (`@Get()`, dll) wajib memiliki field ini |
| **Contract muncul** | Mandatory | Object properties harus terlihat di panel Schema (bottom of swagger) | Pastikan file `*.contract.ts` menggunakan decorators swagger lengkap |
| **Entity tidak muncul** | Mandatory | Menjaga kerahasiaan Persistence Layer architecture | Model db/Prisma sama sekali tak terlihat di dokumen |
| **Generic Response benar** | Mandatory | Response mematuhi contract BaseResponse / PaginationMeta | Metadata paging terstruktur sesuai core architecture |
| **Nullable benar** | Mandatory | Memungkinkan SDK frontend memberikan typing Type \| Null | Jika suatu field bisa null (optional db), tulis di `@ApiProperty` |
| **Pagination benar** | Mandatory | Terdapat parameter query `page` dan `perPage` di Docs | Gunakan Query parameters atau DTO extends `BaseQueryContract` |
| **Error Response benar** | Optional | Dokumentasi detail bentuk error untuk Frontend | Menggunakan decorator `@ApiBadRequestResponse()`, dll |

## 11. Security Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Authorization** | Mandatory | Melindungi endpoit module agar tidak dibuka ke publik bebas | Pasang `@UseGuards(JwtAuthGuard)` jika belum terpasang global |
| **Authentication** | Mandatory | Memverifikasi JWT valid dan tidak expired | - |
| **Audit User** | Mandatory | Mengambil Context User yang memanggil endpoint | Menggunakan decorator `@ReqUser()` atau context penyedia id user |
| **Permission / RBAC** | Optional | Hanya user yang mempunyai lisensi fitur khusus boleh memanggil | `@Permissions('tax:write')` atau semacamnya |

> **Catatan Security:** Jika module belum memakai layer Role Based security (RBAC) tertentu, status RBAC dianggap N/A (Not Applicable).

## 12. Redis Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Cache Pattern sesuai Golden** | Mandatory | Mengikuti arsitektur tanpa modifikasi improvisasi yang melanggar kontrak | Memakai library CacheService wrapper internal |
| **Tidak membuat Redis Client** | Mandatory | Mencegah kebocoran koneksi (connection timeout limits db pool) | Tak boleh menggunakan `import Redis from 'ioredis'` di service modul |
| **Cache Consistency** | Mandatory | Menghindari Dirty Read (Client mendapatkan data lama setelah ada update) | Harus dipanggil invalidator pada Service method `update` & `delete` |

## 13. Performance Layer

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Tidak ada N+1 query** | Mandatory | Mencegah loop memanggil Database puluhan kali (Membunuh IOPS DB) | Tarik semua relasi dengan array inclusion (e.g., Prisma `include`) |
| **Pagination digunakan** | Mandatory | Mencegah load puluhan ribu row memory Node.js | Harus di set Max Limit fetch row (misal max 100) di repository |
| **Select hanya field yang diperlukan** | Optional | Mengurangi bottleneck Network Bandwidth untuk tabel raksasa | Prisma `select: { id: true, name: true }` |
| **Cache bila read-heavy** | Optional | Menyisihkan load PostgreSQL untuk request katalog/master list | - |
| **Transaction bila write kompleks** | Optional | Eksekusi atomik satu jaringan pipeline write | `$transaction` pada insert master - details record bertingkat |

## 14. Code Quality

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Mengikuti Golden Template** | Mandatory | Memastikan maintainability codebase di level Enterprise tim besar | Struktur map folder: `/contracts`, `/controllers`, `/services`, dll |
| **KISS (Keep It Simple Stupid)** | Mandatory | Kode mudah di debug tanpa pemahaman magis berlebihan | Hindari custom RxJs atau kompleksitas async berlebih jika tidak perlu |
| **DRY (Don't Repeat Yourself)** | Mandatory | Jika kode tersebut akan ditulis 3x, bungkus ke helper | Abstraksi formatting string / math calculations |
| **SOLID Principles** | Mandatory | Service punya tanggung jawab tunggal, class dapat di-extend | Memisahkan tanggung jawab (ex: pemrosesan file jangan gabung di Tax Service) |
| **YAGNI (You Aren't Gonna Need It)** | Mandatory | Jangan ngoding fungsional abstrak membingungkan hanya karena 'mungkin besok diperlukan' | Buat sesuai AC (Acceptance Criteria) yang ada hari ini |
| **Tidak duplicate code** | Mandatory | Boilerplate boleh disalin, namun string, variable dsb mutlak disesuaikan | Repositori Copy Paste salah nama modul adalah masalah serius |
| **Tidak architecture drift** | Mandatory | Layer tidak tembus lapis (Controller tak panggil DB) | Tetap ikuti arus `Controller -> Service -> Repository -> DB` |

## 15. Testing & Verification

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **npm run lint** | Mandatory | Memastikan tak ada eslint dan aturan prettier yang dilanggar | Tidak ada cacing merah di editor IDE |
| **npm run build** | Mandatory | Memastikan Type Inference Typescript berhasil dan kompilasi aman | Tidak ada any casting / strict types issue pada module |
| **Swagger UI** | Mandatory | User interface API dapat di load di Browser tanpa hang / crash | Cek endpoint `/docs` localhost |
| **docs-json** | Mandatory | Memastikan kompatibilitas output JSON untuk Frontend Next.js generator | Check url `/docs-json` dan load pada editor JSON parser lokal |
| **CRUD Test** | Mandatory | Eksekusi manual minimal via Postman/Curl sukses menulis ke DB | - |
| **Regression Check** | Mandatory | Module lama atau code relasi eksisting tidak boleh terdampak negatif | Test modul lain yang berinteraksi dengan API/Service baru |

## 16. Documentation

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Swagger lengkap** | Mandatory | Menggantikan dokuemn spesifikasi Postman word / PDF | Keterangan `@ApiOperation()` dan property wajib jelas |
| **README module** | Optional | Menjelaskan flow kalkulasi rumit pada module level (contoh perhitungan tax tiered) | Membuat file `README.md` lokal per-module directory |
| **Business Rules terdokumentasi** | Optional | Memberikan komentar blok deskriptif pada logic kompleks perihal aturan fiskal dll | `/** Kalkulasi progresif pajak pasal... */` pada Service |

## 17. Final Review

| Checklist | Status | Reason | Notes & Example |
| :--- | :--- | :--- | :--- |
| **Golden Template Compliance** | Mandatory | Validasi bahwa pola implementasi terikat Blueprint perusahaan | Review tahap pertama di PR |
| **Architecture Review** | Mandatory | Cek Dependency Injection Graph | Review apakah ada import siklik (Circular Dependencies) |
| **Performance Review** | Mandatory | Scan ketiadaan index / lack of cache pada data heavy | Lead/Senior dev meng-acc pull request terkait scaling DB |
| **Swagger Review** | Mandatory | Memeriksa penamaan operationId untuk SDK | - |
| **Cache Review** | Mandatory | Review sinkronisasi Invalidation dan TTL | - |
| **Regression Review** | Mandatory | Run semua test core dan cek dampak fungsionalitas | Merge request ditutup/diterima |
