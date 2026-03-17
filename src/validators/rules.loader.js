import fs from 'fs';
import Ajv from 'ajv';
import path from 'path';


function loadJson (filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}

function loadRules(){
    const rulesPath = path.join(__dirname, '..', 'config', 'rules.json');
    const schemaPath = path.join(__dirname, '..', 'config', 'rules.schema.json');

    const rules = loadJson(rulesPath);
    const schema = loadJson(schemaPath);

    const ajv = new Ajv({ allErros: true, strict: false});
    const validate = ajv.compile(schema);

    if(!validate(rules)){
        const msg = validate.errors
                    .map(e => `${e.instancePath} ${e.message}`)
                    .join(' | ');
        throw new Error(`rules.json invalido: ${msg}`);
    }

    return rules;
}

const rules = {
    loadRules
}

export default rules;