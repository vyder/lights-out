$(document).ready(function() {
    var dimensions = {
        numRows: 5,
        numCols: 5
    };
    var buildGrid = function(parent, dimensions) {
        // Calc parent dimensions in 'vw'
        var parentWidth = $(parent).width() / $(window).width() * 100;
        var parentHeight = $(parent).height() / $(window).height() * 100;

        var cellHeight = parentHeight / dimensions.numRows;
        var cellWidth = parentWidth / dimensions.numCols;

        _(dimensions.numRows).times(function(row) {
            _(dimensions.numCols).times(function(col) {
                var cell = $('<div/>', {
                    class: 'cell row' + row + ' col' + col,
                    css: {
                        width: '20%',
                        height: '20%'
                    }
                });
                $(parent).append(cell);
            });
        });
    };

    var createNewGame = function(dimensions) {
        var moves = 0;

        var updateMoveCounter = function(num) {
            $('#moves').text(num);
        };

        var game = new LightsOutGame({
            board: dimensions,
            delegates: {
                onStart: function() {
                    updateMoveCounter(0);
                    $('.cell').click(function() {
                        moves += 1;
                        updateMoveCounter(moves);
                        game.toggleCell($(this));
                    });
                },
                onComplete: function() {
                    alert("You won in " + $('#moves').text() + " moves!");
                    $('#play-again').show();
                },
                onDispose: function() {
                    // Destroy all the .cell elements
                    $('.cell').remove();
                },
                getCoordsForCell: function(cell) {
                    var coords = _.rest($(cell).attr('class').split(" "));
                    var row = parseInt(coords[0].substring(3));
                    var col = parseInt(coords[1].substring(3));

                    return { row: row, col: col };
                },
                isActiveCell: function(cell) {
                    return $(cell).hasClass('glow');
                },
                getCell: function(row, col) {
                    return $('.cell.row' + row + '.col' + col);
                },
                toggleCell: function(cell) {
                    $(cell).toggleClass('glow');
                }
            }
        });

        return game;
    };

    var populateGame = function(game, board) {
        _(dimensions.numRows).times(function(row) {
            _(dimensions.numCols).times(function(col) {
                if( board[row][col].value ) {
                    $('.cell.row' + row + '.col' + col).addClass('glow');
                }
            });
        });
    };

    var theGame = {}
    var resetGame = function() {
        LightsOutGameGenerator.generateBoard(dimensions, function(error, generatedBoard) {
            if( error ) {
                throw new Error("Generator broke with: " + error.message);
            }
            buildGrid($('#lights'), dimensions);
            theGame = createNewGame(dimensions);
            populateGame(theGame, generatedBoard);
            theGame.start();
            $('#play-again').hide();
        });
    };

    $('#play-again').click(function() {
        theGame.dispose();
        resetGame();
    });

    // Kick off the first game
    resetGame();
});
