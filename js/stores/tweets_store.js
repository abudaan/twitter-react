import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';
import $ from 'jquery';

let CHANGE_EVENT = 'change';

class TweetsStore extends EventEmitter {

  constructor () {
    super();
    this.firstPage = false;
    this.lastPage = false;
    this.currentPage = -1;
    this.nextPage = 0;
    this.pages = [];

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
      firstPage: this.firstPage,
      lastPage: this.lastPage
    };
  }

  getInitData() {
    //console.log('getTweets', this.tweets);
    return {
      tweets: [],
      firstPage: this.firstPage,
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
      this.currentPage = this.nextPage;
      this.lastPage = data.lastpage;
      this.firstPage = this.currentPage === 0;
      this.emitChange();
    })
    .fail(() => {
      // reset this.nextPage
      this.nextPage = this.currentPage;
      if(this.currentPage === -1){
        this.pages = [{
          tweets: [{
            id: -1,
            user_name: 'admin',
            user_img: '',
            text: 'no tweets'
          }]
        }];
        this.currentPage = 0;
        this.emitChange();
      }
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
