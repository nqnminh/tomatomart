import React from 'react';

import TopMenu from '../../components/Client/TopMenu';
import Cart from '../../components/Client/Cart';
import CartItems from '../../components/Client/CartItems';
import OfferList from '../../components/Client/OfferList';

class Offers extends React.Component {

  render() {
    return(
      <div className="Home">
        <TopMenu isTopMenu={true} />
        <Cart />
        <CartItems {...this.props} />
        <OfferList/>
      </div>
    );
  }
}

export default Offers;