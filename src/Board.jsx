import React from 'react';
import Square from './Square.jsx';

class Board extends React.Component {

  // Only re-render board if value is squares is out of date
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.squares !== nextProps.squares) {
      return true;
    } else if (this.props.squares.length !== nextProps.squares.length) {
      return true;
    }
    return false;
  }


  renderSquare(i) {
    return (
        <Square
            clickValue={this.props.squares[i]}
            hoverChar={this.props.xIsNext ? 'X' : 'O'}
            key={'square-'+i}
            onClick={() => this.props.onClick(i)}
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
  // console.log("BOARD RENDER");
    var boardArray = this.renderBoard(this.props.boardRows);
    return (
      <div>
        {boardArray}
      </div>
    );
  }
}

export default Board;
