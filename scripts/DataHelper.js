var DataHelper = (function () {

    var _generateTrip = function _generateTrip(amPm) {

            var startTime = TimeHelper.getRandomStartTime(amPm),
                randomTrip = ScheduleHelper.getRandomTrip(),
                trip;

            trip = {
                first_stop_time: ScheduleHelper.getFirstTrainTime(randomTrip.route, randomTrip.routeDirection, 57600, randomTrip.startStation),
                start: {
                    transit_time: startTime,
                    station_id: randomTrip.startStation,
                    min_train_time: startTime + 60, // allow 60 seconds to get to platform
                    route: randomTrip.route,
                    route_direction: randomTrip.routeDirection
                },
                end: {
                    transit_time: _getTripEndTime(randomTrip, startTime),
                    station_id: randomTrip.endStation
                }
            }

            return trip;
        },

        /*
         * argument is object returned from getRandomTrip:
         *
         *  {
         *      startStation: stationId,
         *      endStation: stationId,
         *      route: routeId,
         *      routeDirection: routeDirection
         *  };
         *
         */
        _getTripEndTime = function _getTripEndTime(trip, startTime) {

            var firstTrainTime = ScheduleHelper.getFirstTrainTime(trip.route, trip.routeDirection, startTime, trip.startStation),
                rideTime = ScheduleHelper.getRideDuration(trip.route, trip.routeDirection, trip.startStation, trip.endStation),
                walkTime = 60, // 60 seconds for walking after train ride
                totalTime;

            totalTime = firstTrainTime + rideTime + walkTime;

            var timeString = TimeHelper.secondsToTimeString(Math.ceil(totalTime));
            return totalTime;

        };
 
    return {
        generateTrip: _generateTrip
    };

})();