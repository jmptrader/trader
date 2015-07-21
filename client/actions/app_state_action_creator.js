
var dispatcher = require('../dispatcher'),
    appState   = require('../events/app_state');

function windowResize() {

    dispatcher.dispatch({
        type: appState.WINDOW_RESIZED,
        height: window.innerHeight,
        width: window.innerWidth
    });
}
exports.windowResize = windowResize;
