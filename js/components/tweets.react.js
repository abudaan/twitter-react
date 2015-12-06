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
      let user_url = `https://twitter.com/${tweet.user_name}`;
      let user_name = `@${tweet.user_name}`;
      let tweet_url = `https://twitter.com/${tweet.user_name}/status/${tweet.id}`;
      if(tweet.media_url){
        //console.log(tweet.media_url);
        result.push(
          <div className="slide" key={tweet.id}>
            <div className="flexbox">
              <a href={user_url} target="blank"><div className="user"><img src={tweet.user_img} /><span>{user_name}</span></div></a>
              <p className="tweet" dangerouslySetInnerHTML={createHTML()} />
              <a href={tweet_url} target="blank" className="media"><img src={tweet.media_url} /></a>
            </div>
          </div>
        );
      }else{
        result.push(
          <div className="slide" key={tweet.id}>
            <div className="flexbox">
              <a href={user_url} target="blank"><div className="user"><img src={tweet.user_img} /><span>{user_name}</span></div></a>
              <p className="tweet" dangerouslySetInnerHTML={createHTML()} />
            </div>
          </div>
        );
      }
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
