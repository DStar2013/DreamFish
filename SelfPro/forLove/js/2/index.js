/**
 * Created by dream on 16/8/4.
 */


(function ($) {

    function textAppendInit() {
        var sDesc = $('#st-desc');
        //desc
        var descArr = [];

        for (var i in TC.eventDes) {
            if (TC.eventDes.hasOwnProperty(i)) {
                descArr.push("<p class='link link--urpi' data-letters='" + TC.eventDes[i] + "' style='display: none;'>" + TC.eventDes[i] + "</p><br/>");
            }
        }
        sDesc.html(descArr.join(""));
    }


    function textShowInit() {
        var pList = $('#st-content').find('p');
        //js dom list 转化为数组对象
        var pArr = Array.prototype.slice.call(pList);
        var animateListFun = [];
        //动画顺序
        var animateIndex = 0;

        var animateFun = function (pArr, successCallBack) {
            if (!pArr || pArr.length == 0) return;
            var currObj = $(pArr[0]);
            pArr.shift();
            //循环动画
            if (pArr.length > 0) {
                animateIndex == 3 ? animateIndex = 1 : animateIndex++;
                switch (animateIndex) {
                    case 1:
                        currObj.show(5000, function () {
                            animateFun(pArr);
                        });
                        break;
                    case 2:
                        currObj.fadeIn(5000, function () {
                            animateFun(pArr);
                        });
                        break;
                    case 3:
                        currObj.slideDown(5000, function () {
                            animateFun(pArr);
                        });
                        break;
                    default:
                        currObj.show(5000, function () {
                            animateFun(pArr);
                        });
                        break;
                }
            } else {
                currObj.show(5000, function () {
                    animateFun(pArr);
                });
            }

        }

        animateFun(pArr);

    }

    //Ev init
    function EventInit() {
        $('#p-next').bind('click', function () {
            location.href = "Love.html";
        });
    }

    //extend function
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
            var c = "background:" + C.a_bgColor + ";position:absolute;left:0;top:0;width:" + Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.clientWidth, document.body.scrollWidth) + "px;height:" + Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight) + "px;";
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
        textAppendInit();
        //
        textShowInit();
        //
        EventInit();

    });

})(jQuery);

