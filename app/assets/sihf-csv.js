'use strict'

const request = require('request');
const fs = require('fs');
const csv = require('csvtojson');

const localFilePath = './app/data/sihf.json';
const url = 'https://data.sihf.ch/Statistic/api/cms/export?alias=player&searchQuery=1%2F%2F1&filterQuery=2020%2F3092&filterBy=Season%2CPhase&orderBy=points&orderByDescending=true&format=csv';

module.exports = async () => {
        
    (async () => {

        const options = {
            delimiter: ";",
            noheader: false,
            headers: ['R', 'player', 'team', 'position', 'games', 'goalsTotal', 'assistsTotal', 'points', 'ptsPerGame', 'penalty', '+/-']
        }
        
        const jsonArray =  await request.get(url).pipe(csv(options));

        fs.writeFile(
            localFilePath, 
            JSON.stringify(jsonArray, null, 2),
            (err) => err ? console.error('SIHF Data not written to file!', err) : console.log('SIHF Data written to file!')
        );

    })();  
    
};

function writeSuccess(err) {
    // check if there is error
    if (err) console.error(err);
    else console.log('write success');
  }