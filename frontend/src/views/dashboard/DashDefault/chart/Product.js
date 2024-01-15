import React, { useEffect } from 'react';
import AmCharts from '@amcharts/amcharts3-react';

const Product = ({ data, height }) => {
    // Example data structure, replace with actual product sales data

    useEffect(() => {
        AmCharts.makeChart('bar-chart2', {
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
                    return +Math.round(value);
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
                title: 'Total Sales:',
                valueField: 'TotalSales',
                legendValueText: '[[value]]',
                balloonText: "[[category]]: <b>[[value]]</b>"
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
    }, [data]);

    return <div id="bar-chart2" className="bar-chart2" style={{ width: '100%', height: height }} />;
};

export default Product;