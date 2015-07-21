
/*
 * This file bootstraps the entire application.
 */


var Watchlist = require('./components/watchlist.react'),
    DataView  = require('./components/data_view.react'),
    subs      = require('./util/subscription_manager'),
    dataViewChartActions = require('./actions/data_view_chart_action_creator');


var React = require('react'),
    _     = require('lodash');


window.React = React; // export for http://fb.me/react-devtools

window._ = _;

window.subs1 = subs;

window.dataViewChartActions = dataViewChartActions;

React.render(
    <Watchlist />,
    document.getElementById('watchlist')
);

React.render(
    <DataView />,
    document.getElementById('data-view-container')
);
