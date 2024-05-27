const util = require('./util.js');

// Executa o script
(async () => {
    const dateParams = process.argv.slice(2, )
    if (dateParams.length < 2) {
        console.log('# Argumentos insuficientes para execução do script!')
        console.log('> 1o Argumento: Ano')
        console.log('> 2o Argumento: Mês ')
        console.log('> 3o Argumento (Opcional): Dia ')
        return
    }
    const _result = await Promise.all(
        util.createDateArray(...dateParams)
        .map(
            async d => {
                const jsonData = await util.request(util.dataType.REGCIVIL, d)
                return {
                    startDate: d['startDate'],
                    endDate: d['endDate'],
                    nascimentos: jsonData.total,
                    data: jsonData.data
                }
            }
        )
    )
    // util.saveJson('regcivil_data', _result)
    console.log(`# Nro de registros: ${_result.length}`)
    const result = _result
    .reduce(
        (a, e) => {
            e.data.map(
                _e => {
                    const i = a.findIndex(_a => 'municipio' in _a && _a.municipio == _e.name)
                    if (i > -1)
                        a[i].nascimentos += parseInt(_e.total)
                    else
                        a.push({'municipio': _e.name, 'nascimentos': _e.total })
                }
            )
            return a
        },
        []
    ).sort(
        (i, j) => (i.municipio <= j.municipio? -1: 1)
    )
    console.log("# Salvando arquivo 'regcivil.json'")
    util.saveJson('regcivil', result)
})()