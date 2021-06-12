import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import '../../css/Client/OrderReceived.css';
import BackToHomeBtn from '../../components/Client/BackToHomeBtn';
import LoadingPage from '../../components/LoadingPage';
import queryString from 'query-string';
import { CartContext } from '../../contexts/CartContext';
import MessengerCustomerChat from 'react-messenger-customer-chat';



const OrderReceived = (props) => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const { setStateDefault } = useContext(CartContext);

  useEffect(() => {
    document.title = 'Đơn hàng - Tomato';
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const value = queryString.parse(props.location.search);
    if (value.errorCode !== '0') {
      props.history.push(`/checkout`);
    }
    else {
      const getOrder = async () => {
        try {
          const res = await axios.get(`https://tomato-mart.herokuapp.com/checkout/?orderId=${value.orderId}`, { cancelToken: source.token })
          await setOrder(res.data);
          setLoading(false);
          localStorage.removeItem('cartItems');
          setStateDefault();
        } catch (error) {
          console.log(error);
        }
        return () => {
          source.cancel();
        }
      }
      getOrder();
    }

  }, []);

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

  return (
    <div className="OrderReceived user-container">
      {
        loading ?
          <LoadingPage /> :
          <div className="user-wrapper">
            <MessengerCustomerChat
              pageId="651402478367925"
              appId="1636069416602776"
              language="vi_VN"
              themeColor="#009e7f"
            />
            <BackToHomeBtn />
            <div className="received mb-5">
              <h3 className="bt-header">Đơn hàng đã nhận</h3>
              <p className="mb-4">Đơn hàng của bạn đã được tiếp nhận</p>
              <div className="info">
                <div className="info-data">
                  <div className="info-header">Id đơn hàng</div>
                  <p>{order[0].orderId}</p>
                </div>
                <div className="info-data">
                  <div className="info-header">Thời gian</div>
                  <p>{order[0].date}</p>
                </div>
                <div className="info-data">
                  <div className="info-header">Tổng</div>
                  <p>{formatNumber(order[0].totalPrice)}đ</p>
                </div>
                <div className="info-data">
                  <div className="info-header">Phương thức thanh toán</div>
                  <p>
                    {order[0].payment === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh tóan Online'}
                  </p>
                </div>
              </div>
            </div>
            <div className="detail mb-5">
              <h3 className="bt-header">Thôn tin đơn hàng</h3>
              <div className="detail-info">
                <div className="info-header m-0">Tổng số lượng</div>
                <p>{order[0].cart ? (order[0].cart.length < 2 ? `${order[0].cart.length} Item` : `${order[0].cart.length} Sản phẩm  `) : 0}</p>
              </div>
              <div className="detail-info">
                <div className="info-header m-0">Thời gian đặt hàng</div>
                <p>{order[0].orderTime}</p>
              </div>
              <div className="detail-info">
                <div className="info-header m-0">Địa điểm nhận hàng</div>
                <p>{`${order[0].address}, ${order[0].district}, ${order[0].city}`}</p>
              </div>
            </div>
            <div className="amount detail">
              <h3 className="bt-header">Tổng</h3>
              <div className="detail-info">
                <div className="info-header m-0">Tổng</div>
                <p>{formatNumber(order[0].totalPrice)}đ</p>
              </div>
              <div className="detail-info">
                <div className="info-header m-0">Hình thức thanh toán</div>
                <p>
                  {order[0].payment === 'cash' ? 'Trả tiền mặt' : 'Momo'}
                </p>
              </div>
              <div className="detail-info">
                <div className="info-header m-0">Tổng</div>
                <p>{formatNumber(order[0].totalPrice)}đ</p>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default OrderReceived;

