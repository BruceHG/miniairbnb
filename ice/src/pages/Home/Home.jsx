import React, { Component } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ExcellentHomePage from './components/ExcellentHomePage';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home-page" style={styles.homepage}>
        <Header style={{ background: 'rgba(0, 0, 0, 0.1)' }} searchBox={false} />
        <ExcellentHomePage />
        <Footer style={{ position: 'absolute', right: 0, bottom: 0 }} />
      </div>
    );
  }
}

const styles = {
  homepage: {
    background: '#fff',
    overflow: 'hidden',
  }
};
