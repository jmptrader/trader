var React            = require('react'),
    _                = require('lodash'),
    watchlistActions = require('../actions/watchlist_action_creator'),
    watchlistStore   = require('../stores/watchlist_store');


var ENTER_KEY_CODE = 13;


var WatchlistItem = React.createClass({
    getInitialState: function () {
        return {
          isValid: true,
          inputNeedsBlur: false,
          isDeletePending: false,
          item: watchlistStore.get(this.props.id)
        };
    },

    componentDidMount: function() {
        watchlistActions.watchlistSubscribe(this.state.item.name);
    },

    componentDidUpdate: function() {
        if(this.state.inputNeedsBlur) {
          this._blurComponent();
        }
    },

    render: function() {
        if(this.state.isDeletePending) {
          return this.renderDeletePending();
        }

        if(!this.state.item.hasData) {
          return this.renderActiveWithNoData();
        }

        return this.renderActiveWithData();
    },

    renderTextFieldWithNoEdit: function () {
        return (
            <input
              className="watch-list-input"
              type="text"
              value={this.state.item.name} readOnly="true" />
        );
    },

    /*
     * TODO: add the ability to edit a watchlist item inplace
     */
    renderTextFieldWithEdit: function () {
        return (
            <input
              className="watch-list-input"
              type="text"
              value={this.state.item.name}
              onChange={this._onTextFieldChange}
              onKeyDown={this._onKeyDown}
              onBlur={this._onBlur} />
        );
    },

    renderDeletePending: function () {
        return (
            <tr>
              <th scope="row">

                <span
                  className="watch-list-option fa fa-times"
                  onClick={this._deleteWatchlistItemClick}></span>

                <span
                  className="watch-list-option fa fa-line-chart"
                  onClick={this._chartWatchlistItemClick}></span>

                {this.renderTextFieldWithNoEdit()}

              </th>
              <td colSpan="3">DELETING</td>
            </tr>
        );
    },

    renderActiveWithNoData: function () {
      return (
            <tr>
              <th scope="row">

                <span
                  className="watch-list-option fa fa-times"
                  onClick={this._deleteWatchlistItemClick}></span>

                <span
                  className="watch-list-option fa fa-line-chart"
                  onClick={this._chartWatchlistItemClick}></span>

                {this.renderTextFieldWithNoEdit()}

              </th>
              <td colSpan="3">NO DATA</td>
            </tr>
      );
    },

    renderActiveWithData: function () {
        return (
            <tr>
              <th scope="row">

                <span
                  className="watch-list-option fa fa-times"
                  onClick={this._deleteWatchlistItemClick}></span>

                <span
                  className="watch-list-option fa fa-line-chart"
                  onClick={this._chartWatchlistItemClick}></span>

                {this.renderTextFieldWithNoEdit()}

              </th>
              {this.renderBid()}
              {this.renderAsk()}
              {this.renderChange()}
            </tr>
        );
    },

    renderBid: function () {
        if(_.isNull(this.state.item.bid)) {
            return (
              <td><i className="fa fa-spinner fa-spin"></i></td>
            );
        }

        return (
          <td>{this.state.item.bid}</td>
        );
    },

    renderAsk: function () {
        if(_.isNull(this.state.item.ask)) {
            return (
              <td><i className="fa fa-spinner fa-spin"></i></td>
            );
        }

        return (
          <td>{this.state.item.ask}</td>
        );
    },

    renderChange: function () {
        if(_.isNull(this.state.item.change)) {
            return (
              <td><i className="fa fa-spinner fa-spin"></i></td>
            );
        }

        return (
          <td>{this.state.item.change}</td>
        );
    },

    _onTextFieldChange: function (e) {
        // TODO: validate

        var item = this.state.item;

        item.name = e.target.value.toUpperCase();

        this.setState({item: item});

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


    /*
     * if the ticker name has changed, save this
     * watchlist item
     */
    _onBlur: function () {
        console.log('blur');
    },

    _deleteWatchlistItemClick: function () {
        // TODO: if input needs blur, disable this button
        if(!this.state.inputNeedsBlur) {
          console.log('click del');
          this.setState({ isDeletePending: true });

          watchlistActions.removeItemFromWatchlist(this.props.id);
        }

    },

    _chartWatchlistItemClick: function () {
        // TODO: if input needs blur, disable this button
        console.log('chart');
    }

});

module.exports = WatchlistItem;
