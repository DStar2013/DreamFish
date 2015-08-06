
//var productInfo = {
//    VendorId: '供应商ID',
//    VendorName: '安飞士租车',
//    VendorLogo: 'http://pic.ctrip.com/car_isd/vendorlogo/avis.jpg',
//    VehicleType: '别克凯越',
//    CarCapacity: 4,
//    CarDescription: '自排/三厢/1.5L',
//    StartCityID: 2,
//    StartCityName: '上海',
//    StartTime: '2015-05-25 14:00',
//    EndTime: '2015-05-27 14:00',
//    StartAddress: '上海金钟路便捷店',
//    StartAddressDes: '上海市长宁区金钟路631弄虹桥中央大厦2号楼B1楼',
//    StartLatitude: 31.220347,
//    StartLongitude: 121.358425,
//    StartContactInfo: '021-60708600',
//    StartOpenHours: '08:00 - 20:00',
//    EndCityID: 2,
//    EndCityName: '上海',
//    EndAddress: '上海金钟路便捷店',
//    EndAddressDes: '上海市长宁区金钟路631弄虹桥中央大厦2号楼B1楼',
//    EndLatitude: 31.220347,
//    EndLongitude: 121.358425,
//    EndContactInfo: '021-60708600',
//    EndOpenHours: '08:00 - 20:00',
//    PickupStoreCode: 'StoreCode',
//    PickupStoreType: 'DownTown',
//    DropoffStore: 'StoreCode',
//    DropoffStoreType: 'DownTown',
//    VendorCouponCode: ''
//};

//var costDetailList = [  //商旅服务费不包含在这里面
//    {
//        ServiceID: 0,
//        ServiceName: '租车费用',
//        ServiceDescription: '租车费用',
//        ServicePrice: 200,
//        ServiceUnit: '2天',
//        ServiceTotalPrice: 200,
//        ServiceType: 1  //（1:基础费用,2:增值费用 3:商旅服务费 4:快递费 5:违约金）
//    }, {
//        ServiceID: 0,
//        ServiceName: '基本保险费',
//        ServiceDescription: '基本保险费',
//        ServicePrice: 80,
//        ServiceUnit: '1份',
//        ServiceTotalPrice: 80,
//        ServiceType: 2
//    }
//];

//var InvoiceInfo = {
//    InvoiceFeeType: 0,
//    Title: '发票抬头测试',
//    InvoiceDetail: '发票明细',
//    ReceiveName: '1收件人1测试',
//    ReceiveTel: '15901610000',
//    ProvinceName: '上海',
//    CityName: '上海',
//    DistrictName: '长宁区',
//    Address: '金钟路9999号',
//    PostCode: '200000',
//    InvoiceId: 0,
//    UserAddressId: 0,
//    Province: 2,
//    City: 2,
//    District: 114
//};

//var driverInfo = {
//    DriverName: '张三',
//    IDType: 1,
//    IDNumber: '3333333333333333',
//    ContactPhone: '15926854512',
//    ContactEmail: 'abc@a.com'
//};

//var paymentInfo = {
//    PaymentType: 'CCARD',
//    ExchangeRate: 1,
//    Currency: 'CNY'
//};

//var passengerList = [
//    {
//        PassengerType: 'D',
//        PassengerName: '张三',
//        IDType: 1,
//        IDNumber: '3333333333333333',
//        PassengerPhone: '15926854512',
//        EmployeeID: '',
//        CorpUserID: 'Hoteltest'
//    }, {
//        PassengerType: 'P',
//        PassengerName: '李四',
//        EmployeeID: '',
//        CorpUserID: 'M00024248'
//    }
//    , {
//        PassengerType: 'P',
//        PassengerName: '王五',
//        EmployeeID: 'stranger_uid_4',
//        CorpUserID: ''
//    }
//];

//var companyInfo = {
//    AuthorizeTimes: 1,
//    CostCenter1: '[{Uid:"HoteltestYC1",Value:"",UIDOrInfoID:"HoteltestYC1",CostCenter1Value:"HoteltestYC1"},{Uid:"M00024248YC1",Value:"test",UIDOrInfoID:"M00024248YC1",CostCenter1Value:"test"},{Uid:"stranger_uid_4NC1",Value:"",UIDOrInfoID:"stranger_uid_4NC1",CostCenter1Value:"stranger_uid_4NC1"}]',
//    CostCenter1: '费用中心1',
//    CostCenter2: '费用中心2',
//    CostCenter3: '费用中心3',
//    DefineValue1: '自定义字段1',
//    DefineValue2: '自定义字段2',
//    JouneryID: '',
//    SaveToDefaultCostCenter: true,
//    AuthPwd: '',
//    ConfirmPerson1: 'M00728614',
//    RcCodeID: '',
//    QuoteMode: 'Amount'
//};


//$.ajax('/car/Isd/CreateOrder', {
//    method: 'POST',
//    context: {
//        FeeType: 'C',
//        NeedInvoice: true,
//        LastLosslessCancelTime: '2015-05-25 10:00',
//        LastConfirmPaymentTime: '2015-05-25 11:00',
//        ServiceFee: 30,
//        TotalAmount: 310,
//        CompanyInfo: $.stringifyJSON(companyInfo),
//        PassengerList: $.stringifyJSON(passengerList),
//        PaymentInfo: $.stringifyJSON(paymentInfo),
//        DriverInfo: $.stringifyJSON(driverInfo),
//        ProductInfo: $.stringifyJSON(productInfo),
//        CostDetailList: $.stringifyJSON(costDetailList),
//        InvoiceInfo: $.stringifyJSON(InvoiceInfo)
//    },
//    onsuccess: function (ret) {
//        var res = $.parseJSON(ret.responseText);
//        if (res.Result) {
//            sumbitNewForm(res.PostUrl, "POST", res.PostForm);
//        } else {
//            alert(res.ErrorMessage);
//        }
//    }
//});


////var sumbitNewForm = function (action, method, formHtml) {
////    var form = this._form = this._form || function () {
////        var f = document.createElement('form');
////        f.style.display = 'none';
////        document.body.appendChild(f);
////        return f;
////    } ();
////    $(form).attr('action', action);
////    $(form).attr('method', method);

////    var html = formHtml;
////    if (typeof formHtml == 'object') {
////        html = [];
////        for (var prop in formHtml) {
////            if (!formHtml.hasOwnProperty(prop)) continue;
////            var val = formHtml[prop];
////            if (val === null || val === undefined) val = '';
////            html.push('<input type=hidden name="' + prop + '" value="' + (val.toString().replace(/"/gi, '\\"')) + '"/>');
////        }
////        html = html.join('');
////    }
////    form.innerHTML = html;

////    form.submit();
////};

//$.ajax('/car/chf/GetCarList', {
//    method: 'POST',
//    context: {
//        Screen: false,
//        SearchType: 'jnt',
//        UseTime: '2015-06-26 12:00',
//        Lng: '121.364576',
//        Lat: '31.192315',
//        Address: '测试地址',
//        LocationType: 1,
//        LocationCode: 'SHA',
//        TerminalID: 10002,
//        VehicleGroup: '',
//        SpecialService: '',
//        Vendor: '',
//        ActivityCode: ''
//    },
//    onsuccess: function(ret) {
//        alert(ret.responseText);
//    }
//});


//UIControl.AreaControl.InitCHArea({
//    txtArea: '#shc_station',
//    initdata: {},
//    suggestionSource: "../Scripts/testdata/data.js",
//    filterSource: "../Scripts/testdata/data2.js?locationType=2&key=${key}",
//    type: "train", //train/airport
//    onchange: function (o) {
//        sss.setCity({
//            source: null,
//            cityname: o.text
//        });
//    }
//});

//UIControl.AreaControl.InitCHArea({
//    txtArea: "#osnd_start_airport",
//    initdata: {},
//    suggestionSource: "/car/Scripts/data/jsonpResponse.js",
//    filterSource: "/car/ajax/CHFFuzzyFixLocation?type=ojnt&key=${key}",
//    type: "train", //train/airport
//    onchange: function(o) {
//    }
//});


//$.ajax('/car/chf/ProductATPCheck?VehicleGroupID=1&VendorID=9442&IsRemark=true&FeeType=C&PatternType=18&locationType=1&locationCode=pvg&departureCityId=2&terminalID=10000&lng=121.361430&lat=31.225243&usetime=2015-06-12 16:40&address=%u643A%u7A0B%u65C5%u884C%u7F51%28%u6DDE%u8679%u8DEF%u5E97%29&addressDetail=%u4E0A%u6D77%u5E02%u957F%u5B81%u533A%u6DDE%u8679%u8DEF99%u53F7', {
//    method: 'GET',
//    onsuccess: function(ret) {
//        alert(ret.responseText);
//    }
//});

//var test1 = UIControl.FlightControl.InitFlightNO({
//    fltObj: '#jnt_flight_number',
//    myFltObj: '#jnt_my_flightno',
//    fltLayer: '#jnt_flight_layer',
//    suggestionSource: "/car/Scripts/data/jsonpResponse.js",
//    filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
//    myFltSource: "/car/Ajax/GetMyFlight?type=jnt",
//    fltType: "jnt",
//    onchange: function (val) {
//        test2 && (test2.DoVali({
//            flightNumber: val,
//            date: "2015-06-26",
//            type: "jnt"
//        }));
//    }
//});
//var test2 = UIControl.FlightControl.ValidateFlightNO({
//    fltObj: '#jnt_flight_number',
//    validateMsgObj: "#jnt_flight_msg",
//    fltLayer: '#jnt_flight_layer',
//    validateSource: "/car/Ajax/GetFlight",
//    onvalidate: function (val) {
//        test1.setData(val);
//    }
//});


//$.ajax('/car/Ajax/FuzzyFlight?key=m', {
//    method: 'GET',
//    onsuccess: function (ret) {

//    }
//})
//$.ajax('/car/Ajax/GetFlight', {
//    method: 'POST',
//    context: {
//        flightNumber: "CA158",
//        date: "2015-06-26"
//    },
//    onsuccess: function (ret) {

//    }
//})
//$.ajax('/car/Ajax/GetMyFlight', {
//    method: 'POST',
//    context: {
//        pageIndex: 1
//    },
//    onsuccess: function (ret) {

//    }
//})

//$.ajax('/car/ajax/GetMyHotel?cityId=1', {
//    method: 'GET',
//    onsuccess: function(ret) {
//        alert(ret.responseText);
//    }
//});

//var test3 = UIControl.AreaControl.InitOSArea({
//    txtArea: "#osd_start_address",
//    suggestionSource: "/car/Scripts/testdata/data.js",
//    filterSource: "/car/Scripts/testdata/data2.js?key=${key}",
//    emptyMsg: "请输入取车地点",
//    onchange: function (val) {
//        //alert('change!');
//    }
//});
//test3.validate();
////test3.setData({
////    text: "纽瓦克机场",
////    value: "EWR|纽瓦克机场|纽瓦克机场|633|纽约|New↵ York|美国|United States|||1|0"
////});


//var test4 = UIControl.FlightControl.InitFlightNO({
//    fltObj: '#ojnt_flight_number',
//    myFltObj: '#ojnt_my_flightno',
//    fltLayer: '#ojnt_flight_layer',
//    suggestionSource: "/car/Scripts/data/jsonpResponse.js",
//    filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
//    myFltSource: "/car/Ajax/GetMyFlight?type=jnt",
//    fltType: "ojnt",
//    onchange: function (val) {
////        test2 && (test2.DoVali({
////            flightNumber: val,
////            date: "2015-06-26",
////            type: "jnt" //
////        }));
//    }
//});
//var test5 = UIControl.FlightControl.ValidateFlightNO({
//    fltObj: '#ojnt_flight_number',
//    validateMsgObj: "#ojnt_flight_msg",
//    fltLayer: '#ojnt_flight_layer',
//    validateSource: "/car/Ajax/GetFlight",
//    onvalidate: function (val) {
//        test1.setData(val);
//    }
//});

//var test6 = UIControl.FlightControl.InitFlightNO({
//    fltObj: '#osnd_flight_number',
//    myFltObj: '#osnd_my_flightno',
//    fltLayer: '#osnd_flight_layer',
//    suggestionSource: "/car/Scripts/data/jsonpResponse.js",
//    filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
//    myFltSource: "/car/Ajax/GetMyFlight?type=jnt",
//    fltType: "osnd",
//    onchange: function (val) {
////        test2 && (test2.DoVali({
////            flightNumber: val,
////            date: "2015-06-26",
////            type: "jnt" //
////        }));
//    }
//});
//var test7 = UIControl.FlightControl.ValidateFlightNO({
//    fltObj: '#osnd_flight_number',
//    validateMsgObj: "#osnd_flight_msg",
//    fltLayer: '#osnd_flight_layer',
//    validateSource: "/car/Ajax/GetFlight",
//    onvalidate: function (val) {
////        test1.setData(val);
//    }
//});

//var test8 = UIControl.AreaControl.InitOCHArea({
//    txtArea: '#ojnt_send_address',
//    myHtlObj: '#ojnt_my_hotel',
//    htlLayer: '#ojnt_htl_layer',
//    suggestionSource: "/car/Scripts/data/jsonpResponse.js",
//    filterSource: "/car/ajax/OCHFuzzyFixLocation?cityId={cid}&key=${key}",
//    myHtlSource: "/car/ajax/GetMyHotel?cityId={cid}",
//    emptyMsg: '送达区域不能为空',
//    onchange: function (val) {
//        
//    }
//});
//test8.setCity({ id: 2 });
