import React from 'react';
import '../../css/Client/Offer.css';
import { Row, Col, Image, Button, Input, message } from 'antd';
import Clipboard from 'clipboard';

const OfferIeam = (props) => {
    const {image, code} = props;
    new Clipboard('.btn');
    const copysucces = () => {
        message.success('Đã copy mã giảm giá');
    }
    return(
        <Col span={4}>
        <div className="xuIqN" style={{
            'margin-bottom': '30px',
            'padding-left': '15px',
            'padding-right': '15px'
        }}>
            <div className="bhkDuM">
                <Image
                    src={image}
                />
            </div>
            <div className="efNCtk">
                <div className="cfdGuN">
                    <Input id={"offer-type"+code} className="blBKhB" value={code}></Input>
                    <Button
                        className="btn"
                        data-clipboard-target={"#offer-type"+code}
                        onClick={() => { copysucces() }}
                    >COPY</Button>
                </div>
            </div>
        </div>
    </Col>
    )
    
}

export default OfferIeam;