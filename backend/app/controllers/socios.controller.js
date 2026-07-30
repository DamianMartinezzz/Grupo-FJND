const pool = require('../db/connection');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM socios ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM socios WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento } = req.body;
    const result = await pool.query(
      `INSERT INTO socios (Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento } = req.body;
    const result = await pool.query(
      `UPDATE socios SET Nombre=$1, Apellido=$2, Dni=$3, Telefono=$4, Mail=$5, Fecha_Nacimiento=$6
       WHERE id=$7 RETURNING *`,
      [Nombre, Apellido, Dni, Telefono, Mail, Fecha_Nacimiento, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM socios WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};