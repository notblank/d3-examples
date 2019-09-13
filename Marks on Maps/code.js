let body = d3.select("#body");
// earthquake data past 7 days:
// coding train: https://www.youtube.com/watch?v=ZiYdOwOrGyc

let earthQ_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv'

Promise.all([
  d3.json("./custom.geo.json"),
  d3.csv(earthQ_URL)
]).then(showData);

function showData(dataSources) {
  let worldMap = dataSources[0];
  let earthqData = dataSources[1];

  let projection = d3.geoMercator()
                     .scale(80)
                     .translate([600/2, 600/2]);

  let geoPath = d3.geoPath()
                  .projection(projection);

  body.selectAll('path')
      .data(worldMap.features)
      .enter()
      .append('path')
      .attr('d', d => geoPath(d))
      .attr('stroke', 'grey')
      .attr('fill', '#eee');

  body.selectAll('circle')
      .data(earthqData)
      .enter()
      .append('circle')
      .attr('fill-opacity', 0.3)
      .attr('fill', '#bc2464')
      .attr('r', d => Math.pow(10, d.mag - 4))
      .attr('cx', d => projection([+d.longitude, +d.latitude])[0])
      .attr('cy', d => projection([+d.longitude, +d.latitude])[1])

}
