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

/* 
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.render('home', {
        title: 'Mi primer sitio con Express + Handlebars',
        mensaje: 'Error al subir archivo',
        error: 'No se recibió ningún archivo'
      });
    }
  
    res.render('home', {
      title: 'Mi primer sitio con Express + Handlebars',
      mensaje: 'Archivo subido con éxito',
      file: req.file.filename
    });
}); 
*/

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
      return res.render("home", {
        title: "Mi primer sitio con express + handlebars bro",
        message: "TXT subido con exito",
        file: req.file.filename,
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
