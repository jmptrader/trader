var React          = require('react'),
    _              = require('lodash'),
    dvConst        = require('../constants/data_view'),

    //dataViewChartActions = require('../actions/data_view_chart_action_creator'),
    //dataViewChartStore   = require('../stores/data_view_chart_store'),

    ChartRow            = require('./chart_row.react');


var ReactPropTypes = React.PropTypes;

var DataViewChart = React.createClass({

    propTypes: {
        layoutType: ReactPropTypes.string,
        layoutState: ReactPropTypes.object
    },

    componentDidMount: function() {
        console.log('DataViewChart: componentDidMount: ', this.props);
    },

    componentWillReceiveProps: function (nextProps) {
        console.log('DataViewChart: componentWillReceiveProps: ', this.props, nextProps);
    },

    render: function() {

        var rows = _.map(this.props.layoutState.mapping, function (r, key) {
            return (
                <ChartRow
                    key={key}
                    rowIdx={key}
                    layoutState={r} />
            );
        });

        return (
            <div className="data-view-chart-root">
                {rows}
            </div>
        );
    }

});

module.exports = DataViewChart;
