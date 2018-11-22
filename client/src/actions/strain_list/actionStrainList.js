import axios from 'axios';
import * as types from '../actionTypes';

const ROOT_URL = "http://localhost:8080";

export function fetchStrains(values) {
  const request = axios.get(`${ROOT_URL}/manage/strains`);

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        dispatch({ type: types.FETCH_STRAIN_LIST, payload: response.data });
      }
    })
    .catch(error => {
      dispatch({ type: types.FETCH_STRAIN_LIST_ERROR, payload: error.response.data.message });
    })
  }
}

export function searchStrain(values, errorMessage) {
  const request = axios.post(`${ROOT_URL}/manage/strains`, values);

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        dispatch({ type: types.FETCH_STRAIN_LIST, payload: response.data });
      }
      if (errorMessage) {
        dispatch({ type: types.FETCH_STRAIN_LIST_ERROR, payload: '' });
      }
    })
    .catch(error => {
      dispatch({ type: types.FETCH_STRAIN_LIST_ERROR, payload: error.response.data.msg });
    })
  }
}

export function clearMessage(clear) {
  return {
    type: types.FETCH_STRAIN_LIST_ERROR,
    payload: clear
  };
}
