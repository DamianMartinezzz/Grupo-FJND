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

module.exports = { 
getAllProfesores,
getOneProfesor,
createProfesor,
updateProfesor,
deleteProfesor,
};