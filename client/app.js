
/*
 * This file bootstraps the entire application.
 */


var Watchlist = require('./components/watchlist.react'),
    DataView  = require('./components/data_view.react'),
    subs      = require('./util/subscription_manager'),
    dataViewChartActions = require('./actions/data_view_chart_action_creator'),
    appStateStore   = require('./stores/app_state_store'),
    appStateActions = require('./actions/app_state_action_creator');


var React = require('react'),
    _     = require('lodash');


window.React = React; // export for http://fb.me/react-devtools

window._ = _;

window.subs1 = subs;

window.dataViewChartActions = dataViewChartActions;


console.log('note: the way bootstrap row interacts with keen dashboards is wierd');
console.log('consider bringing row margin from -15 to -5 or so');

React.render(
    <Watchlist />,
    document.getElementById('watchlist')
);

React.render(
    <DataView />,
    document.getElementById('data-view-container')
);

$(window).on('resize', function () {
    appStateActions.windowResize();
});

appStateActions.windowResize();