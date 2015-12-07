import React from 'react';
import Slider from '../components/slider.react.js';
import guid from '../util/guid.js';
let ReactTransitionGroup = require('react-addons-css-transition-group');
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');


class Tweets extends React.Component{

  static displayName = 'Tweets';

  constructor(props){
    super(props);
  }

  render(){
    return (
      <ReactCSSTransitionGroup
          key="transition"
          component="div"
          // transitionAppear={true}
          transitionName="slider"
          // transitionAppearTimeout={0}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
        >
        <Slider tweets={this.props.tweets} key={guid()} />
      </ReactCSSTransitionGroup>
    );
  }
}

Tweets.propTypes = {
  tweets: React.PropTypes.array
};

export default Tweets;
