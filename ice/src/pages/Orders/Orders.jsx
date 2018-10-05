import React, { Component } from 'react';
import './Orders.scss';
import axios from 'axios';
import { Table, Feedback, Button, Dialog, Rating } from '@icedesign/base';
import * as CommonUtils from '../../lib/commonUtils';
import Header from '../../components/Header';

export default class Orders extends Component {
  static displayName = 'Orders';

  constructor(props) {
    super(props);
    this.checkPermission();
    this.state = {
      isLoading: true,
      cancelDialogVisible: false,
      toCancelRecord: null,
      disableRating: false,
    };
  }

  checkPermission() {
    if (!CommonUtils.getUserInfo2Cookie()) {
      this.props.history.goBack();
      return false;
    }
    return true;
  }

  onCancelOrder(record) {
    this.setState({
      cancelDialogVisible: true,
      toCancelRecord: record,
    });
  }

  dimissDialog = () => {
    this.setState({
      cancelDialogVisible: false,
      toCancelRecord: null,
    });
  }

  cancelOrder(record) {
    axios.delete(CommonUtils.BACKEND_URL + `/order/cancel/${record.o_id}/`,
      {
        headers: {
          username: CommonUtils.getUserInfo2Cookie()['username'],
        },
      })
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.dimissDialog();
          Feedback.toast.success('Successfully cancelled order: ' + record.o_id);
          this.fetchOrders();
        } else {
          Feedback.toast.error(json['msg']);
        }
      }).catch((e) => {
        if (e.response && e.response.data) {
          Feedback.toast.error(e.response.data['msg']);
        } else {
          console.error(e);
          Feedback.toast.error('Opps! Unknow error happens...');
        }
      });
  }

  fetchOrders() {
    this.setState({
      isLoading: true,
    });
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

  componentDidMount() {
    if (this.checkPermission()) {
      this.fetchOrders();
    }
  }

  rating = (record, value) => {
    this.setState({
      disableRating: true,
    })
    console.log(record);
    axios.post(CommonUtils.BACKEND_URL + `/order/rating/${record.o_id}/`,
      {
        rating: value
      },
      {
        headers: {
          username: CommonUtils.getUserInfo2Cookie()['username'],
        },
      })
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.dimissDialog();
          Feedback.toast.success('Successfully rated order: ' + record.o_id);
          this.fetchOrders();
        } else {
          this.setState({
            disableRating: false,
          })
          Feedback.toast.error(json['msg']);
        }
      }).catch((e) => {
        this.setState({
          disableRating: false,
        })
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
      <div>
        <Header
          {...this.props}
          style={{ position: 'relative', background: CommonUtils.THEME_COLOR }}
          onAccountStateChange={() => this.checkPermission()} />
        <div className='orders-page'>
          <Table
            dataSource={this.state.orders}
            hasBorder={false}
            isLoading={this.state.isLoading}
            language='en-us'
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
              title='Accommodation'
              width={250}
              cell={(value, index, record) => {
                return (
                  <div className='order-item-left'>
                    <img src={`${CommonUtils.BACKEND_URL}/${record.album_first}`} />
                    <span>
                      <div className='order-item-title'>
                        {record.title}
                      </div>
                      <div className='order-item-dates'>
                        {record.checkin + '-' + record.checkin}
                      </div>
                      <div className='order-item-guest-num'>
                        {
                          record.guest_num +
                          (record.guest_num > 1 ?
                            ' Guests'
                            :
                            ' Guest')
                        }
                      </div>
                      {
                        record.comment ?
                          <div className='order-item-comment'>
                            "{record.comment}"
                          </div>
                          :
                          null
                      }
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
              width={70}
              cell={(value, index, record) => {
                return (
                  <div className='order-item-right'>
                    {
                      CommonUtils.OrderStatus.Rated == record.status ?
                        <div className='order-item-rated'>
                          Your rating is
                          <Rating
                            value={record.rating}
                            size='large'
                            disabled />
                        </div>
                        :
                        null
                    }
                    <div style={{
                      fontSize: '12pt',
                      color: (() => {
                        switch (record.status) {
                          case CommonUtils.OrderStatus.Pending:
                            return 'orange';
                          case CommonUtils.OrderStatus.Accepted:
                            return 'lime';
                          case CommonUtils.OrderStatus.Completed:
                          case CommonUtils.OrderStatus.Rated:
                            return 'green';
                          case CommonUtils.OrderStatus.Declined:
                            return 'grey';
                          default:
                            break;
                        }
                      })(),
                    }}>
                      {CommonUtils.getOrderDisplayStatus(record.status)}
                    </div>
                    {(() => {
                      switch (record.status) {
                        case CommonUtils.OrderStatus.Pending:
                        case CommonUtils.OrderStatus.Accepted:
                          return (
                            <Button
                              type='primary'
                              shape='warning'
                              onClick={() => this.onCancelOrder(record)}
                            >
                              <b>Cancel</b>
                            </Button>
                          );
                        case CommonUtils.OrderStatus.Completed:
                          return (
                            <div className='order-item-rating'>
                              How do you feel?
                              <Rating
                                size='large'
                                disabled={this.state.disableRating}
                                onChange={value => this.rating(record, value)} />
                            </div>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                );
              }}
            />
          </Table>
        </div>
        {this.state.toCancelRecord ?
          <Dialog
            language='en-us'
            title='Warning!'
            visible={this.state.cancelDialogVisible}
            onOk={() => this.cancelOrder(this.state.toCancelRecord)}
            closable='esc,mask,close'
            onCancel={this.dimissDialog}
            onClose={this.dimissDialog}
          >
            <div
              style={{
                fontSize: '15pt',
                color: 'green',
              }}>
              Please notice, the cancellation rule of this order is:
            </div>
            <div
              style={{
                fontSize: '30pt',
                color: 'red',
                textAlign: 'center',
                margin: '10px',
              }}>
              {CommonUtils.CancelRule[this.state.toCancelRecord.rules]}
            </div>
            <div
              style={{
                textAlign: 'center',
              }}>
              Make sure you've completely understood it.
            </div>
            <div
              style={{
                fontSize: '17pt',
                color: 'orange',
                textAlign: 'center',
                margin: '10px',
              }}>
              Then are you sure to cancel this order?
            </div>
          </Dialog>
          : null
        }
      </div>
    );
  }
}
