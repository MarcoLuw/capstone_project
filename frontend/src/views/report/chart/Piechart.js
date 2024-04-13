import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

const Piechart = ({ id, data, height }) => {
    useEffect(() => {
        AmCharts.makeChart(id, {
            type: 'pie',
            theme: 'light',
            radius: '50%',
            dataProvider: data,
            valueField: 'valuefield',
            titleField: 'categoryfield',
            startDuration: 0,
            labelRadius: -40, // Đặt nhãn dữ liệu bên trong các phần của biểu đồ
            labelText: "[[percents]]%", // Chỉ hiển thị phần trăm trên nhãn
            balloonText: "[[title]]: [[percents]]% ([[value]])", // Thông tin hiển thị khi hover
            legend: {
                position: 'top',
                align: "center", // Căn giữa chú thích
                autoMargins: true,
                valueText: "" // Không hiển thị giá trị trong chú thích
            },
            export: {
                enabled: true
            },
            colors: ['#7E909A', '#1C4E80', '#A5D8DD', '#EA6A47', '#0091D5', '#F1F1F1', '#202020'],

            responsive: {
                enabled: true
            }
        });
    }, [id, data, height]);

    return <div id={id} style={{ width: '100%', height: height }} />;
};

export default Piechart;
