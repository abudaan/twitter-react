import React from 'react';
let ReactTransitionGroup = require('react-addons-css-transition-group');


class Tweets extends React.Component{

  static displayName = 'Tweets';

  constructor(props){
    super(props);

  }

  render(){
    let result = [];
    let tweets = this.props.tweets;
    tweets.forEach(function(tweet){

      let user_name = `@${tweet.user_name}`;
      let user_url = `https://twitter.com/${tweet.user_name}`;
      let tweet_url = `https://twitter.com/${tweet.user_name}/status/${tweet.id}`;

      function createHTML(){
        if(tweet.retweet){
          return {__html: `<a class="retweet" target="blank" href="${tweet_url}">&#61561;</a>${tweet.text}`};
        }
        return {__html: tweet.text};
      }


      if(tweet.media_url){
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
    // return (
    //   <div className="slider">
    //     <ReactTransitionGroup key="transition" component="div" transitionAppear={true} transitionName="example" transitionAppearTimeout={0} transitionLeaveTimeout={0}>
    //       {result}
    //     </ReactTransitionGroup>
    //   </div>
    // );
    return (
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
