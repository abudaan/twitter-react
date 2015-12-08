import React from 'react';
import Action from '../actions/tweets_action';


class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props){
    super(props);
  }

  render(){

    if(!this.props.lastPage && !this.props.firstPage){
      return(
        <div>
        </div>
      );
    }

    if(this.props.firstPage){
      return(
        <div className="arrow-right" onClick={Action.nextPage}>
          <div className="icon">&#61524;</div>
        </div>
      );
    }

    if(this.props.lastPage){
      return(
        <div className="arrow-left" onClick={Action.prevPage}>
          <div className="icon">&#61523;</div>
        </div>
      );
    }


    return(
      <div>
        <div className="arrow-left" onClick={Action.prevPage}>
          <div className="icon">&#61523;</div>
        </div>
        <div className="arrow-right" onClick={Action.nextPage}>
          <div className="icon">&#61524;</div>
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  firstPage: React.PropTypes.bool,
  lastPage: React.PropTypes.bool
};

export default Controls;
