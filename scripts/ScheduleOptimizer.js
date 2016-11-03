var ScheduleOptimizer = (function () {

    var _possibleOffsets = [
            [4, 4, 22],[4, 5, 21],[4, 6, 20],[4, 7, 19],[4, 8, 18],[4, 9, 17],[4, 10, 16],[4, 11, 15],[4, 12, 14],[4, 13, 13],[4, 14, 12],[4, 15, 11],[4, 16, 10],[4, 17, 9],[4, 18, 8],[4, 19, 7],[4, 20, 6],[4, 21, 5],[4, 22, 4],
            [5, 4, 21],[5, 5, 20],[5, 6, 19],[5, 7, 18],[5, 8, 17],[5, 9, 16],[5, 10, 15],[5, 11, 14],[5, 12, 13],[5, 13, 12],[5, 14, 11],[5, 15, 10],[5, 16, 9],[5, 17, 8],[5, 18, 7],[5, 19, 6],[5, 20, 5],[5, 21, 4],
            [6, 4, 20],[6, 5, 19],[6, 6, 18],[6, 7, 17],[6, 8, 16],[6, 9, 15],[6, 10, 14],[6, 11, 13],[6, 12, 12],[6, 13, 11],[6, 14, 10],[6, 15, 9],[6, 16, 8],[6, 17, 7],[6, 18, 6],[6, 19, 5],[6, 20, 4],
            [7, 4, 19],[7, 5, 18],[7, 6, 17],[7, 7, 16],[7, 8, 15],[7, 9, 14],[7, 10, 13],[7, 11, 12],[7, 12, 11],[7, 13, 10],[7, 14, 9],[7, 15, 8],[7, 16, 7],[7, 17, 6],[7, 18, 5],[7, 19, 4],
            [8, 4, 18],[8, 5, 17],[8, 6, 16],[8, 7, 15],[8, 8, 14],[8, 9, 13],[8, 10, 12],[8, 11, 11],[8, 12, 10],[8, 13, 9],[8, 14, 8],[8, 15, 7],[8, 16, 6],[8, 17, 5],[8, 18, 4],
            [9, 4, 17],[9, 5, 16],[9, 6, 15],[9, 7, 14],[9, 8, 13],[9, 9, 12],[9, 10, 11],[9, 11, 10],[9, 12, 9],[9, 13, 8],[9, 14, 7],[9, 15, 6],[9, 16, 5],[9, 17, 4],
            [10, 4, 16],[10, 5, 15],[10, 6, 14],[10, 7, 13],[10, 8, 12],[10, 9, 11],[10, 10, 10],[10, 11, 9],[10, 12, 8],[10, 13, 7],[10, 14, 6],[10, 15, 5],[10, 16, 4],
            [11, 4, 15],[11, 5, 14],[11, 6, 13],[11, 7, 12],[11, 8, 11],[11, 9, 10],[11, 10, 9],[11, 11, 8],[11, 12, 7],[11, 13, 6],[11, 14, 5],[11, 15, 4],
            [12, 4, 14],[12, 5, 13],[12, 6, 12],[12, 7, 11],[12, 8, 10],[12, 9, 9],[12, 10, 8],[12, 11, 7],[12, 12, 6],[12, 13, 5],[12, 14, 4],
            [13, 4, 13],[13, 5, 12],[13, 6, 11],[13, 7, 10],[13, 8, 9],[13, 9, 8],[13, 10, 7],[13, 11, 6],[13, 12, 5],[13, 13, 4],
            [14, 4, 12],[14, 5, 11],[14, 6, 10],[14, 7, 9],[14, 8, 8],[14, 9, 7],[14, 10, 6],[14, 11, 5],[14, 12, 4],
            [15, 4, 11],[15, 5, 10],[15, 6, 9],[15, 7, 8],[15, 8, 7],[15, 9, 6],[15, 10, 5],[15, 11, 4],
            [16, 4, 10],[16, 5, 9],[16, 6, 8],[16, 7, 7],[16, 8, 6],[16, 9, 5],[16, 10, 4],
            [17, 4, 9],[17, 5, 8],[17, 6, 7],[17, 7, 6],[17, 8, 5],[17, 9, 4],
            [18, 4, 8],[18, 5, 7],[18, 6, 6],[18, 7, 5],[18, 8, 4],
            [19, 4, 7],[19, 5, 6],[19, 6, 5],[19, 7, 4],
            [20, 4, 6],[20, 5, 5],[20, 6, 4],
            [21, 4, 5],[21, 5, 4],
            [22, 4, 4]
        ],

        _getOptimizedOffsets = function _getOptimizedOffsets() {

            var offsetIndex, // stores which offset currently has the best result
                bestTime = 999999, // stores the amount of time saved an offset needs to beat
                i,
                offsets,
                result;

            for (i = 0; i < _possibleOffsets.length; i++) { // loop through each possible offset

                offsets = _possibleOffsets[i];
                result = 0;

                $('.trip-wrap').each(function() { // loop through each trip

                    // get trip info
                    var initialPlatformTime = $('.platform-time', $(this)).data('initial-platform-time'),
                        minTime = $('.trip-start', $(this)).data('min-train-time'),
                        route = $('.connection', $(this)).data('route'),
                        routeDirection = $('.connection', $(this)).data('route-direction'),
                        startStationId = $('.trip-start', $(this)).data('start-station'),
                        firstTrainTime = ScheduleHelper.getFirstTrainTime(route, routeDirection, minTime, startStationId, offsets[0], offsets[1]),
                        newPlatformTime = firstTrainTime - minTime;

                    result += Math.floor(newPlatformTime / 60);

                });

                if (result < bestTime) {
                    // found a better schedule, save it
                    offsetIndex = i;
                    bestTime = result;
                }
            }

            console.log('offsetIndex', offsetIndex);

            return _possibleOffsets[offsetIndex];

        };
 
    return {
        getOptimizedOffsets: _getOptimizedOffsets
    };

})();