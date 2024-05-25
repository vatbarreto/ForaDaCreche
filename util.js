const xlsx = require('xlsx')
const fs = require('fs')

const dataType = {
    SINASC: 0,
    REGCIVIL: 1
}

const regionCodes = ['28001', '28002', '28003', '28004', '28005', '28006', '28007']

const request = async (_dataType, params) => {
    const url = (_dataType == dataType.SINASC?
        `https://svs.aids.gov.br/services2/v1/natalidade/nascidos-vivos/exportar/localidade?ano=${params.year}&local=1&abrangencia=7&cir=${params.macroregion}&categoria=1&estatistica=1&lococor=0&grupoetario=6000&racacor=0&sexo=0&escolaridade=0&conjugal=0&prenatal=0&consultas=0&gravidez=0&gestacao=0&parto=0&assistido=0&apgar1=0&apgar5=0&robson=0&peso=0&funcao=0&anomalia=0&espacial=sus&parcial=true`
        : `https://transparencia.registrocivil.org.br/api/record/filter-all?start_date=${params.startDate}&end_date=${params.endDate}&state=SE`
    )
    const response = await fetch(url)
    return await response.json()
}

const readJson = (filename) => {
    return JSON.parse(fs.readFileSync(`json/${filename}.json`, 'utf8'))
}

const saveJson = (filename, jsonData) => {
    const fileDir = 'json/'
    if (!fs.existsSync(fileDir))
        fs.mkdirSync(fileDir)
    fs.writeFile(`${fileDir}/${filename}.json`, JSON.stringify(jsonData, null, 2), e => { if (e) console.log(e) })
}

const xlsxToJson = (filename) => {
    console.log('# Carregando arquivo XLSX')
    const workbook = xlsx.readFile(`xlsx/${filename}.xlsx`)
    console.log('# Convertendo em JSON o arquivo XLSX')
    return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[11]], {header: 1})
}

const saveXlsx = (filename, dataframe) => {
    const workbook = xlsx.utils.book_new()
    const sheetName = "Fora da Creche"
    workbook.SheetNames.push(sheetName)
    workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet(dataframe)
    xlsx.writeFile(workbook, `xlsx/${filename}.xlsx`)
}

const shortMonthStr = (_date) => {
    return _date.toLocaleDateString('pt-br', {month: 'long'}).slice(0, 3)
}

const createYearsArray = (year, month) => {
    return Array.from({ length: (parseInt(month) == 12? 3: 4) }, (_, index) => parseInt(year) - index)
}

const createMonthsArray = (year, month) => {
    console.log(`# Data de referência: ${month}/${year}`)
    const _months = {}
    for (let i = 0; i < 36; i++) {
        const _date = new Date(parseInt(year), parseInt(month)-1-i)
        if (!(_date.getFullYear() in _months))
            _months[_date.getFullYear()] = []
        _months[_date.getFullYear()].push(shortMonthStr(_date))
    }
    return _months
}

const dtToStr = (_date) => {
    return _date.toISOString('pt-br').slice(0, 10)
}

const createDateArray = (year, month, day) => {
    const paramDate = new Date(parseInt(year), parseInt(month)-1, (day? parseInt(day): 1))
    console.log(`# Data de referência: ${dtToStr(paramDate)}`)
    return Array(36)
        .fill()
        .map((e, i) => ({
            startDate: dtToStr(new Date(paramDate.getFullYear(), paramDate.getMonth()-i, 1)),
            endDate: dtToStr(new Date(paramDate.getFullYear(), paramDate.getMonth()-i+1, 0))
        }))
}

module.exports = {
    dataType,  regionCodes, request, readJson, saveJson, xlsxToJson,
    saveXlsx, createYearsArray, createMonthsArray, createDateArray
}