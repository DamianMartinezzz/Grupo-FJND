const { dbClient } = require('./gimnasio'); // Importo la conexion

async function getAllReportes() {
    const result = await dbClient.query('SELECT * FROM reporte');
    return result.rows;
}

async function getOneReporte(id) {
    const result = await dbClient.query('SELECT * FROM reporte WHERE id_reporte = $1 LIMIT 1', [id]);
    return result.rows[0];
}

async function createReporte(id_rutina, id_socio, dia, fecha_asistencia) {
    try {
        const result = await dbClient.query(
            'INSERT INTO reporte (id_rutina, id_socio, dia, fecha_asistencia) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_rutina, id_socio, dia, fecha_asistencia]);

        if (result.rowCount === 0) {
            return undefined;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        if (err.code === '23503') { // foreign_key_violation (rutina o socio inexistente)
            return { error: 'foreign_key' };
        }
        throw err;
    }
}

async function deleteReporte(id) {
  try {
    const result = await dbClient.query('DELETE FROM reporte WHERE id_reporte = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return { error: 'not_found' };
    }
    return result.rows[0];
  } catch (err) {
    if (err.code === '23503') { // tiene detalles de reporte asociados
      return { error: 'foreign_key' };
    }
    throw err;
  }
}

async function updateReporte(id, id_rutina, id_socio, dia, fecha_asistencia) {
  try {
    const result = await dbClient.query(
      'UPDATE reporte SET id_rutina = $1, id_socio = $2, dia = $3, fecha_asistencia = $4 WHERE id_reporte = $5 RETURNING *',
      [id_rutina, id_socio, dia, fecha_asistencia, id]
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
  getAllReportes,
  getOneReporte,
  createReporte,
  deleteReporte,
  updateReporte,
};