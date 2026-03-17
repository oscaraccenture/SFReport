import path from 'path';
import ExcelService from '../services/excel.service.js';
import TxtService from '../services/text.service.js';
import Validator from '../validators/dataValidator.js';
import Rules from '../validators/rules.loader.js';

const RULES = Rules.loadRules();

async function handleUpload(req,res){
    try{
        const ext = path.extname(req.file.originalname).toLowerCase();
        const filePath = req.file.path;

        if (ext === '.xlsx'){
            const sheet = await readExcel(filePath, RULES);

            const headerRow = sheet.getRow(RULES.excel.headerRow).values.slice(1);
            const {headers, missing } = validateHeaders(headerRow, RULES);

            if (missing.length){
                return res.render('preview', { error: `Faltan headers : ${missing.join(', ')}` });
            }

            const rows = [];
            const errors = [];

            sheet.eachRow((row, idx) => {
                if (idx === RULES.excel.headerRow) return;

                const rowObj = {};
                headers.forEach( (h, i) => rowObj[h] = row.values[i + 1]);

                error.push(...validateRow(rowObj, RULES, idx));
                rows.push(headers.map(h => rowObj[h]))

            })


        }
    }catch(error){

    }
}