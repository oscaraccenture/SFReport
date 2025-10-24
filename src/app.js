import excelService from './services/excel.service.js';
import dirService from './services/dir.service.js';
import { formatTextContent, writeTextFile } from './services/text.service.js';
import { soqlQueryComparator } from './services/soql.service.js';

const excelFileName = dirService.excelFilePath('dataExample.xlsx');

const data = await excelService.readExcelFile(excelFileName);

const dataExcel = data.Sheet1;

const formattedText = formatTextContent(dataExcel);

const reportFilePath = dirService.txtFilePath('report.txt');
writeTextFile(reportFilePath, formattedText);

const soqlQueryAgent = "SELECT COUNT(ID) FROM Opportunity WHERE IsClosed = false";
const soqlQueryExpected = "SELECT COUNT(Id) FROM Opportunity WHERE IsClosed = false";


console.log("El porcentaje de similitud entre las cadenas es: \n");
console.log(soqlQueryComparator(soqlQueryAgent, soqlQueryExpected));