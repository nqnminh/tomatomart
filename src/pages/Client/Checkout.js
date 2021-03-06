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
import { MomoIcon } from '../../components/Client/Icon/index';
import MessengerCustomerChat from 'react-messenger-customer-chat';

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

    axios.get(`https://tomato-mart.herokuapp.com/area/district`, { cancelToken: source.token })
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
        .loading('??ang x??c nh???n ????n h??ng', 0.7)
        .then(() => message.success('?????t h??ng th??nh c??ng, ki???m tra l???i ????n h??ng c???a b???n', 2))
        .then(() => message.info('C???a h??ng ??ang chu???n b??? ... vui l??ng gi??? li??n l???c', 2.5));
      const { data } = await axios.post('https://tomato-mart.herokuapp.com/checkout', {
        order: {
          ...order,
          orderId: 'Tomato' + uid(),
          totalPrice: price ? price : totalPrice
        }
      })
      if (data) {
        const errorCode = 0;
        createOrder(data.order);
        localStorage.removeItem('cartItems');
        setStateDefault();
        props.history.push(`/order-received?orderId=${data.order.orderId}&errorCode=${errorCode}`);
      }
    }


    if (order.payment === 'card') {
      const hide = message.loading('??ang m??? d???ng MOMO...', 3);
      axios.post('https://tomato-mart.herokuapp.com/payment', {
        order: {
          ...order,
          orderId: 'Tomato' + uid(),
          totalPrice: price ? price : totalPrice
        }
      }).then(res => {
        const data = res.data;
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
            <MessengerCustomerChat
              pageId="651402478367925"
              appId="1636069416602776"
              language="vi_VN"
              themeColor="#009e7f"
            />
            <div className="order-info">
              <h3 className="bt-header">????n h??ng c???a b???n</h3>
              <div className="item">
                <div className="title">{`T???ng t???m t??nh( ${cartItems.length}` + ' sp)'}</div>
                <div className="price">{`${price ? formatNumber(price) : formatNumber(totalPrice)}??`}</div>
              </div>
              <div className="item">
                <div className="title">Ph?? v???n chuy???n</div>
                <div className="price">0??</div>
              </div>
              <div className="item">
                <div className="title">T???ng thanh to??n</div>
                <div className="price">{`${price ? formatNumber(price) : formatNumber(totalPrice)}??`}</div>
              </div>
              <div></div>
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="billing-address">

                <h3 className="bt-header">Th??ng tin thanh to??n</h3>
                <FormGroup>
                  <Label for="name">
                    T??n ng?????i ?????t h??ng
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
                    ?????a ch??? nh???n h??ng
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
                  <Label for="city">Th??nh ph???/Huy???n</Label>
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
                    <option>Huy???n/Th??? x??</option>
                    {/* {cities.map(city => <option key={city.name} >{city.name}</option>)} */}
                    <option key={cities.ID}>{cities.Title}</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="district">Ph?????ng/X??</Label>
                  <Input
                    type="select"
                    name="district"
                    id="district"
                    onChange={handleInput}
                    value={order.district || user.district}
                    autoComplete="off"
                  >
                    <option>Ph?????ng/X??</option>
                    {districts.map(district => <option key={district.ID}>{district.Title}</option>)}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="phone">
                    S??? ??i???n tho???i li??n l???c
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
                <h3 className="bt-header">M?? gi???m gi??</h3>
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
                  <button type='button' onClick={handleDiscountSubmit}>??p d???ng</button>
                </FormGroup>
                {
                  discountStatus &&
                  <Alert color={discountStatus.status === 0 ? "danger" : "success"}>{discountStatus.msg}</Alert>
                }
              </div>
              <div className="payment">
                <h3 className="bt-header">Ch???n ph????ng th???c thanh to??n</h3>
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
                    <span>Ti???n m???t</span>
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
              >?????t h??ng</button>
            </Form>
          </div>
      }
    </div>
  );
};
