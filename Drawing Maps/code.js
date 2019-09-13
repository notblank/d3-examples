let body = d3.select("#body");

Promise.all([
  d3.json("./custom.geo.json"),
  d3.csv("./saPop.csv")
]).then(showData);

function showData(dataSources) {
  let saMap = dataSources[0];
  let saPop = dataSources[1];

  let dataIndex = {};

  for(let c of saPop){
    let country = c.Country;
    dataIndex[country] = +c.Population;
  }

  saMap.features = saMap.features.map(d => {
                          let country = d.properties.name;
                          let pop = dataIndex[country];
                          // adding a new property:
                          d.properties.population = pop;
                          return d;
                        });

  let maxPop = d3.max(saMap.features,
          d => d.properties.population);

  let medianPop = d3.median(saMap.features,
          d => d.properties.population);

  let cScale = d3.scaleLinear()
                  .domain([0, medianPop, maxPop])
                  .range(['white', 'grey', 'black']);

  let projection = d3.geoMercator()
                     .scale(200)
                     .translate([400, 400/3]);

  let geoPath = d3.geoPath()
                  .projection(projection);

  body.selectAll('path')
      .data(saMap.features)
      .enter()
      .append('path')
      .attr('d', d => geoPath(d))
      .attr('stroke', 'white')
      .attr('fill',
          d => d.properties.population ?
               cScale(d.properties.population):
               'white');
}
