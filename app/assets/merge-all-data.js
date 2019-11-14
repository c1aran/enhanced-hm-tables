'use strict'

const fs = require('fs');
const stringSimilarity = require('string-similarity');
const teamLogos = require('../data/team-logos.json');

const sihfDataPath = './app/data/sihf-merged.json'; 
const hmDataPath = './app/data/table.json';
const showColumnsPath = './app/data/columns/columns-show.json' ;
const mergedFilePath = './app/data/table-merged.json';
const exportFilePath = './app/public/data/table.json';

const sihfData = JSON.parse(fs.readFileSync(sihfDataPath));
const hmData = JSON.parse(fs.readFileSync(hmDataPath));
const showColumns = JSON.parse(fs.readFileSync(showColumnsPath));

// console.log(sihfData);
// console.log(hmData);

// joinJsonArrays(hmData, sihfData);
mergeWithSimilarity(hmData, sihfData);

function mergeWithSimilarity(hmArray, sihfArray) {

    let playerIdIndex = [];

    for (let i = 0; i < hmArray.length; i++) {
        playerIdIndex[i] = hmArray[i].id;
        hmArray[i]['info'] = [];
    }

    for (let i = 0; i < sihfArray.length; i++) {

        let bestMatchResult = stringSimilarity.findBestMatch(sihfArray[i].id, playerIdIndex);

        if (bestMatchResult.bestMatch.rating > 0.6) {

            let index = bestMatchResult.bestMatchIndex;

            hmArray[index]['info'].push(sihfArray[i]);
        }

    }

    // Write the merged player data to a json file
    fs.writeFile(
        mergedFilePath, 
        JSON.stringify(hmArray, null, 2),
        (err) => err ? console.error('Merged Data not written to file!', err) : console.log('Merged Data written to file!')
    );

    exportWantedData(hmArray);

}

function exportWantedData(hmArray) {
    let exportArray = [];

    for (let i = 0; i < hmArray.length; i++) {

        exportArray.push({});

        for (let key in hmArray[i]) {            
        
            if (showColumns[key]) {

                if (key != 'info' && key != 'team') {

                    exportArray[i][key] = hmArray[i][key];

                } else if (key != 'info' && key == 'team') {

                    exportArray[i][key] = '<i class="sprite ' + getTeamLogo(hmArray[i][key]) +'"></i>';

                }

                
            }

        }

        exportArray[i]['info'] = [];
        exportArray[i]['info'].push({});

        for (let key in hmArray[i]['info'][0]) {    

            if (showColumns['info'][0][key]) {
                exportArray[i]['info'][0][key] = hmArray[i]['info'][0][key];
            }

        }
    }

     // Write the merged player data to a json file
     fs.writeFile(
        exportFilePath, 
        JSON.stringify(exportArray, null, 2),
        (err) => err ? console.error('Merged Data not written to file!', err) : console.log('Merged Data written to file!')
    );
}

function getTeamLogo(key) {
    return teamLogos[key];
}