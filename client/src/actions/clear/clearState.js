import * as types from '../actionTypes';

export function clearAlert() {
  return {
    type: types.CLEAR_ALERT,
  };
}

export function clearMessage(success, type) {
  return {
    type,
    payload: success,
  };
}
