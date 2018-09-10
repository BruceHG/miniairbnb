import React, { Component } from 'react';
import './DoneView.scss';
import { browserHistory } from 'react-router'

export default class DoneView extends Component {
  static displayName = 'DoneView';

  constructor(props) {
    super(props);
    if (!props.history) {
      console.error("Have you set '{...this.props}' from parent?");
    }
    this.state = {};
  }

  render() {
    return (
      <div className='done-view'>
        <div className='tip1'>Congratulations!!</div>
        <div className='title-area'>
          You've just submitted the order request of
          <div className='title'>{this.props['title']}</div>
          successfully.
        </div>
        <div className='order-no-area'>
          Your order number is:&nbsp;
          <span className='order-no'>{this.props['orderNo']}</span>
        </div>
        <div className='tip2'>
          This order is waiting for the <b>Host</b> to approve.<br />
          Please be patient and enjoy other
          <a
            className='gohome'
            onClick={() => {
              if (this.props.history) {
                this.props.history.replace("/");
              }
            }}>
            &nbsp;beatiful things&nbsp;
           </a>
          on our website ^_^
        </div>
      </div>
    );
  }
}
