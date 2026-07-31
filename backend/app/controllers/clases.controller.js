const pool = require('../db/connection');

exports.getAll = async (req, res) => {
  try {
    const { dia_semana } = req.query;
    let query = 'SELECT * FROM clases';
    const params = [];
    if (dia_semana) {
      query += ' WHERE dia_semana = $1';
      params.push(dia_semana);
    }
    query += ' ORDER BY id';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clases WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado } = req.body;
    const result = await pool.query(
      `INSERT INTO clases (id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado || 'activa']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado } = req.body;
    const result = await pool.query(
      `UPDATE clases SET id_profesor=$1, nombre=$2, descripcion=$3, dia_semana=$4,
       hora_inicio=$5, hora_fin=$6, cupo_maximo=$7, estado=$8, fecha_modificacion=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [id_profesor, nombre, descripcion, dia_semana, hora_inicio, hora_fin, cupo_maximo, estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const result = await pool.query(
      `UPDATE clases SET estado=$1, fecha_modificacion=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clases WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};