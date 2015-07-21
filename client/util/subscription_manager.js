var Stock       = require('./stock_model.js'),
    stockLookup = require('./server_stub_stocks.js'),
    _           = require('lodash');

/*
 * key is the ticker symbol,
 * value id the intervalId received
 * from setInterval
 */
var dataViewChartSubscriptions = { }


/*
 * key is the ticker symbol,
 * value id the intervalId received
 * from setInterval
 */
var watchlistSubscriptions = { }


function getStock (stockName) {
    var stock = stockLookup.getInfo(stockName);

    if(_.isNull(stock)) {
        return null;
    }

    return new Stock(stockName, stock.mu, stock.sigma);
}


/*
 * WATCHLIST METHODS
 */


/*
 * remove stock from watch list if present,
 * deactivate timer
 */
function watchlistUnSubscribe(stockName) {
    if(_.has(watchlistSubscriptions, stockName)) {

        clearInterval(watchlistSubscriptions[stockName].intervalId);

        delete watchlistSubscriptions[stockName];
    }
}
exports.watchlistUnSubscribe = watchlistUnSubscribe;


/*
 * intialize a new stock if it doesnt already exist in the
 * watchlist. attach the onMessage callback.
 * @onMessage {callback}, takes one argument which represents
 * the current time and price.
 */
function watchlistSubscribe(stockName, onMessage) {
    if(!_.has(watchlistSubscriptions, stockName)) {

        // get mu, sigma from some datasource
        var stock = getStock(stockName);

        if(_.isNull(stock)) {
            return;
        }

        stock.initStream(60);

        stock.stream().on('message', onMessage);

        var intervalId = setInterval(function () {
            stock.processTick();
        }, 1000);

        watchlistSubscriptions[stockName] = {};
        watchlistSubscriptions[stockName].stock = stock;
        watchlistSubscriptions[stockName].intervalId = intervalId;
    }
}
exports.watchlistSubscribe = watchlistSubscribe;


/*
 * DATA VIEW CHART METHODS
 */


/*
 * remove stock from dataviewchart list if present,
 * deactivate timer
 */
function dataViewChartUnSubscribe(stockName) {
    if(_.has(dataViewChartSubscriptions, stockName)) {

        clearInterval(dataViewChartSubscriptions[stockName].intervalId);

        delete dataViewChartSubscriptions[stockName];
    }
}
exports.dataViewChartUnSubscribe = dataViewChartUnSubscribe;


/*
 * intialize a new stock if it doesnt already exist in the
 * historical list.
 * @onDataViewChartMessage {callback}, takes two arguments,
 * the array of historical values, and the present value
 */
function dataViewChartSubscribe(stockName, onDataViewChartMessage) {

    if(!_.has(dataViewChartSubscriptions, stockName)) {

        // get mu, sigma from some datasource
        var stock = getStock(stockName);

        if(_.isNull(stock)) {
            return;
        }

        stock.initStream(60);

        stock.stream().on('message', function (val) {
            onDataViewChartMessage(stock.historical(), val);
        });

        var intervalId = setInterval(function () {
            stock.processTick();
        }, 1000);

        dataViewChartSubscriptions[stockName] = {};
        dataViewChartSubscriptions[stockName].stock = stock;
        dataViewChartSubscriptions[stockName].intervalId = intervalId;
    }
}
exports.dataViewChartSubscribe = dataViewChartSubscribe;
