import React, { Component } from 'react';
import './ConfirmView.scss';
import { Input, Button, Feedback, } from "@icedesign/base";
import * as Common from '../../../../lib/commonUtils';

export default class ConfirmView extends Component {
  static displayName = 'ConfirmView';

  constructor(props) {
    super(props);
    this.state = {};
    this.comment = null;
  }

  onSubmit = () => {
    let params = {
      'item_id': this.props.dataSource['accom_id'],
      'check_in': this.props.dataSource['check_in'],
      'check_out': this.props.dataSource['check_out'],
      'guest_num': this.props.dataSource['guest_num'],
    };
    if (this.comment) {
      params['comment'] = this.comment;
    }
    fetch(Common.BACKEND_URL + '/order/booking/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': Common.getUserInfo2Cookie()['username'],
      },
      body: JSON.stringify(params),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        Common.callCustomMemberFunc(this.props.onSuccess, json['data']['order_id']);
      } else {
        Feedback.toast.error(json['msg']);
        Common.callCustomMemberFunc(this.props.onFail, json['code']);
      }
    }).catch(() => {
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  render() {
    return (
      <div className='confirm-view'>
        <div className='tip1'>You gonna book:</div>
        <div className='title'>{this.props.dataSource['title']}</div>
        which locates at: <span className='address'>{this.props.dataSource['address']}</span>
        {
          (() => {
            let start = this.props.dataSource['check_in'];
            let end = this.props.dataSource['check_out'];
            let startD = new Date(start);
            let endD = new Date(end);
            let nights = endD.getDate() - startD.getDate();
            let guests = this.props.dataSource['guest_num'];
            return (
              <div className='date-guest'>
                from <b> {start}</b> to <b>{end}</b>,
                as <b>{nights}</b> {nights > 1 ? 'nights' : 'night'},
                for <b>{guests}</b> {guests > 1 ? 'guests' : 'guest'}
              </div>
            );
          })()
        }
        <div className='price-area'>
          Total price is <span className='price'>${this.props.dataSource['price']}</span>
        </div>
        <div>Please notice, this accommodation is: <span className='rules'>{Common.CancelRule[this.props.dataSource['rules']]}</span></div>
        <div className='tip3'>Also, you can leave some message here to the host to have a better experience:</div>
        <Input
          className='comment'
          multiple
          trim
          placeholder='Say Hi'
          onChange={(value, e) => {
            this.comment = value;
          }}
        />
        <br />
        <Button
          className='button'
          type='primary'
          onClick={this.onSubmit}
          size='large'>
          Place Order
        </Button>
      </div>
    );
  }
}
