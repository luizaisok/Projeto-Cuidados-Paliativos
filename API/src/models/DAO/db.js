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
  password: '123456',
  database: 'cuidados_paliativos_db',
});

console.log('[DB] carregado de', __filename, 'hasPassword=', !!('123456'));

pool.getConnection()
  .then((conn) => { console.log('Conexão com MySQL bem sucedida!'); conn.release(); })
  .catch(e => console.error('Erro ao conectar ao MySQL:', e));

module.exports = pool;

module.exports.createConnection = async () => pool;
