export const LOGIN_ERROR = 'login_error';

export function sendErrorToReducers(error) {
  return {
    type: LOGIN_ERROR,
    payload: error,
  };
}
