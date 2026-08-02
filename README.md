# Trabajo Final de Introducción al Desarrollo de Software

### Descripción del proyecto

Este proyecto consiste en el desarrollo de un sitio web para el control y administración de un gimnasio. El sistema permite gestionar la información relacionada con socios, profesores y clases, ofreciendo una solución digital que reemplaza el manejo manual o en planillas de estos datos.

El objetivo es aplicar de forma práctica los conocimientos adquiridos durante la cursada de Introducción al Desarrollo de Software, construyendo una aplicación full-stack completa: desde el modelado de la base de datos hasta la exposición de una API REST y su consumo desde un frontend.

### Tecnologías utilizadas

-Backend: Node.js + Express

-Base de datos: PostgreSQL (acceso mediante SQL directo, sin ORM)

-Contenedores: Docker y Docker Compose

-Control de versiones: Git, con flujo de trabajo basado en ramas por feature y pull requests

### Requisitos previos

Antes de levantar el proyecto, es necesario tener instalado:

-Docker y Docker Compose

-Node.js (para desarrollo local del backend)

## Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd GRUPO-FJND
```

### 2. Levantar los servicios con Docker Compose

Desde la raíz del proyecto:

```bash
docker compose up
```

Esto va a levantar el contenedor de **PostgreSQL**, creando la base de datos y ejecutando los scripts `esquema.sql` y `datosinic.sql` para dejarla lista con su estructura y datos de prueba.

Para levantarlo en segundo plano:

```bash
docker compose up -d
```

Para detener los servicios:

```bash
docker compose down
```

### 3. Instalar las dependencias del backend

Parado en la carpeta `backend/`:

```bash
cd backend
npm install
```

Este comando lee el `package.json` y descarga en `node_modules/` todas las dependencias necesarias (`express`, `pg`, `nodemon`, entre otras).

### 4. Correr el servidor backend

En modo desarrollo (con recarga automática ante cambios, usando `nodemon`):

```bash
npm run dev
```

Si todo funciona correctamente, la terminal debería mostrar algo similar a:

```
[nodemon] starting `node app/api.js`
Server Listening on PORT: 3000
```

El servidor queda escuchando en **http://localhost:3000**

## Comandos disponibles

El proyecto incluye un `makefile` (ubicado en `backend/`) que automatiza el levantado de la base de datos y del servidor en un solo paso:

| Comando | Descripción |
|---|---|
| `make run` | Levanta la base de datos y el servidor backend juntos (recomendado) |
| `make start-db` | Levanta únicamente el contenedor de PostgreSQL |
| `make start-backend` | Levanta únicamente el servidor backend con nodemon |
| `make stop-db` | Detiene el contenedor de PostgreSQL |


También hay una serie de comandos que se pueden utilizar, siempre y cuando estés párado en `Grupo-FJND/backend/` :


| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor backend con nodemon |
| `docker compose up` | Levanta los contenedores (base de datos, etc.) |
| `docker compose down` | Detiene y elimina los contenedores |
| `npm install` | Instala las dependencias del backend |

## Endpoints principales

### Socios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/socios` | Lista todos los socios |
| GET | `/socios/:id` | Obtiene un socio por ID |
| POST | `/socios` | Crea un nuevo socio |
| PUT | `/socios/:id` | Actualiza un socio existente |
| DELETE | `/socios/:id` | Elimina un socio |

### Profesores

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/profesores` | Lista todos los profesores |
| GET | `/profesores/:id` | Obtiene un profesor por ID |
| POST | `/profesores` | Crea un nuevo profesor |
| PUT | `/profesores/:id` | Actualiza un profesor existente |
| DELETE | `/profesores/:id` | Elimina un profesor |

### Clases

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clases` | Lista todas las clases |
| GET | `/clases/:id` | Obtiene una clase por ID |
| POST | `/clases` | Crea una nueva clase |
| PUT | `/clases/:id` | Actualiza una clase existente |
| DELETE | `/clases/:id` | Elimina una clase |

## Flujo de trabajo (Git)

El desarrollo se organiza mediante:

-Una rama principal (`main`) que contiene la version estable del proyecto

-Ramas de feature para cada nueva funcionalidad o corrección

-Pull requests para integrar los cambios a `main`, permitiendo revisión previa por parte del equipo
