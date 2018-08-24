import React, { Component } from 'react';
import Logo from '../Logo';

export default class Footer extends Component {

  constructor(props) {
    super(props)
    this.style=props['style']
  }

  render() {
    return (
      <div
        style={Object.assign({},{
          maxWidth: '1200px',
          margin: '20px auto',
          textAlign: 'center',
          lineHeight: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }, this.style)}
      >
        <div style={{ filter: 'grayscale(100%)', opacity: 0.3 }}>
          <Logo isDark />
        </div>
        <div
          style={{
            color: '#999',
            lineHeight: 1.5,
            fontSize: 12,
            textAlign: 'right',
          }}
        >
          #!/usr/bin/python3
          <br />
          © 2018 Copyright
        </div>
      </div>
    );
  };
}

