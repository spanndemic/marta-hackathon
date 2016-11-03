$(function() {

    var _cache = {},
        _trips = [],

        _init = function _init() {
            _setupCache();
            _addEvents();
        },

        _setupCache = function _setupCache() {

        },

        _addEvents = function _addEvents() {
            $('.tag').hover(function() {
                $('.tag-label', $(this)).show();
            }, function() {
                $('.tag-label', $(this)).hide();
            });

            $('.connection').hover(function() {
                $('.train-label', $(this)).show();
            }, function() {
                $('.train-label', $(this)).hide();
            });

            $('.platform-time').hover(function() {
                $('.wait-time-label', $(this)).show();
            }, function() {
                $('.wait-time-label', $(this)).hide();
            });

            $('#optimize').click(function() {
                var offsets = ScheduleOptimizer.getOptimizedOffsets();

                // let the slider callback handle UI updates
                $("#slider").slider("values", 0, offsets[0]);
                $("#slider").slider("values", 1, offsets[0] + offsets[1]);

            });

            $('#new-data').click(function() {
                _generateData();
                _renderData();
                _updateTrainTimes(10, 10);

                $("#slider").slider("values", 0, 10);
                $("#slider").slider("values", 1, 20);
            });
        },

        _updateTrainTimes = function _updateTrainTimes(first_offset = 10, second_offset = 20) {
        
            // loop through each trip
            $('.trip-wrap').each(function() {
                
                // get the trip's min time
                var minTime = $('.trip-start', $(this)).data('min-train-time'),
                    route = $('.connection', $(this)).data('route'),
                    routeDirection = $('.connection', $(this)).data('route-direction'),
                    startStationId = $('.trip-start', $(this)).data('start-station'),
                    endStationId = $('.trip-end', $(this)).data('end-station'),
                    firstTrainTime = ScheduleHelper.getFirstTrainTime(route, routeDirection, minTime, startStationId, first_offset, second_offset),
                    rideDuration = ScheduleHelper.getRideDuration(route, routeDirection, startStationId, endStationId),
                    tripEndTime = firstTrainTime + rideDuration,
                    startTimeText,
                    endTimeText;

                $('.trip-start', $(this)).attr('data-time', firstTrainTime);
                $('.trip-end', $(this)).attr('data-time', tripEndTime);

                startTimeText = TimeHelper.formatTime(TimeHelper.secondsToTimeString(firstTrainTime));
                endTimeText = TimeHelper.formatTime(TimeHelper.secondsToTimeString(tripEndTime));
                $('.trip-start', $(this)).attr('data-time-display', startTimeText);
                $('.trip-end', $(this)).attr('data-time-display', endTimeText);

                $('.connection', $(this)).attr('data-start-time', firstTrainTime);
                $('.connection', $(this)).attr('data-stop-time', tripEndTime);
                $('.connection', $(this)).attr('data-start-time-display', startTimeText);
                $('.connection', $(this)).attr('data-stop-time-display', endTimeText);

                // adjust start / stop times of trip
                $('.trip-start', $(this)).css('left', _timeToLeftOffset(firstTrainTime));
                $('.trip-end', $(this)).css('left', _timeToLeftOffset(tripEndTime));

                // move train trip around
                $('.connection', $(this)).css('left',  _timeToLeftOffset(firstTrainTime));
                $('.connection', $(this)).css('right', _timeToRightOffset(tripEndTime));

                // adjust tag off time and label
                var tagOffTime = tripEndTime + 60;
                $('.tag-off', $(this)).css('left', _timeToLeftOffset(tagOffTime));
                $('.tag-off .tag-label', $(this)).html('Exit Station<br />' + TimeHelper.formatTime(TimeHelper.secondsToTimeString(tagOffTime)) + '<br />' + ScheduleHelper.getStationName(endStationId));

                // add train label
                var routeDirectionText, routeText, startStationName, endStationName;
                if (routeDirection == 0) {
                    routeDirectionText = "North";
                } else {
                    routeDirectionText = "South";
                }
                if (route == 0) {
                    routeText = "Gold Line " + routeDirectionText;
                } else {
                    routeText = "Red Line " + routeDirectionText;
                }
                startStationName = startTimeText + ' ' + ScheduleHelper.getStationName(startStationId);
                endStationName = endTimeText + ' ' + ScheduleHelper.getStationName(endStationId);
                $('.train-label', $(this)).html(routeText + '<br />' + startStationName + '<br />' + endStationName);

                // calculate time on platform
                var initialPlatformTime = $('.platform-time', $(this)).data('initial-platform-time')
                var currentPlatformTime = firstTrainTime - minTime;
                $('.platform-time', $(this)).attr('data-current-platform-time', currentPlatformTime);

                // adjust position
                $('.platform-time', $(this)).css('left',  _timeToLeftOffset(minTime));
                $('.platform-time', $(this)).css('right', _timeToRightOffset(minTime + currentPlatformTime));

                // color
                var diff = (currentPlatformTime - initialPlatformTime) / 60;
                _getSpeedClass($('.platform-time', $(this)), diff);
                _getSpeedClass($('.result', $(this)), diff);
                var change;
                var changeLabel;
                if (diff > 0) {
                    change = '-' + diff + ' min';
                    changeLabel = '+' + diff + ' min';
                } else if (diff < 0) {
                    change = '+' + (diff * -1) + ' min';
                    changeLabel = diff + ' min';
                } else {
                    change = '+0 min';
                    changeLabel = '-0 min';
                }
                $('.result', $(this)).html(change);
                $('.result', $(this)).attr('data-result-diff', diff);

                $('.platform-time .wait-time-label', $(this)).html('Walk time: 1 min<br />Wait time: ' + Math.ceil(currentPlatformTime/60) + ' min<br />(' + changeLabel + ' change)');

            });

            // total up all of the diffs
            var totalTimeSaved = 0;
            $('.result').each(function() {
                var resultDiff = parseInt($(this).attr('data-result-diff'));
                totalTimeSaved -= resultDiff;
            });
            $('#time-saved-amount').html(totalTimeSaved + ' min');
            _getSpeedClass($('#time-saved-amount'), -totalTimeSaved);

        },

        _timeToLeftOffset = function _timeToLeftOffset(time) {
            var hours = (time - 57600)/3600, // adjust to 4 PM, convert time to hours
                percent = hours * 40; // each hour gets 40% of screen;

            return percent + '%';
        },

        _timeToRightOffset = function _timeToLeftOffset(time) {
            var hours = (time - 57600)/3600, // adjust to 4 PM, convert time to hours
                percent = 100 - (hours * 40); // each hour gets 40% of screen;

            return percent + '%';
        },

        _getSpeedClass = function _getSpeedClass(el, value) {
            el.removeClass('slower');
            el.removeClass('faster');
            if (value > 0) {
                el.addClass('slower');
            } else if (value < 0) {
                el.addClass('faster');
            }
        },

        _generateData = function _generateData() {
            _trips = [];
            var i;
            for (i = 0; i < 28; i++) {
                _trips.push(DataHelper.generateTrip("PM"));
            }
        },

        _renderData = function _renderData() {

            $('#pm-trips').html('');

            for (i = 0; i < _trips.length; i++) {

                var railLine = ScheduleHelper.getRailLine(_trips[i].start.station_id, _trips[i].end.station_id),
                    startStation = ScheduleHelper.getStationName(_trips[i].start.station_id),
                    endStation = ScheduleHelper.getStationName(_trips[i].end.station_id),
                    tagOnTime = TimeHelper.formatTime(TimeHelper.secondsToTimeString(_trips[i].start.transit_time)),
                    tagOffTime = TimeHelper.formatTime(TimeHelper.secondsToTimeString(_trips[i].end.transit_time)),
                    minTrainTime = TimeHelper.formatTime(TimeHelper.secondsToTimeString(_trips[i].start.min_train_time)),
                    firstTrainTime = ScheduleHelper.getFirstTrainTime(_trips[i].start.route, _trips[i].start.route_direction, _trips[i].start.min_train_time, _trips[i].start.station_id),
                    platformTime = firstTrainTime - _trips[i].start.min_train_time;

                $('#pm-trips').append('<div class="trip-wrap">' +
                    '<div class="trains" data-time="' + _trips[i].first_stop_time + '">' +
                        '<div class="train-marker train-marker--one"></div>' +
                        '<div class="train-marker train-marker--two"></div>' +
                        '<div class="train-marker train-marker--three"></div>' +
                        '<div class="train-marker train-marker--one"></div>' +
                        '<div class="train-marker train-marker--two"></div>' +
                        '<div class="train-marker train-marker--three"></div>' +
                        '<div class="train-marker train-marker--one"></div>' +
                        '<div class="train-marker train-marker--two"></div>' +
                        '<div class="train-marker train-marker--three"></div>' +
                        '<div class="train-marker train-marker--one"></div>' +
                        '<div class="train-marker train-marker--two"></div>' +
                        '<div class="train-marker train-marker--three"></div>' +
                    '</div>' +
                    '<div class="tag tag-on" data-row="' + i + '" data-time="' + _trips[i].start.transit_time + '" data-time-display="' + tagOnTime + '"><div class="tag-label">Enter Station<br />' + tagOnTime + '<br />' + startStation + '</div></div>' + 
                    '<div class="stop trip-start" data-row="' + i + '" data-start-station="' + _trips[i].start.station_id + '" data-min-train-time="' + _trips[i].start.min_train_time + '" data-min-train-time-display="' + minTrainTime + '"></div>' + 
                    '<div class="stop trip-end" data-row="' + i + '" data-end-station="' + _trips[i].end.station_id + '"></div>' + 
                    '<div class="tag tag-off" data-row="' + i + '" data-time="' + _trips[i].end.transit_time + '" data-time-display="' + tagOffTime + '"><div class="tag-label">Exit Station<br />' + tagOffTime + '<br />' + endStation + '</div></div>' +
                    '<div class="connection connection--' + railLine + '" data-row="' + i + '" data-route="' + _trips[i].start.route + '" data-route-direction="' + _trips[i].start.route_direction + '"><div class="train-label"></div></div>' + 
                    '<div class="platform-time" data-initial-platform-time="' + platformTime + '" data-row="' + i + '"><div class="wait-time-label"></div></div>' + 
                    '<div class="result" data-row="' + i + '">-0 min</div>');

            }


                $("*[data-row]").each(function(){
                    var rowdata = parseInt($(this).data('row'));
                    $(this).css('top', ((rowdata * 18) + 2) + 'px'); // each row 100px
                });

                // adjust everything based on data-time.... (1 min = 2 px, 1 hr = 120 px)
                $("*[data-time]").each(function(){
                    var timedata = parseInt($(this).data('time'));
                    var hours = ((timedata - 57600)/3600); // adjust for 3 PM
                    $(this).css('left', (hours * 40) + '%');
                });

            // add events to new elements
            _addEvents();
        };

    $("#slider").slider({
        range: true,
        min: 4,
        max: 26,
        values: [10, 20],
        change: function(event, ui) {
            var first_offset = ui.values[0];
            var second_offset = ui.values[1] - first_offset;
            var third_offset = 30 - (first_offset + second_offset);
            var unit = 160 / 24;
            $('.train-marker--one').css('width', (unit * first_offset / 10) + '%');
            $('.train-marker--two').css('width', (unit * second_offset / 10) + '%');
            $('.train-marker--three').css('width', (unit * third_offset / 10) + '%');

            $('#slider-key .train-marker--one').html(first_offset);
            $('#slider-key .train-marker--two').html(second_offset);
            $('#slider-key .train-marker--three').html(third_offset);

            _updateTrainTimes(first_offset, second_offset);
        }
    });

    

    _generateData();
    _renderData();
    _updateTrainTimes(10, 10);

    $('#info').modal('show');

});