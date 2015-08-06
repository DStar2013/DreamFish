(function ($) {
    //
    var AjaxUrl = {
        ATPCheckProductUrl: 'ProductATPCheck',
        CreateOrderUrl: 'CreateOrder',
        InvoiceInfoUrl: '../Ajax/GetBookingInvoiceInformation',
        ValidatMyFltUrl: "CheckFlightNumberAirport"
    }
    var ProductInfo = {};
    //
    var openuiCVal = {
        Cost1NeedChange: "C" == PageInfo.ModelInfo.PostParam.FeeType.toLocaleUpperCase() && "P" == PageInfo.ModelInfo.CostCenterRequire.toLocaleUpperCase(),
        IsAuthExist: false,
        IsCostCenterExist: false
    }
    var NAnimate = $.browser.isIE6 || $.browser.isIE7 || $.browser.isIE8;

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
            //$.browser.isIE 在ie11下判断有问题
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
                message = label.InputCorrectPhoneNumber; result = false; //请填写正确电话号码格式
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
    // 
    var MyFltNO = {
        VAOBJ: null,
        MyFltInfo: {},
        ValiResult: true,
        init: function () {
            var pp = PageInfo.ModelInfo.PostParam;
            if (pp.SearchType == "jnt" && IsEmpty(pp.FlightNumber)) {
                MyFltNO.initFltNO();
            } else if (pp.SearchType == "jhc") { MyFltNO.initTrainNO(); }
        },
        initTrainNO: function () {
            $('#myTrainNOInput').value("");
            NAnimate ? $('#myTrainNODiv').css('display', '') : $('#myTrainNODiv').slideDown();
        },
        initFltNO: function () {
            NAnimate ? $('#myFltNODiv').css('display', '') : $('#myFltNODiv').slideDown();
            var fno = $('#fltNOInput'), mflt = $('#myFltSpan');
            //清空值处理
            fno.value("");
            //
            var fltNOMod = fno.regMod('address', '1.0', {
                name: '#fltNOInput',
                isAutoCorrect: false,
                delay: 200,
                jsonpSource: "/Car/Scripts/data/jsonpResponse.js",
                jsonpFilter: "/car/Ajax/FuzzyFlight?key=${key}",
                sort: ['^0$', '^1$', '0+'],
                jsonpFilterInit: function (o) {
                    if (!o) return;
                    var list = o.data.split('@');
                    o.data = { list: list, split: function () { return list } };
                    return o;
                },
                template: {
                    suggestion: "",
                    filter: $('#MyFltTmpl').html(),
                    filterPageSize: 7,
                    filterInit: function (e) {
                        fno.attr('data-val', "");
                    },
                    suggestionInit: function (a) {
                    }
                },
                message: {
                }
            });
            fltNOMod.method('bind', 'userinput', function (a, b, c, d) {
                //if (b.eventType && !fno.attr('data-val')) { }
                MyFltNO.validatFltNO(fno.value());
            });
            fltNOMod.method('bind', 'change', function (a, b) {
                fno.value(b.data); fno.attr('data-val', b.data);
                MyFltNO.validatFltNO(fno.value());
                this.blur();
            });
            //我的航班
            mflt.bind('click', function () {
                $('#baseMask').mask();
                $.ajax("/car/Ajax/GetMyFlight?type=jnt", {
                    method: 'GET',
                    onsuccess: function (ret) {
                        $('#baseMask').unmask();
                        MyFltNO.MyFltInfo = $.parseJSON(ret.responseText);
                        var mfd = $('#MyFltDetail');
                        mfd.html($.tmpl.render($('#MyFltInfoTmpl').html(), MyFltNO.MyFltInfo)).mask();
                        //Ev Click
                        mfd.find('.tck-close').bind('click', function () { mfd.unmask(); });
                        mfd.find('.mf-tbd>li').bind('click', function (e) {
                            var d = MyFltNO.MyFltInfo[$(this).attr('index')];
                            fno.value(d.FlightNumber); fno.attr('data-val', d.FlightNumber);
                            MyFltNO.validatFltNO(d.FlightNumber);
                            mfd.unmask();
                        });
                    },
                    onerror: function () {
                        $('#baseMask').unmask();
                    }
                })
            });
        },
        validatFltNO: function (fltno) {
            var pp = PageInfo.ModelInfo.PostParam,
                _URL = AjaxUrl.ValidatMyFltUrl + "?flightNumber=" + fltno + "&locationCode=" + pp.LocationCode + "&locationName=" + escape(pp.LocationName) + "&date=" + pp.UseTime.split(" ")[0];
            MyFltNO.VAOBJ && (MyFltNO.VAOBJ.abort());
            //
            var fi = $('#fltNOInput'), fiErr = $('#myFltNODiv').find('div.help_inline');
            var _vali = function (mark, msg) {
                if (mark) {
                    fi.removeClass("input_error");
                    fiErr.css('display', 'none');
                    MyFltNO.ValiResult = true;
                } else {
                    fi.addClass("input_error");
                    fiErr.html('<i class="ico tip_arrow_left"></i><span class="ico ico_warn"></span> ' + msg).css('display', '');
                    MyFltNO.ValiResult = false;
                }
            }
            //
            if (!IsEmpty(fltno)) {
                MyFltNO.VAOBJ = $.ajax(_URL, {
                    method: 'GET',
                    onsuccess: function (ret) {
                        var d = $.parseJSON(ret.responseText);
                        if (!d.IsFlightNumberAirportMatch) {
                            _vali(false, label.FlightNotStopAirport); //航班不经停您所选择的接机机场，请更正航班号
                        } else if (!d.IsProvideService) {
                            _vali(false, label.FlightNotProvidePickupService); //航班不提供接机服务，请更正航班号
                        } else {
                            _vali(true);
                        }
                    },
                    onerror: function () {
                        console.log("myflt validate error!");
                    }
                });
            } else {
                _vali(true);
            }
        }
    }
    //
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
                ipt.remove(); Passenger.refreshIndexPsg();
            });
            ipt.find('input.inp').bind('blur', function (e) {
                Passenger.psgInputBlurEv($(this), ipt);
            });
            $('#PsgerInputList').append(ipt);
            //
            !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add(ipt.find('input[type="text"]'));
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
                if (openuiCVal.Cost1NeedChange && typeof addCostCenter1 != "undefined" && !IsEmpty(o.value().trim()) && o.value() != o.attr('placeholder')) {
                    addCostCenter1($.stringifyJSON({
                        UIDOrInfoID: op.attr('uid'),
                        IsEmpolyee: 'N',
                        Name: escape(o.value().trim()),
                        PolicyID: PageInfo.ModelInfo.PolicyID,
                        BookType: 'car'
                    }));
                }
            }
            //
            BookingValidate.ValidateName(o);
        },
        refreshIndexPsg: function () {
            $('#addPassenger').css('display', $('#PsgerInputList').find('div.m-passenger').length < ProductInfo.VehicleGroup.SeatCount ? '' : 'none');
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
        validateAllPsger: function () {
            var iptList = $('#PsgerInputList div.m-passenger').find('input.inp'), errorIndex = 0;
            iptList.each(function (o, i) {
                o.trigger('blur');
                o.hasClass('input_error') && errorIndex++;
            });
            if (errorIndex > 0) {
                window.scrollTo(0, $('#PsgerInputList').offset().top);
                return false;
            } else {
                return true;
            }
        },
        getPassengerInfo: function () {
            var arr = [];
            $('#PsgerInputList .m-passenger').each(function (o, i) {
                var ipt = o.find('input.inp'), pInfo = o.data('userDetailInfo');
                if (ipt.value() != "" && ipt.value() != ipt.attr('placeholder')) {
                    //乘客类别(P:乘客 D:驾驶员)
                    arr.push({
                        PassengerType: "P",
                        PassengerName: ipt.value(),
                        IDType: 0,
                        IDNumber: "",
                        PassengerPhone: pInfo ? pInfo.mobile : "", // (pInfo ? pInfo.mobile : "")
                        EmployeeID: pInfo ? pInfo.employeeid : "",
                        CorpUserID: pInfo ? pInfo.uid : (o.attr('uid') ? o.attr('uid') : "")
                    });
                }
            });
            return arr;
        }
    }
    //支付方式
    var PaymentMethod = {
        init: function () {
            //清空
            $('#PaymentDiv').find('input')[0] && ($('#PaymentDiv').find('input')[0].checked = true);
            PaymentMethod.bindEv();
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
                if ("C" == PageInfo.ModelInfo.PostParam.FeeType && $(this).attr('dval') != "2") {
                Price.addPartPrice(label.TravelServiceFee, "bs_charge", ProductInfo.ServiceFee); //商旅服务费
                } else {
                Price.removePartPrice("bs_charge", ProductInfo.ServiceFee);
                }
                //因公，信用卡无需授权
                if ("C" == PageInfo.ModelInfo.PostParam.FeeType) {
                $('#WarrantBox').css('display', ($(this).attr('dval') != "0") ? "none" : "");
                ($(this).attr('dval') == "0" && PageInfo.ModelInfo.CouldShowPrompt) ? PageFoot.showFootWarrant() : PageFoot.hideFootWarrant();
                }
                */
            });
        },
        paymentStatus: function (d) {
            //0:公司账户支付 1:信用卡支付 2:门店现付
            $('#InvoiceBox').css('display', (d == "1") ? '' : 'none'); $('#AccountInvoiceNotice').css('display', (d == '0') ? '' : 'none'); Invoice.refreshInvoicePrice();
            //!(!ProductInfo.ServiceFee && typeof ProductInfo.ServiceFee != "undefined" && ProductInfo.ServiceFee != 0)
            //提交按钮话术
            $('#CreateOrder').value((d == "1") ? label.PayOrderText : label.SubmitOrderText);
            //
            if (ProductInfo.ServiceFee != null) {
                ("C" == PageInfo.ModelInfo.PostParam.FeeType && d != "2") ? Price.addPartPrice(label.TravelServiceFee, "bs_charge", ProductInfo.ServiceFee) : Price.removePartPrice("bs_charge", ProductInfo.ServiceFee); //商旅服务费
            }
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType) {
                $('#WarrantBox').css('display', (d != "0") ? "none" : "");
                (d == "0" && PageInfo.ModelInfo.CouldShowPrompt) ? PageFoot.showFootWarrant() : PageFoot.hideFootWarrant();
            }
            //取消话术
            d == "2" ? PageFoot.hideFootCancel() : PageFoot.showFootCancel();
        }
    }
    //
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
            $('#InvoiceDis').find('input')[0] && ($('#InvoiceDis').find('input')[0].checked = true);
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
            //$('#PointsFor').css('display', Invoice.InvoiceInfo.IsShowIntegralExchange ? "" : "none");
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
                    InvoiceFeeType: $('#InvoiceDis').find('input:checked').attr('dval'),
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
                //
                Invoice.refreshInvoicePrice();
            });
            //配送方式切换
            $('#InvoiceDis').find('input').bind('click', function (e) {
                Invoice.refreshInvoicePrice();
            });
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
            ProductInfo && CouponCode.drawList(ProductInfo.DiscountList);
        },
        drawList: function (data) {
            var ccd = $('#CouponCodeDiv');
            if (data && data.length > 0) {
                //喷入结构
                ccd.css('display', '');
                $('#CouponInfo').html($.tmpl.render($('#CouponInfoTmpl').html(), data));
            } else {
                $('#CouponCodeDiv').css('display', 'none');
            }
        }
    };
    var Price = {
        TotalPrice: 0,
        init: function () {
            var initP = Price.initPriceData(ProductInfo);
            $('#sidePrice').html($.tmpl.render($('#PriceTmpl').html(), initP));
            Price.TotalPrice = initP.TotalAmount;
        },
        initPriceData: function (data) {

            return {
                TotalAmount: data.TotalPrice ? data.TotalPrice.Price : 0,
                BasicAmount: data.TotalPrice ? data.TotalPrice.Price : 0
            }
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
                ServiceFee: ProductInfo.ServiceFee,
                ServiceCharge: ProductInfo.TotalPrice.Price, //ServiceChargeFee
                TotalAmount: Price.TotalPrice
            }
        }
    }
    //
    var SubmitService = {
        init: function () {
            var co = $('#CreateOrder');
            //
            co.bind('click', function (e) {
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
        getCostCenterWarnInfo: function () {
            var tmp = "", ccInfoJson = null, wInfoJson = null;
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType) {
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
                //                CostCenter2: ccInfoJson ? ccInfoJson.CostCenter2 : "",
                //                CostCenter3: ccInfoJson ? ccInfoJson.CostCenter3 : "",
                //                DefineValue1: ccInfoJson ? ccInfoJson.DefineContent : "",
                //                DefineValue2: ccInfoJson ? ccInfoJson.DefineContent2 : "",
                //                JouneryID: ccInfoJson ? ccInfoJson.JourneyNo : "",
                //SaveToDefaultCostCenter: ccInfoJson ? ccInfoJson.IsShowSaveAsDefault != "F" : false,
                AuthPwd: wInfoJson ? encodeURIComponent(wInfoJson.PassWord) : "",
                ConfirmPerson1: $('[name="CorpInfo.ConfirmPerson"]').value(),
                RcCodeID: '',
                QuoteMode: ProductInfo.QuoteMode ? ProductInfo.QuoteMode : "",
                CostCenterRequire: PageInfo.ModelInfo.CostCenterRequire.toLocaleUpperCase()
            };
        },
        getContractInfo: function () {
            return {
                ContactID: 0,
                ContactPerson: $('#txtContactNameID').value(),
                ContactPhone: $('#txtContactMobilePhoneID').value(),
                ContactEmail: $('#txtContactEmailID').value()
            }
        },
        getProductInfo: function () {
            var pp = PageInfo.ModelInfo.PostParam, fltTrainNO = "";
            if (pp.SearchType == "jnt" && IsEmpty(pp.FlightNumber)) {
                fltTrainNO = $('#fltNOInput').value();
            } else if (pp.SearchType == "jhc") {
                fltTrainNO = $('#myTrainNOInput').value();
            } else {
                fltTrainNO = pp.FlightNumber;
            }
            return {
                VendorId: ProductInfo.Vendor.VendorID,
                VendorCode: ProductInfo.VendorCode,
                VendorName: ProductInfo.Vendor.VendorName,
                VendorLogo: ProductInfo.Vendor.VendorImageUrl,
                VehicleGroupId: ProductInfo.VehicleGroup.VehicleGroupID,
                VehicleGroupName: ProductInfo.VehicleGroup.VehicleGroupName,
                VehicleGroupEnName: ProductInfo.VehicleGroup.VehicleGroupEnName,
                VehicleGroupImageUrl: ProductInfo.VehicleGroup.VehicleGroupImageUrl,
                CarCapacity: ProductInfo.VehicleGroup.SeatCount,
                TrunkCapacity: ProductInfo.VehicleGroup.CarRiageNum,
                CarDescription: ProductInfo.VehicleGroup.SeatDesc,
                UseCarDescription: label.ExpectDKilometersMminutes.replace("{0}", ProductInfo.TotalPrice.Distance).replace("{1}", ProductInfo.TotalPrice.TimeLength), //预计公里数公里行驶约分钟 
                DepartureCityId: IsEmpty(pp.DepartureCityId) ? 0 : pp.DepartureCityId,
                DepartureCityName: pp.DepartureCityName,
                ArrivalCityId: IsEmpty(pp.ArrivalCityId) ? 0 : pp.ArrivalCityId,
                ArrivalCityName: pp.ArrivalCityName,
                PatternType: PageInfo.ModelInfo.PatternType,
                FixedLocationType: pp.LocationType,
                FixedLocationCode: pp.LocationCode,
                FixedLocationName: pp.LocationName,
                FixedTerminalId: IsEmpty(pp.TerminalID) ? 0 : pp.TerminalID,
                UserDate: pp.UseTime,
                Latitude: pp.Lat,
                Longitude: pp.Lng,
                Address: pp.Address,
                AddressDetail: pp.AddressDetail,
                GeographicType: 1, //1高德，2谷歌
                PriceMark: ProductInfo.PriceMark,
                FlightTrainNum: fltTrainNO
            }
        },
        getSubmitInfo: function () {
            var invoiceInfo = Invoice.getInvoiceInfo(),
                priceInfo = Price.getPriceInfo(),
                paymentInfo = PaymentMethod.getPaymentInfo(),
                passengerList = Passenger.getPassengerInfo(),
                contactInfo = SubmitService.getContractInfo(),
                postProductInfo = SubmitService.getProductInfo(),
                companyInfo = SubmitService.getCostCenterWarnInfo();

            return {
                FeeType: PageInfo.ModelInfo.PostParam.FeeType,
                NeedInvoice: invoiceInfo.needInvoice,
                LastLosslessCancelTime: ProductInfo.LastCancelTime,
                LastConfirmPaymentTime: ProductInfo.LastConfrimTime,
                LastOrderSaveTime: ProductInfo.LastOrderSaveTime,
                ServiceFee: priceInfo.ServiceFee ? priceInfo.ServiceFee : 0,
                TotalAmount: priceInfo.TotalAmount,
                PickUpServiceCharge: priceInfo.ServiceCharge,
                CompanyInfo: companyInfo,
                PassengerList: $.stringifyJSON(passengerList),
                PaymentInfo: $.stringifyJSON(paymentInfo),
                ContactInfo: $.stringifyJSON(contactInfo),
                ProductInfo: $.stringifyJSON(postProductInfo),
                InvoiceInfo: invoiceInfo.invoiceInfo ? $.stringifyJSON(invoiceInfo.invoiceInfo) : ""
            };
        },
        validateAll: function () {
            //校验航班号
            if (!MyFltNO.ValiResult) {
                window.scrollTo(0, $('#myFltNODiv').offset().top);
                return false;
            }
            //乘车人校验
            if (!Passenger.validateAllPsger()) {
                return false;
            }
            //联系人检验
            if (!recentContact.validateContactInfo()) {
                window.scrollTo(0, $('#ContactInfoBox').offset().top);
                return false;
            }
            //成本中心校验
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType && typeof checkdata != "undefined" && !checkdata()) {
                window.scrollTo(0, $('#CostCenterBox').offset().top);
                return false;
            }
            //授权检验
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType && $('#WarrantBox').css('display') != "none" && typeof Warrant != "undefined" && !Warrant.validateWarranInfo()) {
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
            this.noticeInit();
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

    //************************************* OpenUI S *************************************
    //OpenUI 回调
    window.loadClientSuccess = function () {
        userList.render();
        var _LT = null;
        userList.onCheckCustomer = function (e, customerProperties) {
            //userList  *getByUid *getUserByUid
            //the first
            var eptObj = Passenger.getEmptyPsgObj();
            if (!(eptObj && eptObj.length > 0)) {
                if ($('#PsgerInputList').find('div.m-passenger').length < ProductInfo.VehicleGroup.SeatCount) {
                    eptObj = Passenger.addInputPsger(customerProperties);
                } else {
                    var cfl = $('#CarFullLayer'), _offset = $(e.target.parentElement).offset();
                    cfl.html('<p>' + label.UpToXPeople.replace("{0}", ProductInfo.VehicleGroup.SeatCount) + '</p><i class="icon"></i>').css({//最多可乘坐X人
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
            Passenger.setInputPsgerVal(eptObj, customerProperties);
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
        }
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
            //成本中心联动
            if (openuiCVal.Cost1NeedChange && typeof removeCostCenter1 != "undefined") {
                removeCostCenter1($.stringifyJSON({
                    UIDOrInfoID: customerProperties.uid,
                    IsEmpolyee: (customerProperties.isCorp == "T" ? 'Y' : 'N'),
                    Name: escape(customerProperties.name),
                    PolicyID: PageInfo.ModelInfo.PolicyID
                }));
            }
        }
    }
    window.loadContactSuccess = function (data, status, xmlHttp) {
        var cib = $('#ContactInfoBox');
        if (data) {
            NAnimate ? cib.css('display', '') : cib.slideDown();
        } else {
            NAnimate ? cib.css('display', 'none') : cib.slideUp();
        }
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
    //
    var OpenUI = {
        init: function () {
            OpenUI.loadClient(); OpenUI.loadContact();
            OpenUI.loadCostCenter(); OpenUI.loadAuth();
        },
        loadClient: function () {
            Q.J(cfg.OpenUIUrl.clientUrl, 'PassengerList', null, { OnSuccess: 'loadClientSuccess' });
        },
        loadContact: function () {
            Q.J(cfg.OpenUIUrl.contactUrl, 'ContactInfoDiv', null, { OnSuccess: 'loadContactSuccess' });
        },
        loadCostCenter: function () {
            // 因私没有成本中心
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType) {
                Q.J(cfg.OpenUIUrl.costCenterUrl, 'CostCenterDiv', null, { OnSuccess: 'loadCostCenterSuccess' });
            }
        },
        loadAuth: function () {
            if ("C" == PageInfo.ModelInfo.PostParam.FeeType) {
                Q.J(cfg.OpenUIUrl.authUrl, 'WarrantDiv', null, { OnSuccess: 'loadAuthSuccess' });
            }
        }
    }
    //************************************* OpenUI E *************************************
    var PagePartInfo = {
        init: function () {
            NAnimate ? $('#sideForm').css('display', '') : $('#sideForm').slideDown();
            this.initTerm(); this.initFootNotice(); this.initBookingSide();
        },
        initTerm: function () {
            if (!$.isEmptyObject(ProductInfo.Remark)) {
                $('#bookingTerm').html($.tmpl.render($('#BookingTermTmpl').html(), ProductInfo.Remark));
            }
        },
        initFootNotice: function () {
            if (!$.isEmptyObject(ProductInfo.Remark)) {
                $('#NoticeBox').html($.tmpl.render($('#BookingNoticeTmpl').html(), ProductInfo.Remark));
            }
        },
        initBookingSide: function () {
            if (!$.isEmptyObject(ProductInfo.TotalPrice)) {
                var data = PageInfo.ModelInfo;
                data._ = ProductInfo;
                $('#sideDetail').html($.tmpl.render($('#SideDetailTmpl').html(), data));
            }
        }
    }
    function PageInit() {
        var pd = PageInfo.ModelInfo.PostParam, bm = $('#baseMask');
        pd.IsRemark = true;
        pd.PatternType = PageInfo.ModelInfo.PatternType;
        for (var i in pd) { !pd[i] && (pd[i] = ""); }
        bm.mask();
        $.ajax(AjaxUrl.ATPCheckProductUrl, {
            method: "POST",
            context: pd,
            onsuccess: function (ret) {
                bm.unmask();
                ProductInfo = $.parseJSON(ret.responseText);
                //
                if (!$.isEmptyObject(ProductInfo) && ProductInfo.VendorID != "0") {
                    $("#AuthorizePrompt").html(ProductInfo.AuthorizePrompt); $("#LastCancelTime").html(ProductInfo.CancelPrompt);
                    //
                    MyFltNO.init();
                    OpenUI.init();
                    PagePartInfo.init();
                    Passenger.init();
                    CouponCode.init(); Price.init();
                    PaymentMethod.init(); SubmitService.init();
                    Invoice.init(); PageFoot.init();
                    //
                    !('placeholder' in document.createElement('input')) && !$.isEmptyObject(CMFun) && CMFun.Placeholder.add($('input[type="text"]'));
                } else {
                    var be = $('#BookingError');
                    be.mask();
                    be.find('.xui-modal-close,.sub-btn').bind('click', function (e) {
                        CloseWindow();
                    });
                }
            },
            onerror: function () {
                bm.unmask();
            }
        });
    }
    //
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
        //
        PageInit();
    });

})(cQuery);