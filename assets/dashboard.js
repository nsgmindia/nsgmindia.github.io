$("#share").click(function(){ $("#page-url").val(window.location.href); $("#popup").show(); });
$(document).keydown(function(e) { if (e.key === "Escape") { $("#popup").hide(); } });
$("#popup").click(function(e) { if (e.target === this) { $(this).hide(); } });
$("#copy").click(function(){
	var urlText = $("#page-url").val();
	navigator.clipboard.writeText(urlText).then(function() { $("#copy img").attr('src', 'assets/tick.png'); setTimeout(function(){ $("#copy img").attr('src', 'assets/copy.png'); }, 2000);	});
});
// $("#print").click(function() { window.print(); });
// $("#print").click(function(){
// 	ele = $("#dashboard")[0];
// 	options = {
// 		margin: 5, filename: 'Smart Metering Statistics.pdf',
// 		image: { type: 'jpeg', quality: 0.98 },
// 		html2canvas: { scale: 2, useCORS: true, scrollY: 0, width: 1600, windowWidth: 1600 },
// 		jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
// 	};
// 	html2pdf().set(options).from(ele).save();
// });
$('#print').on('click', function() {
	html2canvas($('#dashboard')[0], {scale: 2, useCORS: true, backgroundColor: null}).then(function(canvas) {
		const imageData = canvas.toDataURL("image/png");
		const pdf = new window.jspdf('p','pt','a4');
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const ratio = canvas.width/pdfWidth;
		const finalImgHeight = canvas.height/ratio;
		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalImgHeight);
		pdf.save('Smart Metering Statistics.pdf');
	});
});
function openDiv(evt, divid) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
	document.getElementById(divid).style.display = "block";
	evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();
$(document).ready(function() {
	$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1dI5zeiW_W3w8O6nb13AjrCR51fpnrujmRJyjqY8zBX8/values/Pivots?alt=json&majorDimension=columns&key=AIzaSyBo_nzKxFwcamkPnMMkNPx8ZJrRj852U6Y', function (data) {
		var data = data.values;
		function transpose(matrix) { let [row] = matrix; return row.map((value, column) => matrix.map(row => row[column])); }
		function intVal(i) { return typeof i === 'string' ? i.replace(/,/g, '') * 1 : typeof i === 'number' ? i : 0; }
		var tableIDs = ['csTable', 'caTable', 'dsTable', 'daTable', 'fsTable', 'faTable'];
		var csData = transpose([data[0].slice(1,-1),data[1].slice(1,-1),data[2].slice(1,-1)]);
		var caData = transpose([data[3].slice(1,-1),data[4].slice(1,-1),data[5].slice(1,-1)]);
		var dsData = transpose([data[6].slice(1,-1),data[7].slice(1,-1),data[8].slice(1,-1)]);
		var daData = transpose([data[9].slice(1,-1),data[10].slice(1,-1),data[11].slice(1,-1)]);
		var fsData = transpose([data[12].slice(1,-1),data[13].slice(1,-1),data[14].slice(1,-1)]);
		var faData = transpose([data[15].slice(1,-1),data[16].slice(1,-1),data[17].slice(1,-1)]);
		var counterData = [], yearlyData = [];
		[1,2,3].forEach(k => { counterData.push(intVal(data[33][k])); counterData.push(intVal(data[34][k])); counterData.push(intVal(data[35][k])); });
		['c','d','f'].forEach((e,idx) => {
			$('#'+e+'Sanc').html(counterData[idx*3]);
			$('.'+e+'Sanc').circleProgress({ value: 1, size: 100, thickness: 4, fill: {color: '#2563eb'}, startAngle: -1.63 });
			$('#'+e+'Award').html(counterData[idx*3+1]);
			$('.'+e+'Award').circleProgress({ value: counterData[idx*3+1]/counterData[idx*3], size: 80, thickness: 4, fill: {color: '#9333ea'}, startAngle: -1.63 });
			$('#'+e+'Inst').html(counterData[idx*3+2]);
			$('.'+e+'Inst').circleProgress({ value: counterData[idx*3+2]/counterData[idx*3], size: 60, thickness: 4, fill: {color: '#16a34a'}, startAngle: -1.63 });
			// $('#'+e+'Bal').html(counterData[idx*3]-counterData[idx*3+2]);
			// $('.'+e+'Bal').circleProgress({ value: 1-counterData[idx*3+2]/counterData[idx*3], size: 40, thickness: 4, fill: {color: '#f97316'}, startAngle: -1.63 });
		});
		$('.Count').each(function() {
			$(this).prop('Counter',0).animate({Counter:$(this).text()},{duration:2000,easing:'swing',step:(now)=>{$(this).text(Math.ceil(now).toLocaleString('en-IN'));}});
		});
		var countTotal = parseInt(counterData[2])+parseInt(counterData[5])+parseInt(counterData[8]);
		$('.bar1').html("Consumer <br>"+counterData[2].toLocaleString('en-IN'));
		$('.bar2').html("DT <br>"+counterData[5].toLocaleString('en-IN'));
		$('.bar3').html("Feeder <br>"+counterData[8].toLocaleString('en-IN'));
		$('.bar4').html(" = Total Deployed <br>"+countTotal.toLocaleString('en-IN'));
		yearlyData.push(data[37].slice(1,));
		yearlyData.push(data[38].slice(1,).map((ele) => {return intVal(ele);}));
		yearlyData.push(data[39].slice(1,).map((ele) => {return intVal(ele);}));
		yearlyData.push(data[40].slice(1,));
		yearlyData.push(data[41].slice(1,).map((ele) => {return intVal(ele);}));
		yearlyData.push(data[42].slice(1,).map((ele) => {return intVal(ele);}));
		yearlyData.push(data[43].slice(1,));
		yearlyData.push(data[44].slice(1,).map((ele) => {return intVal(ele);}));
		yearlyData.push(data[45].slice(1,).map((ele) => {return intVal(ele);}));
		createChart('#graph1', yearlyData.slice(0,3), 'Y-o-Y Smart Consumer Meters Installation');
		createChart('#graph2', yearlyData.slice(3,6), 'Y-o-Y Distribution Transformer Meters Installation');
		createChart('#graph3', yearlyData.slice(6,), 'Y-o-Y Feeder Meters Installation');
		tableIDs.forEach(e => {
			eval('var tableData = '+e[0]+e[1]+'Data');
			var header = (e[1].toLowerCase() == 's') ? 'Scheme' : 'Agency';
			$('#'+e).dataTable({paging:false, ordering:false, info:false, searching:false, data:tableData, columns:[{title:header},{title:'Sanctioned'},{title:'Installed'}], footerCallback: function (data, start, end, display) {
				var api = this.api();
				var sanctioned = api.column(1).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
				var installed = api.column(2).data().reduce(function (a, b) { return intVal(a) + intVal(b); }, 0);
				$('#'+e+' tfoot').html('<tr><th>Grand Total</th><th>'+sanctioned.toLocaleString('en-IN')+'</th><th>'+installed.toLocaleString('en-IN')+'</th></tr>');
			}});
		});
		Chart.defaults.font.family = "'Montserrat', Arial, sans-serif";
		function createChart(id,yData,chartTitle) {
			return new Chart($(id), {
				type: "bar", responsive: true, maintainAspectRatio: false,
				data: { datasets: [{label: "FY WISE", yAxisID: 'A', backgroundColor: '#58508d', data: yData[1], order: 2, barThickness: 5},{type: "line", label: "CUMULATIVE", fill: false, yAxisID: 'B', borderColor: '#ff7721', data: yData[2], order: 1}], labels: yData[0] },
				options: {
					plugins: {legend: { display: false }, title: { display: true, text: chartTitle, font: { size: 16, weight: 'bold'} }}, 
					scales: {
						x: { grid: { display: false }, title: { display: false }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
						A: { type: 'linear', position: 'left', title: { color: '#58508d', display: true, text: 'FY WISE' }, ticks: { color: '#58508d', autoSkip: true, callback: function(value, index, array) { return (value > 9999999) ? value/10000000 + 'Cr' : (value > 100000) ? value/100000 + 'L' : value/1000 +'K'; } } },
						B: { type: 'linear', position: 'right', title: { color: '#ff7721', display: true, text: 'ƎΛIꓕⱯꓶꓵWꓵƆ' }, ticks: { color: '#ff7721', autoSkip: true, min: 0, callback: function(value, index, array) { return (value > 9999999) ? value/10000000 + 'Cr' : (value > 100000) ? value/100000 + 'L' : value/1000 +'K'; } } } }	 
				}
			});
		}
		var stateTotal = [data[18].slice(3,-1)];
		stateTotal.push(data[30].slice(3,-1).map((ele)=>{return intVal(ele)}));
		$('path').each(function() {
			var val = intVal(stateTotal[1][stateTotal[0].indexOf($(this).attr('title'))]);
			var color = (val<=0)?'#ffffff':(val<100000)?'#fbf2c4':(val<500000)?'#ffc15d':(val<1000000)?'#eb99ad':(val<2000000)?'#369acc':(val<5000000)?'#9b92b5':(val<10000000)?'#667762':'#003f5c';
			$(this).css('fill', color);
		});
		var stateData = [data[18].slice(3,-1)];
		[19,20,21,22,23,24,25,26,27].forEach(idx => { stateData.push(data[idx].slice(3,-1).map((ele)=>{return intVal(ele)})); });
		var hoverData = [];
		stateData[0].forEach((ele,idx) => {
			hoverData.push('<span class="sancColor">– Smart Consumer Meters Sanctioned: <b>'+stateData[1][idx].toLocaleString('en-IN')+'</b><br>– Smart Consumer Meters Awarded: <b>'+stateData[2][idx].toLocaleString('en-IN')+'</b><br>– Smart Consumer Meters Installed: <b>'+stateData[3][idx].toLocaleString('en-IN')+'</b></span><br><span class="awardColor">– DT Meters Sanctioned: <b>'+stateData[4][idx].toLocaleString('en-IN')+'</b><br>– DT Meters Awarded: <b>'+stateData[5][idx].toLocaleString('en-IN')+'</b><br>– DT Meters Installed: <b>'+stateData[6][idx].toLocaleString('en-IN')+'</b></span><br><span class="balColor">– Feeder Meters Sanctioned: <b>'+stateData[7][idx].toLocaleString('en-IN')+'</b><br>– Feeder Meters Awarded: <b>'+stateData[8][idx].toLocaleString('en-IN')+'</b><br>– Feeder Meters Installed: <b>'+stateData[9][idx].toLocaleString('en-IN')+'</b></span>');
		});
		var tooltip = $('.infoBox');
		$("path").each(function(){
			$(this).on('mouseenter', function(){
				var dataInfo = '';
				var title = $(this).attr('title');
				if (jQuery.inArray(title, stateData[0]) != -1) { var idx = stateData[0].indexOf(title); dataInfo += hoverData[idx]; }
				tooltip.html('<h4 style="color: #2a5caa;">'+title+'</h4>'+dataInfo).show();
			}).on('mouseleave', function(){ tooltip.css({ 'left': 10, 'top': 10 }).hide(); });
		});
		tooltip.hide();
		$(document).on('mousemove', function(e){tooltip.css({ left: e.pageX+15, top: e.pageY+15 });});
		var topTable = [];
		topTable.push(transpose([data[47].slice(1,),data[48].slice(1,)]));
		topTable.push(transpose([data[53].slice(1,),data[54].slice(1,)]));
		['topTotal','topMonthly'].forEach((e,idx) => {
			$('.'+e).dataTable({paging:false, ordering:false, info:false, searching:false, data:topTable[idx], columns:[{title:'State/UT'},{title:'Deployed'}]});
		});
		$('.lastUpdated span').html(data[32][1]);
	});
	$('#tableConsumer thead tr th').addClass('bg-success');
	$('#tableConsumer .footer1 th').addClass('bg-success-footer1');
	$('#tableConsumer .footer2 th').addClass('bg-success-footer2');
	$('#tableDT thead tr th').addClass('bg-warning');
	$('#tableDT .footer1 th').addClass('bg-warning-footer1');
	$('#tableDT .footer2 th').addClass('bg-warning-footer2');
	$('#tableFeeder thead th').addClass('bg-danger');
	$('#tableFeeder .footer1 th').addClass('bg-danger-footer1');
	$('#tableFeeder .footer2 th').addClass('bg-danger-footer2');
	$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1dI5zeiW_W3w8O6nb13AjrCR51fpnrujmRJyjqY8zBX8/values/ImportedNewFormat?alt=json&key=AIzaSyBo_nzKxFwcamkPnMMkNPx8ZJrRj852U6Y', function(data) {
		var data = data.values, totalData = [];
		$('thead span').html(data[1][1]);
		var labels = ['nodalagency','state','discom','scheme','sanctionedp1','sanctionedp2','totalsanctioned','awarded', 'commencement', 'monthachievement','totalachievement', 'amisp','progress','type'];
		var columns = [{'data':'', render: function(data, type, row, meta) {return meta.row + 1},}, {'data':'nodalagency'}, {'data':'state'}, {'data':'discom'}, {'data':'scheme'}, {'data':'totalsanctioned',}, {'data':'awarded'}, {'data': 'commencement'}, {'data':'amisp'}, {'data':'monthachievement'}, {'data':'totalachievement'}, {'data':'progress', render: function(data) {return '<div class="pbar" title="'+parseInt(data)+'% deployed"><div role="progressbar" class="progress-bar-striped active" style="background-color: cornflowerblue; height: 0.75rem; border-radius: 100px; width: '+parseInt(data)+'%; max-width: 100%;"></div></div>'}},];
		for (var i = 3; i < data.length; i++) {totalData.push(JSON.parse(JSON.stringify(Object.assign(...labels.map((e, idx) => ({[e]: data[i][idx]}))))));}
		var consumerTable = totalData.filter(e => e.type == "Consumer");
		var dtTable = totalData.filter(e => e.type == "DT");
		var feederTable = totalData.filter(e => e.type == "Feeder");
		amisp(consumerTable);
		amisp(dtTable);
		amisp(feederTable);
		function amisp(table) {
			table.forEach(e => {
				var text = e['amisp'];
				if (e['amisp'].includes("Multiple")) {
					e['amisp'] = '<div class="tooltip">Multiple <span class="rarr">&mdash;</span> <span class="tooltiptext"><ol><li>'+e['amisp'].replace(/Multiple {/g,"").replace(/}/g,"").split(", ").join(", </li><li>")+'</li></ol></span></div>';
				}
			});
		}
		drawTable('tableConsumer', consumerTable, 'Smart Consumer Metering Status');
		drawTable('tableDT', dtTable, 'DT Metering Status');
		drawTable('tableFeeder', feederTable, 'Feeder Metering Status');
		function drawTable(id, table, exportTitle) {
			let title = exportTitle+' as on '+data[1][0];
			let source = 'Data downloaded from '+window.location.href+'. \r\nData sourced from National Smart Grid Mission. Verify data authenticity with NSGM.';
			$('#'+id).dataTable({data:table,'columns':columns,ordering:false,buttons:[{extend:'excel',title:title,messageTop:source,footer:true,exportOptions:{columns:[...Array(11).keys()]}},{extend:'pdf',orientation:'landscape',title:title,messageTop:source,footer:true,exportOptions:{columns:[...Array(11).keys()]}}],
				footerCallback: function(row, data, start, end, display) {
					var totals=[], api = this.api();
					var intVal = k => { return typeof k === 'string' ? k.replace(/,/g, '') * 1 : typeof k === 'number' ? k : 0; };
					[5, 6, 9, 10].forEach(e => {totals.push(api.column(e,{page:'current'}).data().reduce((a,b) => intVal(a)+intVal(b))); totals.push(api.column(e,{search:'applied'}).data().reduce((a,b) => intVal(a)+intVal(b)));});
					[...Array(8).keys()].forEach(i => $('.'+id[5]+i).html(totals[i].toLocaleString('en-IN')));
					$('.'+id[5]+'8').html('<div class="pbar" title="'+Math.round(100*totals[7]/totals[1])+'% deployed"><div role="progressbar" class="progress-bar-striped active" style="background-color: cornflowerblue; height: 0.75rem; border-radius: 100px; width: '+Math.round(100*totals[7]/totals[1])+'%; max-width: 100%;"></div></div>');
				},
			});
		}
		$('.ce').on('click', function() { $('#tableConsumer').DataTable().buttons(0).trigger(); });
		$('.cp').on('click', function() { $('#tableConsumer').DataTable().buttons(1).trigger(); });
		$('.de').on('click', function() { $('#tableDT').DataTable().buttons(0).trigger(); });
		$('.dp').on('click', function() { $('#tableDT').DataTable().buttons(1).trigger(); });
		$('.fe').on('click', function() { $('#tableFeeder').DataTable().buttons(0).trigger(); });
		$('.fp').on('click', function() { $('#tableFeeder').DataTable().buttons(1).trigger(); });
	});
	$(document).ready(function() {
		$(window).scroll(function() { if($(window).scrollTop()>100) {$('#backToTop').fadeIn(300)} else {$('#backToTop').fadeOut(300)} });
		$('#backToTop').click(function() {window.scrollTo({ top: 0, behavior: 'smooth' });});
	});
	if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
	$(document).ready(function () { $(window).scrollTop(0); });
	$(window).on('load', function () { $(window).scrollTop(0); });
});
