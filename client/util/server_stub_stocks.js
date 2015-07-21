/*
 * stocks availble to be added to watchlist or charted
 */

var _ = require('lodash');

var _stocks = [
    { name: 'SPY', mu: 212.48, sigma: 3 },
    { name: 'NDX', mu: 4661.2, sigma: 3 },
    { name: 'QQQ', mu: 113.57, sigma: 3 },
    { name: 'GOOGL', mu: 699.62, sigma: 3 },
    { name: 'FB', mu: 94.97, sigma: 3 }
];


function getInfo (stockName) {
    var ref = _.find(_stocks, function (obj) {
        return obj.name === stockName;
    });

    if(!_.isUndefined(ref)) {
        return ref;
    }

    return null;
}
exports.getInfo = getInfo;
