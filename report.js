const util = require('./util.js')

console.log('# Carregando nascimentos.json')
const nascimentos = util.readJson('sinasc')
console.log('# Carregando matriculas.json')
const matriculas = util.readJson('matriculas')

const report = nascimentos
.map(n => Object.assign(n, matriculas.find(m => m.municipio === n.municipio)))
console.log("# Salvando arquivo 'report.json'")
util.saveJson('report', report)