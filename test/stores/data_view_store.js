var assert        = require('assert'),
    _             = require('lodash'),
    text          = require('../../client/util/text_block'),
    dataViewStore = require('../../client/stores/data_view_store');


describe('function: _generateLayout', function () {
    it(
        text(
            'it should return an object with row, cols, and ',
            'mapping properties'
        ),
        function () {
            var testData = dataViewStore._generateLayout('GRID_1x1');
            assert.equal(
                _.has(testData, 'rows') &&
                _.has(testData, 'cols') &&
                _.has(testData, 'mapping'), true);
        }
    );

    it(
        text(
            'a 1x1 grid should have a mapping property with a ',
            'col_0 NESTED inside a row_0'
        ),
        function () {
            var testData = dataViewStore._generateLayout('GRID_1x1');
            assert.equal(
                _.has(testData, 'mapping') &&
                _.has(testData.mapping, 'row_0') &&
                _.has(testData.mapping['row_0'], 'col_0'), true);
        }
    );
});


describe('function: _chartContextData', function () {
    it(
        text(
            'it should return a list containing layoutState data ',
            'where the mapTo property is not null'
        ),
        function () {
            var testData = dataViewStore._generateLayout('GRID_2x2');
            testData.mapping['row_0']['col_1'].mapTo = 'SPY';
            testData.mapping['row_1']['col_0'].mapTo = 'QQQ';

            var result = dataViewStore._chartContextData(testData);

            assert.equal(result.length, 2);
            assert.equal(result[0].mapTo, 'SPY');
            assert.equal(result[1].mapTo, 'QQQ');
        }
    );

});


describe('function: _transferLayout', function () {
    it(
        text(
            'transferring a 3x3 with 4 entries to a 1x1 should ',
            'assign the first entry to the 1x1, and leave 3 old ',
            'entries unassigned'
        ),
        function () {

            var oldLayout = dataViewStore._generateLayout('GRID_3x3'),
                newLayout = dataViewStore._generateLayout('GRID_1x1');

            oldLayout.mapping['row_0']['col_0'].mapTo = 'FB';
            oldLayout.mapping['row_0']['col_1'].mapTo = 'SPY';
            oldLayout.mapping['row_1']['col_0'].mapTo = 'QQQ';
            oldLayout.mapping['row_2']['col_0'].mapTo = 'NDX';

            var transferred = dataViewStore._transferLayout(oldLayout, newLayout);

            assert.equal(transferred.unassigned.length, 3);
            assert.equal(transferred.layoutState.mapping['row_0']['col_0'].mapTo, 'FB');
        }
    );

});
