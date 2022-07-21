'use strict'



function countNeighborsBombs(cellI, cellJ, mat) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[0].length) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function getEmptyCells(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function drawNum(arr) {
    var idx = getRandomInt(0, arr.length - 1)
    var obj = arr[idx]
    arr.splice(idx, 1)
    return obj
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}




