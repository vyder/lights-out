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

            this._setupGameFor2DBoard(seedBoard, function(error, seedGame) {
                if( error ) {
                    cb(error);
                }

                seedGame.start();

                // Simulate a random bunch of switches
                var numSwitches = 0;
                while( numSwitches === 0 ) {
                    // Make at least 10 moves
                    numSwitches = _.random(10, dimensions.numRows * dimensions.numCols);
                }

                _(numSwitches).times(function() {
                    var cell = _.sample(cells);
                    seedGame.toggleCell(cell);
                });

                // return the seeded board
                cb(null, seedBoard);
            });
        },

        _setupGameFor2DBoard: function( board, cb ) {
            var dimensions = {
                numRows: board.length,
                numCols: board[0].length
            };
            cb(null, new LightsOutGame({
                board: dimensions,
                delegates: {
                    onStart: function() {
                        // nothing to do here
                        console.log("*twiddles thumbs*");
                    },
                    onComplete: function() {
                        // should never get here
                        cb(new Error("Board generated empty."));

                        // edit: weeeell it does get here if the
                        // board generates empty...which seems to
                        // occur frequently. I'll just say:
                        // #TODO
                    },
                    onGetCoordsForCell: function(cell) {
                        if( _.isEmpty(cell) ) {
                            return {};
                        }
                        return { row: cell.row, col: cell.col};
                    },
                    onIsActiveCell: function(cell) {
                        if( _.isEmpty(cell) ) {
                            return false;
                        }
                        return cell.value === 1;
                    },
                    onGetCell: function(row, col) {
                        if( row < 0 || col < 0 || row >= dimensions.numRows || col >= dimensions.numCols ) {
                            return {};
                        }
                        return board[row][col];
                    },
                    onToggleCell: function(cell) {
                        if( !_.isEmpty(cell) ) {
                            cell.value = cell.value ? 0 : 1;
                        }
                    }
                }
            }));
        }
    });

    return new LightsOutGameGenerator();
})($, _, LightsOutGame);
