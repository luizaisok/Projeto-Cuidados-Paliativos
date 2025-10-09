# CONFIGURAÇÃO DO BANCO
MYSQL_USER="root"
MYSQL_PASS="1234" # editar se necessário
MYSQL_HOST="localhost"

# Caminho para os scripts SQL
SQL_DIR="C:/Users/mathe/Documentos/Development/personal-workspace/Projeto-Cuidados-Paliativos/scripts/sql"

# Execução sequêncial dos scripts .sql
echo 'Criando o banco de dados "cuidados_paliativos_db"...'
mysql --local-infile=1 -u $MYSQL_USER -p$MYSQL_PASS -h $MYSQL_HOST < $SQL_DIR/create_schema.sql

echo 'Criando as tabelas no banco de dados...'
mysql --local-infile=1 -u $MYSQL_USER -p$MYSQL_PASS -h $MYSQL_HOST < $SQL_DIR/create_tables.sql

echo 'Populando o banco de dados a partir dos arquivos CSV...'
mysql --local-infile=1 -u $MYSQL_USER -p$MYSQL_PASS -h $MYSQL_HOST < $SQL_DIR/load_csv.sql

echo "Banco de dados criado e populado com sucesso!"

# Comando para ativar e rodar esse script/arquivo:
# cd scripts/sql/
# chmod +x run_db.sh
# ./run_db.sh
