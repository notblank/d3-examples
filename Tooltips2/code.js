let body = d3.select("#body");
let container = d3.select("#container");

d3.csv("./acuerdo_partidos.csv")
  .then(data => showData(data));

function highlight(d) {

    selected_partido = d.partido

    d3.selectAll("." + d.selected_partido)
        .style("fill", "green")

}

function showData(partidos) {

    let numPartidos = d3.max(partidos, d => +d.porcentaje_acuerdo);
    let nombres_repetidos = partidos.map(d => d.partido)
    let nombres_partidos = [...new Set(nombres_repetidos)];

    let partidosScale = d3.scaleBand()
        .domain(nombres_partidos)
        .range([50, 250])

    let acuerdoScale = d3.scaleLinear()
        .domain([0, 1])
        .range([50, 250])
    
    let xAxis = d3.axisBottom(acuerdoScale)
                    .ticks(5, ".0%")
    let yAxis = d3.axisLeft(partidosScale);
    
    d3.select("#body")
        .append("g")
        .attr("id", "xAxis")
        .call(xAxis)
        .attr("transform", "translate(150, 250)")

    d3.select("#body")
        .append("g")
        .attr("id", "yAxis")
        .call(yAxis)
        .attr("transform", "translate(150, 0)")

    d3.select("#body")
        .selectAll("circle")
        .data(partidos)
        .enter()
        .append("circle")
        .style("fill", "red")
        .attr("r", 3)
        .attr("cx", d => acuerdoScale(Math.abs(d.porcentaje_acuerdo)))
        .attr("cy", d => partidosScale(d.partido))
        .attr("transform", "translate(150, 0)")
        .attr("class", d => d.partido.replace("-", "").replace(/\s/g, ""))
        .on("mouseover", d => {
            let selected_partido = d.target.className.baseVal
            d3.selectAll("." + selected_partido)
                .transition()
                .duration(100)
                .style("fill", "blue")
                .attr("r", 5)
        })
        .on("mouseleave", d => {
            let selected_partido = d.target.className.baseVal
            d3.selectAll("." + selected_partido)
                .transition()
                .duration(100)
                .style("fill", "red")
                .attr("r", 3)
        })


}



