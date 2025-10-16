import excelService from './services/excel.service.js';
import dirService from './services/dir.service.js';

const excelFileName = dirService.excelFilePath('dataExample.xlsx');

const data = await excelService.readExcelFile(excelFileName);
console.log(data);