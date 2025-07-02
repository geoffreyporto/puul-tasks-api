#!/usr/bin/env bash
set -euo pipefail

# Carpeta raíz del proyecto
ROOT_DIR="/Volumes/Backup/Projects/src/challengers/puul/"
PRJ_DIR="puul-tasks-api"

echo "Creando estructura de carpetas en ./${ROOT_DIR}/${PRJ_DIR} …"

mkdir -p "${ROOT_DIR}/${PRJ_DIR}"
cd "${ROOT_DIR}/${PRJ_DIR}"

# Src
mkdir -p src/common/{decorators,filters,guards,interceptors,pipes,enums,interfaces,utils}
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
tree -d .
