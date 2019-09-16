let barchart = d3.select("#barchart");
let timeline = d3.select("#timeline");

let width = 600;
let height = 320;

d3.csv("./unemploymentG7.csv")
  .then((data) => {
    data = prepareData(data);
    drawBarchart(data);
  });

let selectedCountry = undefined;

function prepareData(data){
  return data.map(d => {
    // tries to convert to number, if it cant returns NaN:
    let years = Object.keys(d).filter(k => !isNaN(+k));
    let history = years.map(function (y) {
      return {year: +y, value: +d[y], Country: d.Country};
    });
    d.History = history;
    return d;
  })
}

function drawLineChart(data){

  data = data.History;

  let xScale = d3.scaleLinear()
                  .domain(d3.extent(data, d => d.year))
                  .range([0, width - 20]);

  let yScale = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.value)])
                  .range([height, 0]);

  // Axes:
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  timeline.select('.xAxis')
          .call(xAxis)
          .attr('transform', 'translate(20, 330)');

  timeline.select('.yAxis')
          .call(yAxis)
          .attr('transform', 'translate(20, 0)');

  let lineGen = d3.line()
                  .x(d => xScale(d.year))
                  .y(d => yScale(d.value));

  timeline.select('.body')
          .append('path')
          .datum(data)
          .attr('d', lineGen)
          .attr('transform', 'translate(-130, 0)')
          .attr('class', 'line')
          .attr('stroke', 'grey');
          
}

function drawBarchart(data){

  let xScale = d3.scaleBand()
                  .domain(data.map(d => d.Country))
                  .range([0, width - 20])
                  .padding(0.1);

  let yScale = d3.scaleLinear()
                  .domain([0, d3.max(data, d => +d[2018])])
                  .range([height, 0]);

  // Axes:
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  d3.select('.xAxis')
    .call(xAxis)
    .attr('transform', 'translate(20, 330)');

  d3.select('.yAxis')
    .call(yAxis)
    .attr('transform', 'translate(20, 0)');

  let barchartBody = barchart.select('.body')
                             .selectAll('rect')
                             .data(data);

  barchartBody.enter()
              .append('rect')
              .attr('fill', 'grey')
              .attr('x', d => xScale(d.Country))
              .attr('y', d => yScale(+d[2018]))
              .attr('width', xScale.bandwidth())
              .attr('height',d => height - yScale(+d[2018]))
              .attr('transform', 'translate(-130, 0)')
              .on('click', d => {
                // remove previous line:
                timeline.selectAll('.line').remove();
                selectedCountry = d.Country;
                drawBarchart(data);
                drawLineChart(d);
              })
              .merge(barchartBody)
              .attr('fill', d => selectedCountry === d.Country ? 'red' : 'grey');

}
