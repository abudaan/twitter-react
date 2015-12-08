import React from 'react';
import guid from '../util/guid';

class Slider extends React.Component{

  static displayName = 'Slider';

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
      let time = new Date(tweet.time * 1000);
      let hour = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let day = time.getDate();
      let month = time.getMonth() + 1;
      let year = time.getFullYear();
      time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + minutes + ':' + seconds;

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
              <a href={user_url} target="blank"><div className="user"><img src={tweet.user_img} /><span>{user_name}<br/>{time}</span></div></a>
              <p className="tweet" dangerouslySetInnerHTML={createHTML()} />
              <a className="media" href={tweet_url} target="blank"><img src={tweet.media_url} /></a>
            </div>
          </div>
        );
      }else{
        result.push(
          <div className="slide" key={tweet.id}>
            <div className="flexbox">
              <a href={user_url} target="blank"><div className="user"><img src={tweet.user_img} /><span>{user_name}<br/>{time}</span></div></a>
              <p className="tweet" dangerouslySetInnerHTML={createHTML()} />
            </div>
          </div>
        );
      }
    });

    return (
        <div key={guid()} className="slider">
          {result}
        </div>
    );
  }
}

Slider.propTypes = {
  tweets: React.PropTypes.array
};

export default Slider;
