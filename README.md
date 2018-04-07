# Portraitist2


A customizable and extensible work bench for exploring social media, a.k.a. Social Media Workbench.
Please find a demo at http://demo-portraitist.a3c1.starter-us-west-1.openshiftapps.com/

## How to use

The minimum example can be found in ```client/example``` directory. The
```server``` directory contains a Flask-based server which serves the
client and also as a proxy to Twitter's API. Simply running the server
will demonstrate the example.

### Setup Javascript Libraries for Client

The client relies on several third party Javascript libraries managed
by [Bower](http://bower.io). The configuration of dependent libraries
is in ```bower.json```. Use the following command to grab a copy of all
required libraries:

```bower install```

### Configuration and Running Server
    
For running the server, some python libraries listed in
```requirement.txt``` are needed. It can be simply installed by 
the following command.

```pip install -r requirement.txt``` 

Then running the server with:

```python twitter_proxy.py```


## Customization

The charting layouts relies on ```directive```s facilitated
by [AngularJS](https://anguarjs.org). Thus, it is easy to
customize the layout of charts and/or the dimensions each chart
depicts. They can be arranged by an HTML page with the following
links ensuring import of the [RequireJS](http://requirejs.org)
and the CSS of [DC.js](https://github.com/dcjs/dcjs) and
[Bootstrap](https://getbootstrap.com).

```html
<script data-main="/js/portraitist" src="/lib/requirejs/require.js"></script>
<link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.css" type="text/css">
<link rel="stylesheet" href="/lib/dc.js/dc.css" type="text/css">
```

### Directives

Each chart is loaded in a directive with some settings that can be passed though both
attributes of directives and setting dialogues in the interfaces. Currently,
4 types of charts are available and more are coming. They are pie charts,
timelines, tagclouds, maps. They all rely on a data source directive for
gathering data from API endpoints.

```datasource``` is a widget for grabbing data from a API endpoints, mapping to
subset of fields, currently supporting both JSON and CSV formats.

```tagcloud``` can capture the vocabulary of textual fields and depict
the words used in the fields.

```timeline``` is a bar chart depicting time series data which groups
data into different bins according to the given unit of time, e.g.,
hours, days.

```piechart``` can be used to show the distribution of values in a give
field.

```googlemap``` shows a map of geographical data which requires pairs of
coordinates.

All these directives can be arranged by customized HTML pages for
interactive exploration or annotation.

### Integration of New Charts

The data managing is based on [Crossfilter](https://github.com/square/crossfilter)
and all the charts should create a ```dimension``` by passing a function
for value accessing and then using that dimension for accessing the
filtered data with ```dimension.top()``` or ```dimension.bottom()```
A directive can be created by following the built-in ones with a few
adaptations. The new chart should also registers themselves to the global
chart render/redraw handler manager via ```register_renderer``` and
```register_redrawer``` so that the new chart will be redrawed on
filtered data when users interact with other charts.

## LICENSE

The MIT License (MIT)

Copyright (c) 2014 Wen Li

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
