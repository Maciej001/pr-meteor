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
        statistics =    Statistics.findOne({}),
        estValue =      market.estimatedValue || '',
        lastTrade =     statistics.last || '',
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


    Tracker.autorun(function(){

        // Dependency
        var trades = Trades.find({ side: 'buy' }, { fields: { created_at: 1, price: 1, size: 1 } }).fetch();

        var min_y = d3.min(trades, function(d){ return d.price; }),
            max_y = d3.max(trades, function(d){ return d.price; });
                            
        var x = d3.time.scale()
                    .domain(d3.extent(trades, function(d){ return d.created_at; }))
                    .range([0, width]);
    
        var y = d3.scale.linear()
                    .domain([1.05 * min_y - 0.05 * max_y, 1.05 * max_y - 0.05 * min_y]) // 5% margin top and bottom
                    .range([height, 0]);

        var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('bottom')
                        .tickSize(0)
                        .ticks(options.xAxisTicks );
                        
        var yAxis = d3.svg.axis().scale(y)
                        .orient('left')
                        .ticks(options.yAxisTicks);

        var area = d3.svg.area()
                        .x(function(d) { return x(d.created_at); })
                        .y0(height)
                        .y1(function(d) { return y(d.price); })
                        
        var line = d3.svg.line()
                        .x(function(d){ return x(d.created_at); })
                        .y(function(d){ return y(d.price); });
                    
        var div = d3.select("body").append("div")
                    .attr('class', 'tooltip')
                    .style('opacity', 0);



        svg.append("path")
            .datum(trades)
            .attr('class', 'area')
            .attr("d", area);

        svg.append('g')
          .attr('class', 'grid')
          .style("stroke-dasharray", ("6, 6"))
          .call(make_y_axis(y)
                  .tickSize( - width, 0, 0)
                  .tickFormat('')
           );

        svg.append("path")
            .attr('class', 'line')
            .attr("d", line(trades));
            
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
        
        svg.append('g')
            .selectAll('circle')
                .data(trades)
                .enter()
            .append('circle')
                .attr('class', 'dot')
                .attr('r', 5)
                .attr('cx', function(d) { return x(d.created_at); })
                .attr('cy', function(d){ return y(d.price); })
                .on("mouseover", function(d) {
                        div.transition()
                            .duration(100)
                            .style('opacity', 0.8);
                        div.html(d.size + " contracts, " + " at " + d.price + ",000" + "<br/>" + "at " + formatTime(d.created_at))
                            .style('left', (d3.event.pageX - 80)+ 'px')
                            .style('top', (d3.event.pageY - 55) + 'px');
                    })
                .on("mouseout", function(d){
                        div.transition()
                        .duration(500)
                        .style("opacity", 0)
                    })
                
        // Chart Title
        svg.append('text')
          .attr('x', 0)
          .attr('class', 'chart-title')
          .attr('y', ( 0 - margin.top/2 ))
          .attr('text-anchor', 'left')
          .text(options.chartTitle)

        // Est. Value
        if (estValue !== ''){
            svg.append('text')
                .attr('x', 0)
                .attr('class', 'chart-text-light')
                .attr('y', ( 0 - margin.top/2 + 20))
                .attr('text-anchor', 'left')
                .text('Est. Value: ' + estValue + ',000 ')
        }

    }); // Tracker.autorun ends;

});