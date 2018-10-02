import React, { Component } from 'react';
import { Feedback} from '@icedesign/base';

import OrderList from './components/OrderList';
import Header from '../../components/Header';
import * as CommonUtils from '../../lib/commonUtils';


export default class MyAds extends Component {
  static displayName = 'MyAds';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.current_user = null;

  }

  render() {
    this.current_user = CommonUtils.getUserInfo2Cookie();
    if(this.current_user == null){
      Feedback.toast.error('Sorry,cookie is empty, please login again ');
      return(
        window.location = '#/');
    };

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
          <OrderList 
          {...this.props}
          cookie={this.current_user}/>
        </div>
      </div>
    );
  }
}
