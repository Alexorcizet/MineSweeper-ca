'use strict'
////////////////CONST Decleration/////
const BOMB = '&#128163'
const NORMAL_SMILEY = '&#128516'
const SUNGLASS_SMILEY = '&#128526;'
const SAD_SMILEY = '&#128534'
const EMPTY = ' '
const EASY = 4
const MEDIUM = 8
const HARD = 12
const FLAG = '	&#128681'
//////////////Global Vars///////
var gBombsCounter
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var firstClicked
var gTimer
var seconds
var minutes
var gCellsCount
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
}
//////////////////starter Functions ////////////////////
function initGame() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    seconds = 0
    minutes = 0
    gBombsCounter = 0
    incrementSeconds()
    clearInterval(gTimer)
    document.querySelector('.mines-left').innerHTML = `You have to disable ${gLevel.MINES} bombs, Good luck!`
    document.querySelector('.face').innerHTML = NORMAL_SMILEY
    if (gLevel.SIZE === 4) gLevel.LIVES = 1
    if (gLevel.SIZE === 8) gLevel.LIVES = 3
    if (gLevel.SIZE === 12) gLevel.LIVES = 3
    document.querySelector('.life').innerHTML = `You're Current life count is :${gLevel.LIVES} `
    gCellsCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    firstClicked = false
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = countNeighborsBombs(i, j, board)
        }
    }
}

function creatCell() {
    var currCell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return currCell
}

function randomMinePos(board) {
    var emptyCells = getEmptyCells(board)
    while (gBombsCounter < gLevel.MINES) {
        gBombsCounter++
        var getEmptyCell = drawNum(emptyCells)
        board[getEmptyCell.i][getEmptyCell.j].isMine = true
    }
    return
}
//////////////////////////////////////////////////////////////////////////////INGAME functions//////////////////////////////////////////////////////////////////////////////
////////////////////Marking a cell with Flags ///////////////////
function markFlag(eve) {
    eve.preventDefault()
    var currCell = eve.path[0].id.split('-')
    if (!gBoard[currCell[0]][currCell[1]].isMarked && gGame.isOn && !gBoard[currCell[0]][currCell[1]].isShown) {
        gGame.markedCount++
        gBoard[currCell[0]][currCell[1]].isMarked = true
        eve.path[0].innerHTML = FLAG
        checkGameIsOver()
    } else if (gBoard[currCell[0]][currCell[1]].isShown) {
        return
    } else {
        gBoard[currCell[0]][currCell[1]].isMarked = false
        eve.path[0].innerHTML = ''
        gGame.markedCount--
        checkGameIsOver()
    }
}
///////////////////Timer function////////////////////
function incrementSeconds() {
    var elMin = document.querySelector('.min');
    var elSec = document.querySelector('.sec');
    var secHTML
    var minHTML
    if (seconds === 60) {
        minutes++
        seconds = 0
    }
    if (seconds < 10) {
        secHTML = `0${seconds}`
    } else if (seconds < 60) {
        secHTML = `${seconds}`
    }
    if (minutes < 10) {
        minHTML = `Timer: 0${minutes}:`
    } else if (seconds < 60) {
        minHTML = `Timer: ${minutes}:`
    }
    seconds += 1;
    gGame.secsPassed++
    elMin.innerHTML = minHTML
    elSec.innerHTML = secHTML
}

function cellClicked(elCell, i, j) {
    if (!firstClicked) {
        firstClicked = true
        gGame.isOn = true
        gTimer = setInterval(incrementSeconds, 1000);
        randomMinePos(gBoard)
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isMine = false
            randomMinePos(gBoard)
        }
        setTimeout(setMinesNegsCount(gBoard), 1000)
    }
    if (gBoard[i][j].isShown) return
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (!gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {
        expandShown(gBoard, elCell, i, j)
        gBoard[i][j].isShown = true
        elCell.innerText = ' '
        elCell.style.backgroundColor = 'darkGrey'
        gGame.shownCount++
    }
    else if (gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        elCell.innerText = gBoard[i][j].minesAroundCount
        elCell.style.backgroundColor = 'darkGrey'
    } else {
        if (gLevel.LIVES === 0) {
            gameOver()
            elCell.innerHTML = `${BOMB}`
            elCell.style.backgroundColor = 'red'
        } else {
            gGame.markedCount++
            gLevel.LIVES--
            elCell.innerHTML = `${BOMB}`
            document.querySelector('.life').innerHTML = `You're Current life count is :${gLevel.LIVES} `
            elCell.style.backgroundColor = 'red'
        }
    }
    checkGameIsOver()
}


function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[0].length) continue;
            if (board[i][j].isMine || board[i][j].isShown) continue
            else {
                var elCell = document.getElementById(`${i}-${j}`)
                gBoard[i][j].isShown = true
                gGame.shownCount++
                console.log('gGame.markedCount:', gGame.markedCount)
                if (!board[i][j].minesAroundCount) elCell.innerText = ' '
                else elCell.innerText = gBoard[i][j].minesAroundCount
                elCell.style.backgroundColor = 'darkGrey'
            }
        }
    }
}

function easy() {
    gLevel = {
        SIZE: 4,
        MINES: 2,
        LIVES: 1
    }
    resetGame()
}

function medium() {
    gLevel = {
        SIZE: 8,
        MINES: 12,
        LIVES: 3,
    }
    resetGame()
}

function hard() {
    gLevel = {
        SIZE: 12,
        MINES: 30,
        LIVES: 3
    }
    resetGame()
}

//////////////////////////////////////////////////////////////////////////////ENDGAME functions//////////////////////////////////////////////////////////////////////////////
function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    document.querySelector('.face').innerHTML = SAD_SMILEY
    document.querySelector('.mines-left').innerText = 'You\'ve Lost! Try Again'
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                var newBomb = document.getElementById(`${i}-${j}`)
                newBomb.innerHTML = `${BOMB}`
            }
        }
    }
    return
}

function resetGame() {
    initGame()
}

function checkGameIsOver() {

    if (gGame.markedCount === gLevel.MINES && gCellsCount === gGame.shownCount) {
        document.querySelector('.mines-left').innerText = 'You Masters this Minefield Try a harder One'
        gGame.isOn = false
        clearInterval(gTimer)
        document.querySelector('.face').innerHTML = SUNGLASS_SMILEY
    }
}






