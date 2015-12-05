import React from 'react';

let tweetStyle = {
  marginTop: '15px',
  marginBottom: '15px'
};

class Tweets extends React.Component{

  static displayName = 'Tweets';

  constructor(props){
    super(props);

  }

  render(){
    let result = [];
    let tweets = this.props.tweets;
    tweets.forEach(function(tweet){
      result.push(<div key={tweet.id} style={tweetStyle}>{tweet.text}</div>);
    });
    return(
      <div>
        {result}
      </div>
    );
  }
}

Tweets.propTypes = {
  tweets: React.PropTypes.array
};

export default Tweets;
