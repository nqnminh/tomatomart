import React from 'react';
import PropTypes from 'prop-types';

import '../../css/Client/Order.css';
import OrderDetails from './OrderDetails';

const Order = (props) => {
  const { i, index, handleClick, order, show } = props;
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
    <div className={ i === index ? "Order order-active" : "Order"}>
      <div className="w-100" onClick={() => {handleClick(index, order) }}>
        <div className="header">
          Đơn hàng#{index + 1}
        </div>
        <div className="body">
          <div className="order-date">
            Ngày đặt:
            <span>{order.date}</span>
          </div>
          <div className="order-id">
           Mã đơn hàng: 
            <span>{order._id}</span>
          </div>
          <div className="total-price">
            Tổng tiền:
            <span>{formatNumber(order.totalPrice)}đ</span>
          </div>
        </div>
      </div>
      {
        <OrderDetails i={i} order={order} mobile={true} index={index} show={show} />
      }
    </div>
  );
}

Order.propTypes = {
  i: PropTypes.number,
  index: PropTypes.number,
  handleClick: PropTypes.func,
  order: PropTypes.shape({
    date: PropTypes.string,
    _id: PropTypes.string,
    totalPrice: PropTypes.number
  }),
  show: PropTypes.bool
}

export default Order;