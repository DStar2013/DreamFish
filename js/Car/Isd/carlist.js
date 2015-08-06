(function ($) {
    var AjaxUrl = {
        AreaEmptySource: '/car/Scripts/data/jsonpResponse.js',
        tcCitySource: '/car/ajax/GetServiceCity?type=isd&se=s',
        scCitySource: '/car/ajax/GetServiceCity?type=isd&se=e',
        tcAreaSource: '/car/ajax/GetLocation?type=isd&cityid=',
        carListSource: '/car/Isd/GetCarList',
        bookingUrl: "/car/Isd/Booking"
    }
    //
    var OP = {
        CarListAjaxObj: null
    };

    /*
    /*TC_City 取车城市，SD_City 还车城市，TC_Area 取车区域
    /*C_Date 取车时间-还车时间
    /*Page_Foot 分页对象
    /*GD_Map 高德地图
    */
    var MOD = {};

    //Controls Init
    function ControlsInit() {
        MOD.TC_City = UIControl.CityControl.InitNormalCity({
            txtCity: '#tcCity',
            hidCity: '#hidTc',
            source: AjaxUrl.tcCitySource,
            onchange: function (o) {
                //更改还车城市
                MOD.SD_City.setData({ id: o.id, name: o.name });
                //清空还车区域
                MOD.TC_Area.setCity({
                    cityname: o.name,
                    source: AjaxUrl.tcAreaSource + o.id
                })
                MOD.TC_Area.setData(null);
            }
        });
        //
        MOD.TC_Area = UIControl.AreaControl.InitNormalArea({
            txtArea: '#tcArea',
            cityName: $("#tcCity").value(),
            msg: '请选择取车区域',
            initdata: {
                value: $("#paddress").value(),
                data: $("#paddressDetail").value()
            },
            source: AjaxUrl.tcAreaSource + PageInfo.ModelInfo.PostParam.pcityid
        });
        //
        MOD.SD_City = UIControl.CityControl.InitNormalCity({
            txtCity: '#scCity',
            hidCity: '#hidSc',
            source: AjaxUrl.scCitySource,
            onchange: function (o) {

            }
        });
        //初始化date
        var _p = PageInfo.ModelInfo.PostParam.ptime, _pdate = (_p + ":00").toDateTime(),
            _r = PageInfo.ModelInfo.PostParam.rtime, _rdate = (_r + ":00").toDateTime();
        $('#tcDate').value(_pdate.toFormatString('yyyy-MM-dd')); $('#tcTime').value(_pdate.toFormatString('hh:mm'));
        $('#scDate').value(_rdate.toFormatString('yyyy-MM-dd')); $('#scTime').value(_rdate.toFormatString('hh:mm'));
        //
        MOD.C_Date = UIControl.DateControl.InitYMDHDate({
            IsGTHour: true,
            Start: {
                ymdObj: '#tcDate',
                hObj: '#tcTime',
                Min: { addDays: 0, addMin: 60 },
                Max: { addDays: 90, hm: "23:00" },
                Default: { addDays: 1, hm: "10:00" },
                layer: '#tc_date_layer'
            },
            End: {
                ymdObj: '#scDate',
                hObj: '#scTime',
                Min: { addDays: 0, addMin: 60 },
                Max: { addDays: 90, hm: "23:00" },
                Default: { addDays: 2, hm: "10:00" },
                layer: '#sc_date_layer'
            }
        });
        //
        MOD.GD_Map = new UIControl.MapControl.InitMapParam({
            baseObj: '#mapDiv',
            initData: {
                start: MOD.TC_Area ? {
                    cityName: $("#tcCity").value(),
                    value: MOD.TC_Area.getData().text,
                    data: MOD.TC_Area.getData().value
                } : null,
                end: null
            },
            emptySource: AjaxUrl.AreaEmptySource
        });

        //
        $('#searchBtn').bind('click', function () {
            if (MOD.TC_City.validate() && MOD.SD_City.validate() && MOD.TC_Area.validate() && MOD.C_Date.checkDate()) {
                PageList.ajaxInit();
            }
        });
        //ie placeholder
        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#IsdSearchDiv').find('input[type="text"]'));
    }
    function GetDistanceDays() {
        var sList = MOD.C_Date.getSDate().split(" "), eList = MOD.C_Date.getEDate().split(" "), sd = sList[0].toDate(), ed = eList[0].toDate();
        var dd = (ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24);
        return parseInt(dd + 1);
    }
    //
    var parseData = {
        set: function () {


        }
    }
    //
    var ListFilter = {
        init: function (data) {
            data && ListFilter.drawFilter(data);
        },
        drawFilter: function (data) {
            var filterData = ListFilter.fixSideFilter(data), sideData = filterData.sideData, vendorData = filterData.vendorList;
            $('#listfilter').html($.tmpl.render($('#filterTmpl').html(), sideData));
            $('#vendorDetail').html($.tmpl.render($('#vendorTmpl').html(), vendorData));
            ListFilter.bindEv();
        },
        fixSideFilter: function (data) {
            var vendorInfo = [], vendorList = data.VendorList;
            for (var i = 0, l = vendorList.length; i < l; i++) {
                var _ = vendorList[i].StoreList;
                for (var j = 0; j < _.length; j++) {
                    _[j].VendorName = vendorList[i].VendorName; vendorInfo.push(_[j]);
                }
                //tmp.concat(data[i].StoreList);
            }

            return {
                sideData: {
                    VendorLength: vendorInfo.length,
                    VendorList: data.VendorList,
                    PriceList: data.PriceList,
                    VehicleGroupList: data.VehicleGroupList,
                    BrandList: data.BrandList,
                    TransmissionList: data.TransmissionList
                },
                vendorList: vendorInfo
            }
        },
        fixVendorFilter: function (data) {
            var tmp = [];
            for (var i = 0, l = data.length; i < l; i++) {
                var _ = data[i].StoreList;
                for (var j = 0; j < _.length; j++) {
                    _[j].VendorName = data[i].VendorName; tmp.push(_[j]);
                }
                //tmp.concat(data[i].StoreList);
            }
            return tmp;
        },
        bindEv: function () {
            var fbd = $('#filterBD'), vD = $('#vendorDetail'), flD = $('#filterHD .list>div');
            //body
            var _addCheck = function (obj) {
                var sp = $(document.createElement('span'));
                sp.addClass('itemChecked'); sp.attr('dVal', obj.id); sp.attr('name', $(obj).attr('name'));
                sp.html($(obj).parentNode().text() + '<a href="javascript:void(0)" class="btn-delete">×</a>');
                flD.append(sp);
                sp.find('.btn-delete').bind('click', function (e) {
                    var p = $(this).parentNode(), pObj = document.getElementById(p.attr('dval'));
                    //$('#' + p.attr('dval')).click(); p.remove();
                    if ("filter_vendorName" == $(pObj).attr('name')) {
                        vD.find('li[dval="' + pObj.id + '"]').removeClass("checked");
                    }
                    pObj && (pObj.checked = false); p.remove();
                    ListFilter.filterAjax();
                });
            }
            fbd.find('[type="checkbox"]').bind('click', function (e) {
                //if vendor check vendorDetail
                if ("filter_vendorName" == $(this).attr('name')) {
                    var vdobj = vD.find('li[dval="' + this.id + '"]');
                    this.checked ? vdobj.addClass("checked") : vdobj.removeClass("checked");
                }
                //add
                if (this.checked) {
                    _addCheck(this);
                } else {
                    flD.find('.itemChecked[dVal="' + this.id + '"]').remove();
                }
                ListFilter.filterAjax();
            });
            fbd.find('.list-wrap .btn-expand').bind('click', function (e) {
                $('#vendorDetail').slideDown();
            });
            $('#vendorDetail .btn-close').bind('click', function (e) {
                $('#vendorDetail').slideUp();
            });
            $('#vendorDetail li').bind('click', function (e) {
                var t = $(this), oid = t.attr("dval"), obj = document.getElementById(oid);
                if (t.hasClass("checked")) {
                    t.removeClass("checked"); obj && (obj.checked = false);
                    flD.find('.itemChecked[dVal="' + obj.id + '"]').remove();
                } else {
                    t.addClass("checked"); obj && (obj.checked = true);
                    _addCheck(obj);
                }
                ListFilter.filterAjax();
            });
            //
            $('#filter_fold').bind('click', function (e) {
                var o = fbd.find("div.s-filter-item").slice(2), t = $(this);
                if (t.hasClass("folded")) {
                    t.removeClass("folded");
                    t.html(label.Less + '<i class="i-tri i-tri-up"></i>'); o.slideDown(); //收起
                } else {
                    t.addClass("folded"); t.html(label.SlideUp + '<i class="i-tri i-tri-down"></i>'); o.slideUp(); //展开全部
                }
            });
            //
            $('#filterHD .btn-clear').bind('click', function (e) {
                $('#filterHD .list>div span').each(function (a) {
                    var _id = a.attr('dval'), o = document.getElementById(_id);
                    if ("filter_vendorName" == a.attr('name')) {
                        $('#vendorDetail').find('li[dval="' + _id + '"]').removeClass("checked")
                    }
                    o && (o.checked = false); a.remove();
                });
                ListFilter.filterAjax();
            });
        },
        getFilterData: function (mark) {
            //
            var tcc = MOD.TC_City.getData(), tca = MOD.TC_Area.getData(), sdc = MOD.SD_City.getData(),
                cdate = MOD.C_Date.getSDate(), edate = MOD.C_Date.getEDate(), geoinfo = "";
            //
            var areaArr = tca.value ? tca.value.split('|') : [];
            if (areaArr.length > 3) {
                var latlon = areaArr[2].split(',');
                geoinfo = [latlon[0], latlon[1], areaArr[1]].join('|');
            }
            var rd = {
                feetype: $("#feeType").value(),
                pcity: tcc.id,
                rcity: sdc.id,
                ptime: cdate,
                rtime: edate,
                pgeo: geoinfo,
                pageIndex: MOD.Page_Foot ? MOD.Page_Foot.get('current') : 1,
                pageSize: 10,
                orderby: $('#sideSort').attr('dval') ? $('#sideSort').attr('dval') : "0"
            };
            if (mark) {
                var _cR = ListFilter.getFilterChecked();
                rd.storeids = _cR.vendor.join(",");
                rd.priceIds = _cR.price.join(",");
                rd.brands = _cR.brand.join(",");
                rd.transmissionIds = _cR.transmission.join(",");
                rd.vehicleGroupIds = _cR.vehiclegroup.join(",");
            }
            return rd;
        },
        getFilterChecked: function () {
            var fbd = $('#filterBD');
            return {
                vendor: ListFilter.getCheckData(fbd.find('input[name="filter_vendorName"]')),
                price: ListFilter.getCheckData(fbd.find('input[name="filter_price"]')),
                vehiclegroup: ListFilter.getCheckData(fbd.find('input[name="filter_vehicle"]')),
                brand: ListFilter.getCheckData(fbd.find('input[name="filter_brand"]')),
                transmission: ListFilter.getCheckData(fbd.find('input[name="filter_transmission"]'))
            }
        },
        getCheckData: function (obj) {
            var tmp = [];
            obj.each(function (o) {
                if (o && o[0] && o[0].checked) {
                    tmp.push(o.attr('dVal'));
                }
            });
            return tmp;
        },
        filterAjax: function () {
            var d = ListFilter.getFilterData(true), lB = $('#listBody'), lL = $('#listLoading'), lNR = $('#listNoResult');
            //
            lB.css('display', 'none'); lNR.css('display', 'none'); lL.css('display', '');
            //
            OP.CarListAjaxObj && OP.CarListAjaxObj.abort && OP.CarListAjaxObj.abort();
            OP.CarListAjaxObj = $.ajax(AjaxUrl.carListSource, {
                method: "POST",
                context: d,
                onsuccess: function (e) {
                    CarList.FilterDraw($.parseJSON(e.responseText));
                    //CarList.BaseDraw($.parseJSON(e.responseText));
                    lL.css('display', 'none'); lB.css('display', '');
                },
                onerror: function (e) {
                    //lL.css('display', 'none'); lNR.css('display', '');
                    console.log('Filter Ajax Error!');
                }
            });
        }
    };
    //
    var CarList = {
        data: null,
        _DCNT: [label.Discount, label.Cheapen, label.Free, label.Enjoy, label.Send],  //   ["折", "减", "免", "享", "送"],
        initData: function (data) {
            var TD = {};  //days = GetDistanceDays();
            if (!CMFun.IsEmpty(data)) {
                var vendorInfo = CarList.getVendorInfo(data.VendorList);
                TD.TotalCount = data.TotalVehicle;
                TD.StoreCount = vendorInfo.length;
                //车型列表
                var CarListInfo = [];
                if (data && data.VehicleList) {
                    for (var i = 0; i < data.VehicleList.length; i++) {
                        var cInfo = data.VehicleList[i]; cInfo._ = {};
                        var vdesc = [];
                        cInfo._.vehicleImage = (CMFun.IsEmpty(cInfo.ImageList) || cInfo.ImageList.length == 0) ? "" : cInfo.ImageList[0].ImageUrl;
                        //
                        vdesc.push(cInfo.TransmissionType == 1 ? label.AT : label.MT); //"自排" : "手排"
                        cInfo.CarriageDesc && (vdesc.push(cInfo.CarriageDesc)); //车辆箱数
                        cInfo.Displacement && (vdesc.push(cInfo.Displacement + "L")); //车型排量说明
                        cInfo._.vdesc = vdesc.join("/");
                        //
                        cInfo._.dLevel = cInfo.DiamondLevel || 0;
                        //
                        cInfo._.sList = [];
                        for (var j = 0; j < cInfo.StoreVehicleList.length; j++) {
                            var tmp = cInfo.StoreVehicleList[j]; tmp._ = {};
                            //
                            tmp._.storeAddress = tmp.PickupStore.GeoInfo ? (tmp.PickupStore.GeoInfo.Address || "") + (tmp.PickupStore.GeoInfo.AddressDetail || "") : "";
                            tmp._.storeVal = CarList.getGaoDeReq(tmp.PickupStore);
                            tmp._.score = tmp.PickupStore.Score ? "<span>" + tmp.PickupStore.Score + "</span>/5" + label.Score + " </a>" : label.NoScore; //暂无评分
                            //discount
                            tmp._.discount = CarList.getDiscountInfo(tmp.DiscountList);
                            //price
                            //tmp._.tolBasePrice = days * tmp.DailyPriceInfo.OriginalPrice;
                            //tmp._.tolNowPrice = days * tmp.DailyPriceInfo.Price;
                            //BookInfo(取车门店ID|取车门店code|取车门店type|还车门店ID|还车门店code|还车门店type|车型ID|车型code|车型名|供应商ID|供应商Name|供应商图片|乘客数量|车型描述|供应商Code
                            var _bInfo = [];
                            _bInfo.push(tmp.PickupStore.StoreID ? tmp.PickupStore.StoreID : "");
                            _bInfo.push(tmp.PickupStore.StoreCode ? tmp.PickupStore.StoreCode : "");
                            _bInfo.push(tmp.PickupStore.StoreType ? tmp.PickupStore.StoreType : "");
                            _bInfo.push(tmp.DropoffStore.StoreID ? tmp.DropoffStore.StoreID : "");
                            _bInfo.push(tmp.DropoffStore.StoreCode ? tmp.DropoffStore.StoreCode : "");
                            _bInfo.push(tmp.DropoffStore.StoreType ? tmp.DropoffStore.StoreType : "");
                            _bInfo.push(tmp.VehicleID ? tmp.VehicleID : "");
                            _bInfo.push(cInfo.VehicleCode ? cInfo.VehicleCode : "");
                            _bInfo.push(cInfo.VehicleName ? cInfo.VehicleName : "");
                            _bInfo.push(tmp.VendorInfo.VendorID ? tmp.VendorInfo.VendorID : "");
                            _bInfo.push(tmp.VendorInfo.VendorName ? tmp.VendorInfo.VendorName : "");
                            _bInfo.push(tmp.VendorInfo.VendorImageUrl ? tmp.VendorInfo.VendorImageUrl : "");
                            _bInfo.push(cInfo.PassengerNum ? cInfo.PassengerNum : "");
                            _bInfo.push(vdesc.join("/"));
                            _bInfo.push(cInfo.VendorCouponCode ? cInfo.VendorCouponCode : "");
                            tmp._.bookInfo = _bInfo.join('|');
                            //
                            cInfo._.sList.push(tmp);
                        }
                        //
                        CarListInfo.push(cInfo);
                    }
                }
                TD.CarListInfo = CarListInfo;
            }
            CarList.data = TD;
        },
        getGaoDeReq: function (d) {
            //cityName,storeAddress,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
            var t = [];
            t.push(MOD.TC_City ? MOD.TC_City.getData().name : "");
            if (d.GeoInfo) {
                t.push((d.GeoInfo.Address || "") + (d.GeoInfo.AddressDetail || ""), d.GeoInfo.Longitude, d.GeoInfo.Latitude);
            } else {
                t.push(",,");
            }
            t.push(d.StoreName ? d.StoreName : "");
            if (MOD.TC_Area && !$.isEmptyObject(MOD.TC_Area.getData())) {
                var _tmp = MOD.TC_Area.getData().value.split('|');
                t.push(_tmp[1], _tmp[2]);
            } else { t.push(',,,'); }
            return t.join(',');
        },
        getDiscountInfo: function (d) {
            if (!d) return null;
            var t = [];
            for (var i = 0; i < d.length; i++) {
                var p = d[i];
                p.TypeName = CarList._DCNT[d[i].DiscountType];
                t.push(p);
            }
            return t;
        },
        getVendorInfo: function (d) {
            var tmp = [];
            for (var i = 0, l = d.length; i < l; i++) {
                var _ = d[i].StoreList;
                for (var j = 0; j < _.length; j++) {
                    _[j].VendorName = d[i].VendorName; tmp.push(_[j]);
                }
            }
            return tmp;
        },
        BaseDraw: function (d) {
            ListFilter.init(d);
            CarList.initData(d);
            CarList.drawTitle(); CarList.drawSortTitle();
            d ? CarList.drawBody() : CarList.noResultBase();
            CarList.drawFooter();
        },
        FilterDraw: function (d) {
            CarList.initData(d);
            CarList.drawTitle(); CarList.drawSortTitle();
            d ? CarList.drawBody() : CarList.noResultFilter();
            CarList.drawFooter();
        },
        BodyDraw: function (d) {
            CarList.initData(d);
            d ? CarList.drawBody() : CarList.noResultBody();
        },
        drawTitle: function () {
            $('#carListTitle').html($.tmpl.render($('#carTitleTmpl').html(), {
                Name: MOD.TC_Area.getData().text ? MOD.TC_Area.getData().text : "",
                StoreCount: CarList.data.StoreCount,
                TotalCount: CarList.data.TotalCount
            }));
        },
        drawSortTitle: function () {
            var ss = $('#sideSort');
            ss.html('<div dVal="0" class="item active">' + label.MostPopular + '</div><div dVal="1" class="item">' + label.PriceOrderByDescending + '</div>'); //最受欢迎 价格（由高到低）
            ss.attr("dVal", "0");
            ss.find('div').bind('click', function (e) {
                ss.find('div').removeClass("active"); $(this).addClass("active"); ss.attr("dVal", "0");
                if ($(this).attr('dVal') == "1") {
                    $(this).attr('dVal', "2").html(label.PriceOrderBy); ss.attr("dVal", "1"); //价格（由低到高）
                } else if ($(this).attr('dVal') == "2") {
                    $(this).attr('dVal', "1").html(label.PriceOrderByDescending); ss.attr("dVal", "2"); //价格（由高到低）
                }
                CarList.listAjax();
            });
        },
        getSubmitInfo: function (d, couponCode) {
            var t = d.split('|');
            if (t.length > 10 && MOD.C_Date && MOD.TC_City && MOD.SD_City) {
                return {
                    psid: t[0],
                    pscode: t[1],
                    pstype: t[2],
                    rsid: t[3],
                    rscode: t[4],
                    rstype: t[5],
                    feeType: $("#feeType").value(),
                    ptime: MOD.C_Date.getSDate(),
                    rtime: MOD.C_Date.getEDate(),
                    vehicleid: t[6],
                    vehicleCode: t[7],
                    vehicleName: t[8],
                    //vendorCouponCode: couponCode.join(','),
                    vendorCouponCode: t[14],
                    pCityId: MOD.TC_City.getData().id,
                    rCityId: MOD.SD_City.getData().id,
                    pCityName: MOD.TC_City.getData().name,
                    rCityName: MOD.SD_City.getData().name,
                    vendorId: t[9],
                    vendorName: t[10],
                    vendorLogo: t[11],
                    carCapacity: t[12],
                    carDescription: t[13]
                };
            } else {
                return {};
            }
        },
        drawBody: function () {
            //
            $('#carListTitle,#sideSort,#carListInfo,#footPage').css('display', ''); $('#listNoResult').css('display', 'none');
            //
            $('#carListInfo').html($.tmpl.render($('#carListTmpl').html(), CarList.data.CarListInfo)).css('display', '');
            //bodyEv
            $('#carListInfo').find('.ctBox-bd .expand a').bind('click', function (e) {
                var t = $(this), sml = t.parentNode().parentNode().find('[SMK="T"]');
                if (t.hasClass("expanded")) {
                    t.removeClass("expanded"); sml.slideUp();
                    t.html(label.SlideUp + '（' + t.attr("num") + '）<i class="i-tri i-tri-down"></i>'); //展开全部
                } else {
                    t.addClass("expanded"); sml.slideDown();
                    t.html(label.Less + '<i class="i-tri i-tri-up"></i>'); //收起
                }
            });
            $('#carListInfo>div.ctBox').last().addClass("last-ctBox");
            //submit
            $('#carListInfo').find('div.btn-buy').bind('click', function (e) {
                var t = $(this).attr("dval"), couponCode = [];
                $(this).parentNode().find('.promotion').each(function (a) {
                    couponCode.push(a.attr("dval"));
                });
                var d = CarList.getSubmitInfo(t, couponCode);
                CMFun.submitForm({
                    url: AjaxUrl.bookingUrl,
                    method: 'POST',
                    data: d,
                    target: '_blank'
                });
            });
            //GaoDe Map
            $('#carListInfo .location .viewMap').bind('click', function () {
                if (MOD.GD_Map) {
                    //cityName,storeAddress,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
                    MOD.GD_Map.initMap($(this).attr('dval'));
                } else { console.log('Map Control Init Error!'); }
            });
            //
            $('#carListInfo .rc>a').bind('mouseover', function (e) {
                var t = $(this), layer = $('#fuelLayer');
                layer.find('div').html(t.attr("dtVal"));
                //
                layer.data('fi', window.setTimeout(function () {
                    layer.css({
                        'display': '',
                        'top': t.offset().top - t.offset().height - 10 + 'px',
                        'left': t.offset().left + 'px',
                        'margin-left': '-82px',
                        'margin-top': '-50px'
                    });
                }, 150));
                window.clearTimeout(layer.data('fo'));
                e.stop();
            }).bind('mouseout', function (e) {
                var layer = $('#fuelLayer');
                window.clearTimeout(layer.data('fi'));
                layer.data('fo', window.setTimeout(function () {
                    layer.css('display', 'none');
                }, 500));
                e.stop();
            });

        },
        drawFooter: function () {
            //
            var pMax = Math.ceil(CarList.data.TotalCount / 10);
            if (CMFun.IsEmpty(MOD.Page_Foot)) {
                MOD.Page_Foot = UIControl.PageFoot.InitPageFoot({
                    obj: '#footPage .c_page',
                    maxPage: pMax,
                    listeners: {
                        onChange: function (current) {
                            //redraw List
                            CarList.listAjax();
                        }
                    }
                });
            } else {
                MOD.Page_Foot.set('max', pMax);
            }
        },
        listAjax: function () {
            var d = ListFilter.getFilterData(true);
            $('#carListInfo').html($.tmpl.render($('#noCarTmpl').html(), {}));
            //
            OP.CarListAjaxObj && OP.CarListAjaxObj.abort && OP.CarListAjaxObj.abort();
            OP.CarListAjaxObj = $.ajax(AjaxUrl.carListSource, {
                method: "POST",
                context: d,
                onsuccess: function (e) {
                    var d = $.parseJSON(e.responseText);
                    CarList.BodyDraw(d);
                },
                onerror: function (e) {
                    console.log("Body Ajax Error!");
                }
            });
        },
        noResultBase: function () {
            $('#carListTitle,#sideSort,#carListInfo,#footPage').css('display', 'none');
            $('#listNoResult').css('display', ''); $('#listfilter').html('');
        },
        noResultFilter: function () {
            $('#carListTitle,#sideSort,#carListInfo,#footPage').css('display', 'none');
            $('#listNoResult').css('display', '');
        },
        noResultBody: function () {
            $('#carListInfo').css('display', 'none');
            $('#carListTitle,#sideSort,#listNoResult,#footPage').css('display', '');
        }
    }
    //
    var PageList = {
        init: function () {
            PageList.ajaxInit();
        },
        ajaxInit: function () {
            var d = ListFilter.getFilterData(false), lL = $('#listLoading'), lB = $('#listBody'), lNR = $('#listNoResult');
            $('#listfilter').html($('#noFilterTmpl').html());
            //
            $('#vendorDetail').css('display', 'none');
            lB.css('display', 'none'); lNR.css('display', 'none'); lL.css('display', '');
            //$('#vendorDetail,#listBody,#listNoResult').css('display', 'none'); lL.css('display', '');
            //
            OP.CarListAjaxObj && OP.CarListAjaxObj.abort && OP.CarListAjaxObj.abort();
            OP.CarListAjaxObj = $.ajax(AjaxUrl.carListSource, {
                method: "POST",
                context: d,
                onsuccess: function (e) {
                    var d = $.parseJSON(e.responseText);
                    CarList.BaseDraw(d);
                    lL.css('display', 'none'); lB.css('display', '');
                },
                onerror: function (e) {
                    //$('#listfilter').html(""); lL.css('display', 'none'); lNR.css('display', '');
                    console.log('Ajax Init Error!');
                }
            });
        }
    };

    $.ready(function () {
        //load sidebar
        UIControl && UIControl.SideBarControl.LoadSideBar();
        //
        ControlsInit();
        PageList.init();
    });
})(cQuery);
