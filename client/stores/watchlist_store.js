/*
 * stores data from a subscription to many products.
 * current price only
 */


var dispatcher   = require('../dispatcher'),
    watchlist    = require('../events/watchlist'),
    _            = require('lodash'),
    EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = 'change';


var _watchlist = {},
    _isInitialized = false;


function _initializeWatchlist(ls) {
    _.each(ls, function (l) {
        _watchlist[l.id] = l;

        _watchlist[l.id].bid = null;
        _watchlist[l.id].ask = null;
        _watchlist[l.id].change = null;
    });

    _isInitialized = true;
}


function _addItemToWatchList(item) {
    _watchlist[item.id] = item;

    _watchlist[item.id].bid = null;
    _watchlist[item.id].ask = null;
    _watchlist[item.id].change = null;
}


function truncChange (chng) {
    var asPerc = chng * 100.0;
    return asPerc.toFixed(2);
}


function truncPrice (price) {
    return price.toFixed(2);
}


function _setPriceInfo(item) {

    var ref = _.find(_watchlist, function (obj) {
        return obj.name === item.name;
    });

    if(!_.isUndefined(ref)) {
        ref.bid = truncPrice(item.bid);
        ref.ask = truncPrice(item.ask);
        ref.change = truncChange(item.change);
    }
}


function _removeItems(itemList) {
    _.each(itemList, function (obj) {
        if(_.has(_watchlist, obj.id)) {
            delete _watchlist[obj.id];
        }
    });
    console.log(_watchlist);
}


var WatchlistStore = _.extend({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _watchlist[id];
    },

    getAll: function() {
        return _watchlist;
    },

    isInitialized: function() {
        return _isInitialized;
    },

    watchlistContains: function(itemName) {
        return !_.isUndefined(_.find(_watchlist, function (obj) {
            return obj.name === itemName;
        }));
    }

});


WatchlistStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case watchlist.WATCHLIST_ITEM_TICKED:
            _setPriceInfo(action.result);
            WatchlistStore.emitChange();
            break;

        case watchlist.WATCHLIST_INIT_RECEIVED:
            _initializeWatchlist(action.result);
            WatchlistStore.emitChange();
            break;

        case watchlist.WATCHLIST_NEW_ITEM_ADDED:
            _addItemToWatchList(action.result);
            WatchlistStore.emitChange();
            break;

        case watchlist.WATCHLIST_EXISTING_ITEM_REMOVED:
            _removeItems(action.result);
            WatchlistStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = WatchlistStore;
