# 🔐 Phân tích luồng Spring Security + JWT

## Tổng quan các file Security

| File | Vai trò |
|---|---|
| [SecurityConfig.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/config/SecurityConfig.java) | Cấu hình chính: quy tắc bảo mật, đăng ký filter, tắt CSRF/session |
| [JwtAuthenticationFilter.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/JwtAuthenticationFilter.java) | Filter chặn mọi request, kiểm tra & xác thực JWT token |
| [JwtTokenProvider.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/JwtTokenProvider.java) | Tạo, xác thực, và giải mã JWT token |
| [CustomUserDetailsService.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/CustomUserDetailsService.java) | Tải thông tin user từ database |
| [application.yml](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/resources/application.yml) | Cấu hình `jwt.secret` và `jwt.expiration` |

---

## 1. Sơ đồ tổng quan kiến trúc Security

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
flowchart TB
    A(["🌐 Client\nBrowser hoặc Postman"])
    B["⚙️ SecurityFilterChain\nSecurityConfig.java"]
    C{"URL trong\npermitAll() ?"}
    D(["✅ Cho phép tự do\nKhông cần token"])
    E["🔍 JwtAuthenticationFilter\nKiểm tra mọi request"]
    F{"Có header\nAuthorization: Bearer ?"}
    G(["❌ 401 Unauthorized\nThiếu token"])
    H["🔑 JwtTokenProvider\n.validateToken(token)"]
    I{"Token\nhợp lệ ?"}
    J(["❌ 401 Unauthorized\nToken sai hoặc hết hạn"])
    K["🔑 JwtTokenProvider\n.getUsernameFromToken(token)"]
    L["👤 CustomUserDetailsService\n.loadUserByUsername(username)"]
    M["💾 UserRepository\n.findByUsername(username)"]
    N[("🗄️ MySQL Database")]
    O["🔐 Tạo Authentication object\nSet vào SecurityContextHolder"]
    P(["✅ Controller xử lý\n→ Trả về response"])

    A -->|"HTTP Request"| B
    B --> C
    C -->|"YES: /api/auth/**\n/swagger-ui/**\n/api/papers/search"| D
    C -->|"NO: /api/bookmarks\nvà các URL khác"| E
    E --> F
    F -->|"Không có"| G
    F -->|"Có Bearer token"| H
    H --> I
    I -->|"Không hợp lệ"| J
    I -->|"Hợp lệ"| K
    K --> L
    L --> M
    M --> N
    N -->|"User entity"| L
    L --> O
    O --> P

    style A fill:#2980b9,stroke:#1a5276,color:#fff
    style B fill:#34495e,stroke:#2c3e50,color:#fff
    style C fill:#7f8c8d,stroke:#626567,color:#fff
    style D fill:#1e8449,stroke:#145a32,color:#fff
    style E fill:#2980b9,stroke:#1a5276,color:#fff
    style F fill:#7f8c8d,stroke:#626567,color:#fff
    style G fill:#c0392b,stroke:#922b21,color:#fff
    style H fill:#8e44ad,stroke:#6c3483,color:#fff
    style I fill:#7f8c8d,stroke:#626567,color:#fff
    style J fill:#c0392b,stroke:#922b21,color:#fff
    style K fill:#8e44ad,stroke:#6c3483,color:#fff
    style L fill:#27ae60,stroke:#1e8449,color:#fff
    style M fill:#d35400,stroke:#a04000,color:#fff
    style N fill:#e67e22,stroke:#ca6f1e,color:#fff
    style O fill:#2471a3,stroke:#1a5276,color:#fff
    style P fill:#1e8449,stroke:#145a32,color:#fff
```

---

## 2. Luồng ĐĂNG NHẬP (Login) — Tạo Token

> [!NOTE]
> Hiện tại bạn **chưa có API đăng nhập thực sự** (`/api/auth/login`). File [Controller.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/Controller.java) đang tạm hardcode tạo token cho user "thai". Dưới đây là luồng đúng mà bạn cần xây dựng.

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    actor Client
    participant AuthController as AuthController<br/>/api/auth/login
    participant UserDetailsService as CustomUserDetailsService
    participant DB as MySQL Database
    participant PasswordEncoder as BCryptPasswordEncoder
    participant JwtProvider as JwtTokenProvider
    
    Client->>AuthController: POST /api/auth/login<br/>{"username": "thai", "password": "123456"}
    
    AuthController->>UserDetailsService: loadUserByUsername("thai")
    UserDetailsService->>DB: SELECT * FROM users<br/>WHERE username = 'thai'
    DB-->>UserDetailsService: User entity (username, passwordHash, role)
    UserDetailsService-->>AuthController: UserDetails object
    
    AuthController->>PasswordEncoder: matches("123456", passwordHash)
    
    alt ✅ Mật khẩu đúng
        PasswordEncoder-->>AuthController: true
        AuthController->>JwtProvider: generateToken(userDetails)
        
        Note over JwtProvider: 1. Tạo claims (roles)<br/>2. Set subject = username<br/>3. Set expiration = now + 24h<br/>4. Ký bằng HMAC-SHA512<br/>5. Trả về JWT string
        
        JwtProvider-->>AuthController: "eyJhbGciOiJIUzUxMiJ9..."
        AuthController-->>Client: 200 OK<br/>{"token": "eyJhbGci..."}
    else ❌ Mật khẩu sai
        PasswordEncoder-->>AuthController: false
        AuthController-->>Client: 401 Unauthorized
    end
```

---

## 3. Luồng XÁC THỰC (Authentication) — Mỗi request kèm Token

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    actor Client
    participant Filter as JwtAuthenticationFilter
    participant JwtProvider as JwtTokenProvider
    participant UserService as CustomUserDetailsService
    participant DB as MySQL Database
    participant SecurityCtx as SecurityContextHolder
    participant Controller as API Controller

    Client->>Filter: GET /api/bookmarks<br/>Header: Authorization: Bearer eyJhbG...

    Note over Filter: Bước 1: Kiểm tra header

    Filter->>Filter: authHeader = request.getHeader("Authorization")
    Filter->>Filter: token = authHeader.substring(7)
    
    Note over Filter: Bước 2: Validate token
    
    Filter->>JwtProvider: validateToken(token)
    
    Note over JwtProvider: Parse token bằng secret key<br/>Kiểm tra chữ ký + hạn sử dụng
    
    JwtProvider-->>Filter: true ✅

    Note over Filter: Bước 3: Lấy username từ token

    Filter->>JwtProvider: getUsernameFromToken(token)
    JwtProvider-->>Filter: "thai"

    Note over Filter: Bước 4: Tải user từ DB

    Filter->>UserService: loadUserByUsername("thai")
    UserService->>DB: findByUsername("thai")
    DB-->>UserService: User entity
    UserService-->>Filter: UserDetails (username, password, authorities)

    Note over Filter: Bước 5: Tạo Authentication & set vào Context

    Filter->>SecurityCtx: setAuthentication(<br/>UsernamePasswordAuthenticationToken)

    Note over Filter: Bước 6: Tiếp tục filter chain

    Filter->>Controller: filterChain.doFilter(request, response)
    Controller-->>Client: 200 OK — "Bookmarks"
```

---

## 4. Cấu trúc JWT Token

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
graph LR
    subgraph "JWT Token = 3 phần, ngăn cách bởi dấu chấm (.)"
        A["Header<br/>(Base64)"] --- B["Payload<br/>(Base64)"] --- C["Signature<br/>(HMAC-SHA512)"]
    end

    subgraph "Header"
        D["alg: HS512<br/>typ: JWT"]
    end

    subgraph "Payload (Claims)"
        E["sub: thai<br/>roles: [ROLE_USER]<br/>iat: 1748451600<br/>exp: 1748538000"]
    end

    subgraph "Signature"
        F["HMACSHA512(<br/>  base64(header) + '.' +<br/>  base64(payload),<br/>  jwt.secret<br/>)"]
    end

    A -.-> D
    B -.-> E
    C -.-> F

    style A fill:#3498db,stroke:#333,color:#fff
    style B fill:#9b59b6,stroke:#333,color:#fff
    style C fill:#e67e22,stroke:#333,color:#fff
```

---

## 5. Vai trò chi tiết từng file

### 📄 SecurityConfig.java — "Bộ não" cấu hình
```
SecurityConfig
├── permitAll()          → Cho phép truy cập tự do: /api/auth/**, /swagger-ui/**, /api/papers/search
├── authenticated()      → Tất cả URL còn lại đều yêu cầu đăng nhập
├── csrf.disable()       → Tắt CSRF (vì dùng JWT, không dùng cookie/session)
├── STATELESS session    → Không tạo session trên server (mỗi request tự xác thực bằng token)
├── addFilterBefore()    → Chèn JwtAuthenticationFilter VÀO TRƯỚC UsernamePasswordAuthenticationFilter
├── exceptionHandling()  → Trả 401 khi chưa đăng nhập
└── passwordEncoder()    → Bean BCrypt để mã hóa/so sánh mật khẩu
```

### 📄 JwtAuthenticationFilter.java — "Người gác cổng"
```
doFilterInternal(request, response, filterChain)
├── 1. Lấy header "Authorization"
├── 2. Nếu không có hoặc không bắt đầu bằng "Bearer " → bỏ qua, đi tiếp
├── 3. Cắt lấy token (bỏ "Bearer ")
├── 4. Gọi jwtTokenProvider.validateToken(token)
├── 5. Nếu hợp lệ:
│   ├── Lấy username từ token
│   ├── Load UserDetails từ DB
│   ├── Tạo UsernamePasswordAuthenticationToken
│   └── Set vào SecurityContextHolder → Spring biết user đã xác thực
└── 6. Gọi filterChain.doFilter() → tiếp tục xử lý request
```

### 📄 JwtTokenProvider.java — "Nhà máy Token"
```
JwtTokenProvider
├── getSigningKey()         → Tạo SecretKey từ chuỗi jwt.secret trong application.yml
├── generateToken()         → Tạo JWT: subject + claims(roles) + issuedAt + expiration + sign
├── validateToken()         → Parse & kiểm tra token (hết hạn? sai key? format sai?)
└── getUsernameFromToken()  → Giải mã token → lấy ra username (subject)
```

### 📄 CustomUserDetailsService.java — "Cầu nối tới Database"
```
CustomUserDetailsService implements UserDetailsService
└── loadUserByUsername(username)
    ├── Gọi userRepository.findByUsername(username)
    ├── Nếu không tìm thấy → throw UsernameNotFoundException
    └── Nếu tìm thấy → trả về Spring Security UserDetails (username, passwordHash, authorities)
```

---

## 6. Đánh giá code & Các vấn đề cần khắc phục

### ✅ Những điểm tốt
- Kiến trúc đúng pattern chuẩn của Spring Security + JWT
- Sử dụng `STATELESS` session → phù hợp cho REST API
- Tắt CSRF đúng (vì dùng token, không phải session/cookie)
- Dùng `BCryptPasswordEncoder` là thuật toán mạnh
- `OncePerRequestFilter` đảm bảo filter chỉ chạy 1 lần mỗi request
- Dùng `HS512` là thuật toán ký mạnh

### ⚠️ Các vấn đề cần sửa

#### 1. 🔴 Chưa có AuthController thực sự

File [Controller.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/Controller.java) đang **hardcode** user để tạo token — đây chỉ là code test, không phải luồng đăng nhập thực.

Bạn cần tạo `AuthController` với các endpoint:
- `POST /api/auth/register` — đăng ký
- `POST /api/auth/login` — đăng nhập → trả về JWT token

#### 2. 🔴 Thiếu AuthenticationManager Bean

Để xác thực username/password khi đăng nhập, bạn cần khai báo `AuthenticationManager` trong `SecurityConfig`:

```java
@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

#### 3. 🟡 JwtAuthenticationFilter gọi DB mỗi request

Hiện tại, **mỗi request** đều gọi `loadUserByUsername()` → truy vấn DB. Đây là điểm có thể gây chậm. Bạn có thể cải thiện bằng cách:
- Kiểm tra `SecurityContextHolder.getContext().getAuthentication() == null` trước khi load lại user
- Hoặc cache thông tin user

#### 4. 🟡 Thứ tự `.claims()` và `.subject()` trong generateToken

Trong [JwtTokenProvider.java dòng 34-40](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/JwtTokenProvider.java#L34-L40):

```java
Jwts.builder()
    .subject(userDetails.getUsername())  // set subject TRƯỚC
    .expiration(expiryDate)
    .claims(claims)                      // .claims() GHI ĐÈ subject!
    .issuedAt(now)
    .signWith(getSigningKey(), Jwts.SIG.HS512)
    .compact();
```

> [!WARNING]
> Gọi `.claims(claims)` **SAU** `.subject()` sẽ **ghi đè toàn bộ claims trước đó**, bao gồm cả `subject`. Điều này có thể khiến `getUsernameFromToken()` trả về `null`.
> 
> **Sửa lại**: đặt `.claims(claims)` **TRƯỚC** `.subject()`, hoặc dùng `.claim("roles", ...)` thay vì `.claims(map)`.

```java
// ✅ Cách sửa đúng
Jwts.builder()
    .claims(claims)                      // set claims TRƯỚC
    .subject(userDetails.getUsername())   // subject sẽ ghi đè lên key "sub" trong claims
    .issuedAt(now)
    .expiration(expiryDate)
    .signWith(getSigningKey(), Jwts.SIG.HS512)
    .compact();
```

#### 5. 🟡 JWT Secret quá ngắn và để trực tiếp trong code

Secret hiện tại chỉ là 1 chuỗi text thường, nên dùng biến môi trường:

```yaml
jwt:
  secret: ${JWT_SECRET:defaultDevSecretKeyThatIsAtLeast64BytesLongForHmacSha512Algorithm!!!}
```

---

## 7. Sơ đồ quan hệ giữa các file

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
graph TD
    Config["SecurityConfig.java<br/>📋 Cấu hình"] -->|inject| Filter["JwtAuthenticationFilter.java<br/>🔍 Filter"]
    Config -->|tạo Bean| Encoder["BCryptPasswordEncoder<br/>🔒 Mã hóa password"]
    
    Filter -->|inject| Provider["JwtTokenProvider.java<br/>🏭 Tạo/Xác thực token"]
    Filter -->|inject| UserService["CustomUserDetailsService.java<br/>👤 Load user"]
    
    Provider -->|đọc config| YML["application.yml<br/>⚙️ jwt.secret, jwt.expiration"]
    UserService -->|inject| Repo["UserRepository<br/>💾 Truy vấn DB"]
    Repo -->|JPA query| DB["MySQL Database<br/>🗄️ Bảng users"]
    
    style Config fill:#2c3e50,stroke:#333,color:#fff
    style Filter fill:#2980b9,stroke:#333,color:#fff
    style Provider fill:#8e44ad,stroke:#333,color:#fff
    style UserService fill:#27ae60,stroke:#333,color:#fff
    style YML fill:#f39c12,stroke:#333,color:#fff
    style DB fill:#e74c3c,stroke:#333,color:#fff
    style Encoder fill:#1abc9c,stroke:#333,color:#fff
    style Repo fill:#d35400,stroke:#333,color:#fff
```
