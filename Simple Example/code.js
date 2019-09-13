let container = d3.select("#container");

d3.csv("./instruments.csv")
  .then(function (data){
      for(let person of data){
        write(person.name)
      }
    }
  );

function write(text) {
  container.append("div").text(text);
}
write('Line After')
