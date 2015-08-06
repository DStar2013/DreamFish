(function ($) {
    $.ready(function () {
        //加载sidebar
        UIControl && UIControl.SideBarControl.LoadSideBar();
        //
        feeTypeLoad();
        BoxChange.load();
        window.onresize = function () {
            personaltip.init();
            personaltip.reset();
        }
    });
    var message = {
        data: [
            { id: "#jnt_address_flightno", show: label.EnterArrivalPlace }, //请输入送达地点
            { id: "#jnt_end_airport", show: label.ChooseAirport }, //请选择机场
            { id: "#jnt_address_airport", show: label.EnterArrivalPlace }, //请输入送达地点
            { id: "#snd_airport", show: label.ChooseAirport }, //请选择机场
            { id: "#snd_address", show: label.EnterDeparturePlace }, //请输入出发地点
            { id: "#jhc_station", show: label.ChooseRailwayStation }, //请选择火车站
            { id: "#jhc_address", show: label.EnterArrivalPlace }, //请输入送达地点
            { id: "#shc_station", show: label.ChooseRailwayStation }, //请选择火车站
            { id: "#shc_address", show: label.EnterDeparturePlace }, //请输入出发地点
            { id: "#isd_start_address", show: label.EnterPlickupArea }, //请选择取车区域
            { id: "#osd_start_address", show: label.EnterPlickupPlace }, //请输入取车地点
            { id: "#osd_end_address", show: label.EnterDropoffPlace }, //请输入还车地点
            { id: "#ojnt_address_flightno", show: label.EnterArrivalPlace }, //请输入送达地点
            { id: "#ojnt_address_airport", show: label.EnterArrivalPlace }, //请输入送达地点
            { id: "#osnd_address_flightno", show: label.EnterDeparturePlace }, //请输入出发地点
            { id: "#osnd_address_airport", show: label.EnterDeparturePlace }, //请输入出发地点
            { id: "#ojnt_airport", show: label.EnterArrivalAirport }, //请输入到达机场
            { id: "#osnd_airport", show: label.EnterDepartureAirport } //请输入出发机场
        ],
        get: function (id) {
            var msg = label.NotEmpty; //不可以为空
            message.data.each(function (item) {
                if (id === item.id) {
                    msg = item.show;
                }
            });
            return msg;
        }
    };

    var box = {
        chf: {////国内接送机/火车
            def: {
                city: label.ShangHai, //上海
                //  airport: { text: '虹桥国际机场T1航站楼', value: 'SHA|虹桥国际机场T1航站楼|虹桥国际机场T1航站楼|2|上海|Shanghai|中国|China|||1|10002' },
                // location: { text: '上海虹桥火车站', value: '3156|上海虹桥火车站|上海虹桥火车站|2|上海|Shanghai|中国|China|||2|0' }
                airport: { text: label.HIATT, value: 'SHA|' + label.HIATT + '|' + label.HIATT + '|2|' + label.ShangHai + '|Shanghai|' + label.China + '|China|31.194276|121.349045|1|10002' },
                location: { text: label.HongQiaoRailwayStation, value: '3156|' + label.HongQiaoRailwayStation + '|' + label.HongQiaoRailwayStation + '|2|' + label.ShangHai + '|Shanghai|' + label.China + '|China|31.194245|121.320895|2|0' }
            },
            jnt: {
                ////国内接机
                isload: false,
                mod: {
                    date: null, location: null, address: null, flightnoDate: null, airportDateTime: null, flightno: null, flightno2: null, airport: null, address_flightno: null, address_airport: null
                },
                load: function () {
                    if (!box.chf.jnt.isload) {
                        box.chf.jnt.mod.airportDateTime = BoxDate.InitYYYYMMDDHHMM('#jnt_end_date', '#jnt_end_time', 0, 70, 90, 0, 70, '#chf_jnt_airport_date_layer'); ////国内接机(按机场)
                        box.chf.jnt.mod.address_airport = BoxAddress.InitAddress("#jnt_address_airport");
                        box.chf.jnt.mod.address_airport.setCity({ source: null, cityname: box.chf.def.city });
                        box.chf.jnt.mod.airport = BoxAddress.InitChfLocation("jnt", "#jnt_end_airport", "airport", box.chf.jnt.mod.address_airport);
                        box.chf.jnt.mod.airport.setData(box.chf.def.airport);
                        $("#jnt_end_airport").value(box.chf.def.airport.text);

                        box.chf.jnt.mod.flightnoDate = BoxDate.InitJntFlightNoDate('#jnt_start_date', 0, 0, 90); ////国内接机(按航班)
                        box.chf.jnt.mod.address_flightno = BoxAddress.InitAddress("#jnt_address_flightno");
                        box.chf.jnt.mod.flightno = BoxFlight.InitJntFlight();

                        box.chf.jnt.isload = true;
                        $("#search_chf_jnt").bind("click", function () { box.chf.jnt.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_jnt').find('input[type="text"]'));
                    }
                },
                validate: function () {
                    if ($('input[name="radio_jnt"]:checked').attr("id") == "jnt_flightno") {
                        return box.chf.jnt.mod.flightnoDate.checkDate() && box.chf.jnt.mod.flightno.validate() && box.chf.jnt.mod.address_flightno.validate(); //&& box.chf.jnt.mod.flightnoDate.checkDate()
                    } else {
                        return box.chf.jnt.mod.airportDateTime.checkDate() && box.chf.jnt.mod.airport.validate() && box.chf.jnt.mod.address_airport.validate();
                    }

                },
                submit: function () {
                    if (!box.chf.jnt.validate()) {
                        return false;
                    }
                    if ($('input[name="radio_jnt"]:checked').attr("id") == "jnt_flightno") {
                        var addressData = box.chf.jnt.mod.address_flightno.getData().value.split("|");
                        var lnglat = addressData[2].split(',');
                        var flightData = box.chf.jnt.mod.flightno.getData().split('|');

                        var url = "http://" + window.location.host + "/car/chf/carlist?searchType=jnt" + "&feeType=" + $("#feeType_chf").value() + "&FlightNumber=" + flightData[0]
                            + "&locationType=" + flightData[1] + "&locationCode=" + flightData[2] + "&departureCityId=" + flightData[6] + "&terminalID=" + flightData[5]
                            + "&lng=" + lnglat[0] + "&lat=" + lnglat[1] + "&usetime=" + flightData[8] + '&ArrivalCityName=' + escape(addressData[3])
                            + "&DepartDate=" + box.chf.jnt.mod.flightnoDate.getValue() + "&departureCityName=" + escape(flightData[7]) + "&LocationLng=" + flightData[10] + "&LocationLat=" + flightData[9]
                            + "&locationName=" + escape(flightData[3]) + "&address=" + escape(addressData[1]) + "&addressDetail=" + escape(addressData[4]);
                        window.open(url);

                    } else {

                        box.chf.jnt.mod.date = box.chf.jnt.mod.airportDateTime;
                        box.chf.jnt.mod.location = box.chf.jnt.mod.airport;
                        box.chf.jnt.mod.address = box.chf.jnt.mod.address_airport;
                        box.chf.submit(box.chf.jnt.mod, "jnt", 1);
                    }
                }
            },
            snd: {
                ////国内送机
                isload: false,
                mod: {
                    date: null, location: null, address: null
                },
                load: function () {
                    if (!box.chf.snd.isload) {
                        box.chf.snd.mod.date = BoxDate.InitYYYYMMDDHHMM('#snd_date', '#snd_time', 0, 70, 90, 0, 70, '#chf_snd_date_layer'); ////送飞机日期时间
                        box.chf.snd.mod.address = BoxAddress.InitAddress("#snd_address");
                        box.chf.snd.mod.location = BoxAddress.InitChfLocation("snd", "#snd_airport", "airport", box.chf.snd.mod.address);
                        box.chf.snd.mod.location.setData(box.chf.def.airport);
                        $("#snd_airport").value(box.chf.def.airport.text);
                        box.chf.snd.mod.address.setCity({ source: null, cityname: box.chf.def.city });
                        box.chf.snd.isload = true;
                        $("#search_chf_snd").bind("click", function () { box.chf.snd.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_snd').find('input[type="text"]'));
                    }
                },
                validate: function () {

                    return box.chf.snd.mod.date.checkDate() && box.chf.snd.mod.location.validate() && box.chf.snd.mod.address.validate();
                },
                submit: function () {
                    if (!box.chf.snd.validate()) {
                        return false;
                    }
                    box.chf.submit(box.chf.snd.mod, "snd", 1);
                }
            },
            jhc: {
                ////国内接火车
                isload: false,
                mod: {
                    date: null, location: null, address: null
                },
                load: function () {
                    if (!box.chf.jhc.isload) {
                        box.chf.jhc.mod.date = BoxDate.InitYYYYMMDDHHMM('#jhc_date', '#jhc_time', 0, 70, 90, 0, 70, '#chf_jhc_date_layer'); ////接火车日期时间
                        box.chf.jhc.mod.address = BoxAddress.InitAddress("#jhc_address");
                        box.chf.jhc.mod.location = BoxAddress.InitChfLocation("jhc", "#jhc_station", "train", box.chf.jhc.mod.address);
                        box.chf.jhc.mod.location.setData(box.chf.def.location);
                        $("#jhc_station").value(box.chf.def.location.text);
                        box.chf.jhc.mod.address.setCity({ source: null, cityname: box.chf.def.city });
                        box.chf.jhc.isload = true;
                        $("#search_chf_jhc").bind("click", function () { box.chf.jhc.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_jhc').find('input[type="text"]'));
                    }
                },
                validate: function () {
                    return box.chf.jhc.mod.date.checkDate() && box.chf.jhc.mod.location.validate() && box.chf.jhc.mod.address.validate();
                },
                submit: function () {
                    if (!box.chf.jhc.validate()) {
                        return false;
                    }

                    box.chf.submit(box.chf.jhc.mod, "jhc", 2);
                }
            },
            shc: {
                ////国内送火车
                isload: false,
                mod: {
                    date: null, location: null, address: null
                },
                load: function () {
                    if (!box.chf.shc.isload) {
                        box.chf.shc.mod.date = BoxDate.InitYYYYMMDDHHMM('#shc_date', '#shc_time', 0, 70, 90, 0, 70, '#chf_shc_date_layer'); ////送火车日期时间
                        box.chf.shc.mod.address = BoxAddress.InitAddress("#shc_address");
                        box.chf.shc.mod.location = BoxAddress.InitChfLocation("shc", "#shc_station", "train", box.chf.shc.mod.address);
                        box.chf.shc.mod.location.setData(box.chf.def.location);
                        $("#shc_station").value(box.chf.def.location.text);
                        box.chf.shc.mod.address.setCity({ source: null, cityname: box.chf.def.city });
                        box.chf.shc.isload = true;
                        $("#search_chf_shc").bind("click", function () { box.chf.shc.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_shc').find('input[type="text"]'));
                    }
                },
                validate: function () {
                    return box.chf.shc.mod.date.checkDate() && box.chf.shc.mod.location.validate() && box.chf.shc.mod.address.validate();
                },
                submit: function () {
                    if (!box.chf.shc.validate()) {
                        return false;
                    }

                    box.chf.submit(box.chf.shc.mod, "shc", 2);
                }
            },
            submit: function (mod, searchType, locationType) {
                var addressData = mod.address.getData().value.split("|");
                var lnglat = addressData[2].split(',');
                var locationData = mod.location.getData().value.split('|');
                var url = "http://" + window.location.host + "/car/chf/carlist?searchType=" + searchType + "&feeType=" + $("#feeType_chf").value()
                    + "&locationType=" + locationType + "&locationCode=" + locationData[0] + "&terminalID=" + locationData[11] + "&lng=" + lnglat[0]
                    + "&lat=" + lnglat[1] + "&usetime=" + mod.date.getSDate() + "&locationName=" + escape(locationData[1]) + "&address=" + escape(addressData[1])
                    + "&addressDetail=" + escape(addressData[4]) + "&LocationLng=" + locationData[9] + "&LocationLat=" + locationData[8];

                if (searchType == "jnt" || searchType == "jhc") {
                    url = url + "&departureCityId=" + locationData[3] + "&departureCityName=" + escape(locationData[4]) + '&ArrivalCityName=' + escape(addressData[3]);
                } else {
                    url = url + "&arrivalCityId=" + locationData[3] + "&ArrivalCityName=" + escape(locationData[4]) + '&departureCityName=' + escape(addressData[3]);
                }
                window.open(url);
            }
        },
        och: {////国际接送机
            def: {
                city: { id: 725 },
                // airport: { text: '普吉国际机场(HKT)', value: 'HKT|普吉国际机场|普吉国际机场|725|普吉岛|Phuket|泰国|Thailand|||1|0' }
                airport: { text: label.HKT, value: 'HKT|' + label.HKT + '|' + label.HKT + '|725|' + label.Phuket + '|Phuket|' + label.Thailand + '|Thailand|||1|0' }
            },
            ojnt: {
                ////国际接机
                isload: false,
                mod: {
                    flightnoDate: null, airportDateTime: null, personer_flightno: null, personer_airport: null, address_flightno: null, address_airport: null, airport: null, flightno: null, flightno2: null
                },
                load: function () {
                    if (!box.och.ojnt.isload) {
                        box.och.ojnt.mod.personer_flightno = BoxPerson.InitPerson('#ojnt_par_flightno', '#ojnt_par_flightno_layer');
                        box.och.ojnt.mod.flightnoDate = BoxDate.InitOjntFlightNoDate('#ojnt_start_date', 10, 3, null); ////国际接机(按航班)
                        box.och.ojnt.mod.address_flightno = BoxAddress.InitOchAddress('#ojnt_address_flightno', '#ojnt_hotel_flightno', '#ojnt_hotel_flightno_layer');
                        box.och.ojnt.mod.flightno = BoxFlight.InitOjntFlight();

                        box.och.ojnt.mod.personer_airport = BoxPerson.InitPerson('#ojnt_par_airport', '#ojnt_par_airport_layer');
                        box.och.ojnt.mod.airportDateTime = BoxDate.InitYYYYMMDDHHMM('#ojnt_date', '#ojnt_time', 3, 10, null, 10, 10, '#och_ojnt_airport_date_layer'); ////国际接机(按机场)                                                             
                        box.och.ojnt.mod.address_airport = BoxAddress.InitOchAddress('#ojnt_address_airport', '#ojnt_hotel_airport', '#ojnt_hotel_airport_layer');
                        box.och.ojnt.mod.airport = BoxAddress.InitOjntAirport();
                        box.och.ojnt.mod.airport.setData(box.och.def.airport);
                        $("#ojnt_end_airport").value(box.och.def.airport.text);
                        box.och.ojnt.mod.address_airport.setCity(box.och.def.city);

                        box.och.ojnt.isload = true;
                        $("#search_och_ojnt").bind("click", function () { box.och.ojnt.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_ojnt').find('input[type="text"]'));
                    }
                }, validate: function () {
                    if ($('input[name="radio_ojnt"]:checked').attr("id") == "ojnt_flightno") {
                        return box.och.ojnt.mod.flightnoDate.checkDate() && box.och.ojnt.mod.flightno.validate() && box.och.ojnt.mod.address_flightno.validate(); //&& box.och.ojnt.mod.flightnoDate.checkDate()
                    } else {
                        return box.och.ojnt.mod.airportDateTime.checkDate() && box.och.ojnt.mod.airport.validate() && box.och.ojnt.mod.address_airport.validate();
                    }
                },
                submit: function () {
                    if (!box.och.ojnt.validate()) {
                        return false;
                    }
                    var url = $("#carUrl").value();
                    if ($('input[name="radio_ojnt"]:checked').attr("id") == "ojnt_flightno") {
                        var flightData = box.och.ojnt.mod.flightno.getData().split('|');
                        var fnoAddressData = box.och.ojnt.mod.address_flightno.getData().value.split("|");
                        var fnoPersons = box.och.ojnt.mod.personer_flightno.getData();
                        var fnoPersonData = fnoPersons.adult + "," + fnoPersons.child + "," + fnoPersons.baby;
                        url += "hwdaijia/jie-city" + flightData[6] + "/airport" + flightData[2] + "?flNo=" + flightData[0] + "&qryDptDt=" + box.och.ojnt.mod.flightnoDate.getValue()
                            + "&date=" + flightData[8] + "&persons=" + fnoPersonData + "&poiType=0&poiCd=" + fnoAddressData[0]
                            + "&poilng=" + fnoAddressData[4] + "&poilat=" + fnoAddressData[3] + "&poiNm=" + fnoAddressData[1] + "&poiaddr=" + fnoAddressData[2];
                    } else {
                        var airportData = box.och.ojnt.mod.airport.getData().value.split("|");
                        var airAddressData = box.och.ojnt.mod.address_airport.getData().value.split("|");
                        var airPersons = box.och.ojnt.mod.personer_airport.getData();
                        var airPersonData = airPersons.adult + "," + airPersons.child + "," + airPersons.baby;
                        url += "hwdaijia/jie-city" + airportData[3] + "/airport" + airportData[0] + "?date=" + box.och.ojnt.mod.airportDateTime.getSDate()
                            + "&persons=" + airPersonData + "&poiType=0&poiCd=" + airAddressData[0] + "&poilng=" + airAddressData[4] + "&poilat=" + airAddressData[3]
                            + "&poiNm=" + airAddressData[1] + "&poiaddr=" + airAddressData[2];
                    }
                    window.open(url);
                }
            },
            osnd: {
                ////国际送机
                isload: false,
                mod: {
                    airportDateTime: null, personer_airport: null, address_airport: null, airport: null
                },
                load: function () {
                    if (!box.och.osnd.isload) {
                        box.och.osnd.mod.address_airport = BoxAddress.InitOchAddress('#osnd_address_airport', '#osnd_hotel_airport', '#osnd_hotel_airport_layer');
                        box.och.osnd.mod.airportDateTime = BoxDate.InitYYYYMMDDHHMM('#osnd_date', '#osnd_time', 3, 10, null, 10, 10, '#och_osnd_airport_date_layer'); ////国际送机(按机场                                             
                        box.och.osnd.mod.personer_airport = BoxPerson.InitPerson('#osnd_par_airport', '#osnd_par_airport_layer');
                        box.och.osnd.mod.airport = BoxAddress.InitOsndAirport();
                        box.och.osnd.mod.airport.setData(box.och.def.airport);
                        $("#osnd_start_airport").value(box.och.def.airport.text);
                        box.och.osnd.mod.address_airport.setCity(box.och.def.city);

                        box.och.osnd.isload = true;
                        $("#search_och_osnd").bind("click", function () { box.och.osnd.submit(); });
                        //
                        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#business_form_osnd').find('input[type="text"]'));
                    }
                }, validate: function () {
                    return box.och.osnd.mod.airportDateTime.checkDate() && box.och.osnd.mod.airport.validate() && box.och.osnd.mod.address_airport.validate();
                },
                submit: function () {
                    if (!box.och.osnd.validate()) {
                        return false;
                    }
                    var url = $("#carUrl").value();
                    var airportData = box.och.osnd.mod.airport.getData().value.split("|");
                    var airAddressData = box.och.osnd.mod.address_airport.getData().value.split("|");
                    var airPersons = box.och.osnd.mod.personer_airport.getData();
                    var airPersonData = airPersons.adult + "," + airPersons.child + "," + airPersons.baby;
                    url += "hwdaijia/song-city" + airportData[3] + "/airport" + airportData[0] + "?date=" + box.och.ojnt.mod.airportDateTime.getSDate()
                            + "&persons=" + airPersonData + "&poiType=0&poiCd=" + airAddressData[0] + "&poilng=" + airAddressData[4] + "&poilat=" + airAddressData[3]
                            + "&poiNm=" + airAddressData[1] + "&poiaddr=" + airAddressData[2];

                    window.open(url);
                }
            }
        },
        tim: {
            ////日租包车
            def: {
                city: { id: 2, name: label.ShangHai}//上海
            },
            isload: false,
            mod: {
                dateTime: null, city: null
            },
            load: function () {
                if (!box.tim.isload) {
                    box.tim.mod.dateTime = BoxDate.InitTimDateTime();
                    box.tim.mod.city = BoxAddress.InitTimCity();
                    box.tim.mod.city.setData(box.tim.def.city);
                    $("#search_tim").bind("click", function () { box.tim.submit(); });
                    box.tim.isload = true;
                    //
                    !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#search_from_bigtim').find('input[type="text"]'));
                }
            },
            validate: function () {
                return box.tim.mod.dateTime.checkDate() && box.tim.mod.city.validate();
            },
            submit: function () {
                if (!box.tim.validate()) {
                    return false;
                }
                var url = $("#carUrl").value();
                url += "rizu/city" + box.tim.mod.city.getData().id + "?ptType=" + $("input[name='tim_day_radio']:checked").value() + "&date=" + box.tim.mod.dateTime.getSDate();
                window.open(url);
            }
        },
        isd: {
            ////国内租车
            def: {
                city: { id: 2, name: label.ShangHai}//上海
            },
            isload: false,
            mod: {
                dateTime: null, startCity: null, startLocation: null, endCity: null
            },
            load: function () {
                if (!box.isd.isload) {
                    box.isd.mod.dateTime = BoxDate.InitIsdDateTime();
                    $("#search_isd").bind("click", function () { box.isd.submit(); });

                    box.isd.mod.endCity = BoxAddress.InitIsdEndCity();
                    box.isd.mod.endCity.setData(box.isd.def.city);

                    box.isd.mod.startCity = BoxAddress.InitIsdStartCity();
                    box.isd.mod.startCity.setData(box.isd.def.city);

                    box.isd.mod.startLocation = BoxAddress.InitIsdStartLocation();
                    box.isd.isload = true;
                    //
                    !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#search_from_bigisd').find('input[type="text"]'));
                }
            },
            validate: function () {
                return box.isd.mod.dateTime.checkDate() && box.isd.mod.startLocation.validate() && box.isd.mod.startLocation.validate(); //&&box.isd.mod.dateTime.checkDate();
            },
            submit: function () {
                if (!box.isd.validate()) {
                    return false;
                }
                var locationData = box.isd.mod.startLocation.getData().value.split('|');
                var lnglat = locationData[2].split(',');
                var url = "http://" + location.hostname + "/car/isd/carlist?pcityid=" + $("#isd_start_cityid").value() + "&rcityid=" + $("#isd_end_cityid").value()
                    + "&pcityname=" + escape($("#isd_start_city").value()) + "&rcityname=" + escape($("#isd_end_city").value())
                    + "&ptime=" + box.isd.mod.dateTime.getSDate() + "&rtime=" + box.isd.mod.dateTime.getEDate()
                    + "&plng=" + lnglat[0] + "&plat=" + lnglat[1] + "&paddress=" + escape(locationData[1]) + "&feeType=" + $("#feeType_isd").value();
                window.open(url);
            }
        },
        osd: {
            ////国际租车
            isload: false,
            mod: {
                dateTime: null, startAddress: null, endAddress: null
            },
            load: function () {
                if (!box.osd.isload) {
                    box.osd.mod.dateTime = BoxDate.InitOsdDateTime();
                    box.osd.mod.endAddress = BoxAddress.InitOsdEnd();
                    box.osd.mod.startAddress = BoxAddress.InitOsdStart();
                    box.osd.isload = true;
                    $("#search_osd").bind("click", function () { box.osd.submit(); });
                    //
                    !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('#search_from_bigosd').find('input[type="text"]'));
                }
            },
            validate: function () {
                return box.osd.mod.dateTime.checkDate() && box.osd.mod.startAddress.validate() && box.osd.mod.endAddress.validate();
            },
            submit: function () {
                if (!box.osd.validate()) {
                    return false;
                }
                var startTime = box.osd.mod.dateTime.getSDate();
                var endTime = box.osd.mod.dateTime.getEDate();
                var startData = box.osd.mod.startAddress.getData().value.split('|');
                var endData = box.osd.mod.endAddress.getData().value.split('|');
                var url = $("#carUrl").value();
                url += "osdweb/o/search?pcity=" + startData[3] + "&ptype=" + getOsdPtType(startData[10], startData[0]) + "&rcity=" + endData[3] + "&rtype=" + getOsdPtType(endData[10], endData[0])
                    + "&ptime=" + getDateTimeString(startTime) + "&rtime=" + getDateTimeString(endTime) + "&paddress=" + escape(startData[1]) + "&raddress=" + (endData[1]);
                window.open(url);
            }
        },
        load: {
            bigBox: function (index) {
                if (index == 0) {
                    box.chf.jnt.load();
                } else if (index == 1) {
                    box.och.ojnt.load();
                } else if (index == 2) {
                    box.tim.load();
                } else if (index == 3) {
                    box.isd.load();
                } else if (index == 4) {
                    box.osd.load();
                }
            },
            chfBox: function (index) {
                if (index == 1) {
                    box.chf.snd.load();
                } else if (index == 2) {
                    box.chf.jhc.load();
                } else if (index == 3) {
                    box.chf.shc.load();
                }
            },
            ochBox: function (index) {
                if (index == 1) {
                    box.och.osnd.load();
                }
            }
        }
    }

    ////因私提示
    var personaltip = {
        chf: false,
        isd: false,
        base: "position: absolute; width: 210px; margin-bottom: 20px; z-index: 100;",
        style: "",
        init: function () {
            var obj = $("#main_search_table");
            var left = Number(obj.offset().left) + 547;
            var top = Number(obj.offset().top) + 54;
            personaltip.style = personaltip.base + "left:" + left + "px;top:" + top + "px;";
        },
        show: function () {
            $("#carPersonaltip").attr("style", personaltip.style);
            document.getElementById("carPersonaltip").style.display = "";
        },
        hidden: function () {
            document.getElementById("carPersonaltip").style.display = "none";
        },
        tabeChange: function (index) {
            personaltip.hidden();
            if (index == 1 || index == 2 || index == 4 || (index == 0 && personaltip.getStatus("chf")) || (index == 3 && personaltip.getStatus("isd"))) {
                personaltip.show();
            }
        },
        reset: function () {
            if (document.getElementById("carPersonaltip").style.display == "") {
                personaltip.show();
            }
        },
        getStatus: function (bigbox) {
            if (bigbox == "chf") {
                return personaltip.chf;
            } else if (bigbox == "isd") {
                return personaltip.isd;
            } else {
                return false;
            }
        },
        setStatus: function (bigbox, value) {
            if (bigbox == "chf") {
                personaltip.chf = value;
            } else if (bigbox == "isd") {
                personaltip.isd = value;
            }
        }
    }

    var BoxFlight = {
        InitJntFlight: function () {
            $('#jnt_flight_number').value("");
            //
            var baseParam = new UIControl.FlightControl.InitParam({
                fltObj: '#jnt_flight_number',
                myFltObj: '#jnt_my_flightno',
                fltLayer: '#jnt_flight_layer',
                validateMsgObj: "#jnt_flight_msg",
                type: "jnt",
                onvalidate: function (f) {
                    if (f.Data != undefined) {
                        box.chf.jnt.mod.flightnoDate.setDate(f.FlightDepartDate);
                        f1.setData(f.Data);
                        var city = { source: null, cityname: f.Data.split("|")[7] };
                        box.chf.jnt.mod.address_flightno.setCity(city);
                        $("#jnt_address_flightno").removeAttr("disabled");
                    }
                },
                goAirportEv: function () {
                    //跳转至按机场预定
                    $('#jnt_airport').click();
                },
                goOverseaEv: function () {
                    //跳转至海外预定
                    $('#main_search_table').find('a:eq(1)').click();
                },
                goDomesticEv: function () {
                    //跳转至国内预定
                }
            });
            //
            var f1 = UIControl.FlightControl.InitFlightNO({
                baseParam: baseParam,
                suggestionSource: "/Car/Scripts/data/jsonpResponse.js",
                filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
                myFltSource: "/car/Ajax/GetMyFlight?type=jnt",
                onchange: function (fno) {
                    $("#jnt_address_flightno").attr("disabled", "disabled");
                    box.chf.jnt.mod.address_flightno.setData({ text: '', value: '' });
                    box.chf.jnt.mod.address_flightno.clearAutoCache();
                    f2 && (f2.DoVali({ flightNumber: fno, date: $("#jnt_start_date").value(), type: "jnt" }));
                }
            });
            var f2 = UIControl.FlightControl.ValidateFlightNO({
                baseParam: baseParam,
                validateSource: "/car/Ajax/GetFlight"
            });
            box.chf.jnt.mod.flightno2 = f2;
            return f1;
        },
        InitOjntFlight: function () {
            $('#ojnt_flight_number').value("");
            var baseParam = new UIControl.FlightControl.InitParam({
                fltObj: '#ojnt_flight_number',
                myFltObj: '#ojnt_my_flightno',
                fltLayer: '#ojnt_flight_layer',
                validateMsgObj: "#ojnt_flight_msg",
                type: "ojnt",
                onvalidate: function (f) {
                    if (f.Data != undefined) {
                        box.och.ojnt.mod.flightnoDate.setDate(f.FlightDepartDate);
                        f3.setData(f.Data);
                        box.och.ojnt.mod.address_flightno.setCity({ id: f.Data.split("|")[6] });
                        $("#ojnt_address_flightno").removeAttr("disabled");
                    }
                },
                goAirportEv: function () {
                    //跳转至按机场预定
                    $('#ojnt_airport').click();
                },
                goOverseaEv: function () {
                    //跳转至海外预定
                },
                goDomesticEv: function () {
                    //跳转至国内预定
                    $('#main_search_table').find('a:eq(0)').click();
                }
            });
            var f3 = UIControl.FlightControl.InitFlightNO({
                baseParam: baseParam,
                suggestionSource: "/Car/Scripts/data/jsonpResponse.js",
                filterSource: "/car/Ajax/FuzzyFlight?key=${key}",
                myFltSource: "/car/Ajax/GetMyFlight?type=ojnt",
                onchange: function (fno) {
                    $("#ojnt_address_flightno").attr("disabled", "disabled");
                    box.och.ojnt.mod.address_flightno.setData({ text: '', value: '' });
                    $("#ojnt_address_flightno").value("");
                    box.och.ojnt.mod.address_flightno.setCity({ id: "0" });
                    f4 && (f4.DoVali({ flightNumber: fno, date: $("#ojnt_start_date").value(), type: "ojnt" }));
                }
            });
            var f4 = UIControl.FlightControl.ValidateFlightNO({
                baseParam: baseParam,
                validateSource: "/car/Ajax/GetFlight"
            });
            box.och.ojnt.mod.flightno2 = f4;
            return f3;
        }
    }

    var BoxAddress = {
        InitTimCity: function () { ////初始日租包车用车城市
            return UIControl.CityControl.InitNormalCity({
                txtCity: '#tim_city',
                hidCity: '#tim_cityid',
                source: '/Car/Ajax/GetServiceCity?type=tim&se=t'
            });
        },
        InitIsdStartCity: function () { ////初始化国内租车取车城市
            return UIControl.CityControl.InitNormalCity({
                txtCity: '#isd_start_city',
                hidCity: '#isd_start_cityid',
                source: '/car/ajax/GetServiceCity?type=isd&se=s',
                onchange: function (o) {
                    $("#isd_end_city").value(o.name);
                    $("#isd_end_cityid").value(o.id);
                    box.isd.mod.startLocation.setCity({
                        cityname: o.name,
                        source: '/car/ajax/GetLocation?type=isd&cityid=' + o.id
                    });
                    $("#isd_start_address").value("");
                }
            });
        },
        InitIsdEndCity: function () { ////初始化国内租车还车城市
            return UIControl.CityControl.InitNormalCity({
                txtCity: '#isd_end_city',
                hidCity: '#isd_end_cityid',
                source: '/car/ajax/GetServiceCity?type=isd&se=e'
            });
        },
        InitIsdStartLocation: function () { ////初始化国内租车取车区域
            $("#isd_start_address").value("");
            return UIControl.AreaControl.InitNormalArea({
                txtArea: '#isd_start_address',
                msg: message.get('#isd_start_address'),
                cityName: $("#isd_start_city").value(),
                source: '/car/ajax/GetLocation?type=isd&cityid=' + $("#isd_start_cityid").value()
            });
        },
        InitChfLocation: function (type, textArea, locaType, address) { ////初始化国内代驾固定点
            return UIControl.AreaControl.InitCHArea({
                txtArea: textArea,
                msg: message.get(textArea),
                initdata: {},
                suggestionSource: "/car/ajax/GetLocation?type=" + type,
                filterSource: "/car/ajax/CHFuzzyFixLocation?type=" + type + "&key=${key}",
                type: locaType, //train/airport
                onchange: function (o) {
                    address.setCity({
                        source: null,
                        cityname: o.value.split("|")[4]
                    });
                }
            });
        },
        InitAddress: function (txtArea) {
            $(txtArea).value("");
            return UIControl.AreaControl.InitNormalArea({
                txtArea: txtArea,
                msg: message.get(txtArea),
                cityName: "",
                source: '/Car/Scripts/data/jsonpResponse.js',
                filterOnly: true
            });
        },
        InitOsdStart: function () { ////初始化国际租车取车
            $("#osd_start_address").value("");
            return UIControl.AreaControl.InitOSArea({
                txtArea: "#osd_start_address",
                suggestionSource: "/car/ajax/GetLocation?type=osd",
                filterSource: "/car/ajax/OSDFuzzyFixLocation?key=${key}",
                emptyMsg: message.get("#osd_start_address"),
                onchange: function (o) {
                    box.osd.mod.endAddress.setData({ text: o.text, value: o.value });
                    $("#osd_end_address").value(o.text);
                }
            });
        },
        InitOsdEnd: function () { ////初始化国际租车还车
            $("#osd_end_address").value("");
            return UIControl.AreaControl.InitOSArea({
                txtArea: "#osd_end_address",
                suggestionSource: "/car/ajax/GetLocation?type=osd",
                filterSource: "/car/ajax/OSDFuzzyFixLocation?key=${key}",
                emptyMsg: message.get("#osd_end_address"),
                onchange: function (o) { }
            });
        },
        InitOchAddress: function (txtArea, hotel, layer) { ////初始化国际代驾出发/送达地点
            $(txtArea).value("");
            return UIControl.AreaControl.InitOCHArea({
                txtArea: txtArea,
                myHtlObj: hotel,
                htlLayer: layer,
                suggestionSource: "/Car/Scripts/data/jsonpResponse.js",
                filterSource: "/car/ajax/OCHFuzzyFixLocation?cityId={cid}&key=${key}",
                myHtlSource: "/car/ajax/GetMyHotel?cityId={cid}",
                emptyMsg: message.get(txtArea),
                onchange: function (val) { }
            });
        },
        InitOjntAirport: function () { ////初始化国际代驾接机机场
            return UIControl.AreaControl.InitOSArea({
                txtArea: '#ojnt_end_airport',
                suggestionSource: "/car/ajax/GetLocation?type=ojnt",
                filterSource: "/car/ajax/CHFuzzyFixLocation?key=${key}&type=ojnt",
                emptyMsg: message.get('#ojnt_end_airport'),
                onchange: function (o) {
                    box.och.ojnt.mod.address_airport.setCity({ id: o.value.split('|')[3] });
                    $("#ojnt_address_airport").value("");
                }
            });
        },
        InitOsndAirport: function () { ////初始化国际代驾送机机场
            return UIControl.AreaControl.InitOSArea({
                txtArea: '#osnd_start_airport',
                suggestionSource: "/car/ajax/GetLocation?type=osnd",
                filterSource: "/car/ajax/CHFuzzyFixLocation?key=${key}&type=osnd",
                emptyMsg: message.get('#osnd_start_airport'),
                onchange: function (o) {
                    box.och.osnd.mod.address_airport.setCity({ id: o.value.split('|')[3] });
                    $("#osnd_address_airport").value("");
                }
            });
        }
    }

    var BoxDate = {
        InitYYYYMMDD: function (startObj, defAddDays, minAddDays, days) { ////初始化日期(单日)
            return UIControl.DateControl.InitNormalDate({
                Start: {
                    startObj: startObj,
                    Min: { addDays: minAddDays },
                    Max: days == null ? {} : { addDays: days },
                    Default: { addDays: defAddDays },
                    onchange: function () {
                    }
                }
            });
        },
        InitJntFlightNoDate: function (startObj, defAddDays, minAddDays, days) { ////初始化国内接机按航班号日期(单日)
            return UIControl.DateControl.InitNormalDate({
                Start: {
                    startObj: startObj,
                    Min: { addDays: minAddDays },
                    Max: days == null ? {} : { addDays: days },
                    Default: { addDays: defAddDays },
                    onchange: function () {
                        var fno = $("#jnt_flight_number").value();
                        if (fno != "") {
                            $("#jnt_address_flightno").attr("disabled", "disabled");
                            box.chf.jnt.mod.address_flightno.setData({ text: '', value: '' });
                            box.chf.jnt.mod.address_flightno.clearAutoCache();
                            box.chf.jnt.mod.flightno2 && (box.chf.jnt.mod.flightno2.DoVali({ flightNumber: fno, date: $("#jnt_start_date").value(), type: "jnt" }));
                        }
                    }
                }
            });
        },
        InitOjntFlightNoDate: function (startObj, defAddDays, minAddDays, days) { ////初始化海外接机按航班号日期(单日)
            return UIControl.DateControl.InitNormalDate({
                Start: {
                    startObj: startObj,
                    Min: { addDays: minAddDays },
                    Max: days == null ? {} : { addDays: days },
                    Default: { addDays: defAddDays },
                    onchange: function () {
                        var fno = $("#ojnt_flight_number").value();
                        if (fno != "") {
                            $("#ojnt_address_flightno").attr("disabled", "disabled");
                            box.och.ojnt.mod.address_flightno.setData({ text: '', value: '' });
                            $("#ojnt_address_flightno").value("");
                            box.och.ojnt.mod.address_flightno.setCity({ id: "0" });
                            box.och.ojnt.mod.flightno2 && (box.och.ojnt.mod.flightno2.DoVali({ flightNumber: fno, date: $("#ojnt_start_date").value(), type: "ojnt" }));
                        }
                    }
                }
            });
        },
        InitYYYYMMDDHHMM: function (ymdObj, hmObj, minAddDays, minAddMin, maxAddDays, defAddDays, defAddMin, layer) { /////初始化日期(单日)和时间(10分钟)
            return UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: ymdObj,
                    hmObj: hmObj,
                    Min: { addDays: minAddDays, addMin: minAddMin },
                    Max: maxAddDays == null ? {} : { addDays: maxAddDays, hm: "23:50" },
                    Default: { addDays: defAddDays, addMin: defAddMin },
                    layer: layer
                }
            });
        },
        InitYYYYMMDDHH: function (ymdObj, hmObj, minAddDays, minAddMin, maxAddDays, defAddDays, layer) { /////初始化日期(单日)和时间(1小时)
            return UIControl.DateControl.InitYMDHDate({
                IsGTHour: true,
                Start: {
                    ymdObj: ymdObj,
                    hObj: hmObj,
                    Min: { addDays: minAddDays, addMin: minAddMin },
                    Max: { addDays: maxAddDays, hm: "23:00" },
                    Default: { addDays: defAddDays, hm: "10:00" },
                    layer: layer
                }
            });
        },
        InitTimDateTime: function () { /////初始化日租包车日期时间
            var start = {
                ymdObj: '#tim_date',
                hmObj: '#tim_time',
                Min: { addDays: 0, addMin: 70 },
                Max: { addDays: 20, hm: "23:00" },
                Default: { addDays: 1, hm: "10:00" },
                layer: '#tim_date_layer'
            };
            return UIControl.DateControl.InitYMDHMDate({ IsGTMin: true, Start: start });
        },
        InitIsdDateTime: function () { ////初始化国内租车日期时间(联动)
            return UIControl.DateControl.InitYMDHDate({
                IsGTHour: true,
                Start: {
                    ymdObj: '#isd_start_date',
                    hObj: '#isd_start_time',
                    Min: { addDays: 0, addMin: 60 },
                    Max: { addDays: 90, hm: "23:00" },
                    Default: { addDays: 1, hm: "10:00" },
                    layer: '#isd_start_date_layer'
                },
                End: {
                    ymdObj: '#isd_end_date',
                    hObj: '#isd_end_time',
                    Min: { addDays: 0, addMin: 60 },
                    Max: { addDays: 90, hm: "23:00" },
                    Default: { addDays: 2, hm: "10:00" },
                    layer: '#isd_end_date_layer'
                }
            });
        },
        InitOsdDateTime: function () { ////初始化国际租车日期时间(联动)
            return UIControl.DateControl.InitYMDHMDate({
                IsGTMin: true,
                Start: {
                    ymdObj: '#osd_start_date',
                    hmObj: '#osd_start_time',
                    Min: { addDays: 1, hm: "00:00" },
                    Max: {},
                    Default: { addDays: 7, hm: "10:00" },
                    layer: '#osd_start_date_layer'
                },
                End: {
                    ymdObj: '#osd_end_date',
                    hmObj: '#osd_end_time',
                    Min: { addDays: 0, addMin: 60 },
                    Max: {},
                    Default: { addDays: 7, hm: "10:00" },
                    layer: '#osd_end_date_layer'
                }
            });
        }
    }

    var BoxChange = {
        load: function () {
            BoxChange.bindBigBoxChange(); ////用车首页搜索Table切换
            BoxChange.bindChfBoxTableChange(); ////国内接送机/火车Table切换
            BoxChange.bindOchBoxTableChange(); ////海外接送机Table切换

            BoxChange.bindRadioChange('radio_ojnt'); /////海外接机_按机场/航班切换
            BoxChange.bindRadioChange('radio_osnd'); /////海外送机_机按机场/航班切换
            BoxChange.bindRadioChange('radio_jnt'); /////国内接机_按机场/航班切换
        },
        bindBigBoxChange: function () { ////用车首页搜索Table切换
            //
            var _chsIndex = parseInt($('#InitialType').value());
            UIControl.TabControl.InitTab({
                tObj: '#main_search_table',
                config: {
                    options: { index: (_chsIndex < 0 || _chsIndex > 4 ? 0 : _chsIndex), tab: "a.tab-nav", panel: "#search_content>div", trigger: "click", ajax: false, save: true },
                    style: { tab: ['cur', ''], panel: { display: ['block', 'none']} },
                    listeners: { returnTab: function (index, tab) {
                        //切换错误信息清空
                        UIControl && UIControl.WarnControl.hide();
                        //
                        box.load.bigBox(index);
                        personaltip.tabeChange(index);
                    }, initEventCallback: function () { box.load.bigBox(_chsIndex < 0 || _chsIndex > 4 ? 0 : _chsIndex); }
                    }
                }
            });
        },
        bindChfBoxTableChange: function () { ////国内接送机/火车Table切换
            UIControl.TabControl.InitTab({
                tObj: '#bigchf_business_table',
                config: {
                    options: { index: 0, tab: "a.biz-nav", panel: "#bigchf_business_content>div", trigger: "click", ajax: false, save: true },
                    style: { tab: ['cur', ''], panel: { display: ['block', 'none']} },
                    listeners: {
                        returnTab: function (index, tab) {
                            UIControl && UIControl.WarnControl.hide();
                            box.load.chfBox(index);
                        }
                    }
                }
            });
        },
        bindOchBoxTableChange: function () { ////海外接送机Table切换
            UIControl.TabControl.InitTab({
                tObj: '#bigoch_business_table',
                config: {
                    options: { index: 0, tab: "a.biz-nav", panel: "#bigoch_business_content>div", trigger: "click", ajax: false, save: true },
                    style: { tab: ['cur', ''], panel: { display: ['block', 'none']} },
                    listeners: { returnTab: function (index, tab) { UIControl && UIControl.WarnControl.hide(); box.load.ochBox(index); } }
                }
            });
        },
        bindRadioChange: function (name) { ////按机场/航班切换
            $("input[name='" + name + "']").bind('click', function () {
                UIControl.WarnControl.hide();
                var radioId = $(this).attr("id");
                var businessForm = radioId.split('_')[0];
                ///按机场/航班切换
                $("#business_form_" + businessForm).find("div[class='form-box']").each(function (e) {
                    var tname = $(e).attr("name");
                    if (tname != null) {
                        if (tname == radioId) {
                            $(e).css("display", "");
                        } else {
                            $(e).css("display", "none");
                        }
                    }
                });
            });
            $("input[name='" + name + "']:checked").click();
        }
    }

    var BoxPerson = {
        InitPerson: function (obj, layer) {
            return UIControl.PersonControl.InitPerson({
                pObj: obj,
                pLayer: layer
            });
        }
    }

    ///因公因私加载
    function feeTypeLoad() {
        personaltip.init();
        var business = $("#IsBusiness").value();
        var personal = $("#IsPersonal").value();
        var c = business == "true" || business == "True";
        var p = personal == "true" || personal == "True";
        feeTypeBigBoxLoad("chf", c, p);
        feeTypeBigBoxLoad("isd", c, p);
        $("a[name='feeTypeP']").bind("click", function () {
            personaltip.tabeChange(1);
        });
    }

    function feeTypeBigBoxLoad(bigbox, c, p) {
        var name = "feeType_" + bigbox;
        $("#" + name).value("C");
        var elements = document.getElementsByName(name);
        for (var i = 0; i < elements.length; i++) {
            var v = elements[i].getAttribute("v");
            if (c && v == "C") {
                elements[i].style.display = "";
                elements[i].onclick = delegate(feeTypeClick, bigbox, v, elements[i]); //feeTypeClick(bigbox, v);
            }
            if (p && v == "P") {
                elements[i].style.display = "";
                elements[i].onclick = delegate(feeTypeClick, bigbox, v, elements[i]);
                if (!c) {
                    elements[i].className = "type cur";
                    $("#" + name).value("P");
                    personaltip.setStatus(bigbox, true);
                    personaltip.show();
                }
            }
        }
    }

    ///因公因私点击
    function feeTypeClick(bigbox, v) {
        var name = "feeType_" + bigbox;
        $("#" + name).value(v);
        var elements = document.getElementsByName(name);
        for (var j = 0; j < elements.length; j++) {
            if (elements[j].getAttribute("v") == v) {
                elements[j].className = "type cur";
                if (elements[j].getAttribute("v") == "P") {
                    personaltip.show();
                    personaltip.setStatus(bigbox, true);
                } else {
                    personaltip.hidden();
                    personaltip.setStatus(bigbox, false);
                }
            } else {
                elements[j].className = "type disable";
            }
        }
    }

    function getDateTimeString(dateitme) {
        return dateitme.replace("-", "").replace("-", "").replace(" ", "").replace(":", "");
    }

    function getOsdPtType(locationType, locationCode) {
        if (locationType == "1") {
            return "airport" + locationCode;
        }
        if (locationType == "2") {
            return "train" + locationCode;
        }
        return "zone" + locationCode;
    }

    function delegate(fn, p1, p2, obj) {
        return function () {
            fn.call(obj || window, p1, p2);
        }
    }

    Array.prototype.indexOf = function (n) {
        if ("indexOf" in this) {
            return this["indexOf"](n);
        }
        for (var i = 0; i < this.length; i++) {
            if (n === this[i]) {
                return i;
            }
        }
        return -1;
    };

})(cQuery);
