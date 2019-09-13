let barPlot = d3.select("#body");

d3.json("./birds.json")
  .then((birds) => {

    // to render existing data:
    showData(birds);

    d3.select('#addBirds').on('click', function() {
      // reading data from buttons:
      let family = d3.select('#family').node().value;
      let num_members = d3.select('#num_members').node().value;
      console.log(num_members)
      // new family?
      let isOldBird = birds.birds.find(d => d.family === family);
      if (isOldBird) {
        isOldBird.num_members = num_members;
      } else {
        birds.birds.push({
          "family": family,
          "num_members": num_members
        })
      }
      // to render new data:
      showData(birds);
      // console.log(birds.birds);
    })
  });


function showData(birds) {

  // Scales:
  let maxMemb = d3.max(birds.birds, d => +d.num_members);
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

  let newBirds = joinPlot
    .enter()
    .append('rect')
    .attr('fill', 'grey')
    .on('click', d => {
      d3.select('#name').node().value = d.name;
      d3.select('#num_members').node().value = d.num_members;
    });

  console.log(newBirds)
  // assigns html elements to originanl data:
  joinPlot.enter()
    .append('rect')
    //.merge(newBirds)
    .attr('fill', 'grey')
    .attr('width', d => widthScale(+d.num_members))
    .attr('height', positionScale.bandwidth)
    .attr('y', d => positionScale(d.family));

  // to update existing bars:
  joinPlot.merge(newBirds)
    .attr('width', d => widthScale(+d.num_members))
    .attr('height', positionScale.bandwidth)
    .attr('transform', d => `translate(0, ${positionScale(d)})`);


};
