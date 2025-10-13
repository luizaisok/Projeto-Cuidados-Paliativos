#!/bin/bash
set -e

# Carregar variáveis do arquivo .env
if [ -f ./env/.env ]; then
  source ./env/.env
else
  echo "[ERROR] O Arquivo .env não foi encontrado!"
  exit 1
fi

# Execução sequencial dos scripts .sql
echo "Criando o banco de dados \"$DB_NAME\"..."
mysql --local-infile=1 -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" < "$SQL_DIR/create_schema.sql"

echo "Criando as tabelas no banco de dados..."
mysql --local-infile=1 -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" < "$SQL_DIR/create_tables.sql"

echo "Populando o banco de dados a partir dos arquivos CSV..."
mysql --local-infile=1 -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" < "$SQL_DIR/load_csv.sql"

echo "Banco de dados \"$DB_NAME\" criado e populado com sucesso!"


# Comando para ativar e rodar esse script/arquivo:
# cd database/
# chmod +x run_db.sh
# ./run_db.sh
