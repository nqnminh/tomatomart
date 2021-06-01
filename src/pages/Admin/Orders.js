import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table
} from 'reactstrap';
import '../../css/Admin/AdminOrder.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShippingFast, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { AdminContext } from '../../contexts/AdminContext';
import TaskBar from '../../components/Admin/TaskBar';
import NotFound from '../../components/NotFound';
import LoadingPage from '../../components/LoadingPage';
import Spinner from 'reactstrap/lib/Spinner';

const AdminOrders = () => {
  const { filtedOrders, filter, loading } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');
  const getStatus = (status) => {
    switch (status) {
      case 1: return <FontAwesomeIcon size="2x" icon={faTimes} />
      case 2: return <FontAwesomeIcon size="2x" icon={faShippingFast} />
      default: return <FontAwesomeIcon size="2x" icon={faCheck} />
    }
  }

  useEffect(() => {
    setOrders(filtedOrders)
  }, [filtedOrders])

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://tomato-mart.herokuapp.com/admin/admin-get', { headers: {"Authorization" : `Bearer ${token}`}})
      setOrders(res.data.orders.reverse())
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusClick = async (status, data) => {
    if (status === data.status) return;
    try {
      const postData = {
        ...data,
        status: status
      }
      const res = await axios.patch('https://tomato-mart.herokuapp.com/order/update-status', postData, { headers: {"Authorization" : `Bearer ${token}`}});
      fetchOrders();
    } catch (error) {
      console.log(error);
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


  return(
    <div className="AdminOrders admin-page">
      <Container>
        {
          isLoading || loading ?
          <LoadingPage /> :
          <React.Fragment>
            <Row style={{padding: "0 15px"}}>
              <Col className="admin-col mb-4 pb-0">
                <TaskBar option="orders" />
              </Col>
            </Row>
            {
              (filter.addressKeyword && !filtedOrders.length) ? 
              <NotFound type="admin" /> : 
              <Row style={{padding: "0 15px"}}>
                <Col 
                  className="admin-col p-0" 
                  style={{
                    overflow:"auto", 
                    maxHeight:"450px",
                  }}
                >
                  <Table className="admin-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã ĐH</th>
                        <th>Thời gian</th>
                        <th>Tiền</th>
                        <th>Phương thức thanh toán</th>
                        <th>Email khách</th>
                        <th>Liên hệ</th>
                        <th>Địa chỉ nhận hàng</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
    
                    <tbody>
                      {
                        orders.map((order, index) => 
                          <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.orderId}</td>
                            <td>{order.orderTime}</td>
                            <td>{formatNumber(order.totalPrice)}đ</td>
                            <td>{order.payment === 'cash' ? 'Thanh toán khi nhận hàng' : 'Momo'}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{`${order.address}, ${order.district}, ${order.city}`}</td>
                            <td className="status">
                              <div className="main">
                                {getStatus(order.status)}
                              </div>
                              <div className="list">
                                <div onClick={() => handleStatusClick(1, order)}>
                                  <FontAwesomeIcon size="2x" icon={faTimes}/>
                                </div>
                                <div onClick={() => handleStatusClick(2, order)}>
                                  <FontAwesomeIcon size="2x" icon={faShippingFast} />
                                </div>
                                <div onClick={() => handleStatusClick(3, order)}>
                                  <FontAwesomeIcon size="2x" icon={faCheck}/>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Col>
              </Row>
            }
          </React.Fragment>
        }
      </Container>
    </div>
  );
}

export default AdminOrders;