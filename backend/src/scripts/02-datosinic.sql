BEGIN;

--------------------------
-- SOCIOS
--------------------------
INSERT INTO Socios (Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento, Fecha_Alta)
VALUES
('Juan', 'Pérez', '40111222', '1122334455', 'juan@mail.com', '1998-05-10', NOW()),
('María', 'Gómez', '39222333', '1133445566', 'maria@mail.com', '1997-09-21', NOW()),
('Lucas', 'Díaz', '38444555', '1144556677', 'lucas@mail.com', '2000-01-15', NOW()),
('Sofía', 'Ruiz', '40555666', '1155667788', 'sofia@mail.com', '1999-12-02', NOW()),
('Tomás', 'Álvarez', '41888999', '1166778899', 'tomas@mail.com', '1996-07-30', NOW());

--------------------------
-- PROFESORES
--------------------------
INSERT INTO Profesores (Nombre, Apellido, DNI, Telefono, Mail)
VALUES
('Ana', 'López', '30111222', '1177889900', 'ana@gym.com'),
('Carlos', 'Fernández', '30222333', '1188990011', 'carlos@gym.com'),
('Valentina', 'Soto', '30333444', '1199001122', 'valentina@gym.com');

--------------------------
-- EJERCICIOS
--------------------------
INSERT INTO Ejercicios (Nombre, Grupo_Muscular, Descripcion)
VALUES
('Press banca', 'Pecho', 'Ejercicio básico para desarrollo de pectorales'),
('Sentadilla', 'Piernas', 'Ejercicio compuesto para tren inferior'),
('Peso muerto', 'Espalda', 'Ejercicio completo de fuerza'),
('Curl de bíceps', 'Bíceps', 'Aislamiento de bíceps con mancuernas o barra'),
('Dominadas', 'Espalda', 'Ejercicio con peso corporal para dorsales'),
('Abdominales', 'Core', 'Trabajo de zona media del cuerpo'),
('Remo con barra', 'Espalda', 'Ejercicio de tracción horizontal'),
('Press militar', 'Hombros', 'Desarrollo de deltoides con barra o mancuernas');

--------------------------
-- CLASES
--------------------------
INSERT INTO Clases (Id_Profesor, Nombre, Descripcion, Dia_semana, Hora_Inicio, Hora_Fin, Cupo_Maximo, Estado, Fecha_Modificacion)
VALUES
(1, 'Yoga', 'Clase de flexibilidad y relajación', 'Lunes', '08:00', '09:00', 20, 'Activa', NOW()),
(2, 'Spinning', 'Clase de ciclismo indoor', 'Miércoles', '18:00', '19:00', 15, 'Activa', NOW()),
(3, 'Funcional', 'Entrenamiento funcional de alta intensidad', 'Viernes', '19:00', '20:00', 18, 'Activa', NOW());

--------------------------
-- RUTINAS
--------------------------
INSERT INTO Rutinas (Id_Socio, Id_Profesor, Nombre, Fecha_Inicio, Estado, Fecha_Modificacion)
VALUES
(1, 1, 'Rutina Fuerza Inicial', NOW(), 'Activa', NOW()),
(2, 2, 'Rutina Cardio', NOW(), 'Activa', NOW()),
(3, 1, 'Rutina Hipertrofia', NOW(), 'Activa', NOW());

--------------------------
-- DETALLE RUTINA
--------------------------
INSERT INTO DetalleRutina (Id_Rutina, Id_Ejercicio, Dia, Orden, Series, Repeticiones_Desde, Repeticiones_Hasta, Descanso)
VALUES
-- Rutina 1
(1, 1, 1, 1, 4, 8, 10, 90),
(1, 2, 1, 2, 4, 10, 12, 90),

-- Rutina 2
(2, 6, 1, 1, 5, 15, 20, 60),
(2, 5, 1, 2, 4, 8, 12, 90),

-- Rutina 3
(3, 3, 1, 1, 4, 6, 8, 120),
(3, 7, 1, 2, 4, 8, 10, 90);

--------------------------
-- REPORTES (ASISTENCIA)
--------------------------
INSERT INTO Reporte (Id_Rutina, Id_Socio, Dia, Fecha_Asistencia)
VALUES
(1, 1, 1, NOW()),
(2, 2, 1, NOW()),
(3, 3, 1, NOW());

--------------------------
-- DETALLE REPORTE
--------------------------
INSERT INTO DetalleReporte (Id_Reporte, Id_Ejercicio, Series_Realizadas, Repeticiones_Realizadas, Peso_Utilizado, Observaciones)
VALUES
(1, 1, 4, 10, 60.00, 'Buen rendimiento'),
(1, 2, 4, 12, 80.00, 'Técnica correcta'),

(2, 6, 5, 18, NULL, 'Cardio intenso'),
(2, 5, 4, 10, NULL, 'Fatiga media'),

(3, 3, 4, 8, 100.00, 'Progresión adecuada'),
(3, 7, 4, 10, 70.00, 'Buen control');

--------------------------
-- USUARIOS A CLASES
--------------------------
INSERT INTO Usuario_Clase (Id_Usuario, Id_Clase, Fecha_Inscripcion, Estado)
VALUES
(1, 1, NOW(), 'Inscripto'),
(2, 2, NOW(), 'Inscripto'),
(3, 3, NOW(), 'Inscripto'),
(4, 1, NOW(), 'Inscripto'),
(5, 2, NOW(), 'Inscripto');

COMMIT;