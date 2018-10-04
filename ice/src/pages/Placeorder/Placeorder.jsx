import React, { Component } from 'react';
import './Placeorder.scss';
import { Step } from '@icedesign/base';
import ConfirmView from './components/ConfirmView';
import DoneView from './components/DoneView';

export default class Placeorder extends Component {
  static displayName = 'Placeorder';

  constructor(props) {
    super(props);
    this.data = JSON.parse(decodeURIComponent(escape(atob(this.props.match.params.data))));
    this.state = {
      currentStep: 0,
      successOrderId: null,
    };
  }

  onOrderSuccess = (orderNo) => {
    this.setState({
      currentStep: 2,
      successOrderId: orderNo,
    });
  }

  onOrderFail = (errCode) => {
    switch (errCode) {
      case 101:
      case 102:
        this.props.history.goBack();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="placeorder-page" >
        <Step
          current={this.state.currentStep}
          type='circle'
        >
          <Step.Item title='Confirm Order' />
          <Step.Item title='Submit' />
          <Step.Item title='Waiting for Host Approve' />
          <Step.Item title='Done' />
        </Step>
        {
          (() => {
            switch (this.state.currentStep) {
              case 0:
                return (
                  <ConfirmView
                    dataSource={this.data}
                    onSuccess={this.onOrderSuccess}
                    onFail={this.onOrderFail}
                  />
                );

              case 2:
                return (
                  <DoneView
                    {...this.props}
                    title={this.data['title']}
                    orderNo={this.state.successOrderId} />
                );
            }
          })()
        }
      </div>);
  }
}
