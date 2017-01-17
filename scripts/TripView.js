$(function() {

    var _cache = {},
        _trips = [],
        _zeroOffset = 10, // TODO
        _firstOffset = 10,
        _secondOffset = 10,

        _init = function _init() {
            _setupCache();
            _addEvents();
        },

        _setupCache = function _setupCache() {

            _cache.optimizeButton = $('#optimize');
            _cache.newDataButton = $('#new-data');

            _cache.addTimeOne = $('.add-time-1');
            _cache.addTimeTwo = $('.add-time-2');
            _cache.reduceTimeOne = $('.reduce-time-1');
            _cache.reduceTimeTwo = $('.reduce-time-2');
        },

        // these events are on permanent interface elements
        // called once on DOM ready
        _addEvents = function _addEvents() {

            _cache.optimizeButton.click(function() {
                var offsets = ScheduleOptimizer.getOptimizedOffsets();

                _firstOffset = offsets[0];
                _secondOffset = offsets[1];
                _zeroOffset = 30 - _firstOffset - _secondOffset;
                _updateTrainIntervals();

            });

            _cache.newDataButton.click(function() {
                _zeroOffset = 10;
                _firstOffset = 10;
                _secondOffset = 10;
                _generateData();
                _renderData();
                _updateTrainIntervals();
            });

            _cache.addTimeOne.click(function() {
                _firstOffset++;
                _secondOffset--;
                _updateTrainIntervals();
            });

            _cache.reduceTimeOne.click(function() {
                _firstOffset--;
                _secondOffset++;
                _updateTrainIntervals();
            });

            _cache.addTimeTwo.click(function() {
                _secondOffset++;
                _zeroOffset--;
                _updateTrainIntervals();
            });

            _cache.reduceTimeTwo.click(function() {
                _secondOffset--;
                _zeroOffset++;
                _updateTrainIntervals();
            });
        },

        // these events are on (potentially) temporary interface elements
        // called once after each new dataset
        _addTripEvents = function _addTripEvents() {

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

        },

        _updateTrainTimes = function _updateTrainTimes(first_offset = 10, second_offset = 10) {
        
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
                    routeDirectionText = "NB";
                } else {
                    routeDirectionText = "SB";
                }
                if (route == 0) {
                    routeText = "Gold Line " + routeDirectionText;
                } else {
                    routeText = "Red Line " + routeDirectionText;
                }
                startStationName = startTimeText + ' ' + ScheduleHelper.getStationName(startStationId);
                endStationName = endTimeText + ' ' + ScheduleHelper.getStationName(endStationId);
                $('.train-label', $(this)).html(routeText + '<br />' + startStationName + '<br />' + endStationName);
                $('.route-label', $(this)).html(routeText);

                // calculate time on platform
                var initialPlatformTime = $('.platform-time', $(this)).data('initial-platform-time')
                var currentPlatformTime = firstTrainTime - minTime;

                
                // color
                var diff = (currentPlatformTime - initialPlatformTime) / 60;
                _getSpeedClass($('.platform-time', $(this)), diff);
                _getSpeedClass($('.result', $(this)), diff);
                var change;
                var changeLabel;
                var timeSaved = 0;
                if (diff > 0) {
                    change = '-' + diff + ' min';
                    changeLabel = '-' + diff + ' min';
                } else if (diff < 0) {
                    change = '+' + (diff * -1) + ' min';
                    changeLabel = diff + ' min';
                    timeSaved = diff * -1;
                } else {
                    change = '';
                    changeLabel = '-0 min';
                }
                $('.result', $(this)).html(change);
                $('.result', $(this)).attr('data-result-diff', diff);

                // show green for time saved
                $('.time-saved', $(this)).css('left', _timeToLeftOffset(tripEndTime));
                $('.time-saved', $(this)).css('width', _minutesToWidth(timeSaved));

                // adjust position, if less than initial
                if (initialPlatformTime >= currentPlatformTime) {
                    $('.platform-time', $(this)).css('left',  _timeToLeftOffset(minTime));
                    $('.platform-time', $(this)).css('right', _timeToRightOffset(minTime + currentPlatformTime));
                    // hide red line
                    $('.additional-time', $(this)).css('left',  _timeToLeftOffset(minTime));
                    $('.additional-time', $(this)).css('right', _timeToRightOffset(minTime));
                } else {
                    // maximize black line at initial time
                    $('.platform-time', $(this)).css('left',  _timeToLeftOffset(minTime));
                    $('.platform-time', $(this)).css('right', _timeToRightOffset(minTime + initialPlatformTime));
                    // extend red line
                    $('.additional-time', $(this)).css('left',  _timeToLeftOffset(minTime));
                    $('.additional-time', $(this)).css('right', _timeToRightOffset(minTime + currentPlatformTime));
                }
                

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

            // adjust the train schedule
            _displaySchedule(0, ScheduleHelper.getScheduleForRouteStation(1, 0, 41, first_offset, second_offset), first_offset, second_offset); // red NB
            _displaySchedule(1, ScheduleHelper.getScheduleForRouteStation(1, 1, 54, first_offset, second_offset), first_offset, second_offset); // red SB
            _displaySchedule(2, ScheduleHelper.getScheduleForRouteStation(0, 0, 41, first_offset, second_offset), first_offset, second_offset); // gold NB
            _displaySchedule(3, ScheduleHelper.getScheduleForRouteStation(0, 1, 50, first_offset, second_offset), first_offset, second_offset); // gold SB

            // adjust offsets
            var firstOffsetDisplay = _firstOffset - 10;
            var secondOffsetDisplay = (20 - _firstOffset - _secondOffset) * -1;

            if (firstOffsetDisplay >= 0) {
                firstOffsetDisplay = "+" + firstOffsetDisplay;
            }
            if (secondOffsetDisplay >= 0) {
                secondOffsetDisplay = "+" + secondOffsetDisplay;
            }

            $('.schedule-change-label-1').html(firstOffsetDisplay + ' min');
            $('.schedule-change-label-2').html(secondOffsetDisplay + ' min');

        },

        _displaySchedule = function _displaySchedule(scheduleNumber, schedule, first_offset, second_offset) {

            var i;
            for (i = 0; i < schedule.length; i++) {

                if ($('#schedule' + scheduleNumber + ' td').length > i) {  
                    // child exists, just update html
                    var el = $('#schedule' + scheduleNumber + ' td:nth-child(' + (i + 3) + ')'); // +3 because 2 th elements
                    el.html(schedule[i]);
                } else {
                    // child does not exist, append
                    var remainder = (i + 1) % 4;
                    var className;
                    if (remainder == 1) {
                        className = 'col0';
                    } else if (remainder == 2) {
                        className = 'col1';
                    } else if (remainder == 3) {
                        className = 'col2';
                    } else {
                        className = 'col3';
                    }

                    var el = $('<td class="schedule-time ' + className + '">' + schedule[i] + '</td>');
                    $('#schedule' + scheduleNumber).append(el);

                    if (first_offset == 10 && second_offset == 10) {
                        // default, save time in data attribute
                        el.attr('data-default-time', schedule[i]);
                    }
                }

                
            }

            // highlight any times that are not the default time
            $('.schedule-time').each(function(i, el){
                if ($(this).attr('data-default-time') != $(this).html()) {
                    $(this).css('color', 'blue');
                } else {
                    $(this).css('color', 'black');
                }
            });

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

        _minutesToWidth = function _minutesToWidth(minutes) {
            var hours = minutes/60, // calculate hours
                percent = hours * 40; // hours get 40% of screen
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
            for (i = 0; i < 30; i++) {
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
                    '<div class="route-label"></div>' + // filled in later 
                    '<div class="station station--origin station--' + railLine + '">' + ScheduleHelper.getStationAbbreviation(_trips[i].start.station_id) + '</div>' +
                    '<div class="station station--destination station--' + railLine + '">' + ScheduleHelper.getStationAbbreviation(_trips[i].end.station_id) + '</div>' +
                    '<div class="visualization-wrap">' +
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
                        '<div class="tag tag-on" data-time="' + _trips[i].start.transit_time + '" data-time-display="' + tagOnTime + '"><div class="tag-label">Enter Station<br />' + tagOnTime + '<br />' + startStation + '</div></div>' + 
                        '<div class="stop trip-start" data-start-station="' + _trips[i].start.station_id + '" data-min-train-time="' + _trips[i].start.min_train_time + '" data-min-train-time-display="' + minTrainTime + '"></div>' + 
                        '<div class="stop trip-end" data-end-station="' + _trips[i].end.station_id + '"></div>' + 
                        //'<div class="tag tag-off" data-row="' + i + '" data-time="' + _trips[i].end.transit_time + '" data-time-display="' + tagOffTime + '"><div class="tag-label">Exit Station<br />' + tagOffTime + '<br />' + endStation + '</div></div>' +
                        '<div class="connection connection--' + railLine + '" data-route="' + _trips[i].start.route + '" data-route-direction="' + _trips[i].start.route_direction + '"><div class="train-begin"></div><div class="train-middle"></div><div class="train-end"></div><div class="train-label"></div></div>' + 
                        '<div class="additional-time" data-initial-platform-time="' + platformTime + '">&nbsp;</div>' +
                        '<div class="platform-time" data-initial-platform-time="' + platformTime + '"><div class="wait-time-label"></div></div>' +
                        '<div class="time-saved"><div class="time-saved-label"></div></div>' + 
                    '</div>' +
                    '<div class="result">-0 min</div>');

            }


                $("*[data-row]").each(function(){
                    var rowdata = parseInt($(this).data('row'));
                    $(this).css('top', ((rowdata * 22) + 2) + 'px'); // each row 100px
                });

                // adjust everything based on data-time.... (1 min = 2 px, 1 hr = 120 px)
                $("*[data-time]").each(function(){
                    var timedata = parseInt($(this).data('time'));
                    var hours = ((timedata - 57600)/3600); // adjust for 3 PM
                    $(this).css('left', (hours * 40) + '%');
                });

            // add events to new elements
            _addTripEvents();
        },

        _updateTrainIntervals = function _updateTrainIntervals() {

            //var _zeroOffset = 30 - (_firstOffset + _secondOffset);
            var unit = 160 / 24;
            $('.trains .train-marker--one').css('width', (unit * _firstOffset / 10) + '%');
            $('.trains .train-marker--two').css('width', (unit * _secondOffset / 10) + '%');
            $('.trains .train-marker--three').css('width', (unit * _zeroOffset / 10) + '%');

            $('#slider-key .train-marker--one').html(_firstOffset);
            $('#slider-key .train-marker--two').html(_secondOffset);
            $('#slider-key .train-marker--three').html(_zeroOffset);

            // get new schedule
            // loop through schedule, adjust 'left' css based on depart times
            // 

            $('.trains .train-marker--one').css('left', (unit * _firstOffset / 10) + '%');
            $('.trains .train-marker--two').css('left', (unit * _secondOffset / 10) + '%');
            $('.trains .train-marker--three').css('left', (unit * _zeroOffset / 10) + '%');

            $('#slider-key .train-key--one').html(_firstOffset);
            $('#slider-key .train-key--two').html(_secondOffset);
            $('#slider-key .train-key--three').html(_zeroOffset);

            _updateTrainTimes(_firstOffset, _secondOffset);
        };

    
    _init();
    _generateData();
    _renderData();
    
    _updateTrainIntervals();

    $('#info').modal('show');

});