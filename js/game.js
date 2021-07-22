'use strict'
var MINE = '💥';
var FLOOR = '⬜';

var gLevel = {
    size: 4,
    MINES: 2
};
var gBoard;
var gCell;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gBoard = buildBoard()
    console.log(gBoard);
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true;
}

gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true,
    mask: FLOOR
}

function buildBoard() {
    var size = gLevel.size;
    var mineCount = 0;
    //clear board init:

    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = Object.create(gCell);
            board[i][j].minesAroundCount = 0;
            board[i][j].isMine = false;
            board[i][j].isShown = false;
            board[i][j].isMarked = false;
        }
    }

    //placing bombs:
    var minedBoard = randomMine(board);

    // var randomMine = board[Math.floor(Math.random() * months.length)];

    var newBoard = setMinesNegsCount(minedBoard);
    // board[3][3] = MINE;
    // var newBoard = setMinesNegsCount(board)
    // console.log(newBoard);
    return newBoard;
}

function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var cellId = i + '-' + j;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td  onclick="cellClicked(this)"  id ="${cellId}" class="${className}">${cell.mask}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    // var checkFloor = renderCell(cellId, cell.FLOOR)
}

function setMinesNegsCount(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true) continue;
            newBoard[i][j].mineNegCount = (mineNegCount(i, j, board) === 0) ? 0 : mineNegCount(i, j, board);

            // NEED TO ADD MORE CONDITIONS FOR NUMBER OF MINE NEGS ON FLOOR:
            // } else if (board[i][j] === ) newBoard[i][j] = '';
        }
    }
    return newBoard;
}

function mineNegCount(cellI, cellJ, mat) {
    var minesNegCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            var currCell = mat[i][j]
            console.log(currCell);
            if (currCell.isMine === true) minesNegCount++;
        }
    }
    return minesNegCount;
}

function cellClicked(elCell) {
    var elCellLocation = elCell.id;
    var i = elCellLocation.substr(0, 1)
    var j = elCellLocation.substr(2, 3)
    renderCell(elCell, i, j)
}
//enter more conditions for displaying; bomb and empty spaces:
function renderCell(elCell, i, j) {
    var numCount = gBoard[i][j].mineNegCount;
    gBoard[i][j].isShown = true;
    if (numCount !== 0) {
        elCell.innerText = numCount;
    }
    if (numCount === 0) {
        elCell.innerText = '';
    }

    if(gBoard[i][j].isMine === true){
        elCell.innerText = MINE;
    }


}


function cellMarked(elCell, location) {



}

function checkGameOver() {
    console.log('YOU LOST');
}

function randomMine(board) {
    var mineCount = 0;
    while (mineCount !== gLevel.MINES) {
        var i = Math.floor(Math.random() * (gLevel.size - 0) + 0);
        var j = Math.floor(Math.random() * (gLevel.size - 0) + 0);
        if (board[i][j].isMine === false) {
            board[i][j].isMine = true;
            mineCount++;
        }
    }
    return board;
}


function expandShown(board, elCell, i, j) {

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}