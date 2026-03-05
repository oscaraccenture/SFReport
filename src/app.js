import { textFormatters } from "./services/main.service.js";
import express from 'express';
import handlebarsConfig from './config/handlebarsConfig.js';
import path from 'path';
import multer from 'multer';


//Experimental CODE
import excelService from './services/excel.service.js';
import dirService from "./services/dir.service.js";

const app = express();

handlebarsConfig(app);
const port = 3000;

//Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos .xlsx o .txt'));
    }
  };
  
  const upload = multer({
    storage,
    fileFilter
  });
  




app.get('/', (req,res) => {
    res.render('home', {
        title: 'Home',
        message: 'Handlebars is alive and working'
    });
});



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

const startServer = async (req,res) => {
    app.listen(port, () => {
        console.log(`Server initiated on port ${port}`);
    })
}




async function main (){
    //textFormatters();
    startServer();
/*     
    const data = await excelService.readExcelFile(dirService.excelFilePath('dataExample.xlsx'));
    console.log(data); */
}

main();