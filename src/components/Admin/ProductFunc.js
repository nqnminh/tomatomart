import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

import '../../css/Admin/ProductFunc.css';
import { AdminContext } from '../../contexts/AdminContext';

function validateFn(input = '', info = '') {
  if (!input) {
    return `Bắt buộc phải nhập ${info}`
  }
  if (info !== 'price' && info !== 'value' && info !== 'discountInPercent') {
    if (input.length < 1) {
      return `${info.charAt(0).toUpperCase() + info.slice(1)} Nhiều hơn 1 kí tự`
    }
  }
  return '';
}

const ProductFunc = () => {
  const { open, setOpen, product, setProducts, option, setPromotions, promotion } = useContext(AdminContext);
  const [ data, setData ] = useState({});
  const [errors, setError] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    slug: '',
    discountInPercent: ''
  });
  const divElement = useRef(null);

  useEffect(() => {
    if (option === 'promotions-add' || option === 'promotions-update') {
      if (option !== 'promotions-add') {
        setData({
          ...promotion,
          title: promotion.name
        });
      }
    } else {
      if (option !== 'add') {
        setData(product);
      } else {
        setData({category: 'Thịt tươi sống'});
      }
    }

    if (open) {
      divElement.current.focus();
    }
    return () => {
      setData({});
      setError({});
    }
  }, [open, product, option])
  
  const categoryList = [
    { name: 'Thịt tươi sống' },
    { name: 'Cá tươi và Hải sản' },
    {name: 'Rau xanh'},
    { name: 'Hoa quả' },
    { name: 'Thực phẩm đóng hộp' },
    { name: 'Nguyên liệu nấu nướng' },
    { name: 'Món ngon hôm nay' },
    
  ];

  const validate = (isPromotion) => {
    if (isPromotion) {
      const nameError = validateFn(data.title, 'name') || '';
      const descriptionError = validateFn(data.description, 'description') || '';
      const codeError = validateFn(data.code, 'code') || '';
      const valueError = validateFn(data.value, 'value') || '';
  
      if (nameError || descriptionError || codeError || valueError) {
        setError({
          name: nameError,
          description: descriptionError,
          code: codeError,
          value: valueError,
        })
        return false;
      }
      return true;
    } else {
      const nameError = validateFn(data.title, 'name') || '';
      const descriptionError = validateFn(data.description, 'description') || '';
      const priceError = validateFn(data.price, 'price') || '';
      const unitError = validateFn(data.unit, 'unit') || '';
      const slugError = validateFn(data.slug, 'slug') || '';
      const discountInPercentError = validateFn(data.discountInPercent, 'discountInPercent') || '';
      
      if (nameError || descriptionError || priceError || unitError || slugError || discountInPercentError) {
        setError({
          name: nameError,
          description: descriptionError,
          price: priceError,
          unit: unitError,
          slug: slugError,
          discountInPercent: discountInPercentError
        })
        return false;
      }
      return true;
    }
  }

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

  const handleEsc = (event) => {
    if (event.keyCode === 27) {
      setOpen(false)
    }
  }

  const handleImage = (event) => {
    const files = event.target.files;
    const formData = new FormData();    
    formData.append('file', files[0]);
    formData.append('upload_preset', 'nqnmstore');
    
    axios.post('https://api.cloudinary.com/v1_1/drjnoedg8/image/upload', formData,  {headers: {'Content-Type': 'application/json'}})
          .then(res => {
            setData({...data, image: res.data.secure_url});
          })
  }

  const handleInput = (event) => {
    if (event.target.name === 'title') {
      setData({...data, [event.target.name]: event.target.value, slug: toSlug(event.target.value)});
    } else {
      setData({...data, [event.target.name]: event.target.value});
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    if (option === 'promotions-add' || option === 'promotions-update') {
      const isValid = validate(true);
      if ( option !== 'promotions-add') {
        if (JSON.stringify(data) === JSON.stringify(promotion)) {
          return;
        }
        const postData = {
          _id: data._id,
          name: data.title,
          code: data.code,
          description: data.description,
          value: data.value,
          image: data.image
        }
        if (isValid) {
          axios.patch('https://tomato-mart.herokuapp.com/promotion/update-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
               .then(res => {
                  setOpen(false);
                  setPromotions();
               })
        }
      } else {
        if (isValid) {
          const postData = {
            name: data.title,
            code: data.code,
            description: data.description,
            value: data.value,
            image: data.image
          }
          console.log(postData);
          axios.post('https://tomato-mart.herokuapp.com/promotion/create-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
               .then(res => {
                  setOpen(false);
                  setPromotions();
               })
        }
      }
    } else {
      const isValid = validate(false);
      if ( option !== 'add') {
        if (JSON.stringify(data) === JSON.stringify(product)) {
          return;
        }
        
        if (isValid) {
          console.log('ok',data);
          axios.patch('https://tomato-mart.herokuapp.com/admin/update', data, { headers: {"Authorization" : `Bearer ${token}`}})
               .then(res => {
                  setOpen(false);
                  setProducts();
               })
        }
      } else {
        if (isValid) {  
          axios.post('https://tomato-mart.herokuapp.com/admin/add-product', data, { headers: {"Authorization" : `Bearer ${token}`}})
               .then(res => {
                 setOpen(false);
                 setProducts();
               })
        }
      }
    }
  }

  const handleDelete = () => {
    const token = localStorage.getItem('adminToken');
    const postData = {
      _id: data._id
    }
    axios.post('https://tomato-mart.herokuapp.com/admin/delete-product', postData, { headers: {"Authorization" : `Bearer ${token}`}})
          .then(res => {
            setOpen(false);
            setProducts();
          })
  }
  
  const handleDeletePromotion = () => {
    const token = localStorage.getItem('adminToken');
    const postData = {
      _id: data._id
    }
    axios.post('https://tomato-mart.herokuapp.com/promotion/delete-promotion', postData, { headers: {"Authorization" : `Bearer ${token}`}})
          .then(res => {
            setOpen(false);
            setPromotions();
          })
  }

  return(
    <div 
      className={ open ? "ProductFuncBackground update-active" : "ProductFuncBackground" } 
      onClick={() => setOpen(false)}
      onKeyDown={handleEsc}
      tabIndex="0"
      ref={divElement}
      >
      {
        option === "promotions-add" || option === 'promotions-update' ?
        <Container 
          className={ open ? "ProductFunc update-active" : "ProductFunc" }
          onClick={(event) => event.stopPropagation()}
        >
          <Row
            style={{
              position: "fixed",
              top: "0",
              width: "100%",
              left: "0",
              right: "0",
              margin: "0",
              padding: "50px 35px 0 70px",
            }}
          >
            <Col className="d-flex justify-content-between p-0">
              <h3 className="bt-header mb-5" style={{fontSize:"18px", color:"rgb(22,31,106)"}}>{option === 'promotions-add' ? 'Thêm mã giảm' :'Cập nhật mã '}</h3>
              <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)}/>
            </Col>
          </Row>
          <Form 
            style={{
              height: "100%",
              overflow: "scroll"
            }}
            onSubmit={handleSubmit}
          >
            <Row className="mb-5 w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Tải lên ảnh mã giảm giá tại đây</span>
              </Col>
              <Col xl="8" className="product-background">
                <FormGroup>
                  <Input id="file" type="file" accept="image/*" name="image" onChange={handleImage} />
                  <Label for="file" className="input-wrapper">
                    <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
                    <span>
                      <span>Tải lên </span>
                      ảnh của bạn tại đây
                    </span>
                  </Label>
                  {
                    data.image &&
                    <div className="img-wrapper">
                      <img src={data.image} alt="" />
                    </div>
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row className="w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Thêm thông tin mã giảm giá</span>
              </Col>
              <Col className="product-background">
                <FormGroup className="update-form">
                  <Label className="product-label" for="name">
                    Name
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.title || ''} className="product-form-control" id="name" type="text" name="title"/>
                  {errors.name && <div className="validation">{errors.name}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="description">
                    Thông tin mô tả
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <div>
                    <textarea 
                      value={data.description || ''} 
                      className="product-form-control" 
                      id="description" 
                      type="text" 
                      name="description" 
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>
                  {errors.description && <div className="validation">{errors.description}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="code">
                    Mã giảm giá
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.code || ''} className="product-form-control" id="code" type="text" name="code"/>
                  {errors.code && <div className="validation">{errors.code}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="value">
                    Giảm %
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.value || ''} className="product-form-control" id="unit" type="number" name="value"/>
                  {errors.value && <div className="validation">{errors.value}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row className="update-btn">
              <Col xs="12" md="4" className="p-0 cancle-btn w-100">
                <Button className="w-100" onClick={() => setOpen(false)}>Hủy</Button>
              </Col>
              {
                option !== 'promotions-add' &&
                <Col xs="12" md="4" className="p-0 delete-btn w-100">
                  <Button className="w-100" onClick={handleDeletePromotion}>Xóa mã giảm giá</Button>
                </Col>
              }
              <Col xs="12" md="4" className="p-0 submit-btn w-100">
                <Button className="w-100" type="submit">{option === 'promotions-add' ? 'Tạo mã' : 'Cập nhật'}</Button>
              </Col>
            </Row>
          </Form>
        </Container> :
        <Container 
          className={ open ? "ProductFunc update-active" : "ProductFunc" }
          onClick={(event) => event.stopPropagation()}
        >
          <Row
            style={{
              position: "fixed",
              top: "0",
              width: "100%",
              left: "0",
              right: "0",
              margin: "0",
              padding: "50px 35px 0 70px",
            }}
          >
            <Col className="d-flex justify-content-between p-0">
              <h3 className="bt-header mb-5" style={{fontSize:"18px", color:"rgb(22,31,106)"}}>{option === 'add' ? 'Thêm sản phẩm' :'Cập nhật sản phẩm'}</h3>
              <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)}/>
            </Col>
          </Row>
          <Form 
            style={{
              height: "100%",
              overflow: "scroll"
            }}
            onSubmit={handleSubmit}
          >
            <Row className="mb-5 w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Tải lên ảnh sản phẩm</span>
              </Col>
              <Col xl="8" className="product-background">
                <FormGroup>
                  <Input id="file" type="file" accept="image/*" name="image" onChange={handleImage} />
                  <Label for="file" className="input-wrapper">
                    <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
                    <span>
                      <span>Tải lên</span>
                      ảnh tại đây
                    </span>
                  </Label>
                  {
                    data.image &&
                    <div className="img-wrapper">
                      <img src={data.image} alt="" />
                    </div>
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row className="w-100 m-0">
              <Col xl="4" style={{padding:"30px"}}>
                <span className="product-title">Thêm thông tin sản phẩm</span>
              </Col>
              <Col className="product-background">
                <FormGroup className="update-form">
                  <Label className="product-label" for="name">
                    Tên sản phẩm
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.title || ''} className="product-form-control" id="name" type="text" name="title"/>
                  {errors.name && <div className="validation">{errors.name}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="description">
                    Mô tả
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <div>
                    <textarea 
                      value={data.description || ''} 
                      className="product-form-control" 
                      id="description" 
                      type="text" 
                      name="description" 
                      onChange={handleInput}
                      autoComplete="off"
                    />
                  </div>
                  {errors.description && <div className="validation">{errors.description}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="price">
                    Giá
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.price || ''} className="product-form-control" id="price" type="number" name="price"/>
                  {errors.price && <div className="validation">{errors.price}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="unit">
                    Khối lượng
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.unit || ''} className="product-form-control" id="unit" type="text" name="unit"/>
                  {errors.unit && <div className="validation">{errors.unit}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="discountInPercent">
                    Giảm giá
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={data.discountInPercent || ''} className="product-form-control" id="discountInPercent" type="text" name="discountInPercent"/>
                  {errors.discountInPercent && <div className="validation">{errors.discountInPercent}</div>}
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="category">
                    Danh mục
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} className="product-form-control" id="category" type="select" name="category" value={data.category || ''}>
                    { categoryList.map(category => <option key={category.name}>{category.name}</option>) }
                  </Input>
                </FormGroup>

                <FormGroup className="update-form">
                  <Label className="product-label" for="slug">
                    Slug tự động
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input autoComplete="off" onChange={handleInput} value={(data.title && toSlug(data.title)) || ''} className="product-form-control" id="slug" type="text" name="slug"/>
                  {errors.slug && <div className="validation">{errors.slug}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row className="update-btn">
              <Col xs="12" md="4" className="p-0 cancle-btn w-100">
                <Button className="w-100" onClick={() => setOpen(false)}>Hủy</Button>
              </Col>
              {
                option !== 'add' &&
                <Col xs="12" md="4" className="p-0 delete-btn w-100">
                  <Button className="w-100" onClick={handleDelete}>Xóa sản phẩm</Button>
                </Col>
              }
              <Col xs="12" md="4" className="p-0 submit-btn w-100">
                <Button className="w-100" type="submit">{option === 'add' ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      }
    </div>
  );
}

export default ProductFunc;