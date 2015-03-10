(function ($) {
    //code by dstar
    //☆=================== var S ===================☆
    //var pageName = ["总概"];
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    function headInit() {
        $('.CT_header').empty().html($('#headTmpl').tmpl(PDFConfig.headInfo));
    }

    function drawBar(content, dt, cfg) {
        content.highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: dt.xData,
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
                },
                plotLines: [{
                    color: '#C0D0E0',
                    width: 1,
                    value: 0
                }],
                max: dt.maxY ? dt.maxY : null
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return '<b>¥</b> ' + CM.fixData.transData(this.y, 0);
                        },
                        crop: false,
                        overflow: "none",
                        style: {
                            color: '#666'
                        }
                    },
                    //minPointLength: 3,
                    borderRadius: 0.5,
                    pointWidth: (cfg && cfg.pointWidth) || 40
                },
                series: {
                    borderWidth: 0,
                    colorByPoint: true
                }
            },
            series: dt.yData
        });
    }

    function drawColumn(content, dt, cfg) {
        content.highcharts({
            chart: {
                type: 'column',
                marginBottom: cfg.marginBottom || 48
            },
            title: {
                text: null
            },
            xAxis: {
                categories: dt.xData,
                tickInterval: (parseInt(dt.xData.length / 10) + 1),
                tickLength: 2
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 0,
                min: cfg.minY ? cfg.minY : null,
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#C0D0E0',
                    width: 1,
                    value: 0
                }]
            },
            legend: {
                y: 11,
                x: 0,
                floating: true,
                borderWidth: 0,
                shadow: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderWidth: 0,
                    minPointLength: 3,
                    borderRadius: 0.5,  //设置柱状图的圆角，美观 
                    pointWidth: cfg.pointWidth ? cfg.pointWidth : 25
                    //groupPadding: 3 
                }
            },
            credits: {
                enabled: false
            },
            series: dt.yData
        });
    }

    function drawPie(content, dt, cfg) {
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
                    showInLegend: true,
                    size: '70%',
                    center: ['50%', '32%'],
                    dataLabels: {
                        enabled: cfg.dataLabelEnabled || false,
                        distance: 5,
                        connectorWidth: 0,
                        formatter: function () {
                            if (this.percentage > 0) {
                                return this.point.name + ': ' + this.percentage.toFixed(1) + '%';
                            }
                        }
                    }
                }
            },
            tooltip: {
                enabled: false
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
                    return cfg.legendLabel || (this.name + ' ' + this.percentage.toFixed(1) + '%  ¥' + CM.fixData.transData(this.y, 0));
                }
            },
            credits: {
                enabled: false
            },
            series: dt
        });
    }

    function drawLine(content, dt, cfg) {
        content.highcharts({
            chart: {
                type: 'line',
                marginBottom: cfg.marginBottom || 48
            },
            title: {
                text: null
            },
            xAxis: {
                categories: dt.xData,
                tickInterval: (parseInt(dt.xData.length / 10) + 1),
                tickLength: 2
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 0,
                min: cfg.minY ? cfg.minY : null,
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#C0D0E0',
                    width: 1,
                    value: 0
                }]
            },
            legend: {
                y: 11,
                x: 0,
                floating: true,
                borderWidth: 0,
                shadow: false
            },
            tooltip: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: dt.yData
        });
    }

    var DTM = {
        columnDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                var _iData = dt[i].Data;
                for (var j = 0; j < _iData.length; j++) {
                    if (_iData[j].Value != 0) { return false; }
                }
            }
            return true;
        },
        fixColumnData: function (dt) {
            var _x = [], _y = [];
            for (var m = 0; m < dt.length; m++) {
                var md = dt[m].Data, tmpY = [];
                for (var n = 0; n < md.length; n++) {
                    (0 == m) && (_x.push(md[n].Key));
                    tmpY.push({ y: md[n].Value });
                }
                _y.push({
                    color: dt[m].Color,
                    name: dt[m].Name,
                    data: tmpY
                });
            }
            return {
                xData: _x, yData: _y
            };
        },
        barDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data != 0) { return false; }
            }
            return true;
        },
        fixBarData: function (dt) {
            var _x = [], _y = [], _maxY = 0;

            for (var i = 0; i < dt.length; i++) {
                _x.push(dt[i].Name);
                _y.push({
                    y: dt[i].Data,
                    color: dt[i].Color
                });
                //
                if (dt[i].Data > _maxY) { _maxY = dt[i].Data; }
            }
            //
            _maxY = parseInt(_maxY * 1.2);
            return {
                xData: _x,
                yData: [{ data: _y}],
                maxY: _maxY
            };
        },
        fixColTableData: function (dt, cfg) {
            var thd = [], tbd = [];
            for (var i = 0; i < dt.length; i++) {
                var md = dt[i].Data, tmpD = [];
                for (var j = 0; j < md.length; j++) {
                    (0 == i) && (thd.push(md[j].Key));
                    tmpD.push(cfg.tbodyVal(md[j].Value));
                }
                tbd.push({
                    Key: dt[i].Name,
                    Value: tmpD
                });
            }
            return {
                thead: { Key: cfg.theadKey || "", Value: thd },
                tbody: tbd
            };
        }
    }

    //
    var SumPage = (function (aInfo, cfgInfo) {
        var sp = {
            init: function () {
                //sp.initTitle();
                sp.initChart();
            },
            initTitle: function () {
                $('.CT_SumPageTitle').empty().html($('#pageTitleTmpl').tmpl({ pTitle: pageName[0] }));
            },
            initChart: function () {
                //bar
                var sp_asc = $('#sp_allConsumSID'), barD = sp.getBarData(),
                    sp_acm = $('#sp_allConsumMID'), colD = sp.getColumData(),
                    sp_dep = $('#sp_fiveDepConsum'), sp_des = $('#sp_fiveDesConsum'),
                    sp_f = $('#sp_flight'), fD = sp.getFlightData(),
                    sp_fl = $('#sp_flightList'), sp_h = $('#sp_hotel'),
                    hD = sp.getHotelData(), sp_hl = $('#sp_hotelList');
                //
                sp_asc.empty(); sp_acm.empty();
                sp_dep.empty(); sp_des.empty();
                sp_f.empty(); sp_h.empty();
                //bar
                (DTM.barDataEmpty(barD)) ? CM.LineHeightFix(sp_asc) : drawBar(sp_asc, DTM.fixBarData(barD), { pointWidth: 25 });
                //col
                if (DTM.columnDataEmpty(colD)) {
                    CM.LineHeightFix(sp_acm);
                } else {
                    drawColumn(sp_acm, DTM.fixColumnData(colD), { pointWidth: 30 });
                    //table
                    $('#sp_allConsumTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(colD, { tbodyVal: function (dt) { return "¥" + CM.fixData.transData(dt); } })));
                    //css
                    $('#sp_allConsumTable').find('table').addClass("data-table center mb30");
                }
                //top 5 dep
                if (cfgInfo.HasTotalTop5 == "T") {
                    if (aInfo.FiveDepConsumInfo.length > 0) {
                        drawPie(sp_dep, sp.fixPieData(aInfo.FiveDepConsumInfo), {});
                    } else {
                        CM.LineHeightFix(sp_dep);
                    }
                } else {
                    CM.ChargeFix(sp_dep, "payment15.jpg", PDFConfig.lanType);
                }
                //top 5 des
                (aInfo.FiveDesConsumInfo.length > 0) ? drawPie(sp_des, sp.fixPieData(aInfo.FiveDesConsumInfo), {}) : CM.LineHeightFix(sp_des);
                //flight
                if (DTM.columnDataEmpty(fD)) {
                    CM.LineHeightFix(sp_f);
                } else {
                    drawColumn(sp_f, DTM.fixColumnData(fD), { pointWidth: 30 });
                    //table
                    $('#sp_flightTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(fD, { tbodyVal: function (dt) { return "¥" + CM.fixData.transData(dt); } })));
                    //css
                    $('#sp_flightTable').find('table').addClass("data-table center");
                }
                //flt list
                sp_fl.empty().html($('#sp_listTmpl').tmpl(aInfo.FlightInfo));
                //hotel
                if (DTM.columnDataEmpty(hD)) {
                    CM.LineHeightFix(sp_h);
                } else {
                    drawColumn(sp_h, DTM.fixColumnData(hD), { pointWidth: 30 });
                    //table
                    $('#sp_hotelTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(hD, { tbodyVal: function (dt) { return "¥" + CM.fixData.transData(dt); } })));
                    //
                    $('#sp_hotelTable').find('table').addClass("data-table center");
                }
                //htl list
                sp_hl.empty().html($('#sp_listTmpl').tmpl(aInfo.HotelInfo));
            },
            getBarData: function () {
                var arr = [];
                arr.push({
                    Name: "火车票",
                    Data: aInfo.SumInfo.TrainPrice,
                    Color: '#00cd9f'
                });
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.ArgHotelPrice,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelPrice,
                        Color: '#ffa60c'
                    });
                }
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InterFlightPrice,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightPrice,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            getColumData: function () {
                var arr = [];
                arr.push({
                    Name: "火车票",
                    Data: aInfo.SumInfo.TrainInfo,
                    Color: '#00cd9f'
                });
                //
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.AgrHotelInfo,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelInfo,
                        Color: '#ffa60c'
                    });
                }
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InteFlightInfo,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightInfo,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            fixPieData: function (dt) {
                var d = [];
                for (var i = 0; i < dt.length; i++) {
                    d.push({ name: dt[i].Key, y: dt[i].Value });
                }
                return [{
                    type: "pie",
                    name: "消费金额",
                    data: d
                }];
            },
            getFlightData: function () {
                var arr = [];
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InteFlightInfo,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightInfo,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            getHotelData: function () {
                var arr = [];
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.AgrHotelInfo,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelInfo,
                        Color: '#ffa60c'
                    });
                }
                return arr;
            }
        }

        return {
            init: sp.init
        };
    })(PageInfo.SumPageInfo, PDFConfig.cfgInfo);
    //
    var FlightPage = (function (aInfo, cfgInfo) {
        var fp = {
            init: function () {
                var sp_bm = $('#fp_bkMethod'), bkmD = fp.getbkMothodData(),
                    fp_fpd = $('#fp_fiveDepDom'), fp_fpi = $('#fp_fiveDepInt'),
                    fp_fsd = $('#fp_fiveDesDom'), fp_fsi = $('#fp_fiveDesInt'),
                    fp_fc = $('#fp_fltConsum'), fcD = fp.getFltData(),
                    fp_fcf = $('#fp_fltChangeFee'), fcfD = fp.getFltFeeData(),
                    fp_fcr = $('#fp_fltChangeRate'), fcrD = fp.getFltRateData();
                //
                sp_bm.empty(); fp_fpd.empty(); fp_fpi.empty();
                fp_fsd.empty(); fp_fsi.empty();
                fp_fcf.empty(); fp_fcr.empty();
                //
                if (DTM.columnDataEmpty(bkmD)) {
                    CM.LineHeightFix(sp_bm);
                } else {
                    drawColumn(sp_bm, DTM.fixColumnData(bkmD), { pointWidth: 36 });
                    //table
                    $('#fp_bkmTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(bkmD, { tbodyVal: function (dt) { return CM.fixData.transData(dt) + "张"; }, theadKey: "预订方式" })));
                    $('#fp_bkmTable').find('table').addClass("data-table center");
                }
                //dom
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    var _depDom = aInfo.FltFiveDepInfo.DomFltInfo, _desDom = aInfo.FltFiveDesInfo.DomFltInfo;
                    if (cfgInfo.HasFltTop5 == "T") {
                        CM.ChargeFix(fp_fpd, "payment4.jpg", PDFConfig.lanType);
                    } else {
                        (_depDom && _depDom.length > 0) ? drawPie(fp_fpd, fp.fixPieData(_depDom), {}) : CM.LineHeightFix(fp_fpd);
                    }
                    //
                    (_desDom && _desDom.length > 0) ? drawPie(fp_fsd, fp.fixPieData(_desDom), {}) : CM.LineHeightFix(fp_fsd);
                } else {
                    CM.ChargeFix(fp_fpd, "payment4.jpg", PDFConfig.lanType);
                    CM.ChargeFix(fp_fsd, "payment4.jpg", PDFConfig.lanType);
                }
                //inte
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    var _depInte = aInfo.FltFiveDepInfo.InteFltInfo, _desInte = aInfo.FltFiveDesInfo.InteFltInfo;
                    //
                    if (cfgInfo.HasFltTop5 == "T") {
                        CM.ChargeFix(fp_fpi, "payment4.jpg", PDFConfig.lanType);
                    } else {
                        (_depInte && _depInte.length > 0) ? drawPie(fp_fpi, fp.fixPieData(_depInte), {}) : CM.LineHeightFix(fp_fpi);
                    }
                    //
                    (_desInte && _desInte.length > 0) ? drawPie(fp_fsi, fp.fixPieData(_desInte), {}) : CM.LineHeightFix(fp_fsi);
                } else {
                    CM.ChargeFix(fp_fpi, "payment4.jpg", PDFConfig.lanType);
                    CM.ChargeFix(fp_fsi, "payment4.jpg", PDFConfig.lanType);
                }
                //
                if (DTM.columnDataEmpty(fcD)) {
                    CM.LineHeightFix(fp_fc);
                } else {
                    drawColumn(fp_fc, DTM.fixColumnData(fcD), { pointWidth: 32 });
                    $('#fp_fltTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(fcD, { tbodyVal: function (dt) { return "¥" + CM.fixData.transData(dt); } })));
                    $('#fp_fltTable').find('table').addClass("data-table center mb30");
                }
                //
                if (cfgInfo.HasFltBack == "T") {
                    //退改费
                    if (DTM.columnDataEmpty(fcfD)) {
                        CM.LineHeightFix(fp_fcf);
                    } else {
                        drawColumn(fp_fcf, DTM.fixColumnData(fcfD), { pointWidth: 36 });
                        $('#fp_fltFeeTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(fcfD, { tbodyVal: function (dt) { return "¥" + CM.fixData.transData(dt); } })));
                        $('#fp_fltFeeTable').find('table').addClass("data-table center mb30");
                    }
                    //退概率
                    if (DTM.columnDataEmpty(fcrD)) {
                        CM.LineHeightFix(fp_fcr);
                    } else {
                        drawLine(fp_fcr, DTM.fixColumnData(fcrD), {});
                        $('#fp_fltRateTable').empty().html($('#tableTmpl').tmpl(DTM.fixColTableData(fcrD, { tbodyVal: function (dt) { return (dt * 100).toFixed(1) + "%"; } })));
                        $('#fp_fltRateTable').find('table').addClass("data-table center mb30");
                    }
                } else {
                    CM.ChargeFix(fp_fcf, "payment5.jpg", PDFConfig.lanType); CM.ChargeFix(fp_fcr, "payment5.jpg", PDFConfig.lanType);
                }
            },
            getbkMothodData: function () {
                var arr = [];
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.BkMethodInfo.InteOrders,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.BkMethodInfo.DomOrders,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            fixPieData: function (dt) {
                var d = [];
                for (var i = 0; i < dt.length; i++) {
                    d.push({ name: dt[i].Key, y: dt[i].Value });
                }
                return [{
                    type: "pie",
                    name: "消费金额",
                    data: d
                }];
            },
            getFltData: function () {
                var arr = [];
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.FlightInfo.InteFltInfo,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.FlightInfo.DomFltInfo,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            getFltFeeData: function () {
                return [{
                    Name: "改签费",
                    Data: aInfo.BkChangeInfo.FltChangeFee,
                    Color: '#79b3ff'
                }, {
                    Name: "退票费",
                    Data: aInfo.BkChangeInfo.FltBackFee,
                    Color: '#1c76ec'
                }];
            },
            getFltRateData: function () {
                return [{
                    Name: "改签率",
                    Data: aInfo.BkChangeInfo.FltChangeRate,
                    Color: '#79b3ff'
                }, {
                    Name: "退票率",
                    Data: aInfo.BkChangeInfo.FltBackRate,
                    Color: '#1c76ec'
                }];
            }
        }

        return {
            init: fp.init
        };
    })(PageInfo.FlightPageInfo, PDFConfig.cfgInfo);

    var FlightDepAny = (function(aInfo, cfgInfo) {
        var fda = {
            init: function() {
                var domD = fda.getDomDepData(aInfo.DomDepInfo),
                    fda_dp = $('#fda_domDepart'),
                    intD = fda.getInteDepData(aInfo.InteDepInfo),
                    fda_id = $('#fda_inteDepart');

                //国内
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    if (domD.tbody.length > 0) {
                        fda_dp.empty().html($('#a_tableTmpl').tmpl(domD));
                        fda_dp.find('table').addClass("table-2 center mb20");
                    } else {
                        CM.LineHeightFix(fda_dp);
                    }
                } else {
                    CM.ChargeFix(fda_dp, "payment16.jpg", PDFConfig.lanType);
                }
                //国际
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    if (intD.tbody.length > 0) {
                        fda_id.empty().html($('#a_tableTmpl').tmpl(intD))
                        fda_id.find('table').addClass("table-2 center mb20");
                    } else {
                        CM.LineHeightFix(fda_id);
                    }
                } else {
                    CM.ChargeFix(fda_id, "payment16.jpg", PDFConfig.lanType);
                }
            },
            getDomDepData: function(dt) {
                var tbd = [],
                    f = dt.ToltalInfo;
                for (var i = 0; i < dt.PartInfo.length; i++) {
                    var _ = dt.PartInfo[i];
                    tbd.push([_.DepName, CM.fixData.transData(_.Price, 0), CM.fixData.transData(_.Numbers, 0), _.AvgDiscount, CM.fixData.percData(_.FullPerc), CM.fixData.transData(_.Save, 0), CM.fixData.percData(_.SaveRate), CM.fixData.transData(_.Loss, 0), CM.fixData.percData(_.LossRate)]);
                }
                return {
                    thead: ["部门", "金额", "张数", "平均折扣", "全价票比例", "节省", "节省率", "损失", "损失率"],
                    tbody: tbd,
                    tfoot: ["总计", CM.fixData.transData(f.TolPrice, 0), CM.fixData.transData(f.TolNumbers, 0), f.TolAvgDiscount, CM.fixData.percData(f.TolFullPer), CM.fixData.transData(f.TolSave, 0), CM.fixData.percData(f.TolSaveRate), CM.fixData.transData(f.TolLoss, 0), CM.fixData.percData(f.TolLossRate)]
                };
            },
            getInteDepData: function(dt) {
                var tbd = [],
                    b = dt.PartInfo,
                    f = dt.TotalInfo;
                for (var i = 0; i < b.length; i++) {
                    var _ = b[i];
                    tbd.push([_.DepName, CM.fixData.transData(_.Price, 0), CM.fixData.transData(_.Numbers, 0), _.IntMilAvgPrice, CM.fixData.transData(_.Save, 0), CM.fixData.percData(_.SaveRate)]);
                }
                return {
                    thead: ["部门", "金额", "张数", "国际里程平均价", "节省", "节省率"],
                    tbody: tbd,
                    tfoot: ["总计", CM.fixData.transData(f.TolPrice, 0), CM.fixData.transData(f.TolNumbers, 0), f.TolIntMilAvgPrice, CM.fixData.transData(f.TolSave, 0), CM.fixData.percData(f.TolSaveRate)]
                }
            }
        }

        return {
            init: fda.init
        };
    })(PageInfo.FlightDepAnyInfo, PDFConfig.cfgInfo);

    var FlightPsgerAny = (function (aInfo, cfgInfo) {
        var fpa = {
            init: function () {
                var domD = fpa.getDomPsgerData(aInfo.DomPsgerInfo), fpa_dp = $('#fpa_domPsg'),
                    inteD = fpa.getIntePsgerData(aInfo.IntePsgerInfo), fpa_ip = $('#fpa_intePsg');
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    if (domD.tbody.length > 0) {
                        fpa_dp.empty().html($('#a_tableTmpl').tmpl(domD));
                        fpa_dp.find('table').addClass("table-2 table-interleave center mb20");
                    } else { CM.LineHeightFix(fpa_dp); }
                } else { CM.ChargeFix(fpa_dp, "payment2.jpg", PDFConfig.lanType); }
                //
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    if (inteD.tbody.length > 0) {
                        fpa_ip.empty().html($('#a_tableTmpl').tmpl(inteD));
                        fpa_ip.find('table').addClass("table-2 table-interleave center mb20");
                    } else { CM.LineHeightFix(fpa_ip); }
                } else { CM.ChargeFix(fpa_ip, "payment2.jpg", PDFConfig.lanType); }
            },
            getDomPsgerData: function (dt) {
                var tbd = [];
                for (var i = 0; i < dt.length; i++) {
                    var _ = dt[i];
                    tbd.push([_.PsgerName, _.DepName, CM.fixData.transData(_.Price, 0), CM.fixData.transData(_.Numbers, 0), _.AvgDiscount, CM.fixData.percData(_.FullPerc), CM.fixData.transData(_.Save, 0), CM.fixData.percData(_.SaveRate), CM.fixData.transData(_.Loss, 0), CM.fixData.percData(_.LossRate)]);
                }
                return {
                    thead: ["乘客姓名", "所在部门", "金额", "张数", "平均折扣", "全票价比例", "节省", "节省率", "损失", "损失率"],
                    tbody: tbd
                };
            },
            getIntePsgerData: function (dt) {
                var tbd = [];
                for (var i = 0; i < dt.length; i++) {
                    var _ = dt[i];
                    tbd.push([_.PsgerName, _.DepName, CM.fixData.transData(_.Price, 0), CM.fixData.transData(_.Numbers, 0), _.IntMilAvgPrice, CM.fixData.transData(_.Save, 0), CM.fixData.percData(_.SaveRate)]);
                }
                return {
                    thead: ["乘客姓名", "所在部门", "金额", "张数", "里程平均价", "节省", "节省率"],
                    tbody: tbd
                };
            }
        };

        return {
            init: fpa.init
        }
    })(PageInfo.FlightPsgerAnyInfo, PDFConfig.cfgInfo);

    //☆=================== Fun E ===================☆
    //ready
    $(document).ready(function () {
        Highcharts && (Highcharts.SVGRenderer.prototype.Element.prototype.animate = Highcharts.SVGRenderer.prototype.Element.prototype.attr);
        //
        headInit();
        SumPage.init();
        FlightPage.init();
        FlightDepAny.init();
        FlightPsgerAny.init();
    });
})(jQuery);