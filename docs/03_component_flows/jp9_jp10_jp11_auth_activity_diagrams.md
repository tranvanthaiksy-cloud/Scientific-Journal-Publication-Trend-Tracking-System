# Sơ Đồ Hoạt Động Chi Tiết — JP-9, JP-10, JP-11 (Authentication)

> Tất cả sơ đồ được vẽ dựa trên phân tích trực tiếp source code hiện tại của hệ thống.

**Source code tham chiếu:**
- [AuthController.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/controller/AuthController.java)
- [AuthServiceImpl.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/service/impl/AuthServiceImpl.java)
- [JwtTokenProvider.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/JwtTokenProvider.java)
- [CustomUserDetailsService.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/security/CustomUserDetailsService.java)
- [GlobalExceptionHandler.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/exception/GlobalExceptionHandler.java)
- [RegisterRequest.java](file:///d:/Document/Java/journal-trend-tracker/Scientific-Journal-Publication-Trend-Tracking-System/backend/com.journaltracker/src/main/java/com/journaltracker/dto/request/RegisterRequest.java)

---

## 1. Sơ đồ tổng quan — Kiến trúc Authentication Module

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
graph TB
    subgraph "Client (Postman / React Frontend)"
        C1["POST /api/auth/register"]
        C2["POST /api/auth/login"]
        C3["POST /api/auth/refresh"]
    end

    subgraph "Spring Security Filter Chain"
        SF["SecurityFilterChain"]
        SF -->|"permitAll: /api/auth/**"| AC
    end

    subgraph "Controller Layer"
        AC["AuthController"]
    end

    subgraph "Service Layer"
        AS["AuthServiceImpl"]
    end

    subgraph "Security Components"
        AM["AuthenticationManager"]
        CUDS["CustomUserDetailsService"]
        PE["PasswordEncoder<br>(BCrypt)"]
        JWT["JwtTokenProvider"]
    end

    subgraph "Data Layer"
        UR["UserRepository"]
        DB[("MySQL<br>users table")]
    end

    C1 --> SF
    C2 --> SF
    C3 --> SF

    AC -->|"register()"| AS
    AC -->|"login()"| AS
    AC -->|"refreshToken()"| AS

    AS --> UR
    AS --> PE
    AS --> JWT
    AS --> AM
    AM --> CUDS
    CUDS --> UR
    UR --> DB

    style AC fill:#4fc3f7,stroke:#0288d1,stroke-width:2px
    style AS fill:#81c784,stroke:#388e3c,stroke-width:2px
    style JWT fill:#ffb74d,stroke:#f57c00,stroke-width:2px
    style DB fill:#e0e0e0,stroke:#616161,stroke-width:2px
```

---

## 2. JP-9: Đăng Ký Tài Khoản (Register)

### 2.1 Activity Diagram — Luồng chính

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
flowchart TD
    START(("Start")) --> A["Client gửi<br>POST /api/auth/register"]

    A --> B["AuthController.register()<br>nhận @Valid @RequestBody RegisterRequest"]

    B --> VAL{"Jakarta Validation<br>kiểm tra các trường"}

    VAL -- "Lỗi validation<br>(thiếu field, email sai format,<br>password < 6 ký tự,<br>role = ADMIN)" --> VAL_ERR["GlobalExceptionHandler<br>.handleMethodArgumentNotValidException()"]
    VAL_ERR --> VAL_RESP["HTTP 400 Bad Request<br>ApiResponse.error('Validation failed',<br>Map field -> errorMessage)"]
    VAL_RESP --> END1(("End"))

    VAL -- "Hợp lệ" --> C["AuthServiceImpl.register(request)"]

    C --> D{"userRepository<br>.existsByUsername<br>(request.getUsername())"}

    D -- "true: Username đã tồn tại" --> E["throw DuplicateResourceException<br>('Username already exists')"]
    E --> F["GlobalExceptionHandler<br>.handleDuplicateResourceException()"]
    F --> G["HTTP 409 Conflict<br>ApiResponse.error('Username already exists')"]
    G --> END2(("End"))

    D -- "false" --> H{"userRepository<br>.existsByEmail<br>(request.getEmail())"}

    H -- "true: Email đã tồn tại" --> I["throw DuplicateResourceException<br>('Email already exists')"]
    I --> F

    H -- "false" --> J["passwordEncoder.encode<br>(request.getPassword())<br>Hash password bằng BCrypt"]

    J --> K["User.builder()<br>.username(request.getUsername())<br>.email(request.getEmail())<br>.passwordHash(hashedPassword)<br>.fullName(request.getFullName())<br>.role(request.getRole())<br>.isActive(true)<br>.build()"]

    K --> L["userRepository.save(user)<br>@PrePersist: set createdAt, updatedAt"]

    L --> M["toUserDetails(savedUser)<br>Tạo Spring Security UserDetails<br>với username, passwordHash,<br>SimpleGrantedAuthority(role)"]

    M --> N["jwtTokenProvider<br>.generateToken(userDetails)<br>Tạo JWT Token"]

    N --> O["AuthResponse.builder()<br>.token(jwtToken)<br>.tokenType('Bearer')<br>.username(savedUser.getUsername())<br>.role(savedUser.getRole())<br>.build()"]

    O --> P["HTTP 201 Created<br>ApiResponse.success(<br>'User registered successfully',<br>authResponse)"]

    P --> END3(("End"))

    style VAL fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style D fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style H fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style N fill:#ffcc80,stroke:#ef6c00,stroke-width:2px
    style P fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px
    style G fill:#ef9a9a,stroke:#c62828,stroke-width:2px
    style VAL_RESP fill:#ef9a9a,stroke:#c62828,stroke-width:2px
```

### 2.2 Sequence Diagram — Tương tác giữa các component

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    autonumber
    participant Client
    participant SF as SecurityFilterChain
    participant AC as AuthController
    participant VL as Jakarta Validator
    participant AS as AuthServiceImpl
    participant UR as UserRepository
    participant PE as BCryptPasswordEncoder
    participant JWT as JwtTokenProvider
    participant DB as MySQL

    Client->>SF: POST /api/auth/register<br>{username, email, password, fullName, role}
    SF->>AC: permitAll — cho phép không cần JWT

    AC->>VL: Validate @Valid RegisterRequest
    alt Validation thất bại (thiếu field, email sai format, role=ADMIN)
        VL-->>AC: MethodArgumentNotValidException
        AC-->>Client: HTTP 400 {success:false, message:"Validation failed", body:{field:error}}
    end

    AC->>AS: register(request)

    AS->>UR: existsByUsername("nguyenvana")
    UR->>DB: SELECT COUNT(*) FROM users WHERE username = ?
    DB-->>UR: 0 hoặc 1
    UR-->>AS: false / true

    alt Username đã tồn tại
        AS-->>AC: throw DuplicateResourceException("Username already exists")
        AC-->>Client: HTTP 409 {success:false, message:"Username already exists"}
    end

    AS->>UR: existsByEmail("nguyenvana@gmail.com")
    UR->>DB: SELECT COUNT(*) FROM users WHERE email = ?
    DB-->>UR: 0 hoặc 1
    UR-->>AS: false / true

    alt Email đã tồn tại
        AS-->>AC: throw DuplicateResourceException("Email already exists")
        AC-->>Client: HTTP 409 {success:false, message:"Email already exists"}
    end

    AS->>PE: encode("Password123!")
    PE-->>AS: "$2a$10$xxxxx..." (BCrypt hash)

    AS->>AS: User.builder().username().email()<br>.passwordHash(hash).fullName().role()<br>.isActive(true).build()

    AS->>UR: save(user)
    UR->>DB: INSERT INTO users(username, email, password_hash,<br>full_name, role, is_active, created_at, updated_at)
    DB-->>UR: User (id được auto-generate)
    UR-->>AS: savedUser

    AS->>AS: toUserDetails(savedUser)<br>= new UserDetails(username, hash, [role])

    AS->>JWT: generateToken(userDetails)
    JWT->>JWT: claims = {username, role}<br>subject = username<br>issuedAt = now<br>expiration = now + jwtExpiration<br>signWith(HS512, secretKey)
    JWT-->>AS: "eyJhbGciOiJIUzUxMiJ9..."

    AS-->>AC: AuthResponse{token, "Bearer", username, role}
    AC-->>Client: HTTP 201 {success:true, message:"User registered successfully",<br>body:{token, tokenType, username, role}}
```

### 2.3 Bảng Validation Rules — RegisterRequest

| Trường | Annotation | Quy tắc | Lỗi trả về |
|--------|-----------|---------|-------------|
| `username` | `@NotBlank`, `@Size(min=3, max=50)` | Bắt buộc, 3-50 ký tự | "must not be blank" / "size must be between 3 and 50" |
| `email` | `@NotBlank`, `@Email` | Bắt buộc, đúng format email | "must not be blank" / "must be a well-formed email address" |
| `password` | `@NotBlank`, `@Size(min=6)` | Bắt buộc, tối thiểu 6 ký tự | "must not be blank" / "size must be at least 6" |
| `fullName` | `@NotBlank` | Bắt buộc | "must not be blank" |
| `role` | `@NotNull` | Bắt buộc, Enum: RESEARCHER/LECTURER/STUDENT | "must not be null" |
| *(custom)* | `@AssertTrue` trên `isAllowedRegistrationRole()` | `role != ADMIN` | "Role ADMIN is not allowed" |

---

## 3. JP-10: Đăng Nhập & JWT (Login)

### 3.1 Activity Diagram — Luồng chính

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
flowchart TD
    START(("Start")) --> A["Client gửi<br>POST /api/auth/login"]

    A --> B["AuthController.login()<br>nhận @Valid @RequestBody LoginRequest"]

    B --> VAL{"Jakarta Validation<br>kiểm tra username, password"}

    VAL -- "Lỗi validation<br>(field trống)" --> VAL_ERR["HTTP 400 Bad Request<br>ApiResponse.error('Validation failed',<br>Map field -> errorMessage)"]
    VAL_ERR --> END1(("End"))

    VAL -- "Hợp lệ" --> C["AuthServiceImpl.login(request)"]

    C --> D["authenticationManager.authenticate(<br>new UsernamePasswordAuthenticationToken(<br>username, password))"]

    D --> E["AuthenticationManager gọi<br>CustomUserDetailsService<br>.loadUserByUsername(username)"]

    E --> F{"userRepository<br>.findByUsername<br>(username)"}

    F -- "Không tìm thấy" --> G["throw UsernameNotFoundException<br>('User not found')"]
    G --> H["AuthenticationManager bắt exception<br>-> AuthenticationException"]
    H --> I["AuthServiceImpl catch block<br>throw UnauthorizedException<br>('Invalid username or password')"]
    I --> J["GlobalExceptionHandler<br>.handleUnauthorizedException()"]
    J --> K["HTTP 401 Unauthorized<br>ApiResponse.error(<br>'Invalid username or password')"]
    K --> END2(("End"))

    F -- "Tìm thấy User" --> L["Tạo UserDetails:<br>username = user.getUsername()<br>password = user.getPasswordHash()<br>authorities = [role.name()]"]

    L --> M{"AuthenticationManager<br>so sánh password<br>(BCrypt verify)"}

    M -- "Password KHÔNG khớp" --> H

    M -- "Password khớp<br>Authentication thành công" --> N["userRepository<br>.findByUsername(username)<br>Lấy User entity"]

    N --> O["toUserDetails(user)<br>Tạo Spring Security UserDetails"]

    O --> P["jwtTokenProvider<br>.generateToken(userDetails)"]

    P --> Q["Tạo JWT Token:<br>claims = {username, role}<br>subject = username<br>issuedAt = now<br>expiration = now + jwtExpiration<br>sign HS512"]

    Q --> R["AuthResponse.builder()<br>.token(jwtToken)<br>.tokenType('Bearer')<br>.username(user.getUsername())<br>.role(user.getRole())<br>.build()"]

    R --> S["HTTP 200 OK<br>ApiResponse.success(<br>'Login successful',<br>authResponse)"]

    S --> END3(("End"))

    style VAL fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style F fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style M fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style Q fill:#ffcc80,stroke:#ef6c00,stroke-width:2px
    style S fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px
    style K fill:#ef9a9a,stroke:#c62828,stroke-width:2px
    style VAL_ERR fill:#ef9a9a,stroke:#c62828,stroke-width:2px
```

### 3.2 Sequence Diagram — Tương tác giữa các component

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    autonumber
    participant Client
    participant SF as SecurityFilterChain
    participant AC as AuthController
    participant AS as AuthServiceImpl
    participant AM as AuthenticationManager
    participant CUDS as CustomUserDetailsService
    participant UR as UserRepository
    participant DB as MySQL
    participant PE as BCryptPasswordEncoder
    participant JWT as JwtTokenProvider

    Client->>SF: POST /api/auth/login<br>{username: "researcher1", password: "password123"}
    SF->>AC: permitAll — cho phép không cần JWT
    AC->>AS: login(loginRequest)

    AS->>AM: authenticate(new UsernamePasswordAuthenticationToken<br>("researcher1", "password123"))
    AM->>CUDS: loadUserByUsername("researcher1")
    CUDS->>UR: findByUsername("researcher1")
    UR->>DB: SELECT * FROM users WHERE username = 'researcher1'

    alt User không tồn tại
        DB-->>UR: Empty
        UR-->>CUDS: Optional.empty()
        CUDS-->>AM: throw UsernameNotFoundException
        AM-->>AS: throw AuthenticationException
        AS-->>AC: throw UnauthorizedException("Invalid username or password")
        AC-->>Client: HTTP 401 {success:false, message:"Invalid username or password"}
    end

    DB-->>UR: User record
    UR-->>CUDS: Optional of User
    CUDS->>CUDS: new UserDetails(username, passwordHash, [role])
    CUDS-->>AM: UserDetails

    AM->>PE: matches("password123", "$2a$10$xxxxx")

    alt Password không khớp
        PE-->>AM: false
        AM-->>AS: throw BadCredentialsException
        AS-->>AC: throw UnauthorizedException("Invalid username or password")
        AC-->>Client: HTTP 401 {success:false, message:"Invalid username or password"}
    end

    PE-->>AM: true (password khớp)
    AM-->>AS: Authentication (thành công)

    AS->>UR: findByUsername("researcher1")
    UR->>DB: SELECT * FROM users WHERE username = 'researcher1'
    DB-->>UR: User entity
    UR-->>AS: User

    AS->>AS: toUserDetails(user)
    AS->>JWT: generateToken(userDetails)
    JWT->>JWT: Build JWT:<br>claims={username, role}<br>subject=username<br>exp=now+24h<br>sign(HS512)
    JWT-->>AS: "eyJhbGciOi..."

    AS-->>AC: AuthResponse{token, "Bearer", "researcher1", RESEARCHER}
    AC-->>Client: HTTP 200 {success:true, message:"Login successful",<br>body:{token, tokenType:"Bearer", username, role}}

    Note over Client: Client lưu token vào localStorage<br>và dùng cho các API call tiếp theo
```

### 3.3 Chi tiết cấu trúc JWT Token

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
graph LR
    subgraph "JWT Token Structure"
        direction TB
        H["HEADER<br>{'alg': 'HS512', 'typ': 'JWT'}"]
        P["PAYLOAD<br>{'sub': 'researcher1',<br>'username': 'researcher1',<br>'role': 'RESEARCHER',<br>'iat': 1749189600,<br>'exp': 1749276000}"]
        S["SIGNATURE<br>HMACSHA512(<br>base64(header) + '.' +<br>base64(payload),<br>secretKey<br>)"]
    end

    H --> P --> S

    style H fill:#e3f2fd,stroke:#1565c0
    style P fill:#fff3e0,stroke:#e65100
    style S fill:#fce4ec,stroke:#c62828
```

**Giải thích các claims trong JWT:**

| Claim | Giá trị | Mô tả |
|-------|---------|-------|
| `sub` (subject) | `"researcher1"` | Username — identifier chính |
| `username` | `"researcher1"` | Username (trùng sub, thêm cho tiện) |
| `role` | `"RESEARCHER"` | Role của user — dùng cho phân quyền |
| `iat` (issued at) | timestamp | Thời điểm token được tạo |
| `exp` (expiration) | timestamp | Thời điểm token hết hạn (`iat + jwtExpiration`) |

---

## 4. JP-11: Refresh Token

### 4.1 Activity Diagram — Luồng chính

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
flowchart TD
    START(("Start")) --> A["Client gửi<br>POST /api/auth/refresh"]

    A --> B["AuthController.refreshToken()<br>nhận @Valid @RequestBody<br>RefreshTokenRequest{token}"]

    B --> VAL{"Jakarta Validation<br>kiểm tra token không trống"}

    VAL -- "Token trống" --> VAL_ERR["HTTP 400 Bad Request"]
    VAL_ERR --> END0(("End"))

    VAL -- "Có token" --> C["AuthServiceImpl<br>.refreshToken(request)"]

    C --> D["jwtTokenProvider<br>.getUsernameFromRefreshableToken<br>(request.getToken())"]

    D --> E["parseClaims(token)<br>Jwts.parser()<br>.verifyWith(secretKey)<br>.parseSignedClaims(token)"]

    E --> F{"Token parse<br>thành công?"}

    F -- "Thành công<br>(token còn hạn)" --> G["Trả về Optional.of<br>(claims.getSubject())"]

    F -- "ExpiredJwtException<br>(token đã hết hạn)" --> H{"Kiểm tra Grace Period<br>isWithinRefreshGracePeriod<br>(expiration)"}

    H --> H1["expiredForMs =<br>now - expiration"]
    H1 --> H2{"expiredForMs <= 1 giờ<br>(REFRESH_GRACE_PERIOD_MS<br>= 3,600,000 ms)"}

    H2 -- "Hết hạn dưới 1 giờ<br>(còn trong grace period)" --> H3["Trả về Optional.of<br>(claims.getSubject())<br>từ expired token"]

    H2 -- "Hết hạn quá 1 giờ" --> H4["Log: 'JWT expired outside<br>refresh grace period'<br>Trả về Optional.empty()"]

    F -- "Exception khác<br>(token bị sửa, sai format,...)" --> H5["Log: 'JWT cannot be refreshed'<br>Trả về Optional.empty()"]

    H4 --> I["AuthServiceImpl<br>.orElseThrow()"]
    H5 --> I
    I --> J["throw UnauthorizedException<br>('Invalid or expired token')"]
    J --> K["GlobalExceptionHandler<br>.handleUnauthorizedException()"]
    K --> L["HTTP 401 Unauthorized<br>ApiResponse.error(<br>'Invalid or expired token')"]
    L --> END1(("End"))

    G --> M["Có username hợp lệ"]
    H3 --> M

    M --> N["userRepository<br>.findByUsername(username)"]

    N --> O{"User tồn tại<br>trong DB?"}

    O -- "Không" --> P["throw UnauthorizedException<br>('Invalid or expired token')"]
    P --> K

    O -- "Có" --> Q["toUserDetails(user)<br>Tạo Spring Security UserDetails"]

    Q --> R["jwtTokenProvider<br>.generateToken(userDetails)<br>Tạo JWT Token MỚI"]

    R --> S["AuthResponse.builder()<br>.token(newToken)<br>.tokenType('Bearer')<br>.username(user.getUsername())<br>.role(user.getRole())<br>.build()"]

    S --> T["HTTP 200 OK<br>ApiResponse.success(<br>'Token refreshed successfully',<br>authResponse)"]

    T --> END2(("End"))

    style VAL fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style F fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style H2 fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style O fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style R fill:#ffcc80,stroke:#ef6c00,stroke-width:2px
    style T fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px
    style L fill:#ef9a9a,stroke:#c62828,stroke-width:2px
    style VAL_ERR fill:#ef9a9a,stroke:#c62828,stroke-width:2px
```

### 4.2 Sequence Diagram — Tương tác giữa các component

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    autonumber
    participant Client
    participant AC as AuthController
    participant AS as AuthServiceImpl
    participant JWT as JwtTokenProvider
    participant UR as UserRepository
    participant DB as MySQL

    Client->>AC: POST /api/auth/refresh<br>{token: "eyJhbGciOi..."}
    AC->>AS: refreshToken(request)

    AS->>JWT: getUsernameFromRefreshableToken(token)
    JWT->>JWT: parseClaims(token)<br>Jwts.parser().verifyWith(key).parseSignedClaims()

    alt Token hợp lệ (chưa hết hạn)
        JWT-->>AS: Optional.of("researcher1")
    end

    alt Token hết hạn (ExpiredJwtException)
        JWT->>JWT: Lấy expiration từ expired claims
        JWT->>JWT: isWithinRefreshGracePeriod(expiration)<br>expiredForMs = now - expiration

        alt Hết hạn dưới 1 giờ (grace period)
            JWT-->>AS: Optional.of("researcher1")
        end

        alt Hết hạn quá 1 giờ
            JWT-->>AS: Optional.empty()
            AS-->>AC: throw UnauthorizedException("Invalid or expired token")
            AC-->>Client: HTTP 401 {success:false, message:"Invalid or expired token"}
        end
    end

    alt Token sai format / bị giả mạo
        JWT-->>AS: Optional.empty()
        AS-->>AC: throw UnauthorizedException("Invalid or expired token")
        AC-->>Client: HTTP 401 {success:false, message:"Invalid or expired token"}
    end

    AS->>UR: findByUsername("researcher1")
    UR->>DB: SELECT * FROM users WHERE username = ?
    DB-->>UR: User record
    UR-->>AS: User

    AS->>AS: toUserDetails(user)
    AS->>JWT: generateToken(userDetails)
    JWT->>JWT: Build JWT MỚI:<br>claims={username, role}<br>exp=now+24h<br>sign(HS512)
    JWT-->>AS: "eyJhbGciOi...(NEW)"

    AS-->>AC: AuthResponse{newToken, "Bearer", username, role}
    AC-->>Client: HTTP 200 {success:true,<br>message:"Token refreshed successfully",<br>body:{token(new), tokenType, username, role}}

    Note over Client: Client thay thế token cũ<br>bằng token mới trong localStorage
```

### 4.3 Biểu đồ trạng thái — Token Lifecycle

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
stateDiagram-v2
    [*] --> TokenCreated: Login / Register thành công
    TokenCreated --> TokenActive: Client nhận và lưu token
    TokenActive --> TokenActive: Client gọi API<br>(gắn Bearer token vào header)
    TokenActive --> TokenExpiringSoon: Gần hết hạn<br>(Frontend kiểm tra exp)
    TokenExpiringSoon --> TokenActive: POST /api/auth/refresh<br>Nhận token mới
    TokenExpiringSoon --> TokenExpired: Không refresh kịp

    TokenExpired --> GracePeriod: Token hết hạn
    GracePeriod --> TokenActive: POST /api/auth/refresh<br>trong vòng 1 giờ<br>sau khi hết hạn
    GracePeriod --> TokenInvalid: Quá 1 giờ<br>sau khi hết hạn

    TokenActive --> TokenInvalid: Token bị giả mạo /<br>sai format / user bị xóa
    TokenInvalid --> [*]: Buộc đăng nhập lại

    note right of GracePeriod
        REFRESH_GRACE_PERIOD_MS = 3,600,000 ms (1 giờ)
        Cho phép refresh token đã hết hạn
        nhưng chưa quá 1 giờ
    end note
```

---

## 5. Tổng hợp — Bảng so sánh 3 API

| Tiêu chí | JP-9: Register | JP-10: Login | JP-11: Refresh |
|----------|---------------|-------------|----------------|
| **Endpoint** | `POST /api/auth/register` | `POST /api/auth/login` | `POST /api/auth/refresh` |
| **Request Body** | `RegisterRequest`<br>(username, email, password,<br>fullName, role) | `LoginRequest`<br>(username, password) | `RefreshTokenRequest`<br>(token) |
| **Auth Required** | Không (permitAll) | Không (permitAll) | Không (permitAll) |
| **Validation** | @NotBlank, @Email,<br>@Size, @NotNull,<br>@AssertTrue (no ADMIN) | @NotBlank | Token string |
| **Kiểm tra DB** | existsByUsername,<br>existsByEmail | findByUsername<br>(qua AuthenticationManager) | findByUsername |
| **Password** | BCrypt encode | BCrypt verify<br>(qua AuthenticationManager) | Không cần |
| **Token Logic** | Tạo token mới<br>cho user vừa đăng ký | Tạo token mới<br>cho user đã xác thực | Parse token cũ<br>+ tạo token mới |
| **Grace Period** | N/A | N/A | 1 giờ sau khi hết hạn |
| **Success HTTP** | 201 Created | 200 OK | 200 OK |
| **Response** | `AuthResponse`<br>(token, tokenType,<br>username, role) | `AuthResponse`<br>(token, tokenType,<br>username, role) | `AuthResponse`<br>(token, tokenType,<br>username, role) |
| **Error Cases** | 400 (validation)<br>409 (duplicate) | 400 (validation)<br>401 (bad credentials) | 401 (invalid/expired token) |

---

## 6. Luồng End-to-End — Từ Register đến sử dụng API

```mermaid
%%{init: { 'sequence': {'useMaxWidth': false}, 'flowchart': {'useMaxWidth': false} }}%%
sequenceDiagram
    autonumber
    participant User as User (Browser)
    participant FE as React Frontend
    participant Auth as /api/auth/*
    participant API as /api/* (Protected)
    participant Filter as JwtAuthenticationFilter

    Note over User, Filter: Bước 1: Đăng ký (JP-9)
    User->>FE: Nhập thông tin đăng ký
    FE->>Auth: POST /api/auth/register
    Auth-->>FE: 201 {token, username, role}
    FE->>FE: Lưu token vào localStorage

    Note over User, Filter: Bước 2: Đăng nhập (JP-10) — nếu quay lại sau
    User->>FE: Nhập username + password
    FE->>Auth: POST /api/auth/login
    Auth-->>FE: 200 {token, username, role}
    FE->>FE: Lưu token vào localStorage

    Note over User, Filter: Bước 3: Sử dụng API với JWT
    User->>FE: Tương tác (xem papers, bookmark,...)
    FE->>Filter: GET /api/papers/1<br>Authorization: Bearer eyJ...
    Filter->>Filter: validateToken(token) = true
    Filter->>Filter: getUsernameFromToken = "researcher1"
    Filter->>Filter: loadUserByUsername -> set SecurityContext
    Filter->>API: Request đã xác thực
    API-->>FE: 200 {paper data}
    FE-->>User: Hiển thị dữ liệu

    Note over User, Filter: Bước 4: Refresh token (JP-11) — token sắp hết hạn
    FE->>FE: Kiểm tra token.exp gần hết
    FE->>Auth: POST /api/auth/refresh {token: "eyJ..."}
    Auth-->>FE: 200 {newToken, username, role}
    FE->>FE: Thay thế token cũ bằng token mới

    Note over User, Filter: Bước 5: Token hết hạn quá 1 giờ
    FE->>Auth: POST /api/auth/refresh {token: "eyJ...(expired)"}
    Auth-->>FE: 401 "Invalid or expired token"
    FE->>FE: Xóa localStorage, redirect /login
    FE-->>User: Hiển thị trang đăng nhập
```
