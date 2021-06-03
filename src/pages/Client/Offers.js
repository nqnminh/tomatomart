import React from 'react';

import TopMenu from '../../components/Client/TopMenu';
import Cart from '../../components/Client/Cart';
import CartItems from '../../components/Client/CartItems';
import OfferList from '../../components/Client/OfferList';
import MessengerCustomerChat from 'react-messenger-customer-chat';

class Offers extends React.Component {

  render() {
    return(
      <div className="Home">
        <TopMenu isTopMenu={true} />
        <Cart />
        <CartItems {...this.props} />
        <OfferList/>
        <MessengerCustomerChat
          pageId="651402478367925"
          appId="1636069416602776"
        />
      </div>
    );
  }
}

export default Offers;