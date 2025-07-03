# Readme

Owner: Geoffrey Porto

## **1. Preparación del Ambiente de Desarrollo (Ambientes Aislados)**

### **Opción A: Volta (Zero-Config) - Recomendado**

Volta es un administrador de herramientas JavaScript que maneja automáticamente las versiones de Node.js, npm y otras herramientas por proyecto, similar a los virtual environments de Python.

### **Para Mac OS X Sonoma 14.4: (Utilizado en este challenger)**

```bash
# 1. Instalar Volta
sudo curl https://get.volta.sh | bash

# 2. Reiniciar terminal o recargal perfil
source ~/.bash_profile # o ~/.zshrc

# 3. Verificar instalación
sudo volta --version

# 4. Instalar Node.js LTS (será la versión global por defecto)
sudo volta install node@23.6.1 # seleccionar la version del node que deseas usar

# 5. Instalar herramientas globales con Volta
sudo volta install @nestjs/cli # output- success: installed @nestjs/cli@11.0.7 with executables: nest

sudo volta install typescript # output - success: installed typescript@5.8.3 with executables: tsc, tsserver
 
sudo volta install ts-node # output - success: installed ts-node@10.9.2 with executables: ts-node, ts-node-cwd, ts-node-esm, ts-node-script, ts-node-transpile-only, ts-script

# 6. Instalar PostgreSQL (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
brew install postgresql
brew services start postgresql

# 7. Configurar base de datos (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
createdb puul_tasks_db
```

### **Para Linux Ubuntu/Debian:**

```bash

# 1. Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependencias necesarias
sudo apt install curl git build-essential

# 3. Instalar Volta
curl https://get.volta.sh | bash

# 4. Reiniciar terminal o recargar el perfil
source ~/.bashrc

# 5. Verificar instalación
volta --version

# 6. Instalar Node.js LTS
volta install node@23

# 7. Instalar herramientas globales
volta install @nestjs/cli
volta install typescript
volta install ts-node

# 8. Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 9. Configurar usuario PostgreSQL
sudo -u postgres createuser --interactive
sudo -u postgres createdb puul_tasks_db

```

### **Configuración del proyecto con Volta:**

```bash

# En el directorio del proyecto, fijar versiones específicas
volta pin node@23.6.1
volta pin npm@10.9.2

# Esto creará automáticamente las entradas en package.json:# "volta": {#   "node": "23.6.1",#   "npm": "10.9.2"# }

```

---

### **Opción B: NVM + .nvmrc (Tradicional)**

NVM permite instalar y cambiar entre múltiples versiones de Node.js, y .nvmrc especifica la versión del proyecto.

### **Para Mac OS X Sonoma 14.4:**

```bash

# 1. Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 2. Reiniciar terminal o recargar el perfil
source ~/.zshrc# o ~/.bash_profile# 3. Verificar instalación
sudo nvm --version

# 4. Instalar Node.js LTS
sudo nvm install --lts
sudo nvm use --lts

# 5. Instalar PostgreSQL (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
brew install postgresql
brew services start postgresql

# 6. Configurar base de datos (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
createdb puul_tasks_db

```

### **Para Linux Ubuntu/Debian:**

```bash

# 1. Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependencias
sudo apt install curl git build-essential

# 3. Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 4. Reiniciar terminal o recargar
source ~/.bashrc

# 5. Verificar instalación
nvm --version

# 6. Instalar Node.js LTS
nvm install --lts
nvm use --lts

# 7. Instalar PostgreSQL (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 8. Configurar PostgreSQL (caso quiera usar Postgresql OnPremise, utilize Supabase - Postgresql in Cloud)
sudo -u postgres createuser --interactive
sudo -u postgres createdb puul_tasks_db

```

### **Configuración del proyecto con NVM:**

```bash

# En el directorio del proyecto, crear archivo .nvmrc
echo "23.6.1" > .nvmrc

# Para usar la versión del proyecto automáticamente
sudo nvm use

# Instalar herramientas globales para esta versión
sudo npm install -g @nestjs/cli typescript ts-node

```

### **Automatización con .nvmrc (opcional):**

Agregar al `~/.zshrc` o `~/.bashrc` para cambio automático:

```bash

# Función para cambiar automáticamente a la versión de Node.js del proyecto
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

---

### **Comparación: Volta y NVM**

![image.png](Readme%202214fbea3fce80318871d08a111a22f3/image.png)

---

### **Comparación: Volta + Gestor**

### **Volta puede gestionar las versiones de npm, yarn y pnpm** además de Node.js.

Para nuestro proyecto de gestión de tareas de Puul, **npm es la mejor opción** por las siguientes razones:

### **✅ Ventajas de npm con Volta:**

1. **Integración Nativa**: npm viene incluido con Node.js y Volta lo gestiona automáticamente
2. **Estabilidad**: Es el gestor más maduro y estable del ecosistema
3. **Compatibilidad**: NestJS está optimizado para npm por defecto
4. **Simplicidad**: Menos dependencias externas
5. **Soporte Enterprise**: Mejor para entornos corporativos como Puul

![image.png](Readme%202214fbea3fce80318871d08a111a22f3/image%201.png)

## **1. Configuración del Proyecto Base y Arquitectura**

**Con cualquiera de las opciones anteriores, proceder:**

```bash

# 1. Crear proyecto NestJS (NO NextJS - era un error tipográfico)
sudo nest new . --skip-git --package-manager npm
cd puul-tasks-api

# 2. Si usas Volta, fijar versiones del proyecto (USE PARA ESTE CHALLENGER)
sudo volta pin node@23.6.1 # output - success: pinned node@23.6.1 (with npm@10.9.2) in package.json

sudo volta pin npm@10.9.2 # output - success: pinned npm@10.9.2 in package.json

# Si usas NVM, crear .nvmrc 
echo "23.6.1" > .nvmrc
nvm use

# Configurar estructura de carpetas siguiendo Clean Architecture
mkdir -p src/{modules/{auth,users,tasks},common/{decorators,filters,guards,interceptors,pipes},config,database}
```

![image.png](Readme%202214fbea3fce80318871d08a111a22f3/image%202.png)

**Verificación del ambiente aislado:**

```bash
#3. Verificar versiones activas
node --version # Debe mostrar la versión del proyecto
npm --version  # Debe mostrar la versión correspondiente

which node     # output - /Users/geoffreyporto/.volta/bin/node
               # Volta: ~/.volta/bin/node | NVM: ~/.nvm/versions/node/...

# Verificar aislamiento
pwd # output: /Volumes/Backup/Projects/src/challengers/puul/puul-tasks-api
cd /tmp && node --version  # Debe mostrar versión global
cd /path/to/puul-tasks-api && node --version  # Debe mostrar versión del proyecto, para este challeger : cd /Volumes/Backup/Projects/src/challengers/puul/puul-tasks-api

```

**Definicion de Estructura de carpetas:**

```
puul-tasks-api/
├── .nvmrc                    # Versión de Node.js (18.19.0)
├── .gitignore               # Archivos a ignorar por Git
├── .env.example             # Template de variables de entorno
├── .env                     # Variables de entorno (desarrollo)
├── package.json             # (se crea con nest new)
├── README.md                # Documentación completa del proyecto
├── src/
│   ├── modules/
│   │   ├── auth/            # Autenticación JWT
│   │   ├── users/           # Gestión de usuarios
│   │   └── tasks/           # Gestión de tareas
│   ├── common/
│   │   ├── decorators/      # Decoradores personalizados
│   │   ├── filters/         # Filtros de excepciones
│   │   ├── guards/          # Guards de autenticación/autorización
│   │   ├── interceptors/    # Interceptors de logging
│   │   └── pipes/           # Pipes de validación
│   ├── config/              # Configuraciones (DB, JWT, etc.)
│   ├── database/            # Migraciones y seeders
│   ├── temporal/            # Workflows de Temporal.io
│   │   ├── workflows/
│   │   └── activities/
│   └── main.ts              # Punto de entrada de la aplicación
├── test/                    # Testing
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # Documentación
├── scripts/                 # Scripts de utilidad
│   └── setup-db.sh         # Configuración de PostgreSQL
└── docker/                  # Configuraciones Docker
    ├── development/
    │   └── docker-compose.yml
    └── production/
```

**Scripts para creacion de carpetas:**

```bash
#!/usr/bin/env bash
set -euo pipefail

# Carpeta raíz del proyecto
ROOT_DIR="/Volumes/Backup/Projects/src/challengers/puul/"
PRJ_DIR="puul-tasks-api"

echo "Creando estructura de carpetas en ./${ROOT_DIR}/${PRJ_DIR} …"

mkdir -p "${ROOT_DIR}/${PRJ_DIR}"
cd "${ROOT_DIR}/${PRJ_DIR}"

# Src
mkdir -p src/common/{decorators,filters,guards,interceptors,pipes,enums,interfaces}
mkdir -p src/modules/{auth,users,tasks,teams,notifications,audit}
mkdir -p src/modules/users/{entities,dto}
mkdir -p src/modules/tasks/{entities,dto}
mkdir -p src/modules/teams/{entities,dto}
mkdir -p src/modules/notifications/{entities,dto}
mkdir -p src/modules/audit/{entities,dto}
mkdir -p src/{config,database}
mkdir -p src/temporal/{workflows,activities}

# Tests
mkdir -p test/{unit,integration,e2e}

# Docs, scripts y Docker
mkdir -p docs
mkdir -p scripts
mkdir -p docker/{development,production}

echo "¡Listo! Estructura creada:"
tree -d . # antes de ejecutar este script, instala la herramienta tree si no lo tienes.
```

**Crear las estructura de carpetas:**

1. Guarda el script en nuestra máquina, ejecutando `sudo nano make-dirs.sh`. copia y pegar el script.
2. Dale permisos de ejecución:
    
    ```bash
    sudo chmod +x make-dirs.sh
    ```
    
3. Ejecútalo desde la carpeta donde quieras crear el proyecto:
    
    ```bash
    sudo ./make-dirs.sh
    ```
    

**Dependencias del proyecto (en ambiente aislado):**

1. **`@nestjs/typeorm`**
    
    Módulo oficial de NestJS para integrar TypeORM como ORM. Facilita la inyección de repositorios y la configuración de la conexión a la base de datos.
    
2. **`typeorm`**
    
    Object-Relational Mapper para TypeScript/JavaScript. Permite definir entidades, relaciones y realizar consultas a PostgreSQL (u otras bases) de forma tipada.
    
3. **`pg`**
    
    Driver nativo de PostgreSQL para Node.js. Lo necesita TypeORM para comunicarse con la base de datos Postgres.
    
4. **`@nestjs/config`**
    
    Módulo de NestJS para gestión de configuración vía variables de entorno (`.env`). Simplifica cargar y validar settings (puertos, cadenas de conexión, secretos…).
    
5. **`@nestjs/jwt`**
    
    Provee utilidades para generar y verificar tokens JWT dentro de Nest (guardias, servicios, helpers).
    
6. **`@nestjs/passport`** + **`passport-jwt`**
    
    – `@nestjs/passport` adapta el framework Passport.js a NestJS, con decoradores y guardias listos para usar.
    
    – `passport-jwt` es la estrategia de Passport para autenticar usando JWT (lee el token del header, lo valida, etc.).
    
7. **`@nestjs/swagger`** + **`swagger-ui-express`**
    
    – `@nestjs/swagger` genera automáticamente el spec OpenAPI (Swagger) a partir de tus controladores y DTOs.
    
    – `swagger-ui-express` monta una interfaz web donde interactúas con tu API (probar endpoints, ver documentación).
    
8. **`class-validator`** + **`class-transformer`**
    
    – `class-validator` permite decorar tus DTOs con reglas de validación (`@IsString()`, `@IsEmail()`, `@Min()`, etc.).
    
    – `class-transformer` convierte (“transforma”) datos planos (JSON) a instancias de tus clases, aplicando transformaciones y exclusiones.
    
9. **`@nestjs/throttler`**
    
    Módulo de NestJS para implementar rate-limiting (límite de peticiones por IP/usuario) y proteger tu API de abusos o DoS básicos.
    
10. **`helmet`**
    
    Middleware que configura cabeceras HTTP seguras (HSTS, X-XSS-Protection, Content Security Policy, etc.) para mitigar ataques web comunes.
    

---

**Dependencias de desarrollo**

1. **`@types/node`**
    
    Tipos TypeScript para la API de Node.js (fs, path, process…), necesarios para compilar sin errores.
    
2. **`@types/passport-jwt`**
    
    Tipos TS para el paquete `passport-jwt`, de modo que puedas tipar correctamente estrategias y payloads JWT.
    
3. **`jest`**
    
    Framework de testing: runner, aserciones y mocks, ideal para pruebas unitarias y de integración.
    
4. **`@nestjs/testing`**
    
    Utilities de NestJS (módulos de prueba, creación de instancias en aislamiento) para facilitar tests que usan tu `AppModule`, servicios, inyección de dependencias, etc.
    
5. **`supertest`**
    
    Biblioteca para hacer requests HTTP a tu servidor dentro de tests y validar respuestas (status, body, headers).
    
6. **`eslint`**
    
    Linter para JavaScript/TypeScript: detecta errores de estilo, posibles bugs y mantiene tu código consistente.
    
7. **`prettier`**
    
    Formateador de código que aplica reglas automáticas de estilo (indentación, comillas, punto y coma…), complementa a ESLint.
    
8. **`@typescript-eslint/eslint-plugin`**
    
    Conjunto de reglas específicas de TypeScript para ESLint (por ejemplo, chequeos de tipos, no uso de `any`, consistencia en imports TS, etc.).
    
9. **`nestjs-supabase-auth`** 
    
    Conexion para Supabase Postegrsql in cloud.
    

```bash
# Caso tengo este error de permisos: 24 verbose FetchError: Invalid response body while trying to fetch https://registry.npmjs.org/@nestjs%2ftypeorm: EACCES: permission denied, open '/Users/geoffreyporto/.npm/_cacache/tmp/c81d04fb'

# Dar permiso para tu usuario del sistema e evita este error:
sudo chown -R 501:20 "/Users/geoffreyporto/.npm" 

# Dependencias principales
sudo npm install @nestjs/typeorm typeorm pg
sudo npm install @nestjs/config @nestjs/jwt @nestjs/passport passport-jwt
sudo npm install @nestjs/swagger swagger-ui-express
sudo npm install class-validator class-transformer
sudo npm install @nestjs/throttler helmet
sudo npm install nestjs-supabase-auth
sudo npm install bcrypt @types/bcrypt

# Dependencias de desarrollo
sudo npm install --save-dev @types/node @types/passport-jwt
sudo npm install --save-dev jest @nestjs/testing supertest
sudo npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin
```

Verificando el status de las intalaciones, buscando tener 0 vulnerabilidades:

![image.png](Readme%202214fbea3fce80318871d08a111a22f3/image%203.png)

**Scripts de package.json :**

```json
{
  "name": "puul-tasks-api",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.2.0",
    "@nestjs/throttler": "^6.4.0",
    "@nestjs/typeorm": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "helmet": "^8.1.0",
    "nestjs-supabase-auth": "^1.0.9",
    "passport-jwt": "^4.0.1",
    "pg": "^8.16.3",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.1",
    "typeorm": "^0.3.25"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.1.3",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.10.7",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.15.34",
    "@types/passport-jwt": "^4.0.1",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^8.35.0",
    "eslint": "^9.30.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.6.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.1.1",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  },
  "volta": {
    "node": "23.6.1",
    "npm": "10.9.2"
  }
}
```

**Importante:**

Esta configuración final busca garantizar que cada desarrollador use exactamente las mismas versiones de Node.js y npm para  mantener la consistencia entre ambientes de desarrollo, staging y producción.

## **2. Configuración de Base de datos**

### Creacion de la DB en Supabase

**Project name:** puul-taks-api

**Region:** East US (Ohio)

**Project api Keys:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeXd3anVyZHp3aWVsZHBsb291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjMzMDYsImV4cCI6MjA2Njc5OTMwNn0.lU_fRmHJ_36zQC_L6LdeyYWXO2g1MmF155Euvz5lFUs

**Service Role:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeXd3anVyZHp3aWVsZHBsb291Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyMzMwNiwiZXhwIjoyMDY2Nzk5MzA2fQ.E1tQI5qnRlRFB96B6J2g0mgKSH6fiYMB25kRSEkZlIU

**NestJS DB connection**

Example: https://github.com/hiro1107/nestjs-supabase-auth

**URL for connect:**

```jsx
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.hhywwjurdzwieldploou:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.hhywwjurdzwieldploou:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
```

![image.png](Readme%202214fbea3fce80318871d08a111a22f3/image%204.png)

```bash

# 5. Iniciar desarrollo
npm run start:dev
```

**Migraciones de datos**

**Opción A:** Con el Supabase CLI

1. **Instala el CLI**
    - **macOS (Homebrew):**
        
        ```bash
        brew tap supabase/tap && brew install supabase
        ```
        
    
    **Salida:** 
    
    ```bash
    (base) geoffreyporto@Mac-Studio-de-Geoffrey puul-tasks-api % brew tap supabase/tap && brew install supabase
    ==> Tapping supabase/tap
    Cloning into '/opt/homebrew/Library/Taps/supabase/homebrew-tap'...
    remote: Enumerating objects: 3918, done.
    remote: Counting objects: 100% (19/19), done.
    remote: Compressing objects: 100% (18/18), done.
    remote: Total 3918 (delta 5), reused 1 (delta 1), pack-reused 3899 (from 3)
    Receiving objects: 100% (3918/3918), 1009.38 KiB | 4.35 MiB/s, done.
    Resolving deltas: 100% (1511/1511), done.
    Tapped 3 formulae (16 files, 1.1MB).
    ==> Downloading https://formulae.brew.sh/api/formula.jws.json
    ==> Downloading https://formulae.brew.sh/api/cask.jws.json
    ==> Fetching supabase/tap/supabase
    ==> Downloading https://github.com/supabase/cli/releases/download/v2.26.9/supabase_darwin_arm64.tar.gz
    ==> Downloading from https://objects.githubusercontent.com/github-production-release-asset-2e65be/314160187/4c67e1a5-70ab-461b-8fd1-28407919ba53?X-Amz-Algori
    ###################################################################################################################################################### 100.0%
    ==> Installing supabase from supabase/tap
    Warning: Your Xcode (15.4) is outdated.
    Please update to Xcode 16.2 (or delete it).
    Xcode can be updated from the App Store.
    
    This is a Tier 2 configuration:
      https://docs.brew.sh/Support-Tiers#tier-2
    Do not report any issues to Homebrew/* repositories!
    Read the above document instead before opening any issues or PRs.
    
    Warning: A newer Command Line Tools release is available.
    Update them from Software Update in System Settings.
    
    If that doesn't show you any updates, run:
      sudo rm -rf /Library/Developer/CommandLineTools
      sudo xcode-select --install
    
    Alternatively, manually download them from:
      https://developer.apple.com/download/all/.
    You should download the Command Line Tools for Xcode 16.2.
    
    This is a Tier 2 configuration:
      https://docs.brew.sh/Support-Tiers#tier-2
    Do not report any issues to Homebrew/* repositories!
    Read the above document instead before opening any issues or PRs.
    
    🍺  /opt/homebrew/Cellar/supabase/2.26.9: 9 files, 35.8MB, built in 14 seconds
    ==> Running `brew cleanup supabase`...
    Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
    Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
    ==> Caveats
    zsh completions have been installed to:
      /opt/homebrew/share/zsh/site-functions
    ```
    
    - **Linux/Ubuntu/Debian (npm):**
        
        ```bash
        
        npm install -g supabase
        ```
        
2. **Inicializa tu carpeta de migraciones**
    
    En la raíz de tu proyecto:
    
    ```bash
    supabase init
    ```
    
    Esto creará un directorio `supabase/migrations` y un fichero `supabase/config.toml`.
    
    **Cuidado, nuestro proyecto challenger NO usa Deno, sino Node, contesta con “N”:**
    
    ```bash
    (base) geoffreyporto@Mac-Studio-de-Geoffrey puul-tasks-api % sudo supabase init
    Password:
    Generate VS Code settings for Deno? [y/N] **N**
    Generate IntelliJ Settings for Deno? [y/N] **N**
    ```
    
3. **Añade tus scripts**
    
    Copia tus archivos `.sql` a `supabase/migrations/DML y supabase/migrations/DDL/`, nombrándolos con un prefijo incremental, por ejemplo:
    
    ```
    # Ejemplo
    
    supabase/migrations/DML
    ├── 001_create_users_table.sql
    ├── 002_create_tasks_table.sql
    └── 003_alter_tasks_add_index.sql
    
    supabase/migrations/DDL
    ├── 001_create_users_table.sql
    ├── 002_create_tasks_table.sql
    └── 003_alter_tasks_add_index.sql
    ```
    
4. **Configura la conexión**
    
    Edita `supabase/config.toml` para apuntar a tu proyecto remoto o local. Por ejemplo:
    
    ```toml
    [db]
    host = "db.<tu-proyecto>.supabase.co"
    port = 5432
    user = "postgres"
    password = "<tu-password>"
    database = "postgres"
    
    ```
    
5. **Ir al** [README - DB Migration](https://www.notion.so/README-DB-Migrations-2214fbea3fce8006b212c32f487f3c93?pvs=21)
6. **SI deseas aplicar las migraciones automatica**
    
    ```bash
    supabase db push
    ```
    
    Esto va leyendo los `.sql` en `migrations/` en orden y los ejecuta uno a uno, marcando cuáles ya aplicaste.
    

---

## Alternativa : Migraciones de TypeORM en NestJS

Si estás usando TypeORM en tu proyecto NestJS, puedes convertir esos `.sql` en *migrations* de TypeORM:

1. **Configura tu Data Source** en `data-source.ts`, apuntando a la misma `DATABASE_URL`.
2. **Genera una migration** (opcional):
    
    ```bash
    
    npx typeorm-ts-node-commonjs migration:generate src/database/migrations/CreateUsers
    ```
    
3. **Corre las migraciones**:
    
    ```bash
    
    npx typeorm-ts-node-commonjs migration:run
    ```
    

Eso te permite usar el motor de migraciones de TypeORM (que guarda su propio historial) en lugar de archivos `.sql` planos.

---

**Resumen**:

- Para migraciones SQL planas en Supabase lo más cómodo es el **Supabase CLI** (`supabase db push`).
- Si ya tienes `.sql`, puedes aplicarlas con **psql** en un simple bucle.
- O bien, integrar las migraciones en NestJS con **TypeORM** si quieres control más fino y versionado interno.

### **Configuración adicional para ambos sistemas:**

```bash

# Instalar Git (si no está instalado)# Ubuntu/Debian:
sudo apt install git

# macOS:
brew install git

# Configurar Git globalmente
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

---

## 

## 2. **Configuración de Base de Datos PostgreSQL**

**Acciones:**

- Configurar conexión PostgreSQL con TypeORM
- Crear entidades siguiendo el diseño del dominio:

```tsx

// users/entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['member', 'admin'] })
  role: UserRole;

  @OneToMany(() => TaskAssignment, assignment => assignment.user)
  taskAssignments: TaskAssignment[];
}

// tasks/entities/task.entity.ts
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  estimatedHours: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column()
  dueDate: Date;

  @Column({ type: 'enum', enum: ['active', 'completed'] })
  status: TaskStatus;

  @OneToMany(() => TaskAssignment, assignment => assignment.task)
  assignments: TaskAssignment[];
}

```

## 3. **Implementación del Sistema de Autenticación y Autorización**

**Acciones:**

- Configurar JWT con estrategia asimétrica (RS256)
- Implementar Guards para roles (member/admin)
- Crear middleware de autenticación:

```tsx

// auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// auth/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
// Lógica de validación de roles
  }
}

```

## 4. **Desarrollo de DTOs y Validaciones**

**Acciones:**

Dentro de la carpta del proyecto:

```bash
# Generar módulos principales
nest generate module modules/users
nest generate service modules/users
nest generate controller modules/users
```

- Crear DTOs con validaciones estrictas usando `class-validator`
- Implementar pipes de validación y transformación:

```tsx

// users/dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}

// tasks/dto/create-task.dto.ts
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0.1)
  estimatedHours: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsDateString()
  dueDate: string;

  @IsArray()
  @IsUUID(4, { each: true })
  assignedUserIds: string[];
}

```

## 5. **Implementación de Módulos Core (Users y Tasks)**

**Acciones:**

Dentro de la carpta del proyecto:

```bash

nest generate module modules/tasks  
nest generate service modules/tasks
nest generate controller modules/tasks
```

- Desarrollar servicios siguiendo Repository Pattern
- Implementar controllers con endpoints básicos
- Configurar documentación Swagger:

```tsx

// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
// Implementar lógica de negocio
  }

  async findAllWithFilters(filters: UserFiltersDto): Promise<UserWithStatsDto[]> {
// Query con JOIN para obtener stats de tareas
  }
}

// tasks/tasks.controller.ts
@Controller('tasks')
@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
}

```

**Configuraciones adicionales en estos pasos:**

- Configurar Helmet para headers de seguridad
- Implementar rate limiting con `@nestjs/throttler`
- Configurar CORS apropiadamente
- Configurar logging con Winston
- Configurar Swagger con `@nestjs/swagger`

Estos 5 pasos establecen la base sólida del proyecto siguiendo Clean Architecture y las mejores prácticas de seguridad definidas en los estándares técnicos de Puul.

1. **Inicializar el proyecto NestJS y configuración básica**
    - Crear repositorio Git y scaffold con `nest new puul-backend` usando TypeScript.
    - Instalar dependencias clave:
        
        ```bash
        npm install @nestjs/typeorm typeorm pg class-validator class-transformer @nestjs/swagger @nestjs/throttler helmet winston
        ```
        
    - Configurar ESLint/Prettier, scripts de lint y build.
    - Activar Swagger (`@nestjs/swagger`) y Helmet para cabeceras de seguridad .
2. **Diseñar la estructura en capas (Clean Architecture)**
    - Carpetas principales:
        
        ```
        
        puul-tasks-api/
        ├── .nvmrc                 # Si usas NVM
        ├── package.json           # Con volta config si usas Volta
        ├── src/
        │   ├── modules/
        │   │   ├── auth/          # Autenticación JWT
        │   │   ├── users/         # Gestión de usuarios  
        │   │   └── tasks/         # Gestión de tareas
        │   ├── common/
        │   │   ├── decorators/    # Decoradores personalizados
        │   │   ├── filters/       # Filtros de excepciones
        │   │   ├── guards/        # Guards de autenticación/autorización
        │   │   ├── interceptors/  # Interceptors de logging
        │   │   └── pipes/         # Pipes de validación
        │   ├── config/            # Configuraciones (DB, JWT, etc.)
        │   ├── database/          # Migraciones y seeders
        │   └── main.ts
        ├── .env
        ├── .env.example
        └── README.md
        ```
        
    - Cada módulo contendrá Controller → Service → Repository, sin acoplamientos cruzados .
3. **Configurar la conexión a PostgreSQL y aplicar Repository Pattern**
    - En `database/` definir el `TypeOrmModule.forRoot()` apuntando a la BD.
    - Crear repositorios personalizados (`@InjectRepository`) para `User` y `Task` siguiendo el patrón Repository (abstracción de acceso a datos) .
4. **Definir entidades y DTOs con validación**
    - Modelar entidad **User** con campos: `name`, `email`, `role` (miembro|administrador).
    - Modelar entidad **Task** con `title`, `description`, `estimateHours`, `dueDate`, `status`, `cost`, y relación many-to-many con `User` .
    - Crear DTOs (`CreateUserDto`, `ListUsersFilterDto`, `CreateTaskDto`…) usando `class-validator` y `class-transformer` para sanitizar y validar entrada .
5. **Implementar módulo de Usuarios (primer endpoint)**
    - **Controller**:
        - `POST /users` → crear usuario.
        - `GET /users` → listar usuarios con filtros por `name`, `email`, `role`, e incluir count de tareas terminadas + suma de costo por usuario.
    - **Service**: lógica de negocio, consultas con repositorio.
    - **Repository**: métodos para filtros dinámicos y agregados de estadísticas.
    - Añadir Pipes de validación, manejo de errores centralizado y logging (Winston) .

Con estos cinco pasos tendrás la base del proyecto alineada al challenge y a los estándares de Puul.

**Delpoyment**

For deploy on vercel.com, create a local development environment: vercel.json
add the below content:
```json
{
    "version": 2,
    "builds": [
      {
        "src": "src/main.ts",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "src/main.ts",
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
      }
    ]
  }
```

```bash
npm run start:dev

#output:

[9:41:08] File change detected. Starting incremental compilation...
[9:41:08] Found 0 errors. Watching for file changes.

[Nest] 35247  - 30/06/2025, 9:41:09     LOG [NestFactory] Starting Nest application...
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TypeOrmModule dependencies initialized +8ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +647ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TypeOrmModule dependencies initialized +1ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] UsersModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [InstanceLoader] TasksModule dependencies initialized +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [RoutesResolver] AppController {/}: +9ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [RouterExplorer] Mapped {/, GET} route +4ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [RoutesResolver] UsersController {/users}: +1ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [RoutesResolver] TasksController {/tasks}: +0ms
[Nest] 35247  - 30/06/2025, 9:41:09     LOG [NestApplication] Nest application successfully started +3ms
```