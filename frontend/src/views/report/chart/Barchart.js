import React, { useEffect } from 'react';
import AmCharts from '@amcharts/amcharts3-react';

const Barchart = ({ id, data, height, categoryfield, valuefield}) => {

    useEffect(() => {
        AmCharts.makeChart(id, {
            type: 'serial',
            theme: 'light',
            rotate: true, // Rotate the chart to make bars horizontal
            valueAxes: [{
                id: 'v1',
                title: valuefield,
                position: 'left', // Change to left for horizontal bar
                axisAlpha: 0,
                lineAlpha: 0,
                autoGridCount: false,
                labelFunction: function (value) {
                    return +Math.round(value);
                }
            }],
            graphs: [{
                id: 'g1',
                valueAxis: 'v1',
                lineColor: '#1C4E80',
                fillColors: '#1C4E80',
                fillAlphas: 1,
                type: 'column',
                valueField: 'valuefield',
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
            categoryField: 'categoryfield', 
            categoryAxis: {
                position: 'bottom', 
                title: categoryfield,
                dashLength: 1,
                gridAlpha: 0,
                axisAlpha: 0,
                lineAlpha: 0,
                minorGridEnabled: true
            },
            // legend: {
            //     useGraphSettings: true,
            //     position: 'top'
            // },
            balloon: {
                borderThickness: 1,
                shadowAlpha: 0
            },
            dataProvider: data
        });
    }, [id, data, height, categoryfield, valuefield]);

    return <div id={id} style={{ width: '100%', height: height }} />;
};

export default Barchart;