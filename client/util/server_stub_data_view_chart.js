/*
 * represents the serverside state of the chart view
 */

var _      = require('lodash'),
    stocks = require('./server_stub_stocks');

var _user_data_view_chart = {
    layoutType: 'GRID_1x1',
    layoutState: {
        rows: 1,
        cols: 1,
        mapping: {
            row_0: {
                col_0: {
                    mapTo: null, // maybe rename mapTo -> name
                    hasData: false,
                    mode: null
                }
            }
        }
    }
};


function getUserDataViewChart() {
    return _user_data_view_chart;
}
exports.getUserDataViewChart = getUserDataViewChart;
