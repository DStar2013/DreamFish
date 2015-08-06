(function ($) {
    var AjaxUrl = {
        AreaEmptySource: '/car/Scripts/data/jsonpResponse.js',
        CarListSource: '/car/chf/GetCarList',
        BookingUrl: "/car/chf/Booking"
    };
    var OP = {
        CarListAjaxObj: null,
        LastChsTab: null,
        _TbChangeObj: null
    };
    //
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //
    var _BaseData = {
        city: label.ShangHai,
        airport: { text: label.HIAT1T, value: 'SHA|' + label.HIAT1T + '|' + label.HIAT1T + '|2|' + label.ShangHai + '|Shanghai|' + label.China + '|China|31.194276|121.349045|1|10002' },
        location: { text: label.HongQiaoRailwayStation, value: '3156|' + label.HongQiaoRailwayStation + '|' + label.HongQiaoRailwayStation + '|2|' + label.ShangHai + '|Shanghai|' + label.China + '|China|31.194245|121.320895|2|0' },
        jntUseTime: PageInfo.ModelInfo.PostParam.UseTime  //按航班号预定的航班到达时间
    }

    //模块type
    var _ModelTypes = {
        "jnt": 0,
        "snd": 1,
        "jhc": 2,
        "shc": 3
    };

    /*
    /*Tab 头部tab切换
    /*Shc_Station 送火车火车站 Shc_Address 送火车出发地点 Shc_Date 送火车日期
    /*Jhc_Station 接火车火车站 Jhc_Address 接火车出发地点 Jhc_Date 接火车日期
    /*Snd_Airport 送机机场 Snd_Address 接机出发地点 Snd_Date 接机时间
    /*Jnt_FltNO_Num 接机按航班航班号  Jnt_FltNO_ValiMsg 接机按航班验证信息 Jnt_FltNO_Date 接机按航班起飞日期 Jnt_FltNO_Address 接机按航班送达地点
    /*Jnt_Airport_Airport 接机按机场机场 Jnt_Airport_Date 接机按机场接机时间 Jnt_Airport_Address 接机按机场送达地点
    /*GD_Map 高德地图
    */
    var MOD = {};
    //
    var MInit = {
        initJnt: function () {
            //初始化接机模块
            var pp = PageInfo.ModelInfo.PostParam, _initFltNoData = {}, _initAirportData = {};
            var jChsObj = document.getElementById('jntChoose');
            if (_BaseData["jnt"] && !$.isEmptyObject(_BaseData["jnt"]) && _BaseData["jnt"].IsInitOne) {
                if (IsEmpty(pp.FlightNumber)) {
                    //按机场预定
                    jChsObj && jChsObj[1] && (jChsObj[1].selected = true); MInit.jntAirportChs();
                    //
                    _initAirportData.airportInfo = {
                        text: pp.LocationName,
                        value: [pp.LocationCode, pp.LocationName, pp.LocationName, pp.DepartureCityId, pp.DepartureCityName, "", "", "", pp.LocationLat, pp.LocationLng, "", pp.TerminalID].join("|")
                    };
                    _initAirportData.airportAddr = {
                        value: pp.Address,
                        data: ["", pp.Address, pp.Lng + ',' + pp.Lat, pp.ArrivalCityName, pp.AddressDetail].join("|")
                    };
                    _initAirportData.cityname = pp.ArrivalCityName;
                    //初始化date
                    var _idate = (pp.UseTime + ":00").toDateTime();
                    $('#jnt_end_date').value(_idate.toFormatString('yyyy-MM-dd')); $('#jnt_end_time').value(_idate.toFormatString('hh:mm'));
                } else {
                    //按航班号预定
                    jChsObj && jChsObj[0] && (jChsObj[0].selected = true); MInit.jntFlightNOChs();
                    //
                    document.getElementById('jnt_address_flightno').disabled = false;
                    _initFltNoData.fltNoInfo = [pp.FlightNumber, pp.LocationType, pp.LocationCode, pp.LocationName, pp.LocationName, pp.TerminalID, pp.DepartureCityId, pp.DepartureCityName, pp.UseTime, pp.LocationLat, pp.LocationLng].join('|');
                    _initFltNoData.fltNoAddr = {
                        value: pp.Address,
                        data: ["", pp.Address, pp.Lng + ',' + pp.Lat, pp.ArrivalCityName, pp.AddressDetail].join("|")
                    }
                    _initFltNoData.cityname = pp.ArrivalCityName;
                    document.getElementById('jnt_address_flightno').disabled = false;
                    //初始化date
                    $('#jnt_start_date').value(pp.DepartDate);
                    //机场相关
                    _initAirportData.airportInfo = _BaseData.airport;
                    _initAirportData.cityname = _BaseData.city;
                }
            } else {
                _initAirportData.airportInfo = _BaseData.airport;
                _initAirportData.cityname = _BaseData.city;
            }
            //按航班号
            var baseParam = new UIControl.FlightControl.InitParam({
                fltObj: '#jnt_flight_number',
                myFltObj: '#jnt_my_flightno',
                fltLayer: '#jnt_flight_layer',
                validateMsgObj: "#jnt_flight_msg",
                fltType: "jnt",
                errorType: 1, //1-列表页错误提示type
                onvalidate: function (d) {
                    MOD.Jnt_FltNO_Date && MOD.Jnt_FltNO_Date.setDate(d.FlightDepartDate);
                    //
                    MOD.Jnt_FltNO_Num && MOD.Jnt_FltNO_Num.setData(d.Data);
                    MOD.Jnt_FltNO_Address.setCity({
                        source: null,
                        cityname: d.Data && d.Data.split('|').length > 6 ? d.Data.split('|')[7] : ""
                    });
                    //设置UseTime
                    _BaseData.jntUseTime = d.PlanDateTime;
                    //
                    document.getElementById('jnt_address_flightno').disabled = false;
                },
                goAirportEv: function () {
                    //跳转至按机场预定
                    jChsObj && jChsObj[1] && (jChsObj[1].selected = true); MInit.jntAirportChs();
                },
                goOverseaEv: function () {
                    //跳转至海外预定
                },
                goDomesticEv: function () {
                    //跳转至国内预定
                }
            });
            //
            var _isFirst = (!MOD.Jnt_FltNO_Num && !MOD.Jnt_Airport_Airport);

            !MOD.Jnt_FltNO_Num && (MOD.Jnt_FltNO_Num = UIControl.FlightControl.InitFlightNO({
                baseParam: baseParam,
                suggestionSource: "/car/Scripts/data/jsonpResponse.js",
                filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
                myFltSource: "/car/Ajax/GetMyFlight?type=jnt",
                initdata: _initFltNoData.fltNoInfo ? _initFltNoData.fltNoInfo : {},
                onchange: function (val) {
                    document.getElementById('jnt_address_flightno').disabled = true;
                    MOD.Jnt_FltNO_Address && MOD.Jnt_FltNO_Address.setData({ text: '', value: '' });
                    MOD.Jnt_FltNO_Address && MOD.Jnt_FltNO_Address.clearAutoCache();
                    //
                    MOD.Jnt_FltNO_ValiMsg && (MOD.Jnt_FltNO_ValiMsg.DoVali({
                        flightNumber: val,
                        date: MOD.Jnt_FltNO_Date ? MOD.Jnt_FltNO_Date.getValue() : new Date().toDate().toFormatString('yyyy-MM-dd'),
                        type: "jnt"
                    }));
                }
            }));
            !MOD.Jnt_FltNO_ValiMsg && (MOD.Jnt_FltNO_ValiMsg = UIControl.FlightControl.ValidateFlightNO({
                baseParam: baseParam,
                validateSource: "/car/Ajax/GetFlight"
            }));
            !MOD.Jnt_FltNO_Date && (MOD.Jnt_FltNO_Date = UIControl.DateControl.InitNormalDate({
                Start: {
                    startObj: '#jnt_start_date',
                    Min: { addDays: 0 },
                    Max: { addDays: 90 },
                    Default: { addDays: 0 },
                    onchange: function () {
                        document.getElementById('jnt_address_flightno').disabled = true;
                        MOD.Jnt_FltNO_Address && MOD.Jnt_FltNO_Address.setData({ text: '', value: '' });
                        MOD.Jnt_FltNO_Address && MOD.Jnt_FltNO_Address.clearAutoCache();
                        //
                        MOD.Jnt_FltNO_ValiMsg && (MOD.Jnt_FltNO_ValiMsg.DoVali({
                            flightNumber: $('#jnt_flight_number').value(),
                            date: MOD.Jnt_FltNO_Date ? MOD.Jnt_FltNO_Date.getValue() : new Date().toDate().toFormatString('yyyy-MM-dd'),
                            type: "jnt"
                        }));
                    }
                }
            }));
            !MOD.Jnt_FltNO_Address && (MOD.Jnt_FltNO_Address = UIControl.AreaControl.InitNormalArea({
                txtArea: '#jnt_address_flightno',
                msg: label.ChooseServicePlace, //请选择送达地点
                initdata: _initFltNoData.fltNoAddr ? _initFltNoData.fltNoAddr : {},
                cityName: _initFltNoData.cityname ? _initFltNoData.cityname : "",
                source: AjaxUrl.AreaEmptySource,
                filterOnly: true
            }));
            //按机场
            !MOD.Jnt_Airport_Airport && (MOD.Jnt_Airport_Airport = UIControl.AreaControl.InitCHArea({
                txtArea: '#jnt_end_airport',
                msg: label.ChooseAirport, //请选择机场
                initdata: _initAirportData.airportInfo ? _initAirportData.airportInfo : {},
                suggestionSource: "/car/ajax/GetLocation?type=jnt",
                filterSource: "/car/ajax/CHFuzzyFixLocation?type=jnt&key=${key}",
                type: "airport", //train/airport
                onchange: function (o) {
                    MOD.Jnt_Airport_Address && MOD.Jnt_Airport_Address.setCity({
                        source: null,
                        cityname: o.value.split("|").length > 4 ? o.value.split("|")[4] : ""
                    });
                }
            }));
            !MOD.Jnt_Airport_Date && (MOD.Jnt_Airport_Date = UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: '#jnt_end_date',
                    hmObj: '#jnt_end_time',
                    Min: { addDays: 0, addMin: 70 },
                    Max: { addDays: 90, hm: "23:50" },
                    Default: { addDays: 0, addMin: 70 },
                    layer: '#chf_jnt_airport_date_layer'
                }
            }));
            !MOD.Jnt_Airport_Address && (MOD.Jnt_Airport_Address = UIControl.AreaControl.InitNormalArea({
                txtArea: '#jnt_address_airport',
                msg: label.ChooseServicePlace, //请选择送达地点
                initdata: _initAirportData.airportAddr ? _initAirportData.airportAddr : {},
                cityName: _initAirportData.cityname ? _initAirportData.cityname : "",
                source: AjaxUrl.AreaEmptySource,
                filterOnly: true
            }));
            //
            _isFirst && !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#jntSearchDiv').find('input[type="text"]'));
        },
        initSnd: function () {
            var pp = PageInfo.ModelInfo.PostParam, _initData = {};
            //
            if (_BaseData["snd"] && !$.isEmptyObject(_BaseData["snd"]) && _BaseData["snd"].IsInitOne) {
                //初始值
                _initData.airportInfo = {
                    text: pp.LocationName,
                    value: [pp.LocationCode, pp.LocationName, pp.LocationName, pp.ArrivalCityId, pp.ArrivalCityName, "", "", "", pp.LocationLat, pp.LocationLng, "", pp.TerminalID].join("|")
                }
                _initData.airportAddr = {
                    value: pp.Address,
                    data: ["", pp.Address, pp.Lng + ',' + pp.Lat, pp.DepartureCityName, pp.AddressDetail].join("|")
                }
                _initData.cityname = pp.DepartureCityName;
                //
                var _idate = (pp.UseTime + ":00").toDateTime();
                $('#snd_date').value(_idate.toFormatString('yyyy-MM-dd')); $('#snd_time').value(_idate.toFormatString('hh:mm'));
            } else {
                _initData.airportInfo = _BaseData.airport;
                _initData.cityname = _BaseData.city;
            }
            //
            var _isFirst = !MOD.Snd_Airport;
            //初始化送机模块
            !MOD.Snd_Airport && (MOD.Snd_Airport = UIControl.AreaControl.InitCHArea({
                txtArea: '#snd_airport',
                msg: label.ChooseAirport, //请选择机场
                initdata: _initData.airportInfo ? _initData.airportInfo : {},
                suggestionSource: "/car/ajax/GetLocation?type=snd",
                filterSource: "/car/ajax/CHFuzzyFixLocation?type=snd&key=${key}",
                type: "airport", //train/airport
                onchange: function (o) {
                    MOD.Snd_Address && MOD.Snd_Address.setCity({
                        source: null,
                        cityname: o.value.split("|").length > 4 ? o.value.split("|")[4] : ""
                    });
                }
            }));
            !MOD.Snd_Address && (MOD.Snd_Address = UIControl.AreaControl.InitNormalArea({
                txtArea: '#snd_address',
                msg: label.ChooseStartingPoint, //请选择出发地点
                initdata: _initData.airportAddr ? _initData.airportAddr : {},
                cityName: _initData.cityname ? _initData.cityname : "",
                source: AjaxUrl.AreaEmptySource,
                filterOnly: true
            }));
            !MOD.Snd_Date && (MOD.Snd_Date = UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: '#snd_date',
                    hmObj: '#snd_time',
                    Min: { addDays: 0, addMin: 70 },
                    Max: { addDays: 90, hm: "23:50" },
                    Default: { addDays: 0, addMin: 70 },
                    layer: '#chf_snd_date_layer'
                }
            }))
            //
            _isFirst && !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#sndSearchDiv').find('input[type="text"]'));
        },
        initJhc: function () {
            var pp = PageInfo.ModelInfo.PostParam, _initData = {};
            if (_BaseData["jhc"] && !$.isEmptyObject(_BaseData["jhc"]) && _BaseData["jhc"].IsInitOne) {
                //初始值
                _initData.stationInfo = {
                    text: pp.LocationName,
                    value: [pp.LocationCode, pp.LocationName, pp.LocationName, pp.DepartureCityId, pp.DepartureCityName, "", "", "", pp.LocationLat, pp.LocationLng, "", pp.TerminalID].join("|")
                }
                _initData.stationAddr = {
                    value: pp.Address,
                    data: ["", pp.Address, pp.Lng + ',' + pp.Lat, pp.ArrivalCityName, pp.AddressDetail].join("|")
                }
                _initData.cityname = pp.ArrivalCityName;
                //
                var _idate = (pp.UseTime + ":00").toDateTime();
                $('#jhc_date').value(_idate.toFormatString('yyyy-MM-dd')); $('#jhc_time').value(_idate.toFormatString('hh:mm'));
            } else {
                _initData.stationInfo = _BaseData.location;
                _initData.cityname = _BaseData.city;
            }
            //
            var _isFirst = !MOD.Jhc_Station;
            //初始化接火车模块
            !MOD.Jhc_Station && (MOD.Jhc_Station = UIControl.AreaControl.InitCHArea({
                txtArea: '#jhc_station',
                msg: label.ChooseTrainStation, //请选择火车站
                initdata: _initData.stationInfo ? _initData.stationInfo : {},
                suggestionSource: "/car/ajax/GetLocation?type=jhc",
                filterSource: "/car/ajax/CHFuzzyFixLocation?type=jhc&key=${key}",
                type: "train", //train/airport
                onchange: function (o) {
                    MOD.Jhc_Address && MOD.Jhc_Address.setCity({
                        source: null,
                        cityname: o.value.split("|").length > 4 ? o.value.split("|")[4] : ""
                    });
                }
            }));
            !MOD.Jhc_Address && (MOD.Jhc_Address = UIControl.AreaControl.InitNormalArea({
                txtArea: '#jhc_address',
                msg: label.ChooseStartingPoint, //请选择出发地点
                initdata: _initData.stationAddr ? _initData.stationAddr : {},
                cityName: _initData.cityname ? _initData.cityname : "",
                source: AjaxUrl.AreaEmptySource,
                filterOnly: true
            }));
            !MOD.Jhc_Date && (MOD.Jhc_Date = UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: '#jhc_date',
                    hmObj: '#jhc_time',
                    Min: { addDays: 0, addMin: 70 },
                    Max: { addDays: 90, hm: "23:50" },
                    Default: { addDays: 0, addMin: 70 },
                    layer: '#chf_jhc_date_layer'
                }
            }));
            //
            _isFirst && !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#jhcSearchDiv').find('input[type="text"]'));
        },
        initShc: function () {
            var pp = PageInfo.ModelInfo.PostParam, _initData = {};
            if (_BaseData["shc"] && !$.isEmptyObject(_BaseData["shc"]) && _BaseData["shc"].IsInitOne) {
                //初始值
                _initData.stationInfo = {
                    text: pp.LocationName,
                    value: [pp.LocationCode, pp.LocationName, pp.LocationName, pp.ArrivalCityId, pp.ArrivalCityName, "", "", "", pp.LocationLat, pp.LocationLng, "", pp.TerminalID].join("|")
                }
                _initData.stationAddr = {
                    value: pp.Address,
                    data: ["", pp.Address, pp.Lng + ',' + pp.Lat, pp.DepartureCityName, pp.AddressDetail].join("|")
                }
                _initData.cityname = pp.DepartureCityName;
                //初始化时间
                var _idate = (pp.UseTime + ":00").toDateTime();
                $('#shc_date').value(_idate.toFormatString('yyyy-MM-dd')); $('#shc_time').value(_idate.toFormatString('hh:mm'));
            } else {
                _initData.stationInfo = _BaseData.location;
                _initData.cityname = _BaseData.city;
            }
            //
            var _isFirst = !MOD.Shc_Station;
            //初始化送火车模块
            !MOD.Shc_Station && (MOD.Shc_Station = UIControl.AreaControl.InitCHArea({
                txtArea: '#shc_station',
                msg: label.ChooseTrainStation, //请选择火车站
                initdata: _initData.stationInfo ? _initData.stationInfo : {},
                suggestionSource: "/car/ajax/GetLocation?type=shc",
                filterSource: "/car/ajax/CHFuzzyFixLocation?type=shc&key=${key}",
                type: "train", //train/airport
                onchange: function (o) {
                    MOD.Shc_Address && MOD.Shc_Address.setCity({
                        source: null,
                        cityname: o.value.split("|").length > 4 ? o.value.split("|")[4] : ""
                    });
                }
            }));
            !MOD.Shc_Address && (MOD.Shc_Address = UIControl.AreaControl.InitNormalArea({
                txtArea: '#shc_address',
                msg: label.ChooseStartingPoint, //请选择出发地点
                initdata: _initData.stationAddr ? _initData.stationAddr : {},
                cityName: _initData.cityname ? _initData.cityname : "",
                source: AjaxUrl.AreaEmptySource,
                filterOnly: true
            }));
            !MOD.Shc_Date && (MOD.Shc_Date = UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: '#shc_date',
                    hmObj: '#shc_time',
                    Min: { addDays: 0, addMin: 70 },
                    Max: { addDays: 90, hm: "23:50" },
                    Default: { addDays: 0, addMin: 70 },
                    layer: '#chf_shc_date_layer'
                }
            }));
            //
            _isFirst && !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#shcSearchDiv').find('input[type="text"]'));
        },
        getJntCondition: function () {
            var d = {
                Screen: false,
                SearchType: 'jnt',
                VehicleGroup: '',
                SpecialService: '',
                Vendor: '',
                ActivityCode: '',
                LocationType: 1
            };
            //
            if ("2" == document.getElementById('jntChoose').value) {
                //按机场预定
                var jntAA = MOD.Jnt_Airport_Airport.getData(), jntAD = MOD.Jnt_Airport_Date.getSDate(), jntAddr = MOD.Jnt_Airport_Address.getData();
                d.UseTime = jntAD;
                //
                if (!(MOD.Jnt_Airport_Airport.validate() && MOD.Jnt_Airport_Date.checkDate() && MOD.Jnt_Airport_Address.validate())) { return; }
                var jntAAA = jntAA.value.split('|'), jntAddrA = jntAddr.value.split('|');
                if (jntAAA.length > 11) {
                    d.LocationCode = jntAAA[0]; d.LocationName = jntAAA[1]; d.TerminalID = jntAAA[11];
                    d.DepartureCityId = jntAAA[3]; d.DepartureCityName = jntAAA[4]; d.LocationLat = jntAAA[8]; d.LocationLng = jntAAA[9];
                }
                if (jntAddrA.length > 2) {
                    d.Address = jntAddrA[1]; d.Lng = jntAddrA[2].split(',')[0]; d.Lat = jntAddrA[2].split(',')[1]; d.AddressDetail = jntAddrA[4];
                    d.ArrivalCityId = 0; d.ArrivalCityName = jntAddrA[3];
                }
            } else {
                //按航班号预定
                var jntFN = MOD.Jnt_FltNO_Num.getData(), jntFD = MOD.Jnt_FltNO_Date.getValue(), jntFA = MOD.Jnt_FltNO_Address.getData();
                d.UseTime = _BaseData.jntUseTime;
                //
                if (!(MOD.Jnt_FltNO_Num.validate() && MOD.Jnt_FltNO_Date.checkDate() && MOD.Jnt_FltNO_Address.validate())) { return; }
                var jntFNA = jntFN.split('|'), jntFAA = jntFA.value.split('|');
                if (jntFNA.length > 10) {
                    d.FlightNumber = jntFNA[0]; d.LocationType = jntFNA[1]; d.LocationCode = jntFNA[2]; d.LocationName = jntFNA[3];
                    d.TerminalID = jntFNA[5]; d.DepartureCityId = jntFNA[6]; d.DepartureCityName = jntFNA[7]; d.LocationLat = jntFNA[9]; d.LocationLng = jntFNA[10];
                }
                if (jntFAA.length > 2) {
                    d.Address = jntFAA[1]; d.Lng = jntFAA[2].split(',')[0]; d.Lat = jntFAA[2].split(',')[1]; d.AddressDetail = jntFAA[4];
                    d.ArrivalCityId = 0; d.ArrivalCityName = jntFAA[3];
                }
            }
            return d;
        },
        getSndCondition: function () {
            var d = {
                Screen: false,
                SearchType: 'snd',
                VehicleGroup: '',
                SpecialService: '',
                Vendor: '',
                ActivityCode: '',
                LocationType: 1
            };
            //check
            if (!(MOD.Snd_Airport.validate() && MOD.Snd_Date.checkDate() && MOD.Snd_Address.validate())) { return; }
            //
            var sndAir = MOD.Snd_Airport.getData(), sndd = MOD.Snd_Date.getSDate(), sndAddr = MOD.Snd_Address.getData();
            d.UseTime = sndd;
            var sndAirA = sndAir.value.split('|'), sndAddrA = sndAddr.value.split('|');
            if (sndAirA.length > 11) {
                d.LocationCode = sndAirA[0]; d.LocationName = sndAirA[1]; d.TerminalID = sndAirA[11];
                d.ArrivalCityId = sndAirA[3]; d.ArrivalCityName = sndAirA[4]; d.LocationLat = sndAirA[8]; d.LocationLng = sndAirA[9];
            }
            if (sndAddrA.length > 2) {
                d.Address = sndAddrA[1]; d.Lng = sndAddrA[2].split(',')[0]; d.Lat = sndAddrA[2].split(',')[1]; d.AddressDetail = sndAddrA[4];
                d.DepartureCityId = 0; d.DepartureCityName = sndAddrA[3];
            }
            return d;
        },
        getJhcCondition: function () {
            var d = {
                Screen: false,
                SearchType: 'jhc',
                TerminalID: 0,
                VehicleGroup: '',
                SpecialService: '',
                Vendor: '',
                ActivityCode: '',
                LocationType: 2
            }
            //check
            if (!(MOD.Jhc_Station.validate() && MOD.Jhc_Date.checkDate() && MOD.Jhc_Address.validate())) { return; }
            //
            var jhcs = MOD.Jhc_Station.getData(), jhcd = MOD.Jhc_Date.getSDate(), jhca = MOD.Jhc_Address.getData();
            d.UseTime = jhcd;
            var jhcsA = jhcs.value.split('|'), jhcaA = jhca.value.split('|');
            //(jhcsA.length > 0) && (d.LocationCode = jhcsA[0]);
            if (jhcsA.length > 11) {
                d.LocationCode = jhcsA[0]; d.LocationName = jhcsA[1]; d.TerminalID = jhcsA[11];
                d.DepartureCityId = jhcsA[3]; d.DepartureCityName = jhcsA[4]; d.LocationLat = jhcsA[8]; d.LocationLng = jhcsA[9];
            }
            if (jhcaA.length > 3) {
                d.Address = jhcaA[1]; d.Lng = jhcaA[2].split(',')[0]; d.Lat = jhcaA[2].split(',')[1]; d.AddressDetail = jhcaA[4];
                d.ArrivalCityId = 0; d.ArrivalCityName = jhcaA[3];
            }
            return d;
        },
        getShcCondition: function () {
            var d = {
                Screen: false,
                SearchType: 'shc',
                TerminalID: 0,
                VehicleGroup: '',
                SpecialService: '',
                Vendor: '',
                ActivityCode: '',
                LocationType: 2
            };
            //check
            if (!(MOD.Shc_Station.validate() && MOD.Shc_Date.checkDate() && MOD.Shc_Address.validate())) { return; }
            //
            var shcs = MOD.Shc_Station.getData(), shcd = MOD.Shc_Date.getSDate(), shca = MOD.Shc_Address.getData();
            d.UseTime = shcd;
            var shcsA = shcs.value.split('|'), shcaA = shca.value.split('|');
            //(shcsA.length > 0) && (d.LocationCode = shcsA[0]);
            if (shcsA.length > 11) {
                d.LocationCode = shcsA[0]; d.LocationName = shcsA[1]; d.TerminalID = shcsA[11];
                d.ArrivalCityId = shcsA[3]; d.ArrivalCityName = shcsA[4]; d.LocationLat = shcsA[8]; d.LocationLng = shcsA[9];
            }
            if (shcaA.length > 3) {
                d.Address = shcaA[1]; d.Lng = shcaA[2].split(',')[0]; d.Lat = shcaA[2].split(',')[1]; d.AddressDetail = shcaA[4];
                d.DepartureCityId = 0; d.DepartureCityName = shcaA[3];
            }
            return d;
        },
        modelChange: function (index) {
            var _obj = null, tbL = $('#tabChangeLayer');
            switch (index) {
                case 0:
                    MInit.initJnt(); _obj = $('#jntSearchDiv').find('.btn-search');
                    break;
                case 1:
                    MInit.initSnd(); _obj = $('#sndSearchDiv').find('.btn-search');
                    break;
                case 2:
                    MInit.initJhc(); _obj = $('#jhcSearchDiv').find('.btn-search');
                    break;
                case 3:
                    MInit.initShc(); _obj = $('#shcSearchDiv').find('.btn-search');
                    break;
                default:
                    break;
            }
            //切换tab
            tbL.css('display', 'none');
            if (OP.LastChsTab != null && _ModelTypes[OP.LastChsTab] != index && _obj) {
                tbL.css({
                    'display': '',
                    'left': _obj.offset().left - 26 + 'px',
                    'top': _obj.offset().bottom + 7 + 'px'
                });
                window.clearTimeout(OP._TbChangeObj);
                OP._TbChangeObj = window.setTimeout(function () { tbL.css('display', 'none'); }, 3000);
            }
        },
        jntFlightNOChs: function () {
            var jsd = $('#jntSearchDiv'), jfs = $('#jnt_flt_span'), t = document.getElementById('jntChoose');
            //按航班号
            jfs.text(t.options[t.options.selectedIndex].text);
            jsd.find('div[name="jnt_airport"]').css('display', 'none');
            jsd.find('div[name="jnt_flightno"]').css('display', '');
        },
        jntAirportChs: function () {
            var jsd = $('#jntSearchDiv'), jfs = $('#jnt_flt_span'), t = document.getElementById('jntChoose');
            //按机场
            jfs.text(t.options[t.options.selectedIndex].text);
            jsd.find('div[name="jnt_airport"]').css('display', '');
            jsd.find('div[name="jnt_flightno"]').css('display', 'none');
        }
    }

    //
    function ControlsInit() {
        //Tab Init
        MOD.Tab = UIControl.TabControl.InitTab({
            tObj: '#ChfSearchBox',
            config: {
                options: {
                    index: _ModelTypes[PageInfo.ModelInfo.PostParam.SearchType],
                    tab: "#ChfSearchBoxTitle>li",
                    panel: "#ChfSearchBoxContent>div",
                    trigger: "click",
                    ajax: false,
                    save: true
                },
                style: {
                    tab: ['tab-active', ''],
                    panel: { display: ['block', 'none'] }
                },
                listeners: {
                    returnTab: function (index, tab) {
                        //切换隐藏错误
                        UIControl.WarnControl.hide();
                        MInit.modelChange(index);
                    },
                    initEventCallback: function () {
                        _BaseData[PageInfo.ModelInfo.PostParam.SearchType] = {
                            IsInitOne: true
                        };
                        MInit.modelChange(_ModelTypes[PageInfo.ModelInfo.PostParam.SearchType]);
                    }
                }
            }
        });
        //初始化select选择
        var jc = $('#jntChoose');
        jc.bind('change', function (e) {
            //this.options[this.options.selectedIndex]
            ("2" == this.value) ? MInit.jntAirportChs() : MInit.jntFlightNOChs();
        });
        //Map 初始化
        MOD.GD_Map = new UIControl.MapControl.InitEasyMapParam({
            baseObj: '#mapDiv'
        });
    }
    //
    var ListFilter = {
        init: function (data) {
            //
            data && ListFilter.drawFilter(data);
        },
        drawFilter: function (data) {
            var filterData = ListFilter.fixSideFilter(data);

            $('#listfilter').html($.tmpl.render($('#filterTmpl').html(), filterData));
            ListFilter.bindEv();
        },
        fixSideFilter: function (data) {
            return {
                VehicleGroupList: data.VehicleGroupList,
                SpecialServiceList: data.SpecialServiceList,
                VendorList: data.VendorList
            }
        },
        bindEv: function () {
            var fbd = $('#filterBD');
            fbd.find('[type="checkbox"]').bind('click', function (e) {
                var flD = $('#filterHD .list>div');
                //checked
                if (this.checked) {
                    var sp = $(document.createElement('span'));
                    sp.addClass('ItemChecked'); sp.attr('dVal', this.id); sp.attr('name', $(this).attr('name'));
                    sp.html($(this).parentNode().text() + '<a href="javascript:void(0)" class="btn-delete">×</a>');
                    flD.append(sp);
                    sp.find('.btn-delete').bind('click', function (e) {
                        var p = $(this).parentNode(), pObj = document.getElementById(p.attr('dval'));
                        //$('#' + p.attr('dval')).click(); p.remove();
                        pObj && (pObj.checked = false); p.remove();
                        ListFilter.filterAjax();
                    });
                } else {
                    flD.find('.ItemChecked[dVal="' + this.id + '"]').remove();
                }
                ListFilter.filterAjax();
            });
            //
            $('#filter_fold').bind('click', function (e) {
                var o = fbd.find("div.s-filter-item").slice(1), t = $(this);
                if (t.hasClass("folded")) {
                    t.removeClass("folded"); t.html(label.Less + '<i class="i-tri i-tri-up"></i>'); o.slideDown(); //收起
                } else {
                    t.addClass("folded"); t.html(label.SlideUp + '<i class="i-tri i-tri-down"></i>'); o.slideUp(); //展开全部
                }
            });
            $('#filterHD .btn-clear').bind('click', function (e) {
                //alert('清除');
                $('#filterHD .list>div span').each(function (a) {
                    var _id = a.attr('dval'), o = document.getElementById(_id);
                    o && (o.checked = false); a.remove();
                });
                ListFilter.filterAjax();
            });
        },
        getFilterData: function () {
            var d = PageList.getSearchCondition(OP.LastChsTab), fbd = $('#filterBD');
            //
            d.VehicleGroup = ListFilter.getCheckData(fbd.find('input[name="filter_vehicle"]'));
            d.SpecialService = ListFilter.getCheckData(fbd.find('input[name="filter_service"]'));
            d.Vendor = ListFilter.getCheckData(fbd.find('input[name="filter_vendor"]'));
            //
            return d;
        },
        getCheckData: function (obj) {
            var tmp = [];
            obj.each(function (o) {
                if (o && o[0] && o[0].checked) {
                    tmp.push(o.attr('dVal'));
                }
            });
            return tmp.join(',');
        },
        filterAjax: function () {//产品过滤
            $('#listMain').html($('#noFilterTmpl').html());
            var d = ListFilter.getFilterData();
            if (!IsEmpty(d) && !$.isEmptyObject(d)) {
                OP.CarListAjaxObj && OP.CarListAjaxObj.abort && OP.CarListAjaxObj.abort();
                OP.CarListAjaxObj = $.ajax(AjaxUrl.CarListSource, {
                    method: 'POST',
                    context: d,
                    onsuccess: function (ret) {
                        var d = $.parseJSON(ret.responseText);
                        CarList.drawBody(d);
                    }
                });
            } else { }
        }
    }
    //Car Body
    var CarList = {
        data: null,
        _DCNT: [label.Discount, label.Cheapen, label.Free, label.Enjoy, label.Send],  //   ["折", "减", "免", "享", "送"],
        initData: function (data) {
            var TD = {};
            if (data && data.VehicleGroupProductList && !$.isEmptyObject(data)) {
                TD.VehicleGroupProductList = [];
                for (var i = 0; i < data.VehicleGroupProductList.length; i++) {
                    var vInfo = data.VehicleGroupProductList[i]; vInfo._ = [];
                    for (var j = 0; j < vInfo.ProductList.length; j++) {
                        var pInfo = vInfo.ProductList[j]; pInfo._ = {};
                        pInfo._.DiscountList = CarList.getDiscountInfo(pInfo.DiscountList);
                        pInfo._.Additional = CarList.getAdditionInfo(pInfo.Additional);
                        pInfo._.ProductInfo = $.stringifyJSON(pInfo);
                    }
                    TD.VehicleGroupProductList.push(vInfo);
                }
            }
            CarList.data = TD;
        },
        getDiscountInfo: function (d) {
            if (!d) return [];
            var t = [];
            for (var i = 0; i < d.length; i++) {
                var p = d[i];
                p.TypeName = CarList._DCNT[d[i].DiscountType];
                t.push(p);
            }
            return t;
        },
        getAdditionInfo: function (d) {
            if (!d) return null;
            var t = d;
            t.CallSuccessPer = (d.CallSuccessRate * 100).toFixed(1) + '%';
            return t;
        },
        drawBody: function (d) {
            CarList.initData(d);
            //
            if (!IsEmpty(CarList.data) && !$.isEmptyObject(CarList.data)) {
                $('#listMain').html($.tmpl.render($('#carListTmpl').html(), CarList.data));
                //
                $('#listMain .ctBox-list>div.ctBox').last().addClass("last-ctBox");
                //Ev Bind
                $('#listMain').find('div.btn-buy').bind('click', function (e) {
                    var d = CarList.getSubmitInfo($(this).attr('pmark'));
                    CMFun.submitForm({
                        url: AjaxUrl.BookingUrl,
                        method: 'POST',
                        data: d,
                        target: '_blank'
                    });
                });
            } else {
                $('#listMain').html($.tmpl.render($('#noCarTmpl').html(), {}));
            }
        },
        getSubmitInfo: function (pmark) {
            var pmarklist = pmark.split('|'), _types = ["jnt", "snd", "jhc", "shc"];
            //var _tmpd = PageList.getSearchCondition(_types[MOD.Tab.get('index')]);
            var _tmpd = PageList.getSearchCondition(OP.LastChsTab);
            var d = {
                FeeType: PageInfo.ModelInfo.PostParam.FeeType,
                SearchType: _types[MOD.Tab.get('index')],
                DepartureCityId: _tmpd.DepartureCityId ? _tmpd.DepartureCityId : 0,
                DepartureCityName: _tmpd.DepartureCityName ? _tmpd.DepartureCityName : "",
                ArrivalCityId: _tmpd.ArrivalCityId ? _tmpd.ArrivalCityId : 0,
                ArrivalCityName: _tmpd.ArrivalCityName ? _tmpd.ArrivalCityName : "",
                LocationType: _tmpd.LocationType ? _tmpd.LocationType : "",
                LocationCode: _tmpd.LocationCode ? _tmpd.LocationCode : 0,
                LocationName: _tmpd.LocationName ? _tmpd.LocationName : "",
                TerminalID: _tmpd.TerminalID ? _tmpd.TerminalID : 0,
                Lng: _tmpd.Lng ? _tmpd.Lng : "",
                Lat: _tmpd.Lat ? _tmpd.Lat : "",
                Address: _tmpd.Address ? _tmpd.Address : "",
                AddressDetail: _tmpd.AddressDetail ? _tmpd.AddressDetail : "",
                UseTime: _tmpd.UseTime ? _tmpd.UseTime : "",
                FlightNumber: _tmpd.FlightNumber ? _tmpd.FlightNumber : ""
            }
            d.VehicleGroupID = d.VehicleGroupName = d.VendorID = d.ActivityCodes = "";
            if (pmarklist.length > 1 && !$.isEmptyObject(CarList.data)) {
                var tmp_1 = CarList.data.VehicleGroupProductList[pmarklist[0]];
                if (tmp_1 && !$.isEmptyObject(tmp_1)) {
                    var tmp_2 = tmp_1.ProductList[pmarklist[1]];
                    d.VehicleGroupID = tmp_1.VehicleGroupID;
                    d.VehicleGroupName = tmp_1.VehicleGroupName;
                    d.VendorID = tmp_2.Vendor.VendorID;
                    if (tmp_2.ActivitieList) {
                        var tArr = [];
                        for (var i = 0; i < tmp_2.ActivitieList.length; i++) {
                            tArr.push(tmp_2.ActivitieList[i].ActivityCode);
                        }
                        d.ActivityCodes = tArr.join(',');
                    }
                }
            }
            //是否加载尾部
            //d.IsRemark = true;
            return d;
        }
    }
    //
    var PageList = {
        init: function () {
            PageList.bindEv();
            //
            PageList.ajaxInit(PageList.getSearchCondition(PageInfo.ModelInfo.PostParam.SearchType));
        },
        getSearchCondition: function (mark) {
            var data = {};
            switch (mark) {
                case "jnt":
                    data = MInit.getJntCondition();
                    break;
                case "snd":
                    data = MInit.getSndCondition();
                    break;
                case "jhc":
                    data = MInit.getJhcCondition();
                    break;
                case "shc":
                    data = MInit.getShcCondition();
                    break;
                default:
                    break;
            }
            return data;
        },
        bindEv: function () {
            $('#ChfSearchBox .btn-search').bind('click', function () {
                var tmpD = PageList.getSearchCondition($(this).attr('mark'));
                (typeof tmpD != "undefined") && PageList.ajaxInit(tmpD);
            });
            //
            $('#ChfSearchBox a.map').bind('click', function (e) {
                var d = PageList.getSearchCondition(OP.LastChsTab);
                if (MOD.GD_Map) {
                    //text,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
                    var _tmpArr = [d.ArrivalCityName];
                    if (d.SearchType == "jnt" || d.SearchType == "jhc") {
                        MOD.GD_Map.initMap([$(this).html(), d.Lng, d.Lat, d.Address, d.LocationName, d.LocationLng, d.LocationLat].join(','));
                    } else if (d.SearchType == "snd" || d.SearchType == "shc") {
                        MOD.GD_Map.initMap([$(this).html(), d.LocationLng, d.LocationLat, d.LocationName, d.Address, d.Lng, d.Lat].join(','));
                    }
                } else { console.log('Map Control Init Error!'); }
            });
        },
        ajaxInit: function (d) {////产品重新加载
            !$.isEmptyObject(d) && (d.Screen = true);
            //记录当前搜索tab type
            OP.LastChsTab = d.SearchType;
            //
            $('#listfilter').html($('#noFilterTmpl').html()); $('#listMain').html($('#noFilterTmpl').html());
            //
            OP.CarListAjaxObj && OP.CarListAjaxObj.abort && OP.CarListAjaxObj.abort();
            OP.CarListAjaxObj = $.ajax(AjaxUrl.CarListSource, {
                method: 'POST',
                context: d,
                onsuccess: function (ret) {
                    var d = $.parseJSON(ret.responseText), tObj = $('#ChfSearchBox a.map');
                    if (!IsEmpty(d) && !$.isEmptyObject(d)) {
                        ListFilter.init(d); CarList.drawBody(d);
                        var p_t = d.VehicleGroupProductList && d.VehicleGroupProductList[0].ProductList && d.VehicleGroupProductList[0].ProductList[0].Price;
                        p_t && (tObj.html(label.ExpectedKmMinutes.replace("{0}", p_t.Distance).replace("{1}", p_t.TimeLength)).css('display', '')); //['预计：', p_t.Distance, "公里/" + p_t.TimeLength, "分钟"].join("")
                    } else {
                        $('#listfilter').html(""); $('#listMain').html($.tmpl.render($('#noCarTmpl').html(), {})); tObj.css('display', 'none');
                    }
                }
            });
        }
    }

    $.ready(function () {
        //load sidebar
        UIControl && UIControl.SideBarControl.LoadSideBar();
        //
        ControlsInit(); PageList.init();
    });
})(cQuery);
