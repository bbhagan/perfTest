/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/5/13
 * Time: 8:15 PM
 * To change this template use File | Settings | File Templates.
 */

var Test = require('../models/tests.js');
var WPTInterface = require('../utilities/WPTInterface');

exports.startTest = function (req, res) {
   var test = new Test({customerId: req.query.customerId, testURL: req.query.URL, runGroupStartTime: new Date(), nativeDomain: req.query.nativeDomain });


   WPTInterface.testRequest(test, false, function() {
      test.save(function(e, doc){});
      //WPTInterface.testRequest(test, true, function() {
         //test.save(function(e, doc) {
            //res.render('Ok');
         //});
      //});
   });

};
