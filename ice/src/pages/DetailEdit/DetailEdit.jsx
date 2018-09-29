import React, { Component } from 'react';
import './DetailEdit.scss';
import * as CommonUtils from '../../lib/commonUtils';
import axios from 'axios';
import { Feedback, Grid, Input, Select, Upload, Button, Range, } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import SuccessView from './components/SuccessView';

const { Row, Col } = Grid;
const { ImageUpload } = Upload;

const MAX_GUEST_NO = 13;
const MAX_BEDROOM_NO = 7;
const MAX_BED_NO = 7;
const MAX_BATH_NO = 7;
const MAX_PRICE = 300;

const A_DAY_MS = 24 * 60 * 60 * 1000;

export default class DetailEdit extends Component {
  static displayName = 'DetailEdit';

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      success_create: false,
      success_update: false,
    };
    this.accom_id = this.props.match.params.id;
    this.all_features = {};
    this.selected_dates = [];
  }

  componentDidMount() {
    let current_user = CommonUtils.getUserInfo2Cookie();
    if (!current_user
      || CommonUtils.UserStatus.HOST != current_user['status']) {
      window.location = '#/';
    }
    if (this.accom_id) {
      axios.get(CommonUtils.BACKEND_URL + `/item/${this.accom_id}/`)
        .then((response) => {
          return response.data;
        }).then((json) => {
          if (json['code'] == 200) {
            this.setState({ data: json['data'] });
            let addrs = this.splitAddress(this.state.data.address);
            this.setState({
              data: {
                ...this.state.data,
                addr_room: addrs[0],
                addr_unit_no: addrs[1],
                addr_street: addrs[2],
                addr_region: addrs[3],
                addr_state: addrs[4],
              }
            })

            axios.get(CommonUtils.BACKEND_URL + `/item/${this.accom_id}/available_info/`)
              .then((response) => {
                return response.data;
              }).then((json) => {
                if (json['code'] == 200) {
                  this.selected_dates = this.datePairs2Enums(json['data']['available_date']);
                  this.forceUpdate();
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
    axios.get(CommonUtils.BACKEND_URL + '/item/features/')
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.all_features = json['data'];
          this.forceUpdate();
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

  splitAddress(address) {
    let array = address.split(', ')
    if (array.length <= 3) {
      return [, , , array[0], array[1]];
    } else if (array.length == 5) {
      return array;
    } else {
      return [];
    }
  }

  joinAddrs(...addrs) {
    let address = '';
    addrs.forEach(addr => {
      if (addr && addr.trim()) {
        address += addr + ', ';
      }
    });
    return address ? address.substring(0, address.length - 2) : address;
  }

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors, 'values', values);
        return;
      }
      axios.post(
        this.accom_id ?
          CommonUtils.BACKEND_URL + `/item/update_item/${this.accom_id}/` :
          CommonUtils.BACKEND_URL + '/item/create_item/',
        {
          ...this.state.data,
          avaliable: this.flatDatePairs(this.dateEnums2Pairs(this.selected_dates)).join(','),
          album: this.state.data.album ? this.state.data.album.join(',') : '',
          features: this.state.data.features ? this.state.data.features.join(',') : '',
          address: this.joinAddrs(this.state.data.addr_room, this.state.data.addr_unit_no, this.state.data.addr_street, this.state.data.addr_region, this.state.data.addr_state)
        },
        {
          headers: {
            username: CommonUtils.getUserInfo2Cookie()['username'],
          },
        }).then((response) => {
          return response.data;
        }).then((json) => {
          if (json['code'] == 200) {
            if (this.accom_id) {
              this.setState({ success_update: true });
            } else {
              this.accom_id = json.data.item_id;
              this.setState({ success_create: true });
            }
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
    });
  }

  datePairs2Enums(available_date) {
    let dates = [];
    available_date.forEach(pair => {
      let begin = new Date(pair['begin']);
      begin.setHours(0, 0, 0, 0);
      let end = new Date(pair['end']);
      end.setHours(0, 0, 0, 0);
      let intern_days = (end - begin) / A_DAY_MS - 1;
      dates.push(begin);
      for (let i = 1; i <= intern_days; i++) {
        dates.push(new Date(begin.getTime() + A_DAY_MS * i));
      }
      dates.push(end);
    });
    return dates;
  }

  getFormatDate(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d;
  }

  dateEnums2Pairs(array) {
    let pairs = [];
    let previous_date = null;
    let a_pair_begin = null;
    array.forEach(element => {
      if (!previous_date) {
        previous_date = new Date(element);
        a_pair_begin = previous_date;
      } else {
        let current_date = new Date(element);
        if (DateUtils.isSameDay(new Date(previous_date.getTime() + A_DAY_MS), current_date)) {
          previous_date = current_date;
        } else {
          pairs.push(
            {
              begin: this.getFormatDate(a_pair_begin),
              end: this.getFormatDate(previous_date),
            }
          );
          previous_date = current_date
          a_pair_begin = previous_date;
        }
      }
    });
    if (previous_date) {
      pairs.push(
        {
          begin: this.getFormatDate(a_pair_begin),
          end: this.getFormatDate(previous_date),
        }
      );
    }
    return pairs;
  }

  flatDatePairs(available_date) {
    let dates = [];
    available_date.forEach(pair => {
      dates.push(pair['begin']);
      dates.push(pair['end']);
    });
    return dates;
  }

  handleDayClick = (day, { selected }) => {
    if (selected) {
      let index = this.selected_dates.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      this.selected_dates.splice(index, 1);
    } else {
      this.selected_dates.push(day);
    }
    this.forceUpdate();
  }

  render() {
    return (
      !(this.state.success_create || this.state.success_update) ?
        <div className='detail-edit-page'>
          <IceFormBinderWrapper
            value={this.state.data}
            ref='form'
          >
            <div>
              <div className='title'>Title</div>
              <IceFormBinder name='title' required>
                <Input
                  size='large'
                  style={{ width: '50%' }}
                  placeholder='the tile/name of your accomodation'
                />
              </IceFormBinder>
              <div className='title'>Type</div>
              <IceFormBinder name='i_type' required>
                <Select
                  language='en-us'
                  size='large'
                  autoWidth={false}
                  dataSource={
                    Object.keys(CommonUtils.AccomType).map(
                      (key) => {
                        return {
                          value: key,
                          label: CommonUtils.AccomType[key],
                        }
                      }
                    )
                  }
                />
              </IceFormBinder>
              <div className='title'>Room Detail</div>
              <Row>
                <Col>
                  <div className='detail-title'>👥 Max Guests Number</div>
                  <IceFormBinder name='guest_num' required>
                    <Select
                      language='en-us'
                      size='large'
                      dataSource={
                        Array.apply(null, { length: MAX_GUEST_NO }).map(Function.call, Number).map(
                          (i) => {
                            let num = i + 1;
                            return {
                              value: num,
                              label: num + (num > 1 ? ' guests' : ' guest'),
                            }
                          }
                        )
                      }
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <div className='detail-title'>🏠 Bedrooms Number</div>
                  <IceFormBinder name='bedroom_num' required>
                    <Select
                      language='en-us'
                      size='large'
                      dataSource={
                        Array.apply(null, { length: MAX_BEDROOM_NO }).map(Function.call, Number).map(
                          (i) => {
                            let num = i + 1;
                            return {
                              value: num,
                              label: num + (num > 1 ? ' rooms' : ' room'),
                            }
                          }
                        )
                      }
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <div className='detail-title'>🛏 Beds Number</div>
                  <IceFormBinder name='bed_num' required>
                    <Select
                      language='en-us'
                      size='large'
                      dataSource={
                        Array.apply(null, { length: MAX_BED_NO }).map(Function.call, Number).map(
                          (i) => {
                            let num = i + 1;
                            return {
                              value: num,
                              label: num + (num > 1 ? ' beds' : ' bed'),
                            }
                          }
                        )
                      }
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <div className='detail-title'>🛁 Bathrooms Number</div>
                  <IceFormBinder name='bathroom_num' required>
                    <Select
                      language='en-us'
                      size='large'
                      dataSource={
                        Array.apply(null, { length: MAX_BATH_NO }).map(Function.call, Number).map(
                          (i) => {
                            let num = i + 1;
                            return {
                              value: num,
                              label: num + (num > 1 ? ' baths' : ' bath'),
                            }
                          }
                        )
                      }
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <div className='title'>Address</div>
              <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col className='address-title' fixedSpan={4}>
                  Room
              </Col>
                <Col>
                  <IceFormBinder name='addr_room' required>
                    <Input
                      size='large'
                      style={{ width: '70%' }}
                      placeholder='E.g. Room 1 or the master room'
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col className='address-title' fixedSpan={4}>
                  Unit No.
              </Col>
                <Col>
                  <IceFormBinder name='addr_unit_no' required>
                    <Input
                      size='large'
                      trim
                      style={{ width: '70%' }}
                      placeholder='E.g. 001'
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col className='address-title' fixedSpan={4}>
                  Street
              </Col>
                <Col>
                  <IceFormBinder name='addr_street' required>
                    <Input
                      size='large'
                      style={{ width: '70%' }}
                      placeholder='E.g. High Street'
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col className='address-title' fixedSpan={4}>
                  Region
              </Col>
                <Col>
                  <IceFormBinder name='addr_region' required>
                    <Input
                      size='large'
                      trim
                      style={{ width: '70%' }}
                      placeholder='E.g. Kensington'
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Col className='address-title' fixedSpan={4}>
                  State
              </Col>
                <Col>
                  <IceFormBinder name='addr_state' required>
                    <Input
                      size='large'
                      trim
                      style={{ width: '70%' }}
                      placeholder='E.g. NSW'
                    />
                  </IceFormBinder>
                </Col>
              </Row>
              <div className='title'>Cancellation Rules</div>
              <IceFormBinder name='rules' required>
                <Select
                  language='en-us'
                  size='large'
                  autoWidth={false}
                  dataSource={
                    Object.keys(CommonUtils.CancelRule).map(
                      (key) => {
                        return {
                          value: key,
                          label: CommonUtils.CancelRule[key],
                        }
                      }
                    )
                  }
                />
              </IceFormBinder>
              <div className='title'>Features</div>
              <IceFormBinder name='features'>
                <Select
                  language='en-us'
                  size='large'
                  autoWidth={false}
                  multiple
                  dataSource={
                    Object.keys(this.all_features).map(
                      (key) => {
                        return {
                          value: key,
                          label: this.all_features[key],
                        }
                      }
                    )
                  }
                />
              </IceFormBinder>
              <div className='title'>Price</div>
              <IceFormBinder name='price_per_day' type='number'>
                <Range
                  className='price-range'
                  min={0}
                  max={MAX_PRICE}
                  step={5}
                  marks={{ 0: '$0', [MAX_PRICE]: '$' + MAX_PRICE }}
                  tipFormatter={(value) => {
                    return '$ ' + value;
                  }}
                  onChange={(value) => this.setState({ data: { ...this.state.data, 'price_per_day': value } })}
                />
              </IceFormBinder>
              <div className='price-label'>
                <span className='price-value'>${this.state.data['price_per_day']}</span> per night (GST. included)
            </div>
              <div className='title'>Available Date</div>
              <DayPicker
                numberOfMonths={2}
                onDayClick={this.handleDayClick}
                canChangeMonth={false}
                modifiers={{ Sunday: { daysOfWeek: [0] } }}
                modifiersStyles={
                  {
                    Sunday: {
                      color: '#FF0000',
                    },
                    today: {
                      color: '#FFFFFF',
                      backgroundColor: '#0EB01C',
                    }
                  }}
                selectedDays={this.selected_dates}
              />
              <div className='title'>Album of your accomodation</div>
              <ImageUpload
                language='en-us'
                action={CommonUtils.BACKEND_URL + '/item/upload_image/'}
                listType='picture-card'
                name='image'
                headers={{ username: CommonUtils.getUserInfo2Cookie()['username'] }}
                accept='image/png, image/jpg, image/jpeg'
                formatter={(res) => {
                  if (res.code == 200) {
                    return {
                      code: 0,
                      imgURL: `${CommonUtils.BACKEND_URL}/${res.data.url}`,
                    };
                  } else {
                    return {
                      code: 1,
                    };
                  }
                }}
                fileList={
                  this.state.data['album'] ?
                    this.state.data['album'].map((url) => {
                      return {
                        status: 'done',
                        imgURL: `${CommonUtils.BACKEND_URL}/${url}`,
                      };
                    }) : []}
                onSuccess={(info) => {
                  let url_suffix = info.imgURL.substring(CommonUtils.BACKEND_URL.length + 1);
                  if (!this.state.data['album']) {
                    this.state.data['album'] = [];
                  }
                  this.state.data['album'].push(url_suffix);
                }}
                onRemove={(info) => {
                  if (info.imgURL) {
                    let url_suffix = info.imgURL.substring(CommonUtils.BACKEND_URL.length + 1);
                    let index = this.state.data['album'].findIndex(image =>
                      url_suffix === image
                    );
                    this.state.data['album'].splice(index, 1);
                  }
                }}
              />
              <div className='title'>Description</div>
              <IceFormBinder name='desc' required>
                <Input
                  size='large'
                  rows={25}
                  style={{ width: '100%' }}
                  multiple
                  placeholder='the description of your accomodation'
                />
              </IceFormBinder>
            </div>
          </IceFormBinderWrapper>
          <Button
            type='primary'
            size='large'
            onClick={this.handleSubmit}
          >
            Save
        </Button>
        </div> :
        <SuccessView
          {...this.props}
          accom_id={this.accom_id}
          success_create={this.state.success_create}
          success_update={this.state.success_update}
        />
    );
  }
}
