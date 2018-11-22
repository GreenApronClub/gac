import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as loginActions from '../../actions/login/actionLogin';
import '../css/login.css';

class Login extends Component {
  onSubmit(values) {
    const { requestLogin } = this.props;
    requestLogin(values, this.props);
  }

  renderPasswordField(field) {
    return (
      <div>
        <div className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="ion-ios-locked-outline" />
            </div>
          </div>
          <input
            className="form-control"
            type="password"
            maxLength="62"
            required
            placeholder="Password"
            {...field.input}
          />
        </div>
      </div>
    );
  }

  renderEmailField(field) {
    return (
      <div>
        <div className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="ion-ios-email-outline" />
            </div>
          </div>
          <input
            id="email-input"
            className="form-control"
            type="text"
            maxLength="62"
            required
            placeholder="Email"
            {...field.input}
          />
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit, errorMessage } = this.props;
    const passwordAlertClass = classNames({
      'validation-close': true,
      'validation-alert': errorMessage,
    });
    return (
      <div className="form-content">
        <form className="login-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field label="Email" name="email" component={this.renderEmailField} />
          <Field label="Password" name="password" component={this.renderPasswordField} />
          <div className={passwordAlertClass}><p>{errorMessage}</p></div>
          <div className="button-form">
            <button className="login-button" type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const { email, password } = values;
  const errors = {};
  if (!email || email.length < 6) {
    errors.email = 'Please enter a valid email address';
  }
  if (!password) {
    errors.password = 'Please enter your password';
  }
  return errors;
};

const mapStateToProps = state => (
  {
    errorMessage: state.session.errorMessage,
    isLoggedIn: state.session.isLoggedIn,
  }
);

export default withRouter(reduxForm({
  validate,
  form: 'LoginForm',
})(connect(mapStateToProps, { requestLogin: loginActions.requestLogin })(Login)));
