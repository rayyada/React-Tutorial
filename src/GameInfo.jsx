import React from 'react';
import {calculateWinner} from './Functions.jsx'

class GameInfo extends React.Component {

    state = {
        orderToggle: false,
        boardRows: this.props.boardRows,
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

    winFlagHandler = () => {
      this.props.winFlagHandler();
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
    console.log("GAMEINFO RENDER");
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

export default GameInfo;
