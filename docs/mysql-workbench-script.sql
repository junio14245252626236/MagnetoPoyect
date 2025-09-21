-- =====================================================
-- MiniMagneto - Script para MySQL Workbench
-- Copiar y pegar en MySQL Workbench para crear el modelo
-- =====================================================

-- Configurar el esquema
CREATE SCHEMA IF NOT EXISTS `minimagneto` DEFAULT CHARACTER SET utf8mb4;
USE `minimagneto`;

-- =====================================================
-- TABLA: User (Usuarios del sistema)
-- =====================================================
CREATE TABLE `User` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único del usuario',
  `name` VARCHAR(255) NULL COMMENT 'Nombre completo del usuario',
  `email` VARCHAR(255) NOT NULL COMMENT 'Email único para autenticación',
  `passwordHash` VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt de la contraseña',
  `image` TEXT NULL COMMENT 'URL de la imagen de perfil',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE = InnoDB
COMMENT = 'Usuarios registrados en la plataforma';

-- =====================================================
-- TABLA: Job (Ofertas de empleo)
-- =====================================================
CREATE TABLE `Job` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único del empleo',
  `title` VARCHAR(255) NOT NULL COMMENT 'Título del puesto de trabajo',
  `company` VARCHAR(255) NOT NULL COMMENT 'Nombre de la empresa',
  `location` VARCHAR(255) NULL COMMENT 'Ubicación geográfica del trabajo',
  `description` TEXT NOT NULL COMMENT 'Descripción detallada del empleo',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de publicación',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
  PRIMARY KEY (`id`),
  INDEX `idx_company` (`company` ASC),
  INDEX `idx_location` (`location` ASC),
  INDEX `idx_created` (`createdAt` DESC)
) ENGINE = InnoDB
COMMENT = 'Ofertas de trabajo publicadas en la plataforma';

-- =====================================================
-- TABLA: ChatThread (Hilos de conversación)
-- =====================================================
CREATE TABLE `ChatThread` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único del hilo de chat',
  `userId` VARCHAR(30) NULL COMMENT 'Usuario propietario del chat',
  `jobId` VARCHAR(30) NULL COMMENT 'Empleo relacionado (opcional)',
  `title` VARCHAR(255) NULL COMMENT 'Título o tema del chat',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Inicio de la conversación',
  PRIMARY KEY (`id`),
  INDEX `fk_ChatThread_User_idx` (`userId` ASC),
  INDEX `fk_ChatThread_Job_idx` (`jobId` ASC),
  INDEX `idx_created` (`createdAt` DESC),
  CONSTRAINT `fk_ChatThread_User`
    FOREIGN KEY (`userId`)
    REFERENCES `User` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ChatThread_Job`
    FOREIGN KEY (`jobId`)
    REFERENCES `Job` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Sesiones de conversación entre usuarios y asistente IA';

-- =====================================================
-- TABLA: ChatMessage (Mensajes individuales)
-- =====================================================
CREATE TABLE `ChatMessage` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único del mensaje',
  `threadId` VARCHAR(30) NOT NULL COMMENT 'Hilo al que pertenece el mensaje',
  `sender` ENUM('user', 'bot') NOT NULL COMMENT 'Remitente del mensaje',
  `text` TEXT NOT NULL COMMENT 'Contenido del mensaje',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp del mensaje',
  `feedback` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indica si es un mensaje de feedback',
  `rating` TINYINT NULL COMMENT 'Calificación de 1 a 5 estrellas',
  `company` VARCHAR(255) NULL COMMENT 'Empresa asociada al feedback',
  PRIMARY KEY (`id`),
  INDEX `fk_ChatMessage_ChatThread_idx` (`threadId` ASC),
  INDEX `idx_sender` (`sender` ASC),
  INDEX `idx_feedback` (`feedback` ASC),
  INDEX `idx_company_feedback` (`company` ASC, `feedback` ASC),
  INDEX `idx_rating` (`rating` ASC),
  INDEX `idx_created` (`createdAt` DESC),
  CONSTRAINT `fk_ChatMessage_ChatThread`
    FOREIGN KEY (`threadId`)
    REFERENCES `ChatThread` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chk_rating_range`
    CHECK (`rating` IS NULL OR (`rating` >= 1 AND `rating` <= 5))
) ENGINE = InnoDB
COMMENT = 'Mensajes individuales dentro de los hilos de chat';

-- =====================================================
-- TABLA: PageContent (Contenido web para IA)
-- =====================================================
CREATE TABLE `PageContent` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único del contenido',
  `source` VARCHAR(255) NOT NULL COMMENT 'Fuente del contenido (ej: magneto365)',
  `url` TEXT NOT NULL COMMENT 'URL de origen del contenido',
  `title` VARCHAR(500) NULL COMMENT 'Título de la página web',
  `content` LONGTEXT NOT NULL COMMENT 'Contenido extraído en texto plano',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de extracción',
  PRIMARY KEY (`id`),
  INDEX `idx_source` (`source` ASC),
  INDEX `idx_created` (`createdAt` DESC),
  FULLTEXT INDEX `ft_content` (`content`, `title`)
) ENGINE = InnoDB
COMMENT = 'Contenido web extraído para entrenar el asistente IA';

-- =====================================================
-- TABLA: CompanyStats (Estadísticas empresariales)
-- =====================================================
CREATE TABLE `CompanyStats` (
  `id` VARCHAR(30) NOT NULL COMMENT 'CUID único de las estadísticas',
  `company` VARCHAR(255) NOT NULL COMMENT 'Nombre único de la empresa',
  `candidatesActive` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Número de candidatos activos',
  `companyViews` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Número de vistas de la empresa',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `company_UNIQUE` (`company` ASC)
) ENGINE = InnoDB
COMMENT = 'Estadísticas y métricas por empresa';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Feedback por empresa con estadísticas
CREATE VIEW `v_company_feedback_summary` AS
SELECT 
    cm.`company`,
    COUNT(*) as `totalFeedbacks`,
    ROUND(AVG(cm.`rating`), 1) as `avgRating`,
    COUNT(CASE WHEN cm.`rating` >= 4 THEN 1 END) as `positiveRatings`,
    COUNT(CASE WHEN cm.`rating` <= 2 THEN 1 END) as `negativeRatings`,
    MIN(cm.`createdAt`) as `firstFeedback`,
    MAX(cm.`createdAt`) as `lastFeedback`
FROM `ChatMessage` cm
WHERE cm.`feedback` = TRUE 
  AND cm.`company` IS NOT NULL
  AND cm.`rating` IS NOT NULL
GROUP BY cm.`company`;

-- Vista: Actividad de usuarios
CREATE VIEW `v_user_activity` AS
SELECT 
    u.`id`,
    u.`name`,
    u.`email`,
    COUNT(DISTINCT ct.`id`) as `totalThreads`,
    COUNT(cm.`id`) as `totalMessages`,
    COUNT(CASE WHEN cm.`feedback` = TRUE THEN 1 END) as `feedbackCount`,
    MAX(cm.`createdAt`) as `lastActivity`
FROM `User` u
LEFT JOIN `ChatThread` ct ON u.`id` = ct.`userId`
LEFT JOIN `ChatMessage` cm ON ct.`id` = cm.`threadId`
GROUP BY u.`id`, u.`name`, u.`email`;

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Insertar usuario de prueba
INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`) VALUES
('user_test_001', 'Usuario Test', 'test@test.com', '$2b$10$hash_example');

-- Insertar empresa y estadísticas
INSERT INTO `CompanyStats` (`id`, `company`, `candidatesActive`, `companyViews`) VALUES
('stats_eafit_001', 'EAFIT', 2847, 15420);

-- Insertar empleo de ejemplo
INSERT INTO `Job` (`id`, `title`, `company`, `location`, `description`) VALUES
('job_dev_001', 'Desarrollador Frontend', 'EAFIT', 'Medellín, Colombia', 
'Desarrollo de aplicaciones web modernas con React, Next.js y TypeScript.');

-- Insertar contenido para IA
INSERT INTO `PageContent` (`id`, `source`, `url`, `title`, `content`) VALUES
('content_001', 'magneto365', 'https://magneto365.com', 'Magneto365 - Portal de Empleos',
'Magneto365 es la plataforma líder en empleos tecnológicos en Colombia.');

-- =====================================================
-- COMENTARIOS PARA WORKBENCH
-- =====================================================

/*
INSTRUCCIONES PARA MYSQL WORKBENCH:

1. Abrir MySQL Workbench
2. Crear nueva conexión local
3. File → New Model
4. Database → Forward Engineer
5. Pegar este script completo
6. Ejecutar para crear el modelo visual

CARACTERÍSTICAS DEL MODELO:
- 6 tablas principales
- Relaciones con integridad referencial
- Índices optimizados para consultas frecuentes
- Vistas pre-calculadas para reportes
- Datos de ejemplo para testing
- Comentarios detallados en español

RELACIONES PRINCIPALES:
- User ←→ ChatThread (1:N, opcional)
- Job ←→ ChatThread (1:N, opcional)
- ChatThread ←→ ChatMessage (1:N, obligatorio)
- Company ←→ Stats (1:1, implícito)

*/