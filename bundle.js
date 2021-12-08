(function (d3$1) {
  'use strict';

  const menu = () => {
    let id;
    let labelText;
    let options;
    const listeners = d3$1.dispatch('change');
    
    const my = (selection) => {
      selection
        .selectAll('label')
        .data([null])
        .join('label')
        .attr('for', id)
        .text(labelText);

      selection
        .selectAll('select')
        .data([null])
        .join('select')
        .attr('id', id)
        .on('change', (event) => {
          listeners.call('change', null, event.target.value);
        })
        .selectAll('option')
        .data(options)
        .join('option')
        .attr('value', (d) => d.value)
        .text((d) => d.text);
    };

    my.id = function (_) {
      return arguments.length ? ((id = _), my) : id;
    };

    my.labelText = function (_) {
      return arguments.length
        ? ((labelText = _), my)
        : labelText;
    };

    my.options = function (_) {
      return arguments.length ? ((options = _), my) : options;
    };

    my.on = function () {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? my : value;
    };

    return my;
  };

  const {
    csv,
    select,
    scaleLinear,
    extent,
    axisLeft,
    axisBottom,
    zoom,
    event,
    format,
    min,
    max,
  } = d3;

  //////// SCATTER FUNCTIONS /////////
  const make_char_list = (d) => {
    const char_arr = [];
    d.forEach((element) => {
      char_arr.push({
        value: element.Name,
        text: element.Name,
      });
    });
    return char_arr;
  };

  const character_list = (data) => {
    try {
      const char_arr = make_char_list(data);
      return char_arr;
    } catch (err) {
      console.log(err);
    }
  };

  //////// RADAR FUNCTIONS ////////////

  // const character = 'A-Bomb';

  const make_array = (d) => {
    const my_array = [
      [
        { axis: 'Strength', value: d.Strength },
        { axis: 'Intelligence', value: d['Intelligence'] },
        { axis: 'Speed', value: d['Speed'] },
        { axis: 'Durability', value: d['Durability'] },
        { axis: 'Power', value: d['Power'] },
        { axis: 'Combat', value: d['Combat'] },
      ],
    ];
    return my_array;
  };

  const filter_row = (data, character) => {
    try {
      const filter = data.filter(
        (d) => d.Name === character
      )[0];
      return filter;
    } catch (err) {
      console.log(err);
    }
  };

  //fetching data every menu select
  const filter_data = (data, character) => {
    try {
      const filter = filter_row(data, character);
      const arr = make_array(filter);
      return arr;
    } catch (err) {
      console.log(err);
    }
  };


  var color = d3
    .scaleOrdinal()
    .range(['steelblue', 'steelblue', '#00A0B0']);

  const color_picker = (d) => {
      if (d.Side == 'good') {
        color = 'green';
      } else if (d.Side == 'bad') {
        color = 'darkred';
      } else {
        color = 'grey';
      }
      return color;
  };

  const parseRow = (d) => {
    d.Height = +d.Height;
    d.Weight = +d.Weight;
    d.Intelligence = +d.Intelligence_x;
    d.Strength = +d.Strength;
    d.Speed = +d.Speed;
    d.Durability = +d.Durability_x;
    d.Power = +d.Power;
    d.Combat = +d.Combat;
    d.Total = +d.Total;
    d.Name = d.Name;
    d.Side = d.Alignment_x;
    return d;
  };

  const scatterPlot = () => {
    let width;
    let height;
    let data;
    let xValue;
    let yValue;
    let xColName;
    let yColName;
    let xType;
    let yType;
    let Name;
    let Side;
    let Total;
    let MenuChar;
    let margin;

    var tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('color', 'green')
      .text('a simple tooltip');

    const my = (selection) => {
      const x = (xType === 'categorical'
        ? d3$1.scalePoint().domain(data.map(xValue)).padding(0.2)
        : d3$1.scaleLinear().domain([0, 110])
      ) //extent(data, xValue)
        .range([margin.left, width - margin.right]);

      const y = (yType === 'categorical'
        ? d3$1.scalePoint().domain(data.map(yValue)).padding(0.2)
        : d3$1.scaleLinear().domain([0, 110])
      ) //extent(data, yValue)
        .range([height - margin.bottom, margin.top]);

      const marks = data.map((d) => ({
        x: x(xValue(d)),
        y: y(yValue(d)),
        Name: Name(d),
        Side: Side(d),
        Total: Total(d),
      }));

      const Total_Max = d3$1.max(data, Total);
      const Total_Min = d3$1.min(data, Total);

       const colorPicker = (d) => {
        if (d.Name == MenuChar.Name) {
          return 'darkblue';
        } else {
          return color_picker(d);
        }
      };
      
      
      
      const strokePicker = (d) => {
        if (d.Name == MenuChar.Name) {
          return 'lightblue';
        } else if (d.Side == 'good') {
          return 'green';
        } else if (d.Side == 'bad') {
          return 'darkred';
        } else {
          return 'grey';
        }
      };

      // size by total value function!!
      const radius_size = (d) => {
        return (
          10 * ((d - Total_Min) / (Total_Max - Total_Min))
        );
      };
      const t = d3$1.transition().duration(500);

      const positionCircles = (circles) => {
        circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      };

      const initializeRadius = (circles) => {
        circles.attr('r', 0);
      };
      const growRadius = (enter) => {
        enter
          .transition(t)
          .attr('r', (d) => radius_size(d.Total));
      };

      const pick_opacity = (d) => {
        if (d.Name == MenuChar.Name) {
          return 1;
        } else {
          return 0.3;
        }
      };

      const create_color = (circles) => {
        circles.attr('fill', (d) => colorPicker(d));
        circles.attr('opacity', (d) => pick_opacity(d));
        circles.attr('stroke', (d) => strokePicker(d));
      };

      const voronoi = d3.Delaunay.from(
        marks,
        (d) => d.x,
        (d) => d.y
      ).voronoi([
        margin.left,
        margin.top,
        width - margin.right,
        height - margin.bottom,
      ]);

      const circles = selection
        .selectAll('circle')
        .data(marks)
        .join(
          (enter) =>
            enter
              .append('circle')
              .call(positionCircles)
              .call(initializeRadius)
              .call(create_color)
              .call(growRadius),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .delay((d, i) => i * 10)
                .call(positionCircles)
                .call(create_color)
            ),
          (exit) => exit.remove()
        );

      selection
        .append('g')
        .attr('class', 'voronoiWrapper')
        .selectAll('path')
        .data(marks)
        .join('path')
        .attr('opacity', 0.5)
        .attr('fill', 'none')
        .style('pointer-events', 'all')
        .attr('d', (d, i) => voronoi.renderCell(i))
        .on('mouseover', function (d, i) {
          tooltip
            .text(i.Name)
            .style('color', colorPicker(i.Side));
          return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function (d, i) {
          return tooltip
            .style('top', i.y + radius_size(i.Total)+ 'px')
            .style('left', i.x + 'px')
            .style('transform', 'translateX(-50%)');
        })
        .on('mouseout', () =>
          selection.selectAll('.tooltip').remove()
        );

      const y_label = selection
        .selectAll('.y-axis-label')
        .data([null])
        .join('text')
        .attr('class', 'y-axis-label')
        .attr('x', width - 415)
        .attr('y', height - 420)
        .text(yColName)
        .style('font-size', '18px')
        .attr('text-anchor', 'middle');

      const x_label = selection
        .selectAll('.x-axis-label')
        .data([null])
        .join('text')
        .attr('class', 'y-axis-label')
        .attr('x', width)
        .attr('y', height - 15)
        .text(xColName)
        .style('font-size', '18px')
        .attr('text-anchor', 'middle');

      const highlight_label = selection
        .selectAll('.highlight-label')
        .data([null])
      	.join('text')
        // .transition(t)  
        .attr('class', 'highlight-label')
        .attr('x', x(xValue(MenuChar)))
        .attr('y', y(yValue(MenuChar))+ + 15 + radius_size(MenuChar.Total))
        .text(MenuChar.Name)
        .style('font-size', '18px')
        .attr('text-anchor', 'middle')
      	.transition(t);
      
      selection
        .selectAll('.y-axis')
        .data([null])
        .join('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left},0)`)
        .transition(t)
        .call(d3$1.axisLeft(y));

      selection
        .selectAll('.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr(
          'transform',
          `translate(0,${height - margin.bottom})`
        )
        .transition(t)
        .call(d3$1.axisBottom(x));
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

    my.xValue = function (_) {
      return arguments.length ? ((xValue = _), my) : xValue;
    };

    my.yValue = function (_) {
      return arguments.length ? ((yValue = _), my) : yValue;
    };

    my.xType = function (_) {
      return arguments.length ? ((xType = _), my) : xType;
    };

    my.yType = function (_) {
      return arguments.length ? ((yType = _), my) : yType;
    };

    my.margin = function (_) {
      return arguments.length ? ((margin = _), my) : margin;
    };

    my.Name = function (_) {
      return arguments.length ? ((Name = _), my) : Name;
    };

    my.Total = function (_) {
      return arguments.length ? ((Total = _), my) : Total;
    };

    my.Side = function (_) {
      return arguments.length ? ((Side = _), my) : Side;
    };
    my.xColName = function (_) {
      return arguments.length
        ? ((xColName = _), my)
        : xColName;
    };
    my.yColName = function (_) {
      return arguments.length
        ? ((yColName = _), my)
        : yColName;
    };

    my.MenuChar = function (_) {
      return arguments.length
        ? ((MenuChar = _), my)
        : MenuChar;
    };

    return my;
  };

  const radar = () => {
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

      const t = d3$1.transition().duration(500);

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

  const {
    csv: csv$1,
    select: select$1,
    scaleLinear: scaleLinear$1,
    extent: extent$1,
    axisLeft: axisLeft$1,
    axisBottom: axisBottom$1,
    zoom: zoom$1,
    event: event$1,
    format: format$1,
    min: min$1,
    max: max$1,
  } = d3;

  /////////// DATA FUNCTIONS //////////////

  const csvUrl = [
    'https://gist.githubusercontent.com/',
    'LeahMitchell/', // User
    '8ad46fbcac8d7420bcd5b97b1a245f43/', // Id of the Gist
    'raw/19d28695ac561d95f3f5a091efd18c5ac6a396e3/', // commit
    'marvel_data.csv', // File name
  ].join('');

  const get_data = async () => {
    try {
      const data = await d3.csv(csvUrl, parseRow);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg_scatter = select$1('body')
    .append('svg')
    .attr('width', window.innerWidth * 0.6)
    .attr('height', window.innerHeight);

  const svg_radar = select$1('body')
    .append('svg')
    .attr('width', window.innerWidth * 0.4)
    .attr('height', window.innerHeight);

  const margin_scatter = {
    top: 100,
    right: 0,
    bottom: 60,
    left: 50,
  };

  const margin_radar = {
    top: 50,
    right: 50,
    bottom: 500,
    left: 50,
  };

  const menuContainer = select$1('body')
    .append('div')
    .attr('class', 'menu-container');

  const xMenu = menuContainer.append('div');
  const yMenu = menuContainer.append('div');
  const cMenu = menuContainer.append('div');

  const character = 'A-Bomb';

  /////////////// MAIN ///////////////

  const main = async () => {
    const data = await get_data();

    var filtered_char_row  = filter_row(data, character);
    
    const scatter = scatterPlot()
      .width(width / 2)
      .height(height)
      .data(data)
      .xValue((d) => d.Strength)
      .yValue((d) => d.Strength)
      .xColName('Strength')
      .yColName('Strength')
      .Name((d) => d.Name)
      .Total((d) => d.Total)
      .Side((d) => d.Alignment_x)
      .MenuChar(filtered_char_row)
      .margin(margin_scatter);

    svg_scatter.call(scatter);

    var radarChartOptions = {
      w: width * 0.25,
      h: height,
      margin: margin_radar,
      maxValue: 1,
      levels: 5,
      roundStrokes: true,
    };

    const rad = radar()
      .margins(margin_radar)
      .width(width * 0.5)
      .height(height)
      .data(filter_data(data, character))
      .options(radarChartOptions)
      .character(character)
      .color(color_picker(filtered_char_row))
      .id('.radarChart');

    svg_radar.call(rad);

    //// GRAPH TEXTS //////

    svg_radar
      .append('text')
      .attr('x', width / 4 - 75)
      .attr('y', height - 445)
      .text('Character: ' + character)
      .style('font-size', '20px')
      .attr('text-anchor', 'middle');

    svg_radar
      .append('text')
      .attr('x', width / 4 - 75)
      .attr('y', height - 420)
      .text(
        "Character's Total Power Score: " +
          filtered_char_row.Total
      )
      .style('font-size', '18px')
      .attr('text-anchor', 'middle');

    svg_radar
      .append('text')
      .attr('x', width / 4 - 75)
      .attr('y', height - 395)
      .text(
        'Total Power Rank: ' +
          filtered_char_row.rank +
          ' of 257 characters'
      )
      .style('font-size', '16px')
      .attr('text-anchor', 'middle');

    const options = [
      {
        value: 'Strength',
        text: 'Strength Score',
        type: 'quantitative',
      },
      {
        value: 'Intelligence',
        text: 'Intelligence Score',
        type: 'quantitative',
      },
      {
        value: 'Speed',
        text: 'Speed Score',
        type: 'quantitative',
      },
      {
        value: 'Durability',
        text: 'Durability Score',
        type: 'quantitative',
      },
      {
        value: 'Power',
        text: 'Power Score',
        type: 'quantitative',
      },
      {
        value: 'Combat',
        text: 'Combat Score',
        type: 'quantitative',
      },
    ];

    const char_list = character_list(data);

    const columnToType = new Map(
      options.map(({ value, type }) => [value, type])
    );
    options.forEach((option) => {
      columnToType.set(option.value, option.type);
    });

    // column is a string, corresponding to
    // the value property on metadata objects
    const getType = (column) => columnToType.get(column);

    xMenu.call(
      menu()
        .id('x-menu')
        .labelText('X:')
        .options(options)
        .on('change', (column) => {
          svg_scatter.call(
            scatter
              .xValue((d) => d[column])
              .xType(getType(column))
              .xColName(column)
          );
        })
    );
    yMenu.call(
      menu()
        .id('y-menu')
        .labelText('Y:')
        .options(options)
        .on('change', (column) => {
          svg_scatter.call(
            scatter
              .yValue((d) => d[column])
              .yType(getType(column))
              .yColName(column)
          );
        })
    );
    cMenu.call(
      menu()
        .id('x-menu')
        .labelText('Character:')
        .options(char_list)
        .on('change', (Name) => {
          
          filtered_char_row  = filter_row(data, Name);
          
          svg_radar.selectAll('*').remove();
          svg_radar.call(
            rad
              .data(filter_data(data, Name))
              .color(color_picker(filtered_char_row))
          );
          svg_radar
            .append('text')
            .attr('x', width / 4 - 75)
            .attr('y', height - 445)
            .text('Character: ' + Name)
            .style('font-size', '20px')
            .attr('text-anchor', 'middle');

          svg_radar
            .append('text')
            .attr('x', width / 4 - 75)
            .attr('y', height - 420)
            .text(
              "Character's Total Power Score: " +
                filtered_char_row.Total
            )
            .style('font-size', '18px')
            .attr('text-anchor', 'middle');

          svg_radar
            .append('text')
            .attr('x', width / 4 - 75)
            .attr('y', height - 395)
            .text(
              'Total Power Rank: ' +
                filtered_char_row.rank +
                ' of 257 characters'
            )
            .style('font-size', '16px')
            .attr('text-anchor', 'middle');

          svg_scatter.call(
            scatter.MenuChar(filter_row(data, Name))
          );
        })
    );
  };
  main();

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIm1lbnUuanMiLCJIZWxwZXJGdW5jdGlvbnMuanMiLCJzY2F0dGVyUGxvdC5qcyIsInJhZGFyLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGlzcGF0Y2ggfSBmcm9tICdkMyc7XG5leHBvcnQgY29uc3QgbWVudSA9ICgpID0+IHtcbiAgbGV0IGlkO1xuICBsZXQgbGFiZWxUZXh0O1xuICBsZXQgb3B0aW9ucztcbiAgY29uc3QgbGlzdGVuZXJzID0gZGlzcGF0Y2goJ2NoYW5nZScpO1xuICBcbiAgY29uc3QgbXkgPSAoc2VsZWN0aW9uKSA9PiB7XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCdsYWJlbCcpXG4gICAgICAuZGF0YShbbnVsbF0pXG4gICAgICAuam9pbignbGFiZWwnKVxuICAgICAgLmF0dHIoJ2ZvcicsIGlkKVxuICAgICAgLnRleHQobGFiZWxUZXh0KTtcblxuICAgIHNlbGVjdGlvblxuICAgICAgLnNlbGVjdEFsbCgnc2VsZWN0JylcbiAgICAgIC5kYXRhKFtudWxsXSlcbiAgICAgIC5qb2luKCdzZWxlY3QnKVxuICAgICAgLmF0dHIoJ2lkJywgaWQpXG4gICAgICAub24oJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICBsaXN0ZW5lcnMuY2FsbCgnY2hhbmdlJywgbnVsbCwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0pXG4gICAgICAuc2VsZWN0QWxsKCdvcHRpb24nKVxuICAgICAgLmRhdGEob3B0aW9ucylcbiAgICAgIC5qb2luKCdvcHRpb24nKVxuICAgICAgLmF0dHIoJ3ZhbHVlJywgKGQpID0+IGQudmFsdWUpXG4gICAgICAudGV4dCgoZCkgPT4gZC50ZXh0KTtcbiAgfTtcblxuICBteS5pZCA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKGlkID0gXyksIG15KSA6IGlkO1xuICB9O1xuXG4gIG15LmxhYmVsVGV4dCA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gKChsYWJlbFRleHQgPSBfKSwgbXkpXG4gICAgICA6IGxhYmVsVGV4dDtcbiAgfTtcblxuICBteS5vcHRpb25zID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICgob3B0aW9ucyA9IF8pLCBteSkgOiBvcHRpb25zO1xuICB9O1xuXG4gIG15Lm9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IGxpc3RlbmVycy5vbi5hcHBseShsaXN0ZW5lcnMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBsaXN0ZW5lcnMgPyBteSA6IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBteTtcbn07XG4iLCJjb25zdCB7XG4gIGNzdixcbiAgc2VsZWN0LFxuICBzY2FsZUxpbmVhcixcbiAgZXh0ZW50LFxuICBheGlzTGVmdCxcbiAgYXhpc0JvdHRvbSxcbiAgem9vbSxcbiAgZXZlbnQsXG4gIGZvcm1hdCxcbiAgbWluLFxuICBtYXgsXG59ID0gZDM7XG5cbi8vLy8vLy8vIFNDQVRURVIgRlVOQ1RJT05TIC8vLy8vLy8vL1xuZXhwb3J0IGNvbnN0IG1ha2VfY2hhcl9saXN0ID0gKGQpID0+IHtcbiAgY29uc3QgY2hhcl9hcnIgPSBbXTtcbiAgZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY2hhcl9hcnIucHVzaCh7XG4gICAgICB2YWx1ZTogZWxlbWVudC5OYW1lLFxuICAgICAgdGV4dDogZWxlbWVudC5OYW1lLFxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGNoYXJfYXJyO1xufTtcblxuZXhwb3J0IGNvbnN0IGNoYXJhY3Rlcl9saXN0ID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjaGFyX2FyciA9IG1ha2VfY2hhcl9saXN0KGRhdGEpO1xuICAgIHJldHVybiBjaGFyX2FycjtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufTtcblxuLy8vLy8vLy8gUkFEQVIgRlVOQ1RJT05TIC8vLy8vLy8vLy8vL1xuXG4vLyBjb25zdCBjaGFyYWN0ZXIgPSAnQS1Cb21iJztcblxuZXhwb3J0IGNvbnN0IG1ha2VfYXJyYXkgPSAoZCkgPT4ge1xuICBjb25zdCBteV9hcnJheSA9IFtcbiAgICBbXG4gICAgICB7IGF4aXM6ICdTdHJlbmd0aCcsIHZhbHVlOiBkLlN0cmVuZ3RoIH0sXG4gICAgICB7IGF4aXM6ICdJbnRlbGxpZ2VuY2UnLCB2YWx1ZTogZFsnSW50ZWxsaWdlbmNlJ10gfSxcbiAgICAgIHsgYXhpczogJ1NwZWVkJywgdmFsdWU6IGRbJ1NwZWVkJ10gfSxcbiAgICAgIHsgYXhpczogJ0R1cmFiaWxpdHknLCB2YWx1ZTogZFsnRHVyYWJpbGl0eSddIH0sXG4gICAgICB7IGF4aXM6ICdQb3dlcicsIHZhbHVlOiBkWydQb3dlciddIH0sXG4gICAgICB7IGF4aXM6ICdDb21iYXQnLCB2YWx1ZTogZFsnQ29tYmF0J10gfSxcbiAgICBdLFxuICBdO1xuICByZXR1cm4gbXlfYXJyYXk7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VfZGF0YSA9IChkKSA9PiB7XG4gIHJldHVybiB7XG4gICAgU3RyZW5ndGg6ICtkLlN0cmVuZ3RoLFxuICAgIEludGVsbGlnZW5jZTogK2QuSW50ZWxsaWdlbmNlX3gsXG4gICAgU3BlZWQ6ICtkLlNwZWVkLFxuICAgIER1cmFiaWxpdHk6ICtkLkR1cmFiaWxpdHlfeCxcbiAgICBQb3dlcjogK2QuUG93ZXIsXG4gICAgQ29tYmF0OiArZC5Db21iYXQsXG4gICAgTmFtZTogZC5OYW1lLFxuICAgIFNpZGU6IGQuQWxpZ25tZW50X3gsXG4gICAgVG90YWw6ICtkLlRvdGFsLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGZpbHRlcl9yb3cgPSAoZGF0YSwgY2hhcmFjdGVyKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZmlsdGVyID0gZGF0YS5maWx0ZXIoXG4gICAgICAoZCkgPT4gZC5OYW1lID09PSBjaGFyYWN0ZXJcbiAgICApWzBdO1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn07XG5cbi8vZmV0Y2hpbmcgZGF0YSBldmVyeSBtZW51IHNlbGVjdFxuZXhwb3J0IGNvbnN0IGZpbHRlcl9kYXRhID0gKGRhdGEsIGNoYXJhY3RlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcl9yb3coZGF0YSwgY2hhcmFjdGVyKTtcbiAgICBjb25zdCBhcnIgPSBtYWtlX2FycmF5KGZpbHRlcik7XG4gICAgcmV0dXJuIGFycjtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRvdGFsX3Bvd2VyID0gKGRhdGEsIGNoYXJhY3RlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcl9yb3coZGF0YSwgY2hhcmFjdGVyKVxuICAgIHJldHVybiBmaWx0ZXIuVG90YWw7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCByYW5rID0gKGRhdGEsIGNoYXJhY3RlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcl9yb3coZGF0YSwgY2hhcmFjdGVyKVxuICAgIHJldHVybiBmaWx0ZXIucmFuaztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufTtcblxuXG5leHBvcnQgdmFyIGNvbG9yID0gZDNcbiAgLnNjYWxlT3JkaW5hbCgpXG4gIC5yYW5nZShbJ3N0ZWVsYmx1ZScsICdzdGVlbGJsdWUnLCAnIzAwQTBCMCddKTtcblxuZXhwb3J0IGNvbnN0IGNvbG9yX3BpY2tlciA9IChkKSA9PiB7XG4gICAgaWYgKGQuU2lkZSA9PSAnZ29vZCcpIHtcbiAgICAgIGNvbG9yID0gJ2dyZWVuJztcbiAgICB9IGVsc2UgaWYgKGQuU2lkZSA9PSAnYmFkJykge1xuICAgICAgY29sb3IgPSAnZGFya3JlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbG9yID0gJ2dyZXknO1xuICAgIH1cbiAgICByZXR1cm4gY29sb3I7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VSb3cgPSAoZCkgPT4ge1xuICBkLkhlaWdodCA9ICtkLkhlaWdodDtcbiAgZC5XZWlnaHQgPSArZC5XZWlnaHQ7XG4gIGQuSW50ZWxsaWdlbmNlID0gK2QuSW50ZWxsaWdlbmNlX3g7XG4gIGQuU3RyZW5ndGggPSArZC5TdHJlbmd0aDtcbiAgZC5TcGVlZCA9ICtkLlNwZWVkO1xuICBkLkR1cmFiaWxpdHkgPSArZC5EdXJhYmlsaXR5X3g7XG4gIGQuUG93ZXIgPSArZC5Qb3dlcjtcbiAgZC5Db21iYXQgPSArZC5Db21iYXQ7XG4gIGQuVG90YWwgPSArZC5Ub3RhbDtcbiAgZC5OYW1lID0gZC5OYW1lO1xuICBkLlNpZGUgPSBkLkFsaWdubWVudF94O1xuICByZXR1cm4gZDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRfZGF0YSA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZDMuY3N2KGNzdlVybCwgcGFyc2VSb3cpO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9XG59O1xuXG5cbiIsImltcG9ydCB7XG4gIHNjYWxlTGluZWFyLFxuICBleHRlbnQsXG4gIGF4aXNMZWZ0LFxuICBheGlzQm90dG9tLFxuICBtYXgsXG4gIG1pbixcbiAgc2NhbGVQb2ludCxcbiAgdHJhbnNpdGlvbixcbiAgcG9wb3Zlcixcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQge1xuICBjb2xvcl9waWNrZXIsXG59IGZyb20gJy4vSGVscGVyRnVuY3Rpb25zJztcblxuXG5leHBvcnQgY29uc3Qgc2NhdHRlclBsb3QgPSAoKSA9PiB7XG4gIGxldCB3aWR0aDtcbiAgbGV0IGhlaWdodDtcbiAgbGV0IGRhdGE7XG4gIGxldCB4VmFsdWU7XG4gIGxldCB5VmFsdWU7XG4gIGxldCB4Q29sTmFtZTtcbiAgbGV0IHlDb2xOYW1lO1xuICBsZXQgeFR5cGU7XG4gIGxldCB5VHlwZTtcbiAgbGV0IE5hbWU7XG4gIGxldCBTaWRlO1xuICBsZXQgVG90YWw7XG4gIGxldCBNZW51Q2hhcjtcbiAgbGV0IG1hcmdpbjtcblxuICB2YXIgdG9vbHRpcCA9IGQzXG4gICAgLnNlbGVjdCgnYm9keScpXG4gICAgLmFwcGVuZCgnZGl2JylcbiAgICAuc3R5bGUoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcbiAgICAuc3R5bGUoJ3otaW5kZXgnLCAnMTAnKVxuICAgIC5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKVxuICAgIC5zdHlsZSgnY29sb3InLCAnZ3JlZW4nKVxuICAgIC50ZXh0KCdhIHNpbXBsZSB0b29sdGlwJyk7XG5cbiAgY29uc3QgbXkgPSAoc2VsZWN0aW9uKSA9PiB7XG4gICAgY29uc3QgeCA9ICh4VHlwZSA9PT0gJ2NhdGVnb3JpY2FsJ1xuICAgICAgPyBzY2FsZVBvaW50KCkuZG9tYWluKGRhdGEubWFwKHhWYWx1ZSkpLnBhZGRpbmcoMC4yKVxuICAgICAgOiBzY2FsZUxpbmVhcigpLmRvbWFpbihbMCwgMTEwXSlcbiAgICApIC8vZXh0ZW50KGRhdGEsIHhWYWx1ZSlcbiAgICAgIC5yYW5nZShbbWFyZ2luLmxlZnQsIHdpZHRoIC0gbWFyZ2luLnJpZ2h0XSk7XG5cbiAgICBjb25zdCB5ID0gKHlUeXBlID09PSAnY2F0ZWdvcmljYWwnXG4gICAgICA/IHNjYWxlUG9pbnQoKS5kb21haW4oZGF0YS5tYXAoeVZhbHVlKSkucGFkZGluZygwLjIpXG4gICAgICA6IHNjYWxlTGluZWFyKCkuZG9tYWluKFswLCAxMTBdKVxuICAgICkgLy9leHRlbnQoZGF0YSwgeVZhbHVlKVxuICAgICAgLnJhbmdlKFtoZWlnaHQgLSBtYXJnaW4uYm90dG9tLCBtYXJnaW4udG9wXSk7XG5cbiAgICBjb25zdCBtYXJrcyA9IGRhdGEubWFwKChkKSA9PiAoe1xuICAgICAgeDogeCh4VmFsdWUoZCkpLFxuICAgICAgeTogeSh5VmFsdWUoZCkpLFxuICAgICAgTmFtZTogTmFtZShkKSxcbiAgICAgIFNpZGU6IFNpZGUoZCksXG4gICAgICBUb3RhbDogVG90YWwoZCksXG4gICAgfSkpO1xuXG4gICAgY29uc3QgVG90YWxfTWF4ID0gbWF4KGRhdGEsIFRvdGFsKTtcbiAgICBjb25zdCBUb3RhbF9NaW4gPSBtaW4oZGF0YSwgVG90YWwpO1xuXG4gICAgIGNvbnN0IGNvbG9yUGlja2VyID0gKGQpID0+IHtcbiAgICAgIGlmIChkLk5hbWUgPT0gTWVudUNoYXIuTmFtZSkge1xuICAgICAgICByZXR1cm4gJ2RhcmtibHVlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9waWNrZXIoZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBcbiAgICBcbiAgICBjb25zdCBzdHJva2VQaWNrZXIgPSAoZCkgPT4ge1xuICAgICAgaWYgKGQuTmFtZSA9PSBNZW51Q2hhci5OYW1lKSB7XG4gICAgICAgIHJldHVybiAnbGlnaHRibHVlJztcbiAgICAgIH0gZWxzZSBpZiAoZC5TaWRlID09ICdnb29kJykge1xuICAgICAgICByZXR1cm4gJ2dyZWVuJztcbiAgICAgIH0gZWxzZSBpZiAoZC5TaWRlID09ICdiYWQnKSB7XG4gICAgICAgIHJldHVybiAnZGFya3JlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2dyZXknO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBzaXplIGJ5IHRvdGFsIHZhbHVlIGZ1bmN0aW9uISFcbiAgICBjb25zdCByYWRpdXNfc2l6ZSA9IChkKSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAxMCAqICgoZCAtIFRvdGFsX01pbikgLyAoVG90YWxfTWF4IC0gVG90YWxfTWluKSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBjb25zdCB0ID0gdHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCk7XG5cbiAgICBjb25zdCBwb3NpdGlvbkNpcmNsZXMgPSAoY2lyY2xlcykgPT4ge1xuICAgICAgY2lyY2xlcy5hdHRyKCdjeCcsIChkKSA9PiBkLngpLmF0dHIoJ2N5JywgKGQpID0+IGQueSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGluaXRpYWxpemVSYWRpdXMgPSAoY2lyY2xlcykgPT4ge1xuICAgICAgY2lyY2xlcy5hdHRyKCdyJywgMCk7XG4gICAgfTtcbiAgICBjb25zdCBncm93UmFkaXVzID0gKGVudGVyKSA9PiB7XG4gICAgICBlbnRlclxuICAgICAgICAudHJhbnNpdGlvbih0KVxuICAgICAgICAuYXR0cigncicsIChkKSA9PiByYWRpdXNfc2l6ZShkLlRvdGFsKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBpY2tfb3BhY2l0eSA9IChkKSA9PiB7XG4gICAgICBpZiAoZC5OYW1lID09IE1lbnVDaGFyLk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMC4zO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVfY29sb3IgPSAoY2lyY2xlcykgPT4ge1xuICAgICAgY2lyY2xlcy5hdHRyKCdmaWxsJywgKGQpID0+IGNvbG9yUGlja2VyKGQpKTtcbiAgICAgIGNpcmNsZXMuYXR0cignb3BhY2l0eScsIChkKSA9PiBwaWNrX29wYWNpdHkoZCkpO1xuICAgICAgY2lyY2xlcy5hdHRyKCdzdHJva2UnLCAoZCkgPT4gc3Ryb2tlUGlja2VyKGQpKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgdm9yb25vaSA9IGQzLkRlbGF1bmF5LmZyb20oXG4gICAgICBtYXJrcyxcbiAgICAgIChkKSA9PiBkLngsXG4gICAgICAoZCkgPT4gZC55XG4gICAgKS52b3Jvbm9pKFtcbiAgICAgIG1hcmdpbi5sZWZ0LFxuICAgICAgbWFyZ2luLnRvcCxcbiAgICAgIHdpZHRoIC0gbWFyZ2luLnJpZ2h0LFxuICAgICAgaGVpZ2h0IC0gbWFyZ2luLmJvdHRvbSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGNpcmNsZXMgPSBzZWxlY3Rpb25cbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuZGF0YShtYXJrcylcbiAgICAgIC5qb2luKFxuICAgICAgICAoZW50ZXIpID0+XG4gICAgICAgICAgZW50ZXJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuY2FsbChwb3NpdGlvbkNpcmNsZXMpXG4gICAgICAgICAgICAuY2FsbChpbml0aWFsaXplUmFkaXVzKVxuICAgICAgICAgICAgLmNhbGwoY3JlYXRlX2NvbG9yKVxuICAgICAgICAgICAgLmNhbGwoZ3Jvd1JhZGl1cyksXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbih0KVxuICAgICAgICAgICAgICAuZGVsYXkoKGQsIGkpID0+IGkgKiAxMClcbiAgICAgICAgICAgICAgLmNhbGwocG9zaXRpb25DaXJjbGVzKVxuICAgICAgICAgICAgICAuY2FsbChjcmVhdGVfY29sb3IpXG4gICAgICAgICAgKSxcbiAgICAgICAgKGV4aXQpID0+IGV4aXQucmVtb3ZlKClcbiAgICAgICk7XG5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3Zvcm9ub2lXcmFwcGVyJylcbiAgICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgLmRhdGEobWFya3MpXG4gICAgICAuam9pbigncGF0aCcpXG4gICAgICAuYXR0cignb3BhY2l0eScsIDAuNSlcbiAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxuICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdhbGwnKVxuICAgICAgLmF0dHIoJ2QnLCAoZCwgaSkgPT4gdm9yb25vaS5yZW5kZXJDZWxsKGkpKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICB0b29sdGlwXG4gICAgICAgICAgLnRleHQoaS5OYW1lKVxuICAgICAgICAgIC5zdHlsZSgnY29sb3InLCBjb2xvclBpY2tlcihpLlNpZGUpKTtcbiAgICAgICAgcmV0dXJuIHRvb2x0aXAuc3R5bGUoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIHRvb2x0aXBcbiAgICAgICAgICAuc3R5bGUoJ3RvcCcsIGkueSArIHJhZGl1c19zaXplKGkuVG90YWwpKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIGkueCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgtNTAlKScpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PlxuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0QWxsKCcudG9vbHRpcCcpLnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgY29uc3QgeV9sYWJlbCA9IHNlbGVjdGlvblxuICAgICAgLnNlbGVjdEFsbCgnLnktYXhpcy1sYWJlbCcpXG4gICAgICAuZGF0YShbbnVsbF0pXG4gICAgICAuam9pbigndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAneS1heGlzLWxhYmVsJylcbiAgICAgIC5hdHRyKCd4Jywgd2lkdGggLSA0MTUpXG4gICAgICAuYXR0cigneScsIGhlaWdodCAtIDQyMClcbiAgICAgIC50ZXh0KHlDb2xOYW1lKVxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAnMThweCcpXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG5cbiAgICBjb25zdCB4X2xhYmVsID0gc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCcueC1heGlzLWxhYmVsJylcbiAgICAgIC5kYXRhKFtudWxsXSlcbiAgICAgIC5qb2luKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd5LWF4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3gnLCB3aWR0aClcbiAgICAgIC5hdHRyKCd5JywgaGVpZ2h0IC0gMTUpXG4gICAgICAudGV4dCh4Q29sTmFtZSlcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzE4cHgnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpO1xuXG4gICAgY29uc3QgaGlnaGxpZ2h0X2xhYmVsID0gc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCcuaGlnaGxpZ2h0LWxhYmVsJylcbiAgICAgIC5kYXRhKFtudWxsXSlcbiAgICBcdC5qb2luKCd0ZXh0JylcbiAgICAgIC8vIC50cmFuc2l0aW9uKHQpICBcbiAgICAgIC5hdHRyKCdjbGFzcycsICdoaWdobGlnaHQtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3gnLCB4KHhWYWx1ZShNZW51Q2hhcikpKVxuICAgICAgLmF0dHIoJ3knLCB5KHlWYWx1ZShNZW51Q2hhcikpKyArIDE1ICsgcmFkaXVzX3NpemUoTWVudUNoYXIuVG90YWwpKVxuICAgICAgLnRleHQoTWVudUNoYXIuTmFtZSlcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzE4cHgnKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgXHQudHJhbnNpdGlvbih0KTtcbiAgICBcbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zZWxlY3RBbGwoJy55LWF4aXMnKVxuICAgICAgLmRhdGEoW251bGxdKVxuICAgICAgLmpvaW4oJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwwKWApXG4gICAgICAudHJhbnNpdGlvbih0KVxuICAgICAgLmNhbGwoYXhpc0xlZnQoeSkpO1xuXG4gICAgc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCcueC1heGlzJylcbiAgICAgIC5kYXRhKFtudWxsXSlcbiAgICAgIC5qb2luKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd4LWF4aXMnKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgICBgdHJhbnNsYXRlKDAsJHtoZWlnaHQgLSBtYXJnaW4uYm90dG9tfSlgXG4gICAgICApXG4gICAgICAudHJhbnNpdGlvbih0KVxuICAgICAgLmNhbGwoYXhpc0JvdHRvbSh4KSk7XG4gIH07XG5cbiAgbXkud2lkdGggPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKCh3aWR0aCA9ICtfKSwgbXkpIDogd2lkdGg7XG4gIH07XG5cbiAgbXkuaGVpZ2h0ID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICgoaGVpZ2h0ID0gK18pLCBteSkgOiBoZWlnaHQ7XG4gIH07XG5cbiAgbXkuZGF0YSA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKGRhdGEgPSBfKSwgbXkpIDogZGF0YTtcbiAgfTtcblxuICBteS54VmFsdWUgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKCh4VmFsdWUgPSBfKSwgbXkpIDogeFZhbHVlO1xuICB9O1xuXG4gIG15LnlWYWx1ZSA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKHlWYWx1ZSA9IF8pLCBteSkgOiB5VmFsdWU7XG4gIH07XG5cbiAgbXkueFR5cGUgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKCh4VHlwZSA9IF8pLCBteSkgOiB4VHlwZTtcbiAgfTtcblxuICBteS55VHlwZSA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKHlUeXBlID0gXyksIG15KSA6IHlUeXBlO1xuICB9O1xuXG4gIG15Lm1hcmdpbiA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKG1hcmdpbiA9IF8pLCBteSkgOiBtYXJnaW47XG4gIH07XG5cbiAgbXkuTmFtZSA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKE5hbWUgPSBfKSwgbXkpIDogTmFtZTtcbiAgfTtcblxuICBteS5Ub3RhbCA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKFRvdGFsID0gXyksIG15KSA6IFRvdGFsO1xuICB9O1xuXG4gIG15LlNpZGUgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKChTaWRlID0gXyksIG15KSA6IFNpZGU7XG4gIH07XG4gIG15LnhDb2xOYW1lID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyAoKHhDb2xOYW1lID0gXyksIG15KVxuICAgICAgOiB4Q29sTmFtZTtcbiAgfTtcbiAgbXkueUNvbE5hbWUgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/ICgoeUNvbE5hbWUgPSBfKSwgbXkpXG4gICAgICA6IHlDb2xOYW1lO1xuICB9O1xuXG4gIG15Lk1lbnVDaGFyID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyAoKE1lbnVDaGFyID0gXyksIG15KVxuICAgICAgOiBNZW51Q2hhcjtcbiAgfTtcblxuICByZXR1cm4gbXk7XG59O1xuIiwiaW1wb3J0IHtcbiAgc2NhbGVMaW5lYXIsXG4gIGV4dGVudCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIHRyYW5zaXRpb24sIEZvcm1hdCxcbn0gZnJvbSAnZDMnO1xuXG5leHBvcnQgY29uc3QgcmFkYXIgPSAoKSA9PiB7XG4gIGxldCBtYXJnaW5zO1xuICBsZXQgd2lkdGg7XG4gIGxldCBoZWlnaHQ7XG4gIGxldCBkYXRhO1xuICBsZXQgb3B0aW9ucztcbiAgbGV0IGlkO1xuICBsZXQgY2hhcmFjdGVyO1xuICBsZXQgY29sb3I7XG4gICAgXG4gIGNvbnN0IG15ID0gKHNlbGVjdGlvbikgPT4ge1xuICAgIHZhciBjZmcgPSB7XG4gICAgICB3OiB3aWR0aCwgLy9XaWR0aCBvZiB0aGUgY2lyY2xlXG4gICAgICBoOiBoZWlnaHQsIC8vSGVpZ2h0IG9mIHRoZSBjaXJjbGVcbiAgICAgIG1hcmdpbjogbWFyZ2lucywgLy97IHRvcDogMjAsIHJpZ2h0OiAyMCwgYm90dG9tOiAyMCwgbGVmdDogMjAgfSwgLy9UaGUgbWFyZ2lucyBvZiB0aGUgU1ZHXG4gICAgICBsZXZlbHM6IDAsIC8vSG93IG1hbnkgbGV2ZWxzIG9yIGlubmVyIGNpcmNsZXMgc2hvdWxkIHRoZXJlIGJlIGRyYXduXG4gICAgICBtYXhWYWx1ZTogMCwgLy9XaGF0IGlzIHRoZSB2YWx1ZSB0aGF0IHRoZSBiaWdnZXN0IGNpcmNsZSB3aWxsIHJlcHJlc2VudFxuICAgICAgbGFiZWxGYWN0b3I6IDEuMjUsIC8vSG93IG11Y2ggZmFydGhlciB0aGFuIHRoZSByYWRpdXMgb2YgdGhlIG91dGVyIGNpcmNsZSBzaG91bGQgdGhlIGxhYmVscyBiZSBwbGFjZWRcbiAgICAgIHdyYXBXaWR0aDogNjAsIC8vVGhlIG51bWJlciBvZiBwaXhlbHMgYWZ0ZXIgd2hpY2ggYSBsYWJlbCBuZWVkcyB0byBiZSBnaXZlbiBhIG5ldyBsaW5lXG4gICAgICBvcGFjaXR5QXJlYTogMC4zNSwgLy9UaGUgb3BhY2l0eSBvZiB0aGUgYXJlYSBvZiB0aGUgYmxvYlxuICAgICAgZG90UmFkaXVzOiA0LCAvL1RoZSBzaXplIG9mIHRoZSBjb2xvcmVkIGNpcmNsZXMgb2YgZWFjaCBibG9nXG4gICAgICBvcGFjaXR5Q2lyY2xlczogMC4xLCAvL1RoZSBvcGFjaXR5IG9mIHRoZSBjaXJjbGVzIG9mIGVhY2ggYmxvYlxuICAgICAgc3Ryb2tlV2lkdGg6IDIsIC8vVGhlIHdpZHRoIG9mIHRoZSBzdHJva2UgYXJvdW5kIGVhY2ggYmxvYlxuICAgICAgcm91bmRTdHJva2VzOiBmYWxzZSwgLy9JZiB0cnVlIHRoZSBhcmVhIGFuZCBzdHJva2Ugd2lsbCBmb2xsb3cgYSByb3VuZCBwYXRoIChjYXJkaW5hbC1jbG9zZWQpXG4gICAgICBjb2xvcjogZDMuc2NhbGVPcmRpbmFsKGQzLnNjaGVtZUNhdGVnb3J5MTApLCAvL2QzLnNjYWxlT3JkaW5hbCgpLnJhbmdlKHNjaGVtZUNhdGVnb3J5MTApXHQvL0NvbG9yIGZ1bmN0aW9uXG4gICAgfTtcbiAgICBcbiAgICAvL1B1dCBhbGwgb2YgdGhlIG9wdGlvbnMgaW50byBhIHZhcmlhYmxlIGNhbGxlZCBjZmdcbiAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBvcHRpb25zKSB7XG4gICAgICBmb3IgKHZhciBpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygb3B0aW9uc1tpXSkge1xuICAgICAgICAgIGNmZ1tpXSA9IG9wdGlvbnNbaV07XG4gICAgICAgIH1cbiAgICAgIH0gLy9mb3IgaVxuICAgIH0gLy9pZlxuXG4gICAgdmFyIG1heFZhbHVlID0gMTEwO1xuXHRcdFxuICAgIHZhciBhbGxBeGlzID0gZGF0YVswXS5tYXAoZnVuY3Rpb24gKGksIGopIHtcbiAgICAgICAgcmV0dXJuIGkuYXhpcztcbiAgICAgIH0pLCAvL05hbWVzIG9mIGVhY2ggYXhpc1xuICAgICAgdG90YWwgPSBhbGxBeGlzLmxlbmd0aCwgLy9UaGUgbnVtYmVyIG9mIGRpZmZlcmVudCBheGVzXG4gICAgICByYWRpdXMgPSBNYXRoLm1pbihjZmcudyAvIDIsIGNmZy5oIC8gMiksIC8vUmFkaXVzIG9mIHRoZSBvdXRlcm1vc3QgY2lyY2xlXG4gICAgICBGb3JtYXQgPSBkMy5mb3JtYXQoJycpLCAvL1BlcmNlbnRhZ2UgZm9ybWF0dGluZ1xuICAgICAgYW5nbGVTbGljZSA9IChNYXRoLlBJICogMikgLyB0b3RhbDsgLy9UaGUgd2lkdGggaW4gcmFkaWFucyBvZiBlYWNoIFwic2xpY2VcIlxuXG4gICAgLy9TY2FsZSBmb3IgdGhlIHJhZGl1c1xuICAgIHZhciByU2NhbGUgPSBkM1xuICAgICAgLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZShbMCwgcmFkaXVzXSlcbiAgICAgIC5kb21haW4oWzAsIG1heFZhbHVlXSk7XG5cbiAgICBjb25zdCB0ID0gdHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCk7XG5cbiAgICAvL0luaXRpYXRlIHRoZSByYWRhciBjaGFydCBTVkdcbiAgICB2YXIgc3ZnID0gc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0KGlkKVxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICBjZmcudyArIGNmZy5tYXJnaW4ubGVmdCArIGNmZy5tYXJnaW4ucmlnaHRcbiAgICAgIClcbiAgICAgIC5hdHRyKFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgY2ZnLmggKyBjZmcubWFyZ2luLnRvcCArIGNmZy5tYXJnaW4uYm90dG9tXG4gICAgICApXG4gICAgICAuYXR0cignY2xhc3MnLCAncmFkYXInICsgaWQpO1xuXG4gICAgLy9BcHBlbmQgYSBnIGVsZW1lbnRcbiAgICB2YXIgZyA9IHNlbGVjdGlvblxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAgICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgKGNmZy53IC8gMiArIGNmZy5tYXJnaW4ubGVmdCkgK1xuICAgICAgICAgICcsJyArXG4gICAgICAgICAgKGNmZy5oIC8gMiArIGNmZy5tYXJnaW4udG9wKSArXG4gICAgICAgICAgJyknXG4gICAgICApO1xuXG4gICAgLy9XcmFwcGVyIGZvciB0aGUgZ3JpZCAmIGF4ZXNcbiAgICB2YXIgYXhpc0dyaWQgPSBnXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzV3JhcHBlcicpO1xuXG4gICAgLy9EcmF3IHRoZSBiYWNrZ3JvdW5kIGNpcmNsZXNcbiAgICBheGlzR3JpZFxuICAgICAgLnNlbGVjdEFsbCgnLmxldmVscycpXG4gICAgICAuZGF0YShkMy5yYW5nZSgxLCBjZmcubGV2ZWxzICsgMSkucmV2ZXJzZSgpKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZ3JpZENpcmNsZScpXG4gICAgICAuYXR0cigncicsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIHJldHVybiAocmFkaXVzIC8gY2ZnLmxldmVscykgKiBkO1xuICAgICAgfSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsICcjZmZmZmZmJylcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNjY2NjY2MnKVxuICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCBjZmcub3BhY2l0eUNpcmNsZXMpO1xuICAgIC8vXHQuc3R5bGUoXCJmaWx0ZXJcIiAsIFwidXJsKCNnbG93KVwiKTtcblxuICAgIC8vVGV4dCBpbmRpY2F0aW5nIGF0IHdoYXQgJSBlYWNoIGxldmVsIGlzXG4gICAgYXhpc0dyaWRcbiAgICAgIC5zZWxlY3RBbGwoJy5heGlzTGFiZWwnKVxuICAgICAgLmRhdGEoZDMucmFuZ2UoMSwgY2ZnLmxldmVscyArIDEpLnJldmVyc2UoKSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzTGFiZWwnKVxuICAgICAgLmF0dHIoJ3gnLCA0KVxuICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gKC1kICogcmFkaXVzKSAvIGNmZy5sZXZlbHM7XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ2R5JywgJzAuNGVtJylcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzEwcHgnKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAnIzczNzM3MycpXG4gICAgICAudGV4dChmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gRm9ybWF0KChtYXhWYWx1ZSAqIGQpIC8gY2ZnLmxldmVscyk7XG4gICAgICB9KTtcblxuICAgIC8vQ3JlYXRlIHRoZSBzdHJhaWdodCBsaW5lcyByYWRpYXRpbmcgb3V0d2FyZCBmcm9tIHRoZSBjZW50ZXJcbiAgICB2YXIgYXhpcyA9IGF4aXNHcmlkXG4gICAgICAuc2VsZWN0QWxsKCcuYXhpcycpXG4gICAgICAuZGF0YShhbGxBeGlzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKTtcbiAgICAvL0FwcGVuZCB0aGUgbGluZXNcbiAgICBheGlzXG4gICAgICAuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsIDApXG4gICAgICAuYXR0cigneTEnLCAwKVxuICAgICAgLmF0dHIoJ3gyJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICByU2NhbGUobWF4VmFsdWUgKiAxLjEpICpcbiAgICAgICAgICBNYXRoLmNvcyhhbmdsZVNsaWNlICogaSAtIE1hdGguUEkgLyAyKVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCd5MicsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgclNjYWxlKG1heFZhbHVlICogMS4xKSAqXG4gICAgICAgICAgTWF0aC5zaW4oYW5nbGVTbGljZSAqIGkgLSBNYXRoLlBJIC8gMilcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsICcjODQ4NDg0JylcbiAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpO1xuXG4gICAgLy9BcHBlbmQgdGhlIGxhYmVscyBhdCBlYWNoIGF4aXNcbiAgICBheGlzXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQnKVxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAnMTFweCcpXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgIC5hdHRyKCdkeScsICcwLjM1ZW0nKVxuICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHJTY2FsZShtYXhWYWx1ZSAqIGNmZy5sYWJlbEZhY3RvcikgKlxuICAgICAgICAgIE1hdGguY29zKGFuZ2xlU2xpY2UgKiBpIC0gTWF0aC5QSSAvIDIpXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHJTY2FsZShtYXhWYWx1ZSAqIGNmZy5sYWJlbEZhY3RvcikgKlxuICAgICAgICAgIE1hdGguc2luKGFuZ2xlU2xpY2UgKiBpIC0gTWF0aC5QSSAvIDIpXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9KVxuICAgICAgLmNhbGwod3JhcCwgY2ZnLndyYXBXaWR0aCk7XG4gICAgXG4gICAgLy9UaGUgcmFkaWFsIGxpbmUgZnVuY3Rpb25cbiAgICB2YXIgcmFkYXJMaW5lID0gZDNcbiAgICAgIC5yYWRpYWxMaW5lKClcbiAgICAgIC5yYWRpdXMoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIHJTY2FsZShkLnZhbHVlKTtcbiAgICAgIH0pXG4gICAgICAuYW5nbGUoZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGkgKiBhbmdsZVNsaWNlO1xuICAgICAgfSlcbiAgICAgIC5jdXJ2ZShkMy5jdXJ2ZUxpbmVhckNsb3NlZCk7XG5cbiAgICAvL0NyZWF0ZSBhIHdyYXBwZXIgZm9yIHRoZSBibG9ic1xuICAgIHZhciBibG9iV3JhcHBlciA9IGdcbiAgICAgIC5zZWxlY3RBbGwoJy5yYWRhcldyYXBwZXInKVxuICAgICAgLmRhdGEoZGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdyYWRhcldyYXBwZXInKTtcblxuICAgIC8vQXBwZW5kIHRoZSBiYWNrZ3JvdW5kc1xuICAgIGJsb2JXcmFwcGVyXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdyYWRhckFyZWEnKVxuICAgICAgLmF0dHIoJ2QnLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gcmFkYXJMaW5lKGQpO1xuICAgICAgfSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbG9yKVxuICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCBjZmcub3BhY2l0eUFyZWEpXG4gICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgIC8vRGltIGFsbCBibG9ic1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5yYWRhckFyZWEnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC4xKTtcbiAgICAgICAgLy9CcmluZyBiYWNrIHRoZSBob3ZlcmVkIG92ZXIgYmxvYlxuICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9CcmluZyBiYWNrIGFsbCBibG9ic1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5yYWRhckFyZWEnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgY2ZnLm9wYWNpdHlBcmVhKTtcbiAgICAgIH0pO1xuXG4gICAgLy9DcmVhdGUgdGhlIG91dGxpbmVzXG4gICAgYmxvYldyYXBwZXJcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3JhZGFyU3Ryb2tlJylcbiAgICAgIC5hdHRyKCdkJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIHJhZGFyTGluZShkKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIGNmZy5zdHJva2VXaWR0aCArICdweCcpXG4gICAgXHQuc3R5bGUoJ3N0cm9rZScsIGNvbG9yKVxuICAgICAgLnN0eWxlKCdmaWxsJywgJ25vbmUnKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uQ2lyY2xlcyA9IChjaXJjbGVzKSA9PiB7XG4gICAgICBjaXJjbGVzXG4gICAgICAgIC5hdHRyKCdjeCcsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHJTY2FsZShkLnZhbHVlKSAqXG4gICAgICAgICAgICBNYXRoLmNvcyhhbmdsZVNsaWNlICogaSAtIE1hdGguUEkgLyAyKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdjeScsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHJTY2FsZShkLnZhbHVlKSAqXG4gICAgICAgICAgICBNYXRoLnNpbihhbmdsZVNsaWNlICogaSAtIE1hdGguUEkgLyAyKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgY29uc3QgaW5pdGlhbGl6ZVJhZGl1cyA9IChjaXJjbGVzKSA9PiB7XG4gICAgICBjaXJjbGVzLmF0dHIoJ3InLCBjZmcuZG90UmFkaXVzKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ3Jvd1JhZGl1cyA9IChlbnRlcikgPT4ge1xuICAgICAgZW50ZXIudHJhbnNpdGlvbih0KS5hdHRyKCdyJywgY2ZnLmRvdFJhZGl1cyk7XG4gICAgfTtcblxuICAgIC8vQXBwZW5kIHRoZSBjaXJjbGVzXG4gICAgY29uc3QgY2lyY2xlcyA9IGJsb2JXcmFwcGVyXG4gICAgICAuc2VsZWN0QWxsKCcucmFkYXJDaXJjbGUnKVxuICAgICAgLmRhdGEoZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXG4gICAgICAgIChlbnRlcikgPT5cbiAgICAgICAgICBlbnRlclxuICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgXHRcdC8vIC5hdHRyKGNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3JhZGFyQ2lyY2xlJylcbiAgICAgICAgXHRcdC5hdHRyKCdmaWxsJywgY29sb3IpXG4gICAgICAgICAgICAuY2FsbChpbml0aWFsaXplUmFkaXVzKVxuICAgICAgICAgICAgLmNhbGwocG9zaXRpb25DaXJjbGVzKVxuICAgICAgICAgICAgLmNhbGwoZ3Jvd1JhZGl1cyksXG4gICAgICAgICh1cGRhdGUpID0+XG4gICAgICAgICAgdXBkYXRlLmNhbGwoKHVwZGF0ZSkgPT5cbiAgICAgICAgICAgIHVwZGF0ZVxuICAgICAgICAgICAgICAudHJhbnNpdGlvbih0KVxuICAgICAgICAgICAgICAuZGVsYXkoKGQsIGkpID0+IGkgKiAxMClcbiAgICAgICAgICAgICAgLmNhbGwocG9zaXRpb25DaXJjbGVzKVxuICAgICAgICAgICksXG4gICAgICAgIChleGl0KSA9PiBleGl0LnJlbW92ZSgpXG4gICAgICApO1xuXG4gICAgLy9pbnZpc2FibGUgY2lyY2xlcyBpZGtcbiAgICB2YXIgYmxvYkNpcmNsZVdyYXBwZXIgPSBnXG4gICAgICAuc2VsZWN0QWxsKCcucmFkYXJDaXJjbGVXcmFwcGVyJylcbiAgICAgIC5kYXRhKGRhdGEpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAncmFkYXJDaXJjbGVXcmFwcGVyJyk7XG5cbiAgICAvL0FwcGVuZCBhIHNldCBvZiBpbnZpc2libGUgY2lyY2xlcyBvbiB0b3AgZm9yIHRoZSBtb3VzZW92ZXIgcG9wLXVwXG4gICAgYmxvYkNpcmNsZVdyYXBwZXJcbiAgICAgIC5zZWxlY3RBbGwoJy5yYWRhckludmlzaWJsZUNpcmNsZScpXG4gICAgICAuZGF0YShmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gZDtcbiAgICAgIH0pXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdyYWRhckludmlzaWJsZUNpcmNsZScpXG4gICAgICAuYXR0cigncicsIGNmZy5kb3RSYWRpdXMgKiAxLjUpXG4gICAgICAuYXR0cignY3gnLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHJTY2FsZShkLnZhbHVlKSAqXG4gICAgICAgICAgTWF0aC5jb3MoYW5nbGVTbGljZSAqIGkgLSBNYXRoLlBJIC8gMilcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cignY3knLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHJTY2FsZShkLnZhbHVlKSAqXG4gICAgICAgICAgTWF0aC5zaW4oYW5nbGVTbGljZSAqIGkgLSBNYXRoLlBJIC8gMilcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ2FsbCcpXG4gICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICBcdGxldCBuZXdYID1cbiAgICAgICAgICBwYXJzZUZsb2F0KGQzLnNlbGVjdCh0aGlzKS5hdHRyKCdjeCcpKSAtIDEwO1xuICAgICAgICBsZXQgbmV3WSA9XG4gICAgICAgICAgcGFyc2VGbG9hdChkMy5zZWxlY3QodGhpcykuYXR0cignY3knKSkgLSAxMDtcbiAgICAgICAgdG9vbHRpcFxuICAgICAgICAgIC5hdHRyKCd4JywgbmV3WClcbiAgICAgICAgICAuYXR0cigneScsIG5ld1kpXG4gICAgICAgICAgLnRleHQoJycgKyBpLnZhbHVlICsgJycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbigyMDApXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9vbHRpcFxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgfSk7XG5cbiAgICAvL1NldCB1cCB0aGUgc21hbGwgdG9vbHRpcCBmb3Igd2hlbiB5b3UgaG92ZXIgb3ZlciBhIGNpcmNsZVxuICAgIHZhciB0b29sdGlwID0gZ1xuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAndG9vbHRpcCcpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICBcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vIEhlbHBlciBGdW5jdGlvbiAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8vVGFrZW4gZnJvbSBodHRwOi8vYmwub2Nrcy5vcmcvbWJvc3RvY2svNzU1NTMyMVxuICAgIC8vV3JhcHMgU1ZHIHRleHRcbiAgICBmdW5jdGlvbiB3cmFwKHRleHQsIHdpZHRoKSB7XG4gICAgICB0ZXh0LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGV4dCA9IGQzLnNlbGVjdCh0aGlzKSxcbiAgICAgICAgICB3b3JkcyA9IHRleHQudGV4dCgpLnNwbGl0KC9cXHMrLykucmV2ZXJzZSgpLFxuICAgICAgICAgIHdvcmQsXG4gICAgICAgICAgbGluZSA9IFtdLFxuICAgICAgICAgIGxpbmVOdW1iZXIgPSAwLFxuICAgICAgICAgIGxpbmVIZWlnaHQgPSAxLjQsIC8vIGVtc1xuICAgICAgICAgIHkgPSB0ZXh0LmF0dHIoJ3knKSxcbiAgICAgICAgICB4ID0gdGV4dC5hdHRyKCd4JyksXG4gICAgICAgICAgZHkgPSBwYXJzZUZsb2F0KHRleHQuYXR0cignZHknKSksXG4gICAgICAgICAgdHNwYW4gPSB0ZXh0XG4gICAgICAgICAgICAudGV4dChudWxsKVxuICAgICAgICAgICAgLmFwcGVuZCgndHNwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCB4KVxuICAgICAgICAgICAgLmF0dHIoJ3knLCB5KVxuICAgICAgICAgICAgLmF0dHIoJ2R5JywgZHkgKyAnZW0nKTtcblxuICAgICAgICB3aGlsZSAoKHdvcmQgPSB3b3Jkcy5wb3AoKSkpIHtcbiAgICAgICAgICBsaW5lLnB1c2god29yZCk7XG4gICAgICAgICAgdHNwYW4udGV4dChsaW5lLmpvaW4oJyAnKSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHNwYW4ubm9kZSgpLmdldENvbXB1dGVkVGV4dExlbmd0aCgpID4gd2lkdGhcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxpbmUucG9wKCk7XG4gICAgICAgICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbignICcpKTtcbiAgICAgICAgICAgIGxpbmUgPSBbd29yZF07XG4gICAgICAgICAgICB0c3BhbiA9IHRleHRcbiAgICAgICAgICAgICAgLmFwcGVuZCgndHNwYW4nKVxuICAgICAgICAgICAgICAuYXR0cigneCcsIHgpXG4gICAgICAgICAgICAgIC5hdHRyKCd5JywgeSlcbiAgICAgICAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICAgICAgJ2R5JyxcbiAgICAgICAgICAgICAgICArK2xpbmVOdW1iZXIgKiBsaW5lSGVpZ2h0ICsgZHkgKyAnZW0nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnRleHQod29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IC8vd3JhcFxuICB9O1xuXG4gIG15LndpZHRoID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICgod2lkdGggPSArXyksIG15KSA6IHdpZHRoO1xuICB9O1xuXG4gIG15LmhlaWdodCA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKGhlaWdodCA9ICtfKSwgbXkpIDogaGVpZ2h0O1xuICB9O1xuXG4gIG15LmRhdGEgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKChkYXRhID0gXyksIG15KSA6IGRhdGE7XG4gIH07XG5cbiAgbXkuaWQgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKChpZCA9IF8pLCBteSkgOiBpZDtcbiAgfTtcblxuICBteS5vcHRpb25zID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICgob3B0aW9ucyA9IF8pLCBteSkgOiBvcHRpb25zO1xuICB9O1xuICBteS5tYXJnaW5zID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICgobWFyZ2lucyA9IF8pLCBteSkgOiBtYXJnaW5zO1xuICB9O1xuICBcbiAgIG15LmNoYXJhY3RlciA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKGNoYXJhY3RlciA9IF8pLCBteSkgOiBjaGFyYWN0ZXI7XG4gIH07XG4gICBteS5jb2xvciA9IGZ1bmN0aW9uIChfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoKGNvbG9yID0gXyksIG15KSA6IGNvbG9yO1xuICB9O1xuXG5cbiAgcmV0dXJuIG15O1xufTtcbiIsImNvbnN0IHtcbiAgY3N2LFxuICBzZWxlY3QsXG4gIHNjYWxlTGluZWFyLFxuICBleHRlbnQsXG4gIGF4aXNMZWZ0LFxuICBheGlzQm90dG9tLFxuICB6b29tLFxuICBldmVudCxcbiAgZm9ybWF0LFxuICBtaW4sXG4gIG1heCxcbn0gPSBkMztcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gJy4vbWVudSc7XG5pbXBvcnQgeyBzY2F0dGVyUGxvdCB9IGZyb20gJy4vc2NhdHRlclBsb3QnO1xuaW1wb3J0IHsgcmFkYXIgfSBmcm9tICcuL3JhZGFyJztcblxuaW1wb3J0IHtcbiAgZmlsdGVyX2RhdGEsXG4gIGNvbG9yLFxuICBjb2xvcl9waWNrZXIsXG4gIGNoYXJhY3Rlcl9saXN0LFxuICBtYWtlX2NoYXJfbGlzdCxcbiAgbWFrZV9hcnJheSxcbiAgcGFyc2VfZGF0YSxcbiAgcGFyc2VSb3csXG4gIGZpbHRlcl9yb3csXG59IGZyb20gJy4vSGVscGVyRnVuY3Rpb25zJztcblxuLy8vLy8vLy8vLy8gREFUQSBGVU5DVElPTlMgLy8vLy8vLy8vLy8vLy9cblxuY29uc3QgY3N2VXJsID0gW1xuICAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS8nLFxuICAnTGVhaE1pdGNoZWxsLycsIC8vIFVzZXJcbiAgJzhhZDQ2ZmJjYWM4ZDc0MjBiY2Q1Yjk3YjFhMjQ1ZjQzLycsIC8vIElkIG9mIHRoZSBHaXN0XG4gICdyYXcvMTlkMjg2OTVhYzU2MWQ5NWYzZjVhMDkxZWZkMThjNWFjNmEzOTZlMy8nLCAvLyBjb21taXRcbiAgJ21hcnZlbF9kYXRhLmNzdicsIC8vIEZpbGUgbmFtZVxuXS5qb2luKCcnKTtcblxuY29uc3QgZ2V0X2RhdGEgPSBhc3luYyAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGQzLmNzdihjc3ZVcmwsIHBhcnNlUm93KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufTtcblxuY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuY29uc3Qgc3ZnX3NjYXR0ZXIgPSBzZWxlY3QoJ2JvZHknKVxuICAuYXBwZW5kKCdzdmcnKVxuICAuYXR0cignd2lkdGgnLCB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNilcbiAgLmF0dHIoJ2hlaWdodCcsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbmNvbnN0IHN2Z19yYWRhciA9IHNlbGVjdCgnYm9keScpXG4gIC5hcHBlbmQoJ3N2ZycpXG4gIC5hdHRyKCd3aWR0aCcsIHdpbmRvdy5pbm5lcldpZHRoICogMC40KVxuICAuYXR0cignaGVpZ2h0Jywgd2luZG93LmlubmVySGVpZ2h0KTtcblxuY29uc3QgbWFyZ2luX3NjYXR0ZXIgPSB7XG4gIHRvcDogMTAwLFxuICByaWdodDogMCxcbiAgYm90dG9tOiA2MCxcbiAgbGVmdDogNTAsXG59O1xuXG5jb25zdCBtYXJnaW5fcmFkYXIgPSB7XG4gIHRvcDogNTAsXG4gIHJpZ2h0OiA1MCxcbiAgYm90dG9tOiA1MDAsXG4gIGxlZnQ6IDUwLFxufTtcblxuY29uc3QgbWVudUNvbnRhaW5lciA9IHNlbGVjdCgnYm9keScpXG4gIC5hcHBlbmQoJ2RpdicpXG4gIC5hdHRyKCdjbGFzcycsICdtZW51LWNvbnRhaW5lcicpO1xuXG5jb25zdCB4TWVudSA9IG1lbnVDb250YWluZXIuYXBwZW5kKCdkaXYnKTtcbmNvbnN0IHlNZW51ID0gbWVudUNvbnRhaW5lci5hcHBlbmQoJ2RpdicpO1xuY29uc3QgY01lbnUgPSBtZW51Q29udGFpbmVyLmFwcGVuZCgnZGl2Jyk7XG5cbmNvbnN0IGNoYXJhY3RlciA9ICdBLUJvbWInO1xuXG4vLy8vLy8vLy8vLy8vLy8gTUFJTiAvLy8vLy8vLy8vLy8vLy9cblxuY29uc3QgbWFpbiA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGdldF9kYXRhKCk7XG5cbiAgdmFyIGZpbHRlcmVkX2NoYXJfcm93ICA9IGZpbHRlcl9yb3coZGF0YSwgY2hhcmFjdGVyKVxuICBcbiAgY29uc3Qgc2NhdHRlciA9IHNjYXR0ZXJQbG90KClcbiAgICAud2lkdGgod2lkdGggLyAyKVxuICAgIC5oZWlnaHQoaGVpZ2h0KVxuICAgIC5kYXRhKGRhdGEpXG4gICAgLnhWYWx1ZSgoZCkgPT4gZC5TdHJlbmd0aClcbiAgICAueVZhbHVlKChkKSA9PiBkLlN0cmVuZ3RoKVxuICAgIC54Q29sTmFtZSgnU3RyZW5ndGgnKVxuICAgIC55Q29sTmFtZSgnU3RyZW5ndGgnKVxuICAgIC5OYW1lKChkKSA9PiBkLk5hbWUpXG4gICAgLlRvdGFsKChkKSA9PiBkLlRvdGFsKVxuICAgIC5TaWRlKChkKSA9PiBkLkFsaWdubWVudF94KVxuICAgIC5NZW51Q2hhcihmaWx0ZXJlZF9jaGFyX3JvdylcbiAgICAubWFyZ2luKG1hcmdpbl9zY2F0dGVyKTtcblxuICBzdmdfc2NhdHRlci5jYWxsKHNjYXR0ZXIpO1xuXG4gIHZhciByYWRhckNoYXJ0T3B0aW9ucyA9IHtcbiAgICB3OiB3aWR0aCAqIDAuMjUsXG4gICAgaDogaGVpZ2h0LFxuICAgIG1hcmdpbjogbWFyZ2luX3JhZGFyLFxuICAgIG1heFZhbHVlOiAxLFxuICAgIGxldmVsczogNSxcbiAgICByb3VuZFN0cm9rZXM6IHRydWUsXG4gIH07XG5cbiAgY29uc3QgcmFkID0gcmFkYXIoKVxuICAgIC5tYXJnaW5zKG1hcmdpbl9yYWRhcilcbiAgICAud2lkdGgod2lkdGggKiAwLjUpXG4gICAgLmhlaWdodChoZWlnaHQpXG4gICAgLmRhdGEoZmlsdGVyX2RhdGEoZGF0YSwgY2hhcmFjdGVyKSlcbiAgICAub3B0aW9ucyhyYWRhckNoYXJ0T3B0aW9ucylcbiAgICAuY2hhcmFjdGVyKGNoYXJhY3RlcilcbiAgICAuY29sb3IoY29sb3JfcGlja2VyKGZpbHRlcmVkX2NoYXJfcm93KSlcbiAgICAuaWQoJy5yYWRhckNoYXJ0Jyk7XG5cbiAgc3ZnX3JhZGFyLmNhbGwocmFkKTtcblxuICAvLy8vIEdSQVBIIFRFWFRTIC8vLy8vL1xuXG4gIHN2Z19yYWRhclxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCd4Jywgd2lkdGggLyA0IC0gNzUpXG4gICAgLmF0dHIoJ3knLCBoZWlnaHQgLSA0NDUpXG4gICAgLnRleHQoJ0NoYXJhY3RlcjogJyArIGNoYXJhY3RlcilcbiAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsICcyMHB4JylcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG5cbiAgc3ZnX3JhZGFyXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ3gnLCB3aWR0aCAvIDQgLSA3NSlcbiAgICAuYXR0cigneScsIGhlaWdodCAtIDQyMClcbiAgICAudGV4dChcbiAgICAgIFwiQ2hhcmFjdGVyJ3MgVG90YWwgUG93ZXIgU2NvcmU6IFwiICtcbiAgICAgICAgZmlsdGVyZWRfY2hhcl9yb3cuVG90YWxcbiAgICApXG4gICAgLnN0eWxlKCdmb250LXNpemUnLCAnMThweCcpXG4gICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpO1xuXG4gIHN2Z19yYWRhclxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCd4Jywgd2lkdGggLyA0IC0gNzUpXG4gICAgLmF0dHIoJ3knLCBoZWlnaHQgLSAzOTUpXG4gICAgLnRleHQoXG4gICAgICAnVG90YWwgUG93ZXIgUmFuazogJyArXG4gICAgICAgIGZpbHRlcmVkX2NoYXJfcm93LnJhbmsgK1xuICAgICAgICAnIG9mIDI1NyBjaGFyYWN0ZXJzJ1xuICAgIClcbiAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxNnB4JylcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IFtcbiAgICB7XG4gICAgICB2YWx1ZTogJ1N0cmVuZ3RoJyxcbiAgICAgIHRleHQ6ICdTdHJlbmd0aCBTY29yZScsXG4gICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHZhbHVlOiAnSW50ZWxsaWdlbmNlJyxcbiAgICAgIHRleHQ6ICdJbnRlbGxpZ2VuY2UgU2NvcmUnLFxuICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZScsXG4gICAgfSxcbiAgICB7XG4gICAgICB2YWx1ZTogJ1NwZWVkJyxcbiAgICAgIHRleHQ6ICdTcGVlZCBTY29yZScsXG4gICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHZhbHVlOiAnRHVyYWJpbGl0eScsXG4gICAgICB0ZXh0OiAnRHVyYWJpbGl0eSBTY29yZScsXG4gICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHZhbHVlOiAnUG93ZXInLFxuICAgICAgdGV4dDogJ1Bvd2VyIFNjb3JlJyxcbiAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnLFxuICAgIH0sXG4gICAge1xuICAgICAgdmFsdWU6ICdDb21iYXQnLFxuICAgICAgdGV4dDogJ0NvbWJhdCBTY29yZScsXG4gICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IGNoYXJfbGlzdCA9IGNoYXJhY3Rlcl9saXN0KGRhdGEpO1xuXG4gIGNvbnN0IGNvbHVtblRvVHlwZSA9IG5ldyBNYXAoXG4gICAgb3B0aW9ucy5tYXAoKHsgdmFsdWUsIHR5cGUgfSkgPT4gW3ZhbHVlLCB0eXBlXSlcbiAgKTtcbiAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICBjb2x1bW5Ub1R5cGUuc2V0KG9wdGlvbi52YWx1ZSwgb3B0aW9uLnR5cGUpO1xuICB9KTtcblxuICAvLyBjb2x1bW4gaXMgYSBzdHJpbmcsIGNvcnJlc3BvbmRpbmcgdG9cbiAgLy8gdGhlIHZhbHVlIHByb3BlcnR5IG9uIG1ldGFkYXRhIG9iamVjdHNcbiAgY29uc3QgZ2V0VHlwZSA9IChjb2x1bW4pID0+IGNvbHVtblRvVHlwZS5nZXQoY29sdW1uKTtcblxuICB4TWVudS5jYWxsKFxuICAgIG1lbnUoKVxuICAgICAgLmlkKCd4LW1lbnUnKVxuICAgICAgLmxhYmVsVGV4dCgnWDonKVxuICAgICAgLm9wdGlvbnMob3B0aW9ucylcbiAgICAgIC5vbignY2hhbmdlJywgKGNvbHVtbikgPT4ge1xuICAgICAgICBzdmdfc2NhdHRlci5jYWxsKFxuICAgICAgICAgIHNjYXR0ZXJcbiAgICAgICAgICAgIC54VmFsdWUoKGQpID0+IGRbY29sdW1uXSlcbiAgICAgICAgICAgIC54VHlwZShnZXRUeXBlKGNvbHVtbikpXG4gICAgICAgICAgICAueENvbE5hbWUoY29sdW1uKVxuICAgICAgICApO1xuICAgICAgfSlcbiAgKTtcbiAgeU1lbnUuY2FsbChcbiAgICBtZW51KClcbiAgICAgIC5pZCgneS1tZW51JylcbiAgICAgIC5sYWJlbFRleHQoJ1k6JylcbiAgICAgIC5vcHRpb25zKG9wdGlvbnMpXG4gICAgICAub24oJ2NoYW5nZScsIChjb2x1bW4pID0+IHtcbiAgICAgICAgc3ZnX3NjYXR0ZXIuY2FsbChcbiAgICAgICAgICBzY2F0dGVyXG4gICAgICAgICAgICAueVZhbHVlKChkKSA9PiBkW2NvbHVtbl0pXG4gICAgICAgICAgICAueVR5cGUoZ2V0VHlwZShjb2x1bW4pKVxuICAgICAgICAgICAgLnlDb2xOYW1lKGNvbHVtbilcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICk7XG4gIGNNZW51LmNhbGwoXG4gICAgbWVudSgpXG4gICAgICAuaWQoJ3gtbWVudScpXG4gICAgICAubGFiZWxUZXh0KCdDaGFyYWN0ZXI6JylcbiAgICAgIC5vcHRpb25zKGNoYXJfbGlzdClcbiAgICAgIC5vbignY2hhbmdlJywgKE5hbWUpID0+IHtcbiAgICAgICAgXG4gICAgICAgIGZpbHRlcmVkX2NoYXJfcm93ICA9IGZpbHRlcl9yb3coZGF0YSwgTmFtZSlcbiAgICAgICAgXG4gICAgICAgIHN2Z19yYWRhci5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcbiAgICAgICAgc3ZnX3JhZGFyLmNhbGwoXG4gICAgICAgICAgcmFkXG4gICAgICAgICAgICAuZGF0YShmaWx0ZXJfZGF0YShkYXRhLCBOYW1lKSlcbiAgICAgICAgICAgIC5jb2xvcihjb2xvcl9waWNrZXIoZmlsdGVyZWRfY2hhcl9yb3cpKVxuICAgICAgICApO1xuICAgICAgICBzdmdfcmFkYXJcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsIHdpZHRoIC8gNCAtIDc1KVxuICAgICAgICAgIC5hdHRyKCd5JywgaGVpZ2h0IC0gNDQ1KVxuICAgICAgICAgIC50ZXh0KCdDaGFyYWN0ZXI6ICcgKyBOYW1lKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzIwcHgnKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKTtcblxuICAgICAgICBzdmdfcmFkYXJcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cigneCcsIHdpZHRoIC8gNCAtIDc1KVxuICAgICAgICAgIC5hdHRyKCd5JywgaGVpZ2h0IC0gNDIwKVxuICAgICAgICAgIC50ZXh0KFxuICAgICAgICAgICAgXCJDaGFyYWN0ZXIncyBUb3RhbCBQb3dlciBTY29yZTogXCIgK1xuICAgICAgICAgICAgICBmaWx0ZXJlZF9jaGFyX3Jvdy5Ub3RhbFxuICAgICAgICAgIClcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxOHB4JylcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG5cbiAgICAgICAgc3ZnX3JhZGFyXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ3gnLCB3aWR0aCAvIDQgLSA3NSlcbiAgICAgICAgICAuYXR0cigneScsIGhlaWdodCAtIDM5NSlcbiAgICAgICAgICAudGV4dChcbiAgICAgICAgICAgICdUb3RhbCBQb3dlciBSYW5rOiAnICtcbiAgICAgICAgICAgICAgZmlsdGVyZWRfY2hhcl9yb3cucmFuayArXG4gICAgICAgICAgICAgICcgb2YgMjU3IGNoYXJhY3RlcnMnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzE2cHgnKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKTtcblxuICAgICAgICBzdmdfc2NhdHRlci5jYWxsKFxuICAgICAgICAgIHNjYXR0ZXIuTWVudUNoYXIoZmlsdGVyX3JvdyhkYXRhLCBOYW1lKSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICk7XG59O1xubWFpbigpO1xuIl0sIm5hbWVzIjpbImRpc3BhdGNoIiwic2NhbGVQb2ludCIsInNjYWxlTGluZWFyIiwibWF4IiwibWluIiwidHJhbnNpdGlvbiIsImF4aXNMZWZ0IiwiYXhpc0JvdHRvbSIsImNzdiIsInNlbGVjdCIsImV4dGVudCIsInpvb20iLCJldmVudCIsImZvcm1hdCJdLCJtYXBwaW5ncyI6Ijs7O0VBQ08sTUFBTSxJQUFJLEdBQUcsTUFBTTtFQUMxQixFQUFFLElBQUksRUFBRSxDQUFDO0VBQ1QsRUFBRSxJQUFJLFNBQVMsQ0FBQztFQUNoQixFQUFFLElBQUksT0FBTyxDQUFDO0VBQ2QsRUFBRSxNQUFNLFNBQVMsR0FBR0EsYUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3ZDO0VBQ0EsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsS0FBSztFQUM1QixJQUFJLFNBQVM7RUFDYixPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUM7RUFDekIsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJ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QUFFLElBQUksTUFBTSxDQUFDO0VBQzFELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQzNCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksTUFBTSxDQUFDO0VBQzFELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQzFCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDO0VBQ3hELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQzFCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDO0VBQ3hELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQzNCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksTUFBTSxDQUFDO0VBQzFELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQ3pCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDO0VBQ3RELEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0VBQzFCLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFD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