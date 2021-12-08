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
export const make_char_list = (d) => {
  const char_arr = [];
  d.forEach((element) => {
    char_arr.push({
      value: element.Name,
      text: element.Name,
    });
  });
  return char_arr;
};

export const character_list = (data) => {
  try {
    const char_arr = make_char_list(data);
    return char_arr;
  } catch (err) {
    console.log(err);
  }
};

//////// RADAR FUNCTIONS ////////////

// const character = 'A-Bomb';

export const make_array = (d) => {
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

export const parse_data = (d) => {
  return {
    Strength: +d.Strength,
    Intelligence: +d.Intelligence_x,
    Speed: +d.Speed,
    Durability: +d.Durability_x,
    Power: +d.Power,
    Combat: +d.Combat,
    Name: d.Name,
    Side: d.Alignment_x,
    Total: +d.Total,
  };
};

export const filter_row = (data, character) => {
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
export const filter_data = (data, character) => {
  try {
    const filter = filter_row(data, character);
    const arr = make_array(filter);
    return arr;
  } catch (err) {
    console.log(err);
  }
};

export const total_power = (data, character) => {
  try {
    const filter = filter_row(data, character)
    return filter.Total;
  } catch (err) {
    console.log(err);
  }
};

export const rank = (data, character) => {
  try {
    const filter = filter_row(data, character)
    return filter.rank;
  } catch (err) {
    console.log(err);
  }
};


export var color = d3
  .scaleOrdinal()
  .range(['steelblue', 'steelblue', '#00A0B0']);

export const color_picker = (d) => {
    if (d.Side == 'good') {
      color = 'green';
    } else if (d.Side == 'bad') {
      color = 'darkred';
    } else {
      color = 'grey';
    }
    return color;
};

export const parseRow = (d) => {
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

export const get_data = async () => {
  try {
    const data = await d3.csv(csvUrl, parseRow);
    return data;
  } catch (err) {
    console.log(err);
  }
};


