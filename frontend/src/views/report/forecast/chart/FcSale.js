import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

const ForecastSale = (props) => {
    useEffect(() => {
        AmCharts.makeChart(props.id, {
            type: 'serial',
            theme: 'light',
            dataProvider: [
                { Year: '01/11', ActualSales: 31},
                { Year: '08/11', ActualSales: 39},
                { Year: '15/11', ActualSales: 34 },
                { Year: '22/11', ActualSales: 42 },
                { Year: '29/11', ActualSales: 36},
                { Year: '06/12', ActualSales: 54},
                { Year: '13/12', ActualSales: 27},
                { Year: '20/12', ActualSales: 32, PredictSales: 32},
                { Year: '27/12', PredictSales: 46}
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
    }, [props.id, props.height]); 

    return <div id={props.id} style={{ width: '100%', height: props.height }} />;
};

export default ForecastSale;