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

/* promptLineExpectedResult added columns to read from excel file 
Columns: 
Expected Result 
Sample Prompt Outcome
*/

const promptLineExpectedResult = (item) =>{
    return `${lineBar}\nPermission/Role:\n\n${item['Role']}\n\nPrompt Nro:\n\n${item['S. No.']}\n\nTab/Category:\n\n${item['Category']} \n\nPrompt Type: \n\n${item['Prompt Type']}\n\nPrompt:\n\n${item['Utterance']}\n\nExpected Answer:\n\n ${item['Expected Result']}\n\n Outcomes:\n\n${outcomeLinesSame}\n ${queryInfoLines}\n${lineBar}`;
} 


const promptLineSeveralOutcomes = (item) =>{
    return `${lineBar}\nPermission/Role:\n\n${item['Role']}\n\nPrompt Nro:\n\n${item['S. No.']}\n\nPrompt:\n\n${item['Prompt']} \n\nOutcome 1: \n\n${item['Outcome 1']}\n\nOutcome 2: \n\n${item['Outcome 2']}\n\nOutcome 3: \n\n${item['Outcome 3']}\n\nOutcome 4: \n\n${item['Outcome 4']}\n\nOutcome 5: \n\n${item['Outcome 5']}\n\nExpected Answer: \n ${queryInfoLines}\n${lineBar}`;
}


const formatTextContent = (dataExcel) =>
    dataExcel.reduce((report, item) => report + promptLine(item), '');

const formatTextContentSeveralOutcomes = (dataExcel) =>
    dataExcel.reduce((report, item) => report + promptLineSeveralOutcomes(item), '');

const formatTextExpectedOutcome = (dataExcel) =>
    dataExcel.reduce((report, item) => report + promptLineExpectedResult(item), '');



export {
    readTextFile,
    writeTextFile,
    formatTextContent,
    formatTextContentSeveralOutcomes,
    formatTextExpectedOutcome
}
