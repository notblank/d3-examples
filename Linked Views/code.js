let body = d3.select("#body");
let container = d3.select("#container");

d3.csv("./sat.csv")
  .then(sat => showData(sat));

function showTooltip(text, coords) {
  d3.select('#tooltip')
    .text(text)
    .style('top', coords[1] + "px")
    .style('left', coords[0] + "px")
    .style('display', 'block');
}

function showData(sat) {

  let maxParticipation = d3.max(sat, d => +d.Participation);
  let maxTotal = d3.max(sat, d => +d.Total);

  let partScale = d3.scaleLinear()
    .domain([0, maxParticipation])
    .range([50, 250]);

  let totalScale = d3.scaleLinear()
    .domain([maxTotal, 1200])
    .range([50, 250]);

  // Axes:
  let xAxis = d3.axisBottom(partScale);
  let yAxis = d3.axisLeft(totalScale);

  d3.select('#xAxis')
    .call(xAxis)
    .attr('transform', 'translate(150, 250)');

  d3.select('#yAxis')
    .call(yAxis)
    .attr('transform', 'translate(180, 0)');

  let join = body.selectAll('circle')
    .data(sat);

  join.enter()
    .append('circle')
    .style('fill', 'blue')
    .attr('r', '5')
    .attr('cx', d => partScale(d.Participation))
    .attr('cy', d => totalScale(d.Total))
    .on('mouseover', d => {
      let coords = [d3.event.clientX, d3.event.clientY];
      showTooltip(d.State, coords);
    })
    // to show while on the object
    // .on('mousemove', d => {
    //   let coords = [d3.event.clientX, d3.event.clientY];
    //   showTooltip(d.State, coords);
    // })
    .on('mouseleave', d => {
      d3.select('#tooltip')
        .style('display', 'none')
    });

}
