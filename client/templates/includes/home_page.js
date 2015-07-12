// Home Page chart
Template.homePage.onRendered(function() {

		// Home Page chart
		var args = {
							elementById:	'#home-chart',
							width: 				600,
							height: 			400,
							margin: 	   	{ top: 		20,
															right: 	20,
															bottom: 20,
															left: 	20
														},
							interpolation: 	'basis',


					}

		var home_data = [200, 450, 150, 550, 250, 550, 1050];

		chartLineBlinkingDots(home_data, args);
});

