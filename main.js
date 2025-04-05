console.log("main.js is working");

const width = 800;
const height = 600;

const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const projection = d3.geoMercator()
    .center([20, 5])    // Center on the middle of Africa
    .scale(250)         // Smaller number = zoomed out
    .translate([width / 2, height / 2]);


const path = d3.geoPath().projection(projection);

const geojsonUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

 const africanCountries = [
    "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CMR", "CPV", "CAF", "TCD",
    "COM", "COG", "CIV", "COD", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB",
    "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR", "LBY", "MDG", "MWI",
    "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA", "STP",
    "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA", "TGO", "TUN",
    "UGA", "ZMB", "ZWE"
  ];
 
const sahelCountries = ["SEN", "MRT", "MLI", "BFA", "NER", "TCD", "SDN", "ERI"];

d3.json(geojsonUrl).then(geoData => {
    const africaFeatures = geoData.features.filter(d =>
        africanCountries.includes(d.properties.ISO_A3)
    );

    // DRAW MAP
    svg.selectAll("path")
        .data(africaFeatures)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            const iso = d.properties.ISO_A3;
            return sahelCountries.includes(iso) ? "#f97316" : "#ccc";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .on("mouseover", function(event, d) {
            const countryName = d.properties.ADMIN;
            tooltip.html(`<strong>${countryName}</strong>`)
                   .style("opacity", 1);
            d3.select(this).attr("fill", "orange");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            const iso = d.properties.ISO_A3;
            d3.select(this).attr("fill", sahelCountries.includes(iso) ? "#f97316" : "#ccc");
            tooltip.style("opacity", 0);
        });
});
