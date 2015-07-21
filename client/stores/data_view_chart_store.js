/*
 * stores data from a subscription to many products.
 * current price only
 */


var dispatcher    = require('../dispatcher'),
    dataview      = require('../events/data_view'),
    dataviewchart = require('../events/data_view_chart'),
    dvConst       = require('../constants/data_view'),
    _             = require('lodash'),
    EventEmitter  = require('events').EventEmitter;


var CHANGE_EVENT = 'change';


var _data_view_items = {},
    _isInitialized = false;


function _initializeDataViewChart(items) {
    _isInitialized = true;
}


var DataViewChartStore = _.extend({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getAll: function() {
        return _data_view_items;
    }
});


DataViewChartStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        case dataviewchart.DATA_VIEW_CHART_ITEM_TICKED:
            DataViewChartStore.emitChange();
            break;

        /*
         * this event is emitted once per page load. it originiates
         * from the componentDidMount method defined in 'DataView'
         */
        case dataviewchart.DATA_VIEW_CHART_INIT_RECEIVED:
            if(!_isInitialized) {
                _initializeDataViewChart(/* action.items */);
            }
            DataViewChartStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = DataViewChartStore;
