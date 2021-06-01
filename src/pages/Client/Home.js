import React from 'react';

import Banner from '../../components/Client/Banner';
import Main from '../../components/Client/Main';
import TopMenu from '../../components/Client/TopMenu';
import Cart from '../../components/Client/Cart';
import CartItems from '../../components/Client/CartItems';
import PromotionBlock from '../../components/Client/PromotionBlock';
import { useDeviceType } from '../../components/Client/helper/useDeviceType';
import MessengerCustomerChat from 'react-messenger-customer-chat';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceType: {
        desktop: true,
        mobile: false,
        tablet: false
      }
    };
  }
  componentDidMount() {
    if (window.innerHeight > 900) {
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight - 90,
          behavior: "smooth"
        });
      }, 600);
    }
    document.title = 'Tomato';
    const userAgent = window.navigator.userAgent;
    const deviceType = useDeviceType(userAgent);
    this.setState({ deviceType: deviceType });
  }
  formatNumber(value) {
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

  render() {
    return (
      <div className="Home">
        <TopMenu isTopMenu={true} />
        <Cart formatNumber={this.formatNumber} />
        <CartItems {...this.props} formatNumber={this.formatNumber} />
        <Banner />
        <MessengerCustomerChat
          pageId="651402478367925"
          appId="1636069416602776"
        />
        {/* <PromotionBlock /> */}
        <Main deviceType={this.state.deviceType} formatNumber={this.formatNumber} />
      </div>
    );
  }
}

export default Home;