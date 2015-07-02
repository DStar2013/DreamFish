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

	//封装对象
	var Base = (function(){
		//
		var innerObj = function(a,b){
			this.a = a;
			this.b = b;

			return this;
		}

		var Control1 = function(innerObj){
			console.log(innerObj.a);
			console.log(innerObj.b);
		}

		var Control2 = function(innerObj){
			console.log(innerObj.a);

			console.log(innerObj.b);
		}


		return {
			innerObj:innerObj,
			Control1:Control1,
			Control2:Control2
		}

	})();


	//var p1 = Base.innerObj("obj1_a","obj1_b");
	//var p2 = Base.innerObj("obj2_a","obj2_b");
	var p1 = new Base.innerObj("obj1_a","obj1_b");
	var p2 = new Base.innerObj("obj2_a","obj2_b");

	var t1 = Base.Control1(p1);
	var t2 = Base.Control2(p2);


})(window, cQuery);
