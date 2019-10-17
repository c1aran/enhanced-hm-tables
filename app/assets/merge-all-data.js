'use strict'

const fs = require('fs');
const sihfDataPath = './app/data/sihf-merged.json'; 
const hmDataPath = './app/data/table.json'; 
const mergedFilePath = './app/data/table-merged.json';

const sihfData = JSON.parse(fs.readFileSync(sihfDataPath));
const hmData = JSON.parse(fs.readFileSync(hmDataPath));

// console.log(sihfData);
// console.log(hmData);

joinJsonArrays(sihfData, hmData);

function joinJsonArrays() {

    var idMap = {};

    const playerData = arguments;

    // Iterate over playerData
    for (var i = 0; i < playerData.length; i++) {

        // Iterate over individual playerData arrays
        for (var j = 0; j < playerData[i].length; j++) {

            var currentID = playerData[i][j]['id'];

            if(!idMap[currentID]) {
                idMap[currentID] = {};
            }

            // Iterate over properties of objects in arrays
            for(let key in playerData[i][j]) {
                idMap[currentID][key] = playerData[i][j][key];
            }
        }            

    }
  
    // push properties of idMap into an array
    var mergedArray = [];

    for (let property in idMap) {
        mergedArray.push(idMap[property]);        
    }

    console.log("Table Merged Length: " + mergedArray.length);
    // Write the merged player data to a json file
    fs.writeFile(
        mergedFilePath, 
        JSON.stringify(mergedArray, null, 2),
        (err) => err ? console.error('Merged Data not written to file!', err) : console.log('Merged Data written to file!')
    );
} 