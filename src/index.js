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
        //onHover={ () => { if(this.state.tempValue != null && this.state.permValue != null) this.setState({tempValue: null})}}
        //onMouseOver={ () => { this.setState({value: 'X'}) }}
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
        <div key={"row " + index} className="board-row">
          {value}
        </div>
      );
    });
    return result;
  }

  render() {
    var boardArray = this.renderBoard(3);
    return (
      <div>
        {boardArray}
      </div>
    );
  }
}

class GameInfo extends React.Component {

    renderStatus() {
      const history = this.props.history;
      const current = history[this.props.stepNumber];
      const winner = calculateWinner(current.squares);
      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
      }
      return (<div>{status}</div>);
    }

    renderMoves() {
      const history = this.props.history;
      const moves = history.map((step, move) => {
          const desc = move ?
              'Go to move #' + move + ', ' + ((move % 2 === 1) ? 'X' : 'O') + ' to row ' + step.lastCoord[0] + ', col ' + step.lastCoord[1] :
              'Go to game start';
          return (
              <li key={move}>
                  <button
                    onClick={() => this.props.jumpTo(move)}
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
      console.log(this.props.toggle);
      return (<button onClick={() => this.props.toggle === true ? this.props.toggle = false : this.props.toggle = true}> Toggle </button>);
    }

    handleJumpTo(e) {
      if (typeof this.props.jumpTo === 'function') {
          this.props.jumpTo(e.target.value);
      }
    }

    render() {
      var status = this.renderStatus();
      var toggleButton = this.renderToggleButton();
      var moves = this.renderMoves();
      var moves2 = !this.props.toggle ? moves : moves.reverse();
      return (
        <div>{[status,toggleButton,moves2]}</div>
      );
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
                        lastCoord: [Math.floor(i/3) + 1, (i % 3) + 1],
                    }]),
                    xIsNext: !this.state.xIsNext,
                    stepNumber: history.length,
                });
  }

  handleMouseOver(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
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
    const current = history[history.length - 1];
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

  jumpTo(step) {
    console.log(this.props);
      console.log(this.state);
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
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
          />
        </div>
        <div className="game-info">
          <GameInfo
            history = {history}
            stepNumber = {this.state.stepNumber}
            xIsNext = {this.state.xIsNext}
            jumpTo = {this.jumpTo}
            toggle = {false}
            moves = {null}
            status = {null}
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
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
