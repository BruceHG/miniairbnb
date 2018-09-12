import React, { Component } from 'react';
import { Feedback, Button, Search, Grid, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import SingleItem from './SingleItem';
import './FilterList.scss';
import FilterForm from '../FilterTable/Filter';
import * as CommonUtils from '../../../../lib/commonUtils';
import EnhanceTable from '../EnhanceTable/EnhanceTable';

const { Row, Col } = Grid;
// the datasource should come from the database search, so chnage here
// const dataSource = [
//   {
//     title: '衬衫女雪纺上衣2017大纺上衣2017大纺上衣2017大',
//     extra: '预计佣金 ¥10',
//     price: '¥89',
//     image:
//       '//img.alicdn.com/bao/uploaded/i3/120976213/TB2O4nSnblmpuFjSZFlXXbdQXXa_!!120976213.jpg_240x240.jpg',
//   },
//   {
//     title: '衬衫女雪纺上衣2017大纺上衣2017大纺上衣2017大',
//     extra: '预计佣金 ¥10',
//     price: '¥89',
//     image:
//       '//img.alicdn.com/bao/uploaded/i4/120976213/TB2GiVsdS0mpuFjSZPiXXbssVXa_!!120976213.jpg_240x240.jpg',
//   },
// ];

export default class FilterList extends Component {
  static displayName = 'FilterList';

  constructor(props) {
    super(props);
    this.render=this.render.bind(this);
  }
  state = {
    //   selectedOption:null,
    //   selectedOption2:null,
    filterFormValue: {},
  }

  jumptoDetail() {
    console.log('submite submite submite....')
  };

  filterFormChange = (value) => {
    this.setState({
      filterFormValue: value,
    });
  };

  renderItems = () => {
    console.log(this.props.data);
    if (this.props.data) {
      return (
        <Row gutter="20" wrap style={styles.itemRow}>
          {this.props.data.map((item, index) => {
            return (
              // <Col key={index} xxs="24" s="8" l="4">
              <Col key={index} span="6" >
                <SingleItem key={index} {...item}
                  onClick={() => { console.log('button clicked'); }}
                />
              </Col>
            );
          })}
        </Row>

      );
    }
  };

  normDate(date, dateStr) {
    console.log("normDate:", date, dateStr);
    return date.getTime();
  };

  normRange(date, dateStr) {
    console.log(date, dateStr);
    return date;
  };

  searchAgain(obj) {
    console.log(".......search.....");
    if (obj['key']) {
      console.log(obj['key']);
      let url = new URL(CommonUtils.BACKEND_URL + '/item/search/');
      let params = {
        'keyword': obj['key'],
      }
      url.search = new URLSearchParams(params);
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }).then((response) => {
        return response.json();
      }).then((json) => {
        // console.log(json);
        if (json['code'] == 200) {
          this.setState({ data: json['data'] });
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
    // console.log(CommonUtils.BACKEND_URL+ '/accoms/'+this.props.keyword);
    // console.log('in filter, the data is '+this.props.data);
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
              onSearch={this.searchAgain}
            />
            {/* <Button type="primary">Search</Button> */}
          </div>

          <div className="filter-table">
            <IceContainer title="Filters">
              <FilterForm
                keyword={this.props.keyword}
                value={this.state.filterFormValue}
                onChange={this.filterFormChange}
                onSubmit={this.filterTable}
                onReset={this.resetFilter}
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
            />
          </IceContainer>
        </div>

        {/* <EnhanceTable/> */}
      </div>
    );
  }
}

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
