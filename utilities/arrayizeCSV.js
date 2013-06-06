/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 2/16/13
 * Time: 11:51 PM
 * To change this template use File | Settings | File Templates.
 */

var makeArray = function(CSVData) {
    var rows = CSVData.split(/\n/);
    var cellData = [];

    for (var x in rows) {
        if (rows.hasOwnProperty(x)) {
            cellData[x] = rows[x].split('","');
        }
    }

    cellData = cleanCellData(cellData);
    return cellData;
};

var cleanCellData = function(cellData) {
    // check last row for existence of empty
    if (cellData[cellData.length - 1].length == 1) {
        cellData.pop();
    }

    // check the cells for right number of columns
    for (var i = 1; i < cellData.length; i++) {
        if (cellData[i].length > cellData[0].length) {
            columnPopper(cellData[i], cellData[0].length);
        }
    }
    //clean up quotes
    for (var j in cellData) {
        if (cellData.hasOwnProperty(j)) {
            for (var k in cellData[j]) {
                if (cellData[j].hasOwnProperty(k)) {
                    cellData[j][k] = cellData[j][k].replace(/\"/g, '');
                }
            }
        }
    }

    function columnPopper(row, headerLength) {
        if (row.length > headerLength) {
            row.pop();
            columnPopper(row, headerLength);
        }
        return row;
    }

    return cellData;
};

module.exports.makeArray = makeArray;



