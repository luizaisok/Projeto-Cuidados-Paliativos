#!/bin/bash

# Configurações
DB_USER="root"
DB_PASSWORD="1234"
SQL_FILE="../sql/cria_banco.sql"

# Executar SQL
echo "Criando banco de dados..."

if mysql -u"$DB_USER" -p"$DB_PASSWORD" < "$SQL_FILE" 2>&1; then
    echo "Pronto!"
else
    echo "Erro ao criar banco de dados!"
    exit 1
fi

# Como rodar:
# 1. Navegar até a pasta do script
# cd database/scripts

# 2. Dar permissão de execução (só precisa fazer uma vez)
# chmod +x cria_banco.sh

# 3. Executar
# ./cria_banco.sh

# Simplificado
# cd database/scripts >> chmod +x cria_banco.sh >> ./cria_banco.sh