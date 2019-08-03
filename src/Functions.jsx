
function calculateWinner(squares) {
    const rows = Math.sqrt(squares.length);
    const cols = Math.sqrt(squares.length);
    let winCombos = [];

    //Winnable methods count is row+count+2
    for(let i = 0; i < rows; i++) {
      let rowWinCombo = [];
      let colWinCombo = [];
      // Grab all winning combinations of straight rows
      for(let j = 0; j < cols; j++) {
        rowWinCombo.push((i*rows)+j);
        colWinCombo.push((j*rows)+i);
      }
      winCombos.push(rowWinCombo);
      winCombos.push(colWinCombo);
    }

    let leftDiagonal = [];
    let rightDiagonal = [];
    for(let i = 0; i < rows; i++) {
      leftDiagonal.push((i*rows) + i);
      rightDiagonal.push(((i+1)*rows) - i - 1);
    }
    winCombos.push(leftDiagonal);
    winCombos.push(rightDiagonal);

    for (let i = 0; i < winCombos.length; i++) {
      let currentIndex = winCombos[i];
      if(squares[currentIndex[0]] && currentIndex.every((val, i, arr) => squares[val] === squares[arr[0]] )) {
        return squares[currentIndex[0]];
      }
    }
    return null;
  }
export {calculateWinner};
