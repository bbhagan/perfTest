/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 2/16/13
 * Time: 1:55 PM
 * To change this template use File | Settings | File Templates.
 */

 var arrayizeCSV = require('./arrayizeCSV');

 var testSummaryMapping = [
     {dbModelName: 'cachedView', CSVModelName: 'Cached', type: 'boolean'},
     {dbModelName: 'loadChrono', CSVModelName: 'Load Time (ms)', type: 'number'},
     {dbModelName: 'firstByteChrono', CSVModelName: 'Time to First Byte (ms)', type: 'number'},
     {dbModelName: 'startRenderChrono', CSVModelName: 'Time to Start Render (ms)', type: 'number'},
     {dbModelName: 'domElementCount', CSVModelName: 'DOM Elements', type: 'number'},
     {dbModelName: 'docCompleteChrono', CSVModelName: 'Doc Complete Time (ms)', type: 'number'},
     {dbModelName: 'docCompleteRequestCount', CSVModelName: 'Requests (Doc)', type: 'number'},
     {dbModelName: 'docCompleteBytesOut', CSVModelName: 'Bytes Out (Doc)', type: 'number'},
     {dbModelName: 'docCompleteBytesIn', CSVModelName: 'Bytes In (Doc)', type: 'number'},
     {dbModelName: 'fullyLoadedChrono', CSVModelName: 'Activity Time(ms)', type: 'number'},
     {dbModelName: 'fullyLoadedRequestCount', CSVModelName: 'Requests', type: 'number'},
     {dbModelName: 'fullyLoadedBytesOut', CSVModelName: 'Bytes Out', type: 'number'},
     {dbModelName: 'fullyLoadedBytesIn', CSVModelName: 'Bytes In', type: 'number'},
     {dbModelName: 'cacheScore', CSVModelName: 'Cache Score', type: 'number'},
     {dbModelName: 'staticCDNScore', CSVModelName: 'Static CDN Score', type: 'number'},
     {dbModelName: 'oneCDNScore', CSVModelName: 'One CDN Score', type: 'number'},
     {dbModelName: 'gzipScore', CSVModelName: 'GZIP Score', type: 'number'},
     {dbModelName: 'cookieScore', CSVModelName: 'Cookie Score', type: 'number'},
     {dbModelName: 'keepAliveScore', CSVModelName: 'Keep-Alive Score', type: 'number'},
     {dbModelName: 'doctypeScore', CSVModelName: 'DOCTYPE Score', type: 'number'},
     {dbModelName: 'minifyScore', CSVModelName: 'Minify Score', type: 'number'},
     {dbModelName: 'combineScore', CSVModelName: 'Combine Score', type: 'number'},
     {dbModelName: 'DNSLookups', CSVModelName: 'DNS Lookups (Doc)', type: 'number'},
     {dbModelName: 'compressionScore', CSVModelName: 'Compression Score', type: 'number'},
     {dbModelName: 'eTagScore', CSVModelName: 'ETag Score', type: 'number'},
     {dbModelName: 'basePageCompleteChrono', CSVModelName: 'Time to Base Page Complete (ms)', type: 'number'},
     {dbModelName: 'basePageResponseCode', CSVModelName: 'Base Page Result', type: 'number'},
     {dbModelName: 'gzipTotalBytes', CSVModelName: 'Gzip Total Bytes', type: 'number'},
     {dbModelName: 'gzipByteSavings', CSVModelName: 'Gzip Savings', type: 'number'},
     {dbModelName: 'minifyTotalBytes', CSVModelName: 'Minify Total Bytes', type: 'number'},
     {dbModelName: 'minifyByteSavings', CSVModelName: 'Minify Savings', type: 'number'},
     {dbModelName: 'imageTotalBytes', CSVModelName: 'Image Total Bytes', type: 'number'},
     {dbModelName: 'imageByteSavings', CSVModelName: 'Image Savings', type: 'number'},
     {dbModelName: 'basePageRedirects', CSVModelName: 'Base Page Redirects', type: 'number'},
     {dbModelName: 'titleChrono', CSVModelName: 'Time to Title', type: 'number'}

 ];

 var convertSummaryCSVToJSON = function(CSVData) {
     var runs = [];
     var cellData = arrayizeCSV.makeArray(CSVData);

     // iterate over the headers in the csv
     for (var i in cellData[0]) {
         if (cellData[0].hasOwnProperty(i)) {
             // iterate over the mappings
             for (var j in testSummaryMapping) {
                 if (testSummaryMapping.hasOwnProperty(j)) {
                     if (testSummaryMapping[j].CSVModelName == cellData[0][i]) {
                         // iterate over the rows of data to populate runs
                         for (var k = 1; k < cellData.length; k++) {
                             var propertyVal = cellData[k][i];
                             switch (testSummaryMapping[j].type) {
                                 case 'number':
                                     propertyVal = Number(propertyVal);
                                     break;
                                 case 'boolean':
                                     if (!isNaN(Number(propertyVal))) {propertyVal = Number(propertyVal);}
                                     propertyVal = Boolean(propertyVal);
                                     break;
                                 default: //String
                                     propertyVal = String(propertyVal);
                             }
                             // lazy load runs
                             if (!runs[k-1]){runs[k-1] = {};}
                             Object.defineProperty(runs[k-1], testSummaryMapping[j].dbModelName, {value: propertyVal, enumerable: true, writable: true});
                         }
                     }
                 }
             }
         }
     }
     return runs;

 };
module.exports.convertSummaryCSVToJSON = convertSummaryCSVToJSON;
