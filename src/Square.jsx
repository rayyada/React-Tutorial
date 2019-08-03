import React from 'react';

class Square extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.value !== nextProps.value) {
        return true;
      }
      if (this.props.value2 !== nextProps.value2) {
        return true;
      }
      return false;
    }

    render() { 
      console.log("SQUARE RENDER");
      return (
        <button
          className="square"
          onClick={this.props.onClick}
          onMouseOver={this.props.onMouseOver}
          onMouseOut={this.props.onMouseOut}
        >
          {this.props.value}
          {this.props.value2}
        </button>
      );
    }
}

export default Square;
