import React, { useEffect } from 'react';
import AmCharts from '@amcharts/amcharts3-react';

const Product = (props) => {
    // Example data structure, replace with actual product sales data
    const data = [
        { Product: 'Product A', TotalSales: 64 },
        { Product: 'Product B', TotalSales: 75 },
        { Product: 'Product C', TotalSales: 54 },
        { Product: 'Product D', TotalSales: 64 },
        { Product: 'Product E', TotalSales: 75 },
        { Product: 'Product F', TotalSales: 54 },
        { Product: 'Product G', TotalSales: 62 },
        { Product: 'Product H', TotalSales: 98 },
        { Product: 'Product I', TotalSales: 87 },
        { Product: 'Product J', TotalSales: 123 }
    ];

    useEffect(() => {
        AmCharts.makeChart('bar-chart', {
            type: 'serial',
            theme: 'light',
            rotate: true, // Rotate the chart to make bars horizontal
            valueAxes: [{
                id: 'v1',
                position: 'left', // Change to left for horizontal bar
                axisAlpha: 0,
                lineAlpha: 0,
                autoGridCount: false,
                labelFunction: function (value) {
                    return +Math.round(value) + 'M';
                },
                title: "Total Sales"
            }],
            graphs: [{
                id: 'g1',
                valueAxis: 'v1',
                lineColor: '#a389d4',
                fillColors: '#a389d4',
                fillAlphas: 1,
                type: 'column',
                title: 'Total Sales',
                valueField: 'TotalSales',
                legendValueText: '[[value]]M',
                balloonText: "[[category]]: <b>[[value]]M</b>"
            }],
            chartCursor: {
                pan: true,
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                cursorAlpha: 0,
                valueLineAlpha: 0.2
            },
            categoryField: 'Product', // Category field is now Product
            categoryAxis: {
                position: 'bottom', // Adjust position for horizontal layout
                dashLength: 1,
                gridAlpha: 0,
                axisAlpha: 0,
                lineAlpha: 0,
                minorGridEnabled: true
            },
            legend: {
                useGraphSettings: true,
                position: 'top'
            },
            balloon: {
                borderThickness: 1,
                shadowAlpha: 0
            },
            dataProvider: data
        });
    }, []);

    return <div id="bar-chart" style={{ width: '100%', height: props.height }} />;
};

export default Product;