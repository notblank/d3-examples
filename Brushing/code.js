let body = d3.select("#body");

d3.csv("./sat.csv")
  .then(sat => {
    showData(sat);
    // Adding a brush (a bahavior):
    // brush on the top <=> before showData
    let brush = d3.brush();

    brush.on('brush', function (d){
      // d is the data!
      let coords = d3.event.selection;

      body.selectAll('circle')
          .style('fill', function (){
            let cx = d3.select(this).attr('cx');
            let cy = d3.select(this).attr('cy');

            let selected = isSelected(coords, cx, cy);

            return(selected ? "red" : "blue")
          })
    });

    body.append('g')
        .attr('class', 'brush')
        .call(brush);
  });

function isSelected(coords, x, y){
  let x0 = coords[0][0],
      y0 = coords[0][1],
      x1 = coords[1][0],
      y1 = coords[1][1];
    //true if [x, y] is inside the brush square
  return(x0 <= x && x <= x1 && y0 <= y && y <= y1);
}

function showData(sat){

  //console.log(sat);

  let maxParticipation = d3.max(sat, d => +d.Participation);
  let maxTotal = d3.max(sat, d => +d.Total);

  console.log(maxTotal, maxParticipation);

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

  let joinPlot = body.selectAll('circle')
                     .data(sat);

  let newElements = joinPlot.enter()
                        .append('circle')
                        .style('fill', 'blue')
                        .attr('r', '4');

  joinPlot.merge(newElements)
          .transition()
          .attr('cx', d => partScale(d.Participation))
          .attr('cy', d => totalScale(d.Total));
}
