chord-graph-D3
==============

Contains the code for the Chord Graph and the demonstration done with the 
Alum Data set from Grinnell College.

In order to use this code, the data must be given in a JSON format. The JSON 
must be an MxM matrix of data, showing the links to and from separate parts of
the chord graph. The first row and column must be strings giving the outer-most
labels. Then, if there are multiple levels, cutting in from the upper left hand
corner allows for more levels to be entered. The 1x1 index is where the unit for
the graph goes, that will be reflected in the data itself. The second to last
line shows what the measurement is for the hover text and the last line shows
up under the graphic, detailing where the data came from.

The data must be formatted in this way with the correct blank spots in the JSON
so that the text is parsed correctly. 
An example of this would be in table form: 
--------------------------------------------------------------------------------
|      Alumni    |         |  Careers   |   Careers     | Humanities           |
--------------------------------------------------------------------------------
|                |         |  Law       | Communications| Theatre & Dance      |
--------------------------------------------------------------------------------
|  Careers       |  Law    |   0        |        0      |        38            |
--------------------------------------------------------------------------------
|                                                                              |
--------------------------------------------------------------------------------
|  Alumni        |   In    |    0       |               |                      |
--------------------------------------------------------------------------------
| "Tagline regarding where the data came from."                                |
--------------------------------------------------------------------------------

You could make this kind of table in Excel, save it as a .csv, and then convert
to a JSON. Once converted into a JSON, ensure that the numbers are treated as 
numbers and do not have quotes around them, else the visualization will break. 

To do this, run the following command in terminal on your CSV file

<code>
perl -ne 's/"(\d+)"/$1/g; print' input_file.csv > output_file.csv
</code>

An example of the data can also be seen in: [link to data here].

Given that dataset, all you need to do is create an .html file that pulls in 
Chord.js. One can do that will the following lines of HTML.
<code>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="Chord.js"></script>
</code>

Then, you need to call the create graph function on your JSON. Here just change 
the string "Alumni Career Paths By Major" to the name of your JSON without the
".json". 

<code>
<script>
/* Call the createGraph function on the given dataset */
createGraph("Alumni Career Paths By Major", chordParse);
</script>
</code>

To debug your code or your JSON conversion, you can contact DASIL students as 
dasil@grinnell.edu, or check the Console on your favorite browser. To change
the colors or to add new features, one may edit the Chord.JS file. 
