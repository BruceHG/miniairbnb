import React, { Component } from 'react';
import { Feedback, Button, Search, Grid, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import SingleItem from './SingleItem';
import './FilterList.scss';
import FilterForm from '../FilterTable/Filter';
import * as CommonUtils from '../../../../lib/commonUtils';
import axios from 'axios';
import EnhanceTable from '../EnhanceTable/EnhanceTable';

const { Row, Col } = Grid;

export default class FilterList extends Component {
  static displayName = 'FilterList';

  constructor(props) {
    super(props);
    this.render=this.render.bind(this);
    this.state = {
 
      my_keyword:this.props.keyword,
      page_index: 0,
      data:{},
      filterFormValue: {},
      filter_info:{
        startTime: '',
        endTime: '',
        number_of_guest:'',
        sort:'',
        type_list : [],
        other_list : [],
      }
    };
    this.searchAgain = this.searchAgain.bind(this);
    this.newPageRequest = this.newPageRequest.bind(this);
  }
  

  setFilter(new_request_data){
    this.setState({
      filter_info: new_request_data,
      page_index: 0,
    });
  };

  filterFormChange = (value) => {
    this.setState({
      filterFormValue: value,
    });
  };

  newPageRequest(page_clicked, _){
    var new_index = page_clicked - 1;
    axios.get(CommonUtils.BACKEND_URL+ '/item/search/', {
      params: {
          'keyword': this.props.keyword,
          'page': new_index,
          'check_in': this.state.filter_info['startTime'],
          'check_out':this.state.filter_info['endTime'],
          'guest_num': this.state.filter_info['number_of_guest'],
          'sortby': this.state.filter_info['sort'],
          'types': this.state.filter_info.type_list.join(),
          'features': this.state.filter_info.other_list.join(),
      }
    }).then((response) => {
      return response.data;
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
        this.props.setSet(this.state.data);
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
    this.setState({
      page_index: new_index,
    });
  };

  renderItems = () => {
    if (this.props.data) {
      return (
        <Row gutter="20" wrap style={styles.itemRow}>
          {this.props.data.map((item, index) => {
            return (
              // <Col key={index} xxs="24" s="8" l="4">
              <Col key={index} span="6" >
                <SingleItem key={index} {...item}
                  onClick={() => {
                    if (this.props.history) {
                      this.props.history.push(`/detail/${item.i_id}`);
                    }
                   }}
                />
              </Col>
            );
          })}
        </Row>

      );
    }
  };

  normDate(date, dateStr) {
    return date.getTime();
  };

  normRange(date, dateStr) {
    return date;
  };

  searchAgain(obj) {
    if (obj['key']) {
      axios.get(CommonUtils.BACKEND_URL+ '/item/search/', {
        params: {
          'keyword':obj['key'],
        }
      }).then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.setState({ data: json['data'] });
          this.props.setSet(this.state.data);
        } else {
          Feedback.toast.error(json['msg']);
        }
       }).catch((e) => {
        console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
    } else {
      Feedback.toast.error('Please input new destination');
    };
  };

  render() {
    const cardStyle = {
      display: 'flex',
      margin: '20px',
    };

    return (
      <div className="filter-list">
        <br />
        <IceContainer
          style={{ ...styles.filterListHeaderWrapper, ...cardStyle }}
        >
          <div style={styles.searchWrapper}>

            <Search
              placeholder={this.props.keyword}
              inputWidth={120}
              searchText=""
              style={styles.searchInput}
              onChange={this.searchInput}
              onSearch={this.searchAgain}
            />
          </div>

          <div className="filter-table">
            <IceContainer title="Filters">
              <FilterForm
                keyword={this.props.keyword}
                value={this.state.filterFormValue}
                onChange={this.filterFormChange}
                onSubmit={this.filterTable}
                onReset={this.resetFilter}
                setFilter={this.setFilter.bind(this)}
                {...this.props}
              />
            </IceContainer>
          </div>

        </IceContainer>

        <IceContainer style={{ ...styles.searchResultWrapper, ...cardStyle }}>
          {this.renderItems()}
        </IceContainer>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IceContainer style={{ ...styles.searchResultWrapper, ...cardStyle }}>
            <Pagination
              language='en-us'
              total={this.props.total_page * 16 }
              pageSize={16}
              defaultCurrent={this.state.page_index }
              onChange={this.newPageRequest}
            />
          </IceContainer>
        </div>

        {/* <EnhanceTable/> */}
      </div>
    );
  }
};

const styles = {
  selectItem: {
    padding: '0 16px',
    borderRight: '1px solid #ddd',
    cursor: 'pointer',
  },
  selectBtn: {
    marginRight: '10px',
    marginBottom: '10px',
  },
  itemRow: {
    // margin: '10px 0',

    margin: '0 10px 10px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterListHeaderWrapper: {
    padding: '20px 20px 5px 20px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 0 15px 0',
  },
  searchInput: {
    marginRight: '15px',
  },
  filterCategories: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 0 15px 0',
  },
  searchResultWrapper: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: '20px 0',
  },
  filterCategory: {
    width: '100%',
  },
};
