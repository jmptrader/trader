var React            = require('react'),
    watchlistStore   = require('../stores/watchlist_store'),
    watchlistActions = require('../actions/watchlist_action_creator');


var ENTER_KEY_CODE = 13;


var WatchlistItemNew = React.createClass({

    getInitialState: function () {
        return {
          isValid: true,
          inputNeedsBlur: false,
          itemName: ''
        };
    },

    componentDidMount: function() {
        watchlistStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        watchlistStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        if(this.state.inputNeedsBlur) {
          this._blurComponent();
        }
    },

    render: function() {
        return (
            <tr>
              <th scope="row">
                <input
                    className="watch-list-input"
                    type="text"
                    value={this.state.itemName}
                    onChange={this._onTextFieldChange}
                    onKeyDown={this._onKeyDown}
                    onBlur={this._onBlur} />
              </th>
              <td colSpan="3"></td>
            </tr>
        );
    },

    _onTextFieldChange: function (e) {
        // TODO: validate

        this.setState({itemName: e.target.value.toUpperCase()});

    },

    _onKeyDown: function (e) {
        if (e.keyCode === ENTER_KEY_CODE) {
          event.preventDefault();

          this.setState({ inputNeedsBlur: true });
        }
    },

    _blurComponent: function () {
        $(this.getDOMNode()).find('input').blur();

        this.setState({ inputNeedsBlur: false });
    },

    // blur is used to save a new item
    _onBlur: function () {
        console.log('blur');
        if(this.state.itemName.length > 0) {
            watchlistActions.addItemToWatchlist(this.state.itemName);
        }
    },

    // if the value of the text box is in the
    // existing watchlist, clear it
    _onChange: function () {
        if(watchlistStore.watchlistContains(this.state.itemName)) {
            this.setState({itemName: ''});
        }
    }

});

module.exports = WatchlistItemNew;
