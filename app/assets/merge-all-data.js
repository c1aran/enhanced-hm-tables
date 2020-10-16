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

module.exports = async () => {

    let playerIdIndex = [];

    for (let i = 0; i < hmData.length; i++) {
        playerIdIndex[i] = hmData[i].id;
        hmData[i]['info'] = [];
    }

    for (let i = 0; i < sihfData.length; i++) {

        let bestMatchResult = stringSimilarity.findBestMatch(sihfData[i].id, playerIdIndex);

        if (bestMatchResult.bestMatch.rating > 0.6) {

            let index = bestMatchResult.bestMatchIndex;

            hmData[index]['info'].push(sihfData[i]);
        }

    }

    // Write the merged player data to a json file
    fs.writeFile(
        mergedFilePath, 
        JSON.stringify(hmData, null, 2),
        (err) => err ? console.error('Merged Data not written to file!', err) : console.log('Data merge complete.')
    );

    await exportWantedData(hmData);

}

async function exportWantedData(hmArray) {
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
        (err) => err ? console.error('Export of merged data failed!', err) : console.log('Exported merged data to public folder!')
    );
}

function getTeamLogo(key) {
    return teamLogos[key];
}