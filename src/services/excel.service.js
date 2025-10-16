import ExcelJS from 'exceljs';
import fs from 'fs';


const readExcelFile = async (filePath) => {
    //Read the Excel file
    const workbook = new ExcelJS.Workbook();
    try{

        await workbook.xlsx.readFile(filePath);
        
        //Convert the worksheet to Json
        const jsonData = {};
        workbook.eachSheet((worksheet, sheetId) =>{
            const sheetName = worksheet.name;
            const sheetData = [];
    
            //Iterate over rows, assuming the first row is the header
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1){
                    return; // Skip header row
                } else{
                    const rowObject = {};
                    row.eachCell((cell, colNumber) => {
                        const headerCell = worksheet.getRow(1).getCell(colNumber);
                        const header = headerCell.value;
                        if (header){
                            rowObject[header] = cell.value;
                        }
                    });
                    if (Object.keys(rowObject).length > 0){
                        sheetData.push(rowObject);
                    }
                }
            });
            jsonData[sheetName] = sheetData;
        });
        return jsonData;
    }catch (error){

    }
}

const excelService = {
    readExcelFile
}


export default excelService;