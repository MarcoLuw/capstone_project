import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

const ForecastSale = (props) => {
    useEffect(() => {
        AmCharts.makeChart('line-chart', {
            type: 'serial',
            theme: 'light',
            dataProvider: [
                { Year: '2017', ActualSales: 63},
                { Year: '2018', ActualSales: 86},
                { Year: '2019', ActualSales: 64 },
                { Year: '2020', ActualSales: 75 },
                { Year: '2021', ActualSales: 54, PredictSales: 54 },
                { Year: '2022', PredictSales: 67 },
                { Year: '2023', PredictSales: 87 }
            ],
            categoryField: 'Year',
            categoryAxis: {
                gridPosition: 'start'
            },
            valueAxes: [{
                title: "TotalSales",
                labelFunction: function (value) {
                    return +Math.round(value) + 'M';
                },
                minimum: 0, // Đặt giá trị nhỏ nhất cho trục giá trị nếu cần
            }],
            graphs: [
                {
                    id: 'g1',
                    title: 'Actual Sales',
                    valueField: 'ActualSales',
                    bullet: 'round',
                    bulletBorderThickness: 1,
                    lineColor: '#2ca02c',
                    balloonText: "[[title]]<br /><b style='font-size: 130%'>[[value]]M</b>",
                    legendValueText: '[[value]]M',
                    lineThickness: 2
                },
                {
                    id: 'g2',
                    title: 'Predicted Sales',
                    valueField: 'PredictSales',
                    bullet: 'round',
                    bulletBorderThickness: 1,
                    lineColor: '#ff7f0e',
                    lineThickness: 2,
                    balloonText: "[[title]]<br /><b style='font-size: 130%'>[[value]]M</b>",
                    legendValueText: '[[value]]M',
                    fillAlphas: 0.3
                }
            ],
            chartCursor: {
                cursorAlpha: 0,
                zoomable: false,
                categoryBalloonDateFormat: 'YYYY'
            },
            legend: {
                useGraphSettings: true,
                align: 'center',
                position: 'top'
            },
            export: {
                enabled: true
            }
        });
    }, [props.height]); // Add props.height as a dependency to re-render chart if height changes

    return <div id="line-chart" style={{ width: '100%', height: props.height }} />;
};

export default ForecastSale;