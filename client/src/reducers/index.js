import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import SignupReducer from './signup/reducerSignup';
import SessionReducer from './login/session';
import StrainsReducer from './strains/reducerStrains';
import StrainReducer from './strains/reducerStrain';
import AddStrainReducer from './manage_strains/reducerAddStrain';
import EditStrainReducer from './manage_strains/reducerEditStrain';
import EditStrainPreviewReducer from './strains/reducerStrainPreview';
import RemoveStrainReducer from './manage_strains/reducerRemoveStrain';
import NavigationReducer from './navigation/reducer_navigation';
import ImageUploadReducer from './upload/reducerImageUpload';

const rootReducer = combineReducers({
  session: SessionReducer,
  route: NavigationReducer,
  strainList: StrainsReducer,
  specificStrain: StrainReducer,
  signup: SignupReducer,
  addStrain: AddStrainReducer,
  editStrain: EditStrainReducer,
  editStrainPreview: EditStrainPreviewReducer,
  removeStrain: RemoveStrainReducer,
  imageData: ImageUploadReducer,
  form: formReducer,
});

export default rootReducer;
