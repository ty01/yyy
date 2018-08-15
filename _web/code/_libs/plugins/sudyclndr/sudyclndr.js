/**
 * 
 * @authors Nat Liu (fliu@sudytech.com)
 * @date    2014-08-25 11:01:41
 * @version 2014-08-25 11:01:41
 */
;(function($) {
    var j = [43856, 19416, 19168, 42352, 21717, 53856, 55632, 25940, 22191, 39632, 21970, 19168, 42422, 42192, 53840, 53845, 46415, 54944, 44450, 38320, 18807, 18815, 42160, 46261, 27216, 27968, 43860, 11119, 38256, 21234, 18800, 25958, 54432, 59984, 27285, 23263, 11104, 34531, 37615, 51415, 51551, 54432, 55462, 46431, 22176, 42420, 9695, 37584, 53938, 43344, 46423, 27808, 46416, 21333, 19887, 42416, 17779, 21183, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 38310, 38335, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 23232, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 20854, 21183, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19195, 19152, 42192, 53430, 53855, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 45653, 27951, 44448, 19299, 37759, 18936, 18800, 25776, 26790, 59999, 27424, 42692, 43759, 37600, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368, 19285, 19311, 42352, 21732, 53856, 59752, 54560, 55968, 27302, 22239, 19168, 43476, 42192, 53584, 62034, 54560];
    var o = ["9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "9778397bd19801ec9210c965cc920e", "97b6b97bd19801ec95f8c965cc920f", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd197c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bcf97c3598082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd19801ec9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bd07f1487f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b97bd197c36c9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b70c9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "977837f0e37f149b0723b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0723b06bd", "7f07e7f0e37f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e37f14998083b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14898082b0723b02d5", "7f07e7f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66aa89801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e26665b66a449801e9808297c35", "665f67f0e37f1489801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722"];
    var l = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
    var h = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    var d = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    var p = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    var k = ["初", "十", "廿", "三十"];
    var g = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var n = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"];
    var m = {
        yearDataCache: {},
        getDate: function(u) {
            var x = Math.ceil((u - new Date(1899, 1, 10)) / 86400000);
            var w = 1899;
            var s;
            var r;
            var q;
            var t;
            var v;
            for (; w < 2100 && x > 0; w++) {
                s = this.getYearDays(w);
                x -= s
            }
            x < 0 && (x += s, w--);
            q = w;
            r = this.getLeapMonth(q) || false;
            for (w = 1; w <= 12; w++) {
                s = this.getMonthDays(q, w);
                if (r === true) {
                    r = false;
                    w--;
                    s = this.getLeapDays(q);
                    if (x < s) {
                        t = true
                    }
                }
                if (r === w) {
                    r = true
                }
                if (x < s) {
                    v = s === 30;
                    break
                }
                x -= s
            }
            return {
                lunarYear: q,
                lunarMonth: w,
                lunarDay: x+1,
                isLeap: t,
                isBigMonth: v
            }
        },
        getYearDays: function(q) {
            var r;
            var t = this.yearDataCache;
            if (t[q]) {
                return t[q]
            }
            var s = 348;
            var u = j[q - 1899];
            for (r = 32768; r > 8; r >>= 1) {
                s += r & u ? 1 : 0
            }
            s += this.getLeapDays(q);
            t[q] = s;
            return s
        },
        getLeapDays: function(q) {
            return this.getLeapMonth(q) ? (j[q - 1899 + 1] & 15 === 15 ? 30 : 29) : 0
        },
        getLeapMonth: function(r) {
            var q = j[r - 1899] & 15;
            return q == 15 ? 0 : q
        },
        getMonthDays: function(r, q) {
            return (j[r - 1899] & (65536 >> q)) ? 30 : 29
        }
    };
    var b = function(u, r) {
        var v = o[u - 1900];
        var t = [];
        var s = 0;
        var q;
        for (; s < 30; s += 5) {
            q = ( + ("0x" + v.substr(s, 5))).toString();
            t.push(q.substr(0, 1));
            t.push(q.substr(1, 2));
            t.push(q.substr(3, 1));
            t.push(q.substr(4, 2))
        }
        return new Date(u, parseInt(r / 2, 10), t[r])
    };
    var c = {
        calculate: function(q) {
            return h[q % 10] + d[q % 12]
        },
        getGzYear: function(r, s, q) {
            return this.calculate(s - 1900 + 36 - (q === s ? 0 : 1))
        },
        getGzMonth: function(q, r, s) {
            var t = b(r, q.getMonth() * 2);
            return this.calculate((r - 1900) * 12 + s + 12 - (q < t ? 1 : 0))
        },
        getGzDay: function(q) {
            return this.calculate(Math.ceil(q / 86400000 + 25567 + 10))
        }
    };
    var i = {
        b0101: "b,春节 ",
        b0115: "b,元宵节",
        b0202: "b,龙头节",
        b0505: "b,端午节",
        b0707: "b,七夕节",
        b0715: "b,中元节",
        b0815: "b,中秋节",
        b0909: "b,重阳节",
        b1001: "b,寒衣节",
        b1015: "b,下元节",
        b1208: "b,腊八节",
        b1223: "b,小年",
        i0202: "i,湿地日,1996",
        i0308: "i,妇女节,1975",
        i0315: "i,消费者权益日,1983",
        i0401: "i,愚人节,1564",
        i0422: "i,地球日,1990",
        i0501: "i,劳动节,1889",
        i0512: "i,护士节,1912",
        i0518: "i,博物馆日,1977",
        i0605: "i,环境日,1972",
        i0623: "i,奥林匹克日,1948",
        i1020: "i,骨质疏松日,1998",
        i1117: "i,学生日,1942",
        i1201: "i,艾滋病日,1988",
        h0101: "h,元旦",
        h0312: "h,植树节,1979",
        h0504: "h,五四青年节,1939",
        h0601: "h,儿童节,1950",
        h0701: "h,建党节,1941",
        h0801: "h,建军节,1933",
        h0903: "h,抗战胜利日,1945",
        h0930: "h,烈士纪念日,1949",
        h0910: "h,教师节,1985",
        h1001: "h,国庆节,1949",
        h1204: "h,宪法日,1982",
        h1213: "h,国家公祭日,1937",
        c1224: "c,平安夜",
        c1225: "c,圣诞节",
        c0214: "c,情人节",
        w0520: "a,母亲节,1913",
        w0630: "a,父亲节",
        w1144: "a,感恩节"
    };
    var e = function(q) {
        return q < 10 ? "0" + q: q
    };
    var a = function(r, C, term) {
        var y = r.getFullYear();
        var w = r.getMonth() + 1;
        var B = r.getDate();
        var q = r.getDay();
        var s = Math.ceil(B / 7);
        var W = "w" + e(w) + s + q;
        var t = "b" + e(C.lunarMonth) + e(C.lunarDay);
        var I = "i" + e(w) + e(B);
        var h = "h" + e(w) + e(B);
        var c = "c" + e(w) + e(B);
        var x = [];
        var D;
        if (C.lunarMonth === 12 && C.lunarDay === (C.isBigMonth ? 30 : 29)) {
            x.push("t,除夕")
        }
        if(term&&term==="清明"){
        	x.push("t,清明节");
        }
        x.push(i[t], i[h], i[W], i[c], i[I]);
        var u = 0;
        var out = [];
        for (; u < x.length; u++) {
            if (x[u]) {
                D = x[u].split(",");
                if (D[2] && y < Number(D[2])) {
                    continue
                }
                out.push({
                    type: D[0],
                    desc: D[1],
                    value: D[1]
                })
            }
        }
        out.sort(function(F, E) {
            if (F && E) {
                return F.type.charCodeAt(0) - E.type.charCodeAt(0)
            }
            return ! F ? 1 : -1
        });
        return out;
    };
    var f = function(r) {
        var w = r.getFullYear();
        var u = r.getMonth() + 1;
        var y = r.getDate();
        var v = (u - 1) * 2;
        var s = b(w, v);
        var q;
        var t = "";
        if (y != s.getDate()) {
            q = b(w, v + 1);
            if (y == q.getDate()) {
                t = l[v + 1]
            }
        } else {
            t = l[v]
        }
        var x = m.getDate(r);
        return {
            animal: p[(x.lunarYear - 4) % 12],
            gzDate: c.getGzDay(r),
            gzMonth: c.getGzMonth(r, w, u),
            gzYear: c.getGzYear(r, w, x.lunarYear),
            lunarYear: x.lunarYear,
            lunarMonth: x.lunarMonth,
            lunarDate: x.lunarDay,
            lMonth: (x.isLeap ? "闰": "") + n[x.lunarMonth - 1],
            lDate: x.lunarDay % 10 == 0 ? ["初十", "二十", "三十"][x.lunarDay / 10 - 1] : k[parseInt(x.lunarDay / 10, 10)] + g[parseInt(x.lunarDay % 10, 10)],
            term: t,
            festival: (function() {
                return a(r, x, t)
            })(),
            isBigMonth: x.isBigMonth,
            oDate: r,
            cnDay: "日一二三四五六七".charAt(r.getDay())
        }
    };
    $.lunar = function(q) {
        var q = new Date(q);
        var y = q.getFullYear();
        return y < 1900 || y>2100 ? false : f(q);
    }
})(window.jQuery);

(function($){
	/*
	默认配置项
	 */
	var defaultSetting = {
			dateFormat: "yyyy-MM-dd",  // 日历格式
			weeksCN: ["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"], // 中文日历星期
			weeksEN: ["SUN","MON","TUE","WED","THU","FRI","SAT"], // 英文日历星期,
			weekDayIndex:[0,1,2,3,4,5,6],
			weekDayFirst: true,
			language:"cn", // 日历语言默认为中文
			rows: 6,  // 日历默认为6行
			eventTitle: "News Event", // 日历标题
			eventMoreUrl: 'http://www.sudytech.com',	// 日历更多链接
			eventWrap:'.event-news-list', // 用于显示事件内容的容器，如果存在，那么事件显示在此处
			eventTpl:'<div class="sudyclndr-event-news"><h2><a href="{{ d.url }}" target="_blank">{{ d.title }}</a></h2><p><span class="event-news-filed">Locale：</span>{{ d.locale }}</p><p><span class="event-news-filed">Time：</span>{{ d.time }}</p></div>',
			eventWrapDate:true,
			gotoday:false,	// 指定默认跳到哪一天
			ajaxUrl: null,	// ajax 请求地址
			ajaxData: {}, // ajax 参数
			isSingle:true,	// 当日只有一个文章时，是否点击日历当天直接访问这篇文章
			eventsSpeed:300,	// 文章拉出动画速度
			json:[],	// 前台模板构造json
			lunar: false,
            lunarAlign: "center"
	};

	var Clndr = function(element, setting){
		this.element = element;
		this.setting = $.extend(true, {}, defaultSetting, setting);
		this.curday = null;
		this.events = {};
		this.setup();
	}

	// javascript模板
	if(!window.laytpl){
		;!function(){"use strict";var f,b={open:"{{",close:"}}"},c={exp:function(a){return new RegExp(a,"g")},query:function(a,c,e){var f=["#([\\s\\S])+?","([^{#}])*?"][a||0];return d((c||"")+b.open+f+b.close+(e||""))},escape:function(a){return String(a||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")},error:function(a,b){var c="tpl Error：";return"object"==typeof console&&console.error(c+a+"\n"+(b||"")),c+a}},d=c.exp,e=function(a){this.tpl=a};e.pt=e.prototype,e.pt.parse=function(a,e){var f=this,g=a,h=d("^"+b.open+"#",""),i=d(b.close+"$","");a=a.replace(/[\r\t\n]/g," ").replace(d(b.open+"#"),b.open+"# ").replace(d(b.close+"}"),"} "+b.close).replace(/\\/g,"\\\\").replace(/(?="|')/g,"\\").replace(c.query(),function(a){return a=a.replace(h,"").replace(i,""),'";'+a.replace(/\\/g,"")+'; view+="'}).replace(c.query(1),function(a){var c='"+(';return a.replace(/\s/g,"")===b.open+b.close?"":(a=a.replace(d(b.open+"|"+b.close),""),/^=/.test(a)&&(a=a.replace(/^=/,""),c='"+_escape_('),c+a.replace(/\\/g,"")+')+"')}),a='"use strict";var view = "'+a+'";return view;';try{return f.cache=a=new Function("d, _escape_",a),a(e,c.escape)}catch(j){return delete f.cache,c.error(j,g)}},e.pt.render=function(a,b){var e,d=this;return a?(e=d.cache?d.cache(a,c.escape):d.parse(d.tpl,a),b?(b(e),void 0):e):c.error("no data")},f=function(a){return"string"!=typeof a?c.error("Template not found"):new e(a)},f.config=function(a){a=a||{};for(var c in a)b[c]=a[c]},f.v="1.1","function"==typeof define?define(function(){return f}):"undefined"!=typeof exports?module.exports=f:window.laytpl=f}();
	}

	/*
	初始化日历设置
	 */

	Clndr.prototype.setup = function(){
		var _this = this, el = this.element;
		if(this.setting.weekDayFirst)
			this.setting.weekDayIndex = [1,2,3,4,5,6,0];
		if(/cn/gi.test(this.setting.language)){
			this.setting.weeks = this.setting.weeksCN;
			datesep = ["\u5e74","\u6708","\u65e5"];
		}else{
			this.setting.weeks = this.setting.weeksEN;
			datesep = [".",".",""];
		};
		var	template = '<div class="sudyclndr">'+
						'<div class="clndr-controls">'+
							'<a class="clndr-nav clndr-prev" href="javascript:void(0);"><span>&lt;</span></a>'+
							'<a class="clndr-nav clndr-next" href="javascript:void(0);"><span>&gt;</span></a>'+
							'<div class="clndr-dates">'+
								'<a><span class="clndr-select-year"></span>'+datesep[0]+'</a>'+
								'<a><span class="clndr-select-month"></span>'+datesep[1]+'</a>'+
								'<a><span class="clndr-select-day"></span>'+datesep[2]+'</a>'+
							'</div>'+
						'</div>'+
						'<div class="clndr-container">'+
								'<div class="clndr-days">'+
									'<table class="clndr-days-head" width="100%" cellpadding="0" cellspacing="0" border="0">'+
										'<tr class="clndr-days-week"></tr>'+
									'</table>'+
									'<table class="clndr-days-table" width="100%" cellpadding="0" cellspacing="0" border="0"></table>'+
								'</div>'+
								'<div class="clndr-events">'+
									'<div class="clndr-events-head"><a class="clndr-events-close">x</a><h3 class="clndr-events-title"></h3></div>'+
									'<ul class="clndr-events-list"></ul>'+
								'</div>'+
						'</div>'+
					  '</div>';
		$(el).html(template);
		
		$(".clndr-days-week", el).html(function(){
			var html = "";
			$.each(_this.setting.weekDayIndex, function(index, val) {
				 /* iterate through array or object */
				 html += '<th style="width:'+(100/7)+'%;" class="clndr-week clndr-week-'+ index +' clndr-week-day-'+val+'"><div class="week-box">'+_this.setting.weeks[val]+'</div></th>';
			});
			return html;
		});

		this.curday = this.setting.gotoday ? this.setting.gotoday : new Date();

		if(this.setting.json.length>0){

			this.events = this.jsonToEvents(this.setting.json);
		}
		this.getEvents();

		$(el).on("click",".clndr-prev",function(e){
			e.preventDefault();
			_this.curday = _this.getPrevMonth(_this.Format(_this.curday)).date;
			_this.getEvents();
			$("#stacked").html("");
			selectDayFn(_this.Format(_this.curday));
		});

		$(el).on("click",".clndr-next",function(e){
			e.preventDefault();
			_this.curday = _this.getNextMonth(_this.Format(_this.curday)).date;
			_this.getEvents();
			$("#stacked").html("");
			selectDayFn(_this.Format(_this.curday));
		});
		
		$(el).on("click",".clndr-day",function(e){
			e.preventDefault();
			var datestr = $(this).find("[data-date]").attr("data-date");
			_this.showEvents(datestr);
			 var nowClick = new Date();
			  if(lastClick == null){
				  selectDayFn(_this.Format(_this.curday));
				  lastClick = nowClick;
			  }else{
				  if((nowClick.getTime() - lastClick.getTime()) > 1000){
					  lastClick = nowClick;
					  selectDayFn(_this.Format(_this.curday));
				  }
			  }

		});

		$(el).on("click",".clndr-events-close",function(e){
			e.preventDefault();
			$(".clndr-days", el).stop().animate({left:0}, _this.setting.eventsSpeed);
			$(".clndr-events", el).stop().animate({left:"100%"}, _this.setting.eventsSpeed);
		});

		$.isFunction(this.setting.onInit)&&this.setting.onInit.call(this, el, this.setting);

	};

	Clndr.prototype.jsonToEvents = function(json){
		var _this = this, el = this.element, events = {};

		if(json.length>0){

			$.each(json, function(index, val) {
				 /* iterate through array or object */

				 if(val.date){
				 	var date = val.date.split("-"),
						dateIndex = date[0]+"-"+date[1];
					if(!events[dateIndex])
						events[dateIndex] = {};

					if(!events[dateIndex][val.date])
						events[dateIndex][val.date] = [];

					events[dateIndex][val.date].push(val);
				 }
			});
		}

		return events;
	}

	Clndr.prototype.getEvents = function(){

		var _this = this, eventsIndex = this.Format(this.curday,"yyyy-MM");
		if(this.setting.ajaxUrl!=null && !_this.events[eventsIndex]){

			$.ajax({
				url: this.setting.ajaxUrl,
				type: 'GET',
				dataType: 'json',
				data: $.extend(true, {}, {date: eventsIndex}, this.setting.ajaxData)
			})
			.done(function(json) {	
				_this.events[eventsIndex] = _this.jsonToEvents(json)[eventsIndex];
				_this.loadDates();
			})
			.fail(function() {
				_this.loadDates();
			});
		}else{

			this.loadDates();
		}
	
	}

	/*
	日历时间
	*/
	Clndr.prototype.getDates = function(){
		var _this = this, el = this.element,O = this.setting,
			prevmonth = this.getPrevMonth(this.Format(this.curday,"yyyy-MM-dd"));
			nextmonth = this.getNextMonth(this.Format(this.curday,"yyyy-MM-dd"));
		var date = this.curday;
		var weekdays = O.weekDayIndex.length;
		var renderDates = [];
		var day1 = new Date(date.getFullYear(),date.getMonth(),1);
		var days = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var day1Index = $.inArray(day1.getDay(), O.weekDayIndex);
		var daysIndex = $.inArray(new Date(date.getFullYear(),date.getMonth(),days).getDay(), O.weekDayIndex);
		var autoRows = Math.ceil((days+day1Index-weekdays)/weekdays) + 1;
		var rows = O.sixRows ? 6  : (O.rows ? O.rows : autoRows);
		var daysoff = (rows - autoRows +1)*weekdays - 1 - daysIndex;
		this.rows = rows;
		if(day1Index>0){
			for (var i = day1Index - 1; i >= 0; i--) {
				var d = new Date(prevmonth.date.getFullYear(),prevmonth.date.getMonth(),prevmonth.days-i);
				renderDates.push({
					date:d,
					out:true
				});
			};
		}
		for (var i = 0; i < days; i++) {
			var d = new Date(date.getFullYear(),date.getMonth(),i+1);
			renderDates.push({
					date:d,
					out: false
				});
		}

		if(daysoff>0){
			for (var i = 0; i < daysoff; i++) {
				var d = new Date(nextmonth.date.getFullYear(),nextmonth.date.getMonth(),i+1);
				renderDates.push({
					date:d,
					out:true
				});
			}
		}
		return renderDates;
	}

	/*
	加载日期,创建日历
	 */

	Clndr.prototype.loadDates = function(callback){

		var _this = this, el = this.element, curmonth = this.curday, today = new Date(), o = this.setting,
			prevmonth = this.getPrevMonth(this.Format(this.curday,"yyyy-MM-dd"));
			nextmonth = this.getNextMonth(this.Format(this.curday,"yyyy-MM-dd"));

		var day1 = new Date(this.curday.getFullYear(),this.curday.getMonth(),1).getDay();
		var days = new Date(this.curday.getFullYear(),this.curday.getMonth()+1,0).getDate();
		$(".clndr-select-year", el).html(this.Format(this.curday,"yyyy"));
		$(".clndr-select-month", el).html(this.Format(this.curday,"MM"));
		$(".clndr-select-day", el).html(this.Format(this.curday,"dd"));
		if(o.lunar){
			var lunar = $.lunar(curmonth);
            var lunarStr = lunar.lMonth+"月"+lunar.lDate;
			if(!$(".clndr-select-lunar", el).length) {
                var lunarHtml = '<a class="clndr-select-lunar"/>';
                if(/left/i.test(o.lunarAlign)){
                    $(".clndr-controls", el).append(lunarHtml);
                }else if(/right/i.test(o.lunarAlign)){
                	$(".clndr-controls", el).prepend(lunarHtml);
                }else{
                    $(".clndr-dates", el).append(lunarHtml);
                }
            }

            if(!o.lunarAlign || /center/i.test(o.lunarAlign)){
            	lunarStr = " 农历" + lunarStr;
            }else{
            	$(".clndr-controls", el).addClass('controls-lunar controls-lunar-'+o.lunarAlign);
            }

			//$(".clndr-select-lunar", el).html(lunarStr);
		}

		var events = this.events[this.Format(this.curday,"yyyy-MM")] || {};
		var renderDates = this.getDates();

		$(".clndr-days-table", el).html(function(){
			var html = "", date;
			for(var k = 0; k < _this.rows; k++) {
				 /* iterate through array or object */
			    html += '<tr class="clndr-days-wrap clndr-days-wrap-'+ k +'">';
			    var j = k*_this.setting.weekDayIndex.length;
			    $.each(_this.setting.weekDayIndex, function(index, day) {

				 	 /* iterate through array or object */
				 	 var n = "", c = "", t = "", _date = renderDates[j+index], d = _date.date.getDate();
				 	 date = _this.Format(_date.date);
				 	 if(_date.out)
				 	 	c = " clndr-day-out";
				 	 else if(date==_this.Format(today))
				 	 	c = " clndr-today";
				 	 else if(date == _this.Format(curmonth))
				 		c= " clndr-day-cur";
				 	 
				 	 if(events[date]){
				 	 	n = " clndr-has-events";
				 	 	t = date+"\u6709"+events[date].length+"\u7bc7\u6587\u7ae0";
				 	 }
				 	 html += '<td style="width:'+(100/7)+'%;" class="clndr-day clndr-day-'+day+c+n+'"><div class="day-box" data-date="'+date+'"><a class="day-number" title="'+t+'">'+d+'</a></div></td>';
				});
				html +='</tr>';
			};
			return html;
		});

	//	console.log(this.getDates());

		var height = $(".clndr-days", el).outerHeight(),
			theight = $(".clndr-events-head", el).outerHeight();
		$(".clndr-container", el).height(height);
		$(".clndr-events-list", el).height(height-theight);

		$.isFunction(callback)&&callback();
		$.isFunction(this.setting.onChange)&&this.setting.onChange.call(this, el, this.setting);
	}

	/*
	加载事件，创建事件列表
	 */
	
	Clndr.prototype.loadEvents = function(datestr, events){

		var _this = this, el = this.element,
			title = this.setting.eventTitle,
			titleUrl = $.trim(this.setting.eventMoreUrl),
			$eventWrap = $(this.setting.eventWrap);

		var date = new Date(Date.parse(datestr.replace(/-/g,"/")));

		var year = date.getFullYear(),
			month = date.getMonth()+1,
			day = date.getDate(),
			week = this.setting.weeksCN[date.getDay()];

        if($eventWrap.length>0){
        	if(events.length<1){
        		return $eventWrap.empty().hide();
        	}
	        $eventWrap.addClass('sudyclndr-event-wrap').html(function(html){
	        	var html = "";
	        	if(_this.setting.eventWrapDate){
	        		html += '<div class="sudyclndr-event-date">'+year+'年'+month+'月'+day+'日'+' 星期'+week+'</div>';
	        	}
	        	$.each(events, function(index, val) {
					 /* iterate through array or object */
					 html += laytpl(_this.setting.eventTpl).render(val);
				});

	        	return html;
	        }).show();
		}else{
			if(events.length<1){
				return false;
			};
			if(titleUrl!==""&&titleUrl!=="#")
	        	title = '<a href="'+titleUrl+'" target="_blank">'+title+'</a>';
			$(".clndr-events-title", el).html(title);
			$(".clndr-events-list", el).html(function(){
				var html ="";
				$.each(events, function(index, val) {
					 /* iterate through array or object */
					 html += '<li><a target="_blank" title="'+val.title+'" href="'+val.url+'">'+val.title+'</a></li>';
				});
				return html;
			});

			$(".clndr-days",el).stop().animate({left:"-100%"}, this.setting.eventsSpeed);
			$(".clndr-events",el).stop().animate({left:"0"}, this.setting.eventsSpeed);
		}
		$.isFunction(this.setting.onLoadEvents)&&this.setting.onLoadEvents.call(this, el, this.setting);
	}

	/*
	**输出事件. showEvents
	*/

	Clndr.prototype.showEvents = function(datestr) {
		var _this = this, el = this.element;
		var date = datestr.split("-"),
			dateIndex = date[0]+"-"+date[1];
		_this.curday = new Date(parseInt(date[0],10),parseInt(date[1],10)-1,parseInt(date[2],10));
		_this.getEvents();

		var events = _this.events[dateIndex]||{};
			events = events[datestr]||[];
		if(_this.setting.isSingle&&events.length==1){
			window.open(events[0].url,"_blank");
		}else{
			_this.loadEvents(datestr,events);
		}
	};

	/*
	格式化日期
	(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	 */

	Clndr.prototype.Format = function(date,fmt){
		
		
		  if(!date)var date = new Date();
		  if(!fmt)var fmt = this.setting.dateFormat;
		  var o = { 
		    "M+" : date.getMonth()+1,
		    "d+" : date.getDate(),
		    "h+" : date.getHours(),
		    "m+" : date.getMinutes(),
		    "s+" : date.getSeconds(),
		    "q+" : Math.floor((date.getMonth()+3)/3),
		    "S"  : date.getMilliseconds()
		  }; 
		  if(/(y+)/.test(fmt)) 
		    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		  for(var k in o) 
		    if(new RegExp("("+ k +")").test(fmt)) 
		  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
		  return fmt;

	}

	/*
	获取上一个月份日期
	 */

	Clndr.prototype.getPrevMonth = function(date) {

	    var arr = date.split('-');
	    var year = parseInt(arr[0],10);
	    var month = parseInt(arr[1],10);
	    var day = parseInt(arr[2],10);
	    var days = new Date(year, month, 0);
	    days = days.getDate();
	    var year2 = year;
	    var month2 = month - 1;
	    if (month2 == 0) {
	        year2 = year2 - 1;
	        month2 = 12;
	    }
	    var day2 = day;
	    var days2 = new Date(year2, month2, 0);
	    days2 = days2.getDate();
	    if (day2 > days2) {
	        day2 = days2;
	    }

	    var prevMonth = new Date(year2,month2-1,day2);

	    return {
	    	date:prevMonth,
	    	days: days2
	    };
	}

	/*
	获取下一个月份日期
	 */
	Clndr.prototype.getNextMonth = function(date){

	    var arr = date.split('-');
	    var year = parseInt(arr[0],10);
	    var month = parseInt(arr[1],10);
	    var day = parseInt(arr[2],10);
	    var days = new Date(year, month, 0);
	    days = days.getDate();
	    var year2 = year;
	    var month2 = month + 1;
	    if (month2 == 13) {
	        year2 = year2 + 1;
	        month2 = 1;
	    }
	    var day2 = day;
	    var days2 = new Date(year2, month2, 0);
	    days2 = days2.getDate();
	    if (day2 > days2) {
	        day2 = days2;
	    }

	    var nextMonth = new Date(year2,month2-1,day2);
	    return {
	    	date: nextMonth,
	    	days: days2
	    };

	}

	/**
	 * 农历
	 */
	Clndr.prototype.lunar = function(){
		return $.lunar(this.curday);
	}

	/*
	注册sudyclndr插件
	 */
	var lastClick;
	$.fn.sudyclndr = function(setting){
		var clndrs = [];
		this.each(function(index, el) {
			el.clndr = new Clndr(this, setting);
			clndrs.push(el.clndr);
		});
		this.clndrs = clndrs;
		return this;
	}

    $.fn.getClndr = function(index){
        var clndrs = this.clndrs || [];
        return index!==undefined ? clndrs[index] : clndrs;
    }
	
})(jQuery);