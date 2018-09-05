import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IceContainer from '@icedesign/container';
import './BasicNotFound.scss';

export default class BasicNotFound extends Component {
  static displayName = 'BasicNotFound';

  render() {
    return (
      <div className="basic-not-found">
        <IceContainer>
          <div style={styles.exceptionContent} className="exception-content">
            <img
              src={require('./images/TB1txw7bNrI8KJjy0FpXXb5hVXa-260-260.png')}
              style={styles.image}
              className="imgException"
              alt="Page not found"
            />
            <div className="prompt">
              <h3 style={styles.title} className="title">
                Opps, page not foud
              </h3>
              <p style={styles.description} className="description">
                The page you visited is not found. Please back to <Link to="/">homepage</Link> to continue.
              </p>
            </div>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  exceptionContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#333',
  },
  description: {
    color: '#666',
  },
};
