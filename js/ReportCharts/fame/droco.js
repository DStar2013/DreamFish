var dpHeaderSuccess = function () {
}

var Droco_Funs = (function ($) {
    var comInfo = (function () {
        var headInfo = [],
            footerInfo = [],
            hotelSubNavInfo = [],
            flightSubNavInfo = [],
            filterBarInfo = [];
        //headInfo
        headInfo.push('<div class="view_wrap"><h1 class="logo"><a href="http://ct.ctrip.com/crptravel/index.aspx"><i class="icon i1">Ctrip - 携程</i></a></h1><h2 class="site_name">' + '在线报表' + '<em>' + 'onLine Report' + '</em></h2>');
        headInfo.push('<ul id="lanVerID" class="language_version"><li><a id="chV" title="中文版" class="current"><i class="icon i2">中文版</i></a></li><li><a id="enV" title="English" class=""><i class="icon i3">英文版</i></a></li></ul>');
        headInfo.push('<div id="menu" class="menu"><ul>');
        headInfo.push('<li class="cur"><a dLink="../ReportUI/SumPage.html" href="SumPage.html">' + '总概' + '</a></li>');
        headInfo.push('<li><a dLink="../Flight/FlightPage.html" href="FlightPage.html">' + '机票' + '</a></li>');
        headInfo.push('<li><a dLink="../Hotel/HotelPage.html" href="HotelPage.html">' + '酒店' + '</a></li>');
        headInfo.push('<li><a dLink="../ReportUI/TrainPage.html" href="TrainPage.html">' + '火车票' + '</a></li>');
        headInfo.push('<li><a dLink="../ReportUI/PositionTracking.html" href="PositionTracking.html">' + '定位跟踪' + '</a></li>');
        headInfo.push('<li class="backLava"></li></ul></div></div>');
        //footerInfo
        footerInfo.push('<div class="view_wrap"><p>' + '尾部赞助支付宝赞助下哦' + '</p><p>' + '~.~' + '</p><p>Copyright. All Rights Reserved.</p></div>');
        //hotelSubNavInfo
        hotelSubNavInfo.push('<ul id="htlSubNavID"><li class="cur"><a dLink="HotelPage.html" href="HotelPage.html">' + '酒店总体情况' + '</a></li><li><a dLink="HotelAgreement.html" href="HotelAgreement.html">' + '协议酒店' + '</a></li><li><a dLink="HotelStar.html" href="HotelStar.html">' + '星级' + '</a></li><li><a dLink="HotelCity.html" href="HotelCity.html">' + '城市' + '</a></li><li><a dLink="HotelSvALs.html" href="HotelSvALs.html">' + '节省与损失' + '</a></li></ul>');
        //flightSubNavInfoxs
        flightSubNavInfo.push('<ul id="fliSubNavID"><li class="cur"><a dLink="FlightPage.html.html" class="line2" href="FlightPage.html">' + '机票消费' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightDepAnysis.html" href="FlightDepAnysis.html">' + '部门分析' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightPsgerAnysis.html" href="FlightPsgerAnysis.html">' + '乘机人分析' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightPositions.html" href="FlightPositions.html">' + '舱位' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightCarriers.html" href="FlightCarriers.html">' + '承运商' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightRoutes.html" href="FlightRoutes.html">' + '航线' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightFontDays.html" href="FlightFontDays.html">' + '提前预订天数' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightSvALs.html" href="FlightSvALs.html">' + '节省与损失' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightNoUseTickets.html" href="FlightNoUseTickets.html">' + '未使用机票' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightAvtAgrmt.html" href="FlightAvtAgrmt.html">' + '协议航空' + '</a></li>');
        flightSubNavInfo.push('<li><a dLink="FlightCarbEm.html" href="FlightCarbEm.html">' + '碳排放' + '</a></li></ul>');
        //FilterBarInfo
        filterBarInfo.push('<div class="filter_option option1" id="masterAccountID"><label>' + '主帐户' + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option2" id="departmentID"><label>' + '部门' + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option3" id="consumerInfoID"><label>' + '消费属性' + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option4"><label>' + '时间范围' + '</label><span class="" id="startDateID">yyyy-mm-dd<i class="icon i5 for_time1"></i></span><div class="option_box date date1 hidepop" style="display:none" id="startDateSelID"><ul id="stDateUlID"></ul></div><span class="time_connector">-</span><span class="" id="endDateID">yyyy-mm-dd<i class="icon i5"></i></span><div class="option_box date hidepop" style="display:none" id="endDateSelID" ><ul id="endDateUlID"></ul></div></div><div class="filter_search"><a href="javascript:void(0)" id="searchBtnID"><i class="icon i21"></i>' + '查询' + '</a></div>');

        return {
            HeadInfo: headInfo.join(""),
            FooterInfo: footerInfo.join(""),
            HotelSubNavInfo: hotelSubNavInfo.join(""),
            FlightsSubNavInfo: flightSubNavInfo.join(""),
            FilterBarInfo: filterBarInfo.join("")
        };
    })();

    var f = {};
    //Header
    f.getHeader = function (index) {
        var getSliderDistance = function (array_w, i) {
            var arr = array_w.slice(0, i),
			len = arr.length,
			sum = 0;
            for (var j = 0; j < len; j++) {
                sum += arr[j];
            }
            return sum;
        };
        (function () {
            $('.header').append(comInfo.HeadInfo);
            //ch-en切换的url
            var cv = $('#chV'), ev = $('#enV'), m = $('#menu'),
                pathName = window.location.pathname,
                dLink = pathName.substr(pathName.lastIndexOf('/') + 1),
                lhash = window.location.hash;
            cv.attr('href', dLink + '?lang=zh-cn' + lhash);
            ev.attr('href', dLink + '?lang=en' + lhash);
            //current Class
            $('#chV,#enV').removeClass("current");
            lanType == "en" ? ev.addClass("current") : cv.addClass("current");

            //头部slider
            m.find('li').removeClass('cur');
            m.find('li').eq(index).addClass('cur');
            var array_w = m.find('li').map(function () { return $(this).outerWidth(true); });
            m.find('.backLava').css({
                'width': array_w[index],
                'left': getSliderDistance(array_w, index)
            });
            BackLava();
        } ());

    };
    //Footer
    f.getFooter = function () {
        $('.footer').append(comInfo.FooterInfo);
    };
    // 获取酒店sub_nav区域
    f.getHotelSubNav = function (index) {
        (function () {
            $('.sub_nav').append(comInfo.HotelSubNavInfo);
            //class 变动
            $('#htlSubNavID').find('li').removeClass('cur');
            $('#htlSubNavID').find('li').eq(index).addClass('cur');
        } ());
    };
    //获取机票sub_nav区域
    f.getFlightsSubNav = function (index) {
        (function () {
            $('.sub_nav').append(comInfo.FlightsSubNavInfo);
            //class变动
            $('#fliSubNavID').find('li').removeClass('cur');
            $('#fliSubNavID').find('li').eq(index).addClass('cur');
        } ());
    };
    // 获取筛选区域
    f.getFilterBar = function () {
        (function () {
            $('.filter_bar').append(comInfo.FilterBarInfo);
            //head init
            dpHeader.init();
            //1.1 menu_ico展示隐藏
            $('.menu_ico').bind('click', function () { $('.sub_nav').addClass('on'); });
            $('.icon.i4').bind('click', function () { $('.sub_nav').removeClass('on'); });
            //success 回调
            dpHeaderSuccess();
        } ());
    };

    // Menu滑动块
    var BackLava = function () {
        var container = $('#menu'),
		elements = $('li', container),
		className = 'cur',
		slider = $('.backLava', container),
		now_index = $(elements).filter('.cur').index(),
		array_w = $(elements).map(function () { return $(this).outerWidth(true); }),
		initial_width = $('.cur').width(),
		initial_position = $('.cur').position();
        $('.backLava').css({ left: initial_position.left, width: initial_width });
        // 初始化滑块的宽度及位置

        $(container).on('click', 'li', function () {
            // 获取当前点击的元素索引
            now_index = $(this).index();
            // 添加class
            $(this).addClass(className).siblings().removeClass(className);
            // 滑块移动至当前位置
            setSlider(now_index);
        });
        $(container).on('mouseenter', 'li', function () {
            // 获取当前索引
            var i = $(this).index();
            // 滑块移动至当前位置
            setSlider(i);
        });
        $(container).on('mouseleave', function () {
            // 鼠标离开导航区域后, 滑块还原至最后点击的元素处
            setSlider(now_index);
        });
        function setSlider(i) {
            $(slider).width(array_w[i]);
            $(slider).stop(true, true).animate({ 'left': getSliderDistance(i) }, 'fast');
            // console.log(getSliderDistance(i));
        }
        function getSliderDistance(i) {
            var arr = array_w.slice(0, i),
			len = arr.length,
			sum = 0;
            for (var j = 0; j < len; j++) {
                sum += arr[j];
            }
            return sum;
        }
    };
    return f;
})(jQuery);

// 打印下载
jQuery(function ($) {
    var funsLayer = '<div class="funs_layer"><ul><li class="print"><a href="javascript:window.print();" class="icon i12" id="printID">打印</a></li><li class="download"><a href="javascript:void(0);" class="icon i13" id="downloadID">下载</a></li></ul></div>';
    $('body').append(funsLayer);
    $('.funs_layer').css({ 'right': '0', 'bottom': '24px' });
    $('#downloadID').bind('click', function (event) {
        var _a = "", _c = "", _d = "", _st = "", _et = "";
        if (_headInitInfo && _headSelectInfo) {
            _a = _headInitInfo.masterAccountInfo[_headSelectInfo.AccountIndex];
            _c = _headInitInfo.consumerAttrInfo[_headSelectInfo.ConsumIndex];
            _d = _headInitInfo.departmentInfo[_headSelectInfo.DepartIndex];
            _st = _headSelectInfo.StartTime; _et = _headSelectInfo.EndTime;
        }
        var d = { AcountID: _a && _a.Value, AcountName: _a && _a.Name, ConsumeType: _c && _c.Value, ConsumeTypeName: _c && _c.Name, Depart: _d && _d.Value, DepartName: _d && _d.Name, StartTime: _st, EndTime: _et };
        CM.submitForm({ url: '../ReportUI/OrderDownload', method: 'POST', target: '_blank', data: d });
    });
});
