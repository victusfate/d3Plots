// client side-ish

/*
var Item = function(iType, start, end) {
  this.init(iType,start,end);
}

Item.prototype.init = function(iType, start, end) {
  this.iType = iType;
  this.start = start;
  this.end = end;
}

*/

var labelList = function(items) {
  var ll = [];
  for (var i in items) {
    ll.push(items[i].iType);
  }
  return ll;
}

var w = 815,
    h = 400,
    labelpad = 250;

var dT = 3000;


var plotKeyFrames = function(itemStates,minf,maxf,stateTitles) {

  var items = itemStates[0];

  var colorlist = ["maroon", "darkblue"];

  var x = d3.scale.linear().domain([minf - 10, maxf + 15]).range([0, w]);

  console.log('minf',minf,'maxf',maxf,'range',[0, w], 'x(minf)',x(minf),'x(maxf)',x(maxf));

  var freshDraw = function(options) {

    var y = d3.scale.ordinal().domain(d3.range(options.items.length)).rangeBands([0, h], .2);

    var oldChart = d3.select("#keyframe-chart").select("svg");
    oldChart.remove();

    // oldChart
    //  .transition()
    //     .duration(dT/2)
    //     .style("opacity", 0)
    //     .each('end', function() {
    //       oldChart.remove();
    //     });

    var vis = d3.select("#keyframe-chart")
      .append("svg:svg")
        .attr("width", w + labelpad + 40)
        .attr("height", h + 20)
      .append("svg:g")
        .attr("transform", "translate(20,0)");

    // d3 rules yo
    var rules = vis.selectAll("g.rule")
        .data(x.ticks(20))
      .enter().append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(" + x(d) + ", 0)"; });

    rules.append("svg:line")
        .attr("y1", h)
        .attr("y2", h + options.items.length)
        .attr("x1", labelpad)
        .attr("x2", labelpad)
        .attr("stroke", "black");

    rules.append("svg:line")
        .attr("y1", 0)
        .attr("y2", h)
        .attr("x1", labelpad)
        .attr("x2", labelpad)
        .attr("stroke", "white")


    rules.append("svg:text")
        .attr("y", h + 8)
        .attr("x", labelpad)
        .attr("dy", ".71em")
        .attr("text-anchor", "middle")
        .text(function(d) { return parseInt(d); });


    var bars = vis.selectAll("g.bar")
          .data(options.items)
        .enter().append("svg:g")
          .attr("class", "bar")
          .attr("transform", function(d, i) { return "translate(" + labelpad + "," + y(i) + ")"; });

    bars.append("svg:rect")
        .attr("fill", function(d, i) { return options.colorlist[i % 2]; } )   //Alternate colors
        .attr("x", function(d) { return x(d.start); })
        .attr("width", function(d) { return ( x(d.end) - x(d.start) ); } )
        .attr("height", y.rangeBand());

    bars.append("svg:text")
        .attr("x", 0)
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -6)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return options.labellist[i]; });

    var cLabel = vis.append("svg:text")
      .attr("class", "BIG")
      .attr("text-anchor", "right")
      .attr("x", w - 100)
      .attr("y", 20)
      .text(options.title);

    return ( { vis: vis, cLabel: cLabel } );
  }

  var redraw = function(options) {
      var y = d3.scale.ordinal().domain(d3.range(options.items.length)).rangeBands([0, h], .2);


      console.log('dT',options.dT,'actually delta',Date.now()-options.itime,'calling redraw for nitems',JSON.stringify(options.items));

      // fade out old chart label
      options.label
        .transition()
          .duration(options.dT/2)
          .style("opacity", 0)
          .each('end', function() {
            options.label
              .text(options.title)
              .transition()
                .duration(options.dT/2)
                .style("opacity", 1);
          });

      options.vis.selectAll(  "rect" )
        .data(options.items)
        .transition()
          .duration(options.dT)
        .attr(    "fill",   function(d, i)  { return options.colorlist[i % 2]; } )   //Alternate colors
        .attr(    "x",      function(d)     { return x(d.start); } )
        .attr(    "width",  function(d)     { return ( x(d.end) - x(d.start) ); } )
        .attr(    "height", y.rangeBand());
  }


  var iTimer = Date.now();

  var drawState = function(i, itemStates, opts) {

    if (i < itemStates.length) {

      var nitems = itemStates[i];
      var labellist = labelList(nitems);
      console.log('updated labellist',labellist);

      // old rubyism Bart got me hooked on. single arg, lots of hashed objects, easier to change
      var options = { vis: opts.vis, items: nitems, label: opts.cLabel, 
        title: stateTitles[i], itime: iTimer, dT : dT,
        labellist: labellist, colorlist: colorlist };

      redraw(options);
      i++;
      var delay = function() { 

        drawState(i, itemStates, opts); 


      }
      setTimeout(delay, options.dT);

    }
  }

  var options0 = { items: itemStates[0],
    title: stateTitles[0], itime: iTimer,
    labellist: labelList(itemStates[0]), colorlist: colorlist };

  var opts = freshDraw(options0);

  var options1 = { items: itemStates[1], 
    title: stateTitles[1], itime: iTimer,
    labellist: labelList(itemStates[1]), colorlist: colorlist };

  var delay0 = function() { 
    var opts = freshDraw(options1); 
    var delay1 = function() { drawState(2,itemStates, opts); }
    setTimeout(delay1, dT);  
  }

  setTimeout(delay0, dT);  

  



}

/*
// kinda cool to chain animations
options.label
  .transition()
    .duration(options.dT)
    .style("opacity", 0)
    .each('end', function() { 
      options.label
        .text(options.title)
        .transition()
          .duration(options.dT)
          .style("opacity", 1.0);
    });
*/

