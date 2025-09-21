# Diagramas de Comportamiento del Sistema
## MiniMagneto - Análisis Dinámico

### Resumen
Este documento presenta los diagramas de comportamiento que muestran la interacción dinámica entre los componentes del sistema MiniMagneto, incluyendo diagramas de secuencia, estados, actividades y casos de uso.

---

## 1. Diagrama de Casos de Uso

### Actores del Sistema:
- **Candidato/Usuario**: Persona que busca empleo
- **Empresa**: Organización que publica empleos
- **Asistente IA**: Sistema automatizado de chat
- **Administrador**: Gestor del sistema

### Casos de Uso Principales:

```mermaid
graph TD
    %% Actores
    U[👤 Usuario/Candidato]
    E[🏢 Empresa]
    AI[🤖 Asistente IA]
    A[👨‍💼 Administrador]
    
    %% Sistema
    S[Sistema MiniMagneto]
    
    %% Casos de Uso Usuario
    U --> |registrarse| CU1[Registro Usuario]
    U --> |iniciar sesión| CU2[Autenticación]
    U --> |buscar empleos| CU3[Búsqueda Empleos]
    U --> |chatear con IA| CU4[Chat Asistente]
    U --> |dar feedback| CU5[Evaluar Empresa]
    
    %% Casos de Uso Empresa
    E --> |acceder dashboard| CU6[Dashboard Empresarial]
    E --> |ver estadísticas| CU7[Consultar Métricas]
    E --> |gestionar empleos| CU8[Gestión Empleos]
    
    %% Casos de Uso IA
    AI --> |responder consultas| CU9[Procesamiento Chat]
    AI --> |detectar feedback| CU10[Análisis Sentimientos]
    
    %% Casos de Uso Admin
    A --> |gestionar contenido| CU11[Administración]
    A --> |monitorear sistema| CU12[Supervisión]
    
    %% Relaciones con el sistema
    CU1 --> S
    CU2 --> S
    CU3 --> S
    CU4 --> S
    CU5 --> S
    CU6 --> S
    CU7 --> S
    CU8 --> S
    CU9 --> S
    CU10 --> S
    CU11 --> S
    CU12 --> S
```

---

## 2. Diagramas de Secuencia

### 2.1 Secuencia: Registro y Autenticación de Usuario

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant F as 🌐 Frontend
    participant API as ⚙️ API NextAuth
    participant DB as 🗄️ Base de Datos
    participant BC as 🔐 bcrypt
    
    Note over U,BC: Proceso de Registro
    U->>F: Completa formulario registro
    F->>API: POST /api/register {email, password, name}
    API->>DB: Verificar email único
    
    alt Email ya existe
        DB-->>API: Email duplicado
        API-->>F: Error 409 - Email existente
        F-->>U: Mostrar error
    else Email disponible
        API->>BC: Hash password
        BC-->>API: passwordHash
        API->>DB: INSERT User {email, passwordHash, name}
        DB-->>API: Usuario creado exitosamente
        API-->>F: 201 - Usuario registrado
        F-->>U: Registro exitoso
    end
    
    Note over U,BC: Proceso de Login
    U->>F: Ingresa credenciales
    F->>API: POST /api/auth/callback/credentials
    API->>DB: SELECT User WHERE email
    DB-->>API: Datos usuario
    API->>BC: Comparar password vs hash
    
    alt Credenciales válidas
        BC-->>API: Match exitoso
        API-->>F: Session token JWT
        F-->>U: Redirección a dashboard
    else Credenciales inválidas
        BC-->>API: Password incorrecto
        API-->>F: 401 - No autorizado
        F-->>U: Error de login
    end
```

### 2.2 Secuencia: Chat con IA y Feedback

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant CW as 💬 Chat Widget
    participant API as ⚙️ API Chat
    participant DB as 🗄️ Base de Datos
    participant AI as 🤖 OpenAI
    participant FD as 📊 Feedback Detector
    
    Note over U,FD: Conversación con Asistente IA
    U->>CW: Escribir mensaje + rating
    CW->>API: POST /api/chat {text, rating, company}
    
    API->>DB: Buscar/Crear ChatThread
    DB-->>API: threadId
    
    API->>FD: Analizar mensaje (keywords + rating)
    FD-->>API: isFeedback = true/false
    
    API->>DB: INSERT ChatMessage {text, feedback, rating, company}
    DB-->>API: Mensaje guardado
    
    API->>AI: POST /chat/completions {prompt, context}
    
    alt OpenAI responde exitosamente
        AI-->>API: Respuesta IA
        API->>DB: INSERT ChatMessage {sender: 'bot', text}
        DB-->>API: Respuesta guardada
        API-->>CW: {messages: [userMsg, botMsg]}
        CW-->>U: Mostrar conversación
    else Error en OpenAI
        AI-->>API: Error 429/401
        API->>DB: INSERT fallback message
        API-->>CW: Mensaje de error amigable
        CW-->>U: "Servicio temporalmente no disponible"
    end
    
    Note over U,FD: Actualización Dashboard (si es feedback)
    alt Si isFeedback = true
        API->>DB: Trigger actualización estadísticas
        DB-->>API: Stats actualizadas
    end
```

### 2.3 Secuencia: Dashboard Empresarial

```mermaid
sequenceDiagram
    participant E as 🏢 Empresa
    participant D as 📊 Dashboard
    participant AUTH as 🔐 Auth API
    participant FAPI as 📈 Feedback API
    participant SAPI as 📋 Stats API
    participant DB as 🗄️ Base de Datos
    
    Note over E,DB: Acceso al Dashboard Empresarial
    E->>D: Acceder /empresas
    D->>AUTH: Verificar sesión
    
    alt No autenticado
        AUTH-->>D: 401 - No autorizado
        D-->>E: Modal de login
        E->>AUTH: Credenciales empresa
        AUTH->>DB: Validar empresa
        DB-->>AUTH: Sesión válida
        AUTH-->>D: Token autorización
    end
    
    Note over E,DB: Carga de datos del dashboard
    par Cargar feedback en paralelo
        D->>FAPI: GET /api/feedback?company=EAFIT
        FAPI->>DB: SELECT ChatMessage WHERE feedback=true AND company='EAFIT'
        DB-->>FAPI: Lista de opiniones
        FAPI-->>D: {feedbacks: [...]}
    and Cargar estadísticas en paralelo
        D->>SAPI: GET /api/stats?company=EAFIT
        SAPI->>DB: SELECT ChatMessage, CompanyStats WHERE company='EAFIT'
        DB-->>SAPI: Datos agregados
        SAPI-->>D: {totalOpiniones, ratingPromedio, candidatos, vistas}
    end
    
    D-->>E: Renderizar dashboard completo
    
    Note over E,DB: Actualización en tiempo real
    loop Cada 30 segundos
        D->>FAPI: Polling nuevas opiniones
        FAPI->>DB: SELECT nuevos feedback
        alt Hay nuevos datos
            DB-->>FAPI: Nuevas opiniones
            FAPI-->>D: Datos actualizados
            D-->>E: Actualizar UI automáticamente
        end
    end
```

---

## 3. Diagramas de Estados

### 3.1 Estados del Usuario en el Sistema

```mermaid
stateDiagram-v2
    [*] --> Visitante
    
    Visitante --> Registrando: Completar formulario
    Registrando --> Visitante: Error validación
    Registrando --> NoAutenticado: Registro exitoso
    
    Visitante --> Autenticando: Login
    NoAutenticado --> Autenticando: Login
    
    Autenticando --> Visitante: Credenciales inválidas
    Autenticando --> Autenticado: Login exitoso
    
    Autenticado --> NavegandoEmpleos: Ver empleos
    Autenticado --> UsandoChat: Abrir chat
    Autenticado --> DandoFeedback: Calificar empresa
    
    NavegandoEmpleos --> Autenticado: Volver
    UsandoChat --> DandoFeedback: Enviar rating
    DandoFeedback --> UsandoChat: Continuar chat
    
    Autenticado --> NoAutenticado: Cerrar sesión
    
    NoAutenticado --> [*]: Salir aplicación
    Autenticado --> [*]: Salir aplicación
```

### 3.2 Estados del Chat y Mensajes

```mermaid
stateDiagram-v2
    [*] --> ChatInactivo
    
    ChatInactivo --> ChatAbierto: Usuario abre widget
    ChatAbierto --> ChatInactivo: Cerrar widget
    
    ChatAbierto --> EscribiendoMensaje: Usuario tipea
    EscribiendoMensaje --> ChatAbierto: Cancelar
    EscribiendoMensaje --> EnviandoMensaje: Enviar
    
    EnviandoMensaje --> ProcesandoIA: Mensaje enviado
    
    ProcesandoIA --> EsperandoRespuesta: Llamada OpenAI
    EsperandoRespuesta --> MostrandoRespuesta: Respuesta recibida
    EsperandoRespuesta --> ErrorIA: Fallo OpenAI
    
    ErrorIA --> MostrandoError: Mostrar fallback
    MostrandoError --> ChatAbierto: Error mostrado
    
    MostrandoRespuesta --> ChatAbierto: Conversación actualizada
    
    state ProcesandoIA {
        [*] --> DetectandoFeedback
        DetectandoFeedback --> EsFeedback: Keywords/Rating detectados
        DetectandoFeedback --> NoEsFeedback: Mensaje normal
        EsFeedback --> GuardandoFeedback: Marcar feedback=true
        NoEsFeedback --> GuardandoMensaje: Marcar feedback=false
        GuardandoFeedback --> [*]
        GuardandoMensaje --> [*]
    }
```

### 3.3 Estados del Dashboard Empresarial

```mermaid
stateDiagram-v2
    [*] --> DashboardNoAutenticado
    
    DashboardNoAutenticado --> Autenticando: Login empresa
    Autenticando --> DashboardNoAutenticado: Error auth
    Autenticando --> DashboardCargando: Auth exitosa
    
    DashboardCargando --> DashboardActivo: Datos cargados
    DashboardCargando --> DashboardError: Error carga
    
    DashboardError --> DashboardCargando: Reintentar
    
    DashboardActivo --> ViendoEstadisticas: Click métricas
    DashboardActivo --> ViendoOpiniones: Click feedback
    DashboardActivo --> FiltrandoDatos: Aplicar filtros
    
    ViendoEstadisticas --> DashboardActivo: Volver
    ViendoOpiniones --> DashboardActivo: Volver
    FiltrandoDatos --> DashboardActivo: Filtros aplicados
    
    state DashboardActivo {
        [*] --> MostrandoDatos
        MostrandoDatos --> ActualizandoDatos: Polling cada 30s
        ActualizandoDatos --> MostrandoDatos: Datos frescos
        ActualizandoDatos --> ErrorActualizacion: Fallo red
        ErrorActualizacion --> MostrandoDatos: Datos cached
    }
    
    DashboardActivo --> DashboardNoAutenticado: Logout
```

---

## 4. Diagrama de Actividades

### 4.1 Proceso Completo: Usuario Busca Empleo y Da Feedback

```mermaid
flowchart TD
    Start([🚀 Usuario inicia sesión]) --> CheckAuth{Usuario autenticado?}
    CheckAuth -->|No| Login[📝 Proceso de login]
    Login --> CheckAuth
    CheckAuth -->|Sí| NavJobs[🔍 Navegar empleos]
    
    NavJobs --> SelectJob{Encuentra empleo interesante?}
    SelectJob -->|No| NavJobs
    SelectJob -->|Sí| OpenChat[💬 Abrir chat sobre empleo]
    
    OpenChat --> AskQuestion[❓ Hacer pregunta al asistente]
    AskQuestion --> WaitResponse[⏳ Esperar respuesta IA]
    WaitResponse --> CheckSatisfied{Respuesta satisfactoria?}
    
    CheckSatisfied -->|No| AskQuestion
    CheckSatisfied -->|Sí| DecideFeedback{Quiere dar feedback?}
    
    DecideFeedback -->|No| EndPositive([✅ Fin - Sin feedback])
    DecideFeedback -->|Sí| SelectRating[⭐ Seleccionar rating 1-5]
    
    SelectRating --> TypeFeedback[💭 Escribir opinión]
    TypeFeedback --> SendFeedback[📤 Enviar mensaje con rating]
    
    SendFeedback --> ProcessFeedback[🔄 Sistema procesa feedback]
    ProcessFeedback --> SaveToDB[(💾 Guardar en base de datos)]
    SaveToDB --> UpdateStats[📊 Actualizar estadísticas empresa]
    UpdateStats --> NotifyDashboard[📢 Notificar dashboard empresarial]
    
    NotifyDashboard --> EndWithFeedback([✅ Fin - Feedback registrado])
    
    %% Flujo de error
    WaitResponse --> CheckError{Error en IA?}
    CheckError -->|Sí| ShowFallback[⚠️ Mostrar mensaje fallback]
    ShowFallback --> DecideFeedback
    CheckError -->|No| CheckSatisfied
```

### 4.2 Proceso Empresarial: Monitoreo de Feedback

```mermaid
flowchart TD
    StartEmp([🏢 Empresa accede dashboard]) --> AuthEmp[🔐 Autenticación empresarial]
    AuthEmp --> LoadDash[📊 Cargar dashboard]
    
    LoadDash --> parallel1{Carga paralela}
    parallel1 --> LoadFeedback[📝 Cargar opiniones]
    parallel1 --> LoadStats[📈 Cargar estadísticas]
    
    LoadFeedback --> FilterFeedback[🔍 Filtrar por empresa]
    LoadStats --> CalcMetrics[🧮 Calcular métricas]
    
    FilterFeedback --> DisplayFeedback[📋 Mostrar lista opiniones]
    CalcMetrics --> DisplayMetrics[📊 Mostrar KPIs]
    
    DisplayFeedback --> DashReady[✅ Dashboard listo]
    DisplayMetrics --> DashReady
    
    DashReady --> MonitorLoop{Monitoreo continuo}
    MonitorLoop --> CheckNew[🔍 Verificar nuevas opiniones]
    CheckNew --> HasNew{Hay nuevos datos?}
    
    HasNew -->|No| Wait30s[⏰ Esperar 30 segundos]
    Wait30s --> MonitorLoop
    
    HasNew -->|Sí| UpdateDisplay[🔄 Actualizar pantalla]
    UpdateDisplay --> ShowNotification[🔔 Notificar nueva opinión]
    ShowNotification --> MonitorLoop
    
    DashReady --> AnalyzeData{Empresa analiza datos}
    AnalyzeData --> TakeAction[💼 Tomar acciones mejora]
    TakeAction --> EndEmp([📈 Fin - Mejora continua])
```

---

## 5. Diagrama de Componentes (Arquitectura Dinámica)

```mermaid
graph TB
    %% Frontend Components
    subgraph "🌐 Frontend Layer"
        UI[React Components]
        ChatWidget[Chat Widget]
        Dashboard[Dashboard Empresarial]
        AuthModal[Modal Autenticación]
    end
    
    %% API Layer
    subgraph "⚙️ API Layer"
        NextAuth[NextAuth API]
        ChatAPI[Chat API]
        FeedbackAPI[Feedback API]
        StatsAPI[Stats API]
    end
    
    %% Business Logic
    subgraph "🧠 Business Logic"
        AuthLogic[Gestión Usuarios]
        ChatLogic[Procesamiento Chat]
        FeedbackLogic[Análisis Feedback]
        StatsLogic[Cálculo Estadísticas]
    end
    
    %% External Services
    subgraph "🌍 External Services"
        OpenAI[OpenAI API]
        NextAuthProviders[Providers Auth]
    end
    
    %% Data Layer
    subgraph "💾 Data Layer"
        Prisma[Prisma ORM]
        SQLite[(SQLite DB)]
    end
    
    %% Connections con flujo de datos
    UI <--> NextAuth
    ChatWidget <--> ChatAPI
    Dashboard <--> FeedbackAPI
    Dashboard <--> StatsAPI
    AuthModal <--> NextAuth
    
    NextAuth <--> AuthLogic
    ChatAPI <--> ChatLogic
    FeedbackAPI <--> FeedbackLogic
    StatsAPI <--> StatsLogic
    
    AuthLogic <--> Prisma
    ChatLogic <--> Prisma
    FeedbackLogic <--> Prisma
    StatsLogic <--> Prisma
    
    ChatLogic <--> OpenAI
    AuthLogic <--> NextAuthProviders
    
    Prisma <--> SQLite
    
    %% Flujo de datos real-time
    ChatLogic -.->|Real-time| FeedbackLogic
    FeedbackLogic -.->|Updates| StatsLogic
    StatsLogic -.->|Notifications| Dashboard
```

---

## 6. Patrones de Interacción

### 6.1 Patrón Observer (Dashboard en Tiempo Real)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Chat
    participant F as FeedbackService
    participant D as Dashboard
    participant E as Empresa
    
    Note over U,E: Patrón Observer para actualizaciones en tiempo real
    
    U->>C: Envía feedback con rating
    C->>F: Procesa y guarda feedback
    F->>F: Detecta nuevo feedback
    
    %% Notificación a observers
    F->>D: notify(newFeedback)
    D->>D: Actualizar estadísticas
    D->>E: Renderizar nueva opinión
    
    Note over F,E: El dashboard se actualiza automáticamente sin refresh
```

### 6.2 Patrón Request-Response con Fallback

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as ChatAPI
    participant AI as OpenAI
    participant FB as FallbackService
    
    U->>C: Mensaje de chat
    C->>AI: Procesar con IA
    
    alt OpenAI disponible
        AI-->>C: Respuesta exitosa
        C-->>U: Respuesta personalizada
    else OpenAI falla
        AI-->>C: Error 429/401
        C->>FB: Generar respuesta fallback
        FB-->>C: Respuesta predeterminada
        C-->>U: "Servicio temporalmente no disponible"
    end
```

---

## 7. Métricas de Comportamiento

### Tiempos de Respuesta Esperados:
- **Autenticación**: < 2 segundos
- **Chat con IA**: < 5 segundos  
- **Carga Dashboard**: < 3 segundos
- **Actualización tiempo real**: < 1 segundo

### Flujos Críticos:
1. **Registro → Login → Chat → Feedback**: Flujo principal usuario
2. **Dashboard → Monitoreo → Análisis**: Flujo principal empresa
3. **Error Handling**: Todos los puntos de falla tienen recuperación

### Puntos de Integración:
- **NextAuth ↔ Prisma**: Gestión sesiones
- **Chat API ↔ OpenAI**: Procesamiento IA
- **Feedback → Stats**: Actualización métricas
- **Frontend ↔ API**: Comunicación REST

Este modelo de comportamiento demuestra la robustez y escalabilidad del sistema MiniMagneto en sus interacciones dinámicas.