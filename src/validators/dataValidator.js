function normalizeHeader(h, rules){
    /* 
    The ?? operator in JavaScript is the nullish coalescing operator. It is a logical operator that returns its right-hand side 
    operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
     */
    const raw = String(h ?? '').trim(); 
    return rules.headerAliases[raw] || raw;
}

function validateHeaders(fileHeaders, rules){
    const normalized = fileHeaders.map(h => normalizeHeader(h, rules));
    const missing = rules.requiredHeaders.filter(h => !normalized.includes(h));
    return { headers: normalized, missing };
}

function validateRow(rowObj, rules, rowNumber){
    const errors = [];

    for (const [col, cfg] of Object.entries(rules.columns)){
        const value = rowObj[col];

        if(cfg.required && (!value || String(value).trim() === '')){
            errors.push(`Fila ${rowNumber}: "${col}" es obligatorio`);
            continue;
        }

        if(value){
            if (cfg.type === 'number' && isNaN(Number(value))){
                errors.push(`Fila ${rowNumber}: "${col}" es obligatorio`);
                continue;
            }

            if (cfg.type === 'string' && cfg.minLength){
                if (String(value).trim().length < cfg.minLength){
                    errors.push(`Fila ${rowNumber}: "${col}" minimo ${cfg.minLength} caracteres`);
                }
            }
        }
    }

    return errors;
}

const dataValidator = {
    validateHeaders,
    validateRow
}

export default dataValidator;