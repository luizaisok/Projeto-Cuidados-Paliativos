# Como criar o banco completo:
# chmod +x ./database/run_db.sh => Dá permissão (só a primeira vez)
# ./database/run_db.sh => Executa o script

#!/bin/bash

# Configurações do banco de dados
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASS="1234" # editar senha, se necessário
DB_NAME="cuidados_paliativos_db"

# Executar scripts SQL
{
    echo "Executando scripts SQL..."
    
    # Habilita LOCAL INFILE
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --local-infile=1 -e "SET GLOBAL local_infile=1;"
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --local-infile=1 < ./database/scripts/create_database.sql
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --local-infile=1 "$DB_NAME" < ./database/scripts/create_tables.sql
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --local-infile=1 "$DB_NAME" < ./database/scripts/load_data.sql
    
    echo "Concluído!"
    
} || {
    echo "Erro ao executar scripts!"
    exit 1
}