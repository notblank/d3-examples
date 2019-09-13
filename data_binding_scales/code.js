let barPlot = d3.select("#body");

d3.json("./birds.json")
  .then(showData);

function showData(birds){
  let maxMemb = d3.max(birds.birds, d => d.members.length);
  let widthScale = d3.scaleLinear()
                     .domain([0, maxMemb])
                     .range([0, 300]);

  let positionScale = d3.scaleBand()
                        .domain(birds.birds.map(d => d.family))
                        .range([0, 300])
                        .padding(0.1);

  // Axes:
  let xAxis = d3.axisBottom(widthScale);
  let yAxis = d3.axisLeft(positionScale);

  d3.select('#xAxis')
    .call(xAxis)
    .attr('transform', 'translate(150, 300)');

  d3.select('#yAxis')
    .call(yAxis)
    .attr('transform', 'translate(140, 0)');

  let joinPlot = barPlot
                    .selectAll('rect')
                    .data(birds.birds);

  joinPlot.enter()
          .append('rect')
          .attr('fill', 'grey')
          .attr('width', d => widthScale(d.members.length))
          .attr('height', positionScale.bandwidth)
          .attr('y', d => positionScale(d.family));

}
