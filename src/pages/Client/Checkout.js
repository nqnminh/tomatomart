import React, { useContext, useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { MomoIcon } from '../../components/Client/Icon/index'

import '../../css/Client/Checkout.css';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import { AreaContext } from '../../contexts/AreaContext';
import UserSideBar from '../../components/Client/UserSideBar';
import LoadingPage from '../../components/LoadingPage';
import { uid } from 'uid';
import { message } from 'antd';
import queryString from 'query-string'



export default function (props) {
  const { cartItems, totalPrice } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const { setStateDefault } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext)
  const { cities, handleCityClick } = useContext(AreaContext);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setError] = useState(null);
  const [order, setOrder] = useState({});
  const [districts, setDistricts] = useState([]);
  const [discount, setDiscount] = useState("");
  const [discountStatus, setDisCountStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    setPrice(totalPrice)
  }, [totalPrice])

  useEffect(() => {
    document.title = 'Checkout - Tomato';

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    if (!order.city) {
      setOrder({
        id: user._id,
        orderId: '',
        name: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        district: user.district,
        phone: user.phone,
        payment: 'cash',
        totalPrice: totalPrice,
        cartItems: JSON.parse(localStorage.getItem('cartItems'))
      })
    }


    const tempCity = order.city ? order.city : user.city;

    axios.get(`https://dvbt-areas.herokuapp.com/districts?city=${tempCity}`, { cancelToken: source.token })
      .then(res => {
        setDistricts(res.data);
      })
      .catch(err => {
        console.log(err);
      })

    return () => {
      source.cancel();
    }
  }, [user.city, order.city, totalPrice, user._id, user.address, user.district, user.email, user.name, user.phone])

  const handleInput = (event) => {
    setOrder({ ...order, [event.target.name]: event.target.value });
    setError(null);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      return;
    }
    if (order.payment === 'cash') {
      message
        .loading('Đang xác nhận đơn hàng', 0.7)
        .then(() => message.success('Đặt hàng thành công, kiểm tra lại đơn hàng của bạn', 2))
        .then(() => message.info('Cửa hàng đang chuẩn bị ... vui lòng giữ liên lạc', 2.5));
      const { data } = await axios.post('https://tomato-mart.herokuapp.com/checkout', {
        order: {
          ...order,
          orderId: 'Tomato' + uid(),
          totalPrice: price ? price : totalPrice
        }
      })
      if (data) {
        const errorCode=0;
        createOrder(data.order);
        localStorage.removeItem('cartItems');
        setStateDefault();
        props.history.push(`/order-received?orderId=${data.order.orderId}&errorCode=${errorCode}`);
      }
    }


    if (order.payment === 'card') {
      const hide = message.loading('Đang mở dụng MOMO...', 3);
      axios.post('https://tomato-mart.herokuapp.com/payment', {
        order: {
          ...order,
          orderId: 'Tomato' + uid(),
          totalPrice: price ? price : totalPrice
        }
      }).then(res => {
        const data= res.data;
        window.location.replace(data.payUrl);
      })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const handleDiscountInput = (e) => {
    setDiscount(e.target.value)
  }

  const handleDiscountSubmit = async () => {
    const value = discount.trim();
    if (!value) return;
    try {
      const data = {
        code: value,
        price: totalPrice
      }
      console.log(data);
      const res = await axios.post('https://tomato-mart.herokuapp.com/promotion/apply-promotion', data);
      setDisCountStatus(res.data);
      setDiscount("");
      if (res.data.status === 1) {
        setPrice(res.data.priceAfterPromotion);
      } else {
        setPrice(null)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.target.keyCode === 13) {
      handleDiscountSubmit()
    }
  }


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
    <div className="Checkout user-container">
      <div>
        <UserSideBar page="checkout" />
      </div>
      {
        loading ?
          <LoadingPage /> :
          <div className="checkout-form">
            <div className="order-info">
              <h3 className="bt-header">Đơn hàng của bạn</h3>
              <div className="item">
                <div className="title">{`Tổng tạm tính(${cartItems.length}` + 'sp'}</div>
                <div className="price">{`${price ? formatNumber(price) : formatNumber(totalPrice)}đ`}</div>
              </div>
              <div className="item">
                <div className="title">Phí vận chuyển</div>
                <div className="price">0đ</div>
              </div>
              <div className="item">
                <div className="title">Tổng thanh toán</div>
                <div className="price">{`${price ? formatNumber(price) : formatNumber(totalPrice)}đ`}</div>
              </div>
              <div></div>
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="billing-address">

                <h3 className="bt-header">Thông tin thanh toán</h3>
                <FormGroup>
                  <Label for="name">
                    Tên người đặt hàng
                </Label>
                  <Input
                    type="text"
                    value={order.name || user.name || ''}
                    name="name"
                    onChange={handleInput}
                    required
                    id="name"
                    autoComplete="off"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">
                    Email
                </Label>
                  <Input
                    type="email"
                    value={order.email || user.email || ''}
                    name="email"
                    onChange={handleInput}
                    required
                    id="email"
                    autoComplete="off"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="address">
                    Địa chỉ nhận hàng
                </Label>
                  <Input
                    type="text"
                    value={order.address || user.address || ''}
                    name="address"
                    onChange={handleInput}
                    required
                    id="address"
                    autoComplete="off"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input
                    type="select"
                    name="city"
                    id="city"
                    onChange={(event) => {
                      handleInput(event);
                      handleCityClick(event);
                    }}
                    value={order.city || user.city}
                    autoComplete="off"
                  >
                    <option>Tỉnh/Thành phố</option>
                    {cities.map(city => <option key={city.name} >{city.name}</option>)}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="district">Huyện</Label>
                  <Input
                    type="select"
                    name="district"
                    id="district"
                    onChange={handleInput}
                    value={order.district || user.district}
                    autoComplete="off"
                  >
                    <option>Quận/Huyện</option>
                    {districts.map(district => <option key={district.name}>{district.name}</option>)}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="phone">
                    Số điện thoại liên lạc
                </Label>
                  <Input
                    type="text"
                    value={order.phone || user.phone || ''}
                    name="phone"
                    onChange={handleInput}
                    required
                    id="phone"
                    autoComplete="off"
                  />
                </FormGroup>
              </div>
              <div className="discount">
                <h3 className="bt-header">Mã giảm giá</h3>
                <FormGroup>
                  <Input
                    type="discount"
                    value={discount || ""}
                    name="discount"
                    onChange={handleDiscountInput}
                    onKeyDown={handleKeyDown}
                    id="discount"
                    autoComplete="off"
                  />
                  <button type='button' onClick={handleDiscountSubmit}>Áp dụng</button>
                </FormGroup>
                {
                  discountStatus &&
                  <Alert color={discountStatus.status === 0 ? "danger" : "success"}>{discountStatus.msg}</Alert>
                }
              </div>
              <div className="payment">
                <h3 className="bt-header">Chọn phương thức thanh toán</h3>
                <FormGroup check className="d-flex justify-content-between mb-3 p-0">
                  <Input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    onChange={handleInput}
                    checked={order.payment === 'cash'}
                    autoComplete="off"
                  />{' '}
                  <Label for="cash" check>
                    <FontAwesomeIcon icon={faMoneyBillAlt} />
                    <span>Tiền mặt</span>
                  </Label>
                  <Input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    onChange={handleInput}
                    autoComplete="off"
                  />{' '}
                  <Label for="card" check>
                    <MomoIcon />
                    <span>Online</span>
                  </Label>
                </FormGroup>
              </div>
              {order.payment === 'card' && <MomoIcon />}
              <button
                disabled={!stripe}
                type="submit"
                className={cartItems.length === 0 ? 'disable-btn btn w-100' : 'btn w-100'}
              >Đặt hàng</button>
            </Form>
          </div>
      }
    </div>
  );
};
