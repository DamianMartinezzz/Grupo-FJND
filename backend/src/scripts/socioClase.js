const { dbClient } = require('./gimnasio'); // Importo la conexion

// Conceptualmente esto representa la inscripcion de un socio a una clase.

async function getAllSocioClase() {
    const result = await dbClient.query('SELECT * FROM usuario_clase');
    return result.rows;
}

async function getOneSocioClase(id) {
    const result = await dbClient.query('SELECT * FROM usuario_clase WHERE id_usuario_clase = $1 LIMIT 1', [id]);
    return result.rows[0];
}

// Trae todas las inscripciones de un socio puntual (esto es util, por ejemplo, para "mis clases")
async function getInscripcionesBySocio(id_socio) {
    const result = await dbClient.query('SELECT * FROM usuario_clase WHERE id_usuario = $1', [id_socio]);
    return result.rows;
}

async function createSocioClase(id_socio, id_clase, fecha_inscripcion, fecha_baja, estado) {
    try {
        const result = await dbClient.query(
            'INSERT INTO usuario_clase (id_usuario, id_clase, fecha_inscripcion, fecha_baja, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_socio, id_clase, fecha_inscripcion, fecha_baja, estado]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23503') { // (socio o clase inexistente)
            return { error: 'foreign_key' };
        }
        throw err;
    }
}

async function deleteSocioClase(id) {
  try {
    const result = await dbClient.query('DELETE FROM usuario_clase WHERE id_usuario_clase = $1 RETURNING *', [id]);
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

async function updateSocioClase(id, id_socio, id_clase, fecha_inscripcion, fecha_baja, estado) {
  try {
    const result = await dbClient.query(
      'UPDATE usuario_clase SET id_usuario = $1, id_clase = $2, fecha_inscripcion = $3, fecha_baja = $4, estado = $5 WHERE id_usuario_clase = $6 RETURNING *',
      [id_socio, id_clase, fecha_inscripcion, fecha_baja, estado, id]
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
  getAllSocioClase,
  getOneSocioClase,
  getInscripcionesBySocio,
  createSocioClase,
  deleteSocioClase,
  updateSocioClase,
};