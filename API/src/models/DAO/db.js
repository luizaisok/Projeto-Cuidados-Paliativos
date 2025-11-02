/*
const mysql = require('mysql2/promise');

async function createConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'cuidados_paliativos_db'
  });

  console.log('Conectado ao MySQL! :)');
  
  return connection;
}
*/

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cuidados_paliativos_db',
});

pool.getConnection()
  .then(() => console.log('Conexão com MySQL bem sucedida!'))
  .catch(e => console.error('Erro ao conectar ao MySQL:', e));

module.exports = pool;
