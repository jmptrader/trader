/*
 * stores data from a subscription to many products.
 * current price only
 */


var dispatcher   = require('../dispatcher'),
    appState     = require('../events/app_state'),
    _            = require('lodash'),
    EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = 'change';


var _app_state = {};


var AppStateStore = _.extend({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function() {
        return _app_state;
    }

});


AppStateStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case appState.WINDOW_RESIZED:
            _app_state.height = action.height;
            _app_state.width = action.width;
            AppStateStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = AppStateStore;
