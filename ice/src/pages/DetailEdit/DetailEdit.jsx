import React, { Component } from 'react';
import './DetailEdit.scss';
import * as CommonUtils from '../../lib/commonUtils';
import axios from 'axios';
import { Feedback, Grid, Input, Select, Upload, Button } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const { ImageUpload } = Upload;

const MAX_GUEST_NO = 13;
const MAX_BEDROOM_NO = 7;
const MAX_BED_NO = 7;
const MAX_BATH_NO = 7;

export default class DetailEdit extends Component {
  static displayName = 'DetailEdit';

  constructor(props) {
    super(props);
    this.state = {};
    this.accom_id = this.props.match.params.id;
    // this.accom_id = 71825;
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
          } else {
            Feedback.toast.error(json['msg']);
          }
        }).catch((e) => {
          console.error(e);
          Feedback.toast.error('Opps! Unknow error happens...');
        });
    }
  }

  formChange(value) {
    console.log(value);
  }

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors, 'values', values);
        return;
      }
      console.log('过');
    });
  }

  render() {
    return (
      <div className='detail-edit-page'>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref='form'
        >
          <div>
            <div className='title'>Title</div>
            <IceFormBinder name='title' required>
              <Input
                size='large'
                placeholder="the tile/name of your accomodation" />
            </IceFormBinder>
            <div className='title'>Type</div>
            <IceFormBinder name="type" required>
              <Select
                language='en-us'
                size='large'
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
                <IceFormBinder name="guest_num" required>
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
                <IceFormBinder name="bedroom_num" required>
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
                <IceFormBinder name="bed_num" required>
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
                <IceFormBinder name="bathroom_num" required>
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
            <div className='title'>Features</div>
            <IceFormBinder name="type" required>
              <Select
                language='en-us'
                size='large'
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
            <div className='title'>Album of your accomodation</div>
            <ImageUpload
              language='en-us'
              listType="picture-card"
              accept='image/png, image/jpg, image/jpeg'
            />
            <div className='title'>Description</div>
            <IceFormBinder name="description" required>
              <Input
                className='description'
                size='large'
                multiple
                placeholder="the description of your accomodation" />
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
      </div>
    );
  }
}
