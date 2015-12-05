import React from 'react';
import Action from '../actions/tweets_action';


let prevStyle = {
  float: 'left',
  padding: '5px'
};

let nextStyle = {
  float: 'right',
  padding: '5px'
};

class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props){
    super(props);
  }

  render(){
    if(this.props.page === 0){
      return(
        <div id="controls">
          <div style={nextStyle} onClick={Action.nextPage}>Next</div>
        </div>
      );
    }

    return(
      <div id="controls">
        <div style={prevStyle} onClick={Action.prevPage}>Prev</div>
        <div style={nextStyle} onClick={Action.nextPage}>Next</div>
      </div>
    );
  }
}

Controls.propTypes = {
  page: React.PropTypes.number
};

export default Controls;
