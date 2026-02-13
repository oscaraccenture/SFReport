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

const createSeveralOutcomesExcelFile = async (filePath, data) =>{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PromptOutcomes');
    //Add header row
    worksheet.columns = [
        { header: 'S. No.', key: 'sNo', width: 10},
        { header: 'Category', key: 'category', width: 15},
        { header: 'Role', key: 'role', width: 10},
        { header: 'Prompt Type', key: 'promptType', width: 20},
        { header: 'Utterance', key: 'utterance', width: 50},
        { header: 'Outcome 1', key: 'outcome1', width: 30},
        { header: 'Outcome 2', key: 'outcome2', width: 30},
        { header: 'Outcome 3', key: 'outcome3', width: 30},
        { header: 'Outcome 4', key: 'outcome4', width: 30},
        { header: 'Outcome 5', key: 'outcome5', width: 30},
    ];
    const fileName = 'fileExampleSeveralOutcomes.xlsx';
    if (data){
        data.forEach((item)=>{
            worksheet.addRow(item);
        })
    } else{
        
    }
    try{
        await workbook.xlsx.writeFile(fileName);
        console.log(`File saved as ${fileName}`);
    } catch (error){
        console.error('Error during the file save: ', error);
    }
}





const excelService = {
    readExcelFile,
    createSeveralOutcomesExcelFile,

}


export default excelService;