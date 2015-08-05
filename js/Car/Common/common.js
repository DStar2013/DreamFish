(function ($) {
    //sth comm Function 
    //code d.star 2015.4.2
    var $el = function (id) { return $(id, document); };
    var _ = {};
    if (!window.CMFun) window.CMFun = _;
    //☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
    //function hover
    //arg1: cQuery对象,base对象
    //arg2: cQuery对象,浮层对象
    //arg3: json配置，{topFix: (Int), leftFix: (Int)}
    _.HoverBindEv = (function () {
        function bHov(target, el, cfg) {
            var leftFix = (cfg && cfg.leftFix) || 0, topFix = (cfg && cfg.topFix) || 0;
            target.bind('mouseover', function () {
                if (el.css('display') != 'none') {
                    return false;
                }
                var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
                var elWidth = getHideWidth(el);
                var left = (target.offset().left) + leftFix;
                if (innerWidth - left < elWidth + 20) {
                    left = left - (elWidth - (innerWidth - left)) - 40;
                }
                el.css({
                    'top': (target.offset().top + topFix) + 'px',
                    'left': left + 'px'
                });
                el.data('fi', window.setTimeout(function () {
                    FadeIn(el.get(0));
                }, 150));
                window.clearTimeout(el.data('fo'));
            });
            target.bind('mouseout', function () {
                window.clearTimeout(el.data('fi'));
                el.data('fo', window.setTimeout(function () {
                    FadeOut(el.get(0));
                }, 500));
            });
            el.bind('mouseover', function () {
                window.clearTimeout(el.data('fo'));
            });
            el.bind('mouseout', function () {
                window.clearTimeout(el.data('fi'));
                el.data('fo', window.setTimeout(function () {
                    FadeOut(el.get(0));
                }, 500));
            });
        }
        //获取隐藏高度
        var getHideWidth = function (cDom) {
            cDom[0].style.visibility = 'hidden';
            cDom[0].style.display = 'block';
            var width = cDom.offset().width;
            cDom[0].style.visibility = '';
            cDom[0].style.display = 'none';
            return width;
        };
        function FadeIn(el) {
            if (el.getAttribute('fading') == 'true') {
                return false;
            }
            el.style.display = 'block';
            el.style.opacity = 0;
            el.style.filter = 'Alpha(opacity=' + 0 + ')';
            el.setAttribute('fading', 'true');
            var o = 0;
            var fi = setInterval(function () {
                if (o <= 10) {
                    el.style.opacity = o / 10;
                    el.style.filter = 'Alpha(opacity=' + o * 10 + ')';
                    o++;
                } else {
                    clearInterval(fi);
                    el.setAttribute('fading', 'false');
                }
            }, 20);
        }
        function FadeOut(el) {
            if (el.getAttribute('fading') == 'true') {
                return false;
            }
            el.setAttribute('fading', 'true');
            var o = 10;
            var fo = setInterval(function () {
                if (o >= 0) {
                    el.style.opacity = o / 10;
                    el.style.filter = 'Alpha(opacity=' + o * 10 + ')';
                    o--;
                } else {
                    clearInterval(fo);
                    el.style.display = 'none';
                    el.setAttribute('fading', 'false');
                }
            }, 20);
        }
        return bHov;
    })();
    //function 判断对象或者字符串值是否为空 
    //arg: val
    _.IsEmpty = function (value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //function form 提交
    //arg: json数据 {url:"",method: 'POST',target: '_blank',data:{}}
    _.submitForm = function (opt) {
        /*
        var f = this._form = this._form || function () {
            var f = document.createElement('form');
            f.style.display = 'none';
            document.body.appendChild(f);
            return f;
        } ();
        if (typeof opt.data == 'object' && opt.data) {
            var html = [], d = opt.data;
            for (var n in d) {
                if (!d.hasOwnProperty(n)) continue;
                var v = d[n] === undefined || d[n] === null ? '' : d[n].toString();
                v = v.replace(/\"/gi, '\\"');
                html.push('<input type=hidden name="' + n + '" value="' + v + '"/>');
                opt.data = html.join('');
            }
        }
        $(f).attr('action', opt.url)
        .attr('method', opt.method || 'GET')
        .attr('target', opt.target || '_self')
        .html(opt.data);
        f.submit();
        */
        var f = this._form = this._form || function () {
            var f = document.createElement('form');
            f.style.display = 'none';
            document.body.appendChild(f);
            return f;
        } ();
        var d = this._div = this._div || function () {
            var d = document.createElement('div');
            d.style.display = 'none';
            document.body.appendChild(d);
            return d;
        } ();
        if (opt.data) {
            if (typeof opt.data == 'object') {
                var html = [], d = opt.data;
                for (var n in d) {
                    if (!d.hasOwnProperty(n)) continue;
                    var v = d[n] === undefined || d[n] === null ? '' : d[n].toString();
                    v = v.replace(/\"/gi, '\\"');
                    html.push('<input type=hidden name="' + n + '" value="' + v + '"/>');
                    opt.data = html.join('');
                }
                $(f).attr('action', opt.url)
                    .attr('method', opt.method || 'GET')
                    .attr('target', opt.target || '_self')
                    .html(opt.data);
                f.submit();
            } else {
                if (opt.data.indexOf('</form>') > -1) {
                    $(d).html(opt.data).find('form')[0].submit();
                } else {
                    $(f).attr('action', opt.url)
                        .attr('method', opt.method || 'GET')
                        .attr('target', opt.target || '_self')
                        .html(opt.data);
                    f.submit();
                }
            }
        }
    }
    //function placeholder
    //
    _.Placeholder = (function () {
        var P = {
            add: function (el) {
                if (!('placeholder' in document.createElement('input'))) {
                    el.each(function (e) {
                        if (_.IsEmpty(e.value()) || e.value() == e.attr('placeholder')) {
                            e.value(e.attr('placeholder'));
                            e.css('color', 'gray');
                        }
                        else {
                            e.css('color', 'black');
                        }
                    });
                    el.bind('focus', P._onfocus);
                    el.bind('click', P._onfocus);
                    el.bind('blur', P._onblur);
                    el.bind('keyup', P._onkeyup);
                }
            },
            remove: function (el) {
                if (!('placeholder' in document.createElement('input'))) {
                    el.unbind('focus', P._onfocus);
                    el.unbind('click', P._onfocus);
                    el.unbind('blur', P._onblur);
                }
            },
            check: function (el) {
                if (!('placeholder' in document.createElement('input'))) {
                    el.each(function (tar) {
                        if (_.IsEmpty(tar.value())) {
                            tar.value(tar.attr('placeholder'));
                        }
                    });
                }
            },
            clear: function () {
                if (!('placeholder' in document.createElement('input'))) {
                    $('input[type="text"]').each(function (el) {
                        if (el.value() == el.attr('placeholder')) {
                            el.value('');
                        }
                    });
                    $('textarea').each(function (el) {
                        if (el.value() == el.attr('placeholder')) {
                            el.value('');
                        }
                    });
                }
            },
            _onfocus: function () {
                if ($(this).value() == $(this).attr('placeholder'))
                    $(this).value('');
            },
            _onblur: function () {
                if (_.IsEmpty($(this).value()) || $(this).value() == $(this).attr('placeholder')) {
                    $(this).value($(this).attr('placeholder'));
                    $(this).css('color', 'gray');
                }
                else {
                    $(this).css('color', 'black');
                }
            },
            _onkeyup: function () {
                if (_.IsEmpty($(this).value())) {
                    $(this).css('color', 'gray');
                }
                else {
                    $(this).css('color', 'black');
                }
            }
        }
        return {
            add: P.add,
            remove: P.remove,
            check: P.check,
            clear: P.clear
        };
    })();
    //Paging Draw分页
    _.Paging = (function () {
        var P = {
            draw: function (fn, list, count, container) {
                //将所有链接的绑定事件全部清除
                container.find('.previous').unbind('click', P.onPreviousClick).remove();
                container.find('.next').unbind('click', P.onNextClick).remove();
                container.find('.pageNum').unbind('click', P.onLinkClick).remove();
                //
                fn(0, count);
                //
                if (Math.ceil(list.length / count) < 2)
                    return false;
                var previous = $(document.createElement('a'));
                previous.addClass('previous');
                P.setHref(previous); previous.text('<-');
                var next = $(document.createElement('a'));
                next.addClass('next');
                P.setHref(next); next.text('->');
                container.data('list', list);
                container.data('count', count);
                container.data('fn', fn);
                previous.bind('click', P.onPreviousClick);
                container.append(previous.get(0));
                next.bind('click', P.onNextClick);
                container.append(next.get(0));
                P.drawPages(0, list, count, container);
                return true;
            },
            drawPages: function (nIndex, list, count, container) {
                //先将现有的所有下拉记录去除绑定，后删除
                container.find('.pageNum').unbind('click', P.onLinkClick).remove();
                var start = 0, end = 0;
                var previous = container.find('.previous');
                var next = container.find('.next');
                //length计算为一共有多少页
                var length = Math.ceil(list.length / count);
                next.css('display', ''); previous.css('display', '');
                //判断<- 和 ->是否显示
                if (nIndex < 3 && nIndex != length - 1) {
                    start = 0;
                    end = length > 4 ? 5 : length;
                    if (nIndex == 0)
                        previous.css('display', 'none');
                }
                else if (nIndex > length - 3) {
                    start = length < 5 ? 0 : length - 5;
                    end = length;
                    if (nIndex == end - 1)
                        next.css('display', 'none');
                }
                else {
                    start = nIndex - 2;
                    end = nIndex + 3;
                }
                //
                for (var i = start; i < end; i++) {
                    container.append(P.makeLink(i).get(0));
                }
                container.find('.pageNum[index="' + nIndex + '"]').addClass('current');
                container.append(next.get(0));
            },
            setHref: function (obj) {
                obj.attr('href', 'javascript:void(0);');
            },
            makeLink: function (index) {
                var a = $(document.createElement('a'));
                P.setHref(a);
                a.addClass('pageNum');
                a.attr('index', index);
                a.text((index + 1).toString());
                a.bind('click', P.onLinkClick);
                return a;
            },
            onPreviousClick: function (e) {
                var page = $(this).parentNode();
                var currentPage = page.find('.current');
                var count = page.data('count');
                var start = parseInt(currentPage.attr('index'));
                var fn = page.data('fn');
                if (start >= 1) {
                    currentPage.removeClass('current');
                    page.find('a[index="' + (start - 1) + '"]').addClass('current');
                    fn(start - 1, count);
                }
                P.drawPages(start - 1, page.data('list'), count, page);
                e.stop();
            },
            onNextClick: function (e) {
                var page = $(this).parentNode();
                var currentPage = page.find('.current');
                var count = page.data('count');
                var start = parseInt(currentPage.attr('index'));
                var fn = page.data('fn');
                var list = page.data('list');
                if ((start + 1) * count <= list.length - 1) {
                    currentPage.removeClass('current');
                    page.find('a[index="' + (start + 1) + '"]').addClass('current');
                    fn((start + 1) * count, count);
                }
                P.drawPages(start + 1, page.data('list'), count, page);
                e.stop();
            },
            onLinkClick: function (e) {
                //当前页点击，不刷新
                if ($(this).hasClass('current')) {
                    return false;
                }
                var page = $(this).parentNode();
                var index = parseInt($(this).attr('index'));
                var count = page.data('count');
                var fn = page.data('fn');
                page.find('.current').removeClass('current');
                $(this).addClass('current');
                fn(index * count, count);
                P.drawPages(index, page.data('list'), count, page);
                e.stop();
            }
        }

        return {
            draw: P.draw
        }
    })();




    /*****************************************************************************************/
    //    $.extend($.fn, {
    //        placeholder: function () {
    //            if ("placeholder" in document.createElement("input")) {
    //                return this; //如果原生支持placeholder属性，则返回对象本身
    //            } else {
    //                return this.each(function () {
    //                    var _this = $(this);
    //                    _this.focus(function () {
    //                        if (_this.value() === _this.attr("placeholder")) {
    //                            _this.css("color", "");
    //                            _this.value("")
    //                        }
    //                    }).blur(function () {
    //                        if (_this.value().length === 0) {
    //                            _this.value(_this.attr("placeholder"));
    //                            _this.css("color", "gray");
    //                        }
    //                    });
    //                    if (!_this.value()) { _this.value(_this.attr("placeholder")); _this.css("color", "gray"); };
    //                })
    //            }
    //        }
    //    });
})(cQuery);