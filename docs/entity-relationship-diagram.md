# Vista Lógica - Diagrama Entidad-Relación
## Sistema MiniMagneto - Modelo de Datos

### Descripción del Sistema
MiniMagneto es una plataforma de empleos con funcionalidades de:
- Gestión de usuarios y autenticación
- Publicación y búsqueda de empleos
- Chat con IA para asistencia
- Sistema de feedback y opiniones empresariales
- Dashboard empresarial con estadísticas

---

## Entidades y Atributos

### 1. **User** (Usuario)
**Descripción**: Almacena información de los usuarios registrados en la plataforma

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único del usuario |
| name | String | Nullable | Nombre completo del usuario |
| **email** | String | UNIQUE, NOT NULL | Correo electrónico (login) |
| passwordHash | String | NOT NULL | Hash de la contraseña |
| image | String | Nullable | URL de la imagen de perfil |
| createdAt | DateTime | DEFAULT NOW | Fecha de registro |
| updatedAt | DateTime | AUTO UPDATE | Última actualización |

### 2. **Job** (Empleo)
**Descripción**: Representa las ofertas de trabajo publicadas

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único del empleo |
| **title** | String | NOT NULL | Título del puesto |
| **company** | String | NOT NULL | Nombre de la empresa |
| location | String | Nullable | Ubicación del trabajo |
| **description** | String | NOT NULL | Descripción detallada |
| createdAt | DateTime | DEFAULT NOW | Fecha de publicación |
| updatedAt | DateTime | AUTO UPDATE | Última actualización |

### 3. **ChatThread** (Hilo de Chat)
**Descripción**: Sesiones de conversación entre usuarios y el asistente IA

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único del hilo |
| userId | String | FK, Nullable | Usuario propietario del chat |
| jobId | String | FK, Nullable | Empleo relacionado (opcional) |
| title | String | Nullable | Título/tema del chat |
| createdAt | DateTime | DEFAULT NOW | Inicio de la conversación |

### 4. **ChatMessage** (Mensaje de Chat)
**Descripción**: Mensajes individuales dentro de los hilos de chat

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único del mensaje |
| **threadId** | String | FK, NOT NULL | Hilo al que pertenece |
| **sender** | String | NOT NULL | "user" o "bot" |
| **text** | String | NOT NULL | Contenido del mensaje |
| createdAt | DateTime | DEFAULT NOW | Timestamp del mensaje |
| feedback | Boolean | DEFAULT FALSE | Es un mensaje de feedback |
| rating | Integer | Nullable | Calificación (1-5 estrellas) |
| company | String | Nullable | Empresa asociada al feedback |

### 5. **PageContent** (Contenido de Página)
**Descripción**: Contenido web scrapeado para entrenar la IA

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único |
| **source** | String | NOT NULL | Fuente del contenido |
| **url** | String | NOT NULL | URL de origen |
| title | String | Nullable | Título de la página |
| **content** | String | NOT NULL | Contenido de texto |
| createdAt | DateTime | DEFAULT NOW | Fecha de extracción |

### 6. **CompanyStats** (Estadísticas de Empresa)
**Descripción**: Métricas y estadísticas por empresa

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| **id** | String | PK, CUID | Identificador único |
| **company** | String | UNIQUE, NOT NULL | Nombre de la empresa |
| **candidatesActive** | Integer | NOT NULL | Candidatos activos |
| **companyViews** | Integer | NOT NULL | Vistas de la empresa |
| updatedAt | DateTime | AUTO UPDATE | Última actualización |

---

## Relaciones

### Relaciones 1:N (Uno a Muchos)

1. **User → ChatThread**
   - Un usuario puede tener múltiples hilos de chat
   - `User.id → ChatThread.userId`
   - Cardinalidad: 1:N (opcional)

2. **Job → ChatThread**
   - Un empleo puede estar relacionado con múltiples chats
   - `Job.id → ChatThread.jobId`
   - Cardinalidad: 1:N (opcional)

3. **ChatThread → ChatMessage**
   - Un hilo contiene múltiples mensajes
   - `ChatThread.id → ChatMessage.threadId`
   - Cardinalidad: 1:N (obligatorio)

### Relaciones Implícitas

4. **Company (String) → Job**
   - Una empresa puede tener múltiples empleos
   - Relación por campo `company` (no FK formal)

5. **Company (String) → ChatMessage**
   - Una empresa puede recibir múltiples feedbacks
   - Relación por campo `company` (no FK formal)

6. **Company (String) → CompanyStats**
   - Una empresa tiene una única entrada de estadísticas
   - Relación por campo `company` (UNIQUE)

---

## Diagrama Visual

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │       Job       │     │  CompanyStats   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ 🔑 id (PK)      │     │ 🔑 id (PK)      │     │ 🔑 id (PK)      │
│ 📧 email (UQ)   │     │ 📝 title        │     │ 🏢 company (UQ) │
│ 👤 name         │     │ 🏢 company      │     │ 👥 candidatesAct│
│ 🔒 passwordHash │     │ 📍 location     │     │ 👁️ companyViews │
│ 🖼️ image        │     │ 📄 description  │     │ ⏰ updatedAt    │
│ ⏰ createdAt    │     │ ⏰ createdAt    │     └─────────────────┘
│ ⏰ updatedAt    │     │ ⏰ updatedAt    │              │
└─────────────────┘     └─────────────────┘              │
         │1                       │1                     │
         │                        │                      │(company)
         │                        │                      │
         │N                       │N                     │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   ChatThread    │     │   ChatMessage   │     │   PageContent   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ 🔑 id (PK)      │────▶│ 🔑 id (PK)      │     │ 🔑 id (PK)      │
│ 🔗 userId (FK)  │   1 │ 🔗 threadId(FK) │     │ 🌐 source       │
│ 🔗 jobId (FK)   │     │ 👤 sender       │     │ 🔗 url          │
│ 📝 title        │   N │ 💬 text         │     │ 📝 title        │
│ ⏰ createdAt    │     │ ⏰ createdAt    │     │ 📄 content      │
└─────────────────┘     │ ⭐ feedback     │     │ ⏰ createdAt    │
                        │ ⭐ rating       │     └─────────────────┘
                        │ 🏢 company      │
                        └─────────────────┘
```

## Flujo de Datos Principal

### 1. **Registro y Autenticación**
```
User Registration → User.create() → NextAuth Session
```

### 2. **Navegación de Empleos**
```
Job.findMany() → Display Jobs → User Selection
```

### 3. **Interacción de Chat**
```
User Message → ChatThread.create() → ChatMessage.create()
↓
AI Processing → OpenAI API → Bot Response
↓
ChatMessage.create() → Display Response
```

### 4. **Sistema de Feedback**
```
User Rating → ChatMessage.create(feedback=true, rating, company)
↓
Dashboard Query → Aggregate Stats → Display Metrics
```

### 5. **Dashboard Empresarial**
```
Company Filter → ChatMessage.findMany(feedback=true, company)
↓
Statistics → CompanyStats.findUnique() → Render Dashboard
```

---

## Índices Recomendados

### Índices de Rendimiento
```sql
-- Para autenticación rápida
CREATE INDEX idx_user_email ON User(email);

-- Para filtros de empresa
CREATE INDEX idx_job_company ON Job(company);
CREATE INDEX idx_chatmessage_company_feedback ON ChatMessage(company, feedback);

-- Para consultas de chat
CREATE INDEX idx_chatmessage_thread_created ON ChatMessage(threadId, createdAt);
CREATE INDEX idx_chatthread_user ON ChatThread(userId);

-- Para estadísticas
CREATE INDEX idx_company_stats ON CompanyStats(company);
```

### Integridad Referencial
- ✅ User.id → ChatThread.userId (CASCADE DELETE)
- ✅ Job.id → ChatThread.jobId (SET NULL)
- ✅ ChatThread.id → ChatMessage.threadId (CASCADE DELETE)

---

## Consideraciones de Diseño

### Fortalezas del Modelo
1. **Escalabilidad**: Estructura preparada para crecimiento
2. **Flexibilidad**: Campos opcionales para diferentes casos de uso
3. **Trazabilidad**: Timestamps completos para auditoría
4. **Performance**: Relaciones optimizadas para consultas frecuentes

### Áreas de Mejora Potencial
1. **Normalización**: El campo `company` podría ser una entidad separada
2. **Historización**: Versioning para cambios en Job/User
3. **Archivado**: Soft delete para datos históricos
4. **Caching**: Consideraciones para datos frecuentemente accedidos

Este modelo soporta eficientemente todas las funcionalidades actuales del sistema MiniMagneto.