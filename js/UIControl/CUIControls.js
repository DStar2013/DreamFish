//code by 有梦想的咸鱼
(function(window, $, tmpl) {
	var cfg = {
		versions: {
			address: '1.0',
			validate: '1.1'
		}
	};
	var $el = function(id) {
		return $(id, document);
	};

	if (!window.CUIControls) window.CUIControls = {};

	//☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆Control Start☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆

	//====================================Warn Control S========================================
	var WarnControl = (function() {

	})();
	//====================================Warn Control E========================================

	//====================================City Control S========================================
	var CityControl = (function() {
		//
		var defaultSuggestionInit = function(obj) {
			/**
			 *  代码拷自addresss组件，实现tab切换，
			 *  因为address组件只要用户配置了suggestionInit,  就不触发组件自己的suggestionInit，失去了tab切换功能
			 */
			//html like this
			var spans = obj.find('.tab_box li');
			var uls = obj.find('div.city_item');
			if (!spans.length) {
				return;
			}

			var switchTab = function() {
				var _this = this;
				spans.each(function(span, i) {
					if (span[0] == _this) {
						span.addClass('selected');
						uls[i].style.display = '';
					} else {
						span.removeClass('selected');
						uls[i].style.display = 'none';
					}
				});
			};
			spans.bind('mousedown', switchTab);
			switchTab.apply(spans[0]);
		};

		var history = (function() {
			var historyKey = "cityKey";
			//将查询的结果加入到cookie中
			var addToCookie = function(cityname, cityid, cookieKey) {
				var substr = "|" + cityname + "|" + cityid;
				//set的时候，运行算法，加入判断条件，查询城市不超过5个，最近最常见城市
				var jsonData = $.cookie.get(cookieKey, null);
				var str = "";
				//如果之前没有搜索记录
				if (jsonData != null && jsonData != "") {
					var myArray = jsonData.split("#");
					myArray.splice(myArray.length - 1, 1);
					//如果数组城市的个数小于5个
					if (myArray.length < 5) {
						//如果有数据重复,删除掉重复项,将新的数据加入到数组
						if (myArray.indexOf(substr) != -1) {
							myArray.splice(myArray.indexOf(substr), 1);
							myArray.splice(0, 0, substr);
						}
						//没有重复
						else {
							myArray.splice(0, 0, substr);
						}
					} else {
						//如果数据有重复，删除数据，将新数据加入到数组
						if (myArray.indexOf(substr) != -1) {
							myArray.splice(myArray.indexOf(substr), 1);
							myArray.splice(0, 0, substr);
						} else {
							myArray.splice(myArray.length - 1, 1);
							myArray.splice(0, 0, substr);
						}
					}
					for (i = 0; i < myArray.length; i++) {
						str += myArray[i] + "#";
					}
				} else {
					str = "|" + cityname + "|" + cityid + "#";
				}
				//构造str完毕，将str加入到cookie
				$.cookie.set(cookieKey, null, str, {
					expires: 7,
					path: '/'
				});
			};
			//用于处理分解后的json格式，html绘制表格
			var decomCity = function(cookieKey) {
				var cityStr = [];
				var jsonData = $.cookie.get(cookieKey, null);
				if (jsonData != null && jsonData != "") {
					var myArray = jsonData.split("#");
					for (i = 0; i < myArray.length - 1; i++) {
						cityStr.push('<a data="'.concat(myArray[i], '" href="javascript:;">', myArray[i].split("|")[1], '</a>'));
					}
					return cityStr.join('');
				} else {
					return "";
				}
			};
			//
			return {
				saveHistory: function(cityId, cityName) {
					if (cityId && cityName) {
						addToCookie(cityName, cityId, historyKey);
					}
				},
				getHistory: function() {
					return decomCity(historyKey);
				}
			}
		})();

		var create = function(o) {
			var city = $el(o.city),
				source = o.source;
			var cityMod = city.regMod('address', cfg.versions.address, {
				name: o.city,
				charset: 'utf-8',
				delay: 200,
				jsonpSource: source,
				jsonpFilter: source,
				//source: source,
				jsonpFilterInit: function(result) {
					if (!result) {
						return result;
					}
					var list = [];
					var data = result.data.split('@');
					var val = city.value();
					
					if (val) {
						var reg = new RegExp(val + '+', 'gi');
						for (var i = 0, l = data.length; i < l; i++) {
							if(reg.test(val)) list.push(data[i]);
						}
					} else {
						list = data;
					}
					//list = data;
					// some bugs in find
					result.data = {
						list: list,
						split: function() {
							return this.list;
						}
					}
					return result;
				},
				sort: ['^0$', '^1$', '0+'],
				message: {
					title: '支持中文/拼音/简拼输入',
					historyHtml: history.getHistory(),
					historyTitle: '搜索历史'
				},
				template: {
					suggestion: tmpl.CitySuggestion,
					suggestionStyle: tmpl.CitySuggestionStyle,
					filter: tmpl.CityFilter,
					filterStyle: tmpl.CityFilterStyle,
					filterPageSize: 7,
					suggestionInit: function(arg) {
						defaultSuggestionInit(arg);
						arg.find('.close').bind('mousedown', function() {
							city[0].blur();
						});
					}
				}
			});

			return {
				saveHistory: history.saveHistory
			}
		}

		return {
			init: create
		}
	})();
	//====================================City Control S========================================

	//☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆Control End☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
	(function(c) {
		c.CityInit = CityControl.init;
	})(window.CUIControls);

})(window, cQuery, {
	CitySuggestion: '<div class="city_select_lhsl"><a class="close" href="javascript:;">×</a><p class="title">${message.title}</p>{{if (message.historyHtml) }}<p class="search_title">${message.historyTitle}</p><div class="search_history_box">${message.historyHtml}</div>{{/if}}<ul class="tab_box">{{enum(key) data}}<li>${key}</li>{{/enum}}</ul>{{enum(key,arr) data}}<div class="city_item">{{each arr}}<a href="javascript:void(0);" data="${data}">${display}</a>{{/each}}</div>{{/enum}}</div>',
	CitySuggestionStyle: '.city_select_lhsl{width:378px;padding:10px;border:1px solid #999;background-color:#fff;line-height:1.5;font-size:12px;font-family:Tahoma,Simsun,sans-serif}.city_select_lhsl a {float: left;display: inline;width:68px;height:24px;line-height:24px;color:#666;text-decoration:none;outline-width:medium;outline-style:none;outline-color:invert;padding-left:5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.city_select_lhsl a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;background: none;}.city_select_lhsl .title{padding-bottom: 8px;color:#999;}.city_select_lhsl .tab_box{width:100%;height:24px;margin-bottom:3px;border-bottom:2px solid #ccc;}.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;padding:0 10px;line-height:24px;color:#333;cursor:pointer;}.city_select_lhsl .tab_box .selected {border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}.city_select_lhsl .tab_box b{display:none;position:absolute;top:24px;left:50%;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}.city_select_lhsl .city_item,.city_select_lhsl .airport_item,.city_select_lhsl .search_history_box {display:block;overflow:hidden;zoom: 1;padding-left: 5px;}.city_select_lhsl .search_title {margin-bottom: 2px;font-weight:bold;color:#06c;}.city_select_lhsl .search_history_box {margin-bottom:10px;}.city_select_lhsl .airport_item .search_title {margin: 10px 2px 0 -5px;}.city_select_lhsl .airport_item a {width: 118px;}',
	CityFilter: '{{if $data.hasResult}}<div class="keyword_prompting_lhsl keyword_prompting_lhsl_mini"><div class="sug_item item_list_city" style="">{{each (i,item) list}}{{if cQuery.type(item)=="string"}}<label>${item}</label>{{else}}<a href="javascript:;" data="${data}"><span class="city">${right.replace(val, "<strong class=b>"+val+"</strong>")}</span><span class="num"></span></a>{{/if}}{{/each}}</div>{{if page.max>1}}<div class="c_page_mini" style="display: block;">{{if page.current>0}}<a href="javascript:void(0);" page="${page.current-1}">&lt;-</a>{{/if}}{{if page.current<2}}{{loop(index) Math.min(5,page.max+1)}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{else page.current>page.max-2}}{{loop(index) Math.max(0,page.max-4),page.max+1}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{else}}{{loop(index) Math.max(0,page.current-2),Math.min(page.current+3,page.max+1)}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{/if}}{{if page.current<page.max}}<a href="javascript:void(0);" page="${page.current+1}">-&gt;</a>{{/if}}</div>{{/if}}</div>{{else}}<div class="error_tips"><p>${message.label.notFound}：${$data.val}</p></div>{{/if}}',
	CityFilterStyle: '.keyword_prompting_lhsl {position:relative;width:500px;overflow:hidden;border:1px solid #999999;background-color:#FFFFFF;color:#666666;zoom:1;}.keyword_prompting_lhsl .title {position:relative;height:26px;overflow:hidden;margin:0 0 5px;padding-right:40px;white-space:nowrap;text-overflow:ellipsis;line-height:26px;color:#999999;border-bottom:1px dashed #CCCCCC;border-right:10px solid #FFFFFF;border-left:10px solid #FFFFFF;background-color:#FFFFFF;z-index:2;}.keyword_prompting_lhsl .title em {font-style:normal;}.keyword_prompting_lhsl .no_result {padding:5px 50px 5px 10px;color:#BB0000;}.notfound_pop {padding-bottom:4px;}.notfound_pop .title {line-height:26px;overflow:hidden;margin:0 10px 4px;padding:0 2px;color:#c01111;border-bottom:0 none;}.notfound_pop .close {margin-top:2px;}.keyword_prompting_lhsl .sug_item {overflow:hidden;padding-bottom:5px;padding-top:5px;border-bottom:1px solid #ccc;*zoom:1;}.keyword_prompting_lhsl .sug_item a {position: relative;display:block;overflow:hidden;height: 26px;line-height: 26px;padding:0 180px 0 10px;white-space:nowrap;text-overflow:ellipsis;color:#333333;}.keyword_prompting_lhsl .sug_item .sug_category {position:absolute;top:0;right:5px;}.keyword_prompting_lhsl .sug_item .num {position:absolute;top:0;right:100px;color: #999;}.keyword_prompting_lhsl .sug_item a:hover .num, .keyword_prompting_lhsl .sug_item .hover .num {color: #eee;}.keyword_prompting_lhsl .sug_item a strong, .keyword_prompting_lhsl .sug_item a b {color:#06c;font-weight: 700;}.keyword_prompting_lhsl .sug_item a:hover, .keyword_prompting_lhsl .sug_item .hover {text-decoration:none;color:#FFFFFF;background-color:#72A1E1;}.keyword_prompting_lhsl .sug_item a:hover strong, .keyword_prompting_lhsl .sug_item .hover strong,.keyword_prompting_lhsl .sug_item a:hover b, .keyword_prompting_lhsl .sug_item .hover b {color:#fff;}.keyword_prompting_lhsl .icon,.keyword_prompting_lhsl .close {display:inline-block;width:20px;height:20px;overflow:hidden;vertical-align:middle;margin-left:5px;line-height:999em;font-size:0;content:"";background:url(http://pic.c-ctrip.com/corp_niv/ico_search_tag.png) no-repeat 0 0;z-index:4;}.keyword_prompting_lhsl .close {position:absolute;top:5px;right:5px;}.keyword_prompting_lhsl .close:hover {background-position:0 -32px;}.keyword_prompting_lhsl .icon_htl {background-position:-190px 0;}.keyword_prompting_lhsl .icon_city {background-position:-128px 0;}.keyword_prompting_lhsl .icon_areas {background-position:-160px 0;}.keyword_prompting_lhsl .icon_landmarks {background-position:-64px 0;}.keyword_prompting_lhsl .icon_airports {background-position:-32px 0;}.keyword_prompting_lhsl .icon_stations {background-position:-96px 0;}.keyword_prompting_lhsl a:hover .icon_htl, .keyword_prompting_lhsl .hover .icon_htl {background-position:-190px -32px;}.keyword_prompting_lhsl a:hover .icon_city, .keyword_prompting_lhsl .hover .icon_city {background-position:-128px -32px;}.keyword_prompting_lhsl a:hover .icon_areas, .keyword_prompting_lhsl .hover .icon_areas {background-position:-160px -32px;}.keyword_prompting_lhsl a:hover .icon_landmarks, .keyword_prompting_lhsl .hover .icon_landmarks {background-position:-64px -32px;}.keyword_prompting_lhsl a:hover .icon_airports, .keyword_prompting_lhsl a.hover .icon_airports {background-position:-32px -32px;}.keyword_prompting_lhsl a:hover .icon_stations, .keyword_prompting_lhsl .hover .icon_stations {background-position:-96px -32px;}.keyword_prompting_lhsl_mini {width: 338px;padding-bottom: 10px;}.keyword_prompting_lhsl .sug_item {padding: 0;border-bottom: none;}.keyword_prompting_lhsl_mini .sug_item a {padding-right: 10px;}.keyword_prompting_lhsl .c_page_mini {padding-top: 10px;text-align: center;font-size: 14px;}.keyword_prompting_lhsl .c_page_mini a {margin: 0 3px;text-decoration: underline;color: #06c;}.keyword_prompting_lhsl .c_page_mini .c_page_mini_current {color: #666;text-decoration: none;cursor: default;}.error_tips {width:317px;height:25px;overflow:hidden;line-height:25px;padding:0 10px;color:#BB0000;background-color:#FFFFFF;border:1px solid #7F9DB9;}'
});