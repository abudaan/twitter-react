import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';
import $ from 'jquery';

let CHANGE_EVENT = 'change';

class TweetsStore extends EventEmitter {

  constructor () {
    super();
    this.nextPage = 0;
    this.currentPage = 0;
    this.pages = [{tweets: []}];
    this.lastPage = false;

    AppDispatcher.register((action) => {
      this.handle(action);
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getData() {
    //console.log('getTweets', this.tweets);
    return {
      tweets: this.pages[this.currentPage].tweets,
      firstPage: this.currentPage === 0,
      lastPage: this.lastPage
    };
  }

  loadTweets(){
    $.get(`${Globals.TWEETS_URL}/tweets_${this.nextPage}.json`, (data) => {
      //console.log(data);
      let tweets = [];
      data.tweets.forEach((t) => {
        tweets.push(t);
      });
      this.pages[this.nextPage] = {
        numTweets: data.length,
        tweets: tweets
      };
      this.lastPage = data.lastpage;
      this.currentPage = this.nextPage;
      this.emitChange();
    })
    .fail(() => {
      // reset this.nextPage
      this.nextPage = this.currentPage;
    });
  }

  handle(action) {
    switch(action.type) {

      case ActionTypes.INIT:
        this.loadTweets();
        break;

      case ActionTypes.NEXT_PAGE:
        this.nextPage = this.currentPage + 1;
        this.loadTweets();
        break;

      case ActionTypes.PREV_PAGE:
        this.nextPage = this.currentPage - 1;
        this.loadTweets();
        break;

      default:
      // do nothing
    }
  }
}

export default new TweetsStore();
