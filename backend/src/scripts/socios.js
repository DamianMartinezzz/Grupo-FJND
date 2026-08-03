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

module.exports = {
getAllSocios,
getOneSocio,
createSocio,
deleteSocio,
updateSocio,
};
