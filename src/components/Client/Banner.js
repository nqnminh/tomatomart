import React from 'react';
import { Container } from 'reactstrap';

import '../../css/Client/Banner.css';
import '../../css/Client/TopMenu.css';
import SearchBar from './SearchBar';



export default function() {
  return(
       <div className="Banner">
      <Container>
        <div className="title">
          <h1>Đặt hàng và giao ngay trong vòng 20 phút</h1>
          <p>Hôm nay bạn muốn nấu gì?</p>
        </div>
        <SearchBar />
      </Container>
    </div>
   
  );
}