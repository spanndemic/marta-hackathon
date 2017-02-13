var ScheduleHelper = (function () {

    var ROUTE = Object.freeze({GOLD_LINE: 0, RED_LINE: 1, GREEN_LINE: 2, BLUE_LINE: 3}),
        _goldLine = [41, 40, 39, 38, 37, 36, 60, 22, 42, 43, 44, 45, 46, 47, 48, 20, 49, 50], // south to north
        _redLine = [41, 40, 39, 38, 37, 36, 60, 22, 42, 43, 44, 45, 46, 47, 51, 52, 53, 18, 54], // south to north
        _greenLine = [13, 21, 23, 24, 22, 27, 28, 29, 30], // west to east
        _blueLine = [26, 25, 21, 23, 24, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35], // west to east

        // intervals are in minutes between stops
        _goldLineNorthboundIntervals = [0, 1, 4, 7, 9, 11, 13, 15, 16, 17, 18, 19, 21, 25, 28, 31, 35, 38],
        _goldLineSouthboundIntervals = [0, 3, 7, 10, 13, 17, 19, 20, 21, 22, 24, 25, 27, 29, 31, 34, 37, 38],
        _redLineNorthboundIntervals = [0, 1, 4, 7, 9, 11, 13, 15, 16, 17, 18, 19, 21, 25, 29, 34, 36, 38, 40],
        _redLineSouthboundIntervals = [0, 2, 4, 6, 11, 15, 19, 21, 22, 23, 24, 25, 27, 29, 31, 33, 36, 39, 40],
        _greenLineEastboundIntervals = [0, 4, 5, 6, 7, 8, 10, 13, 15],
        _greenLineWestboundIntervals = [0, 2, 5, 7, 8, 9, 10, 11, 15],
        _blueLineEastboundIntervals = [0, 3, 6, 7, 8, 9, 10, 12, 15, 17, 20, 23, 27, 30, 32],
        _blueLineWestboundIntervals = [0, 2, 5, 9, 12, 15, 17, 20, 22, 23, 24, 25, 26, 29, 32],
        
        // schedule times are in number of seconds since midnight
        _goldLineNorthboundStartTimesAM = [21660, 22320, 22860, 23460, 24060, 24660, 25260, 25860, 26460, 27060, 27660, 28260, 28860, 29460, 30060, 30660, 31260, 31860],
        _goldLineNorthboundStartTimesPM = [57660, 58260, 58920, 59460, 60060, 60660, 61260, 61860, 62460, 63060, 63660, 64260], // 6-4 PM only
        _goldLineSouthboundStartTimesAM = [21840, 22440, 23040, 23640, 24240, 24840, 25440, 26040, 26640, 27240, 27840, 28440, 29040, 29640, 30300, 30900, 31500, 32100],
        _goldLineSouthboundStartTimesPM = [57840, 58440, 59040, 59640, 60240, 60840, 61440, 62040, 62640, 63240, 63840, 64440], // 6-4 PM only
        _redLineNorthboundStartTimesAM = [21960, 22560, 23160, 23760, 24360, 24960, 25560, 26160, 26760, 27360, 27960, 28560, 29160, 29760, 30360, 30960, 31560, 32160],
        _redLineNorthboundStartTimesPM = [57960, 58560, 59160, 59760, 60360, 60960, 61560, 62160, 62760, 63360, 63960, 64560], // 6-4 PM only
        _redLineSouthboundStartTimesAM = [22020, 22620, 23220, 23820, 24420, 25020, 25620, 26220, 26820, 27420, 28020, 28620, 29220, 29820, 30480, 31080, 31680, 32400],
        _redLineSouthboundStartTimesPM = [58020, 58620, 59220, 59820, 60420, 61020, 61620, 62220, 62820, 63420, 64020, 64620], // 6-4 PM only
        _greenLineEastboundStartTimesAM = [22560, 23160, 23760, 24360, 24960, 25560, 26160, 26760, 27360, 27960, 28560, 29160, 29760, 30360, 30960, 31560, 32160],
        _greenLineEastboundStartTimesPM = [54600, 55440, 56040, 56640, 57240, 57840, 58440, 59040, 59640, 60240, 60840, 61440, 62040, 62640, 63240, 63840, 64440, 65040, 65640, 66240, 66840, 67440, 68040],
        _greenLineWestboundStartTimesAM = [23340], // wrong?
        _greenLineWestboundStartTimesPM = [55740], // wrong?
        _blueLineEastboundStartTimesAM = [22140, 22740, 23340, 23940, 24540, 25140, 25740, 26340, 26940, 27540, 28140, 28740, 29340, 29940, 30540, 31140, 31740, 32340],
        _blueLineEastboundStartTimesPM = [54060, 54900, 55620, 56220, 56820, 57420, 58020, 58620, 59220, 59820, 60420, 61020, 61620, 62220, 62820, 63420, 64020, 64620, 65220, 65820, 66420, 67020, 67620, 68220],
        _blueLineWestboundStartTimesAM = [22140, 22740, 23340, 23940, 24540, 25140, 25740, 26340, 26940, 27540, 28140, 28740, 29340, 29940, 30540, 31140, 31740, 32340],
        _blueLineWestboundStartTimesPM = [54540, 55140, 55740, 56340, 56940, 57540, 58140, 58740, 59340, 59940, 60540, 61140, 61740, 62340, 62940, 63540, 64140, 64740, 65340, 65940, 66540, 67140, 67740, 68340],

        _getRouteDirectionForTrip = function _getRouteDirection(startStation, endStation, route) {
            
            var possibleStations,
                startStationIndex,
                endStationIndex;

            switch(route) {
                case ROUTE.GOLD_LINE: // Gold
                    possibleStations = _goldLine.slice();
                    break;
                case ROUTE.RED_LINE: // Red
                    possibleStations = _redLine.slice();
                    break;
                case ROUTE.GREEN_LINE: // Green
                    possibleStations = _greenLine.slice();
                    break;
                case ROUTE.BLUE_LINE: // BLUE
                    possibleStations = _blueLine.slice();
                    break;
            }

            startStationIndex = possibleStations.indexOf(startStation);
            endStationIndex = possibleStations.indexOf(endStation);


            if (startStationIndex > endStationIndex) {
                // Heading South or Heading West (opposite order of array)
                return 1;
            }

            // normal
            return 0;


        },

        _getStartTimesForRoute = function _getStartTimesForRoute(route, routeDirection) {

            var times;

            if (routeDirection == 1) {
                // inverted: north to south, east to west
                switch(route) {
                    case ROUTE.GOLD_LINE:
                        times = _goldLineSouthboundStartTimesPM.slice();
                        break;
                    case ROUTE.RED_LINE:
                        times = _redLineSouthboundStartTimesPM.slice();
                        break;
                    case ROUTE.GREEN_LINE:
                        times = _greenLineWestboundStartTimesPM.slice();
                        break;
                    case ROUTE.BLUE_LINE:
                        times = _blueLineWestboundStartTimesPM.slice();
                        break;
                }

            } else {
                switch(route) {
                    case ROUTE.GOLD_LINE:
                        times = _goldLineNorthboundStartTimesPM.slice();
                        break;
                    case ROUTE.RED_LINE:
                        times = _redLineNorthboundStartTimesPM.slice();
                        break;
                    case ROUTE.GREEN_LINE:
                        times = _greenLineEastboundStartTimesPM.slice();
                        break;
                    case ROUTE.BLUE_LINE:
                        times = _blueLineEastboundStartTimesPM.slice();
                        break;
                }
            }

            // times should be sorted alread, but just in case.
            times.sort(function(a, b) {
                return a - b;
            });

            return times;

        },

        _getStationsForRoute = function _getStartTimesForRoute(route, routeDirection) {

            var stations;

            switch(route) {
                case ROUTE.GOLD_LINE:
                    stations = _goldLine.slice();
                    break;
                case ROUTE.RED_LINE:
                    stations = _redLine.slice();
                    break;
                case ROUTE.GREEN_LINE:
                    stations = _greenLine.slice();
                    break;
                case ROUTE.BLUE_LINE:
                    stations = _blueLine.slice();
                    break;
            }

            if (routeDirection == 1) {

                // inverted: north to south, east to west
                stations.reverse();

            }

            return stations;

        },

        _getTimeIntervalsForRoute = function _getTimeIntervalsForRoute(route, route_direction) {

            var intervals;

            if (route_direction == 1) {
                // inverted: north to south, east to west
                switch(route) {
                    case ROUTE.GOLD_LINE:
                        intervals = _goldLineSouthboundIntervals.slice();
                        break;
                    case ROUTE.RED_LINE:
                        intervals = _redLineSouthboundIntervals.slice();
                        break;
                    case ROUTE.GREEN_LINE:
                        intervals = _greenLineWestboundIntervals.slice();
                        break;
                    case ROUTE.BLUE_LINE:
                        intervals = _blueLineWestboundIntervals.slice();
                        break;
                }

            } else {
                switch(route) {
                    case ROUTE.GOLD_LINE:
                        intervals = _goldLineNorthboundIntervals.slice();
                        break;
                    case ROUTE.RED_LINE:
                        intervals = _redLineNorthboundIntervals.slice();
                        break;
                    case ROUTE.GREEN_LINE:
                        intervals = _greenLineEastboundIntervals.slice();
                        break;
                    case ROUTE.BLUE_LINE:
                        intervals = _blueLineEastboundIntervals.slice();
                        break;
                }
            }

            return intervals;

        },

        _getScheduleForRouteStation = function _getScheduleForRouteStation(route, routeDirection, stationId, zeroOffset, firstOffset, secondOffset) {

            var intervals = _getTimeIntervalsForRoute(route, routeDirection),
                stations = _getStationsForRoute(route, routeDirection),
                startTimes = _getStartTimesForRoute(route, routeDirection),
                stationOffset,
                i,
                time,
                schedule = [];

            stationOffset = stations.indexOf(stationId); // also interval index?
            interval = intervals[stationOffset];

            var stopTimes = _getStopTimes(startTimes, stationOffset, zeroOffset, firstOffset, secondOffset);


            for(i = 0; i < stopTimes.length; i++) {

                time = stopTimes[i] + (interval * 60);
                schedule.push(TimeHelper.formatTime(TimeHelper.secondsToTimeString(time)));

            }

            return schedule;

        },

        // use get times for station instead?
        _getStopTimes = function _getStopTimes(startTimes, station_offset, zero_offset = 0, first_offset = 10, second_offset = 20) {
            var times = startTimes.slice(),
                i;

            // loop through start times
            for (i = 0; i < times.length; i++) {

                var remainder = i % 3;

                switch(remainder) {
                    case 0:
                        // zero offset column
                        times[i] = times[i] + (station_offset * 60) + (zero_offset * 60);
                        break;
                    case 1:
                        // offset one column
                        times[i] = times[i] + (station_offset * 60) + ((first_offset - 10) * 60);
                        break;
                    case 2:
                        // offset two column
                        times[i] = times[i] + (station_offset * 60) + ((second_offset - 20) * 60);
                        break;
                }

            }

            return times;
        },

        // min_start_time = seconds since midnight
        _getFirstTrainTime = function _getFirstTrainTime(route, routeDirection, minStartTime, stationId, zero_offset = 0, first_offset = 10, second_offset = 20) {

            var startTimes = _getStartTimesForRoute(route, routeDirection),
                stations = _getStationsForRoute(route, routeDirection),
                intervals = _getTimeIntervalsForRoute(route, routeDirection),
                intervalIndex,
                offsetTimes,
                i,
                timeForStop;

            // get offset of station in the route
            intervalIndex = stations.indexOf(stationId);

            offsetTimes = _getStopTimes(startTimes, intervals[intervalIndex], zero_offset, first_offset, second_offset);

            // loop through offset times
            for (i = 0; i < offsetTimes.length; i++) {

                if (offsetTimes[i] > minStartTime) {
                    return offsetTimes[i];
                }
            }

            return 0;

        },

        // duration of a train ride in seconds from start station to end station
        _getRideDuration = function _getRideDuration(route, routeDirection, startStationId, endStationId) {

            var stations = _getStationsForRoute(route, routeDirection),
                intervals = _getTimeIntervalsForRoute(route, routeDirection),
                startStationIndex,
                endStationIndex,
                startTimeOffset,
                endTimeOffset,
                totalTime;

            startStationIndex = stations.indexOf(startStationId);
            endStationIndex = stations.indexOf(endStationId);

            startTimeOffset = intervals[startStationIndex];
            endTimeOffset = intervals[endStationIndex];

            totalTime = (endTimeOffset - startTimeOffset) * 60

            return totalTime;

        },

        // returns object
        _getRandomTrip = function _getRandomTrip() {

            var northStations = [48, 20, 49, 50, 51, 52, 53, 18, 54],
                southStations = [41, 40, 39, 38, 37, 36, 60, 22, 42, 43, 44, 45, 46],
                redLine = [51, 52, 53, 18, 54],
                route = ROUTE.GOLD_LINE,
                northIndex,
                southIndex,
                startStation,
                endStation,
                routeDirection;

            northIndex = Math.floor(Math.random() * northStations.length);
            southIndex = Math.floor(Math.random() * southStations.length);

            startStation = southStations[southIndex];
            endStation = northStations[northIndex];

            if (redLine.indexOf(endStation) > -1) {
                route = ROUTE.RED_LINE;
            }

            if (Math.floor(Math.random() * 2) == 1) {
                // 50% chance to invert the direction of the route
                startStation = northStations[northIndex];
                endStation = southStations[southIndex];
            }

            routeDirection = _getRouteDirectionForTrip(startStation, endStation, route);

            return {
                startStation: startStation,
                endStation: endStation,
                route: route,
                routeDirection: routeDirection
            };

        },

        _isInRailLine = function _isInRailLine(line, station1, station2) {
            switch(line) {
                case 'GOLD_LINE':
                    if (_goldLine.indexOf(station1) > -1 && _goldLine.indexOf(station2) > -1) {
                        return true;
                    }
                    break;
                case 'RED_LINE':
                    if (_redLine.indexOf(station1) > -1 && _redLine.indexOf(station2) > -1) {
                        return true;
                    }
                    break;
                case 'GREEN_LINE':
                    if (_greenLine.indexOf(station1) > -1 && _greenLine.indexOf(station2) > -1) {
                        return true;
                    }
                    break;
                case 'BLUE_LINE':
                    if (_blueLine.indexOf(station1) > -1 && _blueLine.indexOf(station2) > -1) {
                        return true;
                    }
                    break;
            }
            return false;
        },

        _getRailLine = function _getRailLine(station1, station2) {

            var goldLine = _isInRailLine('GOLD_LINE', station1, station2),
                redLine = _isInRailLine('RED_LINE', station1, station2),
                greenLine = _isInRailLine('GREEN_LINE', station1, station2),
                blueLine = _isInRailLine('BLUE_LINE', station1, station2);

            if (redLine && goldLine) {
                return 'gold-or-red-line';
            } else if (greenLine && blueLine) {
                return 'green-or-blue-line';
            } else if (goldLine) {
                return 'gold-line';
            } else if (redLine) {
                return 'red-line';
            } else if (greenLine) {
                return 'green-line';
            } else if (blueLine) {
                return 'blue-line';
            } else {
                return 'TRAIN SWITCH';
            }

        },

        _printSchedule = function _printSchedule(scheduleArray) {

            var i,
                schedule = "";

            for (i = 0; i < scheduleArray.length; i++) {
                schedule += TimeHelper.formatTime(TimeHelper.secondsToTimeString(scheduleArray[i])) + " ";
            }

            return schedule;

        },
    
        _getStationName = function _getStationName(stationId) {

            switch(stationId) {
                case 0: return 'MARTA Training'; break;
                case 1: return 'CTS Test Lab 1'; break;
                case 2: return 'Test Bus Facility'; break;
                case 3: return 'HPEM Lab'; break;
                case 4: return 'MARTA Training 2'; break;
                case 5: return 'NO USE Rail Facility'; break;
                case 6: return 'NO USE Bus Facility'; break;
                case 7: return 'ESIL Rail Facility'; break;
                case 8: return 'ESIL Bus Facility'; break;
                case 9: return 'Cobb Garage'; break;
                case 13: return 'Bankhead'; break;
                case 14: return 'MARTA Rail Station'; break;
                case 15: return 'SAT-Facility'; break;
                case 16: return 'Chamblee Encoding Facility'; break;
                case 18: return 'Sandy Springs'; break;
                case 19: return 'Garnett'; break;
                case 20: return 'Brookhaven'; break;
                case 21: return 'Ashby'; break;
                case 22: return 'Five Points'; break;
                case 23: return 'Vine City'; break;
                case 24: return 'Dome/GWCC'; break;
                case 25: return 'West Lake'; break;
                case 26: return 'H. E. Holmes'; break;
                case 27: return 'Georgia State'; break;
                case 28: return 'King Memorial'; break;
                case 29: return 'Inman Park'; break;
                case 30: return 'Edgewood/Candler Park'; break;
                case 31: return 'East Lake'; break;
                case 32: return 'Decatur'; break;
                case 33: return 'Avondale'; break;
                case 34: return 'Kensington'; break;
                case 35: return 'Indian Creek'; break;
                case 36: return 'West End'; break;
                case 37: return 'Oakland City'; break;
                case 38: return 'Lakewood/Ft McPherson'; break;
                case 39: return 'East Point'; break;
                case 40: return 'College Park'; break;
                case 41: return 'Airport'; break;
                case 42: return 'Peachtree Center'; break;
                case 43: return 'Civic Center'; break;
                case 44: return 'North Avenue'; break;
                case 45: return 'Midtown'; break;
                case 46: return 'Arts Center'; break;
                case 47: return 'Lindbergh Center'; break;
                case 48: return 'Lenox'; break;
                case 49: return 'Chamblee'; break;
                case 50: return 'Doraville'; break;
                case 51: return 'Buckhead'; break;
                case 52: return 'Medical Center'; break;
                case 53: return 'Dunwoody'; break;
                case 54: return 'North Springs'; break;
                case 55: return 'Laredo Garage'; break;
                case 56: return 'Perry Garage'; break;
                case 57: return 'Hamilton Garage'; break;
                case 58: return 'Brady Garage'; break;
                case 60: return 'Garnett'; break;
                case 61: return 'Gwinnett'; break;
                case 62: return 'GRTA Garage'; break;
                case 63: return 'CTRAN Garage'; break;
                case 64: return 'CTRAN - Airport'; break;
                case 65: return 'No_ USE_Bus_Facility'; break;
                case 66: return 'Lenox Parking'; break;
                case 67: return 'Medical Center - Parking'; break;
                case 68: return 'College Park - Parking'; break;
                case 69: return 'GRTA Garage - American Coach'; break;
                case 70: return 'GRTA Garage - Frontage Road'; break;
                case 71: return 'CCT- Marietta Transfer Center'; break;
                case 72: return 'CCT-Cumberland Transfer Center'; break;
                case 73: return 'CCT-Acworth Park and Ride Lot'; break;
                case 74: return 'Rail Station Wireless AP'; break;
                case 75: return 'Pre-Prod Test Gate'; break;
                case 76: return 'Atlanta Streetcar'; break;
            }
        
        },

        _getStationAbbreviation = function _getStationAbbreviation(stationId) {

            switch(stationId) {
                case 0: return 'MARTA Training'; break;
                case 1: return 'CTS Test Lab 1'; break;
                case 2: return 'Test Bus Facility'; break;
                case 3: return 'HPEM Lab'; break;
                case 4: return 'MARTA Training 2'; break;
                case 5: return 'NO USE Rail Facility'; break;
                case 6: return 'NO USE Bus Facility'; break;
                case 7: return 'ESIL Rail Facility'; break;
                case 8: return 'ESIL Bus Facility'; break;
                case 9: return 'Cobb Garage'; break;
                case 13: return 'Bankhead'; break;
                case 14: return 'MARTA Rail Station'; break;
                case 15: return 'SAT-Facility'; break;
                case 16: return 'Chamblee Encoding Facility'; break;
                case 18: return 'N10'; break;
                case 19: return 'S1'; break;
                case 20: return 'NE8'; break;
                case 21: return 'Ashby'; break;
                case 22: return '5P'; break; // Five Points (no abbr?)
                case 23: return 'Vine City'; break;
                case 24: return 'Dome/GWCC'; break;
                case 25: return 'West Lake'; break;
                case 26: return 'H. E. Holmes'; break;
                case 27: return 'Georgia State'; break;
                case 28: return 'King Memorial'; break;
                case 29: return 'Inman Park'; break;
                case 30: return 'Edgewood/Candler Park'; break;
                case 31: return 'East Lake'; break;
                case 32: return 'Decatur'; break;
                case 33: return 'Avondale'; break;
                case 34: return 'Kensington'; break;
                case 35: return 'Indian Creek'; break;
                case 36: return 'S2'; break;
                case 37: return 'S3'; break;
                case 38: return 'S4'; break;
                case 39: return 'S5'; break;
                case 40: return 'S6'; break;
                case 41: return 'S7'; break;
                case 42: return 'N1'; break;
                case 43: return 'N2'; break;
                case 44: return 'N3'; break;
                case 45: return 'N4'; break;
                case 46: return 'N5'; break;
                case 47: return 'N6'; break;
                case 48: return 'NE7'; break;
                case 49: return 'NE9'; break;
                case 50: return 'NE10'; break;
                case 51: return 'N7'; break;
                case 52: return 'N8'; break;
                case 53: return 'N9'; break;
                case 54: return 'N11'; break;
                case 55: return 'Laredo Garage'; break;
                case 56: return 'Perry Garage'; break;
                case 57: return 'Hamilton Garage'; break;
                case 58: return 'Brady Garage'; break;
                case 60: return 'S1'; break;
                case 61: return 'Gwinnett'; break;
                case 62: return 'GRTA Garage'; break;
                case 63: return 'CTRAN Garage'; break;
                case 64: return 'CTRAN - Airport'; break;
                case 65: return 'No_ USE_Bus_Facility'; break;
                case 66: return 'Lenox Parking'; break;
                case 67: return 'Medical Center - Parking'; break;
                case 68: return 'College Park - Parking'; break;
                case 69: return 'GRTA Garage - American Coach'; break;
                case 70: return 'GRTA Garage - Frontage Road'; break;
                case 71: return 'CCT- Marietta Transfer Center'; break;
                case 72: return 'CCT-Cumberland Transfer Center'; break;
                case 73: return 'CCT-Acworth Park and Ride Lot'; break;
                case 74: return 'Rail Station Wireless AP'; break;
                case 75: return 'Pre-Prod Test Gate'; break;
                case 76: return 'Atlanta Streetcar'; break;
            }
        
        };
 
    return {
        getTimeIntervalsForRoute: _getTimeIntervalsForRoute,
        getScheduleForRouteStation: _getScheduleForRouteStation,
        getFirstTrainTime: _getFirstTrainTime,
        getRideDuration: _getRideDuration,
        getRandomTrip: _getRandomTrip,
        getRailLine: _getRailLine,
        getStationName: _getStationName,
        getStationAbbreviation: _getStationAbbreviation
    };

})();