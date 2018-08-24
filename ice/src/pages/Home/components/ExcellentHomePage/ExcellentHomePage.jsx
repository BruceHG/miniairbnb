import React, { Component } from 'react';
import { Button } from '@icedesign/base';
import './ExcellentHomePage.scss';
import { Search } from '@icedesign/base';

export default class ExcellentHomePage extends Component {
  static displayName = 'ExcellentHomePage';

  render() {
    return (
      <div className="excellent-home-page" style={{ height: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundImage: `url(${require('./images/TB1oJNKsFOWBuNjy0FiXXXFxVXa-1900-1010.svg')})`,
            backgroundPosition: 'center',
          }}
        />

        <div className="excellent-home-page-background" />
        <div className="excellent-home-page-content-wrapper">
          <div className="excellent-home-page-content">
            <h2 className="title">mini Airbnb</h2>
            <div
              className="excellent-home-page-buttons"
              style={{ textAlign: 'center', margin: 70 }}
            >
              <Search
                autoWidth
                searchText=""
                size="large"
                placeholder="Anywhere"
                onSearch={this.handleSearch}
                type="primary"
                size="large"
              />
            </div>

            <div style={{ marginTop: '80px', position: 'relative' }}>
              <div style={styles.gitContainer} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  leftButton: {
    marginRight: '20px',
  },
  gitStar: {
    border: '0px',
    height: '32px',
    width: '145px',
    margin: '0 auto',
  },
  gitContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  updateLogLinkWrap: {
    textAlign: 'center',
  },
  updateLogLink: {
    color: '#fff',
  },
};
