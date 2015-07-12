


chartLineBlinkingDots = function(data, args) {

	var width = args.width - args.margin.left - args.margin.right,
			height = args.height - args.margin.top - args.margin.bottom;

	var x = d3.scale.linear()
						.domain([0,6])
						.range([0, width - 20]);

	var y = d3.scale.linear()
						.domain([0, d3.max(data)])
						.range([height, 20]);

	var yAxis = d3.svg.axis().scale(y)
								.orient('left')
								.ticks(5);

	var valueLine = d3.svg.line()
										.interpolate(args.interpolation)
										.x(function(d, i) { return (x(i) + 10); })
										.y(function(d) { return y(d); })

	var svg = d3.select(args.elementById)
							.append('svg')
								.attr('width', args.width)
								.attr('height', args.height)
							.append('g')


	// Draw a line
	svg.append("path")
		.attr("d", valueLine(data));

	// Add circles 


}


