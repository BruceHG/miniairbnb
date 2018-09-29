import React, { Component } from 'react';
import { Input, Balloon, Icon, Feedback } from '@icedesign/base';
import Menu from '@icedesign/menu';
import Logo from '../Logo';
import './Header.scss';
import { Dialog } from '@icedesign/base';
import SignupForm from './SignupForm2';
import BecomeHostForm from './BecomeHostForm';
import * as CommonUtils from '../../lib/commonUtils';
import Img from '@icedesign/img';

var MENU = {
  'BECOME_HOST': 0,
  'HOST_PENDING': 1,
  'MANAGE_ADS': 2,
  'REQUESTS': 3,
  'ORDER_HISTORY': 4,
  'PUBLISH_AD': 5,
  'PROFILE': 6,
  'LOGOUT': 7,
  'LOGIN': 8,
};
Object.freeze(MENU);

export default class Header extends Component {

  constructor(props) {
    super(props);
    if (!props.history) {
      console.error("Have you set '{...this.props}' from parent?");
    }
    this.state = {
      search_box_visible: props['searchBox'] != undefined ? props['searchBox'] : true,
      login_dialog_visible: false,
      menu_balloon_visible: false,
      become_host_dialog_visible: false,
    }
    this.current_user = null;
  }

  getCurrentUserOrLogin() {
    if (this.current_user) {
      return this.current_user;
    } else {
      this.setState({
        login_dialog_visible: true
      });
      return null;
    }
  }

  onMenuClick = (...args) => {
    switch (Number(args[0]['key'])) {
      case MENU.BECOME_HOST:
        this.setState({
          become_host_dialog_visible: true
        });
        break;
      case MENU.HOST_PENDING:
        Feedback.toast.success("We're assessing your request...");
        break;
      case MENU.MANAGE_ADS:
        console.log('Manage Ads');
        break;
      case MENU.REQUESTS:
        console.log('Requests');
        break;
      case MENU.ORDER_HISTORY:
        console.log('Order History');
        break;
      case MENU.PUBLISH_AD:
        this.props.history.push('/edit');
        break;
      case MENU.PROFILE:
        console.log('Profile');
        this.setState({
          menu_balloon_visible: false,
        });
        break;
      case MENU.LOGOUT:
        CommonUtils.logout();
        this.setState({
          menu_balloon_visible: false,
        });
        CommonUtils.callCustomMemberFunc(this.props.onAccountStateChange)
        break;
      case MENU.LOGIN:
        this.setState({
          login_dialog_visible: true
        });
        break;

      default:
        break;
    }
  }

  renderBalloonContent = (menu) => {
    return (
      <Menu.Item key={menu.name}>
        <Balloon
          className="header-balloon-content"
          closable={false}
          triggerType="click"
          visible={this.state.menu_balloon_visible}
          trigger={
            <a display='flex' align-items='center' onClick={() => {
              this.setState({
                menu_balloon_visible: !this.state.menu_balloon_visible
              });
            }}>
              <Img shape='circle' width={25} height={25} src={this.current_user['avatar'] ? this.current_user['avatar'] : CommonUtils.DEFAULT_AVATAR} />
              &nbsp;
              <Icon
                size="medium"
                type="arrow-down-filling"
                className="arrow-down-filling-icon"
              />
            </a>
          }
        >
          {menu.children.map((subMenu) => {
            return (
              <div href="#" className="custom-sub-menu" key={subMenu.id} onClick={() => this.onMenuClick({ 'key': subMenu.id })}>
                {subMenu.name}
              </div>
            );
          })}
        </Balloon>
      </Menu.Item>
    );
  };

  renderMenuItem = () => {
    let menus;
    if (this.current_user != null) {
      switch (this.current_user['status']) {
        case CommonUtils.UserStatus.GUEST:
          menus = [
            {
              name: 'Become Host',
              id: MENU.BECOME_HOST
            },
            {
              name: 'Order History',
              id: MENU.ORDER_HISTORY,
            },
            {
              name: this.current_user['username'],
              children: [
                {
                  name: 'Profile',
                  id: MENU.PROFILE,
                },
                {
                  name: 'Logout',
                  id: MENU.LOGOUT,
                },
              ],
            },
          ];
          break;
        case CommonUtils.UserStatus.HOST_PENDING:
          menus = [
            {
              name: 'Become Host...',
              id: MENU.HOST_PENDING
            },
            {
              name: 'Order History',
              id: MENU.ORDER_HISTORY,
            },
            {
              name: this.current_user['username'],
              children: [
                {
                  name: 'Profile',
                  id: MENU.PROFILE,
                },
                {
                  name: 'Logout',
                  id: MENU.LOGOUT,
                },
              ],
            },
          ];
          break;
        case CommonUtils.UserStatus.HOST:
          menus = [
            {
              name: 'Manage Ads',
              id: MENU.MANAGE_ADS,
            },
            {
              name: 'Requests',
              id: MENU.REQUESTS,
            },
            {
              name: 'Order History',
              id: MENU.ORDER_HISTORY,
            },
            {
              name: 'Publish Ad',
              id: MENU.PUBLISH_AD,
            },
            {
              name: this.current_user['username'],
              children: [
                {
                  name: 'Profile',
                  id: MENU.PROFILE,
                },
                {
                  name: 'Logout',
                  id: MENU.LOGOUT,
                },
              ],
            },
          ];
          break;
        case CommonUtils.UserStatus.ADMIN:
          menus = [
            {
              name: 'Logout',
              id: MENU.LOGOUT,
            },
          ];
          break;

        default:
          break;
      }
    } else {
      menus = [
        {
          name: 'Login/Register',
          id: MENU.LOGIN,
        },
      ];
    }


    return menus.map((menu) => {
      if (menu.children) {
        return this.renderBalloonContent(menu);
      }
      return (
        <Menu.Item key={menu.id}>
          {menu.name}
        </Menu.Item>
      );
    });
  };

  render() {
    this.current_user = CommonUtils.getUserInfo2Cookie();
    if (this.current_user != null
      && CommonUtils.UserStatus.ADMIN == this.current_user['status']) {
      window.location = '#/admin';
    }
    return (
      <div className="header-container" style={this.props.style}>
        <div className="header-content">
          <Logo />
          <div className="header-navbar">
            <div className="header-search-input" >
              {
                (
                  () => {
                    if (this.state.search_box_visible) {
                      return (
                        <Input placeholder="Anywhere"
                          style={{
                            visibility: "visible"
                          }}
                          onChange={(value, e) => this.searchKeyword = value}
                          onPressEnter={() => {
                            if (this.searchKeyword && this.props.history) {
                              this.props.history.push(`/accom/${this.searchKeyword}`);
                            }
                          }}
                        />);
                    } else {
                      return (
                        <Input placeholder="Anywhere"
                          style={{
                            visibility: "hidden"
                          }}
                        />);
                    }
                  }
                )()
              }
            </div>
            <Menu className="header-navbar-menu" mode="horizontal" onClick={this.onMenuClick}>
              {this.renderMenuItem()}
            </Menu>
          </div>
        </div>
        <Dialog
          visible={this.state.login_dialog_visible}
          closable="esc,mask,close"
          onClose={() => {
            this.setState({
              login_dialog_visible: false
            });
          }}
          footer={<div />}>
          <SignupForm onLogin={() => {
            this.setState({
              login_dialog_visible: false
            });
            if (CommonUtils.UserStatus.ADMIN == this.current_user['status']) {
              window.location = '#/admin';
            }
            CommonUtils.callCustomMemberFunc(this.props.onAccountStateChange);
          }} />
        </Dialog>
        {
          (() => {
            if (this.current_user != null
              && CommonUtils.UserStatus.GUEST == this.current_user['status']) {
              return (
                <Dialog
                  visible={this.state.become_host_dialog_visible}
                  closable="esc,mask,close"
                  onClose={() => {
                    this.setState({
                      become_host_dialog_visible: false
                    });
                  }}
                  footer={<div />}>
                  <BecomeHostForm onSubmitted={() => {
                    this.setState({
                      become_host_dialog_visible: false
                    });
                    CommonUtils.callCustomMemberFunc(this.props.onAccountStateChange);
                  }} />
                </Dialog>
              );
            }
          })()
        }
      </div>
    );
  }

}
