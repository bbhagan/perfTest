/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 5/8/13
 * Time: 2:08 PM
 * To change this template use File | Settings | File Templates.
 */

var dateFormat = require('dateformat');

var toCompactDateString = function(date) {
    var returnDate = '';

    if (date.getMonth() == 0) {
        returnDate = dateFormat(date, 'm/d/yy');
    } else {
        returnDate = dateFormat(date, 'm/d');
    }
    return returnDate;
};

var msToSeconds = function(ms) {
    return ms/1000;
};

module.exports.toCompactDateString = toCompactDateString;
module.exports.msToSeconds = msToSeconds;
