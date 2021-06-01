import React from 'react';
import PropTypes from 'prop-types';

const LegendItems = (props) => {
  const {
    dot,
    title,
    type,
    amount
  } = props

  const formatNumber = (value) => {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `.${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  return(
    <div className="LegendItems">
      <div className="title">
        <div 
          className="dot" 
          style={{
            backgroundColor: `${dot}`
          }}></div>
        <span className="admin-header">{title}</span>
      </div>
      <div className="amount">{formatNumber(amount)}{type !== "client" ? "đ" : null}</div>
    </div>
  );
}

LegendItems.propTypes = {
  dot: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  amount: PropTypes.number
}

export default LegendItems