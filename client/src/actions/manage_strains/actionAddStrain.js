import axios from 'axios';
import { reset } from 'redux-form';
import * as types from '../actionTypes';
import ROOT_URL from '../../config/constants';

export function addStrain(values) {
  var formData = new FormData();
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('price', values.price);
  formData.append('type', values.type);
  formData.append('strainImage', values.strainImage);
  const request = axios.post(`${ROOT_URL}/manage/strains/add`, formData, {headers: {'Content-type': 'multipart/form-data'}});

  return (dispatch) => {
    request.then(response => {
      if (response.data) {
        var imageData = { name: '', image: 'http://nahmdong.com/vitalhill/img/default.png' }
        dispatch(reset('AddStrainForm'));
        dispatch({ type: types.UPLOAD_IMAGE, payload: imageData });
        dispatch({ type: types.ADD_STRAIN, payload: response.data });
      }
    })
    .catch(error => {
      dispatch({ type: types.ADD_STRAIN_ERROR, payload: error.response.data.message });
    })
  }
}

export function clearUpload(imageData) {
  return {
    type: types.UPLOAD_IMAGE,
    payload: imageData
  };
}
