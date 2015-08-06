$.ready(function() {
    pic.Initialization();
    setInterval(function() {
        pic.move(pic.bit);
    }, 2500);
});

    var pic = {
        cout: 0,
        index: 0,
        min: 0,
        bit: -1,
        Initialization: function() {
            pic.cout = $("#partner_ul").find("li").length;
            pic.min = 6 - pic.cout;
            $("#partner_left").bind("click", function() {
                pic.move(-1);
            });

            $("#partner_right").bind("click", function() {
                pic.move(1);
            });
        },
        move: function(n) {
            var index = pic.index + n;

            if (index > 0) {
                return;
            }
            if (index < pic.min) {
                return;
            }

            if (index == 0) {
                pic.bit = -1;
                $("#partner_left").addClass("disable");
            } else if (index == -1 || index == pic.min + 1) {
                $("#partner_left").attr("class", "slide-btn prev");
                $("#partner_right").attr("class", "slide-btn next");
            }  else if (index == pic.min) {
                pic.bit = 1;
                $("#partner_right").addClass("disable");
            }

            pic.index = index;
            $("#partner_ul").animate({ margin: "0 0 0 " + pic.index * 150 + "px" }, 500);
        }
    }
