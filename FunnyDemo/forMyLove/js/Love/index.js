(function ($) {

    var PageInitRose = false;

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

    //event init
    function EventInit() {
        var hd = $('#heartDiv'), rd = $('#roseDiv');
        //heart click
        $('#heartDesc').bind('click', function () {

            hd.hide(3000, function () {
                rd.fadeIn(500, function () {
                    !PageInitRose && DrawRose();
                    PageInitRose = true;
                });
            });
        });
        //rose click
        $('#roseDiv').bind('click', function(){
            rd.fadeOut(2000, function(){
                hd.show(3000,function(){

                });
            })
        })
    }

    //extend
    $.extend($.fn, {
        mask: function (o) {
            var a = this[0];
            if (!a)
                return console.log("mask", "the cDom object is empty"), this;
            this.unmask();
            var b = {};
            b.cssText = a.style.cssText;
            b.nextSibling = a.nextSibling;
            b.parentNode = a.parentNode;
            a.style.position = "absolute";
            a.style.display = "block";
            var C = {
                a_bgColor: (o && o.bgColor) || "#fff"
            };
            //        var _ina = document.createElement("container");
            //        _ina.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;z-index:100;";
            //        var _inb = document.body;
            //        _inb || document.write('<span id="__body__" style="display:none;">cQuery</span>');
            //        ((_inb = document.body.firstChild) ? document.body.insertBefore(_ina, _inb) : document.body.appendChild(_ina));
            //        (_inb = document.getElementById("__body__")) && _inb.parentNode.removeChild(_inb);
            //        var _container = $(_ina);
            //        _container.append(a);
            a.style.left = (document.documentElement.scrollLeft || document.body.scrollLeft || 0) + Math.max(0, (document.documentElement.clientWidth - a.offsetWidth) / 2) + "px";
            a.style.top = (document.documentElement.scrollTop || document.body.scrollTop || 0) + Math.max(0, (document.documentElement.clientHeight - a.offsetHeight) / 2) + "px";
            var c = "background:" + C.a_bgColor + ";position:absolute;z-index:999;left:0;top:0;width:" + Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.clientWidth, document.body.scrollWidth) + "px;height:" + Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight) + "px;";
            b.maskDiv = document.createElement("div");
            b.maskDiv.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60);opacity:0.6;";
            $(b.maskDiv).insertBefore(a);
            var isIE = /msie/.test(navigator.userAgent.toLowerCase());
            isIE && (b.maskIframe = document.createElement("iframe"), b.maskIframe.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);opacity:0;", $(b.maskIframe).insertBefore(b.maskDiv));
            this.data("__mask__", b);
            return this;
        },
        unmask: function () {
            if (!this[0])
                return console.log("mask", "the cDom object is empty"), this;
            var a = this.data("__mask__");
            a && (this[0].style.cssText = a.cssText, (a.nextSibling ? this.first().insertBefore(a.nextSibling) : this.first().appendTo(a.parentNode)), $(a.maskDiv).remove(), a.maskIframe && $(a.maskIframe).remove(), this.removeData("__mask__"));
        },
        placeholder: function () {
            if ("placeholder" in document.createElement("input")) {
                return this; //如果原生支持placeholder属性，则返回对象本身
            } else {
                return this.each(function () {
                    var _this = $(this);
                    _this.focus(function () {
                        if (_this.val() === _this.attr("placeholder")) {
                            _this.css("color", "");
                            _this.val("")
                        }
                    }).blur(function () {
                        if (_this.val().length === 0) {
                            _this.val(_this.attr("placeholder"));
                            _this.css("color", "gray");
                        }
                    });
                    if (!_this.val()) {
                        _this.val(_this.attr("placeholder"));
                        _this.css("color", "gray");
                    }
                    ;
                })
            }
        }
    });

    $(document).ready(function () {
        //
        $("#top").lettering();
        $("#bottom").lettering();

        //
        //timeInit();
        AnivivaslInit();

        //
        EventInit();


        $('#test').bind('click', function () {
            console.log('CC')
        })
    })

})(jQuery);
