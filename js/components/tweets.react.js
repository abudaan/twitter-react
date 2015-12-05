import React from 'react';

class Tweets extends React.Component{

  static displayName = 'Tweets';

  constructor(props){
    super(props);

  }

  render(){
    let result = [];
    let tweets = this.props.tweets;
    tweets.forEach(function(tweet){
      function createHTML(){
        return {__html: tweet.text};
      }
      result.push(
        <div className="slide" key={tweet.id}>
          <p className="tweet" dangerouslySetInnerHTML={createHTML()} />
        </div>
      );
    });
    return(
      <div className="slider">
        {result}
      </div>
    );
  }
}

Tweets.propTypes = {
  tweets: React.PropTypes.array
};

export default Tweets;
