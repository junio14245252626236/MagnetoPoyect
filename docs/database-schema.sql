-- =====================================================
-- MiniMagneto Database Schema
-- Sistema de Empleos con Chat IA y Dashboard Empresarial
-- =====================================================

-- Configuración de base de datos
-- Database: SQLite
-- ORM: Prisma

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla: User (Usuarios del sistema)
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,           -- CUID generado
    "name" TEXT,                              -- Nombre completo (opcional)
    "email" TEXT NOT NULL UNIQUE,            -- Email único para login
    "passwordHash" TEXT NOT NULL,            -- Hash bcrypt de contraseña
    "image" TEXT,                            -- URL imagen perfil (opcional)
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabla: Job (Ofertas de empleo)
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,          -- CUID generado
    "title" TEXT NOT NULL,                   -- Título del puesto
    "company" TEXT NOT NULL,                 -- Nombre de la empresa
    "location" TEXT,                         -- Ubicación (opcional)
    "description" TEXT NOT NULL,             -- Descripción detallada
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabla: ChatThread (Hilos de conversación)
CREATE TABLE "ChatThread" (
    "id" TEXT NOT NULL PRIMARY KEY,          -- CUID generado
    "userId" TEXT,                           -- FK a User (opcional)
    "jobId" TEXT,                            -- FK a Job (opcional)
    "title" TEXT,                            -- Título del chat (opcional)
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: ChatMessage (Mensajes individuales)
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,          -- CUID generado
    "threadId" TEXT NOT NULL,                -- FK a ChatThread
    "sender" TEXT NOT NULL,                  -- 'user' | 'bot'
    "text" TEXT NOT NULL,                    -- Contenido del mensaje
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback" BOOLEAN NOT NULL DEFAULT false, -- Es mensaje de feedback
    "rating" INTEGER,                        -- Calificación 1-5 (opcional)
    "company" TEXT,                          -- Empresa asociada (opcional)
    
    -- Clave foránea
    FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: PageContent (Contenido web para entrenar IA)
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,          -- CUID generado
    "source" TEXT NOT NULL,                  -- Fuente del contenido
    "url" TEXT NOT NULL,                     -- URL de origen
    "title" TEXT,                            -- Título de la página
    "content" TEXT NOT NULL,                 -- Contenido extraído
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: CompanyStats (Estadísticas por empresa)
CREATE TABLE "CompanyStats" (
    "id" TEXT NOT NULL PRIMARY KEY,          -- CUID generado
    "company" TEXT NOT NULL UNIQUE,          -- Nombre de empresa (único)
    "candidatesActive" INTEGER NOT NULL,     -- Candidatos activos
    "companyViews" INTEGER NOT NULL,         -- Vistas de la empresa
    "updatedAt" DATETIME NOT NULL
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para autenticación
CREATE INDEX "User_email_key" ON "User"("email");

-- Índices para consultas de empleos
CREATE INDEX "idx_job_company" ON "Job"("company");
CREATE INDEX "idx_job_created" ON "Job"("createdAt" DESC);

-- Índices para sistema de chat
CREATE INDEX "idx_chatthread_user" ON "ChatThread"("userId");
CREATE INDEX "idx_chatthread_job" ON "ChatThread"("jobId");
CREATE INDEX "idx_chatmessage_thread" ON "ChatMessage"("threadId");
CREATE INDEX "idx_chatmessage_created" ON "ChatMessage"("createdAt" DESC);

-- Índices para sistema de feedback
CREATE INDEX "idx_chatmessage_feedback" ON "ChatMessage"("feedback") WHERE "feedback" = true;
CREATE INDEX "idx_chatmessage_company_feedback" ON "ChatMessage"("company", "feedback");
CREATE INDEX "idx_chatmessage_rating" ON "ChatMessage"("rating") WHERE "rating" IS NOT NULL;

-- Índices para estadísticas
CREATE INDEX "CompanyStats_company_key" ON "CompanyStats"("company");

-- Índices para contenido web
CREATE INDEX "idx_pagecontent_source" ON "PageContent"("source");

-- =====================================================
-- CONSTRAINTS Y VALIDACIONES
-- =====================================================

-- Validación de email (básica - aplicación maneja validación completa)
-- Rating debe estar entre 1 y 5
-- Sender debe ser 'user' o 'bot'

-- =====================================================
-- TRIGGERS PARA AUDITORÍA (Simulados para SQLite)
-- =====================================================

-- Trigger para actualizar updatedAt en User
CREATE TRIGGER "update_user_updated_at"
    AFTER UPDATE ON "User"
    FOR EACH ROW
    BEGIN
        UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

-- Trigger para actualizar updatedAt en Job
CREATE TRIGGER "update_job_updated_at"
    AFTER UPDATE ON "Job"
    FOR EACH ROW
    BEGIN
        UPDATE "Job" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

-- Trigger para actualizar updatedAt en CompanyStats
CREATE TRIGGER "update_companystats_updated_at"
    AFTER UPDATE ON "CompanyStats"
    FOR EACH ROW
    BEGIN
        UPDATE "CompanyStats" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

-- =====================================================
-- VISTAS ÚTILES PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista: Feedback con información de empresa
CREATE VIEW "v_company_feedback" AS
SELECT 
    cm."id",
    cm."text",
    cm."rating",
    cm."company",
    cm."createdAt",
    ct."userId",
    u."name" as "userName",
    u."email" as "userEmail"
FROM "ChatMessage" cm
LEFT JOIN "ChatThread" ct ON cm."threadId" = ct."id"
LEFT JOIN "User" u ON ct."userId" = u."id"
WHERE cm."feedback" = true;

-- Vista: Estadísticas de feedback por empresa
CREATE VIEW "v_company_feedback_stats" AS
SELECT 
    "company",
    COUNT(*) as "totalFeedbacks",
    AVG(CAST("rating" AS FLOAT)) as "avgRating",
    COUNT(CASE WHEN "rating" >= 4 THEN 1 END) as "positiveRatings",
    MIN("createdAt") as "firstFeedback",
    MAX("createdAt") as "lastFeedback"
FROM "ChatMessage"
WHERE "feedback" = true 
  AND "company" IS NOT NULL
  AND "rating" IS NOT NULL
GROUP BY "company";

-- Vista: Actividad de chat por usuario
CREATE VIEW "v_user_chat_activity" AS
SELECT 
    u."id" as "userId",
    u."name",
    u."email",
    COUNT(DISTINCT ct."id") as "totalThreads",
    COUNT(cm."id") as "totalMessages",
    COUNT(CASE WHEN cm."feedback" = true THEN 1 END) as "feedbackCount",
    MAX(cm."createdAt") as "lastActivity"
FROM "User" u
LEFT JOIN "ChatThread" ct ON u."id" = ct."userId"
LEFT JOIN "ChatMessage" cm ON ct."id" = cm."threadId"
GROUP BY u."id", u."name", u."email";

-- =====================================================
-- DATOS DE EJEMPLO PARA TESTING
-- =====================================================

-- Insertar empresa de ejemplo
INSERT INTO "CompanyStats" ("id", "company", "candidatesActive", "companyViews", "updatedAt")
VALUES ('comp_eafit_001', 'EAFIT', 2847, 15420, CURRENT_TIMESTAMP);

-- Insertar trabajo de ejemplo
INSERT INTO "Job" ("id", "title", "company", "location", "description", "createdAt", "updatedAt")
VALUES (
    'job_dev_frontend_001',
    'Desarrollador Frontend',
    'EAFIT',
    'Medellín, Colombia',
    'Desarrollo de aplicaciones web modernas con React, Next.js y TypeScript. Experiencia en UI/UX y trabajo en equipo.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar contenido de página para IA
INSERT INTO "PageContent" ("id", "source", "url", "title", "content", "createdAt")
VALUES (
    'content_magneto_001',
    'magneto365',
    'https://magneto365.com',
    'Magneto365 - Portal de Empleos',
    'Magneto365 es la plataforma líder en empleos tecnológicos en Colombia. Conectamos talento con las mejores empresas.',
    CURRENT_TIMESTAMP
);

-- =====================================================
-- PROCEDIMIENTOS PARA MANTENIMIENTO
-- =====================================================

-- Limpieza de hilos de chat sin mensajes (para SQLite seria un script)
-- DELETE FROM "ChatThread" 
-- WHERE "id" NOT IN (SELECT DISTINCT "threadId" FROM "ChatMessage");

-- Limpieza de mensajes antiguos (más de 1 año)
-- DELETE FROM "ChatMessage" 
-- WHERE "createdAt" < date('now', '-1 year') 
--   AND "feedback" = false;

-- =====================================================
-- NOTAS DE MIGRACIÓN Y VERSIONING
-- =====================================================

-- Versión del esquema: 1.0
-- Última actualización: 2025-09-21
-- Prisma migrations aplicadas:
-- - 20250915234721_init_auth
-- - 20250915235415_init_auth  
-- - 20250915235936_add_chat_jobs
-- - 20250916000020_add_chat_jobs
-- - 20250916000445_add_page_content
-- - 20250916000835_add_feedback_flag
-- - 20250916002204_add_company_stats
-- - 20250921204530_add_company_to_chat_message

-- =====================================================
-- CONSIDERACIONES DE ESCALABILIDAD
-- =====================================================

-- Para producción considerar:
-- 1. Migrar a PostgreSQL para mejor rendimiento
-- 2. Particionamiento de tabla ChatMessage por fecha
-- 3. Archiving de datos históricos
-- 4. Índices adicionales basados en patrones de uso
-- 5. Caching de estadísticas frecuentemente consultadas
-- 6. Compresión de campo content en PageContent