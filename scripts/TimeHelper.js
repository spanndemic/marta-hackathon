var TimeHelper = (function () {

    // turns '08:04:10' into '8:00 AM'
    var _formatTime = function _formatTime(timeString) {

            var hours = parseInt(timeString.substring(0, 2)),
                minutes = timeString.substring(3, 5),
                amPm = "AM";

            if (hours > 12) {
                hours -= 12;
                amPm = "PM";
            }

            return hours + ":" + minutes + " " + amPm;

        },

        // turns number in minutes (with optional offset) to a time string
        // ex: '10875' into '08:04:10'
        _secondsToTimeString = function _secondsToTimeString(seconds, offset) {

            if (offset > 0) {
                seconds -= offset;
            }

            var hours = "" + Math.floor(seconds / 3600),
                minutes = "" + Math.floor((seconds - (hours * 3600)) / 60),
                seconds = "" + (seconds - (hours * 3600) - (minutes * 60));

            var pad = "00"
            var returnString = pad.substring(0, pad.length - hours.length) + hours + ":" + pad.substring(0, pad.length - minutes.length) + minutes + ":" + pad.substring(0, pad.length - seconds.length) + seconds;
            return returnString;

        },

        // turns '08:04:10' into a number of seconds '3535200'
        _timeStringToNumber = function _timeStringToNumber(timeString) {

            var hours = parseInt(timeString.substring(0, 2)),
                minutes = timeString.substring(3, 5),
                seconds = timeString.substring(6, 8);

            var value = (hours * 3600) + (minutes * 60) + parseInt(seconds);
            return value;

        },

        _getRandomStartTime = function _getRandomStartTime(amPm) {
            var startTime;
            if (amPm == "AM") {
                startTime = (Math.floor(Math.random() * 180) * 60) + 21600; // random AM time
            } else {
                startTime = (Math.floor(Math.random() * 70) * 60) + 59100; // random PM time (limited to 4-6 PM, 25 min padding)
            }
            return startTime;
        };
 
    return {
        formatTime: _formatTime,
        secondsToTimeString: _secondsToTimeString,
        timeStringToNumber: _timeStringToNumber,
        getRandomStartTime: _getRandomStartTime
    };

})();