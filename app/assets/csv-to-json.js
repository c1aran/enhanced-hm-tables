'use strict'

module.exports = async (csvFilePath) => {
    const fs = require('fs')
    const csv = require('csvtojson');

    const file = csvFilePath;
    const readStream = fs.createReadStream(file);
    
    readStream.pipe(csv()).pipe('./app/data/sihf.json');
};