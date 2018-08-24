import React, { Component } from 'react';
import Register from './components/Register';

export default class URegister extends Component {
  static displayName = 'URegister';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="u-register-page">
        <Register />
      </div>
    );
  }
}
