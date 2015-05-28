(function(window, $) {
	var MOD = MOD || {};

	//control set
	(function() {
		//city
		MOD.cityControl = CUIControls.CityInit({
			city: '#txtCity',
			source: '../js/data/c_cityData.js'
		});
		//date
		MOD.dateControl = CUIControls.DateInit({
			start: '#start',
			end: '#end'
		});
	})();

	//模板 use
	(function() {
		var data = {
			PartInfo: [{
				AvgDiscount: 0.76,
				DepartName: "CNAUS",
				FullPerc: 0.039,
				IntMilAvgPrice: 0.74,
				Loss: 58314,
				LossRate: 0.004,
				Numbers: 9220,
				PreOrderdate: 1.3,
				Price: 13376335,
				RcRate: 0.054,
				Save: 2953850,
				SaveRate: 0.209
			}],
			TotalInfo: {
				TolAvgDiscount: 0.75,
				TolFullPer: 0.05,
				TolIntMilAvgPrice: 0.72,
				TolLoss: 304348,
				TolLossRate: 0.004,
				TolNumbers: 46800,
				TolPreOrderdate: 1.5,
				TolPrice: 65976813,
				TolRcRate: 0.07,
				TolSave: 15261972,
				TolSaveRate: 0.217
			}
		}
		$('#depDiv').html($.tmpl.render($('#departTmpl').html(), data));
	})();

	//tab
	(function() {
		$.mod.load('tab', '1.2', function() {
			var config = {
				options: {
					index: 1, //默认选中
					tab: "li", //切换的标签
					panel: "#content>div",
					trigger: "click", //切换触发条件
					second: 2, //若自动切换 设置时间
					ajax: true, //切换需要是否需要请求
					save: true
				},
				style: {
					tab: ['_current', '_nocurrent'],
					panel: {
						display: ['block', 'none']
							// backgroundColor:['#f00','#ccc']
					}
				},
				listeners: {
					returnTab: function(index, tab) {

					},
					initEventCallback: function(){
						//初始化回调
					}
				}
			}

			var configB = {
				options: {
					index: 4, //默认选中
					tab: "li", //切换的标签
					panel: false,
					trigger: "click", //切换触发条件
					second: 2, //若自动切换 设置时间
					ajax: true, //切换需要是否需要请求
					save: true
				},
				style: {
					tab: "selectd",
					panel: "show"
				},
				listeners: {
					returnTab: function(n) {}
				}
			}
			var ins = $('#tabs').regMod('tab', '1.2', config);
			var insB = $('#tabsB').regMod('tab', '1.2', configB);
		});

	})();
})(window, cQuery);

                <div class="list expand">
                    <div class="suplist">
                        <div style="clear:left;padding-left:25px;">
                            <div class="subgroup">
                                <a href="javascript:void(0);" title="${item.display}">111</a>
                                <a href="javascript:void(0);" title="${item.display}" data="">122</a>
                                <a href="javascript:void(0);" title="${item.display}" data="1|222|333">222</a>
                            </div>
                        </div>
                    </div>
                    <div class="sublist">
                        <div class="sublist-title" data-tag="collapse">
                            <span style="float:right;color:#1060c9">点击返回城市列表</span><b data-tag="title"></b>
                        </div>
                        <ul class="sublist-list" data-tag="content">
                            <li>
                                <a>1</a>
                            </li>
                            <li>
                                <a>2</a>
                            </li>
                        </ul>
                    </div>
                </div>



            <div class="ui-selector unselectable ui-jntselector in points-ltlb" style="z-index: 999;min-width: 290px; width: 740px;">\
                <div class="ui-selector-city" data-prevent-click="true" data-tab="tab">\
                    <div class="ui-tab">\
                        {{enum(key) data}}\
                            <a class="" data-tab="button">${key}</a>\
                        {{/enum}}\
                    </div>\
                    <div>\
                        {{enum(key, objs) data}}\
                            <div class="list">\
                                <div class="suplist">\
                                    {{enum(k, arr) objs}}\
                                        <div style="clear:left;padding-left:25px;">\
                                            {{if (k)}}<span class="alphabet">${k}</span>{{/if}}\
                                            <div class="subgroup">\
                                                {{each(index, item) arr}}\
                                                    <a href="javascript:void(0);" title="${item.display}" data="${item.data}">${item.display}</a>\
                                                {{/each}}\
                                            </div>\
                                        </div>\
                                    {{/enum}}\
                                </div>\
                            </div>\
                        {{/enum}}\
                    </div>\
                </div>\
            </div>',



{
	"status": "1",
	"count": "1175",
	"info": "OK",
	"suggestion": {
		"keywords": [],
		"cities": []
	},
	"pois": [{
		"id": "B00156NYOT",
		"tag": [],
		"name": "C&A(长风景畔广场店)",
		"type": "购物服务;服装鞋帽皮具店;品牌服装店",
		"typecode": "061101",
		"biz_type": [],
		"address": "大渡河路178号长风景畔广场F1-F2层",
		"location": "121.395065,31.222714",
		"tel": [],
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310107",
		"adname": "普陀区",
		"gridcode": "4621636121",
		"distance": [],
		"navi_poiid": "H51F010012_532159",
		"entr_location": "121.395027,31.221659",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "1",
		"indoor_data": {
			"cpid": "B00156E1IN",
			"floor": "1"
		},
		"groupbuy_num": "0",
		"business_area": "长风公园",
		"discount_num": "0",
		"biz_ext": {
			"rating": "3.5",
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B00155HUB5",
		"tag": [],
		"name": "a/b/c",
		"type": "公司企业;公司;公司",
		"typecode": "170200",
		"biz_type": [],
		"address": "打浦路398弄4东晖大厦衡辰商务楼3层317室",
		"location": "121.472272,31.197622",
		"tel": [],
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310101",
		"adname": "黄浦区",
		"gridcode": "4621633722",
		"distance": [],
		"navi_poiid": "H51F010012_59485",
		"entr_location": "121.472544,31.197749",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "鲁班路",
		"discount_num": "0",
		"biz_ext": {
			"rating": [],
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B00155IP6S",
		"tag": [],
		"name": "trading r&c",
		"type": "公司企业;公司;公司",
		"typecode": "170200",
		"biz_type": [],
		"address": "吴中路1079-1081灿虹聚富大厦西座503",
		"location": "121.386893,31.176921",
		"tel": [],
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310112",
		"adname": "闵行区",
		"gridcode": "4621631002",
		"distance": [],
		"navi_poiid": "H51F010012_62918",
		"entr_location": "121.387585,31.177200",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "虹桥",
		"discount_num": "0",
		"biz_ext": {
			"rating": [],
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B00155MZ5V",
		"tag": [],
		"name": "喜士多便利店(西康路)",
		"type": "购物服务;便民商店/便利店;便民商店/便利店",
		"typecode": "060200",
		"biz_type": [],
		"address": "长寿路360号102室",
		"location": "121.439042,31.242105",
		"tel": [],
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310107",
		"adname": "普陀区",
		"gridcode": "4621639500",
		"distance": [],
		"navi_poiid": "H51F010012_543821",
		"entr_location": "121.438787,31.242640",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "江宁路",
		"discount_num": "0",
		"biz_ext": {
			"rating": [],
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B00155M14U",
		"tag": "鸡腿饭,蜜汁南瓜,C&C三明治,三明治,咖啡,红烧鸡公,老母鸡汤,豉汁排骨",
		"name": "C&C餐厅酒吧",
		"type": "餐饮服务;休闲餐饮场所;休闲餐饮场所",
		"typecode": "050400",
		"biz_type": "diner",
		"address": "延安西路1066-3",
		"location": "121.431066,31.212011",
		"tel": "021-62260197;021-62130022",
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310105",
		"adname": "长宁区",
		"gridcode": "4621635411",
		"distance": [],
		"navi_poiid": "H51F010012_387136",
		"entr_location": "121.431188,31.211966",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "湖南路",
		"discount_num": "0",
		"biz_ext": {
			"rating": "3.5",
			"cost": "24.00",
			"meal_ordering": "0"
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B001556KM2",
		"tag": [],
		"name": "Luck",
		"type": "公司企业;公司;公司",
		"typecode": "170200",
		"biz_type": [],
		"address": "汉中路158号汉中广场16层1609",
		"location": "121.458120,31.242205",
		"tel": [],
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310108",
		"adname": "闸北区",
		"gridcode": "4621639601",
		"distance": [],
		"navi_poiid": "H51F010012_47995",
		"entr_location": "121.458738,31.241968",
		"exit_location": [],
		"match": "10",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "天目西路",
		"discount_num": "0",
		"biz_ext": {
			"rating": [],
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}, {
		"id": "B001579CKV",
		"tag": [],
		"name": "C9连锁公寓(田林店)",
		"type": "住宿服务;宾馆酒店;宾馆酒店",
		"typecode": "100100",
		"biz_type": "hotel",
		"address": "桂林路400号(电话错)",
		"location": "121.417477,31.169928",
		"tel": "021-51502000",
		"postcode": [],
		"website": [],
		"email": [],
		"pcode": "310000",
		"pname": "上海市",
		"citycode": "021",
		"cityname": "上海市",
		"adcode": "310104",
		"adname": "徐汇区",
		"gridcode": "4621630311",
		"distance": [],
		"navi_poiid": [],
		"entr_location": [],
		"exit_location": [],
		"match": "13",
		"recommend": "0",
		"timestamp": [],
		"alias": [],
		"indoor_map": "0",
		"indoor_data": {
			"cpid": [],
			"floor": []
		},
		"groupbuy_num": "0",
		"business_area": "田林",
		"discount_num": "0",
		"biz_ext": {
			"rating": [],
			"cost": []
		},
		"event": [],
		"photos": [],
		"children": []
	}]
}


jQuery18208473590202629566_1429161587975([{
	"key": "location",
	"text": "机场/火车站",
	"airports": [
		[1, "虹桥国际机场", "SHA", 121.347038, 31.195220],
		[1, "浦东国际机场", "PVG", 121.802932, 31.149839]
	],
	"stations": [
		[2, "上海南火车站", 1, 121.429483, 31.153312],
		[2, "上海火车站", 19, 121.455222, 31.248680],
		[2, "上海西火车站", 3155, 121.402952, 31.262510],
		[2, "上海虹桥火车站", 3156, 121.320895, 31.194245]
	]
}, {
	"key": "district",
	"text": "商圈",
	"items": [
		["2|h", "热门商圈"],
		[310101, "黄浦区"],
		[310104, "徐汇区"],
		[310105, "长宁区"],
		[310106, "静安区"],
		[310107, "普陀区"],
		[310108, "闸北区"],
		[310109, "虹口区"],
		[310110, "杨浦区"],
		[310112, "闵行区"],
		[310113, "宝山区"],
		[310114, "嘉定区"],
		[310115, "浦东新区"],
		[310116, "金山区"],
		[310117, "松江区"],
		[310118, "青浦区"],
		[310120, "奉贤区"],
		[310230, "崇明县"]
	],
	"zones": []
}, {
	"key": "metro",
	"text": "地铁",
	"items": [
		[18, "1号线"],
		[19, "2号线"],
		[20, "3号线"],
		[21, "4号线"],
		[22, "5号线"],
		[23, "6号线"],
		[24, "7号线"],
		[25, "8号线"],
		[26, "9号线"],
		[27, "10号线"],
		[28, "机场磁悬浮"],
		[16, "11号线"],
		[17, "13号线"],
		[15, "16号线"]
	]
}])

cQuery.jsonpResponse.suggestion = {
	"Hot": {
		"GroupName": "热门",
		"CityList": [{
			"Id": 1,
			"Name": "北京"
		}, {
			"Id": 2,
			"Name": "上海"
		}, {
			"Id": 3,
			"Name": "天津"
		}]
	},
	"CityGroupList": [{
		"GroupName": "BST",
		"SubGroupList": [{
			"Initial": "B",
			"CityList": [{
				"Id": 1,
				"Name": "北京"
			}]
		}, {
			"Initial": "S",
			"CityList": [{
				"Id": 2,
				"Name": "上海"
			}]
		}, {
			"Initial": "T",
			"CityList": [{
				"Id": 3,
				"Name": "天津"
			}]
		}]
	}]
};

