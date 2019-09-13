let body = d3.select("#body");

d3.json("./small_net.json")
  .then(showData);

function showData(small_net){

  // break the drawing part into two parts: draw and update:
  function createElements(){
    let nodes = body.append('g') // a group for all nodes.
                    .attr('class', 'nodes')
                    .selectAll('circle')
                    .data(small_net.nodes)
                    .enter()
                    .append('circle')
                      .attr('r', 7)
                      .attr('fill', 'black');

    let links = body.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(small_net.links)
                    .enter()
                    .append('line');
  }

  function updateElements(){
    // use tick to update
    d3.select('.nodes')
        .selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    d3.select('.links')
        .selectAll('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', 'black');

  }

  createElements(small_net);

  let simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id((d) => d.name))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(700/2, 320/2));

  // x,y pos and vel for every tick:
  simulation.nodes(small_net.nodes)
            .on('tick', updateElements);
            // () => console.log(small_net)

  simulation.force('link')
            .links(small_net.links);

}
