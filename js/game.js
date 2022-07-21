'use strict'

const BOMB = '&#x1F4A3'
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

gLevel = {
    SIZE: 4,
    MINES: 2
};

var cellsCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES



function init() {
    gBoard = createMat(gLevel.SIZE)
    renderBoard(gBoard)
}

function play() {
    randomMinePos(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    console.log('gBoard:', gBoard)
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

function cellClicked(elTd, i, j) {

    play()
    var currCell = gBoard[i][j]
    console.log('currCell', currCell)
    if (currCell.isMine) {
        gameOver()
    }
}

function gameOver() {
    alert('you Lost')
}

function renderBoard(mat) {
    var strHTML = '<tbody>\n'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\n<tr>\n'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            const className = `cell 0`
            strHTML += `<td  id="${i}-${j}" class="${className}"
            onclick="cellClicked(this, ${i},${j})">`
            if (cell.isMine) {
                strHTML += BOMB
                continue
            }
            if (cell.minesAroundCount > 0) {
                strHTML += setMinesNegsCount(i, j, mat)
            }
            if (cell.minesAroundCount === 3) {
                strHTML += ' '
            }
            strHTML += '</td>\n'
        }
        strHTML += `</tr>`
    }
    strHTML += '</tbody>'
    const elContainer = document.querySelector(' table')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(i, j, board) {
    return countNeighbors(i, j, board)
}

function creatCell() {
    var currCell = {
        minesAroundCount: 3,
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














