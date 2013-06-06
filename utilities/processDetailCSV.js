/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 2/16/13
 * Time: 11:46 PM
 * To change this template use File | Settings | File Templates.
 */

var arrayizeCSV = require('./arrayizeCSV');

var testDetailMapping = [
    {CSVHeader: 'Action', index: 0, type: 'string'},
    {CSVHeader: 'Host', index: 0, type: 'string'},
    {CSVHeader: 'Response Code', index: 0, type: 'number'},
    {CSVHeader: 'Cached', index: 0, type: 'number'}

];

var actionIndex = 0;
var hostIndex = 0;
var responseCodeIndex = 0;
var cachedIndex = 0;
var foreignHosts = [];


var populateColumnIndexes = function(cellData) {
    for (var i in cellData[0]) {
        if (cellData[0].hasOwnProperty(i)) {
            for (var j in testDetailMapping) {
                if (testDetailMapping.hasOwnProperty(j)) {
                    if (cellData[0][i] == 'Action') {actionIndex = i;}
                    if (cellData[0][i] == 'Host') {hostIndex = i;}
                    if (cellData[0][i] == 'Response Code') {responseCodeIndex = i;}
                    if (cellData[0][i] == 'Cached') {cachedIndex = i;}
                    if (cellData[0][i] == testDetailMapping[j].CSVHeader){
                        testDetailMapping[j].index = i;
                    }
                }
            }
        }
    }
};

var appendStatusCodes = function(test, filtered, detailCSV) {

   var set = {};

   if (test.sets[0].filtered && filtered) {
      set = test.sets[1];
   } else {
      set = test.sets[0];
   }

   var runs = set.runs;

   runs[0].statusCodes = {};
   runs[1].statusCodes = {};
   runs[0].localDomainCalls = 0;
   runs[1].localDomainCalls = 0;
   runs[0].foreignDomainCalls = 0;
   runs[1].foreignDomainCalls = 0;


   var cellData = arrayizeCSV.makeArray(detailCSV);
   populateColumnIndexes(cellData);

   for (var i = 1; i < cellData.length; i++) {
     //check the Action field, if it's blank ignore (psuedo header?)
     if (cellData[i][actionIndex] != "") {
         var responseCode = Number(cellData[i][responseCodeIndex]);
         // cached field stores whether is un-cached or cached (first run vs second run)
         var runContext = 0;
         if (cellData[i][cachedIndex] == 1) {
             runContext = 1;
         }
         //if code exists, increment by 1
         if (runs[runContext].statusCodes[responseCode]) {
             runs[runContext].statusCodes[responseCode]++;

         } else {
             Object.defineProperty(runs[runContext].statusCodes, responseCode, {value: 1, enumerable: true, writable: true});
         }

         //foreign domains
         if (!filtered) {
             if (isForeignDomain(cellData[i][hostIndex], test.nativeDomain)) {

                 runs[runContext].foreignDomainCalls++;
                 if (foreignHosts.indexOf(cellData[i][hostIndex]) == -1) {
                     foreignHosts.push(cellData[i][hostIndex]);
                 }
             } else {
                 runs[runContext].localDomainCalls++;
             }
         }
     }
   }
   if (!filtered) {test.filteredViewDomains = foreignHosts;}
   return runs;
};

var isForeignDomain = function(host, nativeDomain) {
    return (host.substring(host.length - nativeDomain.length) != nativeDomain);
};




module.exports.appendStatusCodes = appendStatusCodes;
