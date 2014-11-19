var LightsOutGameGenerator = (function($, _, LightsOutGame) {

    var LightsOutGameGenerator = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(LightsOutGameGenerator.prototype, {
        initialize: function() {},
        // node-style callback
        generateBoard: function(dimensions, cb) {
            // Each cell is represented as:
            // {
            //   value: (0|1),
            //   row: (0...dimensions.numRows),
            //   col: (0...dimensions.numCols)
            // }
            var cells = [];
            var seedBoard = [];
            _(dimensions.numRows).times(function(r) {
                var row = [];
                _(dimensions.numCols).times(function(c) {
                    var cell = { value: 0, row: r, col: c };
                    row.push(cell);
                    cells.push(cell);
                });
                seedBoard.push(row);
            });

            var seedGame = new LightsOutGame({
                board: dimensions,
                delegates: {
                    onStart: function() {
                        // nothing to do here
                        console.log("*twiddles thumbs*");
                    },
                    onComplete: function() {
                        // should never get here
                        cb(new Error("whaaaa...?"));
                    },
                    getCoordsForCell: function(cell) {
                        if( _.isEmpty(cell) ) {
                            return {};
                        }
                        return { row: cell.row, col: cell.col};
                    },
                    isActiveCell: function(cell) {
                        if( _.isEmpty(cell) ) {
                            return false;
                        }
                        return cell.value === 1;
                    },
                    getCell: function(row, col) {
                        if( row < 0 || col < 0 || row >= dimensions.numRows || col >= dimensions.numCols ) {
                            return {};
                        }
                        return seedBoard[row][col];
                    },
                    toggleCell: function(cell) {
                        if( !_.isEmpty(cell) ) {
                            cell.value = cell.value ? 0 : 1;
                        }
                    }
                }
            });
            seedGame.start();
            // Simulate a random bunch of switches
            var numSwitches = 0;
            while( numSwitches === 0 ) {
                numSwitches = _.random(dimensions.numRows * dimensions.numCols);
            }

            _(numSwitches).times(function() {
                var cell = _.sample(cells);
                seedGame.toggleCell(cell);
            });

            // return the seeded board
            cb(null, seedBoard);
        }
    });

    return new LightsOutGameGenerator();
})($, _, LightsOutGame);
