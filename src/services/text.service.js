import fs from 'fs';
import SeveralModel from '../models/sevOutcomes.model.js';

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

//Better method version using ternary operator to validate if dataExcel is an array, if not return empty string
/* 
const formatTextExpectedOutcome1 = (dataExcel = []) =>
  (Array.isArray(dataExcel) ? dataExcel : []).reduce((report, item) => report + promptLineExpectedResult(item), '');

 */



/* 
Sheet1: [
    {
      'S. No.': 1,
      Category: '1710118-[TEST] Agentforce - Implementation of Financial Details using Prompt Template - Exe',
      Role: 'N/A',
      'Prompt Type': 'N/A'
    }, 
*/


/* 
Read the information from the excel file
Use the class sevOutcomes model
create an excel file with the information read from the excel file with the format
outcome 1: lorem ipsum
outcome 2 lorem ipsum

the method stores the information in an array of objects with the format of the class several Outcomes
myArray = [
     {
      'S. No.': 1,
      Category: '1710118-[TEST] Agentforce - Implementation of Financial Details using Prompt Template - Exe',
      Role: 'N/A',
      'Prompt Type': 'N/A',
      'utterance': 'Sample Utterance',
      'outcome 1': 'Sample outcome 1',
      ...
      'outcome 5': 'Sample outcome 5'
     }
]
*/


//Array to store the information and pass it to the method to create the excel file with the format of several outcomes
const formatDataToSeveralOutcomesModel = (dataExcel) => {
    const dataArray = [];
    dataArray.push(dataExcel.map(item => new SeveralModel(
        item['S. No.'],
        item['Category'],
        item['Role'],
        item['Prompt Type'],
        item['Utterance'],
        item['Outcome 1'],
        item['Outcome 2'],
        item['Outcome 3'],
        item['Outcome 4'],
        item['Outcome 5']
    )));
    return dataArray;
}

//Method to read the excel file and return the information in the format of the class several outcomes

const formatDataSeveralOutcomes = (data) => {
    
}

/* 
const myArray = text.split(/outcome\s[0-9]\W/);
*/

export {
    readTextFile,
    writeTextFile,
    formatTextContent,
    formatTextContentSeveralOutcomes,
    formatTextExpectedOutcome
}
