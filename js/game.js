'use strict';

const MINE = '*';
const EMPTY = '';

var gMineCount = 0;
var gSize = 4;
var gBoard = [];

var gCell

init()
function init() {
    gBoard = buildBoard(gSize)
    renderBoard(gBoard)

    console.table(gBoard);
}

function buildBoard(size) {
    var board = [];
    var isShown
    for (var i = 0; i < size; i++) {
        // board.push([]);
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = gCell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }

    while (gMineCount < 2) {

        board[getRandomIntInclusive(0, size - 1)][getRandomIntInclusive(0, size - 1)].isMine = true;
        gMineCount++;
    }
    setMinesNegsCount(board)

    return board;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            
            var noOfNeighbors = countNeighbors(i, j, board);
            if (!board[i][j].isMine) board[i][j].minesAroundCount = noOfNeighbors
        }
    }

    return board
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsSum++;
        }
    }

    return neighborsSum;
}

function renderBoard(board) {
    // console.table(board);
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" onclick="cellClicked(this)"><span>${cell}</span></td>`

        }

        strHTML += '</tr>'
    }

    var elTbody = document.querySelector('.board');
    elTbody.innerHTML = strHTML;


}

// function myFunction() {
//     var x = document.getElementById("myDIV");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }

function cellClicked(elCell) {
        gCell.isShown = true
    elCell.span.display = block
}

