import * as types from '../actionTypes';

export function logOut(props) {
  sessionStorage.removeItem('jwt');
  if (!sessionStorage.getItem('jwt')) {
    var isLoggedIn = false;
    props.history.push('/login');
  }
  return {
    type: types.LOG_OUT, payload: isLoggedIn
  }
}
