'use strict'
////////////////CONST Decleration/////
const BOMB = '&#128163'
const NORMAL_SMILEY = '&#128516'
const SUNGLASS_SMILEY = '&#128526;'
const SAD_SMILEY = '&#128534'
const FLAG = '&#128681'
const HEART = '&#128150'
const DEAD = '&#9760'
const EMPTY = ' '
const EASY = 4
const MEDIUM = 8
const HARD = 12
const HINT = '&#x1F4A1'
//////////////Global Vars///////
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
}
var hintCount
var gBombsCounter
var gBoard
var gTimer
var gSeconds
var gMinutes
var gCellsCount
var firstClicked
var bomb = new Audio('sounds/bombHit.mp3');
var lost = new Audio('sounds/gameLost.mp3')
var win = new Audio('sounds/gameWon.mp3')
//////////////////starter Functions ////////////////////
function initGame() {
    firstClicked = false
    hintCount = 3
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gSeconds = 0
    gMinutes = 0
    gBombsCounter = 0
    incrementSeconds()
    clearInterval(gTimer)
    document.querySelector('.mines-left').innerHTML = `You have to disable ${gLevel.MINES} bombs, Good luck!`
    document.querySelector('.hints').innerHTML = `You have  <span onclick="getHint()">${HINT.repeat(hintCount)}</span> hints, use them wisely!`
    document.querySelector('.face').innerHTML = NORMAL_SMILEY
    if (gLevel.SIZE === 4) gLevel.LIVES = 1
    if (gLevel.SIZE === 8) gLevel.LIVES = 3
    if (gLevel.SIZE === 12) gLevel.LIVES = 3
    document.querySelector('.life').innerHTML = `You're Current life count is :${HEART.repeat(gLevel.LIVES)}`
    gCellsCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
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
    if (gBoard[currCell[0]][currCell[1]].isShown || !gGame.isOn) {
        return
    }
    document.querySelector('.mines-left').innerHTML = `You have to disable ${gBombsCounter} bombs, Good luck!`
    if (!gBoard[currCell[0]][currCell[1]].isMarked && gGame.isOn && !gBoard[currCell[0]][currCell[1]].isShown) {
        gBombsCounter--
        gGame.markedCount++
        gBoard[currCell[0]][currCell[1]].isMarked = true
        eve.path[0].innerHTML = FLAG
        checkGameIsOver()
    } else {
        gBombsCounter++
        gBoard[currCell[0]][currCell[1]].isMarked = false
        gGame.markedCount--
        eve.path[0].innerHTML = ''
        checkGameIsOver()
    }
}

function numColors(value) {
    if (value === 1) return 'blue'
    if (value === 2) return 'green'
    if (value === 3) return 'red'
    if (value === 4) return 'purple'
    if (value === 5) return 'maroon'
    if (value === 6) return 'turquoise'
    if (value === 7) return 'black'
    if (value === 8) return 'magenta'
}

function incrementSeconds() {
    var elMin = document.querySelector('.min');
    var elSec = document.querySelector('.sec');
    var secHTML
    var minHTML
    if (gSeconds === 60) {
        gMinutes++
        gSeconds = 0
    }
    if (gSeconds < 10) {
        secHTML = `0${gSeconds} `
    } else if (gSeconds < 60) {
        secHTML = `${gSeconds} `
    }
    if (gMinutes < 10) {
        minHTML = `Timer: 0${gMinutes} : `
    } else if (gSeconds < 60) {
        minHTML = `Timer: ${gMinutes} : `
    }
    gSeconds += 1;
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
            gBombsCounter--
            gBoard[i][j].isMine = false
            randomMinePos(gBoard)
        }
        setTimeout(setMinesNegsCount(gBoard), 1000)
    }
    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) return
    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true
        if (!gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {
            renderCell(i, j, ' ', 'darkGrey')
            expandShown(gBoard, elCell, i, j)
        }
        else if (gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {
            renderCell(i, j, gBoard[i][j].minesAroundCount, 'darkGrey')
        } else {
            if (gLevel.LIVES === 0) {
                gameOver()
            } else {
                bomb.play()
                gBombsCounter--
                document.querySelector('.mines-left').innerHTML = `You have to disable ${gBombsCounter} bombs, Good luck!`
                gGame.markedCount++
                gLevel.LIVES--
                if (gLevel.LIVES > 0) document.querySelector('.life').innerHTML = `You're Current life count is :${HEART.repeat(gLevel.LIVES)} `
                else document.querySelector('.life').innerHTML = `MIND THE BOMBS OR ELSE YOU WILL BE ${DEAD} `
            }
            renderCell(i, j, BOMB, 'red')
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
                cellClicked(elCell, i, j)
            }
        }
    }
}

function renderCell(i, j, value, color) {

    const elCell = document.getElementById(`${i}-${j}`)
    elCell.style.backgroundColor = color
    elCell.innerHTML = value
    elCell.style.color = numColors(gBoard[i][j].minesAroundCount)
    if (value === BOMB) return
    gGame.shownCount++
}

function getHint() {

    if (!gGame.isOn) return

    hintCount--

    if (hintCount === 0) document.querySelector('.hints').innerHTML = 'You are out of hints. Good luck'
    else document.querySelector('.hints').innerHTML = `You have  <span onclick="getHint()">${HINT.repeat(hintCount)}</span> hints, use them wisely!`

    var noneMineCells = getNoneMInesOrSHownCells(gBoard)
    var getEmptyCell = drawNum(noneMineCells)

    var hintCell = document.getElementById(`${getEmptyCell.i}-${getEmptyCell.j}`)

    hintCell.style.backgroundColor = 'darkGrey'
    hintCell.style.color = numColors(gBoard[getEmptyCell.i][getEmptyCell.j].minesAroundCount)
    if (!gBoard[getEmptyCell.i][getEmptyCell.j].minesAroundCount) hintCell.innerHTML = ' '
    else hintCell.innerHTML = `${gBoard[getEmptyCell.i][getEmptyCell.j].minesAroundCount}`

    setTimeout(() => reverseHint(hintCell, getEmptyCell.i, getEmptyCell.j), 1000)
}

function reverseHint(cell, i, j) {
    gGame.isMarked--
    console.log('cell:', cell)
    gBoard[i][j].isShown = false
    cell.innerHTML = ' '
    cell.style.backgroundColor = 'rgb(192, 234, 137)'
}

///////////////////////////Difficulty///////////////////////////
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
    lost.play()
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
        win.play()
        document.querySelector('.mines-left').innerText = 'You Mastered this Minefield Try a harder One'
        gGame.isOn = false
        clearInterval(gTimer)
        document.querySelector('.face').innerHTML = SUNGLASS_SMILEY
    }
}






