const { Pool } = require('pg');

const dbClient = new Pool({
    user: 'postgres',
    port: 5432,
    host: 'localhost',
    database: 'gimnasio',
    password: 'postgres',
});


async function getAllSocios() {
    const result = await dbClient.query('SELECT * FROM socios');
    return result.rows;
}

module.exports = {
  getAllSocios,
};