import React, { Component } from 'react';
import axios from 'axios';
import { Table,Button,Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import * as CommonUtils from '../../../../lib/commonUtils';


export default class OrderList extends Component {
  static displayName = 'OrderList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.render=this.render.bind(this);
    this.current_user = null;
    this.state = {
      data: {},
      tableData: [],
    };
  }

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    fetch(CommonUtils.BACKEND_URL + '/user/ads/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
        this.setState({ tableData: this.state.data['accommodations']});
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  };

  getTableData_AfterDelet = (id) => {
    fetch(CommonUtils.BACKEND_URL + `/user/ad_delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'username': CommonUtils.getUserInfo2Cookie()['username'],
      },
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
        this.setState({ tableData: this.state.data['accommodations']});
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  };
    
  checkcookie=()=>{
    this.current_user = CommonUtils.getUserInfo2Cookie();
    if(this.current_user == null){
      Feedback.toast.error('Sorry,cookie is empty, please login again ');
      return(
        window.location = '#/');
    };
  }
  /**
   * For the firstr colunm info render
   */
  renderOrderInfo = (description) => {
    // console.log(description[0]);
    return (
      <div className="order-info" style={styles.orderInfo}>
        <img src={CommonUtils.BACKEND_URL+'/'+description[0].album_first} style={styles.orderImg} alt="头像" />
        <div className="order-description" style={styles.orderDescription}>
          {description[0].address}
        </div>
        <div>
          Price Per Day: ${description[0].price_per_day}
        </div>
      </div>
    );
  };

  /**
   * Delete operation
   */
  renderDelete = (id) => {
    return (
    <Button
      type="primary"
      shape="warning"
      onClick={()=>{
        if(!CommonUtils.getUserInfo2Cookie()){
          Feedback.toast.error('Sorry,cookie is empty, please login again ');
          return(window.location = '#/');
        }
        this.getTableData_AfterDelet(id);

      }}
    >Delete</Button>
    );
  };

  /**
   * render the title
   */
  renderOrderNumber = (record) => {
    return <div>{record.description[0].title}</div>;
  };

  /**
   * set row name
   */
  getRowClassName = (record) => {
    if (record.status === 0) {
      return 'highlight-row';
    }
  };

  /**
   * For edit event
   */
  renderEdit = (id) => {
    return (
      // <a href="/" style={styles.orderDetailLink}>
      //   Edit
      // </a>
      <Button
        type="primary"
        onClick={() => {
          if (this.props.history) {
            this.props.history.push(`/edit/${id}`);
          }
        }}
        >
        Edit
        </Button>
    );
  };

  /**
   *row render, it may be useless?...
   */
  handleRowSelection = (selectedRowKeys, records) => {
    console.log('selectedRowKeys:', selectedRowKeys);
    console.log('records:', records);
  };

  render() {
    this.checkcookie();

    const rowSelection = {
      onChange: this.handleRowSelection,
      mode: 'single',
    };
    const { tableData } = this.state;

    return (
      <div className="order-list" style={styles.orderList}>
        <IceContainer title="MyAds List" >
          <Table
            dataSource={tableData}
            getRowClassName={this.getRowClassName}
            rowSelection={rowSelection}
            hasBorder={false}
            language='en-us'
          >
            <Table.GroupHeader cell={this.renderOrderNumber} />
            <Table.Column
              cell={this.renderOrderInfo}
              title="Posted Accommdation Resources"
              dataIndex="description"
              width={400}
            />
            <Table.Column
              cell={this.renderDelete}
              title="Operation"
              dataIndex="i_id"
              width={100}
            />
            <Table.Column
              cell={this.renderEdit}
              dataIndex="i_id"
              title="Operation"
              width={100}
            />
          </Table>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  
  orderImg: {
    width: '60px',
    height: '60px',
    float: 'left',
    marginRight: '10px',
  },
  orderDetailLink: {
    textDecoration: 'none',
  },
};
