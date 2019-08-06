import React from 'react';

class Square extends React.Component {

    state = {
      hoverValue: null,
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.clickValue !== null) {
        this.setState({
          hoverValue: null,
        })
      }
    }

    handleMouseOver(i) {
      if (this.props.clickValue) {
          return;
      }
      var hoverValue = this.state.hoverValue;
      if (hoverValue === null) {
          hoverValue = this.props.hoverChar;
      }
      this.setState({hoverValue: hoverValue});
    }
  
    handleMouseOut(i) {
      if (this.props.clickValue) {
          return;
      }
  
      var hoverValue = this.state.hoverValue;
      if (hoverValue !== null) {
        hoverValue = null;
      }
      this.setState({hoverValue: hoverValue});
    }

    render() { 
      // console.log("SQUARE RENDER");
      return (
        <button
          className="square"
          onClick={this.props.onClick}
          onMouseOver={(i) => { this.handleMouseOver(i)} }
          onMouseOut={(i) => { this.handleMouseOut(i)} }
        >
          {this.props.clickValue}
          {this.state.hoverValue}
        </button>
      );
    }
}

export default Square;
