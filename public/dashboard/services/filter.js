/**
 * Created by ugo
 */

angular.module('FilterService', [])
    // super simple service
    // each function returns a promise object
    .factory('Filter', function () {
        var values = {};
        return {
            createDistinctValues: function (objectArray, columnArray) {

                for (var j = 0, k = columnArray.length; j < k; j++) {
                    if (!objectArray[0][columnArray[j]]) {
                        console.error('cannot find ' + column + ' column to create filter');
                        return false;
                    }
                    values[columnArray[j]] = [];
                }

                for (var i = 0, l = objectArray.length; i < l; i++) {
                    for (var j = 0, k = columnArray.length; j < k; j++) {
                        if (values[columnArray[j]].indexOf(objectArray[i][columnArray[j]]) < 0)
                            values[columnArray[j]].push(objectArray[i][columnArray[j]])
                    }
                }
                return true;
            },

            getDistinctValues: function (column) {
                return values[column];
            }

        }
    });
