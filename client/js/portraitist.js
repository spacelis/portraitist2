/* global angular */
/* global require */

require.config({
  baseUrl: '/js',
  paths: {
    jQuery: '/lib/jquery/dist/jquery',
    angular: '/lib/angular/angular',
    bootstrap: '/lib/bootstrap/dist/js/bootstrap',
    crossfilter: '/lib/crossfilter/crossfilter',
    d3: '/lib/d3/d3',
    dc: '/lib/dc.js/dc',  // should use a version supporting AMD
    csv: '/lib/jquery-csv/src/jquery.csv',
    GMaps: '/lib/gmaps/gmaps',
    async: '/lib/requirejs-plugins/src/async',
    wordfreq: '/lib/wordfreq/src/wordfreq',
    wordcloud: '/lib/wordcloud2.js/src/wordcloud2',
  },
  shim: {
    jQuery: {exports : 'jQuery'},
    angular : {exports : 'angular', deps: ['jQuery']},
    bootstrap: {exports : 'bootstrap', deps: ['jQuery']},
    crossfilter: {exports: 'crossfilter'},
    csv: {exports: 'csv', deps: ['jQuery']},
    GMaps: {exports: 'GMaps', deps: ['async!http://maps.google.com/maps/api/js?sensor=false']},
  }
});
require([
    'angular',
    'bootstrap',
    '/components/js/apiendpoint.js',
    '/components/js/chart.js',
    '/components/js/googlemap.js',
    '/components/js/tagcloud.js'
    ] , function (angular) {
      // The portraitist is a directive defined in __portraitist.js
      // angular.bootstrap will start processing the template from <body> tag
      // and the "bootstrap" module in requirement is twitter-bootstrap UI module.
      angular.bootstrap(document.body, ['portraitist']);
});
