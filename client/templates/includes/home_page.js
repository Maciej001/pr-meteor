// Home Page chart
Template.homePage.onRendered(function() {
		var data = {
			labels: ['', '', '', '','' ,'',''],
			series: [
				[250, 400, 300, 450, 350, 500,950]
			]
		};

		var options = {
			showPoint: 		true,
			fullWidth: 		true,
			lineSmooth: 	true,
			low: 					100,
			axisY: {
				showGrid: 	true,
				low: 				100,
				high: 			1000,
				divisor: 		3,

			},
			chartPadding: {
				right: 20
			}
		};

		new Chartist.Line('#home-chart', data, options);
});