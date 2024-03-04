import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

<<<<<<< HEAD
const Category = (props) => {
=======
const Category = ({ data, height }) => {
>>>>>>> main
    useEffect(() => {
        AmCharts.makeChart('pie-chart', {
            type: 'pie',
            theme: 'light',
<<<<<<< HEAD
            radius: '40%',
            dataProvider: [
                { Category: 'Đồ gia dụng', Sales: 100 },
                { Category: 'Thực phẩm', Sales: 124 },
                { Category: 'Giải khát', Sales: 142 },
                { Category: 'Vệ sinh', Sales: 194 }
            ],
=======
            radius: '50%',
            dataProvider: data,
>>>>>>> main
            valueField: 'Sales',
            titleField: 'Category',
            startDuration: 0.5,
            labelRadius: -40, // Đặt nhãn dữ liệu bên trong các phần của biểu đồ
            labelText: "[[percents]]%", // Chỉ hiển thị phần trăm trên nhãn
            balloonText: "[[title]]: [[percents]]% ([[value]])", // Thông tin hiển thị khi hover
            legend: {
                position: 'bottom',
                align: "center", // Căn giữa chú thích
<<<<<<< HEAD
                marginBottom: 20,
                autoMargins: false,
=======
                autoMargins: true,
>>>>>>> main
                valueText: "" // Không hiển thị giá trị trong chú thích
            },
            export: {
                enabled: true
            },
            colors: ['#FFC0CB', '#FFD700', '#3CB371', '#00BFFF'],
            responsive: {
                enabled: true
            }
        });
<<<<<<< HEAD
    }, []);

    return <div id="pie-chart" style={{ width: '100%', height: props.height }} />;
=======
    }, [data]);

    return <div id="pie-chart" className="pie-chart" style={{ width: '100%', height: height }} />;
>>>>>>> main
};

export default Category;
