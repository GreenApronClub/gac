import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { addStrain, clearUpload } from '../../../actions/manage_strains/actionAddStrain';
import * as clearAlertActions from '../../../actions/clear/clearState';
import { selectedImage } from '../../../actions/upload/actionImageUpload';
import * as types from '../../../actions/actionTypes';
import './addStrain.css';

class AddStrain extends Component {
  componentWillUnmount() {
    var imageData = { name: '', image: 'http://nahmdong.com/vitalhill/img/default.png' }
    this.props.clearUpload(imageData);
  }
  renderStrainField(field) {
    return (
    <div>
      <div className="input-group">
        <input className="form-control"
          type="text"
          maxLength="62" required placeholder="Strain"
          {...field.input} />
      </div>
    </div>
    );
  }
  renderDescriptionField(field) {
    return (
    <div>
      <div className="input-group">
        <textarea className="form-control"
          type="text"
          rows="3"
          cols="6"
          required placeholder="Brief description of the strain"
          {...field.input} >
        </textarea>
      </div>
    </div>
    );
  }
  renderPriceField(field) {
    return (
    <div className="price-field">
        <input className="price-input form-control"
          type="number"
          required placeholder="Price"
          {...field.input} />
        <span>/ gram</span>
    </div>
    );
  }
  renderTypeField(field) {
    return (
    <div>
      <select className="strain-type"
      {...field.input} >
        <option>Sativa</option>
        <option>Indica</option>
        <option>Hybrid</option>
        <option>N/A</option>
      </select>
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
    this.props.addStrain(values);
  }

  render() {
    const { handleSubmit } = this.props;
    const success = {success: {}};
    var customAlert = classNames({
      'custom-alert': this.props.addSuccess.message,
      'custom-alert-close': true
    });
    return(
      <div className="container">
        <form className="new-strain-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className={customAlert}>
          <p><span><b>"{this.props.addSuccess.strain}" </b></span>{this.props.addSuccess.message}</p>
          <button type="button" className="custom-close" onClick={() => this.props.clearMessage(success, types.ADD_STRAIN)}>
            <span aria-hidden="true"><i className="ion-ios-checkmark"></i></span>
          </button>
        </div>
          <h1>New Strain</h1>
          <Field label="Strain" name="name" component={this.renderStrainField} />
          <Field label="Description" name="description" component={this.renderDescriptionField} />
          <div className="centered price-type-group">
            <Field label="Price" name="price" component={this.renderPriceField} />
            <Field label="Type" name="type" component={this.renderTypeField} />
          </div>
          <Field label="Image" name="strainImage" component={this.renderFileField.bind(this)} />
          <p className="accepted-formats">Please use jpeg/png formats only</p>
          <img className="image-preview" src={this.props.imageSource} alt="" />
          <div className="mt-3">Selected image: {this.props.imageName}</div>
          <div className="button-form">
            <button className="add-strain-button" type="submit">Add</button>
          </div>
        </form>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    addSuccess: state.addStrain.success,
    imageSource: state.imageData.imageSrc,
    imageName: state.imageData.imageName
  };
}

export default withRouter(reduxForm({
  form: 'AddStrainForm'
})(
  connect(mapStateToProps, {
    addStrain,
    selectedImage,
    clearMessage: clearAlertActions.clearMessage,
    clearUpload })(AddStrain)
));
