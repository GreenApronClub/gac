import axios from 'axios';
import ROOT_URL from '../../config/constants';
import * as types from '../actionTypes';

export default values => (
  (dispatch) => {
    dispatch({ type: types.REQUEST_SIGNUP });
    axios.post(`${ROOT_URL}/signup`, values)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          dispatch({ type: types.RECEIVED_SIGNUP, payload: res.data.success });
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: types.ERROR_SIGNUP, payload: err.response.data.error });
      });
  }
);

