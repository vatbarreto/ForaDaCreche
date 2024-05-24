const xlsx = require('xlsx')
const util = require('./util.js')

console.log('# Carregando arquivo XLSX')
const workbook = xlsx.readFile('xlsx/matriculas.xlsx')
console.log('# Convertendo em JSON o arquivo XLSX')
const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[11]], {header: 1})
console.log('# Filtrando dados dos municípios de Sergipe')
const sergipe_tmp_data = worksheet.filter(m => m.length == 15 && m[1] == 'Sergipe ' && m[2] != '  ')
console.log('# Compilando informações dos municípios')
const sergipe_data = sergipe_tmp_data
    .map(m => ({
        'codIBGE': m[3],
        'municipio': m[2].trim(),
        'redePublica': m[6]+ m[7] + m[8] + m[11] + m[12] + m[13],
        'redePrivada': m[9]+ m[14]
    }))
console.log("# Salvando arquivo 'matriculas.json'")
util.saveJson('matriculas', sergipe_data)