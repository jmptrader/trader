var React          = require('react'),
    _              = require('lodash'),
    dvConst        = require('../constants/data_view'),

    ChartCell      = require('./chart_cell.react');


var ReactPropTypes = React.PropTypes;


var ChartRow = React.createClass({

    propTypes: {
        rowIdx: ReactPropTypes.string,
        layoutState: ReactPropTypes.object
    },

    render: function() {
        var keys = _.keys(this.props.layoutState);

        switch (keys.length) {
            case 1:
                return this.renderRow_x1(keys);
                break;

            case 2:
                return this.renderRow_x2(keys);
                break;

            case 3:
                return this.renderRow_x3(keys);
                break;

            default:
                return (
                    <div>ERROR</div>
                );
        }
    },

    /*
     * render a row with 1 column
     */
    renderRow_x1: function (keys) {
        var rowIdx = this.props.rowIdx;

        return (
            <div className="row">
                <div className="col-sm-12">
                    <ChartCell
                        key={this.generateCellPropKey(keys[0])}
                        rowIdx={rowIdx}
                        colIdx={keys[0]}
                        layoutState={this.props.layoutState[keys[0]]} />
                </div>
            </div>
        );
    },

    /*
     * render a row with 2 columns
     */
    renderRow_x2: function (keys) {
        var rowIdx = this.props.rowIdx;

        return (
            <div className="row">
                <div className="col-sm-6">
                    <ChartCell
                        key={this.generateCellPropKey(keys[0])}
                        rowIdx={rowIdx}
                        colIdx={keys[0]}
                        layoutState={this.props.layoutState[keys[0]]} />
                </div>
                <div className="col-sm-6">
                    <ChartCell
                        key={this.generateCellPropKey(keys[1])}
                        rowIdx={rowIdx}
                        colIdx={keys[1]}
                        layoutState={this.props.layoutState[keys[1]]} />
                </div>
            </div>
        );
    },

    /*
     * render a row with 3 columns
     */
    renderRow_x3: function (keys) {
        var rowIdx = this.props.rowIdx;

        return (
            <div className="row">
                <div className="col-sm-4">
                    <ChartCell
                        key={this.generateCellPropKey(keys[0])}
                        rowIdx={rowIdx}
                        colIdx={keys[0]}
                        layoutState={this.props.layoutState[keys[0]]} />
                </div>
                <div className="col-sm-4">
                    <ChartCell
                        key={this.generateCellPropKey(keys[1])}
                        rowIdx={rowIdx}
                        colIdx={keys[1]}
                        layoutState={this.props.layoutState[keys[1]]} />
                </div>
                <div className="col-sm-4">
                    <ChartCell
                        key={this.generateCellPropKey(keys[2])}
                        rowIdx={rowIdx}
                        colIdx={keys[2]}
                        layoutState={this.props.layoutState[keys[2]]} />
                </div>
            </div>
        );
    },


    generateCellPropKey: function (key) {
        return this.props.rowIdx + '.' + key;
    }
});

module.exports = ChartRow;
