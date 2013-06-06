/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 2/16/13
 * Time: 11:15 PM
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');

var getFile = function(URL, callback) {
    var file = '';
    var request = http.get(URL, function(response) {

        response.setEncoding('utf8');

        response.on('data', function(responseChunk) {
            file += responseChunk;
        });
        response.on('end', function() {
            callback(file);
        });
    });
    request.end();
};

module.exports.getFile = getFile;
