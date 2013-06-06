/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 2/18/13
 * Time: 9:18 PM
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');
var csvDataConverter = require('./csvDataConverter');
var processDetailCSV = require('./processDetailCSV');
var fileDownload = require('./fileDownload');

var testRequest = function(test, filtered, callback) {

   var getOptions = {
      hostname: 'www.webpagetest.org',
      path:'/runtest.php?url=' + test.testURL + '&f=json&k=80c516cb0fa34c6283282b17d00e8b17'
   };

   //filtered tests pass an additional "block" param to WPT
   if (filtered) {
      var block = test.filteredViewDomains.join('%20');
      getOptions.path += '&block=' + block;
   }

   var request = http.request(getOptions, function(res) {
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
         //console.log('BODY: ' + chunk);
         var respObj = JSON.parse(chunk);

         var set = {};
         set.runWptId = respObj.data.testId;
         set.wptJSONURL = respObj.data.jsonUrl;
         set.wptUIURL = respObj.data.userUrl;
         set.wptSummaryURL = respObj.data.summaryCSV;
         set.wptDetailURL = respObj.data.detailCSV;
         set.filtered = filtered;

         test.sets.push(set);

         console.log('filtered: '+ filtered);
         console.log('set.runWptId: '+ set.runWptId);
         console.log('set.wptJSONURL: '+ set.wptJSONURL);
         console.log('set.wptUIURL: '+ set.wptUIURL);
         console.log('set.wptSummaryURL: '+ set.wptSummaryURL);
         console.log('set.wptDetailURL: '+ set.wptDetailURL);
      });


      //every 5 seconds call WPT to see if the test is complete
      //TODO: replace with web callback from WPT
      res.on('end', function() {
         var testComplete = setInterval(function(){statusChecker(test, filtered, function() {
            testComplete = clearInterval(testComplete);
            getTestDetails(test, filtered, function() {
               callback();
            });
         })}, 5000);
      });
   });

   request.on('error', function(e) {
      console.log('Problem with initial request: ' + e.message);
   });

   request.end();
};

var statusChecker = function(test, filtered, callback) {
   var set = {};

   if (test.sets[0].filtered && filtered) {
      set = test.sets[1];
   } else {
      set = test.sets[0];
   }

   var runWPTId = set.runWptId;

   var statusCheckerOptions = {
      hostname:'www.webpagetest.org',
      path: '/testStatus.php?f=json&test=' + runWPTId
   };
   var statusRequest = http.request(statusCheckerOptions, function(statusResponse) {
      statusResponse.setEncoding('utf8');

      statusResponse.on('data', function(statusChunk) {
         var statusObj = JSON.parse(statusChunk);

         if (statusObj.statusCode == 200) {
            console.log('Test finished');
            callback();
         } else {
            console.log('Test not yet finished');
         }
      });
   });

   statusRequest.on('error', function(e) {
      console.log('problem with status request: ' + e.message);
   });

   statusRequest.end();
};

var getTestDetails = function(test, filtered, callback) {
   var set = {};

   if (test.sets[0].filtered && filtered) {
      set = test.sets[1];
   } else {
      set = test.sets[0];
   }

   fileDownload.getFile(set.wptSummaryURL, function(CSVData){

      set.runs = csvDataConverter.convertSummaryCSVToJSON(CSVData);

      fileDownload.getFile(set.wptDetailURL, function(detailCSV) {
         set.runs = processDetailCSV.appendStatusCodes(test, filtered, detailCSV);
         callback();
      });
   });

};

module.exports.testRequest = testRequest;
module.exports.statusChecker = statusChecker;
module.exports.getTestDetails = getTestDetails;
