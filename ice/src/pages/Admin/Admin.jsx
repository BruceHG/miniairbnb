import React, { Component } from 'react';
import { Button, Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
import Header from '../../components/Header';
import CustomTable from './components/CustomTable';
import * as CommonUtils from '../../lib/commonUtils';

export default class Admin extends Component {
  static displayName = 'Admin';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.columns = [
      {
        title: 'User',
        key: 'User',
        render: (value, index, record) => {
          return (
            <span>
              <Img
                shape='circle'
                width={26}
                height={26}
                src={record['avatar'] ? record['avatar'] : CommonUtils.DEFAULT_AVATAR} />
              {record['username']}
            </span>
          );
        },
      },
      {
        title: 'Mobile number',
        key: 'mobile',
        dataIndex: 'phone',
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
                onClick={() => this.onAccept(record['username'])}>
                Approve
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ 'marginLeft': '5px' }}
                shape="warning"
                onClick={() => this.onDecline(record['username'])}>
                Decline
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
      || CommonUtils.UserStatus.ADMIN != current_user['status']) {
      window.location = ''
      return false;
    }
    return true;
  }

  fetchHostRequests() {
    fetch(CommonUtils.BACKEND_URL + '/hostadmin/requests/', {
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
    }).catch(() => {
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  componentDidMount() {
    this.fetchHostRequests();
  }

  onAccept(username) {
    fetch(CommonUtils.BACKEND_URL + '/hostadmin/approve/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
      body: JSON.stringify({
        'username': username,
      }),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        Feedback.toast.success(json['msg']);
        this.fetchHostRequests();
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch(() => {
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  onDecline(username) {
    fetch(CommonUtils.BACKEND_URL + '/hostadmin/decline/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
      body: JSON.stringify({
        'username': username,
      }),
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        Feedback.toast.success(json['msg']);
        this.fetchHostRequests();
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch(() => {
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  render() {
    const { dataSource } = this.state;
    if (this.checkPermission()) {
      return (
        <div className="admin-page">
          <Header
            style={{ background: CommonUtils.THEME_COLOR }}
            searchBox={false}
            onAccountStateChange={() => this.checkPermission()} />
          <CustomTable
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
