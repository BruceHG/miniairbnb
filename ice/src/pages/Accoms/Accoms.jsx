import React, { Component } from 'react';
import FilterList from './components/FilterList';
import Header from '../../components/Header';
import { Feedback} from '@icedesign/base';
import * as CommonUtils from '../../lib/commonUtils';
import axios from 'axios';



export default class Accoms extends Component {
  static displayName = 'Accoms';

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      keyword: this.props.match.params.keyword,
    };
    
  }

  componentDidMount() {
    axios.get(CommonUtils.BACKEND_URL+ '/item/search/', {
      params: {
        'keyword':this.state.keyword,
      }
    }).then((response) => {
      return response.data;
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch((e) => {
      console.error(e);
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  render() {
    // console.log(this.state.keyword)
    // console.log(this.state.data['accommodations']);
    return (
      <div>
        <Header {...this.props} style={{ background: 'rgba(0, 0, 0, 0.1)' }} />
      <br/>
      <br/>
      <div className="accoms-page">
        <FilterList 
        {...this.props}
        keyword={this.state.keyword}
        data={this.state.data['accommodations']}
        />
      </div>
      </div>
    );
  }
}
