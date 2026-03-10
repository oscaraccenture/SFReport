const cellToText = (v) => {
    if (v === null) return '';
    if (typeof v === 'object'){
        if (v.text) return String(v.text).trim();
        if (v.richText) return v.richText.map(t => t.text).join('').trim();
        if(v.result != null) return String(v.result).trim();
    }
    return String(v).trim();
};

const textHelper = {
    cellToText
};

export default textHelper;