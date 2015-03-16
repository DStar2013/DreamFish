(function(){

	$('#navMenu li').click(function(e) {
		$('#sidebar .wrap-col').css('display','none');
		$('#navMenu li').removeClass("active");
		$(this).addClass("active");
		document.getElementById($(this).attr("side")).style.display = '';
		e.stopPropagation();
	});


	// $.mod.load('sideBar', '2.0', function() {
	// 	//<a href="javascript:void(0);" class="bar-item bar-oa" onmouseover="OATips();" onmouseout="OAHide();"><i class="ico icon-oa"></i><span class="bar-title">${oa}</span></a>
	// 	var sidebar = $(document).regMod('sideBar', '2.0', {
	// 		HTML: '<div class="xui-fixbar"><a href="javascript:alert(\'酒店审批\');" class="bar-item bar-oa-hotel"><i class="xuico-hotel-white2"></i><span class="bar-title">${hotelOA}</span></a><a href="${suggestionURL}" target="_blank" class="bar-item bar-feedback"><i class="xuico-feedback"></i><span class="bar-title">${suggestion}</span></a><a href="${liveChatURL}" target="_blank" class="bar-item bar-olservice" style="display:none"><i class="xuico-olservice"></i><span class="bar-title">${liveChat}</span></a><a href="#" class="bar-item bar-totop"><i class="xuico-totop"></i></a></div>',
	// 		url: {
	// 			suggestionURL: 'http://accounts.ctrip.com/MyCtrip/Community/CommunityAdvice.aspx?productType=15',
	// 			liveChatURL: 'http://livechat.ctrip.com/livechat/Login.aspx?GroupCode=slzzpt'
	// 		},
	// 		title: {
	// 			backTop: '回到顶部',
	// 			suggestion: '意见反馈',
	// 			liveChat: '在线客服',
	// 			hotelOA: '酒店OA审批'
	// 		},
	// 		threshold_px: 100
	// 	});
	// });

})();