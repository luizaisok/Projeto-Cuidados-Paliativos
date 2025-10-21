const mysql = require('mysql2/promise');

async function createConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // inserir senha aqui!
    database: 'cuidados_paliativos_db'
  });

  console.log('Conectado ao MySQL! :)');
  
  return connection;
}

module.exports = { createConnection };