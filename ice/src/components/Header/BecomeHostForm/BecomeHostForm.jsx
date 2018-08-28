/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Input, Button, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './BecomeHostForm.scss';
import fetch from 'isomorphic-fetch';
import * as CommonUtils from '../../../lib/commonUtils';

const { Row, Col } = Grid;

export default class BecomeHostForm extends Component {
  static displayName = 'BecomeHostForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        mobile: undefined,
      },
    };
    this.onSubmitted = props.onSubmitted;
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  checkMobile = (values, callback) => {
    if (/^04\d{8}$/.test(values)) {
      callback();
    } else {
      callback('Please check password');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      fetch(CommonUtils.BACKEND_URL + '/user/becomehost/', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "username": CommonUtils.getUserInfo2Cookie()['username'],
        },
        body: JSON.stringify({
          'phone': values['mobile'],
        })
      }).then((response) => {
        return response.json();
      }).then((json) => {
        if (json['code'] == 200) {
          CommonUtils.saveUserInfo2Cookie(json['data']);
          CommonUtils.callCustomMemberFunc(this.onSubmitted);
        } else {
          Feedback.toast.error(json['msg']);
        }
      }).catch(() => {
        Feedback.toast.error('Opps! Unknow error happens...');
      });
    });
  };

  render() {
    return (
      <div className="becomehost-form" >
        <div style={styles.formContainer}>
          <h4 style={styles.formTitle}>Become Host</h4>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formItems}>
              <Row style={styles.formItem}>
                <Col>
                  <IceIcon
                    type="phone"
                    size="small"
                    style={styles.inputIcon}
                  />
                  <IceFormBinder
                    name="mobile" required message="Required"
                    validator={(rule, values, callback) =>
                      this.checkMobile(values, callback)
                    }>
                    <Input maxLength={20} placeholder="mobile phone" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="mobile" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={styles.submitBtn}
                >
                  Apply
                </Button>
              </Row>
            </div>
          </IceFormBinderWrapper>
        </div>
      </div>
    );
  }
}

const styles = {
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '30px 40px',
    background: '#fff',
    borderRadius: '6px',
    boxShadow: '1px 1px 2px #eee',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
  },
  formTitle: {
    margin: '0 0 20px',
    textAlign: 'center',
    color: '#3080fe',
    letterSpacing: '12px',
  },
  inputIcon: {
    position: 'absolute',
    left: '0px',
    top: '5px',
    color: '#999',
  },
  submitBtn: {
    width: '240px',
    background: '#3080fe',
    borderRadius: '28px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};
