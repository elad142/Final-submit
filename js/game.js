'use strict'
var MINE = '💥';
var FLOOR = '⬜';
var FLAG = '🚩';
var gFirstMove;

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
    document.querySelector(`.game-border`).addEventListener("contextmenu", e => e.preventDefault());
    renderUpperBoard()
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    gFirstMove = true;
    gGame.isOn = true;
}

gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true,
    mask: FLOOR
}
function renderUpperBoard() {
    var elContainer = document.querySelector('.upper-menu');
    var strHTML = `<label class="score">${gLevel.MINES}</label><button class="smiley" onclick="initGame()">${gCell.mask}</button><label class="timer">000</label>`
    elContainer.innerHTML = strHTML;
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
    var newBoard = setMinesNegsCount(minedBoard);
    return newBoard;
}

function renderBoard(mat, selector) {

    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = "";
    var strHTML = '<table><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var cellId = i + '-' + j;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td  onclick="cellClicked(this,${i},${j})" + oncontextmenu="cellRightClicked(this,${i},${j})"  id ="${cellId}" class="${className}">${cell.mask}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true) continue;
            newBoard[i][j].mineNegCount = (mineNegCount(i, j, board) === 0) ? 0 : mineNegCount(i, j, board);
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
            if (currCell.isMine === true) minesNegCount++;
        }
    }
    return minesNegCount;
}

function cellClicked(elCell) {
    var elCellLocation = elCell.id;
    var i = elCellLocation.substr(0, 1)
    var j = elCellLocation.substr(2, 3)
    if (gBoard[i][j].isMarked) {
        return;
    }
    if (gFirstMove) {
        while (gFirstMove) {
            if (gBoard[i][j].isMine) {
                gBoard = buildBoard()
            } else {
                renderBoard(gBoard, '.board-container')
                gFirstMove = false;
                renderCell(document.querySelector(`.cell${elCellLocation}`), i, j, "L");
                startTimer();
            }
        }
    }
    renderCell(elCell, i, j, "L");
    checkGameOver(i, j);
}

function cellRightClicked(elCell) {
    var elCellLocation = elCell.id;
    var i = elCellLocation.substr(0, 1)
    var j = elCellLocation.substr(2, 3)
    if (document.querySelector(".score").innerText === '0') {
        return;
    }
    renderCell(elCell, i, j, "R");
}

//enter more conditions for displaying; bomb and empty spaces:
function renderCell(elCell, i, j, RvL) {
    if (RvL === "R") {
        if (gBoard[i][j].isMarked) {
            elCell.innerText = FLOOR;
            gFirstMove = false;
            gBoard[i][j].isMarked = !(gBoard[i][j].isMarked);
            document.querySelector('.score').innerText = parseInt(document.querySelector('.score').innerText) + 1
        }
        else {
            gFirstMove = false;
            elCell.innerText = FLAG;
            gBoard[i][j].isMarked = !(gBoard[i][j].isMarked);
            document.querySelector('.score').innerText = parseInt(document.querySelector('.score').innerText) - 1;
        }
    }
    else {
        var numCount = gBoard[i][j].mineNegCount;
        if (numCount < 0 || gBoard[i][j].isMine === false) {
            elCell.innerText = gBoard[i][j].mineNegCount;
        }
        if (numCount === 0) {
            elCell.innerText = '';
            // expandShown(elCell, i, j);
        }
        if (gBoard[i][j].isMine === true) {
            elCell.innerText = MINE;
        }
    }
}


function cellMarked(elCell, location) {



}

function checkGameOver(i, j) {
    if (gBoard[i][j].isMine) {
        //reveal bombs
        for (var l = 0; l < gLevel.size; l++) {
            for (var k = 0; k < gLevel.size; k++) {
                if (gBoard[l][k].isMine) {
                    gBoard[l][k].isShown = true;
                    var elCellLocation = l + '-' + k;
                    renderCell(document.querySelector(`.cell${elCellLocation}`), l, k);
                }
            }
        }
        stopTimer();
        alert("GAME OVER");
    }
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

function expandShown(elCell, i, j) {
    for (var i = i - 1; i <= i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = j - 1; j <= j + 1; j++) {
            if (i === i + 1 && j === j+1 || i === i - 1 && j === j - 1 || i === i + 1 && j === j - 1 || i === i - 1 && j === j + 1||i === i && j === j) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            console.log(i,j);
            // if (gBoard[i][j].mineNegCount === 0) {
            //     renderCell(document.querySelector(`.cell#${i} "-" ${j}]`), i, j,"L")
            // }
            // else { renderCell(document.querySelector(`.cell#${i} "-" ${j}]`), i, j,"L") }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
//TIMER:

var time1 = Date.now();
var myTime;
function startTimer() {
    time1 = Date.now();
    myTime = setInterval(timeCycle, 1);
}
function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - time1;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -5);
    document.querySelector('.timer').innerHTML = '0' + timeDiffStr;
}
function stopTimer() {
    clearInterval(myTime);
    var finishTime = document.querySelector('.timer').innerHTML;
    return finishTime;
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}