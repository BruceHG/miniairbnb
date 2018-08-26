import React, { Component } from 'react';
import Register from './components/Register';

export default class URegister extends Component {
  static displayName = 'URegister';

  render() {
    return (
      <div className="u-register-page">
        <Register onRegisterSuccess={() => {
          this.props.history.goBack();
        }} />
      </div>
    );
  }
}
