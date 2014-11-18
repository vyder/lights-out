$(document).ready(function() {
    var buildGrid = function(parent, numRows, numCols) {
        // Calc parent dimensions in 'vw'
        var parentWidth = $(parent).width() / $(window).width() * 100;
        var parentHeight = $(parent).height() / $(window).height() * 100;

        var cellWidth = parentWidth / numCols;
        var cellHeight = parentHeight / numRows;

        for(var row = 0; row < numRows; row++) {
            for(var col = 0; col < numCols; col++) {
                var cell = $('<div/>', {
                    class: 'cell row' + row + ' col' + col,
                    css: {
                        width: '20%',
                        height: '20%'
                    }
                });
                if( _.random(1) ) {
                    cell.addClass('glow');
                }
                $(parent).append(cell);
            }
        }
    };

    buildGrid($('#lights'), 5,5);

    var game = new LightsOutGame({
        board: {
            numRows: 5,
            numCols: 5
        },
        delegates: {
            onStart: function() {
                $('.cell').click(function() {
                    game.toggleCell($(this));
                });
            },
            onComplete: function() {
                alert("You won!");
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

    game.start();
});
