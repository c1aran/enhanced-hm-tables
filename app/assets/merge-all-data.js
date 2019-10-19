'use strict'

const fs = require('fs');
const stringSimilarity = require('string-similarity');

const sihfDataPath = './app/data/sihf-merged.json'; 
const hmDataPath = './app/data/table.json'; 
const mergedFilePath = './app/data/table-merged.json';

const sihfData = JSON.parse(fs.readFileSync(sihfDataPath));
const hmData = JSON.parse(fs.readFileSync(hmDataPath));

// console.log(sihfData);
// console.log(hmData);

// joinJsonArrays(hmData, sihfData);
mergeWithSimilarity(hmData, sihfData);

function mergeWithSimilarity(hmArray, sihfArray) {

    let playerIdIndex = [];

    for (let i = 0; i < hmArray.length; i++) {
        playerIdIndex[i] = hmArray[i].id;
    }

    for (let i = 0; i < sihfArray.length; i++) {

        let bestMatchResult = stringSimilarity.findBestMatch(sihfArray[i].id, playerIdIndex);

        if (bestMatchResult.bestMatch.rating > 0.6) {

            let index = bestMatchResult.bestMatchIndex;

            for(let key in sihfArray[i]) {
                hmArray[index][key] = sihfArray[i][key];
            }

        }

    }

    // Write the merged player data to a json file
    fs.writeFile(
        mergedFilePath, 
        JSON.stringify(hmArray, null, 2),
        (err) => err ? console.error('Merged Data not written to file!', err) : console.log('Merged Data written to file!')
    );

}