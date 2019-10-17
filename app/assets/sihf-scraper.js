'use strict'

const request = require('request');
const fs = require('fs');
const csv = require('csvtojson');
const mergedFilePath = './app/data/sihf-merged.json';

const options = {
    delimiter: ";"
}

const sihfData = [

    {
        'id': 'summary',
        'name': 'Summary',
        'localPath': './app/data/sihf/sihf-summary.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=player&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=points&orderByDescending=true&format=csv'
    },
    {
        'id': 'goals',
        'name': 'Goals / Assists',
        'localPath': './app/data/sihf/sihf-goals.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=playerGoalAssist&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=goals&orderByDescending=true&format=csv'
    },
    {
        'id': 'shots',
        'name': 'Shots',
        'localPath': './app/data/sihf/sihf-shots.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=playerShotDetail&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=sogSog&orderByDescending=true&format=csv'
    },
    {
        'id': 'penalties',
        'name': 'Penalties',
        'localPath': './app/data/sihf/sihf-penalties.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=playerFoul&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=pimTotal&orderByDescending=true&format=csv'
    },
    {
        'id': 'shootouts',
        'name': 'Shootouts',
        'localPath': './app/data/sihf/sihf-shootouts.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=playerShootout&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=penShots&orderByDescending=true&format=csv'
    },
    {
        'id': 'toi',
        'name': 'Time on Ice',
        'localPath': './app/data/sihf/sihf-toi.json',
        'url': 'https://data.sihf.ch/Statistic/api/cms/export?alias=playerTimeOnIce&searchQuery=1%2F%2F1&filterQuery=&filterBy=Season%2CPhase&orderBy=timeOnIcePerGame&orderByDescending=true&format=csv'
    }

];

module.exports = async () => {

    // array needed to pass all scraped data to merge function 'joinJsonArrays()'
    var funcArgs = [];  

    try {

        await (async () => {
    
            for (const item of sihfData) {          

                // get csv data and convert it to a json array
                const tempJsonData =  await request.get(item.url).pipe(csv(options));

                // push json array to funcArgs array
                funcArgs.push(tempJsonData);
                
                /* fs.writeFile(
                    item.localPath, 
                    JSON.stringify(tempJsonArray, null, 2),
                    (err) => err ? console.error('SIHF Data "' + item.name + '" not written to file!', err) : console.log('SIHF Data "' + item.name + '" written to file!')
                ); */

            } 

        })();

    } catch (err) {
        console.error(err);
    }
   
    // merge scraped data into one json object
    joinJsonArrays(funcArgs);
    
};

function joinJsonArrays() {

    var idMap = {};

    const playerData = arguments[0]

    // Iterate over playerData
    for (var i = 0; i < playerData.length; i++) {

        // Iterate over individual playerData arrays
        for (var j = 0; j < playerData[i].length; j++) {

            var currentID = playerData[i][j]['Spieler'];

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

    for (let obj of mergedArray) {
        obj.id = obj.Spieler.split(' ').sort().toString();
    }

    console.log("Table SIHF Merged Length: " + mergedArray.length);

    // Write the merged player data to a json file
    fs.writeFile(
        mergedFilePath, 
        JSON.stringify(mergedArray, null, 2),
        (err) => err ? console.error('SIHF Data not written to file!', err) : console.log('SIHF Data written to file!')
    );
}