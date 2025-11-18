#!/bin/bash

# Configurações
DB_USER="root"
DB_PASSWORD="1234"
SQL_FILE="../sql/popula_banco.sql"

# Executar SQL
echo "Carregando dados dos CSVs..."

if mysql -u"$DB_USER" -p"$DB_PASSWORD" --local-infile=1 < "$SQL_FILE" 2>&1; then
    echo "Dados carregados com sucesso!"
else
    echo "Erro ao carregar dados!"
    exit 1
fi

# Como rodar (deve ser no GitBash):
# 1. Navegar até a pasta do script
# cd database/scripts

# 2. Dar permissão de execução (só precisa fazer uma vez)
# chmod +x popula_banco.sh

# 3. Executar
# ./popula_banco.sh

# Simplificado
# cd database/scripts >> chmod +x popula_banco.sh >> ./popula_banco.sh