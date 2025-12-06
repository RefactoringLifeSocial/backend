
## Documentación técnica

**Visión General**
- Backend construido con `NestJS 11` y `TypeScript 5.7`.
- Persistencia con `TypeORM 0.3` sobre `MySQL`.
- Autenticación con `JWT` y hash de contraseñas con `bcrypt`.
- Calidad: `ESLint 9` + `TypeScript ESLint`, `Prettier`. Pruebas con `Jest` y `Supertest`.

**Estructura del Proyecto**
- `src/main.ts` inicia la aplicación, configura `ValidationPipe` y CORS, y levanta el servidor en `PORT` (`3001` por defecto). Referencia: `src/main.ts:5-22`.
- `src/app.module.ts` registra módulos (`UsersModule`, `AuthModule`) y configura `ConfigModule` global. Referencia: `src/app.module.ts:9-19`.
- `src/common/constants/cors.ts` define `corsOptions` leyendo `CORS_ORIGIN`. Referencia: `src/common/constants/cors.ts:3-7`.
- `src/common/decorators/acces-level.decorators.ts` decorador `AccessLevel` para roles (`ADMIN`, `USER`). Referencia: `src/common/decorators/acces-level.decorators.ts:7`.
- `src/common/guards/auth.guard.ts` valida JWT para rutas no públicas y adjunta el `payload` al `request`. Referencia: `src/common/guards/auth.guard.ts:22-53`.
- `src/common/guards/acces-level.guard.ts` aplica control de acceso por roles según metadatos `ACCESS_LEVEL`. Referencia: `src/common/guards/acces-level.guard.ts:23-53`.
- `src/common/enums/UserRoleEnum.ts` enum de roles soportados. Referencia: `src/common/enums/UserRoleEnum.ts:1-4`.
- `src/db/database.providers.ts` módulo que expone `DataSource` (TypeORM) configurado contra MySQL mediante variables de entorno; `synchronize: true`. Referencia: `src/db/database.providers.ts:11-32`.
- `src/features/auth/*` módulo de autenticación: controlador, servicio, DTOs e interfaces.
  - Controlador: `src/features/auth/auth.controller.ts:22-34` (login/register) y `src/features/auth/auth.controller.ts:36-47` (cambio de contraseña).
  - Servicio: `src/features/auth/auth.service.ts:17-36` (login), `src/features/auth/auth.service.ts:38-60` (register), `src/features/auth/auth.service.ts:62-75` (cambiar contraseña), `src/features/auth/auth.service.ts:77-84` (generar token).
  - Decorador `Public`: `src/features/auth/decorators/public.decorator.ts:6`.
- `src/features/users/*` módulo de usuarios (CRUD básico):
  - Controlador: `src/features/users/users.controller.ts:21-24` (crear), `src/features/users/users.controller.ts:26-42` (listar/obtener/eliminar con `AccessLevel('ADMIN')`).
  - Servicio: inyección de `DataSource` y repositorio. Referencias: `src/features/users/users.service.ts:10-12`, `src/features/users/users.service.ts:14-36`.
  - Entidad: `User` con campos y restricciones. Referencia: `src/features/users/entities/user.entity.ts:5-46`.
- `src/utils/use-token.ts` utilidad para decodificar un token sin verificar la firma. Referencia: `src/utils/use-token.ts:9-29`.
- `test/app.e2e-spec.ts` prueba e2e del endpoint raíz `/`. Referencia: `test/app.e2e-spec.ts:19-24`.
- Configuración y tooling:
  - `nest-cli.json:1-8` (fuente `src`).
  - `tsconfig.json:1-25` (compilación a `dist`, decoradores habilitados).
  - `eslint.config.mjs:7-38` (reglas y parser TS ESLint).
  - `.prettierrc` (formato).
  - `Dockerfile:37-39` y `docker-compose.yml:20-32` (contenedores app y base de datos).
  - `.env.example:11-16` (variables clave: `HASH_SALT`, `SECRET_KEY`, `CORS_ORIGIN`, `DB_*`).

**Funcionamiento del Código**
- Inicio y validaciones:
  - Se aplican validaciones globales de DTO con `class-validator` y transformación implícita. `src/main.ts:8-16`.
  - CORS permite múltiples orígenes separados por coma; por defecto `http://localhost:5173`. `src/common/constants/cors.ts:4`.
- Autenticación y autorización:
  - `POST /auth/login` recibe `email` y `password` (via `CreateUserDto`) y retorna `access_token` firmado con `SECRET_KEY`. Referencias: `src/features/auth/auth.controller.ts:22-27`, `src/features/auth/auth.service.ts:17-36`.
  - `POST /auth/register` crea usuario tras hashear contraseña (`bcrypt`) y devuelve token con datos del usuario. Referencias: `src/features/auth/auth.controller.ts:29-34`, `src/features/auth/auth.service.ts:38-60`.
  - `PATCH /auth/change-password` protegido con `AccessLevel('USER','ADMIN')`; valida código de verificación y actualiza password. Referencias: `src/features/auth/auth.controller.ts:36-47`, `src/features/auth/auth.service.ts:62-75`.
  - Decorador `Public` marca endpoints que omiten `AuthGuard`. `src/features/auth/decorators/public.decorator.ts:6`.
  - `AuthGuard` verifica la firma del JWT y adjunta `request['user']`. `src/common/guards/auth.guard.ts:22-47`.
  - `RolesGuard` exige que `payload.role` esté incluido en los roles definidos con `AccessLevel`. `src/common/guards/acces-level.guard.ts:23-45`.
- Usuarios:
  - `POST /users` crea un usuario; actualmente no exige rol ni autenticación explícita. Referencia: `src/features/users/users.controller.ts:21-24`.
  - `GET /users`, `GET /users/:id`, `DELETE /users/:id` requieren rol `ADMIN`. Referencias: `src/features/users/users.controller.ts:26-42`.
- Base de datos:
  - Se inyecta `DataSource` desde `DatabaseModule` y se obtiene el repositorio de `User`. Referencias: `src/features/users/users.service.ts:10-12`.
  - Config MySQL via env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`. `src/db/database.providers.ts:16-25`.
  - `synchronize: true` crea/actualiza tablas automáticamente durante el desarrollo.
- Endpoint raíz:
  - `GET /` devuelve `Hello World!`. Referencias: `src/app.controller.ts:8-11`, `src/app.service.ts:5-7`.

**Dónde está cada cosa**
- Endpoints HTTP: `src/app.controller.ts`, `src/features/*/*.controller.ts`.
- Lógica de negocio: `src/features/*/*.service.ts`.
- DTOs y validaciones: `src/features/*/dto/*.ts`.
- Entidades TypeORM: `src/features/*/entities/*.ts`.
- Seguridad y roles: `src/common/guards/*.ts`, `src/common/decorators/*.ts`, `src/common/enums/*.ts`.
- Config DB: `src/db/database.providers.ts`.
- Utilidades: `src/utils/*.ts`.
- Configuración general: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `nest-cli.json`.
- Entorno y despliegue: `.env.example`, `Dockerfile`, `docker-compose.yml`.

**Configuración y ejecución**
- Variables de entorno (`.env`):
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`.
  - `CORS_ORIGIN` para orígenes permitidos separados por coma.
  - `HASH_SALT` entero para el costo de `bcrypt`.
  - `SECRET_KEY` para firmar JWT.
  - `PORT` para el servidor HTTP.
- Desarrollo local:
  - Instalar dependencias: `pnpm install`.
  - Ejecutar en modo watch: `pnpm run start:dev`.
- Con Docker:
  - Preparar `.env` con credenciales.
  - Levantar servicios: `docker-compose up --build -d`.
  - Base de datos disponible en `localhost:3307` (host) y `3306` dentro de la red de Docker.

**Pruebas**
- Prueba e2e del endpoint raíz: `pnpm run test:e2e`. Ver `test/app.e2e-spec.ts:19-24`.
- Scripts adicionales en `package.json:8-21` (`lint`, `test`, `start:*`).

**Mejoras recomendadas y cómo implementarlas**
- Unificar puerto del servidor y del contenedor:
  - Opción A: establecer `PORT=3000` en `.env` para que `src/main.ts:20` escuche en `3000`.
  - Opción B: cambiar mapeo a `"3001:3001"` en `docker-compose.yml:31` y exponer `3001` en `Dockerfile`.
- Exigir autenticación/rol en `POST /users`:
  - Añadir `@AccessLevel('ADMIN')` a `create` o incorporar `@UseGuards(AuthGuard, RolesGuard)` en `UsersController`. Ubicación: `src/features/users/users.controller.ts:21-24`.
- Eliminar valores por defecto inseguros:
  - Quitar `SECRET_KEY` por defecto en guardias/servicios y forzar lectura desde `.env`. Archivos: `src/common/guards/auth.guard.ts:13-20`, `src/common/guards/acces-level.guard.ts:13-21`, `src/features/auth/auth.service.ts:10`.
- Migraciones TypeORM en lugar de `synchronize: true`:
  - Desactivar `synchronize` y crear migraciones (`typeorm migration:generate`), aplicarlas en arranque.
  - Añadir `DataSource` de CLI y scripts en `package.json`.
- Normalizar el `payload` del JWT:
  - Unificar interfaces (`src/features/auth/interfaces/payload.interface.ts` y `src/features/auth/interfaces/auth.interface.ts`) y la utilidad `use-token` para usar `role` en vez de `rol` y remover campos no usados (`tokenRefresh`, `name`). Ubicación: `src/utils/use-token.ts:9-29`.
- Endpoint para gestionar códigos de recuperación:
  - Crear endpoint que genere `code` y lo envíe por email/SMS; marcar `used_code` al consumirlo. Archivos involucrados: `User` entidad (`src/features/users/entities/user.entity.ts:38-45`) y `AuthService.changePassword` (`src/features/auth/auth.service.ts:62-75`).
- Constraint única para `email`:
  - Añadir `@Column({ unique: true })` al campo `email` y manejar errores en `UsersService.create`. Referencia: `src/features/users/entities/user.entity.ts:22-26`.
- Mejorar CORS y seguridad:
  - Permitir múltiples orígenes vía `.env` y añadir `Helmet` y rate limiting en `bootstrap`.
- Aumentar cobertura de pruebas:
  - Añadir pruebas e2e para `/auth/login`, `/auth/register`, `/users` con guardias.

**Endpoints principales**
- `GET /` — Estado del servicio básico. `src/app.controller.ts:8-11`.
- `POST /auth/login` — Autenticación y entrega de `access_token`. `src/features/auth/auth.controller.ts:22-27`.
- `POST /auth/register` — Registro de usuario y token inicial. `src/features/auth/auth.controller.ts:29-34`.
- `PATCH /auth/change-password` — Cambio de contraseña con código y rol. `src/features/auth/auth.controller.ts:36-47`.
- `POST /users` — Crear usuario (recomendado proteger con `ADMIN`). `src/features/users/users.controller.ts:21-24`.
- `GET /users` — Listado (solo `ADMIN`). `src/features/users/users.controller.ts:26-30`.
- `GET /users/:id` — Detalle (solo `ADMIN`). `src/features/users/users.controller.ts:32-36`.
- `DELETE /users/:id` — Borrar (solo `ADMIN`). `src/features/users/users.controller.ts:38-42`.

## Detalles avanzados

**Arquitectura y módulos**
- `AuthModule` importa `DatabaseModule` y registra `JwtModule` de forma asíncrona con `ConfigModule`. Referencias: `src/features/auth/auth.module.ts:10-23`.
- `UsersModule` importa `DatabaseModule` y provee `UsersService`. Referencias: `src/features/users/users.module.ts:7-12`.
- `DatabaseModule` expone `DataSource` inicializado con las entidades (`User`). Referencia: `src/db/database.providers.ts:11-32`.
- `AppModule` orquesta módulos y expone `AppController` y `AppService`. Referencia: `src/app.module.ts:8-19`.

**Flujo de autenticación y autorización**
- Inicio de sesión (`POST /auth/login`):
  - Valida DTO (`email`, `password`). `src/features/users/dto/create-user.dto.ts:11-36`.
  - Busca usuario por email. `src/features/users/users.service.ts:30-32`.
  - Compara contraseña con `bcrypt.compare`. `src/features/auth/auth.service.ts:24-27`.
  - Genera `access_token` con `payload { email, sub, role }`. `src/features/auth/auth.service.ts:29-35`.
- Registro (`POST /auth/register`):
  - Valida que no exista email y hashea contraseña con `HASH_SALT`. `src/features/auth/auth.service.ts:38-47`.
  - Crea usuario y firma token con expiración de `7d`. `src/features/auth/auth.service.ts:49-59`, `src/features/auth/auth.service.ts:77-84`.
- Cambio de contraseña (`PATCH /auth/change-password`):
  - Protegido por `AccessLevel('USER','ADMIN')`. `src/features/auth/auth.controller.ts:36-47`.
  - Verifica `code`, evita reuso (`used_code`) y actualiza el hash. `src/features/auth/auth.service.ts:62-75`.
- Autorización:
  - `AuthGuard` verifica firma del JWT y establece `request['user']`. `src/common/guards/auth.guard.ts:22-47`.
  - `RolesGuard` requiere que `payload.role` esté en `ACCESS_LEVEL`. `src/common/guards/acces-level.guard.ts:23-45`.
  - `Public` permite omitir autenticación en endpoints específicos. `src/features/auth/decorators/public.decorator.ts:6`.

**Esquema de datos (User)**
- Campos: `id`, `full_name`, `country`, `address`, `phone`, `email`, `password`, `role`, `profile_image`, `code`, `used_code`.
- `role` es `enum` (`ADMIN`, `USER`) con default `user`. Referencia: `src/features/users/entities/user.entity.ts:28-35`.
- `code` opcional de 6 caracteres y `used_code` por defecto `false`. Referencias: `src/features/users/entities/user.entity.ts:38-45`.

**Endpoints y ejemplos**
- Autenticación:
  - `POST /auth/login`
    - Request: `{ "email": "user@example.com", "password": "Password1" }`
    - Response: `{ "access_token": "<jwt>" }`
  - `POST /auth/register`
    - Request: `{ "email": "user@example.com", "password": "Password1", "full_name": "Nombre Apellido", "country": "Pais", "address": "Calle 123", "phone": "12345678", "profile_image": "https://..." }`
    - Response: `{ "access_token": "<jwt>" }`
  - `PATCH /auth/change-password`
    - Headers: `Authorization: Bearer <jwt>`
    - Request: `{ "email": "user@example.com", "newPassword": "Password2", "code": "123456" }`
    - Response: `204` o `200` sin cuerpo cuando se implementa confirmación.
- Usuarios:
  - `POST /users`
    - Request: igual a `CreateUserDto`. `src/features/users/dto/create-user.dto.ts:11-78`.
    - Response: entidad creada.
  - `GET /users`
    - Headers: `Authorization: Bearer <jwt>` con rol `ADMIN`.
    - Response: lista de usuarios.
  - `GET /users/:id` y `DELETE /users/:id` requieren rol `ADMIN`.

**Estrategia de errores y validaciones**
- Validaciones de DTO con mensajes en español y `whitelist` para evitar propiedades no permitidas. `src/main.ts:8-16`.
- Errores de autenticación como `UnauthorizedException` para credenciales, token inválido o rol insuficiente.
- Recomendado añadir un `GlobalExceptionFilter` para formato consistente de errores.

**Configuración de entorno**
- Variables requeridas: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `CORS_ORIGIN`, `HASH_SALT`, `SECRET_KEY`, `PORT`.
- `CORS_ORIGIN` admite múltiples orígenes separados por coma. `src/common/constants/cors.ts:4`.

**Despliegue con Docker**
- Base de datos MySQL expuesta en `localhost:3307` y red interna `3306`. `docker-compose.yml:10-13`.
- La app expone `3000` pero el servidor escucha `3001` por defecto; establecer `PORT=3000` o alinear puertos. `Dockerfile:38-39`, `src/main.ts:20`, `docker-compose.yml:31`.

**Guía práctica para mejoras**
- Forzar `SECRET_KEY` desde entorno:
  - Sustituir valores por defecto en `AuthGuard`, `RolesGuard` y `AuthService` para leer siempre de `ConfigService` y fallar si no existe.
- Unificar expiración de tokens:
  - Definir `expiresIn` centralizado (`.env`, p.ej. `JWT_EXPIRES=1h`) y usarlo tanto en login como en `generateToken`.
- `email` único y validación de conflicto:
  - Añadir `unique: true` al `@Column()` de `email` y capturar errores en `UsersService.create`.
- Migraciones y versionado de esquema:
  - Desactivar `synchronize`, configurar `DataSource` para CLI y crear migraciones (`typeorm`) para cambios controlados en producción.
- Seguridad adicional:
  - Añadir `Helmet`, limitador de tasa y refresco de tokens si se requiere sesiones largas.
- Cobertura de pruebas:
  - Añadir e2e que validen guardias, roles y flujos de error (contraseña incorrecta, token expirado, rol insuficiente).
