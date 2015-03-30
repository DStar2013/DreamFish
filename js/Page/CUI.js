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

	//
	(function() {

	})();


	var testInfo = [{Key:"1"},{Key:"2"},{Key:"3"}]


})(window, cQuery);