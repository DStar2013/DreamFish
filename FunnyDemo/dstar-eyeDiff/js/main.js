(function(w, $) {
	//第一类视觉差效果
	(function() {
		var boxH = $('.box').height();
		var vIndex = [];
		//
		$('#PageBottom1 li').each(function(){
			vIndex.push($(this).index());
		});

		//响应window滚动
		$(window).scroll(function(e) {
			var tmpH = $(window).scrollTop();
			$("#PageBottom1 li:eq(" + vIndex[parseInt(tmpH / boxH)] + ")").addClass("focus").siblings("li").removeClass("focus");
		});
		//响应点击滚动
		$('#PageBottom1 li').bind('click',function(){
			$('body').animate({
				scrollTop: $(this).index() * boxH
			}, 2000);
			return false;
		});
	})();
	//第二类视觉差效果
	(function() {
		var boxH = $('div.content').height();
		$('.article').find('div.content:eq(0)').addClass('content-focus')
		//
		$(window).scroll(function(e) {
			var tmpH = $(window).scrollTop();
			$("#PageBottom2 li:eq(" + parseInt(tmpH / boxH) + ")").addClass("focus").siblings().removeClass("focus");
			$(".article>div.content:eq(" + parseInt(tmpH / boxH) + ")").addClass('content-focus').siblings().removeClass("content-focus");
		});
		//相应点击滚动
		$('#PageBottom2 li').bind('click',function(){
			$('body').animate({
				scrollTop: $(this).index() * boxH
			}, 2000);
			return false;
		});			
	})();




})(window, jQuery);