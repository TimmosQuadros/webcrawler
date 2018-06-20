var express = require ('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var Crawler = require("crawler");


//Connect to Mongoose
mongoose.connect('');
var db = mongoose.connection;

app.get('/',function(req,res){
    res.send('Hello World');
});

app.listen(3000);
console.log('Running on port 3000');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

// Queue URLs with custom callbacks & parameters
c.queue([{
    uri: 'http://parishackers.org/',
    jQuery: false,

    // The global callback won't be called
    callback: function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            console.log('Grabbed', res.body.length, 'bytes');
        }
        done();
    }
}]);

