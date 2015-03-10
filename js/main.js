(function(){

	$('#navMenu li').click(function(e) {
		$('#sidebar .wrap-col').css('display','none');
		$('#navMenu li').removeClass("active");
		$(this).addClass("active");
		document.getElementById($(this).attr("side")).style.display = '';
		e.stopPropagation();
	});




})();