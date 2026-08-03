const { dbClient } = require('./gimnasio');

async function getAllClases() {
    const result = await dbClient.query('SELECT * FROM clases');
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
getAllClases, 
getOneClase, 
createClase, 
updateClase, 
deleteClase,
};