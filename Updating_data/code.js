let barPlot = d3.select("#body");

d3.json("./birds.json")
  .then((birds) => {

    // to render existing data:
    showData(birds);

    d3.select('#addBirds')
          .on('click', function() {
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

      d3.select("#min_number")
        .on("change", function() {
            let min_val = this.value;
            let filtered_data = {
                "description": "Birds of Antarctica, grouped by family",
                "source": "https://en.wikipedia.org/wiki/List_of_birds_of_Antarctica",
                "birds": []
            }
            filtered_data.birds = birds.birds.filter(d => d.num_members > min_val)
            showData(filtered_data)
            
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
    .range([50, 300])
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

    joinPlot.exit().remove()

  let newBirds = joinPlot
    .enter()
    .append('rect')
    .attr('fill', 'grey')
    .on('click', d => {
      d3.select('#name').node().value = d.name;
      d3.select('#num_members').node().value = d.num_members;
    });

    // assigns html elements to originanl data:
    joinPlot.enter()
        .append('rect')
        .attr('fill', 'grey')

    // to update existing bars:
    // merge is the same as .enter().etc.
    // use merge to avoid writing attributes not needed to be updated
    joinPlot.merge(newBirds)
        .attr('width', d => widthScale(+d.num_members))
        .attr('height', positionScale.bandwidth)
        .attr('y', d => positionScale(d.family))
        .attr('transform', d => `translate(0, ${positionScale(d)})`);

    
};
