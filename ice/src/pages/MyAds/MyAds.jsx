import React, { Component } from 'react';
import OrderList from './components/OrderList';
import Header from '../../components/Header';

export default class MyAds extends Component {
  static displayName = 'MyAds';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div>
        <Header {...this.props} style={{ background: 'rgba(0, 0, 0, 0.1)' }} />
        <br/>
        <br/>
        </div>
        <div className="my-ads-page">
        <br/>
        <br/>
          <OrderList />
        </div>
      </div>
    );
  }
}
