import axios from 'axios';
import * as types from '../actionTypes';

const ROOT_URL = "http://localhost:8080";

export function fetchStrain(params, upload) {
  const request = axios.get(`${ROOT_URL}/manage/strains/` + params, { headers: { 'Authorization': sessionStorage.getItem('jwt')}});

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        dispatch({ type: types.FETCH_STRAIN, payload: response.data });
        if (upload)
          dispatch({ type: types.UPLOAD_IMAGE, payload: response.data });
      }
    })
    .catch(error => {
      dispatch({ type: types.FETCH_STRAIN_ERROR, payload: error.response.data.message });
    })
  }
}
