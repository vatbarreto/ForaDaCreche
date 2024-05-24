const util = require('./util.js');

// Executa o script
(async () => {
    const dateParams = process.argv.slice(2, )
    if (dateParams.length < 2) {
        console.log('# Argumentos insuficientes para execução do script!')
        console.log('> 1o Argumento: Ano')
        console.log('> 2o Argumento: Mês ')
        return
    }
    const months = util.createMonthsArray(...dateParams)
    let _result = []
    for (let year of util.createYearsArray(...dateParams)) {
        _result = [
            ..._result, 
            ... ((await Promise.all(
                    util.regionCodes
                    .map(async region => {
                        const jsonData = await util.request(util.dataType.SINASC, {'year': year, 'macroregion': region})
                        jsonData.resultados.forEach(r => delete r.abrangencia)
                        return jsonData.resultados
                    })
                ))
                .reduce((a, e) => [...a, ...e], [])
                .map(e => ({ 'year': year, 'data': e }))
            )
        ]
    }
    // util.saveJson('sinasc_data', _result)
    const result = _result
    .reduce((a, m) => {
        const i = a.findIndex(_m => m.data.uid == _m.codIBGE)
        if (i == -1) {
            const municipio = {
                'codIBGE': m.data.uid,
                'municipio': m.data.nome,
                'nascimentos': 0
            }
            months[m.year].forEach(month => {
                municipio.nascimentos += m.data[month]
            })
            a.push(municipio)
        } else {
            months[m.year].forEach(month => {
                a[i].nascimentos += m.data[month]
            })
        }
        return a
    }, [])
    .sort((i, j) => i.municipio.localeCompare(j.municipio))
    console.log("# Salvando arquivo 'sinasc.json'")
    util.saveJson('sinasc', result)
})()