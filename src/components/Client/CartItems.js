import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag ,faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

import '../../css/Client/CartItems.css';
import QuantityAdjustment from './QuantityAdjustment';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function(props) {
  const { 
    isCartClicked, 
    setCartClicked,
    cartItems,
    totalPrice,
    removeItem   
  } = useContext(CartContext);
  
  const { setCheckoutClick } = useContext(AuthContext);

  const handleCheckout = (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      props.history.push('/checkout');
    } else {
      setCheckoutClick();
    }
  }
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
    <div className={isCartClicked ? "CartItems w-sm-100 c-show" : "CartItems"}>
      <div className="header">
        <div className="items-amount">
          <FontAwesomeIcon className="mr-2" icon={faShoppingBag} />
          {cartItems.length} SP
        </div>
        <FontAwesomeIcon icon={faTimes} onClick={() => setCartClicked(false)}/>
      </div>
        <div className="body">
          { 
            cartItems.length === 0 && <span style={{
              fontSize:"15px",
              fontWeight:"700",
              color:"rgb(119, 121, 140)",
              display:"block",
              width:"100%",
              textAlign:"center",
              padding:"40px 0px"
            }}>Không có sản phẩm nào</span>
          }
          {
            cartItems.map(item => 
              <div key={item._id} className="item">
                <QuantityAdjustment type="cart" product={item}/>
                <div className="img">
                  <img src={item.image} alt="" />
                </div>
                <div className="info">
                  <div className="title">{item.title}</div>
                  <div className="price">{formatNumber(item.price)}đ</div>
                  <div className="quantity">{item.quantity} sp</div>
                </div>
                <div className="total-price">{formatNumber(item.quantity * item.price)}đ</div>
                <FontAwesomeIcon icon={faTimes} className="ml-4" onClick={() => removeItem(item)} />
              </div>
            )
          }
      </div>
        
      <Link 
        to="/checkout" 
        onClick={handleCheckout} 
        className={cartItems.length === 0 ? "footer disable-btn" : "footer"}>
        <span style={{
          color: [cartItems.length === 0 ? 'rgb(0, 158, 127)' : '']
        }}>Thủ tục đặt hàng</span>
        <div className="total">
          {formatNumber(totalPrice)}đ
        </div>
      </Link>
    </div>
  );
}