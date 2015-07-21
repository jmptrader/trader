
var dispatcher = require('../dispatcher'),
    watchlist  = require('../events/watchlist'),
    util       = require('../util/server_stub_watchlist'),
    subs       = require('../util/subscription_manager');

function getUserWatchList() {

    setTimeout(function () {
        dispatcher.dispatch({
            type: watchlist.WATCHLIST_INIT_RECEIVED,
            result: util.getUserWatchList()
        });
    }, 1000);
}
exports.getUserWatchList = getUserWatchList;


function addItemToWatchlist(itemName) {

    setTimeout(function () {
        dispatcher.dispatch({
            type: watchlist.WATCHLIST_NEW_ITEM_ADDED,
            result: util.addItemToWatchlist(itemName)
        });
    }, 1000);
}
exports.addItemToWatchlist = addItemToWatchlist;


function removeItemFromWatchlist(itemId) {

    var removes = util.removeItemFromWatchlist(itemId);

    _.each(removes, function (obj) {
        subs.watchlistUnSubscribe(obj.name);
    });

    setTimeout(function () {
        dispatcher.dispatch({
            type: watchlist.WATCHLIST_EXISTING_ITEM_REMOVED,
            result: removes
        });
    }, 1000);
}
exports.removeItemFromWatchlist = removeItemFromWatchlist;


function watchlistSubscribe(stockName) {

    subs.watchlistSubscribe(stockName, function (val) {
        dispatcher.dispatch({
            type: watchlist.WATCHLIST_ITEM_TICKED,
            result: val
        });
    });
}
exports.watchlistSubscribe = watchlistSubscribe;
