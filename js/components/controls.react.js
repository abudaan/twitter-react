import React from 'react';
import Action from '../actions/tweets_action';


class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props){
    super(props);
  }

  render(){
    if(this.props.firstPage){
      return(
        <div>
          <div className="arrow-right" onClick={Action.nextPage}>
            <div className="w-icon-slider-right w-hidden-tiny slider-tfeed-arrow right">N</div>
          </div>
        </div>
      );
    }

    if(this.props.lastPage){
      return(
        <div>
          <div className="arrow-left" onClick={Action.prevPage}>
            <div className="w-icon-slider-left w-hidden-tiny slider-tfeed-arrow left">P</div>
          </div>
        </div>
      );
    }

    return(
      <div>
        <div className="arrow-left" onClick={Action.prevPage}>
          <div className="w-icon-slider-left w-hidden-tiny slider-tfeed-arrow left">P</div>
        </div>
        <div className="arrow-right" onClick={Action.nextPage}>
          <div className="w-icon-slider-right w-hidden-tiny slider-tfeed-arrow right">N</div>
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
