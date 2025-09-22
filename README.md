# MagnetoPoyect - MiniMagneto

**Solución del Reto 3 de Magneto365**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/junio14245252626236s-projects/v0-magneto365-page-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UatbtJrc1lF)

## 📋 Descripción del Proyecto

MiniMagneto es una plataforma web completa que integra:
- **Sistema de chat con Inteligencia Artificial**
- **Dashboard de estadísticas empresariales** 
- **Sistema de autenticación con NextAuth**
- **Base de datos robusta con 6 entidades**
- **Documentación técnica profesional**

## 🛠️ Tecnologías Implementadas

- **Frontend:** Next.js 14, React 18, TailwindCSS, Radix UI
- **Backend:** API Routes, NextAuth, Prisma ORM
- **Base de Datos:** SQLite (dev) / PostgreSQL (prod)
- **IA:** OpenAI GPT Integration
- **Deploy:** Vercel
- **Documentación:** Comprehensive technical analysis

## 🚀 Instalación y Configuración

### 1. Configuración del Entorno
```bash
# Clonar repositorio
git clone https://github.com/junio14245252626236/MagnetoPoyect.git
cd MagnetoPoyect

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu NEXTAUTH_SECRET
```

### 2. Base de Datos
```bash
# Aplicar migraciones
npx prisma migrate dev

# Explorar datos (opcional)
npx prisma studio
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
# Abrir http://localhost:3000
```

## 📊 APIs Disponibles

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `GET /api/auth/session` - Obtener sesión

### Empleos
- `GET /api/jobs` - Listar empleos
- `POST /api/jobs` - Crear empleo: `{ title, company, location?, description }`

### Chat IA
- `POST /api/chat` - Chat: `{ text, threadId?, jobId? }` → `{ threadId, messages }`

### Feedback y Estadísticas
- `GET /api/feedback?company=EMPRESA` - Obtener opiniones
- `POST /api/feedback` - Crear opinión
- `GET /api/stats?company=EMPRESA` - Estadísticas empresariales

## 📚 Documentación Técnica

El proyecto incluye documentación completa en `/docs/`:
- **Entity-Relationship Diagram** - Modelo de base de datos
- **Architecture Diagrams** - Arquitectura del sistema
- **Behavior Diagrams** - Diagramas de secuencia y estados
- **Data Flow Diagrams** - Flujo de datos (DFD)
- **Implementation Justification** - Justificación arquitectónica

## 🎯 Características Principales

### ✅ Sistema de Chat IA
- Integración con OpenAI GPT
- Hilos de conversación persistentes
- Detección automática de feedback
- Manejo de errores y fallbacks

### ✅ Dashboard Empresarial
- Estadísticas en tiempo real
- Filtrado por empresa
- Métricas de satisfacción
- Visualización de datos

### ✅ Autenticación Segura
- NextAuth con credenciales
- Sesiones persistentes
- Protección de rutas
- Gestión de usuarios

### ✅ Base de Datos Robusta
- 6 entidades principales
- 8 migraciones completadas
- Relaciones bien definidas
- Scripts de automatización

## 🏗️ Arquitectura del Sistema

```
MiniMagneto/
├── app/                 # Next.js App Router
│   ├── api/            # Backend APIs
│   ├── empleos/        # Empleos pages
│   └── empresas/       # Empresas pages
├── components/         # React components
├── lib/               # Utilities
├── prisma/            # Database schema & migrations
├── scripts/           # Automation scripts
└── docs/              # Technical documentation
```

## 🚀 Deployment

**Producción:** [Vercel Deployment](https://vercel.com/junio14245252626236s-projects/v0-magneto365-page-clone)

## 👨‍💻 Autor

**Desarrollador:** EmiltonMenaA  
**Email:** emenaa1@eafit.edu.co  
**Institución:** Universidad EAFIT  
**Repositorio:** junio14245252626236/MagnetoPoyect

---

*Proyecto académico desarrollado para demostrar competencias en desarrollo web full-stack y documentación técnica profesional.*
