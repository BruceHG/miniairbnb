import React, { Component } from 'react';
import Header from '../../components/Header';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import * as CommonUtils from '../../lib/commonUtils';
import axios from 'axios';

export default class Admin extends Component {
  static displayName = 'Admin';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
    };
    this.columns = [
      {
        title: 'User',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '发布时间',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                index={index}
                record={record}
                getFormValues={this.getFormValues}
              />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
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

  componentDidMount() {
    axios
      .get('/mock/tab-table.json')
      .then((response) => {
        console.log(response.data.data);
        this.setState({
          dataSource: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFormValues = (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState({
      dataSource,
    });
  };

  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].splice(index, 1);
    this.setState({
      dataSource,
    });
  };

  render() {
    const { dataSource } = this.state;
    if (this.checkPermission()) {
      return (
        <div className="admin-page">
          <Header
            style={{ background: CommonUtils.THEME_COLOR }}
            onAccountStateChange={() => this.checkPermission()} />
          <CustomTable
            dataSource={dataSource['all']}
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
