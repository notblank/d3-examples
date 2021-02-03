let body = d3.select("#body");
let container = d3.select("#container");

d3.csv("./sat.csv")
  .then(sat => {
    showData(sat);
  });

function is_inside(top_lims, bot_lims, x, y) {
  let x0 = top_lims[0],
    y0 = top_lims[1],
    x1 = bot_lims[0],
    y1 = bot_lims[1];

  return (x0 <= x && y0 <= y && x <= x1 &&  y <= y1);
}

function showData(sat) {

  //console.log(sat);

  let maxParticipation = d3.max(sat, d => +d.Participation);
  let maxTotal = d3.max(sat, d => +d.Total);

  let partScale = d3.scaleLinear()
    .domain([0, maxParticipation])
    .range([50, 250]);

  let totalScale = d3.scaleLinear()
    .domain([maxTotal, 0])
    .range([50, 250]);

  // Axes:
  let xAxis = d3.axisBottom(partScale);
  let yAxis = d3.axisLeft(totalScale);

  let zoom = d3.zoom();
  zoom.on('zoom', function() {
      let t = d3.event.transform;
      let newXScale = t.rescaleX(partScale);
      let newYScale = t.rescaleY(totalScale);

      // new scale and redraw
      xAxis.scale(newXScale);
      xAxisGroup.call(xAxis);

      yAxis.scale(newYScale);
      yAxisGroup.call(yAxis);

      //let top_lims = [newXScale(0), newYScale(0)];
      //let bot_lims = [newXScale(maxParticipation), newYScale(maxTotal)];
      
      join.merge(newElements)
          .attr('cx', d => newXScale(+d.Participation))
          .attr('cy', d => newYScale(+d.Total));

  });

    // zoom listens to actions inside container
  container.call(zoom);

  let xAxisGroup = d3.select('#xAxis')
    .call(xAxis)
    .attr('transform', 'translate(150, 250)');

  let yAxisGroup = d3.select('#yAxis')
    .call(yAxis)
    .attr('transform', 'translate(180, 0)');

  let join = body.selectAll('circle')
    .data(sat);

  let newElements = join.enter()
    .append('circle')
    .style('fill', 'blue')
    .attr('r', '4');

  join.merge(newElements)
    .transition()
    .attr('cx', d => partScale(d.Participation))
    .attr('cy', d => totalScale(d.Total));
}
