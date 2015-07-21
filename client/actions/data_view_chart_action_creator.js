
var dispatcher    = require('../dispatcher'),
    dataviewchart = require('../events/data_view_chart'),
    util          = require('../util/server_stub_data_view_chart'),
    subs          = require('../util/subscription_manager');


function inspect() {
    return util.getUserDataViewChart();
}
exports.inspect = inspect;


function getUserDataViewChart(layoutType, options) {

    setTimeout(function () {
        if(options.invalidateLayout) {
            dispatcher.dispatch({
                type: dataviewchart.DATA_VIEW_CHART_INIT_RECEIVED,
                result: {
                    layout: layoutType,
                    items: util.getUserDataViewChart()
                }
            });
        }

    }, 1000);
}
exports.getUserDataViewChart = getUserDataViewChart;


function addItemToDataViewChart(itemName, rowIdx, colIdx) {

    setTimeout(function () {
        dispatcher.dispatch({
            type: dataviewchart.DATA_VIEW_CHART_NEW_ITEM_ADDED,
            result: {
                rowIdx: rowIdx,
                colIdx: colIdx,
                added: util.addItemToDataViewChart(itemName)
            }
        });
    }, 1000);
}
exports.addItemToDataViewChart = addItemToDataViewChart;


function editItemInDataViewChart(item, rowIdx, colIdx) {
    // TODO:
    // get name of non updated item;
    // unsub from that item;
    // update the item at id
    // sub to new item

    setTimeout(function () {
        dispatcher.dispatch({
            type: dataviewchart.DATA_VIEW_CHART_EXISTING_ITEM_EDITED,
            result: {
                rowIdx: rowIdx,
                colIdx: colIdx,
                edited: util.editItemInDataViewChart(item)
            }
        });
    }, 1000);
}
exports.editItemInDataViewChart = editItemInDataViewChart;


function removeItemFromDataViewChart(itemId, rowIdx, colIdx) {

    var removes = util.removeItemFromDataViewChart(itemId);

    _.each(removes, function (obj) {
        subs.dataViewChartUnSubscribe(obj.name);
    });

    setTimeout(function () {
        dispatcher.dispatch({
            type: dataviewchart.DATA_VIEW_CHART_EXISTING_ITEM_REMOVED,
            result: {
                rowIdx: rowIdx,
                colIdx: colIdx,
                removed: removes.length > 0 ? removes[0] : {}
            }
        });
    }, 1000);
}
exports.removeItemFromDataViewChart = removeItemFromDataViewChart;


function dataViewChartSubscribe(stockName) {

    subs.dataViewChartSubscribe(stockName, function (historical, current) {
        dispatcher.dispatch({
            type: dataviewchart.DATA_VIEW_CHART_ITEM_TICKED,
            result: { historical: historical, current: current }
        });
    });
}
exports.dataViewChartSubscribe = dataViewChartSubscribe;
