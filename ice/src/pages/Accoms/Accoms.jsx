import React, { Component } from 'react';
import FilterList from './components/FilterList';
import Header from '../../components/Header';


export default class Accoms extends Component {
  static displayName = 'Accoms';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Header style={{ background: 'rgba(0, 0, 0, 0.1)' }} />
      <br/>
      <br/>
      <div className="accoms-page">
        <FilterList />
      </div>
      </div>
    );
  }
}
