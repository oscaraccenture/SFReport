import fs from 'fs';

const lineBar = '\n/*****************************************************************/\n';
    const outcomeLines = `\n\nOutcome 1:\n\nOutcome 2:\n\nOutcome 3:\n\nOutcome 4:\n\nOutcome 5:\n\n`;
    const outcomeLinesSame = `\n\nOutcome 1:\n\nOutcome 2:\nsame as outcome 1\n\nOutcome 3:\nsame as outcome 1\n\nOutcome 4:\nsame as outcome 1\n\nOutcome 5:\nsame as outcome 1\n\n`;
    const queryInfoLines = `\n\nQuery 1:\n\nQuery 2:\n\nObservations:\n\nIssue Category:\n\nQuery used to retrieve the expected results:\n\n`;

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

const promptLine = (item) =>{
    return `${lineBar}\nPermission/Role:\n\n${item['Role']}\n\nPrompt Nro:\n\n${item['S. No.']}\n\nTab/Category:\n\n${item['Category']} \n\nPrompt Type: \n\n${item['Prompt Type']}\n\nPrompt:\n\n${item['Utterance']}\n\nExpected Answer:\n ${outcomeLinesSame}\n ${queryInfoLines}\n${lineBar}`;
} 

const formatTextContent = (dataExcel) => {

    
    let report = '';
    dataExcel.forEach((item =>{
        report += promptLine(item);
    }));
    return report;
}




export {
    readTextFile,
    writeTextFile,
    formatTextContent
}
