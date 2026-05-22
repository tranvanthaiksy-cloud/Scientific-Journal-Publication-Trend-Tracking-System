<div align="center">

<img src="https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"/>
<img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-Security-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>

# 📊 Scientific Journal Publication Trend Tracking System

**Hệ thống theo dõi và phân tích xu hướng xuất bản bài báo khoa học**

*Tổng hợp dữ liệu từ OpenAlex · Crossref · Semantic Scholar*

---

[🚀 Demo](#-demo) · [📖 Tài liệu](#-tài-liệu-api) · [⚙️ Cài đặt](#️-cài-đặt-và-chạy) · [🤝 Đóng góp](#-đóng-góp)

</div>

---

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt và chạy](#️-cài-đặt-và-chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Tài liệu API](#-tài-liệu-api)
- [Database Schema](#️-database-schema)
- [Git Workflow](#-git-workflow)
- [Phân công nhóm](#-phân-công-nhóm)
- [Tiến độ dự án](#-tiến-độ-dự-án)
- [Rủi ro & Giải pháp](#️-rủi-ro--giải-pháp)
- [Definition of Done](#-definition-of-done)

---

## 🎯 Tổng quan dự án

> **Đồ án môn học Java** | Thời gian: 20/05/2026 → 10/07/2026 | Nhóm: 6 thành viên

**Scientific Journal Publication Trend Tracking System** là một ứng dụng web full-stack cho phép các nhà nghiên cứu, giảng viên và sinh viên **theo dõi, phân tích và trực quan hóa xu hướng nghiên cứu khoa học** theo thời gian thực.

Hệ thống tự động thu thập dữ liệu bài báo từ **3 nguồn API học thuật lớn** (OpenAlex, Crossref, Semantic Scholar), phân tích xu hướng theo keyword/topic và cung cấp dashboard thống kê trực quan với biểu đồ động.

### 🎖️ Highlights

| Đặc điểm | Chi tiết |
|-----------|----------|
| 🌐 **Multi-source Data** | Tích hợp đồng thời 3 API học thuật quốc tế |
| 📈 **Trend Analytics** | Phân tích tốc độ tăng trưởng, top emerging topics theo năm |
| 🔒 **Role-based Access** | 4 role phân quyền: RESEARCHER / LECTURER / STUDENT / ADMIN |
| ⚡ **Auto Sync** | Scheduler tự động đồng bộ dữ liệu hàng ngày/hàng tuần |
| 🔔 **Notification System** | Thông báo tự động khi có bài báo mới cho nội dung đang follow |
| 📊 **Rich Visualization** | Line chart, bar chart, pie chart, word cloud |

---

## ✨ Tính năng chính

<details>
<summary><b>🔍 Tìm kiếm & Khám phá bài báo</b></summary>

- Tìm kiếm toàn văn theo keyword, tác giả, tên tạp chí
- Bộ lọc nâng cao: năm xuất bản, lĩnh vực, nguồn API
- Phân trang kết quả với Pageable
- Xem chi tiết bài báo: abstract, tác giả, keywords, URL gốc

</details>

<details>
<summary><b>📈 Phân tích xu hướng nghiên cứu</b></summary>

- Biểu đồ trend theo thời gian cho từng keyword
- So sánh đồng thời nhiều keyword/topic
- Tính toán growth rate so với năm trước
- Phát hiện emerging topics đang nổi bật
- Word cloud hiển thị hot keywords

</details>

<details>
<summary><b>📊 Dashboard thống kê</b></summary>

- Tổng số papers, journals, tác giả, từ khóa trong hệ thống
- Top trending topics theo tuần/tháng
- Bài báo mới được thu thập gần đây
- Phân bố bài báo theo lĩnh vực (pie chart)
- Top journals theo số lượng bài báo (bar chart)

</details>

<details>
<summary><b>🔔 Theo dõi & Thông báo</b></summary>

- Follow journal, topic, keyword
- Nhận thông báo khi có bài báo mới phù hợp
- Đánh dấu đã đọc / chưa đọc notification
- Notification bell với badge đếm chưa đọc

</details>

<details>
<summary><b>🔖 Bookmark cá nhân</b></summary>

- Lưu bài báo yêu thích vào danh sách cá nhân
- Quản lý và xoá bookmark
- Truy cập nhanh bài báo đã lưu

</details>

<details>
<summary><b>⚙️ Quản trị hệ thống (Admin)</b></summary>

- Quản lý tài khoản người dùng (xem, kích hoạt/vô hiệu hóa, đổi role)
- Cấu hình nguồn API dữ liệu (OpenAlex, Crossref, Semantic Scholar)
- Trigger đồng bộ dữ liệu thủ công
- Xem báo cáo phân tích tổng quan

</details>

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend — React 18 + Vite               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth UI │  │ Search   │  │Dashboard │  │  Admin     │  │
│  │ Login/Reg│  │ Papers   │  │ Charts   │  │  Panel     │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JSON)
                         │ JWT Bearer Token
┌────────────────────────▼────────────────────────────────────┐
│                  Backend — Spring Boot 4.x                  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Security  │  │Controllers │  │    Scheduler         │  │
│  │ JWT Filter │  │    REST    │  │  Daily/Weekly Sync   │  │
│  └────────────┘  └─────┬──────┘  └──────────┬───────────┘  │
│                        │                     │              │
│  ┌─────────────────────▼─────────────────────▼───────────┐  │
│  │               Service Layer                           │  │
│  │  AuthService · PaperService · TrendAnalysisService    │  │
│  │  DataSyncService · NotificationService · ReportService│  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────▼────────────────────────────┐  │
│  │          Repository Layer — Spring Data JPA           │  │
│  └──────────────────────────┬────────────────────────────┘  │
└───────────────────────────── │ ──────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │        MySQL 8.x Database        │
              │     journal_tracker_db           │
              └─────────────────────────────────┘
                               ▲
              ┌────────────────┴────────────────┐
              │       External API Clients       │
              │  OpenAlex · Crossref · Semantic  │
              └──────────────────────────────────┘
```

### Luồng đồng bộ dữ liệu (Data Sync Flow)

```
⏰ Scheduler (Daily/Weekly)
        │
        ▼
  Sync Service ──► OpenAlex API ──► Parse & Normalize
        │      ──► Crossref API         │
        │      ──► Semantic Scholar     │
        │                               ▼
        │                    Deduplication (DOI/Title)
        │                               │
        └───────────────────────────────▼
                               Save to Database
                                       │
                                       ▼
                              Update Trend Statistics
                                       │
                                       ▼
                            Send Notifications to Followers
```

---

## 🛠️ Tech Stack

### Backend

| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| **Framework** | Spring Boot | 4.0.6 |
| **Language** | Java | 17 |
| **Security** | Spring Security 6 + JWT (jjwt) | 0.12.5 |
| **ORM** | Spring Data JPA + Hibernate | Latest |
| **Database** | MySQL | 8.x |
| **Migration** | Flyway | Latest |
| **HTTP Client** | Spring WebClient (WebFlux) | Latest |
| **Scheduler** | Spring `@Scheduled` | Built-in |
| **Validation** | Jakarta Bean Validation | Latest |
| **Mapping** | MapStruct | 1.5.5 |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) | 3.0.2 |
| **Logging** | SLF4J + Logback | Built-in |
| **Testing** | JUnit 5 + Mockito | Latest |
| **Build** | Maven | Latest |
| **Utilities** | Lombok | Latest |

### Frontend

| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| **Framework** | React | 18 |
| **Build Tool** | Vite | Latest |
| **UI Library** | Ant Design | Latest |
| **Charts** | Recharts | Latest |
| **HTTP Client** | Axios | Latest |
| **Routing** | React Router DOM | Latest |
| **State Management** | Zustand | Latest |
| **Date Handling** | Day.js | Latest |

### External APIs

| API | Mục đích | Documentation |
|-----|----------|---------------|
| [OpenAlex](https://openalex.org/) | Thu thập metadata bài báo | [docs.openalex.org](https://docs.openalex.org) |
| [Crossref](https://www.crossref.org/) | Dữ liệu DOI & citation | [api.crossref.org](https://api.crossref.org) |
| [Semantic Scholar](https://www.semanticscholar.org/) | Phân tích trích dẫn | [api.semanticscholar.org](https://api.semanticscholar.org) |

---

## 📁 Cấu trúc dự án

```
journal-trend-tracker/
│
├── 📂 backend/
│   └── com.journaltracker/
│       ├── src/main/java/com/journaltracker/
│       │   ├── JournalTrackerApplication.java      # Entry point
│       │   │
│       │   ├── 📂 config/                           # Cấu hình hệ thống
│       │   │   ├── SecurityConfig.java              # Spring Security + CORS
│       │   │   ├── WebConfig.java                   # CORS mapping
│       │   │   ├── SchedulerConfig.java             # Scheduler cấu hình
│       │   │   └── SwaggerConfig.java               # OpenAPI/Swagger
│       │   │
│       │   ├── 📂 controller/                       # REST API Controllers
│       │   │   ├── AuthController.java              # POST /api/auth/**
│       │   │   ├── PaperController.java             # GET /api/papers/**
│       │   │   ├── JournalController.java           # GET /api/journals/**
│       │   │   ├── TrendController.java             # GET /api/trends/**
│       │   │   ├── DashboardController.java         # GET /api/dashboard/**
│       │   │   ├── BookmarkController.java          # CRUD /api/bookmarks
│       │   │   ├── NotificationController.java      # GET /api/notifications
│       │   │   ├── FollowController.java            # CRUD /api/follows
│       │   │   ├── ReportController.java            # GET /api/reports/**
│       │   │   └── AdminController.java             # /api/admin/** (ADMIN only)
│       │   │
│       │   ├── 📂 dto/
│       │   │   ├── request/                         # DTOs cho request body
│       │   │   └── response/                        # DTOs cho response + ApiResponse<T>
│       │   │
│       │   ├── 📂 entity/                           # JPA Entities
│       │   │   ├── User.java
│       │   │   ├── ResearchPaper.java
│       │   │   ├── Journal.java
│       │   │   ├── Author.java
│       │   │   ├── Keyword.java
│       │   │   ├── ResearchTopic.java
│       │   │   ├── PublicationTrend.java
│       │   │   ├── Bookmark.java
│       │   │   ├── Notification.java
│       │   │   ├── Follow.java
│       │   │   └── ApiDataSource.java
│       │   │
│       │   ├── 📂 repository/                       # Spring Data JPA Repositories
│       │   ├── 📂 mapper/                           # MapStruct mappers
│       │   │
│       │   ├── 📂 service/                          # Business Logic Layer
│       │   │   ├── impl/                            # Service implementations
│       │   │   ├── AuthService.java
│       │   │   ├── PaperService.java
│       │   │   ├── TrendAnalysisService.java        # Core trend logic
│       │   │   ├── DataSyncService.java             # Core sync logic
│       │   │   ├── NotificationService.java
│       │   │   └── ReportService.java
│       │   │
│       │   ├── 📂 security/                         # JWT & Security
│       │   │   ├── JwtTokenProvider.java
│       │   │   ├── JwtAuthenticationFilter.java
│       │   │   └── CustomUserDetailsService.java
│       │   │
│       │   ├── 📂 scheduler/
│       │   │   └── DataSyncScheduler.java           # @Scheduled sync jobs
│       │   │
│       │   ├── 📂 client/                           # External API Clients
│       │   │   ├── OpenAlexClient.java
│       │   │   ├── CrossrefClient.java
│       │   │   └── SemanticScholarClient.java
│       │   │
│       │   ├── 📂 exception/                        # Exception handling
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── [Custom Exceptions...]
│       │   │
│       │   └── 📂 util/                             # Utilities
│       │
│       └── src/main/resources/
│           ├── application.yml                      # Cấu hình chính
│           ├── application-dev.yml                  # Cấu hình môi trường dev
│           └── db/migration/
│               ├── V1__init_schema.sql              # Tạo 14 bảng
│               └── V2__insert_sample_data.sql       # Dữ liệu mẫu
│
├── 📂 frontend/
│   └── src/
│       ├── 📂 api/                                  # Axios instances & API calls
│       │   ├── axiosConfig.js                       # Base config + JWT interceptor
│       │   ├── authApi.js
│       │   ├── paperApi.js
│       │   ├── trendApi.js
│       │   ├── dashboardApi.js
│       │   ├── bookmarkApi.js
│       │   ├── followApi.js
│       │   └── reportApi.js
│       │
│       ├── 📂 components/                           # Shared UI Components
│       │   ├── Layout/                              # Sidebar, Header, Footer
│       │   ├── Charts/                              # LineChart, BarChart, PieChart, WordCloud
│       │   ├── Dashboard/                           # StatCard, TrendingTopics
│       │   ├── PaperCard.jsx
│       │   ├── SearchBar.jsx
│       │   └── TopicCard.jsx
│       │
│       ├── 📂 pages/                                # Page Components
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── SearchPapers.jsx
│       │   ├── PaperDetail.jsx
│       │   ├── TrendAnalysis.jsx
│       │   ├── TopicExplorer.jsx
│       │   ├── Bookmarks.jsx
│       │   ├── Notifications.jsx
│       │   ├── Following.jsx
│       │   ├── Reports.jsx
│       │   └── AdminPanel.jsx
│       │
│       ├── 📂 context/
│       │   └── AuthContext.jsx                      # Global auth state
│       │
│       ├── 📂 hooks/
│       │   └── useAuth.js                           # Custom auth hook
│       │
│       ├── 📂 utils/                                # Helper functions
│       ├── App.jsx                                  # Root with Router
│       └── main.jsx                                 # Entry point
│
└── 📂 docs/
    ├── implementation_plan.md                       # Kế hoạch triển khai chi tiết
    ├── database_schema.md                           # Schema 14 bảng
    ├── jira_stories_epic1_to_epic3.md               # Jira stories EPIC 1-3
    ├── jira_stories_epic4_to_epic6.md               # Jira stories EPIC 4-6
    └── jira_stories_epic7_to_epic8.md               # Jira stories EPIC 7-8
```

---

## 💻 Yêu cầu hệ thống

| Thành phần | Yêu cầu tối thiểu |
|------------|-------------------|
| **Java** | JDK 17+ |
| **Maven** | 3.6+ |
| **Node.js** | 18+ |
| **npm** | 8+ |
| **MySQL** | 8.0+ |
| **RAM** | 4GB+ (khuyến nghị 8GB) |
| **OS** | Windows 10+ / macOS 11+ / Ubuntu 20.04+ |

---

## ⚙️ Cài đặt và Chạy

### 1. Clone Repository

```bash
git clone https://github.com/<your-org>/journal-trend-tracker.git
cd journal-trend-tracker
```

### 2. Cài đặt Database

```sql
-- Tạo database MySQL
CREATE DATABASE journal_tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jtracker'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON journal_tracker_db.* TO 'jtracker'@'localhost';
FLUSH PRIVILEGES;
```

> **Lưu ý:** Không cần import SQL thủ công. Flyway sẽ tự động chạy migration khi khởi động backend.

### 3. Cấu hình Backend

Tạo file `backend/com.journaltracker/src/main/resources/application-dev.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/journal_tracker_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: jtracker
    password: yourpassword
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate          # Flyway quản lý schema, Hibernate chỉ validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

jwt:
  secret: your-super-secret-key-must-be-at-least-256-bits-long
  expiration: 86400000            # 24 giờ (milliseconds)

server:
  port: 8080

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
```

### 4. Chạy Backend

```bash
cd backend/com.journaltracker

# Build project
mvn clean install -DskipTests

# Chạy ứng dụng (dev profile)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

✅ Backend khởi động thành công tại: `http://localhost:8080`  
📖 Swagger UI: `http://localhost:8080/swagger-ui.html`

### 5. Cài đặt và Chạy Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

✅ Frontend khởi động thành công tại: `http://localhost:5173`

### 6. Tài khoản mặc định (từ sample data)

| Role | Username | Password |
|------|----------|----------|
| **ADMIN** | `admin` | `admin123` |
| **RESEARCHER** | `researcher01` | `test123` |
| **STUDENT** | `student01` | `test123` |

> ⚠️ **Bảo mật:** Đổi mật khẩu admin ngay sau lần đầu đăng nhập trong môi trường production.

---

## 🔑 Biến môi trường

### Backend (application.yml)

| Key | Mô tả | Ví dụ |
|-----|-------|-------|
| `spring.datasource.url` | JDBC URL kết nối MySQL | `jdbc:mysql://localhost:3306/journal_tracker_db` |
| `spring.datasource.username` | Username MySQL | `jtracker` |
| `spring.datasource.password` | Password MySQL | `yourpassword` |
| `jwt.secret` | Secret key cho JWT signing (≥256 bits) | `your-secret-key-here` |
| `jwt.expiration` | Thời gian hết hạn JWT (ms) | `86400000` (24h) |
| `server.port` | Port backend | `8080` |

### Frontend (`.env` file)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Journal Trend Tracker
```

---

## 📖 Tài liệu API

Sau khi chạy backend, truy cập Swagger UI để xem và test toàn bộ API:

```
http://localhost:8080/swagger-ui.html
```

### Tóm tắt các nhóm API

| Nhóm | Base URL | Mô tả | Auth |
|------|----------|-------|------|
| **Auth** | `/api/auth` | Đăng ký, đăng nhập, refresh token | Public |
| **Users** | `/api/users` | Profile, đổi mật khẩu | 🔒 Required |
| **Papers** | `/api/papers` | Tìm kiếm, xem chi tiết bài báo | Public (search) |
| **Journals** | `/api/journals` | Danh sách, chi tiết tạp chí | Public |
| **Trends** | `/api/trends` | Dữ liệu xu hướng theo keyword/topic | 🔒 Required |
| **Dashboard** | `/api/dashboard` | Thống kê tổng quan, trending | 🔒 Required |
| **Bookmarks** | `/api/bookmarks` | CRUD bookmark cá nhân | 🔒 Required |
| **Follows** | `/api/follows` | Follow/Unfollow journal, topic, keyword | 🔒 Required |
| **Notifications** | `/api/notifications` | Danh sách, đánh dấu đọc thông báo | 🔒 Required |
| **Reports** | `/api/reports` | Báo cáo phân tích trend | 🔒 Required |
| **Admin** | `/api/admin` | Quản lý users, datasource, trigger sync | 🔒 ADMIN only |

### Cấu trúc Response chuẩn

Mọi API đều trả về định dạng thống nhất `ApiResponse<T>`:

```json
// Success
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-05-22T12:00:00"
}

// Error
{
  "success": false,
  "message": "Resource not found with id: 999",
  "data": null,
  "timestamp": "2026-05-22T12:00:00"
}
```

### Xác thực với JWT

```bash
# 1. Đăng nhập để lấy token
POST /api/auth/login
{
  "username": "researcher01",
  "password": "test123"
}

# 2. Sử dụng token cho các API protected
GET /api/bookmarks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Database Schema

Hệ thống sử dụng **14 bảng** trong database `journal_tracker_db`, quản lý bằng Flyway migration.

```
journals ──────────────────────────── (1:N) ──── research_papers
                                                        │
                                          ┌─────────────┼─────────────┐
                                          │             │             │
                                    paper_authors  paper_keywords  bookmarks
                                          │             │             │
                                       authors      keywords       users
                                                        │          │   │
                                               publication_trends  │   │
                                                                    │   │
                                               research_topics ─── │ follows
                                                        │       notifications
                                               topic_keywords

api_data_sources (standalone)
```

| # | Bảng | Mô tả |
|---|------|-------|
| 1 | `users` | Tài khoản người dùng + role |
| 2 | `research_papers` | Bài báo khoa học (DOI unique) |
| 3 | `journals` | Tạp chí khoa học |
| 4 | `authors` | Tác giả bài báo |
| 5 | `keywords` | Từ khóa nghiên cứu |
| 6 | `research_topics` | Chủ đề nghiên cứu tổng hợp |
| 7 | `publication_trends` | Dữ liệu xu hướng theo năm/keyword |
| 8 | `bookmarks` | Bài báo đã lưu của user |
| 9 | `notifications` | Thông báo hệ thống |
| 10 | `follows` | Theo dõi journal/topic/keyword |
| 11 | `api_data_sources` | Cấu hình nguồn API bên ngoài |
| 12 | `paper_authors` | 🔗 Junction table |
| 13 | `paper_keywords` | 🔗 Junction table |
| 14 | `topic_keywords` | 🔗 Junction table |

> 📄 Xem chi tiết schema tại: [`docs/database_schema.md`](docs/database_schema.md)

---

## 🔀 Git Workflow

### Branching Strategy

```
main                  ← Production-ready, chỉ merge từ develop khi stable
  └── develop         ← Integration branch, merge tất cả feature branches
        ├── feature/auth-api
        ├── feature/paper-search
        ├── feature/trend-analysis
        ├── feature/frontend-core
        ├── feature/dashboard-charts
        └── bugfix/login-500-error
```

### Quy tắc làm việc

| Quy tắc | Chi tiết |
|---------|----------|
| **Branch naming** | `feature/{module-name}` hoặc `bugfix/{description}` |
| **Commit message** | `[JP-XX] Mô tả ngắn gọn bằng tiếng Anh` |
| **Pull Request** | Mọi merge vào `develop` phải qua PR |
| **Review** | Leader review và approve trước khi merge |
| **Code freeze** | Ngày 08/07 — chỉ fix critical bugs sau ngày này |

### Ví dụ commit messages

```bash
git commit -m "[JP-10] Implement login API with JWT authentication"
git commit -m "[JP-25] Add OpenAlex client with pagination support"
git commit -m "[JP-36] Create trend line chart component with multi-keyword support"
```

---

## 👥 Phân công nhóm

| Thành viên | Role | Phụ trách chính | Stories |
|------------|------|-----------------|---------|
| **Leader (TV1)** | PM + Architect + Core Dev | Config, Security, Scheduler, Core Services, Integration, Code Review | ~12 |
| **TV2** | Backend Developer | Auth, User Management, Notification, Follow | ~8 |
| **TV3** | Backend Developer | Paper, Journal, Author, Keyword, Bookmark, Search | ~8 |
| **TV4** | Backend Developer | Trend API, External API Clients, Dashboard API, Report, Topic, Admin Config | ~10 |
| **TV5** | Frontend Developer | Auth UI, Layout, Search Page, Paper Detail, Bookmarks, Notifications, Admin Panel | ~10 |
| **TV6** | Frontend Developer | Dashboard, Charts, Trend Analysis Page, Topic Explorer, Reports, Following | ~9 |

### EPIC Structure

| Epic | Tên | Assignee chính |
|------|-----|----------------|
| **EPIC-1** | Project Setup & Foundation | Leader |
| **EPIC-2** | Authentication & User Management | TV2 |
| **EPIC-3** | Paper, Journal & Search | TV3 |
| **EPIC-4** | Trend Analysis & Data Sync | Leader + TV4 |
| **EPIC-5** | Dashboard & Visualization | TV6 |
| **EPIC-6** | Notification, Bookmark & Follow | TV2 + TV3 + TV5 |
| **EPIC-7** | Admin & Report | TV4 + TV5 + TV6 |
| **EPIC-8** | Integration, Testing & Polish | All |

---

## 📅 Tiến độ dự án

| Sprint | Thời gian | Mục tiêu chính | Checkpoint |
|--------|-----------|----------------|-----------|
| **Sprint 1** | 20/05 → 26/05 | Project setup, DB migration, JWT, React init | Backend + Frontend khởi động được |
| **Sprint 2** | 27/05 → 02/06 | Auth API E2E, Entity layer, OpenAlex client | Register → Login → JWT → API protected hoạt động |
| **Sprint 3** | 03/06 → 09/06 | Paper/Journal/Author API, Trend core, Search UI | Có thể search papers, xem dashboard cơ bản |
| **Sprint 4** | 10/06 → 16/06 | Bookmark/Follow/Notification, Trend charts | Trend analysis E2E, Bookmark & Follow API ready |
| **Sprint 5** | 17/06 → 23/06 | Hoàn thiện tất cả features | Tất cả features có UI + API |
| **Sprint 6** | 24/06 → 30/06 | Integration, bug fixing, unit tests | Hệ thống chạy ổn định end-to-end |
| **Sprint 7** | 01/07 → 10/07 | Polish, documentation, demo prep | **DEADLINE: Nộp bài 10/07** |

---

## ⚠️ Rủi ro & Giải pháp

| Rủi ro | Xác suất | Giải pháp |
|--------|----------|-----------|
| **API bên thứ ba bị rate limit** | 🔴 Cao | Cache kết quả, retry với exponential backoff, sử dụng nhiều API source |
| **Thành viên trễ deadline sprint** | 🟡 Trung bình | Daily standup qua Zalo/Discord, Leader theo dõi Jira board hằng ngày |
| **Conflict khi merge code** | 🟡 Trung bình | PR nhỏ, merge thường xuyên, không để branch chênh xa `develop` |
| **Database schema thay đổi** | 🟢 Thấp | Dùng Flyway migration — dễ rollback/evolve schema mà không mất data |
| **Frontend-Backend API mismatch** | 🟡 Trung bình | Định nghĩa API contract trên Swagger trước khi code |

---

## ✅ Definition of Done

Một task được coi là **DONE** khi đáp ứng đầy đủ:

- [ ] Code hoàn thành, build thành công (`mvn clean install` không lỗi)
- [ ] Có ít nhất 1 unit test cho service/logic phức tạp
- [ ] API test qua Postman/Swagger thành công
- [ ] Code đã push lên feature branch
- [ ] Pull Request đã được tạo với mô tả rõ ràng
- [ ] PR đã được Leader review và approve
- [ ] PR đã được merge vào `develop`
- [ ] Jira task đã chuyển sang status **Done**

---

## 🤝 Đóng góp

### Quy trình đóng góp code

```bash
# 1. Checkout develop mới nhất
git checkout develop
git pull origin develop

# 2. Tạo feature branch
git checkout -b feature/your-feature-name

# 3. Code, commit thường xuyên
git add .
git commit -m "[JP-XX] Mô tả ngắn gọn"

# 4. Push và tạo Pull Request
git push origin feature/your-feature-name
# → Tạo PR trên GitHub → Request review từ Leader
```

### Daily Standup (5-10 phút qua chat group)

Mỗi ngày trả lời 3 câu:
1. 🟢 Hôm qua làm được gì?
2. 🔵 Hôm nay làm gì?
3. 🔴 Có gì bị blocked không?

---

## 📞 Liên hệ & Giao tiếp

| Kênh | Mục đích |
|------|----------|
| **Zalo / Discord Group** | Trao đổi hằng ngày, thông báo nhanh |
| **Jira Board** | Quản lý task: To Do → In Progress → Code Review → Done |
| **GitHub Pull Requests** | Code review trước khi merge |
| **Google Meet** | Họp khi có vấn đề phức tạp cần giải quyết nhóm |

---

## 📚 Tài liệu tham khảo

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [OpenAlex API Documentation](https://docs.openalex.org/)
- [Crossref REST API](https://api.crossref.org/swagger-ui/index.html)
- [Semantic Scholar API](https://api.semanticscholar.org/graph/v1)
- [React Documentation](https://react.dev/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Flyway Documentation](https://flywaydb.org/documentation/)

---

<div align="center">

**Scientific Journal Publication Trend Tracking System**

*Đồ án môn học Java — Nhóm 6 thành viên*

*Thời gian thực hiện: 20/05/2026 → 10/07/2026*

</div>
