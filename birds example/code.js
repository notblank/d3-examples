let container = d3.select("#container");

d3.json("./birds.json")
  .then(function (data){
      write('The Birds have arrived:');
      for(let bird of data.birds){
        drawData(bird);
        // write(bird.family);
      }
    }
  );

function write(text) {
  container.append("div").text(text);
}

function drawData(birds){
  let join = container
                .selectAll('div')
                .data(birds);
  // data points without a DOM element:
  join.enter().append('div')
              .text(d => d.family);
}
