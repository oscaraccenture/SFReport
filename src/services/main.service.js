import excelService from './excel.service.js'
import dirService from './dir.service.js'
import {
  formatTextContent,
  writeTextFile,
  formatTextContentSeveralOutcomes,
  formatTextExpectedOutcome
} from './text.service.js'
import { soqlQueryComparator } from './soql.service.js'



const textFormatters = async () => {
  const excelFileNames = [
    dirService.excelFilePath('dataExample.xlsx'),
    dirService.excelFilePath('dataExampleSeveralOutcomes.xlsx'),
    dirService.excelFilePath('dataExampleExpectedOutcome.xlsx')
  ]

  const dataPromises = excelFileNames.map(excelFileName => excelService.readExcelFile(excelFileName))

  const data = await Promise.all(dataPromises)

  const formattedTexts = data.map((data, index) => {
    const dataExcel = data.Sheet1
    switch (index) {
      case 0:
        return formatTextContent(dataExcel)
      case 1:
        return formatTextContentSeveralOutcomes(dataExcel)
      case 2:
        return formatTextExpectedOutcome(dataExcel)
      default:
        return ''
    }
  })

  const reportFilePaths = formattedTexts.map((formattedText, index) => {
    switch (index) {
      case 0:
        return dirService.txtFilePath('report.txt')
      case 1:
        return dirService.txtFilePath('reportSeverus.txt')
      case 2:
        return dirService.txtFilePath('reportExpectedOutcome.txt')
      default:
        return ''
    }
  })

  formattedTexts.forEach((formattedText, index) => {
    writeTextFile(reportFilePaths[index], formattedText)
  })
}


const soqlComparator = () => {
  const soqlQueryAgent =
    'SELECT COUNT(ID) FROM Opportunity WHERE IsClosed = false'
  const soqlQueryExpected =
    'SELECT COUNT(Id) FROM Opportunity WHERE IsClosed = false'

  console.log('El porcentaje de similitud entre las cadenas es: \n')
  console.log(soqlQueryComparator(soqlQueryAgent, soqlQueryExpected))
}

export {
    textFormatters
}