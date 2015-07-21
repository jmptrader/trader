var _      = require('lodash'),
    stocks = require('./server_stub_stocks');

var _user_data_view_chart = {
    layoutType: 'GRID_1x1',
    layoutState: {
        row_0: {
            col_0: {
                name: null,
                hasData: false
            }
        }
    }
};


function getUserDataViewChart() {
    return _user_data_view_chart;
}
exports.getUserDataViewChart = getUserDataViewChart;
