import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import '../css/signup.css';

class SignUp extends Component {
  renderFirstnameField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" required placeholder="Firstname"
        {...field.input} />
    );
  }
  renderLastnameField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" required placeholder="Lastname"
        {...field.input} />
    );
  }
  renderEmailField(field) {
    return (
      <input className="form-control"
        type="text" size="64" maxLength="64" required placeholder="Email"
        {...field.input} />
    );
  }
  renderPasswordField(field) {
    return (
      <input className="form-control"
        type="password" maxLength="62" required placeholder="Password"
        {...field.input} />
    );
  }
  renderAddressField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" placeholder="Address"
        {...field.input} />
    );
  }
  renderAddress2Field(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" placeholder="Address 2"
        {...field.input} />
    );
  }
  renderPhonenumberField(field) {
    return (
      <input className="form-control"
        type="number" maxLength="62" placeholder="Phone number"
        {...field.input} />
    );
  }
  renderCountryField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" placeholder="Country"
        {...field.input} />
    );
  }
  renderCityField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62"  placeholder="City"
        {...field.input} />
    );
  }
  renderZipcodeField(field) {
    return (
      <input className="form-control"
        type="text" maxLength="62" placeholder="Zip code"
        {...field.input} />
    );
  }

  render() {
    return(
      <div className="form-container">
        <form className="signup-form">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div variant="info">
                  <div className="left"></div>
                </div>
              </div>
            </div>
          </div>
            <div className="container alert-box">
            <div className="row">
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-person-outline"></i>
                    </div>
                  </div>
                  <Field name="firstname" component={this.renderFirstnameField} />
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-person-outline"></i>
                    </div>
                  </div>
                  <Field name="lastname" component={this.renderLastnameField} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-email-outline"></i>
                    </div>
                  </div>
                  <Field name="email" component={this.renderEmailField} />
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-locked-outline"></i>
                    </div>
                  </div>
                  <Field name="password" component={this.renderPasswordField} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-home-outline"></i>
                    </div>
                  </div>
                  <Field name="address" component={this.renderAddressField} />
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-ios-home-outline"></i>
                    </div>
                  </div>
                  <Field name="address 2" component={this.renderAddress2Field} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      #
                    </div>
                  </div>
                  <Field name="Phonenumber" component={this.renderPhonenumberField} />
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-map"></i>
                    </div>
                  </div>
                  <Field name="Country" component={this.renderCountryField} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-map"></i>
                    </div>
                  </div>
                  <Field name="City" component={this.renderCityField} />
                </div>
              </div>
              <div className="col-md-6 form-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="ion-map"></i>
                    </div>
                  </div>
                  <Field name="Zipcode" component={this.renderZipcodeField} />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4 ml-5">
                <div className="input-group">
                  <div className="form-check">
                    <label className="form-check-label age-verification" htmlFor="age-checkbox">
                    <input id="age-checkbox" className="form-check-input" type="checkbox" value="" />
                      I am 21 years of age or older
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="button-form">
              <button className="signup-button" type="submit">Signup</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if(!values.email || values.email.length < 3) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'SignUpForm'
})(SignUp);
