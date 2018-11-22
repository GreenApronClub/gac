import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { editStrain } from '../../../actions/manage_strains/actionEditStrain';
import { selectedImage } from '../../../actions/upload/actionImageUpload';
import { clearUpload } from '../../../actions/manage_strains/actionAddStrain';
import { connect } from 'react-redux';
import { fetchStrain } from '../../../actions/strain/actionStrain';
import './editStrain.css';

class EditStrain extends Component {
  componentDidMount() {
    var params = this.props.match.params.strainId;
    const upload = true;
    this.props.fetchStrain(params, upload);
  }
  componentWillUnmount() {
    var imageData = { name: '', image: 'http://nahmdong.com/vitalhill/img/default.png' }
    this.props.clearUpload(imageData);
  }

  renderDescriptionField(field) {
    return (
    <div>
      <div className="input-group">
        <textarea className="form-control edit-description"
          type="text"
          rows="7"
          cols="6"
          { ...field.input }>
        </textarea>
      </div>
    </div>
    );
  }
  renderTypeField(field) {
    return (
    <div>
      <select className="strain-type"
      { ...field.input } >
        <option>Sativa</option>
        <option>Indica</option>
        <option>Hybrid</option>
        <option>N/A</option>
      </select>
    </div>
    );
  }
  renderStrainField(field) {
    return (
    <div className="input-group strain-field">
      <input className="form-control"
        type="text"
        maxLength="62"
        { ...field.input } />
    </div>
    );
  }
  renderPriceField(field) {
    return (
    <div className="centered">
    $
        <input className="price-input form-control"
          type="number"
          { ...field.input } />
        <span>/ gram</span>
        <i className="ion-edit edit-icons price-edit-icon"></i>
    </div>
    );
  }
  renderFileField(field) {
    return (
    <div className="custom-file">
      <input className="custon-file-input"
        id="customFile"
        name={field.name}
        onChange={(image) => {
          var files = image.target.files;
          if (!files[0])
            return;
          field.input.onChange(files[0]);
          var reader = new FileReader();
          reader.onload = (image) => {
            var imageData = { name: files[0].name, image: image.target.result }
            this.props.selectedImage(imageData);
          };
          reader.readAsDataURL(files[0]);
        }}
        type="file" />
      <label className="custom-file-label" htmlFor="customFile">Upload an image...</label>
    </div>
    );
  }

  onSubmit(values) {
    var params = this.props.match.params.strainId;
    var history = this.props.history;
    this.props.editStrain(params, history, values);
  }

  render() {
    const { handleSubmit } = this.props;
    const params = this.props.match.params.strainId;
    const previousRoute = "/manage-strain/" + params;
    return(
      <div className="edit-strain">
        <div className="container edit-box">
          <div className="row no-gutters">
            <div className="col-md-5 m-4">
              <div className="more-details">
                <h4>Description: <i className="ion-edit edit-icons"></i></h4>
                <Field label="Description" name="description" component={this.renderDescriptionField} />
                <h4 className="edit-type">Type: <i className="ion-edit edit-icons"></i></h4>
                <Field label="Type" name="type" component={this.renderTypeField} />
              </div>
            </div>
            <div className="col-md-5 m-4">
              <form className="edit-strain-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <div className="detail-box">
                  <div className="title">
                    <div className="centered">
                      <Field label="Name" name="name" component={this.renderStrainField} />
                      <i className="ion-edit edit-icons"></i>
                    </div>
                  </div>
                  <p className="accepted-formats">Please use jpeg/png formats only</p>
                  <div className="image-box">
                    <img src={this.props.imageSource} alt="" />
                    <Field label="Image" name="strainImage" component={this.renderFileField.bind(this)} />
                  </div>
                  <div className="price">
                    <Field label="Price" name="price" component={this.renderPriceField} />
                  </div>
                  <div className="action-button">
                    <button className="edit-button save-button" type="submit">Save changes</button>
                  </div>
                  <div className="action-button">
                    <Link to={previousRoute}>
                      <button className="edit-button cancel-button">Cancel</button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    success: state.editStrain.success,
    initialValues: state.editStrainPreview.strainData,
    imageSource: state.imageData.imageSrc,
  }
}

EditStrain = withRouter(reduxForm({
  form: 'EditStrainForm',
})(EditStrain));

EditStrain = connect(mapStateToProps, {
  editStrain,
  fetchStrain,
  selectedImage,
  clearUpload })(EditStrain);

export default EditStrain;
