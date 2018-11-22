import axios from 'axios';
import * as types from '../actionTypes';
import ROOT_URL from '../../config/constants';

export function removeStrain(params, history) {
  const request = axios.delete(`${ROOT_URL}/manage/strains/${params}`, {headers: {'Authorization': sessionStorage.getItem('jwt')}});

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        dispatch({ type: types.REMOVE_STRAIN, payload: response.data.success });
        history.push('/manage-strains');
      }
    })
    .catch(error => {
      dispatch({ type: types.REMOVE_STRAIN_ERROR, payload: error.response.data.message });
    })
  }
}

export function clearRemoveMessage(clear) {
  return {
    type: types.REMOVE_STRAIN,
    payload: clear
  };
}
