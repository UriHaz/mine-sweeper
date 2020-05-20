
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = `cell cell${i}-${j}`;
        strHTML += `<td class=" ${className} "> ${cell} </td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  
  
  function getEmptyVals(board) {
    var empties = [];
    for (var i = 1; i < board.length - 1; i++) {
      for (var j = 1; j < board.length - 1; j++) {
        if (board[i][j] === EMPTY) empties.push({ i: i, j: j });
      }
    }
    return empties;
  }
  
  function getEmptyValsForGhost(board) {
    var empties = [];
    for (var i = 1; i < board.length - 1; i++) {
      for (var j = 1; j < board[0].length - 1; j++) {
        if (board[i][j] === EMPTY || board[i][j] === FOOD) empties.push({ i: i, j: j });
      }
    }
    return empties;
  }