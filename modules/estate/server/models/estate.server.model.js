'use strict';
/**
 * Created by TimmosQuadros on 05-06-2018.
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Estate Schema
 */

const typesArray = ["V","R","E","F","L","HG","FG","A","VL","AN"];
const energyClassArray = ["A2020","A2015","A2010","B","C","D","E","F","G"];

var EstateSchema = new Schema({
    address: {
        street: String,
        city: String,
        zip: Number
    },livingSpace: {
        type: Number
    },basementSize:{
        type: Number
    },
    numberOfRooms: {
        type: Number
    },
    propertySize:{
      type: Number
    },
    type: {
        type: String,
        uppercase: true,
        required: true,
        enum: typesArray
    },
    energyClass: {
        type: String,
        uppercase: true,
        required: true,
        enum: energyClassArray
    },
    price: {
        type: Number
    },
    builtYear: {
        type: Number
    },
    daysActive: {
        type: Number
    },
    ownerExpense: {
        type: Number
    },
    imageURL: {
        type: String,
        default: 'modules/food/client/img/food/default.jpg'
    }
});

mongoose.model('Estate', EstateSchema);