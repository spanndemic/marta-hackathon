var DataHelper = (function () {

    var _goldLine = [50, 49, 20, 48, 47, 46, 45, 44, 43, 42, 22, 60, 36, 37, 38, 39, 40, 41],
        _redLine = [54, 18, 53, 52, 51, 47, 46, 45, 44, 43, 42, 22, 60, 36, 37, 38, 39, 40, 41],
        _greenLine = [13, 21, 23, 24, 22, 27, 28, 29, 30],
        _blueLine = [26, 25, 21, 23, 24, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35],

        _goldLineNorthboundIntervals = [0, 1, 4, 7, 9, 11, 13, 15, 16, 17, 18, 19, 21, 25, 28, 31, 35, 38],
        _goldLineNorthboundStartTimesAM = [21600, 22800, 24000, 25200, 26400, 27600, 28800, 30000, 31200, 32400, 21600, 22800, 24000, 25200, 26400, 27600, 28800, 30000, 31200, 32400, 21660, 22320, 22860, 23460, 24060, 24660, 25260, 25860, 26460, 27060, 27660, 28260, 28860, 29460, 30060, 30660, 31260, 31860],
        _goldLineNorthboundStartTimesPM = [61200, 62400, 63600, 64800, 66000, 67200, 68400, 54000, 55200, 56400, 57600, 58800, 60000, 54000, 55200, 56400, 57600, 58800, 60000, 61200, 62400, 63600, 64800, 66000, 67200, 68400, 54600, 55260, 55860, 56460, 57060, 57660, 58260, 58920, 59460, 60060, 60660, 61260, 61860, 62460, 63060, 63660, 64260, 64860, 65460, 66060, 66660, 67260, 67860, 54000],

        _goldLineSouthboundIntervals = [0, 3, 7, 10, 13, 17, 19, 20, 21, 22, 24, 25, 27, 29, 31, 34, 37, 38],
        _goldLineSouthboundStartTimesAM = [22500, 23700, 24900, 26100, 27300, 28500, 29700, 30900, 32100, 22500, 23700, 24900, 26100, 27300, 28500, 29700, 30900, 32100, 21840, 22440, 23040, 23640, 24240, 24840, 25440, 26040, 26640, 27240, 27840, 28440, 29040, 29640, 30300, 30900, 31500, 32100],
        _goldLineSouthboundStartTimesPM = [54900, 56100, 57300, 58500, 59700, 60900, 62100, 63300, 64500, 65700, 66900, 68100, 54900, 56100, 57300, 58500, 59700, 60900, 62100, 63300, 64500, 65700, 66900, 68100, 54240, 54840, 55440, 56100, 56640, 57240, 57840, 58440, 59040, 59640, 60240, 60840, 61440, 62040, 62640, 63240, 63840, 64440, 65040, 65640, 66240, 66840, 67500, 68220],

        _redLineNorthboundIntervals = [0, 1, 4, 7, 9, 11, 13, 15, 16, 17, 18, 19, 21, 25, 29, 34, 36, 38, 40],
        _redLineNorthboundStartTimesAM = [22200, 23400, 24600, 25800, 27000, 28200, 29400, 30600, 31800, 22200, 23400, 24600, 25800, 27000, 28200, 29400, 30600, 31800, 21960, 22560, 23160, 23760, 24360, 24960, 25560, 26160, 26760, 27360, 27960, 28560, 29160, 29760, 30360, 30960, 31560, 32160],
        _redLineNorthboundStartTimesPM = [54600, 55800, 57000, 58200, 59400, 60600, 61800, 63000, 64200, 65400, 66600, 67800, 54600, 55800, 57000, 58200, 59400, 60600, 61800, 63000, 64200, 65400, 66600, 67800, 54300, 54960, 55560, 56160, 56760, 57360, 57960, 58560, 59160, 59760, 60360, 60960, 61560, 62160, 62760, 63360, 63960, 64560, 65160, 65760, 66360, 66960, 67560, 68160],

        _redLineSouthboundIntervals = [0, 2, 4, 6, 11, 15, 19, 21, 22, 23, 24, 25, 27, 29, 31, 33, 36, 39, 40],
        _redLineSouthboundStartTimesAM = [21660, 22860, 24060, 25260, 26460, 27660, 28860, 30060, 31260, 21660, 22860, 24060, 25260, 26460, 27660, 28860, 30060, 31260, 22020, 22620, 23220, 23820, 24420, 25020, 25620, 26220, 26820, 27420, 28020, 28620, 29220, 29820, 30480, 31080, 31680, 32400],
        _redLineSouthboundStartTimesPM = [54060, 55260, 56460, 57660, 58860, 60060, 61260, 62460, 63660, 64860, 66060, 67260, 54060, 55260, 56460, 57660, 58860, 60060, 61260, 62460, 63660, 64860, 66060, 67260, 54420, 55020, 55620, 56220, 56820, 57420, 58020, 58620, 59220, 59820, 60420, 61020, 61620, 62220, 62820, 63420, 64020, 64620, 65220, 65820, 66420, 67020, 67620, 68220],

        _greenLineEastboundIntervals = [0, 4, 5, 6, 7, 8, 10, 13, 15],
        _greenLineEastboundStartTimesAM = [24780, 25980, 27180, 28380, 29580, 30780, 31980, 21660, 22380, 23580, 24780, 25980, 27180, 28380, 29580, 30780, 31980, 21660, 22380, 23580, 22560, 23160, 23760, 24360, 24960, 25560, 26160, 26760, 27360, 27960, 28560, 29160, 29760, 30360, 30960, 31560, 32160],
        _greenLineEastboundStartTimesPM = [54780, 55980, 57180, 58380, 59580, 60780, 61980, 63180, 64380, 65580, 66780, 67980, 54780, 55980, 57180, 58380, 59580, 60780, 61980, 63180, 64380, 65580, 66780, 67980, 54600, 55440, 56040, 56640, 57240, 57840, 58440, 59040, 59640, 60240, 60840, 61440, 62040, 62640, 63240, 63840, 64440, 65040, 65640, 66240, 66840, 67440, 68040],

        _greenLineWestboundIntervals = [0, 2, 5, 7, 8, 9, 10, 11, 15],
        _greenLineWestboundStartTimesAM = [24420, 25620, 26820, 28020, 29220, 30420, 31620, 22500, 23220, 24420, 25620, 26820, 28020, 29220, 30420, 31620, 22500, 23220, 23340],
        _greenLineWestboundStartTimesPM = [54420, 55620, 56820, 58020, 59220, 60420, 61620, 62820, 64020, 65220, 66420, 67620, 54420, 55620, 56820, 58020, 59220, 60420, 61620, 62820, 64020, 65220, 66420, 67620, 55740],

        _blueLineEastboundIntervals = [0, 3, 6, 7, 8, 9, 10, 12, 15, 17, 20, 23, 27, 30, 32],
        _blueLineEastboundStartTimesAM = [25260, 26460, 27660, 28860, 30060, 31260, 21660, 22860, 24060, 22140, 22740, 23340, 23940, 24540, 25140, 25740, 26340, 26940, 27540, 28140, 28740, 29340, 29940, 30540, 31140, 31740, 32340, 25260, 26460, 27660, 28860, 30060, 31260, 21660, 22860, 24060],
        _blueLineEastboundStartTimesPM = [54060, 55260, 56460, 57660, 58860, 60060, 61260, 62460, 63660, 64860, 66060, 67260, 54060, 54900, 55620, 56220, 56820, 57420, 58020, 58620, 59220, 59820, 60420, 61020, 61620, 62220, 62820, 63420, 64020, 64620, 65220, 65820, 66420, 67020, 67620, 68220, 54060, 55260, 56460, 57660, 58860, 60060, 61260, 62460, 63660, 64860, 66060, 67260],

        _blueLineWestboundIntervals = [0, 2, 5, 9, 12, 15, 17, 20, 22, 23, 24, 25, 26, 29, 32],
        _blueLineWestboundStartTimesAM = [25200, 26400, 27600, 28800, 30000, 31200, 32400, 21600, 22800, 24000, 22140, 22740, 23340, 23940, 24540, 25140, 25740, 26340, 26940, 27540, 28140, 28740, 29340, 29940, 30540, 31140, 31740, 32340, 25200, 26400, 27600, 28800, 30000, 31200, 32400, 21600, 22800, 24000],
        _blueLineWestboundStartTimesPM = [54000, 55200, 56400, 57600, 58800, 60000, 61200, 62400, 63600, 64800, 66000, 67200, 68400, 54540, 55140, 55740, 56340, 56940, 57540, 58140, 58740, 59340, 59940, 60540, 61140, 61740, 62340, 62940, 63540, 64140, 64740, 65340, 65940, 66540, 67140, 67740, 68340, 54000, 55200, 56400, 57600, 58800, 60000, 61200, 62400, 63600, 64800, 66000, 67200, 68400],

        // look up each depart time

        _generateTrip = function _generateTrip(am_pm) {

            var start_time,
                line_color,
                possible_stations,
                random_station1,
                random_station2,
                start_station,
                end_station;

            // generate start time
            if (am_pm == "AM") {
                start_time = Math.floor((Math.random() * 10800)) + 21600; // random AM time
            } else {
                start_time = Math.floor((Math.random() * 14400)) + 54000; // random PM time 
            }

            // generate origin / destination
            line_color = Math.floor(Math.random() * 2) + 1;
            switch(line_color) {
                case 1:
                    possible_stations = _goldLine.slice();
                    break;
                case 2:
                    possible_stations = _redLine.slice();
                    break;
                case 3:
                    possible_stations = _greenLine.slice();
                    break;
                case 4:
                    possible_stations = _blueLine.slice();
                    break;
            }

            random_station1 = Math.floor(Math.random() * possible_stations.length);
            start_station = possible_stations[random_station1];
            possible_stations.splice(random_station1, 1);
            random_station2 = Math.floor(Math.random() * possible_stations.length);
            end_station = possible_stations[random_station2];

            var route_direction = 1; //_getRouteDirection(start_station, end_station, line_color);

            // hard code to inverted
            if (random_station2 > random_station1) {
                start_station = possible_stations[random_station2];
                end_station = possible_stations[random_station1];
            }

            //console.log('sending start time', start_time);
            //console.log('sending start time', _numberToTimeString(start_time));

            /*
            return {
                start: {
                    transit_time: "17:09:13",
                    station_id: 46,
                    min_train_time: "17:10:13", // 60 seconds padding for walking
                    route: 1,
                    route_direction: 1
                },
                end: {
                    transit_time: "17:43:00",
                    station_id: 22
                }
            }
            */


            var trip = {
                start: {
                    transit_time: _numberToTimeString(start_time),
                    station_id: start_station,
                    min_train_time: _numberToTimeString(start_time + 60), // 60 seconds padding
                    route: line_color,
                    route_direction: route_direction
                },
                end: {
                    transit_time: _getEndTime(start_time, start_station, end_station, line_color),
                    station_id: end_station
                }
            }

            console.log(trip);

            return trip;
        },

        _getRouteDirection = function _getRouteDirection(station1, station2, line_color) {
            
            var possible_stations;

            switch(line_color) {
                case 1:
                    possible_stations = _goldLine.slice();
                    break;
                case 2:
                    possible_stations = _redLine.slice();
                    break;
                case 3:
                    possible_stations = _greenLine.slice();
                    break;
                case 4:
                    possible_stations = _blueLine.slice();
                    break;
            }

            var station1_index = possible_stations.indexOf(station1);
            var station2_index = possible_stations.indexOf(station2);


            if (station1_index < station2_index) {
                // inverted
                return 1;
            }

            // normal
            return 0;


        },


        _getRideDuration = function _getRideDuration(start_time, route, route_direction, station_id, station_id_end) {

            var intervals, stations, start_times;

            if (route_direction == 1) {
                // inverted route: south or west
                switch(route) {
                    case 1:
                        stations = _goldLine.slice();
                        intervals = _goldLineSouthboundIntervals;
                        start_times = _goldLineSouthboundStartTimesPM;
                        break;
                    case 2:
                        stations = _redLine.slice();
                        intervals = _redLineSouthboundIntervals;
                        start_times = _redLineSouthboundStartTimesPM;
                        break;
                    case 3:
                        stations = _greenLine.slice();
                        intervals = _greenLineWestboundIntervals;
                        start_times = _greenLineWestboundStartTimesPM;
                        break;
                    case 4:
                        stations = _blueLine.slice();
                        intervals = _blueLineWestboundIntervals;
                        start_times = _blueLineWestboundStartTimesPM;
                        break;
                }
                stations.reverse();
            } else {
                // default route
                switch(route) {
                    case 1:
                        stations = _goldLine;
                        intervals = _goldLineNorthboundStartTimesPM;
                        start_times = _goldLineNorthboundStartTimesPM;
                        break;
                    case 2:
                        stations = _redLine;
                        intervals = _redLineNorthboundStartTimesPM;
                        start_times = _redLineNorthboundStartTimesPM;
                        break;
                    case 3:
                        stations = _greenLine;
                        intervals = _greenLineEastboundStartTimesPM
                        start_times = _greenLineEastboundStartTimesPM;
                        break;
                    case 4:
                        stations = _blueLine;
                        intervals = _blueLineEastboundStartTimesPM
                        start_times = _blueLineEastboundStartTimesPM;
                        break;
                }
            }

            // shift times here

            // get offset of station in the route
            var offset = stations.indexOf(station_id);

            //console.log('TRIP END start_time ' + start_time);

            //console.log('TRIP END offset ' + intervals[offset] * 60);

            var timeForStop = start_time + (intervals[offset] * 60); // convert interval to seconds
 
            //console.log('TRIP END timeForStop first is ' + timeForStop);

            // in minutes
            //timeForStop = Math.ceil(timeForStop/60);

            // offest for 3 PM
            var timeInMinutes = timeForStop; // - (15 * 60 * 60);

            return timeInMinutes;


        },
        


        _getFirstTrainTime = function _getFirstTrainTime(route, route_direction, station_id, minTime) {

            var intervals, stations, start_times;

            if (route_direction == 1) {
                // inverted route: south or west
                switch(route) {
                    case 1:
                        stations = _goldLine.slice();
                        intervals = _goldLineSouthboundIntervals;
                        start_times = _goldLineSouthboundStartTimesPM;
                        break;
                    case 2:
                        stations = _redLine.slice();
                        intervals = _redLineSouthboundIntervals;
                        start_times = _redLineSouthboundStartTimesPM;
                        break;
                    case 3:
                        stations = _greenLine.slice();
                        intervals = _greenLineWestboundIntervals;
                        start_times = _greenLineWestboundStartTimesPM;
                        break;
                    case 4:
                        stations = _blueLine.slice();
                        intervals = _blueLineWestboundIntervals;
                        start_times = _blueLineWestboundStartTimesPM;
                        break;
                }
                stations.reverse();
            } else {
                // default route
                switch(route) {
                    case 1:
                        stations = _goldLine;
                        intervals = _goldLineNorthboundStartTimesPM;
                        start_times = _goldLineNorthboundStartTimesPM;
                        break;
                    case 2:
                        stations = _redLine;
                        intervals = _redLineNorthboundStartTimesPM;
                        start_times = _redLineNorthboundStartTimesPM;
                        break;
                    case 3:
                        stations = _greenLine;
                        intervals = _greenLineEastboundStartTimesPM
                        start_times = _greenLineEastboundStartTimesPM;
                        break;
                    case 4:
                        stations = _blueLine;
                        intervals = _blueLineEastboundStartTimesPM
                        start_times = _blueLineEastboundStartTimesPM;
                        break;
                }
            }

            // shift times here

            // get offset of station in the route
            var offset = stations.indexOf(station_id);

            // get first train after min time
            for (var i = 0; i < start_times.length; i++) {

                // in seconds
                var timeForStop = start_times[i] + (intervals[offset] * 60); // convert interval to seconds
 
                //console.log('timeForStop first is ' + timeForStop);

                // in minutes
                //timeForStop = Math.ceil(timeForStop/60);

                // offest for 3 PM
                var timeInMinutes = timeForStop - (15 * 60 * 60);

                //console.log('comparing ' + timeInMinutes + ' with ' + minTime);

                if (timeInMinutes > minTime) {
                    console.log('returning ' + timeInMinutes);
                    return timeInMinutes;
                }
            }

        },

        _getEndTime = function _getEndTime(startTime, station1, station2, line_color) {
            
            var possible_stations,
                station1_index,
                station2_index,
                offsets,
                end_time,
                route_direction = 0;

            switch(line_color) {
                case 1:
                    possible_stations = _goldLine.slice();
                    break;
                case 2:
                    possible_stations = _redLine.slice();
                    break;
                case 3:
                    possible_stations = _greenLine.slice();
                    break;
                case 4:
                    possible_stations = _blueLine.slice();
                    break;
            }

            station1_index = possible_stations.indexOf(station1);
            station2_index = possible_stations.indexOf(station2);


            if (station1_index < station2_index) { // North/East?
                switch(line_color) {
                    case 1:
                        offsets = _goldLineNorthboundIntervals;
                        break;
                    case 2:
                        offsets = _redLineNorthboundIntervals;
                        break;
                    case 3:
                        offsets = _greenLineEastboundIntervals;
                        break;
                    case 4:
                        offsets = _blueLineEastboundIntervals;
                        break;
                }
            } else { // South/West?
                switch(line_color) {
                    case 1:
                        offsets = _goldLineSouthboundIntervals;
                        break;
                    case 2:
                        offsets = _redLineSouthboundIntervals;
                        break;
                    case 3:
                        offsets = _greenLineWestboundIntervals;
                        break;
                    case 4:
                        offsets = _blueLineWestboundIntervals;
                        break;
                }
            }

            if (station1_index < station2_index) {
                // headed east or north.... invert indexes
                station1_index = possible_stations.length - station1_index - 1;
                station2_index = possible_stations.length - station2_index - 1;
                route_direction = 1;
            }

            // start with the first available train
            //console.log('line_color', line_color);
            //console.log('route_direction', route_direction);
            //console.log('station1_index', station1_index);
            console.log('start time is initially', startTime);
            console.log('start time after mod', Math.ceil(startTime / 60) - (60 * 15));

            var first_train = _getFirstTrainTime(line_color, 0, station1, startTime); // time offset for 3 PM


            console.log('first train is initially', first_train);


            // convert back to seconds
            //first_train = first_train + (15 * 60); // add 15 hours in seconds

            console.log('first train is', first_train);

            // add the time for the route
            end_time = first_train + (offsets[station1_index] * 60) - (offsets[station2_index] * 60); // route time in seconds

            console.log('end time is ', end_time);

            //end_time = end_time + Math.floor((Math.random() * 46) + 15); // random time for walking

            //end_time = end_time + Math.floor((Math.random() * 600) + 1); // random time on platform

            var timeString = _numberToTimeString(end_time / 60);
            console.log('timeString', timeString);
            return timeString;

        },

        _formatTime = function _formatTime(timeString) {

            var hours = parseInt(timeString.substring(0, 2)),
                minutes = timeString.substring(3, 5),
                amPm = "AM";

            if (hours > 12) {
                hours -= 12;
                amPm = "PM";
            }

            return hours + ":" + minutes + " " + amPm;

        },

        _numberToTimeString = function _numberToTimeString(timeNumber) {

            var hours = "" + Math.floor(timeNumber / 3600),
                minutes = "" + Math.floor((timeNumber - (hours * 3600)) / 60),
                seconds = "" + (timeNumber - (hours * 3600) - (minutes * 60));

            var pad = "00"
            return pad.substring(0, pad.length - hours.length) + hours + ":" + pad.substring(0, pad.length - minutes.length) + minutes + ":" + pad.substring(0, pad.length - seconds.length) + seconds;

        },

        _timeStringToNumber = function _timeStringToNumber(timeString) {

            var hours = parseInt(timeString.substring(0, 2)),
                minutes = timeString.substring(3, 5),
                seconds = timeString.substring(6, 8);

            var value = (hours * 3600) + (minutes * 60) + parseInt(seconds);
            return value;

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
        
        };
 
    return {
        formatTime: _formatTime,
        getRailLine: _getRailLine,
        getStationName: _getStationName,
        generateTrip: _generateTrip,
        timeStringToNumber: _timeStringToNumber,
        getFirstTrainTime: _getFirstTrainTime,
        numberToTimeString: _numberToTimeString,
        getRideDuration: _getRideDuration
    };

})();