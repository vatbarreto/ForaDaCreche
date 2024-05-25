const util = require('./util.js')

console.log('# Carregando nascimentos.json')
const nascimentos = util.readJson('sinasc')
console.log('# Carregando matriculas.json')
const matriculas = util.readJson('matriculas')

const totalNascimentos = nascimentos.reduce((t, n) => t + n.nascimentos, 0)
let report = nascimentos
    .map(n => Object.assign(n, matriculas.find(m => m.municipio === n.municipio)))
    .map(e => {
        const foraDaCreche = e.nascimentos - (e.redePublica + e.redePrivada)
        const percForaDaCreche = parseFloat(((foraDaCreche / e.nascimentos) * 100).toFixed(2))
        const percRelativoForaDaCreche = parseFloat(((foraDaCreche / totalNascimentos) * 100).toFixed(2))
        return [e.codIBGE, e.municipio, e.nascimentos, e.redePublica, e.redePrivada, foraDaCreche, percForaDaCreche, percRelativoForaDaCreche]
    })
report = [
    [
        'Cód. IBGE', 'Município', 'Total de Nascimentos', 'Rede Pública', 'Rede Privada',
        'Total Fora da Creche', '% Fora da Creche', '% Relativo Fora da Creche'
    ],
    ...report
]
console.log("# Salvando arquivo 'report.json'")
util.saveJson('report', report)
util.saveXlsx('report', report)