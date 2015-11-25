(function(){

	$('#navMenu li').click(function(e) {
		$('#sidebar .wrap-col').css('display','none');
		$('#navMenu li').removeClass("active");
		$(this).addClass("active");
		document.getElementById($(this).attr("side")).style.display = '';
		e.stopPropagation();
	});

	/*
	var li = $('.gallery').find('li');
		
	li.each(function(i){
		var t = $(this),
			img = t.find('img'),
			src = img.attr('src'),
			width = li.width(),
			height = li.height();
			
		img.hide().after($('<div />').attr('id', 'holder'+i).addClass('holder'));

		var r = Raphael('holder'+i, width*2, height*2),
			rimg = r.image(src, width/2, height/2, width, height);
		
		rimg.hover(function(event) {
		    this.animate({
				scale: 2,
				rotation : 360
			}, 1200, 'elastic');
		}, function (event) {
		    this.animate({
				scale: 1,
				rotation : 0
			}, 1200, 'elastic');
		});
		
	});
*/
	/*
	$('#ImgGallery').find('a').each(function(i) {
		var t = $(this),
			img = t.find('img'),
			src = img.attr('src'),
			width = 500,
			height = 300;

		img.hide().after($('<div />').attr('id', 'holder'+i).addClass('holder'));
		// img.attr('id','holder'+i).addClass('holder');

		var r = Raphael('holder'+i, width*2, height*2),
			rimg = r.image(src, width/2, height/2, width, height);

		rimg.hover(function(event) {
		    this.animate({
				scale: 2,
				rotation : 360
			}, 1200, 'elastic');
		}, function (event) {
		    this.animate({
				scale: 1,
				rotation : 0
			}, 1200, 'elastic');
		});



	});
*/


})();