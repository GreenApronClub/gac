import axios from 'axios';
import * as types from '../actionTypes';
import { ROOT_URL } from '../../config/constants';

export function editStrain(params, history, values) {
  const request = axios.put(`${ROOT_URL}/manage/strains/${params}`, values);

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        dispatch({ type: types.EDIT_STRAIN, payload: response.data.success });
        history.push(`/manage-strain/${params}`);
      }
    })
    .catch(error => {
      dispatch({ type: types.EDIT_STRAIN_ERROR, payload: error.response.data.message });
    })
  }
}

export function clearRemoveMessage(clear) {
  return {
    type: types.EDIT_STRAIN,
    payload: clear
  };
}
