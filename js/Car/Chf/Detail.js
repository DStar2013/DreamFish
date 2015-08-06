
$.ready(function () {
    // 订单取消按钮事件绑定
    $('.btn-cancel-order').bind('click', function () {
        if ($('.btn-cancel-order').hasClass('disable')) {
            return;
        }
        $('.main-mask').css("display", 'block');
        $('.modal-cancel-order').css("display", 'block');
        var data = { id: $('#OrderId').value(), uid: $('#Uid').value() };
        ajaxFunCancelAsk("/Car/Chf/CancelOrderAsk", data);

    });

    // 订单取消按钮事件绑定
    $('.btn-cancel').bind('click', function () {
        ajaxStart();
        var data = { id: $('#OrderId').value(), uid: $('#Uid').value() };
        ajaxFun("/Car/Chf/CancelOrder", data, "", label.CancelFailed, true); //取消失败
    });

    // 订单取消浮层事件绑定
    $('.btn-back').bind('click', function () {
        hideModalCancelOrder();
    });

    // 订单取消浮层事件绑定
    $('.xui-modal-close').bind('click', function () {
        hideModalCancelOrder();
    });


    // 隐藏订单取消浮层
    function hideModalCancelOrder() {
        $('.main-mask').css("display", 'none');
        $('.modal-cancel-order').css("display", 'none');
    }
});

function ajaxStart() {
    $('#CancelMessage').css("display", 'none');
    $('#CancelingMessage').css("display", 'block');
    $("#promt").css("display", 'none');
    $('.xui-modal-close').css("display", 'none');
    $('.xui-modal-ft').css("display", 'none');
}

function ajaxComplete() {
    $('.main-mask').css("display", 'none');
    $('.modal-cancel-order').css("display", 'none');
}

function ajaxFun(url, data, messageT, messageF, isReload) {
    var err;
    var opt = {
        method: 'POST',
        context: data,
        onsuccess: function (response) {
            if (response.responseText == "T") {
                ajaxComplete();
                if (isReload) {
                    location.reload();
                }
            } else {
                alert(messageF);
                location.reload();
            }
        },
        onerror: function () {
            alert(messageF);
            location.reload();
        }
    }

    $.ajax(url, opt);

}

function ajaxFunCancelAsk(url, data) {
    var err;
    var opt = {
        method: 'POST',
        context: data,
        onsuccess: function (response) {
            if (response.responseText != "0") {
              //  $("#promt").html("根据服务条款，本次取消将扣除您违约金￥" + response.responseText + "，剩余金额将退还至您的账户。");
                $("#promt").html(label.RefundDescription.replace("{0}", response.responseText));
            } else {
                $('#promt').html("");
            }
        }
    }

    $.ajax(url, opt);

//    $.ajax({
//        url: url.replace('&amp;', '&'),
//        type: 'POST',
//        async: false,
//        data: data,
//        cache: false,
//        complete: function (response) {
//            if (response.responseText != "0") {
    //                $("#promt").html("根据服务条款，本次取消将扣除您违约金￥" + response.responseText + "，剩余金额将退还至您的账户。");
//            } else {
//                $('#promt').html("");
//            }
//        },
//        error: function (xhr) {
//            err = xhr.responseText;
//        }
//    });

//    if (err) {
//        alert(err);
//        return false;
//    }
}
