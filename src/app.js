import { textFormatters } from './services/main.service.js';
import express from 'express';
import handlebarsConfig from './config/handlebarsConfig.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import exceljs from 'exceljs';

import fs from 'fs';
import Ajv from 'ajv';
import path from 'path';

import textHelper from './helpers/textHelper.js';


//Experimental CODE
import excelService from './services/excel.service.js'
import dirService from './services/dir.service.js'
import { arch } from 'os'

//** End of Experimental CODE Importation*/

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename), '..')

handlebarsConfig(app)
const port = 3000;

/* 
Ajv validation Rules
*/


//Already Moved
function loadJson (filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}
//**Already Moved



function loadAndValidateRules(){
  const rulesPath = path.join(__dirname, 'config', 'rules.json');
  const schemaPath = path.join(__dirname, 'config', 'rules.schema.json');

  const rules = loadJson(rulesPath);
  const schema = loadJson(schemaPath);

  const ajv = new Ajv({ allErrors: true, strict: false});
  const validate = ajv.compile(schema);

  const ok = validate(rules);
  if (!ok){
    const msg = validate.errors.map(e => `${e.instancePath} ${e.message}`).join(' | ');
    throw new Error(`rules.json invalido: ${msg}`);
  }
  return rules;
}

//Charge the rules once at the beginning (if it changes, reboot the server)
const RULES = loadAndValidateRules();


//Already Moved
//Helper function rules
function normalizeHeader(h, rules){
  /* 
  The ?? operator in JavaScript is the nullish coalescing operator. It is a logical operator that returns its right-hand side 
  operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
   */
  const raw = String(h ?? '').trim(); 
  return rules.headerAliases[raw] || raw;
}
//**Already Moved



//Already Moved
function buildHeaderMap(fileHeaders, rules){
  //Normalize headers from the file (EXCEL, TXT) to valid ones or canonical
  const normalized = fileHeaders.map(h => normalizeHeader(h,rules));

  //validate mandatory headers
  const missing = rules.requiredHeaders.filter(req => !normalized.includes(req));
  return { normalized, missing};
}
//**Already Moved





function validateRowObject(rowObj, rules, rowNumber){
  const errors = [];

  for (const [colName, colRules] of Object.entries(rules.columns)){
    const value = rowObj[colName];

    if (colRules.required){
      const empty = value === undefined || value === null || String(value).trim() === '';
      if (empty){
        errors.push(`Fila ${rowNumber}:  "${colName}" es obligatorio`);
        continue;
      }
    }

    if (value !== undefined && value !== null && String(value).trim() != ''){
      if (colRules.type === 'number'){
        const num = Number(value);
        if (Number.isNaN(num)) errors.push(`Fila ${rowNumber}: "${colName}" debe ser numerico`);
        if (colRules.min !== undefined && s.trim().length < colRules.minLength){
          errors.push(`Fila ${rowNumber}: "${colName}" minimo ${colRules.minLength} caracteres`);
        }
      }
    }
  }
  return errors;

}



//**End of Helper function rules

/* 
End of Ajv validation Rules
*/

//**Already Moved


//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext === '.xlsx' || ext === '.txt') {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos .xlsx o .txt'))
  }
}

const upload = multer({
  storage,
  fileFilter
})

//Routes

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    message: 'Handlebars is alive and working'
  })
})

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.render('home', {
        title: 'Mi primer sitio con Express + Handlebars',
        mensaje: 'Error al subir archivo',
        error: 'No se recibió ningún archivo'
      })
    }

    const ext = path.extname(req.file.originalname).toLowerCase()

    // =========================================================================================//
    //If the file is extension .TXT

    if (ext === '.txt') {
      const txtPath = path.join(__dirname, 'uploads', req.file.filename)

      const content = fs.readFileSync(txtPath, 'utf8')
      const lines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      if (lines.length === 0) {
        return res.render('home', {
          title: 'Mi primer sitio con Express + Handlebars bro TXT',
          message: 'El archivo TXT esta vacio, rayos',
          error: 'No hay contenido para procesar'
        })
      }

      // Parsing columns
      const rows = lines.map(line => line.split('|').map(col => col.trim()))

      const headers = rows[0]
      const REQUIRED_HEADERS = ['S.No', 'Prompt', '1 Outcome']

      const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h))

      console.log(missingHeaders)

      if (missingHeaders.lenght > 0) {
        return res.render('home', {
          title: 'Error de validacion',
          message: 'TXT invalido',
          error: `Faltan columnas obligatorias:  ${missingHeaders.join(', ')}`
        })
      }

      const COLUMN_TYPES = {
        'S.No': 'number',
        Prompt: 'string',
        '1 Outcome': 'string'
      }

      const errors = []

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const rowNumber = i + 1

        headers.forEach((header, index) => {
          const value = row[index]
          if (COLUMN_TYPES[header] === 'number' && isNaN(Number(value))) {
            errors.push(`Fila ${rowNumber}: "${header}" debe ser numerico`)
          }

          if (
            COLUMN_TYPES[header] === 'string' &&
            (!value || value.trim() === '')
          ) {
            errors.push(`Fila ${rowNumber}: "${header}" no puede estar vacio`)
          }
        })
      }

      if (errors.length > 0) {
        return res.render('home', {
          title: 'Error de validacion',
          message: 'TXT invalido',
          error: errors.join(' - ')
        })
      }

      //Create the excel file
      const workbook = new exceljs.Workbook()
      const worksheet = workbook.addWorksheet('Datos desde Txt')

      //headers
      worksheet.addRow(rows[0])

      //Data
      for (let i = 1; i < rows.length; i++) {
        worksheet.addRow(rows[i])
        console.log(rows[i])
        console.log('Row added correctly')
      }

      //Save the excel file
      const excelFileName = req.file.filename.replace('.txt', '.xlsx')
      const excelPath = path.join(__dirname, 'excels', excelFileName)

      await workbook.xlsx.writeFile(excelPath)

      return res.render('home', {
        title:
          'Mi primer sitio con express + handlebars bro == guardar TXT a Excel',
        message: 'Excel generado correctamente desde TXT',
        file: excelFileName,
        excelFile: excelFileName
      })
    }
    // =================================+++++++==================================================//

    // =========================================================================================//
    //If the file is xlxs: read it with ExcelJs from the hardisk
    const filePath = path.join(__dirname, 'uploads', req.file.filename)

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    // new header validations
    const headerRow = worksheet.getRow(RULES.excel.headerRow);
    const fileHeaders = headerRow.values.slice(1);
    const { normalized: headers, missing } = buildHeaderMap(fileHeaders, RULES);

    if (missing.length > 0){
      return res.render('preview', {
        file: req.file.filename,
        sheet: worksheet.name,
        rows: [],
        error: `Faltan columnas obligatorias: ${missing.join(', ')}`
      });
    }


    //** End of new header validations */


    //Header validations
    //const headerRow = worksheet.getRow(1);
    //const headers = headerRow.values.slice(1).map(textHelper.cellToText);

    const REQUIRED_HEADERS = ['S.No', 'Prompt', '1 Outcome']

    const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return res.render('preview', {
        file: req.file.filename,
        sheet: worksheet.name,
        headers,
        rows: [],
        error: `Faltan columnas obligatorias:  ${missingHeaders.join(', ')}`
      });
    }

    //End Header validations

    if (!worksheet) {
      return res.render('preview', {
        file: req.file.filename,
        sheet: '(sin hoja)',
        rows: [],
        error: 'No se encontró ninguna hoja de Excel'
      })
    }

    // New validation data for each row using RULES Ajv
    const rows = [];
    let txtContent = '';
    const errors = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === RULES.excel.headerRow) return //skip the header

      const values = row.values.slice(1);
      const rowObj = {};
      headers.forEach((h,i) => rowObj[h] = values[i]);

      errors.push(...validateRowObject(rowObj, RULES, rowNumber));

      const line = headers.map(h => rowObj[h] ?? '').join(` ${RULES.txt.delimiter}`);
      txtContent += line + '\n';
      rows.push(headers.map(h => rowObj[h] ?? ''));
    });

    if (errors.length > 0){
      return res.render('preview', {
        file: req.file.filename,
        sheet: worksheet.name,
        rows: [],
        error: errors.slice(0,15).join(' — ') + (errors.length > 15 ? ` — (+${errors.length - 15} mas)` : '')
      });
    }


    //**End of   New validation data for each row using RULES Ajv*/

    //Validation data for each row --Old One, without rules--
    /* 
    const COLUMN_TYPES = {
      'S.No': 'number',
      'Prompt': 'string',
      '1 Outcome': 'string'
    }
    const rows = [];
    let txtContent = '';
    const errors = [];

    //call upon rows

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return //skip the header

      const values = row.values.slice(1)
      const rowData = {}

      headers.forEach((header, index) => {
        rowData[header] = values[index]
      })
      //**End of Validation data for each row**

      //tipes validation
      for (const [column, type] of Object.entries(COLUMN_TYPES)) {
        const value = rowData[column];

        if (type === 'number' && isNaN(Number(value))) {
          errors.push(
            `Fila ${rowNumber}: "${column}" debe ser un valor numerico`
          )
        }

        if (type === 'string' && (!value || String(value).trim() === '')) {
          errors.push(`Fila ${rowNumber}: "${column}" no puede estar vacio`)
        }
      }
      //**End of tipes validation**

      rows.push(headers.map(h => rowData[h]));
      txtContent += headers.map(h => rowData[h]).join(' | ') + '\n'

    })

    if (errors.length > 0) {
      return res.render('preview', {
        file: req.file.filename,
        sheet: worksheet.name,
        rows: [],
        errors: errors.join(' -- ')
      })
    } */



    /* 
      //rowNumber usually is an array. Suggestion: ignore the 0 index if it comes empty
      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      const cleanValues = values.map((v) => 
            (v === null || v === undefined ? "" : String(v)));
      rows.push(cleanValues);

      txtContent += cleanValues.join('|' + '\n');
    }); */

    const txtFileName = req.file.filename.replace('.xlsx', '.txt');
    const txtFilePath = path.join(__dirname, 'reports', txtFileName);
    fs.writeFileSync(txtFilePath, txtContent, 'utf8')

    return res.render('preview', {
      file: req.file.filename,
      sheet: worksheet.name || 'Hoja 1',
      headers,
      rows,
      txtFile: txtFileName
    })
  } catch (error) {
    return res.render('preview', {
      file: req.file?.filename || 'desconocido',
      sheet: '(desconocida)',
      rows: [],
      error: error.message
    })
  }
})
// =================================+++++++==================================================//


app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'reports', req.params.filename)
  res.download(filePath)
})

//Route to download the excel file from txt
app.get('/download-excel/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'excels', req.params.filename)
  res.download(filePath)
})

//** End Routes */

const startServer = async (req, res) => {
  app.listen(port, () => {
    console.log(`Server initiated on port ${port}`)
  })
}

async function main () {
  //textFormatters();
  startServer()
  /*     
    const data = await excelService.readExcelFile(dirService.excelFilePath('dataExample.xlsx'));
    console.log(data); */
}

main()
