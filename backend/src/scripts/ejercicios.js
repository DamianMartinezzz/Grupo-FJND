const { dbClient } = require('./gimnasio');

async function getAllEjercicios() {
    const result = await dbClient.query('SELECT * FROM ejercicios');
    return result.rows;
}

async function getOneEjercicio(id) {
  const result = await dbClient.query('SELECT * FROM ejercicios WHERE id_ejercicio = $1 LIMIT 1', [id]);
  return result.rows[0];
}

async function createEjercicio(nombre, grupoMuscular, descripcion) {
    try {
        // Usamos los nombres de columnas definidos en tu CREATE TABLE
        const result = await dbClient.query(
            'INSERT INTO Ejercicios (Nombre, Grupo_Muscular, Descripcion) VALUES ($1, $2, $3) RETURNING *',
            [nombre, grupoMuscular, descripcion]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
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

module.exports = {
getAllEjercicios, 
getOneEjercicio, 
createEjercicio, 
updateEjercicio, 
deleteEjercicio,
};

