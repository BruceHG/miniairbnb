import React, { Component } from 'react';
import { Input, Balloon, Icon } from '@icedesign/base';
import Menu from '@icedesign/menu';
import Logo from '../Logo';
import './Header.scss';
import { Dialog } from '@icedesign/base';
import SignupForm from './SignupForm2';
import { getUserInfo2Cookie, logout, callCustomMemberFunc } from '../../lib/commonUtils';
import Img from '@icedesign/img';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.style = props['style'];
    this.state = {
      login_dialog_visible: false,
      menu_balloon_visible: false,
    }
    this.current_user = null;
    this.onAccountStateChange = props.onAccountStateChange;
  }

  onMenuClick = (...args) => {
    console.log(args);
    switch (Number(args[0]['key'])) {
      case 0:
        console.log('Become Host');
        break;
      case 1:
        console.log('Manage Ads');
        break;
      case 2:
        console.log('Requests');
        break;
      case 3:
        console.log('Order History');
        break;
      case 4:
        console.log('Publish Ad');
        break;
      case 5:
        console.log('Profile');
        this.setState({
          menu_balloon_visible: false,
        });
        break;
      case 6:
        logout();
        this.setState({
          menu_balloon_visible: false,
        });
        callCustomMemberFunc(this.onAccountStateChange)
        break;
      case 7:
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
              <Img shape='circle' width={26} height={26} src='/public/logo.png' />
              {menu.name}
              <Icon
                size="xxs"
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
    let MENUS;
    if (this.current_user != null) {
      MENUS = [
        {
          name: 'Become Host',
          id: 0,
        },
        {
          name: 'Manage Ads',
          id: 1,
        },
        {
          name: 'Requests',
          id: 2,
        },
        {
          name: 'Order History',
          id: 3,
        },
        {
          name: 'Publish Ad',
          id: 4,
        },
        {
          name: this.current_user,
          children: [
            {
              name: 'Profile',
              id: 5,
            },
            {
              name: 'Logout',
              id: 6,
            },
          ],
        },
      ];
    } else {
      MENUS = [
        {
          name: 'Login/Register',
          id: 7,
        },
      ];
    }


    return MENUS.map((menu) => {
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
    this.current_user = getUserInfo2Cookie();
    return (
      <div className="header-container" style={this.style}>
        <div className="header-content">
          <Logo />
          <div className="header-navbar">
            <div className="header-search-input">
              <Input placeholder="Anywhere" />
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
            callCustomMemberFunc(this.onAccountStateChange);
          }} />
        </Dialog>
      </div>
    );
  }

}
