(function (window) {

  var graph = {
    draw: function (thresholdCm = 20, kitNums = dnatree.myKits) {
      helper.filterData(thresholdCm, kitNums);
      helper.simulate();
    }
  };

  var helper = {
    nodes: [],
    links: [],

    partition: {
      pNodes: {},
      pLinks: [],
      toDoMatches: [],

      addNode: function (p) {
        let node = this.pNodes[p.id];
        if (node) node.r += 1;
        else this.pNodes[p.id] = { id: p.id, sex: p.sex, name: p.name, email: p.email, r: 1 };
      },

      addLink: function (m, s, t) {
        this.pLinks.push({
          source: s,
          target: t,
          gen: m.autosomal.gen,
          largestCM : m.autosomal.largestCM,
          xMatch: m.xMatch.largestCM
        });
      },

      add: function (m) {
        let ids = m.id.split(','),
            p1 = dnatree.persons[dnatree.kits[ids[0]].personId],
            p2 = dnatree.persons[dnatree.kits[ids[1]].personId];

        p1 && this.addNode(p1);
        p2 && this.addNode(p2);
        this.addLink(m, ids[0], ids[1]);
      }
    },

    filterData: function  (thresholdCm, kitNums) {
      function separator(partition, match) {
        if (match.autosomal.largestCM >= thresholdCm) {
          let ids = match.id.split(',');
          if (kitNums.indexOf(ids[0]) >= 0 || kitNums.indexOf(ids[1]) >= 0) {
            helper.partition.add(match);
          } else {
            helper.partition.toDoMatches.push(match);
          }
        }
      }

      Object.values(dnatree.matches).slice(1).reduce(separator, this.partition);
      this.partition.toDoMatches.map( m => {
        let ids = m.id.split(',');

        ((this.partition.pNodes[ids[0]] && this.partition.pNodes[ids[1]])
        || m.autosomal.gen <= 3)
        && this.partition.add(m);
      });

      this.nodes = Object.values(this.partition.pNodes);
      this.links = this.partition.pLinks;
    },

    simulate: function () {
      let svg = d3.select("svg"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      let g = svg.append("g")
        .attr("class", "graph");

      let link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.links)
        .enter().append("line")
          .attr("stroke-width", function(d) { return 2/d.gen; });

      link.append("title")
          .text(function(d) { return d.largestCM; });

      let node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(this.nodes)
        .enter().append("circle")
          .attr("class", function (d) { return d.sex; })
          .attr("r", function (d) { return Math.log(10 + d.r); })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

      node.append("title")
          .text(function(d) { return `${d.r} - ${d.name}`; });

      let simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('collision', d3.forceCollide())
        .force("link", d3.forceLink()
                          .id(function(d) { return d.id; })
                          .distance(function(d) { return d.gen; })
                          .iterations(4));

      simulation
          .nodes(this.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(this.links);

      let zoom_handler = d3.zoom()
          .scaleExtent([1 / 2, 10])
          .on("zoom", zoom_actions);

      zoom_handler(svg);

      function ticked() {
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function zoom_actions(){
          g.attr("transform", d3.event.transform)
      }
    }
  };


  window.graph = graph;

})(window);
