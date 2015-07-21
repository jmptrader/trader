var keyMirror = require('keymirror');

module.exports = {
    views: keyMirror({
        CHART: null,
        POSITION: null,
        TRADE: null
    }),

    chartGridContext: keyMirror({
        GRID_1x1: null,
        GRID_1x2: null,
        GRID_1x3: null,
        GRID_2x1: null,
        GRID_2x2: null,
        GRID_2x3: null,
        GRID_3x1: null,
        GRID_3x2: null,
        GRID_3x3: null
    })
};
