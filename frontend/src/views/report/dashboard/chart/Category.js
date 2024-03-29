import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

const Category = ({ data, height }) => {
    useEffect(() => {
        AmCharts.makeChart('pie-chart', {
            type: 'pie',
            theme: 'light',
            radius: '50%',
            dataProvider: data,
            valueField: 'Sales',
            titleField: 'Category',
            startDuration: 0.5,
            labelRadius: -40, // Đặt nhãn dữ liệu bên trong các phần của biểu đồ
            labelText: "[[percents]]%", // Chỉ hiển thị phần trăm trên nhãn
            balloonText: "[[title]]: [[percents]]% ([[value]])", // Thông tin hiển thị khi hover
            legend: {
                position: 'bottom',
                align: "center", // Căn giữa chú thích
                autoMargins: true,
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
    }, [data]);

    return <div id="pie-chart" className="pie-chart" style={{ width: '100%', height: height }} />;
};

export default Category;
