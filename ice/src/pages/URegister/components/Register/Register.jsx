/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Input, Button, Grid, Feedback, DatePicker } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import './Register.scss';
import * as CommonUtils from '../../../../lib/commonUtils';

const { Row, Col } = Grid;

export default class Register extends Component {
  static displayName = 'Register';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        email: '',
        passwd: '',
        rePasswd: '',
        dob: '',
      },
    };
    this.onRegisterSuccess = props.onRegisterSuccess;
  }

  onDateChange = (date, formatDate) => {
    let selectedDate = new Date(formatDate);
    var today = new Date();
    if (selectedDate >= today) {
      Feedback.toast.error('Birthday is illegal, please reset it!');
      this.setState({ value: { ...this.state.value, dob: '' } });
    }
  };

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('Please check password');
    } else if (values.length < 8) {
      callback('Length of password must greater than 8');
    } else if (values.length > 16) {
      callback('Length of password must less than 16');
    } else {
      callback();
    }
  };

  checkPasswd2 = (rule, values, callback, stateValues) => {
    if (!values) {
      callback('Please check password');
    } else if (values && values !== stateValues.passwd) {
      callback('Different password');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }

      fetch(CommonUtils.BACKEND_URL + '/login/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          'username': values['username'],
          'password': values['passwd'],
          'email': values['email'],
          'firstname': values['firstname'],
          'lastname': values['lastname'],
          'birthday': values['dob'],
        })
      }).then((response) => {
        return response.json();
      }).then((json) => {
        if (json['code'] == 200) {
          CommonUtils.saveUserInfo2Cookie(json['data']);
          CommonUtils.callCustomMemberFunc(this.onRegisterSuccess);
        } else {
          Feedback.toast.error(json['msg']);
        }
      }).catch((e) => {
        console.error(e);
        Feedback.toast.error('Opps! Unknow error happens...');
      });
    });
  };

  render() {
    return (
      <div style={styles.container} className="user-register">
        <div style={styles.formContainer}>
          <h4 style={styles.formTitle}>Register</h4>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formItems}>
              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon
                    type="person"
                    size="small"
                    style={styles.inputIcon}
                  />
                  <IceFormBinder
                    name="username"
                    required
                    message="Please check user name"
                  >
                    <Input size="large" placeholder="User name" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="username" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="mail" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    type="email"
                    name="email"
                    required
                    message="Please check E-mail"
                  >
                    <Input size="large" maxLength={20} placeholder="E-mail" />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="email" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="person" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="firstname"
                  >
                    <Input size="large" maxLength={20} placeholder="First name" />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="person" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="lastname"
                  >
                    <Input size="large" maxLength={20} placeholder="Last name" />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="clock" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="dob"
                    required
                    valueFormatter={
                      (date, formatDate) => {
                        return formatDate;
                      }
                    }>
                    <DatePicker
                      language="en-us"
                      formater={['YYYY-MM-DD']}
                      value={this.state.value.dob}
                      language={'en-us'}
                      onChange={this.onDateChange}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="passwd"
                    required
                    validator={this.checkPasswd}
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="Length of password is 8 at least"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="passwd" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col style={styles.formItemCol}>
                  <IceIcon type="lock" size="small" style={styles.inputIcon} />
                  <IceFormBinder
                    name="rePasswd"
                    required
                    validator={(rule, values, callback) =>
                      this.checkPasswd2(
                        rule,
                        values,
                        callback,
                        this.state.value
                      )
                    }
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="Confirm password"
                    />
                  </IceFormBinder>
                </Col>
                <Col>
                  <IceFormError name="rePasswd" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  style={styles.submitBtn}
                >
                  Register
                </Button>
              </Row>

              <Row style={styles.tips}>
                <a href="/" style={styles.link}>
                  Log in with existing account
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
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    paddingTop: '100px',
    background: '#f0f2f5',
    // backgroundImage: `url${require('./images/TB1kOoAqv1TBuNjy0FjXXajyXXa-600-600.png')}`,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center',
    fontSize: '33px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: 'Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif',
    fontWeight: '600',
  },
  desc: {
    margin: '10px 0',
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.45)',
  },
  logo: {
    marginRight: '10px',
    width: '48px',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '368px',
    margin: '0 auto',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
    padding: '0',
  },
  formItemCol: {
    position: 'relative',
    padding: '0',
  },
  formTitle: {
    textAlign: 'center',
    margin: '0 0 20px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 'bold',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  submitBtn: {
    fontSize: '16px',
    height: '40px',
    lineHeight: '40px',
    background: '#3080fe',
    borderRadius: '4px',
  },
  checkbox: {
    marginLeft: '5px',
  },
  tips: {
    justifyContent: 'center',
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
