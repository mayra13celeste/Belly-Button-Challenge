// Build the metadata panel

const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
d3.json(url).then(function(data) {
  console.log(data);
})
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metaData = data.metadata;


    // Filter the metadata for the object with the desired sample number
    let sampleNumber = metaData.filter(result => result.id == sample);

    let first_result = sampleNumber[0];
    console.log(first_result);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(first_result).forEach(([key, value]) =>{
      console.log(key,value);
      panel.append("h6").text(`${key}:${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
    let samplesFiltered = sampleData.filter(result => result.id == sample);

    // Fetch the first result and store it
    let firstResult = samplesFiltered[0];
    console.log(firstResult);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = firstResult.otu_ids;
    let otu_labels = firstResult.otu_labels;
    let sample_values = firstResult.sample_values;
    console.log(sample_values, otu_ids, otu_labels);

    // Build a Bubble Chart
    let bubbleChartTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        opacity: 0.75,
        size: sample_values,
        colorscale: "Earth"
      }
    };

    let layout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    let render = [bubbleChartTrace];
    Plotly.newPlot("bubble", render, layout);

    // Build a Bar Chart
    let sample_data = data.samples;
    // Apply a filter based on name_one
    let results = sample_data.filter(id => id.id == sample);

    let first_result = results[0];
    console.log(first_result);
    // Don't forget to slice and reverse the input data appropriately
    let sample_values1 = first_result.sample_values.slice(0,10);
    let otu_ids1 = first_result.otu_ids.slice(0,10);
    let otu_labels1 = first_result.otu_labels.slice(0,10);
    console.log(sample_values1);
    console.log(otu_ids1);
    console.log(otu_labels1);

    // Build the bar chart
    let barChartTrace = {
      x: sample_values1.reverse(),
      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      y: otu_ids1.map(item => `OTU ${item}`).reverse(),
      text: otu_labels1.reverse(),
      type: "bar",
      orientation: "h"
    };

    let layout1 = {title: {
      text: "<b>Top 10 Bacteria Cultures Found</b>",
      font: {size: 16, color: "black"},
    },
    hovermode: "closest",
    paper_bgcolor: "lavender",
    xaxis: {title: "Number of Bacteria"},
    yaxis: {title: "OTU ID"}
    };

    // Render the Bar Chart
    let render1 = [barChartTrace]
    Plotly.newPlot("bar", render1, layout1);

  });
};

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let names = data.names;
    console.log(names);


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(function(id) {
      dropdownMenu.append("option").text(id).property("value", id);
    });

    // Get the first sample from the list
    let firstSample = names[0];
    console.log(firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();