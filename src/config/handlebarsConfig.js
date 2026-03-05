import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

const __dirname = path.resolve();


const handlebarsConfig = (app) => {
    app.engine('handlebars', handlebars.engine());
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, './src/views'));
    
}

export default handlebarsConfig;