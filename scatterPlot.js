import {
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  max,
  min,
  scalePoint,
  transition,
  popover,
} from 'd3';

import {
  color_picker,
} from './HelperFunctions';


export const scatterPlot = () => {
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
      ? scalePoint().domain(data.map(xValue)).padding(0.2)
      : scaleLinear().domain([0, 110])
    ) //extent(data, xValue)
      .range([margin.left, width - margin.right]);

    const y = (yType === 'categorical'
      ? scalePoint().domain(data.map(yValue)).padding(0.2)
      : scaleLinear().domain([0, 110])
    ) //extent(data, yValue)
      .range([height - margin.bottom, margin.top]);

    const marks = data.map((d) => ({
      x: x(xValue(d)),
      y: y(yValue(d)),
      Name: Name(d),
      Side: Side(d),
      Total: Total(d),
    }));

    const Total_Max = max(data, Total);
    const Total_Min = min(data, Total);

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
    const t = transition().duration(500);

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
      .call(axisLeft(y));

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
      .call(axisBottom(x));
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
