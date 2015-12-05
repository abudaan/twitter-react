import AppDispatcher from '../app_dispatcher';
import ActionTypes from '../constants';

export default {

  init(){
    AppDispatcher.dispatch({
      type: ActionTypes.INIT
    });
  },

  nextPage(){
    AppDispatcher.dispatch({
      type: ActionTypes.NEXT_PAGE
    });
  },

  prevPage(){
    AppDispatcher.dispatch({
      type: ActionTypes.PREV_PAGE
    });
  }
};
