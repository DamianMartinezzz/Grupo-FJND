const { Pool } = require('pg');

const dbClient = new Pool({
    user: 'postgres',
    port: 5432,
    host: 'localhost',
    database: 'gimnasio',
    password: 'postgres',
});


async function getAllSocios() {
    const result = await dbClient.query('SELECT * FROM socios');
    return result.rows;
}

async function getOneSocio(id) {
    const result = await dbClient.query('SELECT * FROM socios WHERE id_socio = $1 LIMIT 1', [id]);
    return result.rows[0];
}

async function createSocio(nombre, apellido, dni, mail, telefono) {
    try {
        const result = await dbClient.query(
            'INSERT INTO socios (nombre, apellido, dni, mail, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, apellido, dni, mail, telefono]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23505') { // unique_violation (DNI duplicado)
            return { error: 'duplicate_dni' };
        }
        throw err;
    }
}

async function deleteSocio(id) {
  try {
    const result = await dbClient.query('DELETE FROM socios WHERE id_socio = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') { // codigo de Postgres: foreign_key_violation
      return { error: 'foreign_key' };
    }
    throw err; // cualquier otro error lo dejo subir sin manejar
  }
}

async function updateSocio(id, nombre, apellido, dni, mail, telefono) {
  const result = await dbClient.query(
    'UPDATE socios SET nombre = $1, apellido = $2, dni = $3, mail = $4, telefono = $5 WHERE id_socio = $6 RETURNING *',
    [nombre, apellido, dni, mail, telefono, id]
  );

  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

async function getAllProfesores() {
  const result = await dbClient.query('SELECT * FROM profesores');
  return result.rows;
}

async function getOneProfesor(id) {
  const result = await dbClient.query('SELECT * FROM profesores WHERE idprofesor = $1 LIMIT 1', [id]);
  return result.rows[0];
}

async function createProfesor(nombre, apellido, dni, mail, telefono) {
  try {
    const result = await dbClient.query(
      'INSERT INTO profesores (nombre, apellido, dni, mail, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, apellido, dni, mail, telefono]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') { // unique_violation (DNI duplicado)
      return { error: 'duplicate_dni' };
    }
    throw err;
  }
}

async function updateProfesor(id, nombre, apellido, dni, mail, telefono) {
  try {
    const result = await dbClient.query(
      'UPDATE profesores SET nombre = $1, apellido = $2, dni = $3, mail = $4, telefono = $5 WHERE idprofesor = $6 RETURNING *',
      [nombre, apellido, dni, mail, telefono, id]
    );
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      return { error: 'duplicate_dni' };
    }
    throw err;
  }
}

async function deleteProfesor(id) {
  try {
    const result = await dbClient.query('DELETE FROM profesores WHERE idprofesor = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') { // foreign_key_violation
      return { error: 'foreign_key' };
    }
    throw err;
  }
}

async function getAllEjercicios() {
  const result = await dbClient.query('SELECT * FROM ejercicios');
  return result.rows;
}

async function getOneEjercicio(id) {
  const result = await dbClient.query('SELECT * FROM ejercicios WHERE id_ejercicio = $1 LIMIT 1', [id]);
  return result.rows[0];
}

async function createEjercicio(nombre, grupoMuscular, descripcion) {
  const result = await dbClient.query(
    'INSERT INTO ejercicios (nombre, grupo_muscular, descripcion) VALUES ($1, $2, $3) RETURNING *',
    [nombre, grupoMuscular, descripcion]
  );
  return result.rows[0];
}

async function updateEjercicio(id, nombre, grupoMuscular, descripcion) {
  const result = await dbClient.query(
    'UPDATE ejercicios SET nombre = $1, grupo_muscular = $2, descripcion = $3 WHERE id_ejercicio = $4 RETURNING *',
    [nombre, grupoMuscular, descripcion, id]
  );
  if (result.rowCount === 0) {
    return { error: 'not_found' };
  }
  return result.rows[0];
}

async function deleteEjercicio(id) {
  try {
    const result = await dbClient.query('DELETE FROM ejercicios WHERE id_ejercicio = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') {
      return { error: 'foreign_key' };
    }
    throw err;
  }
}

// Funciones de Clases

async function getAllClases() {
    const result = await dbClient.query(`
    SELECT c.*, p.nombre AS nombre_profesor, p.apellido AS apellido_profesor
    FROM clases c
    JOIN profesores p ON c.id_profesor = p.idprofesor
  `);
  return result.rows;
}

async function getOneClase(id) {
  const result = await dbClient.query(`
    SELECT c.*, p.nombre AS nombre_profesor, p.apellido AS apellido_profesor
    FROM clases c
    JOIN profesores p ON c.id_profesor = p.idprofesor
    WHERE c.id_clase = $1
    LIMIT 1
  `, [id]);
  return result.rows[0];
}

async function createClase(idProfesor, nombre, descripcion, diaSemana, horaInicio, horaFin, cupoMaximo, estado) {
  try {
    const result = await dbClient.query(
      `INSERT INTO clases (id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [idProfesor, nombre, descripcion, diaSemana, horaInicio, horaFin, cupoMaximo, estado]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') { // el id_profesor no existe
      return { error: 'invalid_profesor' };
    }
    throw err;
  }
}

async function updateClase(id, idProfesor, nombre, descripcion, diaSemana, horaInicio, horaFin, cupoMaximo, estado) {
  try {
    const result = await dbClient.query(
      `UPDATE clases SET id_profesor = $1, nombre = $2, descripcion = $3, dia_semana = $4,
       hora_inicio = $5, hora_fin = $6, cupo_maximo = $7, estado = $8, fecha_modificacion = NOW()
       WHERE id_clase = $9 RETURNING *`,
      [idProfesor, nombre, descripcion, diaSemana, horaInicio, horaFin, cupoMaximo, estado, id]
    );
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') {
      return { error: 'invalid_profesor' };
    }
    throw err;
  }
}

async function deleteClase(id) {
  try {
    const result = await dbClient.query('DELETE FROM clases WHERE id_clase = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') {
      return { error: 'foreign_key' };
    }
    throw err;
  }
}






module.exports = {
getAllSocios,
getOneSocio,
createSocio,
deleteSocio,
updateSocio,    
getAllProfesores,
getOneProfesor,
createProfesor,
updateProfesor,
deleteProfesor,
getAllEjercicios, 
getOneEjercicio, 
createEjercicio, 
updateEjercicio, 
deleteEjercicio,
getAllClases, 
getOneClase, 
createClase, 
updateClase, 
deleteClase,
};






