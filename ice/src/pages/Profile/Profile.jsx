import React, { Component } from 'react';
import './Profile.scss';
import axios from 'axios';
import * as CommonUtils from '../../lib/commonUtils';
import Header from '../../components/Header';
import { Feedback, Grid, Input, DatePicker, Button, Upload } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const { ImageUpload } = Upload;

export default class Profile extends Component {
  static displayName = 'Profile';

  constructor(props) {
    super(props);
    this.state = {
      data: {
        avatar: '',
        firstname: '',
        lastname: '',
        birthday: '',
      }
    };
  }

  componentDidMount() {
    if (this.checkPermission()) {
      this.fetchProfile();
    }
  }

  checkPermission() {
    if (!CommonUtils.getUserInfo2Cookie()) {
      this.props.history.goBack();
      return false;
    }
    return true;
  }

  fetchProfile() {
    axios.get(CommonUtils.BACKEND_URL + '/user/profile/',
      {
        headers: {
          username: CommonUtils.getUserInfo2Cookie()['username'],
        },
      })
      .then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          CommonUtils.saveUserInfo2Cookie({
            ...CommonUtils.getUserInfo2Cookie(),
            avatar: json.data.avatar,
          });
          this.setState({
            data: json.data,
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

  disabledDate = (date) => {
    let thisDay = new Date(date['timestamp']);
    let today = new Date();
    thisDay.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return thisDay >= today;
  }

  handleSubmit = () => {
    let param = {
      ...this.state.data
    }
    if (!param.avatar) {
      delete param.avatar;
    }
    axios.post(CommonUtils.BACKEND_URL + '/user/update_profile/',
      param,
      {
        headers: {
          username: CommonUtils.getUserInfo2Cookie()['username'],
        },
      }).then((response) => {
        return response.data;
      }).then((json) => {
        if (json['code'] == 200) {
          this.fetchProfile();
          Feedback.toast.success(json['msg']);
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

  render() {
    return (
      <div>
        <Header
          {...this.props}
          style={{ position: 'relative', background: CommonUtils.THEME_COLOR }}
          onAccountStateChange={() => {
            if (this.checkPermission()) {
              this.fetchProfile();
            }
          }} />
        <div className='profile-page'>
          <div className='left'>
            <IceFormBinderWrapper
              value={this.state.data}
              onChange={this.formChange}
              ref='form'
            >
              <div>
                <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='profile-title' fixedSpan={4} >Username</Col>
                  <Col>
                    <Input
                      size='large'
                      disabled
                      style={{ width: '100%' }}
                      value={this.state.data.username} />
                  </Col>
                </Row>
                <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='profile-title' fixedSpan={4} >Email</Col>
                  <Col>
                    <Input
                      size='large'
                      disabled
                      style={{ width: '100%' }}
                      value={this.state.data.email} />
                  </Col>
                </Row>
                <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='profile-title' fixedSpan={4} >Firstname</Col>
                  <Col>
                    <IceFormBinder
                      name='firstname'
                    >
                      <Input
                        size='large'
                        style={{ width: '100%' }} />
                    </IceFormBinder>
                  </Col>
                </Row>
                <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='profile-title' fixedSpan={4} >Lastname</Col>
                  <Col>
                    <IceFormBinder
                      name='lastname'
                    >
                      <Input
                        size='large'
                        style={{ width: '100%' }} />
                    </IceFormBinder>
                  </Col>
                </Row>
                <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='profile-title' fixedSpan={4} >DoB</Col>
                  <Col>
                    <IceFormBinder
                      name="birthday"
                      valueFormatter={
                        (date, formatDate) => {
                          return formatDate;
                        }
                      }>
                      <DatePicker
                        formater={['YYYY-MM-DD']}
                        language={'en-us'}
                        hasClear={false}
                        size="large"
                        disabledDate={this.disabledDate}
                        style={{ width: '100%' }} />
                    </IceFormBinder>
                  </Col>
                </Row>
                {this.state.data.phone ?
                  <div>
                    <Row align='center' style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <Col className='profile-title' fixedSpan={4} >Phone</Col>
                      <Col>
                        <Input
                          size='large'
                          disabled
                          style={{ width: '70%' }}
                          value={this.state.data.phone} />
                      </Col>
                    </Row>
                  </div>
                  :
                  null
                }
              </div>
            </IceFormBinderWrapper>
          </div>
          <div className='right'>
            <ImageUpload
              language='en-us'
              action={CommonUtils.BACKEND_URL + '/item/upload_image/'}
              listType='picture-card'
              name='image'
              style={{ float: 'right' }}
              limit={1}
              headers={{ username: CommonUtils.getUserInfo2Cookie()['username'] }}
              accept='image/png, image/jpg, image/jpeg, image/gif, image/bmp'
              formatter={(res) => {
                if (res.code == 200) {
                  return {
                    code: 0,
                    imgURL: `${CommonUtils.BACKEND_URL}/${res.data.url}`,
                  };
                } else {
                  console.error(res);
                  return {
                    code: 1,
                  };
                }
              }}
              fileList={
                this.state.data.avatar ?
                  [
                    {
                      status: 'done',
                      imgURL: `${CommonUtils.BACKEND_URL}/${this.state.data.avatar}`,
                    }
                  ]
                  :
                  []
              }
              onSuccess={(info) => {
                let url_suffix = info.imgURL.substring(CommonUtils.BACKEND_URL.length + 1);
                this.state.data.avatar = url_suffix;
              }}
              onRemove={(info) => {
                if (info.imgURL) {
                  Feedback.toast.prompt("We keep the avatar you're using");
                  this.state.data.avatar = CommonUtils.getUserInfo2Cookie()['avatar'];
                  this.forceUpdate();
                }
              }}
            />
            <Button
              type='primary'
              size='large'
              onClick={this.handleSubmit}>
              <span>Update Profile</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
