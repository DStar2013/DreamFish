/**
 * Created by dream on 16/8/4.
 */


(function ($) {


    function textShowInit(){
        var pList = $('#st-content').find('p');

        var animateListFun = []

        pList.each(function(i, obj) {
            switch (i % 3) {
                case 0:
                    $(obj).animate(function(){

                    })
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }



        });


    }


    $(document).ready(function(){

        //
        textShowInit();

    });

})(jQuery)