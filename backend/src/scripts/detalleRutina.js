const { dbClient } = require('./gimnasio'); // Importo la conexion

async function getAllDetalleRutina() {
    const result = await dbClient.query('SELECT * FROM detallerutina');
    return result.rows;
}

async function getOneDetalleRutina(id) {
    const result = await dbClient.query('SELECT * FROM detallerutina WHERE id_detalle = $1 LIMIT 1', [id]);
    return result.rows[0];
}

// Trae todos los detalles de una rutina puntual (esto va a ser util para armar la pantalla de "editar rutina")
async function getDetallesByRutina(id_rutina) {
    const result = await dbClient.query('SELECT * FROM detallerutina WHERE id_rutina = $1 ORDER BY dia, orden', [id_rutina]);
    return result.rows;
}

async function createDetalleRutina(id_rutina, id_ejercicio, dia, orden, series, repeticiones_desde, repeticiones_hasta, descanso) {
    try {
        const result = await dbClient.query(
            'INSERT INTO detallerutina (id_rutina, id_ejercicio, dia, orden, series, repeticiones_desde, repeticiones_hasta, descanso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [id_rutina, id_ejercicio, dia, orden, series, repeticiones_desde, repeticiones_hasta, descanso]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23503') { // foreign_key_violation (rutina o ejercicio inexistente)
            return { error: 'foreign_key' };
        }
        throw err;
    }
}

async function deleteDetalleRutina(id) {
  try {
    const result = await dbClient.query('DELETE FROM detallerutina WHERE id_detalle = $1 RETURNING *', [id]);
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

async function updateDetalleRutina(id, id_rutina, id_ejercicio, dia, orden, series, repeticiones_desde, repeticiones_hasta, descanso) {
  try {
    const result = await dbClient.query(
      'UPDATE detallerutina SET id_rutina = $1, id_ejercicio = $2, dia = $3, orden = $4, series = $5, repeticiones_desde = $6, repeticiones_hasta = $7, descanso = $8 WHERE id_detalle = $9 RETURNING *',
      [id_rutina, id_ejercicio, dia, orden, series, repeticiones_desde, repeticiones_hasta, descanso, id]
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
  getAllDetalleRutina,
  getOneDetalleRutina,
  getDetallesByRutina,
  createDetalleRutina,
  deleteDetalleRutina,
  updateDetalleRutina,
};