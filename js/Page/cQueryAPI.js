(function($) {

	var s = {
		"key": "ajax <strong>Version:cQuery_110421</strong>",
		"desName": "说明",
		"desDetail": "<code><span class=\"typ\">Object</span><span class=\"pln\"> cQuery</span><span class=\"pun\">.</span><span class=\"pln\">ajax</span><span class=\"pun\">(</span><span class=\"pln\">url</span><span class=\"pun\">,</span><span class=\"pln\"> opt</span><span class=\"pun\">)</span></code>",
		"desP": "cQuery的<code>ajax</code>的方法，发起一个ajax请求",
		"argName": "参数",
		"argUrl": "url(String)",
		"argLi": "<li>发起ajax请求的url地址</li>",
		"argObj": "opt(Object)",
		"argDetail": "<code><span class=\"pln\">ajax</span><span class=\"pun\">的配置参数</span><br/><span class=\"pln\"></span><span class=\"pun\">{</span><br/><span class=\"pln\">    method</span><span class=\"pun\">:‘</span><span class=\"pln\">GET</span><span class=\"str\">', //可选参数为GET和POST<br/>    context: '</span><span class=\"kwd\">string</span><span class=\"str\">' || {}, //post发送数据的参数,可以是字符串或者键值对对象<br/>    escape: false,<br/>    async: true,<br/>    cache: false,<br/>    header: {},<br/>    unique: '',<br/>    uniqueType: '</span><span class=\"kwd\">string</span><span class=\"str\">',<br/>    onsuccess: function,<br/>    onerror: function,<br/>    onabort: function<br/>}</span></code>",
		"backName": "返回值",
		"backObj": "Object#ajax对象",
		"demoName": "实例",
		"demoP_1": "Example",
		"demoDetail_1": "<code><span class=\"pln\">cQuery</span><span class=\"pun\">.</span><span class=\"pln\">ajax</span><span class=\"pun\">(</span><span class=\"str\">'http://xxx'</span><span class=\"pun\">,</span><span class=\"pln\"> </span><span class=\"pun\">{</span><span class=\"pln\">onsuccess</span><span class=\"pun\">:</span><span class=\"pln\"> </span><span class=\"kwd\">function</span><span class=\"pun\">(){</span><span class=\"pln\">    xxxxxx    xxxx    xxxxx</span><span class=\"pun\">}});</span></code>",
		"demoP_2": "以上代码效果",
		"demoDetail_2": "<code><span class=\"pun\">会发起一个</span><span class=\"pln\">ajax</span><span class=\"pun\">请求，并返回一个</span><span class=\"pln\">ajax</span><span class=\"pun\">对象</span></code>"
	}


	//tab list Init
	function tabInit() {
		//
		$.ajax({
			type: "GET",
			url: "../js/data/cQueryAPI/AllKey.txt",
			//dataType: "jsonp",
			success: function(data, textStatus) {
				var tab = $('#navTab');
				tab.empty().html($('#tpl_nav').tmpl($.parseJSON(data)));
				//
				tabtitleEv();
				tablistEv();
			}
		});
	}

	//tab event
	function tabtitleEv() {
		var tab = $('#navTab');
		tab.find('.tabtitle').on("click", function(event) {
			// $(this).toggleClass(function() {
			// 	if ($(this).hasClass("dropdown")) {
			// 		return "dropup";
			// 	} else {
			// 		return "dropdown";
			// 	}
			// });
			var tObj = $(this);
			if (tObj.hasClass("dropdown")) {
				tObj.removeClass("dropdown").addClass("dropup");
				tObj.find('ul').css('display', '');
			} else {
				tObj.removeClass("dropup").addClass("dropdown");
				tObj.find('ul').css('display', 'none');
			}
			//
		});
	}

	function tablistEv() {
		var tab = $('#navTab'),
			tablist = tab.find('.tablist');
		tablist.on("click", function(event) {
			if (!$(this).hasClass("active")) {
				tablist.removeClass("active");
				$(this).addClass("active");
				//
				tabDetail($(this).find('a').attr('dInfo'));
			}
			event.stopPropagation();
		});
	}

	function tabDetail(key) {

	}

	//Init
	$(document).ready(function() {
		//
		tabInit();
	});
})(jQuery);