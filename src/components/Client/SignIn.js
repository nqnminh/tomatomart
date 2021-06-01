import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Form,
  FormGroup,
  Button,
  Label,
  Input
} from 'reactstrap';
import FacebookLogin from 'react-facebook-login';

// import Login from 'ant-design-pro/lib/Login';
// import { Input, Checkbox } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/antd.css';
// import { FacebookFilled } from '@ant-design/icons';
// import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form';
// import { MobileOutlined, MailOutlined } from '@ant-design/icons';
// import { message } from 'antd';



import { AuthContext } from '../../contexts/AuthContext';
// const { Captcha, Submit } = Login;
const SignIn = (props) => {

  const { changeForm, setModal } = props;
  //
  const [value, setValue] = useState('');

  const onSubmit = (values) => {
    console.log('value collected ->', {
      ...values
    });
  };

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [errors, setError] = useState({
    email: '',
    password: '',
    err: ''
  })

  // const [users, setUsers] = useState({
  //   phone: '',
  //   captcha: ''
  // })

  const { setAlertOpen, userLogin } = useContext(AuthContext);

  const validate = () => {
    let emailError = '';
    let passwordError = '';

    if (!user.email) {
      emailError = 'Vui lòng nhập đúng định dạng'
    }
    if (!user.password) {
      passwordError = 'Vui lòng nhập mật khẩu'
    }
    if (emailError || passwordError) {
      setError({
        email: emailError,
        password: passwordError
      })
      return false;
    }
    return true;
  }

  const handleInput = (event) => {
    event.preventDefault();
    setUser({...user, [event.target.name]: event.target.value})
    // setUsers({ ...users, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      axios.post('https://tomato-mart.herokuapp.com/user/signin', {
        email: user.email,
        password: user.password
      })
        .then(res => {
          localStorage.setItem('token', res.data.token);
          userLogin(res.data.token);
          setModal(true);
          setAlertOpen();
        })
        .catch(err => {
          setError({
            err: err.response.data
          });
        });
    }
  }
  const renderFaceBook = () => {
    return (
      <FacebookLogin
        size="small"
        appId="1636069416602776"
        autoLoad
        fields="name,email,picture"
        callback={() => responseFacebook, console.log("Assss")}
      />
    )
  }

  const onChange = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onChange(value);
    }
  }

  const responseFacebook = (response) => {
    console.log(response)
  }

  return (
    <div className="AuthForm">
      <div className="header">
        <h1>TOMATO MART</h1>
        <p>Đăng nhập bằng email và mật khẩu của bạn!</p>
      </div>
      {errors.err && <div style={{
        color: "rgb(97, 26, 21)",
        backgroundColor: "rgb(253, 236, 234)",
        textAlign: "center",
        padding: "15px",
        borderRadius: "4px"
      }}>{errors.err}</div>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="a@a.com"
            onChange={handleInput}
            autoComplete="off"
          />
          {errors.email && <div className="validation">{errors.email}</div>}
        </FormGroup>
        <FormGroup>
          <Label for="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="12345"
            onChange={handleInput}
            autoComplete="off"
          />
          {errors.password && <div className="validation">{errors.password}</div>}
        </FormGroup>
        <Button size="lg" block type="submit">Tiếp tục</Button>
        {/* Login FB */}
        {/* <Button size="lg" onClick={()=>renderFaceBook()}>FB</Button> */}

      </Form>

      <div className="footer">
        Không có tài khoản?
      <span onClick={() => changeForm('signup')}>Đăng kí</span>
      </div>
    </div>
    // <div className="AuthForm">
    //   <div className="header">
    //     <h1>Chào mừng đến với Tomato</h1>
    //     <p>Đăng nhập bằng số điện thoại của bạn</p>
    //   </div>
    //   <div
    //   style={{
    //     width: 330,
    //     margin: 'auto',
    //   }}
    // >
    //   <ProForm
    //     onFinish={(e)=>onSubmit(e)}
    //     submitter={{
    //       searchConfig: {
    //         submitText: 'Đăng nhập',
    //       },
    //       render: (_, dom) => dom.pop(),
    //       submitButtonProps: {
    //         size: 'large',
    //         style: {
    //           width: '100%',
    //         },
    //       },
    //     }}
    //   >
    //     <ProFormText
    //       fieldProps={{
    //         size: 'large',
    //         prefix: <MobileOutlined />,
    //       }}
    //       name="phone"
    //       placeholder="Số điện thoại"
    //       rules={[
    //         {
    //           required: true,
    //           message: 'Số điện thoại không đúng định dạng!',
    //         },
    //         {
    //           pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
    //           message: 'Số điện thoại không đúng định dạng!',
    //         },
    //       ]}
    //     />
    //     <ProFormCaptcha
    //       fieldProps={{
    //         size: 'large',
    //         prefix: <MailOutlined />,
    //       }}
    //       captchaProps={{
    //         size: 'large',
    //       }}
    //       phoneName="phonee"
    //       name="captcha"
    //       rules={[
    //         {
    //           required: true,
    //           message: 'Vui lòng nhập captcha',
    //         },
    //       ]}
    //       placeholder="Nhập mã captcha"
    //       onGetCaptcha={(phone) => {
    //         message.success(`Mã captcha đã được gửi đến ${phone} !`);
    //       }}
    //     />
    //   </ProForm>
    // </div>
    // </div>
  )
}

SignIn.propTypes = {
  changeForm: PropTypes.func,
  setModal: PropTypes.func
}

export default SignIn;