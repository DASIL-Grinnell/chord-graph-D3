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

The rows are the source, while the columns are the sink in terms of trading and size. 

The data must be formatted in this way with the correct blank spots in the JSON
so that the text is parsed correctly. 
An example of this would be in table form like [this](Examples/fakeCSV.xlsx), in Excel format. That is the 
easiest way to make this type of table.  In this case, I'm showing that Italy gets 10 Simleons from Egypt, while Egypt gets 400 Simleons from Italy. 

You could make this kind of table in Excel, like shown above. You then must
save it as a .csv, and then convert to a JSON. 

You can save it as a CSV just by using "Save As" within Excel and clicking on the
"comma separated values". This should result in something like [this](Examples/fakeCSV.csv).


Next, you convert to a JSON. My suggestion on how to do this would be to use 
[this](http://www.convertcsv.com/csv-to-json.html) website, do not change any
settings, and then hit "CSV to JSON Array" at the bottom. If you are having
errors with the data, check to make sure that under "Step Two" the First Row is 
Column Names is not checked.

This should result in data that looks like [this](Examples/fakeCSV.json). 

Once converted into a JSON, ensure that the numbers are treated as 
numbers and do not have quotes around them, else the visualization will break. 

The easiest way to do this if you are computer savy and have a Unix based machine would
be to run the following command, and then use your output_file.json. 
Below are the directions to fix this for a Unix user--for a Windows user, see below.

```
perl -ne 's/"(\d+)"/$1/g; print' fakeCSV.json > "Fake Data Example Presentation.json"
```
However, if you are not on a Unix based machine, you can just go to: https://regex101.com/, 
copy and paste your json data into the top "TEST STRING" box, and then paste the following
into the regular expression mox all together:

```
s/"(\d+)"/$1/g
```

This should look somewhat like [this](Examples/Example Regex.png) image. Then, copy and paste the bottom box, under "SUBSTITUTION" and save that as a new .json file, where the name of the file is the name of what you want the header on the visualization to look like. So, I'd do something like "Fake Data Example Presentation.json" as the title for my file. 

An example of what the data should now look like is [here]().

*Before you save and close this .json file, remove the extra commas after the 
text on the second and last lines before the brackets. If you do not, the commas
will appear within the visualization. *

Given that dataset, all you need to do is create an .html file that pulls in 
Chord.js. One can do that will the following lines of HTML.
```
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="Chord.js"></script>
```
Then, you need to call the create graph function on your JSON. Here just change 
the string "Alumni Career Paths By Major" to the name of your JSON without the
".json". In this case, I have it set to "Fake Data Example Presentation.json". 

```
<script>
/* Call the createGraph function on the given dataset */
createGraph("Fake Data Example Presentation", chordParse);
</script>
```

With a .html file with the code from the beginning and those final lines, you should be able to make the chord diagram visualize whatever you would like! See below for this output!

!(Examples/ExampleFakeData.png)

To debug your code or your JSON conversion, you can contact DASIL students as 
dasil@grinnell.edu, or check the Console on your favorite browser. To change
the colors or to add new features, one may edit the Chord.JS file. 
