var _      = require('lodash'),
    stocks = require('./server_stub_stocks');

var _user_watchlist = [
    { id: 1, name: 'SPY', hasData: true, order: 0 },
    { id: 2, name: 'NDX', hasData: true, order: 1 },
    { id: 3, name: 'QQQ', hasData: true, order: 2 }
];


function getUserWatchList() {
    return _user_watchlist;
}
exports.getUserWatchList = getUserWatchList;


function addItemToWatchlist(itemName) {

    var maxItem = { id: -1 };

    if(_user_watchlist.length != 0) {
        maxItem = _.max(_user_watchlist, function (item) {
            return item.id;
        });
    }

    var hasData = !_.isNull(stocks.getInfo(itemName)) ? true : false;

    var newItem = {
        id: maxItem.id + 1,
        name: itemName,
        hasData: hasData,
        order: _user_watchlist.length
    };

    _user_watchlist.push(newItem);

    return newItem;
}
exports.addItemToWatchlist = addItemToWatchlist;


function removeItemFromWatchlist(itemId) {
    var partitioned = _.partition(_user_watchlist, { id: itemId });

    _user_watchlist = partitioned[1];

    return partitioned[0];
}
exports.removeItemFromWatchlist = removeItemFromWatchlist;
