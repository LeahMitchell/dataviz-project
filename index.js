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

import { menu } from './menu';
import { scatterPlot } from './scatterPlot';
import { radar } from './radar';

import {
  filter_data,
  color,
  color_picker,
  character_list,
  make_char_list,
  make_array,
  parse_data,
  parseRow,
  filter_row,
} from './HelperFunctions';

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

const svg_scatter = select('body')
  .append('svg')
  .attr('width', window.innerWidth * 0.6)
  .attr('height', window.innerHeight);

const svg_radar = select('body')
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

const menuContainer = select('body')
  .append('div')
  .attr('class', 'menu-container');

const xMenu = menuContainer.append('div');
const yMenu = menuContainer.append('div');
const cMenu = menuContainer.append('div');

const character = 'A-Bomb';

/////////////// MAIN ///////////////

const main = async () => {
  const data = await get_data();

  var filtered_char_row  = filter_row(data, character)
  
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
        
        filtered_char_row  = filter_row(data, Name)
        
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
