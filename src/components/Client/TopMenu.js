import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";

import '../../css/Client/TopMenu.css';
import SearchBar from './SearchBar';
import AuthForm from './AuthForm';
import User from './User';
import { ProductsContext } from '../../contexts/ProductsContext'
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const TopMenu = (props) => {
  const { isTopMenu } = props;
  const [isHide, setHide] = useState(false);
  const [isVisble, setVisible] = useState(true);
  const [isClicked, setClicked] = useState(false);
  const [isMenu, setMenu] = useState(true);
  const { setStateDefault } = useContext(ProductsContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isTopMenu) {
      const hideMenu = () => {
        if (window.pageYOffset === 0 || window.pageYOffset > 600 || window.pageYOffset < 50) {
          return setHide(false);
        } else {
          return setHide(true);
        }
      };
      const renderMenuTop = () => {
        if (window.pageYOffset === 0) {
          return setMenu(true);
        }
        else if (window.pageYOffset > 600) {
          return setMenu(false)
        }
      }
      const hideSearch = () => {
        if (window.pageYOffset > 600) {
          return setVisible(false);
        } else {
          return setVisible(true);
        }
      }
      window.addEventListener("scroll", hideMenu, true);
      window.addEventListener("scroll", hideSearch, true);
      window.addEventListener("scroll", renderMenuTop, true);
      return () => {
        window.removeEventListener("scroll", hideMenu, true);
        window.removeEventListener("scroll", hideSearch, true);
        window.addEventListener("scroll", renderMenuTop, true);
      };
    }
  }, [isTopMenu]);

  const testClick = () => {
    console.log('OKKKKKKKKKkk');
    

  }
  return (
    <header className="TopMenu TopMenuMobile">
      {
        isClicked ?
          <div className="search-bar">
            <div className={!isHide ? "wrapper" : "wrapper hide"}>
              <SearchBar
                isTopMenuMobile={true}
                setClicked={() => setClicked(false)}
              />
            </div>
          </div> :
          <div className={!isHide ? (isMenu ? "wrappertop" : "wrapper") : "wrapper hide"}>
            <Container className="justify-content-between">
              {
                isTopMenu &&
                <div className="mobile-btn d-flex d-xl-none">
                  <FontAwesomeIcon
                    icon={faSearch}
                    onClick={() => setClicked(true)}
                  />
                </div>
              }
              <div className="logo">
                <Link to="/" onClick={() => setStateDefault()}>
                  <img alt="" src="https://res.cloudinary.com/dofqucuyy/image/upload/v1585755124/Books/logo_gtuxyy.svg" />
                </Link>
              </div>
              {!isVisble && <SearchBar isTopMenu={true} />}

              <div className="right-menu-style">
                <div className="menu-item">
                  <Link to="/offer">
                    <span className="label">Mã giảm giá</span>
                  </Link>
                </div>
                <div className="menu-item">
                  <Link to="/contact" onClick={testClick}>
                    <FontAwesomeIcon className="mr-2" icon={faPhoneVolume} />
                    <span className="label">Liên hệ</span>
                  </Link>
                </div>
                <div className="user-btn">
                  {!user._id ? <AuthForm /> : <User {...props} />}
                </div>
              </div>

            </Container>
          </div>
      }
    </header>
  );
}

TopMenu.propTypes = {
  isTopMenu: PropTypes.bool
}

export default TopMenu;