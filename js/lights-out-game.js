var LightsOutGame = (function($, _) {

    var Game = function() {
        this.initialize.apply(this, arguments);
    };

    var STATES = {
        SETUP: 'SETUP',
        READY: 'READY',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETE: 'COMPLETE',
        DISPOSED: 'DISPOSED'
    };
    _.extend(Game.prototype, {
        initialize: function(opts) {
            this._state = STATES.SETUP;
            this._board = {
                numRows: opts.board.numRows,
                numCols: opts.board.numCols
            };
            this._delegates = {
                onStart:            opts.delegates.onStart,
                onComplete:         opts.delegates.onComplete,
                onDispose:          opts.delegates.onDispose,
                onGetCoordsForCell: opts.delegates.onGetCoordsForCell,
                onIsActiveCell:     opts.delegates.onIsActiveCell,
                onGetCell:          opts.delegates.onGetCell,
                onToggleCell:       opts.delegates.onToggleCell
            };
            this._state = STATES.READY;
        },
        start: function() {
            this._validateStateOrError([ STATES.READY ]);
            this._delegates.onStart();
            this._state = STATES.IN_PROGRESS;
        },
        getCoordsForCell: function(cell) {
            return this._delegates.onGetCoordsForCell(cell);
        },
        isActiveCell: function(cell) {
            return this._delegates.onIsActiveCell(cell);
        },
        getCell: function(row, col) {
            return this._delegates.onGetCell(row, col);
        },
        toggleCell: function(cell) {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);
            this._delegates.onToggleCell(cell);
            this.toggleNeighbors(cell);
            if( this.hasFinished() ) {
                this._delegates.onComplete();
                this._state = STATES.COMPLETE;
            }
        },
        toggleNeighbors: function(cell) {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);
            var coords = this.getCoordsForCell(cell);
            var row = coords.row;
            var col = coords.col;

            var neighborCoords = [
                { row: row + 1, col: col },
                { row: row - 1, col: col },
                { row: row, col: col + 1 },
                { row: row, col: col - 1 }
            ];
            _.each(neighborCoords, function(n) {
                var neighborCell = this.getCell(n.row, n.col);
                this._delegates.onToggleCell(neighborCell);
            }, this);
        },
        hasFinished: function() {
            this._validateStateOrError([ STATES.IN_PROGRESS ]);

            for(var row = 0; row < this._board.numRows; row++) {
                for(var col = 0; col < this._board.numCols; col++) {
                    var cell = this.getCell(row, col);
                    if( this.isActiveCell(cell) ) {
                        return false;
                    }
                }
            }
            return true;
        },
        getDimensions: function() {
            return {
                numRows: this._board.numRows,
                numCols: this._board.numCols
            };
        },
        dispose: function() {
            if( this._validateState([ STATES.DISPOSED ]) ) {
                // Been had disposed
                return;
            }
            this._state = STATES.DISPOSED;
            this._delegates.onDispose();
            this._board = null;
            this._delegates = null;
        },
        _validateStateOrError: function(states) {
            if( !this._validateState(states) ) {
                throw new Error("LightsOutGame is in an invalid state. Expected: " + states.join(",") + ". Got: " + this._state);
            }
        },
        _validateState: function(states) {
            return _.contains(states, this._state);
        }
    });

    return Game;
})($, _);
