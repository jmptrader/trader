
var Emitter = require('events').EventEmitter,
    moment  = require('moment');


function Stock(name, mu, sigma) {

    var _emitter = new Emitter(),
        _name    = name,
        _value   = mu,
        _prev    = mu,
        _sigma   = sigma,
        _spread  = 0.75,
        _valueHistory = [],
        _started = false,
        _inittime = null,
        _currtime = null;


    // random variable with standard normal distribution
    this.normal = function () {
        var u1 = Math.random(),
            u2 = Math.random(),
            val = Math.sqrt(-2 * Math.log(u1)) *
                    Math.cos(2 * Math.PI * u2);

        return (val * _sigma) + _value;
    };


    this.change = function () {
        if(_prev === 0) {
            return 0;
        }

        return (_value - _prev) / _prev;
    };


    // readonly access to emmiter
    this.stream = function () {
        return _emitter;
    };


    this.send = function () {
        _emitter.emit('message', {
            name: _name,
            time: moment(_currtime._d)._d,
            bid: _value - _spread,
            ask: _value + _spread,
            change: this.change()
        });
    };


    /*
     * update the state of a Stock,
     * this includes its current price an
     * the time.
     */
    this.update = function () {
        var possibleNewValue = this.normal();

        _prev = _value;

        if(possibleNewValue >= 0) {
            _value = possibleNewValue;
        }

        _currtime.add(1, 'seconds');

        return {
            name: _name,
            time: moment(_currtime._d)._d,
            bid: _value - _spread,
            ask: _value + _spread,
            change: this.change()
        };
    };


    // remove oldest, push newest
    this.shiftHistory = function () {

        _valueHistory.push({
            name: _name,
            time: moment(_currtime._d)._d,
            bid: _value - _spread,
            ask: _value + _spread,
            change: this.change()
        });

        _valueHistory.shift();
    };


    /*
     * initialize stock state with current time,
     * generate price history for the @previousSeconds
     */
    this.initStream = function (previousSeconds) {
        if(!_started) {
            _inittime = moment(Date.now());
            _currtime = moment(_inittime._d)
                        .subtract(previousSeconds, 'seconds');

            while(!_inittime.isSame(_currtime)) {

                _valueHistory.push({
                    name: _name,
                    time: moment(_currtime._d)._d,
                    bid: _value - _spread,
                    ask: _value + _spread,
                    change: this.change()
                });

                this.update();
            }

            _started = true;
        }
    };


    // readonly access to historical data
    this.historical = function () {
        return _valueHistory;
    };


    // called by client to update state
    this.processTick = function () {
        if(_started) {
            this.update();
            this.shiftHistory();
            this.send();
        }
    };

}
module.exports = Stock;
