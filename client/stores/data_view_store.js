
var dispatcher   = require('../dispatcher'),
    dataview     = require('../events/data_view'),
    dvConst      = require('../constants/data_view'),
    _            = require('lodash'),
    EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = 'change';


/*
 * select an appropriate height for each cell
 * of the data view window
 */
function _suggestHeight(rows) {
    switch(rows) {
        case 1: return 500; break;

        case 2: return 250; break;

        default: return 125;
    }
}


/*
 * given a layoutState, create an iterator that returns
 * a row and column index on each successive call
 * NOTE: only exported for testing purposes
 */
function _gridStateWalker(layoutState) {
    var rows = layoutState.rows,
        cols = layoutState.cols,
        iterRow = 0;
        iterCol = 0,
        hasNext = true;

    if(rows < 1 || cols < 1) {
        throw new Error('_gridStateWalker: invalid indexes');
    }

    return function () {
        if(!hasNext) {
            return false;
        }

        var indexes = ['row_'+iterRow, 'col_'+iterCol];

        iterCol += 1;

        if(iterCol !== cols) {
            return indexes;
        }

        iterCol = 0;
        iterRow += 1;

        if(iterRow !== rows) {
            return indexes;
        }

        hasNext = false;
        return indexes;
    };
}
exports._gridStateWalker = _gridStateWalker;


/*
 * used only by chart context. given a lauout string like 'GRID_NxM'
 * produce an object that has the following properties:
 * rows {int} equal to N
 * cols {int} equal to M
 * mapping {object} keys 'row_0' to 'row_N-1'
 *  each row_ has keys 'col_0' to 'col_M-1'
 *    each col_ has various attributes (height, mode)
 * NOTE: only exported for testing purposes
 */
function _generateLayout(layoutType) {
    var layoutState = {};

    var dimensions = layoutType.split('_')[1].split('x'),
        rows       = parseInt(dimensions[0]),
        cols       = parseInt(dimensions[1]),
        cellheight = _suggestHeight(rows);

    layoutState.rows = rows;
    layoutState.cols = cols;
    layoutState.mapping = {};

    for(var i = 0; i < rows; i++) {

        var rowId = 'row_' + i;
        layoutState.mapping['row_'+i] = {};

        for(var j = 0; j < cols; j++) {
            var colId = 'col_' + j;
            layoutState.mapping[rowId][colId] = {
                height: cellheight,
                mapTo: null,
                hasData: false,
                mode: null
            };
        }
    }

    return layoutState;
}
exports._generateLayout = _generateLayout;


/*
 * get the entries in the layoutstate, that have a mapTo property.
 * flatting the objects structure into a list
 * NOTE: only exported for testing purposes
 */
function _chartContextData(layoutState) {
    var ctxAccum = [];

    _.each(layoutState.mapping, function (rows) {
        _.each(rows, function (col) {
            if(!_.isNull(col.mapTo)) {
                ctxAccum.push(col);
            }
        });
    });

    return ctxAccum;
}
exports._chartContextData = _chartContextData;


/*
 * takes the old chart layout and a new chart layout, and
 * transfers the state of the cells from old to new. if
 * the number of cells (with data) in the old context is
 * is larger than the number of cells in the new context,
 * the unassigned field of the return value will be populated.
 * NOTE: only exported for testing purposes
 */
function _transferLayout(oldChartLayoutState, newChartLayoutState) {
    var unassigned    = [],
        oldLayoutData = _chartContextData(oldChartLayoutState),
        stateWalker   = _gridStateWalker(newChartLayoutState);

    _.each(oldLayoutData, function (data) {
        var idx = stateWalker();

        if(idx) {
            var ref = newChartLayoutState.mapping[idx[0]][idx[1]];
            ref.mapTo = data.mapTo;
            ref.hasData = data.hasData;
            ref.mode = data.mode;
        }
        else {
            unassigned.push(data);
        }
    });

    return{
        layoutState: newChartLayoutState,
        unassigned: unassigned
    };
}
exports._transferLayout = _transferLayout;


/*
 * application state for the data view tabs
 * the initial state is a 1x1 chart
 */
var _data_view = {
    view: dvConst.views.CHART,

    chartContext: {
        layoutType: dvConst.chartGridContext.GRID_1x1,
        layoutState: _generateLayout(dvConst.chartGridContext.GRID_1x1)
    },

    positionContext: {
    },

    tradeContext: {
    },
};


var DataViewStore = _.extend({}, EventEmitter.prototype, {

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
        return _data_view;
    }

});


DataViewStore.dispatchToken = dispatcher.register(function(action) {

    switch(action.type) {

        /*
         * this event is emitted by clicking on a button in the
         * data view header
         */
        case dataview.DATA_VIEW_CHANGED:
            _data_view.view = action.view;

            switch(_data_view.view) {
                case dvConst.views.POSITION:
                    _data_view.positionContext = action.context;
                break;
                case dvConst.views.TRADE:
                    _data_view.tradeContext = action.context;
                break;
                default:
                    _data_view.chartContext = action.context;
                break;
            }

            DataViewStore.emitChange();
            break;

        /*
         * only update the layout if the chart view is in focus
         * this event is emitted by the layout combobox
         */
        case dataview.CHART_LAYOUT_CHANGED:
            if(_data_view.view === dvConst.views.CHART) {
                _data_view.chartContext.layoutType = action.layout;
                _data_view.chartContext.layoutState = _generateLayout(action.layout);
            }
            DataViewStore.emitChange();
            break;


        default:
            // do nothing
    }

});
exports.DataViewStore = DataViewStore;
