var LightsOutSolveSimulator = (function($, _) {

    var LightsOutSolveSimulator = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(LightsOutSolveSimulator.prototype, {
        initialize: function(game, delegates) {
            this._game = game;
            this._delegates = {
                onSimulatedClick: delegates.onSimulatedClick
            }
        },
        solve: function(cb) {
            cb = cb || function() {};

            var dimensions = this._game.getDimensions();
            var mentalBoard;

            var updateMentalModel = _.bind(function() {
                mentalBoard = [];
                _(dimensions.numRows).times(function(r) {
                    var row = [];
                    _(dimensions.numCols).times(function(c) {
                        var gameCell = this._game.getCell(r, c);
                        var value = this._game.isActiveCell(gameCell);
                        var cell = { value: value, row: r, col: c };
                        row.push(cell);
                    }, this);
                    mentalBoard.push(row);
                }, this);
            }, this);

            var getActiveCellsForRow = function(row) {
                return _.compact(_.collect(row, function(cell) {
                    return cell.value ? cell : null;
                }));
            };

            var chaseLights = function() {
                updateMentalModel();
                for(var row = 1; row < dimensions.numRows - 1; row++) {
                    for(var col = 0; col < dimensions.numCols; col++) {
                        if( mentalBoard[row][col] ) {
                            this._game.toggleCell(this._game.getCell(row, col));
                        }
                    }
                    updateMentalModel();
                }
            };

            _.each(mentalBoard, function(row) {
                // var activeCells =
                var rowValues = _.map(row, function(cell) {
                    return cell.value ? 1 : 0;
                });
                console.log(rowValues.join(" "));
            });

            cb(new Error("I don't know how to solve this either..."));
        }
    });

    return LightsOutSolveSimulator;
})($, _);
