var LightsOutGame = (function($, _) {

    var Game = function() {
        this.initialize.apply(this, arguments);
    };

    var STATES = {
        SETUP: 'SETUP',
        READY: 'READY',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETE: 'COMPLETE'
    };
    _.extend(Game.prototype, {
        initialize: function(opts) {
            this.state = STATES.SETUP;
            this.board = {
                numRows: opts.board.numRows,
                numCols: opts.board.numCols
            };
            this.delegates = {
                onStart:          opts.delegates.onStart,
                onComplete:       opts.delegates.onComplete,
                getCoordsForCell: opts.delegates.getCoordsForCell,
                isActiveCell:     opts.delegates.isActiveCell,
                getCell:          opts.delegates.getCell,
                toggleCell:       opts.delegates.toggleCell
            };
            this.state = STATES.READY;
        },
        start: function() {
            this._validateStateOrError([ STATES.READY ]);
            this.delegates.onStart();
            this.state = STATES.IN_PROGRESS;
        },
        toggleCell: function(cell) {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);
            this.delegates.toggleCell(cell);
            this.toggleNeighbors(cell);
            if( this.hasFinished() ) {
                this.delegates.onComplete();
                this.state = STATES.COMPLETE;
            }
        },
        toggleNeighbors: function(cell) {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);
            var coords = this.delegates.getCoordsForCell(cell);
            var row = coords.row;
            var col = coords.col;

            var neighborCoords = [
                { row: row + 1, col: col },
                { row: row - 1, col: col },
                { row: row, col: col + 1 },
                { row: row, col: col - 1 }
            ];
            _.each(neighborCoords, function(n) {
                var neighborCell = this.delegates.getCell(n.row, n.col);
                this.delegates.toggleCell(neighborCell);
            }, this);
        },
        hasFinished: function() {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);

            for(var row = 0; row < this.board.numRows; row++) {
                for(var col = 0; col < this.board.numCols; col++) {
                    var cell = this.delegates.getCell(row, col);
                    if( this.delegates.isActiveCell(cell) ) {
                        return false;
                    }
                }
            }
            return true;
        },
        _validateStateOrError: function(states) {
            if( !_.contains(states, this.state) ) {
                throw new Error("LightsOutGame is in an invalid state. Expected: " + states.join(",") + ". Got: " + this.state);
            }
        }
    });

    return Game;
})($, _);
