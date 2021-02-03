let container = d3.select("#container");

let persons = [
                {Name:'person0'}
              ]
let count = 1;

function addSubject(){
  persons.push({Name: 'person' + count});
  count = count + 1;
  showData(persons);
}

function removeSubject(){
  persons.pop();
  count = count - 1;
  showData(persons);
}

function showData(){
  let join = container.selectAll('div')
                      .data(persons);
  // data without a DOM element - Enter:
  join.enter()
      .append('div')
      .text(d => d.Name + '-NEW');
  // Remove elemets not associated with data (persons.pop) - Exit:
  join.exit().remove();
  // Updated data-elements:
  join.text(d => d.Name + '-OLD...');

}
