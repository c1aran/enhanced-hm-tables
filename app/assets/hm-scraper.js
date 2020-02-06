'use strict'

const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://hockeymanager.ch/playerPerfomancePage';

    await page.goto(url);

    const table = await page.evaluate(
        () => Array.from(document.querySelectorAll('div.tab-pane:nth-child(1) > table:nth-child(1) tbody tr')) // get all the rows of the table
            .map(tableRow => ({ // map the contents of the rows
                id: tableRow.querySelector('.playerName').innerText.split(' ').sort().toString(),
                player: tableRow.querySelector('.playerName').innerText, // get the player name
                team: tableRow.querySelector('.teamName').innerText, // get the team name
                position: tableRow.querySelector('td:nth-of-type(5)').innerText, // get the position
                games: tableRow.querySelector('td:nth-of-type(6)').innerText, // get the number of games 
                goalsTotal: tableRow.querySelector('td:nth-of-type(7)').innerText.match(/^.*?(?=\()/)[0], // get the total goals
                goalsOt: tableRow.querySelector('td:nth-of-type(7)').innerText.match(/\((\d+)\)/)[1], // get the goals scored in OT
                assistsTotal: tableRow.querySelector('td:nth-of-type(8)').innerText.match(/^.*?(?=\()/)[0], // get the total assists
                assistsOt: tableRow.querySelector('td:nth-of-type(8)').innerText.match(/\((\d+)\)/)[1], // get the assists scored in OT
                penalty: tableRow.querySelector('td:nth-of-type(9)').innerText.match(/\d+/)[0], // get the penalty minutes
                points: tableRow.querySelector('td:nth-of-type(10)').innerText.match(/^.*?(?=\()/)[0], // get the hockey manager points
                ptsPerGame: ((tableRow.querySelector('td:nth-of-type(10)').innerText.match(/^.*?(?=\()/)[0])/(tableRow.querySelector('td:nth-of-type(6)').innerText)).toFixed(2),
                price: tableRow.querySelector('td:nth-of-type(11)').innerText.match(/\d+\.\d+/)[0], // get the price of the player
                ptsPerM: ((tableRow.querySelector('td:nth-of-type(10)').innerText.match(/^.*?(?=\()/)[0])/(tableRow.querySelector('td:nth-of-type(11)').innerText.match(/\d+\.\d+/)[0])).toFixed(2),
                ptsCostPerGame: (((tableRow.querySelector('td:nth-of-type(10)').innerText.match(/^.*?(?=\()/)[0])/(tableRow.querySelector('td:nth-of-type(11)').innerText.match(/\d+\.\d+/)[0]))/(tableRow.querySelector('td:nth-of-type(6)').innerText)).toFixed(2)
            }))
    );

    await browser.close();

    if (table.length > 0) {
        fs.writeFile(
            './app/data/table.json', 
            JSON.stringify(table, null, 2),
            (err) => err ? console.error('HM Data not written to file!', err) : console.log('HM Data written to file!')
        );
    } else {
        console.log('No Data was found.');
    }

};