/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/4/13
 * Time: 2:24 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
   customerId : Number,
   testURL : String,
   runGroupStartTime : {type: Date},
   runGroupFinishTime: {type: Date},
   nativeDomain: String,
   filteredViewDomains: [],
   sets: [
      {
         runWptId: String,
         wptJSONURL: String,
         wptUIURL: String,
         wptSummaryURL: String,
         wptDetailURL: String,
         filtered: Boolean,
         runs:[
            {
               loadChrono: Number,
               firstByteChrono: Number,
               fullyLoadedBytesOut: Number,
               fullyLoadedBytesIn: Number,
               fullyLoadedRequestCount: Number,
               startRenderChrono: Number,
               fullyLoadedChrono: Number,
               cachedView: Boolean,
               docCompleteChrono: Number,
               cacheScore: Number,
               staticCDNScore: Number,
               oneCDNScore: Number,
               gzipScore: Number,
               cookieScore: Number,
               keepAliveScore: Number,
               doctypeScore: Number,
               minifyScore: Number,
               combineScore: Number,
               docCompleteBytesOut: Number,
               docCompleteBytesIn: Number,
               DNSLookups: Number,
               docCompleteRequestCount: Number,
               compressionScore: Number,
               eTagScore: Number,
               basePageCompleteChrono: Number,
               basePageResponseCode: Number,
               gzipTotalBytes: Number,
               gzipByteSavings: Number,
               minifyTotalBytes: Number,
               minifyByteSavings: Number,
               imageTotalBytes: Number,
               imageByteSavings: Number,
               basePageRedirects: Number,
               domElementCount: Number,
               titleChrono: Number,
               statusCodes: [
                  {
                     statusCode: Number,
                     count: Number
                  }
               ],
               localDomainCalls: Number,
               foreignDomainCall: Number
            }
         ]
      }
   ]
});

module.exports = mongoose.model('test', testSchema);
