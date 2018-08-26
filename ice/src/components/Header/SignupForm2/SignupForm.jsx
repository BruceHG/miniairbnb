/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Input, Button, Checkbox, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './SignupForm.scss';
import fetch from 'isomorphic-fetch';
import { BACKEND_URL, saveUserInfo2Cookie, callCustomMemberFunc } from '../../../lib/commonUtils';

const { Row, Col } = Grid;

export default class SignupForm extends Component {
  static displayName = 'SignupForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        account: undefined,
        password: undefined,
        checkbox: false,
      },
    };
    this.onLogin = props.onLogin;
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      fetch(BACKEND_URL + '/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: values['account'],
          password: values['password']
        })
      }).then((response) => {
        return response.json();
      }).then((json) => {
        if (json['code'] == 200) {
          saveUserInfo2Cookie(json['data']['user']);
          callCustomMemberFunc(this.onLogin);
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
      <div className="signup-form" style={styles.signupForm}>
        <div style={styles.formContainer}>
          <h4 style={styles.formTitle}>Login</h4>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formItems}>
              <Row style={styles.formItem}>
                <Col>
                  <IceIcon
                    type="person"
                    size="small"
                    style={styles.inputIcon}
                  />
                  <IceFormBinder name="account" required message="Required">
                    <Input maxLength={20} placeholder="username" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="account" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder name="password">
                    <Input htmlType="password" placeholder="password" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="account" />
                </Col>
              </Row>

              {/* <Row style={styles.formItem}>
                <Col>
                  <IceFormBinder name="checkbox">
                    <Checkbox>Remember this account</Checkbox>
                  </IceFormBinder>
                </Col>
              </Row> */}

              <Row style={styles.formItem}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={styles.submitBtn}
                >
                  Login
                </Button>
              </Row>

              <Row className="tips" style={styles.tips}>
                <a href="#/register" style={styles.link}>
                  Register
                </a>
                <span style={styles.line}>|</span>
                <a href="/" style={styles.link}>
                  Forgot password
                </a>
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
  tips: {
    textAlign: 'center',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '13px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};
