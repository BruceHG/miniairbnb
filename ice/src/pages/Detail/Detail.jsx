import React, { Component } from 'react';
import './Detail.scss';
import * as CommonUtils from '../../lib/commonUtils';
import Header from '../../components/Header';
import { Feedback, Slider, Loading, } from '@icedesign/base';
import Img from '@icedesign/img';

export default class Detail extends Component {
  static displayName = 'Detail';

  constructor(props) {
    super(props);
    this.detail_id = this.props.match.params.id;
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    fetch(CommonUtils.BACKEND_URL + `/item/${this.detail_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (json['code'] == 200) {
        this.setState({ data: json['data'] });
      } else {
        Feedback.toast.error(json['msg']);
      }
    }).catch(() => {
      Feedback.toast.error('Opps! Unknow error happens...');
    });
  }

  render() {
    return (
      <div className="detail-page" >
        <Header
          style={{ position: 'relative', background: CommonUtils.THEME_COLOR }}
          onAccountStateChange={() => { }} />
        {
          (() => {
            if (this.state.data) {
              return (
                <div>
                  <Slider
                    className="detail-page-slider"
                    animation
                    autoplay
                  >
                    {this.state.data['album'].map((url, index) => (
                      <div className="slider-img-wrapper" key={index}>
                        <img src={`${CommonUtils.BACKEND_URL}/${url}`} />
                      </div>
                    ))}
                  </Slider>
                  <div className="detail-page-detail">
                    <div className="detail-type">{CommonUtils.getAccomType(this.state.data['i_type'])}</div>
                    <div className="detail-title">{this.state.data['title']}</div>
                    <div className="detail-user">
                      <Img className="detail-avatar" shape='circle' width={65} height={65} src={this.state.data['avatar'] ? this.current_user['avatar'] : CommonUtils.DEFAULT_AVATAR} />
                      <div className="detail-username">{this.state.data['username']}</div>
                    </div>
                    <div className="detail-rooms" >
                      👥 {this.state.data['guest_num']} guests
                      🏠{this.state.data['bedroom_num']} bedrooms
                      🛏 {this.state.data['bed_num']} beds
                      🛁 {this.state.data['bathroom_num']} baths
                    </div>
                    <div className="detail-description" >
                      {this.state.data['desc']}
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })()
        }
      </div>
    );
  }
}
