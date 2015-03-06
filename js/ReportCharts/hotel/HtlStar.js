(function ($) {
    //☆=================== var S ===================☆
    var _hotelStarInfo, //页面数据
        _starPerInfo,   //酒店星级
        _htlHosInfo,   //房价对比
        _starLvInfo;
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    var starPerc = {
        init: function () {
            //..
            var _htlAgrStarID = $('#htlAgrStarID'),
            _htlArgNightID = $('#htlArgNightID'),
            _htlMbrStarID = $('#htlMbrStarID'),
            _htlMbrNightID = $('#htlMbrNightID');

            //协议
            _htlAgrStarID.empty();
            if (_starPerInfo.AgrHotelInfo && _starPerInfo.AgrHotelInfo.length > 0) {
                starPerc.drawPieChart(_htlAgrStarID, _starPerInfo.AgrHotelInfo);
            } else {
                CM.LineHeightFix(_htlAgrStarID);
            }
            starPerc.drawNightPrice(_htlArgNightID, _starPerInfo.AgrHotelInfo);

            //会员
            _htlMbrStarID.empty();
            if (_starPerInfo.MbrHotelInfo.length > 0) {
                starPerc.drawPieChart(_htlMbrStarID, _starPerInfo.MbrHotelInfo);
            } else {
                CM.LineHeightFix(_htlMbrStarID);
            }
            starPerc.drawNightPrice(_htlMbrNightID, _starPerInfo.MbrHotelInfo);

        },
        drawNightPrice: function (content, dt) {
            content.empty();
            if (dt && dt.length > 0) {
                //var tolPrice = 0;
                var maxPrice = 0;
                //计算tol，修改为max作为基数
                for (var i = 0; i < dt.length; i++) {
                    //tolPrice += dt[i].Price;
                    if (dt[i].Price > maxPrice) {
                        maxPrice = dt[i].Price;
                    }
                }
                //喷入
                for (var i = 0; i < dt.length; i++) {
                    var _iPercent,
                    _iin = ((dt[i].Price / maxPrice) * 100).toFixed(1);
                    //默认给个百分之1的最小值
                    if (dt[i].Price > 0 && _iin < 1) {
                        _iPercent = '1%';
                    } else {
                        _iPercent = _iin + '%';
                    }
                    //_iPercent = ((dt[i].Price / maxPrice) * 100).toFixed(1) + '%';

                    content.prepend('<li><span style="width:' + _iPercent + ';"></span><em><i>' + corpReport_Common.js_RMBLogo + '</i>' + CM.fixData.transData(dt[i].Price, 0) + '</em></li>');
                }
            } else {
                for (var i = 0; i < 4; i++) {
                    content.prepend('<li><span style="width: 0%;"></span><em><i></i></em></li>');
                }
            }

            //第一个li
            content.find('li').eq(0).addClass('no_border');
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.data = starPerc.getPieData(dt);
            data[0] = _d;

            content.highcharts({
                colors: ['#1c76ec', '#398eff', '#56a0ff', '#79b3ff', '#9ec8ff', '#c5dfff'],
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
                            enabled: true,
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
                    formatter: function () {
                        if (this.percentage > 0) {
                            return '<b>' + this.point.name + '</b><br/>' +
                            corpReport_HotelStar.js_RoomNights + ':  ' + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_HotelStar.js_Percent + ': ' + this.percentage.toFixed(1) + '%';
                        }
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                legend: {
                    floating: true,
                    borderWidth: 0,
                    shadow: false,
                    y: 13,
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

        },
        getPieData: function (dt) {
            var _d = [];
            for (var i = 0; i < dt.length; i++) {
                var _s = {};
                _s.name = dt[i].StarLv;
                _s.y = dt[i].NightNum;
                _d[i] = _s;
            }
            return _d;
        }

    };

    //绘制table
    var cityHosPric = {
        init: function () {
            //.
            var _htlStarLvID = $('#htlStarLvID'),
            _htlStarLvSelID = $('#htlStarLvSelID');

            _htlStarLvID.unbind('click');
            _htlStarLvID.bind('click', cityHosPric.showDropDown);
            //drop click
            _htlStarLvSelID.find('li').unbind('click');
            _htlStarLvSelID.find('li').bind('click', cityHosPric.onDataClick);

            //绘制table
            cityHosPric.drawTable(_htlHosInfo);
        },
        drawTable: function (dt) {
            var _htlMbrTabID = $('#htlMbrTabID'),
            _htlArgTabID = $('#htlArgTabID');

            //index为0会员. 1协议
            cityHosPric.clearAll(_htlMbrTabID);
            cityHosPric.drawHead(_htlMbrTabID, 0);
            cityHosPric.drawBody(_htlMbrTabID, dt.MbrHoseInfo, 0);
            cityHosPric.drawFoot(_htlMbrTabID, dt.TolMbrHoseInfo, 0);
            //
            cityHosPric.clearAll(_htlArgTabID);
            cityHosPric.drawHead(_htlArgTabID, 1);
            cityHosPric.drawBody(_htlArgTabID, dt.ArgHoseInfo, 1);
            cityHosPric.drawFoot(_htlArgTabID, dt.TolArgHoseInfo, 1);
        },
        drawHead: function (content, index) {
            var _str = [];
            //
            if (index == 0) {
                var _head = $('<table><thead id="headTableMbrID"></thead></table>');
                content.append(_head);
                //live on
                $('#headTableMbrID').on('click', '[ckMark="0"]', cityHosPric.onHeadClick);
                //
                _str.push('<tr><th width="20%">' + corpReport_HotelStar.js_City + '</th>');
                _str.push('<th width="20%" class="sequence" ckMark="0" pInfo="Night">' + corpReport_HotelStar.js_RoomNights + '<i class="icon i7"></i></th>');
                _str.push('<th width="30%" ckMark="0" pInfo="AvgPrice">' + corpReport_HotelStar.js_AvgDailyRate + '</th>');
                _str.push('<th width="30%" ckMark="0" pInfo="CtripAvgPrice">' + corpReport_HotelStar.js_AvgMemHotelDailyRate + '</th>');
                _str.push('<th class="null_place"><div></div></th></tr>');
                $('#headTableMbrID').append(_str.join(""));
            } else {
                var _head = $('<table><thead id="headTableArgID"></thead></table>');
                content.append(_head);
                //live on
                $('#headTableArgID').on('click', '[ckMark="1"]', cityHosPric.onHeadClick);
                //
                _str.push('<tr><th width="20%">' + corpReport_HotelStar.js_City + '</th>');
                _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="Night">' + corpReport_HotelStar.js_RoomNights + '<i class="icon i7"></i></th>');
                _str.push('<th width="30%" ckMark="1" pInfo="AvgPrice">' + corpReport_HotelStar.js_AvgDailyRate + '</th>');
                _str.push('<th width="30%" ckMark="1" pInfo="CtripAvgPrice">' + corpReport_HotelStar.js_AvgCorpHotelDailyRate + '</th>');
                _str.push('<th class="null_place"><div></div></th></tr>');
                $('#headTableArgID').append(_str.join(""));
            }
        },
        drawBody: function (content, dt, index) {
            var _body = (index == 0) ? $('<div class="tbody"><table><tbody id="bodyTableMbrID"></tbody></table></div>') : $('<div class="tbody"><table><tbody id="bodyTableArgID"></tbody></table></div>');
            content.append(_body);
            var _bodyTableMbrID = $('#bodyTableMbrID'),
            _bodyTableArgID = $('#bodyTableArgID');
            //

            if (dt && dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="20%">' + dt[i].Name + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                    _str.push('<td width="30%">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                    _str.push('<td width="30%">' + CM.fixData.transData(dt[i].CtripAvgPrice, 0) + '</td></tr>');
                    (index == 0) ? _bodyTableMbrID.append(_str.join("")) : _bodyTableArgID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (content, dt, index) {
            var _foot = (index == 0) ? $('<table><tfoot id="footTableMbrID"></tfoot></table>') : $('<table><tfoot id="footTableArgID"></tfoot></table>');
            content.append(_foot);
            //..
            if (dt) {
                var _str = '<tr>' +
                   '<td width="20%">' + corpReport_HotelStar.js_Total + '</td>' +
                   '<td width="20%">' + CM.fixData.transData(dt.TolNight, 0) + '</td>' +
                   '<td width="30%">' + CM.fixData.transData(dt.TolAvgPrice, 0) + '</td>' +
                   '<td width="30%">' + CM.fixData.transData(dt.TolCtripAvgPrice, 0) + '</td>';
                _str = _str + '<td class="null_place"><div></div></td></tr>';
                (index == 0) ? $('#footTableMbrID').append(_str) : $('#footTableArgID').append(_str);
            }
        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($('#htlStarLvID').hasClass('click_on')) {
                $('#htlStarLvSelID').css('display', 'none');
                $('#htlStarLvID').removeClass('click_on');
            } else {
                $('#htlStarLvSelID').css('display', '');
                $('#htlStarLvID').addClass('click_on');
            }
        },
        hideDropDown: function () {
            $('#htlStarLvSelID').css('display', 'none');
            $('#htlStarLvID').removeClass('click_on');
        },
        _timeout: null,
        onDataClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var _htlStarLvID = $('#htlStarLvID'),
            _htlArgTabID = $('#htlArgTabID'),
            _htlMbrTabID = $('#htlMbrTabID');

            _htlStarLvID.html($(this).text() + '<i class="icon i5"></i>');
            _htlStarLvID.attr('mark', $(this).find('a').attr('mark'));
            cityHosPric.hideDropDown();
            var _ct = $(this);
            //点击loading
            CM.LoadingHeightFix(_htlArgTabID);
            CM.LoadingHeightFix(_htlMbrTabID);

            window.clearTimeout(cityHosPric._timeout);
            cityHosPric._timeout = window.setTimeout(function () {
                //ajax请求获取数据
                if (_ct.find('a').attr('mark') == '0') {
                    cityHosPric.drawTable(_htlHosInfo);
                } else {
                    //发送ajax，获取数据，绘制table
                    var _ptDt = dpHeader.getHeadData();
                    _ptDt.HotelStar = _ct.find('a').attr('mark');
                    //
                    $.ajax({
                        url: '../Hotel/GetHotelStarCity',
                        type: "POST",
                        data: _ptDt,
                        success: function (data) {
                            _starLvInfo = $.parseJSON(data);
                            //绘制table
                            cityHosPric.drawTable(_starLvInfo);
                        },
                        error: function () {
                            alert('error!');
                        }
                    });
                }
            }, 100);
        },
        clearAll: function (content) {
            content.empty();
        },
        sortArray: function (content, type, index) {
            var data = (index == 0) ? _htlHosInfo.MbrHoseInfo : _htlHosInfo.ArgHoseInfo;
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
                content = $(this),
                index = content.attr('ckMark') == "0" ? 0 : 1;
            if (content.hasClass("sequence")) {
                //从大大小和从小到大的切换
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = cityHosPric.sortArray(content, "Asc", index);
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = cityHosPric.sortArray(content, "Desc", index);
                }
            } else {
                //清空所有头部
                if (index == 0) {
                    $('#headTableMbrID').find('th.sequence').removeClass("sequence");
                    $('#headTableMbrID').find('th').find('.icon').remove();
                } else {
                    $('#headTableArgID').find('th.sequence').removeClass("sequence");
                    $('#headTableArgID').find('th').find('.icon').remove();
                }
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = cityHosPric.sortArray(content, "Desc", index);
            }
            //重新绘制body和footer
            cityHosPric.clearBdFt(index);
            if (index == 0) {
                cityHosPric.drawBody($('#htlMbrTabID'), sortedData, 0);
                cityHosPric.drawFoot($('#htlMbrTabID'), _htlHosInfo.TolMbrHoseInfo, 0);
            } else {
                cityHosPric.drawBody($('#htlArgTabID'), sortedData, 1);
                cityHosPric.drawFoot($('#htlArgTabID'), _htlHosInfo.TolArgHoseInfo, 1);
            }
        },
        clearBdFt: function (index) {
            if (index == 0) {
                $('#bodyTableMbrID').parent().parent().remove();
                $('#footTableMbrID').parent().remove();
            } else {
                $('#bodyTableArgID').parent().parent().remove();
                $('#footTableArgID').parent().remove();
            }
        }
    };

    //
    var hotelStarInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //初始赋值
        _hotelStarInfo = {"HotelStarPerInfo":{"AgrHotelInfo":[{"StarLv":"2星","NightNum":188,"Price":36526},{"StarLv":"3星","NightNum":37,"Price":13075},{"StarLv":"4星","NightNum":594,"Price":289567},{"StarLv":"5星","NightNum":1147,"Price":627189}],"MbrHotelInfo":[{"StarLv":"2星","NightNum":558,"Price":110486},{"StarLv":"3星","NightNum":403,"Price":115950},{"StarLv":"4星","NightNum":1081,"Price":431574},{"StarLv":"5星","NightNum":370,"Price":201222}]},"HotelHosInfo":{"ArgHoseInfo":[{"Name":"北京","Night":557,"AvgPrice":553,"CtripAvgPrice":609},{"Name":"上海","Night":168,"AvgPrice":603,"CtripAvgPrice":576},{"Name":"杭州","Night":122,"AvgPrice":470,"CtripAvgPrice":523},{"Name":"深圳","Night":114,"AvgPrice":609,"CtripAvgPrice":544},{"Name":"东莞","Night":108,"AvgPrice":401,"CtripAvgPrice":361},{"Name":"广州","Night":107,"AvgPrice":587,"CtripAvgPrice":579},{"Name":"南京","Night":46,"AvgPrice":475,"CtripAvgPrice":481},{"Name":"大连","Night":45,"AvgPrice":456,"CtripAvgPrice":447},{"Name":"西安","Night":41,"AvgPrice":504,"CtripAvgPrice":429},{"Name":"沈阳","Night":39,"AvgPrice":437,"CtripAvgPrice":448},{"Name":"宁波","Night":30,"AvgPrice":516,"CtripAvgPrice":440},{"Name":"苏州","Night":29,"AvgPrice":448,"CtripAvgPrice":472},{"Name":"海口","Night":29,"AvgPrice":394,"CtripAvgPrice":469},{"Name":"武汉","Night":27,"AvgPrice":566,"CtripAvgPrice":464},{"Name":"长沙","Night":26,"AvgPrice":514,"CtripAvgPrice":411},{"Name":"长春","Night":25,"AvgPrice":498,"CtripAvgPrice":417},{"Name":"石家庄","Night":23,"AvgPrice":332,"CtripAvgPrice":385},{"Name":"成都","Night":23,"AvgPrice":506,"CtripAvgPrice":540},{"Name":"合肥","Night":23,"AvgPrice":487,"CtripAvgPrice":380},{"Name":"济南","Night":22,"AvgPrice":473,"CtripAvgPrice":463},{"Name":"重庆","Night":22,"AvgPrice":534,"CtripAvgPrice":454},{"Name":"桂林","Night":22,"AvgPrice":320,"CtripAvgPrice":265},{"Name":"南宁","Night":20,"AvgPrice":371,"CtripAvgPrice":308},{"Name":"青岛","Night":19,"AvgPrice":306,"CtripAvgPrice":418},{"Name":"义乌","Night":18,"AvgPrice":382,"CtripAvgPrice":207},{"Name":"郑州","Night":18,"AvgPrice":398,"CtripAvgPrice":375},{"Name":"象山","Night":15,"AvgPrice":482,"CtripAvgPrice":440},{"Name":"贵阳","Night":13,"AvgPrice":490,"CtripAvgPrice":420},{"Name":"天津","Night":13,"AvgPrice":322,"CtripAvgPrice":438},{"Name":"哈尔滨","Night":11,"AvgPrice":399,"CtripAvgPrice":399},{"Name":"邯郸","Night":11,"AvgPrice":176,"CtripAvgPrice":170},{"Name":"太原","Night":10,"AvgPrice":505,"CtripAvgPrice":324},{"Name":"福州","Night":9,"AvgPrice":550,"CtripAvgPrice":428},{"Name":"温州","Night":8,"AvgPrice":416,"CtripAvgPrice":431},{"Name":"烟台","Night":8,"AvgPrice":333,"CtripAvgPrice":326},{"Name":"无锡","Night":8,"AvgPrice":408,"CtripAvgPrice":418},{"Name":"丹东","Night":8,"AvgPrice":125,"CtripAvgPrice":144},{"Name":"邢台","Night":8,"AvgPrice":186,"CtripAvgPrice":187},{"Name":"昆明","Night":6,"AvgPrice":518,"CtripAvgPrice":369},{"Name":"沧州","Night":6,"AvgPrice":192,"CtripAvgPrice":202},{"Name":"潍坊","Night":6,"AvgPrice":161,"CtripAvgPrice":270},{"Name":"珠海","Night":5,"AvgPrice":348,"CtripAvgPrice":340},{"Name":"葫芦岛","Night":5,"AvgPrice":120,"CtripAvgPrice":219},{"Name":"驻马店","Night":5,"AvgPrice":144,"CtripAvgPrice":164},{"Name":"东台","Night":4,"AvgPrice":200,"CtripAvgPrice":188},{"Name":"周口","Night":4,"AvgPrice":100,"CtripAvgPrice":150},{"Name":"南昌","Night":4,"AvgPrice":390,"CtripAvgPrice":372},{"Name":"包头","Night":4,"AvgPrice":152,"CtripAvgPrice":224},{"Name":"金华","Night":3,"AvgPrice":360,"CtripAvgPrice":313},{"Name":"朝阳","Night":3,"AvgPrice":118,"CtripAvgPrice":169},{"Name":"龙岩","Night":3,"AvgPrice":355,"CtripAvgPrice":348},{"Name":"保定","Night":3,"AvgPrice":201,"CtripAvgPrice":337},{"Name":"威海","Night":2,"AvgPrice":144,"CtripAvgPrice":234},{"Name":"湖州","Night":2,"AvgPrice":258,"CtripAvgPrice":209},{"Name":"银川","Night":2,"AvgPrice":570,"CtripAvgPrice":415},{"Name":"厦门","Night":2,"AvgPrice":430,"CtripAvgPrice":455},{"Name":"武义","Night":2,"AvgPrice":396,"CtripAvgPrice":396},{"Name":"秦皇岛","Night":2,"AvgPrice":144,"CtripAvgPrice":484},{"Name":"洛阳","Night":2,"AvgPrice":182,"CtripAvgPrice":312},{"Name":"柳州","Night":2,"AvgPrice":358,"CtripAvgPrice":120},{"Name":"绍兴","Night":2,"AvgPrice":271,"CtripAvgPrice":358},{"Name":"广水","Night":2,"AvgPrice":148,"CtripAvgPrice":148},{"Name":"安吉","Night":2,"AvgPrice":400,"CtripAvgPrice":177},{"Name":"湛江","Night":2,"AvgPrice":398,"CtripAvgPrice":342},{"Name":"漳州","Night":2,"AvgPrice":182,"CtripAvgPrice":293},{"Name":"济宁","Night":2,"AvgPrice":169,"CtripAvgPrice":313},{"Name":"宿迁","Night":2,"AvgPrice":169,"CtripAvgPrice":196},{"Name":"汕头","Night":2,"AvgPrice":470,"CtripAvgPrice":311},{"Name":"镇江","Night":2,"AvgPrice":169,"CtripAvgPrice":337},{"Name":"承德","Night":2,"AvgPrice":220,"CtripAvgPrice":227},{"Name":"曲阳","Night":2,"AvgPrice":320,"CtripAvgPrice":320},{"Name":"徐州","Night":1,"AvgPrice":161,"CtripAvgPrice":234},{"Name":"连云港","Night":1,"AvgPrice":161,"CtripAvgPrice":355},{"Name":"常州","Night":1,"AvgPrice":169,"CtripAvgPrice":351},{"Name":"南充","Night":1,"AvgPrice":188,"CtripAvgPrice":190},{"Name":"淮安","Night":1,"AvgPrice":178,"CtripAvgPrice":154},{"Name":"咸阳","Night":1,"AvgPrice":161,"CtripAvgPrice":208},{"Name":"南通","Night":1,"AvgPrice":300,"CtripAvgPrice":323},{"Name":"眉山","Night":1,"AvgPrice":260,"CtripAvgPrice":206},{"Name":"六盘水","Night":1,"AvgPrice":218,"CtripAvgPrice":179},{"Name":"无为","Night":1,"AvgPrice":328,"CtripAvgPrice":328},{"Name":"铜川","Night":1,"AvgPrice":278,"CtripAvgPrice":278},{"Name":"彭水","Night":1,"AvgPrice":308,"CtripAvgPrice":254},{"Name":"松原","Night":1,"AvgPrice":110,"CtripAvgPrice":120},{"Name":"阜新","Night":1,"AvgPrice":188,"CtripAvgPrice":155},{"Name":"安康","Night":1,"AvgPrice":288,"CtripAvgPrice":212},{"Name":"贞丰","Night":1,"AvgPrice":158,"CtripAvgPrice":158},{"Name":"靖江","Night":1,"AvgPrice":152,"CtripAvgPrice":318},{"Name":"宿州","Night":1,"AvgPrice":399,"CtripAvgPrice":215},{"Name":"汉中","Night":1,"AvgPrice":178,"CtripAvgPrice":227},{"Name":"张家港","Night":1,"AvgPrice":169,"CtripAvgPrice":356},{"Name":"安顺","Night":1,"AvgPrice":188,"CtripAvgPrice":215},{"Name":"宜昌","Night":1,"AvgPrice":258,"CtripAvgPrice":393}],"TolArgHoseInfo":{"TolNight":1966,"TolAvgPrice":492,"TolCtripAvgPrice":326},"MbrHoseInfo":[{"Name":"上海","Night":207,"AvgPrice":540,"CtripAvgPrice":495},{"Name":"大连","Night":101,"AvgPrice":263,"CtripAvgPrice":353},{"Name":"成都","Night":75,"AvgPrice":408,"CtripAvgPrice":394},{"Name":"北京","Night":63,"AvgPrice":541,"CtripAvgPrice":515},{"Name":"广州","Night":51,"AvgPrice":524,"CtripAvgPrice":455},{"Name":"西宁","Night":49,"AvgPrice":275,"CtripAvgPrice":301},{"Name":"兰州","Night":48,"AvgPrice":304,"CtripAvgPrice":322},{"Name":"郑州","Night":42,"AvgPrice":435,"CtripAvgPrice":337},{"Name":"海口","Night":38,"AvgPrice":349,"CtripAvgPrice":365},{"Name":"苏州","Night":37,"AvgPrice":448,"CtripAvgPrice":391},{"Name":"深圳","Night":35,"AvgPrice":521,"CtripAvgPrice":468},{"Name":"长春","Night":35,"AvgPrice":370,"CtripAvgPrice":344},{"Name":"重庆","Night":34,"AvgPrice":380,"CtripAvgPrice":337},{"Name":"天津","Night":33,"AvgPrice":312,"CtripAvgPrice":356},{"Name":"福州","Night":31,"AvgPrice":455,"CtripAvgPrice":371},{"Name":"南京","Night":31,"AvgPrice":290,"CtripAvgPrice":383},{"Name":"合肥","Night":27,"AvgPrice":406,"CtripAvgPrice":310},{"Name":"南宁","Night":24,"AvgPrice":311,"CtripAvgPrice":333},{"Name":"阜阳","Night":24,"AvgPrice":271,"CtripAvgPrice":265},{"Name":"银川","Night":23,"AvgPrice":238,"CtripAvgPrice":321},{"Name":"潍坊","Night":23,"AvgPrice":266,"CtripAvgPrice":273},{"Name":"杭州","Night":22,"AvgPrice":342,"CtripAvgPrice":444},{"Name":"营口","Night":22,"AvgPrice":292,"CtripAvgPrice":296},{"Name":"宜宾","Night":22,"AvgPrice":269,"CtripAvgPrice":259},{"Name":"济南","Night":20,"AvgPrice":395,"CtripAvgPrice":324},{"Name":"安庆","Night":20,"AvgPrice":295,"CtripAvgPrice":243},{"Name":"珠海","Night":19,"AvgPrice":459,"CtripAvgPrice":409},{"Name":"汕头","Night":19,"AvgPrice":336,"CtripAvgPrice":336},{"Name":"厦门","Night":19,"AvgPrice":314,"CtripAvgPrice":439},{"Name":"哈尔滨","Night":19,"AvgPrice":390,"CtripAvgPrice":371},{"Name":"长沙","Night":19,"AvgPrice":422,"CtripAvgPrice":363},{"Name":"淮安","Night":18,"AvgPrice":348,"CtripAvgPrice":284},{"Name":"泉州","Night":18,"AvgPrice":400,"CtripAvgPrice":323},{"Name":"东莞","Night":17,"AvgPrice":312,"CtripAvgPrice":340},{"Name":"石家庄","Night":17,"AvgPrice":264,"CtripAvgPrice":291},{"Name":"台州","Night":16,"AvgPrice":360,"CtripAvgPrice":300},{"Name":"清远","Night":15,"AvgPrice":569,"CtripAvgPrice":325},{"Name":"开平","Night":15,"AvgPrice":288,"CtripAvgPrice":289},{"Name":"瑞安","Night":15,"AvgPrice":317,"CtripAvgPrice":280},{"Name":"临沂","Night":15,"AvgPrice":316,"CtripAvgPrice":257},{"Name":"齐齐哈尔","Night":14,"AvgPrice":150,"CtripAvgPrice":198},{"Name":"南昌","Night":14,"AvgPrice":336,"CtripAvgPrice":321},{"Name":"韶关","Night":14,"AvgPrice":222,"CtripAvgPrice":301},{"Name":"梅州","Night":14,"AvgPrice":302,"CtripAvgPrice":323},{"Name":"嘉兴","Night":14,"AvgPrice":586,"CtripAvgPrice":298},{"Name":"西昌","Night":13,"AvgPrice":215,"CtripAvgPrice":299},{"Name":"延吉","Night":13,"AvgPrice":170,"CtripAvgPrice":235},{"Name":"武汉","Night":13,"AvgPrice":360,"CtripAvgPrice":339},{"Name":"湛江","Night":13,"AvgPrice":280,"CtripAvgPrice":308},{"Name":"昆明","Night":12,"AvgPrice":423,"CtripAvgPrice":381},{"Name":"肇庆","Night":12,"AvgPrice":284,"CtripAvgPrice":309},{"Name":"湖州","Night":12,"AvgPrice":508,"CtripAvgPrice":348},{"Name":"绍兴","Night":12,"AvgPrice":426,"CtripAvgPrice":336},{"Name":"连云港","Night":12,"AvgPrice":329,"CtripAvgPrice":318},{"Name":"嘉善","Night":12,"AvgPrice":348,"CtripAvgPrice":374},{"Name":"无锡","Night":12,"AvgPrice":431,"CtripAvgPrice":385},{"Name":"赣州","Night":12,"AvgPrice":299,"CtripAvgPrice":271},{"Name":"宜昌","Night":11,"AvgPrice":211,"CtripAvgPrice":290},{"Name":"宁波","Night":11,"AvgPrice":357,"CtripAvgPrice":360},{"Name":"金华","Night":11,"AvgPrice":313,"CtripAvgPrice":286},{"Name":"锦州","Night":11,"AvgPrice":394,"CtripAvgPrice":258},{"Name":"义乌","Night":11,"AvgPrice":300,"CtripAvgPrice":299},{"Name":"南通","Night":11,"AvgPrice":381,"CtripAvgPrice":310},{"Name":"桂林","Night":11,"AvgPrice":304,"CtripAvgPrice":364},{"Name":"宣城","Night":11,"AvgPrice":288,"CtripAvgPrice":242},{"Name":"荆州","Night":11,"AvgPrice":241,"CtripAvgPrice":238},{"Name":"赤峰","Night":10,"AvgPrice":312,"CtripAvgPrice":262},{"Name":"保定","Night":10,"AvgPrice":281,"CtripAvgPrice":299},{"Name":"邯郸","Night":10,"AvgPrice":320,"CtripAvgPrice":278},{"Name":"聊城","Night":10,"AvgPrice":248,"CtripAvgPrice":241},{"Name":"西安","Night":10,"AvgPrice":400,"CtripAvgPrice":362},{"Name":"青岛","Night":10,"AvgPrice":224,"CtripAvgPrice":350},{"Name":"天水","Night":9,"AvgPrice":274,"CtripAvgPrice":221},{"Name":"阜新","Night":9,"AvgPrice":131,"CtripAvgPrice":161},{"Name":"沈阳","Night":9,"AvgPrice":337,"CtripAvgPrice":359},{"Name":"滨州","Night":9,"AvgPrice":219,"CtripAvgPrice":219},{"Name":"潮州","Night":9,"AvgPrice":313,"CtripAvgPrice":290},{"Name":"达州","Night":9,"AvgPrice":154,"CtripAvgPrice":243},{"Name":"徐州","Night":9,"AvgPrice":313,"CtripAvgPrice":312},{"Name":"廊坊","Night":9,"AvgPrice":185,"CtripAvgPrice":258},{"Name":"呼和浩特","Night":9,"AvgPrice":379,"CtripAvgPrice":329},{"Name":"内江","Night":8,"AvgPrice":172,"CtripAvgPrice":282},{"Name":"株洲","Night":8,"AvgPrice":289,"CtripAvgPrice":307},{"Name":"太原","Night":8,"AvgPrice":500,"CtripAvgPrice":334},{"Name":"秦皇岛","Night":8,"AvgPrice":226,"CtripAvgPrice":320},{"Name":"佛山","Night":7,"AvgPrice":172,"CtripAvgPrice":311},{"Name":"攀枝花","Night":7,"AvgPrice":241,"CtripAvgPrice":277},{"Name":"常州","Night":7,"AvgPrice":280,"CtripAvgPrice":310},{"Name":"温州","Night":7,"AvgPrice":517,"CtripAvgPrice":352},{"Name":"黄山","Night":7,"AvgPrice":513,"CtripAvgPrice":367},{"Name":"鞍山","Night":7,"AvgPrice":180,"CtripAvgPrice":274},{"Name":"南充","Night":7,"AvgPrice":237,"CtripAvgPrice":267},{"Name":"济宁","Night":7,"AvgPrice":237,"CtripAvgPrice":223},{"Name":"德阳","Night":7,"AvgPrice":358,"CtripAvgPrice":265},{"Name":"洛阳","Night":7,"AvgPrice":357,"CtripAvgPrice":334},{"Name":"黄石","Night":7,"AvgPrice":212,"CtripAvgPrice":274},{"Name":"常熟","Night":6,"AvgPrice":333,"CtripAvgPrice":318},{"Name":"惠州","Night":6,"AvgPrice":670,"CtripAvgPrice":346},{"Name":"龙岩","Night":6,"AvgPrice":213,"CtripAvgPrice":291},{"Name":"广元","Night":6,"AvgPrice":238,"CtripAvgPrice":283},{"Name":"香港","Night":6,"AvgPrice":1616,"CtripAvgPrice":1147},{"Name":"襄阳","Night":6,"AvgPrice":155,"CtripAvgPrice":285},{"Name":"贵阳","Night":6,"AvgPrice":392,"CtripAvgPrice":375},{"Name":"遂宁","Night":6,"AvgPrice":191,"CtripAvgPrice":243},{"Name":"盐城","Night":6,"AvgPrice":307,"CtripAvgPrice":275},{"Name":"中山","Night":6,"AvgPrice":437,"CtripAvgPrice":318},{"Name":"孝感","Night":6,"AvgPrice":275,"CtripAvgPrice":256},{"Name":"巩义","Night":6,"AvgPrice":385,"CtripAvgPrice":309},{"Name":"丽江","Night":5,"AvgPrice":680,"CtripAvgPrice":480},{"Name":"景德镇","Night":5,"AvgPrice":194,"CtripAvgPrice":275},{"Name":"十堰","Night":5,"AvgPrice":187,"CtripAvgPrice":281},{"Name":"牡丹江","Night":5,"AvgPrice":334,"CtripAvgPrice":265},{"Name":"三亚","Night":5,"AvgPrice":682,"CtripAvgPrice":961},{"Name":"唐山","Night":5,"AvgPrice":211,"CtripAvgPrice":302},{"Name":"兴义","Night":5,"AvgPrice":192,"CtripAvgPrice":222},{"Name":"岳阳","Night":5,"AvgPrice":298,"CtripAvgPrice":308},{"Name":"萍乡","Night":5,"AvgPrice":398,"CtripAvgPrice":216},{"Name":"扬州","Night":5,"AvgPrice":300,"CtripAvgPrice":363},{"Name":"莆田","Night":5,"AvgPrice":192,"CtripAvgPrice":315},{"Name":"周口","Night":5,"AvgPrice":256,"CtripAvgPrice":198},{"Name":"滁州","Night":5,"AvgPrice":270,"CtripAvgPrice":243},{"Name":"威海","Night":5,"AvgPrice":412,"CtripAvgPrice":249},{"Name":"娄底","Night":5,"AvgPrice":256,"CtripAvgPrice":245},{"Name":"铜陵","Night":4,"AvgPrice":388,"CtripAvgPrice":256},{"Name":"新乡","Night":4,"AvgPrice":278,"CtripAvgPrice":225},{"Name":"舟山","Night":4,"AvgPrice":406,"CtripAvgPrice":435},{"Name":"宿州","Night":4,"AvgPrice":386,"CtripAvgPrice":249},{"Name":"九江","Night":4,"AvgPrice":313,"CtripAvgPrice":311},{"Name":"邢台","Night":4,"AvgPrice":344,"CtripAvgPrice":222},{"Name":"绵阳","Night":4,"AvgPrice":207,"CtripAvgPrice":268},{"Name":"蚌埠","Night":4,"AvgPrice":223,"CtripAvgPrice":273},{"Name":"本溪","Night":4,"AvgPrice":350,"CtripAvgPrice":279},{"Name":"沧州","Night":4,"AvgPrice":368,"CtripAvgPrice":254},{"Name":"烟台","Night":4,"AvgPrice":256,"CtripAvgPrice":340},{"Name":"芜湖","Night":4,"AvgPrice":313,"CtripAvgPrice":277},{"Name":"武夷山","Night":4,"AvgPrice":298,"CtripAvgPrice":382},{"Name":"阳江","Night":4,"AvgPrice":270,"CtripAvgPrice":286},{"Name":"承德","Night":4,"AvgPrice":294,"CtripAvgPrice":275},{"Name":"钦州","Night":4,"AvgPrice":403,"CtripAvgPrice":262},{"Name":"镇江","Night":4,"AvgPrice":418,"CtripAvgPrice":324},{"Name":"乌兰察布","Night":4,"AvgPrice":178,"CtripAvgPrice":214},{"Name":"汉中","Night":4,"AvgPrice":139,"CtripAvgPrice":260},{"Name":"昆山","Night":4,"AvgPrice":468,"CtripAvgPrice":348},{"Name":"揭阳","Night":3,"AvgPrice":240,"CtripAvgPrice":253},{"Name":"松滋","Night":3,"AvgPrice":140,"CtripAvgPrice":214},{"Name":"张家口","Night":3,"AvgPrice":175,"CtripAvgPrice":281},{"Name":"宜春","Night":3,"AvgPrice":378,"CtripAvgPrice":250},{"Name":"鸡西","Night":3,"AvgPrice":348,"CtripAvgPrice":213},{"Name":"茂名","Night":3,"AvgPrice":329,"CtripAvgPrice":288},{"Name":"遵义","Night":3,"AvgPrice":212,"CtripAvgPrice":252},{"Name":"石首","Night":3,"AvgPrice":168,"CtripAvgPrice":131},{"Name":"上饶","Night":3,"AvgPrice":388,"CtripAvgPrice":255},{"Name":"琼海","Night":3,"AvgPrice":363,"CtripAvgPrice":332},{"Name":"宁德","Night":3,"AvgPrice":211,"CtripAvgPrice":304},{"Name":"衡阳","Night":3,"AvgPrice":377,"CtripAvgPrice":266},{"Name":"南阳","Night":3,"AvgPrice":180,"CtripAvgPrice":219},{"Name":"眉山","Night":3,"AvgPrice":245,"CtripAvgPrice":220},{"Name":"瓦房店","Night":3,"AvgPrice":158,"CtripAvgPrice":169},{"Name":"淄博","Night":3,"AvgPrice":231,"CtripAvgPrice":278},{"Name":"泰安","Night":3,"AvgPrice":225,"CtripAvgPrice":253},{"Name":"乾县","Night":3,"AvgPrice":258,"CtripAvgPrice":258},{"Name":"庄河","Night":3,"AvgPrice":160,"CtripAvgPrice":185},{"Name":"吉林","Night":3,"AvgPrice":380,"CtripAvgPrice":267},{"Name":"当阳","Night":3,"AvgPrice":293,"CtripAvgPrice":236},{"Name":"玉林","Night":3,"AvgPrice":295,"CtripAvgPrice":255},{"Name":"仙桃","Night":3,"AvgPrice":219,"CtripAvgPrice":252},{"Name":"怀化","Night":3,"AvgPrice":269,"CtripAvgPrice":248},{"Name":"寿光","Night":3,"AvgPrice":136,"CtripAvgPrice":246},{"Name":"通山","Night":3,"AvgPrice":203,"CtripAvgPrice":272},{"Name":"张家港","Night":3,"AvgPrice":258,"CtripAvgPrice":303},{"Name":"溧阳","Night":2,"AvgPrice":290,"CtripAvgPrice":463},{"Name":"诸暨","Night":2,"AvgPrice":348,"CtripAvgPrice":300},{"Name":"公安","Night":2,"AvgPrice":254,"CtripAvgPrice":323},{"Name":"澳门","Night":2,"AvgPrice":854,"CtripAvgPrice":1189},{"Name":"雅安","Night":2,"AvgPrice":178,"CtripAvgPrice":254},{"Name":"抚州","Night":2,"AvgPrice":168,"CtripAvgPrice":221},{"Name":"佳木斯","Night":2,"AvgPrice":198,"CtripAvgPrice":239},{"Name":"凯里","Night":2,"AvgPrice":348,"CtripAvgPrice":259},{"Name":"桐乡","Night":2,"AvgPrice":538,"CtripAvgPrice":387},{"Name":"衡水","Night":2,"AvgPrice":398,"CtripAvgPrice":239},{"Name":"乐山","Night":2,"AvgPrice":224,"CtripAvgPrice":238},{"Name":"简阳","Night":2,"AvgPrice":148,"CtripAvgPrice":158},{"Name":"普洱","Night":2,"AvgPrice":338,"CtripAvgPrice":564},{"Name":"张家界","Night":2,"AvgPrice":293,"CtripAvgPrice":284},{"Name":"大庆","Night":2,"AvgPrice":264,"CtripAvgPrice":230},{"Name":"河源","Night":2,"AvgPrice":294,"CtripAvgPrice":308},{"Name":"梧州","Night":2,"AvgPrice":294,"CtripAvgPrice":248},{"Name":"象山","Night":2,"AvgPrice":268,"CtripAvgPrice":293},{"Name":"随州","Night":2,"AvgPrice":179,"CtripAvgPrice":211},{"Name":"江门","Night":2,"AvgPrice":354,"CtripAvgPrice":362},{"Name":"哈密市","Night":2,"AvgPrice":268,"CtripAvgPrice":252},{"Name":"包头","Night":2,"AvgPrice":449,"CtripAvgPrice":285},{"Name":"淮南","Night":2,"AvgPrice":328,"CtripAvgPrice":253},{"Name":"常德","Night":2,"AvgPrice":323,"CtripAvgPrice":246},{"Name":"六安","Night":2,"AvgPrice":278,"CtripAvgPrice":241},{"Name":"苍南","Night":2,"AvgPrice":350,"CtripAvgPrice":335},{"Name":"兰溪","Night":2,"AvgPrice":368,"CtripAvgPrice":296},{"Name":"迁安","Night":2,"AvgPrice":330,"CtripAvgPrice":265},{"Name":"织金","Night":2,"AvgPrice":328,"CtripAvgPrice":335},{"Name":"南平","Night":2,"AvgPrice":255,"CtripAvgPrice":254},{"Name":"泸州","Night":2,"AvgPrice":148,"CtripAvgPrice":286},{"Name":"丹东","Night":2,"AvgPrice":364,"CtripAvgPrice":273},{"Name":"葫芦岛","Night":2,"AvgPrice":169,"CtripAvgPrice":275},{"Name":"定西","Night":2,"AvgPrice":170,"CtripAvgPrice":233},{"Name":"盘锦","Night":2,"AvgPrice":368,"CtripAvgPrice":265},{"Name":"六盘水","Night":2,"AvgPrice":278,"CtripAvgPrice":231},{"Name":"都匀","Night":2,"AvgPrice":359,"CtripAvgPrice":246},{"Name":"商洛","Night":2,"AvgPrice":189,"CtripAvgPrice":223},{"Name":"武威","Night":2,"AvgPrice":151,"CtripAvgPrice":188},{"Name":"大石桥","Night":2,"AvgPrice":318,"CtripAvgPrice":130},{"Name":"平湖","Night":2,"AvgPrice":338,"CtripAvgPrice":301},{"Name":"蒲城","Night":2,"AvgPrice":188,"CtripAvgPrice":190},{"Name":"安龙","Night":1,"AvgPrice":168,"CtripAvgPrice":168},{"Name":"巫溪","Night":1,"AvgPrice":248,"CtripAvgPrice":254},{"Name":"宿迁","Night":1,"AvgPrice":198,"CtripAvgPrice":222},{"Name":"益阳","Night":1,"AvgPrice":248,"CtripAvgPrice":258},{"Name":"潜山","Night":1,"AvgPrice":228,"CtripAvgPrice":405},{"Name":"云浮","Night":1,"AvgPrice":488,"CtripAvgPrice":319},{"Name":"奉节","Night":1,"AvgPrice":278,"CtripAvgPrice":304},{"Name":"巫山","Night":1,"AvgPrice":206,"CtripAvgPrice":253},{"Name":"乐清","Night":1,"AvgPrice":245,"CtripAvgPrice":274},{"Name":"密山","Night":1,"AvgPrice":168,"CtripAvgPrice":159},{"Name":"大英","Night":1,"AvgPrice":208,"CtripAvgPrice":256},{"Name":"乐平","Night":1,"AvgPrice":178,"CtripAvgPrice":265},{"Name":"铜仁","Night":1,"AvgPrice":328,"CtripAvgPrice":252},{"Name":"大同","Night":1,"AvgPrice":199,"CtripAvgPrice":263},{"Name":"七台河","Night":1,"AvgPrice":159,"CtripAvgPrice":193},{"Name":"垫江","Night":1,"AvgPrice":176,"CtripAvgPrice":211},{"Name":"奉化","Night":1,"AvgPrice":142,"CtripAvgPrice":330},{"Name":"乳山","Night":1,"AvgPrice":300,"CtripAvgPrice":169},{"Name":"平顶山","Night":1,"AvgPrice":128,"CtripAvgPrice":255},{"Name":"北海","Night":1,"AvgPrice":398,"CtripAvgPrice":342},{"Name":"仁寿","Night":1,"AvgPrice":238,"CtripAvgPrice":202},{"Name":"西双版纳","Night":1,"AvgPrice":318,"CtripAvgPrice":453},{"Name":"通辽","Night":1,"AvgPrice":298,"CtripAvgPrice":268},{"Name":"湘潭","Night":1,"AvgPrice":248,"CtripAvgPrice":259},{"Name":"滕州","Night":1,"AvgPrice":127,"CtripAvgPrice":239},{"Name":"巢湖","Night":1,"AvgPrice":179,"CtripAvgPrice":297},{"Name":"东营","Night":1,"AvgPrice":228,"CtripAvgPrice":237},{"Name":"秀山","Night":1,"AvgPrice":178,"CtripAvgPrice":198},{"Name":"开封","Night":1,"AvgPrice":199,"CtripAvgPrice":244},{"Name":"都江堰","Night":1,"AvgPrice":169,"CtripAvgPrice":443},{"Name":"瑞金","Night":1,"AvgPrice":199,"CtripAvgPrice":171},{"Name":"许昌","Night":1,"AvgPrice":258,"CtripAvgPrice":216},{"Name":"章丘","Night":1,"AvgPrice":299,"CtripAvgPrice":257},{"Name":"自贡","Night":1,"AvgPrice":147,"CtripAvgPrice":305},{"Name":"枣阳","Night":1,"AvgPrice":268,"CtripAvgPrice":301},{"Name":"老河口","Night":1,"AvgPrice":180,"CtripAvgPrice":182},{"Name":"凌源","Night":1,"AvgPrice":151,"CtripAvgPrice":146},{"Name":"新余","Night":1,"AvgPrice":278,"CtripAvgPrice":255},{"Name":"宜城","Night":1,"AvgPrice":160,"CtripAvgPrice":192},{"Name":"余姚","Night":1,"AvgPrice":369,"CtripAvgPrice":297},{"Name":"衢州","Night":1,"AvgPrice":218,"CtripAvgPrice":264},{"Name":"安顺","Night":1,"AvgPrice":190,"CtripAvgPrice":237},{"Name":"安康","Night":1,"AvgPrice":138,"CtripAvgPrice":247},{"Name":"临夏市","Night":1,"AvgPrice":229,"CtripAvgPrice":215},{"Name":"泰州","Night":1,"AvgPrice":398,"CtripAvgPrice":251},{"Name":"大邑","Night":1,"AvgPrice":198,"CtripAvgPrice":372},{"Name":"白银","Night":1,"AvgPrice":168,"CtripAvgPrice":222},{"Name":"安阳","Night":1,"AvgPrice":368,"CtripAvgPrice":229},{"Name":"彬县","Night":1,"AvgPrice":320,"CtripAvgPrice":320},{"Name":"吉安","Night":1,"AvgPrice":338,"CtripAvgPrice":264},{"Name":"漳州","Night":1,"AvgPrice":188,"CtripAvgPrice":321},{"Name":"平潭","Night":1,"AvgPrice":239,"CtripAvgPrice":374},{"Name":"巴中","Night":1,"AvgPrice":188,"CtripAvgPrice":193},{"Name":"商丘","Night":1,"AvgPrice":188,"CtripAvgPrice":210},{"Name":"云阳","Night":1,"AvgPrice":240,"CtripAvgPrice":334},{"Name":"贺州","Night":1,"AvgPrice":318,"CtripAvgPrice":232},{"Name":"潜江","Night":1,"AvgPrice":178,"CtripAvgPrice":254},{"Name":"天门","Night":1,"AvgPrice":158,"CtripAvgPrice":183},{"Name":"寿县","Night":1,"AvgPrice":288,"CtripAvgPrice":288},{"Name":"岳西","Night":1,"AvgPrice":398,"CtripAvgPrice":331},{"Name":"伊宁市","Night":1,"AvgPrice":378,"CtripAvgPrice":270},{"Name":"德州","Night":1,"AvgPrice":298,"CtripAvgPrice":208},{"Name":"咸宁","Night":1,"AvgPrice":138,"CtripAvgPrice":228},{"Name":"亳州","Night":1,"AvgPrice":289,"CtripAvgPrice":220},{"Name":"崇阳","Night":1,"AvgPrice":190,"CtripAvgPrice":503},{"Name":"资阳","Night":1,"AvgPrice":168,"CtripAvgPrice":267},{"Name":"宿松","Night":1,"AvgPrice":218,"CtripAvgPrice":218},{"Name":"柳州","Night":1,"AvgPrice":198,"CtripAvgPrice":275},{"Name":"恩施","Night":1,"AvgPrice":108,"CtripAvgPrice":226},{"Name":"吉首","Night":1,"AvgPrice":256,"CtripAvgPrice":237},{"Name":"金昌","Night":1,"AvgPrice":228,"CtripAvgPrice":199},{"Name":"驻马店","Night":1,"AvgPrice":163,"CtripAvgPrice":239},{"Name":"河间","Night":1,"AvgPrice":137,"CtripAvgPrice":141},{"Name":"广安","Night":1,"AvgPrice":148,"CtripAvgPrice":212},{"Name":"赤壁","Night":1,"AvgPrice":168,"CtripAvgPrice":215}],"TolMbrHoseInfo":{"TolNight":2412,"TolAvgPrice":356,"TolCtripAvgPrice":293}}};
        //初始赋值
        _starPerInfo = _hotelStarInfo.HotelStarPerInfo;
        _htlHosInfo = _hotelStarInfo.HotelHosInfo;
        //初始化
        starPerc.init();
        //绘制图表
        cityHosPric.init();
        noDataID.unmask();
    }
    //☆=================== Fun E ===================☆
    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#htlSubNavID').find('a'), _headSelectInfo);
        hotelStarInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(2);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);