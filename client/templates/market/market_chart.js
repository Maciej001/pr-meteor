Template.marketChart.onRendered(function(){
  
    var trades = Trades.find({ side: 'buy' }).fetch();
    var market = Markets.findOne({});

    var cPink = '#c61c6f',
        cOrange ='#ffb832',
        lOrange = '#FFDABD',
        cVeryLightOrange = '#FFF2E8';
    
    // Get data
    var data = _.map(trades, 
                    function(trade) {
                        return {
                            timeStamp:  trade.created_at,
                            size:       trade.size,
                            price:      trade.price
                        }
                    }
                );

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
        
        // map timeStamps to the range [0,1]
        // myData is used for drawing a chart, whereas original data is used for xAxes to display dates
        var myData = _.map(data, function(d) {
            var start_end_date = d3.extent(data, function(d) {return d.timeStamp});
            
            var start_date = start_end_date[0];
            var last_date  = start_end_date[1];
            
            return {
                time:       (d.timeStamp - start_date)/(last_date - start_date),
                price:      d.price,
                size:       d.size
            }
        });


        // Add market estimated value as first point in chart if exists
        if (!!market.estimatedValue){
            myData.unshift({
                time:       0,
                price:      market.estimatedValue,
                size:       0
            });
        }
    
        var min_y = d3.min(data, function(d){ return d.price; }),
            max_y = d3.max(data, function(d){ return d.price; });

        
        var myColors = d3.scale.linear()
                        .domain(d3.extent(data, function(d) {return d.price}))
                        .range(options.colorScale);
        
        var width   = options.width - options.margin.left - options.margin.right,
            height  = options.height - options.margin.top - options.margin.bottom;
            
        var x = d3.scale.linear()
                    .domain(d3.extent(myData, function(d, i){ return i; }))
                    .range([0, width]);
                    
        var y = d3.scale.linear()
                    .domain([ min_y - 0.05 * (max_y - min_y) , max_y + 0.05 * (max_y - min_y) ])
                    .range([height + options.margin.top + options.margin.bottom, 0]);
            
        var xAxis = d3.svg.axis().scale(x)
                        .orient('bottom')
                        .ticks(options.xAxisTicks );
                        
        var yAxis = d3.svg.axis().scale(y)
                        .orient('left')
                        .ticks(options.yAxisTicks);
                        
        var valueline = d3.svg.line()
                            // .interpolate(options.interpolation)
                            .x(function(d, i){ return x(i); })
                            .y(function(d){ return y(d.price); });
                            
        var svg = d3.select(options.element)
                    .append('svg')
                        .attr('width', options.width + options.margin.left + options.margin.right)
                        .attr('height', options.height + options.margin.top + options.margin.bottom)
                    .append('g')
                        // set new (0, 0) for drawings that will come
                        .attr('transform', 'translate(' + options.margin.left + ', ' + options.margin.top + ')')
                    
        svg.append("path")
            .attr("d", valueline(myData));
            
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + options.height + ')')
            .call(xAxis)
            
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
        
        svg.append('g')
            .selectAll('circle')
                .data(myData)
                .enter()
            .append('circle')
                .style('fill', function(d) { return myColors(d.price) })
                .attr('r', 5)
                .attr('cx', function(d, i) { return x(i); })
                .attr('cy', function(d){ return y(d.price); })
                
        // Chart Title
        svg.append('text')
          .attr('x', (width/2))
          .attr('class', 'chart-title')
          .attr('y', ( 0 - options.margin.top/2 ))
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
    
    // Draw a chart
    simpleLineChart(data,  options);
});