var WebCharts = {};

(function (namespace) {
    //"use strict";

    var chartColors = {
        blue: ['#2a77f4', '#5f37be', '#3eb9ff', '#3c17b6', '#7392c2', '#5f37be', '#1faeff', '#925cff'],
        red: ['#B81B1B', '#D39D09', '#FF2E12', '#FF981D', '#E56C19', '#C69408', '#FF1D77', '#E1B700', '#C27D4F'],
        random: ['#f6bc23', '#4485ef', '#b93258', '#bb3d23', '#ca2367', '#8823b7', '#237eca', '#239297']
    };

    var fontFam = 'Verdana';

    //Draws a Column, Bar or Line Chart
    function DrawCLB(obj) {
        var decimals = obj.decimals || 0;

        var selectedPattern = 'blue',
            fgcolor = '#FFF',
            fntWeight = 'lighter',
            unidad = obj.unidad || '';

        var xaxis = _(obj.data.x).map(function (val) { return val.substring(0, obj.xSplit) }),
            yaxis = _(obj.data.y.value).map(function (val) { return parseFloat(val) });


        var chart = new Highcharts.Chart({
            chart: {
                renderTo : obj.container,
                type: obj.type,
                width: obj.width || 400,
                height: obj.height || 280,
                backgroundColor: obj.bgcolor || null,
                plotBorderColor: obj.fgcolor || fgcolor,
                borderRadius: 0,
                marginTop: 60,
                spacingRight: 20,
                style: { fontFamily: fontFam }
            },
            colors: chartColors[selectedPattern],
            exporting: { enabled: false },
            legend: { enabled: false },
            title: {
                style: { color: fgcolor, fontWeight: fntWeight },
                align: 'left',
                text: obj.title
            },
            xAxis: {
                labels: { style: { color: fgcolor } },
                categories: xaxis
            },
            yAxis: {
                min: 0,
                labels: { style: { color: fgcolor } },
                title: {
                    style: { color: fgcolor, fontWeight: fntWeight },
                    text: obj.yLabel
                }
            },
            plotOptions: {
                column: { pointPadding: 0.2, borderWidth: 0 },
                bar: { pointPadding: 0.2, borderWidth: 0 }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //'<td style="padding:0"><b>{point.y:.1f} '+ unidad +'</b></td></tr>',
                    '<td style="padding:0"><b>{point.y} ' + unidad + '</b></td></tr>',
                footerFormat: '</table>',
                valueDecimals: decimals,
                shared: true,
                useHTML: true
            },
            series: [{
                name: obj.yLabel,
                data: yaxis
            }]

        });
    }

    //Draws a Pie Chart
    function DrawPie(obj) {
        var selectedPattern = 'blue',
            fgcolor = '#FFF',
            fntWeight = 'lighter',
            unidad = obj.unidad || '';

        var xaxis = _(obj.data.x).map(function (val) { return val }),
            yaxis = _(obj.data.y.value).map(function (val) { return parseFloat(val) });

        var pieData = _.zip(xaxis, yaxis);

        var chart = new Highcharts.Chart({
            chart: {
                renderTo : obj.container,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                width: obj.width || 600,
                height: obj.height || 400,
                backgroundColor: obj.bgcolor || null,
                plotBorderColor: obj.fgcolor || fgcolor,
                borderRadius: 0,
                style: { fontFamily: fontFam },
                spacingBottom: 8,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 1,
            },
            colors: chartColors[selectedPattern],
            exporting: { enabled: false },
            title: {
                style: { color: fgcolor, fontWeight: fntWeight },
                align: 'left',
                text: obj.title
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>',
                valueDecimals: 2
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderColor: null,
                    dataLabels: {
                        enabled: true,
                        color: fgcolor,
                        connectorColor: fgcolor,
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: obj.yLabel,
                data: pieData
            }]
        });
    }

    //Funciones a exponer
    namespace.DrawCLB = DrawCLB;
    namespace.DrawPie = DrawPie;

})(WebCharts);


// Little demo
var $datos = document.getElementById('data').value,
    datos = JSON.parse(atob($datos));


var controlId = 'graph';
    canvas = document.getElementById('canvas'),
    cntWi = parseInt(canvas.offsetWidth),
    cntHe = parseInt(canvas.offsetHeight) - 10;

var div = document.createElement('div');
div.id = controlId;
canvas.appendChild(div);

var type = document.getElementById('type').value;

if (type == 'Torta') {
    WebCharts.DrawPie({
        container: controlId,
        data: datos,
        xSplit: 3,
        xLabel: 'Xlabel',
        yLabel: 'Ylabel',
        title: 'Graph Z',
        bgcolor: '#444',
        height: cntHe,
        width: cntWi
    });
}
else {
    var _type = (type === 'Area')? 'line'
                :(type === 'Barra')? 'column' : 'bar';
    WebCharts.DrawCLB({
        container: controlId,
        type: _type,
        data: datos,
        xSplit: 3,
        xLabel: 'Xlabel',
        yLabel: 'Ylabel',
        title: 'Graph Z',
        bgcolor: '#444',
        height: cntHe,
        width: cntWi
    });
}


