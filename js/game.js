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
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)


}

function buildBoard(size) {
    var board = [];
    var isShown
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    var gMineCount = 0;
    while (gMineCount < gLevel.MINES) {
        var mineSpot = board[getRandomIntInclusive(0, size - 1)][getRandomIntInclusive(0, size - 1)]
        if (mineSpot.isMine) continue
        if (!mineSpot.isMine) mineSpot.isMine = true
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
            strHTML += `<td onclick="cellClicked(this)" oncontextmenu="cellMarked(this); return false" class="${className}" id="${idName}">${cell}</td>`;
        };
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}


function cellClicked(elCell) {
    if (!gGame.markedCount && !gGame.shownCount && !gGame.isOn) {
        startTimer(Date.now())
        gGame.isOn = true

    }
    if (gGame.isOn) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var curCell = gBoard[i][j];
                if (elCell.id === `cell${i}-${j}` && !curCell.isMarked && !curCell.isShown) {

                    curCell.isShown = true;
                    elCell.classList.add("clicked")
                    gGame.shownCount++

                    if (curCell.isMine) {
                        elCell.innerText = MINE;
                    }
                    if (curCell.minesAroundCount) {
                        elCell.innerText = curCell.minesAroundCount
                    }

                    if (!curCell.minesAroundCount && !curCell.isMine) {
                        expandShown(gBoard, elCell, i, j)
                    }


                }
            }
        }
    }

    checkGameOver()
}

function cellMarked(elCell) {
    if (!gGame.markedCount && !gGame.shownCount && !gGame.isOn) {
        startTimer(Date.now())
        gGame.isOn = true
        gGame.markedCount++

    }
    if (gGame.isOn) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var curCell = gBoard[i][j];
                if (elCell.id === `cell${i}-${j}`) {
                    if (elCell.classList.contains("clicked")) break;
                    if (curCell.isMarked) {
                        curCell.isMarked = false
                        elCell.innerText = " "
                        gGame.markedCount--
                    } else {
                        curCell.isMarked = true;
                        elCell.innerText = FLAG;
                        gGame.markedCount++
                        checkGameOver()

                    }
                }
            }
        }
    }

}

function startTimer(startTime) {
    clearInterval(gTimerInterval)
    gTimerInterval = setInterval(function () {
        gGame.secsPassed = Date.now() - startTime;
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = 'Game Time: ' + (gGame.secsPassed / 1000).toFixed(2) + ' seconds'
    }, 10);
    gGame.isOn = true

}



function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === rowIdx && j === colIdx) continue;
            var curCell = gBoard[i][j]
            var elCell = document.querySelector(`#cell${i}-${j}`);
            if (!curCell.isMine) cellClicked(elCell)

        }
    }

}

function checkGameOver() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var curCell = gBoard[i][j]
            var elRestart = document.querySelector('.restart')
            var elCell = document.querySelector(`#cell${i}-${j}`);
            if (elCell.innerText === MINE) {

                gGame.isOn = false
                clearInterval(gTimerInterval)
                elRestart.innerText = LOSE

            }
            if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2)) {
                gGame.isOn = false
                clearInterval(gTimerInterval)
                elRestart.innerText = WIN
            }
        }
    }

}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restart() {

    renderLevel(gLevel.SIZE, gLevel.MINES)


}


function renderLevel(rowColLength, mines) {
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
    clearInterval(gTimerInterval)
    var elRestart = document.querySelector('.restart')
    elRestart.innerText = PLAY
    gGame.isOn = false
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '0.00';
    gLevel.SIZE = rowColLength
    gLevel.MINES = mines;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
}