
var dispatcher = require('../dispatcher'),
    dataview   = require('../events/data_view');

function changeDataView(view, context) {

    dispatcher.dispatch({
        type: dataview.DATA_VIEW_CHANGED,
        view: view,
        context: context
    });
}
exports.changeDataView = changeDataView;


function changeChartLayout(layout) {
    dispatcher.dispatch({
        type: dataview.CHART_LAYOUT_CHANGED,
        layout: layout
    });
}
exports.changeChartLayout = changeChartLayout;
