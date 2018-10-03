import React, { Component } from 'react';
import { Rating } from '@icedesign/base';
import IceImg from '@icedesign/img';
import './SingleItem.scss';
import * as CommonUtils from '../../../../../lib/commonUtils';


export default class SingleItem extends Component {
  static displayName = 'SingleItem';
  
  render() {
    
    const {
      style,
      className = '',
      active,
      i_id,
      title,
      album_first,
      price_per_day,
      address,
      rating,
    } = this.props;
    // console.log(CommonUtils.BACKEND_URL+'/'+album_first);
    return (
      <div
        className={`${className} single-item`}
        onClick={this.props.onClick}
        style={{
          ...style,
          height: '230px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: active ? '#f4f4f4' : undefined,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IceImg 
            src={CommonUtils.BACKEND_URL+'/'+album_first}
            width={149}
            height={149}
            style={{ margin: '8px' }}
          />
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            fontSize: '12px',
            lineHeight: '18px',
            margin: '0 14px',
          }}
        >
          {title}

        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            lineHeight: '18px',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          {address}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            lineHeight: '18px',
            color: '#C0C0C0',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          {'$'+price_per_day+' AUD per night'}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            lineHeight: '18px',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          <Rating defaultValue={rating} 
          disabled
          size="medium"
          />
          {rating}
        </div>
      </div>
    );
  }
}
