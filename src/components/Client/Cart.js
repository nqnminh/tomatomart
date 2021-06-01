import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

import '../../css/Client/Cart.css';
import { CartContext } from '../../contexts/CartContext';

export default function(props) {

  const { 
    setCartClicked, 
    cartItems, 
    totalPrice 
  } = useContext(CartContext);
  const formatNumber = (value) =>{
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
    <div 
      className="Cart"
      onClick={() => setCartClicked(true)}
    >
      <div className="item-amount">
        <FontAwesomeIcon className="mr-2" icon={faShoppingBag} />
        {cartItems.length} SP
      </div>
      <div className="total-price">
        <p>{formatNumber(totalPrice)}đ</p>
      </div>
    </div>
  );
}