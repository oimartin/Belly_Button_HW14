function buildMetadata(sample) {
  console.log(sample);

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  console.log(url);

  d3.json(url).then(function(sample) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var data = sample_metadata.append("p");
      data.text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
  d3.json(url).then(function(sample) {

    // @TODO: Build a Bubble Chart using the sample data
    var x_values = sample.otu_ids;
    var y_values = sample.sample_values;
    var sizes = sample.sample_values;
    var colors = sample.otu_ids; 
    var labels = sample.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: labels,
      mode: 'markers',
      marker: {
        color: colors,
        size: sizes
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
      yxis: {title: "Sample Number"}
    };

    Plotly.newPlot('bubble', data, layout);
   
    // @TODO: Build a Pie Chart
    d3.json(url).then(function(sample) {
      console.log(url);

      var pie_values = sample.sample_values.slice(0,10);
      var pie_ids = sample.otu_ids.slice(0,10);
      var pie_labels = sample.otu_labels.slice(0,10);

      var trace2= {
        values: pie_values,
        labels: pie_ids,
        hovertext: pie_labels,
        type: 'pie'
      };

      var data = [trace2];
      var layout = {
        height: 300,
        width: 300,
        showlegend: true
      };

      Plotly.newPlot('pie', data,layout);

    });
  });   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();