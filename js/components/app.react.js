import React from 'react';
import TweetsStore from '../stores/tweets_store';
import Actions from '../actions/tweets_action';
import Tweets from './tweets.react';
import Controls from './controls.react';

/* main react component, the only component with state */


class App extends React.Component{

  static displayName = 'App';

  constructor(props){
    super(props);
    this.state = TweetsStore.getInitData();
    this.onChangeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    TweetsStore.addChangeListener(this.onChangeListener);
    Actions.init();
  }

  componentWillUnmount() {
    TweetsStore.removeChangeListener(this.onChangeListener);
  }

  onChange(){
    let state = TweetsStore.getData();
    this.setState(state);
//    console.log(this.state);
  }

  render(){
    return(
      <div className="ta-slider">
        <div className="mask">
          <Tweets tweets={this.state.tweets} />
          <Controls firstPage={this.state.firstPage} lastPage={this.state.lastPage} />
        </div>
      </div>
    );
  }
}

App.propTypes = {};


export default App;
