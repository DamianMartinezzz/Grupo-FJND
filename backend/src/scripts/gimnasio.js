// src/scripts/gimnasio.js
const { Pool } = require('pg');

const dbClient = new Pool({
    user: process.env.DB_USER,      // Lee 'postgres' del yml
    host: process.env.DB_HOST,      // Lee 'postgres' del yml (hace que encuentre al contenedor)
    database: process.env.DB_NAME,  // Lee 'gimnasio' del yml
    password: process.env.DB_PASSWORD, // Lee 'postgres' del yml
    port: process.env.DB_PORT,      // Lee '5432' del yml
});

module.exports = { dbClient };
