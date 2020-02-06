'use strict'

const express = require('express');
const router = express.Router();

const getTableData = require('../assets/hm-scraper.js');
const getSihfData = require('../assets/sihf-scraper.js');
const refreshData = require('../assets/merge-all-data.js');

const columnData = require('../data/columns/columns-name.json');
const columnTypes = require('../data/columns/columns-type.json');
const columnShow = require('../data/columns/columns-show.json');
const teamLogos = require('../data/team-logos.json');


router.get('/', function (req, res) {

    const tableData = req.app.get('appData');
    const htmlTable = json2table(tableData);

    (async function main() {
        try {
            await getTableData();
            await getSihfData();
        } catch (err) {
            console.error(err);
        }
    })();

    res.render('index', {
        table: htmlTable
    });

    // res.render('index', {});

});

// add a document to the DB collection recording the click event
router.post('/refresh-data', (req, res) => {
    const click = {
        clickTime: new Date()
    };
    console.log(click);

    (async function main() {

        try {
            
            await refreshData().then(
                res.sendStatus(201)
            );

        } catch (err) {
            console.error(err);
        }
    })();

});

function json2table(jsonFile) {

    if (typeof jsonFile !== 'undefined' && jsonFile.length > 0) {

        var cols = Object.keys(jsonFile[0]);
        var headerRow = '<th></th>';
        // var bodyRows = '';

        cols.map(function (col) {

            if (showColumn(col) == 1) {
                headerRow += '<th>' + getColumnName(col) + '</th>';
            }

        });

        // jsonFile.map(function (row) {

        //     bodyRows += '<tr>';

        //     cols.map(function (colName) {

        //         if (showColumn(colName)) {

        //             if (colName === 'ptsPerGame') {

        //                 const points = row['points'];
        //                 const games = row['games'];
        //                 let value = 0;

        //                 if (games > 0) {
        //                     value = points/games;
        //                 }

        //                 bodyRows += '<td>' + (value).toFixed(2) + '</td>';

        //             } else if (colName === 'ptsPerM') {

        //                 const points = row['points'];
        //                 const price = row['price'];

        //                 const value = points/price;

        //                 bodyRows += '<td>' + (value).toFixed(2) + '</td>';

        //             } else if (colName === 'ptsCostPerGame') {

        //                 const points = row['points'];
        //                 const price = row['price'];
        //                 const games = row['games'];

        //                 let value = 0;

        //                 if (games > 0) {
        //                     value = (points/price)/games;
        //                 }

        //                 bodyRows += '<td>' + (value).toFixed(2) + '</td>';

        //             } else if (colName === 'team') {

        //                 bodyRows += '<td><i class="sprite ' + getTeamLogo(row['team']) +'"></i></td>';

        //             } else {

        //                 let value = row[colName];

        //                 if (value == undefined) {
        //                     value = 'n/a';
        //                 }

        //                 bodyRows += '<td>' + value + '</td>';
        //             }                
        //         }

        //     });

        //     bodyRows += '</tr>';

        // });

        // return '<div id="stats"><table id="playerTable"><thead><tr>' + headerRow + '</tr></thead><tbody class="list">' + bodyRows + '</tbody></table></div>';
        return '<div id="stats"><table id="playerTable"><thead><tr>' + headerRow + '</tr></table></div>';

    } else {

        return '<p>Aktuell keine Daten.</p>';

    }

}

function getColumnName(key) {
    return columnData[key];
}

function getColumnType(key) {
    return columnTypes[key];
}

function getTeamLogo(key) {
    return teamLogos[key];
}

function showColumn(key) {
    return columnShow[key];
}

module.exports = router;