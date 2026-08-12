CREATE TABLE Socios (
    Id_Socio SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Dni VARCHAR(20) UNIQUE NOT NULL,
    Telefono VARCHAR(30),
    Mail VARCHAR(150),
    Fecha_Nacimiento DATE,
    Fecha_Alta TIMESTAMP,
    Fecha_Baja TIMESTAMP,
    Fecha_Modificacion TIMESTAMP
);

CREATE TABLE Profesores (
    Id_Profesor SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    DNI VARCHAR(20) UNIQUE NOT NULL,
    Telefono VARCHAR(30),
    Mail VARCHAR(150)
);

CREATE TABLE Ejercicios (
    Id_Ejercicio SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Grupo_Muscular VARCHAR(100),
    Descripcion TEXT
);

CREATE TABLE Rutinas (
    Id_Rutina SERIAL PRIMARY KEY,
    Id_Socio INT NOT NULL,
    Id_Profesor INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Fecha_Inicio TIMESTAMP,
    Fecha_Fin TIMESTAMP,
    Fecha_Modificacion TIMESTAMP,
    Estado VARCHAR(50),
    CONSTRAINT fk_rutina_socio FOREIGN KEY (Id_Socio) REFERENCES Socios(Id_Socio) ON DELETE CASCADE,
    CONSTRAINT fk_rutina_profesor FOREIGN KEY (Id_Profesor) REFERENCES Profesores(Id_Profesor) ON DELETE CASCADE
);

CREATE TABLE DetalleRutina (
    Id_Detalle SERIAL PRIMARY KEY,
    Id_Rutina INT NOT NULL,
    Id_Ejercicio INT NOT NULL,
    Dia INT NOT NULL,
    Orden INT NOT NULL,
    Series INT NOT NULL,
    Repeticiones_Desde INT NOT NULL,
    Repeticiones_Hasta INT NOT NULL,
    Descanso INT,
    CONSTRAINT fk_detalle_rutina FOREIGN KEY (Id_Rutina) REFERENCES Rutinas(Id_Rutina) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_ejercicio FOREIGN KEY (Id_Ejercicio) REFERENCES Ejercicios(Id_Ejercicio) ON DELETE CASCADE
);

CREATE TABLE Reporte (
    Id_Reporte SERIAL PRIMARY KEY,
    Id_Rutina INT NOT NULL,
    Id_Socio INT NOT NULL,
    Dia INT NOT NULL,
    Fecha_Asistencia TIMESTAMP NOT NULL,
    CONSTRAINT fk_reporte_rutina FOREIGN KEY (Id_Rutina) REFERENCES Rutinas(Id_Rutina) ON DELETE CASCADE,
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (Id_Socio) REFERENCES Socios(Id_Socio) ON DELETE CASCADE
);

CREATE TABLE DetalleReporte (
    Id_Detalle SERIAL PRIMARY KEY,
    Id_Reporte INT NOT NULL,
    Id_Ejercicio INT NOT NULL,
    Series_Realizadas INT,
    Repeticiones_Realizadas INT,
    Peso_Utilizado NUMERIC(8,2),
    Observaciones TEXT,
    CONSTRAINT fk_detalle_reporte FOREIGN KEY (Id_Reporte) REFERENCES Reporte(Id_Reporte) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_reporte_ej FOREIGN KEY (Id_Ejercicio) REFERENCES Ejercicios(Id_Ejercicio) ON DELETE CASCADE
);

CREATE TABLE Clases (
    Id_Clase SERIAL PRIMARY KEY,
    Id_Profesor INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Dia_semana VARCHAR(20),
    Hora_Inicio TIME,
    Hora_Fin TIME,
    Cupo_Maximo INT,
    Estado VARCHAR(50),
    Fecha_Modificacion TIMESTAMP,
    CONSTRAINT fk_clase_profesor FOREIGN KEY (Id_Profesor) REFERENCES Profesores(Id_Profesor) ON DELETE CASCADE
);

CREATE TABLE Usuario_Clase (
    Id_Usuario_Clase SERIAL PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Clase INT NOT NULL,
    Fecha_Inscripcion TIMESTAMP,
    Fecha_Baja TIMESTAMP,
    Estado VARCHAR(50),
    CONSTRAINT fk_usuario_clase_usuario FOREIGN KEY (Id_Usuario) REFERENCES Socios(Id_Socio) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_clase_clase FOREIGN KEY (Id_Clase) REFERENCES Clases(Id_Clase) ON DELETE CASCADE
);
