'use strict';

const MINE = '💣';
const FLAG = '🚩';
const WIN = '😀'
const LOSE = '💥'
const PLAY = '😎'



var gBoard = [];

var gLevel = { SIZE: 4, MINES: 2 };

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

var gTimerInterval

function init() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

}

function buildBoard(size) {
    var board = [];
    var isShown
    for (var i = 0; i < size; i++) {
        // board.push([]);
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    var gMineCount = 0;
    while (gMineCount < gLevel.MINES) {
        var mineSpot = board[getRandomIntInclusive(0, size - 1)][getRandomIntInclusive(0, size - 1)]
        if (mineSpot.isMine === true) continue
        if (mineSpot.isMine === false) mineSpot.isMine = true
        gMineCount++
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
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = ' ';
            var className = 'cell';
            var idName = 'cell' + i + '-' + j;
            strHTML += '<td onclick="cellClicked(this)" oncontextmenu="cellMarked(this); return false" class="' + className + '" id="' + idName + '"> ' + cell + ' </td>';
        };
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}



function cellClicked(elCell) {
    if (gGame.markedCount === 0 && gGame.shownCount === 0 && gGame.isOn === false) {
        startTimer(Date.now())
        gGame.isOn
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            if (curCell.isMarked) continue
            if (elCell.id === 'cell' + i + '-' + j) {
                curCell.isShown = true;
                if (!elCell.classList.contains("clicked")) {
                    elCell.classList.add("clicked")
                    gGame.shownCount++
                }
                if (curCell.isMine) {
                    elCell.innerText = `${MINE}`;
                    checkGameOver()
                }
                else if (curCell.minesAroundCount > 0) {
                    elCell.innerText = curCell.minesAroundCount

                }

            }

        }
    }
}

function cellMarked(elCell) {
    if (gGame.markedCount === 0 && gGame.shownCount === 0 && gGame.isOn === false) {
        startTimer(Date.now())
        gGame.isOn
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j];
            if (elCell.id === 'cell' + i + '-' + j) {
                if (elCell.classList.contains("clicked")) break;
                if (curCell.isMarked) {
                    curCell.isMarked = false
                    elCell.innerText = " "
                    gGame.markedCount--
                } else {
                    curCell.isMarked = true;
                    gGame.markedCount++
                    elCell.innerText = FLAG;
                }
            }
        }
    } checkGameOver()
}

function startTimer(startTime) {
    clearInterval(gTimerInterval)
    gTimerInterval = setInterval(function () {
        gGame.secsPassed = Date.now() - startTime;
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = 'Game Time: '+(gGame.secsPassed / 1000).toFixed(2)+ ' seconds'
    }, 10);
    gGame.isOn = true

}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var curCell = gBoard[i][j]
            var elRestart = document.querySelector('.restart')
            if (gGame.livesLeft === 0) {
                elRestart.innerText = `${LOSE}`
                gGame.isOn = false
                clearInterval(gTimerInterval)
                if (curCell.isMine) renderCell(i, j, `${MINE}`)
            }
            if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2)) {
                elRestart.innerText = `${WIN}`
                gGame.isOn = false
                clearInterval(gTimerInterval)
            }
        }
    }

}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var curCell = gBoard[i][j]
            var elCell = document.querySelector(`#cell${i}-${j}`);
            if (curCell.isMine === false) {
                cellClicked(elCell)
            }
        }
    }
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function renderCell(i, j, value) {
    var elCell = document.querySelector(`#cell${i}-${j}`);
    elCell.innerText = value;
}

function restart() {
    if (gLevel.SIZE === 4) renderLevel(4, 2);
    if (gLevel.SIZE === 8) renderLevel(4, 12);
    if (gLevel.SIZE === 12) renderLevel(4, 30);
}

function renderLevel(rowColLength, mines) {
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0;
    gGame.shownCount = 0
    gGame.markedCount = 0
    var elRestart = document.querySelector('.restart')
    gGame.isOn = false
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '0.00';
    gLevel.SIZE = rowColLength
    gLevel.MINES = mines;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
}