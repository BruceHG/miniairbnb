import React, { Component } from 'react';
import { Input, Balloon, Icon } from '@icedesign/base';
import Menu from '@icedesign/menu';
import Logo from '../Logo';
import './Header.scss';
import { Dialog } from '@icedesign/base';
import SignupForm from './SignupForm2';
import Cookies from 'universal-cookie';

export default class Header extends Component {

  constructor(props) {
    super(props)
    this.style=props['style']
    this.cookies = new Cookies();
    this.state = {
      c_user: null,
      login_dialog_visible: false,
    }
  }

  refreshCurrentUser() {
    this.state.c_user = this.cookies.get('current_user');
  }

  onMenuClick = (...args) => {
    console.log(args);
    switch (args[0]['key']) {
      case 'Login/Register':
        this.onLoginDialogOpen();
        break;
    
      default:
        break;
    }
  }

  onLoginDialogOpen = () => {
    this.setState({
      login_dialog_visible: true
    });
  };

  onLoginDialogClose = () => {
    this.setState({
      login_dialog_visible: false
    });
  };

  renderBalloonContent = (menu) => {
    return (
      <Menu.Item key={menu.name}>
        <Balloon
          className="header-balloon-content"
          closable={false}
          triggerType="click"
          trigger={
            <a>
              {menu.name}{' '}
              <Icon
                size="xxs"
                type="arrow-down-filling"
                className="arrow-down-filling-icon"
              />
            </a>
          }
        >
          {menu.children.map((subMenu, index) => {
            return (
              <a href="#" className="custom-sub-menu" key={index}>
                {subMenu.name}
              </a>
            );
          })}
        </Balloon>
      </Menu.Item>
    );
  };

  renderMenuItem = () => {
    let MENUS;
    if (this.state.c_user != null) {
      MENUS = [
        {
          name: 'Become Host',
          path: '/ice/docs/ice-design',
        },
        {
          name: 'Manage Ads',
        },
        {
          name: 'Requests',
        },
        {
          name: 'Order History',
          path: '/ice/docs',
        },
        {
          name: 'Publish Ad',
          path: '/ice/docs',
        },
        {
          name: this.state.c_user,
          children: [
            {
              name: 'ICEWORKS',
              path: '/ice/iceworks',
            },
            {
              name: 'Playground',
              path: '/ice/playground',
            },
          ],
        },
      ];
    } else {
      MENUS = [
        {
          name: 'Login/Register',
          path: 'Login/Register',
        },
      ];
    }


    return MENUS.map((menu) => {
      if (menu.children) {
        return this.renderBalloonContent(menu);
      }
      return (
        <Menu.Item key={menu.path}>
          {menu.name}
        </Menu.Item>
      );
    });
  };

  render() {
    this.refreshCurrentUser();
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
          onClose={this.onLoginDialogClose}
          footer={<div />}>
          <SignupForm />
        </Dialog>
      </div>
    );
  }

}
