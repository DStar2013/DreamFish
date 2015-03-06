(function ($) {
    //☆=================== var S ===================☆
    var _flightPsgerAnysisInfo, //页面数据
        _fPAnysisInfo_D_Y, //国内：乘客姓名-部门名称-价格-张数-平均折扣-全票价比例-节省-节省率-损失-损失率
        _fPAnysisInfo_D_N,
        _fPAnysisInfo_A_Y, //全部：部门名称-价格-张数-节省-节省率
        _fPAnysisInfo_A_N,
        _fPAnysisInfo_I_Y, //国际：部门名称-价格-张数-国际里程平均价-节省-节省率
        _fPAnysisInfo_I_N;
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //
    var fltPsgerAnysis = {
        selChecked: 1,
        keyupTime: null,
        bodyData: [],
        init: function () {
            var _fltPSelID = $('#fltPSelID'),
                _fltPsgAisID = $('#fltPsgAisID'),
                _contBossID = $('#contBossID'),
                _f = [];

            _fltPSelID.css('display', '');
            _fltPSelID.empty();
            fltPsgerAnysis.clearAll();
            //判断国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="0">' + corpReport_FlightPsgerAnysis.js_All + '</label>');
                _f.push('<label><input type="radio" name="option" checked value="1">' + corpReport_FlightPsgerAnysis.js_Domestic + '</label>');
                _f.push('<label><input type="radio" name="option" value="2">' + corpReport_FlightPsgerAnysis.js_International + '</label>');
                _fltPSelID.append(_f.join(""));
                //_fltPSelID.append('<label><input type="radio" name="option" value="0">全部</label><label><input type="radio" name="option" checked value="1">国内</label><label><input type="radio" name="option" value="2">国际</label>');
                fltPsgerAnysis.drawHead(1);
                fltPsgerAnysis.drawBody(1, _fPAnysisInfo_D_Y.Passengerinfo);
                _fltPSelID.find('input').bind('change', fltPsgerAnysis.onSelectChange);
            } else if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "F") {
                _f.push('<label><input type="radio" name="option" checked value="1">' + corpReport_FlightPsgerAnysis.js_Domestic + '</label>');
                _fltPSelID.append(_f.join(""));
                //_fltPSelID.append('<label><input type="radio" name="option" checked value="1">国内</label>');
                fltPsgerAnysis.drawHead(1);
                fltPsgerAnysis.drawBody(1, _fPAnysisInfo_D_Y.Passengerinfo);
            } else if (_cfgInfo.HasInAirTicketProduct == "F" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" checked value="2">' + corpReport_FlightPsgerAnysis.js_International + '</label>');
                _fltPSelID.append(_f.join(""));
                //_fltPSelID.append('<label><input type="radio" name="option" checked value="2">国际</label>');
                fltPsgerAnysis.drawHead(2);
                fltPsgerAnysis.drawBody(2, _fPAnysisInfo_I_Y.Passengerinfo);
            } else {
                _fltPSelID.css('display', 'none');
                _fltPsgAisID.css('display', 'none');
            }
            //.
            _contBossID.find('span').unbind('click');
            _contBossID.find('span').bind('click', fltPsgerAnysis.showDropDown);
            _contBossID.find('li').unbind('click');
            _contBossID.find('li').bind('click', fltPsgerAnysis.onDataClick);
            //
            $('#depName').bind('keyup', fltPsgerAnysis.keyupSearch);
            $('#psgerName').bind('keyup', fltPsgerAnysis.keyupSearch);
        },
        drawHead: function (index) {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#fltPsgAisID').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', fltPsgerAnysis.onHeadClick);
            //
            var _str = ['<tr>'];
            if (index == 0) {
                _str.push('<th width="20%">' + corpReport_FlightPsgerAnysis.js_Passenger + '</th>');
                _str.push('<th width="20%">' + corpReport_FlightPsgerAnysis.js_Department + '</th>');
                _str.push('<th width="15%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightPsgerAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Numbers">' + corpReport_FlightPsgerAnysis.js_Tickets + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Save">' + corpReport_FlightPsgerAnysis.js_Savings + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightPsgerAnysis.js_PerofSaving + '</th>');
            } else if (index == 1) {
                _str.push('<th width="8%">' + corpReport_FlightPsgerAnysis.js_Passenger + '</th>');
                _str.push('<th width="15%">' + corpReport_FlightPsgerAnysis.js_Department + '</th>');
                _str.push('<th width="10%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightPsgerAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="7%" ckMark="1" pInfo="Numbers">' + corpReport_FlightPsgerAnysis.js_Tickets + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="AvgDiscount">' + corpReport_FlightPsgerAnysis.js_AvgDiscount + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="FullPerc">' + corpReport_FlightPsgerAnysis.js_FullFareTicketRate + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Save">' + corpReport_FlightPsgerAnysis.js_Savings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightPsgerAnysis.js_PerofSaving + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Loss">' + corpReport_FlightPsgerAnysis.js_MissedSavings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="LossRate">' + corpReport_FlightPsgerAnysis.js_PerofMissedSavings + '</th>');
            } else {
                _str.push('<th width="20%">' + corpReport_FlightPsgerAnysis.js_Passenger + '</th>');
                _str.push('<th width="20%">' + corpReport_FlightPsgerAnysis.js_Department + '</th>');
                _str.push('<th width="15%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightPsgerAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Numbers">' + corpReport_FlightPsgerAnysis.js_Tickets + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="IntMilAvgPrice">' + corpReport_FlightPsgerAnysis.js_AverageMileagePrice + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Save">' + corpReport_FlightPsgerAnysis.js_Savings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightPsgerAnysis.js_PerofSaving + '</th>');
            }
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (index, data) {
            //body data
            fltPsgerAnysis.bodyData = data;
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#fltPsgAisID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    if (index == 0) {
                        _str.push('<td width="20%" align="left">' + data[i].PassengerName + '</td>');
                        _str.push('<td width="20%" align="left">' + data[i].DepartName + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                    } else if (index == 1) {
                        _str.push('<td width="8%" align="left">' + data[i].PassengerName + '</td>');
                        _str.push('<td width="15%" align="left">' + data[i].DepartName + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="7%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="10%">' + data[i].AvgDiscount + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].FullPerc) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Loss, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].LossRate) + '</td>');
                    } else {
                        _str.push('<td width="20%" align="left">' + data[i].PassengerName + '</td>');
                        _str.push('<td width="20%" align="left">' + data[i].DepartName + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="15%">' + data[i].IntMilAvgPrice + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                    }
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (index, data) {
            //绘制foot部分
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#fltPsgAisID').append(_foot);
            var _str = ['<tr>'];
            if (index == 0) {
                _str.push('<td width="20%" align="left">' + corpReport_FlightPsgerAnysis.js_Total + '</td>');
                _str.push('<td width="20%"></td>');
                _str.push('<td width="15%">' + data.TolPrice + '</td>');
                _str.push('<td width="15%">' + data.TolNumbers + '</td>');
                _str.push('<td width="15%">' + data.TolSave + '</td>');
                _str.push('<td width="15%">' + data.TolSaveRate + '</td>');
            } else if (index == 1) {
                _str.push('<td width="8%" align="left">' + corpReport_FlightPsgerAnysis.js_Total + '</td>');
                _str.push('<td width="15%"></td>');
                _str.push('<td width="10%">' + data.TolPrice + '</td>');
                _str.push('<td width="7%">' + data.TolNumbers + '</td>');
                _str.push('<td width="10%">' + data.TolAvgDiscount + '</td>');
                _str.push('<td width="10%">' + data.TolFullPer + '</td>');
                _str.push('<td width="10%">' + data.TolSave + '</td>');
                _str.push('<td width="10%">' + data.TolSaveRate + '</td>');
                _str.push('<td width="10%">' + data.TolLoss + '</td>');
                _str.push('<td width="10%">' + data.TolLossRate + '</td>');
            } else {
                _str.push('<td width="20%" align="left">' + corpReport_FlightPsgerAnysis.js_Total + '</td>');
                _str.push('<td width="20%"></td>');
                _str.push('<td width="15%">' + data.TolPrice + '</td>');
                _str.push('<td width="10%">' + data.TolNumbers + '</td>');
                _str.push('<td width="15%">' + data.IntMilAvgPrice + '</td>');
                _str.push('<td width="10%">' + data.TolSave + '</td>');
                _str.push('<td width="10%">' + data.TolSaveRate + '</td>');
            }
            _str.push('</tr>');
            $('#footTableID').append(_str.join(""));

        },
        onHeadClick: function (event) {
            var sortedData,
                _headTableID = $('#headTableID'),
                content = $(this);
            if (content.hasClass("sequence")) {
                //大到小
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = fltPsgerAnysis.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = fltPsgerAnysis.sortArray(content, "Desc");
                }
            } else {
                //清空所有头部
                _headTableID.find('th.sequence').removeClass("sequence");
                _headTableID.find('th').find('.icon').remove();
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = fltPsgerAnysis.sortArray(content, "Desc");
            }
            //重新绘制body和footer
            fltPsgerAnysis.clearBdFt();
            fltPsgerAnysis.drawBody(fltPsgerAnysis.selChecked, sortedData);
            //fltPsgerAnysis.drawFoot(fltPsgerAnysis.selChecked, _fPAnysisInfo1.TotalInfo);
        },
        sortArray: function (content, type) {
            var data = fltPsgerAnysis.bodyData;

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
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($(this).hasClass('click_on')) {
                $(this).next().css('display', 'none');
                $(this).removeClass('click_on');
            } else {
                $(this).next().css('display', '');
                $(this).addClass('click_on');
            }
        },
        hideDropDown: function (content) {
            content.next().css('display', 'none');
            content.removeClass('click_on');
        },
        onDataClick: function () {
            var tar = $('#contBossID').find('span');
            tar.html($(this).text() + '<i class="icon i5"></i>');
            tar.attr('mark', $(this).find('a').attr('mark'));
            fltPsgerAnysis.hideDropDown(tar);
            //点击之后，触发函数
            fltPsgerAnysis.onDataChange(fltPsgerAnysis.getCondition());
        },
        onSelectChange: function () {
            if ($(this).val() == '0') {
                fltPsgerAnysis.selChecked = 0;
            } else if ($(this).val() == '1') {
                fltPsgerAnysis.selChecked = 1;
            } else {
                fltPsgerAnysis.selChecked = 2;
            }
            //触发DataChange函数
            fltPsgerAnysis.onDataChange(fltPsgerAnysis.getCondition());
        },
        onDataChange: function (_d) {
            //_d用来标示给定的值
            //(一次load，未使用ajax获取数据)，重新绘制图表，先clear，在绘制
            //alert('选中为: ' + _d.selectChecked + "(0-1-2:全部-国内-国际)||是否有boss: " + _d.contentBoss + "(0-1:有-没有)");
            fltPsgerAnysis.clearAll();
            //全部有Boss-全部没有-国内有-国内没有-国际有-国际没有
            if (_d.selectChecked == 0 && _d.contentBoss == '0') {
                fltPsgerAnysis.drawHead(0);
                fltPsgerAnysis.drawBody(0, _fPAnysisInfo_A_Y.Passengerinfo);
                //fltPsgerAnysis.drawFoot(0, _fPAnysisInfo_A_Y.TotalInfo);
            } else if (_d.selectChecked == 0 && _d.contentBoss == '1') {
                fltPsgerAnysis.drawHead(0);
                fltPsgerAnysis.drawBody(0, _fPAnysisInfo_A_N.Passengerinfo);
                //fltPsgerAnysis.drawFoot(0, _fPAnysisInfo_A_N.TotalInfo);
            } else if (_d.selectChecked == 1 && _d.contentBoss == '0') {
                fltPsgerAnysis.drawHead(1);
                fltPsgerAnysis.drawBody(1, _fPAnysisInfo_D_Y.Passengerinfo);
                //fltPsgerAnysis.drawFoot(1, _fPAnysisInfo_D_Y.TotalInfo);
            } else if (_d.selectChecked == 1 && _d.contentBoss == '1') {
                fltPsgerAnysis.drawHead(1);
                fltPsgerAnysis.drawBody(1, _fPAnysisInfo_D_N.Passengerinfo);
                //fltPsgerAnysis.drawFoot(1, _fPAnysisInfo_D_N.TotalInfo);
            } else if (_d.selectChecked == 2 && _d.contentBoss == '0') {
                fltPsgerAnysis.drawHead(2);
                fltPsgerAnysis.drawBody(2, _fPAnysisInfo_I_Y.Passengerinfo);
                //fltPsgerAnysis.drawFoot(2, _fPAnysisInfo_I_Y.TotalInfo);
            } else {
                fltPsgerAnysis.drawHead(2);
                fltPsgerAnysis.drawBody(2, _fPAnysisInfo_I_N.Passengerinfo);
                //fltPsgerAnysis.drawFoot(2, _fPAnysisInfo_I_N.TotalInfo);
            }
            //清空
            $('#depName,#psgerName').val("");
        },
        getCondition: function () {
            var _d = {};
            _d.selectChecked = fltPsgerAnysis.selChecked;
            _d.contentBoss = $('#contBossID').find('span').attr('mark');
            return _d;
        },
        clearBdFt: function () {
            //清除Body和footer
            $('#bodyTableID').parent().parent().remove();
            //$('#footTableID').parent().remove();
        },
        clearAll: function () {
            $('#fltPsgAisID').empty();
        },
        keyupSearch: function (event) {
            var f = $('#fltPsgAisID');
            event.preventDefault();
            event.stopPropagation();
            //.
            window.clearTimeout(fltPsgerAnysis.keyupTime);
            fltPsgerAnysis.keyupTime = window.setTimeout(function () {
                var d = dpHeader.getHeadData(),
                    tmp = fltPsgerAnysis.getCondition();
                d.DomInte = tmp.selectChecked;
                d.IsBoss = tmp.contentBoss;
                d.DepKeyword = $('#depName').val();
                d.PsgKeyword = $('#psgerName').val();
                //loading
                CM.LoadingHeightFix(f);
                //无筛选条件，默认值绘制
                if (IsEmpty(d.DepKeyword) && IsEmpty(d.PsgKeyword)) {
                    fltPsgerAnysis.onDataChange(fltPsgerAnysis.getCondition());
                } else {
                    //
                    $.ajax({
                        url: '../Flight/GetPsgSearchInfo',
                        type: "POST",
                        data: d,
                        success: function (data) {
                            var resp = $.parseJSON(data);
                            fltPsgerAnysis.clearAll();
                            fltPsgerAnysis.drawHead(fltPsgerAnysis.selChecked);
                            fltPsgerAnysis.drawBody(fltPsgerAnysis.selChecked, resp.PsgInfo.Passengerinfo);
                        },
                        error: function () {
                            console.log('error!');
                        }
                    });
                }
            }, 1000);
        }
    };

    //
    function noticeInit() {
        if (!("placeholder" in document.createElement("input"))) {
            $("#depName,#psgerName").placeholder();
        }
    }

    //fun
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }

    //明细下载
    var downLoadPsgerAnysis = function () {
        var flttype = jQuery('#fltPSelID input:checked').val();
        var isboss = jQuery('#contBossID input:checked').val();
        var _ptDt = dpHeader.getHeadData();
        _ptDt.flttype = flttype;
        _ptDt.isboss = isboss;

        var f = document.getElementById("queryPsgerForm");
        f.action = DownloadPsgerAnysisUrl + '?' + CM.getDownLoadParam(_ptDt) + '&flttype=' + flttype;
        f.submit();
    }

    //Init
    var flightPsgerAnysisInit = function (data) {
        var noDataID = $('#noDataID'),
            fltInFID = $('#fltInFID');
        noDataID.mask();

        if (_cfgInfo.HasFltPassengerDetail == "T") {
            //初始赋值
            _flightPsgerAnysisInfo = {"FPAnysisInfoA_Y":{"Passengerinfo":[{"PassengerName":"cao/jian","DepartName":"","Price":9250,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":230,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"cao/yukun","DepartName":"","Price":6539,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":145,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"廖维","DepartName":"","Price":3980,"Numbers":3,"AvgDiscount":0.73,"FullPerc":0,"Save":1280,"SaveRate":0.274,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"stuit/ubolrat","DepartName":"","Price":3911,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":99,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gu/jiechen","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"xu/xueqin","DepartName":"JJC","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"ma/kouying","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"gu/limin","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"hu/xiaoyi","DepartName":"","Price":3309,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gillespie/ronald john","DepartName":"","Price":3300,"Numbers":4,"AvgDiscount":0.84,"FullPerc":0.5,"Save":840,"SaveRate":0.23,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gao/wan jun","DepartName":"JJC","Price":2384,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":2},{"PassengerName":"mettikanon/ekkarat","DepartName":"","Price":2370,"Numbers":2,"AvgDiscount":0.88,"FullPerc":0.5,"Save":270,"SaveRate":0.119,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王博","DepartName":"南中国","Price":2210,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":4},{"PassengerName":"刘羽飞","DepartName":"","Price":1880,"Numbers":2,"AvgDiscount":0.8,"FullPerc":0.5,"Save":380,"SaveRate":0.202,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"何学义","DepartName":"","Price":1836,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1629,"SaveRate":0.555,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"吴迪","DepartName":"JJC","Price":1826,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1634,"SaveRate":0.556,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王文娟","DepartName":"","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"陈虎","DepartName":"JJC","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"薛丽","DepartName":"","Price":1770,"Numbers":2,"AvgDiscount":0.55,"FullPerc":0,"Save":1150,"SaveRate":0.449,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"郭晓丽","DepartName":"销售部","Price":1720,"Numbers":3,"AvgDiscount":0.56,"FullPerc":0.333,"Save":1080,"SaveRate":0.462,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"谢勤","DepartName":"销售部","Price":1634,"Numbers":2,"AvgDiscount":0.72,"FullPerc":0,"Save":516,"SaveRate":0.29,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"曹晓勇","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王吉祥","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"bergermanngebtzsch","DepartName":"","Price":1490,"Numbers":2,"AvgDiscount":0.78,"FullPerc":0.5,"Save":580,"SaveRate":0.317,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/mar","DepartName":"","Price":1190,"Numbers":1,"AvgDiscount":0.8,"FullPerc":0,"Save":260,"SaveRate":0.203,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"dai/renzhu","DepartName":"","Price":1185,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":34,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"侯金辉","DepartName":"母婴渠道北中国","Price":1120,"Numbers":2,"AvgDiscount":0.35,"FullPerc":0,"Save":1390,"SaveRate":0.641,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王军","DepartName":"JJC","Price":923,"Numbers":1,"AvgDiscount":0.64,"FullPerc":0,"Save":407,"SaveRate":0.36,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李慧然","DepartName":"","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"马春焕","DepartName":"JJC","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"纪林","DepartName":"购物者行销部","Price":830,"Numbers":1,"AvgDiscount":0.39,"FullPerc":0,"Save":980,"SaveRate":0.609,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"唐蓓蓓","DepartName":"","Price":750,"Numbers":1,"AvgDiscount":0.55,"FullPerc":0,"Save":480,"SaveRate":0.453,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/martin eberhard","DepartName":"","Price":620,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"宋洪涛","DepartName":"","Price":590,"Numbers":1,"AvgDiscount":0.4,"FullPerc":0,"Save":640,"SaveRate":0.604,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王军红","DepartName":"Ops，TPM","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李莲珍","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王永民","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王乐","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]},"FPAnysisInfoN_Y":{"Passengerinfo":[{"PassengerName":"廖维","DepartName":"","Price":3980,"Numbers":3,"AvgDiscount":0.73,"FullPerc":0,"Save":1280,"SaveRate":0.274,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gillespie/ronald john","DepartName":"","Price":3300,"Numbers":4,"AvgDiscount":0.84,"FullPerc":0.5,"Save":840,"SaveRate":0.23,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"mettikanon/ekkarat","DepartName":"","Price":2370,"Numbers":2,"AvgDiscount":0.88,"FullPerc":0.5,"Save":270,"SaveRate":0.119,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王博","DepartName":"南中国","Price":2210,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":4},{"PassengerName":"刘羽飞","DepartName":"","Price":1880,"Numbers":2,"AvgDiscount":0.8,"FullPerc":0.5,"Save":380,"SaveRate":0.202,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"何学义","DepartName":"","Price":1836,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1629,"SaveRate":0.555,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"吴迪","DepartName":"JJC","Price":1826,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1634,"SaveRate":0.556,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王文娟","DepartName":"","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"陈虎","DepartName":"JJC","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"薛丽","DepartName":"","Price":1770,"Numbers":2,"AvgDiscount":0.55,"FullPerc":0,"Save":1150,"SaveRate":0.449,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"郭晓丽","DepartName":"销售部","Price":1720,"Numbers":3,"AvgDiscount":0.56,"FullPerc":0.333,"Save":1080,"SaveRate":0.462,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"谢勤","DepartName":"销售部","Price":1634,"Numbers":2,"AvgDiscount":0.72,"FullPerc":0,"Save":516,"SaveRate":0.29,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王吉祥","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"曹晓勇","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"bergermanngebtzsch","DepartName":"","Price":1490,"Numbers":2,"AvgDiscount":0.78,"FullPerc":0.5,"Save":580,"SaveRate":0.317,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/mar","DepartName":"","Price":1190,"Numbers":1,"AvgDiscount":0.8,"FullPerc":0,"Save":260,"SaveRate":0.203,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"侯金辉","DepartName":"母婴渠道北中国","Price":1120,"Numbers":2,"AvgDiscount":0.35,"FullPerc":0,"Save":1390,"SaveRate":0.641,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王军","DepartName":"JJC","Price":923,"Numbers":1,"AvgDiscount":0.64,"FullPerc":0,"Save":407,"SaveRate":0.36,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李慧然","DepartName":"","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"马春焕","DepartName":"JJC","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"纪林","DepartName":"购物者行销部","Price":830,"Numbers":1,"AvgDiscount":0.39,"FullPerc":0,"Save":980,"SaveRate":0.609,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"唐蓓蓓","DepartName":"","Price":750,"Numbers":1,"AvgDiscount":0.55,"FullPerc":0,"Save":480,"SaveRate":0.453,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/martin eberhard","DepartName":"","Price":620,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"宋洪涛","DepartName":"","Price":590,"Numbers":1,"AvgDiscount":0.4,"FullPerc":0,"Save":640,"SaveRate":0.604,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李莲珍","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王永民","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王乐","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王军红","DepartName":"Ops，TPM","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]},"FPAnysisInfoI_Y":{"Passengerinfo":[{"PassengerName":"cao/jian","DepartName":"","Price":9250,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":230,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"cao/yukun","DepartName":"","Price":6539,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":145,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"stuit/ubolrat","DepartName":"","Price":3911,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":99,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gu/jiechen","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"xu/xueqin","DepartName":"JJC","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"ma/kouying","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"gu/limin","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"hu/xiaoyi","DepartName":"","Price":3309,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gao/wan jun","DepartName":"JJC","Price":2384,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":2},{"PassengerName":"dai/renzhu","DepartName":"","Price":1185,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":34,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]},"FPAnysisInfoA_N":{"Passengerinfo":[{"PassengerName":"cao/jian","DepartName":"","Price":9250,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":230,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"cao/yukun","DepartName":"","Price":6539,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":145,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"廖维","DepartName":"","Price":3980,"Numbers":3,"AvgDiscount":0.73,"FullPerc":0,"Save":1280,"SaveRate":0.274,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"stuit/ubolrat","DepartName":"","Price":3911,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":99,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gu/jiechen","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"xu/xueqin","DepartName":"JJC","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"ma/kouying","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"gu/limin","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"hu/xiaoyi","DepartName":"","Price":3309,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gillespie/ronald john","DepartName":"","Price":3300,"Numbers":4,"AvgDiscount":0.84,"FullPerc":0.5,"Save":840,"SaveRate":0.23,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gao/wan jun","DepartName":"JJC","Price":2384,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":2},{"PassengerName":"mettikanon/ekkarat","DepartName":"","Price":2370,"Numbers":2,"AvgDiscount":0.88,"FullPerc":0.5,"Save":270,"SaveRate":0.119,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王博","DepartName":"南中国","Price":2210,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":4},{"PassengerName":"刘羽飞","DepartName":"","Price":1880,"Numbers":2,"AvgDiscount":0.8,"FullPerc":0.5,"Save":380,"SaveRate":0.202,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"何学义","DepartName":"","Price":1836,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1629,"SaveRate":0.555,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"吴迪","DepartName":"JJC","Price":1826,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1634,"SaveRate":0.556,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王文娟","DepartName":"","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"陈虎","DepartName":"JJC","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"薛丽","DepartName":"","Price":1770,"Numbers":2,"AvgDiscount":0.55,"FullPerc":0,"Save":1150,"SaveRate":0.449,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"郭晓丽","DepartName":"销售部","Price":1720,"Numbers":3,"AvgDiscount":0.56,"FullPerc":0.333,"Save":1080,"SaveRate":0.462,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"谢勤","DepartName":"销售部","Price":1634,"Numbers":2,"AvgDiscount":0.72,"FullPerc":0,"Save":516,"SaveRate":0.29,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"曹晓勇","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王吉祥","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"bergermanngebtzsch","DepartName":"","Price":1490,"Numbers":2,"AvgDiscount":0.78,"FullPerc":0.5,"Save":580,"SaveRate":0.317,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/mar","DepartName":"","Price":1190,"Numbers":1,"AvgDiscount":0.8,"FullPerc":0,"Save":260,"SaveRate":0.203,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"dai/renzhu","DepartName":"","Price":1185,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":34,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"侯金辉","DepartName":"母婴渠道北中国","Price":1120,"Numbers":2,"AvgDiscount":0.35,"FullPerc":0,"Save":1390,"SaveRate":0.641,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王军","DepartName":"JJC","Price":923,"Numbers":1,"AvgDiscount":0.64,"FullPerc":0,"Save":407,"SaveRate":0.36,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李慧然","DepartName":"","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"马春焕","DepartName":"JJC","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"纪林","DepartName":"购物者行销部","Price":830,"Numbers":1,"AvgDiscount":0.39,"FullPerc":0,"Save":980,"SaveRate":0.609,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"唐蓓蓓","DepartName":"","Price":750,"Numbers":1,"AvgDiscount":0.55,"FullPerc":0,"Save":480,"SaveRate":0.453,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/martin eberhard","DepartName":"","Price":620,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"宋洪涛","DepartName":"","Price":590,"Numbers":1,"AvgDiscount":0.4,"FullPerc":0,"Save":640,"SaveRate":0.604,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王军红","DepartName":"Ops，TPM","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李莲珍","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王永民","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王乐","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]},"FPAnysisInfoN_N":{"Passengerinfo":[{"PassengerName":"廖维","DepartName":"","Price":3980,"Numbers":3,"AvgDiscount":0.73,"FullPerc":0,"Save":1280,"SaveRate":0.274,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gillespie/ronald john","DepartName":"","Price":3300,"Numbers":4,"AvgDiscount":0.84,"FullPerc":0.5,"Save":840,"SaveRate":0.23,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"mettikanon/ekkarat","DepartName":"","Price":2370,"Numbers":2,"AvgDiscount":0.88,"FullPerc":0.5,"Save":270,"SaveRate":0.119,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王博","DepartName":"南中国","Price":2210,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":4},{"PassengerName":"刘羽飞","DepartName":"","Price":1880,"Numbers":2,"AvgDiscount":0.8,"FullPerc":0.5,"Save":380,"SaveRate":0.202,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"何学义","DepartName":"","Price":1836,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1629,"SaveRate":0.555,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"吴迪","DepartName":"JJC","Price":1826,"Numbers":3,"AvgDiscount":0.46,"FullPerc":0,"Save":1634,"SaveRate":0.556,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王文娟","DepartName":"","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"陈虎","DepartName":"JJC","Price":1790,"Numbers":2,"AvgDiscount":0.62,"FullPerc":0,"Save":870,"SaveRate":0.385,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"薛丽","DepartName":"","Price":1770,"Numbers":2,"AvgDiscount":0.55,"FullPerc":0,"Save":1150,"SaveRate":0.449,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"郭晓丽","DepartName":"销售部","Price":1720,"Numbers":3,"AvgDiscount":0.56,"FullPerc":0.333,"Save":1080,"SaveRate":0.462,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"谢勤","DepartName":"销售部","Price":1634,"Numbers":2,"AvgDiscount":0.72,"FullPerc":0,"Save":516,"SaveRate":0.29,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王吉祥","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"曹晓勇","DepartName":"","Price":1610,"Numbers":2,"AvgDiscount":0.38,"FullPerc":0,"Save":2110,"SaveRate":0.624,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"bergermanngebtzsch","DepartName":"","Price":1490,"Numbers":2,"AvgDiscount":0.78,"FullPerc":0.5,"Save":580,"SaveRate":0.317,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/mar","DepartName":"","Price":1190,"Numbers":1,"AvgDiscount":0.8,"FullPerc":0,"Save":260,"SaveRate":0.203,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"侯金辉","DepartName":"母婴渠道北中国","Price":1120,"Numbers":2,"AvgDiscount":0.35,"FullPerc":0,"Save":1390,"SaveRate":0.641,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"王军","DepartName":"JJC","Price":923,"Numbers":1,"AvgDiscount":0.64,"FullPerc":0,"Save":407,"SaveRate":0.36,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李慧然","DepartName":"","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"马春焕","DepartName":"JJC","Price":870,"Numbers":1,"AvgDiscount":0.6,"FullPerc":0,"Save":450,"SaveRate":0.398,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"纪林","DepartName":"购物者行销部","Price":830,"Numbers":1,"AvgDiscount":0.39,"FullPerc":0,"Save":980,"SaveRate":0.609,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"唐蓓蓓","DepartName":"","Price":750,"Numbers":1,"AvgDiscount":0.55,"FullPerc":0,"Save":480,"SaveRate":0.453,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"bergermanngebtzschoppe/martin eberhard","DepartName":"","Price":620,"Numbers":1,"AvgDiscount":1,"FullPerc":1,"Save":0,"SaveRate":0,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"宋洪涛","DepartName":"","Price":590,"Numbers":1,"AvgDiscount":0.4,"FullPerc":0,"Save":640,"SaveRate":0.604,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"李莲珍","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王永民","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王乐","DepartName":"","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"王军红","DepartName":"Ops，TPM","Price":460,"Numbers":1,"AvgDiscount":0.3,"FullPerc":0,"Save":670,"SaveRate":0.698,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]},"FPAnysisInfoI_N":{"Passengerinfo":[{"PassengerName":"cao/jian","DepartName":"","Price":9250,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":230,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"cao/yukun","DepartName":"","Price":6539,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":145,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"stuit/ubolrat","DepartName":"","Price":3911,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":99,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gu/jiechen","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"xu/xueqin","DepartName":"JJC","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"ma/kouying","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"gu/limin","DepartName":"","Price":3349,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":93,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":0},{"PassengerName":"hu/xiaoyi","DepartName":"","Price":3309,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1},{"PassengerName":"gao/wan jun","DepartName":"JJC","Price":2384,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":77,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":2},{"PassengerName":"dai/renzhu","DepartName":"","Price":1185,"Numbers":1,"AvgDiscount":1,"FullPerc":0,"Save":34,"SaveRate":0.037,"Loss":0,"LossRate":0,"IntMilAvgPrice":1}]}};
            //初始赋值
            _fPAnysisInfo_D_Y = _flightPsgerAnysisInfo.FPAnysisInfoN_Y;
            _fPAnysisInfo_D_N = _flightPsgerAnysisInfo.FPAnysisInfoN_N;
            _fPAnysisInfo_A_Y = _flightPsgerAnysisInfo.FPAnysisInfoA_Y;
            _fPAnysisInfo_A_N = _flightPsgerAnysisInfo.FPAnysisInfoA_N;
            _fPAnysisInfo_I_Y = _flightPsgerAnysisInfo.FPAnysisInfoI_Y;
            _fPAnysisInfo_I_N = _flightPsgerAnysisInfo.FPAnysisInfoI_N;
            //初始化
            fltPsgerAnysis.init();
            //绑定下载按钮
            $('#psgerdown').bind('click', downLoadPsgerAnysis);
            //
            noticeInit();
        } else {
            //charge
            var _t = $('#fltPsgAisID');

            fltInFID.css('display', 'none');
            _t.empty().height(480);
            CM.ChargeFix(_t, "payment2.jpg", lanType);
            //_t.html('<div class="payment"><img src="http://pic.ctrip.com/droco/img/sample/payment2.jpg" alt=""></div>');
        }
        //
        noDataID.unmask();
    }
    //☆=================== Fun E ===================☆

    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#fliSubNavID').find('a'), _headSelectInfo);
        flightPsgerAnysisInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问乘机人分析
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }

    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(2);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);