var _ = require('lodash');

function text() {
    var acc = [];

    if(arguments.length === 0) {
        return '';
    }

    if(arguments.length === 1) {
        return arguments[0];
    }

    _.each(arguments, function (l, i) {
        if(i === 0) {
            acc.push(l);
        }
        else {
            acc.push('      ' + l);
        }
    });

    return acc.join('\n');
}
module.exports = text;
