import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/Client/BackToHomeBtn.css';

export default function() {
  return(
    <div className="BackToHomeBtn">
      <Link to='/'>Quay lại trang chủ</Link>
    </div>
  );
}