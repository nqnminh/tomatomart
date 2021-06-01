import React, { useContext } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { faDollarSign, faCartArrowDown, faUserCircle, faMotorcycle } from "@fortawesome/free-solid-svg-icons";

import '../../css/Admin/Admin.css';
import { AdminContext } from '../../contexts/AdminContext';
import Target from '../../components/Admin/Target';
import Client from '../../components/Admin/Client';
import Statistic from '../../components/Admin/Statistic';
import Sale from '../../components/Admin/Sale';
import LoadingPage from '../../components/LoadingPage';

const Admin = () => {
  const { orders, revenue, users, loading } = useContext(AdminContext);
  
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

  const statistics = [
    { title: 'Tổng doanh thu', icon: faDollarSign, background: 'rgb(255, 232, 178)', color: 'rgb(255, 179, 0)', data: formatNumber(revenue) + "đ" },
    { title: 'Tổng đơn hàng', icon: faCartArrowDown, background: 'rgb(250, 202, 202)', color: 'rgb(255, 110, 110)', data: orders.length },
    { title: 'Khách hàng mới', icon: faUserCircle, background: 'rgb(209, 249, 245)', color: 'rgb(39, 199, 183)', data: users.length },
    { title: 'Tổng đơn đã giao', icon: faMotorcycle, background: 'rgb(248, 218, 194)', color: 'rgb(255, 129, 29)', data: orders.length },
  ];

  return(
    <div className="Admin admin-page">
      <Container>
        {
          loading ?
          <LoadingPage /> :
          <React.Fragment>
            <Row>
              <Col xl="4" className="mb-4">
                <Target />
              </Col>
              <Col xl="8" className="mb-4">
                <Client />
              </Col>
            </Row>
            <Row>
              {
                statistics.map(statistic => 
                  <Col xl="3" lg="6" md="6" className="mb-4" key={statistic.title}>
                    <Statistic 
                      title={statistic.title} 
                      icon={statistic.icon}
                      color={statistic.color}
                      background={statistic.background}
                      data={statistic.data}
                    />
                  </Col>
                )
              }
            </Row>
            <Row>
              <Col className="mb-4">
                <Sale />
              </Col>
            </Row>
          </React.Fragment>
        }
      </Container>
    </div>
  );
}

export default Admin;