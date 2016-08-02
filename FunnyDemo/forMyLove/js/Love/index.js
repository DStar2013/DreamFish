(function ($) {


    function timeInit() {
        var note = $('#note'),
            ts = new Date(2012, 0, 1),
            newYear = true;

        if ((new Date()) > ts) {
            // The new year is here! Count towards something else.
            // Notice the *1000 at the end - time must be in milliseconds
            ts = (new Date()).getTime() + 10 * 24 * 60 * 60 * 1000;
            newYear = false;
        }

        //setInterval(function(){
        //
        //    $('#countdown').countdown({
        //        timestamp: (new Date()).getTime()
        //    })
        //}, 1000)

        $('#countdown').countdown({
            timestamp: ts,
            callback: function (days, hours, minutes, seconds) {

                var message = "";

                message += days + " day" + ( days == 1 ? '' : 's' ) + ", ";
                message += hours + " hour" + ( hours == 1 ? '' : 's' ) + ", ";
                message += minutes + " minute" + ( minutes == 1 ? '' : 's' ) + " and ";
                message += seconds + " second" + ( seconds == 1 ? '' : 's' ) + " <br />";

                if (newYear) {
                    message += "left until the new year!";
                }
                else {
                    message += "left to 10 days from now!";
                }

                note.html(message);
            }
        });
    }

    function AnivivaslInit() {
        var _day = $("#stDay"),
            _hour = $("#stHours"),
            _min = $("#stMin"),
            _sec = $("#stSec");
        var showRealTime = function () {

            var firmetDate = new Date(TC.FirstMeetTime);
            var nowDate = new Date();
            var diffTime = nowDate.getTime() - firmetDate.getTime();
            //算出天数
            var realDay = Math.floor(diffTime / (24 * 3600 * 1000));
            _day.html(realDay < 10 ? "0" + realDay : realDay);
            //算出小时
            var dayLeftTime = diffTime % (24 * 3600 * 1000);
            var realHour = Math.floor(dayLeftTime / (3600 * 1000));
            _hour.html(realHour < 10 ? "0" + realHour : realHour);
            //算出分钟
            var hourLeftTime = dayLeftTime % (3600 * 1000);
            var realMin = Math.floor(hourLeftTime / (60 * 1000));
            _min.html(realMin < 10 ? "0" + realMin : realMin);
            //算出秒钟
            var minLeftTime = hourLeftTime % (60 * 1000);
            var relSec = Math.round(minLeftTime / 1000);
            _sec.html(relSec < 10 ? "0" + relSec : relSec);
        };

        showRealTime();
        setInterval(function () {
            showRealTime();
        }, 1000);
    }

    $(document).ready(function () {
        //
        $("#top").lettering();
        $("#bottom").lettering();

        //
        //timeInit();
        AnivivaslInit();
    })

})(jQuery);