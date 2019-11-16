const m = {
  width: 650,
  height: 650
}

let svg = d3.select("body")
  .append("svg")
  .attr("width", m.width)
  .attr("height", m.height);

// Draw neighborhoods
d3.json("data/neighborhoods.json", data => {
    let neighborhoods = svg.append('g');

    let albersProj = d3.geoAlbers()
      .scale(190000)
      .rotate([71.057, 0])
      .center([0, 42.313])
      .translate([m.width / 2, m.height/2]);

    let geoPath = d3.geoPath()
      .projection(albersProj)

    neighborhoods.selectAll("path")
      .data(data['features'])
      .enter()
      .append("path")
      .attr("fill", "#ccc")
      .attr("d", geoPath);

    // Draw points
    d3.json("data/points.json", data => {
      let points = svg.append('g');

      points.selectAll('path')
        .data(data['features'])
        .enter()
        .append('path')
        .attr('fill', 'orange')
        .attr('stroke', 'darkred')
        .attr('d', geoPath);

      // Draw lines
      // NOTE: Only draw between lines, AKA don't go to last index
      let lines = svg.append('g')
      for (let i = 0; i < data['features'].length - 1; i++) {
        let coord1 = albersProj(data['features'][i]['geometry']['coordinates'])
        let coord2 = albersProj(data['features'][i + 1]['geometry']['coordinates'])

        let line = lines.append('line')
          .attr('x1', coord1[0])
          .attr('y1', coord1[1])
          .attr('x2', coord2[0])
          .attr('y2', coord2[1])
          .attr('stroke', 'darkred')

        let len = line.node().getTotalLength();
    
        line.attr("stroke-dasharray", len + " " + len)
          .attr("stroke-dashoffset", len)
          .transition()
          .duration(400)
          .delay(400 * i)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }
  })
})
