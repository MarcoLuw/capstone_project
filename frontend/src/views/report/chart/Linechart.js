import React, { useEffect } from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/themes/light';
import AmCharts from '@amcharts/amcharts3-react';

const Linechart = ({ id, data, height, categoryfield, valuefield}) => {
    useEffect(() => {
        // Create chart instance
        const chart = AmCharts.makeChart(id, {
            type: 'serial',
            theme: 'light',
            dataProvider: data, // Pass data to the chart
            categoryField: 'categoryfield',
            categoryAxis: {
                title: categoryfield,
                parseDates: true, // Enable parsing dates
                minPeriod: 'DD',  // Set minimum period for parsing dates
                gridPosition: 'start',
                minorGridEnabled: true // Enable minor grid lines for better visibility of dates
            },
            valueAxes: [{
                title: valuefield,
                labelFunction: function(value) {
                    return Math.round(value); // Ensure rounded values on the value axis
                },
                minimum: 0, // Set minimum value for the value axis if needed
            }],
            graphs: [{
                id: 'g1',
                valueField: 'valuefield',
                title: valuefield,
                bullet: 'round', // Add circular markers
                bulletSize: 8, // Set the size of the markers
                bulletBorderThickness: 1,
                lineColor: '#1C4E80',
                balloonText: "[[title]]<br /><b style='font-size: 130%'>[[value]]</b>",
                legendValueText: '[[value]]',
                lineThickness: 2
            }],
            chartCursor: {
                cursorAlpha: 0,
                zoomable: false,
                categoryBalloonDateFormat: 'MMM DD, YYYY'
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

        // Cleanup function to avoid memory leaks when the component unmounts
        return () => {
            if (chart) {
                chart.clear();
            }
        };
    }, [id, data, height, categoryfield, valuefield]); // Only re-run the effect if id, data, or height changes

    return <div id={id} style={{ width: '100%', height: height }} />;
};

export default Linechart;
