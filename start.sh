#! /bin/bash

nasc="0"

until [[ "$nasc" == "1" || "$nasc" == "2" ]]; do
    clear
    echo "1 - SINASC"
    echo "2 - Registro Civil"
    echo
    read -p "Escolha a base de nascimentos: " nasc
done
echo
ano=2023  # Ano de referencia determinado pelo censo do INEP
mes=5     # Mês de referencia determinado pelo censo do INEP
if [[ "$nasc" == "1" ]]; then
    node src/sinasc.js $ano $mes
else
    node src/regcivil.js $ano $mes
fi
node --max-old-space-size=8192 src/matriculas.js
if [[ "$nasc" == "1" ]]; then
    node src/report.js "sinasc"
else
    node src/report.js "regcivil"
fi
