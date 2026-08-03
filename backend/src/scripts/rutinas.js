const { dbClient } = require('./gimnasio'); // Importo la conexion

async function getAllRutinas() {
    const result = await dbClient.query('SELECT * FROM rutinas');
    return result.rows;
}

async function getOneRutina(id) {
    const result = await dbClient.query('SELECT * FROM rutinas WHERE id_rutina = $1 LIMIT 1', [id]);
    return result.rows[0];
}

async function createRutina(id_socio, id_profesor, nombre, fecha_inicio, fecha_fin, fecha_modificacion, estado) {
    try {
        const result = await dbClient.query(
            'INSERT INTO rutinas (id_socio, id_profesor, nombre, fecha_inicio, fecha_fin, fecha_modificacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_socio, id_profesor, nombre, fecha_inicio, fecha_fin, fecha_modificacion, estado]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23503') { // foreign_key_violation (socio o profesor inexistente)
            return { error: 'foreign_key' };
        }
        throw err;
    }
}

async function deleteRutina(id) {
  try {
    const result = await dbClient.query('DELETE FROM rutinas WHERE id_rutina = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') { // foreign_key_violation (tiene detalles o reportes asociados)
      return { error: 'foreign_key' };
    }
    throw err;
  }
}

async function updateRutina(id, id_socio, id_profesor, nombre, fecha_inicio, fecha_fin, fecha_modificacion, estado) {
  try {
    const result = await dbClient.query(
      'UPDATE rutinas SET id_socio = $1, id_profesor = $2, nombre = $3, fecha_inicio = $4, fecha_fin = $5, fecha_modificacion = $6, estado = $7 WHERE id_rutina = $8 RETURNING *',
      [id_socio, id_profesor, nombre, fecha_inicio, fecha_fin, fecha_modificacion, estado, id]
    );

    if (result.rowCount === 0) {
      return undefined;
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
  getAllRutinas,
  getOneRutina,
  createRutina,
  deleteRutina,
  updateRutina,
};
