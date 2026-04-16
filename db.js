const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'react_express_db', // Asegúrate de haber creado esta DB en pgAdmin o psql
  password: '14082006', 
  port: 3000,
});

module.exports = pool;