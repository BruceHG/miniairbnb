import React, { Component } from 'react';
import './Detail.scss';
import * as CommonUtils from '../../lib/commonUtils';
import axios from 'axios';
import Header from '../../components/Header';
import { Feedback, Slider, Loading, Rating, Button, DatePicker, Select, } from '@icedesign/base';
import Img from '@icedesign/img';
import ReactTextCollapse from 'react-text-collapse';
import ScrollListener from 'react-scroll-listen';
// import { withRouter } from 'react-router-dom';

const { RangePicker } = DatePicker;

// @withRouter
export default class Detail extends Component {
  static displayName = 'Detail';

  constructor(props) {
    super(props);
    this.accom_id = this.props.match.params.id;
    this.state = {
      data: null,
      availableInfo: null,
      scrollPosition: null,
      bookingInfo: {
        guest_num: null,
        check_in: null,
        check_out: null,
      },
      toDoBooking: false,
    };
  }

  componentDidMount() {
    axios.get(CommonUtils.BACKEND_URL + `/item/${this.accom_id}/`)
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.setState({ data: json['data'] });
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
    this.updateAvailableInfo();
  }

  updateAvailableInfo() {
    axios.get(CommonUtils.BACKEND_URL + `/item/${this.accom_id}/available_info/`)
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.setState({ availableInfo: json['data'] });
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

  disabledDate = (date) => {
    let enable = false;
    let thisDay = new Date(date['timestamp']);
    thisDay.setHours(0, 0, 0, 0);
    this.state.availableInfo['available_date'].some(period => {
      let begin = new Date(period['begin']);
      begin.setHours(0, 0, 0, 0);
      let end = new Date(period['end']);
      end.setHours(0, 0, 0, 0);
      if (begin <= thisDay && end >= thisDay) {
        // date in period
        if (this.state.bookingInfo.check_in) {
          let check_in = new Date(this.state.bookingInfo.check_in);
          check_in.setHours(0, 0, 0, 0);
          if (begin <= check_in && end >= check_in) {
            // check_in in period
            enable = thisDay > check_in;
          } else {
            enable = false;
          }
          return true;//break;
        } else {
          enable = true;
          return true;//break;
        }
      } else {
        enable = false;
        return false;//continue;
      }
    });
    return !enable;
  }

  onBooking = () => {
    if (!this.state.bookingInfo.check_in) {
      Feedback.toast.error('Please check the Check-in Date~');
    } else if (!this.state.bookingInfo.check_out) {
      Feedback.toast.error('Please check the Check-out Date~');
    } else if (!this.state.bookingInfo.guest_num) {
      Feedback.toast.error('Please check the Number of Guests~');
    } else {
      let currentUser = this.header.getCurrentUserOrLogin();
      if (currentUser) {
        this.gotoPreOrder();
      } else {
        this.state.toDoBooking = true;
      }
    }
  }

  gotoPreOrder() {
    this.props.history.push(`/placeorder/${btoa(unescape(encodeURIComponent(JSON.stringify({
      ...this.state.bookingInfo,
      accom_id: this.accom_id,
      title: this.state.data['title'],
      price: this.state.data['price_per_day'],
      rules: this.state.data['rules'],
      address: this.state.data['address'],
    }))))}`);
  }

  render() {
    return (
      <div className="detail-page" >
        <Header
          ref={instance => { this.header = instance }}
          {...this.props}
          style={{ position: 'relative', background: CommonUtils.THEME_COLOR }}
          onAccountStateChange={() => {
            if (this.state.toDoBooking) {
              this.state.toDoBooking = false;
              this.gotoPreOrder();
            }
          }} />
        {
          (() => {
            if (this.state.data) {
              return (
                <div>
                  <ScrollListener
                    onScroll={value => this.setState({ scrollPosition: value })}
                  />
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
                    <div className="detail-type">{CommonUtils.AccomType[this.state.data['i_type']]}</div>
                    <div className="detail-title">{this.state.data['title']}</div>
                    <div className="detail-user">
                      <Img className="detail-avatar" shape='circle' width={65} height={65} src={this.state.data['avatar'] ? this.current_user['avatar'] : CommonUtils.DEFAULT_AVATAR} />
                      <div className="detail-username">{this.state.data['username']}</div>
                    </div>
                    <div className="detail-rooms" >
                      👥 {(() => {
                        let guest_num = this.state.data['guest_num'];
                        if (guest_num > 1) {
                          var suffix = 'guests';
                        } else {
                          var suffix = 'guest';
                        }
                        return ` ${guest_num} ${suffix} `;
                      })()}
                      🏠 {(() => {
                        let bedroom_num = this.state.data['bedroom_num'];
                        if (bedroom_num > 1) {
                          var suffix = 'bedrooms';
                        } else {
                          var suffix = 'bedroom';
                        }
                        return ` ${bedroom_num} ${suffix} `;
                      })()}
                      🛏 {(() => {
                        let bed_num = this.state.data['bed_num'];
                        if (bed_num > 1) {
                          var suffix = 'beds';
                        } else {
                          var suffix = 'bed';
                        }
                        return ` ${bed_num} ${suffix} `;
                      })()}
                      🛁 {(() => {
                        let bathroom_num = this.state.data['bathroom_num'];
                        if (bathroom_num > 1) {
                          var suffix = 'bathrooms';
                        } else {
                          var suffix = 'bathroom';
                        }
                        return ` ${bathroom_num} ${suffix} `;
                      })()}
                    </div>
                    <div className="detail-description">
                      <ReactTextCollapse
                        options={{
                          collapse: false,
                          collapseText: 'More...',
                          expandText: 'Less',
                          minHeight: 70,
                          maxHeight: 700,
                          textStyle: {
                            color: 'blue',
                          }
                        }
                        }>
                        {this.state.data['desc']}
                      </ReactTextCollapse>
                      <br />
                    </div>
                    <hr />
                    <div style={{ fontSize: "20pt", fontWeight: "bold" }}>Features</div>
                    {
                      (() => {
                        let rows = [];
                        this.state.data['features'].forEach(f_id => {
                          rows.push(
                            <div>
                              <svg
                                viewBox="0 0 24 24"
                                role="presentation"
                                aria-hidden="true"
                                focusable="false"
                                style={{ "height": "1.2em", "width": "1.2em", "fill": "currentcolor", "margin-right": "8px" }}>
                                <path d={CommonUtils.BuildinFeaturesIcon[f_id]} fill-rule="evenodd" />
                              </svg>
                              {CommonUtils.BuildinFeaturesName[f_id]}
                            </div>
                          );
                        });
                        return rows;
                      })()
                    }
                    <hr />
                    <div style={{ fontFamily: 'cursive', fontSize: '13pt', fontWeight: 'bold', margin: '10px' }}>{this.state.data['address']}</div>
                    <iframe
                      className="detail-map"
                      frameBorder={0}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDoH8ScxK3bBYFT2Ccgz5xtXeAF3Vbp_WI&q=${this.state.data['latitude']},${this.state.data['longitude']}&zoom=17`}
                      allowFullScreen>
                    </iframe>
                  </div>
                  <div
                    className="detail-booking"
                    style={(() => {
                      if (this.state.scrollPosition < 480) {
                        return { top: 480 - this.state.scrollPosition };
                      } else {
                        return { top: 10 };
                      }
                    })()}
                  >
                    <span className="booking-price">${this.state.data['price_per_day']}</span> per night<br />
                    <Rating
                      defaultValue={this.state.data['rating']}
                      size="large"
                      allowHalf
                      disabled />
                    {(() => {
                      if (this.state.availableInfo) {
                        return (
                          <div>
                            <hr />
                            <div ><b>Date</b></div>
                            <RangePicker
                              style={{ margin: '5px' }}
                              size='large'
                              language='en-us'
                              formater={['YYYY-MM-DD']}
                              readOnly
                              disabledDate={this.disabledDate}
                              onChange={(date, formatDate) => {
                                this.setState({ bookingInfo: { ...this.state.bookingInfo, check_in: formatDate[0], check_out: formatDate[1] } });
                              }}
                              onStartChange={(date, formatDate) => {
                                this.setState({ bookingInfo: { ...this.state.bookingInfo, check_in: formatDate } });
                              }}
                            />
                            <div ><b>Guests</b></div>
                            <Select
                              style={{ margin: '5px' }}
                              size='large'
                              language='en-us'
                              dataSource={
                                (() => {
                                  let dataSource = [];
                                  for (let index = 1; index <= this.state.availableInfo['max_guests']; index++) {
                                    dataSource.push({ label: index == 1 ? '1 Guest' : `${index} Guests`, value: index });
                                  }
                                  return dataSource;
                                })()}
                              onChange={(value, option) => {
                                this.setState({ bookingInfo: { ...this.state.bookingInfo, guest_num: value } });
                              }}
                            />
                            <br />
                            <Button
                              style={{ margin: '5px', width: '80%' }}
                              type='primary'
                              shape='warning'
                              size='large'
                              onClick={this.onBooking}
                            >
                              <b>Book</b>
                            </Button>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              );
            } else {
              return (
                <Loading
                  className="detail-loading"
                  shape="fusion-reactor"
                  color={CommonUtils.THEME_COLOR} />
              );
            }
          })()
        }
      </div>
    );
  }
}
