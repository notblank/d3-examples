let body = d3.select("#body");

d3.csv("./total_pop.csv")
  .then(showData);

function showData(pop){

  // format the data:
  pop = pop.map(d => ({
                    year: +d.year,
                    pop_year: +d.pop_year
                  })
                 );

  let maxPop = d3.max(pop, d => d.pop_year);
  let maxYear = d3.max(pop, d => d.year);
  let minYear = d3.min(pop, d => d.year);

  let popScale = d3.scaleLinear()
                  .domain([0, maxPop])
                  .range([290, 10]);

  let yearScale = d3.scaleLinear()
                  .domain([minYear, maxYear])
                  .range([0, 500]);

  body.append('g')
        .call(d3.axisLeft(popScale));

  body.append('g')
        .call(d3.axisBottom(yearScale))
        .attr('transform', 'translate(0, 300)');

  let valueLine = d3.line()
                      .x(d => yearScale(d.year))
                      .y(d => popScale(d.pop_year))
                      .defined(d => !!d.year);

  body.append('path')
      .datum(pop)
      .attr('d', valueLine)
      .attr('class', 'line');

}
