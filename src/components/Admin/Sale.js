import React, { useContext, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

import '../../css/Admin/Sale.css';
import { AdminContext } from '../../contexts/AdminContext';

const Sale = () => {
  const { orders, revenue } = useContext(AdminContext);
  const [ data, setData ] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => { 
    let temp = [];
    let result = [];
    for (const order of orders) {
      const parts = order.date.split(/[\s,]+/);
      const orderDay = new Date(parts[0] + ' ' + parts[1] + ' ' + parts[2]);
      temp.push({ month: orderDay.getMonth(), totalPrice: order.totalPrice });      
    }
    const months = temp.reduce((current, month) => {
      if(month.month in current) {
        current[month.month]++;
      } else {
        current[month.month] = 1;
      }
      return current;
    }, {});

    for (let i = 0; i <= 11; i++ ) {
      for (const month in months) {
        if (i === parseInt(month)) {
          result[i] = months[month];
          break;
        }
        result[i] = 0;
      }  
    }
   
    setData(result);

  }, [orders])

  const formatNumber = (value) => {
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

  const series = [{
    name: 'số đơn',
    data: data
  }];
  const options = {
    colors : ['rgba(3, 211, 181, 0.85)'],
    grid: {
      show: false
    },
    chart: {
      toolbar: {
        show: false
      },
      type: 'bar',
      height: 350,
      foreColor: 'rgb(22, 31, 106)'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          style: {
            fontSize: '16px',
          }
        },
        horizontal: false,
        columnWidth: '60%'
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      labels: {
        style: {
          fontSize: '15px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '16px'
        },
        formatter: (val) => {
          return Math.trunc(val)
        }
      }
    },
    fill: {
      opacity: 1,
      colors: ['rgba(3, 211, 181, 0.85)']
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
        formatter: undefined
      }
    }
  };
  return(
    <div className="Sale admin-col">
      <div className="header">
        <h3 className="bt-header">Lịch sử bán hàng</h3>
        <div className="total">{formatNumber(revenue)}đ</div>
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}

export default Sale;
