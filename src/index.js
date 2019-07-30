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

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
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
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
  }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move + ', ' + ((move % 2 === 1) ? 'X' : 'O') + ' to row ' + step.lastCoord[0] + ', col ' + step.lastCoord[1] :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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
          <div>{ status }</div>
          <ol>{ moves }</ol>
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