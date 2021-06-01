import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';

import '../../css/Client/Product.css';
import CartBtn from './CartBtn';
import { AdminContext } from '../../contexts/AdminContext';
import { Modal, Button } from 'antd';
import ProductView from './ProductView';

const Product = (props) => {
  const { item, type } = props;
  const { setOpen, setProduct } = useContext(AdminContext);
  const [isModal, setModal] = useState(false);

  const toSlug = (str) => {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
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

  const handleClick = () => {
    setOpen(true);
    setProduct(item);
  }

  // const showModal = () => {
  //   setModal(true);
  //   console.log(isModal);
  // }
  const handleOK = () => {
    setModal(false);
  }

  return (
    <Col xl="3" lg="4" md="6" sm="6" className="mb-5">

      {type === 'admin' ?
        <Link
          onClick={handleClick}
          to={'/admin/products'}
          className={'product fade-in'}

        >
          <img src={item.image} alt="" />
          <div className={"info"}>
            <h3 className="title">{item.title}</h3>
            <p className="author">{item.unit} kg</p>
          </div>
          {
            (type === 'admin') &&
            <div className="cart">
              <div className="price">{formatNumber(item.price)}đ</div>
            </div>
          }
        </Link> :
        //   <Link
        //     onClick={()=>showModal()}
        //     className={'product fade-in w-custom'} >
        //     <img src={item.image} alt="" />
        //     <div className={"info text-left"}>
        //       <h3 className="title">{item.title}</h3>
        //       <p className="author">{item.unit} kg</p>
        //     </div>
        //     {
        //       <div className="cart">
        //         <div className="price">{item.price}đ</div>
        //         <CartBtn type={'related'} product={item} />
        //       </div>
        //     }
        //   </Link>
        // }

        // {
        //   showModal ?
        //     <ProductView
        //       showModal={showModal}
        //       isModal={isModal}
        //       product={item}
        //       handleOk = {handleOK}
        //     />
        //     :
        //     null
        // }

        <Link
          to={`/product/${toSlug(item.title)}`}
          className={'product fade-in w-custom'}

        >
          <img src={item.image} alt="" />
          {item.discountInPercent === 0 ? '' : <span class="discountpresent">{item.discountInPercent}%</span>}
          <div className={"info text-left"}>
            <h3 className="title">{item.title}</h3>
            <p className="author">{item.unit}</p>
          </div>
          <div className="cart">
            <div className="price">{formatNumber(item.price)} ₫</div>
            <CartBtn type={type} product={item} />
          </div>

        </Link>

      }
    </Col>
  );
}

Product.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    _id: PropTypes.string,
    image: PropTypes.string,
    unit: PropTypes.string,
    price: PropTypes.number
  }),
  type: PropTypes.string
}

export default Product;