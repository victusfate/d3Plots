var fs = require('fs');

// had to duplicate this object from plotKeyFrames.js
var Item = function(iType, start, end) {
  this.init(iType,start,end);
}

Item.prototype.init = function(iType, start, end) {
  this.iType = iType;
  this.start = start;
  this.end = end;
}

var minFrame = function(items) {
  var min = 1e9;
  for (var i in items) {
    if (items[i].start < min) {
      min = items[i].start;
    }
  }
  return min;
}

var maxFrame = function(items) {
  var max = -1;
  for (var i in items) {
    if (items[i].end > max) {
      max = items[i].end;
    }
  }
  return max;
}

var AllItemsMinMax = function(itemStates) {
  var min=1e9,max=-1e9;
  for (var j in itemStates) {
    var items = itemStates[j];
    var jmin = minFrame(items);
    var jmax = maxFrame(items);
    min = jmin < min ? jmin : min;
    max = jmax > max ? jmax : max;
  }
  return { amin : min, amax : max };
}


var createKeyFramePlot = function(ofile,itemStates,stateTitles) {

  var markup =   
    [ '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '  <title>Time Key Frame Plot</title>',
      '  <script type="text/javascript" src="http://mbostock.github.com/d3/d3.js"></script>',
      '  <script type="text/javascript" src="plotKeyFrames.js"></script>',
      '  <style type="text/css">',
      '       svg {',
      '         shape-rendering: crispEdges;',
      '        }',
      '       #stackedbudget-chart line {',
      '         stroke: #000;',
      '       }',
      '       .rule line {',
      '         stroke: #eee;',
      '       }',
      '      #keyframe-chart {',
      '         float: left;',
      '       }',
      '      .BIG {',
      '         font-size: 250%;',
      '       }',      
      '  </style>',
      '</head>',
      '<body>',
      '  <center><h3><a name="s1">Keyframe Chart</a></h3></center>',
      '  <div id="keyframe-chart">',
      '    <script type="text/javascript">  '
      ].join('\n');

  
  var limits = AllItemsMinMax(itemStates);
  var amin = limits.amin;
  var amax = limits.amax;

  console.log('global min max',amin,amax);

  markup += 
    '\n      var itemStates = ' + JSON.stringify(itemStates) + ';\n';

  markup += 
    '\n      var stateTitles = ' + JSON.stringify(stateTitles) + ';\n';

  markup += '\n      plotKeyFrames(itemStates,' + amin + ',' + amax + ",stateTitles);\n";

  var markupFin = 
  [
    '    </script>',
    '    <br/>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');
  markup += markupFin;

  console.log('about to try writing to file',ofile);
  console.log('\nwith crazy markup\n');
  console.log(markup);

  fs.writeFile(ofile, markup, 'utf-8', function() {
    console.log('finished writing to',ofile);
  });
}
// example
var examplePlot = function() {
  var ofile = 'plotKeyFrames_test.html';
  var itemStates = [], stateTitles = [];


  var items = [];
  items.push(new Item('Dynamic.User.Name.Display',394,442));
  items.push(new Item('Dynamic.Montage.Soundtrack.Album',399,459));
  items.push(new Item('Dynamic.Montage.Soundtrack.Artist',399,459));
  items.push(new Item('Dynamic.Montage.Soundtrack.Title',399,459));
  items.push(new Item('Static.Media',460,515));

  itemStates.push(items);
  stateTitles.push("Initial Key Frames");


  var items2 = [];
  items2.push(new Item('Dynamic.User.Name.Display',883,931));
  items2.push(new Item('Dynamic.Montage.Soundtrack.Album',888,948));
  items2.push(new Item('Dynamic.Montage.Soundtrack.Artist',888,948));
  items2.push(new Item('Dynamic.Montage.Soundtrack.Title',888,948));
  items2.push(new Item('Static.Media',949,1004));

  itemStates.push(items2);
  stateTitles.push("Updated Key Frames");

  console.log('ofile before call',ofile);
  plot(ofile,itemStates,stateTitles);  
}

// examplePlot();

module.exports = {
  createKeyFramePlot: createKeyFramePlot
}