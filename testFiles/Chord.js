/***************************************
 * Authors:                            *
 * David Hanle                         *
 * Toby Baratta                        *
 *                                     *
 * Last updated May 16, 2014           *
 *                                     *
 * Modified from code provided by      *
 * Michael Bostick on his website      *
 * http://d3js.org/ and his GitHub     *
 * https://github.com/mbostock/d3/     *
 ***************************************/

function appendName(dataset) {

    "use strict";

    /* Use the filename as the title */
    var h = document.createElement("H1"),
        t = document.createTextNode(dataset);

    document.body.appendChild(h);
    h.appendChild(t);
}

function appendSource(source) {

    "use strict";

    var p = document.createElement("p"),
        t = document.createTextNode("Data Source | " + source);

    document.body.appendChild(p);
    p.appendChild(t);
}

function createGraph(dataset, parse) {

    "use strict";

    /* Reads in and parses the JSON into a giant matrix asynchronously */
    d3.json(dataset + ".json", function (error, raw) {
        if (error) { /* Handle errors when reading the file */
            return console.warn(error);
        }
        parse(raw); /* Send the one matrix to get parsed into the appropriate matrices and arrays */
    });
}

function chordParse(raw) {

    "use strict";

    var i, j, k,
        rows = raw[0].length, /* The number of rows in the matrix */
        matrix = [], /* Holds the data */
        labels = [], /* Holds the group labels */
        extra = [raw[rows], raw[rows + 1]]; /* Extract the clarifying words and data source */

    /* Parse appropriate rows into the labels array */
    for (i = 0; i < rows; i++) {
        if (typeof (raw[i][i]) !== "number") { /* Still a row of labels */
            labels[i] = raw[i];
        }
        else {
            break;
        }
    }

    /* Parse the appropriate cells into the matrix 2d array */
    for (j = i; j < rows; j++) {
        matrix[j - i] = [];
        for (k = i; k < rows; k++) {
            matrix[j - i][k - i] = raw[j][k];
        }
    }

    /* Graph it */
    createChord(labels, matrix, rows, extra);
}

function createChord(labels, matrix, rows, extra) {

    "use strict";

    var appendArcs,
        chords,
        fill,
        groups,
        layout,
        names,
        svg,
        layers = labels.length, /* The number of annuli around the chords */
        height = 3 / 4 * screen.height, /* Height of svg element */
        width = 3 / 4 * screen.width, /* Width of svg element */
        innerRadius = Math.min(width, height) * 0.33, /* Inner radius of the the first annulus */
        thickness = Math.min(width, height) * 0.35 - innerRadius; /* Thickness of each annulus */

    /*Initialize the chord layout*/
    layout = d3.layout.chord()
        .padding(0.05) /*Sets the space between groups to an angle in radians*/
        .sortSubgroups(d3.descending) /*Graphs the data within each group in some order*/
        .matrix(matrix); /*Sets the input data matrix for this chord diagram*/

    /*Defines the colors used in the chord diagram*/
    fill = d3.scale.ordinal()
        .domain(d3.range(10))
        .range(["#443333", "#668866", "#FFAA00", "#EECC33", "#33EEFF", "#64A52F", "#11B0EA", "#F76732", "#F7F338", "#7FFFD4"]);

    /*Append SVG element*/
    svg = d3.select("body").append("svg")
        .attr("width", width) /*Set its width*/
        .attr("height", height) /*Set its height*/
        .append("g") /*The g element groups objects together*/
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); /*Center the SVG element*/

    appendArcs = svg.selectAll("g");

    groups = appendArcs
        .data(layout.groups)
        .enter().append("g");

    /* Draw the chords */

    chords = svg.selectAll(".chord")
        .data(layout.chords)
        .enter().append("path")
        .attr("class", "chord")
        .style("fill", function (d) { return fill(d.target.index % 10); })
        .attr("d", d3.svg.chord().radius(innerRadius));

    chords.append("title")
        .text(function (d) {
            var percentage = [d.target.value * 100 / groups[0][d.target.index].__data__.value,
                              d.source.value * 100 / groups[0][d.source.index].__data__.value],
                text = labels[layers - 1][d.target.index + layers]
                    + " " + extra[0][0] + " " + extra[0][1] + " "
                    + labels[layers - 1][d.source.index + layers]
                    + ": " + d.target.value.toLocaleString() + " " + labels[0][0]
                    + " (" + percentage[0].toFixed(1) + "% of Total "
                    + labels[layers - 1][d.target.index + layers] + " " + extra[0][0] + ")";
            if (extra[0][2]) {
                return text + "\n"
                    + labels[layers - 1][d.source.index + layers]
                    + " " + extra[0][0] + " " + extra[0][1] + " "
                    + labels[layers - 1][d.target.index + layers]
                    + ": " + d.source.value.toLocaleString() + " " + labels[0][0]
                    + " (" + percentage[1].toFixed(1) + "% of Total "
                    + labels[layers - 1][d.source.index + layers] + " " + extra[0][0] + ")";
            }
            return text;
        });

    /* Draw the annulus */

    groups.append("path") /* For each group, append a path */
        .style("fill", function (d, i) { return fill(i % 10); }) /* Define the fill color by the index of the group object */
        .style("stroke", function (d, i) { return fill(i % 10); }) /* Define the border color */
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(innerRadius + thickness)) /* Define and draw the path as an arc */
        .on("mouseover", fade(0.1, chords)) /*Mousover fade events*/
        .on("mouseout", fade(1, chords));

    groups.append("title")
        .text(function (d, i) {
            return labels[layers - 1][i + layers] + " - "
                + "Total " + extra[0][0] + ": "
                + Math.round(d.value).toLocaleString() + " " + labels[0][0];
        });

    names = groups.append("text")
        .text(function (d, i) { return labels[layers - 1][i + layers]; })
        .attr("transform", function (d) { return moveText(innerRadius + thickness, (d.startAngle + d.endAngle) / 2, this.getBBox().width); });

    if (layers > 1) {
        graphSupergroups(rows, labels[0], innerRadius, thickness, layout, appendArcs, fill, names, chords);
    }

    appendSource(extra[1]);

}

function graphSupergroups(rows, labels, innerRadius, thickness, layout, appendArcs, fill, names, chords) {

    "use strict";

    var curlabel,
        i = 2,
        j = 0,
        startpos,
        superData = [],
        supergroups;

    names.style("opacity", 0);

    while (i < rows) {

        curlabel = labels[i];
        startpos = i;

        while (curlabel === labels[i]) {
            i++;
        }

        superData[j] = {innerRadius: innerRadius + thickness + 5, outerRadius: innerRadius + 2 * thickness + 5, startAngle: layout.groups()[startpos - 2].startAngle, endAngle: layout.groups()[i - 3].endAngle, text: curlabel, index: j, startIndex: startpos - 2, endIndex: i - 3};
        j++;
    }

    supergroups = appendArcs
        .data(superData)
        .enter().append("g");

    supergroups.append("path")
        .style("fill", function (d) { return fill(d.index % 10); })
        .style("stroke", function (d) { return fill(d.index % 10); })
        .attr("d", d3.svg.arc())
        .on("click", expand)
        .on("mouseover", superFade(0.1, chords, superData))
        .on("mouseout", superFade(1, chords, superData));

    supergroups.append("text")
        .text(function (d) { return d.text; })
        .attr("transform", function (d) { return moveText(d.outerRadius, (d.startAngle + d.endAngle) / 2, this.getBBox().width); });

    /* Function that expands the arcs and reveals the labels */
    function expand(d, i) {

        var arc = d3.select(this),
            eIndex = superData[i].endIndex,
            opacity = [],
            sIndex = superData[i].startIndex;

        if (d.innerRadius === innerRadius + thickness + 5) {
            superData[i].innerRadius += 100;
            superData[i].outerRadius += 100;
            opacity[0] = 1;
            opacity[1] = 0.2;
            opacity[2] = 0;
        }
        else {
            superData[i].innerRadius = innerRadius + thickness + 5;
            superData[i].outerRadius = innerRadius + 2 * thickness + 5;
            opacity[0] = 0;
            opacity[1] = 1;
            opacity[2] = 1;
        }
        names.filter(function (d, i) { return sIndex <= i && i <= eIndex; })
            .transition()
            .style("opacity", opacity[0]);
        arc.transition()
            .attr("d", d3.svg.arc())
            .style("opacity", opacity[1]);
        d3.select(supergroups[0][i]).select("text").transition().style("opacity", opacity[2]);
    }
}

/* Returns an event handler for fading a given chord group */
function fade(opacity, chords) {
    return function (g, i) {
        chords.filter(function (d) { return d.source.index !== i && d.target.index !== i; })
            .transition()
            .style("opacity", opacity);
    };
}

/* Returns an event handler for fading a given chord group */
function superFade(opacity, chords, superData) {
    return function (g, i) {
        var eIndex = superData[i].endIndex,
            sIndex = superData[i].startIndex;
        chords.filter(function (d) { return (d.source.index < sIndex || d.source.index > eIndex) && (d.target.index < sIndex || d.target.index > eIndex); })
            .transition()
            .style("opacity", opacity);
    };
}

/* Function that moves text away from a point at a given angle */
function moveText(distance, angle, textWidth) {
    /* Calculate the distance to move horizontally and vertically */
    var horizontal = 1.05 * distance * Math.sin(angle),
        vertical = -1.05 * distance * Math.cos(angle);

    /* Text has to be moved farther out if it is being moved to the left */                          
    if (angle > Math.PI)
        horizontal = horizontal - textWidth;

    return "translate(" + horizontal + "," + vertical + ")";
}