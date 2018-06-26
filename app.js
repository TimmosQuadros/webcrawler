var express = require ('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var Crawler = require("crawler");
var fs   = require('fs');
var request = require('request');
const puppeteer = require('puppeteer');



//Connect to Mongoose
mongoose.connect('mongodb://localhost/myapp');
var db = mongoose.connection;

app.get('/',function(req,res){
    res.send('Hello World');
});

app.listen(3001);
console.log('Running on port 3001');

puppeteer.launch({headless: true, args:['--no-sandbox']}).then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.edc.dk/boligsalg/');
    // other actions...
    await delay(2000);
    await page.click(".search-header__toggle-btn","left");
    await delay(2000);
    await page.click("#ContentContentPlaceHolder_NewHeader_repeaterContentData_ctl00_0_ctl00_0_ctl00_0_ctl00_0_ctl01_0_ctl00_0_buttonSearch_0","left");
    await delay(2000);

    //const selectElem = await page.$('#ContentContentPlaceHolder_MainContentPlaceHolder_ResultSortingAndItemsPerPage_DropDownListItemsPerPage');
    //await selectElem.type('Value 1000');
    //console.log(selectElem);

    /*await page.evaluate(() => {
        document.querySelector('#ContentContentPlaceHolder_MainContentPlaceHolder_ResultSortingAndItemsPerPage_DropDownListItemsPerPage option:nth-child(2)').selected = true;
    });*/

    /*const option = (await page.$x(
        '//*[@id = "ContentContentPlaceHolder_MainContentPlaceHolder_ResultSortingAndItemsPerPage_DropDownListItemsPerPage"]/option[text() = "Alle"]'
    ))[0];
    const value = await (await option.getProperty('value')).jsonValue();*/

    await page.select('#ContentContentPlaceHolder_MainContentPlaceHolder_ResultSortingAndItemsPerPage_DropDownListItemsPerPage', "1000");
    await delay(5000);
    //await page.screenshot({path: 'example.png'});
    const imgs = await page.$$eval('.propertyitem__img', imgs => imgs.map(img => img.getAttribute('data-src')));
    const alts = await page.$$eval('.propertyitem__img', imgs => imgs.map(img => img.getAttribute('alt').replace(',',"")));
    var i = 0;
    imgs.forEach(function(element) {
        element = element.replace("_Size210x140","_Size1920x1080");
        if(element.includes("_Size300x200")){
            element = element.replace("_Size300x200","_Size1920x1080");
        }
        if(element.includes("billeder.edc.dk")) {
            if (element.substring(0, 2).localeCompare("//") == 0) {
                console.log(element);
                download("http:"+element, alts[i], 'images', function () {
                    //console.log('downloaded');
                });
            } else {
                console.log(element);
                download(element, alts[i], 'images', function () {
                    //console.log('downloaded');
                });
            }
        }
        i++;
    });
    /*imgs.forEach(function(element) {

    });*/

    //console.log("http:".substring(0,5).localeCompare("http:")==0);

    //console.log(imgs.length);
    console.log("Done");
});

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

function writeImageFile(imageData, fname){
    var imagedir = 'imagedir';

    fs.stat(imagedir, function(error, stat){
        if(error){
            fs.mkdirSync(imagedir, 0766);
        }
        fs.writeFile(imagedir + '/' + fname, imageData, 'binary', function(error){
            if(error){
                console.log(error);
            }
        });
    });
}

var download = function(uri, filename, imagedir, callback) {
    fs.stat(imagedir, function(error, stat){
        if(error){
            fs.mkdirSync(imagedir, 0766);
        }
    });

    // make the filename not need a directory
    var file = filename.split('/')[filename.split('/').length - 1];

    request.head(uri, function(err, res, body) {
        var r = request(uri).pipe(fs.createWriteStream(imagedir +'/'+ file+".jpg"));
        r.on('close', callback);
        r.on('error', callback);
    });
};




