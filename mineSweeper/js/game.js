'use strict'

const BOMB = '&#128163'
const EMPTY = ' '

var bombsCounter = 0
var gLevel
var gBoard


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel


var gCellsCount

function init() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gLevel = {
        SIZE: 4,
        MINES: 2
    };
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)

}

function easy() {
    gLevel = {
        SIZE: 4,
        MINES: 2
    };
    play()
}
function medium() {
    gLevel = {
        SIZE: 8,
        MINES: 12
    };
    play()
}
function hard() {
    gLevel = {
        SIZE: 12,
        MINES: 30
    };
    play()
}

function play() {
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)
    randomMinePos(gBoard)
    setMinesNegsCount(gBoard)
    gCellsCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    console.log('gCellsCount:', gCellsCount)
}

function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push(creatCell())
        }
        mat.push(row)
    }
    return mat
}

function cellClicked(elCell, i, j) {

    if (!gGame.isOn) return
    if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        elCell.innerText = gBoard[i][j].minesAroundCount
        elCell.style.backgroundColor = 'darkGrey'
    }
    else {
        gGame.shownCount++
        expandShown(gBoard, elCell, i, j)
    }
    gCellsCount--
    document.querySelector('.mines-left').innerText = `Cells Left to open ${+gCellsCount} `
    if (gBoard[i][j].isMine) {
        gameOver(elCell)
    }

}

function gameOver(elCell) {
    gGame.isOn = false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = `${BOMB}`
                elCell.style.backgroundColor = 'red'
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
            if (countNeighborsBombs(i, j, board) === 0) {
                elCell.style.backgroundColor = 'darkgray'
            }
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
            onclick="cellClicked(this, ${i},${j})">`
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
    while (bombsCounter < gLevel.MINES) {
        var getEmptyCell = drawNum(emptyCells)
        bombsCounter++
        board[getEmptyCell.i][getEmptyCell.j].isMine = true
    }
    return
}














