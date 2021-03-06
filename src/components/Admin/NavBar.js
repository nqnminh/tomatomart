import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSignOutAlt,
  faThLarge,
  faShoppingBasket,
  faCalendarCheck,
  faUsers,
  faPercent
 } from "@fortawesome/free-solid-svg-icons";

import '../../css/Admin/NavBar.css';
import { AdminContext } from '../../contexts/AdminContext';
import Burger from '../Burger';

const LinkItem = (props) => {
  const {
    path,
    itemPath,
    icon,
    text,
    handdleLogout
  } = props;

  return(
    <li>
      <Link 
        className={path === itemPath ? "link-active" : ""}
        to={itemPath || "/"}
        onClick={handdleLogout}
      >
        <FontAwesomeIcon icon={icon} />
        {text}
      </Link>
    </li>
  );
}

const NavBar = (props) => {
  const [isClick, setClick] = useState(false);
  const { setOpen, setStateDefault } = useContext(AdminContext);

  const handleBurgerClick = () => {
    setClick(!isClick);
  }

  const handdleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('adminToken');
    setStateDefault();
  }

  const nav = [
    {icon: faThLarge, text: 'Dashboard', path: '/admin'},
    {icon: faShoppingBasket, text: 'Sản phẩm', path: '/admin/products'},
    {icon: faCalendarCheck, text: 'Đơn hàng', path: '/admin/orders'},
    {icon: faUsers, text: 'Khách hàng', path: '/admin/customers'},
    {icon: faPercent, text: 'Mã giảm giá', path: '/admin/promotions'},
    {icon: faSignOutAlt, text: 'Đăng xuất', handdleLogout: handdleLogout}
  ];
  
    
  return(
    <header className="NavBar">
      <div className="wrapper">
        <Burger handleBurgerClick={handleBurgerClick} isClick={isClick} isNav={true} />
        <div className="logo">
          <Link to="/admin">
            <img src="https://res.cloudinary.com/drjnoedg8/image/upload/v1623123193/free-logo-cic6hlo6y4-28s7ipjfin-removebg-preview_ad6dbn.png" alt="" />
          </Link>
        </div>
        <div className="add-products-btn" style={{marginLeft: "auto", marginRight: "20px"}} onClick={() => setOpen(true, "add")}>
          Thêm sản phẩm
        </div>
        <div className="add-products-btn" style={{marginRight: "20px"}} >
          Thêm danh mục
        </div>
        <div className="add-products-btn" onClick={() => setOpen(true, "promotions-add")}>
          Thêm mã giảm giá
        </div>
      </div>
      <ul className={isClick ? "navs nav-active" : "navs"}>
        {
          nav.map(item => 
            <LinkItem 
              key={item.text}
              icon={item.icon} 
              text={item.text} 
              path={props.location.pathname} 
              itemPath={item.path} 
              handdleLogout={item.handdleLogout}
              />
          )
        }
      </ul>
    </header>
  );
}

LinkItem.propTypes = {
  path: PropTypes.string,
  itemPath: PropTypes.string,
  icon: PropTypes.object,
  text: PropTypes.string,
  handdleLogout: PropTypes.func
}

export default NavBar;