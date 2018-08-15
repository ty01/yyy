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
		shuzi:/^[0-9]*$/ //纯数字
	};
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
		validate: function(validate, value){
			var dom = this;
			if(!validate){
				return true;
			}
			if(typeof validate.style !== "undefined"){
				$(dom).addClass('form-validate-'+validate.style);
			}
			if(validate.require && (!value || !$.trim(value).length)){
				return false;
			}

			var length = value ? value.length : 0;
			if(length > validate.max){
				return false;
			}
			if(length < validate.min){
				return false;
			}
			var regx = validate.regx;
			if(regx && !new RegExp("^" + regx + "$").test(value)){
				return false;
			}

			if(!regx && validate.format){
				var format = validate.format.split("|");
				var f = format[0],
					l = format[1];
				if(!RegExps[f].test(value))
					return false;
				
				if(/float|number|int/.test(f)){
					var _value = Number(value);
					if(l){
						var len = l.replace(/[-+]/,"").split(".");
						var val = value.replace("-","").split(".");
						if(/cny/i.test(l)){
							len[1] = "2";
						}
						if(len[0] && val[0].length>Number(len[0]))
							return false;
						if(/float|number/.test(f) && len[1] && val[1] && val[1].length > Number(len[1]))
							return false;

						if(/^[-]/.test(l) && _value >=0 )
							return false;
						if(/^[+]/i.test(l) && _value <=0 )
							return false;
					}
					if(typeof validate.maxNum === "number" && _value > validate.maxNum)
						return false;
					if(typeof validate.minNum === "number" && _value < validate.minNum)
						return false;
				}
			}

			return true;
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
		    if (decimal == "") { 
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
			multi: false
		}
	};
	
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
			$(element).addClass('sui-component sui-'+type);
			return element;
		}
		function init(callback, context){
			for(var type in zoos){
				var zooDefine = $(".sui-" + type, context);
				zooDefine.each(function(){
					if($(this).sui()){
						return;
					}
					var el = create(type, this);
					$(el).attr("sui","true");
					var conf = el.zoo.parse(this);
					el.zoo.init(conf);
					if(conf&&conf.validate)
						$(el).on('change', function(){
							el.zoo.validate();
						});
				});
			}
			
			$.type(callback)==="function"&&callback();
		}
		var SUI = {
			create: create,
			init: init,
			register: register,
			Util: Util,
			Zoo: Zoo,
			settings: _fn(Settings)
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
	SUI.register("Opinion", Opinion);
	SUI.register("Form", Form);
	SUI.register("Hide", Hide);
	SUI.register("Select", Select);
	SUI.register("Input", Input);
	SUI.register("Number", number);
	SUI.register("Date", DateSingle);
	SUI.register("DateRange", DateRange);
	SUI.register("DateRangePicker", DateRangePicker);
	SUI.register("FileUpload", FileUpload);
	SUI.register("MultiOpinion", MultiOpinion);
	SUI.register("Participates", Participates);
	SUI.register("MultiSelect", MultiSelect);
	SUI.register("OpinionOne", OpinionOne);
	SUI.register("OpinionHistory", OpinionHistory);
	
	
	//form表单组件
	function Form (bind){
		var value, config;
		var dom = bind || $('<form></form>').get(0);
		dom.zoo = this;
		
		
		function getChildren(element, list){
			$("[sui='true']", element).each(function(){
				if(this.zoo){
					list[list.length] = this.zoo;
				}
			});
		}
		
		function getDataValue(data, name){
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
			$.each(children, function(i, zoo){
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
			$.each(children, function(i, zoo){
				if(zoo.notForm){
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
			var result = true;
			$.each(children, function(i, zoo){
				var con = zoo.getConfig();
				if(!con||con.mode!=="editable"){ // mode in config
					return;
				}
				if(!zoo.validate()){
					result = false;
				}
			});
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
	
	
	
	function Participates(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var sendTo, parties, first;
		var rendCount = 0;
		var displayName = "";
		var optionExt;
		
		this.notForm = true;
		this.getValue = function (){
			var steps = [];
			
			if(parties.prop("multi")){
				var selects = parties.find("select");
				var to = parties.attr("wf-to");
				var from = parties.attr("wf-from");
				var step = {};
				step.from = from;
				step.to = to;
				step.who = [];
				step.displayName = displayName;
				step.optionExt = optionExt;
				
				$.each(selects.val(), function(index, val){
					var option = $('[value="'+val+'"]', selects);
					step.who[step.who.length] = {id:val, name: option.attr("op_name"), type: option.attr("op_type")};
				});
				steps[steps.length] = step;
				return steps;
			}else{
				var step = {};
				var select = parties.find("select");
				step.to = parties.attr("wf-to");
				step.from = parties.attr("wf-from");
				step.displayName = displayName;
				step.optionExt = optionExt;
				
				var option = select.find("option:selected");
				if(option.length > 0){
					if(!select.val()){
						return;
					}
					step.who = [{id: select.val(), name: option.attr("op_name"), type: option.attr("op_type")}];
				}
				steps[steps.length] = step;
				return steps;
			}
		}
		
		this.setValue = function (val){
			value = val;
			return ;
		}
		
		this.setConfig = function(val){
			config = val || {};
			$(dom).removeClass('form-table');
			if(!config.tree){
				return;
			}
			if(!config.hides) {
				config.hides = [];
			}
			first = true;
			if(config.properties.attach){//嵌套风格
				var tree = config.tree;
				buildLineOptions(tree);
				$(dom).removeClass('row');
				var options = $('<div class="radio-group"></div>');
				var attach = $("#" + config.properties.attach);
				if(attach.length == 0){
					attach = $("[name='" + config.properties.attach + "']");
				}
				var attached = attach.attr("attached") == "true";
				var opName = "sui-parties-name-" +　SUI.Util.getSequence("parties");
				
				$.each(tree.children, function(i, node){
					var hasHide = false;
					if(config.hides.length>0) {
						for(var h=0;h<config.hides.length;h++) {
							var hide = config.hides[h];
							if(hide.from == tree.activity.id && hide.to == node.activity.id) {
								hasHide = true;
								break;
							}
						}
					}
					if(!hasHide){
						if(node.options){
							$.each(node.options, function(i, opt){
								var id = SUI.Util.getSequence("parties");
								id = "sui-parties-" + id;
								var option = $('<label for="'+id+'"><input id="'+id+'" type="radio" name="'+opName+'" value="'+node.activity.id+'" displayName="'+opt.name+'"/>'+opt.name+'</label>');
								option.find("input").prop("node", node);
								option.find("input").prop("opt", opt);
								options.append(option);
							});
						}else{
							var id = SUI.Util.getSequence("parties");
							id = "sui-parties-" + id;
							var option = $('<label for="'+id+'"><input id="'+id+'" type="radio" name="'+opName+'" value="'+node.activity.id+'" displayName="'+node.displayName+'" />'+node.displayName+'</label>');
							option.find("input").prop("node", node);
							options.append(option);
						}
					}
				});
				var html = '<div class="m_title"></div><div class="m_body"></div>'+
					'<div class="clearfix" style="margin-top:7px;">'+
						'<div class="col-sm-5 col-xs-12" style="padding-left:0px;">下一步：<span class="m_step"></span></div>'+
						'<div class="col-sm-7 col-xs-12" style="padding-left:0px;"><span class="m_parti_title">经办人：</span><div class="wf-parties" style="display:inline-block; vertical-align: top; min-width:270px; max-width:100%;"></div></div>'+
					'</div>';
				if(attached){
				  attach.remove();
				}
				$(dom).html(html);
				$('.m_title',dom).append(options);
				//如果只有一个选项，并且非决断，则不显示
				if(options.children().length == 1){
					var opt = $("input", options).prop("opt") || {};
					if(!opt.decision){
						options.parent().hide();
					}
				}
				if(!attached){
					//替换并包裹目标控件
					attach.after(dom);
					attach.remove();
					attach.attr("attached","true");
				}
				$(".m_body", dom).append(attach);

				var radios = $('.radio-group', dom),
					radiosInput = $("input", radios);
				radiosInput.iCheck(SUI.settings().iCheck({
					iCheckStyle: config.properties.checkStyle,
					iCheckColor: config.properties.checkColor
				}));
				var stepView = $('.m_step', dom);
				parties = $('.wf-parties', dom);
				radiosInput.on('ifChecked',function(){
					var selectRadio = radios.find("input").filter(":checked");
					var node = selectRadio.prop("node");
					optionExt = selectRadio.prop("opt");
					displayName = selectRadio.attr("displayName");
					stepView.html(node.activity.name);
					decision(node, optionExt, attach);//决断
					parties.show();
					parties.parent().find(".m_parti_title").show();
					if(node.activity.type=="finish"){
						parties.hide();
						parties.parent().find(".m_parti_title").hide();
					}
					render(parties, 0, node, config.processInstId);
					radios.trigger("sendToSelect",[node, parties]);
				});
				radios.find("input").first().iCheck("check").trigger('ifChecked');
				
			}else{//底部风格
				var tree = config.tree;
				buildLineOptions(tree);
				var html = '<div class="col-xs-12">'+
							 '<div class="box">';
				var showTitle = "true" == config.properties.showTitle;
				if(showTitle){
					html = html + '<div class="box-header">'+
							  '<h3 class="box-title">选择办理</h3>'+
							'</div>';
				}
				html = html +'<div class="box-body no-padding">'
								+ '<div class="form-table">'
									+ '<div class="form-tr clearfix"><div class="form-td col-sm-6 col-xs-12"><div class="form-item"><div class="item-name">下一步：</div><div class="item-value wf-sendTo"><select class="form-control" style="width: 100%;"></select></div></div></div>'
									+ '<div class="form-td col-sm-6 col-xs-12"><div class="form-item"><div class="item-name">经办人：</div><div class="item-value"><div class="wf-parties"></div></div></div></div></div>'
								+ '</div>'
							+'</div>'
							+'</div></div>';

				$(dom).html(html);
				
				//config.partiesFilter = function(parties, from, to){return parties;};
				sendTo = $(".wf-sendTo select", dom);
				sendTo.attr("from", tree.activity.id);
				parties = $(".wf-parties", dom);
				sendTo.prop("node",tree);
				$.each(tree.children, function(i, node){
					var hasHide = false;
					if(config.hides.length>0) {
						for(var h=0;h<config.hides.length;h++) {
							var hide = config.hides[h];
							if(hide.from == tree.activity.id && hide.to == node.activity.id) {
								hasHide = true;
								break;
							}
						}
					} 
					if(!hasHide){
						if(node.options){
							$.each(node.options,function(i, opt){
								var option = $('<option value="'+node.activity.id+'">'+node.activity.name+'</option>');
								option.prop("node", node);
								option.prop("opt", opt);
								sendTo.append(option);
							});
						}else{
							var option = $('<option value="'+node.activity.id+'">'+node.activity.name+'</option>');
							option.prop("node", node);
							sendTo.append(option);
						}
					}
				});
				// select2 美化下拉框
				sendTo.select2({minimumResultsForSearch:-1});
				//只有一个选项，隐藏下拉框
				if(sendTo.find("option").length == 1){
					//sendTo.close();
					sendTo.next().hide();
					sendTo.after('<span>'+sendTo.find("option").first().text()+'</span>');
				}
				sendTo.change(function(){
					var option = sendTo.find("option:selected");
					displayName = option.text();
					var node = option.prop("node");
					optionExt = option.prop("opt");
					decision(node, optionExt);//决断
					parties.parent().parent().show();
					if(node.activity.type=="finish"){
						parties.parent().parent().hide();
					}
					
					render(parties, 0, node, config.processInstId);
					sendTo.trigger("sendToSelect",[node, parties]);
				});
				sendTo.trigger("change");
			}
		}
		
		//决断
		function decision(node, linkExt, attach){
			linkExt = linkExt || {};
			//填写意见
			$(".sui-opinion[mode=editable], .sui-multiopinion[mode=editable], .sui-opinionone", dom).each(function(){
				if(first){
					first = false;
					return;
				}
				if(!attach){
					return;
				}
				var com = $(this).sui();
				if(!com){
					return;
				}
				
				com.setOpinion(node.displayName);
				if(linkExt.name){
					com.setOpinion(linkExt.name);
				}
			});
			
			if(linkExt.decision){
				setExt(linkExt.name);
			}else{
				setExt(null);
			}
			function setExt(linkName){
				var com = $(".sui-opinion[mode=editable]", dom).sui();
				if(com){
					com.setDecision(linkName);
				}
				com = $(".sui-multiopinion[mode=editable]", dom).sui();
				if(com){
					com.setDecision(linkName);
				}
				com = $(".sui-opinionone", dom).sui();
				if(com){
					com.setDecision(linkName);
				}
			}
		}
		
		function buildLineOptions(node){
			var lineExts = ((node.exts||{}).attrs || {}).lineExt || '{}';
			lineExts = SUI.Util.parseJSON(lineExts, true);
			$.each(node.children,function(i, child){
				var line = findLine(node, child.activity);
				var lineExt = lineExts[child.activity.id] || {};
				child.options = lineExt.options;
				var displayName = line.displayName;
				child.sort = 0;
				child.displayName = displayName;
				var index = displayName.indexOf(":");
				if(index > -1){
					child.sort = displayName.substring(0, index) -0;
					child.displayName = displayName.substring(index + 1);
				}
			});
			SUI.Util.sort(node.children, function(n1, n2){
				return n1.sort - n2.sort;
			});
		}
		
		//查找连线名称
		function findLine(tree, activity){
			var curConn;
			$.each(tree.connectors, function(i,conn){
				if(conn.destActID == activity.id){
					curConn = conn;
				}
			});
			return curConn;
		}
		
		
		this.getConfig = function(){
			return config;
		}
		this.parse = function(element){
			element = element || bind;
			element = $(element);
			var temp = {};
			temp.mode = element.attr("mode");
			temp.properties = {
				name: element.attr("name"),
				title: element.attr("title"),
				showTitle: element.attr("showTitle")
			};
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			return temp;
		}
		//{"activity": {action:"",multi:true}}
		function parseParti(participateFrom){
			var data = {};
			if(!participateFrom){
				return data;
			}
			
			var splits = participateFrom.split(",");
			$.each(splits, function(i, v){
				var exp	= v.split(":");
				var action = {};
				data[exp[0]] = action;
				var index = exp[1].indexOf("[");
				if(index > -1){
					action.multi = exp[1].substring(index + 1, exp[1].indexOf("]"));
					action.action = exp[1].substring(0, index);
				}else{
					action.action = exp[1];
				}
				
			});
			return data;
		}
		
		//构造参与者下拉框
		function render(div, orgId, node, processInstId, nullable){
			var allPartis;
			var from = node.parent.activity.id;
			var activity = node.activity.id;
			var process = node.activity.processDefId;
			var mCount;
			div = div || $("<div></div>");
			div.attr("wf-to", activity);
			div.attr("wf-from", from);
			if(node.activity.type=="finish"){
				return;
			}
			if(div === parties){
				mCount = ++rendCount;
			}
			function filterOptions(){
				div.empty();
				var multi = false;
				var exts = node.exts || {};
				var attrs = exts.attrs || {};
				var participateFrom = parseParti(attrs.participateFrom);
				if(participateFrom[from] && participateFrom[from].multi == "multi"){
					multi = true;
				}
				div.prop("multi", multi);
				var list = config.partiesFilter ? config.partiesFilter(allPartis, from, activity) : allPartis;
				var html = "";
				var select = $('<select class="form-control" style="width: 100%;"></select>');
				if(multi){
					select.attr("multiple","multiple");
				}else{
					if(nullable){
						html += '<option value="">请选择</option>';
					}
				}
				
				for(var i =0; i < list.length; i++){
					var record = list[i];
					var emps = "";
					if(record.type == "position"){
						emps += "(";
						var index = 0;
						for(var key in record.emps){
							var emp = record.emps[key];
							if(index > 0){
								emps += ",";
							}
							emps += emp.empname;
							index++;
						}
						emps += ")";
					}
					var id = "sui-participates-" + SUI.Util.getSequence("Participates");
					html += '<option id="'+id+'" value="'+record.positionid+'" op_type="'+record.type+'" op_name="'+record.posiname+'">'+record.posiname+ emps +'</option>';
					if(list.length == 1){
						select.next().hide();
						select.next().after('<span>'+list[0].posiname+'</span>');
					}
				}
				select.html(html);
				// select2
				div.append(select);
				select.select2({minimumResultsForSearch:-1});
			}
			var key = activity + "-" + process +"-" + orgId;
			//缓存
			var cache = SUI.Util.getCache("parties");
			var cacheData = cache[key];
			if(cacheData){
				allPartis = cacheData;
				setTimeout(function(){
					filterOptions();
				},1);
			}else{
				$.ajax({
					type: "POST",
					url: "com.sudytech.portalone.base.ui.queryParticipants.biz.ext",
					data: wf.jsonString({
						activityDefID: activity,
						process: process,
						orgId: orgId,
						from: from,
						processInstId: processInstId || 0
					}),
					contentType: "text/json",
					success: function(data){
						var list = data.list;
						allPartis = list || [];
						cache[key] = allPartis;
						if(div === parties){
							if(mCount == rendCount){
								filterOptions();
							}
						}else{
							filterOptions();
						}
					}
				});
			}
			return div;
		}
		//开放构造参与者选项的接口
		this.buildPartiesSelect = render;
		return dom;
	}
	
	//文件上传组件
	function FileUpload(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var items, controlId, tempFileId, photos;
		this.setConfig = function(val){
			config = val;
			
			this.name = config.properties.name;
			this.title = config.properties.title;
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				config.properties.canEdit = false;
				config.properties.canUpload = false;
				config.properties.canDelete = false;
			}
			if(mode == "editable"){
				if("false" == config.properties.canEdit || config.properties.canEdit === false){
					config.properties.canEdit = false;
				}else{
					config.properties.canEdit = true;
				}
				if("false" == config.properties.canDelete || config.properties.canDelete === false){
					config.properties.canDelete = false;
				}else{
					config.properties.canDelete = true;
				}
				if("false" == config.properties.canUpload || config.properties.canUpload === false){
					config.properties.canUpload = false;
				}else{
					config.properties.canUpload = true;
				}
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			
			render();
		}
		this.getConfig = function (){
			return config;
		}
		
		this.getValue = function(){
			if(config.properties.multi=="true"){
				var vals = [];
				items.find("input").each(function(){
					vals[vals.length] = $(this).val();
				});
				return vals.length ==0 ? "": SUI.Util.toJsonString(vals);
			}else{
				return items.find("input").val();
			}
			
		}
		
		this.setValue = function(val){
			value = val;
			items.empty();
			if(val){
				var fileKeys;
				if(config.properties.multi=="true"){
					fileKeys = SUI.Util.parseJSON(val,true);
				}else{
					fileKeys = [val];
				}
				$.each(fileKeys, function(i, key){
					$.ajax({
						type: "POST",
						url: "com.sudytech.portalone.base.db.getById.biz.ext",
						data: wf.jsonString({
							entity: {
								__type: "sdo:com.sudytech.portalone.base.dataset.PoFiles",
								id: key
							}
						}),
						contentType: "text/json",
						success: function(data){
							var item = createFileItem(key, data.value.fileName);
							items.append(item);
							onchange();
						}
					});
				});
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
				return {type: "fileUpload", value: ary};
			}else{
				if(cur){
					ary[ary.length] = {value: cur, op: "insert"};
				}
				if(value){
					ary[ary.length] = {value: value, op: "delete"};
				}
				return {type: "fileUpload", value: ary};
			}
		}
		
		this.init = function (val){
			this.setConfig(val);
		}
		
		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
				canEdit: element.attr("canEdit"),
				canUpload: element.attr("canUpload"),
				canDelete: element.attr("canDelete"),
				multi: element.attr("multi"),
				max: (element.attr("max") || 5) -0,
				ext: element.attr("ext"), // '*.gif; *.jpg; *.png' 使用分号分割
				preview: element.attr("preview"),
				previewWidth: Number(element.attr("previewWidth") || "0"),
				buttonText: element.attr("buttonText") || "上传",
				buttonWidth: Number(element.attr("buttonWidth") || "60")
			};
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
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
			if(params.canUpload){
				control.uploadify(SUI.settings().uploadify({
					buttonText: "<i class=\"fa fa-upload\"></i> " + params.buttonText,
					width: params.buttonWidth,
					fileTypeExts : config.properties.ext,
					queueID: queueID,
					onUploadSuccess: function(file, data, response){
						if($.isFunction(config.onUploadSuccess))
							config.onUploadSuccess.apply(this, arguments);
						resultData = $.parseJSON(data);
						var item = createFileItem(resultData.fileKey, resultData.fileName);
						items.append(item);
						onchange();
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
			this.getResultData = function (){
				return resultData;
			}
		}
		
		function onchange(){
			if(!config.properties.canUpload){
				return;
			}
			$(dom).trigger('change');
			var len = items.children().length;
			var uploader = $("#" + controlId);
			if(config.properties.multi == "true" ){
				if(len < config.properties.max){
					uploader.show();
				}else{
					uploader.hide();
				}
			}else{
				if(len == 0){
					uploader.show();
				}else{
					uploader.hide();
				}
			}
		}
		
		function createFileItem(fileKey, fileName){
			var div = $('<div class="file-item"><input class="wf-fileInput" type="hidden" /><a class="wf-fileView"></a> '+
			'<span class="btn btn-sm btn-danger wf-delete"><i class="fa fa-close"></i> 删除</span> '+
			'<span class="btn btn-sm btn-success wf-editBtn"><i class="fa fa-edit"></i> 编辑</span> '+
			'<span class="btn btn-sm btn-primary wf-saveBtn"><i class="fa fa-upload"></i> 上传</span></div>');
			var view = div.find(".wf-fileView");
			view.html(fileName);
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
				var dWidth = document.documentElement.clientWidth - 200 + "px"; 
				var dHeight = document.documentElement.clientHeight*0.9 + "px";
				var url="/default/base/ioffice/editor.jsp?fileId="+input.val()+ "&mEditType=2,1"
		        +"&tempFileId=" +tempFileId;
		        if(window.showModalDialog){
					window.showModalDialog(url,window,"dialogWidth="+dWidth+";dialogHeight="+dHeight+";resizable=yes;scroll=no");
				}else{
					window.open(url, "_blank", 'height=1000, width=800, resizable=yes');
				}
			});
			view.click(function(){
				view.attr({
					"href": __contextPath +"/downloadfile/"+ input.val(),
					"target":"_blank"
				});
			});
			if(config.properties.preview && /\.[png|gif|jpg|jpeg|bmp|ico]/i.test(fileName)){
				var $imgView = $('<div class="file-imageview" />'),
					src = __contextPath +"/downloadfile/"+ input.val(),
					alt = fileName.split(".")[0];
				$imgView.html('<div class="imageview-box"><img title="点击预览" src="'+src+'" alt="'+alt+'" /></div>');
				if(config.properties.previewWidth)
					$(".imageview-box", $imgView).css("max-width", config.properties.previewWidth);

				$imgView.prependTo(div);
				var pid = "img" + Number(new Date());
				div.data("pid", pid);
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
					console.log(pid);
					photos.start = APP.inArrayObj('pid', pid, photos.data);
					if(window.layer){
						layer.photos({
						    photos: photos
						    ,shift: 5
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
					$(delBtn).parent().remove();
					onchange();
					layer.closeAll('dialog');
				});
			});
			if(config.properties.canEdit){
				editBtn.show();
			}
			if(config.properties.canDelete){
				delBtn.show();
			}
			return div;
		}
		return dom;
	}
	
	//会签意见
	function MultiOpinion(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		
		var myOpinion;
		var extAttrs, decision;
		
		this.getValue = function(){
			var val = value || '{}';
			val = SUI.Util.parseJSON(val);
			var myKey = getMyKey();
			var op = val[myKey] || {};
			if(config.mode != "editable"){
				return value;
			}
			op = getMyOpinion();
			val[myKey] = op;
			return SUI.Util.toJsonString(val);
		}
		
		this.setDecision = function(_decision){
			decision = _decision;
		}
		
		this.setOpinion = function(op){
			myOpinion.val(op || '');
		}
		
		this.setExtAttribute = function(key, value){
			extAttrs = extAttrs || {};
			extAttrs[key] = value;
		}
		this.setValue = function(val){
			value = val;
			if(!value){
				myOpinion.show();
				return;
			}
			var div=$('.m_view', dom);
			var myKey = getMyKey();
			var data = SUI.Util.parseJSON(value);
			var html = "";
			for(var key in data){
				if(key == myKey){
					myOpinion.val(data[key].opinion);
					extAttrs = data[key].extAttrs;
					if(config.mode == "editable"){
						continue;
					}
				}
				var item = data[key];
				var dt = new Date();
				dt.setTime(item.date -0);
				dt = SUI.Util.dateFormat(dt, "yyyy-MM-dd hh:mm");
				html += '<div>'+(item.decision||'') +' '+item.opinion+'<br/><span style="display:inline-block; width:40px;"></span>——'+item.userName+'('+item.userOrgName+') ：'+ dt +'</div>';
			}
			div.append($(html));
			$(dom).trigger('change');
		}
		this.init = function(val){
			this.setConfig(val);
		}
		this.setConfig = function(val){
			config = val;
			SUI.Zoo.setConfig.call(this,val);
			render();
		}
		this.getConfig = function(){
			return config;
		}
		this.parse = function(element){
			element = element || bind;
			element = $(element);
			var temp = {};
			temp.mode = element.attr("mode");
			temp.properties = {
				name: element.attr("name"),
				title: element.attr("title"),
				defValue: element.attr("defValue")
			};
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			temp.inputTip = element.attr("inputTip") || "";
			temp.myKey = element.attr("myKey");
			return temp;
		}
		function render(){
			var require = config.validate && config.validate.require ? "*" : "";
			var html = '';
			var maxlength = config.maxlength ? config.maxlength : (config.validate && config.validate.max ? config.validate.max : 0);
				maxlength = maxlength ? ' maxlength="'+maxlength+'"':"";

			html += '<div class="m_view"></div><textarea class="form-control" rows="3" readOnly=""'+maxlength+'></textarea>';
			$(dom).html(html);
			myOpinion = $('textarea', dom);
			if(config.properties.defValue){
				myOpinion.val(config.properties.defValue);
			}
			if(config.mode == "editable"){
				myOpinion.removeAttr("readOnly");
				myOpinion.attr("placeholder","请在此输入意见...");
				SUI.Util.poptip(config.inputTip, dom, myOpinion);
			}else{
				myOpinion.attr("readOnly", "readOnly");
				myOpinion.removeAttr("placeholder");
				myOpinion.hide();
				//myOpinion.hide();
			}
		}
		
		function getMyOpinion(){
			var temp = {};
			var userObject = SUI.Util.getUser();
			temp.userId = userObject.userId;
			temp.userName = userObject.userName;
			temp.userOrgId = userObject.userOrgId;
			temp.userOrgName = userObject.userOrgName;
			temp.opinion = myOpinion.val();
			temp.date = new Date() -0;
			temp.extAttrs = extAttrs;
			temp.decision = decision;
			return temp;
		}
		
		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = myOpinion.val();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
			$(dom).addClass(SUI.Util.validateClass(result));
			return result;
		}
		
		this.getExt = function(){
			return {type: "multiOpinion", value : {key: getMyKey(), value: getMyOpinion()}};
		}
		function getMyKey(){
			var myKey = config.myKey;
			if(config.myKey == "_user"){
				myKey = "u_"+SUI.Util.getUser().userId;
			}else if(config.myKey == "_org"){
				myKey = "o_"+SUI.Util.getUser().userOrgId;
			}
			return myKey;
		}
		return dom;
	}
	
	//统一意见。
	function OpinionOne(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var opinion;
		var label,decision,extAttrs;
		this.getValue = function(){
			var temp = getMyOpinion();
			if(config.properties.multi){
				temp = {
					key:getMyKey(),
					value: temp
				};
			}
			return SUI.Util.toJsonString(temp);
		}
		
		this.setDecision = function(_decision){
			decision = _decision;
		}
		
		this.setExtAttribute = function(key, value){
			extAttrs = extAttrs || {};
			extAttrs[key] = value;
		}
		
		this.setOpinion = function(op){
			opinion.val(op || '');
		}
		
		function getMyOpinion(){
			var temp = {};
			var user = SUI.Util.getUser();
			temp.userId = user.userId;
			temp.userName = user.userName;
			temp.userOrgId = user.userOrgId;
			temp.userOrgName = user.userOrgName;
			temp.opinion = opinion.val();
			temp.date = new Date() -0;
			temp.extAttrs = extAttrs;
			temp.decision = decision;
			return temp;
		}
		this.getExt =function(){
			return {type: "opinion", value : getMyOpinion()};
		}
		
		this.setValue = function(val){
			value = val;
			if(!value){
				return;
			}
			value = SUI.Util.parseJSON(value, true);
			opinion.val(value.opinion).trigger('change');
			$(dom).trigger('change');
			
		}
		function getMyKey(){
			var myKey = config.properties.myKey;
			if(myKey == "_user"){
				myKey = "u_"+SUI.Util.getUser().userId;
			}else if(config.myKey == "_org"){
				myKey = "o_"+SUI.Util.getUser().userOrgId;
			}
			return myKey;
		}
		
		this.getConfig = function(){
			return config;
		}
		
		this.setConfig = function(val){
			config = val;
			
			var require = config.validate && config.validate.require ? "*" : "";
			var html = '';
			
			var maxlength = config.maxlength ? ' maxlength="'+config.maxlength+'"':"";
			html += '<textarea class="form-control" rows="3"'+maxlength+'></textarea>';
			$(dom).html(html);
			var template = $(dom);
			opinion = template.find("textarea");
			label = template.find("div");
			label.iCheck(SUI.settings().iCheck({
					iCheckStyle: config.properties.checkStyle,
					iCheckColor: config.properties.checkColor
				}));
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				opinion.attr("readOnly", "readOnly");
			}
			if(mode == "editable"){
				opinion.removeAttr("readOnly");
				opinion.attr("placeholder","请在此输入意见...");
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			this.name = config.properties.name;
			this.title = config.properties.title;
		}
		
		this.init = function (val){
			this.setConfig(val);
		}
		
		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = opinion.val();
			var result = SUI.Util.validate(validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
				title: element.attr("title")
			};
			temp.maxlength = Number($(element).attr("maxlength") || "0");
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
			var properties = element.attr("properties");
			if(properties){
				/*
					{	
						name:"bmld", //表示实体字段名称
						multi:true, //表示是否是会签意见
						myKey:"_user", //表示会签的key
						title:"审批意见" //标题
					}
				*/
				temp.properties = SUI.Util.parseJSON(properties, true);
			}
			return temp;
		}
		
		return dom;
	}

	//意见。
	function Opinion(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var opinion;
		var label;
		var extAttrs,decision;
		this.getValue = function(){
			if(config.mode != "editable"){
				return value;
			}
			var temp = getMyOpinion();
			return SUI.Util.toJsonString(temp);
		}
		
		this.setExtAttribute = function(key, value){
			extAttrs = extAttrs || {};
			extAttrs[key] = value;
		}
		this.setDecision = function(_decision){
			decision = _decision;
		}
		
		this.setOpinion = function(op){
			opinion.val(op || '');
		}
		
		function getMyOpinion(){
			var temp = {};
			var user = SUI.Util.getUser();
			temp.userId = user.userId;
			temp.userName = user.userName;
			temp.userOrgId = user.userOrgId;
			temp.userOrgName = user.userOrgName;
			temp.opinion = opinion.val();
			temp.date = new Date() -0;
			temp.extAttrs = extAttrs;
			temp.decision = decision;
			return temp;
		}
		this.getExt =function(){
			return {type: "opinion", value : getMyOpinion()};
		}
		
		this.setValue = function(val){
			value = val;
			if(!value){
				opinion.show();
				return;
			}
			var _value = SUI.Util.parseJSON(value, true);
			extAttrs = _value.extAttrs;
			var item = _value;
			var html = "";
			var dt = new Date();
			dt.setTime(item.date -0);
			dt = SUI.Util.dateFormat(dt, "yyyy-MM-dd hh:mm");
			html += (item.decision||'')+ ' ' + item.opinion+'<br/><span style="display:inline-block; width:40px;"></span>——'+item.userName+'：'+ dt;
			label.html(html);
			opinion.val(_value.opinion).trigger('change');
		}
		
		
		this.getConfig = function(){
			return config;
		}
		
		this.setConfig = function(val){
			config = val;
			
			var require = config.validate && config.validate.require ? "*" : "";
			var html = '';
			var maxlength = config.maxlength ? ' maxlength="'+config.maxlength+'"':"";
			html += '<div></div><textarea class="form-control" rows="3"'+maxlength+'></textarea>';
			$(dom).html(html);
			var template = $(dom);
			opinion = template.find("textarea");
			label = template.find("div");
			if(config.properties.defValue){
				opinion.val(config.properties.defValue);
			}
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				opinion.attr("readOnly", "readOnly");
				opinion.hide();
			}
			if(mode == "editable"){
				opinion.removeAttr("readOnly");
				opinion.attr("placeholder","请在此输入意见...");
				SUI.Util.poptip(config.inputTip, dom, opinion);
				label.hide();
			}
			if(mode == "hide"){
				$(dom).hide();
			}
			this.name = config.properties.name;
			this.title = config.properties.title;
		}
		
		this.init = function (val){
			this.setConfig(val);
		}
		
		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = opinion.val();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
				defValue:element.attr("defValue")
			};
			temp.maxlength = Number(element.attr("maxlength") || "0");
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
        	temp.inputTip = element.attr("inputTip") || "";
			
			return temp;
		}
		
		return dom;
	}
	
	function OpinionHistory(bind){
		var dom = bind || $("<div />")[0], config, value;
		dom.zoo = this;
		this.notForm = true;

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
			if(!config.properties.processInstId){
				return;
			}
			
			$.ajax({
				type: 'POST',
				url: "com.sudytech.portalone.base.workflow.queryOpinionHis.biz.ext",
				data: SUI.Util.toJsonString({
					processInstId: config.properties.processInstId,
					sort:config.properties.sort
				}),
				contentType: "text/json",
				success: function(data) {
				   var list = data.list;
				   var tr = "";
				   $.each(list, function(i, item){
					   if(item.WORKITEMTYPE =="M" && item.ASSISTANTNAME){
						   tr += '<div class="form-tr clearfix">'+
									'<div class="form-td col-xs-12">'+
										'<div class="form-item">'+
											'<div class="item-name">'+item.WORKITEMNAME+'：</div>'+
											'<div class="item-value">'+
												'<div>'+(item.DEALRESULT||'')+'</div>'+
												'<div>'+(item.DEALOPINION||'')+'</div>'+
												'<div style="text-align:right;">——'+item.ASSISTANTNAME +' '+ item.END_TIME+'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>';
					   }
				   });
				   
				   $(dom).html('<div class="form-table">' + tr + "</div>");
				},
				error: function(msg){
					if(console){
						console.log(msg);
					}
				}
			});
		}

        this.getValue = function(){
        	return value
        }

        this.setValue = function(val){
			value = val;
			
		}


		this.validate = function(){
			return true;
		}

        function _parseData(element){
        	var el = element || bind;

        	var _data = {
        		mode: $(el).attr("mode"),
        		validate: SUI.Util.parseJSON($(el).attr("validate"), true),
        		properties:{
        			title: $(el).attr("title"),
        			name: $(el).attr("name"),
					processInstId: $(el).attr("processInstId"),
					sort:$(el).attr("sort")
        		},
        		value: $(el).attr("value") || ""
        	};

        	return _data;
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
				}
				if(mode == "editable"){
					$select.removeAttr("disabled");
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
				}
				if(mode == "editable"){
					$radio.removeAttr("disabled").on('ifChecked', function(event) {
						event.preventDefault();
						$(dom).trigger('change');
					});
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
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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

        this.getValue = function(){
			if(this.selectStyle == "select"){
				return $select.val();
			}else if(this.selectStyle == "checkbox"){
				return (function(){
					var _val = [];
					$checkbox.each(function(index, el) {
						if($(el).is(":checked"))
							_val.push(el.value);
					});
					return _val;
				})();
			}
        }

		this.setValue = function(val){
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
				}
				if(mode == "editable"){
					$select.removeAttr("disabled");
				}
				if(mode == "hide"){
					$(dom).hide();
				}
				$select.select2($.extend(true, {
					minimumResultsForSearch:-1,
					maximumSelectionLength: config.properties.maxSize
				}, config.select2 || {}));
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
			var val = value || config.value;
			if(val){
				this.setValue(val);
			}
			
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			if(value && config.properties.maxSize && value.length > config.properties.maxSize)
				result = false;
			$(dom).removeClass(SUI.Util.validateClass());
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
					id = "sui-multiselect-"+ name + id;
					html += '<label for="'+id+'"><input id="'+id+'" type="checkbox" name="'+name+'" value="'+v.value+'" />'+v.name+'</label>';
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
		
        var $input;

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
	        $(dom).html(template);
	        $input = $("input, textarea", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly');
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
					}).on('input change', function(event) {
						this.value = SUI.Util.encodeCNY(this.value, parseData.cny);
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
			$input.val(val);
		}
		this.getExt = function(){
			if(config.properties.sequence){
				return {type: "sequence", value : config.properties.sequence};
			}
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
        		placeholder : $(el).attr("placeholder") || ""
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
        var $input;
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
	        $(dom).html(template);
	        $input = $("input", dom);
			

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly');
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
			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.setValue = function(val){
			$input.val(val).trigger("change");
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true)
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
		var $start, $end;

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
	        $(dom).html(template);
	        
	        $start = $(".date-start input", dom);
	        $end = $(".date-end input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$(dom).addClass('form-readOnly');
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

			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return SUI.Util.toJsonString([$start.val(), $end.val()]);
        }

        this.setValue = function(val){
			value = val || ["",""];
			if(typeof(value) == "string"){
				value = SUI.Util.parseJSON(val, true);
			}
			
			$start.val(value[0]).trigger("change");
			$end.val(value[1]).trigger("change");
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var result = SUI.Util.validate.call(dom, validate, $start.val()) && SUI.Util.validate.call(dom, validate, $end.val());
			$(dom).removeClass(SUI.Util.validateClass());
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
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true)
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
		var $input;

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
	        $(dom).html(template);
	        $input = $("input", dom);
	        
			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly');
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
			$input.val(value.join(sep)).trigger('change');
			
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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
        		dateRange: SUI.Util.parseJSON($(el).attr("dateRange"), true)
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
		var $input;

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

	        $(dom).html(template);
	        $input = $("input", dom);

			var mode = config.mode || 'view';
			if(mode == "readOnly" || mode == "view"){
				$input.attr("readOnly", "readOnly");
				$(dom).addClass('form-readOnly');
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
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = this.getValue();
			var result = SUI.Util.validate.call(dom, validate, value);
			$(dom).removeClass(SUI.Util.validateClass());
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

})();