import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { sendErrorToReducers } from '../../actions/actionLoginError';
import './login.css';

class Login extends Component {
  renderEmailField(field) {
    return (
    <div>
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="ion-ios-email-outline"></i>
          </div>
        </div>
        <input id="email-input" className="form-control"
          type="text"
          maxLength="62" required placeholder="Email"
          {...field.input} />
      </div>
    </div>
    );
  }

  renderPasswordField(field) {
    return (
      <div>
        <div className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="ion-ios-locked-outline"></i>
            </div>
          </div>
          <input className="form-control"
            type="password" maxLength="62" required placeholder="Password"
            {...field.input} />
        </div>
     </div>
    );
  }

  onSubmit(values) {
    requestLogin(values)
    .then(response => {
      sessionStorage.setItem('jwt', response.data.token);
      console.log(sessionStorage.getItem('jwt'));
    })
    .catch(error => {
      this.props.sendErrorToReducers(error.response.data);
    })
  }

  render() {
    const { handleSubmit } = this.props;
    var passwordAlertClass = classNames({
      'validation-close': true,
      'validation-alert': this.props.errorMessage
    });
    return(
      <div className="form-content">
        <form className="login-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field label="Email" name="email" component={this.renderEmailField} />
          <Field label="Password" name="password" component={this.renderPasswordField} />
          <div className={passwordAlertClass}><p>{this.props.errorMessage}</p></div>
          <div className="button-form">
            <button className="login-button" type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.email || values.email.length < 6) {
    errors.email = "Please enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Please enter your password";
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.loginError.message };
}

export default reduxForm({
  validate,
  form: 'LoginForm'
})(
  connect(mapStateToProps, { sendErrorToReducers })(Login)
);
