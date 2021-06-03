import React, { useState, useContext ,useEffect} from 'react';
import { Link  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge,faCarrot } from "@fortawesome/free-solid-svg-icons";

import '../../css/Client/Category.css';
import Burger from '../Burger';
import { ProductsContext } from '../../contexts/ProductsContext';

import { Menu } from 'antd';
import  { FruitsIcon, FistIcon, CaffeIcon, BeverageIcon, BreakfastIcon, CareIcon, DairyIcon, CookingIcon, FishfishIcon } from './Icon'

const { SubMenu } = Menu;


const Category = (props) => {
  const { setCategory, filters, categoryLists } = useContext(ProductsContext);
  const [ isClick, setClick ] = useState(false);
  const [ categorys,setCategorys]=useState([]);
  // get category false
  // useEffect(() => {
  //   setCategorys(categoryLists);
  // }, [categoryLists],console.log('mmmmm',categorys))

  const category = [
    'Thịt tươi sống',
    'Cá tươi và Hải sản',
    'Rau xanh',
    'Hoa quả',
    'Rau xanh',
    'Nguyên liệu',
    'Món ngon hôm nay',
  ]

  const handleCatClick = () => {
    setClick(!isClick);
  }
  

  const iconCategory = (category) =>{
      switch(category){
        case 'Hoa quả': return (<FruitsIcon/>) ;
        case 'Nguyên liệu': return (<DairyIcon/>);
        case 'Món ngon hôm nay': return(<CookingIcon/>);
        case 'Rau xanh': return(<CareIcon/>);
        case 'Cá tươi và Hải sản': return(<FishfishIcon/>);
        case 'Thịt tươi sống': return(<FistIcon/>);
        default: return (<FistIcon/>)
      }
  }
  
  return (
    <div className={isClick ? "Category category-active" : "Category"}>
       {/* <Menu
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
        </Menu> */}
      <ul>
        { category.map(item => 
          <li key={item} className="my-3" onClick={() => setCategory(item)}>
            {iconCategory(item)}
            <Link 
              to="/"
              className={filters._category === item ? 'active' : null}
            >
              {item}
            </Link>
          </li>
        )}
      </ul>
      <Burger isClick={isClick} handleCatClick={handleCatClick} />
    </div>
  );
}

export default Category;