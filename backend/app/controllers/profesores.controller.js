const pool = require('../db/connection');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profesores ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profesores WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, mail } = req.body;
    const result = await pool.query(
      `INSERT INTO profesores (nombre, apellido, dni, telefono, mail)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, apellido, dni, telefono, mail]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, mail } = req.body;
    const result = await pool.query(
      `UPDATE profesores SET nombre=$1, apellido=$2, dni=$3, telefono=$4, mail=$5
       WHERE id=$6 RETURNING *`,
      [nombre, apellido, dni, telefono, mail, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM profesores WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};