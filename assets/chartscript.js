var WebCharts = {};

(function (namespace) {

    var theme = {
        light: { fontColor: '#444', axesColor: '#444', gridColor: '#ccc', bgColor: '#fff' },
        dark: { fontColor: '#fff', axesColor: '#fff', gridColor: '#666', bgColor: '#444' }
    };

    var chartPalette = {
        blue: ['#2a77f4', '#5f37be', '#3eb9ff', '#3c17b6', '#7392c2', '#5f37be', '#1faeff', '#925cff'],
        red: ['#B81B1B', '#D39D09', '#FF2E12', '#FF981D', '#E56C19', '#C69408', '#FF1D77', '#E1B700', '#C27D4F'],
        random: ['#2196f3', '#009688', '#ff9800', '#f44336', '#4caf50', '#ffc107', '#3f51b5', '#795548']
    };

    function GetGlobalOpts(themename, numbersFormat) {
        return {
            scaleLabel: "<%=FormatScale(value)%>",
            // Boolean - If we should show the scale at all
            showScale: true,
            // String - Colour of the scale line
            scaleLineColor: theme[themename].axesColor,
            // Boolean - Whether to show labels on the scale
            scaleShowLabels: true,
            // String - Scale label font colour
            scaleFontColor: theme[themename].fontColor,
            // Boolean - whether or not the chart should be responsive and resize when the browser does.
            responsive: true,
            // Boolean - Determines whether to draw tooltips on the canvas or not
            showTooltips: true,
            // String - Template string for single tooltips
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= FormatMoney(value, " + numbersFormat.substring(1) + " ) %>",
        };
    }


    function DrawBar(obj)
    {
        var global_options = GetGlobalOpts(obj.themename, obj.data.yformat);

        var bar_options = {
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: theme[obj.themename].gridColor,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: false,
            //Boolean - If there is a stroke on each bar
            barShowStroke: false,
        };

        // obj.data = {x:[], y:{serie1: [], serie2:[], serieN: []}}
        var index = -1;
        var data = {
            labels: _(obj.data.x).map(function (val) { return val.substring(0, obj.xsplit) }),
            datasets: _(obj.data.y).map(function (val, key) {
                index++;
                return {
                    label: key,
                    fillColor: GetPaletteColor(obj.palette, index),
                    highlightFill: GetPaletteColor(obj.palette, index, 0.8),
                    data: val
                }
            })
        }

        return new Chart(obj.context).Bar(data, _.extend(global_options, bar_options));
    }


    function DrawLine(obj)
    {
        var global_options = GetGlobalOpts(obj.themename, obj.data.yformat);

        var line_options = {
            scaleShowGridLines: true,
            scaleGridLineColor: theme[obj.themename].gridColor,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: false,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,
        };

        var index = -1;
        var data = {
            labels: _(obj.data.x).map(function (val) { return val.substring(0, obj.xsplit) }),
            datasets: _(obj.data.y).map(function (val, key) {
                index++;
                return {
                    label: key,
                    fillColor: GetPaletteColor(obj.palette, index, 0.2),
                    strokeColor: GetPaletteColor(obj.palette, index),
                    data: val
                }
            })
        }

        return new Chart(obj.context).Line(data, _.extend(global_options, line_options));
    }


    function DrawPie(obj)
    {
        var global_options = GetGlobalOpts(obj.themename, obj.data.yformat);

        var pie_options = {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: false,
            //String - The colour of each segment stroke
            segmentStrokeColor: "#fff",
            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,
        };

        // obj.data = {x:[], y:[]} _zip
        var ydata = _(obj.data.y).toArray(); // Devuelve [[],[],...,[]]
        var data = _(ydata[0]).map(function (val, i) {
            return {
                label: obj.data.x[i],
                color: GetPaletteColor(obj.palette, i),
                highlight: GetPaletteColor(obj.palette, i, 0.8),
                value: val
            }
        });
        

        return new Chart(obj.context).Pie(data, _.extend(global_options, pie_options));
    }


    function DrawStacked(obj)
    {
        var global_options = GetGlobalOpts(obj.themename, obj.data.yformat);

        var bar_options = {
            scaleShowGridLines: true,
            scaleGridLineColor: theme[obj.themename].gridColor,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: false,
            barShowStroke: false,
        };

        var index = -1;
        var data = {
            labels: _(obj.data.x).map(function (val) { return val.substring(0, obj.xsplit) }),
            datasets: _(obj.data.y).map(function (val, key) {
                index++;
                return {
                    label: key,
                    fillColor: GetPaletteColor(obj.palette, index),
                    highlightFill: GetPaletteColor(obj.palette, index, 0.8),
                    data: val
                }
            })
        }

        return new Chart(obj.context).StackedBar(data, _.extend(global_options, bar_options));
    }


    function FormatScale(num) {
        var output;

        if (num < 1000)
            output = num;
        else if (num >= 1000 && num < 1000000) {
            num = parseInt(num / 1000);
            output = num + 'K';
        }
        else if (num >= 1000000 && num < 1000000000) {
            num = parseInt(num / 1000000);
            output = num + 'M';
        }

        return output;
    }


    function FormatMoney(n, c, d, t)
    {
        //var n = this,
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }


    function HexToRgba(hex, alpha) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        /*return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;*/

        return ['rgba(',
            parseInt(result[1], 16), ',',
            parseInt(result[2], 16), ',',
            parseInt(result[3], 16), ',', alpha, ')'].join('');
    }


    function GetPaletteColor(palette, index, alpha)
    {
        var color = chartPalette[palette][index % 8];
        
        if (alpha)
            return HexToRgba(color, alpha);
        else
            return color;
    }

    //Funciones a exponer
    namespace.DrawBar = DrawBar;
    namespace.DrawPie = DrawPie;
    namespace.DrawLine = DrawLine;
    namespace.DrawStacked = DrawStacked;

    window.FormatScale = FormatScale;
    window.FormatMoney = FormatMoney;

})(WebCharts);

// Chart Background
var mytheme = document.getElementById('theme').value;
document.getElementsByTagName('body')[0].style.backgroundColor = (mytheme == 'light')? '#fff' : '#444';

// Get Data
var $datos = document.getElementById('data').value,
    datos = JSON.parse(atob($datos));

var wrap = document.getElementById('wrap'),
    cntWi = parseInt(wrap.offsetWidth),
    cntHe = parseInt(wrap.offsetHeight) - 25;

var canvas = document.getElementById('canvas');
canvas.setAttribute('width', cntWi + "px");
canvas.setAttribute('height', cntHe + "px");
canvas.style.marginTop = "10px";
canvas.style.marginLeft = "5px";

var ctx = canvas.getContext("2d"),
    myChart;

switch (document.getElementById('type').value)
{
    case 'Barra':
        myChart = WebCharts.DrawBar({
            context: ctx,
            data: datos,
            title: 'Graph',
            themename: mytheme,
            palette: 'random',
            xsplit: 3
        });
        break;

    case 'StackedBar':
        myChart = WebCharts.DrawStacked({
            context: ctx,
            data: datos,
            title: 'Graph',
            themename: mytheme,
            palette: 'random',
            xsplit: 3
        });
        break;

    case 'Area':
        myChart = WebCharts.DrawLine({
            context: ctx,
            data: datos,
            title: 'Graph',
            themename: mytheme,
            palette: 'random',
            xsplit: 3
        });
        break;

    case 'Torta':
        canvas.setAttribute('height', (cntHe - 70) + "px");
        canvas.style.marginTop = "15px";

        myChart = WebCharts.DrawPie({
            context: ctx,
            data: datos,
            title: 'Graph',
            themename: mytheme,
            palette: 'random'
        });

        var $legend = document.createElement('div');
        $legend.id = 'legend';
        $legend.innerHTML = myChart.generateLegend();
        wrap.appendChild($legend);

        break;
}

myChart.render();

// here fix 10px right margin
canvas.style.width = "calc(100% - 10px)";

var body = document.getElementsByTagName('body')[0],
    isRendered = false;

/*body.ontouchstart = function () {
    if (!isRendered) {
        myChart.render();
        isRendered = true;
    }
}*/


