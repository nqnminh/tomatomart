import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { 
  Form,
  FormGroup,
  Input,
  Row,
  Col
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import '../../css/Admin/TaskBar.css';
import { AdminContext } from '../../contexts/AdminContext';

const TaskBar = (props) => {
  const { option } = props;
  const [ categoryClick, setCategoryClick ] = useState(false);
  const [ priceClick, setPriceClick ]  = useState(false);
  const [ paymentClick, setPaymentClick ] = useState(false);
  const [ amountClick, setAmoutClick ] = useState(false);
  const [ orderAmountClick, setOrderAmountClick ] = useState(false);

  const { onFilter, filter, onOrdersFilter, onCustomersFilter } = useContext(AdminContext);

  const categoryList = [
    { name: 'Thịt tươi sống' },
    { name: 'Cá tươi và Hải sản' },
    {name: 'Rau xanh'},
    { name: 'Hoa quả' },
    { name: 'Thực phẩm đóng hộp' },
    { name: 'Nguyên liệu nấu nướng' },
    { name: 'Món ngon hôm nay' }
    
  ];


  const priceList = [
    { name: 'Cao đến thấp' },
    { name: 'Thấp đến cao'}
  ];

  const paymentList = [
    { name: 'Thanh toán khi nhận hàng'},
    { name: 'Thanh toán Online'}
  ];

  const render = (option) => {
    switch(option) {
      case 'orders': 
        return (
          <React.Fragment>
            <Col xl="2" className="mb-4 mb-xl-0">
              <h3 className="title">Đơn hàng</h3>
            </Col>
            <Filter 
              setClick={setPaymentClick} 
              isClick={paymentClick}
              name={filter.payment} 
              list={paymentList} 
              onFilter={onOrdersFilter}
              filter={filter}
              type="payment"
            />

            <Filter 
              setClick={setAmoutClick} 
              isClick={amountClick}
              name={filter.amount} 
              list={priceList} 
              onFilter={onOrdersFilter}
              filter={filter}
              type="amount"
            />

            <Search onFilter={onOrdersFilter} filter={filter} option="orders" />
          </React.Fragment>
        )
      case 'customers':
        return (
          <React.Fragment>
            <Col xl="2" className="mb-4 mb-xl-0">
              <h3 className="title">Khách hàng</h3>
            </Col>

            <Search onFilter={onCustomersFilter} filter={filter} option="customers" />
            
            <Filter 
              setClick={setOrderAmountClick} 
              isClick={orderAmountClick}
              name={filter.orderAmount} 
              list={priceList} 
              onFilter={onCustomersFilter}
              filter={filter}
              type="order amount"
            />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Col xl="2" className="mb-4 mb-xl-0">
              <h3 className="title">Sản phẩm</h3>
            </Col>
            <Filter 
              setClick={setCategoryClick} 
              isClick={categoryClick} 
              name={filter.category} 
              list={categoryList} 
              onFilter={onFilter}
              filter={filter}
              type="category"
            />
            <Filter 
              setClick={setPriceClick} 
              isClick={priceClick} 
              name={filter.price} 
              list={priceList} 
              onFilter={onFilter}
              filter={filter}
              type="price"
            />
            <Search onFilter={onFilter} filter={filter} />
          </React.Fragment>
        )
    }
  }

  return(
    <Row className="TaskBar">
      {render(option)}
    </Row>
  );
}

const Filter = (props) => {
  const { 
    name, 
    list, 
    setClick, 
    isClick, 
    onFilter,
    filter,
    type
  } = props;
  
  const handleClick = (item) => {
    return (event) => {
      switch(type) {
        case 'category':
          return onFilter(item.name, filter.price, filter.keyword);
        case 'payment':
          return onFilter(item.name, filter.amount, filter.addressKeyword);
        case 'amount':
          return onFilter(filter.payment, item.name, filter.addressKeyword);
        case 'order amount':
          return onFilter(filter.nameKeyword, item.name);
        default:
          return onFilter(filter.category, item.name, filter.keyword);
      }
    }
  }

  const handleClear = (event) => {
    event.stopPropagation();
    switch(type) {
      case 'category':
        return onFilter('Danh mục', filter.price, filter.keyword);
      case 'payment':
        return onFilter('Phương thức thanh toán', filter.amount, filter.addressKeyword);
      case 'amount':
        return onFilter(filter.payment, 'Số tiền', filter.addressKeyword);
      case 'order amount':
        return onFilter(filter.nameKeyword, 'Số đơn');
      default:
        return onFilter(filter.category, 'Giá', filter.keyword);
    }
  }

  return(
    <Col xl="3" className="Filter mb-3 mb-xl-0">
      <div 
        tabIndex="0"
        className="name" 
        onClick={() => setClick(!isClick)}
        onBlur={() => setClick(false)}
        >
        <div>{name}</div>
        {
          (name !== 'Danh mục' && name !== 'Giá' && name !== 'Phương thức thanh toán' && name !== 'Số tiền' && name !== 'Số đơn') && 
          <FontAwesomeIcon icon={faTimesCircle} onClick={handleClear} />
        }
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      <div className={isClick? "lists list-active": "lists"}>
        {
          list.map(item => 
            <div 
            className="list-item" 
            key={item.name} 
            onMouseDown={handleClick(item)}
          >
            {item.name}
          </div>
          )
        }
      </div>
    </Col>
  );
}

const Search = (props) => {
  const { filter, onFilter, option } = props;

  const handleInput = (event) => {
    switch(option) {
      case 'orders':
        return onFilter(filter.payment, filter.amount, event.target.value);
      case 'customers':
        return onFilter(event.target.value, filter.orderAmount);
      default:
        return onFilter(filter.category, filter.price, event.target.value);
      }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const render = (option) => {
    switch(option) {
      case 'orders':
        return (
          <Form className="h-100" onSubmit={handleSubmit}>
            <FormGroup>
              <Input 
                value={filter.addressKeyword}
                onChange={handleInput}
                placeholder="Tìm theo địa chỉ"
              />
              {
                filter.addressKeyword && 
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  style={{cursor:"pointer"}}
                  onClick={() => onFilter(filter.payment, filter.amount, '')}  
                />
              }
            </FormGroup>
          </Form>
        );
      case 'customers':
        return (
          <Form className="h-100" onSubmit={handleSubmit}>
            <FormGroup>
              <Input 
                value={filter.nameKeyword}
                onChange={handleInput}
                placeholder="Tìm theo tên"
              />
              {
                filter.nameKeyword && 
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  style={{cursor:"pointer"}}
                  onClick={() => onFilter('', filter.orderAmount)}  
                />
              }
            </FormGroup>
          </Form>
        );
      default:
        return (
          <Form className="h-100" onSubmit={handleSubmit}>
            <FormGroup>
              <Input 
                value={filter.keyword}
                onChange={handleInput}
                placeholder="Tìm theo tên"
              />
              {
                filter.keyword && 
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  style={{cursor:"pointer"}}
                  onClick={() => onFilter(filter.category, filter.price, '')}  
                />
              }
            </FormGroup>
          </Form>
        );
    }
  }

  return(
    <Col 
      xl="4" 
      className={option === 'customers' ? "Search mb-3 mb-xl-0" : "Search"} 
      style={option === 'customers' ?
       {
         flexGrow:"1", 
         maxWidth:"none"
        } : null
      }>
      {render(option)}
    </Col>
  );
}

TaskBar.propTypes = {
  option: PropTypes.string
}

Filter.propTypes = {
  name: PropTypes.string,
  list: PropTypes.array,
  setClick: PropTypes.func,
  isClick: PropTypes.bool,
  onFilter: PropTypes.func,
  filter: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.string,
    payment: PropTypes.string,
    amount: PropTypes.string,
    keyword: PropTypes.string,
    addressKeyword: PropTypes.string
  }),
  type: PropTypes.string
}

Search.propTypes = {
  filter: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.string,
    payment: PropTypes.string,
    amount: PropTypes.string,
    keyword: PropTypes.string,
    addressKeyword: PropTypes.string
  }),
  onFilter: PropTypes.func,
  option: PropTypes.string
}

export default TaskBar;