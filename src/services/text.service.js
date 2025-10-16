import fs from 'fs';

const readTextFile = (textFilePath) => {
    fs.readFile(textFilePath, 'utf8', (err, data) => {
        if (err){
            console.error("Error reading the file: ", err);
            return;
        }
        console.log('Contenido del archivo:', data);
    });
}

const writeTextFile = (filePath, content) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("Error writing the file: ", err);
            return;
        }
        console.log('Archivo escrito con éxito');
    });
}

export {
    readTextFile,
    writeTextFile
}
