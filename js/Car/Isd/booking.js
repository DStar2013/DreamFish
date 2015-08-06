(function ($) {
    var AjaxUrl = {
        AreaEmptySource: '/car/Scripts/data/jsonpResponse.js',
        ChangeVendorUrl: 'GetStoreList',
        CreateOrderUrl: 'CreateOrder',
        VendorInfoUrl: 'StoreChange',
        InvoiceInfoUrl: '../Ajax/GetBookingInvoiceInformation'
    }

    var openuiCVal = {
        Cost1NeedChange: "C" == PageInfo.ModelInfo.PostParam.feeType.toLocaleUpperCase() && "P" == PageInfo.ModelInfo.CostCenterRequire.toLocaleUpperCase(),
        IsAuthExist: false,
        IsCostCenterExist: false
    }
    var NAnimate = $.browser.isIE6 || $.browser.isIE7 || $.browser.isIE8;
    //GD_Map 高德地图
    var MOD = {};
    //
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    function CloseWindow() {
        if ($.browser.isIE6) {
            window.opener = null; window.close();
        } else if ($.browser.isAllIE) {
            window.open('', '_top'); window.top.close();
        } else { window.close(); }
    }
    //
    var BookingValidate = {
        setW: function (obj, msg) {
            obj.addClass('input_error');
            obj.parentNode().find('div.help_inline').html('<i class="ico tip_arrow_left"></i><span class="ico ico_warn"></span>' + msg).css('display', '');
        },
        setR: function (obj) {
            obj.removeClass('input_error');
            obj.parentNode().find('div.help_inline').css('display', 'none');
        },
        ValidateName: function (obj, cardtype) {
            var a = obj.value(), message = label.NameNotConformRules, result = true; // "姓名不符合规则"
            //(cardtype && 2 == cardtype) 国际护照
            var b = a.split("/");
            if (b.length > 1 && obj.value() != obj.attr('placeholder')) {
                ((/^[^\/]+\/[^\/]+$/).test(a) ? ((/[^a-zA-Z. \/'-]/).test(a) ? (message = label.EnNameIllegalCharacters) : // '英文姓名中包含非法字符，请检查'
                (
                    (/[^a-zA-Z]/).test(b[0]) ? (message = label.EnNameContainLetters) : //英文的姓中只能包含字母
                    ((/^[a-zA-Z]/).test(b[1]) ? (message = '') : (message = label.EnNameBeginLetter))//英文的名必须以字母开头
                )
                ) :
                (message = label.InputCorrectEnName)); //请填写正确的英文姓名，姓名格式为姓/名，<br />姓与名之间用/分隔，如Green/Jim King
                result = !message;

            } else {
                if (IsEmpty(a.trim()) || obj.value() == obj.attr('placeholder')) {
                    message = label.NameNotEmpty; result = false; //请填写姓名
                } else if (!/^[\u0100-\uffff]*$/.test(a)) {
                    message = label.CNNameContainChinese; result = false; //中文姓名只能包含汉字，请重新填写
                }
            }
            result ? BookingValidate.setR(obj) : BookingValidate.setW(obj, message);
            return result;
        },
        ValidateCard: function (obj, cardtype) {
            //身份证验证
            var a = obj.value(), message = "", result = true;
            if (IsEmpty(a.trim()) || obj.value() == obj.attr('placeholder')) {
                message = label.InputIDNumber; result = false; //请填写证件号码
            } else if (1 == cardtype && !/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[a-zA-Z])$/.test(a)) {
                message = label.InputCorrectIDNumber; result = false; //请填写正确的身份证号码
            }
            result ? BookingValidate.setR(obj) : BookingValidate.setW(obj, message);
            return result;
        },
        ValidateMobile: function (obj) {
            var rMobile = /^((\(\d{3}\))|(\d{3}\-))?1(3|4|5|7|8)\d{9}$/, a = obj.value(), message = "", result = true;
            if (IsEmpty(a.trim()) || obj.value() == obj.attr('placeholder')) {
                message = label.InputPhoneNumber; result = false; //请填写电话号码
            } else if (!rMobile.test(a.trim())) {
                message = label.InputCorrectPhoneNumber; result = false; //请输入正确电话号码格式
            }
            result ? BookingValidate.setR(obj) : BookingValidate.setW(obj, message);
            return result;
        },
        ValidateEmail: function (obj) {
            var rMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,4}$/, a = obj.value(), message = "", result = true;
            if (IsEmpty(a.trim()) || obj.value() == obj.attr('placeholder')) {
                message = label.InputEmail; result = false; //请填写电子邮箱
            } else if (!rMail.test(a.trim())) {
                message = label.InputCorrectEmail; result = false; //请填写正确的Email地址，格式：a@b.c
            }
            result ? BookingValidate.setR(obj) : BookingValidate.setW(obj, message);
            return result;
        }
    }

    //乘车人 S
    var Passenger = {
        baseUidIndex: 1,
        init: function () {
            $('#PsgerInputList [fid="first"]').find('input').value("");
            //
            Passenger.bindEv();
        },
        bindEv: function () {
            $('#addPassenger').bind('click', function (e) {
                Passenger.addInputPsger();
            });
            var pObj = $('#PsgerInputList .m-passenger[fid="first"]');
            pObj.find('input.inp').bind('blur', function () {
                Passenger.psgInputBlurEv($(this), pObj);
                Driver.setDriverSelect();
            });
            //
            CMFun && CMFun.HoverBindEv($('#FN_icon'), $('#FN_iconLayer'), {});
        },
        addInputPsger: function () {
            var ipt = $(document.createElement('div'));
            ipt.addClass('m-passenger');
            ipt.attr('uid', "stranger_uid_" + (Passenger.baseUidIndex++));
            //
            ipt.html($.tmpl.render($('#PsgerInputTmpl').html(), {}));
            //
            ipt.find('.btn-delete').bind('click', function (e) {
                //uncheck 操作
                var userInfo = userList.getByUid(ipt.attr('uid'));
                userInfo && (userList.uncheck(ipt.attr('uid')));
                //成本中心remove
                if (openuiCVal.Cost1NeedChange && typeof removeCostCenter1 != "undefined") {
                    removeCostCenter1($.stringifyJSON({
                        UIDOrInfoID: ipt.attr('uid'),
                        IsEmpolyee: (userInfo && userInfo.isCorp == "T") ? "Y" : "N"
                    }));
                }
                //remove操作
                ipt.remove(); Passenger.refreshIndexPsg(); Driver.setDriverSelect();
            });
            //
            ipt.find('input.inp').bind('blur', function (e) {
                Passenger.psgInputBlurEv($(this), ipt);
                Driver.setDriverSelect();
            });
            $('#PsgerInputList').append(ipt);
            //
            !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add(ipt.find('input[type="text"]'));
            //
            Passenger.refreshIndexPsg();
            return ipt;
        },
        psgInputBlurEv: function (o, op) {
            //判断是否发生更改
            o.value(o.value().trim());
            var hidObj = o.parentNode().find('[st="hidName"]');
            if (hidObj.value().trim() != o.value().trim()) {
                var userInfo = userList.getByUid(op.attr('uid'));
                userInfo && userList.uncheck(userInfo.uid); hidObj.value(o.value().trim());
                Passenger.clearAttrPsger(op);
                //成本中心change
                if (openuiCVal.Cost1NeedChange && typeof removeCostCenter1 != "undefined") {
                    removeCostCenter1($.stringifyJSON({
                        UIDOrInfoID: op.attr('uid'),
                        IsEmpolyee: (userInfo && userInfo.isCorp == "T") ? "Y" : "N"
                    }));
                }
                op.attr('uid', "stranger_uid_" + (Passenger.baseUidIndex++));
                if (openuiCVal.Cost1NeedChange && typeof addCostCenter1 != "undefined") {
                    addCostCenter1($.stringifyJSON({
                        UIDOrInfoID: op.attr('uid'),
                        IsEmpolyee: 'N',
                        Name: escape(o.value().trim()),
                        PolicyID: PageInfo.ModelInfo.PolicyID,
                        BookType: 'flight'
                    }));
                }
            }
            //
            BookingValidate.ValidateName(o);
        },
        refreshIndexPsg: function () {
            $('#addPassenger').css('display', $('#PsgerInputList').find('div.m-passenger').length < PageInfo.ModelInfo.PostParam.carCapacity ? '' : 'none');
            //
            $('#PsgerInputList').find('div.desc span').each(function (o, i) {
                o.html(label.TheXPassenger.replace("{0}", (i + 1))); //第X位乘车人
            });
        },
        getEmptyPsgObj: function () {
            var obj = null, tar = $('#PsgerInputList .m-passenger');
            //获取可修改的乘客obj
            for (var i = 0; tar.length; i++) {
                var _o = $(tar[i]), _t = $(_o).find('input.inp');
                if (_t.value() == "" || _t.value() == _t.attr('placeholder')) {
                    obj = $(_o); break;
                }
            }
            return obj;
        },
        setInputPsgerVal: function (content, data) {
            //data==null 清空信息
            if (data) {
                content.attr('uid', data.uid);
                Passenger.addAttrPsger(content, data, userList ? userList.getByUid(data.uid) : "");
                content.find('input.inp').value(data.name); content.find('input[st="hidName"]').value(data.name);
            } else {
                content.attr('uid', "stranger_uid_" + (Passenger.baseUidIndex++));
                Passenger.clearAttrPsger(content);
                content.find('input.inp').value(""); content.find('input[st="hidName"]').value("");
            }
            content.find('input.inp').trigger('blur');
        },
        addAttrPsger: function (obj, info, deinfo) {
            obj.data('userInfo', info); obj.data('userDetailInfo', deinfo);
        },
        clearAttrPsger: function (obj) {
            obj.data('userInfo', ''); obj.data('userDetailInfo', '');
        },
        getPsger: function () {
            //扫描所有入住人信息
            var arr = [];
            $('#PsgerInputList .m-passenger').each(function (o, i) {
                var ipt = o.find('input.inp');
                if (ipt.value() != "" && ipt.value() != ipt.attr('placeholder')) {
                    arr.push({
                        name: ipt.value(),
                        uid: o.attr('uid'),
                        userInfo: o.data('userInfo'),
                        userDetailInfo: o.data('userDetailInfo')
                    });
                }
            });
            return arr;
        },
        getPassengerInfo: function () {
            var arr = [];
            $('#PsgerInputList .m-passenger').each(function (o, i) {
                var ipt = o.find('input.inp'), pInfo = o.data('userDetailInfo'), dInfo = $('#DriverName').data('info');
                if (ipt.value() != "") {
                    //乘客类别(P:乘客 D:驾驶员)
                    var isDriver = dInfo && (o.attr('uid') == dInfo.uid), driverInfo = Driver.getDriverInfo();
                    arr.push({
                        PassengerType: isDriver ? "D" : "P",
                        PassengerName: ipt.value(),
                        IDType: isDriver ? parseInt(driverInfo.IDType) : 0,
                        IDNumber: isDriver ? driverInfo.IDNumber : "",
                        PassengerPhone: isDriver ? driverInfo.ContactPhone : "", // (pInfo ? pInfo.mobile : "")
                        EmployeeID: pInfo ? pInfo.employeeid : "",
                        CorpUserID: pInfo ? pInfo.uid : (o.attr('uid') ? o.attr('uid') : "")
                    });
                }
            });
            return arr;
        },
        validateAllPsger: function () {
            var iptList = $('#PsgerInputList div.m-passenger').find('input.inp'), errorIndex = 0;
            iptList.each(function (o, i) {
                //o.trigger('blur');
                BookingValidate.ValidateName(o);
                o.hasClass('input_error') && errorIndex++;
            });
            if (errorIndex > 0) {
                window.scrollTo(0, $('#PsgerInputList').offset().top);
                return false;
            } else {
                return true;
            }
        }
    };
    //乘车人 E
    //预定页警示
    var WNC = {
        show: function (inputO, divO, msg, cfg) {
            inputO && inputO.addClass('input_error');
            divO && divO.css('display', '');

        },
        hide: function (inputO, divO, cfg) {
            inputO && inputO.removeClass('input_error');
            divO && divO.css('display', 'none');

        }
    }
    //驾驶员
    var Driver = {
        init: function () {
            //清空
            $('#DriverDiv').find('input').value("");
            //
            Driver.bindEv();
        },
        setDriverSelect: function () {
            var psgList = Passenger.getPsger(), dnOptions = document.getElementById('DriverName').options,
                dn = $('#DriverName');
            //
            var _lastVal = dn.data('info'), _need0 = true; //是否需要选中第一个
            //
            dn.html('');
            if (psgList.length > 0) {
                for (var i = 0; i < psgList.length; i++) {
                    var opt = document.createElement('option'), _ = psgList[i];
                    opt.text = _.name; opt.value = _.name;
                    $(opt).data('info', _); dnOptions.add(opt);
                    //之前有选中项，选中之前选中项
                    if (_lastVal && _lastVal.uid == _.uid) {
                        opt.selected = true; dn.data('info', _); _need0 = false;
                        //Driver.setDriverVal(_); 
                    }
                }
                //使用第0项
                _need0 && (dnOptions[0].selected = true) && dn.data('info', $(dnOptions[0]).data('info')) && Driver.setDriverVal($(dnOptions[0]).data('info'));
            } else {
                dn.html('<option>' + label.PleaseChoose + '</option>'); dn.data('info', null); Driver.setDriverVal(dn.data('info')); //请选择
            }
            //触发校验
            $('#DriverCardNO,#DriverMobile,#DriverEmail').trigger('blur');
        },
        setDriverVal: function (selInfo) {
            var dn = $('#DriverName'), dc = $('#DriverCard'), dcno = $('#DriverCardNO'), dm = $('#DriverMobile'), de = $('#DriverEmail');
            //
            if (!(selInfo && selInfo.userDetailInfo)) {
                dcno.value(""); dm.value(""); de.value("");
            } else {
                var cardTypeList = selInfo.userDetailInfo.cardType ? selInfo.userDetailInfo.cardType.split('|') : [],
                    cardIDList = selInfo.userDetailInfo.cardID ? selInfo.userDetailInfo.cardID.split('|') : [];
                for (var i = 0; i < cardTypeList.length; i++) {
                    if (cardTypeList[i] == dc.value()) {
                        dcno.value(cardIDList[i]); break;
                    } else { dcno.value(""); }
                }
                //tel-email
                selInfo.userDetailInfo && (dm.value(selInfo.userDetailInfo.mobile), de.value(selInfo.userDetailInfo.email));
            }
        },
        bindEv: function () {
            var dn = $('#DriverName'), dc = $('#DriverCard'), dcno = $('#DriverCardNO'), dm = $('#DriverMobile'), de = $('#DriverEmail');
            //
            var refreshBlur = function () {
                dcno.trigger('blur'); dm.trigger('blur'); de.trigger('blur');
            }
            dn.bind('change', function (e) {
                var selInfo = $(this.options[this.options.selectedIndex]).data('info');
                dn.data('info', selInfo);
                Driver.setDriverVal(selInfo); refreshBlur();
            });
            dc.bind('change', function (e) {
                var selInfo = dn.data('info');
                Driver.setDriverVal(selInfo); refreshBlur();
            });
            dcno.bind('blur', function (e) {
                BookingValidate.ValidateCard(dcno, dc.value());
            });
            dm.bind('blur', function (e) {
                BookingValidate.ValidateMobile(dm);
            });
            de.bind('blur', function (e) {
                BookingValidate.ValidateEmail(de);
            });
        },
        clearDriverSelect: function () {
            dNameObj.html('<option>' + label.PleaseChoose + '</option>'); //请选择
        },
        getDriverInfo: function () {
            var detailInfo = IsEmpty($('#DriverName').data('info')) ? "" : $('#DriverName').data('info').userDetailInfo;
            return {
                DriverName: $('#DriverName').value(),
                IDType: parseInt($('#DriverCard').value()),
                IDNumber: $('#DriverCardNO').value(),
                ContactPhone: $('#DriverMobile').value(),
                ContactEmail: $('#DriverEmail').value(),
                InfoID: IsEmpty(detailInfo) ? "" : detailInfo.infoID,
                UID: IsEmpty(detailInfo) ? "" : detailInfo.uid
            }
        },
        validateDriverInfo: function () {
            var errorIndex = 0;
            $('#DriverDiv').find('input.inp').each(function (o, i) {
                o.trigger('blur'); o.hasClass('input_error') && errorIndex++;
            });
            if (errorIndex > 0) {
                window.scrollTo(0, $('#DriverDiv').offset().top);
                return false;
            } else {
                return true;
            }
        }
    };
    //
    var Price = {
        TotalPrice: 0,
        init: function () {
            var initP = Price.initPriceData(PageInfo.ProductDetail);
            $('#sidePrice').html($.tmpl.render($('#PriceTmpl').html(), initP));
            Price.TotalPrice = initP.TotalAmount;
        },
        initPriceData: function (data) {
            var addFeeList = data.AdditionalList, inFeeList = [], outFeeList = data.ExFeeList;
            for (var i = 0; i < addFeeList.length; i++) {
                if (addFeeList[i].IsFixed) {
                    inFeeList.push(addFeeList[i])
                }
            }
            return {
                BasicAmount: data.BasicAmount,
                TotalAmount: data.TotalAmount,
                InFeeList: inFeeList,
                OutFeeList: outFeeList
            };
        },
        addPartPrice: function (name, mk, price) {
            var sideList = $('#sidePrice .side-total-list');
            if (sideList.find('[mk="' + mk + '"]').length == 0) {
                var liObj = $(document.createElement('li'));
                liObj.addClass('item').attr('mk', mk).html('<span class="name">' + name + '</span><span class="price"><em>&yen;</em>' + price + '</span>');
                Price.TotalPrice += price; sideList.append(liObj);
                Price.refreshTotalPrice();
            }
        },
        removePartPrice: function (mk, price) {
            var sideList = $('#sidePrice .side-total-list');
            if (sideList.find('[mk="' + mk + '"]').length > 0) {
                Price.TotalPrice -= price;
                sideList.find('[mk="' + mk + '"]').remove();
                Price.refreshTotalPrice();
            }
        },
        refreshTotalPrice: function () {
            $('#totalPrice').html('<em>&yen;</em>' + Price.TotalPrice + '</span>');
        },
        getPriceInfo: function () {
            return {
                ServiceFee: PageInfo.ProductDetail.ServiceFee,
                TotalAmount: Price.TotalPrice
            }
        }
    };
    //支付方式
    var PaymentMethod = {
        init: function () {
            $('#PaymentDiv').find('input')[0] && ($('#PaymentDiv').find('input')[0].checked = true);
            PaymentMethod.bindEv();
            //
            var checkObj = $('#PaymentDiv').find('input:checked');
            (checkObj.length > 0) && PaymentMethod.paymentStatus(checkObj.attr("dval"));
        },
        getPaymentInfo: function () {
            var checkObj = $('#PaymentDiv').find('input:checked');
            return {
                PaymentType: checkObj.value(),
                ExchangeRate: 1,
                Currency: 'CNY'
            };
        },
        bindEv: function () {
            $('#PaymentDiv').find('.base-check input').bind('click', function (e) {
                PaymentMethod.paymentStatus($(this).attr('dval'));
                /*
                //商旅服务费，因公
                if ("C" == PageInfo.ModelInfo.PostParam.feeType && $(this).attr('dval') != "2") {
                Price.addPartPrice(label.TravelServiceFee, "bs_charge", PageInfo.ProductDetail.ServiceFee); //商旅服务费
                } else {
                Price.removePartPrice("bs_charge", PageInfo.ProductDetail.ServiceFee);
                }
                //因公，信用卡无需授权
                if ("C" == PageInfo.ModelInfo.PostParam.feeType) {
                $('#WarrantBox').css('display', ($(this).attr('dval') != "0") ? "none" : "");
                ($(this).attr('dval') == "0" && PageInfo.ModelInfo.CouldShowPrompt) ? PageFoot.showFootWarrant() : PageFoot.hideFootWarrant();
                }
                */
            });
        },
        paymentStatus: function (d) {
            //0:公司账户支付 1:信用卡支付 2:门店现付
            $('#InvoiceBox').css('display', (d == "1") ? '' : 'none'); $('#AccountInvoiceNotice').css('display', (d == '0') ? '' : 'none'); //Invoice.refreshInvoicePrice();
            //!(!PageInfo.ProductDetail.ServiceFee && typeof PageInfo.ProductDetail.ServiceFee != "undefined" && PageInfo.ProductDetail.ServiceFee != 0)
            //提交按钮话术
            $('#CreateOrder').value((d == "1") ? label.PayOrderText : label.SubmitOrderText);
            //
            if (PageInfo.ProductDetail.ServiceFee != null) {
                ("C" == PageInfo.ModelInfo.PostParam.feeType && d != "2") ? Price.addPartPrice(label.TravelServiceFee, "bs_charge", PageInfo.ProductDetail.ServiceFee) : Price.removePartPrice("bs_charge", PageInfo.ProductDetail.ServiceFee); //商旅服务费
            }
            if ("C" == PageInfo.ModelInfo.PostParam.feeType) {
                $('#WarrantBox').css('display', (d != "0") ? "none" : "");
                (d == "0" && PageInfo.ModelInfo.CouldShowPrompt) ? PageFoot.showFootWarrant() : PageFoot.hideFootWarrant();
            }
            //取消话术
            d == "2" ? PageFoot.hideFootCancel() : PageFoot.showFootCancel();
        }
    }
    //更改还车门店
    var ChangeStore = {
        StoreInfo: null,
        init: function () {
            $(document).bind('click', function () {
                ChangeStore.hideLayer();
            });
            //
            $('#changeStore').bind('click', function (e) {
                if (ChangeStore.StoreInfo) {
                    ChangeStore.showLayer();
                } else {
                    var rUrl = AjaxUrl.ChangeVendorUrl + "?cityId=" + PageInfo.ModelInfo.PostParam.rCityId + "&vendorId=" + PageInfo.ModelInfo.PostParam.vendorId;
                    $.ajax(rUrl, {
                        method: 'GET',
                        onsuccess: function (r) {
                            ChangeStore.StoreInfo = $.parseJSON(r.responseText);
                            ChangeStore.drawLayer(ChangeStore.StoreInfo);
                        }
                    });
                }
                e.stop();
            });
            //
            $('#changeVendorLayer').bind('click', function (e) {
                var obj = e.target;
                if ("A" == obj.nodeName) {
                    if ($(obj).attr('mk') == "title") {
                        //title 切换tab
                        if (!$(obj).hasClass('tab-active')) {
                            $('#vendorLayerTitle a').removeClass('tab-active'); $(obj).addClass('tab-active');
                            $('#vendorLayerContent .stblock').removeClass("tab-active");
                            $('#vendorLayerContent').find('[data-tab="' + $(obj).attr('data-tab-target') + '"]').addClass("tab-active");
                        }
                    } else if ($(obj).attr('mk') == "content") {
                        ChangeStore.changeEv(ChangeStore.fixDetailInfo($(obj).attr('dval')));
                    }
                }
                e.stop();
            });
            $('#changeVendorLayer').bind('mouseover', function (e) {
                var obj = e.target, vladdr = $('#vendorLayerAddr'), vltime = $('#vendorLayerTime'), vltel = $('#vendorLayerTel');
                if ("A" == obj.nodeName && $(obj).attr('mk') == "content") {
                    var p = ChangeStore.fixDetailInfo($(obj).attr('dval'));
                    vladdr.html("地址: " + p.Address); vltime.html(p.OpenHours); vltel.html(p.ContactInfo);
                }
                e.stop();
            });
            //地图
            MOD.GD_Map = new UIControl.MapControl.InitMapParam({
                baseObj: '#mapDiv',
                initData: {
                    start: {
                        cityName: PageInfo.ModelInfo.PostParam.pCityName
                    }
                },
                emptySource: AjaxUrl.AreaEmptySource
            });
            //绘制取车门店和还车门店
            $('#storeStartMap').bind('click', function () {
                var _p = PageInfo.ModelInfo;
                if (MOD.GD_Map) {
                    //cityName,storeAddress,storeLon,storeLat,storeName,AreaAddress,AreaLon,AreaLat
                    MOD.GD_Map.initMap([_p.PostParam.pCityName, _p.StartAddressDes, _p.StartLongitude, _p.StartLatitude, _p.StartAddress, "", "", ""].join(","));
                } else { console.log('Map Control Init Error!'); }
            });
            $('#storeEndMap').bind('click', function () {
                var _p = PageInfo.ModelInfo;
                if (MOD.GD_Map) {
                    MOD.GD_Map.initMap([_p.PostParam.rCityName, _p.EndAddressDes, _p.EndLongitude, _p.EndLatitude, _p.EndAddress, "", "", ""].join(","));
                } else { console.log('Map Control Init Error!'); }
            });
        },
        changeEv: function (data) {
            var postParam = PageInfo.ModelInfo.PostParam, pp = {}, co = $('#CreateOrder'), sp = $('#sidePrice');
            if (postParam) {
                for (var i in postParam) { pp[i] = postParam[i] ? postParam[i] : ""; }
                pp.rsid = data.StoreID;
                pp.rscode = data.StoreCode;
                pp.rstype = data.StoreType;
            }
            //store Info change
            if (data) {
                $('#changeStore').parentNode().find('p').html(data.Address); $('#storeEndAddrDes').html(data.AddressDes);
                $('#storeEndTel').html(data.ContactInfo); $('#storeEndOpenHours').html(data.OpenHours);
                $('#storeEndMap').attr('dVal', data.Latitude + '|' + data.Longitude);
                PageInfo.ModelInfo.DropoffStoreID = data.StoreID;
                PageInfo.ModelInfo.DropoffStore = data.StoreCode;
                PageInfo.ModelInfo.DropoffStoreType = data.StoreType;
                PageInfo.ModelInfo.EndAddress = data.Address;
                PageInfo.ModelInfo.EndAddressDes = data.AddressDes;
                PageInfo.ModelInfo.EndContactInfo = data.ContactInfo;
                PageInfo.ModelInfo.EndLatitude = data.Latitude;
                PageInfo.ModelInfo.EndLongitude = data.Longitude;
                PageInfo.ModelInfo.EndOpenHours = data.OpenHours;
            }
            //Ajax For data
            !co.hasClass('disable') && (co.addClass('disable'));
            sp.html($('#LoadingTmpl').html());
            if (postParam) {
                for (var i in postParam) { pp[i] = postParam[i] ? postParam[i] : ""; }
                pp.rsid = data.StoreID;
                pp.rscode = data.StoreCode;
                pp.rstype = data.StoreType;
            }
            //Ajax For data
            !co.hasClass('disable') && (co.addClass('disable'));
            sp.html($('#LoadingTmpl').html());
            $.ajax(AjaxUrl.VendorInfoUrl, {
                method: "POST",
                context: pp,
                onsuccess: function (r) {
                    PageInfo.ProductDetail = $.parseJSON(r.responseText);
                    $("#AuthorizePrompt").text(PageInfo.ProductDetail.AuthorizePrompt);
                    $("#LastCancelTime").text(PageInfo.ProductDetail.LastCancelTime);
                    Price.init(); PaymentMethod.init();
                    document.getElementById('checkNotice') && (document.getElementById('checkNotice').checked = true) && co.removeClass('disable');
                },
                onerror: function () {
                    alert('Ajax Error!');
                }
            });
            ChangeStore.hideLayer();
        },
        fixDetailInfo: function (data) {
            var arr = data ? data.split('|') : "", T = arr.length > 9;
            return {
                Address: T ? arr[0] : "",
                AddressDes: T ? arr[1] : "",
                Area: T ? arr[2] : "",
                ContactInfo: T ? arr[3] : "",
                Latitude: T ? arr[4] : "",
                Longitude: T ? arr[5] : "",
                OpenHours: T ? arr[6] : "",
                StoreCode: T ? arr[7] : "",
                StoreName: T ? arr[8] : "",
                StoreType: T ? arr[9] : "",
                StoreID: T ? arr[10] : ""
            }
        },
        fixData: function (data) {
            return {
                StoreList: data,
                StoreInfo: {
                    EndAddress: PageInfo.ModelInfo ? PageInfo.ModelInfo.EndAddress : "",
                    EndContactInfo: PageInfo.ModelInfo ? PageInfo.ModelInfo.EndContactInfo : "",
                    EndOpenHours: PageInfo.ModelInfo ? PageInfo.ModelInfo.EndOpenHours : ""
                }
            }
        },
        drawLayer: function (data) {
            var d = ChangeStore.fixData(data);
            if (d) {
                $('#changeVendorLayer').html($.tmpl.render($('#VendorLayerTmpl').html(), d));
                ChangeStore.showLayer();
            }
        },
        showLayer: function () {
            var cs = $('#changeStore'), cvl = $('#changeVendorLayer');
            var leftFix = cs.offset().left;
            if (cs.offset().left + cvl.offset().width > document.body.clientWidth) {
                leftFix -= (cs.offset().left + cvl.offset().width - document.body.clientWidth + 20);
            }
            $('#changeVendorLayer').css({
                'visibility': 'visible',
                'top': cs.offset().bottom + 'px',
                'left': leftFix + 'px'
            });
        },
        hideLayer: function () {
            $('#changeVendorLayer').css({ 'visibility': 'hidden' });
        }
    }

    //发票信息
    var Invoice = {
        InvoiceInfo: null,
        InvoicePrice: {
            "1": {
                name: label.InvoiceFee, //发票配送费
                key: "invoice_10_charge",
                value: 10
            }
        },
        init: function () {
            //清空
            document.getElementById('invoiceChs') && (document.getElementById('invoiceChs').checked = false);
            $('#InvoiceBox').find('input[type="text"],input[type="hidden"]').value("");
            //
            Invoice.bindEv();
            Invoice.initPCD();
        },
        splitData: function (d) {
            for (var i = 0; i < d.length; i++) {
                if (isNaN(d.charAt(i)))
                    break;
            }
            return [d.substring(0, i), d.substring(i)];
        },
        drawInvoice: function () {
            var IRL = $('#InvoiceRevLayer');
            $('#PointsFor').css('display', Invoice.InvoiceInfo.IsShowIntegralExchange ? "" : "none");
            //每个页面显示5条数据
            IRL.data('list', Invoice.InvoiceInfo.UserAddressList);
            if (Invoice.InvoiceInfo && Invoice.InvoiceInfo.UserAddressList) {
                (Invoice.InvoiceInfo.UserAddressList.length < 6) ? Invoice.drawInvoiceRec(0, 5) : CMFun.Paging.draw(Invoice.drawInvoiceRec, Invoice.InvoiceInfo.UserAddressList, 5, IRL.find('.page'));
            }
            //绘制发票抬头
            Invoice.InvoiceInfo && Invoice.drawInvoiceTitle(Invoice.InvoiceInfo.UserInvoiceList);
        },
        drawInvoiceTitle: function (data) {
            var ITL = $('#InvoiceTitleLayer'), ulObj = $(document.createElement('ul'));
            ulObj.addClass("droplist-content");
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var liObj = $(document.createElement('li'));
                    liObj.html('<a href="javascript:;" title="' + data[i].InvoiceTitle + '">' + data[i].InvoiceTitle + '</a>');
                    liObj.data('val', data[i]);
                    liObj.bind('click', Invoice.invoiceTitleClick);
                    ulObj.append(liObj.get(0));
                }
            }
            ITL.html("").append(ulObj.get(0));
        },
        invoiceTitleClick: function (e) {
            var it = $('#InvoiceTitle'), hit = $('#hidInvoiceTitle');
            it.value($(this).data('val') ? $(this).data('val').InvoiceTitle : "");
            hit.value($(this).data('val') ? $(this).data('val').InvoiceId : "0");
            //
            it.trigger('blur');
            $('.StarPop').css('display', 'none'); e.stop();
        },
        drawInvoiceRec: function (start, count) {
            var IRL = $('#InvoiceRevLayer'), IRList = IRL.find('.consignee-list');
            //去除后绑定
            IRList.find('a').unbind('click', Invoice.invoiceRecClick).remove();
            var list = IRL.data('list');
            for (var i = start; i < (list.length < start + count ? list.length : start + count); i++) {
                var a = $(document.createElement('a')); a.attr('href', 'javascript: void(0);'), arr = [];
                arr.push('<span class="consignee-w1">' + list[i].ReceiveName + '</span>');
                arr.push('<span class="consignee-w2">' + list[i].ReceiveTel + '</span>');
                arr.push('<span class="consignee-w3">' + [list[i].ProvinceName, list[i].CityName, list[i].DistrictName, list[i].Address].join(" ") + '</span>');
                arr.push('<span class="consignee-w4">' + list[i].PostCode + '</span>');
                a.html(arr.join("")); a.data('val', list[i]);
                a.bind('click', Invoice.invoiceRecClick);
                IRList.append(a.get(0));
            }
        },
        invoiceRecClick: function (e) {
            var iun = $('#InvoiceUserName'), iup = $('#InvoiceUserPhone'), sp = $('#SendProvince'), hsp = $('#hidSendProvince'),
                sc = $('#SendCity'), hsc = $('#hidSendCity'), sd = $('#SendDistrict'), hsd = $('#hidSendDistrict'),
                sa = $('#SendAddress'), sz = $('#SendZip');
            //
            var d = $(this).data('val');
            if (d) {
                iun.value(d.ReceiveName || ""); iup.value(d.ReceiveTel || ""); sp.value(d.ProvinceName || "");
                hsp.value(d.Province); sc.value(d.CityName); hsc.value(d.City); sd.value(d.DistrictName); hsd.value(d.District);
                sa.value(d.Address); sz.value(d.PostCode); $('#hidInvoiceInfo').value(d.UserAddressId);
                //trigger
                iun.trigger('blur');
            }
            //
            $('.StarPop').css('display', 'none'); e.stop();
        },
        getInvoiceInfo: function () {
            //
            var needInvoice = false, invoiceInfo = null;
            if ($('#InvoiceBox').css('display') != "none" && document.getElementById('invoiceChs').checked) {
                needInvoice = true;
                invoiceInfo = {
                    InvoiceFeeType: 0, //$('#InvoiceDis').find('input:checked').attr('dval')
                    Title: $('#InvoiceTitle').value(),
                    InvoiceDetail: $('#InvoiceDetail').html(),
                    ReceiveName: $('#InvoiceUserName').value(),
                    ReceiveTel: $('#InvoiceUserPhone').value(),
                    ProvinceName: $('#SendProvince').value(),
                    CityName: $('#SendCity').value(),
                    DistrictName: $('#SendDistrict').value(),
                    Address: $('#SendAddress').value(),
                    PostCode: $('#SendZip').value(),
                    InvoiceId: $('#hidInvoiceTitle').value(),
                    UserAddressId: !IsEmpty($('#hidInvoiceInfo').value()) ? $('#hidInvoiceInfo').value() : 0,
                    Province: !IsEmpty($('#hidSendProvince').value()) ? $('#hidSendProvince').value() : 0,
                    City: !IsEmpty($('#hidSendCity').value()) ? $('#hidSendCity').value() : 0,
                    District: !IsEmpty($('#hidSendDistrict').value()) ? $('#hidSendDistrict').value() : 0
                }
            }
            return {
                needInvoice: needInvoice,
                invoiceInfo: invoiceInfo
            };
        },
        bindEv: function () {
            var iun = $('#InvoiceUserName'), irl = $('#InvoiceRevLayer'),
                it = $('#InvoiceTitle'), itl = $('#InvoiceTitleLayer');
            $('#invoiceChs').bind('click', function (e) {
                (!Invoice.InvoiceInfo) && Invoice.initInvoiceInfo();
                var ivd = $('#InvoiceDiv');
                this.checked ? (NAnimate ? ivd.css('display', '') : ivd.slideDown()) : (NAnimate ? ivd.css('display', 'none') : ivd.slideUp());
                //this.checked ? $('#InvoiceDiv').slideDown() : $('#InvoiceDiv').slideUp();
                //Invoice.refreshInvoicePrice();
            });
            //租车发票无配送方式
            /*
            $('#InvoiceDis').find('input').bind('change', function (e) {
            Invoice.refreshInvoicePrice();
            });
            */
            //
            iun.bind('click', function (e) {
                $('.StarPop').css('display', 'none');
                irl.css({
                    'display': '',
                    'top': iun.offset().bottom + 'px',
                    'left': iun.offset().left + 'px'
                });
                e.stop();
            });
            it.bind('click', function (e) {
                $('.StarPop').css('display', 'none');
                itl.css({
                    'display': '',
                    'top': it.offset().bottom + 'px',
                    'left': it.offset().left + 'px'
                });
                e.stop();
            }).bind('blur', function (e) {
                //抬头检查
                if (IsEmpty(it.value()) || it.value() == it.attr('placeholder')) {
                    it.addClass('input_error');
                    it.parentNode().find('.help_inline').css('display', '');
                } else {
                    it.removeClass('input_error');
                    it.parentNode().find('.help_inline').css('display', 'none');
                }
            });
            //
            var iList = $('#InvoiceUserName,#InvoiceUserPhone,#SendProvince,#SendCity,#SendDistrict,#SendAddress,#SendZip');
            iList.bind('blur', function (e) {
                var errCount = 0, rMobile = /^((\(\d{3}\))|(\d{3}\-))?1(3|4|5|7|8)\d{9}$/, rPost = /^[0-9]\d{5}(?!\d)$/;
                iList.each(function (o) {
                    if (IsEmpty(o.value()) || o.value() == o.attr('placeholder')) {
                        o.addClass('input_error'); errCount++;
                    } else if (o.attr('id') == 'InvoiceUserPhone') {
                        if (!rMobile.test(o.value().trim())) { o.addClass('input_error'); errCount++; } else { o.removeClass('input_error'); }
                    } else if (o.attr('id') == 'SendZip') {
                        if (!rPost.test(o.value().trim())) { o.addClass('input_error'); errCount++; } else { o.removeClass('input_error'); }
                    } else {
                        o.removeClass('input_error');
                    }
                });
                $('#invoiceInfoErr').css('display', errCount > 0 ? '' : 'none');
            });
        },
        initInvoiceInfo: function () {
            $.ajax(AjaxUrl.InvoiceInfoUrl, {
                onsuccess: function (e) {
                    Invoice.InvoiceInfo = $.parseJSON(e.responseText);
                    Invoice.drawInvoice();
                },
                onerror: function () {
                    Invoice.InvoiceInfo = null;
                }
            });
        },
        initPCD: function () {
            var sp = $('#SendProvince'), hsp = $('#hidSendProvince'), sc = $('#SendCity'), hsc = $('#hidSendCity'),
                sd = $('#SendDistrict'), hsd = $('#hidSendDistrict'), PL = $('#ProvinceLayer'), CL = $('#CityLayer'), DL = $('#DistrictLayer');
            $('#SendPCDDiv').bind('click', function (e) {
                ("text" == e.target.type) && Invoice.showPCD(e.target);
                e.stop();
            });
            Invoice.drawPCD($('#ProvinceLayer'), ProvinceAddress);
            //浮层值选择
            var iun = $('#InvoiceUserName');
            PL.bind('click', function (e) {
                var obj = e.target;
                if ("A" == obj.nodeName) {
                    if (hsp.value() != $(obj).attr('dVal')) {
                        sp.value($(obj).text()); sp.attr('aVal', $(obj).attr('aVal')); hsp.value($(obj).attr('dVal'));
                        //clear
                        sc.value(""); hsc.value(""); sd.value(""); hsd.value("");
                        Invoice.drawPCD(CL, ProvinceAddress[$(obj).attr('aVal')]);
                    }
                    iun.trigger('blur'); CL.trigger('click');
                }
            });
            CL.bind('click', function (e) {
                var obj = e.target;
                if ("A" == obj.nodeName) {
                    if (hsc.value() != $(obj).attr('dVal')) {
                        sc.value($(obj).text()); sc.attr('aVal', $(obj).attr('aVal')); hsc.value($(obj).attr('dVal'));
                        //clear
                        sd.value(""); hsd.value("");
                        Invoice.drawPCD(DL, ProvinceAddress[sp.attr('aVal')][$(obj).attr('aVal')]);
                    }
                    iun.trigger('blur'); DL.trigger('click');
                }
            });
            DL.bind('click', function (e) {
                var obj = e.target;
                if ("A" == obj.nodeName) {
                    if (hsd.value() != $(obj).attr('dVal')) {
                        sd.value($(obj).text()); sd.attr('aVal', $(obj).attr('aVal')); hsd.value($(obj).attr('dVal'));
                    }
                    iun.trigger('blur');
                }
            });
        },
        showPCD: function (tar) {
            var sp = $('#SendProvince'), hsp = $('#hidSendProvince'), sc = $('#SendCity'), hsc = $('#hidSendCity'),
                 sd = $('#SendDistrict'), hsd = $('#hidSendDistrict'), PL = $('#ProvinceLayer'), CL = $('#CityLayer'), DL = $('#DistrictLayer');
            $('#ProvinceLayer,#CityLayer,#DistrictLayer').css('display', 'none');
            switch (tar.id) {
                case "SendProvince":
                    PL.css({
                        'display': '',
                        'top': sp.offset().bottom + 'px',
                        'left': sp.offset().left + 'px'
                    });
                    break;
                case "SendCity":
                    if (hsp.value() == "") {
                        PL.trigger('click');
                    } else {
                        CL.css({
                            'display': '',
                            'top': sc.offset().bottom + 'px',
                            'left': sc.offset().left + 'px'
                        });
                    }
                    break;
                case "SendDistrict":
                    if (hsc.value() == "") {
                        CL.trigger('click');
                    } else {
                        DL.css({
                            'display': '',
                            'top': sd.offset().bottom + 'px',
                            'left': sd.offset().left + 'px'
                        });
                    }
                    break;
                default:
                    break;
            }
        },
        drawPCD: function (obj, data) {
            var newdata = [];
            for (var i in data) {
                var tmp = Invoice.splitData(i);
                (tmp.length > 1) && newdata.push({
                    all: i,
                    id: tmp[0],
                    name: tmp[1]
                });
            }
            obj.html($.tmpl.render($('#PCDTmpl').html(), newdata));
        },
        refreshInvoicePrice: function () {
            var dval = $('#InvoiceDis').find('input:checked').attr('dval'), res = Invoice.InvoicePrice["1"];
            if ($('#InvoiceBox').css('display') != "none" && document.getElementById('invoiceChs').checked) {
                if (dval == "1") {
                    Price.addPartPrice(res.name, res.key, res.value);
                } else {
                    Price.removePartPrice(res.key, res.value);
                }
            } else {
                Price.removePartPrice(res.key, res.value);
            }
        },
        validateInvoice: function () {
            var errorIndex = 0;
            if ($('#InvoiceBox').css('display') != "none" && document.getElementById('invoiceChs').checked) {
                var iList = $('#InvoiceTitle,#InvoiceUserName,#InvoiceUserPhone,#SendProvince,#SendCity,#SendDistrict,#SendAddress,#SendZip');
                iList.each(function (o, i) {
                    o.trigger('blur');
                    o.hasClass('input_error') && errorIndex++;
                });
            }
            if (errorIndex > 0) {
                window.scrollTo(0, $('#InvoiceBox').offset().top);
                return false;
            } else { return true; }
        }
    };
    //可享优惠信息
    var CouponCode = {
        init: function () {
            PageInfo.ProductDetail && CouponCode.drawList(PageInfo.ProductDetail.DiscountList);
        },
        drawList: function (data) {
            var ccd = $('#CouponCodeDiv');
            if (data && data.length > 0) {
                //喷入结构
                ccd.css('display', '');
                $('#CouponInfo').html($.tmpl.render($('#CouponInfoTmpl').html(), data));
            } else {
                ccd.css('display', 'none');
            }
        }
    };
    //附加服务
    var AddService = {
        Data: {},
        init: function () {
            PageInfo.ProductDetail && AddService.drawList(PageInfo.ProductDetail.AdditionalList);
        },
        drawList: function (data) {
            var asd = $('#addServDiv'), asl = $('#addServList'), list = [];
            if (data && data.length > 0) {
                //喷入结构
                asd.css('display', '');
                for (var i = 0; i < data.length; i++) {
                    data[i]._index = i;
                    if (!data[i].IsFixed) list.push(data[i]);
                    AddService.Data[i] = data[i];
                }
                (list.length > 0) ? asl.html($.tmpl.render($('#AdditionListTmpl').html(), list)) : asd.css('display', 'none');
                //Ev 
                asl.find('input[type="checkbox"]').bind('click', function () {
                    var data = AddService.Data[$(this).parentNode().attr('dVal')];
                    if (this.checked) {
                        Price.addPartPrice(data.ServiceName, "addcharge_" + data._index, data.UnitPrice);
                    } else {
                        Price.removePartPrice("addcharge_" + data._index, data.UnitPrice);
                    }
                });
            } else {
                asd.css('display', 'none');
            }
        },
        getAddServiceInfo: function () {
            var tmp = [];
            var AddTmp = function (o) {
                tmp.push({
                    ServiceID: o.ServiceID,
                    ServiceName: o.ServiceName,
                    ServiceDescription: o.ServiceDesc,
                    ServicePrice: o.UnitPrice,
                    ServiceUnit: o.Unit,
                    ServiceTotalPrice: o.UnitPrice,
                    ServiceType: o.ServiceType
                });
            };
            PageInfo.ProductDetail.AdditionalList && (PageInfo.ProductDetail.AdditionalList.each(function (o, i) {
                (o.IsFixed) && AddTmp(o);
            }));
            //
            $('#addServList').find('input:checked').each(function (o, i) {
                AddTmp(AddService.Data[o.parentNode().attr("dVal")]);
            });
            return tmp;
        }
    };
    //
    var SubmitService = {
        init: function () {
            var co = $('#CreateOrder');
            //
            co.bind('click', function () {
                //获取submit信息
                if (!co.hasClass('disable') && SubmitService.validateAll()) {
                    co.addClass('disable');
                    $.ajax(AjaxUrl.CreateOrderUrl, {
                        method: "POST",
                        context: SubmitService.getSubmitInfo(),
                        onsuccess: function (r) {
                            //
                            var d = $.parseJSON(r.responseText);
                            if (d && d.Result) {
                                CMFun && CMFun.submitForm({
                                    url: d.PostUrl,
                                    method: 'POST',
                                    data: d.PostForm
                                });
                            } else {
                                alert(d ? d.ErrorMessage : "Response Error!");
                            }
                            co.removeClass('disable');
                        },
                        onerror: function () {
                            alert('Ajax Error!');
                            co.removeClass('disable');
                        }
                    });
                }
            });
        },
        getProductInfo: function (data) {
            return {
                VendorId: data.PostParam.vendorId || "",
                VendorName: data.PostParam.vendorName || "",
                VendorLogo: data.PostParam.vendorLogo || "",
                Vehicleid: data.PostParam.vehicleid || "",
                VehicleName: data.PostParam.vehicleName || "",
                CarCapacity: data.PostParam.carCapacity || "",
                CarDescription: data.PostParam.carDescription || "",
                StartCityID: data.PostParam.pCityId || "",
                StartCityName: data.PostParam.pCityName || "",
                StartTime: data.PostParam.ptime || "",
                EndTime: data.PostParam.rtime || "",
                StartAddress: data.StartAddress || "",
                StartAddressDes: data.StartAddressDes || "",
                StartLatitude: data.StartLatitude || "",
                StartLongitude: data.StartLongitude || "",
                StartContactInfo: data.StartContactInfo || "",
                StartOpenHours: data.StartOpenHours || "",
                EndCityID: data.PostParam.rCityId || "",
                EndCityName: data.PostParam.rCityName || "",
                EndAddress: data.EndAddress || "",
                EndAddressDes: data.EndAddressDes || "",
                EndLatitude: data.EndLatitude || "",
                EndLongitude: data.EndLongitude || "",
                EndContactInfo: data.EndContactInfo || "",
                EndOpenHours: data.EndOpenHours || "",
                PickupStoreID: data.PickupStoreID || "",
                PickupStoreCode: data.PickupStoreCode || "",
                PickupStoreType: data.PickupStoreType || "",
                DropoffStoreID: data.DropoffStoreID || "",
                DropoffStore: data.DropoffStore || "",
                DropoffStoreType: data.DropoffStoreType || "",
                VendorCouponCode: data.PostParam.vendorCouponCode || ""
            };
        },
        getCostCenterWarnInfo: function () {
            var tmp = "", ccInfoJson = null, wInfoJson = null;
            if ("C" == PageInfo.ModelInfo.PostParam.feeType) {
                if (typeof getdata != "undefined") {
                    getdata(); //ccInfoJson = $.parseJSON($('#hdnCostCenterInfo').value());
                }
                //
                if (typeof Warrant != "undefined" && $('#WarrantBox').css('display') != "none") {
                    wInfoJson = Warrant.getWarDetailInfo();
                }
            }

            return {
                AuthorizeTimes: 1,
                CostCenter1: $('#hdnCostCenterInfo').value(),
                AuthPwd: wInfoJson ? encodeURIComponent(wInfoJson.PassWord) : "",
                ConfirmPerson1: $('[name="CorpInfo.ConfirmPerson"]').value(),
                RcCodeID: '',
                QuoteMode: PageInfo.ProductDetail.QuoteMode ? PageInfo.ProductDetail.QuoteMode : "",
                CostCenterRequire: PageInfo.ModelInfo.CostCenterRequire.toLocaleUpperCase()
            };
        },
        getSubmitInfo: function () {
            var productInfo = PageInfo.ModelInfo ? SubmitService.getProductInfo(PageInfo.ModelInfo) : "",
                costDetailList = AddService.getAddServiceInfo(),
                invoiceInfo = Invoice.getInvoiceInfo(),
                driverInfo = Driver.getDriverInfo(),
                priceInfo = Price.getPriceInfo(),
                paymentInfo = PaymentMethod.getPaymentInfo(),
                passengerList = Passenger.getPassengerInfo(),
                companyInfo = SubmitService.getCostCenterWarnInfo();

            return {
                FeeType: PageInfo.ModelInfo.PostParam.feeType,
                NeedInvoice: invoiceInfo.needInvoice,
                LastLosslessCancelTime: PageInfo.ProductDetail.LastCancelTime,
                LastConfirmPaymentTime: PageInfo.ProductDetail.LastConfirmTime,
                LastOrderSaveTime: PageInfo.ProductDetail.LastOrderSaveTime,
                ServiceFee: priceInfo.ServiceFee ? priceInfo.ServiceFee : 0,
                TotalAmount: priceInfo.TotalAmount,
                CompanyInfo: companyInfo,
                PassengerList: $.stringifyJSON(passengerList),
                PaymentInfo: $.stringifyJSON(paymentInfo),
                DriverInfo: $.stringifyJSON(driverInfo),
                ProductInfo: $.stringifyJSON(productInfo),
                CostDetailList: costDetailList ? $.stringifyJSON(costDetailList) : "",
                InvoiceInfo: invoiceInfo.invoiceInfo ? $.stringifyJSON(invoiceInfo.invoiceInfo) : ""
            };
        },
        validateAll: function () {
            var result = true;
            //乘车人校验
            if (!Passenger.validateAllPsger()) {
                return false;
            }
            //驾驶员校验
            if (!Driver.validateDriverInfo()) {
                return false;
            }
            //成本中心校验
            if ("C" == PageInfo.ModelInfo.PostParam.feeType && typeof checkdata != "undefined" && !checkdata()) {
                window.scrollTo(0, $('#CostCenterBox').offset().top);
                return false;
            }
            //授权检验
            if ("C" == PageInfo.ModelInfo.PostParam.feeType && $('#WarrantBox').css('display') != "none" && typeof Warrant != "undefined" && !Warrant.validateWarranInfo()) {
                window.scrollTo(0, $('#WarrantBox').offset().top);
                return false;
            }
            //发票信息校验
            if (!Invoice.validateInvoice()) {
                return false;
            }
            return true;
        }
    }
    //
    var PageFoot = {
        init: function () {
            PageFoot.noticeInit();
            //
            $("#AuthorizePrompt").html(PageInfo.ProductDetail.AuthorizePrompt);
            $("#LastCancelTime").html(PageInfo.ProductDetail.CancelPrompt);
        },
        noticeInit: function () {
            $('#notice').bind('click', function (e) {
                ($('#bookingTerm').length > 0) && $('#bookingTerm').mask();
            });
            $('#bookingTerm .xui-modal-close').bind('click', function (e) {
                $('#bookingTerm').unmask();
            });
            $('#checkNotice').bind('click', function (e) {
                var co = $('#CreateOrder');
                this.checked ? co.removeClass('disable') : co.addClass('disable');
            });
            //尾部notice
            PageFoot.initFootNotice();
        },
        initFootNotice: function () {
            var data = [];
            !IsEmpty(PageInfo.ProductDetail.FlowExplanations) && (data.push({
                key: label.FlowExplanations, //取还车说明
                value: PageInfo.ProductDetail.FlowExplanations
            }));
            !IsEmpty(PageInfo.ProductDetail.FeeNotices) && (data.push({
                key: label.FeeNotices, //费用违章须知
                value: PageInfo.ProductDetail.FeeNotices
            }));
            !IsEmpty(PageInfo.ProductDetail.InsuranceDescription) && (data.push({
                key: label.InsuranceDescription, //保险须知
                value: PageInfo.ProductDetail.InsuranceDescription
            }));
            !IsEmpty(PageInfo.ProductDetail.ChangeNotices) && (data.push({
                key: label.ChangeNotices, //更改或取消订单须知
                value: PageInfo.ProductDetail.ChangeNotices
            }));
            !IsEmpty(PageInfo.ProductDetail.LimiteNation) && (data.push({
                key: label.LimiteNation, //限行说明
                value: PageInfo.ProductDetail.LimiteNation
            }));
            $('#FootNoticeDiv').html($.tmpl.render($('#FootNoticeTmpl').html(), data));
            //
            $('#FoticeNoticeTitle>li').bind('click', function (e) {
                $('#FoticeNoticeTitle>li').removeClass('tab-active'); $('#FoticeNoticeContent>div').removeClass('tab-active');
                $(this).addClass('tab-active');
                $('#FoticeNoticeContent').find('[data-tab-panel="' + $(this).attr('data-tab-target') + '"]').addClass('tab-active');
            });
        },
        showFootWarrant: function () {
            $('#AuthorizePromptDiv').css('display', '');
        },
        hideFootWarrant: function () {
            $('#AuthorizePromptDiv').css('display', 'none');
        },
        hideFootCancel: function () {
            $('#LastCancelTimeDiv').css('display', 'none');
        },
        showFootCancel: function () {
            $('#LastCancelTimeDiv').css('display', '');
        }
    }
    //
    function PageInit() {
        Passenger.init(); Driver.init();
        Price.init(); AddService.init();
        CouponCode.init(); PaymentMethod.init(); Invoice.init();
        PageFoot.init(); ChangeStore.init();
        SubmitService.init();
        //placeholder
        !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('input[type="text"]'));
    }

    //OpenUI BackUp
    window.loadClientSuccess = function () {
        userList.render();
        var _LT = null;
        userList.onCheckCustomer = function (e, customerProperties) {
            //userList  *getByUid *getUserByUid
            //the first
            var eptObj = Passenger.getEmptyPsgObj();
            if (!(eptObj && eptObj.length > 0)) {
                if ($('#PsgerInputList').find('div.m-passenger').length < PageInfo.ModelInfo.PostParam.carCapacity) {
                    eptObj = Passenger.addInputPsger(customerProperties);
                } else {
                    var cfl = $('#CarFullLayer'), _offset = $(e.target.parentElement).offset();
                    cfl.html('<p>' + label.UpToXPeople.replace("{0}", PageInfo.ModelInfo.PostParam.carCapacity) + '</p><i class="icon"></i>').css({
                        'display': '',
                        'top': _offset.top - 25 + 'px',
                        'left': _offset.left - 25 + 'px'
                    });
                    userList.uncheck(customerProperties.uid);
                    //
                    window.clearTimeout(_LT);
                    _LT = window.setTimeout(function () { cfl.css('display', 'none'); }, 1500);
                    return;
                }
            }
            //
            Passenger.setInputPsgerVal(eptObj, customerProperties);
            Driver.setDriverSelect();
            //成本中心联动
            if (openuiCVal.Cost1NeedChange && typeof addCostCenter1 != "undefined") {
                addCostCenter1($.stringifyJSON({
                    UIDOrInfoID: customerProperties.uid,
                    IsEmpolyee: (customerProperties.isCorp == "T" ? 'Y' : 'N'),
                    Name: escape(customerProperties.name),
                    PolicyID: PageInfo.ModelInfo.PolicyID,
                    BookType: 'car'
                }));
            }
        };
        userList.onUnCheckCustomer = function (e, customerProperties) {
            var cusObj = $('#PsgerInputList').find('div.m-passenger[uid="' + customerProperties.uid + '"]')
            if (cusObj.attr('fid') == 'first') {
                //清空1号
                cusObj.attr('uid', 'stranger_uid_0'); Passenger.clearAttrPsger(cusObj);
                cusObj.find('input.inp').value(""); cusObj.find('input[st="hidName"]').value("");
                cusObj.find('input.inp').trigger('blur');
            } else {
                cusObj.remove();
            }
            Passenger.refreshIndexPsg();
            //
            Driver.setDriverSelect();
            //成本中心联动
            if (openuiCVal.Cost1NeedChange && typeof removeCostCenter1 != "undefined") {
                removeCostCenter1($.stringifyJSON({
                    UIDOrInfoID: customerProperties.uid,
                    IsEmpolyee: (customerProperties.isCorp == "T" ? 'Y' : 'N'),
                    Name: escape(customerProperties.name),
                    PolicyID: PageInfo.ModelInfo.PolicyID
                }));
            }
        };
    }
    window.loadCostCenterSuccess = function () {
        var ccb = $('#CostCenterBox');
        if ($('#CostCenterDiv').contains('#baseloop')) {
            NAnimate ? ccb.css('display', '') : ccb.slideDown(); openuiCVal.IsCostCenterExist = true;
        } else {
            NAnimate ? ccb.css('display', 'none') : ccb.slideUp(); openuiCVal.IsCostCenterExist = false;
        }
    }
    window.loadAuthSuccess = function (data, status, xmlHttp) {
        var wb = $('#WarrantBox');
        if (data && data.length > 10) {
            NAnimate ? wb.css('display', '') : wb.slideDown(); openuiCVal.IsAuthExist = true;
            //
            var checkObj = $('#PaymentDiv').find('input:checked');
            (checkObj.length > 0) && PaymentMethod.paymentStatus(checkObj.attr("dval"));
        } else {
            NAnimate ? wb.css('display', 'none') : wb.slideUp(); openuiCVal.IsAuthExist = false;
        }
    }
    var OpenUI = {
        init: function () {
            OpenUI.loadClient(); OpenUI.loadCostCenter(); OpenUI.loadAuth();
        },
        loadClient: function () {
            Q.J(cfg.OpenUIUrl.clientUrl, 'PassengerList', null, { OnSuccess: 'loadClientSuccess' });
        },
        loadCostCenter: function () {
            // 因私没有成本中心
            if ("C" == PageInfo.ModelInfo.PostParam.feeType) {
                Q.J(cfg.OpenUIUrl.costCenterUrl, 'CostCenterDiv', null, { OnSuccess: 'loadCostCenterSuccess' });
            }
        },
        loadAuth: function () {
            if ("C" == PageInfo.ModelInfo.PostParam.feeType) {
                Q.J(cfg.OpenUIUrl.authUrl, 'WarrantDiv', null, { OnSuccess: 'loadAuthSuccess' });
            }
        }
    }

    $.ready(function () {
        $(document).bind('click', function () {
            $('.StarPop').css('display', 'none');
        });
        //
        $('#historyBack').bind('click', function (e) {
            CloseWindow();
        });
        //load sidebar
        UIControl && UIControl.SideBarControl.LoadSideBar();
        //ready Fun
        OpenUI.init(); PageInit();
    });

})(cQuery);
