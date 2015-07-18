Template.marketChart.onRendered(function(){
  
    var trades = Trades.find({ side: 'buy' }).fetch();
    var market = Markets.findOne({});

    var cPink = '#c61c6f',
        cOrange ='#ffb832',
        lOrange = '#FFDABD',
        cVeryLightOrange = '#FFF2E8';

    // Set options
    options = {
        element:        '#chart',
        margin:         { top: 60, right: 0, bottom: 30, left: 50 },
        width:          600,
        height:         400,
        interpolation: 'linear',
        colorScale:     [cOrange, cPink],
        chartTitle:     'Payrolls',
        xAxisTicks:     5,
        yAxisTicks:     10
    };
    
    simpleLineChart = function(data, options) {

        // data formattig function: date -> 15:23:05
        var parseDate = d3.time.format("%H:%M:%S").parse;

        var data = _.map(data, function(d) {
                        return {
                                    time:       d.created_at,
                                    price:      d.price,
                                    size:       d.size
                                }
                    });

        var margin = options.margin;
        
        var width   = options.width  - margin.left - margin.right,
            height  = options.height - margin.top  - margin.bottom;

        var min_y = d3.min(data, function(d){ return d.price; }),
            max_y = d3.max(data, function(d){ return d.price; });
            
        var x = d3.time.scale()
                    .domain(d3.extent(data, function(d){ return d.time; }))
                    .range([0, width]);
    
        var y = d3.scale.linear()
                    .domain([1.05 * min_y - 0.05 * max_y, 1.05 * max_y - 0.05 * min_y]) // 5% margin top and bottom
                    .range([height, 0]);

        var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('bottom')
                        .ticks(options.xAxisTicks );
                        
        var yAxis = d3.svg.axis().scale(y)
                        .orient('left')
                        .ticks(options.yAxisTicks);
                        
        var line = d3.svg.line()
                        .x(function(d){ return x(d.time); })
                        .y(function(d){ return y(d.price); });
                    
        var svg = d3.select(options.element)
                    .append('svg')
                        .attr('width',  options.width  + margin.left + margin.right)
                        .attr('height', options.height + margin.top  + margin.bottom)
                    .append('g')
                        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    
        svg.append("path")
            .attr("d", line(data));
            
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
        
        svg.append('g')
            .selectAll('circle')
                .data(data)
                .enter()
            .append('circle')
                .attr('r', 5)
                .attr('cx', function(d) { return x(d.time); })
                .attr('cy', function(d){ return y(d.price); })
                
        // Chart Title
        svg.append('text')
          .attr('x', (width/2))
          .attr('class', 'chart-title')
          .attr('y', ( 0 - margin.top/2 ))
          .attr('text-anchor', 'middle')
          .text(options.chartTitle)
        
        // Gridlines - add two additional axes with stroke-width:0, but ticks spreading width and 
        // height of the chart.
        // svg.append('g')
        //   .attr('class', 'grid')
        //   .attr('transform', 'translate(0, ' + options.height + ')')
        //   .call(make_x_axis(x)
        //           .tickSize(-options.height)
        //           .tickFormat('')
        //     )
        
        // svg.append('g')
        //   .attr('class', 'grid')
        //   .call(make_y_axis(y)
        //           .tickSize( - width, 0, 0)
        //           .tickFormat('')
        //    )
        
    }; // end of function
  
    var make_x_axis = function(x){
      return d3.svg.axis()
                .scale(x_time)
                .orient('bottom')
                .ticks(options.xAxisTicks)
    };
    
    var make_y_axis = function(y){
      return d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(options.yAxisTicks)
    };
    
    // Draw a chart
    simpleLineChart(trades,  options);
});