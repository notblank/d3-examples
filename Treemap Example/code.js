let body = d3.select("#body");

d3.json("./hierData.json")
  .then(showData);

function showData(world_prizes){

  let treemap = d3.treemap()
                   .size([680, 300])
                   .paddingInner(1);

  let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // hierarchical data: root -> children -> children -> ...
  let root = d3.hierarchy(world_prizes)
                  .sum(d => d.num);

  // gives postitions for squares:
  treemap(root);

  // leaves = countries:
  let cell = body.selectAll('g')
                 .data(root.leaves())
                 .enter()
                 .append('g')
                 .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

  cell.append('rect').attr('width', d => d.x1 - d.x0)
                     .attr('height', d => d.y1 - d.y0)
                     .attr('fill', d => colorScale(d.parent.data.name));

  cell.append('text').text(d => d.data.name)
                     .attr('alignment-baseline', 'hanging')
                     .attr('fill', 'white')
                     .attr('font-size', 5);

  console.log(root.leaves());
}
