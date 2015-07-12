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
							interpolation: 	'cardinal',
					}

		var home_data = [100, 400, 200, 500, 300, 600, 1050];

		chartLineBlinkingDots(home_data, args);
});

