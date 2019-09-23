'use strict'

const express = require('express');
const tableData = require('./data/table.json');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('appData', tableData);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(require('./routes/index'));
app.use(express.static('app/public')); 

const server = app.listen(app.get('port'), () => {
    console.log(`Express running -> PORT ${server.address().port}`);
});