/**
 * Created by dream on 16/8/4.
 */


(function ($) {

    function textShowInit() {
        var pList = $('#st-content').find('p');
        //js dom list 转化为数组对象
        var pArr = Array.prototype.slice.call(pList);
        var animateListFun = [];
        //动画顺序
        var animateIndex = 0;

        var animateFun = function (pArr, successCallBack) {
            if (!pArr || pArr.length == 0) return;
            var currObj = $(pArr[0]);
            pArr.shift();
            //循环动画
            if (pArr.length > 0) {
                animateIndex == 3 ? animateIndex = 1 : animateIndex++;
                switch (animateIndex) {
                    case 1:
                        currObj.show(3000, function(){
                            animateFun(pArr);
                        });
                        break;
                    case 2:
                        currObj.fadeIn(3000, function(){
                            animateFun(pArr);
                        });
                        break;
                    case 3:
                        currObj.slideDown(3000,function(){
                            animateFun(pArr);
                        });
                        break;
                    default:
                        currObj.show(5000, function(){
                            animateFun(pArr);
                        });
                        break;
                }
            } else {
                currObj.show(3000, function(){
                    animateFun(pArr);
                });
            }

        }

        animateFun(pArr);

    }

    //Ev init
    function EventInit() {
        $('#p-next').bind('click', function () {
            alert("CC")
        });
    }

    $(document).ready(function () {

        //
        textShowInit();

    });

})(jQuery)