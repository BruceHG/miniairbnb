import React, { Component } from 'react';

export default class Placeorder extends Component {
  static displayName = 'Placeorder';

  constructor(props) {
    super(props);
    this.state = {};
    this.data = JSON.parse(atob(this.props.match.params.data));
  }

  render() {
    return <div className="placeorder-page" >{JSON.stringify(this.data)}</div>;
  }
}
