import {
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  transition, Format,
} from 'd3';

export const radar = () => {
  let margins;
  let width;
  let height;
  let data;
  let options;
  let id;
  let character;
  let color;
    
  const my = (selection) => {
    var cfg = {
      w: width, //Width of the circle
      h: height, //Height of the circle
      margin: margins, //{ top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 0, //How many levels or inner circles should there be drawn
      maxValue: 0, //What is the value that the biggest circle will represent
      labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, //The opacity of the area of the blob
      dotRadius: 4, //The size of the colored circles of each blog
      opacityCircles: 0.1, //The opacity of the circles of each blob
      strokeWidth: 2, //The width of the stroke around each blob
      roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10), //d3.scaleOrdinal().range(schemeCategory10)	//Color function
    };
    
    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
      for (var i in options) {
        if ('undefined' !== typeof options[i]) {
          cfg[i] = options[i];
        }
      } //for i
    } //if

    var maxValue = 110;
		
    var allAxis = data[0].map(function (i, j) {
        return i.axis;
      }), //Names of each axis
      total = allAxis.length, //The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
      Format = d3.format(''), //Percentage formatting
      angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    const t = transition().duration(500);

    //Initiate the radar chart SVG
    var svg = selection
      .select(id)
      .append('svg')
      .attr(
        'width',
        cfg.w + cfg.margin.left + cfg.margin.right
      )
      .attr(
        'height',
        cfg.h + cfg.margin.top + cfg.margin.bottom
      )
      .attr('class', 'radar' + id);

    //Append a g element
    var g = selection
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (cfg.w / 2 + cfg.margin.left) +
          ',' +
          (cfg.h / 2 + cfg.margin.top) +
          ')'
      );

    //Wrapper for the grid & axes
    var axisGrid = g
      .append('g')
      .attr('class', 'axisWrapper');

    //Draw the background circles
    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', function (d, i) {
        return (radius / cfg.levels) * d;
      })
      .style('fill', '#ffffff')
      .style('stroke', '#cccccc')
      .style('fill-opacity', cfg.opacityCircles);
    //	.style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', function (d) {
        return (-d * radius) / cfg.levels;
      })
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text(function (d, i) {
        return Format((maxValue * d) / cfg.levels);
      });

    //Create the straight lines radiating outward from the center
    var axis = axisGrid
      .selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');
    //Append the lines
    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function (d, i) {
        return (
          rScale(maxValue * 1.1) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr('y2', function (d, i) {
        return (
          rScale(maxValue * 1.1) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .attr('class', 'line')
      .style('stroke', '#848484')
      .style('stroke-width', '1px');

    //Append the labels at each axis
    axis
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr('y', function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .text(function (d) {
        return d;
      })
      .call(wrap, cfg.wrapWidth);
    
    //The radial line function
    var radarLine = d3
      .radialLine()
      .radius(function (d) {
        return rScale(d.value);
      })
      .angle(function (d, i) {
        return i * angleSlice;
      })
      .curve(d3.curveLinearClosed);

    //Create a wrapper for the blobs
    var blobWrapper = g
      .selectAll('.radarWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarWrapper');

    //Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', function (d, i) {
        return radarLine(d);
      })
      .style('fill', color)
      .style('fill-opacity', cfg.opacityArea)
      .on('mouseover', function (d, i) {
        //Dim all blobs
        d3.selectAll('.radarArea')
          .transition()
          .duration(200)
          .style('fill-opacity', 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition()
          .duration(200)
          .style('fill-opacity', 0.7);
      })
      .on('mouseout', function () {
        //Bring back all blobs
        d3.selectAll('.radarArea')
          .transition()
          .duration(200)
          .style('fill-opacity', cfg.opacityArea);
      });

    //Create the outlines
    blobWrapper
      .append('path')
      .attr('class', 'radarStroke')
      .attr('d', function (d, i) {
        return radarLine(d);
      })
      .style('stroke-width', cfg.strokeWidth + 'px')
    	.style('stroke', color)
      .style('fill', 'none');

    const positionCircles = (circles) => {
      circles
        .attr('cx', function (d, i) {
          return (
            rScale(d.value) *
            Math.cos(angleSlice * i - Math.PI / 2)
          );
        })
        .attr('cy', function (d, i) {
          return (
            rScale(d.value) *
            Math.sin(angleSlice * i - Math.PI / 2)
          );
        });
    };
    
    const initializeRadius = (circles) => {
      circles.attr('r', cfg.dotRadius);
    };

    const growRadius = (enter) => {
      enter.transition(t).attr('r', cfg.dotRadius);
    };

    //Append the circles
    const circles = blobWrapper
      .selectAll('.radarCircle')
      .data(function (d, i) {
        return d;
      })
      .join(
        (enter) =>
          enter
            .append('circle')
        		// .attr(color)
            .attr('class', 'radarCircle')
        		.attr('fill', color)
            .call(initializeRadius)
            .call(positionCircles)
            .call(growRadius),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .delay((d, i) => i * 10)
              .call(positionCircles)
          ),
        (exit) => exit.remove()
      );

    //invisable circles idk
    var blobCircleWrapper = g
      .selectAll('.radarCircleWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarCircleWrapper');

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper
      .selectAll('.radarInvisibleCircle')
      .data(function (d, i) {
        return d;
      })
      .enter()
      .append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.5)
      .attr('cx', function (d, i) {
        return (
          rScale(d.value) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr('cy', function (d, i) {
        return (
          rScale(d.value) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function (d, i) {
      	let newX =
          parseFloat(d3.select(this).attr('cx')) - 10;
        let newY =
          parseFloat(d3.select(this).attr('cy')) - 10;
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text('' + i.value + '')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseout', function () {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g
      .append('text')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    
    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr('y'),
          x = text.attr('x'),
          dy = parseFloat(text.attr('dy')),
          tspan = text
            .text(null)
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy + 'em');

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(' '));
          if (
            tspan.node().getComputedTextLength() > width
          ) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr(
                'dy',
                ++lineNumber * lineHeight + dy + 'em'
              )
              .text(word);
          }
        }
      });
    } //wrap
  };

  my.width = function (_) {
    return arguments.length ? ((width = +_), my) : width;
  };

  my.height = function (_) {
    return arguments.length ? ((height = +_), my) : height;
  };

  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.id = function (_) {
    return arguments.length ? ((id = _), my) : id;
  };

  my.options = function (_) {
    return arguments.length ? ((options = _), my) : options;
  };
  my.margins = function (_) {
    return arguments.length ? ((margins = _), my) : margins;
  };
  
   my.character = function (_) {
    return arguments.length ? ((character = _), my) : character;
  };
   my.color = function (_) {
    return arguments.length ? ((color = _), my) : color;
  };


  return my;
};
