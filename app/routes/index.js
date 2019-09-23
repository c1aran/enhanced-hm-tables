const express = require('express');
const getTableData = require('../assets/scraper.js');
const columnData = require('../data/columns.json');
const columnTypes = require('../data/columns-type.json');
const teamLogos = require('../data/team-logos.json');
const router = express.Router();

router.get('/', function (req, res) {

    const tableData = req.app.get('appData');
    const htmlTable = json2table(tableData);

    (async function main() {
        try {
            await getTableData();
        } catch (err) {
            console.error(err);
        }
    })();

    res.render('index', {
        table: htmlTable
    });

});

function json2table(jsonFile) {

    if (typeof jsonFile !== 'undefined' && jsonFile.length > 0) {

        var cols = Object.keys(jsonFile[0]);
        var headerRow = '';
        var bodyRows = '';
    
        cols.map(function (col) {
            headerRow += '<th class="sort ' + col + '" data-sort="' + col + '">' + getColumnName(col) + '</th>';
        });
    
        jsonFile.map(function (row) {
            bodyRows += '<tr>';
    
            cols.map(function (colName) {

                if (colName === 'ptsPerGame') {

                    const points = row['points'];
                    const games = row['games'];
                    let value = 0;

                    if (games > 0) {
                        value = points/games;
                    }

                    bodyRows += '<td class="' + colName + ' ' + getColumnType(colName) + '">' + (value).toFixed(2) + '</td>';

                } else if (colName === 'ptsPerM') {

                    const points = row['points'];
                    const price = row['price'];

                    const value = points/price;

                    bodyRows += '<td class="' + colName + ' ' + getColumnType(colName) + '">' + (value).toFixed(2) + '</td>';

                } else if (colName === 'ptsCostPerGame') {

                    const points = row['points'];
                    const price = row['price'];
                    const games = row['games'];
                    let value = 0;

                    if (games > 0) {
                        value = (points/price)/games;
                    }

                    bodyRows += '<td class="' + colName + ' ' + getColumnType(colName) + '">' + (value).toFixed(2) + '</td>';

                } else if (colName === 'team') {
                    bodyRows += '<td class="' + colName + ' ' + getColumnType(colName) + '"><i class="sprite ' + getTeamLogo(row['team']) +'"></i></td>';
                } else {
                    bodyRows += '<td class="' + colName + ' ' + getColumnType(colName) + '">' + row[colName] + '</td>';
                }

            });
    
            bodyRows += '</tr>';
        });
    
        return '<div id="stats"><table><thead><tr>' + headerRow + '</tr></thead><tbody class="list">' + bodyRows + '</tbody></table></div>';

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

module.exports = router;