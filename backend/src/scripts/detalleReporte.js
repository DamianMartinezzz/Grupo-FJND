const { dbClient } = require('./gimnasio'); // Importo la conexion

async function getAllDetalleReporte() {
    const result = await dbClient.query('SELECT * FROM detallereporte');
    return result.rows;
}

async function getOneDetalleReporte(id) {
    const result = await dbClient.query('SELECT * FROM detallereporte WHERE id_detalle = $1 LIMIT 1', [id]);
    return result.rows[0];
}

// Trae todos los detalles de un reporte puntual (esto es util para la pantalla de "ver reporte")
async function getDetallesByReporte(id_reporte) {
    const result = await dbClient.query('SELECT * FROM detallereporte WHERE id_reporte = $1', [id_reporte]);
    return result.rows;
}

async function createDetalleReporte(id_reporte, id_ejercicio, series_realizadas, repeticiones_realizadas, peso_utilizado, observaciones) {
    try {
        const result = await dbClient.query(
            'INSERT INTO detallereporte (id_reporte, id_ejercicio, series_realizadas, repeticiones_realizadas, peso_utilizado, observaciones) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id_reporte, id_ejercicio, series_realizadas, repeticiones_realizadas, peso_utilizado, observaciones]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23503') { // (reporte o ejercicio inexistente)
            return { error: 'foreign_key' };
        }
        throw err;
    }
}

async function deleteDetalleReporte(id) {
  try {
    const result = await dbClient.query('DELETE FROM detallereporte WHERE id_detalle = $1 RETURNING *', [id]);
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

async function updateDetalleReporte(id, id_reporte, id_ejercicio, series_realizadas, repeticiones_realizadas, peso_utilizado, observaciones) {
  try {
    const result = await dbClient.query(
      'UPDATE detallereporte SET id_reporte = $1, id_ejercicio = $2, series_realizadas = $3, repeticiones_realizadas = $4, peso_utilizado = $5, observaciones = $6 WHERE id_detalle = $7 RETURNING *',
      [id_reporte, id_ejercicio, series_realizadas, repeticiones_realizadas, peso_utilizado, observaciones, id]
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
  getAllDetalleReporte,
  getOneDetalleReporte,
  getDetallesByReporte,
  createDetalleReporte,
  deleteDetalleReporte,
  updateDetalleReporte,
};