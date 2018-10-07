import React, { Component } from 'react';
import { Button, Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
import Header from '../../components/Header';
import RequestsTable from './components/RequestsTable';
import * as CommonUtils from '../../lib/commonUtils';

export default class Requests extends Component {
  static displayName = 'Requests';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.columns = [
      {
        title: 'house',
        key: 'house',
        render: (value, index, record) => {
          return (
            <span>
              <Img
                shape='circle'
                width={26}
                height={26}
                src={record['album_first']} />
              {record['title']}
            </span>
          );
        },
      },
      {
        title: 'customer name',
        key: 'customer name',
        render: (value, index, record) => {
          return (
            <span>
              {record['user']}
            </span>
          );
        },
      },
      {
        title: 'guest number',
        key: 'guest number',
        render: (value, index, record) => {
          return (
            <span>
              {record['guest_num']}
            </span>
          );
        },
      },
      {
        title: 'check in date',
        key: 'check in date',
        render: (value, index, record) => {
          return (
            <span>
              {record['checkin']}
            </span>
          );
        },
      },
      {
        title: 'check out date',
        key: 'check out date',
        render: (value, index, record) => {
          return (
            <span>
              {record['checkout']}
            </span>
          );
        },
      },
      {
        title: 'comments',
        key: 'comments',
        render: (value, index, record) => {
          return (
            <span>
              {record['comment']}
            </span>
          );
        },
      },
      {
        title: 'Option',
        key: 'option',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                size="small"
                type="primary"
                style={{ 'marginRight': '5px' }}
                onClick={() => this.onAccept(record)}>
                Approve
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ 'marginLeft': '5px' }}
                shape="warning"
                onClick={() => this.onDecline(record)}>
                Reject
              </Button>
            </span>
          );
        },
      },
    ];
  }

  checkPermission() {
    let current_user = CommonUtils.getUserInfo2Cookie();
    if (current_user == null
      || CommonUtils.UserStatus.HOST != current_user['status']) {
      this.props.history.goBack();
      return false;
    }
    return true;
  }

  fetchRequests() {
    fetch(CommonUtils.BACKEND_URL + '/order/requests/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ dataSource: json['data'] });
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  componentDidMount() {
    this.fetchRequests();
  }

  onAccept(record) {
    fetch(CommonUtils.BACKEND_URL + `/order/approve/${record.o_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
      // body: JSON.stringify({
      //   'username': username,
      // }),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        Feedback.toast.success(json['msg']);
        this.fetchRequests();
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  onDecline(record) {
    fetch(CommonUtils.BACKEND_URL + `/order/reject/${record.o_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
      // body: JSON.stringify({
      //   'username': username,
      // }),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        Feedback.toast.success(json['msg']);
        this.fetchRequests();
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  render() {
    const { dataSource } = this.state;
    if (this.checkPermission()) {
      return (
        <div className="requests-page">
          <Header
            style={{ background: CommonUtils.THEME_COLOR }}
            {...this.props}
            searchBox={false}
            onAccountStateChange={() => this.checkPermission()} />
          <RequestsTable
            dataSource={dataSource}
            columns={this.columns}
            hasBorder={false}
            style={{
              position: 'absolute',
              left: 0,
              top: 100
            }}
          />
        </div>
      );
    }
  }
}
