import React, { useEffect, useState } from 'react';
import '../../css/Client/Offer.css';
import { Row, Col, Image,Button,Input, message } from 'antd';
import Clipboard from 'clipboard';
import OfferItem from './OfferItem';
import axios from 'axios';


const OfferList = () => {

    const [promotions, setPromotions] = useState([]);
    useEffect(() => {
        const fetchPromotions = async () => {
          try {
            const res = await axios.get('https://tomato-mart.herokuapp.com/promotion');
            console.log(res.data);
            setPromotions(res.data);
          } catch (error) {
            console.log(error);
          }
        }
        fetchPromotions();
      }, [])    

    return (
        <div className="ldgymG">
            <Row>
                {
                    promotions.map(item => 
                        <OfferItem 
                        key= {item._id}
                        image= {item.image}
                        code = {item.code}
                        />
                    )
                }
                
            </Row>
        </div>
    )
}

export default OfferList;