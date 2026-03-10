import { textFormatters } from "./services/main.service.js";
import express from "express";
import handlebarsConfig from "./config/handlebarsConfig.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import exceljs from "exceljs";
import fs from 'fs';


//Experimental CODE
import excelService from "./services/excel.service.js";
import dirService from "./services/dir.service.js";
import { arch } from "os";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), "..");

handlebarsConfig(app);
const port = 3000;

//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".xlsx" || ext === ".txt") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos .xlsx o .txt"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

//Routes

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    message: "Handlebars is alive and working",
  });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.render("home", {
        title: "Mi primer sitio con Express + Handlebars",
        mensaje: "Error al subir archivo",
        error: "No se recibió ningún archivo",
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    //If the file is ext TXT, just confirmation (It's gonna be used strongly afterward)

    if (ext === ".txt") {
      const txtPath = path.join(__dirname, 'uploads', req.file.filename);
      
      const content = fs.readFileSync(txtPath, 'utf8');
      const lines = content
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line=> line.length>0);



      if (lines.length === 0){
        return res.render('home', {
          title: 'Mi primer sitio con Express + Handlebars bro TXT',
          message: 'El archivo TXT esta vacio, rayos',
          error: 'No hay contenido para procesar'
        });
      }

      // Parsing columns
      const rows = lines
                  .map(line => 
                        line.split('|')
                        .map(col => col.trim())
      );

      //Create the excel file
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Datos desde Txt mayumba');

      //headers
      worksheet.addRow(rows[0]);

      //Data
      for (let i=1; i < rows.length; i++){
        worksheet.addRow(rows[i]);
        console.log(rows[i]);
        console.log("Row added correctly");
      }


      //Save the excel file
      const excelFileName = req.file.filename.replace('.txt', '.xlsx');
      const excelPath = path.join(__dirname, 'excels', excelFileName);

      await workbook.xlsx.writeFile(excelPath);

      return res.render("home", {
        title: "Mi primer sitio con express + handlebars bro == guardar TXT a Excel",
        message: "Excel generado correctamente desde TXT",
        file: excelFileName,
        excelFile: excelFileName
      });
    }

    //If the file is xlxs: read it with ExcelJs from the hardisk
    const filePath = path.join(__dirname, "uploads", req.file.filename);

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    if (!workbook) {
      return res.render("preview", {
        file: req.file.filename,
        sheet: "(sin hoja)",
        rows: [],
        error: "No se encontró ninguna hoja de Excel",
      });
    }

    const rows = [];
    let txtContent = '';
    //call upon rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      //rowNumber usually is an array. Suggestion: ignore the 0 index if it comes empty
      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      const cleanValues = values.map((v) => 
            (v === null || v === undefined ? "" : String(v)));
      rows.push(cleanValues);

      txtContent += cleanValues.join('|' + '\n');
    });

    const txtFileName = req.file.filename.replace ('.xlsx', '.txt');
    const txtFilePath = path.join(__dirname, 'reports', txtFileName);
    fs.writeFileSync(txtFilePath, txtContent, 'utf8');

    return res.render("preview", {
      file: req.file.filename,
      sheet: worksheet.name || "Hoja 1",
      rows,
      txtFile: txtFileName
    });
  } catch (error) {
    return res.render("preview", {
      file: req.file?.filename || "desconocido",
      sheet: "(desconocida)",
      rows: [],
      error: error.message,
    });
  }
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'reports', req.params.filename);
  res.download(filePath);
})

//Route to download the excel file from txt
app.get('/download-excel/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'excels', req.params.filename);
  res.download(filePath);
});

//** End Routes */


const startServer = async (req, res) => {
  app.listen(port, () => {
    console.log(`Server initiated on port ${port}`);
  });
};

async function main() {
  //textFormatters();
  startServer();
  /*     
    const data = await excelService.readExcelFile(dirService.excelFilePath('dataExample.xlsx'));
    console.log(data); */
}

main();
