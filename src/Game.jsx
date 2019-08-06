import React from 'react';
import GameInfo from './GameInfo.jsx';
import Board from './Board.jsx';
import {calculateWinner} from './Functions.jsx'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastCoord: [null, null],
            }],
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
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({ history: history.concat([{
                        squares: squares,
                        lastCoord: [Math.floor(i/this.state.boardRows) + 1, (i % this.state.boardRows) + 1],
                    }]),
                    xIsNext: !this.state.xIsNext,
                    stepNumber: history.length,
                });
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
    this.setState({
      history:history,
      stepNumber: 0,
      xIsNext: true,
      boardRows: rows,
    })
  }

  render() {
  // console.log("GAME RENDER");
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            boardRows = {this.state.boardRows}
            xIsNext = {this.state.xIsNext}
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

export default Game;
