(function ($) {
    //☆=================== var S ===================☆
    var _hotelCityInfo, //页面数据 
        _htlCityInfo, //城市名-城市id-金额-间夜-平均房价-东经-北纬
        _cityDetailInfo; //城市酒店详细信息
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //..高德地图
    var hotelCityMap = {
        _selType: "All",
        init: function () {
            hotelCityMap.drawDropSel();
            //
        },
        drawDropSel: function () {
            var _htlCityTypeSelID = $('#htlCityTypeSelID');

            _htlCityTypeSelID.empty();
            //判断是否有协议，会员酒店
            //全部-0，协议-1，会员-2
            if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "T") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelCity.js_All + '</label><label><input type="radio" name="option" value="1">' + corpReport_HotelCity.js_CorpHotels + '</label><label><input type="radio" name="option" value="2">' + corpReport_HotelCity.js_MemHotels + '</label>');
                hotelCityMap._selType = "All";
                //地图数据
                //hotelCityMap.mapSelect(_htlCityInfo.HtlAllInfo);
            } else if (_cfgInfo.HasMemHotelProduct == "F" && _cfgInfo.HasAgrHotelProduct == "T") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="1">' + corpReport_HotelCity.js_CorpHotels + '</label>');
                hotelCityMap._selType = "C";
                //
                //hotelCityMap.mapSelect(_htlCityInfo.HtlArgInfo);
            } else if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "F") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="2">' + corpReport_HotelCity.js_MemHotels + '</label>');
                hotelCityMap._selType = "M";
                //
                //hotelCityMap.mapSelect(_htlCityInfo.HtlMbrInfo);
            } else {
                _htlCityTypeSelID.css('display', 'none');
            }

            //ajax获取数据，绘制地图
            hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);

            //事件绑定
            _htlCityTypeSelID.find('input').unbind('click');
            _htlCityTypeSelID.find('input').bind('click', hotelCityMap.onDataClick);
        },
        _timeout: null,
        ajaxMapDataInfo: function (type) {
            var _ptDt = dpHeader.getHeadData();
            _ptDt.HtlType = type;
            window.clearTimeout(hotelCityMap._timeout);
            //
            hotelCityMap._timeout = window.setTimeout(function () {
                _htlCityInfo = {"HtlCityInfo":[{"Name":"北京","UID":"1","Price":342190,"NightPrice":620,"AvgPrice":552,"East":"116.4651","North":"39.9493"},{"Name":"上海","UID":"2","Price":213022,"NightPrice":375,"AvgPrice":568,"East":"121.4319","North":"31.1845"},{"Name":"广州","UID":"32","Price":89519,"NightPrice":158,"AvgPrice":567,"East":"113.3956","North":"23.1241"},{"Name":"深圳","UID":"30","Price":87610,"NightPrice":149,"AvgPrice":588,"East":"114.1026","North":"22.5404"},{"Name":"大连","UID":"6","Price":47122,"NightPrice":146,"AvgPrice":323,"East":"121.6556","North":"38.9205"},{"Name":"杭州","UID":"17","Price":64831,"NightPrice":144,"AvgPrice":450,"East":"120.0517","North":"30.2783"},{"Name":"东莞","UID":"223","Price":48601,"NightPrice":125,"AvgPrice":389,"East":"113.7415","North":"23.0201"},{"Name":"成都","UID":"28","Price":42269,"NightPrice":98,"AvgPrice":431,"East":"103.9594","North":"30.5747"},{"Name":"南京","UID":"12","Price":30862,"NightPrice":77,"AvgPrice":401,"East":"118.7837","North":"32.0711"},{"Name":"海口","UID":"42","Price":24681,"NightPrice":67,"AvgPrice":368,"East":"110.3644","North":"19.9883"},{"Name":"苏州","UID":"14","Price":29584,"NightPrice":66,"AvgPrice":448,"East":"120.7211","North":"31.2607"},{"Name":"长春","UID":"158","Price":25412,"NightPrice":60,"AvgPrice":424,"East":"125.3620","North":"43.8640"},{"Name":"郑州","UID":"559","Price":25424,"NightPrice":60,"AvgPrice":424,"East":"113.6437","North":"34.7193"},{"Name":"重庆","UID":"4","Price":24651,"NightPrice":56,"AvgPrice":440,"East":"106.4611","North":"29.5550"},{"Name":"西安","UID":"10","Price":24657,"NightPrice":51,"AvgPrice":483,"East":"108.9325","North":"34.2401"},{"Name":"合肥","UID":"278","Price":22143,"NightPrice":50,"AvgPrice":443,"East":"117.2723","North":"31.8795"},{"Name":"西宁","UID":"124","Price":13470,"NightPrice":49,"AvgPrice":275,"East":"101.7645","North":"36.6173"},{"Name":"沈阳","UID":"451","Price":20078,"NightPrice":48,"AvgPrice":418,"East":"123.4264","North":"41.7712"},{"Name":"兰州","UID":"100","Price":14594,"NightPrice":48,"AvgPrice":304,"East":"103.8517","North":"36.0507"},{"Name":"天津","UID":"3","Price":14472,"NightPrice":46,"AvgPrice":315,"East":"117.1972","North":"39.1960"},{"Name":"长沙","UID":"206","Price":21388,"NightPrice":45,"AvgPrice":475,"East":"112.9831","North":"28.1730"},{"Name":"南宁","UID":"380","Price":14886,"NightPrice":44,"AvgPrice":338,"East":"108.3075","North":"22.7945"},{"Name":"济南","UID":"144","Price":18304,"NightPrice":42,"AvgPrice":436,"East":"117.0371","North":"36.6601"},{"Name":"宁波","UID":"375","Price":19410,"NightPrice":41,"AvgPrice":473,"East":"121.5950","North":"29.8493"},{"Name":"福州","UID":"258","Price":19046,"NightPrice":40,"AvgPrice":476,"East":"119.3055","North":"26.0987"},{"Name":"石家庄","UID":"428","Price":12133,"NightPrice":40,"AvgPrice":303,"East":"114.5461","North":"38.0230"},{"Name":"武汉","UID":"477","Price":19955,"NightPrice":40,"AvgPrice":499,"East":"114.1741","North":"30.5066"},{"Name":"桂林","UID":"33","Price":10381,"NightPrice":33,"AvgPrice":315,"East":"110.3039","North":"25.3002"},{"Name":"哈尔滨","UID":"5","Price":11805,"NightPrice":30,"AvgPrice":394,"East":"126.6686","North":"45.7132"},{"Name":"义乌","UID":"536","Price":10175,"NightPrice":29,"AvgPrice":351,"East":"120.1040","North":"29.3224"},{"Name":"青岛","UID":"7","Price":8050,"NightPrice":29,"AvgPrice":278,"East":"120.4486","North":"36.1091"},{"Name":"潍坊","UID":"475","Price":7090,"NightPrice":29,"AvgPrice":244,"East":"119.1000","North":"36.7017"},{"Name":"银川","UID":"99","Price":6614,"NightPrice":25,"AvgPrice":265,"East":"106.2593","North":"38.4595"},{"Name":"珠海","UID":"31","Price":10452,"NightPrice":24,"AvgPrice":436,"East":"113.5291","North":"22.2451"},{"Name":"阜阳","UID":"257","Price":6496,"NightPrice":24,"AvgPrice":271,"East":"115.8274","North":"32.8988"},{"Name":"营口","UID":"1300","Price":6424,"NightPrice":22,"AvgPrice":292,"East":"122.0998","North":"40.2303"},{"Name":"宜宾","UID":"514","Price":5910,"NightPrice":22,"AvgPrice":269,"East":"104.6145","North":"28.7607"},{"Name":"汕头","UID":"447","Price":7332,"NightPrice":21,"AvgPrice":349,"East":"116.6976","North":"23.3594"},{"Name":"邯郸","UID":"275","Price":5128,"NightPrice":21,"AvgPrice":244,"East":"114.4727","North":"36.6158"},{"Name":"厦门","UID":"25","Price":6818,"NightPrice":21,"AvgPrice":325,"East":"118.1561","North":"24.5254"},{"Name":"安庆","UID":"177","Price":5906,"NightPrice":20,"AvgPrice":295,"East":"116.9803","North":"30.6156"},{"Name":"无锡","UID":"13","Price":8437,"NightPrice":20,"AvgPrice":422,"East":"120.1195","North":"31.4618"},{"Name":"贵阳","UID":"38","Price":8723,"NightPrice":19,"AvgPrice":459,"East":"106.7070","North":"26.5540"},{"Name":"淮安","UID":"577","Price":6440,"NightPrice":19,"AvgPrice":339,"East":"119.0318","North":"33.5984"},{"Name":"南昌","UID":"376","Price":6262,"NightPrice":18,"AvgPrice":348,"East":"115.9190","North":"28.6796"},{"Name":"昆明","UID":"34","Price":8180,"NightPrice":18,"AvgPrice":454,"East":"102.7227","North":"25.0642"},{"Name":"太原","UID":"105","Price":9054,"NightPrice":18,"AvgPrice":503,"East":"112.5831","North":"37.8606"},{"Name":"泉州","UID":"406","Price":7200,"NightPrice":18,"AvgPrice":400,"East":"118.6353","North":"24.8760"},{"Name":"象山","UID":"1823","Price":7760,"NightPrice":17,"AvgPrice":456,"East":"121.9020","North":"29.4749"},{"Name":"台州","UID":"578","Price":5767,"NightPrice":16,"AvgPrice":360,"East":"121.4324","North":"28.6698"},{"Name":"温州","UID":"491","Price":6948,"NightPrice":15,"AvgPrice":463,"East":"120.6379","North":"28.0047"},{"Name":"清远","UID":"1422","Price":8530,"NightPrice":15,"AvgPrice":569,"East":"113.0173","North":"23.6244"},{"Name":"开平","UID":"335","Price":4320,"NightPrice":15,"AvgPrice":288,"East":"112.6968","North":"22.3847"},{"Name":"湛江","UID":"547","Price":4434,"NightPrice":15,"AvgPrice":296,"East":"110.3957","North":"21.2108"},{"Name":"瑞安","UID":"408","Price":4754,"NightPrice":15,"AvgPrice":317,"East":"120.6575","North":"27.7766"},{"Name":"临沂","UID":"569","Price":4736,"NightPrice":15,"AvgPrice":316,"East":"118.3418","North":"35.0549"},{"Name":"齐齐哈尔","UID":"149","Price":2100,"NightPrice":14,"AvgPrice":150,"East":"123.9695","North":"47.3447"},{"Name":"韶关","UID":"422","Price":3102,"NightPrice":14,"AvgPrice":222,"East":"113.7589","North":"25.0454"},{"Name":"金华","UID":"308","Price":4525,"NightPrice":14,"AvgPrice":323,"East":"119.6537","North":"29.1112"},{"Name":"湖州","UID":"86","Price":6613,"NightPrice":14,"AvgPrice":472,"East":"120.1037","North":"30.8753"},{"Name":"绍兴","UID":"22","Price":5659,"NightPrice":14,"AvgPrice":404,"East":"120.8934","North":"30.0354"},{"Name":"梅州","UID":"3053","Price":4232,"NightPrice":14,"AvgPrice":302,"East":"116.0809","North":"24.2766"},{"Name":"嘉兴","UID":"571","Price":8202,"NightPrice":14,"AvgPrice":586,"East":"120.7179","North":"30.7644"},{"Name":"连云港","UID":"353","Price":4109,"NightPrice":13,"AvgPrice":316,"East":"119.1874","North":"34.5918"},{"Name":"西昌","UID":"494","Price":2793,"NightPrice":13,"AvgPrice":215,"East":"102.2348","North":"27.8877"},{"Name":"延吉","UID":"523","Price":2214,"NightPrice":13,"AvgPrice":170,"East":"129.5214","North":"42.8996"},{"Name":"保定","UID":"185","Price":3413,"NightPrice":13,"AvgPrice":263,"East":"115.4686","North":"38.8697"},{"Name":"宜昌","UID":"515","Price":2584,"NightPrice":12,"AvgPrice":215,"East":"111.2870","North":"30.6960"},{"Name":"烟台","UID":"533","Price":3691,"NightPrice":12,"AvgPrice":308,"East":"121.4142","North":"37.5370"},{"Name":"肇庆","UID":"552","Price":3406,"NightPrice":12,"AvgPrice":284,"East":"112.4721","North":"23.0545"},{"Name":"邢台","UID":"947","Price":2862,"NightPrice":12,"AvgPrice":238,"East":"114.4940","North":"37.0622"},{"Name":"南通","UID":"82","Price":4492,"NightPrice":12,"AvgPrice":374,"East":"120.8612","North":"32.0239"},{"Name":"嘉善","UID":"596","Price":4176,"NightPrice":12,"AvgPrice":348,"East":"120.8948","North":"30.9512"},{"Name":"赣州","UID":"268","Price":3590,"NightPrice":12,"AvgPrice":299,"East":"114.9625","North":"25.8166"},{"Name":"锦州","UID":"327","Price":4332,"NightPrice":11,"AvgPrice":394,"East":"121.1180","North":"41.0928"},{"Name":"宣城","UID":"1006","Price":3168,"NightPrice":11,"AvgPrice":288,"East":"118.5530","North":"30.0197"},{"Name":"荆州","UID":"328","Price":2649,"NightPrice":11,"AvgPrice":241,"East":"112.2452","North":"30.3157"},{"Name":"徐州","UID":"512","Price":2981,"NightPrice":10,"AvgPrice":298,"East":"117.1718","North":"34.2646"},{"Name":"赤峰","UID":"202","Price":3120,"NightPrice":10,"AvgPrice":312,"East":"118.9002","North":"42.2629"},{"Name":"阜新","UID":"254","Price":1366,"NightPrice":10,"AvgPrice":137,"East":"121.6367","North":"41.9912"},{"Name":"丹东","UID":"221","Price":1726,"NightPrice":10,"AvgPrice":173,"East":"124.3877","North":"40.1151"},{"Name":"沧州","UID":"216","Price":2625,"NightPrice":10,"AvgPrice":262,"East":"117.7776","North":"38.2707"},{"Name":"聊城","UID":"1071","Price":2480,"NightPrice":10,"AvgPrice":248,"East":"116.0343","North":"36.4580"},{"Name":"秦皇岛","UID":"147","Price":2096,"NightPrice":10,"AvgPrice":210,"East":"119.5649","North":"39.9235"},{"Name":"天水","UID":"464","Price":2470,"NightPrice":9,"AvgPrice":274,"East":"105.7290","North":"34.5837"},{"Name":"龙岩","UID":"348","Price":2342,"NightPrice":9,"AvgPrice":260,"East":"116.4273","North":"25.0612"},{"Name":"滨州","UID":"1820","Price":1970,"NightPrice":9,"AvgPrice":219,"East":"117.9945","North":"37.3705"},{"Name":"潮州","UID":"215","Price":2815,"NightPrice":9,"AvgPrice":313,"East":"116.6446","North":"23.6613"},{"Name":"达州","UID":"1233","Price":1387,"NightPrice":9,"AvgPrice":154,"East":"107.2048","North":"30.7362"},{"Name":"洛阳","UID":"350","Price":2865,"NightPrice":9,"AvgPrice":318,"East":"112.4354","North":"34.6596"},{"Name":"济宁","UID":"318","Price":1995,"NightPrice":9,"AvgPrice":222,"East":"116.7003","North":"35.4237"},{"Name":"廊坊","UID":"340","Price":1667,"NightPrice":9,"AvgPrice":185,"East":"116.7288","North":"39.5178"},{"Name":"呼和浩特","UID":"103","Price":3408,"NightPrice":9,"AvgPrice":379,"East":"111.6801","North":"40.8150"},{"Name":"周口","UID":"3221","Price":1680,"NightPrice":9,"AvgPrice":187,"East":"115.1007","North":"33.4094"},{"Name":"内江","UID":"1597","Price":1375,"NightPrice":8,"AvgPrice":172,"East":"105.0578","North":"29.5703"},{"Name":"株洲","UID":"601","Price":2309,"NightPrice":8,"AvgPrice":289,"East":"113.1337","North":"27.8827"},{"Name":"常州","UID":"213","Price":2127,"NightPrice":8,"AvgPrice":266,"East":"119.9770","North":"31.8294"},{"Name":"南充","UID":"377","Price":1846,"NightPrice":8,"AvgPrice":231,"East":"106.0872","North":"30.7832"},{"Name":"威海","UID":"479","Price":2347,"NightPrice":7,"AvgPrice":335,"East":"122.1555","North":"37.5247"},{"Name":"佛山","UID":"251","Price":1201,"NightPrice":7,"AvgPrice":172,"East":"113.1557","North":"23.0278"},{"Name":"攀枝花","UID":"1097","Price":1688,"NightPrice":7,"AvgPrice":241,"East":"101.9351","North":"26.5298"},{"Name":"葫芦岛","UID":"1050","Price":938,"NightPrice":7,"AvgPrice":134,"East":"120.7258","North":"40.6156"},{"Name":"黄山","UID":"23","Price":3594,"NightPrice":7,"AvgPrice":513,"East":"118.2658","North":"29.7497"},{"Name":"鞍山","UID":"178","Price":1260,"NightPrice":7,"AvgPrice":180,"East":"123.0144","North":"41.1213"},{"Name":"德阳","UID":"237","Price":2506,"NightPrice":7,"AvgPrice":358,"East":"104.3876","North":"31.1307"},{"Name":"黄石","UID":"292","Price":1485,"NightPrice":7,"AvgPrice":212,"East":"115.0438","North":"30.1988"},{"Name":"常熟","UID":"96","Price":1998,"NightPrice":6,"AvgPrice":333,"East":"120.7553","North":"31.6646"},{"Name":"惠州","UID":"299","Price":4022,"NightPrice":6,"AvgPrice":670,"East":"114.3660","North":"23.0342"},{"Name":"广元","UID":"267","Price":1428,"NightPrice":6,"AvgPrice":238,"East":"105.7153","North":"32.4711"},{"Name":"香港","UID":"58","Price":9697,"NightPrice":6,"AvgPrice":1616,"East":"114.1766","North":"22.3050"},{"Name":"襄阳","UID":"496","Price":928,"NightPrice":6,"AvgPrice":155,"East":"112.1427","North":"32.0642"},{"Name":"遂宁","UID":"1371","Price":1146,"NightPrice":6,"AvgPrice":191,"East":"105.5853","North":"30.4981"},{"Name":"盐城","UID":"1200","Price":1841,"NightPrice":6,"AvgPrice":307,"East":"120.1504","North":"33.3640"},{"Name":"包头","UID":"141","Price":1506,"NightPrice":6,"AvgPrice":251,"East":"109.8072","North":"40.6649"},{"Name":"中山","UID":"553","Price":2620,"NightPrice":6,"AvgPrice":437,"East":"113.4854","North":"22.6239"},{"Name":"驻马店","UID":"551","Price":883,"NightPrice":6,"AvgPrice":147,"East":"114.0367","North":"32.9855"},{"Name":"承德","UID":"562","Price":1617,"NightPrice":6,"AvgPrice":270,"East":"117.8216","North":"40.9766"},{"Name":"孝感","UID":"1490","Price":1648,"NightPrice":6,"AvgPrice":275,"East":"113.9187","North":"30.9357"},{"Name":"巩义","UID":"958","Price":2308,"NightPrice":6,"AvgPrice":385,"East":"112.9830","North":"34.7567"},{"Name":"镇江","UID":"16","Price":2010,"NightPrice":6,"AvgPrice":335,"East":"119.4658","North":"32.1984"},{"Name":"丽江","UID":"37","Price":3400,"NightPrice":5,"AvgPrice":680,"East":"100.2076","North":"26.9179"},{"Name":"景德镇","UID":"305","Price":971,"NightPrice":5,"AvgPrice":194,"East":"117.2168","North":"29.2962"},{"Name":"十堰","UID":"452","Price":933,"NightPrice":5,"AvgPrice":187,"East":"110.7996","North":"32.6427"},{"Name":"牡丹江","UID":"150","Price":1670,"NightPrice":5,"AvgPrice":334,"East":"129.4031","North":"44.5955"},{"Name":"宿州","UID":"521","Price":1944,"NightPrice":5,"AvgPrice":389,"East":"116.9501","North":"33.6671"},{"Name":"三亚","UID":"43","Price":3411,"NightPrice":5,"AvgPrice":682,"East":"109.6210","North":"18.2409"},{"Name":"唐山","UID":"468","Price":1057,"NightPrice":5,"AvgPrice":211,"East":"118.1684","North":"39.8179"},{"Name":"兴义","UID":"1139","Price":960,"NightPrice":5,"AvgPrice":192,"East":"104.9165","North":"25.0931"},{"Name":"岳阳","UID":"539","Price":1490,"NightPrice":5,"AvgPrice":298,"East":"113.1276","North":"29.3576"},{"Name":"萍乡","UID":"1840","Price":1990,"NightPrice":5,"AvgPrice":398,"East":"113.8516","North":"27.6215"},{"Name":"扬州","UID":"15","Price":1502,"NightPrice":5,"AvgPrice":300,"East":"119.4228","North":"32.4116"},{"Name":"莆田","UID":"667","Price":962,"NightPrice":5,"AvgPrice":192,"East":"119.0077","North":"25.4601"},{"Name":"滁州","UID":"214","Price":1350,"NightPrice":5,"AvgPrice":270,"East":"118.3443","North":"32.2733"},{"Name":"娄底","UID":"918","Price":1279,"NightPrice":5,"AvgPrice":256,"East":"112.0269","North":"27.7395"},{"Name":"汉中","UID":"129","Price":734,"NightPrice":5,"AvgPrice":147,"East":"107.0248","North":"33.0763"},{"Name":"铜陵","UID":"459","Price":1552,"NightPrice":4,"AvgPrice":388,"East":"117.8236","North":"30.9216"},{"Name":"新乡","UID":"507","Price":1114,"NightPrice":4,"AvgPrice":278,"East":"113.9272","North":"35.3074"},{"Name":"舟山","UID":"19","Price":1622,"NightPrice":4,"AvgPrice":406,"East":"122.3006","North":"29.9434"},{"Name":"九江","UID":"24","Price":1253,"NightPrice":4,"AvgPrice":313,"East":"115.9701","North":"29.5626"},{"Name":"绵阳","UID":"370","Price":829,"NightPrice":4,"AvgPrice":207,"East":"104.7807","North":"31.4719"},{"Name":"蚌埠","UID":"182","Price":892,"NightPrice":4,"AvgPrice":223,"East":"117.3388","North":"32.9173"},{"Name":"本溪","UID":"1155","Price":1398,"NightPrice":4,"AvgPrice":350,"East":"123.7613","North":"41.2992"},{"Name":"芜湖","UID":"478","Price":1252,"NightPrice":4,"AvgPrice":313,"East":"118.3624","North":"31.3275"},{"Name":"东台","UID":"3233","Price":802,"NightPrice":4,"AvgPrice":200,"East":"120.3142","North":"32.8630"},{"Name":"武夷山","UID":"26","Price":1194,"NightPrice":4,"AvgPrice":298,"East":"117.9826","North":"27.6505"},{"Name":"眉山","UID":"1148","Price":994,"NightPrice":4,"AvgPrice":248,"East":"103.8350","North":"30.0490"},{"Name":"阳江","UID":"692","Price":1082,"NightPrice":4,"AvgPrice":270,"East":"111.9595","North":"21.8614"},{"Name":"钦州","UID":"1899","Price":1612,"NightPrice":4,"AvgPrice":403,"East":"109.5573","North":"22.2781"},{"Name":"张家港","UID":"621","Price":943,"NightPrice":4,"AvgPrice":236,"East":"120.5626","North":"31.8482"},{"Name":"乌兰察布","UID":"7518","Price":712,"NightPrice":4,"AvgPrice":178,"East":"113.1809","North":"40.9965"},{"Name":"昆山","UID":"83","Price":1872,"NightPrice":4,"AvgPrice":468,"East":"120.9832","North":"31.3979"},{"Name":"宿迁","UID":"1472","Price":536,"NightPrice":3,"AvgPrice":179,"East":"118.3063","North":"33.9405"},{"Name":"揭阳","UID":"956","Price":720,"NightPrice":3,"AvgPrice":240,"East":"116.2955","North":"23.0279"},{"Name":"松滋","UID":"1558","Price":420,"NightPrice":3,"AvgPrice":140,"East":"111.7767","North":"30.1829"},{"Name":"张家口","UID":"550","Price":526,"NightPrice":3,"AvgPrice":175,"East":"114.9139","North":"40.8230"},{"Name":"宜春","UID":"518","Price":1134,"NightPrice":3,"AvgPrice":378,"East":"115.1911","North":"28.9507"},{"Name":"鸡西","UID":"157","Price":1044,"NightPrice":3,"AvgPrice":348,"East":"130.9549","North":"45.2841"},{"Name":"茂名","UID":"1105","Price":987,"NightPrice":3,"AvgPrice":329,"East":"110.9095","North":"21.6695"},{"Name":"遵义","UID":"558","Price":636,"NightPrice":3,"AvgPrice":212,"East":"106.9368","North":"27.7145"},{"Name":"石首","UID":"21442","Price":504,"NightPrice":3,"AvgPrice":168,"East":"112.4100","North":"29.7050"},{"Name":"上饶","UID":"411","Price":1164,"NightPrice":3,"AvgPrice":388,"East":"117.9284","North":"28.4368"},{"Name":"琼海","UID":"52","Price":1088,"NightPrice":3,"AvgPrice":363,"East":"110.5698","North":"19.1577"},{"Name":"宁德","UID":"378","Price":634,"NightPrice":3,"AvgPrice":211,"East":"119.5324","North":"26.6567"},{"Name":"衡阳","UID":"297","Price":1130,"NightPrice":3,"AvgPrice":377,"East":"112.6017","North":"26.9095"},{"Name":"柳州","UID":"354","Price":914,"NightPrice":3,"AvgPrice":305,"East":"109.2499","North":"25.0635"},{"Name":"南阳","UID":"385","Price":539,"NightPrice":3,"AvgPrice":180,"East":"112.5452","North":"33.0148"},{"Name":"六盘水","UID":"605","Price":774,"NightPrice":3,"AvgPrice":258,"East":"104.8395","North":"26.5875"},{"Name":"瓦房店","UID":"966","Price":475,"NightPrice":3,"AvgPrice":158,"East":"122.0024","North":"39.6222"},{"Name":"淄博","UID":"542","Price":692,"NightPrice":3,"AvgPrice":231,"East":"118.0801","North":"36.7904"},{"Name":"朝阳","UID":"211","Price":354,"NightPrice":3,"AvgPrice":118,"East":"120.4437","North":"41.5792"},{"Name":"泰安","UID":"454","Price":676,"NightPrice":3,"AvgPrice":225,"East":"117.0811","North":"36.1847"},{"Name":"乾县","UID":"21703","Price":774,"NightPrice":3,"AvgPrice":258,"East":"108.3021","North":"34.5511"},{"Name":"庄河","UID":"1646","Price":481,"NightPrice":3,"AvgPrice":160,"East":"122.9594","North":"39.7036"},{"Name":"吉林","UID":"159","Price":1140,"NightPrice":3,"AvgPrice":380,"East":"126.5506","North":"43.9033"},{"Name":"漳州","UID":"560","Price":552,"NightPrice":3,"AvgPrice":184,"East":"117.9147","North":"24.1825"},{"Name":"当阳","UID":"1122","Price":880,"NightPrice":3,"AvgPrice":293,"East":"111.8148","North":"30.8413"},{"Name":"玉林","UID":"1113","Price":884,"NightPrice":3,"AvgPrice":295,"East":"110.1552","North":"22.6012"},{"Name":"仙桃","UID":"1882","Price":656,"NightPrice":3,"AvgPrice":219,"East":"113.4454","North":"30.3671"},{"Name":"怀化","UID":"282","Price":806,"NightPrice":3,"AvgPrice":269,"East":"109.9750","North":"27.5534"},{"Name":"寿光","UID":"3863","Price":407,"NightPrice":3,"AvgPrice":136,"East":"118.7633","North":"36.8690"},{"Name":"通山","UID":"21966","Price":608,"NightPrice":3,"AvgPrice":203,"East":"114.4989","North":"29.6052"},{"Name":"溧阳","UID":"1358","Price":580,"NightPrice":2,"AvgPrice":290,"East":"119.4597","North":"31.3828"},{"Name":"诸暨","UID":"548","Price":696,"NightPrice":2,"AvgPrice":348,"East":"120.2598","North":"29.7103"},{"Name":"公安","UID":"20876","Price":508,"NightPrice":2,"AvgPrice":254,"East":"112.2181","North":"30.0558"},{"Name":"澳门","UID":"59","Price":1708,"NightPrice":2,"AvgPrice":854,"East":"113.5702","North":"22.1437"},{"Name":"雅安","UID":"3277","Price":356,"NightPrice":2,"AvgPrice":178,"East":"103.0812","North":"30.1760"},{"Name":"抚州","UID":"3884","Price":336,"NightPrice":2,"AvgPrice":168,"East":"116.3580","North":"27.9964"},{"Name":"佳木斯","UID":"317","Price":396,"NightPrice":2,"AvgPrice":198,"East":"130.3592","North":"46.8135"},{"Name":"武义","UID":"959","Price":792,"NightPrice":2,"AvgPrice":396,"East":"119.4890","North":"28.6704"},{"Name":"凯里","UID":"333","Price":696,"NightPrice":2,"AvgPrice":348,"East":"108.9051","North":"25.7412"},{"Name":"桐乡","UID":"580","Price":1076,"NightPrice":2,"AvgPrice":538,"East":"120.6257","North":"30.6652"},{"Name":"衡水","UID":"290","Price":796,"NightPrice":2,"AvgPrice":398,"East":"115.6962","North":"37.7412"},{"Name":"乐山","UID":"345","Price":448,"NightPrice":2,"AvgPrice":224,"East":"103.7477","North":"29.5942"},{"Name":"简阳","UID":"7744","Price":296,"NightPrice":2,"AvgPrice":148,"East":"104.5474","North":"30.3946"},{"Name":"普洱","UID":"3996","Price":676,"NightPrice":2,"AvgPrice":338,"East":"100.9732","North":"22.7669"},{"Name":"张家界","UID":"27","Price":586,"NightPrice":2,"AvgPrice":293,"East":"110.4565","North":"29.3712"},{"Name":"大庆","UID":"231","Price":528,"NightPrice":2,"AvgPrice":264,"East":"125.0925","North":"46.5950"},{"Name":"河源","UID":"693","Price":588,"NightPrice":2,"AvgPrice":294,"East":"114.9767","North":"23.8306"},{"Name":"梧州","UID":"492","Price":588,"NightPrice":2,"AvgPrice":294,"East":"111.0003","North":"22.9209"},{"Name":"广水","UID":"21818","Price":296,"NightPrice":2,"AvgPrice":148,"East":"113.8273","North":"31.6157"},{"Name":"安吉","UID":"659","Price":800,"NightPrice":2,"AvgPrice":400,"East":"119.6635","North":"30.5873"},{"Name":"随州","UID":"1117","Price":358,"NightPrice":2,"AvgPrice":179,"East":"113.2991","North":"31.8744"},{"Name":"江门","UID":"316","Price":708,"NightPrice":2,"AvgPrice":354,"East":"113.0487","North":"22.5058"},{"Name":"哈密市","UID":"285","Price":536,"NightPrice":2,"AvgPrice":268,"East":"93.4746","North":"42.7458"},{"Name":"淮南","UID":"287","Price":656,"NightPrice":2,"AvgPrice":328,"East":"116.8210","North":"32.7825"},{"Name":"常德","UID":"201","Price":646,"NightPrice":2,"AvgPrice":323,"East":"111.4831","North":"28.9048"},{"Name":"六安","UID":"1705","Price":556,"NightPrice":2,"AvgPrice":278,"East":"115.8055","North":"31.2015"},{"Name":"苍南","UID":"7666","Price":700,"NightPrice":2,"AvgPrice":350,"East":"120.5449","North":"27.5822"},{"Name":"兰溪","UID":"597","Price":736,"NightPrice":2,"AvgPrice":368,"East":"119.4785","North":"29.2128"},{"Name":"安顺","UID":"179","Price":378,"NightPrice":2,"AvgPrice":189,"East":"105.9521","North":"26.2506"},{"Name":"迁安","UID":"2230","Price":660,"NightPrice":2,"AvgPrice":330,"East":"118.7182","North":"40.0083"},{"Name":"安康","UID":"171","Price":426,"NightPrice":2,"AvgPrice":213,"East":"109.0228","North":"32.6819"},{"Name":"织金","UID":"21436","Price":656,"NightPrice":2,"AvgPrice":328,"East":"105.7711","North":"26.6735"},{"Name":"南平","UID":"606","Price":510,"NightPrice":2,"AvgPrice":255,"East":"118.1765","North":"26.6329"},{"Name":"泸州","UID":"355","Price":296,"NightPrice":2,"AvgPrice":148,"East":"105.4539","North":"28.8920"},{"Name":"定西","UID":"1021","Price":340,"NightPrice":2,"AvgPrice":170,"East":"104.6293","North":"35.5801"},{"Name":"盘锦","UID":"387","Price":736,"NightPrice":2,"AvgPrice":368,"East":"122.0521","North":"41.1951"},{"Name":"都匀","UID":"975","Price":718,"NightPrice":2,"AvgPrice":359,"East":"107.5141","North":"26.2737"},{"Name":"商洛","UID":"7551","Price":378,"NightPrice":2,"AvgPrice":189,"East":"109.9279","North":"33.8745"},{"Name":"武威","UID":"664","Price":302,"NightPrice":2,"AvgPrice":151,"East":"102.6279","North":"37.9278"},{"Name":"大石桥","UID":"967","Price":636,"NightPrice":2,"AvgPrice":318,"East":"113.6551","North":"34.7653"},{"Name":"曲阳","UID":"21964","Price":640,"NightPrice":2,"AvgPrice":320,"East":"114.7091","North":"38.6214"},{"Name":"平湖","UID":"1206","Price":676,"NightPrice":2,"AvgPrice":338,"East":"121.0120","North":"30.6867"},{"Name":"蒲城","UID":"1946","Price":376,"NightPrice":2,"AvgPrice":188,"East":"109.5997","North":"34.9535"},{"Name":"安龙","UID":"2465","Price":168,"NightPrice":1,"AvgPrice":168,"East":"105.4724","North":"25.1076"},{"Name":"巫溪","UID":"21822","Price":248,"NightPrice":1,"AvgPrice":248,"East":"109.6239","North":"31.3980"},{"Name":"益阳","UID":"1125","Price":248,"NightPrice":1,"AvgPrice":248,"East":"112.3526","North":"28.5792"},{"Name":"潜山","UID":"21140","Price":228,"NightPrice":1,"AvgPrice":228,"East":"116.5435","North":"30.6477"},{"Name":"云浮","UID":"3933","Price":488,"NightPrice":1,"AvgPrice":488,"East":"112.2339","North":"22.7155"},{"Name":"奉节","UID":"20884","Price":278,"NightPrice":1,"AvgPrice":278,"East":"109.4714","North":"31.0172"},{"Name":"巫山","UID":"21472","Price":206,"NightPrice":1,"AvgPrice":206,"East":"109.8834","North":"31.0769"},{"Name":"乐清","UID":"732","Price":245,"NightPrice":1,"AvgPrice":245,"East":"121.1434","North":"28.3585"},{"Name":"密山","UID":"1609","Price":168,"NightPrice":1,"AvgPrice":168,"East":"131.8760","North":"45.5468"},{"Name":"大英","UID":"2552","Price":208,"NightPrice":1,"AvgPrice":208,"East":"105.2346","North":"30.5960"},{"Name":"乐平","UID":"1089","Price":178,"NightPrice":1,"AvgPrice":178,"East":"117.1456","North":"28.9592"},{"Name":"铜仁","UID":"22033","Price":328,"NightPrice":1,"AvgPrice":328,"East":"109.1913","North":"27.7384"},{"Name":"大同","UID":"136","Price":199,"NightPrice":1,"AvgPrice":199,"East":"113.2738","North":"40.0688"},{"Name":"咸阳","UID":"111","Price":161,"NightPrice":1,"AvgPrice":161,"East":"108.6779","North":"34.3299"},{"Name":"七台河","UID":"1599","Price":159,"NightPrice":1,"AvgPrice":159,"East":"130.5717","North":"45.7524"},{"Name":"垫江","UID":"21700","Price":176,"NightPrice":1,"AvgPrice":176,"East":"107.3466","North":"30.3271"},{"Name":"奉化","UID":"87","Price":142,"NightPrice":1,"AvgPrice":142,"East":"121.4140","North":"29.6707"},{"Name":"乳山","UID":"7554","Price":300,"NightPrice":1,"AvgPrice":300,"East":"121.5583","North":"36.9067"},{"Name":"平顶山","UID":"3222","Price":128,"NightPrice":1,"AvgPrice":128,"East":"113.3445","North":"33.7498"},{"Name":"北海","UID":"189","Price":398,"NightPrice":1,"AvgPrice":398,"East":"109.1508","North":"21.4181"},{"Name":"仁寿","UID":"22001","Price":238,"NightPrice":1,"AvgPrice":238,"East":"104.1481","North":"30.0133"},{"Name":"西双版纳","UID":"35","Price":318,"NightPrice":1,"AvgPrice":318,"East":"100.7978","North":"21.9962"},{"Name":"通辽","UID":"458","Price":298,"NightPrice":1,"AvgPrice":298,"East":"122.2737","North":"43.6065"},{"Name":"湘潭","UID":"598","Price":248,"NightPrice":1,"AvgPrice":248,"East":"112.9304","North":"27.9298"},{"Name":"滕州","UID":"909","Price":127,"NightPrice":1,"AvgPrice":127,"East":"117.1480","North":"35.1093"},{"Name":"无为","UID":"21648","Price":328,"NightPrice":1,"AvgPrice":328,"East":"117.8983","North":"31.3076"},{"Name":"铜川","UID":"118","Price":278,"NightPrice":1,"AvgPrice":278,"East":"108.9503","North":"34.8999"},{"Name":"巢湖","UID":"589","Price":179,"NightPrice":1,"AvgPrice":179,"East":"117.8260","North":"31.5805"},{"Name":"东营","UID":"236","Price":228,"NightPrice":1,"AvgPrice":228,"East":"118.5398","North":"37.4715"},{"Name":"秀山","UID":"21299","Price":178,"NightPrice":1,"AvgPrice":178,"East":"109.0053","North":"28.4461"},{"Name":"开封","UID":"331","Price":199,"NightPrice":1,"AvgPrice":199,"East":"114.3713","North":"34.7795"},{"Name":"彭水","UID":"21316","Price":308,"NightPrice":1,"AvgPrice":308,"East":"108.1692","North":"29.2963"},{"Name":"都江堰","UID":"94","Price":169,"NightPrice":1,"AvgPrice":169,"East":"103.6618","North":"30.9846"},{"Name":"瑞金","UID":"3971","Price":199,"NightPrice":1,"AvgPrice":199,"East":"116.0307","North":"25.8857"},{"Name":"许昌","UID":"1094","Price":258,"NightPrice":1,"AvgPrice":258,"East":"113.8465","North":"34.0063"},{"Name":"章丘","UID":"7593","Price":299,"NightPrice":1,"AvgPrice":299,"East":"117.4965","North":"36.6601"},{"Name":"自贡","UID":"544","Price":147,"NightPrice":1,"AvgPrice":147,"East":"104.7769","North":"29.3551"},{"Name":"枣阳","UID":"1555","Price":268,"NightPrice":1,"AvgPrice":268,"East":"112.7597","North":"32.1146"},{"Name":"老河口","UID":"2155","Price":180,"NightPrice":1,"AvgPrice":180,"East":"111.6747","North":"32.3840"},{"Name":"凌源","UID":"1119","Price":151,"NightPrice":1,"AvgPrice":151,"East":"119.4097","North":"41.2433"},{"Name":"新余","UID":"603","Price":278,"NightPrice":1,"AvgPrice":278,"East":"114.9331","North":"27.7991"},{"Name":"宜城","UID":"21245","Price":160,"NightPrice":1,"AvgPrice":160,"East":"113.5779","North":"30.9350"},{"Name":"余姚","UID":"540","Price":369,"NightPrice":1,"AvgPrice":369,"East":"121.0722","North":"29.9222"},{"Name":"松原","UID":"1303","Price":110,"NightPrice":1,"AvgPrice":110,"East":"124.7939","North":"45.1391"},{"Name":"衢州","UID":"407","Price":218,"NightPrice":1,"AvgPrice":218,"East":"118.8706","North":"28.9462"},{"Name":"临夏市","UID":"3978","Price":229,"NightPrice":1,"AvgPrice":229,"East":"103.2447","North":"35.5987"},{"Name":"泰州","UID":"579","Price":398,"NightPrice":1,"AvgPrice":398,"East":"120.0813","North":"32.6146"},{"Name":"大邑","UID":"7716","Price":198,"NightPrice":1,"AvgPrice":198,"East":"103.2562","North":"30.5504"},{"Name":"白银","UID":"1541","Price":168,"NightPrice":1,"AvgPrice":168,"East":"104.3232","North":"36.8963"},{"Name":"安阳","UID":"181","Price":368,"NightPrice":1,"AvgPrice":368,"East":"114.3352","North":"36.0925"},{"Name":"彬县","UID":"3944","Price":320,"NightPrice":1,"AvgPrice":320,"East":"108.0840","North":"35.0330"},{"Name":"吉安","UID":"933","Price":338,"NightPrice":1,"AvgPrice":338,"East":"114.9916","North":"27.1247"},{"Name":"平潭","UID":"392","Price":239,"NightPrice":1,"AvgPrice":239,"East":"119.7929","North":"25.4921"},{"Name":"巴中","UID":"3966","Price":188,"NightPrice":1,"AvgPrice":188,"East":"106.7372","North":"31.8663"},{"Name":"商丘","UID":"441","Price":188,"NightPrice":1,"AvgPrice":188,"East":"115.6403","North":"34.4261"},{"Name":"贞丰","UID":"21913","Price":158,"NightPrice":1,"AvgPrice":158,"East":"105.6438","North":"25.3854"},{"Name":"云阳","UID":"20810","Price":240,"NightPrice":1,"AvgPrice":240,"East":"108.6962","North":"30.9283"},{"Name":"靖江","UID":"3926","Price":152,"NightPrice":1,"AvgPrice":152,"East":"120.2575","North":"32.0016"},{"Name":"贺州","UID":"4146","Price":318,"NightPrice":1,"AvgPrice":318,"East":"111.2023","North":"24.2477"},{"Name":"潜江","UID":"4154","Price":178,"NightPrice":1,"AvgPrice":178,"East":"112.8964","North":"30.4341"},{"Name":"天门","UID":"3920","Price":158,"NightPrice":1,"AvgPrice":158,"East":"113.1534","North":"30.6455"},{"Name":"寿县","UID":"21380","Price":288,"NightPrice":1,"AvgPrice":288,"East":"116.7771","North":"32.5766"},{"Name":"岳西","UID":"21473","Price":398,"NightPrice":1,"AvgPrice":398,"East":"116.3723","North":"30.8472"},{"Name":"伊宁市","UID":"529","Price":378,"NightPrice":1,"AvgPrice":378,"East":"81.3107","North":"43.9240"},{"Name":"德州","UID":"1370","Price":298,"NightPrice":1,"AvgPrice":298,"East":"116.3647","North":"37.4319"},{"Name":"咸宁","UID":"937","Price":138,"NightPrice":1,"AvgPrice":138,"East":"114.3303","North":"29.8171"},{"Name":"亳州","UID":"1078","Price":289,"NightPrice":1,"AvgPrice":289,"East":"115.7880","North":"33.8711"},{"Name":"崇阳","UID":"21512","Price":190,"NightPrice":1,"AvgPrice":190,"East":"116.3933","North":"39.9205"},{"Name":"资阳","UID":"1560","Price":168,"NightPrice":1,"AvgPrice":168,"East":"104.6114","North":"30.1258"},{"Name":"宿松","UID":"948","Price":218,"NightPrice":1,"AvgPrice":218,"East":"116.1126","North":"30.1631"},{"Name":"恩施","UID":"245","Price":108,"NightPrice":1,"AvgPrice":108,"East":"109.4885","North":"30.2707"},{"Name":"吉首","UID":"1110","Price":256,"NightPrice":1,"AvgPrice":256,"East":"109.7366","North":"28.3230"},{"Name":"金昌","UID":"1158","Price":228,"NightPrice":1,"AvgPrice":228,"East":"102.1817","North":"38.4954"},{"Name":"河间","UID":"7759","Price":137,"NightPrice":1,"AvgPrice":137,"East":"116.1071","North":"38.4384"},{"Name":"广安","UID":"1100","Price":148,"NightPrice":1,"AvgPrice":148,"East":"106.6405","North":"30.4506"},{"Name":"赤壁","UID":"1521","Price":168,"NightPrice":1,"AvgPrice":168,"East":"113.8958","North":"29.7177"}]};
                //成功后，绘制图表
                hotelCityMap.mapSelect(_htlCityInfo.HtlCityInfo);
                //no data实现，控制隐藏展示
                $('#iCenter').css('display', (_htlCityInfo.HtlCityInfo.length > 0) ? '' : 'none');
                $('#mapNoData').css('display', (_htlCityInfo.HtlCityInfo.length > 0) ? 'none' : '');

                //图表采用第一个数据
                htlCityTable.clearAll();
                if (_htlCityInfo.HtlCityInfo.length > 0) {
                    _ptDt.CityID = _htlCityInfo.HtlCityInfo[0].UID;
                    _cityDetailInfo = {"TolHotelDetailInfo":{"TolPrice":342190,"TolNight":620,"TolAvgPrice":552,"TolNightPer":"100%"},"HotelDetailInfo":[{"HotelName":"北京锦江富园大酒店","Stars":"5","Price":48950,"Night":112,"AvgPrice":437,"NightPer":"18.1%"},{"HotelName":"北京华腾美居酒店","Stars":"4","Price":47700,"Night":94,"AvgPrice":507,"NightPer":"15.2%"},{"HotelName":"北京伯豪瑞廷酒店","Stars":"5","Price":37200,"Night":62,"AvgPrice":600,"NightPer":"10%"},{"HotelName":"其他","Stars":"","Price":208340,"Night":352,"AvgPrice":592,"NightPer":"56.8%"}]};
                    //成功后，绘table
                    htlCityTable.drawTable(_cityDetailInfo, _htlCityInfo.HtlCityInfo[0].Name);
                }
            }, 100);

        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('#htlCityTypeSelID').css('display', '');
            $('#htlCityTypeID').addClass('click_on');
        },
        onDataClick: function (event) {
            //修改地图
            if ($(this).val() == "0") {
                hotelCityMap._selType = "All";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            } else if ($(this).val() == "1") {
                hotelCityMap._selType = "C";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            } else {
                hotelCityMap._selType = "M";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            }

            //改变选项后，下方table清空
            //htlCityTable.clearAll();
        },
        hideDropDown: function () {
            $('#htlCityTypeSelID').css('display', 'none');
            $('#htlCityTypeID').removeClass('click_on');
        },
        createControl: function (dt) {
            $('#selfCoverID').remove();

            var _div = $('<div id="selfCoverID" class="layer2"></div>');
            //设置控件属性
            var _str = '<dl><dt>' + corpReport_HotelCity.js_Top5CitiesLegend + '</dt>',
                    _dLen = (dt.length > 5) ? 5 : dt.length;
            //右下角填入
            for (var i = 0; i < _dLen; i++) {
                _str = _str + '<dd>' + dt[i].Name + '</dd>';
            }
            _str = _str + '</dl><i class="pic_example"></i>';
            _div.html(_str);

            _div.insertAfter($('#iCenter'));
        },
        mapSelect: function (dt) {
            if (typeof (mapObj) != "undefined") { mapObj.destroy(); }
            hotelCityMap.createControl(dt);
            hotelCityMap.mapDraw(dt);
        },
        mapDraw: function (_cityInfo) {
            var markers = {};
            mapObj = new AMap.Map("iCenter", {
                center: new AMap.LngLat(116.397428, 39.90923), //地图中心点 - 北京
                level: 4  //地图显示的缩放级别
                //zooms: [4,8]   //地图缩放范围
            });

            //地图中添加地图操作ToolBar插件
            mapObj.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
                toolBar = new AMap.ToolBar();
                mapObj.addControl(toolBar);
                //
                scale = new AMap.Scale();
                mapObj.addControl(scale);

                /*
                //创建右键菜单  
                contextMenu = new AMap.ContextMenu();
                //右键放大  
                contextMenu.addItem("放大一级", function () {
                mapObj.zoomIn();
                }, 0);
                //右键缩小  
                contextMenu.addItem("缩小一级", function () {
                mapObj.zoomOut();
                }, 1);
                //地图绑定鼠标右击事件——弹出右键菜单
                AMap.event.addListener(mapObj, 'rightclick', function (e) {
                contextMenu.open(mapObj, e.lnglat);
                contextMenuPositon = e.lnglat;
                });
                */

                //..
                //创建新的control
                var homeControl = new AMap.homeControlDiv(mapObj); //新建自定义插件对象  
                mapObj.addControl(homeControl);                  //地图上添加插件

                //浮层
                mapMarker.addMarker(_cityInfo, mapObj, mapMarker.addEvListen);

            });
            //自定义覆盖物
            AMap.homeControlDiv = function () {
            };
            AMap.homeControlDiv.prototype = {
                addTo: function (map, dom) {
                    dom.appendChild(this._getHtmlDom(map));
                },
                _getHtmlDom: function (map) {
                    this.map = map;
                    // 创建一个能承载控件的<div>容器                  
                    var controlUI = document.getElementById("selfCoverID");

                    // 设置控件的位置
                    controlUI.style.position = 'absolute';
                    //controlUI.style.left = '906px';     //设置控件离地图的左边界的偏移量                  
                    //controlUI.style.top = '213px';        //设置控件离地图上边界的偏移量
                    controlUI.style.right = '0px';
                    controlUI.style.bottom = '0px';
                    controlUI.style.zIndex = '100';     //设置控件在地图上显示     

                    // 设置控件响应点击onclick事件 
                    /*                 
                    controlUI.onclick = function () {
                    //map.setCenter(new AMap.LngLat(116.404, 39.915));
                    alert('CC');
                    }
                    */
                    return controlUI;
                }
            };
        }
    };

    //标记、浮层
    var mapMarker = {
        addMarker: function (dt, mapObj, onAdded) {
            mapObj.clearMap();
            for (var i = 0; i < dt.length; i++) {
                var point = new AMap.LngLat(parseFloat(dt[i].East), parseFloat(dt[i].North));
                if (!point) return;
                //
                var _mkCon = document.createElement("i"), _className = "icon i15",
                    _xPix = -8, _yPix = -11;

                if (i < 5) {
                    var _nM = 20 - i;
                    _className = "icon i" + _nM;
                    _xPix = -14,
                    _yPix = -25;
                }
                _mkCon.className = _className;
                var marker = new AMap.Marker({
                    map: mapObj,
                    position: point,
                    content: _mkCon,
                    offset: new AMap.Pixel(_xPix, _yPix) //偏移位置
                    //icon: "http://webapi.amap.com/images/0.png"
                    //offset: new AMap.Pixel(-10, -35)
                });
                //markers[i] = marker;
                //marker.setMap(mapObj);
                onAdded && onAdded(marker, dt[i]);
            }
        },
        addEvListen: function (mkr, dt) {
            var t = null;
            var handle = CM.browser.isIPad ? "click" : "mouseover";
            //mouseover
            AMap.event.addListener(mkr, handle, function (mrk) {
                var pt = mrk.pixel;
                clearTimeout(t);
                t = setTimeout(function () {
                    mapMarker.showTip($('#tipID'), dt, {
                        x: pt.x + 6,
                        y: pt.y + 48
                    });
                }, 500);
            });
            //ipad clear
            if (CM.browser.isIPad) {
                $('#tipID').click(function () {
                    clearTimeout(t); mapMarker.hideTip($('#tipID'));
                });
            }
            //mouseout
            AMap.event.addListener(mkr, 'mouseout', function (mrk) {
                clearTimeout(t);
                mapMarker.hideTip($('#tipID'));
            });
            //click
            AMap.event.addListener(mkr, 'click', function (mrk) {
                //发送ajax，获取数据，绘制table
                var _ptDt = dpHeader.getHeadData();
                _ptDt.CityID = dt.UID;
                _ptDt.HtlType = hotelCityMap._selType;

                //发送ajax请求，绘制表
                window.clearTimeout(hotelCityMap._timeout);
                hotelCityMap._timeout = window.setTimeout(function () {
                    $.ajax({
                        url: '../Hotel/GetHotelDetail',
                        type: "POST",
                        data: _ptDt,
                        success: function (data) {
                            _cityDetailInfo = $.parseJSON(data);
                            //成功后，绘table
                            htlCityTable.drawTable(_cityDetailInfo, dt.Name);
                        },
                        error: function () {
                            console.log('error!');
                        }
                    });
                }, 100);
            });
        },
        showTip: function (content, info, pos) {
            content.empty();
            var _str = ['<dl>'];
            _str.push('<dt>' + info.Name + '</dt>');
            _str.push('<dd>' + corpReport_HotelCity.js_Amount + '：<span>' + CM.fixData.transData(info.Price, 0) + '</span></dd>');
            _str.push('<dd>' + corpReport_HotelCity.js_RoomNights + '：<span>' + CM.fixData.transData(info.NightPrice, 0) + '</span></dd>');
            _str.push('<dd>' + corpReport_HotelCity.js_AvgDailyRate + '：<span>' + CM.fixData.transData(info.AvgPrice, 0) + '</span></dd></dl>');
            content.html(_str.join(""));

            content.css({
                display: '',
                left: pos.x + "px",
                top: pos.y + "px"
            });
        },
        hideTip: function (content) {
            content.css('display', 'none');
        }
    };

    //绘制城市table表
    var htlCityTable = {
        drawTable: function (dt, cityName) {
            htlCityTable.clearAll();
            htlCityTable.drawHead();
            htlCityTable.drawBody(dt.HotelDetailInfo, cityName);
            htlCityTable.drawFoot(dt.TolHotelDetailInfo);
        },
        drawHead: function () {
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#cityDetailInfoID').append(_head);
            //
            var _str = ['<tr>'];
            _str.push('<th width="20%">' + corpReport_HotelCity.js_City + '</th>');
            _str.push('<th width="25%">' + corpReport_HotelCity.js_Hotel + '</th>');
            _str.push('<th width="10%">' + corpReport_HotelCity.js_StarRating + '</th>');
            _str.push('<th width="10%" align="right">' + corpReport_HotelCity.js_Amount + '</th>');
            _str.push('<th width="10%">' + corpReport_HotelCity.js_RoomNights + '</th>');
            _str.push('<th width="10%" align="right">' + corpReport_HotelCity.js_AvgDailyRate + '</th>');
            _str.push('<th width="15%" align="center">' + corpReport_HotelCity.js_PerofRoomNight + '</th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (dt, cityName) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#cityDetailInfoID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    var _str = ['<tr>'];
                    if (i == 0) {
                        _str.push('<td rowspan="5" align="center" width="20%">' + cityName + '</td>');
                        _str.push('<td width="25%">' + dt[i].HotelName + '</td>');
                        _str.push('<td align="center" width="10%">' + dt[i].Stars + '</td>');
                        _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt[i].Price, 0) + '</td>');
                        _str.push('<td align="center" width="10%">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                        _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                        _str.push('<td align="center" width="15%">' + dt[i].NightPer + '</td>');
                    } else {
                        _str.push('<td>' + dt[i].HotelName + '</td>');
                        _str.push('<td align="center">' + dt[i].Stars + '</td>');
                        _str.push('<td align="right">' + CM.fixData.transData(dt[i].Price, 0) + '</td>');
                        _str.push('<td align="center">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                        _str.push('<td align="right">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                        _str.push('<td align="center">' + dt[i].NightPer + '</td>');
                    }
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (dt) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#cityDetailInfoID').append(_foot);
            //..
            var _str = ['<tr>'];
            _str.push('<td width="20%"></td>');
            _str.push('<td align="center" width="25%">' + corpReport_HotelCity.js_Total + '</td>');
            _str.push('<td align="center" width="10%"></td>');
            _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt.TolPrice, 0) + '</td>');
            _str.push('<td align="center" width="10%">' + CM.fixData.transData(dt.TolNight, 0) + '</td>');
            _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt.TolAvgPrice, 0) + '</td>');
            _str.push('<td align="center" width="15%">' + dt.TolNightPer + '</td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#cityDetailInfoID').empty();
        }
    };

    //☆=================== Fun E ===================☆
    //
    dpHeaderSuccess = function () {
        //初始数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#htlSubNavID').find('a'), _headSelectInfo);
        hotelCityMap.init();

        dpHeader.setDataChange(function (_o) {
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(3);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);