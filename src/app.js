import { textFormatters } from "./services/main.service.js";

//Experimental CODE
import excelService from './services/excel.service.js';
import dirService from "./services/dir.service.js";

async function main (){
    textFormatters();
/*     
    const data = await excelService.readExcelFile(dirService.excelFilePath('dataExample.xlsx'));
    console.log(data); */
}

main();