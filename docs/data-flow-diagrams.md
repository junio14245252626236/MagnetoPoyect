# Diagramas de Flujo de Datos (DFD)
## Sistema MiniMagneto

### Introducción
Los Diagramas de Flujo de Datos (Data Flow Diagrams) muestran cómo la información se mueve a través del sistema MiniMagneto, desde su entrada hasta su almacenamiento y procesamiento.

---

## DFD Nivel 0 - Diagrama de Contexto

```mermaid
flowchart TD
    %% Entidades Externas
    Usuario([👤 Usuario/Candidato])
    Empresa([🏢 Empresa])
    OpenAI([🤖 OpenAI API])
    
    %% Sistema Central
    Sistema[🎯 Sistema MiniMagneto]
    
    %% Flujos de datos hacia el sistema
    Usuario -->|"D1: Datos registro<br/>D2: Credenciales login<br/>D3: Mensajes chat<br/>D4: Feedback ratings"| Sistema
    Empresa -->|"D5: Credenciales empresa<br/>D6: Consultas dashboard"| Sistema
    OpenAI -->|"D7: Respuestas IA<br/>D8: Estado servicios"| Sistema
    
    %% Flujos de datos desde el sistema
    Sistema -->|"D9: Confirmación registro<br/>D10: Sesión autenticada<br/>D11: Lista empleos<br/>D12: Respuestas chat"| Usuario
    Sistema -->|"D13: Dashboard estadísticas<br/>D14: Lista feedback<br/>D15: Métricas tiempo real"| Empresa
    Sistema -->|"D16: Prompts contextuales<br/>D17: Requests procesamiento"| OpenAI
    
    %% Estilos
    classDef external fill:#e1f5fe
    classDef system fill:#f3e5f5
    
    class Usuario,Empresa,OpenAI external
    class Sistema system
```

---

## DFD Nivel 1 - Procesos Principales

```mermaid
flowchart TD
    %% Entidades Externas
    Usuario([👤 Usuario])
    Empresa([🏢 Empresa])
    OpenAI([🤖 OpenAI])
    
    %% Procesos del Sistema
    P1[1.0<br/>Gestión<br/>Usuarios]
    P2[2.0<br/>Procesamiento<br/>Chat]
    P3[3.0<br/>Análisis<br/>Feedback]
    P4[4.0<br/>Generación<br/>Estadísticas]
    P5[5.0<br/>Dashboard<br/>Empresarial]
    
    %% Almacenes de Datos
    D1[(D1: Usuarios)]
    D2[(D2: ChatThreads)]
    D3[(D3: ChatMessages)]
    D4[(D4: Jobs)]
    D5[(D5: PageContent)]
    D6[(D6: CompanyStats)]
    
    %% Flujos Usuario → Procesos
    Usuario -->|"credenciales,<br/>datos personales"| P1
    Usuario -->|"mensajes,<br/>ratings"| P2
    
    %% Flujos Empresa → Procesos
    Empresa -->|"auth empresa"| P1
    Empresa -->|"solicitudes<br/>dashboard"| P5
    
    %% Flujos OpenAI
    P2 <-->|"prompts /<br/>respuestas"| OpenAI
    
    %% Flujos entre Procesos
    P1 -->|"usuario<br/>autenticado"| P2
    P2 -->|"feedback<br/>detectado"| P3
    P3 -->|"métricas<br/>feedback"| P4
    P4 -->|"estadísticas<br/>actualizadas"| P5
    
    %% Flujos Procesos → Almacenes
    P1 <--> D1
    P2 <--> D2
    P2 <--> D3
    P2 <--> D4
    P3 <--> D3
    P4 <--> D6
    P5 <--> D6
    P5 <--> D3
    
    %% Flujos Procesos → Usuario/Empresa
    P1 -->|"sesión válida,<br/>errores auth"| Usuario
    P2 -->|"respuestas chat,<br/>confirmaciones"| Usuario
    P5 -->|"dashboard datos,<br/>métricas"| Empresa
    
    %% Estilos
    classDef process fill:#fff3e0
    classDef datastore fill:#e8f5e8
    classDef external fill:#e1f5fe
    
    class P1,P2,P3,P4,P5 process
    class D1,D2,D3,D4,D5,D6 datastore
    class Usuario,Empresa,OpenAI external
```

---

## DFD Nivel 2 - Detalle del Procesamiento de Chat

```mermaid
flowchart TD
    %% Entidades Externas
    Usuario([👤 Usuario])
    OpenAI([🤖 OpenAI])
    
    %% Subprocesos del Chat
    P21[2.1<br/>Validar<br/>Mensaje]
    P22[2.2<br/>Crear/Buscar<br/>Thread]
    P23[2.3<br/>Detectar<br/>Feedback]
    P24[2.4<br/>Procesar<br/>con IA]
    P25[2.5<br/>Guardar<br/>Conversación]
    
    %% Almacenes
    D2[(D2: ChatThreads)]
    D3[(D3: ChatMessages)]
    D1[(D1: Users)]
    
    %% Flujo principal
    Usuario -->|"mensaje + rating<br/>+ company"| P21
    P21 -->|"mensaje<br/>validado"| P22
    P22 -->|"threadId<br/>existente/nuevo"| P23
    P23 -->|"mensaje +<br/>flag feedback"| P24
    P24 -->|"mensaje usuario +<br/>respuesta IA"| P25
    P25 -->|"conversación<br/>completa"| Usuario
    
    %% Interacciones con almacenes
    P22 <--> D2
    P22 <--> D1
    P25 <--> D3
    
    %% Interacción con IA
    P24 <-->|"prompt /<br/>respuesta"| OpenAI
    
    %% Flujo de datos internos
    P21 -->|"datos sesión"| D1
    P23 -->|"feedback<br/>detectado"| AnalisisFeedback[Proceso 3.0]
    
    %% Detalles de cada subproceso
    subgraph "Detalle P2.3 - Detección Feedback"
        P231[Analizar Keywords]
        P232[Verificar Rating]
        P233[Clasificar Mensaje]
        
        P231 --> P233
        P232 --> P233
    end
    
    P23 --> P231
    P23 --> P232
    
    %% Estilos
    classDef subprocess fill:#fff8e1
    classDef datastore fill:#e8f5e8
    classDef external fill:#e1f5fe
    classDef detail fill:#fce4ec
    
    class P21,P22,P23,P24,P25 subprocess
    class P231,P232,P233 detail
    class D1,D2,D3 datastore
    class Usuario,OpenAI external
```

---

## DFD Nivel 2 - Detalle del Dashboard Empresarial

```mermaid
flowchart TD
    %% Entidades Externas
    Empresa([🏢 Empresa])
    
    %% Subprocesos Dashboard
    P51[5.1<br/>Autenticar<br/>Empresa]
    P52[5.2<br/>Cargar<br/>Feedback]
    P53[5.3<br/>Calcular<br/>Métricas]
    P54[5.4<br/>Formatear<br/>Dashboard]
    P55[5.5<br/>Monitoreo<br/>Tiempo Real]
    
    %% Almacenes
    D1[(D1: Users)]
    D3[(D3: ChatMessages)]
    D6[(D6: CompanyStats)]
    
    %% Flujo principal
    Empresa -->|"credenciales<br/>empresa"| P51
    P51 -->|"sesión<br/>válida"| P52
    P51 -->|"sesión<br/>válida"| P53
    
    %% Carga paralela de datos
    P52 -->|"lista feedback<br/>empresa"| P54
    P53 -->|"métricas<br/>calculadas"| P54
    
    P54 -->|"dashboard<br/>formateado"| P55
    P55 -->|"datos tiempo<br/>real"| Empresa
    
    %% Interacciones con almacenes
    P51 <--> D1
    P52 <--> D3
    P53 <--> D3
    P53 <--> D6
    
    %% Bucle de actualización
    P55 -.->|"polling cada<br/>30 segundos"| P52
    P55 -.->|"polling cada<br/>30 segundos"| P53
    
    %% Detalles subprocesos
    subgraph "Detalle P5.3 - Cálculo Métricas"
        P531[Contar Opiniones]
        P532[Calcular Rating Promedio]
        P533[Contar Candidatos Únicos]
        P534[Calcular Vistas]
        
        P531 --> P534
        P532 --> P534
        P533 --> P534
    end
    
    P53 --> P531
    P53 --> P532
    P53 --> P533
    
    %% Estilos
    classDef subprocess fill:#e3f2fd
    classDef datastore fill:#e8f5e8
    classDef external fill:#e1f5fe
    classDef detail fill:#f1f8e9
    classDef realtime fill:#fff3e0,stroke-dasharray: 5 5
    
    class P51,P52,P53,P54,P55 subprocess
    class P531,P532,P533,P534 detail
    class D1,D3,D6 datastore
    class Empresa external
    class P55 realtime
```

---

## Matriz de Flujos de Datos

### Tabla de Flujos Principales

| ID | Nombre | Origen | Destino | Descripción | Frecuencia |
|----|--------|--------|---------|-------------|------------|
| D1 | Datos Registro | Usuario | P1.0 Gestión Usuarios | Email, password, nombre | Baja |
| D2 | Credenciales Login | Usuario | P1.0 Gestión Usuarios | Email, password para auth | Alta |
| D3 | Mensajes Chat | Usuario | P2.0 Procesamiento Chat | Texto, rating, company | Muy Alta |
| D4 | Feedback Ratings | Usuario | P2.0 Procesamiento Chat | Rating 1-5 + opinión | Media |
| D5 | Auth Empresa | Empresa | P1.0 Gestión Usuarios | Credenciales empresariales | Media |
| D6 | Consultas Dashboard | Empresa | P5.0 Dashboard | Solicitudes de datos | Alta |
| D7 | Respuestas IA | OpenAI | P2.0 Procesamiento Chat | Texto respuesta generada | Muy Alta |
| D8 | Estado Servicios | OpenAI | P2.0 Procesamiento Chat | Códigos error, disponibilidad | Baja |
| D9 | Confirmación Registro | P1.0 | Usuario | Éxito/error registro | Baja |
| D10 | Sesión Autenticada | P1.0 | Usuario | Token JWT, datos sesión | Alta |
| D11 | Lista Empleos | P2.0 | Usuario | Empleos filtrados por empresa | Media |
| D12 | Respuestas Chat | P2.0 | Usuario | Conversación completa | Muy Alta |
| D13 | Dashboard Estadísticas | P5.0 | Empresa | KPIs, métricas agregadas | Alta |
| D14 | Lista Feedback | P5.0 | Empresa | Opiniones de candidatos | Alta |
| D15 | Métricas Tiempo Real | P5.0 | Empresa | Actualizaciones live | Muy Alta |
| D16 | Prompts Contextuales | P2.0 | OpenAI | Contexto para IA | Muy Alta |
| D17 | Requests Procesamiento | P2.0 | OpenAI | Solicitudes de completado | Muy Alta |

### Volúmenes de Datos Estimados

```mermaid
graph LR
    subgraph "📊 Volúmenes Diarios Estimados"
        A[Registros Usuarios: 50]
        B[Logins: 500]
        C[Mensajes Chat: 2,000]
        D[Feedback Ratings: 200]
        E[Consultas Dashboard: 1,000]
        F[Actualizaciones Stats: 200]
    end
    
    subgraph "🔄 Picos de Carga"
        G[Horario Laboral: 9-18h]
        H[Lunes-Viernes: 80%]
        I[Fines de Semana: 20%]
    end
```

---

## Análisis de Transformaciones de Datos

### 1. Transformación de Mensajes a Feedback

```mermaid
flowchart LR
    Input["`**Input:**
    • Texto: 'EAFIT es excelente'
    • Rating: 5
    • Company: 'EAFIT'
    • UserId: 'user123'`"]
    
    Process["`**Procesamiento:**
    1. Detectar keywords positivas
    2. Validar rating > 0
    3. Marcar feedback = true
    4. Asociar con empresa`"]
    
    Output["`**Output:**
    • ChatMessage con feedback=true
    • Rating asociado a empresa
    • Trigger actualización stats`"]
    
    Input --> Process --> Output
```

### 2. Transformación de Datos a Estadísticas

```mermaid
flowchart LR
    RawData["`**Datos Crudos:**
    • 50 mensajes feedback
    • Ratings: [5,4,5,3,4]
    • Usuarios únicos: 12
    • Empresa: 'EAFIT'`"]
    
    Aggregation["`**Agregación:**
    • COUNT(*) WHERE feedback=true
    • AVG(rating) GROUP BY company
    • COUNT(DISTINCT userId)
    • SUM(pageViews)`"]
    
    Dashboard["`**Dashboard:**
    • Total Opiniones: 50
    • Rating Promedio: 4.2
    • Candidatos: 12
    • Vistas: 1,250`"]
    
    RawData --> Aggregation --> Dashboard
```

### 3. Flujo de Datos en Tiempo Real

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Chat
    participant DB as Base Datos
    participant D as Dashboard
    participant E as Empresa
    
    Note over U,E: Flujo de datos en tiempo real
    U->>C: Nuevo mensaje con rating
    C->>DB: INSERT ChatMessage (feedback=true)
    DB->>DB: UPDATE CompanyStats automático
    
    par Polling Dashboard
        D->>DB: SELECT nuevos feedback cada 30s
        DB-->>D: Lista actualizada
        D->>E: Actualizar UI automáticamente
    end
    
    Note over D,E: Dashboard se actualiza sin refresh manual
```

---

## Diccionario de Datos

### Elementos de Datos Principales

| Elemento | Tipo | Formato | Rango/Validación | Descripción |
|----------|------|---------|------------------|-------------|
| userId | String | UUID v4 | 36 caracteres | Identificador único usuario |
| email | String | Email RFC | 5-100 caracteres | Email válido único |
| password | String | Hash bcrypt | 60 caracteres fijos | Password hasheado |
| threadId | String | UUID v4 | 36 caracteres | Identificador conversación |
| messageText | Text | UTF-8 | 1-2000 caracteres | Contenido mensaje |
| rating | Integer | Numérico | 1-5 | Calificación usuario |
| company | String | Alfanumérico | 2-50 caracteres | Nombre empresa |
| feedback | Boolean | true/false | 0 o 1 | Flag es feedback |
| createdAt | DateTime | ISO 8601 | Timestamp válido | Fecha creación |
| ratingPromedio | Float | Decimal | 1.0-5.0 | Rating calculado |

### Flujos de Transformación de Datos

1. **Password → Hash**: bcrypt(password, 12) → passwordHash
2. **Message → Feedback**: keywords + rating → feedback flag
3. **Individual Ratings → Average**: SUM(ratings)/COUNT(*) → ratingPromedio
4. **Raw Messages → Dashboard**: GROUP BY company → estadísticas agregadas

Este análisis de flujo de datos demuestra cómo la información se procesa eficientemente a través del sistema MiniMagneto, desde la entrada del usuario hasta las métricas empresariales.