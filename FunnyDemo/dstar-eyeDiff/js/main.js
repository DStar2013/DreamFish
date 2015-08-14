(function(w, $) {
	//第一类视觉差效果
	(function() {
		var boxH = $('.box').height();
		var vIndex = [];
		//
		$('.slidecount li').each(function(){
			vIndex.push($(this).index());
		});

		//响应window滚动
		$(window).scroll(function(e) {
			var tmpH = $(window).scrollTop();
			$(".slidecount li:eq(" + vIndex[parseInt(tmpH / boxH)] + ")").addClass("focus").siblings("li").removeClass("focus");
		});
		//响应点击滚动
		$('.slidecount li').bind('click',function(){
			$('body').animate({
				scrollTop: $(this).index() * boxH
			}, 2000);
			return false;
		});
	})();
	//第二类视觉差效果






})(window, jQuery);