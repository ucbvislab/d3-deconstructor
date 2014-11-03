D3 Deconstructor
=======

First release - October 2014

The D3 Deconstructor is a Google Chrome extension for extracting data from [D3.js](http://d3js.org) visualizations.  D3 _binds data_ to DOM elements when building a visualization.  Deconstructor extracts this data and the visual mark attributes (such as position, width, height, and color) for each element in a D3 visualization.  Then, elements are grouped by the type of data they are bound to.

The D3 Deconstructor was developed in the [VisLab](http://vis.berkeley.edu) at UC Berkeley.  We also used the results of deconstruction to enable restyling of D3 visualizations.  You can find the paper here: http://vis.berkeley.edu/papers/d3decon

### Usage

To extract data from a D3 visualization the user right clicks on the visualization and selects "Deconstruct Visualization" in the context menu.  Deconstructor then creates a window showing the data tables for each group of elements.  Then, you can save visualization data as JSON or CSV.

In addition to data and mark attributes, Deconstructor extracts the mappings between the data and marks in the visualizations.  These mappings are saved when saving as JSON only.  JSON output is an array of "schema" objects which have several properties:

* **data** - The data table for the visualization, represented as an object whose keys are the data column names and the value for each key is the array of data values in the column.
* **attrs** - The mark attribute table, represented using an object similar to *data*.
* **mappings** - A list of mappings found for the group of marks.  Each mapping is an object with several properties:
  * *type* - The type of mapping; we extract mappings which are linear and one-to-one correspondences between data and attributes.
  * *data* - Either a single data field name or an array of data field names for the mapping.
  * *attr* - The mapped attribute.
  * *params* - A set of parameters that describe the mapping.
* **ids** - A list containing a unique ID for each node, representing its order in a traversal of its SVG tree. 

###Installation

The easiest way to install Deconstructor is by downloading the [bundled extension](http://ucbvislab.github.io/d3-deconstructor/d3-deconstructor.crx).
To install the bundled extension, simply drag the file into Chrome's Extensions page.  The extensions page can be found at:

    chrome://extensions



**Note:** You must have [Node](http://nodejs.org/) installed to build Deconstructor.

To build Deconstructor, first clone this repository and navigate to the cloned folder.  Then, install dependencies via NPM and run Browserify.

    git clone git://github.com/ucbvislab/d3-deconstructor
    cd d3-deconstructor
    npm install
    grunt browserify

Finally, navigate to chrome://extensions in Chrome, click "Load unpacked extension..." and select the cloned folder.
