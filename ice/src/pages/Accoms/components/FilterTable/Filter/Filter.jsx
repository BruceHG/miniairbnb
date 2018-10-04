import React, { Component } from 'react';
import { Input, Grid, Select, Button, DatePicker, Checkbox, Feedback } from '@icedesign/base';
import * as CommonUtils from '../../../../../lib/commonUtils';
import axios from 'axios';
// import Moment from 'moment';

// form binder 详细用法请参见官方文档
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const { Option } = Select;
const { Group: CheckboxGroup } = Checkbox;
const type_list = [
  {
    value: "0",
    label: "house"
  },
  {
    value: "1",
    label: "flat"
  },
  {
    value: "2",
    label: "apartment"
  },
  {
    value: "3",
    label: "townhouse"
  },
  {
    value: "4",
    label: "others"
  }
];
const other_list = [
  {
    value: "0",
    label: "Wi-Fi"
  },
  {
    value: "1",
    label: "Parking"
  },
  {
    value: "2",
    label: "Non-smoking"
  }
];

export default class Filter extends Component {
  static displayName = 'Filter';
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      value: {
        startTime: '',
        endTime: '',
        number_of_guest:'',
        sort:'',
        type_list : [],
        other_list : [],
      },      
    };
    // this.onChange = this.onChange.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.onCheckChange2 = this.onCheckChange2.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.checkOut = this.checkOut.bind(this);
    this.guestChange = this.guestChange.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkIn = (_, formatDate)=>{
    this.setState(
      {value:{...this.state.value, startTime: formatDate, endTime: ''}});
  }

  checkOut(_, formatDate){
    if(this.state.value.startTime == ''){
      Feedback.toast.error('please set check in time first!');
      this.setState({value:{...this.state.value, endTime: ''}});
    }else{
      var d1 = Date.parse(this.state.value.startTime);
      var d2 = Date.parse(formatDate);
      if (d1 >= d2){
        Feedback.toast.error('check out date is illegal, please reset it!');
        this.setState({value:{...this.state.value, endTime: ''}});
      }else{
        this.setState({value:{...this.state.value, endTime: formatDate}});
      }
    }
  }

  sortChange(option){
    this.setState({value:{...this.state.value, sort: option}});
  }
  guestChange(option){
    this.setState({value:{...this.state.value, number_of_guest: option}});
  }

  onCheckChange(selectedItems) {
    this.setState({ value: { ...this.state.value, type_list:selectedItems } });
  }

  onCheckChange2(selectedItems) {
    this.setState({ value: { ...this.state.value, other_list:selectedItems } });
  }

  handleSubmit = () => {
    axios.get(CommonUtils.BACKEND_URL+ '/item/search/', {
      params: {
          'keyword': this.props.keyword,
          'check_in': this.state.value['startTime'],
          'check_out':this.state.value['endTime'],
          'guest_num': this.state.value['number_of_guest'],
          'sortby': this.state.value['sort'],
          'types': this.state.value.type_list.join(),
          'features': this.state.value.other_list.join(),
      }
    }).then((response) => {
      return response.data;
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
        this.props.setFilter(this.state.value);
        this.props.setSet(this.state.data);
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });

  };

  render() {
    console.log(this.state);
    return (
      <IceFormBinderWrapper
        value={this.props.value}
        onChange={this.props.onChange}
        ref="form"
      >
        <div>
          <Row wrap>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Check in:</label>
              <IceFormBinder
                valueFormatter={(date, strValue) => {
                  return strValue;
                }}
              >
                <DatePicker name="startTime" style={styles.filterTool} 
                  language="en-us"
                  formater={['YYYY-MM-DD']}
                  resetTime={true}
                  value={this.state.value.startTime}
                  onChange={this.checkIn}
                />
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Check out:</label>
              <IceFormBinder
                valueFormatter={(date, strValue) => {
                  return strValue;
                }}
              >
                <DatePicker name="endTime" style={styles.filterTool} 
                  language="en-us"
                  formater={['YYYY-MM-DD']}
                  value={this.state.value.endTime}
                  onChange={this.checkOut}
                />
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>

            {/* row 2 */}
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Guest:</label>
              <IceFormBinder>
                <Select name="number_of_guest" 
                placeholder="select number of guest"
                style={styles.filterTool}
                value={this.state.value.number_of_guest}
                onChange={this.guestChange}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  {/* note the value for > 4......... */}
                  <Option value="5">More than 4</Option>
                </Select>
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Sort:</label>
              <IceFormBinder>
                <Select
                  name="sort"
                  placeholder="please select"
                  style={styles.filterTool}
                  value={this.state.value.sort}
                  onChange={this.sortChange}
                >
                  <Option value="price_per_day">Price</Option>
                  <Option value="distance">Distance</Option>
                  <Option value="rating">Rating</Option>
                </Select>
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>

            {/* row 3 */}
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Type:</label>
              {/* <IceFormBinder> */}
                <CheckboxGroup
                  value={this.state.value.type_list}
                  dataSource={type_list}
                  onChange={this.onCheckChange}
                />
              {/* </IceFormBinder> */}
            </Col>

            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>

 {/* next row2 */}

            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>Others:</label>
              <CheckboxGroup
                  value={this.state.value.other_list}
                  dataSource={other_list}
                  onChange={this.onCheckChange2}
                />
            </Col>

            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
            </Col>

          </Row>
          <div
            style={{
              textAlign: 'left',
              marginLeft: '12px',
            }}
          >

            <Button
              type="primary"
              onClick={this.handleSubmit}
              style={{ marginLeft: '10px' }}
            >
              Search
            </Button>
          </div>
        </div>
      </IceFormBinderWrapper>
    );
  }
}

const styles = {
  filterCol: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },

  filterTitle: {
    width: '68px',
    textAlign: 'right',
    marginRight: '12px',
    fontSize: '14px',
  },

  filterTool: {
    width: '200px',
  },
};
