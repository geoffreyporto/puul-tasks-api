# Puul - BackEnd API Tech Standards

Owner: Geoffrey Porto

## 1. Buenas Prácticas de Arquitectura para APIs Seguras

**Arquitectura y Diseño:**

- **Clean Architecture**: Separar capas (dominio, aplicación, infraestructura, presentación)
- **SOLID Principles**: Especialmente Dependency Inversion para facilitar testing
- **Repository Pattern**: Para abstracción de acceso a datos
- **DTO Pattern**: Para validación y transformación de datos
- **Guards y Interceptors**: Para autenticación y logging

**Seguridad:**

- Implementar autenticación JWT con refresh tokens
- Validación estricta de entrada (class-validator, class-transformer)
- Rate limiting y throttling
- Helmet.js para headers de seguridad
- Sanitización de datos para prevenir SQL injection
- CORS configurado correctamente
- Logging de audit trail

**Especificaciones:**

- **Capas bien definidas (Clean Architecture)**
    - Separar *controllers* (recepción de requests), *services* (lógica de negocio) y *repositories* o *data mappers* (acceso a la base).
    - Cada capa sólo conoce de la capa siguiente (dependencia hacia adentro).
- **Principios SOLID y KISS/DRY**
    - **S**ingle Responsibility: cada clase/servicio hace una sola cosa.
    - **O**pen/Closed: extender sin modificar.
    - **L**iskov, **I**nterface Segregation, **D**ependency Inversion.
    - Mantén el código simple y evita duplicar lógica (validaciones, mapeos, transformaciones).
- **Validación y sanitización de entradas**
    - Usa pipes de validación de NestJS (`class-validator` + `class-transformer`).
    - Sanitiza todo dato que venga del cliente para prevenir inyección SQL/NoSQL o XSS.
- **Autenticación y autorización robustas**
    - JWT con firma asimétrica (RS256) o sesiones seguras.
    - Control de roles/permissions (*guards* de NestJS).
    - Principle of Least Privilege: tokens con scopes acotados.
- **Comunicación segura**
    - Siempre HTTPS/TLS.
    - Cabeceras de seguridad con helmet (`@nest­js/helmet`): CSP, HSTS, XSS-Protection, etc.
- **Manejo de errores y logging**
    - No exponer stacks o detalles internos en las respuestas.
    - Logger centralizado (p.ej. Winston o Pino) con niveles (`error`, `warn`, `info`, `debug`).
- **Protección contra abuso**
    - Rate-limiting (e.g. `@nest­js/throttler`).
    - Protección CSRF si hay sesiones.
    - CORS bien configurado.
- **Pruebas de seguridad integradas**
    - Escaneo de dependencias en CI (`npm audit`, Snyk, Dependabot).
    - Revisiones de código enfocadas en seguridad.

## 2. Herramientas para Documentación del API

- **Swagger / OpenAPI**
    - Módulo oficial `@nestjs/swagger` genera spec y UI automáticamente con Integración nativa con NestJS.
    - Decoradores como `@ApiOperation`, `@ApiResponse`, `@ApiProperty`
    - Generación automática de documentación e Interfaz interactiva con Swagger UI o Redoc.
- **Postman**
    - Colecciones exportables, documentación colaborativa, ejemplos de request/response.
- **API Blueprint / RAML**
    - DSL de documentación legible; existen generadores de HTML, integraciones con GitHub.
- **Docs-as-code**
    - Markdown + MkDocs o Docusaurus para documentación más narrativa (ej.: flujos de autenticación).
- **Insomnia**
    - Cliente REST con documentación

## 3. Herramientas para Debugging del API

**Desarrollo:**

- **NestJS Logger** - Sistema de logging integrado
- **Winston** - Logger avanzado con múltiples transportes
- **Morgan** - HTTP request logger middleware

**Debugging:**

- **VS Code Debugger** - Debugging nativo de Node.js
- **Chrome DevTools** - Para debugging remoto
- **node --inspect** - Debugging con inspector

**Monitoreo:**

- **Sentry** - Error tracking y performance monitoring
- **New Relic** - APM completo
- **DataDog** - Observabilidad y métricas

**Especificaciones:**

- **Node.js Inspector**
    - `node --inspect` y adjuntar desde Chrome DevTools o VSCode.
- **VSCode Debugger**
    - Launch configurations para breakpoints en .ts (usando `ts-node` o pre-compilado).
- **Logging avanzado**
    - Consola con etiquetas; o integraciones APM (New Relic, Datadog, Elastic APM) para trazas distribuidas.
- **Hot-reload / nodemon**
    - Reinicio automático del servidor al cambiar código y facilitar ciclos de debug rápidos.

## 4. Herramientas para Pruebas Unitarias

**Framework Principal:**

- **Jest** - Framework de testing por defecto en NestJS
- `@nestjs/testing` - Utilities para testing de módulos NestJS

**Testing Utilities:**

- **Supertest** - Para testing de endpoints HTTP
- **Test Containers** - Para testing con base de datos real
- **Factory Pattern** - Para crear datos de prueba

**Ejemplo básico:**

```tsx

describe('TasksService', () => {
  let service: TasksService;
  let mockRepository: Repository<Task>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });
});

```

## 5. Herramientas para Pruebas de Stress

**Load Testing:**

- **k6**
    - Código JavaScript, scripts claros, métricas en consola y Grafana.
- **Artillery**
    - YAML/JS, integración con CI, plugins para escenarios complejos.
- **Apache JMeter**
    - Interfaz gráfica, protocolos múltiples (HTTP, TCP, JMS).
- **Apache Bench (ab)**
    - Tool simple para pruebas básicas
- **wrk / hey**
    - Herramientas sencillas de línea de comandos para benchmarks rápidos.
- **Locust**
    - en Python, buena para escenarios distribuidos.
- **Autocannon**
    - Fast HTTP/1.1 benchmarking tool

**Monitoreo de Performance:**

- **Clinic.js** - Performance profiling para Node.js
- **0x** - Flamegraph profiler
- **Node.js Performance Hooks** - Métricas nativas

**Especificaciones:**

- **Jest**
    - Incluido por defecto en proyectos NestJS. Soporta mocks, spies y coverage.
- **Testing Utilities de Nest**
    - `@nestjs/testing` para crear módulos de prueba aislados.
- **Sinon / ts-mockito**
    - Para espías y stubs más finos si lo necesitas.
- **Supertest**
    - Para pruebas de endpoints HTTP de forma *end-to-end* ligera.

**Ejemplo con Artillery:**

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/tasks"

```

## 6. Herramientas para Seguridad OWASP

**Análisis Estático:**
Integrar en CI/CD para revisar inyección, exposiciones de datos, XSS, CSRF, etc.

- **ESLint Security Plugin** - Detecta vulnerabilidades en código
- **Semgrep** - Static analysis para múltiples lenguajes
- **SonarQube** - Análisis de calidad y seguridad

**Dependencia y análisis de código:**
`npm audit`, **Snyk**, **SonarQube** (reglas OWASP Top 10), **NodeJsScan**.

- **npm audit** - Auditoría nativa de npm
- **Snyk** - Vulnerability scanning
- **OWASP Dependency Check** - Análisis de dependencias

**Penetration Testing:**

- **OWASP ZAP**
    - Proxy/interceptor con escaneo activo y pasivo de vulnerabilidades HTTP como Web application security scanner
- **Burp Suite** - Platform completa de web security testing
- **Nikto** - Web server scanner
- **Linters de seguridad**
    - `eslint-plugin-security`, `npm audit-ci` para frenar merges con vulnerabilidades conocidas.

**Security Headers:**

```tsx

// Configuración con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

```

## Estructura Recomendada del Proyecto

```

src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── tasks/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── database/
└── main.ts

```

## Pipeline de CI/CD Recomendado

1. **Linting y Formatting** (ESLint, Prettier)
2. **Unit Tests** (Jest)
3. **Integration Tests** (Supertest)
4. **Security Scan** (npm audit, Snyk)
5. **Build** (TypeScript compilation)
6. **Performance Tests** (Artillery en staging)
7. **OWASP Security Scan** (ZAP)