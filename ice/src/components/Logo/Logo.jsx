import React, { Component } from 'react';

export default class Logo extends Component {
  render() {
    return (
      <div
        className="logo"
        style={{
          height: 32,
          color: '#f40',
          textAlign: 'left',
        }}
      >
        <a href="/" style={{ display: 'block', position: 'relative' }}>
          <img src={require('../../../public/favicon.png')}  height="35" alt="logo" />
        </a>
      </div>
    );
  }
}
