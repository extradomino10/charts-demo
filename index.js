var data = {"items":[{"name":"Amount","value":118.89977974034353,"porcentaje":7.5,"value1":58.195670076666424,"category":"Ene"},{"name":"Amount","value":139.85200003319318,"porcentaje":8.82,"value1":72.854998449087148,"category":"Feb"},{"name":"Amount","value":120.89090245343972,"porcentaje":7.62,"value1":62.839373642310306,"category":"Mar"},{"name":"Amount","value":138.84410921728303,"porcentaje":8.76,"value1":71.7279165425691,"category":"Abr"},{"name":"Amount","value":170.47489182702648,"porcentaje":10.75,"value1":83.993925198912621,"category":"May"},{"name":"Amount","value":142.65466391794965,"porcentaje":9.0,"value1":72.857591270541946,"category":"Jun"},{"name":"Amount","value":125.07179485064032,"porcentaje":7.89,"value1":60.6933955067498,"category":"Jul"},{"name":"Amount","value":134.2695987906169,"porcentaje":8.47,"value1":74.073225175202992,"category":"Ago"},{"name":"Amount","value":81.355645218763939,"porcentaje":5.13,"value1":38.030399490027655,"category":"Sep"},{"name":"Amount","value":131.0762910810015,"porcentaje":8.27,"value1":69.540256333323157,"category":"Oct"},{"name":"Amount","value":154.5288743336211,"porcentaje":9.75,"value1":85.909612225009155,"category":"Nov"},{"name":"Amount","value":127.61067823536726,"porcentaje":8.05,"value1":68.898189340899521,"category":"Dic"}],"series":[{"field":"value","name":"Minutes"},{"field":"value1","name":"Amount"}, {"field":"porcentaje","name":"Percent"}],"control":"stack","isLegend":true,"categories":"category","Formato":"N2"};

var serie = data.series[0];
var format = data.Formato;
var xvalues = _.pluck(data.items, 'category');

var yvalues = {}; 
/*_.each(data.series, serie => {
	yvalues[serie.field] = _.pluck(data.items, serie.field);
});*/

yvalues['value'] = _.pluck(data.items, 'value');

var d = {x: xvalues, y:yvalues, yformat: format};
document.getElementById("data").value = btoa(JSON.stringify(d));
document.getElementById("type").value = localStorage.getItem('chart_type') || 'Barra';
document.getElementById("theme").value = "dark";

if(localStorage.getItem('chart_mode') == 'mobile')
	document.querySelector('.container').style.width = '400px';