import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const OrderDetails =  (props) => {
  const { mobile, index, i, show, order } = props;
  const className = 
  (mobile ? "order-detail d-flex d-xl-none" : "order-detail d-none d-xl-flex") 
  + (index === i && show ? " detail-active" : "");

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
    <div className={className} style={mobile ? {maxHeight:"0", overflow:"hidden", padding:"0"} : null}>
      <h3 className="bt-header d-none d-xl-block">Thông tin đơn hàng</h3>
      {
        !order ? <span style={{
          fontSize:"15px",
          fontWeight:"700",
          color:"rgb(119, 121, 140)",
          display:"block",
          width:"100%",
          textAlign:"center",
          padding:"40px 0px"
        }}>No Order found.</span> :
        <React.Fragment>
          <div className="details">
            <div className="address">
              <div className="title">Địa chỉ nhận</div>
              <span>{order && `${order.address}, ${order.district}, ${order.city}` }</span>
              <div className="title mt-4">Phương thức thanh toán</div>
              <span>{order.payment === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}</span>
            </div>
            <div className="info">
              <div>
                Tổng giá
                <span>{formatNumber(order && order.totalPrice)}đ</span>
              </div>
              <div>
                Giảm giá
                <span>0đ</span>
              </div>
              <div>
               Phí giao hàng
                <span>0đ</span>
              </div>
              <div>
                Total
                <span>{order && formatNumber(order.totalPrice)}đ</span>
              </div>
            </div>
          </div>
          <div className="progress-wrapper">
            <Progress value={(order.status / 3) * 100}>
              <div className="des">
                <div className={`check-btn ${order.status < 1 ? 'not-completed' : ''}`}>
                  {
                    order.status === 1 ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    1
                  }
                </div>
                <div className="text">Đã tiếp nhận</div>
              </div>
              <div className="des">
                <div className={`check-btn ${order.status < 2 ? 'not-completed' : ''}`}>
                  {
                    order.status === 2 ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    2
                  }
                </div>
                <div className="text">Đang giao</div>
              </div>
              <div className="des">
                <div className={`check-btn ${order.status < 3 ? 'not-completed' : ''}`}>
                  {
                    order.status === 3  ?
                    <FontAwesomeIcon icon={faCheck} /> :
                    3
                  }
                </div>
                <div className="text">Đã giao thành công</div>
              </div>
            </Progress>
          </div>
          <div className="items">  
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                { 
                  order.cart && 
                  order.cart.map(item => 
                  <tr key={item._id}>
                    <th scope="row">
                      <div className="img-wrapper">
                        <img src={item.image} alt="" />
                      </div>
                    </th>
                    <td>
                      <div className="title">{item.title}</div>
                      <div className="price">{formatNumber(item.price)}đ</div>
                    </td>
                    <td>
                      {item.quantity}
                    </td>
                    <td>{formatNumber(parseInt(item.quantity) * item.price)}đ</td>
                  </tr>)
                }
              </tbody>
            </Table>
          </div>
        </React.Fragment>
      }
    </div>
  );
}

OrderDetails.propTypes = {
  mobile: PropTypes.bool,
  index: PropTypes.number,
  i: PropTypes.number,
  show: PropTypes.bool,
  order: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    totalPrice: PropTypes.number,
    cart: PropTypes.array
  })
}

export default OrderDetails;