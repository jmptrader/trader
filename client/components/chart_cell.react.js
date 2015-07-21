
// https://facebook.github.io/react/docs/component-specs.html

var React          = require('react'),
    _              = require('lodash'),
    dvConst        = require('../constants/data_view');

    //dataViewChartActions = require('../actions/data_view_chart_action_creator'),
    //dataViewChartStore   = require('../stores/data_view_chart_store');


var ENTER_KEY_CODE = 13;

var ReactPropTypes = React.PropTypes;

var ChartCell = React.createClass({

    propTypes: {
        rowIdx: ReactPropTypes.string,
        colIdx: ReactPropTypes.string,
        layoutState: ReactPropTypes.object
    },

    componentDidMount: function() {
        console.log('ChartCell: componentDidMount: ', this.props);
    },

    // note: if this.setState is called in this method,
    // an additional render WILL NOT be called
    componentWillReceiveProps: function (nextProps) {
        console.log('ChartCell: componentWillReceiveProps: ', this.props, nextProps);
    },

    render: function() {
        var computedStyles = {
            height: this.props.layoutState.height
        };

        return (
            <div className="chart-wrapper">
              <div className="chart-title">
                <input
                    type="text"
                    placeholder="ticker symbol" />
              </div>
              <div className="chart-stage" style={computedStyles}>
              </div>
            </div>
        );
    }
});

module.exports = ChartCell;
