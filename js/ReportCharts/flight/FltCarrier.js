(function ($) {
    //☆=================== var S ===================☆
    var _flightCarriersInfo, //页面数据
        _carAnyInfo, //承运商名称-张数-成交净价-成交净价所占比-金额(含税)
        _flightFiveCarInfo, //前五承运商分布
        _fiveRouteInfo; //前五航线承运商分布
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //承运商分析
    var carAnysis = {
        selChecked: 0,
        init: function () {
            var _carAnysisSelID = $('#carAnysisSelID'),
            _carAnysiExID = $('#carAnysiExID'),
            _f = [];

            _carAnysisSelID.css('display', '');
            _carAnysisSelID.empty();
            //判断国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightCarriers.js_Domestic + '</label>');
                _f.push('<label><input type="radio" name="option" value="1">' + corpReport_FlightCarriers.js_International + '</label>');
                _carAnysisSelID.append(_f.join(""));
                //
                carAnysis.dwCarAny(0);
                _carAnysisSelID.find('input').bind('change', carAnysis.onSelectChange);
            } else if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "F") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightCarriers.js_Domestic + '</label>');
                _carAnysisSelID.append(_f.join(""));
                //
                carAnysis.dwCarAny(0);
            } else if (_cfgInfo.HasInAirTicketProduct == "F" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="1" checked>' + corpReport_FlightCarriers.js_International + '</label>');
                _carAnysisSelID.append(_f.join(""));
                //
                carAnysis.dwCarAny(1);
            } else {
                _carAnysisSelID.css('display', 'none');
                _carAnysiExID.css('display', 'none');
            }
        },
        dwCarAny: function (index) {
            //0国内 1国际
            carAnysis.clearAll();
            if (index == 0) {
                carAnysis.drawHead();
                carAnysis.drawBody(_carAnyInfo.DomCarrierInfo);
                carAnysis.drawFooter(_carAnyInfo.DomTotalInfo);
            } else {
                carAnysis.drawHead();
                carAnysis.drawBody(_carAnyInfo.IntCarrierInfo);
                carAnysis.drawFooter(_carAnyInfo.IntTotalInfo);
            }
        },
        drawHead: function () {
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#carAnysisID').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', carAnysis.onHeadClick);
            //
            var _str = ['<tr>'];
            _str.push('<th width="25%">' + corpReport_FlightCarriers.js_Carriers + '</th>');
            _str.push('<th width="15%">' + corpReport_FlightCarriers.js_Tickets + '</th>');
            _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="NetPrice">' + corpReport_FlightCarriers.js_NetPrice + ' <i class="icon i7"></i></th>');
            _str.push('<th width="20%">' + corpReport_FlightCarriers.js_PerofNetPrice + '</th>');
            _str.push('<th width="20%">' + corpReport_FlightCarriers.js_ExpensesIncTax + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#carAnysisID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="25%" align="left">' + data[i].Name + '</td>');
                    _str.push('<td width="15%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].NetPrice, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.percData(data[i].NetPercent) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFooter: function (data) {
            var _footer = $('<table><tfoot id="footerTableID"></tfoot></table>');
            $('#carAnysisID').append(_footer);
            var _str = ['<tr>'];
            _str.push('<td width="25%" align="left">' + corpReport_FlightCarriers.js_Total + '</td>');
            _str.push('<td width="15%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolNetPrice, 0) + '</td>');
            _str.push('<td width="20%">-</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
            _str.push('<td class="null_place"><div></div></td></tr>')
            $('#footerTableID').append(_str.join(""));
        },
        onSelectChange: function () {
            carAnysis.clearAll();
            var _fiveCarrID = $('#fiveCarrID'),
            _fiveRouteID = $('#fiveRouteID');

            if ($(this).val() == "0") {
                //国内
                carAnysis.selChecked = 0;
                carAnysis.dwCarAny(0);
                //前五承运商
                fiveFltCarr.drawPie(_fiveCarrID, _flightFiveCarInfo.DomCarrierInfo);
                //前五城市航线,存在才绘制
                if (_cfgInfo.HasAirlineTop5 == "T") {
                    fiveRouteCarr.drawBarChart(_fiveRouteID, _fiveRouteInfo.DomFiveCPInfo);
                    fiveRouteCarr.drawTolInfo(_fiveRouteInfo.DomFiveCPInfo);
                }
            } else {
                //国际
                carAnysis.selChecked = 1;
                carAnysis.dwCarAny(1);
                //前五承运商
                fiveFltCarr.drawPie(_fiveCarrID, _flightFiveCarInfo.IntCarrierInfo);
                //前五城市航线,存在才绘制
                if (_cfgInfo.HasAirlineTop5 == "T") {
                    fiveRouteCarr.drawBarChart(_fiveRouteID, _fiveRouteInfo.IntFiveCPInfo);
                    fiveRouteCarr.drawTolInfo(_fiveRouteInfo.IntFiveCPInfo);
                }
            }
        },
        sortArray: function (content, type) {
            var data = (carAnysis.selChecked == 0) ? _carAnyInfo.DomCarrierInfo : _carAnyInfo.IntCarrierInfo;
            if (data) {
                return data.sort(function (a, b) {
                    if (type == "Desc") {
                        //降序
                        return b[content.attr("pInfo")] - a[content.attr("pInfo")];
                    } else {
                        //升序
                        return a[content.attr("pInfo")] - b[content.attr("pInfo")];
                    }
                });
            }
        },
        onHeadClick: function (event) {
            var sortedData,
                content = $(this);
            if (content.hasClass("sequence")) {
                //从大大小和从小到大的切换
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = carAnysis.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = carAnysis.sortArray(content, "Desc");
                }
            }

            //重新绘制body和footer
            carAnysis.clearBdFt();
            carAnysis.drawBody(sortedData);
            carAnysis.drawFooter((carAnysis.selChecked == 0) ? _carAnyInfo.DomTotalInfo : _carAnyInfo.IntTotalInfo);
        },
        clearBdFt: function () {
            //清除Body和footer
            $('#bodyTableID').parent().parent().remove();
            $('#footerTableID').parent().remove();
        },
        clearAll: function () {
            $('#carAnysisID').empty();
        }
    };

    //前五承运商分布
    var fiveFltCarr = {
        init: function () {
            var _fiveCarrID = $('#fiveCarrID');
            //初始绘制国内
            fiveFltCarr.drawPie(_fiveCarrID, _flightFiveCarInfo.DomCarrierInfo);
        },
        drawPie: function (content, dt, _width, _height) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = "成交净价";
            _d.data = fiveFltCarr.getData(dt);
            data[0] = _d;

            //no data
            content.empty();
            if (_d.data.length > 0) {
                content.highcharts({
                    colors: ['#668fe5', '#7fdaff', '#93e893', '#ffe78d', '#ffacac', '#ff85b0'],
                    title: {
                        text: null
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            borderWidth: 0,
                            size: '65%',
                            center: ['60%', '30%'],
                            showInLegend: true,
                            dataLabels: {
                                enabled: false,
                                distance: 5,
                                connectorWidth: 0,
                                formatter: function () {
                                    return this.point.name + '<br/>' +
                                   CM.fixData.transData(this.point.y, 0);
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.name + '</b><br/>' +
                            corpReport_FlightCarriers.js_NetPrice + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_FlightCarriers.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
                        },
                        style: {
                            lineHeight: '18px'
                        }
                    },
                    legend: {
                        floating: true,
                        borderWidth: 0,
                        shadow: false,
                        y: 14,
                        x: 0,
                        align: 'left',
                        verticalAlign: 'bottom',
                        layout: 'vertical',
                        labelFormatter: function () {
                            return this.name + ' ' + this.percentage.toFixed(1) + '%';
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: data
                });
            } else {
                CM.LineHeightFix(content);
            }

        },
        getData: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                var _s = {};
                _s.name = data[i].Name;
                _s.y = data[i].Price;
                _d[i] = _s;
            }
            return _d;
        }
    };

    //前5航线承运商分布
    var fiveRouteCarr = {
        init: function () {
            var _fiveRouteID = $('#fiveRouteID'),
            _fiveRouteTolID = $('#fiveRouteTolID');

            _fiveRouteID.css('display', '');
            _fiveRouteTolID.css('display', '');

            //前五城市对 开关
            if (_cfgInfo.HasAirlineTop5 == "T") {
                //初始绘制国内
                fiveRouteCarr.drawBarChart($('#fiveRouteID'), _fiveRouteInfo.DomFiveCPInfo);
                fiveRouteCarr.drawTolInfo(_fiveRouteInfo.DomFiveCPInfo);
            } else {
                _fiveRouteTolID.css('display', 'none');
                //charge
                CM.ChargeFix(_fiveRouteID, "payment1.jpg", lanType);
            }
        },
        drawBarChart: function (content, dt) {
            var xData = fiveRouteCarr.getXSeries(dt),
            yData = fiveRouteCarr.getYSeries(dt);

            //no data
            content.empty();
            if (yData.length > 0) {
                content.highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: xData,
                        title: {
                            text: null
                        },
                        tickLength: 2
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true,
                        formatter: function () {
                            var _p = this.points,
                        _str = '<b>' + this.x + '</b><br/>';
                            for (var i = _p.length - 1; i >= 0; i--) {
                                if (_p[i].y > 0) {
                                    _str = _str + _p[i].series.name + ': ' + CM.fixData.percData(_p[i].y) + '<br/>';
                                }
                            }
                            return _str;
                        }
                    },
                    plotOptions: {
                        bar: {
                            stacking: 'normal',
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    if (this.y != 0 && this.y > 0.02) {
                                        return ((this.y) * 100).toFixed(0) + '%';
                                    }
                                }
                            },
                            borderRadius: 0.5,
                            pointWidth: 30
                        }
                    },
                    series: yData
                })
            } else {
                CM.LineHeightFix(content);
            }

        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].CP;
            }
            return _d;
        },
        getYSeries: function (data) {
            var _d = [],
            _mk = 0,
            _a = [];

            //数据条数没出
            for (var i = 0; i < data.length; i++) { _a.push(0); }

            for (var i = 0; i < data.length; i++) {
                var _dJ = data[i].Data;
                for (var j = _dJ.length - 1; j >= 0; j--) {
                    var _s = {},
                    _stAr = _a.slice(0);
                    _s.name = _dJ[j].CarrName;
                    _stAr[i] = _dJ[j].Percent;
                    _s.data = _stAr;
                    _s.color = _dJ[j].Color;
                    _d[_mk++] = _s;

                }
            }
            return _d;
        },
        drawTolInfo: function (dt) {
            var _fiveRouteTolID = $('#fiveRouteTolID'),
            _r = [],
            _c = "";

            _fiveRouteTolID.empty();
            var _ul = $('<ul></ul>');
            _c = "bar" + dt.length;
            if (dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    _r.push('<li class="' + _c + '"><span>' + CM.fixData.transData(dt[i].Number, 0) + '</span>' + corpReport_FlightCarriers.js_Ticket + '</li>');
                }
                _ul.append(_r.join(""));
            }
            _fiveRouteTolID.append(_ul);
        }
    };

    //
    var flightCarriersInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();

        //初始赋值
        _flightCarriersInfo = {"CarAnyInfo":{"DomTotalInfo":{"TolNumber":49,"TolNetPrice":32139,"TolPrice":40419},"DomCarrierInfo":[{"Name":"中国东方航空","Number":15,"NetPrice":8770,"NetPercent":0.273,"Price":11100},{"Name":"中国南方航空","Number":8,"NetPrice":5664,"NetPercent":0.176,"Price":7124},{"Name":"上海航空","Number":8,"NetPrice":5073,"NetPercent":0.158,"Price":6563},{"Name":"中国国际航空","Number":5,"NetPrice":5040,"NetPercent":0.157,"Price":5960},{"Name":"上海吉祥航空","Number":7,"NetPrice":3130,"NetPercent":0.097,"Price":4340},{"Name":"海南航空","Number":1,"NetPrice":2100,"NetPercent":0.065,"Price":2210},{"Name":"天津航空","Number":2,"NetPrice":872,"NetPercent":0.027,"Price":1172},{"Name":"深圳航空","Number":2,"NetPrice":780,"NetPercent":0.024,"Price":1120},{"Name":"山东航空","Number":1,"NetPrice":710,"NetPercent":0.022,"Price":830}],"IntTotalInfo":{"TolNumber":10,"TolNetPrice":27160,"TolPrice":39974},"IntCarrierInfo":[{"Name":"国泰航空","Number":4,"NetPrice":9760,"NetPercent":0.359,"Price":13396},{"Name":"中国东方航空","Number":3,"NetPrice":8970,"NetPercent":0.33,"Price":12819},{"Name":"加拿大航空","Number":1,"NetPrice":3800,"NetPercent":0.14,"Price":6539},{"Name":"泰国国际航空","Number":1,"NetPrice":2610,"NetPercent":0.096,"Price":3911},{"Name":"中国国际航空","Number":1,"NetPrice":2020,"NetPercent":0.074,"Price":3309}]},"FlightFiveCarInfo":{"DomCarrierInfo":[{"Name":"中国东方航空","Price":8770},{"Name":"中国南方航空","Price":5664},{"Name":"上海航空","Price":5073},{"Name":"中国国际航空","Price":5040},{"Name":"上海吉祥航空","Price":3130},{"Name":"其他","Price":4462}],"IntCarrierInfo":[{"Name":"国泰航空","Price":9760},{"Name":"中国东方航空","Price":8970},{"Name":"加拿大航空","Price":3800},{"Name":"泰国国际航空","Price":2610},{"Name":"中国国际航空","Price":2020}]},"FiveRouteInfo":{"DomFiveCPInfo":[{"CP":"北京-上海","Number":7,"Data":[{"CarrName":"中国东方航空股份有限公司","Percent":0.571,"Number":4,"Color":"#398eff"},{"CarrName":"中国国际航空股份有限公司","Percent":0.286,"Number":2,"Color":"#56a0ff"},{"CarrName":"上海航空有限公司","Percent":0.143,"Number":1,"Color":"#79b3ff"}]},{"CP":"上海-广州","Number":6,"Data":[{"CarrName":"中国东方航空股份有限公司","Percent":0.333,"Number":2,"Color":"#398eff"},{"CarrName":"中国国际航空股份有限公司","Percent":0.333,"Number":2,"Color":"#56a0ff"},{"CarrName":"中国南方航空股份有限公司","Percent":0.333,"Number":2,"Color":"#9ec8ff"}]},{"CP":"上海-贵阳","Number":4,"Data":[{"CarrName":"上海吉祥航空股份有限公司","Percent":0.5,"Number":2,"Color":"#c5dfff"},{"CarrName":"中国东方航空股份有限公司","Percent":0.5,"Number":2,"Color":"#398eff"}]},{"CP":"上海-安庆","Number":4,"Data":[{"CarrName":"中国东方航空股份有限公司","Percent":1,"Number":4,"Color":"#398eff"}]},{"CP":"上海-大连","Number":4,"Data":[{"CarrName":"上海航空有限公司","Percent":0.75,"Number":3,"Color":"#79b3ff"},{"CarrName":"中国南方航空股份有限公司","Percent":0.25,"Number":1,"Color":"#9ec8ff"}]}],"IntFiveCPInfo":[{"CP":"上海-香港-普吉岛-香港-上海","Number":4,"Data":[{"CarrName":"国泰航空公司","Percent":1,"Number":4,"Color":"#e5f1ff"}]},{"CP":"上海-巴黎-罗马-巴黎-上海","Number":1,"Data":[{"CarrName":"中国东方航空股份有限公司","Percent":1,"Number":1,"Color":"#398eff"}]},{"CP":"上海-多伦多-上海","Number":1,"Data":[{"CarrName":"加拿大航空公司","Percent":1,"Number":1,"Color":"#ffa60c"}]},{"CP":"上海-曼谷-上海","Number":1,"Data":[{"CarrName":"泰国国际航空公司","Percent":1,"Number":1,"Color":"#feba3b"}]},{"CP":"澳门-上海","Number":1,"Data":[{"CarrName":"中国东方航空股份有限公司","Percent":1,"Number":1,"Color":"#398eff"}]}]}};
        //初始赋值
        _carAnyInfo = _flightCarriersInfo.CarAnyInfo;
        _flightFiveCarInfo = _flightCarriersInfo.FlightFiveCarInfo;
        _fiveRouteInfo = _flightCarriersInfo.FiveRouteInfo;
        //初始化
        carAnysis.init();
        fiveFltCarr.init();
        fiveRouteCarr.init();
        //
        noDataID.unmask();
    }
    //☆=================== Fun E ===================☆
    //
    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#fliSubNavID').find('a'), _headSelectInfo);
        flightCarriersInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问承运商
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(4);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);