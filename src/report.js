const util = require('./util.js')

console.log('# Carregando nascimentos.json')
const baseNasc = process.argv[2]
const nascimentos = util.readJson(baseNasc)
console.log('# Carregando matriculas.json')
const matriculas = util.readJson('matriculas')

const totalNascimentos = nascimentos.reduce((t, n) => t + n.nascimentos, 0)
let report = matriculas
    .map(m => {
        const n = nascimentos.find(_n => _n.municipio === m.municipio)
        return {
            'codIBGE': m.codIBGE,
            'municipio': m.municipio,
            'redePublica': m.redePublica,
            'redePrivada': m.redePrivada,
            'nascimentos': (n? n.nascimentos: null)
        }
    })
    .map(e => {
        const nascimentos = e.nascimentos
        const foraDaCreche = e.nascimentos - (e.redePublica + e.redePrivada)
        const percForaDaCreche = parseFloat(((foraDaCreche / e.nascimentos) * 100).toFixed(2))
        const percRelativoForaDaCreche = parseFloat(((foraDaCreche / totalNascimentos) * 100).toFixed(2))
        return [
            e.codIBGE,
            e.municipio,
            (nascimentos? nascimentos: ''),
            e.redePublica,
            e.redePrivada,
            (foraDaCreche? foraDaCreche: ''),
            (percForaDaCreche? percForaDaCreche: ''),
            (percRelativoForaDaCreche? percRelativoForaDaCreche: '')]
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