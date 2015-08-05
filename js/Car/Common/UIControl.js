(function ($, cfg) {
    //sth common UI
    //code by d.star 2015.4.2
    //Base
    var $el = function (id) { return $(id, document); };
    var _ = {};
    if (!window.UIControl) window.UIControl = _;
    //control version
    var versions = { calendar: '6.0', validate: '1.1', address: '1.0', tab: '1.2', sideBar: '2.0' };
    //功能键keycode
    var keycodes = [16, 17, 18, 20, 35, 36, 37, 39, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 229];
    //Comm Fun
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //
    $(document).bind('click', function () { $('.pop_star').css('visibility', 'hidden'); $('.pop_star_dis').css('display', 'none'); })
    var _loading = (function () {
        var d = $(document.createElement('div'));
        d.addClass('ui-modal ui-loading'); d.css('display', 'none');
        d.html('<img src="http://pic.c-ctrip.com/car/ui/loading32.gif" alt=""><p class="txt">' + label.UIC_Loading + '</p>');
        $(document.body).append(d);
        return d;
    })();
    //================================= Warning Control S =================================
    _.WarnControl = (function () {
        var w = $(document).regMod('validate', versions.validate);

        function show(target, msg, options) {
            if (!options) options = { removeErrorClass: true, isScroll: false, hideEvent: 'blur' };
            options.$obj = target;
            options.data = msg;
            w.method('show', options);
        }

        return {
            show: show,
            hide: function () { w.method('hide'); }
        }
    })();
    //================================= Warning Control E =================================

    //================================= Extend Date S =================================
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    //================================= Extend Date E =================================

    //================================= Date Control S =================================
    _.DateControl = (function () {
        function createCalendar(obj, options) {
            var tmp = {
                options: options,
                listeners: {
                    onShow: function () {
                        this._layout && this._layout.css('position', 'absolute');
                    }
                }
            };
            return obj.regMod("calendar", versions.calendar, tmp);
        }
        function getCalendar(obj) {
            return obj.getMod("calendar", versions.calendar);
        }
        //
        function setNormalObj(o) {
            return {
                getDate: function () {
                    return o.value().toDate();
                },
                setDate: function (d) {
                    o.value(d ? d.toFormatString("yyyy-MM-dd") : "");
                }
            }
        }
        function InitNormalDate(o) {
            if (!o) return;
            var start = $el(o.Start.startObj), sObj = setNormalObj(start), now = new Date(),
                smin = o.Start.Min ? now.addDays(o.Start.Min.addDays) : now, smax = o.Start.Max ? now.addDays(o.Start.Max.addDays) : null,
                sdefault = o.Start.Default ? now.addDays(o.Start.Default.addDays) : smin;
            //
            (IsEmpty(start.value()) || (start.value() == start.attr('placeholder'))) && (start.value(sdefault.toFormatString("yyyy-MM-dd")));
            var _lastDateVal = start.value();
            //
            createCalendar(start, { minDate: smin, maxDate: smax, container: cQuery.container });
            //
            var checkDate = function () {
                if (start && start.length > 0) {
                    if (IsEmpty(start.value()) || start.value() == start.attr('placeholder')) {
                        _.WarnControl.show(start, cfg.msg.dateMsg.dateEmpty);
                        return false;
                    }
                }
                //时间是否过期
                var _nowMinDate = (o.Start.Min ? new Date().addDays(o.Start.Min.addDays) : new Date());
                if (start && sObj.getDate() < _nowMinDate.toDate()) {
                    _.WarnControl.show(start, cfg.msg.dateMsg.dateExpire.replace('${1}', _nowMinDate.toFormatString('yyyy-MM-dd')));
                    return false;
                }

                return true;
            }
            var setDate = function (d) {
                start.value(d);
            }
            //
            if (o.Start && o.Start.onchange && typeof o.Start.onchange == 'function') {
                start.bind('change', function () {
                    (_lastDateVal.toDate().getTime() != start.value().toDate().getTime()) && o.Start.onchange();
                    _lastDateVal = start.value();
                });
            }
            return {
                getDate: { startDate: sObj.getDate },
                getValue: function () {
                    return start.value();
                },
                setDate: function (d) {
                    setDate(d);
                },
                checkDate: checkDate
            }
        }
        //
        function setYMDHMObj(ymd, hm) {
            return {
                getDate: function () {
                    var ymdVal = ymd.value(), hmVal = hm.value();
                    return (ymdVal + ' ' + hmVal + ':00').toDateTime();
                },
                setDate: function (d) {
                    ymd.value(d ? d.toFormatString("yyyy-MM-dd") : ""); //ymd.data("rDate", d);
                    hm.value(d ? d.toFormatString("hh:mm") : ""); //hm.data("rDate", d);
                    //hid.value(d ? d.toFormatString("yyyy-MM-dd hh:mm") : ""); //hid.data("rDate", d);
                }
            }
        }
        function fixGTHMDate(d, o, b) {
            //d 向上分钟取整 method
            //b {isGTMin:bool,isGTHour:bool}
            if (IsEmpty(o.addDays)) return;
            var p = d.addDays(o.addDays).addMinutes(IsEmpty(o.addMin) ? 0 : o.addMin);
            if (!IsEmpty(o.hm)) {
                p = (p.toFormatString('yyyy-MM-dd') + ' ' + o.hm + ':00').toDateTime();
            }
            if (b.isGTMin) {
                var h = p.getMinutes();
                return (h && (h % 10 > 0)) ? p.addMinutes(10 - h % 10) : p;
            } else if (b.isGTHour) {
                return (p.toFormatString('yyyy-MM-dd hh') + ':00:00').toDateTime();
            } else { return p; }
        }
        function DrawHMLayer(layer, options) {
            var hList = layer.find("a.hour"), mList = layer.find("a.minute");
            hList.removeClass("disabled selected"); mList.removeClass("disabled selected");
            if (options.ymdO.value() === options.minDate.toFormatString("yyyy-MM-dd")) {
                for (var i = 0; i < hList.length; i++) {
                    var tmp = $(hList[i]);
                    if (parseInt(tmp.attr('data-hour')) < parseInt(options.minDate.toFormatString("hh"))) {
                        tmp.addClass("disabled");
                    } else { break; }
                }
                //
                var hmV = options.defaultHM.split(':');
                if (hmV.length > 1 && parseInt(hmV[0]) === parseInt(options.minDate.toFormatString("hh"))) {
                    for (var i = 0; i < mList.length; i++) {
                        var tmp = $(mList[i]);
                        if (parseInt(tmp.attr('data-minute')) < parseInt(options.minDate.toFormatString("mm"))) {
                            tmp.addClass("disabled");
                        } else { break; }
                    }
                }
            }
            var checkHM = function (layer, h, m) {
                //layer.find('[mark="hour"]')[0] && (layer.find('[mark="hour"]')[0].scrollTop = 24 * (parseInt(h) - 2 < 0 ? 0 : parseInt(h) - 2));
                layer.find('[mark="hour"]')[0] && (layer.find('[mark="hour"]')[0].scrollTop = parseInt(hList.first().offset().height) * (parseInt(h) - 2 < 0 ? 0 : parseInt(h) - 2));
                layer.find('[data-hour=' + h + ']').addClass('selected');
                layer.find('[data-minute=' + m + ']').addClass('selected');
            }
            var oDate = [options.ymdO.value(), [options.defaultHM, "00"].join(":")].join(" ").toDateTime(), hmArr = options.defaultHM.split(":");
            if (hmArr.length > 1 && oDate && oDate > options.minDate) {
                checkHM(layer, hmArr[0], hmArr[1]);
            } else {
                checkHM(layer, options.minDate.toFormatString("hh"), options.minDate.toFormatString("mm"));
            }
        }
        function InitYMDHMDate(o) {
            var s_ymd = $el(o.Start.ymdObj), s_hm = $el(o.Start.hmObj), s_layer = $el(o.Start.layer),
                shMark = false, smMark = false, isGTMin = o.IsGTMin ? o.IsGTMin : true;
            var sObj = setYMDHMObj(s_ymd, s_hm), startCalendar, endCalendar;
            //================================
            var e_ymd, e_hm, e_layer, ehMark, emMark, eObj, eMinDate, eMaxDate, eDefaultDate;
            //================================
            //
            var innerFun = {
                layerInit: function (layer, ymd, hm, hMark, mMark, minDate) {
                    layer.html($.tmpl.render(cfg.tmpl.hmTmpl));
                    hm.bind('click', function (e) {
                        //先清空
                        $('.pop_star').css('visibility', 'hidden');
                        //
                        layer.css({ 'visibility': 'visible', 'left': hm.offset().left + 'px', 'top': hm.offset().bottom + 'px' });
                        hMark = mMark = false;
                        e.stop();
                    });
                    //
                    var hList = layer.find("a.hour"), mList = layer.find("a.minute");
                    hList.bind('click', function (e) {
                        if (!$(this).hasClass("disabled")) {
                            hMark = true;
                            hList.removeClass("selected"); $(this).addClass("selected"); mList.removeClass("disabled");
                            if (ymd.value() === minDate.toFormatString('yyyy-MM-dd') && $(this).attr("data-hour") === minDate.toFormatString('hh')) {
                                for (var i = 0; i < mList.length; i++) {
                                    var tmp = $(mList[i]);
                                    if (parseInt(tmp.attr('data-minute')) < parseInt(minDate.toFormatString("mm"))) {
                                        tmp.addClass("disabled");
                                    } else { break; }
                                }
                            }
                            var hmV = hm.value().split(':'); hmV[0] && (hmV[0] = $(this).attr("data-hour"));
                            hm.value(hmV.join(":"));
                            mMark && (layer.css('visibility', 'hidden'));
                            //触发下更改
                            //ymd.trigger('change');
                            innerFun.shm_ehm(ymd, $(this).attr("data-hour"));
                        }
                        e.stop();
                    });
                    mList.bind('click', function (e) {
                        if (!$(this).hasClass("disabled")) {
                            mMark = true;
                            mList.removeClass("selected"); $(this).addClass("selected");
                            var hmV = hm.value().split(':'); hmV[1] && (hmV[1] = $(this).attr("data-minute"));
                            hm.value(hmV.join(":"));
                            hMark && (layer.css('visibility', 'hidden'));
                            //触发下更改
                            //ymd.trigger('change');
                            innerFun.shm_ehm(ymd);
                        }
                        e.stop();
                    });
                    DrawHMLayer(layer, { ymdO: ymd, minDate: minDate, defaultHM: hm.value() });
                },
                sInit: function (n, content, options) {
                    sMinDate = fixGTHMDate(n, content.Min, options);
                    sMaxDate = fixGTHMDate(n, content.Max, options);
                    sDefaultDate = fixGTHMDate(n, content.Default, options);
                },
                eInit: function (n, content, options) {
                    eMinDate = fixGTHMDate(n, content.Min, options);
                    eMaxDate = fixGTHMDate(n, content.Max, options);
                    eDefaultDate = fixGTHMDate(n, content.Default, options);
                },
                shm_ehm: function (ymd, h) {
                    // if 存在e, s更改, s和e同一天
                    //如果是Start，修改小时，小时等于sMin
                    if (ymd.uid() == s_ymd.uid() && h && (h == sMinDate.toFormatString('hh'))) {
                        if (sMinDate > sObj.getDate()) {
                            sObj.setDate(sMinDate);
                            innerFun.layerInit(s_layer, s_ymd, s_hm, shMark, smMark, sMinDate);
                        }
                        //改变end
                        if (o && o.End) {
                            innerFun.eInit(sObj.getDate(), o.End, { isGTMin: isGTMin });
                            e_ymd.data('minDate', eMinDate); //更爱e_ymd时间
                        }
                    }
                    //如果是End 并且修改的为小时，并且小时等于eMin
                    var spe = o && o.End && (ymd.uid() == e_ymd.uid()) && h && (h == eMinDate.toFormatString('hh'));
                    if (o && o.End && (ymd.uid() == s_ymd.uid() || spe) && s_ymd.value() == e_ymd.value()) {
                        //重绘end结构
                        innerFun.eInit(sObj.getDate(), o.End, { isGTMin: isGTMin });
                        e_ymd.data('minDate', eMinDate); //更新e_ymd时间
                        if (sObj.getDate() > eObj.getDate()) {
                            eObj.setDate(eDefaultDate);
                        } else if (eMinDate > eObj.getDate()) {
                            eObj.setDate(eMinDate);
                        }
                        endCalendar.method("setWeek");
                        innerFun.layerInit(e_layer, e_ymd, e_hm, ehMark, emMark, eMinDate);
                    }
                }
            }
            //=====================================
            //
            var now = new Date(), sMinDate, sMaxDate, sDefaultDate;
            innerFun.sInit(now, o.Start, { isGTMin: isGTMin });
            //init
            sObj.setDate((IsEmpty(s_ymd.value()) || s_ymd.value() == s_ymd.attr('placeholder') || IsEmpty(s_hm.value())) ? sDefaultDate : [s_ymd.value(), [s_hm.value(), "00"].join(":")].join(" ").toDateTime());
            //*** Start End***
            startCalendar = createCalendar(s_ymd, { minDate: sMinDate, maxDate: sMaxDate, container: cQuery.container });
            startCalendar.method("setWeek");
            //
            if (o && o.End) {
                e_ymd = $el(o.End.ymdObj), e_hm = $el(o.End.hmObj), e_layer = $el(o.End.layer), ehMark = false, emMark = false;
                eObj = setYMDHMObj(e_ymd, e_hm);
                innerFun.eInit(sObj.getDate(), o.End, { isGTMin: isGTMin });
                //init
                eObj.setDate((IsEmpty(e_ymd.value()) || IsEmpty(e_hm.value())) ? eDefaultDate : [e_ymd.value(), [e_hm.value(), "00"].join(":")].join(" ").toDateTime());
                endCalendar = createCalendar(e_ymd, { reference: o.Start.ymdObj, minDate: eMinDate, maxDate: eMaxDate });
                endCalendar.method("setWeek");
                innerFun.layerInit(e_layer, e_ymd, e_hm, ehMark, emMark, eMinDate);
                //                e_layer.html($.tmpl.render(cfg.tmpl.hmTmpl));
                //                e_hm.bind('click', function (e) {
                //                    e_layer.css({ 'visibility': 'visible', 'left': e_hm.offset().left + 'px', 'top': e_hm.offset().bottom + 'px' });
                //                    ehMark = emMark = false;
                //                    e.stop();
                //                });
                //                //
                //                var ehList = e_layer.find("a.hour"), emList = e_layer.find("a.minute");

            }
            //
            innerFun.layerInit(s_layer, s_ymd, s_hm, shMark, smMark, sMinDate);
            //
            //s_layer.html($.tmpl.render(cfg.tmpl.hmTmpl));
            //            s_hm.bind('click', function (e) {
            //                s_layer.css({ 'visibility': 'visible', 'left': s_hm.offset().left + 'px', 'top': s_hm.offset().bottom + 'px' });
            //                shMark = smMark = false;
            //                e.stop();
            //            });
            //            var hList = s_layer.find("a.hour"), mList = s_layer.find("a.minute");
            //            hList.bind('click', function (e) {
            //                if (!$(this).hasClass("disabled")) {
            //                    shMark = true;
            //                    hList.removeClass("selected"); $(this).addClass("selected"); mList.removeClass("disabled");
            //                    if (s_ymd.value() === sMinDate.toFormatString('yyyy-MM-dd') && $(this).attr("data-hour") === sMinDate.toFormatString('hh')) {
            //                        for (var i = 0; i < mList.length; i++) {
            //                            var tmp = $(mList[i]);
            //                            if (parseInt(tmp.attr('data-minute')) < parseInt(sMinDate.toFormatString("mm"))) {
            //                                tmp.addClass("disabled");
            //                            } else { break; }
            //                        }
            //                    }
            //                    var hmV = s_hm.value().split(':'); hmV[0] && (hmV[0] = $(this).attr("data-hour"));
            //                    s_hm.value(hmV.join(":"));
            //                    smMark && (s_layer.css('visibility', 'hidden'));
            //                }
            //                e.stop();
            //            });
            //            mList.bind('click', function (e) {
            //                if (!$(this).hasClass("disabled")) {
            //                    smMark = true;
            //                    mList.removeClass("selected"); $(this).addClass("selected");
            //                    var hmV = s_hm.value().split(':'); hmV[1] && (hmV[1] = $(this).attr("data-minute"));
            //                    s_hm.value(hmV.join(":"));
            //                    shMark && (s_layer.css('visibility', 'hidden'));
            //                }
            //                e.stop();
            //            });
            //            DrawHMLayer(s_layer, { ymdO: s_ymd, minDate: sMinDate, defaultHM: s_hm.value() });
            s_ymd.bind('change', function () {
                var oDate = [s_ymd.value(), [s_hm.value(), "00"].join(":")].join(" ").toDateTime();
                if (oDate < sMinDate) { s_hm.value(sMinDate.toFormatString("hh:mm")); }
                DrawHMLayer(s_layer, { ymdO: s_ymd, minDate: sMinDate, defaultHM: s_hm.value() });
                //重新初始化eDate的min max
                //重新绘制eDate相关
                if (o && o.End) {
                    innerFun.eInit(sObj.getDate(), o.End, { isGTMin: isGTMin });
                    e_ymd.data('minDate', eMinDate); //更爱e_ymd时间
                    if (sObj.getDate() > eObj.getDate()) {
                        eObj.setDate(eDefaultDate);
                    } else if (eMinDate > eObj.getDate()) {
                        eObj.setDate(eMinDate);
                    }
                    endCalendar.method("setWeek");
                    innerFun.layerInit(e_layer, e_ymd, e_hm, ehMark, emMark, eMinDate);
                }
            });
            if (e_ymd) {
                e_ymd.bind('change', function () {
                    var oDate = [e_ymd.value(), [e_hm.value(), "00"].join(":")].join(" ").toDateTime();
                    if (oDate < eMinDate) { e_hm.value(eMinDate.toFormatString("hh:mm")); }
                    DrawHMLayer(e_layer, { ymdO: e_ymd, minDate: eMinDate, defaultHM: e_hm.value() });
                });
            }
            //
            var check = function () {
                if (o.Start) {
                    if (IsEmpty(s_ymd.value()) || s_ymd.value() == s_ymd.attr('placeholder')) { _.WarnControl.show(s_ymd, cfg.msg.dateMsg.ymdEmpty); return false; }
                    if (!s_ymd.value().toDate()) { _.WarnControl.show(s_ymd, cfg.msg.dateMsg.ymdIllegal); return false; }
                    if (IsEmpty(s_hm.value())) { _.WarnControl.show(s_hm, cfg.msg.dateMsg.hmEmpty); return false; }
                    //检查时间过期
                    var _nowMinDate = fixGTHMDate(new Date(), o.Start.Min, { isGTMin: o.IsGTMin ? o.IsGTMin : true });
                    if (([s_ymd.value(), s_hm.value()].join(" ") + ":00").toDateTime() < _nowMinDate.toFormatString('yyyy-MM-dd hh:mm:00').toDateTime()) {
                        _.WarnControl.show(s_ymd, cfg.msg.dateMsg.dateExpire.replace('${1}', _nowMinDate.toFormatString('yyyy-MM-dd hh:mm'))); return false;
                    }
                }

                if (o.End) {
                    if (IsEmpty(e_ymd.value()) || e_ymd.value() == e_ymd.attr('placeholder')) { _.WarnControl.show(e_ymd, cfg.msg.dateMsg.ymdEmpty); return false; }
                    if (!e_ymd.value().toDate()) { _.WarnControl.show(e_ymd, cfg.msg.dateMsg.ymdIllegal); return false; }
                    if (IsEmpty(e_hm.value())) { _.WarnControl.show(e_hm, cfg.msg.dateMsg.hmEmpty); return false; }
                    //
                    if (sObj.getDate() > eObj.getDate()) { _.WarnControl.show(e_hm, cfg.msg.dateMsg.dateOut); return false; }
                }
                return true;
            }
            //

            return {
                getSDate: function () {
                    return [s_ymd.value(), s_hm.value()].join(" ");
                },
                getEDate: function () {
                    return (o && o.End) ? [e_ymd.value(), e_hm.value()].join(" ") : "";
                },
                checkDate: check
            };
        }
        //
        function DrawHLayer(layer, options) {
            var hList = layer.find("a"); hList.removeClass("disabled selected");
            //
            if (options.ymdO.value() === options.minDate.toFormatString("yyyy-MM-dd")) {
                for (var i = 0; i < hList.length; i++) {
                    var tmp = $(hList[i]);
                    if (parseInt(tmp.attr('data-value')) < parseInt(options.minDate.toFormatString("hh"))) {
                        tmp.addClass("disabled");
                    } else { break; }
                }
            }
            //
            var checkH = function (layer, h) {
                layer.find('[mark="hour"]')[0] && (layer.find('[mark="hour"]')[0].scrollTop = parseInt(hList.first().offset().height) * (parseInt(h) - 2 < 0 ? 0 : parseInt(h) - 2));
                layer.find('[data-h=' + h + ']').addClass('selected');
            }
            var oDate = [options.ymdO.value(), [options.defaultH, "00"].join(":")].join(" ").toDateTime(), hArr = options.defaultH.split(":");
            if (hArr.length > 1 && oDate && oDate > options.minDate) {
                checkH(layer, hArr[0]);
            } else {
                checkH(layer, options.minDate.toFormatString("hh"));
            }
        }

        function InitYMDHDate(o) {
            var s_ymd = $el(o.Start.ymdObj), s_h = $el(o.Start.hObj), s_layer = $el(o.Start.layer), isGTHour = o.IsGTHour ? o.IsGTHour : true,
                now = new Date(), sMinDate, sMaxDate, sDefaultDate;
            var sObj = setYMDHMObj(s_ymd, s_h), startCalendar, endCalendar;
            //================================
            var e_ymd, e_h, e_layer, eObj, eMinDate, eMaxDate, eDefaultDate;
            //================================
            var innerFun = {
                layerInit: function (layer, ymd, h, minDate) {
                    layer.html($.tmpl.render(cfg.tmpl.hTmpl));
                    h.bind('click', function (e) {
                        $('.pop_star').css('visibility', 'hidden');
                        layer.css({ 'visibility': 'visible', 'left': h.offset().left + 'px', 'top': h.offset().bottom + 'px' });
                        e.stop();
                    });
                    //
                    var hList = layer.find("a");
                    hList.bind('click', function (e) {
                        if (!$(this).hasClass("disabled")) {
                            hList.removeClass("selected"); $(this).addClass("selected");
                            //
                            h.value($(this).attr("data-value")); layer.css('visibility', 'hidden');
                            //触发下更改
                            innerFun.sh_eh(ymd);
                        }
                        e.stop();
                    });
                    DrawHLayer(layer, { ymdO: ymd, minDate: minDate, defaultH: h.value() });
                },
                sInit: function (n, content, options) {
                    sMinDate = fixGTHMDate(n, content.Min, options);
                    sMaxDate = fixGTHMDate(n, content.Max, options);
                    sDefaultDate = fixGTHMDate(n, content.Default, options);
                },
                eInit: function (n, content, options) {
                    eMinDate = fixGTHMDate(n, content.Min, options);
                    eMaxDate = fixGTHMDate(n, content.Max, options);
                    eDefaultDate = fixGTHMDate(n, content.Default, options);
                },
                sh_eh: function (ymd) {
                    // if 存在e, s更改, s和e同一天
                    if (o && o.End && ymd.uid() == s_ymd.uid() && s_ymd.value() == e_ymd.value()) {
                        //重绘end结构
                        innerFun.eInit(sObj.getDate(), o.End, { isGTHour: isGTHour });
                        e_ymd.data('minDate', eMinDate); //更新e_ymd时间
                        if (sObj.getDate() > eObj.getDate()) {
                            eObj.setDate(eDefaultDate);
                        } else if (eMinDate > eObj.getDate()) {
                            eObj.setDate(eMinDate);
                        }
                        endCalendar.method("setWeek");
                        innerFun.layerInit(e_layer, e_ymd, e_h, eMinDate);
                    }
                }
            }
            //
            innerFun.sInit(now, o.Start, { isGTHour: isGTHour });
            //
            sObj.setDate(IsEmpty(s_ymd.value()) || s_ymd.value() == s_ymd.attr('placeholder') || IsEmpty(s_h.value()) ? sDefaultDate : [s_ymd.value(), [s_h.value(), "00"].join(":")].join(" ").toDateTime());
            startCalendar = createCalendar(s_ymd, { minDate: sMinDate, maxDate: sMaxDate, container: cQuery.container });
            startCalendar.method("setWeek");
            //End
            if (o && o.End) {
                e_ymd = $el(o.End.ymdObj), e_h = $el(o.End.hObj), e_layer = $el(o.End.layer);
                eObj = setYMDHMObj(e_ymd, e_h);
                innerFun.eInit(sObj.getDate(), o.End, { isGTHour: isGTHour });
                //
                eObj.setDate((IsEmpty(e_ymd.value()) || e_ymd.value() == e_ymd.attr('placeholder') || IsEmpty(e_h.value())) ? eDefaultDate : [e_ymd.value(), [e_h.value(), "00"].join(":")].join(" ").toDateTime());
                endCalendar = createCalendar(e_ymd, { reference: o.End.ymdObj, minDate: eMinDate, maxDate: eMaxDate });
                endCalendar.method("setWeek");
                innerFun.layerInit(e_layer, e_ymd, e_h, eMinDate);
            }
            //
            innerFun.layerInit(s_layer, s_ymd, s_h, sMinDate);
            //
            s_ymd.bind('change', function (e) {
                var oDate = [s_ymd.value(), [s_h.value(), "00"].join(":")].join(" ").toDateTime();
                if (oDate < sMinDate) { s_h.value(sMinDate.toFormatString("hh:00")); }
                DrawHLayer(s_layer, { ymdO: s_ymd, minDate: sMinDate, defaultH: s_h.value() });
                //End Date
                if (o && o.End) {
                    innerFun.eInit(sObj.getDate(), o.End, { isGTHour: isGTHour });
                    e_ymd.data('minDate', eMinDate); //更新e_ymd时间
                    if (sObj.getDate() > eObj.getDate()) {
                        eObj.setDate(eDefaultDate);
                    } else if (eMinDate > eObj.getDate()) {
                        eObj.setDate(eMinDate);
                    }
                    endCalendar.method("setWeek");
                    innerFun.layerInit(e_layer, e_ymd, e_h, eMinDate);
                }
            });
            if (e_ymd) {
                e_ymd.bind('change', function () {
                    var oDate = [e_ymd.value(), [e_h.value(), "00"].join(":")].join(" ").toDateTime();
                    if (oDate < eMinDate) { e_h.value(eMinDate.toFormatString("hh:00")); }
                    DrawHLayer(e_layer, { ymdO: e_ymd, minDate: eMinDate, defaultH: e_h.value() });
                });
            }
            //
            var check = function () {
                if (o.Start) {
                    if (IsEmpty(s_ymd.value()) || s_ymd.value() == s_ymd.attr('placeholder')) { _.WarnControl.show(s_ymd, cfg.msg.dateMsg.ymdEmpty); return false; }
                    if (!s_ymd.value().toDate()) { _.WarnControl.show(s_ymd, cfg.msg.dateMsg.ymdIllegal); return false; }
                    if (IsEmpty(s_h.value())) { _.WarnControl.show(s_h, cfg.msg.dateMsg.hmEmpty); return false; }
                    //时间过期 
                    var _nowMinDate = fixGTHMDate(new Date(), o.Start.Min, { isGTHour: o.IsGTHour ? o.IsGTHour : true });
                    if (([s_ymd.value(), s_h.value()].join(" ") + ":00").toDateTime() < _nowMinDate.toFormatString('yyyy-MM-dd hh:mm:00').toDateTime()) {
                        _.WarnControl.show(s_ymd, cfg.msg.dateMsg.dateExpire.replace('${1}', _nowMinDate.toFormatString('yyyy-MM-dd hh:00'))); return false;
                    }
                }
                if (o.End) {
                    if (IsEmpty(e_ymd.value()) || e_ymd.value() == e_ymd.attr('placeholder')) { _.WarnControl.show(e_ymd, cfg.msg.dateMsg.ymdEmpty); return false; }
                    if (!e_ymd.value().toDate()) { _.WarnControl.show(e_ymd, cfg.msg.dateMsg.ymdIllegal); return false; }
                    if (IsEmpty(e_h.value())) { _.WarnControl.show(e_h, cfg.msg.dateMsg.hmEmpty); return false; }
                    //
                    if (sObj.getDate() > eObj.getDate()) { _.WarnControl.show(e_h, cfg.msg.dateMsg.dateOut); return false; }
                }
                return true;
            }

            return {
                getSDate: function () {
                    return [s_ymd.value(), s_h.value()].join(" ");
                },
                getEDate: function () {
                    return (o && o.End) ? [e_ymd.value(), e_h.value()].join(" ") : "";
                },
                checkDate: check
            };
        }



        return {
            InitYMDHMDate: InitYMDHMDate,
            InitNormalDate: InitNormalDate,
            InitYMDHDate: InitYMDHDate
        }
    })();
    //================================= Date Control E =================================

    //================================= Tab Control S =================================
    _.TabControl = (function () {
        //
        function init(o) {
            var t = $el(o.tObj);
            return t ? t.regMod('tab', versions.tab, o.config ? o.config : {}) : "";
        }

        return {
            InitTab: init
        }
    })();
    //================================= Tab Control E =================================

    //================================= City Control S =================================
    _.CityControl = (function () {
        //
        var base = {
            defaultSuggestionInit: function (obj) {
                /**
                *  代码拷自addresss组件，实现tab切换，
                *  因为address组件只要用户配置了suggestionInit,  就不触发组件自己的suggestionInit，失去了tab切换功能
                */
                //must be opti
                var spans = obj.find('.ui-tab>a');
                var uls = obj.find('div.list');
                if (!spans.length) {
                    return;
                }
                var switchTab = function () {
                    var _this = this;
                    spans.each(function (span, i) {
                        if (span[0] == _this) {
                            span.addClass('current');
                            $(uls[i]).css('display', '').removeClass('ui-hide');
                        } else {
                            span.removeClass('current');
                            $(uls[i]).css('display', 'none').addClass('ui-hide');
                        }
                    });
                };
                spans.bind('mousedown', switchTab);
                switchTab.apply(spans[0]);
            },
            format: function (data) {
                var obj = {};
                for (var key in data) {
                    obj[key] = {};
                    if (key.search(/[A-Z]/i) != -1) {
                        for (var i = 0; i < data[key].length; i++) {
                            var groupBy = data[key][i]['group'].toUpperCase();
                            if (!obj[key][groupBy]) obj[key][groupBy] = [];
                            obj[key][groupBy].push(data[key][i]);
                        }
                    } else {
                        for (var i = 0; i < data[key].length; i++) {
                            if (!obj[key]['']) obj[key][''] = [];
                            obj[key][''].push(data[key][i]);
                        }
                    }
                }
                return obj;
            }
        };

        var c = {
            InitNormalCity: function (o) {
                if (!o) return;
                var cityTarget = $el(o.txtCity), hidCityTarget = $el(o.hidCity), citySource = o.source, msg = !o.msg ? "Error!" : o.msg;
                //
                var _cData = {
                    fill: function (o) {
                        if (!IsEmpty(o)) {
                            this.id = o.id; this.name = o.name;
                        } else {
                            this.id = this.name = "";
                        }
                    },
                    getData: function () {
                        return this.id ? { id: this.id, name: this.name} : null;
                    },
                    setData: function (o) {
                        if (!IsEmpty(o)) {
                            cityTarget.value(o.name); hidCityTarget.value(o.id);
                            _cData.fill(o);
                        } else {
                            cityTarget.value(""); hidCityTarget.value(""); _cData.fill(null);
                        }
                    }
                }
                //init
                !IsEmpty(cityTarget.value()) && cityTarget.value() != cityTarget.attr('placeholder') && !IsEmpty(hidCityTarget.value()) && _cData.fill({ id: hidCityTarget.value(), name: cityTarget.value() });

                var cityMod = cityTarget.regMod('address', versions.address, {
                    name: o.txtCity,
                    charset: 'utf-8',
                    delay: 200,
                    jsonpSource: citySource,
                    jsonpSourceInit: function (o) {
                        if (!o) return;
                        o.suggestion = base.format(o.suggestion);
                        return o;
                    },
                    template: {
                        suggestion: cfg.tmpl.n_CityTmpl,
                        suggestionInit: function (a) {
                            base.defaultSuggestionInit(a);
                        }
                    }
                });
                //
                cityMod.method('bind', 'change', function (event, args) {
                    cityTarget.value(args.value); hidCityTarget.value(args.items[2]);
                    var _od = { id: args.items[2], name: args.value }; _cData.fill(_od);
                    o.onchange && o.onchange(_od);
                    //
                    event.stop();
                });
                //
                var validate = function () {
                    if (IsEmpty(cityTarget.value().trim()) || cityTarget.value() == cityTarget.attr('placeholder')) {
                        _.WarnControl.show(cityTarget, msg);
                        return false;
                    }
                    return true;
                }

                return {
                    getData: function () { return _cData.getData(); },
                    validate: validate,
                    setData: function (o) { return _cData.setData(o); }
                }
            }

        }

        return {
            InitNormalCity: c.InitNormalCity
        }
    })();

    //================================= City Control E =================================

    //================================= Area Control S =================================
    _.AreaControl = (function () {
        //
        var Base = {
            FixNormalData: function (data) {
                return data.data;
            },
            FixSDData: function (data) {
                return data.data;
            },
            FixOSData: function (data) {
                return data.data;
            }
        }
        //
        var a = {
            InitAMapArea: function (o) {
                if (!o) return;
                //
                var aTarget = $el(o.txtArea),
                    layer = $el(o.layer),
                    latTarget = $el(o.latObj),
                    lonTarget = $el(o.lonObj),
                    cname = IsEmpty(o.cityName) ? "" : o.cityName,
                    msg = o.msg ? o.msg : "Error!";
                //
                var l = {
                    MSearch: null,
                    areaInfo: {},
                    setCity: function (name, pIndex) {
                        //
                        cname = name;
                        l.setAddress(null, "", "");
                        AMap && (AMap.service(["AMap.PlaceSearch"], function () {
                            l.MSearch = new AMap.PlaceSearch({ //构造地点查询类
                                pageSize: 7,
                                pageIndex: pIndex || 1,
                                city: name, //城市
                                extensions: 'all'
                            });
                        }));
                    },
                    setAddress: function (v, lat, lon) {
                        aTarget.value(IsEmpty(v) ? "" : v);
                        latTarget.value(IsEmpty(lat) ? "" : lat);
                        lonTarget.value(IsEmpty(lon) ? "" : lon);
                    },
                    setSearch: function (val) {
                        //
                        layer.css({
                            'visibility': 'visible',
                            'left': aTarget.offset().left + 'px',
                            'top': aTarget.offset().bottom + 'px'
                        });
                        //关键字查询
                        if (!IsEmpty(val)) {
                            l.MSearch.search(val, function (status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    layer.html($.tmpl.render(cfg.tmpl.amapAreaTmpl, l.fixData(result.poiList.pois)));
                                    layer.find('a._area').bind('click', function (e) {
                                        //
                                        l.areaInfo = $(this).attr('data-value');
                                        var _v = l.areaInfo.split('|');
                                        if (_v && _v.length > 5) {
                                            l.setAddress(_v[1], _v[3], _v[4]);
                                        }
                                        //
                                        $('.pop_star').css('visibility', 'hidden');
                                        e.stop();
                                    });
                                    //
                                }
                            });
                        }
                    },
                    fixData: function (val) {
                        var tmp = [];
                        for (var i = 0; i < val.length; i++) {
                            var _ = val[i];
                            tmp.push({
                                id: _.id,
                                cityname: _.cityname,
                                lat: _.location.lat,
                                lon: _.location.lng,
                                detailAddress: [_.cityname, _.adname, _.address].join(""),
                                pname: _.pname,
                                name: _.name
                            });
                        }
                        return tmp;
                    },
                    getAreaInfo: function () {
                        return l.areaInfo;
                    },
                    validateArea: function () {
                        if (IsEmpty(aTarget.value().trim()) || aTarget.value() == aTarget.attr('placeholder')) {
                            _.WarnControl.show(aTarget, msg);
                            return false;
                        }
                        return true;
                    }
                }
                //
                var iBack = {
                    setCity: l.setCity,
                    getAreaInfo: l.getAreaInfo,
                    validateArea: l.validateArea
                }
                //
                aTarget.bind('keyup', function (e) {
                    //上键
                    if (e.keyCode == 38) {

                        return;
                    }
                    //下键
                    if (e.keyCode == 40) {

                        return;
                    }
                    //回车
                    if (e.keyCode == 13) {

                        return;
                    }
                    //
                    if (keycodes.indexOf(e.keyCode) == -1) {
                        l.setSearch(aTarget.value());
                        //

                    }
                    e.stop();
                }).bind('blur', function (e) {
                    alert('blur');
                });
                //
                l.setCity(cname);


                return iBack;
            },
            InitNormalArea: function (o) {
                if (!o) return;
                var aTarget = $el(o.txtArea),
                    layer = $el(o.layer),
                    cname = IsEmpty(o.cityName) ? "" : o.cityName,
                    firstEle = { text: '', value: '' },
                    source = o.source ? o.source : "",
                    msg = o.msg ? o.msg : "Error!";
                //
                var defaultSuggestionInit = function (obj) {
                    /**
                    *  代码拷自addresss组件，实现tab切换，
                    *  因为address组件只要用户配置了suggestionInit,  就不触发组件自己的suggestionInit，失去了tab切换功能
                    */
                    //must be opti
                    var spans = obj.find('.ui-tab>a');
                    var uls = obj.find('div.list');
                    if (!spans.length) {
                        return;
                    }
                    var switchTab = function () {
                        var _this = this;
                        //
                        obj.find('.expand').removeClass("expand");
                        //
                        spans.each(function (span, i) {
                            if (span[0] == _this) {
                                span.addClass('current');
                                $(uls[i]).css('display', '').removeClass('ui-hide');
                            } else {
                                span.removeClass('current');
                                $(uls[i]).css('display', 'none').addClass('ui-hide');
                            }
                        });
                    };
                    spans.bind('mousedown', switchTab);
                    switchTab.apply(spans[0]);
                    //
                    var _ga = obj.find('.subgroup a[gtr="base"]'), _slist = obj.find('.sublist'), _stitle = _slist.find('.sublist-title');
                    _ga.bind('mousedown', function () {
                        _slist.css('display', 'none');
                        obj.find('.sublist[sid=' + $(this).attr('gid') + ']').css('display', '');
                        $(this).parentNode().parentNode().parentNode().addClass('expand');
                    });
                    _stitle.bind('mousedown', function () {
                        $(this).parentNode().parentNode().removeClass('expand');
                    });
                };
                //init data
                if (!$.isEmptyObject(o.initdata)) {
                    aTarget.value(o.initdata.value); aTarget.attr('data-val', o.initdata.data);
                    firstEle.text = o.initdata.value; firstEle.value = o.initdata.data;
                }
                //
                window.Car_GaoDeJsonpCallBack = function (data) {
                    var key = $(document.activeElement).value() || '';
                    key = key.trim().replace(/[\|@\u2006]/g, '').replace(/[\|@]/g, '');
                    var result = { key: key, data: '' };

                    var pois = data.pois, i, l, poi;

                    if (pois && pois.length > 0) {
                        for (i = 0, l = pois.length; i < l; i++) {
                            poi = pois[i];
                            poi.address = poi.pname + (poi.pname == poi.cityname ? '' : poi.cityname) + (poi.adname == poi.address ? '' : poi.adname) + poi.address;
                            result.data += '@as|' + poi.name.replace(/\|/g, '&csg;') + '|' + poi.location + '|' + poi.cityname + '|' + poi.address;
                        }
                    }
                    cQuery.jsonpResponse = result;
                }
                //
                var opt = {
                    key: '0e9680eed7f5ffc60a7b02167d0182a3',
                    pagesize: 49,
                    page: 1,
                    extensions: 'all'
                }
                function getJsonpFilter(city) {
                    return ['http://restapi.amap.com/v3/place/text?keywords=${encodeURI(unescape(decodeURIComponent(key)))}',
                    '&key=', opt.key,
                    '&city=', window.encodeURI(city),
                    '&types=',
                    '&offset=', opt.pagesize,
                    '&page=', opt.page,
                    '&extensions=', opt.extensions,
                    '&s=rsv3',
                    '&callback=Car_GaoDeJsonpCallBack'].join('');
                };
                //
                function setFirstEle(o) {
                    if (o && (o.text || o.value)) {
                        firstEle.text = o.text; firstEle.value = o.value;
                        aTarget.value(o.text); aTarget.attr('data-val', o.value);
                    } else {
                        firstEle.text = firstEle.value = "";
                        aTarget.value(""); aTarget.attr('data-val', "");
                    }
                }
                //
                var CarAddressHelp = {
                    format: function (e) {
                        var t = {};
                        for (var i in e) {
                            t[i] = {};
                            if (i.search(/[A-Z]/i) != -1) {
                                for (var n = 0; n < e[i].length; n++) {
                                    if (t[i][e[i][n]["group"]]) {
                                        t[i][e[i][n]["group"]].push(e[i][n])
                                    } else {
                                        t[i][e[i][n]["group"]] = [];
                                        t[i][e[i][n]["group"]].push(e[i][n])
                                    }
                                }
                            } else {
                                for (var n = 0; n < e[i].length; n++) {
                                    if (t[i][""]) {
                                        t[i][""].push(e[i][n])
                                    } else {
                                        t[i][""] = [];
                                        t[i][""].push(e[i][n])
                                    }
                                }
                            }
                        }
                        return t
                    },
                    highlight: function (e, t) {
                        var i = ["\\", "^", "$", ".", "*", "+", "=", ":", "|", "/", "(", ")", "[", "]", "{", "}"];
                        for (var n = 0; n < i.length; n++) {
                            t = t.replace(i[n], "\\" + i[n])
                        }
                        var a = new RegExp(t, "i");
                        return e.replace(a, "<b>$&</b>")
                    }
                };

                var AreaMod = aTarget.regMod('address', versions.address, {
                    name: o.txtArea,
                    jsonpSource: source,
                    jsonpFilter: getJsonpFilter(cname),
                    isAutoCorrect: false,
                    delay: 200,
                    template: {
                        suggestion: o.filterOnly ? '' : cfg.tmpl.nAreaSuggestionTmpl,
                        filter: cfg.tmpl.nAreaFilterTmpl,
                        filterPageSize: 7,
                        filterInit: function (e) {
                            firstEle = { text: aTarget.value(), value: '' }; aTarget.attr('data-val', '');
                            var fObj = e.find('.list a:eq(0)');
                            if (fObj.length > 0) {
                                firstEle.value = fObj.attr('data');
                                firstEle.text = firstEle.value.split('|')[1].replace(/&csg;/g, "|");
                            }
                        },
                        suggestionInit: function (a) {
                            defaultSuggestionInit(a);
                        }
                    },
                    message: {
                        //filterResult: '${$data.val}，若需缩小范围，请输入更多条件。',
                        //noFilterResult: '对不起，找不到：${val}',
                        filterResult: label.UIC_SearchFilterTitle,
                        noFilterResult: label.UIC_SearchFilterNoResult,
                        Help: CarAddressHelp
                    }
                });
                //
                AreaMod.method('bind', 'userinput', function (a, b, c, d) {
                    if (b.eventType && !aTarget.attr('data-val') && firstEle.value) {
                        aTarget.value(firstEle.text); aTarget.attr('data-val', firstEle.value);
                        var val = firstEle.value.split('|'), loc = val[2].split('|');
                    }
                });
                AreaMod.method('bind', 'change', function (a, b) {
                    var val = b.data.split('|'), loc = val[2].split('|'), _txt = val[1].replace(/&csg;/g, "|");
                    aTarget.value(_txt); aTarget.attr('data-val', b.data);
                    //
                    firstEle.text = _txt; firstEle.value = b.data;
                    this.blur();
                });

                return {
                    clearAutoCache: function () {
                        firstEle = { text: '', value: '' };
                    },
                    setCity: function (o) {
                        if (o.cityname != cname) {
                            aTarget.value("");
                            setFirstEle({ text: '', value: '' });
                        }
                        o.source && AreaMod.set('jsonpSource', o.source);
                        o.cityname && AreaMod.set('jsonpFilter', getJsonpFilter(o.cityname));
                        cname = o.cityname;
                    },
                    getData: function () { return firstEle },
                    setData: function (o) { setFirstEle(o); },
                    validate: function () {
                        if (IsEmpty(aTarget.value().trim()) || aTarget.value() == aTarget.attr('placeholder')) {
                            _.WarnControl.show(aTarget, msg);
                            return false;
                        }
                        return true;
                    }
                };

            },
            InitCHArea: function (o) {
                if (!o) return;
                var aTarget = $el(o.txtArea), jsource = o.suggestionSource, jfilter = o.filterSource, msg = o.msg ? o.msg : "Error!";
                //
                var defaultSuggestionInit = function (obj) {
                    /**
                    *  代码拷自addresss组件，实现tab切换，
                    *  因为address组件只要用户配置了suggestionInit,  就不触发组件自己的suggestionInit，失去了tab切换功能
                    */
                    //must be opti
                    var spans = obj.find('.ui-tab>a');
                    var uls = obj.find('div.list');
                    if (!spans.length) {
                        return;
                    }
                    var switchTab = function () {
                        var _this = this;
                        //
                        obj.find('.expand').removeClass("expand");
                        //
                        spans.each(function (span, i) {
                            if (span[0] == _this) {
                                span.addClass('current');
                                $(uls[i]).css('display', '').removeClass('ui-hide');
                            } else {
                                span.removeClass('current');
                                $(uls[i]).css('display', 'none').addClass('ui-hide');
                            }
                        });
                    };
                    spans.bind('mousedown', switchTab);
                    switchTab.apply(spans[0]);
                    //
                    var _ga = obj.find('.subgroup a[gtr="base"]'), _slist = obj.find('.sublist'), _stitle = _slist.find('.sublist-title');
                    _ga.bind('mousedown', function () {
                        _slist.css('display', 'none');
                        obj.find('.sublist[sid=' + $(this).attr('gid') + ']').css('display', '');
                        $(this).parentNode().parentNode().parentNode().parentNode().addClass('expand');
                    });
                    _stitle.bind('mousedown', function (e) {
                        $(this).parentNode().parentNode().removeClass('expand');
                    });
                };
                //
                var _cData = {
                    fill: function (o) {
                        if (!IsEmpty(o)) {
                            this.text = o.text; this.value = o.value;
                        } else {
                            this.text = this.value = "";
                        }
                    },
                    getData: function () {
                        return this.value ? { text: this.text, value: this.value} : null;
                    }
                }
                //init
                if (!$.isEmptyObject(o.initdata)) {
                    _cData.fill(o.initdata);
                    aTarget.value(o.initdata.text); aTarget.attr('data-val', o.initdata.value);
                }
                //
                var AreaMod = aTarget.regMod('address', versions.address, {
                    name: o.txtArea,
                    isAutoCorrect: false,
                    delay: 200,
                    jsonpSource: jsource,
                    jsonpFilter: jfilter,
                    sort: ['^0$', '^1$', '0+'],
                    jsonpFilterInit: function (o) {
                        if (!o) return;
                        var list = o.data.split('@');
                        o.data = { list: list, split: function () { return list } };
                        return o;
                    },
                    template: {
                        suggestion: cfg.tmpl.chAreaSuggestionTmpl,
                        filter: cfg.tmpl.chAreaFilterTmpl,
                        filterPageSize: 7,
                        filterInit: function (e) {
                            _cData.fill(null); aTarget.attr('data-val', "");
                            var fObj = e.find('.list a:eq(0)');
                            if (fObj.length > 0) {
                                _cData.fill({
                                    value: fObj.attr('data'),
                                    text: fObj.attr('data').split('|')[1].replace(/&csg;/g, "|")
                                });
                            }
                        },
                        suggestionInit: function (a) {
                            defaultSuggestionInit(a);
                        }
                    },
                    message: {
                        type: o.type ? o.type : ""
                    }
                });
                //
                AreaMod.method('bind', 'userinput', function (a, b, c, d) {
                    if (b.eventType && !aTarget.attr('data-val') && _cData.getData()) {
                        //默认选中
                        aTarget.value(_cData.getData().text); aTarget.attr('data-val', _cData.getData().value);
                        o.onchange && o.onchange(_cData.getData());
                    }
                });
                AreaMod.method('bind', 'change', function (a, b) {
                    _cData.fill({ text: b.value, value: b.data });
                    aTarget.value(b.value); aTarget.attr('data-val', b.data);
                    o.onchange && o.onchange(_cData.getData());
                    this.blur();
                });
                //
                return {
                    getData: function () { return _cData.getData(); },
                    setData: function (o) { _cData.fill(o); },
                    validate: function () {
                        if (IsEmpty(aTarget.value().trim()) || aTarget.value() == aTarget.attr('placeholder')) {
                            _.WarnControl.show(aTarget, msg);
                            return false;
                        }
                        return true;
                    }
                }
            },
            InitOSArea: function (o) {
                if (!o) return;
                //
                var aTarget = $el(o.txtArea), jsource = o.suggestionSource, jfilter = o.filterSource, eMsg = o.emptyMsg ? o.emptyMsg : label.UIC_CanNotEmpty;
                //
                var defaultSuggestionInit = function (obj) {
                    var spans = obj.find('.ui-tab>a');
                    var uls = obj.find('div.list');
                    if (!spans.length) {
                        return;
                    }
                    var switchTab = function () {
                        var _this = this;
                        //
                        obj.find('.expand').removeClass("expand");
                        //
                        spans.each(function (span, i) {
                            if (span[0] == _this) {
                                span.addClass('current');
                                $(uls[i]).css('display', '').removeClass('ui-hide');
                            } else {
                                span.removeClass('current');
                                $(uls[i]).css('display', 'none').addClass('ui-hide');
                            }
                        });
                    };
                    spans.bind('mousedown', switchTab);
                    switchTab.apply(spans[0]);
                    //
                    var _ga = obj.find('.subgroup a[gtr="base"]'), _slist = obj.find('.sublist'), _stitle = _slist.find('.sublist-title');
                    _ga.bind('mousedown', function () {
                        _slist.css('display', 'none');
                        obj.find('.sublist[sid=' + $(this).attr('gid') + ']').css('display', '');
                        $(this).parentNode().parentNode().parentNode().addClass('expand');
                    });
                    _stitle.bind('mousedown', function () {
                        $(this).parentNode().parentNode().removeClass('expand');
                    });
                }
                //
                var _cData = {
                    fill: function (o) {
                        if (!IsEmpty(o)) {
                            this.text = o.text; this.value = o.value;
                        } else {
                            this.text = this.value = "";
                        }
                    },
                    getData: function () {
                        return this.value ? { text: this.text, value: this.value} : null;
                    }
                }
                //
                var AreaMod = aTarget.regMod('address', versions.address, {
                    name: o.txtArea,
                    isAutoCorrect: false,
                    delay: 200,
                    jsonpSource: jsource,
                    jsonpFilter: jfilter,
                    sort: ['^0$', '^1$', '0+'],
                    jsonpFilterInit: function (o) {
                        if (!o) return;
                        var list = o.data.split('@');
                        o.data = { list: list, split: function () { return list } };
                        return o;
                    },
                    template: {
                        suggestion: cfg.tmpl.osAreaSuggestionTmpl,
                        filter: cfg.tmpl.osAreaFilterTmpl,
                        filterPageSize: 7,
                        filterInit: function (e) {
                            _cData.fill(null); aTarget.attr('data-val', "");
                            var fObj = e.find('.list a:eq(0)');
                            if (fObj.length > 0) {
                                _cData.fill({
                                    value: fObj.attr('data'),
                                    text: fObj.attr('data').split('|')[1].replace(/&csg;/g, "|")
                                });
                            }
                        },
                        suggestionInit: function (a) {
                            defaultSuggestionInit(a);
                        }
                    }
                });
                AreaMod.method('bind', 'userinput', function (a, b, c, d) {
                    if (b.eventType && !aTarget.attr('data-val') && _cData.getData()) {
                        //默认选中
                        aTarget.value(_cData.getData().text); aTarget.attr('data-val', _cData.getData().value);
                        o.onchange && o.onchange(_cData.getData());
                    }
                });
                AreaMod.method('bind', 'change', function (a, b) {
                    _cData.fill({ text: b.value, value: b.data });
                    aTarget.value(b.value); aTarget.attr('data-val', b.data);
                    o.onchange && o.onchange(_cData.getData());
                    this.blur();
                });

                return {
                    getData: function () { return _cData.getData(); },
                    setData: function (o) { _cData.fill(o); },
                    validate: function () {
                        if (IsEmpty(aTarget.value().trim()) || aTarget.value() == aTarget.attr('placeholder')) {
                            _.WarnControl.show(aTarget, eMsg);
                            return false;
                        }
                        return true;
                    }
                }
            },
            InitOCHArea: function (o) {
                if (!o) return;
                //
                var aTarget = $el(o.txtArea), jsource = o.suggestionSource, jfilter = o.filterSource, eMsg = o.emptyMsg ? o.emptyMsg : label.UIC_CanNotEmpty,
                    myHtl = $el(o.myHtlObj), myHtlSource = o.myHtlSource, layer = $el(o.htlLayer);
                //
                var tmpMyHtlSource = "";
                //
                var _cData = {
                    fill: function (o) {
                        if (!IsEmpty(o)) {
                            this.text = o.text; this.value = o.value;
                        } else {
                            this.text = this.value = "";
                        }
                    },
                    getData: function () {
                        return this.value ? { text: this.text, value: this.value} : null;
                    }
                }
                var htlL = {
                    htlOrderInfo: [],
                    init: function (layer, data, flt) {
                        htlL.htlOrderInfo = data;
                        layer.html($.tmpl.render(cfg.tmpl.ochHtlLayerTmpl, htlL.htlOrderInfo)).mask();
                        //Ev Click
                        layer.find('.tck-close').bind('click', function () { layer.unmask(); });
                        layer.find('.mf-tbd>li').bind('click', function (e) {
                            var d = $(this).attr('dval');
                            _cData.fill({ text: d.split('|')[1], value: d });
                            aTarget.value(d.split('|')[1]); aTarget.attr('data-val', d);
                            o.onchange && o.onchange(_cData.getData());
                            layer.unmask();
                        });
                    }
                }
                //
                var AreaMod = aTarget.regMod('address', versions.address, {
                    name: o.txtArea,
                    isAutoCorrect: false,
                    delay: 200,
                    jsonpSource: jsource,
                    jsonpFilter: jfilter,
                    sort: ['^0$', '^1$', '0+'],
                    jsonpFilterInit: function (o) {
                        if (!o) return;
                        var list = o.data.split('@');
                        o.data = { list: list, split: function () { return list } };
                        return o;
                    },
                    template: {
                        suggestion: '',
                        filter: cfg.tmpl.ochAreaFilterTmpl,
                        filterPageSize: 7,
                        filterInit: function (e) {
                            _cData.fill(null); aTarget.attr('data-val', "");
                            var fObj = e.find('.ad-content a:eq(0)');
                            if (fObj.length > 0) {
                                _cData.fill({
                                    value: fObj.attr('data'),
                                    text: fObj.attr('data').split('|')[1].replace(/&csg;/g, "|")
                                })
                            }
                        },
                        suggestionInit: function (a) {
                        }
                    }
                });
                //
                AreaMod.method('bind', 'userinput', function (a, b, c, d) {
                    if (b.eventType && !aTarget.attr('data-val') && _cData.getData()) {
                        //默认选中
                        aTarget.value(_cData.getData().text); aTarget.attr('data-val', _cData.getData().value);
                        o.onchange && o.onchange(_cData.getData());
                    }
                });
                AreaMod.method('bind', 'change', function (a, b) {
                    _cData.fill({ text: b.value, value: b.data });
                    aTarget.value(b.value); aTarget.attr('data-val', b.data);
                    o.onchange && o.onchange(_cData.getData());
                    this.blur();
                });
                //
                function resetSource(o) {
                    if (o) {
                        AreaMod.set('jsonpFilter', jfilter && jfilter.replace("{cid}", o.id));
                        tmpMyHtlSource = myHtlSource.replace("{cid}", o.id);
                    }
                }
                //validate
                function validate() {
                    if (IsEmpty(aTarget.value().trim()) || aTarget.value() == aTarget.attr('placeholder')) {
                        _.WarnControl.show(aTarget, eMsg);
                        return false;
                    }
                    return true;
                }
                //
                myHtl.bind('click', function (e) {
                    _loading.mask();
                    $.ajax(tmpMyHtlSource, {
                        method: 'GET',
                        context: "",
                        onsuccess: function (ret) {
                            _loading.unmask();
                            htlL.init(layer, $.parseJSON(ret.responseText), aTarget);
                        },
                        onerror: function () {
                            _loading.unmask();
                            console.log('error: ' + o.myHtlObj);
                        }
                    })
                });

                return {
                    setData: function (o) {
                        _cData.fill(o);
                    },
                    getData: function () {
                        return _cData.getData();
                    },
                    setCity: function (o) {
                        resetSource(o);
                    },
                    validate: validate
                }
            }
        }

        return {
            Base: Base,
            InitNormalArea: a.InitNormalArea,
            InitCHArea: a.InitCHArea,
            InitOSArea: a.InitOSArea,
            InitOCHArea: a.InitOCHArea
        };
    })();

    //================================= Area Control E =================================

    //================================= PageFoot Control S =================================
    _.PageFoot = (function () {
        //
        var c = {
            options: {
                min: 1,
                max: 10,
                step: 5,
                current: 1,
                prevText: '&lt',
                nextText: label.UIC_NextPage,
                splitText: "...",
                goto: true,
                showText: false
            }
        }
        //
        function InitPageFoot(o) {
            if (!o) return;
            var fobj = $el(o.obj);
            c.options.max = o.maxPage;

            var footMod = fobj.regMod('page', '1.2', {
                options: c.options,
                methods: {},
                listeners: o.listeners,
                template: {
                    pageList: '<div ${className}>${page}</div>',
                    page: '<a ${className} href="javascript:void(0);">${pageNo}</a>',
                    total: '<span ${className}>${pageInfo}</span>',
                    split: '<span ${className}>${splitText}</span>',
                    goto: '<div class="c_pagevalue">' + label.UIC_To + ' <input type="text" class="c_page_num" name="" /> ' + label.UIC_Page + '<input type="button" class="c_page_submit" value="' + label.UIC_Confirm + '" name="" /></div>',
                    prev: '<a ${className} href="javascript:void(0);">${pageNo}</a>',
                    next: '<a ${className} href="javascript:void(0);">${pageNo}</a>'
                },
                classNames: {
                    prev: 'c_up',
                    next: 'c_down',
                    prev_no: 'c_up_nocurrent',
                    next_no: 'c_down_nocurrent',
                    list: 'c_page_list layoutfix',
                    action: 'select',
                    disabled: 'disabled',
                    split: 'c_page_ellipsis',
                    total: 'page_total',
                    current: 'current'
                }
            });
            return footMod;
        }
        return {
            InitPageFoot: InitPageFoot
        }
    })();
    //================================= PageFoot Control E =================================

    //================================= Flight Control S =================================
    _.FlightControl = (function () {
        //
        var InitParam = function (o) {
            //new init Obj
            this.fltObj = o.fltObj; this.myFltObj = o.myFltObj;
            this.fltLayer = o.fltLayer; this.validateMsgObj = o.validateMsgObj;
            this.type = o.type;
            this.errorType = o.errorType; this.onvalidate = o.onvalidate;
            //
            $el(o.validateMsgObj).bind('click', function (e) {
                var t = e.target;
                if (t && t.nodeType == 1 && t.nodeName == "A") {
                    switch ($(t).attr('_type')) {
                        case "goAirport":
                            o.goAirportEv && o.goAirportEv();
                            break;
                        case "goOversea":
                            o.goOverseaEv && o.goOverseaEv();
                            break;
                        case "goDomestic":
                            o.goDomesticEv && o.goDomesticEv();
                            break;
                        default:
                            console.log("type error");
                            break;
                    }
                }
            });

            return this;
        }
        //inner comm fun
        var ErrMsg = {
            '0': {
                '1': '<div class="help_block help_text">' + label.UIC_FltErrMsg1 + '</div>',
                '2': '<div class="help_block help_text help_warning">' + label.UIC_FltErrMsg2 + '</div>',
                '3': '<div class="help_block help_text help_warning">' + label.UIC_FltErrMsg3 + '</div>',
                '4': '<div class="help_block help_text help_warning">' + label.UIC_FltErrMsg4_1 + '</div>',
                '5': '<div class="help_block help_text help_warning">' + label.UIC_FltErrMsg5 + '</div>',
                '6': '<div class="help_block help_text">' + label.UIC_FltErrMsg6 + '</div>'
            },
            '1': {
                '1': '<div class="msg"><i class="xuico-succes-sm"></i>' + label.UIC_FltErrMsg1 + '</div>',
                '2': '<div class="msg msg-error"><i class="xuico-error-sm"></i>' + label.UIC_FltErrMsg2 + '</div>',
                '3': '<div class="msg msg-error"><i class="xuico-error-sm"></i>' + label.UIC_FltErrMsg3 + '</div>',
                '4': '<div class="msg msg-error"><i class="xuico-error-sm"></i>' + label.UIC_FltErrMsg4_2 + '</div>',
                '5': '<div class="msg msg-error"><i class="xuico-error-sm"></i>' + label.UIC_FltErrMsg5 + '</div>',
                '6': '<div class="msg"><i class="xuico-succes-sm"></i>' + label.UIC_FltErrMsg6 + '</div>'
            }
        }
        var LoadingMsg = {
            '0': '<div class="help_block help_text">' + label.UIC_FltSearch + '</div>',
            '1': '<div class="msg"><i class="xuico-tip-sm"></i>' + label.UIC_FltSearch + '</div>'
        }
        var NoResultMsg = {
            '0': '<div class="help_block help_text">' + label.UIC_FltNoResult + '</div>',
            '1': '<div class="msg msg-error"><i class="xuico-error-sm"></i>' + label.UIC_FltNoResult + '</div>'
        }
        //
        var fltL = {
            init: function (baseParam, data) {
                var layer = $el(baseParam.fltLayer), flt = $el(baseParam.fltObj);
                layer.data('dInfo', data);
                layer.html($.tmpl.render(cfg.tmpl.fltLayerTmpl, data)).mask();
                //Ev Click
                layer.find('.tck-close').bind('click', function () { layer.unmask(); });
                layer.find('.mf-tbd>li').bind('click', function (e) {
                    var d = layer.data('dInfo')[$(this).attr('index')];
                    flt.value(d.FlightNumber); flt.attr('data-val', d.FlightNumber);
                    innerObj.Msg.set([d], baseParam);
                    layer.unmask();
                });
            }
        };
        var innerObj = {
            Msg: {
                ErrInfo: null,
                set: function (data, baseParam) {
                    var _ErrorInfo = baseParam.errorType ? ErrMsg[baseParam.errorType] : ErrMsg[0], msgObj = $el(baseParam.validateMsgObj);
                    //判断
                    if (0 == data.length) {
                        msgObj.html(_ErrorInfo['2']);
                        //baseParam.onvalidate && baseParam.onvalidate(data);
                        msgObj.data('ValiResult', false);
                    } else if (1 == data.length) {
                        if (innerObj.Msg.msgResult(data[0], baseParam)) {
                            baseParam.onvalidate && baseParam.onvalidate(data[0]);
                        }
                    } else if (data.length > 1) {
                        fltL.init(baseParam, data);
                    }
                },
                msgResult: function (data, baseParam) {
                    var r = false, _ErrorInfo = baseParam.errorType ? ErrMsg[baseParam.errorType] : ErrMsg[0], msgObj = $el(baseParam.validateMsgObj);
                    //航班抵达时间
                    //国内接机: 当前时间+1h10min向上取整到10分
                    //国际接机: 当前时间+3d+10min向上取整到10分钟
                    var _fDate = (data.PlanDateTime + ":00").toDateTime(),
                        _tmpDate = (baseParam.type == "jnt") ? new Date().toFormatString('yyyy-MM-dd hh:mm:00').toDateTime().addHours(1).addMinutes(10) : new Date().toFormatString('yyyy-MM-dd hh:mm:00').toDateTime().addDays(3).addMinutes(10),
                        _min = _tmpDate.getMinutes();
                    var _nDate = (_min && (_min % 10 > 0)) ? _tmpDate.addMinutes(10 - _min % 10) : _tmpDate;

                    if (!data.Accord) {
                        switch (baseParam.type) {
                            case "jnt":
                                msgObj.html(_ErrorInfo['4'].replace('${1}', data.ArrivalAirport.Location.LocationName).replace('${2}', label.UIC_Tab_ojnt).replace('${3}', "goOversea"));
                                break;
                            case "ojnt":
                                msgObj.html(_ErrorInfo['4'].replace('${1}', data.ArrivalAirport.Location.LocationName).replace('${2}', label.UIC_Tab_jnt).replace('${3}', "goDomestic"));
                                break;
                            case "osnd":
                                msgObj.html(_ErrorInfo['4'].replace('${1}', data.ArrivalAirport.Location.LocationName).replace('${2}', label.UIC_Tab_snd));
                                break;
                            default:
                                msgObj.html(_ErrorInfo['4'].replace('${1}', data.ArrivalAirport.Location.LocationName).replace('${2}', label.UIC_Tab_ojnt).replace('${3}', "goOversea"));
                                break;
                        }
                        msgObj.data('ValiResult', false);
                    } else if (!data.IsService) {
                        msgObj.html(_ErrorInfo['5'].replace('${1}', data.ArrivalAirport.Location.LocationName));
                        msgObj.data('ValiResult', false);
                    } else if (_fDate < _nDate) {
                        msgObj.html(_ErrorInfo['3']);
                        msgObj.data('ValiResult', false);
                    } else {
                        switch (baseParam.type) {
                            case "osnd":
                                msgObj.html(_ErrorInfo['6'].replace('${1}', data.PlanDateTime).replace('${2}', data.DepartAirport.Location.LocationName));
                                break;
                            default:
                                msgObj.html(_ErrorInfo['1'].replace('${1}', data.PlanDateTime).replace('${2}', data.ArrivalAirport.Location.LocationName));
                                break;
                        }
                        r = true; msgObj.data('ValiResult', true);
                    }
                    return r;
                }
            }
        };
        //
        function InitFlightNO(o) {
            if (!o) return;
            //..
            var flt = $el(o.baseParam.fltObj), myflt = $el(o.baseParam.myFltObj), jsource = o.suggestionSource, jfilter = o.filterSource,
                myfltSource = o.myFltSource, layer = $el(o.baseParam.fltLayer), msgObj = $el(o.baseParam.validateMsgObj);
            //
            var chsFltNOInfo = null;
            //valiResult
            msgObj.data('ValiResult', false);
            //
            if (!$.isEmptyObject(o.initdata)) {
                chsFltNOInfo = o.initdata;
                var dArr = o.initdata.split('|');
                flt.value(dArr[0]); flt.attr('data-val', o.initdata);
                //
                msgObj.data('ValiResult', true);
            }
            //
            var fltObj = flt.regMod('address', versions.address, {
                name: o.baseParam.fltObj,
                isAutoCorrect: false,
                delay: 200,
                jsonpSource: jsource,
                jsonpFilter: jfilter,
                sort: ['^0$', '^1$', '0+'],
                jsonpFilterInit: function (o) {
                    if (!o) return;
                    var list = o.data.split('@');
                    o.data = { list: list, split: function () { return list } };
                    return o;
                },
                template: {
                    suggestion: "",
                    filter: cfg.tmpl.fltFilterTmpl,
                    filterPageSize: 7,
                    filterInit: function (e) {
                        flt.attr('data-val', "");
                    },
                    suggestionInit: function (a) {
                    }
                },
                message: {
                }
            });
            fltObj.method('bind', 'userinput', function (a, b, c, d) {
                if (b.eventType && !flt.attr('data-val')) {
                    o.onchange && o.onchange(flt.value());
                }
            });
            fltObj.method('bind', 'change', function (a, b) {
                flt.value(b.data); flt.attr('data-val', b.data);
                o.onchange && o.onchange(flt.value());
                this.blur();
            });

            myflt.bind('click', function () {
                _loading.mask();
                $.ajax(myfltSource, {
                    method: 'POST',
                    context: "",
                    onsuccess: function (ret) {
                        _loading.unmask();
                        fltL.init(o.baseParam, $.parseJSON(ret.responseText));
                    },
                    onerror: function () {
                        _loading.unmask();
                        console.log('error: ' + o.baseParam.myFltObj);
                    }
                })
            });
            //
            function validate() {
                if (IsEmpty(flt.value()) || flt.value() == flt.attr('placeholder')) {
                    _.WarnControl.show(flt, cfg.msg.fltMsg.fltnoEmpty);
                    return false;
                }
                //
                if (!msgObj.data('ValiResult')) {
                    return false;
                }

                return true;
            }

            return {
                validate: validate,
                setData: function (d) {
                    chsFltNOInfo = d;
                },
                getData: function () {
                    return chsFltNOInfo;
                },
                clearData: function () {
                    chsFltNOInfo = null;
                }
            }
        }
        //
        function ValidateFlightNO(o) {
            if (!o) return;
            var flt = $el(o.baseParam.fltObj), msgObj = $el(o.baseParam.validateMsgObj), vSource = o.validateSource, _lastVal = "";
            var lMsg = o.baseParam.errorType ? LoadingMsg[o.baseParam.errorType] : LoadingMsg[0];
            var nMsg = o.baseParam.errorType ? NoResultMsg[o.baseParam.errorType] : NoResultMsg[0];
            //
            var _ValiObj = null;
            //
            var DoVali = function (d) {
                if (d && !$.isEmptyObject(d) && !IsEmpty(d.flightNumber)) {
                    msgObj.html(lMsg);
                    _ValiObj && _ValiObj.abort && _ValiObj.abort();
                    _ValiObj = $.ajax(vSource, {
                        method: 'POST',
                        context: d,
                        onsuccess: function (ret) {
                            innerObj.Msg.set($.parseJSON(ret.responseText), o.baseParam);
                        },
                        onerror: function () {
                            //msgObj.html(nMsg)
                        }
                    });
                    /*
                    if (_lastVal != flt.value()) {
                    //相同不请求
                    _lastVal = flt.value(); msgObj.html(lMsg);
                    //
                    _ValiObj && _ValiObj.abort && _ValiObj.abort();
                    _ValiObj = $.ajax(vSource, {
                    method: 'POST',
                    context: d,
                    onsuccess: function (ret) {
                    innerObj.Msg.set($.parseJSON(ret.responseText), o.baseParam);
                    },
                    onerror: function () {
                    //msgObj.html(nMsg)
                    }
                    });
                    }
                    */
                } else {
                    msgObj.html("");
                }
            }

            return {
                DoVali: DoVali
            }
        }

        return {
            InitParam: InitParam,
            InitFlightNO: InitFlightNO,
            ValidateFlightNO: ValidateFlightNO
        }
    })();
    //================================= Flight Control E =================================

    //================================= Person Control S =================================
    _.PersonControl = (function () {
        function InitPerson(o) {
            if (!o) return;
            var pObj = $el(o.pObj), layer = $el(o.pLayer);
            //
            layer.html($.tmpl.render(cfg.tmpl.personTmpl, {}));
            var adultDiv = layer.find('[mark="adult"]'), childDiv = layer.find('[mark="child"]'), babyDiv = layer.find('[mark="baby"]'),
                adultInput = adultDiv.find('input[name="adult"]'), childInput = childDiv.find('input[name="child"]'), babyInput = babyDiv.find('input[name="baby"]');
            //
            var Limit = {
                adult: { min: 1, max: 10 },
                child: { min: 0, max: 10 },
                baby: { min: 0, max: 10 },
                refreshStatus: function (d) {
                    Limit.setStatus(adultDiv, d.adult, Limit.adult.min, Limit.adult.max);
                    Limit.setStatus(childDiv, d.child, Limit.child.min, Limit.child.max);
                    Limit.setStatus(babyDiv, d.baby, Limit.baby.min, Limit.baby.max);
                },
                setStatus: function (divObj, val, min, max) {
                    var minObj = divObj.find('a[mk="down"]'), maxObj = divObj.find('a[mk="up"]');
                    if (val == min) {
                        minObj.addClass('disabled'); maxObj.removeClass('disabled');
                    } else if (val == max) {
                        minObj.removeClass('disabled'); maxObj.addClass('disabled');
                    } else {
                        minObj.removeClass('disabled'); maxObj.removeClass('disabled');
                    }
                    divObj.find('input').value(val);
                }
            }

            var pData = {
                setData: function (o) {
                    if (!IsEmpty(o)) {
                        this.adult = o.adult;
                        this.child = o.child;
                        this.baby = o.baby;
                    } else {
                        this.adult = this.child = this.baby = 0;
                    }
                },
                getData: function () {
                    return { adult: this.adult, child: this.child, baby: this.baby }
                }
            }
            var PFun = {
                set: function (data) {
                    pObj.value(data.adult + label.UIC_Psger_Adult + '，' + data.child + label.UIC_Psger_Child + '，' + data.baby + label.UIC_Psger_Baby);
                }
            }
            //init
            pData.setData({ adult: 2, child: 0, baby: 0 });
            PFun.set(pData.getData());
            Limit.refreshStatus(pData.getData());
            //
            pObj.bind('click', function (e) {
                $('.pop_star_dis').css('display', 'none');
                layer.css({
                    'display': '',
                    'left': pObj.offset().left + 'px',
                    'top': pObj.offset().bottom + 'px'
                });
                e.stop();
            });
            //
            layer.find('a[mk="down"]').bind('click', function (e) {
                if (!$(this).hasClass("disabled")) {
                    var d = pData.getData();
                    switch ($(this).parentNode().parentNode().attr('mark')) {
                        case "adult":
                            d.adult--;
                            break;
                        case "child":
                            d.child--;
                            break;
                        case "baby":
                            d.baby--;
                            break;
                        default:
                            break;
                    }
                    //
                    pData.setData(d);
                    PFun.set(pData.getData());
                    Limit.refreshStatus(pData.getData());
                }
                e.stop();
            });
            layer.find('a[mk="up"]').bind('click', function (e) {
                if (!$(this).hasClass("disabled")) {
                    var d = pData.getData();
                    switch ($(this).parentNode().parentNode().attr('mark')) {
                        case "adult":
                            d.adult++;
                            break;
                        case "child":
                            d.child++;
                            break;
                        case "baby":
                            d.baby++;
                            break;
                        default:
                            break;
                    }
                    //
                    pData.setData(d);
                    PFun.set(pData.getData());
                    Limit.refreshStatus(pData.getData());
                }
                e.stop();
            });
            //
            function validate() {
                var d = pData.getData();
                if (IsEmpty(d) && $.isEmptyObject(d)) {
                    _.WarnControl.show(pObj, 'Error');
                    return false;
                } else {
                    if (d.adult < Limit.adult.min || d.adult > Limit.adult.max) {
                        _.WarnControl.show(pObj, label.UIC_Psger_AdultNum + '（' + Limit.adult.min + '-' + Limit.adult.max + '）');
                        return false;
                    }
                    if (d.child < Limit.child.min || d.child > Limit.child.max) {
                        _.WarnControl.show(pObj, label.UIC_Psger_ChildNum + '（' + Limit.child.min + '-' + Limit.child.max + '）');
                        return false;
                    }
                    if (d.baby < Limit.baby.min || d.baby > Limit.baby.max) {
                        _.WarnControl.show(pObj, label.UIC_Psger_BabyNum + '（' + Limit.baby.min + '-' + Limit.baby.max + '）');
                        return false;
                    }
                }
                return true;
            }
            //
            return {
                validate: validate,
                getData: function () { return pData.getData(); }
            }
        }

        return {
            InitPerson: InitPerson
        }
    })();

    //================================= Person Control E =================================

    //================================= SideBar Control S =================================
    _.SideBarControl = (function () {
        //
        function LoadSideBar() {
            var SideBarMOD = $(document).regMod('sideBar', '2.0', {
                //HTML: '<div class="xui-fixbar"><a href="${suggestionURL}" target="_blank" class="bar-item bar-feedback"><i class="xuico-feedback"></i><span class="bar-title">${suggestion}</span></a><a href="${liveChatURL}" target="_blank" class="bar-item bar-olservice"><i class="xuico-olservice"></i><span class="bar-title">${liveChat}</span></a><a href="javascript:;" id="GoTop" class="bar-item bar-totop"><i class="xuico-totop"></i></a></div>',
                HTML: cfg.tmpl.sideBarTmpl,
                url: {
                    suggestionURL: 'http://my.ctrip.com/uxp/Community/CommunityAdvice.aspx?productType=15',
                    liveChatURL: 'http://livechat.ctrip.com/livechat/Login.aspx?GroupCode=shanglv'
                },
                title: {
                    suggestion: label.UIC_suggestion,
                    liveChat: label.UIC_liveChat
                },
                threshold_px: 100
            });
            //
            $('#_GoTop').bind('click', function (e) { document.body.scrollTop = document.documentElement.scrollTop = 0; e.stop(); });

            return SideBarMOD;
        }

        return {
            LoadSideBar: LoadSideBar
        }
    })();

    //================================= SideBar Control E =================================

    //================================= Map Control S =================================
    _.MapControl = (function () {
        //页面只能初始化一次
        //
        var InitMapParam = function (o) {
            if (!o) return;
            var baseDiv = $el(o.baseObj), cname = o.initData.start.cityName;
            //
            baseDiv.html($.tmpl.render(cfg.tmpl.baseMapTmpl, {}));
            //
            var _MapStart = _.AreaControl.InitNormalArea({
                txtArea: '#map_start',
                msg: label.UIC_ChsStart,
                initdata: o.initData.start ? o.initData.start : {},
                cityName: o.initData.start ? o.initData.start.cityName : "",
                source: o.emptySource,
                filterOnly: true
            });
            var _MapEnd = _.AreaControl.InitNormalArea({
                txtArea: '#map_end',
                msg: label.UIC_ChsEnd,
                cityName: o.initData.start ? o.initData.start.cityName : "",
                source: o.emptySource,
                filterOnly: true
            });
            //placeholder
            !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#map_start,#map_end'));
            //Ev
            baseDiv.find('.map-hd>.btn-close').bind('click', function () { baseDiv.unmask(); _.WarnControl.hide(); })
            baseDiv.find('#map_submit').bind('click', function () {
                if (_MapStart.validate() && _MapEnd.validate()) {
                    var _s = _MapStart.getData().value.split('|')[2], _e = _MapEnd.getData().value.split('|')[2];
                    _Map.drawMap({
                        cityName: cname,
                        start: {
                            lat: _s.split(',')[1],
                            lon: _s.split(',')[0]
                        },
                        end: {
                            lat: _e.split(',')[1],
                            lon: _e.split(',')[0]
                        }
                    });
                }
            });
            //
            var _Map = {
                initMap: function (o) {
                    if (!IsEmpty(o)) {
                        //cityName,storeAddress,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
                        var arr = o.split(',');
                        //设置起点、终点信息
                        baseDiv.find('.map-hd>p').html(arr[1]); baseDiv.mask();
                        !IsEmpty(arr[5]) && _MapStart.setData({
                            text: arr[5],
                            value: ["", arr[5], arr[6] + "," + arr[7], "0"].join('|')
                        });
                        !IsEmpty(arr[4]) && _MapEnd.setData({
                            text: arr[4],
                            value: ["", arr[4], arr[2] + "," + arr[3], "0"].join('|')
                        });
                        //
                        _Map.drawMap({
                            cityName: cname,
                            start: {
                                lat: arr[7],
                                lon: arr[6]
                            },
                            end: {
                                lat: arr[3],
                                lon: arr[2]
                            }
                        });
                    }
                },
                drawMap: function (data) {
                    //var EndXY = new AMap.LngLat(116.397428, 39.90923);
                    var EndXY = new AMap.LngLat(data.end.lon, data.end.lat);
                    mapObj = new AMap.Map("map_canvas", {
                        view: new AMap.View2D({
                            center: EndXY, //地图中心点
                            zoom: 13//地图显示的缩放级别
                        }),
                        keyboardEnable: false
                    });
                    //地图中添加地图操作ToolBar插件
                    mapObj.plugin(["AMap.ToolBar"], function () {
                        toolBar = new AMap.ToolBar();
                        mapObj.addControl(toolBar);
                    });
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/images/marker_sprite.png",
                        position: EndXY
                    });
                    if (!(data.end.lat == data.start.lat && data.end.lon == data.start.lon)) _Map.drawRoute(data);
                    marker.setMap(mapObj); //在地图上添加点
                    mapObj.setLang("zh_cn"); //mapObj.setLang("en");

                },
                drawRoute: function (data) {
                    //绘制路线
                    var routeObj, StartXY = new AMap.LngLat(data.start.lon, data.start.lat), EndXY = new AMap.LngLat(data.end.lon, data.end.lat);

                    //加载公交换乘插件
                    mapObj.plugin(["AMap.Transfer"], function () {
                        transOptions = {
                            city: data.cityName,                    //公交城市
                            policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                        };
                        //构造公交换乘类
                        trans = new AMap.Transfer(transOptions);
                        //清空公交线路
                        baseDiv.find('div.map-routeList').html("");
                        //返回导航查询结果
                        AMap.event.addListener(trans, "complete", _Map.routeCallBack);
                        //根据起、终点坐标查询公交换乘路线
                        trans.search(StartXY, EndXY);
                    });
                },
                addMarker: function (busmar) {
                    for (var i = 0; i < busmar.length; i++) {
                        var busmarker = new AMap.Marker({
                            icon: new AMap.Icon({
                                image: "http://api.amap.com/Public/images/js/busroute.png",
                                size: new AMap.Size(20, 20),
                                imageOffset: new AMap.Pixel(-33, -3)
                            }),
                            position: busmar[i],
                            offset: {
                                x: -25,
                                y: -25
                            },
                            map: mapObj
                        });
                    }
                },
                drawBuschangeLine: function (startPot, endPot, BusArr, WalkArr) {
                    //自定义起点，终点图标
                    var sicon = new AMap.Icon({
                        image: "http://api.amap.com/Public/images/js/poi.png",
                        size: new AMap.Size(44, 44),
                        imageOffset: new AMap.Pixel(-334, -180)
                    });
                    var eicon = new AMap.Icon({
                        image: "http://api.amap.com/Public/images/js/poi.png",
                        size: new AMap.Size(44, 44),
                        imageOffset: new AMap.Pixel(-334, -134)
                    });
                    //绘制起点，终点
                    var stmarker = new AMap.Marker({
                        map: mapObj,
                        position: new AMap.LngLat(startPot.lng, startPot.lat), //基点位置
                        icon: sicon, //复杂图标
                        offset: { x: -16, y: -34} //相对于基点的位置
                    });
                    var endmarker = new AMap.Marker({
                        map: mapObj,
                        position: new AMap.LngLat(endPot.lng, endPot.lat), //基点位置
                        icon: eicon, //复杂图标
                        offset: { x: -16, y: -34} //相对于基点的位置
                    });
                    //绘制乘车的路线
                    for (var i = 0; i < BusArr.length; i++) {
                        busPolyline = new AMap.Polyline({
                            map: mapObj,
                            path: BusArr[i],
                            strokeColor: "#005cb5", //线颜色
                            strokeOpacity: 0.8, //线透明度
                            strokeWeight: 6//线宽
                        });
                    }
                    //绘制步行的路线
                    for (var i = 0; i < WalkArr.length; i++) {
                        walkPolyline = new AMap.Polyline({
                            map: mapObj,
                            path: WalkArr[i],
                            strokeColor: "#6EB034", //线颜色
                            strokeOpacity: 0.6, //线透明度
                            strokeWeight: 6//线宽
                        });
                    }
                },
                routeCallBack: function (data) {
                    //绘制整个区域
                    var btOrigin = data.origin, btDestination = data.destination;
                    var btPlans = data.plans, btTaxiCost = data.taxi_cost;
                    var FixData = [];
                    //fun
                    var Getdistance = function (len) {
                        if (len <= 1000) {
                            var s = len;
                            return s + label.UIC_Meter;
                        } else {
                            var s = Math.round(len / 1000);
                            return label.UIC_About + s + label.UIC_KMeter;
                        }
                    }
                    if (btPlans) {
                        for (var i = 0; i < btPlans.length; i++) {
                            var btseg = btPlans[i].segments;
                            //
                            var _iObj = {}, titleDescArr = new Array(), _rSteps = new Array();
                            _iObj.distanceDesc = Getdistance(btPlans[i].distance);
                            //
                            _iObj.WalkArr = []; _iObj.BusArr = []; _iObj.OnWalk = []; _iObj.OnBus = [];
                            if (btseg) {
                                for (var j = 0; j < btseg.length; j++) {
                                    var _jObj = {};
                                    _jObj.instruction = btseg[j].instruction;
                                    if (btseg[j].transit_mode.toLocaleUpperCase() == "WALK") {
                                        //步行
                                        _jObj.isWalk = true;
                                        _iObj.WalkArr.push(btseg[j].transit.path)
                                        _iObj.OnWalk.push(btseg[j].transit.origin);
                                    } else {
                                        //bus
                                        _jObj.isWalk = false;
                                        titleDescArr.push(btseg[j].transit.lines[0].name);
                                        _iObj.BusArr.push(btseg[j].transit.path);
                                        _iObj.OnBus.push(btseg[j].transit.on_station.location);
                                    }
                                    _rSteps.push(_jObj);
                                }
                            }
                            _iObj.titleDesc = titleDescArr.join("-->");
                            _iObj.routeSteps = _rSteps;
                            FixData.push(_iObj);
                        }
                    }
                    //
                    baseDiv.find('div.map-routeList').html($.tmpl.render(cfg.tmpl.mapRouteTmpl, FixData));
                    baseDiv.find('div.abstract').bind('click', function (e) {
                        var objList = baseDiv.find('.map-routeList div.item');
                        objList.removeClass('item-cur');
                        $(this).parentNode().addClass('item-cur');
                        showLine($(this).attr('index') || 0);
                    });
                    //
                    var showLine = function (index) {
                        //
                        mapObj.clearMap();
                        //
                        var d = FixData[index];
                        d && _Map.drawBuschangeLine(btOrigin, btDestination, d.WalkArr, d.BusArr);
                        d && _Map.addMarker(d.OnBus);
                    }
                    showLine(0);
                }
            }

            //
            return {
                initMap: _Map.initMap
            }
            //
            //baseDiv.mask();
        }

        var InitEasyMapParam = function (o) {
            if (!o) return;
            var baseDiv = $el(o.baseObj);
            //
            baseDiv.html($.tmpl.render(cfg.tmpl.easyBaseMapTmpl, {}));
            //Ev
            baseDiv.find('.mod-map-hd>.btn-close').bind('click', function () { baseDiv.unmask(); _.WarnControl.hide(); })
            //
            var _Map = {
                initMap: function (o) {
                    if (!IsEmpty(o)) {
                        //text,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
                        var arr = o.split(',');
                        baseDiv.find('span.expected').html(arr[0]); baseDiv.mask();
                        _Map.drawMap({
                            start: {
                                lat: arr[6],
                                lon: arr[5]
                            },
                            end: {
                                lat: arr[2],
                                lon: arr[1]
                            }
                        });
                    }
                },
                drawMap: function (data) {
                    var EndXY = new AMap.LngLat(data.end.lon, data.end.lat), StartXY = new AMap.LngLat(data.start.lon, data.start.lat);
                    mapObj = new AMap.Map("map_easy_canvas", {
                        view: new AMap.View2D({
                            center: EndXY, //地图中心点
                            zoom: 10//地图显示的缩放级别
                        }),
                        keyboardEnable: false
                    });
                    //地图中添加地图操作ToolBar插件
                    mapObj.plugin(["AMap.ToolBar"], function () {
                        toolBar = new AMap.ToolBar();
                        mapObj.addControl(toolBar);
                    });
                    /*
                    var marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/images/marker_sprite.png",
                    position: EndXY
                    });
                    */
                    //自定义起点，终点图标
                    var sicon = new AMap.Icon({
                        image: "http://api.amap.com/Public/images/js/poi.png",
                        size: new AMap.Size(44, 44),
                        imageOffset: new AMap.Pixel(-334, -180)
                    });
                    var eicon = new AMap.Icon({
                        image: "http://api.amap.com/Public/images/js/poi.png",
                        size: new AMap.Size(44, 44),
                        imageOffset: new AMap.Pixel(-334, -134)
                    });
                    //绘制起点，终点
                    var stmarker = new AMap.Marker({
                        map: mapObj,
                        //position: new AMap.LngLat(startPot.lng, startPot.lat), //基点位置
                        position: StartXY,
                        icon: sicon, //复杂图标
                        offset: { x: -16, y: -34} //相对于基点的位置
                    });
                    var endmarker = new AMap.Marker({
                        map: mapObj,
                        //position: new AMap.LngLat(endPot.lng, endPot.lat), //基点位置
                        position: EndXY,
                        icon: eicon, //复杂图标
                        offset: { x: -16, y: -34} //相对于基点的位置
                    });
                    //marker.setMap(mapObj); //在地图上添加点
                    mapObj.setLang("zh_cn"); //mapObj.setLang("en");
                }
            }
            return {
                initMap: _Map.initMap
            }
        }

        return {
            InitMapParam: InitMapParam,
            InitEasyMapParam: InitEasyMapParam
        }

    })();

    //================================= Map Control E =================================


})(cQuery, {
    msg: {
        dateMsg: {
            dateEmpty: label.UIC_Msg_dateEmpty,
            ymdEmpty: label.UIC_Msg_ymdEmpty,
            ymdIllegal: label.UIC_Msg_ymdIllegal,
            hmEmpty: label.UIC_Msg_hmEmpty,
            hmIllegal: label.UIC_Msg_hmIllegal,
            dateOut: label.UIC_Msg_dateOut,
            dateExpire: label.UIC_Msg_dateExpire
        },
        cityMsg: {

        },
        areaMsg: {

        },
        fltMsg: {
            fltnoEmpty: label.UIC_Msg_fltnoEmpty
        }
    },
    tmpl: {
        hmTmpl: '\
            <table cellpadding="0" cellspacing="0">\
                <tbody>\
                    <tr>\
                        <th class="hour-head" align="center">' + label.UIC_Hour + '</th>\
                        <th class="minute-head" align="center">' + label.UIC_Minute + '</th>\
                    </tr>\
                    <tr>\
                        <td class="hour-body" valign="top">\
                            <div mark="hour">\
                                {{loop(index, length) 0, 24, 1}}\
                                    {{if (index < 10)}}\
                                        <a href="javascript:void(0);" class="hour" data-hour="0${index}">0${index}</a>\
                                    {{else}}\
                                        <a href="javascript:void(0);" class="hour" data-hour="${index}">${index}</a>\
                                    {{/if}}\
                                {{/loop}}\
                            </div>\
                        </td>\
				        <td class="minute-body" valign="top">\
					        <div mark="minute">\
                                {{loop(index, length) 0, 6, 1}}\
                                    <a href="javascript:void(0);" class="minute" data-minute="${index}0">${index}0</a>\
                                {{/loop}}\
					        </div>\
				        </td>\
                    </tr>\
			        <tr>\
				        <td colspan="2" align="center" class="tool-part">\
					        <button data-tag="close" class="ui-button btn-rounded btn-primary btn-tiny">' + label.UIC_Close + '</button>\
				        </td>\
			        </tr>\
                </tbody>\
            </table>',
        hTmpl: '\
            <div class="ui-selector-list">\
                <div class="list" mark="hour" style="max-height:300px;overflow-y:scroll;">\
                    {{loop(index, length) 0, 24, 1}}\
                        {{if (index < 10)}}\
                            <a href="javascript:void(0);" data-value="0${index}:00" data-h="0${index}">0${index}:00</a>\
                        {{else}}\
                            <a href="javascript:void(0);" data-value="${index}:00" data-h="${index}">${index}:00</a>\
                        {{/if}}\
                    {{/loop}}\
                </div>\
            </div>',
        n_CityTmpl: '\
            <div class="ui-selector unselectable ui-jntselector in points-ltlb" style="z-index: 999;min-width: 290px; width: 740px;">\
                <div class="ui-selector-city" data-tab="tab">\
                    <div class="ui-tab">\
                        {{enum(key) data}}\
                            <a class="" data-tab="button">${key}</a>\
                        {{/enum}}\
                    </div>\
                    <div>\
                        {{enum(key, objs) data}}\
                            <div class="list">\
                                <div class="suplist">\
                                    {{enum(k, arr) objs}}\
                                        <div style="clear:left;padding-left:25px;">\
                                            {{if (k)}}<span class="alphabet">${k}</span>{{/if}}\
                                            <div class="subgroup">\
                                                {{each(index, item) arr}}\
                                                    <a href="javascript:void(0);" title="${item.display}" data="${item.data}">${item.display}</a>\
                                                {{/each}}\
                                            </div>\
                                        </div>\
                                    {{/enum}}\
                                </div>\
                            </div>\
                        {{/enum}}\
                    </div>\
                </div>\
            </div>',
        amapAreaTmpl: '\
            <div class="ui-selector-list">\
                <div class="list">\
                    {{each(key, val) $data}}\
                        <a href="javascript:void(0);" class="_area" data-value="${val.id}|${val.name}|${val.cityname}|${val.lat}|${val.lon}|${val.detailAddress}" >\
                            ${val.name}<br/>\
                            <span class="description">${val.detailAddress}</span>\
                        </a>\
                    {{/each}}\
                </div>\
            </div>\
            <div class="ui-paging" >\
                <div class="asp_net_pager" pindex="1">\
                    <a class="undo">&lt;=</a>\
                    <a class="undo prev"><i></i>&lt;-</a>\
                    <a class="current">1</a>\
                    <a class="otherPage" title="转到第2页" href="javascript:void(0);" pindex="2">2</a>\
                    <a class="otherPage" title="转到第3页" href="javascript:void(0);" pindex="3">3</a>\
                    <a class="otherPage" title="转到第4页" href="javascript:void(0);" pindex="4">4</a>\
                    <a class="otherPage" title="转到第5页" href="javascript:void(0);" pindex="5">5</a>\
                    <a class="otherPage" title="转到第6页" href="javascript:void(0);" pindex="6">...</a>\
                    <a class="otherPage next" href="javascript:void(0);" pindex="2" title="转到第2页">-&gt;<i></i></a>\
                    <a class="otherPage" href="javascript:void(0);" pindex="10" title="转到第10页">=&gt;</a>\
                    <div class="clear"></div>\
                </div>\
            </div>',
        nAreaFilterTmpl: '\
            {{if hasResult}}\
                <div class="ui-selector unselectable ui-asearch in points-ltlb" style="width: 318px; z-index: 5; min-width: 280px;">\
                    {{if ($data.list=$data.list||[])}}{{/if}}\
                    <div class="ui-selector-list">\
                        <div class="list">\
                            {{each (i,item) $data.list}}\
                                {{if (arr=item.data.split("|"))}}{{/if}}\
                                <a href="javascript:;" data="${item.data}" data-value="${item.data}" title="${arr[4]}${arr[1]}">\
                                    ${arr[1]}<br/><span class="description">${arr[4]}</span>\
                                </a>\
                            {{/each}}\
                        </div>\
                    <div>\
                    {{if $data.page.max>1}}\
                    <div class="ui-paging">\
                        <div class="asp_net_pager" pindex="{{$data.page.current}}">\
                            {{if $data.page.current>0}}\
                                <a href="javascript:void(0);" page="${$data.page.current-1}">&lt;-</a>\
                            {{/if}}\
                            {{if $data.page.current<2}}\
			                    {{loop(index) Math.min(5,$data.page.max+1)}}\
				                    <a href="javascript:void(0);"{{if $data.page.current==index}}class="current"{{/if}}page="${index}">${index+1}</a>\
			                    {{/loop}}\
                            {{else $data.page.current>$data.page.max-2}}\
			                    {{loop(index) Math.max(0,$data.page.max-4),$data.page.max+1}}\
				                    <a href="javascript:void(0);"{{if $data.page.current==index}}class="current"{{/if}}page="${index}">${index+1}</a>\
			                    {{/loop}}\
                            {{else}}\
			                    {{loop(index) Math.max(0,$data.page.current-2),Math.min($data.page.current+3,$data.page.max+1)}}\
			                    <a href="javascript:void(0);"{{if $data.page.current==index}}class="current"{{/if}}page="${index}">${index+1}</a>\
			                    {{/loop}}\
                            {{/if}}\
                            {{if $data.page.current<$data.page.max}}\
                                <a href="javascript:void(0);" page="${$data.page.current+1}">-&gt;</a>\
                            {{/if}}\
                        </div>\
                    </div>\
                    {{/if}}\
                </div>\
            {{else}}\
                <div class="ui-selector unselectable ui-chfsearch points-ltlb in" style="width: 318px; z-index: 5; min-width: 280px;">\
                    <div class="ui-selector-list">\
                        <div class="message">{{tmpl message.noFilterResult}}</div>\
                    </div>\
                </div>\
            {{/if}}',
        nAreaSuggestionTmpl: '\
            {{if (d = UIControl.AreaControl.Base.FixNormalData($data))}}{{/if}}\
            <div class="ui-selector unselectable ui-jntselector in points-ltlb" style=" z-index: 5; min-width: 290px; width: 740px;">\
	            <div class="ui-selector-city" data-tab="tab">\
		            <div class="ui-tab">\
                        {{enum(key) d}}\
                            <a class="" tag="title" data-tab="button">${key}</a>\
                        {{/enum}}\
		            </div>\
                    <div>\
                        {{enum(key, objs) d}}\
                            <div class="list">\
                                <div class="suplist">\
                                    <div class="subgroup">\
                                        {{each(i, item) objs}}\
                                        {{if (item.sublist)}}\
                                        <a href="javascript:void(0);" gtr="base" gid="${item.display}" title="${item.display}">${item.display}</a>\
                                        {{else}}\
                                        <a href="javascript:void(0);" title="${item.display}" data="${item.data}">${item.display}</a>\
                                        {{/if}}\
                                        {{/each}}\
                                    </div>\
                                </div>\
                                {{each(i, item) objs}}\
                                {{if (item.sublist)}}\
                                <div class="sublist" sid="${item.display}">\
                                    <div class="sublist-title" data-tag="collapse">\
                                        <span style="float:right;color:#1060c9">' + label.UIC_GoBack + '</span><b data-tag="title"></b>\
                                    </div>\
                                    <ul class="sublist-list" data-tag="content">\
                                        {{each (j, jtem) item.sublist}}\
                                        <li><a href="javascript:void(0);" title="${jtem.display}" data="${jtem.data}">${jtem.display}</a></li>\
                                        {{/each}}\
                                    </ul>\
                                </div>\
                                {{/if}}\
                                {{/each}}\
                            </div>\
                        {{/enum}}\
		            </div>\
	            </div>\
            </div>',
        chAreaSuggestionTmpl: '\
            {{if (d = UIControl.AreaControl.Base.FixSDData($data))}}{{/if}}\
            <div class="ui-selector unselectable ui-jntselector in points-ltlb" style=" z-index: 5; min-width: 290px; width: 740px;">\
                <div class="ui-selector-city" data-tab="tab">\
                    <div class="ui-tab">\
                        {{enum(key) d}}\
                            <a class="" tag="title" data-tab="button">${key}</a>\
                        {{/enum}}\
                    </div>\
                    <div>\
                    {{enum(key, objs) d}}\
                        <div class="list">\
                            <div class="suplist">\
                                {{enum(key_1, objs_1) objs}}\
                                    {{if (key_1.search(/[A-Z]/i) != -1)}}\
                                     <div style="clear:left;padding-left:25px;">\
                                     <span class="alphabet">${key_1}</span>\
                                    {{else}}\
                                      <div style="padding-left:45px;float:left;width:305px;display: inline-block;">\
                                      <span style="margin-left:-40px;" class="alphabet">${key_1}</span>\
                                    {{/if}}\
                                    <div class="subgroup">\
                                        {{each(i, item) objs_1}}\
                                            {{if (item.sublist)}}\
                                            <a href="javascript:;" gtr="base" gid="${item.display}" title="${item.display}">${item.display}</a>\
                                            {{else}}\
                                            <a href="javascript:;" title="${item.display}" style="width:138px;" data="${item.data}">${item.display}</a>\
                                            {{/if}}\
                                        {{/each}}\
                                    </div>\
                                    </div>\
                                {{/enum}}\
                            </div>\
                            {{enum(key_1, objs_1) objs}}\
                            {{each(i, item) objs_1}}\
                                {{if (item.sublist)}}\
                                 <div class="sublist" sid="${item.display}">\
                                     <div class="sublist-title" data-tag="collapse">\
                                         <span style="float:right;color:#1060c9">' + label.UIC_GoBack + '</span><b data-tag="title"></b>\
                                     </div>\
                                     <ul class="sublist-list" data-tag="content">\
                                         {{each (j, jtem) item.sublist}}\
                                         <li><a href="javascript:;" title="${jtem.display}" data="${jtem.data}">\
                                            <span style="float:right;">${item.display}</span>\
                                         {{if (message.type=="train")}}<i class="ui-icon icon-location train fn-left"></i>{{/if}}\
                                         {{if (message.type=="airport")}}<i class="ui-icon icon-location airport fn-left"></i>{{/if}}\
                                         ${jtem.display}\
                                         </a></li>\
                                         {{/each}}\
                                     </ul>\
                                 </div>\
                                {{/if}}\
                            {{/each}}\
                            {{/enum}}\
                        </div>\
                    {{/enum}}\
                    </div>\
                </div>\
            </div>',
        chAreaFilterTmpl: '\
            <div class="ui-selector unselectable ui-chfsearch points-ltlb in" style="width: 400px; z-index: 10014; min-width: 280px; ">\
                <div class="ui-selector-list" >\
                {{if $data.hasResult}}\
                <div class="information">' + label.UIC_SearchFilterTitle + '</div>\
                    <div class="list">\
                    {{each (i,item) list}}\
                    <a href="javascript:;" data="${data}">\
                        {{if (message.type=="train")}}<i class="train">&nbsp;</i>{{/if}}\
                        {{if (message.type=="airport")}}<i class="airport">&nbsp;</i>{{/if}}\
                        ${right}<span>${data.split("|")[4] == "" ? "" : data.split("|")[4]}${data.split("|")[6] == "" ? "" : "，" + data.split("|")[6]}</span>\
                    </a>\
                    {{/each}}\
                    </div>\
                {{else}}\
                <div class="message">' + label.UIC_SearchFilterNoResult + '</div>\
                {{/if}}\
                </div>\
            </div>',
        fltFilterTmpl: '\
            {{if $data.hasResult}}\
            <div class="ui-selector unselectable ui-flightno points-ltlb in" style="width: 290px; z-index: 10053; min-width: 205px; ">\
                <div class="ui-selector-list">\
                    <div class="information">' + label.UIC_FltMsgTitle + '</div>\
                    <div class="list">\
                        {{each (i, item) list}}\
                        <a href="javascript:void(0);" data="${data}">${data}</a>\
                        {{/each}}\
                    </div>\
                </div>\
            </div>\
            {{/if}}',
        fltLayerTmpl: '\
            <div class="och_jj_FlightDiv">\
                <div class="tck-box p10 mf-tck">\
                    <p class="tck-ts"><a href="javascript:;" class="tck-close"></a>\
                    ' + label.UIC_FltMsgSonTitle + '</p>\
                    {{if ($data.length > 0)}}\
                    <div class="mf-list">\
    	                <div class="mf-list-bd">\
    		                <ul class="mf-tbd">\
                                {{each(i, i_obj) $data}}\
    			                <li index="${i}" class="{{if ((i+1)==$data.length)}}bt{{/if}}">\
    				                <div class="mf-info-hd">\
    					                <span class="info-time">${i_obj.FlightDepartDate}</span><strong>${i_obj.AirlineName}${i_obj.FlightNumber}</strong>\
    				                </div>\
    				                <div class="mf-info-bd">\
    					                <span class="col col-1"><em>${i_obj.DepartAirport.City.Name}${i_obj.PlanDepartTime}</em><br>${i_obj.DepartAirport.Location.LocationName}</span>\
    					                <span class="col col-2"><i class="arr-flight"></i></span>\
    					                <span class="col col-1"><em>${i_obj.ArrivalAirport.City.Name}${i_obj.PlanArrivalTime}</em><br>${i_obj.ArrivalAirport.Location.LocationName}</span>\
    				                </div>\
    			                </li>\
                                {{/each}}\
    		                </ul>\
    	                </div>\
                    </div>\
                    {{else}}\
                    <div>\
                        <p class="no_flight">' + label.UIC_FltMsgNoOrder + '</p>\
                    </div>\
                    {{/if}}\
                </div>\
            </div>',
        osAreaSuggestionTmpl: '\
            {{if (d = UIControl.AreaControl.Base.FixOSData($data))}}{{/if}}\
            <div class="ui-selector unselectable ui-jntselector in points-ltlb" style=" z-index: 5; min-width: 290px; width: 740px;">\
                <div class="ui-selector-city" data-tab="tab">\
                    <div class="ui-tab">\
                        {{enum(key) d}}\
                        <a class="" tag="title" data-tab="button">${key}</a>\
                        {{/enum}}\
                    </div>\
                    <div>\
                        {{enum(key, objs) d}}\
                        <div class="list">\
                            <div class="suplist">\
                                <div class="subgroup">\
                                    {{each(i, item) objs}}\
                                    {{if (item.sublist)}}\
                                    <a href="javascript:void(0);" gtr="base" gid="${item.display}" title="${item.display}">${item.display}</a>\
                                    {{else}}\
                                    <a href="javascript:void(0);" title="${item.display}" data="${item.data}">${item.display}</a>\
                                    {{/if}}\
                                    {{/each}}\
                                </div>\
                            </div>\
                            {{each(i, item) objs}}\
                            {{if (item.sublist)}}\
                                <div class="sublist" sid="${item.display}">\
                                    <div class="sublist-title" data-tag="collapse">\
                                        <span style="float:right;color:#1060c9">' + label.UIC_GoBack + '</span><b data-tag="title"></b>\
                                    </div>\
                                    <ul class="sublist-list" data-tag="content">\
                                        {{each (j, jtem) item.sublist}}\
                                        <li><a href="javascript:void(0);" title="${jtem.display}" data="${jtem.data}">\
                                        <span style="float:right;">${data.split("|")[4] == "" ? "" : data.split("|")[4]}${data.split("|")[6] == "" ? "" : "，" + data.split("|")[6]}</span>\
                                        {{if (jtem.data.split("|").length > 10 && jtem.data.split("|")[10] == "1") }}\
                                        <i class="ui-icon icon-location airport fn-left"></i>\
                                        {{else (jtem.data.split("|").length > 10 && jtem.data.split("|")[10] == "2")}}\
                                        <i class="ui-icon icon-location train fn-left"></i>\
                                        {{else}}\
                                        <i class="ui-icon icon-location landmark fn-left"></i>\
                                        {{/if}}\
                                        <span class="subtext">${jtem.display}</span>\
                                        </a></li>\
                                        {{/each}}\
                                    </ul>\
                                </div>\
                            {{/if}}\
                            {{/each}}\
                        </div>\
                        {{/enum}}\
                    </div>\
                </div>\
            </div>',
        osAreaFilterTmpl: '\
            <div class="ui-selector unselectable ui-chfsearch points-ltlb in" style="width: 400px; z-index: 10014; min-width: 280px; ">\
                <div class="ui-selector-list" >\
                {{if $data.hasResult}}\
                <div class="information">' + label.UIC_SearchFilterTitle + '</div>\
                    <div class="list">\
                    {{each (i,item) list}}\
                    <a href="javascript:;" data="${data}">\
                        {{if (data.split("|").length > 10 && data.split("|")[10] == "1")}}\
                        <i class="airport">&nbsp;</i>\
                        {{else (data.split("|").length > 10 && data.split("|")[10] == "2")}}\
                        <i class="train">&nbsp;</i>\
                        {{else}}\
                        <i class="landmark">&nbsp;</i>\
                        {{/if}}\
                        ${right}<span>${data.split("|")[4] == "" ? "" : data.split("|")[4]}${data.split("|")[6] == "" ? "" : "，" + data.split("|")[6]}</span>\
                    </a>\
                    {{/each}}\
                    </div>\
                {{else}}\
                <div class="message">' + label.UIC_SearchFilterNoResult + '</div>\
                {{/if}}\
                </div>\
            </div>',
        ochAreaFilterTmpl: '\
            {{if $data.hasResult}}\
            <div class="ui-selector unselectable ui-suggestion points-ltlb in" style="width: 500px; z-index: 10026; min-width: 168px; display: block;">\
                <div class="ad-pop">\
                    <div class="ad-top">' + label.UIC_SearchFilterTitle + '</div>\
                    <div class="ad-content">\
                        {{each (i,item) list}}\
                        <a class="ad-line" data="${data}" title="${right} ${data.split("|")[2]}">\
                            <div class="ad-l fl">\
                                <p class="title">${right}</p>\
                                <p class="grey">${data.split("|")[2]}</p>\
                            </div>\
                            <div class="ad-r fr">\
                                ${data.split("|")[5] == "" ? "" : data.split("|")[5]}\
                                ${data.split("|")[6] == "" ? "" : "，" + data.split("|")[6]}\
                            </div>\
                        </a>\
                        {{/each}}\
                    </div>\
                </div>\
            </div>\
            {{/if}}',
        ochHtlLayerTmpl: '\
            <div id="och_jj_FlightDiv" class="och_jj_FlightDiv">\
	            <div class="tck-box p10 mf-tck">\
	                <p class="tck-ts">\
                        <a href="javascript:;" class="tck-close"></a>\
                        ' + label.UIC_HtlMsgTitle + '\
                    </p>\
                    {{if ($data.length > 0)}}\
                    <div class="mf-list">\
                        <div class="mf-list-bd">\
                            <ul class="mf-tbd">\
                            {{each(i, i_obj) $data}}\
                                <li index="${i}" class="{{if ((i+1)==$data.length)}}bt{{/if}}" dval="${i_obj}">\
                                    <div class="ad-line" >\
                                        <div class="ad-l fl">\
                                            <p class="title">${i_obj.split("|")[1]}</p>\
                                            <p class="grey">${i_obj.split("|")[2]}</p>\
                                        </div>\
                                        <div class="ad-r fr">\
                                            ${i_obj.split("|")[5] == "" ? "" : i_obj.split("|")[5]}\
                                            ${i_obj.split("|")[6] == "" ? "" : "，" + i_obj.split("|")[6]}\
                                        </div>\
                                    </div>\
                                </li>\
                            {{/each}}\
                            </ul>\
                        </div>\
                    </div>\
                    {{else}}\
	                <div>\
	                    <p class="no_flight">' + label.UIC_HtlNoResult + '</p>\
	                </div>\
                    {{/if}}\
	            </div>\
            </div>',
        personTmpl: '\
            <div>\
	            <div mark="adult" class="personer-item">\
		            <div class="personer-label">\
			            ' + label.UIC_PsgTmpl_Adult + '\
		            </div>\
		            <div class="personer-count">\
			            <a data-spinner="tool" mk="down" data-spinner-direction="down">-</a>\
			            <input readonly="readonly" name="adult" data-spinner="input" data-spinner-max="10" data-spinner-min="1" value="2" type="text">\
			            <a data-spinner="tool" mk="up" data-spinner-direction="up">+</a>\
		            </div>\
	            </div>\
	            <div mark="child" class="personer-item">\
		            <div class="personer-label">\
			            ' + label.UIC_PsgTmpl_Child + '\
		            </div>\
		            <div class="personer-count">\
			            <a data-spinner="tool" mk="down" data-spinner-direction="down">-</a>\
			            <input readonly="readonly" name="child" data-spinner="input" data-spinner-max="10" data-spinner-min="0" value="0" type="text">\
			            <a data-spinner="tool" mk="up" data-spinner-direction="up">+</a>\
		            </div>\
	            </div>\
	            <div mark="baby" class="personer-item">\
		            <div class="personer-label">\
			            ' + label.UIC_PsgTmpl_Baby + '\
		            </div>\
		            <div class="personer-count">\
			            <a data-spinner="tool" mk="down" data-spinner-direction="down">-</a>\
			            <input readonly="readonly" name="baby" data-spinner="input" data-spinner-max="10" data-spinner-min="0" value="0" type="text">\
			            <a data-spinner="tool" mk="up" data-spinner-direction="up">+</a>\
		            </div>\
	            </div>\
            </div>',
        sideBarTmpl: '\
            <div class="xui-fixbar">\
                <a href="${suggestionURL}" target="_blank" class="bar-item bar-feedback"><i class="xuico-feedback"></i><span class="bar-title">${suggestion}</span></a>\
                <a href="${liveChatURL}" target="_blank" class="bar-item bar-olservice"><i class="xuico-olservice"></i><span class="bar-title">${liveChat}</span></a>\
                <a href="javascript:;" id="_GoTop" class="bar-item bar-totop"><i class="xuico-totop"></i></a>\
            </div>',
        baseMapTmpl: '\
            <div class="mapBlock" style="display: block;">\
                <div class="map-hd"><span class="btn-close">×</span><p></p></div>\
                <div class="map-bd">\
                    <div class="map-side">\
                        <div class="map-search">\
                            <div class="item start"><label class="label-circle">' + label.UIC_Start + '</label><input id="map_start" type="text" placeholder="' + label.UIC_MustPlaceHolder + '"></div>\
                            <div class="item end"><label class="label-circle">' + label.UIC_End + '</label><input id="map_end" readonly="readonly" type="text" placeholder="' + label.UIC_MustPlaceHolder + '"></div>\
                            <div class="item"><button id="map_submit" class="xui-btn xui-btn-primary xui-btn-xmd">' + label.UIC_MapSearchRoute + '</button></div>\
                        </div>\
                        <div class="map-detail">\
                            <h4 class="m-hd">' + label.UIC_BusRoute + '</h4>\
                            <div class="map-routeList"></div>\
                        </div>\
                    </div>\
                    <div class="map" id="map_canvas" style="height:620px; z-index:10;"></div>\
                </div>\
            </div>',
        mapRouteTmpl: '\
            {{if ($data.length > 0)}}\
                {{each(i, i_obj) $data}}\
                <div class="item {{if (0 == i)}}item-cur{{/if}}">\
                    <div class="abstract" index="${i}">\
                        <span class="index">${i+1}</span>${i_obj.titleDesc}\
                        <div class="notice">${i_obj.distanceDesc}</div>\
                    </div>\
                    <ul class="map-routeSteps">\
                        {{each(j, j_obj) i_obj.routeSteps}}\
                        <li>\
                            {{if (0 == j)}}\
                            <i class="i-start">' + label.UIC_Start + '</i>\
                            {{else (i_obj.routeSteps.length - 1 == j)}}\
                            <i class="i-terminal">' + label.UIC_End + '</i>\
                            {{else (j_obj.isWalk)}}\
                            <i class="i-walk"></i>\
                            {{else}}\
                            <i class="i-bus"></i>\
                            {{/if}}\
                            <p class="{{if (0 == j)}}place-start{{else (i_obj.routeSteps.length - 1 == j)}}place-end{{/if}}">\
                            ${j_obj.instruction}\
                            </p>\
                        </li>\
                        {{/each}}\
                    </ul>\
                </div>\
                {{/each}}\
            {{else}}\
                <div class="item">\
                    <div class="abstract">' + label.UIC_NoBusRoute + '</div>\
                </div>\
            {{/if}}',
        easyBaseMapTmpl: '\
            <div class="mod-map" style="display: block;">\
	            <div class="mod-map-hd"><span class="btn-close">×</span>' + label.UIC_Map + '</div>\
	            <div class="mod-map-bd" id="map_easy_canvas"></div>\
	            <div class="mod-map-ft"><span class="expected"></span>' + label.UIC_EasyMapDesc + '</div>\
            </div>'
    }
});