if (typeof jQuery === "undefined") {
  throw new Error("SUI requires jQuery");
}

var __basePath = window.__basePath || "",
	__contextPath = window.__contextPath || "";

(function(){
	var RegExps = {
		number: /^-?((([1-9]\d*)|0)|([1-9]\d*\.\d+)|(0\.\d*[1-9]\d*))$/, // 数字，整型或浮点型
		int: /^((-?[1-9]\d*)|0)$/, // 数字，整形
		float:  /^-?(([1-9]\d*\.\d+)|(0\.\d*[1-9]\d*))$/, // 数字，浮点型
		id:/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, // 身份证号
		zipcode: /^[1-9]\d{5}(?!\d)$/, // 邮政编码
		qq:/^[1-9][0-9]{4,}$/, // qq号
		tel:/^0\d{2,3}-\d{7,8}$/, // 固定电话
		mobile: /^0?(13|14|15|17|18)[0-9]{9}$/, // 手机号
		phone: /^((0\d{2,3}-\d{7,8})|(0?(13|14|15|17|18)[0-9]{9}))$/, // 固定电话或手机
		url:/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/, // URL地址
		email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // email地址
		ip:/^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/, // ip地址
		chinese:/^[\u4e00-\u9fa5]*$/, // 中文字符,
		shuzi:/^[0-9]*$/ ,//纯数字
		hghtje:/^(\d{1,4}|\d{1,4}\.\d{1,6})$/ ,//海关合同审批金额
		mac:/^([0-9a-fA-F]{2})(([\/\s:-][0-9a-fA-F]{2}){5})$/,  //Mac地址
		password: /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{6,15}$/
		// password:/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,}$/  //密码长度验证6-15位   /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{8,}$/

	};
	// 如果有新增 RegExps format，请在errorCodes 中增加相应的校验错误提示 format_xxxx
	var errorCodes = {
		empty:'{title}不能为空',
		max:'最多不能超过{value}个{slug}',
		min:'最少不能小于{value}个{slug}',
		regx:'{title}格式不正确',
		format_id:'身份证号应为15或18位数字',
		format_zipcode:'邮政编码应为1-9开头的6位数字',
		format_qq:'QQ号不合法',
		format_tel:'固定电话格式不正确',
		format_mobile:'手机号格式不正确，如13888888888',
		format_phone: '固定电话或手机号格式不正确',
		format_url:'无效的URL地址',
		format_email:'无效的邮件地址',
		format_ip:'无效的IP地址',
		format_chinese:'不全是中文字符',
		format_shuzi:'不是纯数字',
		format_hghtje:'审批金额无效',
		format_mac:'无效的Mac地址',
		format_password: '密码长度须为6-15位,可输入英文数字、特殊字符',
		format_int: '无效的整数',
		format_float:'无效的浮点型数字',
		format_number: '无效的整数或浮点型数字',
		format_intLen: '整数位数最大不超过{value}位',
		format_floatLen: '小数位数最大不超过{value}位',
		format_minus: '无效的负数',
		format_plus:'无效的正数',
		format_maxNum:'数值不应大于{value}',
		format_minNum:'数值不应小于{value}'
	}
	var popTplDef = '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>';
	var popTpl = {
		inp: popTplDef,
		tip: popTplDef
	};

	var Util = {
		context: {},
		compare: function(v1, v2){
			v1 = v1 || 0;
			v2 = v2 || 0;
			return v1 == v2;
		},
		empty:function(){
		   // coming...
		},
		toJsonString: function(value){
			return JSON.stringify(value);
		},
		parseJSON: function(str, jsStyle){
			if(!jsStyle){
				return $.parseJSON(str);
			}else{
				return eval('(function(){return '+str+'})()');
			}
		},
		inArrayObj: function(key, val, array, force) {
            var index = -1;
            var _array = $.isArray(array) ? array.slice(0) : [];
            if (!_array.length)
                return index;
            for (var i = 0; i < _array.length; i++) {
                if (_array[i][key] == val) {
                	if(!force || typeof _array[i][key] == typeof val){
                		return i;
                	}
                }
            };
            return index;
        },
		validateError:function(result, dom, value, errorCode, errorValue){
			if(result || !dom){
				if($(dom).data('bs.tooltip')){
					$(dom).data('bs.tooltip').hide();
				}
				return true;
			}
			var hideTip = $(dom).attr('hideTip') != undefined;
			if(hideTip){
				return false;
			}
			var tip = '',
				title = $(dom).attr('data-original-title') || $(dom).attr('title') || '此项',
				_tip = $(dom).attr("inputTip") || ('请检查' + title + '是否正确'),
				slug = typeof value === "string" ? "字符" : "项目",
				errorValue = typeof errorValue == "undefined" ? "" :errorValue;

			if(errorCode && errorCodes[errorCode]){
				tip += errorCodes[errorCode].replace('{value}', errorValue)
					.replace('{title}', title).replace('{slug}', slug);
			}else{
				tip += _tip;
			}
			tip = '<i class="fa fa-warning"></i>  '+($(dom).attr('errorTip') || tip);
			var pos = $(dom).attr("tipplace") || 'top',
				color = '#dd4b39';


			if($(dom).data('bs.tooltip')){
				$(dom).tooltip('hide');
				$(dom).data('bs.tooltip', "");
			}

			$(dom).tooltip({
				placement:function(el){
					return pos;
				},
				trigger:'manual',
				content: tip,
				container: 'body',
				html: true,
				template:'<div class="tooltip" role="tooltip" style="margin-top:0px;">'+
								'<div class="tooltip-arrow" style="border-'+pos+'-color:'+color+';">'+
								'</div><div class="tooltip-inner" style="background:'+color+';max-width: 300px; line-height: 16px; padding: 5px 7px;"></div>'+
						  '</div>'
			});

			if($(dom).is(':visible'))
				$(dom).tooltip('show');

			if(!dom.tooltip){
				dom.tooltip = true;
				$(dom).on('click', function(event) {
					setTimeout(function() {
						$(this).tooltip('hide');
					}.call(this), 300);
				});
			}

			return false;
		},
		validate: function(validate, value){
			var dom = this;
			if(!validate){
				return Util.validateError(true, dom, value);
			}
			var style = typeof validate.style !== "undefined" ? validate.style : 2;
			$(dom).addClass('form-validate-'+style);

			if(!value || !$.trim(value).length){
				return Util.validateError(validate.require ? false : true , dom, value, 'empty');
			}

			var length = value ? value.length:0;
			if(length > validate.max){
				return Util.validateError(false, dom, value, 'max', validate.max);
			}
			if(length < validate.min){
				return Util.validateError(false, dom, value, 'min', validate.min);
			}
			var regx = validate.regx;
			if(regx && !new RegExp("^" + regx + "$").test(value)){
				return Util.validateError(false, dom, value, 'regx');
			}

			if(!regx && validate.format){
				var format = validate.format.split("|");
				var f = format[0],
					l = format[1];
				if(!RegExps[f].test(value))
					return Util.validateError(false, dom, value, 'format_'+f);

				if(/float|number|int/.test(f)){
					var _value = Number(value);
					if(l){
						var len = l.replace(/[-+]/,"").split(".");
						var val = value.replace("-","").split(".");
						if(/cny/i.test(l)){
							len[1] = "2";
						}
						if(len[0] && val[0].length>Number(len[0]))
							return Util.validateError(false, dom, value, 'format_intLen', Number(len[0]));
						if(/float|number/.test(f) && len[1] && val[1] && val[1].length > Number(len[1]))
							return Util.validateError(false, dom, value, 'format_floatLen', Number(len[1]));

						if(/^[-]/.test(l) && _value >=0 )
							return Util.validateError(false, dom, value, 'format_minus');
						if(/^[+]/i.test(l) && _value <=0 )
							return Util.validateError(false, dom, value, 'format_plus');
					}
					if(typeof validate.maxNum === "number" && _value > validate.maxNum)
						return Util.validateError(false, dom, value, 'format_maxNum', validate.maxNum);
					if(typeof validate.minNum === "number" && _value < validate.minNum)
						return Util.validateError(false, dom, value, 'format_minNum', validate.minNum);
				}
			}

			return Util.validateError(true, dom, value);
		},
		getUser:function(){//获取当前用户
			return this.context.user;
		},
		getServerEnv: function(){
			return this.context.serverEnv;//获取服务器环境
		},
		getSequence: (function(){
			var index = 0;
			return function(name){
				return index++;
			};
		})(),
		getCache:(function(){
			var cache = {};
			return function(name){
				var value = cache[name];
				if(value){
					return value;
				}
				value = {};
				cache[name] = value;
				return value;
			}
		})(),

		validDateStr: function(dateStr, format){
			if(typeof dateStr =="string"){
				var strs = dateStr.split(/\s/);

				if(strs.length == 1 && /:/.test(dateStr) ){
					dateStr =  moment().format('YYYY-MM-DD') + ' '+dateStr;
				}
			}
			var _date = moment(dateStr),
				date = moment(),
	        	out = "";
	        if(_date.isValid()){
	        	date = _date;
	        	out = date.format(format);
	        }

	        return {
	        	date: date,
	        	validate: out
	        };
		},

		toCNY : function (currencyDigits) {
			if(typeof currencyDigits==="string"){
				if ((currencyDigits).match(/^-?((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
			        alert("无效数字!");
			        return "";
			    }
			    currencyDigits = currencyDigits.replace(/,/g, "");
			    currencyDigits = currencyDigits.replace(/^0+/, "");
			}
			currencyDigits = Number(currencyDigits||0);
		    var MAXIMUM_NUMBER = 99999999999.99;
		    if (currencyDigits > MAXIMUM_NUMBER) {
		        alert("数值须不大于" + MAXIMUM_NUMBER);
		        return "";
		    }
		    var CN_FU = "", CN_ZERO = "零", CN_ONE = "壹", CN_TWO = "贰", CN_THREE = "叁", CN_FOUR = "肆", CN_FIVE = "伍", CN_SIX = "陆", CN_SEVEN = "柒", CN_EIGHT = "捌", CN_NINE = "玖", CN_TEN = "拾", CN_HUNDRED = "佰", CN_THOUSAND = "仟", CN_TEN_THOUSAND = "万", CN_HUNDRED_MILLION = "亿", CN_SYMBOL = "", CN_DOLLAR = "元", CN_TEN_CENT = "角", CN_CENT = "分", CN_INTEGER = "整";
		    var integral, decimal, outputCharacters, parts, digits, radices, bigRadices, decimals, zeroCount, i, p, d, quotient, modulus;
		    currencyDigits = currencyDigits.toString();
		    if(/^[-]/.test(currencyDigits)){
		    	currencyDigits = currencyDigits.replace("-","");
		    	CN_FU = "负";
		    }
		    parts = currencyDigits.split(".");
		    if (parts.length > 1) {
		        integral = parts[0];
		        decimal = parts[1];
		        decimal = decimal.substr(0, 2);
		    }
		    else {
		        integral = parts[0];
		        decimal = "";
		    }
		    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
		    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
		    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
		    decimals = new Array(CN_TEN_CENT, CN_CENT);
		    outputCharacters = "";
		    if (Number(integral) > 0) {
		        zeroCount = 0;
		        for (i = 0; i < integral.length; i++) {
		            p = integral.length - i - 1;
		            d = integral.substr(i, 1);
		            quotient = p / 4;
		            modulus = p % 4;
		            if (d == "0") {
		                zeroCount++;
		            }
		            else {
		                if (zeroCount > 0)
		                {
		                    outputCharacters += digits[0];
		                }
		                zeroCount = 0;
		                outputCharacters += digits[Number(d)] + radices[modulus];
		            }
		            if (modulus == 0 && zeroCount < 4) {
		                outputCharacters += bigRadices[quotient];
		            }
		        }
		        outputCharacters += CN_DOLLAR;
		    }
		    if (decimal != "") {
		        for (i = 0; i < decimal.length; i++) {
		            d = decimal.substr(i, 1);
		            if (d != "0") {
		                outputCharacters += digits[Number(d)] + decimals[i];
		            } else {
		                outputCharacters += CN_ZERO;
		            }
		        }
		    }
		    if (outputCharacters == "") {
		        outputCharacters = CN_ZERO + CN_DOLLAR;
		    }
		    if (decimal == "" || decimal.length == 1 || decimal.substr(1, 1)=="0") {
		        outputCharacters += CN_INTEGER;
		    }
		    outputCharacters =CN_FU + CN_SYMBOL + outputCharacters;
		    return outputCharacters;
		},
		encodeCNY: function(value, sep){
			var reg = new RegExp(sep, "ig");
			var vals = $.trim(value).replace(reg,"").split(".");
			var val = vals[0].split("");
			var arr = [], end = false, j = 0;
			for(var i = val.length-1; i>=0; i--){
				j++;
				if(!/\d/.test(val[i])){
					end = true;
				}
				if(j>3&&!end&&(j-1)%3==0){
					arr.push(sep);
				}
				arr.push(val[i]);
			}
			vals[0] = arr.reverse().join("");
			return vals.join(".");
		},
		decodeCNY: function(value, sep){
			var reg = new RegExp(sep, "ig");
			return $.trim(value).replace(reg,"");
		},
	    popTpl: popTpl,
		dateFormat: function (date, fmt) { //author: meizz
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate(), //日
				"h+": date.getHours(), //小时
				"m+": date.getMinutes(), //分
				"s+": date.getSeconds(), //秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		},
		validateClass: function(state){
			var classes = ["form-item-error", "formError", "form-item-success"];
			if(state){
				return classes[2];
			}
			if(arguments.length)
				classes.pop();
			return classes.join(" ");
		},
		poptip: function(text, dom, trigger, tpl){
			if(text&&dom&&trigger){
				$(dom).popover({
					html:true,
					content: text,
					trigger:"manual",
					placement:"top",
					template: tpl || SUI.Util.popTpl.inp
				});
				trigger.on('focusin', function(event) {
					$(dom).popover("show");
				}).on('focusout', function(event) {
					$(dom).popover("hide");
				});
			}
		},
		sort: function(ary, func){
			if(!ary || ary.length < 1){
				return;
			}
			for(var i = 0; i < ary.length; i++){
				for(var j = i+1; j < ary.length; j++){
					if(func){
						if(func(ary[i], ary[j]) > 0){
							var max = ary[i];
							ary[i] = ary[j];
							ary[j] = max;
						}
					}else{
						if(ary[i] > ary[j]){
							var max = ary[i];
							ary[i] = ary[j];
							ary[j] = max;
						}
					}
				}
			}
		},
		browserType: function() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
               return "phone";
            } else {
                return "pc";
            }
        },
        browserPlantform: function() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            	if(bIsIpad || bIsIphoneOs){
            		return "ios";
            	}else{
            		return "android"
            	}
            } else {
                return "pc";
            }
        },
        propString: function(obj, copy){
        	var prop,
        		out = {};
        	for (prop in obj){
        		if(typeof obj[prop] == "object"){
        			obj[prop] = SUI.Util.toJsonString(obj[prop]);
        		}
        		out[prop] = obj[prop];
        	}
        	return copy ? out : obj;
        },
        setInputTextPos: function(input, spos){
        	input = $(input)[0];
        	if(!input)
        		return;
        	if(typeof spos!="number"){
				spos = input.value.length;
			}else{
				if(spos<0)
					spos += input.value.length;
			}

			if(input.setSelectionRange){ //兼容火狐,谷歌
					setTimeout(function(){
						input.setSelectionRange(spos, spos);
						input.focus();}
						,0);
			}else if(input.createTextRange){ //兼容IE
					var rng = input.createTextRange();
					rng.move('character', spos);
					rng.select();
			}
		},
		getInputTextPos: function(input){
	        input = $(input)[0];
        	if(!input)
        		return;
	         if(!input.setSelectionRange) { // IE
	            var range = document.selection.createRange();
	            range.text = '';
	            range.setEndPoint('StartToStart',input.createTextRange());
	            return range.text.length;
	        } else {
	            return input.selectionStart;
	        }
	    }

	};

	var _fn = function(fn){
		var Fn = function(args, val){
			return new Fn.prototype.init(args, val);
		}
		Fn.pt = Fn.prototype = {
			constructor: Fn
		}
		var FnClass = Fn.pt.init = function(args, val){
			if($.type(args)==="number"||$.type(args)==="string"){
				if($.type(val)==="undefined"){
					this.value = fn[args];
					return this;
				}
				fn[args] = val;
			}

			if($.isPlainObject(args)){
				$.extend(true, fn, args);
			}
			this.value = fn;
			return this;
		}

		FnClass.prototype = Fn.pt;
		return Fn;
	}

	var Settings = {
		iCheck: {
			checkStyle: 'square', // icheck 风格：minimal, square, flat
			styleColor: 'green', // icheck 颜色：black , red , green , blue , aero , grey , orange , yellow , pink , purple
			cursor: true
		},
		uploadify:{
			formData: {
				timestamp : '111'
			},
			swf: __basePath + '_libs/plugins/uploadify/uploadify.swf',
			uploader : __basePath + 'workflow/upload.jsp',
			buttonClass: "btn btn-primary btn-sm btn-uploadify",
			height:30,
			auto:true,
			multi: false,
			getFile: 'com.sudytech.portalone.base.db.getById.biz.ext',
			downloadPath: __contextPath +"/downloadfile/"
		},
		wangEditor:{
			menus: [
		        'fontfamily',
		        'fontsize',
		        'head',
		        'bold',
		        'underline',
		        'italic',
		        'forecolor',
		        'bgcolor',
		        'eraser',
		        '|',
		        'lineheight',
		        'strikethrough',
		        'quote',
		        'indent',
		        'unorderlist',
		        'orderlist',
		        'alignleft',
		        'aligncenter',
		        'alignright',
		        '|',
		        'link',
		        'unlink',
		        'table',
		        'emotion',
		        '|',
		        'img',
		        'video',
		        'location',
		        'insertcode',
		        '|',
		        'undo',
		        'redo',
		        '|'
		    ],
		    uploadImgUrl: __basePath + 'workflow/upload.jsp'
		},
		tableList: {

		},
		input: {
			escape: false
		}
	};

	var dataTables = {};

	var Config = {
		mode: "",
		validate: {},//
		properties: {}
	};

	var Zoo = {
		name: "",
		title: "",
		init: function(conf){
			this.setConfig(conf);
		},
		getValue: Util.empty,
		setValue: Util.empty,
		setConfig: function(config){
			this.name = config.properties.name;
			this.title = config.properties.title;
			this.value = config.properties.value;
		},
		getConfig: Util.empty,
		validate: function(){return true},
		parse: function(element){
			element = $(element);
			var temp = {};
			temp.mode = element.attr("mode");
			temp.properties = {
				name: element.attr("name"),
				title: element.attr("title"),
				value: element.attr("value")
			};
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			return temp;
		},
		getExt: Util.empty
	};

	//初始化SUI
	(function(){
		var zoos = {};
		function register(name, com){
			com.prototype = Zoo;
			zoos[name.toLowerCase()] = com;
		}

		function create(type, dom){
			type = type.toLowerCase();
			var element = new zoos[type](dom);
			element.zoo.type = type;
			$(element).addClass('sui-component sui-'+type);
			return element;
		}
		function build(element, type){
			if($(element).sui()){
				return element;
			}
			if(!type){
				var suitype = element.className.match(/sui-(\S+)/i);
				if(suitype&&suitype[1]){
					type = suitype[1];
				}else{
					return element;
				}
			}
			var el = create(type, element);
			var isui = $(el).attr("isui");
			if(!isui){
				$(el).attr("sui",true);
			}
			var conf = el.zoo.parse(element);
			el.zoo.init(conf);
			$(el).on('change', function(event){
				try {
					var _conf = el.zoo.getConfig();
					var value = el.zoo.getValue(true);
					if (!value||!value.length) {
						return;
					}
					if(_conf&&_conf.mode=="editable"&&_conf.validate){
						el.zoo.validate();
					}
				} catch(e) {
				}

			});
			return el;
		}
		function init(callback, context){
			for(var type in zoos){
				var zooDefine = $(".sui-" + type, context);
				zooDefine.each(function(){
					build(this);
				});
			}
			$.type(callback)==="function"&&callback();
		}
		var SUI = {
			create: create,
			init: init,
			build: build,
			register: register,
			Util: Util,
			Zoo: Zoo,
			settings: _fn(Settings),
			dataTable: _fn(dataTables)
		};
		$.each(Settings, function(key, val) {
			SUI.settings.pt[key] = function(opt){
				return $.extend(true, {}, val, opt || {});
			}
		});
		$.extend(true, SUI.settings.pt, {
            iCheck: function(opt){
            	var style = opt&&opt.iCheckStyle?opt.iCheckStyle:Settings.iCheck.checkStyle,
            		color = opt&&opt.iCheckColor?opt.iCheckColor:Settings.iCheck.styleColor,
            		skin = style+'-'+color;
				return $.extend(true, {}, {
	                  checkboxClass: 'icheckbox_'+skin,
	    			  radioClass: 'iradio_'+skin
				}, opt||{});
            }
		});

		$.fn.extend({
			sui: function(){
				var arry = [];
				this.each(function(){
					arry[arry.length] = this.zoo;
				});
				if(arry.length == 1){
					return arry[0];
				}
				if(arry.length == 0){
					return null;
				}
				return arry;
			}
		});
		window.SUI = SUI;
	})();

})();

(function(){
	//注册组件
	//SUI.register("Opinion", Opinion);
	SUI.register("Form", Form);
	SUI.register("Hide", Hide);
	SUI.register("Select", Select);
	SUI.register("Input", Input);
	SUI.register("Number", number);
	SUI.register("Date", DateSingle);
	SUI.register("DateRange", DateRange);
	SUI.register("DateRangePicker", DateRangePicker);
	SUI.register("FileUpload", FileUpload);
	//SUI.register("MultiOpinion", MultiOpinion);
	//SUI.register("Participates", Participates);
	SUI.register("MultiSelect", MultiSelect);
	//SUI.register("OpinionOne", OpinionOne);
	//SUI.register("OpinionHistory", OpinionHistory);
	//SUI.register("Rollback", Rollback);
	SUI.register("DataTable", Datatable);
	SUI.register("TableList", TableList);
	SUI.register("Rating", Rating);
	//SUI.register("Terminate", Terminate);
	SUI.register("Editor", Editor);
	//SUI.register("CheckSendMsg", CheckSendMsg);
	//SUI.register("Draft", Draft);
	//SUI.register("SelectParticipates", SelectParticipates);
	//SUI.register("FileEdit", FileEdit);
	//SUI.register("Submit", Submit);
	//form表单组件
	function Form (bind){
		var value, config;
		var dom = bind || $('<form></form>').get(0);
		dom.zoo = this;

		function getChildren(element, list){
			$("[sui='true']", element).each(function(){
				if(this.zoo){
					list[list.length] = this;
				}
			});
		}

		function getDataValue(data, name){
			if(!name){
				return;
			}
			var splits = name.split(".");
			var temp = data;
			for(var i =0; i < splits.length; i++){
				var key = splits[i];
				temp = temp[key];
				if(!temp){
					break;
				}
			}
			return temp;
		}

		function setDataValue(data, name, value){
			if(!name){
				return;
			}
			var splits = name.split(".");
			var point = data;
			for(var i = 0; i < splits.length -1; i++){
				var key = splits[i];
				if(!point[key]){
					point[key] = {};
				}
				point = point[key];
			}
			point[splits[splits.length -1]] = value;
		}

		this.setValue = function(data){
			value = data;
			var children = [];
			getChildren(dom, children);
			$.each(children, function(i, el){
				var zoo = el.zoo;
				var val = getDataValue(data, zoo.name);
				if(zoo.notForm|| typeof val ==="undefined" || val==="undefined"){
					return;
				}
				zoo.setValue(val);
			});
		}

		this.getValue = function(tranform){
			var temp  = {};
			var extValue = {};
			var children = [];
			getChildren(dom, children);
			$.each(children, function(i, el){
				var zoo = el.zoo;
				var disabled = $(el).attr('form-disabled') == "true";
				if(zoo.notForm || disabled){
					return;
				}
				var val = zoo.getValue();
				setDataValue(temp, zoo.name, val);
				var ext = zoo.getExt();
				if(ext){
					extValue[zoo.name] = ext;
				}
			});
			temp._ext = SUI.Util.toJsonString(extValue);
			if(tranform){
				tranform(temp);
			}
			return temp;
		}

		this.validate = function(){
			var children = [];
			getChildren(dom, children);
			var result = true,
				error;
			$.each(children, function(i, el){
				var zoo = el.zoo;
				var con = zoo.getConfig();
				if(!con||con.mode!=="editable"){ // mode in config
					return;
				}
				if(!zoo.validate('form')){
					if(!error)
						error = el;
					result = false;
				}
			});
			if(error && $(error).length){
				var top = $(error).offset().top - 52;
				if(top < 0)
					top = 0;
				$('html,body').stop().animate({scrollTop: top}, 300);
			}
			return result;
		}
		return dom;
	}

	//隐藏组件
	function Hide(bind){
		var dom = bind || $('<input type="hide"></input>').get(0);
		dom.zoo = this;
		var config;
		this.getValue = function(){
			return dom.value;
		}

		this.setValue = function(val){
			dom.value = val || "";
			$(dom).trigger('change');
		}
		return dom;
	}

	//文件上传组件
	function FileUpload(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var items, controlId, photos, btnId, uploadDo, editExt, tempFileId;
		this.setConfig = function(val){
			config = val;

			this.name = config.properties.name;
			this.title = config.properties.title;

			uploadDo = {
				canEdit: config.properties.canEdit,
				canUpload: config.properties.canUpload,
				canDelete: config.properties.canDelete,
				canCreate: config.properties.canCreate
			};
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				uploadDo.canEdit = false;
				uploadDo.canUpload = false;
				uploadDo.canDelete = false;
			}
			if(mode == "editable"){
				uploadDo.canUpload = true;
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			render();
			this.setValue(config.value);
		}
		this.getConfig = function (){
			return config;
		}

		this.getValue = function(js){
			if(!value || !value.length){
				return '';
			}
			if(config.properties.multi=="true"){
				return js ? value : (value.length ? SUI.Util.toJsonString(value) : "");
			}else{
				return value[0];
			}

		}

		function lazyLoading(){
			var tasks = [];
			this.run = function(id, task){
				tasks(task);
				setTimeout(function(){
					var temp = tasks;
					tasks = [];
					if(temp.length < 1){
						return;
					}
					var ids = [];
					$.each(temp, function(i, t){
						ids.push(t.id);
					})
					$.ajax({
						type: "POST",
						url: SUI.settings().uploadify().getFile,
						data: wf.jsonString({
							entity: {
								__type: "sdo:com.sudytech.portalone.base.dataset.PoFiles",
								id: key,
								ids: ids
							}
						}),
						contentType: "text/json",
						success: function(data){
							$.each(temp, function(i, task){
								task.exe(data);
							});
						}
					});
				}, 200);

			}
		}


		function loadOneFile(val,i){
			$.ajax({
				type: "POST",
				url: SUI.settings().uploadify().getFile,
				data: wf.jsonString({
					entity: {
						__type: "sdo:com.sudytech.portalone.base.dataset.PoFiles",
						id: val[i]
					}
				}),
				contentType: "text/json",
				success: function(data){
					var item = createFileItem(val[i], data.value.fileName, data.value.fileLength, true);

					if(items.find(".fileEnd").length == 0){
						items.append('<span class="fileEnd" style="color:red;display:none">...</span>');
					}
					items.find(".fileEnd").before(item);
					onchange();
					i+=1;
					if(i < val.length){
						loadOneFile(val,i);
					}
				}
			});
		}


		this.setValue = function(val){
			var mode = config.mode || "view";
			items.empty();
			photos.data = [];
			var fileKeys = [];
			if (val) {
				if(config.properties.multi=="true"){
					fileKeys = SUI.Util.parseJSON(val, true);
				}else{
					fileKeys = [val];
				}
			}
			value = fileKeys;
			if(fileKeys.length){
				var index = 0;
				loadOneFile(fileKeys,index);
			}else{
				items.html(mode=="editable"?config.placeholder:config.emptyText);
			}
		}
		this.getExt = function(){
			var cur = this.getValue(true);
			var ary = [];
			var changeName = config.properties.changeName;
			if(!changeName){
				changeName = "";
			}
			if(SUI.Util.compare(this.getValue(), config.value)){
				return {type: "fileUpload", value: ary,nameStyle:changeName};
			}
			//多选
			if(config.properties.multi=="true"){
				var srcAry = (JSON.parse(config.value || "[]")).concat([]);
				var curAry = (cur || []).concat([]);
				var contains = function(item, collect){
					var contains = false;
					$.each(collect, function(i, d){
						if(d == item){
							contains = true;
						}
					});
					return contains;
				}

				//双向比较
				$.each(srcAry, function(i, item){
					if(!contains(item, curAry)){
						ary[ary.length] = {value: item, op: "delete"};
					}
				});
				$.each(curAry, function(i, item){
					if(!contains(item, srcAry)){
						ary[ary.length] = {value: item, op: "insert"};
					}
				});
				return {type: "fileUpload", value: ary,nameStyle:changeName};
			}else{
				if(cur){
					ary[ary.length] = {value: cur, op: "insert"};
				}
				if(config.value){
					ary[ary.length] = {value: config.value, op: "delete"};
				}
				return {type: "fileUpload", value: ary,nameStyle:changeName};
			}
		}

		this.init = function (val){
			this.setConfig(val);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue(true);
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

		this.parse = function(element){
			element = element || bind;
			element = $(element);
			var temp = {};
			temp.mode = element.attr("mode");
			temp.properties = {
				name: element.attr("name"),
				title: element.attr("title"),
				canEdit: element.attr("canEdit")!=="false",
				canUpload: element.attr("canUpload")!=="false",
				canDelete: element.attr("canDelete")!=="false",
				canCreate: element.attr("canCreate")=="true",
				multi: element.attr("multi"),
				max: (element.attr("max") || 5) -0,
				ext: element.attr("ext"), // '*.gif; *.jpg; *.png' 使用分号分割
				preview: element.attr("preview"),
				previewWidth: Number(element.attr("previewWidth") || "0"),
				previewShadeClose: element.attr("previewShadeClose") == "true",
				previewStyle: element.attr("previewStyle") || "",
				buttonText: element.attr("buttonText") || "上传",
				buttonWidth: Number(element.attr("buttonWidth") || "60"),
				fileSizeLimit: Number(element.attr("fileSizeLimit") || "0"),
				changeName:element.attr("changeName"),
				existFileAlert: element.attr('existFileAlert') == "false" ? false : true,
				coverExistFile: element.attr('coverExistFile') == "true"
			};
			temp.placeholder = element.attr("placeholder") || "";
			temp.emptyText = element.attr("emptyText") || "";
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			temp.value = element.attr("value") || "";
			return temp;
		}

		this.getTempFileId = function(){
			return tempFileId;
		}

		function render(){
			var require = config.validate && config.validate.require ? "*" : "";

			var html = '';
			html += '<div class="file-items"></div>'+
						'<div class="wf-fileQueue"></div>'+
						'<input class="wf-fileControl" type="file" multiple="false" style="display:none"/>';
			$(dom).html(html);
			var div = $(dom);
			var params = config.properties;
			var control = div.find(".wf-fileControl");
			var id = "_upload" + SUI.Util.getSequence("fileUpload");
			btnId = "btn"+id;
			controlId = id;
			control.attr("id", id);
			var queue = div.find(".wf-fileQueue");
			var queueID = "queue" + id;
			queue.attr("id", queueID);
			var resultData;
			items = div.find(".file-items");
			photos = {
				title: params.title,
				id: Number(new Date()),
				start: 0,
				data: []
			};
			var cloneCtrl = null;
			var resetControl = function(formData){
				if(formData){
					control[0].value = "";
				}else{
					var control2 = cloneCtrl.clone(true, false);
					control.replaceWith(control2);
					control = control2;
				}
				control.removeClass('uploading');
			}
			if(uploadDo.canUpload){

				var isMobile = SUI.Util.browserType() == "phone";
				mobileBtn = $('<div class="btn btn-sm btn-primary btn-uploadify-mobile" id="'+btnId+'" />')
							.css({"position":"relative","overflow":"hidden"});

				control.on('click', function(event) {
					if(control.hasClass('uploading')){
						event.preventDefault();
						layer.alert('请稍后，正在上传文件...');
						return false;
					}
				});

				//isMobile = true;
				var ajaxUp = window.FormData;
				if(ajaxUp){
					control.show();
					control.addClass("upload-file-btn")
							.css({
								position: 'absolute',
								width: 1000,
								height: 32,
								fontSize:'100px',
								top:-2,
								bottom:0,
								right:-2,
								opacity:0
							})
							.wrap(mobileBtn);

					control.after('<i class="fa fa-upload"></i> '+params.buttonText);

					var loadingView = $('<div class="upload-loading" />');
					div.append(loadingView);

					var uploadAction = function(fileName, existFile){
						var validate = checkFileName(fileName);
						if(!validate){
							layer.alert("上传失败，允许上传文件类型为：" + params.ext ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl(true);
						}

						if(!checkFileSize(control, params.fileSizeLimit)){
							layer.alert("上传失败，上传文件不得超过" + params.fileSizeLimit + "KB" ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl(true);
						}

						if(control.hasClass('uploading')){
							return layer.alert('请稍后，正在上传文件...');
						}
						control.addClass('uploading');
						var formData = new FormData();
						var settings = SUI.settings().uploadify({});
						//formData.append("a", "");
						//formData.append("","");
						formData.append("Filedata",control.get(0).files[0]);
						loadingView.html("正在上传……");

						$.ajax({
							url : settings.uploader,
							type : 'POST',
							data : formData,
							xhr: function(){ //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
								myXhr = $.ajaxSettings.xhr();
								if(myXhr.upload){ //检查upload属性是否存在
									//绑定progress事件的回调函数
									myXhr.upload.addEventListener('progress',function(e){
										if (e.lengthComputable) {
											var percent = e.loaded/e.total*100;
											percent = percent  + "";
											percent = percent.substring(0,4);
											loadingView.html("正在上传…… " + percent + "%");
										}
									}, false);
								}
								return myXhr; //xhr对象返回给jQuery使用
							},
							processData : false,  //必须false才会避开jQuery对 formdata 的默认处理
							contentType : false,// 必须false才会自动加上正确的Content-Type
							success : function(data) {
								loadingView.empty();
								resultData = typeof data === "string" ? $.parseJSON(data) : data;
								if(resultData.error){
									layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
								}else{
									var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize, false, existFile);
									items.append(item);
									onchange();
									$(dom).trigger("onUploadSuccess",[resultData]);
								}
							},
							error : function(responseStr) {
								loadingView.empty();
								layer.alert("上传失败，" + responseStr,{icon: 2, title:'提示',closeBtn: 0});
							},
							complete:function(){

								// reset input, 再次上传相同无法触发change事件，导致无法上传已上传过的文件
								return resetControl(true);
							}
						});
					};
					control.on("change", function(){
						var fileName = control.val();
						if(!fileName){
							return resetControl(true);
						}
						var existFile = checkFileExists(fileName);
						if(existFile){
							if(params.coverExistFile){
								layer.confirm('存在同名文件，是否覆盖原文件？',{icon:0,title:'提示'}, function(index){
									layer.close(index);
									uploadAction(fileName, existFile);
								}, function(){
									return resetControl(true);
								});
							}else{
								layer.alert('文件已存在');
								return resetControl(true);
							}

						}else{
							uploadAction(fileName);
						}

					});
				}else if(true){
					control.show();
					control.addClass("upload-file-btn")
							.css({
								position: 'absolute',
								width: 1000,
								height: 32,
								fontSize:'100px',
								top:-2,
								bottom:0,
								right:-2,
								opacity:0
							})
							.wrap(mobileBtn);
					var settings = SUI.settings().uploadify({});
					var winName = "winName_fileUpload" + SUI.Util.getSequence("fileUpload"),
						formId = 'form_'+winName;


					//control.wrap(form);
					control.after('<i class="fa fa-upload"></i> '+params.buttonText);


					var loadingView = $('<div class="upload-loading" /><div style="display:none;"><iframe name="'+winName+'" src="about:blank"></iframe></div>');
					div.append(loadingView);
					loadingView = loadingView.first();

					var form = $('<form id="'+formId+'" action="#" method="post" enctype ="multipart/form-data" target="'+winName+'"></form>');

					form.on("submit",function(e){
						e.stopPropagation();
					});
					var existFile;
					var uploadAction = function(fileName){
						if(control.hasClass('uploading')){
							return layer.alert('请稍后，正在上传文件...');
						}
						control.addClass('uploading');
						form.submit();
						loadingView.html("正在上传……");
						resetControl();// 修复ie9及以下 上传相同文件无法触发 change事件的bug
					};
					form.prop('uploadResult',{
						call: function(data){
							loadingView.empty();
							resultData = data;
							if(resultData.error){
								layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
							}else{
								if(!checkFileSize(resultData.fileSize, params.fileSizeLimit, true)){
									return layer.alert("上传失败，上传文件不得超过" + params.fileSizeLimit + "KB" ,{icon: 2, title:'提示',closeBtn: 0});
								}
								var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize, false, existFile);
								items.append(item);
								onchange();
								$(dom).trigger("onUploadSuccess",[resultData]);
							}
						}
					});
					control.after(form);
					form.append(control);
					control.on("change", function(){
						control.attr("name", "Filedata");
						//判断是否被修改域，导致iframe跨域
						var domain = window.location.host;
						if(domain.indexOf(":") > -1){
							domain = domain.substring(0, domain.indexOf(":"));
						}
						if(domain != document.domain){
							domain = "document.domain='"+document.domain + "';"
						}else{
							domain = "";
						}

						var formScript = domain+" parent.document.getElementById('"+formId+"').uploadResult.call";
						formScript = stringToHex(formScript);
						var url = settings.uploader + "?formScript=" + formScript;
						form.attr("action", url);
						var fileName = control.val();
						if(!fileName){
							return resetControl();
						}
						var validate = checkFileName(fileName);
						if(!validate){
							layer.alert("上传失败，允许上传文件类型为：" + params.ext ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl();
						}

						var existFile = checkFileExists(fileName);
						if(existFile){
							if(params.coverExistFile){
								layer.confirm('存在同名文件，是否覆盖原文件？',{icon:0,title:'提示'}, function(index){
									layer.close(index);
									uploadAction(fileName);
								}, function(){
									return resetControl(true);
								});
							}else{
								layer.alert('文件已存在');
								return resetControl(true);
							}

						}else{
							uploadAction(fileName);
						}
					});
					cloneCtrl = control.clone(true,false);

				}else{
					control.uploadify(SUI.settings().uploadify({
						fileSizeLimit: params.fileSizeLimit ? (params.fileSizeLimit + "KB") : 0,
						buttonText: "<i class=\"fa fa-upload\"></i> " + params.buttonText,
						width: params.buttonWidth,
						fileTypeExts : params.ext,
						queueID: queueID,
						onSelect:function(file){
							if(checkFileExists(file.name)){
								control.uploadify('cancel');
								return layer.alert('该文件已存在');
							}
							if(control.hasClass('uploading')){
								control.uploadify('cancel');
								return layer.alert('请稍后，正在上传文件...');
							}
							control.addClass('uploading');
						},
						onUploadSuccess: function(file, data, response){
							if($.isFunction(config.onUploadSuccess))
								config.onUploadSuccess.apply(this, arguments);
							resultData = typeof data ==="string" ? $.parseJSON(data) : data;
							if(resultData.error){
								layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
							}else{
								var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize);
								items.append(item);
								onchange();
							}
							setTimeout(function(){
								queue.children().first().remove();
							}, 1000);
						},
						onUploadError: function(file, errorCode, errorMsg){
							if($.isFunction(config.onUploadError))
								config.onUploadError.apply(this, arguments);
						},
						onUploadProgress:function(file, fileBytesLoaded, fileTotalBytes){
							if($.isFunction(config.onUploadProgress))
								config.onUploadProgress.apply(this, arguments);
						},
						onUploadComplete:function(file){
							if($.isFunction(config.onUploadComplete))
								config.onUploadComplete.apply(this, arguments);
						},
						onUploadStart:function(file){
							if($.isFunction(config.onUploadStart))
								config.onUploadStart.apply(this, arguments);
						}
					}));
				}

			}

			function stringToHex(str){
				if(!str){
					return "";
				}
				var hex = str.charCodeAt(0).toString(16);
				for(var i=1; i<str.length; i++){
					var code = str.charCodeAt(i).toString(16);
					hex += "," + code;
				}
				hex = hex.toUpperCase();
				return hex;
			}
			function checkFileName(fileName){
				if(!config.properties.ext){
					return true;
				}
				var ext = fileName.substring(fileName.lastIndexOf("."));
				var splits = config.properties.ext.split(";");
				for(var i = 0; i < splits.length; i++){
					var filePattern = $.trim(splits[i]);
					var ext2 = filePattern.substring(filePattern.lastIndexOf("."));
					if(ext.toLowerCase() == ext2.toLowerCase()){
						return true;
					}
				}
				return false;
			}

			function checkFileExists(fileName) {
				var check = false;
				var $items = $(dom).find('.file-item');
				if(!fileName || !$items.length){
					return check;
				}

				$items.each(function(index, el) {
					var filename = $(el).attr('data-filename');
					var reg = new RegExp(filename,"gi");
					if(reg.test(fileName)){
						check = el;
						return false;
					}
				});
				return check;
			}

			function checkFileSize(el, maxSize, isNum){

				if(!isNum){
					var file = $(el)[0];
					if(maxSize>0 && file.files[0].size > maxSize*1024){
						return false;
					}
				}else{
					var size = Number(el);
					if(size && maxSize && size > maxSize*1024){
						return false;
					}
				}
				return true;
			}

			this.getResultData = function (){
				return resultData;
			}
		}

		function onchange(){
			if(!uploadDo.canUpload){
				return;
			}
			$(dom).trigger('change');
			var len = value.length;
			var uploader = $("#" + controlId +', #'+btnId);
			var editer = $("#" + controlId +', #edit'+btnId);
			if(config.properties.multi == "true" ){
				if(len < config.properties.max){
					uploader.show();
					if(editer && uploadDo.canCreate){
						editer.show();
					}
				}else{
					uploader.hide();
					if(editer){
						editer.hide();
					}
				}
			}else{
				if(len == 0){
					uploader.show();
					if(editer && uploadDo.canCreate){
						editer.show();
					}
				}else{
					uploader.hide();
					if(editer){
						editer.hide();
					}
				}
			}
		}

		function deleteFileItem(div, fileKey) {
			var fileId = fileKey;
			if(div.attr('previewid')){
				var pindex = APP.inArrayObj('pid', div.attr('previewid'), photos.data);
				if(pindex!==-1){
					var fileId = photos.data[pindex].fileKey;
					photos.data.splice(pindex,1);
				}
			}
			var fileIndex = $.inArray(fileId, value);
			if(fileIndex!==-1){
				value.splice(fileIndex,1);
				div.remove();
				onchange();
			}
		}

		function createFileItem(fileKey, fileName, fileSize, init, existFile){
			if(!value){
				value = [];
			}
			if(!init){
				if(existFile){
					var existFileKey = $(existFile).find('input').val();
					if(config.properties.coverExistFile){
						deleteFileItem($(existFile), existFileKey);
					}else{
						return layer.alert('该文件已存在');
					}
				}
				value.push(fileKey);
			}
			var div = $('<div class="file-item"><input class="wf-fileInput" type="hidden" /><a class="wf-fileView"></a> '+
			'<span class="btn btn-sm btn-danger wf-delete"><i class="fa fa-close"></i> 删除</span> '+
			'<span class="btn btn-sm btn-success wf-editBtn"><i class="fa fa-edit"></i> 编辑</span> '+
			'<span class="btn btn-sm btn-primary wf-saveBtn"><i class="fa fa-upload"></i> 上传</span></div>');
			var view = div.find(".wf-fileView");
			fileSize = fileSize -0;
			if(fileSize < 1024){
				fileSize = fileSize + "Bit";
			}else if(fileSize < 1024 * 1024){
				fileSize = (fileSize / 1024).toFixed(1) + "KB";
			}else if(fileSize < 1024 * 1024 * 1024){
				fileSize = (fileSize / (1024 * 1024)).toFixed(1) + "MB";
			}else if(fileSize < 1024 * 1024 * 1024 * 1024){
				fileSize = (fileSize / (1024 * 1024*1024)).toFixed(1) + "GB";
			}
			view.html(fileName + ' ('+fileSize+')');
			div.attr("data-filename", fileName);
			var save = div.find(".wf-saveBtn");
			save.hide();
			save.click(function(){
				if(editor.get(0).checkEdit()==1){
					editor.get(0).save();
				}else{
					alert("未修改");
				}
			});
			var input = div.find("input");
			input.val(fileKey);
			tempFileId = input.val()+Math.floor(Math.random()*1000000);
			var editBtn = div.find(".wf-editBtn");
			editBtn.hide();
			editBtn.click(function(){
				//var downUrl = __httpHost + __contextPath +"/downloadfile/"+ input.val();
				//var saveUrl = __httpHost + __basePath + 'workflow/updateFile.jsp?fileName=' + input.val();
				/*editor.get(0).open(downUrl, saveUrl);
				save.show();*/
				var dWidth = document.documentElement.clientWidth ;
				var dHeight = document.documentElement.clientHeight + 20;
				if(dWidth > 1400){
					dWidth = 1400;
				}
				if(dHeight > 650){
					dHeight = 650;
				}

				var url=__basePath+"ioffice/editor.jsp?fileId="+input.val()+ "&mEditType=1,1&tempFileId=" +tempFileId;
		        if(window.showModalDialog){
					window.showModalDialog(url,window,"dialogWidth="+dWidth+"px;dialogHeight="+dHeight+"px;resizable=yes;scroll=no");
					//window.open(url, "_blank", 'width='+document.documentElement.clientWidth+'px,height='+document.documentElement.clientHeight+20+'px,top=0,resizable=yes');
				}else{
					window.open(url, "_blank", 'height=1000, width=800, resizable=yes');
				}
			});
			view.click(function(){
				var parame = "";
				if(SUI.Util.browserPlantform() == "ios"){
					parame = "?filename=uuid";
				}


				view.attr({
					"href": SUI.settings().uploadify().downloadPath + input.val() + parame,
					"target":"_blank"
				});
			});
			if(config.properties.preview && /\.(png|gif|jpg|jpeg|bmp|ico)$/i.test(fileName)){
				var $imgView = $('<div class="file-imageview" />'),
					src = SUI.settings().uploadify().downloadPath + input.val(),
					alt = fileName.split(".")[0];
				$imgView.html('<div class="imageview-box"><img style="'+config.properties.previewStyle+'" title="点击预览" src="'+src+'" alt="'+alt+'" /></div>');
				if(config.properties.previewWidth)
					$("img", $imgView).css("width", config.properties.previewWidth);

				$imgView.prependTo(div);
				var pid = "img-" + Number(new Date());
				div.attr("previewid", pid);
				photos.data.push(
					{
				      "alt": alt,
				      'fileKey':fileKey,
				      "pid": pid, //图片id
				      "src": src, //原图地址
				      "thumb": src //缩略图地址
				    }
				);
				$imgView.find('img').on('click', function(event) {
					event.preventDefault();
					photos.start = APP.inArrayObj('pid', pid, photos.data);
					if(window.layer){
						layer.photos({
						    photos: photos
						    ,shift: 5
						    ,full:1
						    ,fullscreen:1
						    ,fulltools:1
						    ,shadeClose:config.properties.previewShadeClose
						});
					}else{
						alert('图片预览需要加载layer');
					}
				});
			}
			var delBtn = div.find(".wf-delete");
			delBtn.hide();
			delBtn.click(function(){
				layer.confirm("是否确认删除？",{icon: 3, title:'提示'},function(){
					deleteFileItem(div, fileKey);
					layer.closeAll('dialog');
				});
			});
			if(uploadDo.canEdit){
				editBtn.show();
			}
			if(uploadDo.canDelete){
				delBtn.show();
			}
			return div;
		}
		return dom;
	}



	//文件编辑
	function FileEdit(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var items, controlId, photos, btnId, uploadDo, editExt, redChro;
		this.setConfig = function(val){
			config = val;

			this.name = config.properties.name;
			this.title = config.properties.title;

			uploadDo = {
				canEdit: config.properties.canEdit,
				canUpload: config.properties.canUpload,
				canDelete: config.properties.canDelete,
				canCreate: config.properties.canCreate
			};
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				uploadDo.canEdit = false;
				uploadDo.canUpload = false;
				uploadDo.canDelete = false;
				uploadDo.canCreate = false;
			}
			if(mode == "editable"){
				uploadDo.canUpload = true;
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			render();
			this.setValue(config.value);
		}
		this.getConfig = function (){
			return config;
		}

		this.getValue = function(){
			if(config.properties.multi=="true"){
				var vals = [];
				items.find("input").each(function(){
					if(typeof($(this).val()) == "string"){
						if(""==$(this).val()){
							return "";
						}else{
							vals[vals.length] = $(this).val();
						}
					}else{
						vals[vals.length] = SUI.Util.toJsonString($(this).val());
					}
				});
				return vals.length ==0 ? "": SUI.Util.toJsonString(vals);
			}else{
				var arr = [];
				var fileVal = items.find("input").val();
				if(null == fileVal){
					return "";
				}

				if(typeof(fileVal) == "string"){
					arr.push(fileVal);
				}else{
					arr.push(SUI.Util.toJsonString(fileVal));
				}
				return SUI.Util.toJsonString(arr);
			}

		}

		function lazyLoading(){
			var tasks = [];
			this.run = function(id, task){
				tasks(task);
				setTimeout(function(){
					var temp = tasks;
					tasks = [];
					if(temp.length < 1){
						return;
					}
					var ids = [];
					$.each(temp, function(i, t){
						ids.push(t.id);
					})
					$.ajax({
						type: "POST",
						url: SUI.settings().uploadify().getFile,
						data: wf.jsonString({
							entity: {
								__type: "sdo:com.sudytech.portalone.base.dataset.PoFiles",
								id: key,
								ids: ids
							}
						}),
						contentType: "text/json",
						success: function(data){
							$.each(temp, function(i, task){
								task.exe(data);
							});
						}
					});
				}, 200);

			}
		}

		this.setValue = function(val){
			var mode = config.mode || "view";
			items.empty();
			photos.data = [];
			var fileKeys = [];
			if (val) {
				if(config.properties.multi=="true"){
					fileKeys = SUI.Util.parseJSON(val, true);
				}else{
					fileKeys = [val];
				}
			}
			value = fileKeys;
			if (fileKeys.length) {
				$.each(fileKeys, function(i, key){
					var keyJson = {};
					if(typeof(key) == "string"){
						keyJson = SUI.Util.parseJSON(key,true);
					}else{
						keyJson = key;
					}
					$.ajax({
						type: "POST",
						url: SUI.settings().uploadify().getFile,
						data: wf.jsonString({
							entity: {
								__type: "sdo:com.sudytech.portalone.base.dataset.PoFiles",
								id: keyJson.word
							}
						}),
						contentType: "text/json",
						success: function(data){
							var item = createFileItem(keyJson, data.value.fileName, data.value.fileLength, editExt, redChro, false);

							if(items.find(".fileEnd").length == 0){
								items.append('<span class="fileEnd" style="color:red;display:none">...</span>');
							}
							items.find(".fileEnd").before(item);
							onchange();
						}
					});
				});
			}else{
				items.html(mode=="editable"?config.placeholder:config.emptyText);
			}
		}
		this.getExt = function(){
			var cur = this.getValue();
			var ary = [];
			if(SUI.Util.compare(cur, value)){
				return {type: "fileUpload", value: ary};
			}
			//多选
			if(config.properties.multi=="true"){
				var srcAry = SUI.Util.parseJSON(value || '[]');
				var curAry = SUI.Util.parseJSON(cur || '[]');
				var contains = function(item, collect){
					var contains = false;
					var obj1 = {};
					var obj2 = {};
					$.each(collect, function(i, d){
						if(typeof(item) == "string"){
							obj1 = SUI.Util.parseJSON(item);
						}else{
							obj1 = item;
						}

						if(typeof(d) == "string"){
							obj2 = SUI.Util.parseJSON(d);
						}else{
							obj2 = d;
						}

						if(obj2.word == obj1.word){
							contains = true;
						}
					});
					return contains;
				}

				//双向比较
				var temp = "";
				$.each(srcAry, function(i, item){
					if(!contains(item, curAry)){
						if(typeof(item) == "string"){
							temp = item;
						}else{
							temp = SUI.Util.toJsonString(item);
						}
						ary[ary.length] = {value: temp, op: "delete"};
					}
				});
				$.each(curAry, function(i, item){
					if(!contains(item, srcAry)){
						if(typeof(item) == "string"){
							temp = item;
						}else{
							temp = SUI.Util.toJsonString(item);
						}
						ary[ary.length] = {value: temp, op: "insert"};
					}
				});
				return {type: "fileUpload", value: ary};
			}else{
				var temp = [];
				if(cur){
					if(typeof(cur) == "string"){
						temp = SUI.Util.parseJSON(cur);
					}else{
						temp = cur;
					}
					ary[ary.length] = {value: temp[0], op: "insert"};
				}
				if(value){
					if(typeof(value) == "string"){
						temp = SUI.Util.parseJSON(value);
					}else{
						temp = value;
					}
					ary[ary.length] = {value: temp[0], op: "delete"};
				}
				return {type: "fileUpload", value: ary};
			}
		}

		this.init = function (val){
			this.setConfig(val);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

		this.parse = function(element){
			element = element || bind;
			element = $(element);
			var temp = {};
			temp.mode = element.attr("mode");
			temp.properties = {
				name: element.attr("name"),
				title: element.attr("title"),
				canEdit: element.attr("canEdit")!=="false",
				canUpload: element.attr("canUpload")!=="false",
				canDelete: element.attr("canDelete")!=="false",
				canCreate: element.attr("canCreate")=="true",
				multi: element.attr("multi"),
				max: (element.attr("max") || 5) -0,
				ext: element.attr("ext"), // '*.gif; *.jpg; *.png' 使用分号分割
				preview: element.attr("preview"),
				previewWidth: Number(element.attr("previewWidth") || "0"),
				previewShadeClose: element.attr("previewShadeClose") == "true",
				previewStyle: element.attr("previewStyle") || "",
				buttonText: element.attr("buttonText") || "上传",
				buttonWidth: Number(element.attr("buttonWidth") || "60"),
				fileSizeLimit: Number(element.attr("fileSizeLimit") || "0"),
				editExt : element.attr("editExt"),
				redChro : element.attr("redChro"),
				workItemId : element.attr("workItemId"),
				activityId : element.attr("activityId")
			};
			temp.placeholder = element.attr("placeholder") || "";
			temp.emptyText = element.attr("emptyText") || "";
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			temp.value = element.attr("value") || "";
			return temp;
		}


		this.getEditExt = function(){
			return editExt;
		}
		this.getRedChro = function(){

			return redChro;
		}

		function render(){
			var require = config.validate && config.validate.require ? "*" : "";

			var html = '';
			html += '<div class="file-items"></div>'+
						'<div class="wf-fileQueue"></div>'+
						'<input class="wf-fileControl" type="file" multiple="false" style="display:none"/>';
			$(dom).html(html);
			var div = $(dom);
			var params = config.properties;
			editExt = params.editExt;
			redChro = params.redChro;
			var control = div.find(".wf-fileControl");
			var id = "_upload" + SUI.Util.getSequence("fileUpload");
			btnId = "btn"+id;
			controlId = id;
			control.attr("id", id);
			var queue = div.find(".wf-fileQueue");
			var queueID = "queue" + id;
			queue.attr("id", queueID);
			var resultData;
			items = div.find(".file-items");
			photos = {
				title: params.title,
				id: Number(new Date()),
				start: 0,
				data: []
			};
			var cloneCtrl = null;
			var resetControl = function(formData){
				if(formData){
					control[0].value = "";
				}else{
					var control2 = cloneCtrl.clone(true, false);
					control.replaceWith(control2);
					control = control2;
				}
			}
			if(uploadDo.canUpload){

				var isMobile = SUI.Util.browserType() == "phone";
				mobileBtn = $('<div class="btn btn-sm btn-primary btn-uploadify-mobile" id="'+btnId+'" />')
							.css({"position":"relative","overflow":"hidden"});

				//isMobile = true;
				var ajaxUp = window.FormData;
				if(ajaxUp){
					control.show();
					control.addClass("upload-file-btn")
							.css({
								position: 'absolute',
								width: 1000,
								height: 32,
								fontSize:'100px',
								top:-2,
								bottom:0,
								right:-2,
								opacity:0
							})
							.wrap(mobileBtn);

					control.after('<i class="fa fa-upload"></i> '+params.buttonText);

					if(uploadDo.canCreate){
						var onLineEditBtn = $('<div class="btn btn-sm btn-primary btn-uploadify-mobile" id="edit'+btnId+'" />')
						.css({"position":"relative","overflow":"hidden","margin-left":"10px"});
						div.append(onLineEditBtn);
						$("#edit"+btnId).append('<i class="fa fa-file-word-o"></i> 撰写');
					}


					var loadingView = $('<div class="upload-loading" />');
					div.append(loadingView);
					control.on("change", function(){
						var fileName = control.val();
						if(!fileName){
							return resetControl(true);
						}
						var validate = checkFileName(fileName);
						if(!validate){
							layer.alert("上传失败，允许上传文件类型为：" + params.ext ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl(true);
						}

						if(!checkFileSize(control, params.fileSizeLimit)){
							layer.alert("上传失败，上传文件不得超过" + params.fileSizeLimit + "KB" ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl(true);
						}

						var formData = new FormData();
						var settings = SUI.settings().uploadify({});
						//formData.append("a", "");
						//formData.append("","");
						formData.append("Filedata",control.get(0).files[0]);
						loadingView.html("正在上传……");

						$.ajax({
							url : settings.uploader,
							type : 'POST',
							data : formData,
							xhr: function(){ //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
								myXhr = $.ajaxSettings.xhr();
								if(myXhr.upload){ //检查upload属性是否存在
									//绑定progress事件的回调函数
									myXhr.upload.addEventListener('progress',function(e){
										if (e.lengthComputable) {
											var percent = e.loaded/e.total*100;
											percent = percent  + "";
											percent = percent.substring(0,4);
											loadingView.html("正在上传…… " + percent + "%");
										}
									}, false);
								}
								return myXhr; //xhr对象返回给jQuery使用
							},
							processData : false,  //必须false才会避开jQuery对 formdata 的默认处理
							contentType : false,// 必须false才会自动加上正确的Content-Type
							success : function(data) {
								loadingView.empty();
								resultData = $.parseJSON(data);
								if(resultData.error){
									layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
								}else{
									var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize, editExt, redChro, true);
									items.append(item);
									onchange();
									$(dom).trigger("onUploadSuccess",[resultData]);
								}
							},
							error : function(responseStr) {
								loadingView.empty();
								layer.alert("上传失败，" + responseStr,{icon: 2, title:'提示',closeBtn: 0});
							},
							complete:function(){

								// reset input, 再次上传相同无法触发change事件，导致无法上传已上传过的文件
								return resetControl(true);
							}
						});
					});

					//在线编辑
					$("#edit"+btnId).on("click",function(){
						onLineEdit(this);
					});//在线编辑
				}else if(true){
					control.show();
					control.addClass("upload-file-btn")
							.css({
								position: 'absolute',
								width: 1000,
								height: 32,
								fontSize:'100px',
								top:-2,
								bottom:0,
								right:-2,
								opacity:0
							})
							.wrap(mobileBtn);
					var settings = SUI.settings().uploadify({});
					var winName = "winName_fileUpload" + SUI.Util.getSequence("fileUpload"),
						formId = 'form_'+winName;


					//control.wrap(form);
					control.after('<i class="fa fa-upload"></i> '+params.buttonText);

					if(uploadDo.canCreate){
						var onLineEditBtn = $('<div class="btn btn-sm btn-primary btn-uploadify-mobile" id="edit'+btnId+'" />')
						.css({"position":"relative","overflow":"hidden","margin-left":"10px"});
					    div.append(onLineEditBtn);
					    $("#edit"+btnId).append('<i class="fa fa-file-word-o"></i> 撰写');
					}

					var loadingView = $('<div class="upload-loading" /><div style="display:none;"><iframe name="'+winName+'" src="about:blank"></iframe></div>');
					div.append(loadingView);
					loadingView = loadingView.first();

					var form = $('<form id="'+formId+'" action="#" method="post" enctype ="multipart/form-data" target="'+winName+'"></form>');

					form.on("submit",function(e){
						e.stopPropagation();
					});

					form.prop('uploadResult',{
						call: function(data){
							loadingView.empty();
							resultData = data;
							if(resultData.error){
								layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
							}else{
								if(!checkFileSize(resultData.fileSize, params.fileSizeLimit, true)){
									return layer.alert("上传失败，上传文件不得超过" + params.fileSizeLimit + "KB" ,{icon: 2, title:'提示',closeBtn: 0});
								}
								var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize, editExt, redChro, true);
								items.append(item);
								onchange();
								$(dom).trigger("onUploadSuccess",[resultData]);
							}
						}
					});
					control.after(form);
					form.append(control);
					control.on("change", function(){
						control.attr("name", "Filedata");
						//判断是否被修改域，导致iframe跨域
						var domain = window.location.host;
						if(domain.indexOf(":") > -1){
							domain = domain.substring(0, domain.indexOf(":"));
						}
						if(domain != document.domain){
							domain = "document.domain='"+document.domain + "';"
						}else{
							domain = "";
						}

						var formScript = domain+" parent.document.getElementById('"+formId+"').uploadResult.call";
						formScript = stringToHex(formScript);
						var url = settings.uploader + "?formScript=" + formScript;
						form.attr("action", url);
						var fileName = control.val();
						if(!fileName){
							return resetControl();
						}
						var validate = checkFileName(fileName);
						if(!validate){
							layer.alert("上传失败，允许上传文件类型为：" + params.ext ,{icon: 2, title:'提示',closeBtn: 0});
							return resetControl();
						}

						form.submit();
						loadingView.html("正在上传……");
						resetControl();// 修复ie9及以下 上传相同文件无法触发 change事件的bug
					});
					cloneCtrl = control.clone(true,false);

					//在线编辑
					$("#edit"+btnId).on("click",function(){
						onLineEdit(this);
					});//在线编辑
				}else{
					control.uploadify(SUI.settings().uploadify({
						fileSizeLimit: params.fileSizeLimit ? (params.fileSizeLimit + "KB") : 0,
						buttonText: "<i class=\"fa fa-upload\"></i> " + params.buttonText,
						width: params.buttonWidth,
						fileTypeExts : params.ext,
						queueID: queueID,
						onUploadSuccess: function(file, data, response){
							if($.isFunction(config.onUploadSuccess))
								config.onUploadSuccess.apply(this, arguments);
							resultData = $.parseJSON(data);
							if(resultData.error){
								layer.alert("上传失败",{icon: 2, title:'提示',closeBtn: 0});
							}else{
								var item = createFileItem(resultData.fileKey, resultData.fileName, resultData.fileSize, editExt, redChro , true);
								items.append(item);
								onchange();
							}
							setTimeout(function(){
								queue.children().first().remove();
							}, 1000);
						},
						onUploadError: function(file, errorCode, errorMsg){
							if($.isFunction(config.onUploadError))
								config.onUploadError.apply(this, arguments);
						},
						onUploadProgress:function(file, fileBytesLoaded, fileTotalBytes){
							if($.isFunction(config.onUploadProgress))
								config.onUploadProgress.apply(this, arguments);
						},
						onUploadComplete:function(file){
							if($.isFunction(config.onUploadComplete))
								config.onUploadComplete.apply(this, arguments);
						},
						onUploadStart:function(file){
							if($.isFunction(config.onUploadStart))
								config.onUploadStart.apply(this, arguments);
						}
					}));
				}

			}

			function onLineEdit(el){
				fileDiv = el.parentElement;
				// var url="/default/base/ioffice/editor.jsp";
				var url=__basePath +"ioffice/editor.jsp";


				var dWidth = document.documentElement.clientWidth ;
				var dHeight = document.documentElement.clientHeight + 20;
				if(dWidth > 1400){
					dWidth = 1400;
				}
				if(dHeight > 650){
					dHeight = 650;
				}

				var paramArr = [];
				paramArr[0] = window;                           //编辑状态
				paramArr[1] = config.properties.workItemId;    //workItemId
				paramArr[2] = config.properties.activityId;    //activityId
				paramArr[3] = "";
				paramArr[4] = "";
				paramArr[5] = "";
				paramArr[6] = "";
				paramArr[7] = "";
				paramArr[8] = "";

				var ee = config.properties.editExt;
				if(undefined != ee &&  ee.length > 2){
					var extJson = SUI.Util.parseJSON(ee);
					if(extJson.redTitle){
						paramArr[3] = extJson.redTitle;
					}else{
						paramArr[3] = "";
					}

					if(extJson.dicttype){
						paramArr[4] = extJson.dicttype;
					}else{
						paramArr[4] = "";
					}
				}
		        if(window.showModalDialog){
					window.showModalDialog(url,paramArr,"dialogWidth="+dWidth+"px;dialogHeight="+dHeight+"px;resizable=yes;scroll=no");
					//window.open(url, "_blank", 'width='+document.documentElement.clientWidth+'px,height='+document.documentElement.clientHeight+20+'px,top=0,resizable=yes');
				}else{
					window.open(url, "_blank", 'height=1000, width=800, resizable=yes');
				}
			}


			function stringToHex(str){
				if(!str){
					return "";
				}
				var hex = str.charCodeAt(0).toString(16);
				for(var i=1; i<str.length; i++){
					var code = str.charCodeAt(i).toString(16);
					hex += "," + code;
				}
				hex = hex.toUpperCase();
				return hex;
			}
			function checkFileName(fileName){
				if(!config.properties.ext){
					return true;
				}
				var ext = fileName.substring(fileName.lastIndexOf("."));
				var splits = config.properties.ext.split(";");
				for(var i = 0; i < splits.length; i++){
					var filePattern = $.trim(splits[i]);
					var ext2 = filePattern.substring(filePattern.lastIndexOf("."));
					if(ext.toLowerCase() == ext2.toLowerCase()){
						return true;
					}
				}
				return false;
			}

			function checkFileSize(el, maxSize, isNum){

				if(!isNum){
					var file = $(el)[0];
					if(maxSize>0 && file.files[0].size > maxSize*1024){
						return false;
					}
				}else{
					var size = Number(el);
					if(size && maxSize && size > maxSize*1024){
						return false;
					}
				}
				return true;
			}

			this.getResultData = function (){
				return resultData;
			}
		}

		function onchange(){
			if(!uploadDo.canUpload){
				return;
			}
			$(dom).trigger('change');
			var len = items.children().length;
			var uploader = $("#" + controlId +', #'+btnId);
			var editer = $("#" + controlId +', #edit'+btnId);
			if(config.properties.multi == "true" ){
				if(len < config.properties.max){
					uploader.show();
					if(editer && uploadDo.canCreate){
						editer.show();
					}
				}else{
					uploader.hide();
					if(editer){
						editer.hide();
					}
				}
			}else{
				if(len == 0){
					uploader.show();
					if(editer && uploadDo.canCreate){
						editer.show();
					}
				}else{
					uploader.hide();
					if(editer){
						editer.hide();
					}
				}
			}
		}

		function convertWordToImage(fileKey){
			var fileKeys = "";
			$.ajax({
				url : 'com.sudytech.portalone.base.core.convert.convertWordToImage.biz.ext',
				type : 'POST',
				data : SUI.Util.toJsonString({
					fileId : fileKey, isTemp : false     //TODO:等涂大强的附件上传到temp时改成true
				}),
				contentType : 'text/json',
				async : false,
				success : function(d){
					var result = d.result;
					if(result && "fail" != result){
						fileKeys = result;
					}
				}

			});

			return fileKeys;
		}

		function createFileItem(fileKey, fileName, fileSize, editExt, redChro, isTemp){


			var div = $('<div class="file-item"><input class="wf-fileInput" type="hidden" /><a class="wf-fileView"></a> '+
			'<span class="btn btn-sm btn-danger wf-delete"><i class="fa fa-close"></i> 删除</span> '+
			'<span class="btn btn-sm btn-success wf-editBtn"><i class="fa fa-edit"></i> 编辑</span> '+
			'<span class="btn btn-sm btn-success wf-pdfBtn"><i class="fa fa-file-pdf-o"></i> 查看pdf</span> '+
			'<span class="btn btn-sm btn-success wf-imgBtn"><i class="fa fa-file-image-o"></i> 查看图片</span> '+
			'<span class="btn btn-sm btn-primary wf-saveBtn"><i class="fa fa-upload"></i> 上传</span></div>');
			var view = div.find(".wf-fileView");
			fileSize = fileSize -0;
			if(fileSize < 1024){
				fileSize = fileSize + "Bit";
			}else if(fileSize < 1024 * 1024){
				fileSize = (fileSize / 1024).toFixed(1) + "KB";
			}else if(fileSize < 1024 * 1024 * 1024){
				fileSize = (fileSize / (1024 * 1024)).toFixed(1) + "MB";
			}else if(fileSize < 1024 * 1024 * 1024 * 1024){
				fileSize = (fileSize / (1024 * 1024*1024)).toFixed(1) + "GB";
			}
			view.html(fileName + ' ('+fileSize+')');

			var save = div.find(".wf-saveBtn");
			save.hide();
			save.click(function(){
				if(editor.get(0).checkEdit()==1){
					editor.get(0).save();
				}else{
					alert("未修改");
				}
			});

			var input = div.find("input");
			var inputVal = {};
			var strKey = "";

			if(typeof(fileKey) == "string"){
				inputVal = {"word":fileKey,"pdf":"","img":""};
				strKey = fileKey;
			}else{
				inputVal = fileKey;
				strKey = fileKey.word;
			}

			if(isTemp){
				isTemp = false; //TODO:等涂大强的附件上传到temp时再去掉
				var imgKey = convertWordToImage(strKey);
				inputVal.img = imgKey;
			}

			input.val(SUI.Util.toJsonString(inputVal));

			//查看pdf和图片展示和隐藏
			var pdf = div.find(".wf-pdfBtn");
			var img = div.find(".wf-imgBtn");
			var keyJson = inputVal;
			if("" == keyJson.pdf){
				pdf.hide();
			}
			if("" == keyJson.img){
				img.hide();
			}

			var editBtn = div.find(".wf-editBtn");
			editBtn.hide();
			editBtn.click(function(){
				fileDiv = this.parentElement.parentElement.parentElement;
				var dWidth = document.documentElement.clientWidth ;
				var dHeight = document.documentElement.clientHeight + 20;
				if(dWidth > 1400){
					dWidth = 1400;
				}
				if(dHeight > 650){
					dHeight = 650;
				}

				var paramArr = [];
				paramArr[0] = window;                          //编辑状态
				paramArr[1] = config.properties.workItemId;    //workItemId
				paramArr[2] = config.properties.activityId;    //activityId
				paramArr[3] = "";
				paramArr[4] = "";
				paramArr[5] = "";
				paramArr[6] = "";
				paramArr[7] = "";
				paramArr[8] = "";
				paramArr[9] = [];
				//编辑属性扩展
				if(undefined != editExt &&  editExt.length > 2){
					var extJson = SUI.Util.parseJSON(editExt);
					if(extJson.redTitle){
						paramArr[3] = extJson.redTitle;
					}

					if(extJson.dicttype){
						paramArr[4] = extJson.dicttype;
					}

					if(extJson.pdf){
						paramArr[5] = extJson.pdf;
					}

					if(extJson.img){
						paramArr[6] = extJson.img;
					}

					if(extJson.signature){
						paramArr[7] = extJson.signature;
					}

					if(extJson.print){
						paramArr[8] = extJson.print;
					}

				}

				var redParam = [];
				var redJson = {};
				var redVal = "";
				if(undefined != redChro && redChro.length > 0){
					var redArr = SUI.Util.parseJSON(redChro);
					for(var i=0; i<redArr.length; i++){
						if("string" == typeof(redArr[i])){
							redJson = SUI.Util.parseJSON(redArr[i]);
						}else{
							redJson = redArr[i];
						}
						redVal = redJson.value;
						if($("div[name='" +redVal+ "']").sui()){
							redJson.value = $("div[name='" +redVal+ "']").sui().getValue();
						}
						redParam.push(redJson);
					}
					paramArr[9] = redParam;
				}

				var url= __basePath +"ioffice/editor.jsp?fileId="+strKey;
		        if(window.showModalDialog){
					window.showModalDialog(url,paramArr,"dialogWidth="+dWidth+"px;dialogHeight="+dHeight+"px;resizable=yes;scroll=no");
					//window.open(url, "_blank", 'width='+document.documentElement.clientWidth+'px,height='+document.documentElement.clientHeight+20+'px,top=0,resizable=yes');
				}else{
					window.open(url, "_blank", 'height=1000, width=800, resizable=yes');
				}
			});

			img.click(function(){

				layer.open({
			         type: 2,
			         title: "查看图片",
			         shadeClose: false,
			         maxmin: false,
			         shade: 0.6,
			         area: [800 + "px", 600 + "px"],
			         scrollbar: true,
			         closeBtn:1,
			         content: __basePath + "openImg/showImg.jsp", //iframe的url，替换
			         success: function (layero, index){
			        	$(".layui-layer-max").trigger("click");
			        	var f = window[layero.find('iframe')[0]['name']];
			        	f.setData(inputVal.img);
			         }
				});
			});

			pdf.click(function(){
				var url=__basePath+"iwebpdf/view.jsp?fileId="+inputVal.pdf;
				window.open(url,"_blank");
			});

			view.click(function(){
				var parame = "";
				if(SUI.Util.browserPlantform() == "ios"){
					parame = "?filename=uuid";
				}


				view.attr({
					"href": SUI.settings().uploadify().downloadPath + strKey + parame,
					"target":"_blank"
				});
			});
			if(config.properties.preview && /\.(png|gif|jpg|jpeg|bmp|ico)$/i.test(fileName)){
				var $imgView = $('<div class="file-imageview" />'),
					src = SUI.settings().uploadify().downloadPath + strKey,
					alt = fileName.split(".")[0];
				$imgView.html('<div class="imageview-box"><img style="'+config.properties.previewStyle+'" title="点击预览" src="'+src+'" alt="'+alt+'" /></div>');
				if(config.properties.previewWidth)
					$("img", $imgView).css("width", config.properties.previewWidth);

				$imgView.prependTo(div);
				var pid = "img-" + Number(new Date());
				div.attr("previewid", pid);
				photos.data.push(
					{
				      "alt": alt,
				      "pid": pid, //图片id
				      "src": src, //原图地址
				      "thumb": src //缩略图地址
				    }
				);
				$imgView.find('img').on('click', function(event) {
					event.preventDefault();
					photos.start = APP.inArrayObj('pid', pid, photos.data);
					if(window.layer){
						layer.photos({
						    photos: photos
						    ,shift: 5
						    ,full:1
						    ,fullscreen:1
						    ,fulltools:1
						    ,shadeClose:config.properties.previewShadeClose
						});
					}else{
						alert('图片预览需要加载layer');
					}
				});
			}
			var delBtn = div.find(".wf-delete");
			delBtn.hide();
			delBtn.click(function(){
				layer.confirm("是否确认删除？",{icon: 3, title:'提示'},function(){
					if(div.attr('previewid')){
						var pindex = APP.inArrayObj('pid', div.attr('previewid'), photos.data);
						if(pindex!==-1){
							photos.data.splice(pindex,1);
						}
					}
					div.remove();
					onchange();
					layer.closeAll('dialog');
				});
			});
			if(uploadDo.canEdit){
				editBtn.show();
			}
			if(uploadDo.canDelete){
				delBtn.show();
			}
			return div;
		}
		return dom;
	}

	/**
	** select组件
	*/
	function Select(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;
		$(dom).addClass('form-select');


        var $select, $radio;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getValue = function(){
			if(this.selectStyle == "select"){
				return $select.val();
			}else if(this.selectStyle == "radio"){
				return $radio.filter(":checked").val();
			}
        }

		this.setValue = function(val){
			value = val;
			if(typeof(val) == "number" ){
				val = val + "";
			}
			if(this.selectStyle == "select"){
				$select.val(val).trigger("change");
			}else if(this.selectStyle == "radio"){
				$radio.filter("[value='"+val+"']").iCheck("check");
			}

		}

		this.getConfig = function(){
			return config;
		}

		this.setConfig = function(val){
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;
			value = config.value || value;
			var _this = this;
			var require = config.validate && config.validate.require ? '<span class="text-red">*</span>' : '';
			var title = config.properties.title || "";
			var name = config.properties.name || "";
			this.selectStyle = config.properties.selectStyle;
			if(this.selectStyle == "select"){
				var listOptions = render(config.properties.dataSource);
				var template = '<select name="'+name+'" class="form-control" style="width: 100%;">'+
										listOptions +
									'</select>';
				$(dom).html(template);
				$select = $("select", dom);
				var mode = config.mode || 'view';
				if(mode == "readOnly" || mode == "view"){
					$select.attr("disabled", "disabled");
					$(dom).addClass('form-readOnly');
				}
				if(mode == "editable"){
					$select.removeAttr("disabled");
					$(dom).removeClass('form-readOnly');
				}
				if(mode == "hide"){
					$(dom).hide();
				}
				$select.select2($.extend(true, {minimumResultsForSearch:-1}, config.select2||{}));
			}
			if(this.selectStyle == "radio"){
				var listOptions = render(config.properties.dataSource, this.selectStyle, this.name);
				var template = '<div class="radio-group">'+
									listOptions +
								'</div>';
				$(dom).html(template);
				$radio =  $("input[name="+this.name+"]", dom);

				var mode = config.mode || 'view';
				if(mode == "readOnly" || mode == "view"){
					$radio.attr("disabled", "disabled");
					$(dom).addClass('form-readOnly');
				}
				if(mode == "editable"){
					$radio.removeAttr("disabled").on('ifChecked', function(event) {
						event.preventDefault();
						$(dom).trigger('change');
					});
					$(dom).removeClass('form-readOnly');
				}
				if(mode == "hide"){
					$(dom).hide();
				}
				$radio.iCheck(SUI.settings().iCheck({
					iCheckStyle: config.properties.checkStyle,
					iCheckColor: config.properties.checkColor
				}));
			}
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function getDataSource(element){
        	var el = element || bind;
        	var _source = $(dom).attr("dataSource");
        	return SUI.Util.parseJSON(_source || '[]', true);
        }

        function render(data, selectStyle, name){
        	var html = "";
        	if(!data)
        		return html;
			$.each(data, function(i, _v){
				var v = $.isPlainObject(_v) ? _v : {value:_v, name:_v};
				var checked = v.value==value;
				if(selectStyle==="radio"){
					var id = SUI.Util.getSequence("select");
					id = "sui-select-"+ name + id;
					html += '<label for="'+id+'"><input id="'+id+'"'+(checked ?" checked":"")+' type="radio" name="'+name+'" value="'+v.value+'" />'+v.name+'</label>';
				}else{
					html += '<option'+(checked ?" selected":"")+' value="'+v.value+'">'+v.name+'</option>';
				}
			});
        	return html;
        }

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name"),
        			dataSource: getDataSource(el),
					selectStyle: $(el).attr("selectStyle") || "select", //select | radio
					checkStyle: $(dom).attr('checkStyle'),
					checkColor: $(dom).attr('checkColor')
        		},
        		value: $(el).attr("value") || "",
        		select2: SUI.Util.parseJSON($(el).attr("select2"), true)
        	};
        	return _data;
        }

        return dom;
	}

	/**
	** multiselect组件
	*/
	function MultiSelect(bind){
		var dom = bind || $("<div />")[0], config, value, triggerIndex = 0, isSet = false;
		dom.zoo = this;
		$(dom).addClass('form-multiselect');

        var $select, $checkbox;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getValue = function(js){
        	var vals;
			if(this.selectStyle == "select"){
				vals = $select.val();
			}else if(this.selectStyle == "checkbox"){
				vals = (function(){
					var _val = [];
					$checkbox.each(function(index, el) {
						if($(el).is(":checked"))
							_val.push(el.value);
					});
					return _val;
				})();
			}
			return js ? vals.join(",") : vals;
        }

		this.setValue = function(val){
			if(typeof val === "string" && /^\[.*\]$/.test(val) ){
				val = (function(){return eval('(function(){return '+val+'})()');})();
			}
			if(!$.isArray(val)){
				val = (val + "").split(/[,|\||\&]/);
			}
			value = val;
			if(this.selectStyle == "select"){
				$select.val(val).trigger('change');
			}else if(this.selectStyle == "checkbox"){
				isSet = true;
				$checkbox.iCheck("uncheck");
				$.each(val, function(index, v) {
					triggerIndex++;
					$checkbox.filter("[value='"+v+"']").iCheck("check");
				});
			}

		}

		this.getConfig = function(){
			return config;
		}

		this.setConfig = function(val){
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;

			var _this = this;
			var require = config.validate && config.validate.require ? '<span class="text-red">*</span>' : '';
			var title = config.properties.title || "";
			var name = config.properties.name || "";
			var _value = value || config.value;
			this.selectStyle = config.properties.selectStyle;
			if(this.selectStyle == "select"){
				var listOptions = render(config.properties.dataSource);
				var template = '<select name="'+name+'" multiple="multiple" class="form-control" style="width: 100%;">'+
									listOptions +
								'</select>';
				$(dom).html(template);
				$select = $("select", dom);
				var mode = config.mode || 'view';
				if(mode == "readOnly" || mode == "view"){
					$select.attr("disabled", "disabled");
					$(dom).addClass('form-readOnly');
				}
				if(mode == "editable"){
					$select.removeAttr("disabled");
					$(dom).removeClass('form-readOnly');
				}
				if(mode == "hide"){
					$(dom).hide();
				}
				$select.select2($.extend(true, {
					minimumResultsForSearch:-1,
					maximumSelectionLength: config.properties.maxSize,
					mobile: mode !="editable"
				}, config.select2 || {}));
				if(_value){
					this.setValue(_value);
				}
			}
			if(this.selectStyle == "checkbox"){
				var listOptions = render(config.properties.dataSource, this.selectStyle, this.name);
				var template = '<div class="checkbox-group">'+
									listOptions +
								'</div>';
				if(config.properties.maxSize){
					var maxtip = '最多只能选择'+config.properties.maxSize+'个项目';
					$(dom).popover({
						html:true,
						content: maxtip,
						trigger:"manual",
						template: SUI.Util.popTpl.tip,
						placement:"top"
					});
				}
				$(dom).html(template);
				$checkbox =  $("input[name="+this.name+"]", dom);
				if(_value){
					this.setValue(_value);
				}
				var mode = config.mode || 'view';
				if(mode == "readOnly" || mode == "view"){
					$checkbox.attr("disabled", "disabled");
				}
				if(mode == "editable"){
					$checkbox.removeAttr("disabled").on('ifChanged', function(event) {
						event.preventDefault();
						if(maxtip&&$("input:checked", dom).length === config.properties.maxSize){
							$("input", dom).not(":checked").iCheck('disable');
						}else{
							$("input:disabled", dom).iCheck('enable');
						}
						if(!value||!isSet||triggerIndex===value.length){
							$(dom).trigger('change');
							triggerIndex = 0;
							isSet = false;
						}
						$(dom).popover("hide");
					});

					$("label", dom).on('click', function(event) {
						event.preventDefault();
						if($(this).find("[disabled]").length&&maxtip&&$("input:checked", dom).length >= config.properties.maxSize){
							$(dom).popover("show");
							setTimeout(function(){
								$(dom).popover("hide");
							},3000)
						}
					});
				}
				if(mode == "hide"){
					$(dom).hide();
				}
				$checkbox.iCheck(SUI.settings().iCheck({
					iCheckStyle: config.properties.checkStyle,
					iCheckColor: config.properties.checkColor
				}));
			}

		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			if(value && config.properties.maxSize && value.length > config.properties.maxSize)
				result = false;
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function getDataSource(element){
        	var el = element || bind;
        	var _source = $(dom).attr("dataSource");
        	return SUI.Util.parseJSON(_source || '[]', true);
        }

        function render(data, selectStyle, name){
        	var html = "";
        	if(!data)
        		return html;

			$.each(data, function(i, _v){

				var v = $.isPlainObject(_v) ? _v : {value:_v, name:_v};
				if(selectStyle==="checkbox"){
					var id = SUI.Util.getSequence("select");
					var checked = v.checked ? ' checked="checked"' :'';
					id = "sui-multiselect-"+ name + id;
					html += '<label for="'+id+'"><input id="'+id+'"'+checked+' type="checkbox" name="'+name+'" value="'+v.value+'" />'+v.name+'</label>';
				}else{
					html += '<option value="'+v.value+'">'+v.name+'</option>';
				}
			});
        	return html;
        }

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name"),
        			dataSource: getDataSource(el),
					selectStyle: $(el).attr("selectStyle") || "select", //select | checkbox
					maxSize: Number($(el).attr("maxSize") || "0"),
					checkStyle: $(dom).attr('checkStyle'),
					checkColor: $(dom).attr('checkColor')
        		},
        		value: $(el).attr("value") || "",
        		select2: SUI.Util.parseJSON($(el).attr("select2"), true)
        	};
        	return _data;
        }

        return dom;
	}

	/***
	*** input组件
	***/

	function Input(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;

        var $input, $tpl;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
			config = val;

			this.name = config.properties.name;
			this.title = config.properties.title;
			var settings = SUI.settings().input();
			var parseData = config;
			var require = parseData.validate && parseData.validate.require ? '<span class="text-red">*</span>' : '';
			var title = parseData.properties.title || "";
			var name = parseData.properties.name || "";
			var suffix = parseData.suffix ? '<span class="input-group-addon">'+parseData.suffix+'</span>' : "";
			var prefix = parseData.prefix ? '<span class="input-group-addon">'+parseData.prefix+'</span>' : "";
			var maxlength = "";
			var placeholder = parseData.placeholder;
			var tip = parseData.inputTip;
			var _value = parseData.value;
			if(parseData.cny){
				_value = SUI.Util.encodeCNY(parseData.value, parseData.cny);
			}

			if(parseData.maxlength)
				maxlength = ' maxlength="'+parseData.maxlength+'"';
			var type = parseData.inputType;
			if(type==="text"){
				var template = '<input name="'+name+'"'+maxlength+' type="text" class="form-control" value="'+_value+'" />';
	        }
	        if(type==="textarea"){
	        	var template = '<textarea name="'+name+'"'+maxlength+' rows="'+parseData.rows+'" class="form-control">'+_value+'</textarea>';
	        }
	        if(parseData.suffix || parseData.prefix){
	        	template = '<div class="input-group">'+
	        					prefix +
	        					template +
	        					suffix +
	        				'</div>';
	        }
	        $html = $(template);
	        $(dom).html($html);
	        $input = $("input, textarea", dom);

			var mode = config.mode || 'view';
			var escape = SUI.settings().input().escape ? true : false;
			if(config.escape){
				escape = config.escape == "false" ? false : true;
			}
			if(mode == "readOnly" || mode == "view"){
				$html.hide();
				$tpl = $('<div class="value-text" />');
				$tpl.html(("undefined"==typeof parseData.prefix?"":(parseData.prefix+" ")) + '<span class="value">' +(escape ? escape(_value): _value)+ '</span>' + ("undefined"==typeof parseData.suffix?"":(" "+parseData.suffix)));
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly')
				.append($tpl);
			}
			if(mode == "editable"){
				$input.removeAttr("readOnly");
				$(dom).removeClass('form-readOnly');
				SUI.Util.poptip(tip, dom, $input);
				placeholder&&$input.attr('placeholder', placeholder);
				if(config&&config.cny){
					var tempval = _value;
					$input.on("focusin", function(){
						tempval = this.value;
					}).on('keyup', function(event) {
						if(event.type=="input"){
							var pos = SUI.Util.getInputTextPos(this);
							var seps = this.value.split(',').length;
						}
						this.value = SUI.Util.encodeCNY(this.value, parseData.cny);
						if(event.type=="input"){
							SUI.Util.setInputTextPos(this, pos-seps+this.value.split(',').length);
						}
						_value = this.value;
					}).on("blur", function(){
						if(_value!=tempval)
							$(dom).trigger('change');
					});
				}
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			if($(dom).hasClass('disabled')){
				$input.attr('readonly', 'readonly');
			}
		}

        this.getValue = function(){
        	var val = $input.val();
        	if(config&&config.cny){
        		val = SUI.Util.decodeCNY(val, config.cny);
        	}
        	return val;
        }

        this.setValue = function(val){
        	if(config&&config.cny){
        		val = SUI.Util.encodeCNY(val, config.cny);
        	}
			$input.val(val).trigger('change');
			$tpl&&$(".value", $tpl).html(val);
		}
		this.getExt = function(){
			if(config.properties.sequence){
				return {type: "sequence", value : config.properties.sequence};
			}
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name"),
					sequence: $(el).attr("wf-sequence")
        		},
        		value: $(el).attr("value") || "",
        		suffix: $(el).attr("suffix") || "",
        		prefix: $(el).attr("prefix") || "",
        		maxlength: Number($(el).attr("maxlength") || "0"),
        		inputType:$(el).attr("inputType") || "text",
        		rows: Number($(el).attr("rows") || "3"),
        		inputTip : $(el).attr("inputTip") || "",
        		placeholder : $(el).attr("placeholder") || "",
        		escape : $(el).attr("escape") || ""
        	};
        	if(_data.maxlength&&_data.validate){
        		_data.validate.max = _data.validate.max || _data.maxlength;
        	}
        	if(_data.validate&&_data.validate.format){
        		var format = _data.validate.format.split("|");
        		if(/cny/i.test(format[1])&&format[2]){
        			_data.cny = format[2];
        		}
        	}
        	return _data;
        }

        return dom;
	}

	/***
	*** Date组件
	***/

	function DateSingle(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;
        var $input, $tpl, dateRange;
        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;

			var parseData = val;
			var require = parseData.validate && parseData.validate.require ? '<span class="text-red">*</span>' : '';
			var title = parseData.properties.title || "";
			var name = parseData.properties.name || "";
			var suffix = '<div class="input-group-addon">'+
	                        '<i class="fa fa-calendar"></i>'+
	                      '</div>';
			var template =  '<div class="input-group date date-picker">'+
	            				'<input name="'+name+'" type="text" class="form-control" value="'+parseData.value+'" />'+
	            				suffix +
	            			'</div>';
	        $html = $(template);
	        $(dom).html($html);
	        $input = $("input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$html.hide();
				$tpl = $('<div class="value-text" />');
				$tpl.html('<span class="value">' +parseData.value+ '</span>');
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly')
				.append($tpl);
			}
			if(mode == "editable"){
				$input.removeAttr("readOnly");
				$(dom).removeClass('form-readOnly');
				var _date = SUI.Util.validDateStr(config.value, parseData.format);
				var opt = $.extend(true, {}, {
					startDate: _date.date,
					singleDatePicker:true,
					timePicker: $(dom).hasClass('datetime'),
					timePickerSeconds: /ss/.test(parseData.format),
					timePickerIncrement: parseData.minStep,
					locale: {
						format: parseData.format
					}
				}, parseData.dateRange||{});
				$(".date-picker", dom).daterangepicker(opt);
				dateRange = $(".date-picker", dom).data('daterangepicker');
				if(!config.inputFree){
					$("input", dom).attr("readonly","readonly");
				}
			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.setValue = function(val){
        	value = val;
			$input.val(val).trigger("change");
			if(config.mode === "editable"){
				var startDate = SUI.Util.validDateStr(value, config.format);
		        dateRange.startDate = startDate.date;
		        dateRange.endDate = startDate.date;
		    }
			$tpl&&$(".value", $tpl).html(val);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: $(el).attr("value") || "",
        		suffix: $(el).attr("suffix") || "",
        		format: $(el).attr("format") || "YYYY-MM-DD",
        		minStep: Number($(el).attr("minStep") || "1"),
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true),
        		inputFree: $(el).attr("inputFree")==="true"
        	};
        	return _data;
        }

        return dom;
	}

	/***
	*** Date 范围组件
	***/

	function DateRange(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;
		$(dom).addClass('clearfix');
		var $start, $end, $tpl, startDateRange, endDateRange;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
			config = val;

			this.name = config.properties.name;
			this.title = config.properties.title;

			var parseData = config;
			var require = parseData.validate && parseData.validate.require ? '<span class="text-red">*</span>' : '';
			var title = parseData.properties.title || "";
			var name = parseData.properties.name || "";

			var startDate = SUI.Util.validDateStr(config.value[0], parseData.format),
	        	endDate = SUI.Util.validDateStr(config.value[1], parseData.format);
			var suffix = '<div class="input-group-addon">'+
	                        '<i class="fa fa-calendar"></i>'+
	                      '</div>';
			var hasSuffix =" input-group date date-picker";
			var template = 		'<div class="item-col col-xs-5">'+
	                			'<div class="date-start'+hasSuffix+'">'+
				                      '<input type="text" value="'+startDate.validate+'" class="form-control">'+
				                      suffix+
				                '</div></div>'+
				                '<div class="item-col col-xs-2 text-center">至</div>'+
				                '<div class="item-col col-xs-5">'+
				                '<div class="date-end'+hasSuffix+'">'+
				                     '<input type="text" value="'+endDate.validate+'" class="form-control">'+
				                      suffix+
				                '</div></div>'+
				                '<input class="target-input" type="hidden" name="'+name+'" value="'+parseData.value+'" />';
	        $html = $(template);
	        $(dom).html($html);

	        $start = $(".date-start input", dom);
	        $end = $(".date-end input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$html.hide();
				$tpl = $('<div class="value-text" />');
				$tpl.html('<span class="value">' +startDate.validate+ '</span> 至 <span class="value">'+endDate.validate+'</span>');
				$(dom).addClass('form-readOnly')
				.append($tpl);
				$start.attr("readOnly","readOnly");
				$end.attr("readOnly","readOnly");
			}
			if(mode == "editable"){
				$(dom).removeClass('form-readOnly');
				var opt = $.extend(true, {}, {
		        	singleDatePicker:true,
					timePicker: $(dom).hasClass('datetime'),
					timePickerSeconds: /ss/.test(parseData.format),
					timePickerIncrement: parseData.minStep,
		        	locale: {
		        		format: parseData.format
		        	}
		        }, parseData.dateRange||{});

				$(".date-picker.date-start", dom).daterangepicker($.extend(true, {}, opt, {
					startDate: startDate.date
				}));
		        $(".date-picker.date-end", dom).daterangepicker($.extend(true, {}, opt,{
					startDate: endDate.date
				}));

		        startDateRange = $(".date-picker.date-start", dom).data('daterangepicker');
		        endDateRange = $(".date-picker.date-end", dom).data('daterangepicker');

				var rangeStart = $(".date-picker.date-start", dom).data("daterangepicker"),
					rangeEnd = $(".date-picker.date-end", dom).data("daterangepicker");

				$(".date-picker.date-start", dom).on("apply.daterangepicker", function(e, start){
					if(!config.timeRange){
						rangeEnd.minDate = start.startDate.clone();
						if(start.startDate.valueOf()>rangeEnd.startDate.valueOf())
							rangeEnd.setStartDate(start.startDate.clone())
					}else{
						var _end = _timeRange(rangeEnd.startDate, start.startDate, true);
						_end.change&&rangeEnd.setStartDate(_end.date);
					}
				});

				$(".date-picker.date-end", dom).on("apply.daterangepicker", function(e, end){
					if(!config.timeRange){
						rangeStart.maxDate = end.startDate.clone();
						if(end.startDate.valueOf()<rangeStart.startDate.valueOf())
							rangeStart.setStartDate(end.startDate.clone());
					}else{
						var _start = _timeRange(rangeStart.startDate, end.startDate);
						_start.change&&rangeStart.setStartDate(_start.date);
					}
				});

				if(!config.inputFree){
					$("input", dom).attr("readonly","readonly");
				}

			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(js){
        	var vals = [$start.val(), $end.val()];
        	return js ? vals : SUI.Util.toJsonString(vals);
        }

        this.setValue = function(val){
			value = val || ["",""];
			if(typeof(value) == "string"){
				value = SUI.Util.parseJSON(val, true);
			}

			$start.val(value[0]).trigger("change");
			$end.val(value[1]).trigger("change");
			if(config.mode == "editable"){
				var startDate = SUI.Util.validDateStr(value[0], config.format),
		        	endDate = SUI.Util.validDateStr(value[1], config.format);

		        startDateRange.startDate = startDate.date;
		        endDateRange.startDate = endDate.date;
			}
			$tpl&&$(".value", $tpl).eq(0).html(value[0]);
			$tpl&&$(".value", $tpl).eq(1).html(value[1]);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var result = SUI.Util.validate.call(dom, validate, $start.val()) && SUI.Util.validate.call(dom, validate, $end.val());
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: SUI.Util.parseJSON($(el).attr("value") || "[]", true),
        		suffix: $(el).attr("suffix") || "",
        		format: $(el).attr("format") || "YYYY-MM-DD",
        		minStep: Number($(el).attr("minStep") || "1"),
        		timeRange: $(el).attr("timeRange")==="true"? true : false,
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true),
        		inputFree: $(el).attr("inputFree")==="true"
        	};
        	return _data;
        }

        function _timeRange(date1, date2, end){
        	var	out = {
	        		date : date1.clone(),
	        		change: false
	        	};
        	if(date1.year()!=date2.year()){
        		out.date = date1.clone().year(date2.year());
        	}

        	if(date1.dayOfYear()!=date2.dayOfYear()){
        		out.date = date1.clone().dayOfYear(date2.dayOfYear());
        	}

        	if(end && out.date.valueOf() < date2.valueOf()){
        		out.date = date2.clone();
        	}

        	if(!end && out.date.valueOf() > date2.valueOf()){
        		out.date = date2.clone();
        	}

        	if(out.date.valueOf()!=date1.valueOf())
        		out.change = true;

        	return out;
        }

        return dom;
	}

	/***
	*** Date picker 范围组件
	***/

	function DateRangePicker(bind){
		var dom = bind || $("<div />")[0], config, value, sep = " - ";
		dom.zoo = this;
		var $input, $tpl, datePicker;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;
			var parseData = config;
			var require = parseData.validate && parseData.validate.require ? '<span class="text-red">*</span>' : '';
			var title = parseData.properties.title || "";
			var name = parseData.properties.name || "";
			var vals = config.value.split(sep);
			var startDate = SUI.Util.validDateStr(vals[0], parseData.format),
	        	endDate = SUI.Util.validDateStr(vals[1], parseData.format),
	        	rangeVal = "";
	        if(startDate.validate&&endDate.validate)
	        	rangeVal = startDate.validate + sep + endDate.validate;

			var suffix = '<div class="input-group-addon">'+
	                        '<i class="fa fa-calendar"></i>'+
	                      '</div>';
			var hasSuffix =" input-group date-picker";
			var template = '<div class="'+hasSuffix+'">'+
	            				'<input name="'+name+'" type="text" class="form-control" value="'+rangeVal+'" />'+
	            				suffix +
	            			'</div>';
	        $html = $(template);
	        $(dom).html($html);
	        $input = $("input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$html.hide();
				$tpl = $('<div class="value-text" />');
				$tpl.html('<span class="value">' +rangeVal+'</span>');
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly')
				.append($tpl);
			}
			if(mode == "editable"){
				$input.removeAttr("readOnly");
				$(dom).removeClass('form-readOnly');
				var opt = $.extend(true, {}, {
					startDate: startDate.date,
					endDate: endDate.date,
		        	singleDatePicker:false,
					timePicker: $(dom).hasClass('datetime'),
					timePickerSeconds: /ss/.test(parseData.format),
					timePickerIncrement: parseData.minStep,
		        	locale: {
		        		format: parseData.format
		        	}
		        }, parseData.dateRange||{});
				$(".date-picker", dom).daterangepicker(opt);
				datePicker = $(".date-picker", dom).data('daterangepicker');
				if(!config.inputFree){
					$("input", dom).attr("readonly","readonly");
				}
			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.setValue = function(val){
			value = val || ["",""];
			if(typeof(value) =="string"){
				value = SUI.Util.parseJSON(val, true);
			}
			if(config.mode === "editable"){
				var startDate = SUI.Util.validDateStr(value[0], config.format),
		        	endDate = SUI.Util.validDateStr(value[1], config.format);

		        datePicker.startDate = startDate.date;
		        datePicker.startDate = endDate.date;
			}
			$input.val(value.join(sep)).trigger('change');
			$tpl&&$(".value", $tpl).html(value.join(sep));
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: $(el).attr("value") || "",
        		suffix: $(el).attr("suffix") || "",
        		format: $(el).attr("format") || "YYYY-MM-DD",
        		minStep: Number($(el).attr("minStep") || "1"),
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true),
        		inputFree: $(el).attr("inputFree")==="true"
        	};
        	return _data;
        }

        return dom;
	}

	/***
	*** number 数字
	***/

	function number(bind){
		var dom = bind || $("<div />")[0], config, value, sep = " - ";
		dom.zoo = this;
		var $input, $tpl;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
        	var that = this;
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;
			var parseData = config;
			var require = parseData.validate && parseData.validate.require ? '<span class="text-red">*</span>' : '';
			var title = parseData.properties.title || "";
			var name = parseData.properties.name || "";
			value = parseData.value;

			var template = '<div class="input-group text-center">'+
			                    '<span class="input-group-addon sui-number-minus"><i class="fa fa-minus-circle"></i></span>'+
								'<input name="'+name+'" type="text" class="form-control text-center" value="'+value+'" />'+
								'<span class="input-group-addon sui-number-plus"><i class="fa fa-plus-circle"></i></span>'+
							'</div>';

	        $html = $(template);
	        $(dom).html($html);
	        $input = $("input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$html.hide();
				$tpl = $('<div class="value-text" />');
				$tpl.html('<span class="value">' +value+'</span>');
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly')
				.append($tpl);
			}
			if(mode == "editable"){
				$input.removeAttr("readOnly");
				$(dom).removeClass('form-readOnly');
				$(".sui-number-minus", dom).on('click', function(){
		        	that.minus();
		        });
		        $(".sui-number-plus", dom).on('click', function(){
		        	that.plus();
		        });
		        SUI.Util.poptip(parseData.inputTip, dom, $input);
			}
			if(mode=="hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.fixValue = function(val){
        	var _value = val || 0;
			var fix = String(config.increment).split(".");
			if(fix[1]){
				_value = Number(_value.toFixed(fix[1].length));
			}
			if(config.validate){
				if(typeof config.validate.maxNum ==="number" && _value > config.validate.maxNum)
					return value;
				if(typeof config.validate.minNum ==="number" && _value < config.validate.minNum)
					return value;
			}
			return _value;
        }

        this.setValue = function(val){
			var _val = this.fixValue(val);

			if(_val==value)
				return;
			value = _val;
			$input.val(value).trigger('change');
			$tpl&&$(".value", $tpl).html(value);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

		this.minus = function(){
			var val = value - config.increment;
			this.setValue(val);
		}

		this.plus = function(){
			var val = value + config.increment;
			this.setValue(val);
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: Number($(el).attr("value") || "0"),
        		format: $(el).attr("format") || "int",
        		increment: Number($(el).attr("increment") || "1"),
        		inputTip: $(el).attr("inputTip") || ""
        	};
        	_data.validate = _data.validate || {};
        	if(!_data.validate.format)
        		_data.validate.format = _data.format;

        	return _data;
        }

        return dom;
	}

	/**
	** Datatable
	**/

	function Datatable(bind){
		var dom = bind || $("<div />")[0], config, value, columns, mobile;
		dom.zoo = this;
		var $table, $tableHead, $tableBody, $addBtn, readyCalls = [];;
		this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
        	var that = this;
			config = val;
			readyCalls = [];
        	if((!$.isPlainObject(config.dataTable) || !config.dataTable.columns) && !config.ajaxsource){
        		return;
        	}
			this.name = config.properties.name;
			this.title = config.properties.title;
			var _value = config.value || [];
			var mode = config.mode || "view";
			function getColumns(callback){
				var instance = this;
				if(config.ajaxsource){
					$.ajax({
						url: config.ajaxsource,
						type: 'get',
						dataType: 'json',
						success:function(data){
							config.dataTable = data;
							callback.call(instance);
						}
					});

				}else{
					callback.call(instance);
				}
			}

			function buildTable(){
				mobile = config.dataTable.mobile && $(window).width() < 480 && mode !== "editable";
				columns = config.dataTable.columns;
				if(mobile){
					$table = $('<div class="datatable-wrapper" />');
					$tableBody = $('<div class="datatable-body" />');
					if(mode == "editable" && !config.noactions){
						config.actions = true;
					}
					$table.append($tableBody);
					$(dom).html($table).addClass('sui-component-mobile');
					$(dom).parentsUntil('.form-tr').last().removeClass('col-xs-12 col-xs-6');
				} else {
					var tableAttrs = $.extend(true, {
		                 'class': "table table-bordered"
					}, config.dataTable.attrs);
					var $tableWrap = $('<div class="datatable-wrapper" />').css({
						'overflow': 'auto'
					});
					$table = $("<table />", tableAttrs);
					$tableHead = $("<thead />");
					$tableBody = $("<tbody />");

					var $headTr = $('<tr />');
					$.each(columns, function(index, column) {
						$headTr.append($('<th />', column.attrs).html(column.title));
					});
					if(mode == "editable" && !config.noactions){
						$headTr.append($('<th />', {width:60}).html('操作'));
					}
					$tableHead.html($headTr);
					$table.append($tableHead).append($tableBody);
					$(dom).html($tableWrap.html($table));

				}
				if(mode==="hide"){
					$(dom).hide();
				}
				config.onTableReady = true;
				this.setValue(_value);
				for (var i = 0; i < readyCalls.length; i++) {
					typeof readyCalls[i] === "function" && readyCalls[i].call(this, config);
				}
			}

			getColumns.call(this, buildTable);

        }

        this.getValue = function(js){
        	var _value = [];
        	$(".table-row", $tableBody).each(function(index, el) {
        		var item = {};
        		$("[isui=true]", el).each(function(index, _el) {
        			item[$(_el).attr('name').replace(/trid-\d+/,"")] = _el.zoo.getValue(js);
        		});
        		_value.push(item);
        	});
        	return js ? _value : SUI.Util.toJsonString(_value);
        }

        this.setValue = function(val){
        	var _value = val || [];
        	value = _value.concat([]);
        	if(isMaxRows()){
        		value.splice(config.maxrows, value.length - config.maxrows);
        	}
        	if(config.onTableReady){
	        	render(value, true);
        	}else{
        		readyCalls.push(function(){
        			render(_value, true);
        		});
        	}
        }

        this.addRow = function(data){
        	if(config.unaddable)
        		return layer.msg('不可增加数据',{icon:0});

        	if(typeof data !== "object")
        		return layer.msg('表格数据为对象或对象数组',{icon:0});
        	if(!$.isArray(data)){
        		data = [data];
        	}
        	for (var i = 0; i < data.length; i++) {
        		if(!addTr(data[i]))
        			break;
        	}

        }

        this.delRow = function(index){
        	if(config.undeletable)
        		return layer.msg('不可删除数据',{icon:0});

        	if(typeof index ==="undefined")
        		index = value.length-1;

        	if($("tr#"+index, dom).length){
        		var index = $("tr#"+index, dom).index();
        	}
        	delTr(index);
        }

        this.validate = function(validate){
        	var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			if(!_validate(validate)){
				return false;
			}

			var validate = config.validate;
			var _value = this.getValue(true);
			var result = SUI.Util.validate.call(dom, validate, _value);
			if(!value.length){
				$(dom).addClass(SUI.Util.validateClass(result));
			}
			return result;
        }

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: SUI.Util.parseJSON($(el).attr("value"), true),
        		dataTable: SUI.dataTable($(el).attr("dataTable")).value,
        		maxrows: Number($(el).attr("maxrows")||"0"),
        		addButton: $(el).attr('addButton') || "",
        		onRenderRow: SUI.dataTable($(el).attr("onRenderRow")).value,
        		unaddable: $(el).attr("unaddable") == "true",
        		undeletable: $(el).attr("undeletable") == "true",
        		noactions: $(el).attr("noactions") == "true",
        		ajaxsource: $(el).attr('ajaxsource') || ''
        	};
        	return _data;
        }

        function _validate(validate){
        	var result = true;
        	$("[isui=true]", $tableBody).each(function(index, el) {
        		if(nopass(el, validate)){
        			result = false;
        		}
        	});
        	return result;
        }

        function isMaxRows(){
        	return config.maxrows && value.length && value.length >= config.maxrows;
        }

        function render(data, resetValue){
        	if(resetValue && $tableBody){
        		$tableBody.empty();
        	}
        	addBtn(data);
        	$.each(data, function(index, item) {
        		var $tr = buildTr(item);
        		$tableBody.append($tr);
        		SUI.init($.noop, $tr);
        		if(typeof config.onRenderRow === "function"){
        			config.onRenderRow.call(dom, $tr[0], item);
        		}
        	});
        }

        function addBtn(data){
        	if(value.length || (data&&data.length) || config.unaddable || config.mode !== "editable" || !config.addButton){
        		$addBtn&&$addBtn.remove();
        	}else{
        		$addBtn = $('<tr />');
        		$td = $('<td align="center" colspan="'+(columns.length+1)+'"/>');
        		$add = $('<a class="btn btn-default">'+config.addButton+'</a>');
        		$addBtn.append($td.append($add));
	        	$tableBody.html($addBtn);
	        	$add.on('click', function(event) {
	        		event.preventDefault();
	        		addTr();
	        	});
	        }
        }

        function delTr(index){
        	var item = value[index];
        	if(value.splice(index,1).length){
        		if(typeof config.onDeleteRow === "function"){
        			config.onDeleteRow.call(dom, $tableBody.children().eq(index)[0], item);
        		}
        		$tableBody.children().eq(index).fadeOut('300', function() {
        			$(this).remove();
        			$(dom).trigger('change');
        			addBtn();
        		});
        	}
        }

        function nopass(el, validate){
        	var conf = el.zoo.getConfig();
        	var value = el.zoo.getValue();
        	if ((!value || !value.length) && !validate) {
        		return false;
        	}
        	var mode = (!conf || !conf.mode)?'view':'editable';
        	return mode==="editable"&&!el.zoo.validate();
        }

        function addTr(_data){
        	if(isMaxRows()){
        		layer.msg('最多添加'+config.maxrows+'条数据',{icon:0});
        		return false;
        	}
        	var data = _data || getRowData();
        	render([data]);
        	value.push(data);
        	$(dom).removeClass(SUI.Util.validateClass()).trigger('change');
        	return true;
        }

        function getRowData(){
        	var data = {};
        	$.each(columns, function(index, column) {
        		var component = $.extend(true, {}, column.component);
        		if("value" in component){
        			data[component.name] = component.value;
        		}
        	});
        	return data;
        }

        function buildTr(_data){
        	var data = _data || {};
        	var id = 'trid-' + Number(new Date());
        	var $tr = $('<'+(mobile ? "div" : "tr")+' class="table-row" id="'+id+'" />');
        	var mode = config.mode || "view";
        	var tdGroups = [];
        	$.each(columns, function(index, column) {
        		if(mobile && column.attrs){
        			column.attrs.width = undefined;
        		}
        		var $td = $('<'+(mobile ? "div" : "td")+' />', column.attrs);
        		var component = $.extend(true, {}, column.component, {
        			isui: true,
        			mode: mode == "editable" ? column.component.mode : mode
        		});
    			component.name += id;
    			if(typeof data[column.component.name]!=="undefined"){
    				component.value = data[column.component.name];
    			}
        		$component = $('<div />', SUI.Util.propString(component));
        		if(mobile){
        			if(column.role && column.role=="title"){
        				$td.addClass('table-col-title');
        			}else{
        				$td.append('<span class="table-col-label">'+column.title+'：</span>');
        			}
        			$td.addClass('table-col clearfix').append($component);
        			if(column.role && column.role==="group"){
        				tdGroups.push($td);
        			}else{
        				$tr.append($td);
        			}
    			}else{
    				$td.addClass('table-col').html($component);
    				$tr.append($td);
    			}
        	});
	        if(tdGroups && tdGroups.length){
	        	var $trGroup = $('<div class="datatable-col-flex clearfix" />');
	        	$.each(tdGroups, function(index, $td) {
	        		$trGroup.append($td);
	        	});
	        	if($tr.find('.table-col-title').length){
	        		$tr.find('.table-col-title').after($trGroup);
	        	}else{
	        		$tr.prepend($trGroup);
	        	}

	        }
        	if(mode=="editable" && !config.noactions){
	        	var $action = $('<'+(mobile ? "div" : "td")+' class="table-col-actions" />');
	        	var $delBtn = $('<a class="table-tr-btn table-deltr-btn"><i class="fa fa-minus-circle"></i></a>');
	        	var $addBtn = $('<a class="table-tr-btn table-addtr-btn"><i class="fa fa-plus-circle"></i></a>');
	        	!config.undeletable&&$action.append($delBtn);
	        	!config.unaddable&&$action.append($addBtn);
	        	$tr.append($action);

	        	$delBtn.on('click', function(event) {
	        		var index = $(this).parent().parent().index();
	        		delTr(index);
	        	});

	        	$addBtn.on('click', function(event) {
	        		addTr();
	        	});
	        }
        	return $tr;
        }
        return dom;
	}

	/**
	 * TableList
	 */

	function TableList(bind){
		var dom = bind || $("<div />")[0], config, value, paramFn, optionsFn, $table, $tableList;
		dom.zoo = this;
		this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.extraParam = function(callback){
        	paramFn = callback;
        }

        this.getExtraParam = function(params){
        	if(typeof paramFn === "function"){
        		params = paramFn(params);
        	}
        	return params;
        }

        this.extraOptions = function(callback){
        	optionsFn = callback;
        }

        this.getExtraOptions = function(options){
        	if(typeof optionsFn === "function"){
        		options = optionsFn(options);
        	}
        	return options;
        }

        this.setConfig = function(val){
        	var that = this;
        	if(!val || !val.source || !val.columns || !val.columns.length)
        		return val;

        	config = $.extend(true, {

        		"columns": [],
        		'sort': '',
        		"numberCol" : false,
        		"selectCol": true,
        		"autoLength": false,
        		"idProp": "id",
        		"tableClass": 'table-hover table-striped',
        		"search": true,
        		"keyword_param":"keyword",
        		"keyfield_param":"searchfield",
        		"method": "GET",

        		"processing": true,
	          	"lengthChange": true,
	          	"lengthMenu": [5,10,15,25,40,60,100],
        		"searching": true,
	          	"ordering":true,
	          	"autoWidth": true,
	          	"pageInfo": true,
	          	"pageNumbers": 3,
	          	"scrollX": true, // 设置允许出现横向滚动条
	          	"dataProp": "rows", // 接口返回的数据索引 如responseData.rows
	          	"length": 10, // 每页显示多少条，默认10
	          	"empty":'暂无数据',
	          	"actionButtonsNumber":2,
	          	"moreButtonsText":"...",
	          	"footButtons":[],
	          	"autoHeight":false
        	}, val, {
        		"tableId": 'tablelist'+Number(new Date())
        	});

        	var _table = {
        		"dom":  "<'row tablelist-head'<'col-sm-6 tablelist-head-left'><'col-sm-6 tablelist-head-right'>>" +
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-sm-5'li><'col-sm-7'p>>"+
					"<'row tablelist-foot'<'col-sm-12 tablelist-foot-left'>>",
          		"bServerSide": true,
          		"bProcessing": config.processing === false ? false : true,
	          	"lengthChange": config.lengthChange === false ? false : true,
	          	"lengthMenu": config.lengthMenu || [5,10,15,25,40,60,100],
        		"searching": config.searching === false ? false : true,
	          	"ordering": config.ordering === false ? false : true,
	          	"autoWidth": config.autoWidth === false ? false : true,
	          	"info": config.pageInfo === false ? false : true,
	          	"numbers_length": config.pageNumbers  || 3,
	          	"sScrollX": config.scrollX === false ? false : true, // 设置允许出现横向滚动条
        		"sAjaxSource": config.source,
	          	"sAjaxDataProp": config.dataProp || "rows", // 接口返回的数据索引 如responseData.rows
	          	"iDisplayLength": config.length || 10, // 每页显示多少条，默认10
        		"aoColumns":[],
        		"aaSorting":[],
        		"pagingType": config.pagingType || "simple_numbers",
	          	"fnRowCallback":function(nRow, aData, iDisplayIndex, iDisplayIndexFull){ // 每行渲染后的回调,一般用于绑定事件
			    	var table = this;
			    	$(".tablelist-actions", nRow).tableButtons({
			    		buttons: config.actionButtons,
			    		actionId: aData[config.idProp],
			    		callback:function(group){
			    			$("[data-delete]", group).on('click', function(event) {
					    		event.preventDefault();
					    		var id = $(this).data('delete');
					    		_doAction('delete', [id]);
					    	});

					    	$("[data-modify]", group).on('click', function(event) {
					    		event.preventDefault();
					    		var id = $(this).data('delete');
					    		_doAction('modify', [id]);
					    	});
			    		}
			    	});
			    },
			    "fnDrawCallback":function(oSettings){ // 表格渲染完成回调
			    	var table = this;
			    	// 多选
			    	var twrap = oSettings.nTableWrapper;
			    	$(".sui-tablelist-checkbox", twrap).iCheck(SUI.settings().iCheck());
			    	$(".sui-tablelist-select-all", twrap).iCheck('uncheck');
			    	$(".sui-tablelist-select-all", twrap).on('ifClicked', function(event) {
			    		_checkAll(twrap, !this.checked);
			    	});

			    	$(".sui-tablelist-select-one", twrap).on('ifClicked', function(event) {
			    		_checkedAll(twrap, !this.checked);
			    	});

			    	if(config.autoHeight){
			    		$(oSettings.nScrollBody).height(getBodyHeight(oSettings));
			    	}

			    	if(config.pageJump){
			    		buildPageJump(oSettings);
			    	}
			    },
			    "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { // 数据过滤处理，以符合datatables要求
			    	var table = this;
			    	var _aoData = {}; // 过滤 dataTables 原始参数
			    	$.each(aoData, function(index, val) {
			    		_aoData[val.name] = val.value;
			    	});
			    	var sortFiled = _aoData['mDataProp_'+_aoData.iSortCol_0];

			    	// 接口入参
			    	var params = {
			    		rows: _aoData.iDisplayLength,  // 接口每页多少条的参数
			    		page: Math.ceil(_aoData.iDisplayStart/_aoData.iDisplayLength) + 1
			    	};
			    	if(config.sort){
			    		params.sort = sortFiled;
			    		params.order = _aoData.sSortDir_0;
			    	}
			    	if(_aoData.sSearch){
			    		params.keyword = _aoData.sSearch;
			    	}
			    	$(dom).find('.sui-tablelist-filter').each(function(index, el) {
			    		if(el.value){
			    			params[el.name] = el.value;
			    		}
			    	});
			    	$(dom).find('.sui-component[sui="true"]').each(function(index, el) {
			    		if(el.zoo && el.zoo.name){
			    			params[el.zoo.name] = el.zoo.getValue();
			    		}
			    	});
			    	var extraParam = that.getExtraParam(params);
			    	$.extend(params, extraParam || {});
			    	var options = {
				        "dataType": 'json',
				        "type":config.method,
				        "url": sSource,
				        "data": params
				    };

				    if(config.paramsJSON){
				    	options.contentType = "text/json";
				    	options.data = JSON.stringify(params);
				    }
				    $.extend(options, that.getExtraOptions(options) || {});

				    options.success = function(data){  // 过滤接口返回的数据，处理成符合datatable格式
			        	$.extend(true, data, {
			        		iTotalRecords: data.total, // 总数
			        		iTotalDisplayRecords: data.total  // 过滤后总数
			        	});
			        	if(!data[oSettings.sAjaxDataProp]||!data[oSettings.sAjaxDataProp].length){
			        		if(oSettings._iDisplayStart>=oSettings._iDisplayLength){
			        			oSettings._iDisplayStart -= oSettings._iDisplayLength;
			        			return table.api().ajax.reload(function(){}, false);
			        		}
			        	}
			        	value = data[oSettings.sAjaxDataProp];
			        	fnCallback(data);
			        };
			        if(typeof config.ajaxSettings==="function"){
			        	options = config.ajaxSettings.call(this, options);
			        }
			        oSettings.jqXHR = $.ajax(options);
			    },
			    oLanguage: {
			    	sEmptyTable: config.empty
			    }
        	};

        	if(config.selectCol){
        		_table.aoColumns.push({
        			"mRender":function( value, type, row, full ){
          				return '<input id="'+config.tableId+'-checkbox'+row[config.idProp]+'" name="'+config.tableId+'-checkbox[]" class="sui-tablelist-checkbox sui-tablelist-select-one" type="checkbox" value="'+row[config.idProp]+'" />';
          			},
          			"title":'<input type="checkbox" class="sui-tablelist-checkbox sui-tablelist-select-all" value="-1">',
          			"bSortable": false,
          			"width": 22
        		});
        	}

        	if(config.numberCol){
        		_table.aoColumns.push({
        			"mRender":function( value, type, row, full ){
          				return full.settings._iDisplayStart + full.row + 1;
          			},
          			"title":typeof config.numberCol === "string" ?config.numberCol : "#",
          			"bSortable": false,
          			"width": 24
        		});
        	}
        	var columnIndex = _table.aoColumns.length;
        	var sort = config.sort.split('.');
        	var orderby = sort[1] &&  /desc|asc/.test(sort[1]) ? sort[1].toLowerCase() : 'desc';
        	var renderFn = typeof config.render === "function" ? config.render : SUI.settings()['tableList'] && typeof config.render === "string" ? SUI.settings().tableList()[config.render] : false;

        	for (var i = 0; i < config.columns.length; i++) {
        		var column = config.columns[i];
        		if(sort[0] && column.name==sort[0]){
        			_table.aaSorting = [[columnIndex+i, orderby]];
        			column.sortable = true;
        		}
        		var _column = {
        			bSortable: column.sortable ? true : false,
        			sClass: column.textCenter ? 'text-center ' : '',
        			mData: column.name,
        			name: column.name,
        			title: column.title,
        			mRender:(function(name){
        				return function(value, type, row, full){
	        				if(typeof renderFn==="function"){
	        					return renderFn.call(dom, name, value, type, row, full);
	        				}
	        				return value;
	        			}
        			})(column.name)
        		};
        		if(column.className){
        			_column.sClass += ' ' + column.className;
        		}
        		if(column.width){
        			_column.width = column.width;
        		}
        		_table.aoColumns.push(_column);
        	}
        	if(config.actionButtons!==false){
	        	_table.aoColumns.push({
	        		bSortable:false,
	        		sClass:'text-center tablelist-actions',
	        		title:"操作",
	        		mRender:function(value, type, row, full){
	        			var html = '<a href="javascript:;" data-modify="'+row[config.idProp]+'" class="btn btn-default btn-xs">编辑</a>\
	        						<a href="javascript:;" data-delete="'+row[config.idProp]+'" class="btn btn-danger btn-xs">删除</a>\
	        						';
	        			if(config.actionButtons.length){
	        				html = '';
	        			}
	        			return html;

	        		}
	        	});
	        }

        	$table = $(dom).find('table');
        	if(!$table.length){
        		$table = $('<table id="'+config.tableId+'-table" class="table '+config.tableClass+'" />');
        	}
        	$(dom).append($table);
        	if(config.autoLength){
        		var wh = $(window).height();
        		var index = 0;
        		if(wh > 400){
        			index = 1;
        		}
        		if(wh > 800){
        			index = 2;
        		}
        		_table.iDisplayLength = _table.lengthMenu[index];
        	}
        	$tableList = $table.dataTable(_table);
        	if(config.title){
        		var $title = $('<div class="sui-tablelist-title" />').html(config.title);
        		$('.tablelist-head-left', dom).prepend($title);
        	}

        	if(config.search){
        		var $search = $('<div class="input-group sui-tablelist-search">\
			                    <input type="text" name="'+config.keyword_param+'" class="sui-tablelist-search-keyword sui-tablelist-filter form-control">\
			                    <span class="input-group-btn">\
			                      <button class="btn btn-primary" type="button" data-filter="search">搜索</button>\
			                    </span>\
			                  </div>');
        		$('.tablelist-head-right', dom).prepend($search);
        		if(typeof config.search === "string"){
        			config.search = config.search.split(',');
        		}
        		if( $.isArray(config.search) ){
	        		var searchfilters = [{
	        			name:'',
	        			text:'全文'
	        		}];
	        		for (var i = 0; i < config.columns.length; i++) {
	        			var _col = config.columns[i];
	        			if( $.inArray(_col.name, config.search)!==-1 ){
	        				searchfilters.push({
	        					name: _col.name,
	        					text: _col.title
	        				});
	        			}
	        		}
	        		var $searchfilters = $('<div class="input-group-btn">\
	        			<input type="hidden" name="'+config.keyfield_param+'" class="sui-tablelist-filter sui-tablelist-search-field" value="">\
			                      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="sui-tablelist-search-text">全文</span> <span class="fa fa-caret-down"></span></button>\
			                      <ul class="dropdown-menu">\
			                      </ul>\
			                    </div>');
	        		for (var i = 0; i < searchfilters.length; i++) {

	        			$('.dropdown-menu', $searchfilters).append('<li><a data-search="'+searchfilters[i].name+'" href="javascript:;">'+searchfilters[i].text+'</a></li>');
	        		}

	        		$search.prepend($searchfilters);

	        		$search.find('[data-search]').on('click', function(event) {
	        			event.preventDefault();
	        			var text = $(this).text(),
	        				name = $(this).data('search');
	        			$('.sui-tablelist-search-field', $search).val(name);
	        			$('.sui-tablelist-search-text', $search).html(text);
	        		});
		        }

        	}

        	if(config.addUrl){
        		var $addBtn = $('<a href="javascript:;" data-action="add" class="sui-tablelist-add-btn btn btn-primary btn-sm">新增</a><span>&nbsp;&nbsp;</span>');
        		$('.tablelist-foot-left', dom).append($addBtn);
        	}
        	if(config.deleteUrl && config.selectCol){
        		var $deleteBtn = $('<a href="javascript:;" data-action="delete" class="sui-tablelist-delete-btn btn btn-default btn-sm">删除</a><span>&nbsp;&nbsp;</span>');
        		$('.tablelist-foot-left', dom).append($deleteBtn);
        	}
        	if(config.footButtons && config.footButtons.length){
        		for (var i = 0; i < config.footButtons.length; i++) {
        			var btn = config.footButtons[i];
        			var $btn = $('<a href="'+(btn.href ? btn.href : 'javascript:;')+'" />').addClass('btn btn-sm '+ (btn.className ? btn.className : 'btn-default')).html(btn.content);
        			$('.tablelist-foot-left', dom).append($btn).append('<span>&nbsp;&nbsp;</span>');
        			if(typeof btn.onClick === "function"){
        				(function(btn){
        					$btn.on('click', function(event){
	        					btn.onClick.call(this, event, _getSelected(), $tableList);
	        				});
        				})(btn);
        			}
        			typeof btn.onRender == "function" && btn.onRender.call($btn[0], btn, $tableList);
        		}
        	}
        	typeof config.onReady == "function" && config.onReady.call(dom, $tableList);
        	$('[data-action]', dom).on('click', function(event) {
        		event.preventDefault();
        		var action = $(this).data('action');
        		var ids = _getSelected().checked;
        		_doAction(action, ids);
        	});

        	$("[data-filter]").on('click', function(event) {
        		event.preventDefault();
        		var filter = $(this).data('filter');
        		if(filter==="search"){
        			_search();
        		}
        	});
        }

        this.getValue = function(){
        	return value;
        }

        this.setValue = function(){
        	return value;
        }

        this.getSelected = function(){
        	return _getSelected().checked;
        }

        this.getSelectedData = function(){
        	var ids = _getSelected().ids;
        	var data = [];
        	for (var i = 0; i < ids.length; i++) {
        		data.push( value[ids[i]] );
        	}
        	return data;
        }

        this.tableApi = function(){
        	return $tableList.api();
        }

        function buildPageJump(oSettings) {
        	$jump = $('<div class="input-group" style="vertical-align:top; margin:2px 0; margin-left:5px;">\
				          <input type="text" class="form-control" style="width:45px;text-align:center;">\
				          <span class="input-group-btn">\
				            <button class="btn btn-default" type="button">跳转</button>\
				          </span>\
				        </div>');
        	$('button', $jump).on("click", function(event){
        		event.preventDefault();
        		var page = parseInt($($jump).find('input').val());
        		if(isNaN(page) || page < 1 || page > oSettings._iRecordsTotal){
        			return alert('无效页码');
        		}
        		$tableList.fnPageChange(--page);
        	});
        	$(".dataTables_paginate", oSettings.nTableWrapper).append($jump);
        }

        function getBodyHeight(oSettings){
        	var delta = $(oSettings.nScrollHead).offset().top - $(window).scrollTop();
        	var bottom = 15;
        	$(oSettings.nScrollBody).parents('.row').eq(0).siblings('.row').each(function(index, el) {
        		bottom += $(el).height();
        	});
        	var height = $(window).height() - delta - $(oSettings.nScrollFoot).height() - $(oSettings.nScrollHead).height() - bottom;

        	var _height = $(oSettings.nScrollBody).height();
        	if(height > _height){
        		height = _height;
        	}
        	if(height < 40){
        		height = "auto";
        	}
        	$(oSettings.nScrollBody).height(height);
        }

        function _paramUrl(url, id){
        	return url.replace('{idProp}', config.idProp)
        			  .replace('{id}', id);
        }

        function _doAction(action, ids){
        	if(action==="add"){
        		layer.open({
        			type:2,
        			title:"新建",
        			area: ["500px","340px"],
        			content: config.addUrl,
        			btn:['发送'],
        			maxmin:true,
        			yes: function(index, layero){
        				var iframeWin = window[layero.find('iframe')[0]['name']];
        				iframeWin.save(function(msg){
        					return layer.msg(msg || '正在发送...', {time:0});
        				}, function(success, loading, data){
        					layer.close(loading);
        					if(!success){
        						return alert('新建失败');
        					}
        					layer.msg('新建成功,刷新页面', {icon:1});
        					layer.close(index);
	        				$tableList.api().ajax.reload(function(){
	        					setTimeout(function(){
	        						layer.msg('刷新成功');
	        					},1000);
	        				}, true);
        				});
        			}
        		});
        	}
        	if(action==="modify"){
        		if(!ids.length){
        			return alert('请选择修改项');
        		}
        		layer.open({
        			type:2,
        			title:"修改",
        			area: ["500px","340px"],
        			content: _paramUrl(config.modifyUrl, ids[0]),
        			btn:['保存'],
        			maxmin:true,
        			yes: function(index, layero){
        				var iframeWin = window[layero.find('iframe')[0]['name']];
        				iframeWin.save(function(msg){
        					return layer.msg(msg || '正在发送...', {time:0});
        				}, function(success, loading, data){
        					layer.close(loading);
        					if(!success){
        						return alert('修改失败');
        					}
        					layer.msg('修改成功,刷新页面', {icon:1});
        					layer.close(index);
	        				$tableList.api().ajax.reload(function(){
	        					setTimeout(function(){
	        						layer.msg('刷新成功');
	        					},1000);
	        				}, true);
        				});
        			}
        		});
        	}
        	if(action==="delete"){
        		if(!ids.length){
        			return alert('请选择要删除的项');
        		}
        		layer.confirm('确定删除'+ids.length+'项', function(index){
        			layer.close(index);
        			var loading = layer.msg('正在删除', {time:0});
        			$.ajax({
        				url: _paramUrl(config.deleteUrl, ids.join(',')),
        				type: 'GET',
        				success:function(){
        					$tableList.api().ajax.reload(function(){
	        					layer.msg('删除成功');
	        				}, false);
        				},
        				complete:function(){
        					layer.close(loading);
        				}
        			});

        		});
        	}

        }

        function _checkAll(context, checked){
        	$('.sui-tablelist-checkbox', context).iCheck(checked ? 'check':'uncheck');
        }

        function _checkedAll(context, _checked){
        	var $checkbox = $('.sui-tablelist-select-one', context);
        	var total = $checkbox.length;
        	var checked = 0;
        	_checked && $checkbox.each(function(index, el) {
        	    if(el.checked){
        	    	checked++;
        	    }
        	});
        	$('.sui-tablelist-select-all', context).iCheck(total && total - 1 === checked ? 'check':'uncheck');
        }

        function _getSelected(){
        	var out = {
        		ids : [],
        		checked: [],
        		data: []
        	};
        	$('.sui-tablelist-select-one', $table).each(function(index, el) {
        		if(el.checked){
        			var idx = SUI.Util.inArrayObj(config.idProp, el.value, value);
        			var _data = idx==-1 ? null : value[idx];
        			out.ids.push(el.value);
        			out.checked.push(el);
        			out.data.push(_data);
        		}
        	});
        	return out;
        }

        function _search(){
        	$tableList.api().ajax.reload(function(){

        	}, true);
        }

        function _parseData(element){
        	var el = element || bind;

        	var data = {
        		"title":$(el).attr('title'),
        		"columns": SUI.Util.parseJSON($(el).attr('columns') || '[]', true),
        		"deleteUrl": $(el).attr('deleteUrl'),
        		"modifyUrl": $(el).attr('modifyUrl'),
        		"addUrl": $(el).attr("addUrl"),
        		"render": $(el).attr('render'),
        		'sort': $(el).attr('sort') || '',
        		"numberCol" : $(el).attr('numberCol') != undefined,
        		"selectCol": $(el).attr('selectCol') != undefined,
        		"tableId": el.id ? el.id: ('tablelist'+Number(new Date())),
        		"autoLength": $(el).attr('autoLength') === "true",
        		"idProp": $(el).attr("idProp") || "id",
        		"tableClass": $(el).attr('tableClass') || 'table-hover table-striped',
        		"search": $(el).attr('search') === "false" ? false : true,
        		"paramsJSON": $(el).attr('paramsJSON') == "true",
        		"method": $(el).attr('method') || 'GET',
        		"autoHeight": $(el).attr('autoHeight') == "true",

        		"processing": $(el).attr('processing') === "false" ? false : true,
	          	"lengthChange": $(el).attr('lengthChange') === "false" ? false : true,
	          	"lengthMenu": SUI.Util.parseJSON($(el).attr('lengthMenu') || '[5,10,15,25,40,60,100]', true),
        		"searching": $(el).attr('searching') === "false" ? false : true,
	          	"ordering": $(el).attr('ordering') === "false" ? false : true,
	          	"autoWidth": $(el).attr('autoWidth') === "false" ? false : true,
	          	"pageInfo": $(el).attr('pageInfo') === "false" ? false : true,
	          	"pageNumbers": Number( $(el).attr('pageNumbers') || '3'),
	          	"pagingType": $(el).attr('pagingType') || 'simple_numbers',
	          	"pageJump": $(el).attr('pageJump') == "true",
	          	"scrollX": $(el).attr('scrollX') === "false" ? false : true, // 设置允许出现横向滚动条
        		"source": $(el).attr('source'),
	          	"dataProp": $(el).attr('dataProp') || "rows", // 接口返回的数据索引 如responseData.rows
	          	"length": Number( $(el).attr('length') || '10'), // 每页显示多少条，默认10
	          	"empty": $(el).attr('empty'),
	          	"actionButtons": $(el).attr('actionButtons') == "false" ? false: SUI.Util.parseJSON($(el).attr('actionButtons'))
        	};


        	return data;
        }

        return dom;
	}

	/**
	** Rating
	**/

	function Rating(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;
		var $input, $starsBar;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	return config;
        }

        this.setConfig = function(val){
			config = val;
			this.name = config.properties.name;
			this.title = config.properties.title;
			var require = config.validate && config.validate.require ? '<span class="text-red">*</span>' : '';
			var width = config.value*100 / config.fullScore + "%";
			$starsBar = $('<div class="stars-bar stars-'+config.starStyle+'" />');
			var $stars = $('<div class="stars" />').css({
				width: width
			});
			var _value = config.ratingValue ? config.value : _star( config.value);
			$starsBar.html($stars);
	        $(dom).html($starsBar);
	        if(config.ratingText){
	        	$(dom).append('<span class="stars-text" >'+_value+'</span><span class="rating-text">('+config.ratingText+')</span>');
	        }
	        $input = $('<input type="hidden" name="'+this.name+'" value="'+config.value+'" />');
	        $(dom).prepend($input);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly');
			}
			if(mode == "editable"){
				$input.removeAttr("readOnly");
				$(dom).removeClass('form-readOnly');
				_rating.call(this, $starsBar[0]);
			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.setValue = function(val){
			value = val || 0;
			$input.val(value).trigger('change');
			render(value);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

		function render(value){
			$(".stars-bar", dom).children().width(value*100/config.fullScore+"%");
			var val = config.ratingValue ? value : _star(value);
			$(".stars-text", dom).html(val);
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: Number($(el).attr("value") || "0"),
        		fullScore: Number($(el).attr("fullScore") || "5"),
        		starStyle: $(el).attr("starStyle") || "lg",
        		ratingText:$(el).attr("ratingText") || "",
        		allowHalf: $(el).attr("allowHalf")==="true",
        		ratingValue: $(el).attr("ratingValue")==="true"
        	};
        	return _data;
        }

        function _rating(el){

	  		var that = this;
	  		$(el).on("click", function(event) {
	  			var left = $(this).offset().left;
	  			var width = $(this).width();
	  			var  delta = event.pageX - left;
	  			if(delta<0){
	  				delta = 0;
	  			}
	  			if(delta>width)
	  				delta = width;
	  			var score = 5*delta/width;
	  			if(config.allowHalf){
		  			var stars = Math.round(score);
					if(score>stars){
						stars+=0.5;
					}
				}else{
					var stars = Math.ceil(score);
				}
	  			that.setValue(_value(stars));
	  		});
        }

        function _star(value){
        	if(!value)
        		return 0;
        	var star = Number(value*5/config.fullScore).toFixed(1);

        	if(star-Math.round(star)===0){
        		star = Math.round(star);
        	}
        	return star;
        }

        function _value(star){
        	return star*config.fullScore / 5;
        }

        return dom;
	}

	/**
	** 	Editor
	***/
	function Editor(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;

        var $textarea, editor;

        this.init = function (val){
			this.setConfig(val);
		}

		this.parse = function(element){
        	return _parseData(element);
        }

        this.getConfig = function(){
        	config.value = this.getValue();
        	return config;
        }

        this.getEditor = function(){
        	return editor;
        }

        this.setConfig = function(val){
        	var that = this;
			config = val;
			if(!window.wangEditor){
				return $(dom).html('<p class="text-danger"><i class="glyphicon glyphicon-info-sign"></i> 检查【wangEditor插件】</p>');
			}
			this.name = config.properties.name;
			this.title = config.properties.title;
			var require = config.validate && config.validate.require ? '<span class="text-red">*</span>' : '';
			var title = config.properties.title || "";
			var name = config.properties.name || "";
			var placeholder = config.placeholder;
			var _value = config.value;
			$textarea = $('<textarea name="'+name+'" />').html('<p>'+config.placeholder+'</p>').hide();
			$(dom).html($textarea);
			if(config.editorHeight){
				$textarea.height(config.editorHeight);
			}else{
				$textarea.attr('rows', config.rows);
			}
			editor = new wangEditor($textarea[0]);
			editor.config = $.extend(true, {}, editor.config, {
				mapAk: config.mapAk || 'YN79qK7VCGEOBTNzFEX0v5ej',
				printLog: false,
				menuFixed: false,
				zindex: Number(new Date()) * 10,
				uploadImgUrl: config.uploadImgUrl || SUI.settings().wangEditor().uploadImgUrl,
				uploadImgFileName: 'Filedata'
			});
			editor.config.menus = _editorMenus(config.editorTools);
			editor.config.emotions = $.extend(true, {
				"default": {
					title:"默认",
					data: __basePath + '_libs/plugins/wangEditor/js/emotions.default.data'
				}}, editor.config.emotions);
		    editor.config.uploadImgFns.onload = function (resultText, xhr) {
		        var originalName = editor.uploadImgOriginalName || '';
		        var result = $.parseJSON(resultText);
		        var fileName = result.fileName.split(".")[0];
		        editor.command(null, 'insertHtml', '<img src="' + result.url + '" alt="' + fileName + '" style="max-width:100%;"/>');
		    };
    		editor.create();
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$textarea.attr('readonly', 'readonly');
				$(dom).addClass('form-readOnly');
				editor.disable();
			}
			if(mode == "editable"){
				$textarea.removeAttr('readonly');
				$(dom).removeClass('form-readOnly');
				editor.enable();
				editor.onchange = function () {
					value = that.getValue();
					$(dom).trigger('change');
			    };
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			_value&&this.setValue(_value);
		}

        this.getValue = function(text){
        	var action = text ? "text" : "html";
        	var val = editor.$txt[action]();
        	if(/^(<p>(<br>|&nbsp;|\s)+<\/p>)+$/ig.test(val))
        		val = '';

        	return val;
        }

        this.setValue = function(val){
        	value = val;
        	editor.$txt.html(val);
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			$(dom).removeClass(SUI.Util.validateClass());
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var val = this.getValue(validate.forText);
			var result = SUI.Util.validate.call(dom, validate, val);
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name")
        		},
        		value: $(el).attr("value") || "",
        		maxlength: Number($(el).attr("maxlength") || "0"),
        		rows: Number($(el).attr("rows") || "3"),
        		placeholder : $(el).attr("placeholder") || "",
        		mapAk: $(el).attr("mapAk") || "",
        		editorTools: $(el).attr("editorTools") || "default",
        		editorHeight: $(el).attr("editorHeight") || "",
        		canFullScreen: $(el).attr("canFullScreen") == "true",
        		viewSource: $(el).attr("viewSource") == "true",
        		resizeable: $(el).attr("resizeable") == "true",
        		uploadImgUrl: $(el).attr("uploadImgUrl")
        	};
        	if(_data.maxlength&&_data.validate){
        		_data.validate.max = _data.validate.max || _data.maxlength;
        	}
        	return _data;
        }

        function _editorMenus(type){
        	var menus = SUI.settings().wangEditor().menus;
        	if(!type || type=="default"){
        		menus = menus.slice(0, 10);
        	}
        	if(type=="extend"){
        		menus = menus.slice(0, 20);
        	}
        	if(type=="advanced"){
        		menus = menus.slice(0);
        	}
        	if(config.viewSource){
        		menus.push('source','|');
        	}
        	if(config.canFullScreen){
        		menus.push('fullscreen','|');
        	}

        	return menus;
        }

        return dom;
	}

})();
