const socket = io();
let data = [];

// Socket
socket.emit('join', 'test-3', (error) => {
  if (error) {
    alert(error);
  }
});

socket.on('allData', (allPoints) => {
  let totalConsumption = 0;
  data = allPoints.map((point) => {
    totalConsumption += point.value;
    return {
      ...point,
      value: totalConsumption,
    };
  });

  // data.map((d) => {
  //   console.log(new Date(d.createdAt));
  // });

  createChart();
});

// Charting
function createChart() {
  let margin = { top: 20, right: 20, bottom: 100, left: 100 };
  let width = 800;
  let height = 400;
  let graphWidth = width - margin.left - margin.right;
  let graphHeight = height - margin.top - margin.bottom;

  const root = d3.select('body').select('#root');
  const svg = root.append('svg').attr('width', width).attr('height', height);

  let graph = svg
    .append('g')
    .attr('id', 'graph')
    .attr('width', width)
    .attr('height', height)
    .style(
      'transform',
      `translate(${margin.left - margin.right}px, ${
        margin.bottom - margin.top
      }px)`,
    );

  // X Axis Scale /////////////////////////////////////////////////////////
  let dates = data.map((point) => new Date(point.createdAt));

  let xAxisGroup = svg
    .append('g')
    .attr('id', 'x-axis')
    .attr(
      'transform',
      `translate(${margin.left - margin.right}, ${
        graphHeight + margin.bottom - margin.top
      })`,
    );

  let xMax = d3.max(dates);
  let xMin = d3.min(dates);

  let xScale = d3.scaleTime().domain([xMin, xMax]).range([0, graphWidth]);

  let xAxis = d3.axisBottom().scale(xScale);
  xAxisGroup.call(xAxis);

  ////////////////////////////////////////////////////////////////////////

  // Y Axis Scale ////////////////////////////////////////////////////////
  let energyValues = data.map((point) => point.value);

  let yAxisGroup = svg
    .append('g')
    .attr('id', 'y-axis')
    .attr(
      'transform',
      `translate(${margin.left - margin.right}, ${margin.bottom - margin.top})`,
    );

  let yMax = d3.max(energyValues);
  let yMin = d3.min(energyValues);

  let yScale = d3.scaleLinear().domain([0, yMax]).range([graphHeight, 0]);

  let yAxis = d3.axisLeft().scale(yScale);
  yAxisGroup.call(yAxis);

  ////////////////////////////////////////////////////////////////////////

  // Graph ///////////////////////////////////////////////////////////////
  let linearScaleY = d3.scaleLinear().domain([0, yMax]).range([graphHeight, 0]);
  let scaledEnergyValues = energyValues.map((d) => yScale(d));

  let line = d3
    .line()
    .x(function (d, i) {
      const x = d3.scaleTime().domain([xMin, xMax]).range([0, graphWidth]);
      return x(dates[i]);
    }) // set the x values for the line generator
    .y(function (d, i) {
      return scaledEnergyValues[i];
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX);

  graph
    .selectAll('circle')
    .data(scaledEnergyValues)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('data-date', function (d, i) {
      return dates[i];
    })
    .attr('data-energy', function (d, i) {
      return energyValues[i];
    })
    .style('fill', 'green')
    .attr('cy', (d, i) => scaledEnergyValues[i])
    .attr('cx', (d, i) => xScale(dates[i]));

  graph
    .append('path')
    .datum(scaledEnergyValues)
    .attr('class', 'line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#000');
}
