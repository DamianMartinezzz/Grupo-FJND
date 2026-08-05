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
        await dbClient.query('BEGIN');

        // Bloqueamos la fila de la clase para evitar condiciones de carrera
        const claseResult = await dbClient.query(
            'SELECT cupo_maximo FROM clases WHERE id_clase = $1 FOR UPDATE',
            [id_clase]
        );

        if (claseResult.rowCount === 0) {
            await dbClient.query('ROLLBACK');
            return { error: 'foreign_key' };
        }

        const cupoMaximo = claseResult.rows[0].cupo_maximo;

        // Solo validamos cupo si el estado que entra es 'Inscripto'
        if (estado === 'Inscripto') {
            const countResult = await dbClient.query(
                "SELECT COUNT(*) FROM usuario_clase WHERE id_clase = $1 AND estado = 'Inscripto'",
                [id_clase]
            );
            const inscriptosActuales = parseInt(countResult.rows[0].count);

            if (cupoMaximo !== null && inscriptosActuales >= cupoMaximo) {
                await dbClient.query('ROLLBACK');
                return { error: 'cupo_lleno' };
            }
        }

        const result = await dbClient.query(
            'INSERT INTO usuario_clase (id_usuario, id_clase, fecha_inscripcion, fecha_baja, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_socio, id_clase, fecha_inscripcion, fecha_baja, estado]
        );

        await dbClient.query('COMMIT');
        return result.rows[0];

    } catch (err) {
        await dbClient.query('ROLLBACK');
        if (err.code === '23503') {
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
    await dbClient.query('BEGIN');

    // 1. Verificamos que la inscripción a modificar exista
    const inscripcionActual = await dbClient.query(
        'SELECT * FROM usuario_clase WHERE id_usuario_clase = $1',
        [id]
    );

    if (inscripcionActual.rowCount === 0) {
        await dbClient.query('ROLLBACK');
        return { error: 'not_found' };
    }

    // 2. Si la clase cambia o pasa a estar inscripto, chequear cupos de la nueva clase
    if (estado === 'Inscripto') {
        const claseResult = await dbClient.query(
            'SELECT cupo_maximo FROM clases WHERE id_clase = $1 FOR UPDATE',
            [id_clase]
        );

        if (claseResult.rowCount === 0) {
            await dbClient.query('ROLLBACK');
            return { error: 'foreign_key' };
        }

        const cupoMaximo = claseResult.rows[0].cupo_maximo;

        // Contamos excluyendo la inscripción actual por si solo estamos editando datos sin cambiar de clase
        const countResult = await dbClient.query(
            "SELECT COUNT(*) FROM usuario_clase WHERE id_clase = $1 AND estado = 'Inscripto' AND id_usuario_clase != $2",
            [id_clase, id]
        );
        const inscriptosActuales = parseInt(countResult.rows[0].count);

        if (cupoMaximo !== null && inscriptosActuales >= cupoMaximo) {
            await dbClient.query('ROLLBACK');
            return { error: 'cupo_lleno' };
        }
    }

    // 3. Ejecutamos el update
    const result = await dbClient.query(
      'UPDATE usuario_clase SET id_usuario = $1, id_clase = $2, fecha_inscripcion = $3, fecha_baja = $4, estado = $5 WHERE id_usuario_clase = $6 RETURNING *',
      [id_socio, id_clase, fecha_inscripcion, fecha_baja, estado, id]
    );

    await dbClient.query('COMMIT');
    return result.rows[0];

  } catch (err) {
    await dbClient.query('ROLLBACK');
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