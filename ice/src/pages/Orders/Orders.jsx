import React, { Component } from 'react';
import './Orders.scss';
import axios from 'axios';
import { Table, Feedback } from '@icedesign/base';
import * as CommonUtils from '../../lib/commonUtils';

export default class Orders extends Component {
  static displayName = 'Orders';

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    axios.get(CommonUtils.BACKEND_URL + '/order/orders/',
      {
        headers: {
          username: CommonUtils.getUserInfo2Cookie()['username'],
        },
      })
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.setState({
            orders: json.data,
            isLoading: false,
          });
        } else {
          this.setState({
            isLoading: false,
          });
          Feedback.toast.error(json['msg']);
        }
      }).catch((e) => {
        this.setState({
          isLoading: false,
        });
        if (e.response && e.response.data) {
          Feedback.toast.error(e.response.data['msg']);
        } else {
          console.error(e);
          Feedback.toast.error('Opps! Unknow error happens...');
        }
      });
  }

  render() {
    return (
      <div className='orders-page'>
        <Table
          dataSource={this.state.orders}
          hasBorder={false}
          isLoading={this.state.isLoading}
        >
          <Table.GroupHeader
            cell={(record) => {
              return (
                <div className='order-item-header-txt'>
                  Order No.: {record.o_id}
                </div>);
            }}
          />
          <Table.Column
            className='order-item-left'
            title='Accommodation'
            width={300}
            cell={(value, index, record) => {
              return (
                <div>
                  <img src={`${CommonUtils.BACKEND_URL}/${record.album_first}`} />
                  <span>
                    <div className='order-item-title'>
                      {record.title}
                    </div>
                    <div className='order-item-guest-num'>
                      {record.guest_num +
                        (record.guest_num > 1 ?
                          ' Guests' :
                          ' Guest')
                      }
                    </div>
                    {record.comment ?
                      <div className='order-item-comment'>
                        "{record.comment}"
                    </div> :
                      null}
                  </span>
                </div>
              );
            }}
          />
          <Table.Column
            title='Price'
            width={120}
            cell={(value, index, record) => {
              let nights = new Date(record.checkout).getDate() - new Date(record.checkin).getDate();
              return (
                <div>
                  <div className='order-item-price-total'>
                    ${record.price_per_day * nights} (GST. included)
                  </div>
                  <div className='order-item-price-detail'>
                    ${record.price_per_day} * {nights} {nights > 1 ? 'nights' : 'night'}
                  </div>
                </div>
              );
            }}
          />
          <Table.Column
            title='Status'
            width={50}
            cell={(value, index, record) => {
              return (
                <div style={{
                  fontSize: '12pt',
                  color: (() => {
                    switch (record.status) {
                      case 0:
                        return 'orange';
                      case 1:
                        return 'lime';
                      case 2:
                        return 'green';
                      case 3:
                        return 'grey';
                      default:
                        break;
                    }
                  })(),
                }}>
                  {CommonUtils.OrderStatus[record.status]}
                </div>
              );
            }}
          />
        </Table>
      </div>
    );
  }
}
