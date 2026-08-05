# Trabajo Final de Introducción al Desarrollo de Software

### Descripción del proyecto

Este proyecto consiste en el desarrollo de un sitio web para el control y administración de un gimnasio. El sistema permite gestionar la información relacionada con socios, profesores y clases, ofreciendo una solución digital que reemplaza el manejo manual o en planillas de estos datos.

El objetivo es aplicar de forma práctica los conocimientos adquiridos durante la cursada de Introducción al Desarrollo de Software, construyendo una aplicación full-stack completa: desde el modelado de la base de datos hasta la exposición de una API REST y su consumo desde un frontend.

Esta aplicación asume un único usuario administrador operando el sistema, como por ejemplo, el administrador del gimnasio. No implementa autenticación ni control de roles, por lo que cualquier persona con acceso a la aplicación puede ver y modificar los datos de todas las entidades.

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

# Guía de Instalación y Ejecución

Seguí estos pasos para clonar y levantar todo el entorno de la aplicación (Base de datos, Backend y Frontend) mediante contenedores.

### Prerrequisitos
Asegurate de tener instalado en tu sistema:
* [Docker](https://www.docker.com/) y Docker Compose
* [Git](https://git-scm.com/)
* `make` (Opcional, para usar los comandos automatizados)

### 1. Clonar el repositorio
Abrí tu terminal y cloná el repositorio en tu computadora:

```bash
git clone https://github.com/DamianMartinezzz/Grupo-FJND.git
cd GRUPO-FJND
```

### 2. Levantar la base de datos y el backend
Ejecutá el siguiente comando para poner en marcha los servicios principales (PostgreSQL y el servidor backend):

```bash
make start-db
```

### 3. Levantar el frontend
En una nueva pestaña o ventana de la terminal, utilizá el comando correspondiente para iniciar el contenedor del frontend:

```bash
make start-front
```

### 4. Acceder a la aplicación
Una vez que todos los contenedores estén corriendo de forma exitosa, ya podés utilizar el sistema:

-Frontend: Ingresá desde tu navegador a http://localhost:8080

-Backend: Quedará escuchando y procesando las peticiones de la API en el puerto 3000.


## Comandos disponibles

El proyecto incluye un `makefile` (ubicado en `backend/`) que automatiza el levantado de la base de datos y del servidor en un solo paso:

| Comando | Descripción |
|---|---|
| `make start-db` | Levanta únicamente el contenedor de PostgreSQL |
| `make stop-db` | Detiene el contenedor de PostgreSQL |
| `make start-front` | Levanta únicamente el frontend |
| `make stop-front` | Detiene el contenedor del frontend |

También hay una serie de comandos que se pueden utilizar, siempre y cuando estés párado en `Grupo-FJND/backend/` :

| Comando | Descripción |
|---|---|
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
