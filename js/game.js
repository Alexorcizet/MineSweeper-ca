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
var gBombsCounter = 0
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gTimer
var seconds
var minutes
var gCellsCount
var gLevel = {
    SIZE: 4,
    MINES: 2
};

function markFlag(eve) {
    eve.preventDefault()
    var currCell = eve.path[0].id.split('-')
    if (!gBoard[currCell[0]][currCell[1]].isMarked && gGame.isOn && !gBoard[currCell[0]][currCell[1]].isShown) {
        gBoard[currCell[0]][currCell[1]].isMarked = true
        eve.path[0].innerHTML = FLAG
        gGame.markedCount++
    } else if (gBoard[currCell[0]][currCell[1]].isShown) {
        return
    } else {
        gBoard[currCell[0]][currCell[1]].isMarked = false
        eve.path[0].innerHTML = ''
        gGame.markedCount--
    }

}

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

function initGame() {
    document.querySelector('.face').innerHTML = NORMAL_SMILEY
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)
    seconds = 0
    minutes = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    console.log('gBoard:', gBoard)
    gBoard = createMat(gLevel.SIZE)
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)
    randomMinePos(gBoard)
    setMinesNegsCount(gBoard)
    gCellsCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    gGame.isOn = true
    gTimer = setInterval(incrementSeconds, 1000);
}

function play() {

}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return
    if (!gBoard[i][j].minesAroundCount) {
        elCell.innerText = ' '
        elCell.style.backgroundColor = 'darkGrey'
    } else {
        // expandShown(gBoard, elCell, i, j)
        elCell.innerText = gBoard[i][j].minesAroundCount
        elCell.style.backgroundColor = 'darkGrey'
    }
    if (gBoard[i][j].isMine) {
        elCell.innerHTML = `${BOMB}`
        elCell.style.backgroundColor = 'red'
        gameOver()
    }
    gBoard[i][j].isShown = true
    gGame.shownCount++
    gCellsCount--
    document.querySelector('.mines-left').innerText = `Cells Left to open ${+gCellsCount} `
    checkGameIsover()
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    document.querySelector('.face').innerHTML = SAD_SMILEY
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

function expandShown(board, elCell, i, j) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            openNegCells(elCell, i, j, board)
        }
    }
}

function renderBoard(mat) {
    var strHTML = '<table><tbody>\n'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\n<tr>\n'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            strHTML += `<td  id="${i}-${j}" class="cell  "
            onclick="cellClicked(this, ${i},${j})" oncontextmenu="markFlag(event)">`
            strHTML += '</td>\n'
        }
        strHTML += `</tr>`
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector('.board-container')
    elContainer.innerHTML = strHTML
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
        var getEmptyCell = drawNum(emptyCells)
        gBombsCounter++
        board[getEmptyCell.i][getEmptyCell.j].isMine = true
    }
    return
}

function resetGame() {
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)
    clearInterval(gTimer)
    gCellsCount = 0
    initGame()
}

function checkGameIsover() {
    if (Math.pow(gLevel.SIZE, 2) - gLevel.MINES === gGame.shownCount && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        clearInterval(gTimer)
        document.querySelector('.face').innerHTML = SUNGLASS_SMILEY
        document.querySelector('.mines-left').innerText = "You Cleared All"
    }
}

function getDifficulty(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gLevel.SIZE = EASY
        gLevel.MINES = 2
    }
    else if (elBtn.innerText === 'Medium') {
        gLevel.SIZE = MEDIUM
        gLevel.MINES = 12
    }
    else if (elBtn.innerText === 'Hard') {
        gLevel.SIZE = HARD
        gLevel.MINES = 30
    }
    resetGame()
}











