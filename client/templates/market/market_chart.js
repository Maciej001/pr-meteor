Template.marketChart.onRendered(function(){

    var cPink = '#c61c6f',
        cOrange ='#ffb832',
        lOrange = '#FFDABD',
        cVeryLightOrange = '#FFF2E8';

    // Set options
    options = {
        element:        '#chart',
        margin:         { top: 100, right: 40, bottom: 50, left: 70 },
        width:          600,
        height:         500,
        interpolation: 'linear',
        colorScale:     [cOrange, cPink],
        chartTitle:     'PAYROLLS',
        xAxisTicks:     5,
        yAxisTicks:     10
    };
    
    var market =        Markets.findOne({}),
        lastTrade =     market.last || '',
        margin =        options.margin;

    // data formattig function: date -> 15:23:05
    var parseDate = d3.time.format("%H:%M:%S").parse;
    var formatTime = d3.time.format("%I:%M:%S %p");
        
    var width   = options.width,
        height  = options.height - margin.top  - margin.bottom;

    var make_x_axis = function(x){
      return d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(options.xAxisTicks)
    };
    
    var make_y_axis = function(y){
      return d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(options.yAxisTicks)
    };

    var svg = d3.select(options.element)
                .append('svg')
                    .attr('width',  options.width  + margin.left + margin.right)
                    .attr('height', options.height)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // Chart Title
    svg.append('text')
      .attr('x', 0)
      .attr('class', 'chart-title')
      .attr('y', ( 0 - margin.top/2 ))
      .attr('text-anchor', 'left')
      .text(options.chartTitle)

    // Est. Value

    var estValContainer = svg.append('text')
        .attr('x', 0)
        .attr('class', 'chart-text-light')
        .attr('y', ( 0 - margin.top/2 + 20))
        .attr('text-anchor', 'left')
    


    // Scaling to 
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

     var grid = svg.append('g')
                  .attr('class', 'grid')
                  .style("stroke-dasharray", ("6, 6"))

    // Scales
    var xAxis = d3.svg.axis()
                .orient('bottom')
                .tickSize(0)
                .ticks(options.xAxisTicks );

    var yAxis = d3.svg.axis()
                    .orient('left')
                    .ticks(options.yAxisTicks);

    // Tooltips 
    var div = d3.select("body").append("div")
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

    var my_line = svg.append("path")
                .attr('class', 'line');

    var x_axis = svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')');;

    var y_axis = svg.append('g')
                    .attr('class', 'y axis');


    var my_area = svg.append("path")
                        .attr('class', 'area');

    var circles = svg.append('g');

    Tracker.autorun(function(){
        // Dependency
        var estValue = Markets.findOne().estimatedValue;
            trades = Trades.find({ side: 'buy' }, { fields: { created_at: 1, price: 1, size: 1 } }).fetch();

        var min_y = d3.min(trades, function(d){ return d.price; }),
            max_y = d3.max(trades, function(d){ return d.price; });

        var area = d3.svg.area()
                        .x(function(d) { return x(d.created_at); })
                        .y0(height)
                        .y1(function(d) { return y(d.price); })
                            
        x.domain(d3.extent(trades, function(d){ return d.created_at; }))
        y.domain([1.05 * min_y - 0.05 * max_y, 1.05 * max_y - 0.05 * min_y]) // 5% margin top and bottom
                    
        xAxis.scale(x); 
        yAxis.scale(y);
                        
         grid.call(make_y_axis(y)
                    .tickSize( - width, 0, 0)
                    .tickFormat('')
                );
                        
        var line = d3.svg.line()
                        .x(function(d){ return x(d.created_at); })
                        .y(function(d){ return y(d.price); });
                    
        my_area.datum(trades)
            .attr("d", area);

        // EstimatedValue
        estValContainer.text('Est. Value: ' + estValue + ',000 ');
       
        my_line.datum('trades')
            .attr("d", line(trades));
            
        x_axis.call(xAxis);
        y_axis.call(yAxis);
        
        
        // circles.selectAll('circle')
        //         .data(trades)
        //         .enter()
        //     .append('circle')
        //         .attr('class', 'dot')
        //         .attr('r', 5)
        //         .attr('cx', function(d) { return x(d.created_at); })
        //         .attr('cy', function(d){ return y(d.price); })
        //         .on("mouseover", function(d) {
        //                 div.transition()
        //                     .duration(100)
        //                     .style('opacity', 0.8);
        //                 div.html(d.size + " contracts, " + " at " + d.price + ",000" + "<br/>" + "at " + formatTime(d.created_at))
        //                     .style('left', (d3.event.pageX - 80)+ 'px')
        //                     .style('top', (d3.event.pageY - 55) + 'px');
        //             })
        //         .on("mouseout", function(d){
        //                 div.transition()
        //                 .duration(500)
        //                 .style("opacity", 0)
        //             })

    }); // Tracker.autorun ends;

});