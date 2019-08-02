import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}

      >
        {props.value}
        {props.value2}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            value2={this.props.tempSquares[i]}
            onClick={() => this.props.onClick(i)}
            onMouseOver={() => this.props.onMouseOver(i)}
            onMouseOut={() => this.props.onMouseOut(i)}
            key={'square-'+i}
        />
    );
  }

  renderBoard(rows) {
    let table = [];
    for (let i = 0; i < rows; i++) {
      let children = [];
      for(let j = 0; j < rows; j++) {
        children.push(this.renderSquare((i*rows)+j));
      }

      table.push(children);

    }

    var result = table.map((value, index) => {
      return (
        <div key={'row-'+index} className="board-row">
          {value}
        </div>
      );
    });
    return result;
  }

  render() {
    var boardArray = this.renderBoard(this.props.boardRows);
    return (
      <div>
        {boardArray}
      </div>
    );
  }
}

class GameInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orderToggle: false,
            boardRows: this.props.boardRows,
        }
    }

    handleOnChange = (e) => {
      this.setState({
        boardRows: parseInt(e.target.value),
      });
    }

    handleSubmit = (e) => {
      this.props.boardRowsHandler(this.state.boardRows);
      e.preventDefault();
    }

    renderRowInput() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
          <input type="text" value={this.state.boardRows} onChange={this.handleOnChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }

    renderStatus() {
      const history = this.props.history;
      const current = history[this.props.stepNumber];
      const winner = calculateWinner(current.squares);
      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else if (this.props.stepNumber === Math.pow(this.state.boardRows, 2)) {
        status = 'Draw!';
      } else {
          status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
      }
      return (status);
    }

    renderMoves() {
      const history = this.props.history;
      const moves = history.map((step, move) => {
          const desc = move ?
              'Go to move #' + move + ', ' + ((move % 2 === 1) ? 'X' : 'O') + ' to row ' + step.lastCoord[0] + ', col ' + step.lastCoord[1] :
              'Go to game start';
          return (
              <li key={'move-'+move}>
                  <button
                    onClick={()=>this.props.jumpToHandler(move)}
                    style={ this.props.stepNumber === move ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}
                  >
                    {desc}
                  </button>
              </li>
          );
      });
      return moves;
    }

    renderToggleButton() {
      return (
          <button onClick={() => this.state.orderToggle === true ? this.setState({orderToggle: false}) : this.setState({orderToggle: true})}> Toggle list order </button>
      );
    }


    render() {
      var rowInput = this.renderRowInput();
      var status = this.renderStatus();
      var toggleButton = this.renderToggleButton();
      var renderedMoves = this.renderMoves();
      var moves = !this.state.orderToggle ? renderedMoves : renderedMoves.reverse();

      var objectArray = [rowInput,status,toggleButton,moves];
      const returnObject = objectArray.map((object, index) => {
        return (
          <div key={'gameInfo-'+index}>
            {object}
          </div>
        )
      })
      return (returnObject);
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastCoord: [null, null],
            }],
            tempSquares: Array(9).fill(null),
            xIsNext: true,
            stepNumber: 0,
            boardRows: 3,
        }
    }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
        return;
    }

    const tempSquares = this.state.tempSquares.slice();
    tempSquares[i] = null;
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({ tempSquares: tempSquares,
                    history: history.concat([{
                        squares: squares,
                        lastCoord: [Math.floor(i/this.state.boardRows) + 1, (i % this.state.boardRows) + 1],
                    }]),
                    xIsNext: !this.state.xIsNext,
                    stepNumber: history.length,
                });
  }

  handleMouseOver(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if (squares[i]) {
        return;
    }

    const tempSquares = this.state.tempSquares.slice();
    if (tempSquares[i] === null) {
        tempSquares[i] = this.state.xIsNext ? 'X' : 'O';
    }
    this.setState({tempSquares: tempSquares});
  }

  handleMouseOut(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if (squares[i]) {
        return;
    }

    const tempSquares = this.state.tempSquares.slice();
    if (tempSquares[i] !== null) {
        tempSquares[i] = null;
    }
    this.setState({tempSquares: tempSquares});
  }

  jumpToHandler = (step) => {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
  }

  handleOnChange = (rows) => {
    var history = [{
        squares: Array(Math.pow(rows, 2)).fill(null),
        lastCoord: [null, null],
    }];
    var tempSquares = Array(rows).fill(null);
    this.setState({
      history:history,
      tempSquares: tempSquares,
      stepNumber: 0,
      xIsNext: true,
      boardRows: rows,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            tempSquares = {this.state.tempSquares}
            onClick = {(i) => this.handleClick(i)}
            onMouseOver = {(i) => this.handleMouseOver(i)}
            onMouseOut = {(i) => this.handleMouseOut(i)}
            boardRows = {this.state.boardRows}
          />
        </div>
        <div className="game-info">
          <GameInfo
            history = {history}
            stepNumber = {this.state.stepNumber}
            xIsNext = {this.state.xIsNext}
            jumpToHandler = {this.jumpToHandler}
            boardRowsHandler = {this.handleOnChange}
            boardRows = {this.state.boardRows}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
