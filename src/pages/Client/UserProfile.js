import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

import '../../css/Client/UserProfile.css';
import { AuthContext } from '../../contexts/AuthContext';
import UserInfo from '../../components/Client/UserInfo';
import Alert from '../../components/Alert';
import UserSideBar from '../../components/Client/UserSideBar';
import LoadingPage from '../../components/LoadingPage';
import MessengerCustomerChat from 'react-messenger-customer-chat';

const UserProfile = () => {
  const { user, userLogin, loading } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [isSave, setSave] = useState(false);

  useEffect(() => {
    document.title = 'Thông tin - Tomato Mart';
    setData(user);
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault();
    if (JSON.stringify(data) === JSON.stringify(user)) {
      return;
    }

    if (data.district === 'Quận/Huyện' || data.city === 'Tỉnh/Thành phố') {
      return;
    }

    const token = localStorage.getItem('token');
    axios.patch('https://tomato-mart.herokuapp.com/user/update', data, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setSave(true);
        userLogin(token);
      })
      .then(() => {
        setTimeout(() => {
          setSave(false)
        }, 2000)
      })
  }

  const handleInput = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  return (
    <div className="UserProfile user-container">
      <Alert option="edit" isOpen={isSave} />
      <div>
        <UserSideBar page="profile" />
      </div>
      {
        loading ?
          <LoadingPage /> :
          <div className="user-wrapper">
            <MessengerCustomerChat
              pageId="651402478367925"
              appId="1636069416602776"
              language="vi_VN"
              themeColor="#009e7f"
            />
            <div className="profile mb-5">
              <h3 className="bt-header">Your Profile</h3>
              <Form className="AuthForm" onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Tên</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name || ''}
                    onChange={handleInput}
                    required
                    autoComplete="off"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email || ''}
                    onChange={handleInput}
                    required
                    autoComplete="off"
                  />
                </FormGroup>
                <Button type="submit">Lưu</Button>
              </Form>
            </div>
            <div className="contact mb-5">
              <h3 className="bt-header">Số điện thoại liên lạc</h3>
              <UserInfo isPhone handleInput={handleInput} handleSubmit={handleSubmit} data={data} />
            </div>
            <div className="address">
              <h3 className="bt-header">Địa chỉ nhận hàng</h3>
              <UserInfo handleInput={handleInput} handleSubmit={handleSubmit} data={data} />
            </div>
          </div>
      }
    </div>
  );
}

export default UserProfile;