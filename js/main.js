$(document).ready(function() {
    var giveUpInNumMoves = 20;

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
            if( num > giveUpInNumMoves ) {
                $('#give-up').show();
            }
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
                    $('#give-up').hide();
                    var alertTitle = "You won!";
                    var alertMessage = "You completed the game in " + $('#moves').text() + " moves.";
                    sweetAlert(alertTitle, alertMessage, "success");
                    $('#play-again').show();
                },
                onDispose: function() {
                    // Destroy all the .cell elements
                    $('.cell').remove();
                },
                onGetCoordsForCell: function(cell) {
                    var coords = _.rest($(cell).attr('class').split(" "));
                    var row = parseInt(coords[0].substring(3));
                    var col = parseInt(coords[1].substring(3));

                    return { row: row, col: col };
                },
                onIsActiveCell: function(cell) {
                    return $(cell).hasClass('glow');
                },
                onGetCell: function(row, col) {
                    return $('.cell.row' + row + '.col' + col);
                },
                onToggleCell: function(cell) {
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
    var resetGame = function(tryNum) {
        tryNum = tryNum || 1;
        if(tryNum > 1 && tryNum <= 3) {
            console.log("Trying again (#" + tryNum + ")...");
        } else if (tryNum > 3) {
            // Tried to generate a board three times
            // and failed miserably. Best to stop trying now
            throw new Error("Couldn't generate a board for whatever reason.");
        }
        LightsOutGameGenerator.generateBoard(dimensions, function(error, generatedBoard) {
            if( error ) {
                console.log("Generator broke with: " + error.message);
                tryNum += 1;
                resetGame(tryNum);
            }
            buildGrid($('#lights'), dimensions);
            theGame = createNewGame(dimensions);
            populateGame(theGame, generatedBoard);

            var simulator = new LightsOutSolveSimulator(theGame, {});
            simulator.solve();

            // theGame.start();
            $('#play-again').hide();
        });
    };

    var giveUp = function(game) {
        // First prevent user from clicking on any more
        // cells
        $('.cell').unbind( "click" );

        // Create a new simulator for this game
        var simulator = new LightsOutSolveSimulator(game, {});

        // Kick off the solve
        simulator.solve(function(err, result) {
            $('#give-up').hide();
            if(err) {
                sweetAlert("Oops...", "Something went wrong while I was trying to solve the game " +
                                      "for you. Rest assured that we're doing absolutely nothing " +
                                      "to fix it.",
                           "error");
                $('#play-again').show();
                throw new Error("Solver failed with: " + err.message);
            }
        });
    };

    $('#play-again').click(function() {
        theGame.dispose();
        resetGame();
    });

    $('#give-up').click(function() {
        giveUp(theGame);
    });

    // Kick off the first game
    resetGame();
});
