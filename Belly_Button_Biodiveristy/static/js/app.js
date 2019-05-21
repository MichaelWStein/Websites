 // @TODO: Complete the following function that builds the metadata panel

    // Use d3.json to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildMetadata(sample) {
  //This is also used to initate building of the gauge (because washing frequency is part of the metadata)
  
  var washFreq;
  d3.json(`/metadata/${sample}`).then(function(returns) {
    var data = Object.entries(returns);
    // console.log(data);
    d3.select("#sample-metadata")
      .selectAll("li")
      .remove();
    data.forEach(function display(dataset) {
      if (dataset[0] == "sample") {
        dataset[0] = "SAMPLEID";
      };
      if (dataset[0] == "WFREQ") {
        washFreq = dataset[1];
      };
      if (dataset[1] != null) {
        d3.select("#sample-metadata")
          .append("li")
          .text(dataset[0] + ": " + dataset[1]); 
      };
    });
    buildGauge(washFreq);
  });  
};

function buildGauge(washFreq) {

  // I need a number between 0 and 180 or the gauge design

  var level = washFreq*(180/7);

// Trig to calc meter point
  var degrees = 180 - level,
     radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
    { values: [50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50],
    rotation: 90,
    text: ['6-7', '5-6', '4-5', '3-4',
            '2-3', '1-2', '0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(250, 250, 250, 0)', 'rgba(255, 255, 255, 0)']},
    labels: ['6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    title: '<b>Gauge</b> <br> Washing Frequency 0 - 7',
    //height: 1000,
    //width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
}


function buildCharts(sample) {

  var bactData = [];
  var chartDataAr = [];
  var otuIds = [];
  var otuLabel = [];
  var chartData = [];


  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(returnsChart) {
    chartData = Object.entries(returnsChart);
  //alert(chartData);
  //  console.log("Data = ", chartData, chartData[2][1]);  
  
   //Bacteria data needs to be changed to integer
    bactData = chartData[2][1];
    var num = +bactData[10];
    bactData.forEach(function numeric(bact) {
    (bact = +bact)});

    // The Array of objects is created
    otuIds = chartData[0][1];
    otuLabel = chartData[1][1];
    var i;
    for (i = 0; i < bactData.length; i++){
      var helpObj = {"otuIds": otuIds[i], "otuLabel": otuLabel[i], "bactData": bactData[i]};
      chartDataAr.push(helpObj);
    };
  
    //The array is sorted
    chartDataAr.sort((a, b) => (a.bactData > b.bactData) ? -1 : 1);

    //Plotting the pie chart:

    //Need the first 10 for the pie chart (highest number of bacteria)
    var pieAr = chartDataAr.slice(0, 10);

    //console.log(pieAr);
    data = [];
    label = [];
    nameC = [];
    pieAr.forEach(function info(number) {
      data.push(number.bactData);
      label.push(number.otuIds);
      nameC.push(number.otuLabel);
    })
    
    var data = [{
        values: data,
        labels: label,
        hoverinfo: "all, text",
        hovertext: nameC,
        type: 'pie'        
      }]

    var layout = {
      hovermode:'closest'
    };
    
    Plotly.newPlot('pie', data, layout);
  


// Creating the bubble plot
    var colorData = [];
    
 // the next two for loops can be combined into one, but I left them at two 
 // because then the program is easier to follow
    for (i=0; i<otuLabel.length; i++) {
      if (otuLabel[i] == "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus") {
        colorData[i] = 'blue'
      } else if (otuLabel[i] == "Bacteria" ) {
        colorData[i] = 'red';
      } else if (otuLabel[i] == "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Corynebacteriaceae;Corynebacterium") {
        colorData[i] = 'green';
      }
        else {colorData[i] = 'yellow';
      }
    }
  
    var trace1 = {
      x: otuIds,
      y: bactData,
      text: otuLabel,
      mode: 'markers',
      marker: {
        color: colorData,
        size: bactData
      }
    };
    
    var data = [trace1];
    
    var layout = {
        showlegend: false    
      };
    
    Plotly.newPlot("bubble", data, layout); 
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
