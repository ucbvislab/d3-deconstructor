D3 Deconstructor
=======

First release - October 2014

The D3 Deconstructor is a Google Chrome plugin for extracting data from [D3.js](http://d3js.org) visualizations.  D3 _binds data_ to DOM elements when building a visualization.  Deconstructor extracts this data and the visual mark attributes (such as position, width, height, and color) for each element in a D3 visualization.  Then, elements are grouped by the type of data they are bound to.

To extract data from a D3 visualization the user right clicks on the visualization and selects "Deconstruct Visualization" in the context menu.  Deconstructor then creates a window showing the data tables for each group of elements.  Then, you can save visualization data as JSON or CSV.

In addition to data and mark attributes, Deconstructor extracts the mappings between the data and marks in the visualizations.  These mappings are saved when saving as JSON only.

The D3 Deconstructor was developed in the [VisLab](http://vis.berkeley.edu) at UC Berkeley.  We also used the results of deconstruction to enable restyling of D3 visualizations.  You can find the paper here: http://vis.berkeley.edu/papers/d3decon
