# Diagramas de Arquitectura del Sistema
## MiniMagneto - Análisis Arquitectónico

### Introducción
Este documento presenta diferentes vistas arquitectónicas del sistema MiniMagneto, incluyendo arquitectura de componentes, capas, despliegue y patrones de diseño implementados.

---

## 1. Arquitectura de Capas (Layered Architecture)

```mermaid
graph TB
    subgraph "🎨 Presentation Layer"
        UI[React Components]
        ChatUI[Chat Widget]
        DashUI[Dashboard UI]
        AuthUI[Authentication Forms]
    end
    
    subgraph "🔄 API Gateway Layer"
        NextAuth[NextAuth.js]
        APIRoutes[API Routes]
        Middleware[Auth Middleware]
    end
    
    subgraph "💼 Business Logic Layer"
        UserService[User Service]
        ChatService[Chat Service]
        FeedbackService[Feedback Service]
        StatsService[Statistics Service]
    end
    
    subgraph "🔌 Integration Layer"
        OpenAIClient[OpenAI Client]
        PrismaClient[Prisma ORM]
        AuthProviders[Auth Providers]
    end
    
    subgraph "💾 Data Access Layer"
        UserRepo[User Repository]
        ChatRepo[Chat Repository]
        FeedbackRepo[Feedback Repository]
    end
    
    subgraph "🗄️ Data Storage Layer"
        SQLite[(SQLite Database)]
        SessionStore[(Session Store)]
        Cache[(In-Memory Cache)]
    end
    
    %% Conexiones entre capas
    UI --> NextAuth
    ChatUI --> APIRoutes
    DashUI --> APIRoutes
    AuthUI --> NextAuth
    
    NextAuth --> UserService
    APIRoutes --> ChatService
    APIRoutes --> FeedbackService
    APIRoutes --> StatsService
    
    UserService --> PrismaClient
    ChatService --> OpenAIClient
    ChatService --> PrismaClient
    FeedbackService --> PrismaClient
    StatsService --> PrismaClient
    
    PrismaClient --> UserRepo
    PrismaClient --> ChatRepo
    PrismaClient --> FeedbackRepo
    
    UserRepo --> SQLite
    ChatRepo --> SQLite
    FeedbackRepo --> SQLite
    
    NextAuth --> SessionStore
    StatsService --> Cache
    
    %% Estilos
    classDef presentation fill:#e8f5e8
    classDef api fill:#fff3e0
    classDef business fill:#e3f2fd
    classDef integration fill:#fce4ec
    classDef data fill:#f3e5f5
    classDef storage fill:#e0f2f1
    
    class UI,ChatUI,DashUI,AuthUI presentation
    class NextAuth,APIRoutes,Middleware api
    class UserService,ChatService,FeedbackService,StatsService business
    class OpenAIClient,PrismaClient,AuthProviders integration
    class UserRepo,ChatRepo,FeedbackRepo data
    class SQLite,SessionStore,Cache storage
```

---

## 2. Arquitectura de Componentes (Component Architecture)

```mermaid
graph TB
    subgraph "🌐 Frontend Components"
        subgraph "Pages"
            HomePage[page.tsx]
            EmpleosPage[empleos/page.tsx]
            EmpresasPage[empresas/page.tsx]
        end
        
        subgraph "Components"
            AuthModal[auth-modal.tsx]
            ChatWidget[chat-widget.tsx]
            UserMenu[user-menu.tsx]
            ThemeProvider[theme-provider.tsx]
        end
        
        subgraph "UI Components"
            Button[button.tsx]
            Card[card.tsx]
            Input[input.tsx]
            Badge[badge.tsx]
        end
    end
    
    subgraph "⚙️ Backend Services"
        subgraph "API Routes"
            AuthAPI[/api/auth/*]
            ChatAPI[/api/chat]
            FeedbackAPI[/api/feedback]
            StatsAPI[/api/stats]
        end
        
        subgraph "Core Services"
            AuthService[Authentication Service]
            ChatProcessor[Chat Processor]
            FeedbackAnalyzer[Feedback Analyzer]
            StatsCalculator[Stats Calculator]
        end
    end
    
    subgraph "🔌 External Integrations"
        OpenAI[OpenAI API]
        NextAuthCore[NextAuth Core]
        PrismaORM[Prisma ORM]
    end
    
    subgraph "💾 Data Layer"
        UserModel[User Model]
        ChatModel[Chat Models]
        JobModel[Job Model]
        StatsModel[Stats Model]
        Database[(SQLite DB)]
    end
    
    %% Relaciones Frontend
    HomePage --> AuthModal
    HomePage --> ChatWidget
    EmpleosPage --> ChatWidget
    EmpresasPage --> UserMenu
    
    AuthModal --> Button
    AuthModal --> Input
    ChatWidget --> Card
    UserMenu --> Badge
    
    %% Relaciones API
    AuthModal -.-> AuthAPI
    ChatWidget -.-> ChatAPI
    EmpresasPage -.-> FeedbackAPI
    EmpresasPage -.-> StatsAPI
    
    %% Relaciones Backend
    AuthAPI --> AuthService
    ChatAPI --> ChatProcessor
    FeedbackAPI --> FeedbackAnalyzer
    StatsAPI --> StatsCalculator
    
    %% Relaciones Externas
    AuthService --> NextAuthCore
    ChatProcessor --> OpenAI
    AuthService --> PrismaORM
    ChatProcessor --> PrismaORM
    FeedbackAnalyzer --> PrismaORM
    StatsCalculator --> PrismaORM
    
    %% Relaciones Datos
    PrismaORM --> UserModel
    PrismaORM --> ChatModel
    PrismaORM --> JobModel
    PrismaORM --> StatsModel
    
    UserModel --> Database
    ChatModel --> Database
    JobModel --> Database
    StatsModel --> Database
```

---

## 3. Arquitectura de Despliegue (Deployment Architecture)

```mermaid
graph TB
    subgraph "🌍 Internet"
        Users[👥 Users]
        Companies[🏢 Companies]
        SearchBots[🤖 Search Bots]
    end
    
    subgraph "☁️ Vercel Platform"
        subgraph "Edge Network"
            CDN[CDN/Edge Cache]
            EdgeFunctions[Edge Functions]
        end
        
        subgraph "Serverless Runtime"
            NextApp[Next.js App]
            APIRoutes[API Routes]
            AuthHandlers[Auth Handlers]
        end
        
        subgraph "Static Assets"
            StaticFiles[Static Files]
            Images[Images/Icons]
            Scripts[JS/CSS Bundles]
        end
    end
    
    subgraph "🔗 External Services"
        OpenAIAPI[OpenAI API]
        AuthProviders[Auth Providers]
    end
    
    subgraph "💾 Data Storage"
        SQLiteFile[SQLite File]
        SessionStorage[Session Storage]
        TempFiles[Temporary Files]
    end
    
    subgraph "📊 Monitoring & Analytics"
        VercelAnalytics[Vercel Analytics]
        ErrorTracking[Error Tracking]
        Performance[Performance Monitoring]
    end
    
    %% Flujo de tráfico
    Users --> CDN
    Companies --> CDN
    SearchBots --> CDN
    
    CDN --> EdgeFunctions
    EdgeFunctions --> NextApp
    
    NextApp --> APIRoutes
    NextApp --> AuthHandlers
    NextApp --> StaticFiles
    
    CDN --> Images
    CDN --> Scripts
    
    %% Conexiones externas
    APIRoutes --> OpenAIAPI
    AuthHandlers --> AuthProviders
    
    %% Almacenamiento
    NextApp --> SQLiteFile
    AuthHandlers --> SessionStorage
    APIRoutes --> TempFiles
    
    %% Monitoreo
    NextApp --> VercelAnalytics
    APIRoutes --> ErrorTracking
    EdgeFunctions --> Performance
    
    %% Estilos
    classDef internet fill:#e1f5fe
    classDef vercel fill:#000000,color:#ffffff
    classDef external fill:#fff3e0
    classDef storage fill:#e8f5e8
    classDef monitoring fill:#fce4ec
    
    class Users,Companies,SearchBots internet
    class CDN,EdgeFunctions,NextApp,APIRoutes,AuthHandlers,StaticFiles,Images,Scripts vercel
    class OpenAIAPI,AuthProviders external
    class SQLiteFile,SessionStorage,TempFiles storage
    class VercelAnalytics,ErrorTracking,Performance monitoring
```

---

## 4. Patrones de Diseño Implementados

### 4.1 Patrón MVC (Model-View-Controller)

```mermaid
graph LR
    subgraph "📱 View"
        ReactComponents[React Components]
        UIElements[UI Elements]
        Forms[Forms & Inputs]
    end
    
    subgraph "🎮 Controller"
        APIRoutes[API Route Handlers]
        EventHandlers[Event Handlers]
        StateManagement[State Management]
    end
    
    subgraph "💾 Model"
        PrismaModels[Prisma Models]
        BusinessLogic[Business Logic]
        DataValidation[Data Validation]
    end
    
    %% Flujo MVC
    ReactComponents <--> APIRoutes
    UIElements <--> EventHandlers
    Forms <--> StateManagement
    
    APIRoutes <--> PrismaModels
    EventHandlers <--> BusinessLogic
    StateManagement <--> DataValidation
    
    %% Ejemplo específico
    ChatWidget[Chat Widget] -.-> ChatAPI[Chat API]
    ChatAPI -.-> ChatService[Chat Service]
    ChatService -.-> ChatMessage[ChatMessage Model]
```

### 4.2 Patrón Repository

```mermaid
graph TB
    subgraph "🔧 Service Layer"
        UserService[User Service]
        ChatService[Chat Service]
        FeedbackService[Feedback Service]
    end
    
    subgraph "📚 Repository Layer"
        UserRepository[User Repository]
        ChatRepository[Chat Repository]
        FeedbackRepository[Feedback Repository]
    end
    
    subgraph "💾 Data Access"
        PrismaClient[Prisma Client]
        QueryBuilder[Query Builder]
        Transactions[Transaction Manager]
    end
    
    %% Implementación del patrón
    UserService --> UserRepository
    ChatService --> ChatRepository
    FeedbackService --> FeedbackRepository
    
    UserRepository --> PrismaClient
    ChatRepository --> PrismaClient
    FeedbackRepository --> PrismaClient
    
    PrismaClient --> QueryBuilder
    PrismaClient --> Transactions
    
    %% Ejemplo de implementación
    subgraph "Ejemplo: Chat Repository"
        CreateMessage[createMessage()]
        FindByThread[findByThread()]
        UpdateFeedback[updateFeedback()]
        CountByCompany[countByCompany()]
    end
    
    ChatRepository --> CreateMessage
    ChatRepository --> FindByThread
    ChatRepository --> UpdateFeedback
    ChatRepository --> CountByCompany
```

### 4.3 Patrón Strategy (para Feedback Detection)

```mermaid
graph TB
    subgraph "🎯 Context"
        FeedbackAnalyzer[Feedback Analyzer]
    end
    
    subgraph "📋 Strategy Interface"
        IFeedbackStrategy[IFeedbackStrategy]
    end
    
    subgraph "🔍 Concrete Strategies"
        KeywordStrategy[Keyword Strategy]
        RatingStrategy[Rating Strategy]
        SentimentStrategy[Sentiment Strategy]
        CombinedStrategy[Combined Strategy]
    end
    
    %% Relaciones del patrón
    FeedbackAnalyzer --> IFeedbackStrategy
    IFeedbackStrategy <|-- KeywordStrategy
    IFeedbackStrategy <|-- RatingStrategy
    IFeedbackStrategy <|-- SentimentStrategy
    IFeedbackStrategy <|-- CombinedStrategy
    
    %% Implementación actual
    subgraph "💡 Implementación Actual"
        DetectFeedback["`detectFeedback(message, rating):
        1. Check keywords ['excelente', 'bueno', 'malo']
        2. Validate rating > 0
        3. Return feedback flag`"]
    end
    
    FeedbackAnalyzer -.-> DetectFeedback
```

### 4.4 Patrón Observer (para Dashboard Updates)

```mermaid
graph TB
    subgraph "📢 Subject"
        FeedbackSubject[Feedback Subject]
        NotificationManager[Notification Manager]
    end
    
    subgraph "👁️ Observers"
        DashboardObserver[Dashboard Observer]
        StatsObserver[Stats Observer]
        CacheObserver[Cache Observer]
    end
    
    subgraph "🔄 Events"
        NewFeedback[New Feedback Event]
        StatsUpdate[Stats Update Event]
        CacheInvalidation[Cache Invalidation Event]
    end
    
    %% Relaciones Observer
    FeedbackSubject --> DashboardObserver
    FeedbackSubject --> StatsObserver
    FeedbackSubject --> CacheObserver
    
    NotificationManager --> NewFeedback
    NotificationManager --> StatsUpdate
    NotificationManager --> CacheInvalidation
    
    %% Flujo de eventos
    NewFeedback -.-> DashboardObserver
    StatsUpdate -.-> StatsObserver
    CacheInvalidation -.-> CacheObserver
    
    %% Implementación específica
    subgraph "⚡ Implementación"
        RealTimeUpdate["`Dashboard Polling:
        setInterval(() => {
          fetchLatestFeedback()
          updateDashboard()
        }, 30000)`"]
    end
    
    DashboardObserver -.-> RealTimeUpdate
```

---

## 5. Arquitectura de Seguridad

```mermaid
graph TB
    subgraph "🛡️ Security Layers"
        subgraph "Authentication"
            NextAuthLayer[NextAuth.js]
            CredentialsProvider[Credentials Provider]
            SessionManagement[Session Management]
        end
        
        subgraph "Authorization"
            RouteProtection[Route Protection]
            APIGuards[API Guards]
            RoleValidation[Role Validation]
        end
        
        subgraph "Data Protection"
            PasswordHashing[bcrypt Hashing]
            InputValidation[Input Validation]
            SQLInjectionPrevention[SQL Injection Prevention]
        end
        
        subgraph "Transport Security"
            HTTPS[HTTPS/TLS]
            CORS[CORS Policy]
            CSP[Content Security Policy]
        end
    end
    
    subgraph "🔐 Security Flow"
        UserRequest[User Request]
        AuthCheck[Authentication Check]
        AuthzCheck[Authorization Check]
        DataValidation[Data Validation]
        SecureResponse[Secure Response]
    end
    
    %% Flujo de seguridad
    UserRequest --> AuthCheck
    AuthCheck --> AuthzCheck
    AuthzCheck --> DataValidation
    DataValidation --> SecureResponse
    
    %% Implementación de capas
    AuthCheck --> NextAuthLayer
    AuthzCheck --> RouteProtection
    DataValidation --> InputValidation
    SecureResponse --> HTTPS
    
    %% Configuración específica
    subgraph "🔧 Security Configuration"
        AuthConfig["`NextAuth Config:
        - JWT Strategy
        - Secure Callbacks
        - CSRF Protection`"]
        
        CORSConfig["`CORS Configuration:
        - Origin: localhost:3000
        - Methods: GET, POST
        - Credentials: true`"]
        
        ValidationRules["`Validation Rules:
        - Email format
        - Password strength
        - Input sanitization`"]
    end
    
    NextAuthLayer -.-> AuthConfig
    CORS -.-> CORSConfig
    InputValidation -.-> ValidationRules
```

---

## 6. Arquitectura de Performance

```mermaid
graph TB
    subgraph "⚡ Performance Optimizations"
        subgraph "Frontend Optimizations"
            LazyLoading[Lazy Loading Components]
            CodeSplitting[Code Splitting]
            ImageOptimization[Image Optimization]
            Caching[Browser Caching]
        end
        
        subgraph "Backend Optimizations"
            APIResponseCache[API Response Caching]
            DatabaseIndexes[Database Indexes]
            QueryOptimization[Query Optimization]
            ConnectionPooling[Connection Pooling]
        end
        
        subgraph "Network Optimizations"
            CDNDelivery[CDN Delivery]
            Compression[Gzip Compression]
            HTTP2[HTTP/2 Support]
            EdgeCaching[Edge Caching]
        end
    end
    
    subgraph "📊 Performance Metrics"
        LCP[Largest Contentful Paint < 2.5s]
        FID[First Input Delay < 100ms]
        CLS[Cumulative Layout Shift < 0.1]
        TTFB[Time to First Byte < 800ms]
    end
    
    %% Relaciones de optimización
    LazyLoading --> LCP
    CodeSplitting --> LCP
    APIResponseCache --> TTFB
    CDNDelivery --> TTFB
    ImageOptimization --> CLS
    DatabaseIndexes --> FID
    
    %% Implementación específica
    subgraph "🎯 Current Implementation"
        NextJSOptimizations["`Next.js Built-in:
        - Automatic code splitting
        - Image optimization
        - Static generation
        - API route caching`"]
        
        PrismaOptimizations["`Prisma Optimizations:
        - Query batching
        - Connection pooling
        - Index usage
        - Query analysis`"]
    end
    
    CodeSplitting -.-> NextJSOptimizations
    QueryOptimization -.-> PrismaOptimizations
```

---

## 7. Diagrama de Dependencias

```mermaid
graph TB
    subgraph "🎨 Frontend Dependencies"
        React[React 18]
        NextJS[Next.js 14.2.16]
        TailwindCSS[Tailwind CSS]
        RadixUI[Radix UI]
    end
    
    subgraph "🔧 Backend Dependencies"
        NextAuth[NextAuth.js]
        Prisma[Prisma ORM]
        bcryptjs[bcryptjs]
        OpenAISDK[OpenAI SDK]
    end
    
    subgraph "🛠️ Development Dependencies"
        TypeScript[TypeScript]
        ESLint[ESLint]
        PostCSS[PostCSS]
        TailwindConfig[Tailwind Config]
    end
    
    subgraph "🏗️ Build Dependencies"
        NextConfig[next.config.mjs]
        TSConfig[tsconfig.json]
        ComponentsJSON[components.json]
        PackageJSON[package.json]
    end
    
    %% Dependencias principales
    NextJS --> React
    NextAuth --> NextJS
    Prisma --> NextJS
    TailwindCSS --> NextJS
    RadixUI --> React
    
    %% Dependencias de desarrollo
    TypeScript --> NextJS
    ESLint --> TypeScript
    PostCSS --> TailwindCSS
    
    %% Configuraciones
    NextConfig --> NextJS
    TSConfig --> TypeScript
    ComponentsJSON --> RadixUI
    PackageJSON --> NextJS
    
    %% Versiones específicas
    subgraph "📋 Version Matrix"
        Versions["`
        React: ^18
        Next.js: 14.2.16
        TypeScript: ^5
        Prisma: ^5.19.1
        NextAuth: ^4.24.8
        Tailwind: ^3.4.1
        OpenAI: ^4.67.3
        `"]
    end
```

Esta documentación arquitectónica proporciona una visión completa de cómo está estructurado el sistema MiniMagneto desde múltiples perspectivas, facilitando el mantenimiento, escalabilidad y comprensión del sistema para desarrolladores y stakeholders.