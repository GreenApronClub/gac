import * as types from '../../actions/actionTypes';
import initialState from '../initialState';

const SignupReducer = (state = initialState.signup, action) => {
  switch (action.type) {
    case types.REQUEST_SIGNUP:
      return { ...state, isRequesting: true };
    case types.RECEIVED_SIGNUP:
      return {
        ...state,
        isRequesting: false,
        msg: action.payload,
      };
    case types.ERROR_SIGNUP:
      return {
        ...state,
        isRequesting: false,
        errMsg: action.payload,
      };
    default:
      return state;
  }
};

export default SignupReducer;
