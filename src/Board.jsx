import React from 'react';
import Square from './Square.jsx';

class Board extends React.Component {

  state = {
    tempSquares: Array(9).fill(null),
  }

  // Only re-render board if value is squares is out of date
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.squares !== nextProps.squares) {
      return true;
    }
    return false;
  }

  handleMouseOver(i) {
    const squares = this.props.squares.slice();
    if (squares[i]) {
        return;
    }

    const tempSquares = this.state.tempSquares.slice();
    if (tempSquares[i] === null) {
        tempSquares[i] = this.props.xIsNext ? 'X' : 'O';
    }
    this.setState({tempSquares: tempSquares});
  }

  handleMouseOut(i) {
    const squares = this.props.squares.slice();
    if (squares[i]) {
        return;
    }

    const tempSquares = this.state.tempSquares.slice();
    if (tempSquares[i] !== null) {
        tempSquares[i] = null;
    }
    this.setState({tempSquares: tempSquares});
  }

  renderSquare(i) {
    return (
        <Square
            value={this.props.squares[i]}
            value2={this.state.tempSquares[i]}
            onClick={() => this.props.onClick(i)}
            onMouseOver={(i) => this.handleMouseOver(i)}
            onMouseOut={(i) => this.handleMouseOut(i)}
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
  console.log("BOARD RENDER");
    var boardArray = this.renderBoard(this.props.boardRows);
    return (
      <div>
        {boardArray}
      </div>
    );
  }
}

export default Board;
