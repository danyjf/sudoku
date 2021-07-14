// Add IDs to cells
var id = 0;
$(".cell").each(function() {
    $(this).attr("id", id);
    id++;
});

selectedCell = null;
selectedIsWrong = false;

function selectCell(cell) {
    if(selectedIsWrong) {
        selectedCell.css("background-color", "rgb(247, 207, 214)");
        selectedIsWrong = false;
    }
    if(selectedCell != null && selectedCell.css("background-color") != "rgb(247, 207, 214)" && !selectedIsWrong) {
        selectedCell.css("background-color", "white");
    }

    selectedCell = cell;

    // Set new selected cell
    if(selectedCell.css("background-color") == "rgb(247, 207, 214)") {
        selectedIsWrong = true;
    }
    cell.css("background-color", "#c2fffe");
}

$(".cell").click(function() {
    selectCell($(this));
});

// Set height of game relative to it's width
var w = $('#game-frame').width();
$('#game-frame').css({"height": w+"px"});

// Function to set the initial state of the game
function setGame() {
    /* var grid = [
        [5,4,3,0,0,0,0,0,0],
        [0,2,7,0,5,1,0,0,0],
        [0,0,8,0,7,0,2,5,6],
        [0,0,9,5,6,0,4,0,0],
        [0,8,0,3,0,2,9,1,5],
        [0,0,2,1,0,7,6,8,0],
        [0,3,0,0,0,9,0,6,0],
        [2,0,0,7,0,0,0,9,8],
        [0,0,4,0,8,5,0,3,0]
    ]; */
    var grid = [
        [0,1,0,0,0,8,0,0,6],
        [3,6,0,0,0,0,0,0,0],
        [0,0,0,5,0,0,0,0,7],
        [0,0,0,0,8,4,5,1,0],
        [0,0,0,0,0,0,0,0,0],
        [9,0,5,0,1,3,8,0,0],
        [0,0,2,0,9,0,0,0,0],
        [0,0,3,7,0,0,0,0,0],
        [7,0,0,0,0,0,4,0,0]
    ];

    i = 0;
    j = 0;
    iAdd = 0;
    jAdd = 0;
    changeRowGroup = 0;
    changeColGroup = 0;

    $(".cell-value").each(function() {
        $(this).attr("id", j + ":" + i);
        if(grid[i][j] != 0) {
            $(this).text(grid[i][j]);
            $(this).addClass("immutable");
        }

        j = (j+1)%3 + jAdd;
        if((j-jAdd)%3 == 0) {
            i = (i+1)%3 + iAdd;
            changeColGroup++;
        }
        if(changeColGroup == 3) {
            changeColGroup = 0;
            jAdd += 3;
            j = jAdd;
            changeRowGroup++;
        }
        if(changeRowGroup == 3) {
            changeRowGroup = 0;
            jAdd = 0;
            j = jAdd;
            iAdd += 3;
            i = iAdd;
        }
    });
}
setGame();

// Write number to sudoku cell
var theresMoreOfTheSameValue = false;
function isInGroup(cell) {
    inGroup = false;

    cellGroup = cell.parent(".cell-group");

    cellGroup.children(".cell").each(function() {
        if($(this).children(".cell-value").text() == oldValue && !$(this).children(".cell-value").hasClass("immutable") && $(this).css("color") == "red") {
            theresMoreOfTheSameValue = true;
        }
    });

    cellGroup.children(".cell").each(function() {
        if($(this).attr("id") != cell.attr("id") && $(this).children(".cell-value").text() != "") {
            if($(this).children(".cell-value").text() == cell.children(".cell-value").text()) {
                inGroup = true;
                $(this).css("background-color", "rgb(247, 207, 214)");
            }

            if($(this).children(".cell-value").text() == oldValue && cell.children(".cell-value").text() != oldValue && !theresMoreOfTheSameValue) {
                $(this).css("background-color", "white");
            }
        }
    });

    theresMoreOfTheSameValue = false;

    return inGroup;
}

function isInCol(cell) {
    inCol = false;

    var cellCol = [];
    var selectedCoords = cell.children(".cell-value").attr("id").split(":");
    $(".cell-value").each(function() {
        coords = $(this).attr("id").split(":");
        if(coords[0] == selectedCoords[0] && coords[1] != selectedCoords[1]) {
            cellCol.push($(this));
        }
    });
    

    $.each(cellCol, function() {
        if($(this).text() == oldValue && !$(this).hasClass("immutable") && $(this).css("color") == "red") {
            theresMoreOfTheSameValue = true;
        }
    });

    $.each(cellCol, function() {
        if($(this).parent(".cell").attr("id") != cell.attr("id") && $(this).text() != "") {
            if($(this).text() == cell.children(".cell-value").text()) {
                inCol = true;
                $(this).parent(".cell").css("background-color", "rgb(247, 207, 214)");
            }

            if($(this).text() == oldValue && cell.children(".cell-value").text() != oldValue && !theresMoreOfTheSameValue) {
                $(this).parent(".cell").css("background-color", "white");
            }
        }
    });

    theresMoreOfTheSameValue = false;

    return inCol;
}

function isInRow(cell) {
    inRow = false;

    var cellRow = [];
    var selectedCoords = cell.children(".cell-value").attr("id").split(":");
    $(".cell-value").each(function() {
        coords = $(this).attr("id").split(":");
        if(coords[1] == selectedCoords[1] && coords[0] != selectedCoords[0]) {
            cellRow.push($(this));
        }
    });
    

    $.each(cellRow, function() {
        if($(this).text() == oldValue && !$(this).hasClass("immutable") && $(this).parent(".cell").css("color") == "rgb(255, 0, 0)") {
            theresMoreOfTheSameValue = true;
        }
    });

    $.each(cellRow, function() {
        if($(this).parent(".cell").attr("id") != cell.attr("id") && $(this).text() != "") {
            if($(this).text() == cell.children(".cell-value").text()) {
                inRow = true;
                $(this).parent(".cell").css("background-color", "rgb(247, 207, 214)");
            }

            if($(this).text() == oldValue && cell.children(".cell-value").text() != oldValue && !theresMoreOfTheSameValue) {
                $(this).parent(".cell").css("background-color", "white");
            }
        }
    });

    theresMoreOfTheSameValue = false;

    return inRow;
}

function isPossibleNumber(cell) {
    var possible = true;
    var inGroup = isInGroup(cell);
    var inCol = isInCol(cell);
    var inRow = isInRow(cell);

    if(inGroup || inCol || inRow) {
        possible = false;
    }

    return possible;
}

var finnished = false;
function solve(x, y) {
    var cell = $("#"+x+"\\:"+y);

    if(x == 8){
        x = 0;
        y++;
    }else {
        x++;
    }

    if(!cell.hasClass("immutable")) {
        for(var i = 1; i < 10; i++) {
            cell.text(i);
            poss = isPossibleNumber(cell.parent(".cell"));

            if(poss) {
                cell.parent(".cell").css("color", "#4a90e2");
                
                if(cell.attr("id") == "8:8") {
                    finnished = true;
                    return;
                }
                if(x <= 8 && y <= 8) {
                    solve(x, y);
                    if(finnished) {
                        return;
                    }
                }
            }else {
                cell.parent(".cell").css("color", "red");
            }
        }
        cell.text("");
        return;
    }else {
        if(x <= 8 && y <= 8) {
            solve(x, y);
        }
    }

    return;
}

var oldValue = 0;
$(".num-pad-num").click(function() {
    if($(this).children(".num-pad-num-value").text() == "Solve") {
        solve(0, 0);
        $(".cell").each(function() {
            $(this).css("background","white");
        });
    } else {
        if(selectedCell != null) {
            n = $(this).children(".num-pad-num-value").text();
            if(!selectedCell.children(".cell-value").hasClass("immutable")) {
                if(selectedCell.children(".cell-value").text() != null) {
                    oldValue = selectedCell.children(".cell-value").text();
                }
                
                if(n == "Erase") {
                    selectedCell.children(".cell-value").text("");
                }else {
                    selectedCell.children(".cell-value").text(n);
                }

                possible = isPossibleNumber(selectedCell);
                
                if(possible) {
                    selectedIsWrong = false;
                    selectedCell.css("color", "#4a90e2");
                }else {
                    selectedIsWrong = true;
                    selectedCell.css("color", "red");
                }
            }
        }
    }
});
