$(document).ready(function() {
    var dimensions = {
        numRows: 5,
        numCols: 5
    };

    var moves = 0;

    var updateMoveCounter = function(num) {
        $('#moves').text(num);
    };

    var game = new LightsOutGame({
        debug: true,
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
            },
            getCoordsForCell: function(cell) {
                var coords = _.rest($(cell).attr('class').split(" "));
                var row = parseInt(coords[0].substring(3));
                var col = parseInt(coords[1].substring(3));

                return { row: row, col: col};
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

    var buildGrid = function(parent, gameBoard) {
        // Calc parent dimensions in 'vw'
        var parentWidth = $(parent).width() / $(window).width() * 100;
        var parentHeight = $(parent).height() / $(window).height() * 100;

        var numRows = gameBoard.length;
        var numCols = gameBoard[0].length;

        var cellHeight = parentHeight / numRows;
        var cellWidth = parentWidth / numCols;

        for(var row = 0; row < numRows; row++) {
            for(var col = 0; col < numCols; col++) {
                var cell = $('<div/>', {
                    class: 'cell row' + row + ' col' + col,
                    css: {
                        width: '20%',
                        height: '20%'
                    }
                });
                if( gameBoard[row][col].value ) {
                    cell.addClass('glow');
                }
                $(parent).append(cell);
            }
        }
    };

    LightsOutGameGenerator.generateBoard(dimensions, function(error, generatedBoard) {
        if( error ) {
            throw new Error("Generator broke with: " + e.message);
        }
        buildGrid($('#lights'), generatedBoard);
        game.start();
    });
});
