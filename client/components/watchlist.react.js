var React            = require('react'),
    watchlistStore   = require('../stores/watchlist_store'),
    watchlistActions = require('../actions/watchlist_action_creator'),
    WatchlistItem    = require('./watchlist_item.react'),
    WatchlistItemNew = require('./watchlist_item_new.react'),
    _                = require('lodash');


function existingWatchlistItem(item) {
    return (
        <WatchlistItem
            key={item.id}
            id={item.id} />
    );
}

var Watchlist = React.createClass({

    getInitialState: function () {
        return watchlistStore.getAll();
    },

    componentDidMount: function() {
        watchlistStore.addChangeListener(this._onChange);
        watchlistActions.getUserWatchList();
    },

    componentWillUnmount: function() {
        watchlistStore.removeChangeListener(this._onChange);
    },

    render: function() {
        if(!watchlistStore.isInitialized()) {
            return (
                <div className="chart-wrapper">
                    <div className="chart-title">
                        Watch List
                    </div>
                    <div className="chart-stage table-responsive">
                        <div>
                            <i className="fa fa-spinner fa-spin"></i>
                            <span>&nbsp;Loading Watchlist</span>
                        </div>
                    </div>
                    <div className="chart-notes">
                        &nbsp;
                    </div>
                </div>
            );
        }
        else {

            var watchlist = _.sortBy(_.toArray(this.state), function (s) {
                return s.order;
            });

            return(
                <div className="chart-wrapper">
                    <div className="chart-title">
                        Watch List
                    </div>
                    <div className="chart-stage table-responsive">
                        <table className="table table-condensed table-bordered">
                          <thead>
                            <tr>
                              <th>Symbol</th>
                              <th>Bid</th>
                              <th>Ask</th>
                              <th>Chng</th>
                            </tr>
                          </thead>

                          <tbody>
                            {_.map(watchlist, existingWatchlistItem)}
                            <WatchlistItemNew />
                          </tbody>
                        </table>
                    </div>
                    <div className="chart-notes">
                        <span>Watching {watchlist.length} item(s)</span>
                    </div>
                </div>
            );
        }

    },

    _onChange: function () {
        var newState = watchlistStore.getAll();

        if(_.keys(newState).length !== _.keys(this.state).length) {
            this.replaceState(newState);
        }
        else {
            this.setState(newState);
        }
    }

});

module.exports = Watchlist;


