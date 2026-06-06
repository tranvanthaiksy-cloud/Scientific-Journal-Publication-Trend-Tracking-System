# 📘 Postman Collection — Journal Trend Tracker API

> **File**: [Journal_Trend_Tracker_API.postman_collection.json](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/docs/Journal_Trend_Tracker_API.postman_collection.json)

---

## Hướng dẫn sử dụng

1. Mở **Postman** → Click **Import** → Chọn file `.json` bên trên
2. Chỉnh biến `base_url` nếu server chạy port khác `8080`
3. Gọi **Login** trước → token tự động lưu vào biến `auth_token` / `admin_token`
4. Các request cần xác thực sẽ tự động dùng `{{auth_token}}`

### Tài khoản mặc định
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | ADMIN |
| `researcher1` | `password123` | RESEARCHER |
| `student1` | `password123` | STUDENT |

---

## Tổng quan — 14 Folders, 65+ Requests

| # | Folder | Requests | Auth | Jira Story |
|---|--------|----------|------|------------|
| 1 | 🔐 Authentication | 8 | ❌ Public | JP-9, JP-10, JP-11 |
| 2 | 👤 User Profile | 3 | ✅ JWT | JP-12 |
| 3 | 🛡️ Admin — User Mgmt | 6 | ✅ ADMIN | JP-13 |
| 4 | 🔍 Paper & Search | 7 | ❌ Public | JP-18, JP-19 |
| 5 | 📚 Journal & Author | 5 | ❌ Public | JP-20, JP-21 |
| 6 | 📈 Trend Analysis | 4 | ❌ Public | JP-30 |
| 7 | 📊 Dashboard | 5 | ❌ Public | JP-34 |
| 8 | 🏷️ Research Topics | 8 | Mixed | JP-31 |
| 9 | 📌 Bookmarks | 5 | ✅ JWT | JP-41 |
| 10 | ➡️ Follow | 7 | ✅ JWT | JP-42 |
| 11 | 🔔 Notifications | 4 | ✅ JWT | JP-43 |
| 12 | ⚙️ Admin — Data Sources | 4 | ✅ ADMIN | JP-32 |
| 13 | 📄 Reports | 4 | ✅ JWT | JP-47 |
| 14 | 🧪 E2E Test Flows | 5 flows | Mixed | JP-50 |

---

## Chi tiết Endpoints

### 🔐 1. Authentication (`/api/auth`)

| Method | Endpoint | Mô tả | Test Cases |
|--------|----------|-------|------------|
| `POST` | `/api/auth/register` | Đăng ký | ✅ Success, ❌ Duplicate, ❌ Validation |
| `POST` | `/api/auth/login` | Đăng nhập | ✅ Researcher, ✅ Admin, ❌ Wrong pass |
| `POST` | `/api/auth/refresh` | Refresh token | ✅ Valid token |
| `GET` | `/api/auth/test` | Debug OpenAlex | — |

### 👤 2. User Profile (`/api/users`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/users/me` | Xem profile |
| `PUT` | `/api/users/me` | Cập nhật profile |
| `PUT` | `/api/users/me/password` | Đổi mật khẩu |

### 🛡️ 3. Admin — User Management (`/api/admin/users`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/admin/users` | List users (paginated, search, filter by role) |
| `GET` | `/api/admin/users/{id}` | Chi tiết user |
| `PUT` | `/api/admin/users/{id}/status` | Kích hoạt / vô hiệu hóa |
| `PUT` | `/api/admin/users/{id}/role` | Thay đổi role |

### 🔍 4. Paper & Search (`/api/papers`)

| Method | Endpoint | Mô tả | Test Cases |
|--------|----------|-------|------------|
| `GET` | `/api/papers/search` | Tìm kiếm (keyword, author, journal, year range, sort) | ✅ by keyword, ✅ by author, ✅ by journal, ✅ combined, ✅ no params |
| `GET` | `/api/papers/{id}` | Chi tiết bài báo | ✅ Found, ❌ 404 |

### 📚 5. Journal & Author

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/journals` | Danh sách journals |
| `GET` | `/api/journals/{id}` | Chi tiết journal |
| `GET` | `/api/journals/{id}/papers` | Papers theo journal |
| `GET` | `/api/authors/{id}/papers` | Papers theo tác giả |
| `GET` | `/api/keywords/top` | Top keywords |

### 📈 6. Trend Analysis (`/api/trends`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/trends/keyword/{keyword}` | Trend 1 keyword |
| `GET` | `/api/trends/compare` | So sánh nhiều keywords |
| `GET` | `/api/trends/topics/trending` | Top trending topics |

### 📊 7. Dashboard (`/api/dashboard`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/dashboard/stats` | Thống kê tổng quan |
| `GET` | `/api/dashboard/trending` | Trending topics |
| `GET` | `/api/dashboard/recent-papers` | Papers mới nhất |
| `GET` | `/api/dashboard/top-journals` | Top journals |
| `GET` | `/api/dashboard/yearly-stats` | Papers theo năm |

### 🏷️ 8. Research Topics (`/api/topics`)

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `GET` | `/api/topics` | ❌ | Danh sách topics |
| `GET` | `/api/topics/{id}` | ❌ | Chi tiết topic |
| `POST` | `/api/topics` | ADMIN | Tạo topic |
| `PUT` | `/api/topics/{id}` | ADMIN | Cập nhật topic |
| `DELETE` | `/api/topics/{id}` | ADMIN | Xóa topic |
| `POST` | `/api/topics/{id}/keywords/{kwId}` | ADMIN | Gán keyword |
| `DELETE` | `/api/topics/{id}/keywords/{kwId}` | ADMIN | Xóa keyword |

### 📌 9. Bookmarks (`/api/bookmarks`)

| Method | Endpoint | Mô tả | Test Cases |
|--------|----------|-------|------------|
| `POST` | `/api/bookmarks` | Bookmark paper | ✅ Success, ❌ Duplicate 409 |
| `GET` | `/api/bookmarks/me` | List bookmarks | ✅ Auth, ❌ No token 401 |
| `DELETE` | `/api/bookmarks/{paperId}` | Xóa bookmark | — |

### ➡️ 10. Follow (`/api/follows`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/follows` | Follow (JOURNAL/TOPIC/KEYWORD) |
| `GET` | `/api/follows/me` | List follows (filter by type) |
| `DELETE` | `/api/follows/{id}` | Unfollow |

### 🔔 11. Notifications (`/api/notifications`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/notifications` | List notifications |
| `GET` | `/api/notifications/unread-count` | Số chưa đọc |
| `PUT` | `/api/notifications/{id}/read` | Đánh dấu đã đọc |
| `PUT` | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc |

### ⚙️ 12. Admin — Data Sources & Sync (`/api/admin`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/admin/datasources` | List data sources |
| `PUT` | `/api/admin/datasources/{id}` | Bật/tắt source |
| `POST` | `/api/admin/sync/trigger` | Trigger sync thủ công |
| `GET` | `/api/admin/sync/status` | Trạng thái sync |

### 📄 13. Reports (`/api/reports`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/reports/generate` | Sinh report |
| `GET` | `/api/reports/history` | Lịch sử reports |
| `GET` | `/api/reports/{id}` | Xem report |
| `GET` | `/api/reports/{id}/download` | Tải PDF |

---

## 🧪 E2E Test Flows (JP-50)

| Flow | Mô tả | Bước |
|------|-------|------|
| **Flow 1** | Auth | Register → Login → Profile |
| **Flow 2** | Search + Bookmark | Search → Bookmark → Verify → Unbookmark |
| **Flow 3** | Trend Analysis | Dashboard stats → Trending → Keyword trend → Compare |
| **Flow 4** | Admin Sync | Login Admin → Datasources → Trigger sync → Check status |
| **Flow 5** | Follow + Notification | Follow journal → Check notifications → Mark read |

---

## Tính năng tự động

- 🔑 **Auto-save token**: Login/Register tự động lưu JWT vào biến `auth_token`
- 🛡️ **Admin token riêng**: Login Admin lưu vào `admin_token` cho các API admin
- ✅ **Test scripts**: Một số request có script tự động verify response
- 📝 **Descriptions**: Mỗi request có mô tả chi tiết + reference đến Jira Story
