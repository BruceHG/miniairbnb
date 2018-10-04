import React, { Component } from 'react';
import './SuccessView.scss';
import { Feedback, } from "@icedesign/base";

export default class SuccessView extends Component {
  static displayName = 'SuccessView';

  constructor(props) {
    super(props);
    if (!props.history) {
      console.error("Have you set '{...this.props}' from parent?");
    }
    this.state = {
      time_remain: 5,
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.time_remain == 0) {
        if (this.props.history) {
          this.props.history.replace(`/detail/${this.props.accom_id}`);
        }
      } else {
        this.setState({ time_remain: this.state.time_remain - 1 });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className='success-view'>
        <div className='tip1'>{this.props.success_create ? 'Publish' : 'Update'} Ad Successfully!!</div>
        <div className='tip2'>
          Will jump to the new ad detail in
          <span className='tip3'>
            {this.state.time_remain}
          </span>
          s...
        </div>
      </div>
    );
  }
}
