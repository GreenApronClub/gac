import * as types from '../actionTypes';

export function checkUser() {
  return (dispatch) => {
    var isLoggedIn = false;
    if (sessionStorage.getItem('jwt')) {
      isLoggedIn = true;
      dispatch({ type: types.IS_LOGGED_IN, payload: isLoggedIn });
    }
  }
}
