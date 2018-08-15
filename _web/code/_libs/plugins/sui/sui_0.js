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
		phone: /^(0\d{2,3}-\d{7,8})|(0?(13|14|15|17|18)[0-9]{9})$/, // 固定电话或手机
		url:/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/, // URL地址
		email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // email地址
		ip:/^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/, // ip地址
		chinese:/^[\u4e00-\u9fa5]*$/ // 中文字符
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
			if(!validate){
				return true;
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
		validDateStr: function(str){
			var strs = $.trim(str).split(/\s+/);
			var out = "";
			if(strs.length){
				var date = strs[0].match(/\d+/g);
				if(date)
					out += date.join("/");
				if(strs[1]){
					var time = strs[1].match(/\d+/g);
					if(time)
						out += time.join(":");
				}
			}
			return out;
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
			styleColor: 'blue', // icheck 颜色：black , red , green , blue , aero , grey , orange , yellow , pink , purple
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
	    			  radioClass: 'iradio_'+skin,
				}, opt);
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
	
	//form表单组件
	function Form (bind){
		var value, config;
		var dom = bind || $('<form></form>').get(0);
		dom.zoo = this;
		
		
		function getChildren(element, list){
			$(element).children().each(function(){
				if(this.zoo){
					list[list.length] = this.zoo;
				}else{
					getChildren(this, list);
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
				zoo.setValue(val);
			});
		}
		
		this.getValue = function(tranform){
			var temp  = {};
			var extValue = {};
			var children = [];
			getChildren(dom, children);
			$.each(children, function(i, zoo){
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
		$(dom).addClass('form-table');
		var sendTo, parties;
		var rendCount = 0;
		
		this.getValue = function (){
			var steps = [];
			
			if(parties.prop("multi")){
				var boxex = parties.find(":checkbox:checked");
				var to = parties.attr("wf-to");
				var from = parties.attr("wf-from");
				var step = {};
				step.from = from;
				step.to = to;
				step.who = [];
				boxex.each(function(){
					var check = $(this);
					step.who[step.who.length] = {id:check.val(), name: check.attr("op_name"), type: check.attr("op_type")};
				});
				steps[steps.length] = step;
				return steps;
			}else{
				var step = {};
				var select = parties.find("select");
				step.to = parties.attr("wf-to");
				step.from = parties.attr("wf-from");
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
			var tree = config.tree;
			var html = '<div class="form-tr clearfix"><div class="form-td col-sm-6 col-xs-12"><div class="form-item"><div class="item-name">选择下一步</div><div class="item-value wf-sendTo"><select class="form-control" style="width: 100%;"></select></div></div></div>'
						+ '<div class="form-td col-sm-6 col-xs-12"><div class="form-item"><div class="item-name">下一步处理者</div><div class="item-value"><div class="wf-parties"></div></div></div></div></div>';
			$(dom).html(html);
			if(!config.tree){
				return;
			}
			if(!val.hides) {
				config.hides = [];
			}
			//config.partiesFilter = function(parties, from, to){return parties;};
			sendTo = $(".wf-sendTo select", dom);
			sendTo.attr("from", tree.activity.id);
			parties = $(".wf-parties", dom);
			sendTo.prop("node",tree);
			$.each(tree.children, function(i, node){
				if(config.hides.length>0) {
					var hasHide = false;
					for(var h=0;h<config.hides.length;h++) {
						var hide = config.hides[h];
						if(hide.from == tree.activity.id && hide.to == node.activity.id) {
							hasHide = true;
							break;
						} 
					}
					if(!hasHide){
						var option = $('<option value="'+node.activity.id+'">'+node.activity.name+'</option>');
						option.prop("node", node);
						sendTo.append(option);
					} 
				} else {
					var option = $('<option value="'+node.activity.id+'">'+node.activity.name+'</option>');
					option.prop("node", node);
					sendTo.append(option);
				}
				
			});
			// select2
			sendTo.select2({minimumResultsForSearch:-1});
			
			sendTo.change(function(){
				var option = sendTo.find("option:selected");
				var node = option.prop("node");
				parties.parent().show();
				if(node.activity.type=="finish"){
					parties.parent().parent().hide();
				}
				
				render(parties, 0, node, config.processInstId);
				sendTo.trigger("sendToSelect",[node, parties]);
			});
			sendTo.trigger("change");
		}
		
		
		this.getConfig = function(){
			return config;
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
				if(multi){
					var html = "",
						$group = $('<div class="checkbox-group" />');
					
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
						html += '<label for="'+id+'"><input type="checkbox" id="'+id+'" name="" value="'+record.positionid+'" op_type="'+record.type+'" op_name="'+record.posiname+'" /> '+record.posiname + emps +'</label>';
					}
					$group.html(html);
					div.html($group);
					// iCheck
					$("input[type=checkbox]", div).iCheck(SUI.settings().iCheck());
				}else{
					var select = $('<select class="form-control" style="width: 100%;"></select>');
					var html = "";
					if(nullable){
						html += '<option value="">请选择</option>';
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
						html += '<option value="'+record.positionid+'" op_type="'+record.type+'" op_name="'+record.posiname+'">'+record.posiname+ emps +'</option>';
					}
					select.html(html);
					// select2
					div.append(select);
					select.select2({minimumResultsForSearch:-1});
				}
			}
			var key = activity + "-" + process +"-" + orgId;
			var cache = SUI.Util.getCache("parties");
			var cacheData = cache[key];
			if(cacheData){
				allPartis = cacheData;
				filterOptions();
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
		this.buildPartiesSelect = render;
		return dom;
	}
	
	//文件上传组件
	function FileUpload(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var items, controlId, tempFileId;
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
				if("false" == config.properties.canEdit){
					config.properties.canEdit = false;
				}else{
					config.properties.canEdit = true;
				}
				if("false" == config.properties.canDelete){
					config.properties.canDelete = false;
				}else{
					config.properties.canDelete = true;
				}
				if("false" == config.properties.canUpload){
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
			if(SUI.Util.compare(cur, value)){
				return;
			}
			return {type: "file", value: cur};
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
			'<span class="btn btn-primary btn-sm btn-danger wf-delete"><i class="fa fa-close"></i> 删除</span> '+
			'<span class="btn btn-primary btn-sm btn-success wf-editBtn"><i class="fa fa-edit"></i> 编辑</span> '+
			'<span class="btn btn-primary btn-sm btn-primary wf-saveBtn"><i class="fa fa-upload"></i> 上传</span></div>');
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
				
				var url="/default/base/ioffice/editor.jsp?fileId="+input.val()+ "&mEditType=2,1"
		        +"&tempFileId=" +tempFileId;
		        if(window.showModalDialog){
					window.showModalDialog(url,window,"dialogWidth=1000px;dialogHeight=800px;resizable=yes");
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
					src = __contextPath +"/downloadfile/"+ input.val();
				$imgView.html('<div class="imageview-box"><a title="点击预览 '+fileName+'" href="'+src+'" target="_blank"><img src="'+src+'"></a></div>');
				if(config.properties.previewWidth)
					$(".imageview-box", $imgView).css("max-width", config.properties.previewWidth);

				$imgView.prependTo(div);
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
		
		this.getValue = function(){
			var val = value || '{}';
			val = SUI.Util.parseJSON(val);
			var myKey = getMyKey();
			var op = val[myKey] || {};
			var equal = SUI.Util.compare(myOpinion.val(), op.opinion);
			if(equal){
				return value;
			}
			val[myKey] = getMyOpinion();
			return SUI.Util.toJsonString(val);
		}
		this.setValue = function(val){
			value = val;
			if(!value){
				return;
			}
			var div=$('.m_view', dom);
			var myKey = getMyKey();
			var data = SUI.Util.parseJSON(value);
			var html = "";
			for(var key in data){
				if(key == myKey){
					myOpinion.val(data[key].opinion);
					if(config.mode == "editable"){
						continue;
					}
				}
				var item = data[key];
				var dt = new Date();
				dt.setTime(item.date -0);
				dt = SUI.Util.dateFormat(dt, "yyyyMMdd hh:mm");
				html += '<div>'+item.userName+'的意见：'+item.opinion+' ——部门:'+item.userOrgName+' 日期：'+ dt +'</div>';
				
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
				title: element.attr("title")
			};
			temp.validate = SUI.Util.parseJSON(element.attr("validate"), true);
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
			if(config.mode == "editable"){
				myOpinion.removeAttr("readOnly");
				myOpinion.attr("placeholder","请在此输入意见...");
			}else{
				myOpinion.attr("readOnly", "readOnly");
				myOpinion.removeAttr("placeholder");
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
			return temp;
		}
		
		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var value = myOpinion.val();
			var result = SUI.Util.validate(validate, value);
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

	//意见。
	function Opinion(bind){
		var value, config;
		var dom = bind || $('<div></div>').get(0);
		dom.zoo = this;
		var opinion;
		var label;
		this.getValue = function(){
			var equal = SUI.Util.compare(opinion.val(), value ? value.opinion : "")
			if(equal){//未修改
				return value ? SUI.Util.toJsonString(value) : value;
			}
			var temp = getMyOpinion();
			return SUI.Util.toJsonString(temp);
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
			label.html(value.userName + ":");
			opinion.val(value.opinion).trigger('change');
			$(dom).trigger('change');
			
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
			return temp;
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
				$select = $("select", dom).select2($.extend(true, {minimumResultsForSearch:-1}, config.select2||{}));
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
			var result = SUI.Util.validate(validate, value);
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
			var result = SUI.Util.validate(validate, value);
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

			if(parseData.maxlength)
				maxlength = ' maxlength="'+parseData.maxlength+'"';
			var type = parseData.inputType;
			if(type==="text"){
				var template = '<input name="'+name+'"'+maxlength+' type="text" class="form-control" value="'+parseData.value+'" />';
	        }
	        if(type==="textarea"){
	        	var template = '<textarea name="'+name+'"'+maxlength+' rows="'+parseData.rows+'" class="form-control">'+parseData.value+'</textarea>';
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
				if(tip){
					$(dom).popover({
						html:true,
						content: tip,
						trigger:"manual",
						placement:"top",
						template: SUI.Util.popTpl.inp
					});
					$input.on('focusin', function(event) {
						$(dom).popover("show");
					}).on('focusout', function(event) {
						$(dom).popover("hide");
					});
				}
				placeholder&&$input.attr('placeholder', placeholder);
			}
			if(mode == "hide"){
				$(dom).hide();
			}
		}

        this.getValue = function(){
        	return $input.val();
        }

        this.setValue = function(val){
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
			var result = SUI.Util.validate(validate, value);
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
				var _notDate = isNaN(new Date(config.value).getDate());
				var opt = $.extend(true, {}, {
					startDate: _notDate ? moment() : moment(config.value),
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
			var result = SUI.Util.validate(validate, value);
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
			var suffix = '<div class="input-group-addon">'+
	                        '<i class="fa fa-calendar"></i>'+
	                      '</div>';
			var hasSuffix =" input-group date date-picker";
			var template = 		'<div class="item-col col-xs-5">'+
	                			'<div class="date-start'+hasSuffix+'">'+
				                      '<input type="text" class="form-control">'+
				                      suffix+
				                '</div></div>'+
				                '<div class="item-col col-xs-2 text-center">至</div>'+
				                '<div class="item-col col-xs-5">'+
				                '<div class="date-end'+hasSuffix+'">'+
				                     '<input type="text" class="form-control">'+
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
				var _startnotDate = isNaN(new Date(config.value[0]).getDate());
				var _endnotDate = isNaN(new Date(config.value[1]).getDate());
				var opt = $.extend(true, {}, {
		        	singleDatePicker:true,
					timePicker: $(dom).hasClass('datetime'),
					timePickerSeconds: /ss/.test(parseData.format),
					timePickerIncrement: parseData.minStep,
		        	locale: {
		        		format: parseData.format
		        	}
		        }, parseData.dateRange||{});
		        var startDate = moment(),
		        	endDate = moment();
		        	startDate = _startnotDate ? startDate : moment(config.value[0]);
		        	endDate = _endnotDate ? endDate : moment(config.value[1]);

				$(".date-picker.date-start", dom).daterangepicker($.extend(true, {}, opt, {
					startDate: startDate
				}));
		        $(".date-picker.date-end", dom).daterangepicker($.extend(true, {}, opt,{
					startDate: endDate
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
			
			$start.val(val[0]).trigger("change");
			$end.val(val[1]).trigger("change");
		}

		this.validate = function(){
			var mode = config.mode || 'view';
			if(mode != "editable"){
				return true;
			}
			var validate = config.validate;
			var result = SUI.Util.validate(validate, $start.val()) && SUI.Util.validate(validate, $end.val());
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
			var suffix = '<div class="input-group-addon">'+
	                        '<i class="fa fa-calendar"></i>'+
	                      '</div>';
			var hasSuffix =" input-group date-picker";
			var template = '<div class="'+hasSuffix+'">'+ 
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
				var vals = config.value.split(sep);
				var _start = SUI.Util.validDateStr(vals[0]);
				var _end = SUI.Util.validDateStr(vals[1]);
				var _startnotDate = isNaN(new Date(_start).getDate());
				var _endnotDate = isNaN(new Date(_end).getDate());
				var opt = $.extend(true, {}, {
					startDate: _startnotDate ? moment() : moment(_start),
					endDate: _endnotDate ? moment() : moment(_end),
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
			var result = SUI.Util.validate(validate, value);
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
		        if(parseData.inputTip){
		        	$(dom).popover({
						html:true,
						content: parseData.inputTip,
						trigger:"manual",
						placement:"top",
						template: SUI.Util.popTpl.inp
					});
					$input.on('focusin', function(event) {
						$(dom).popover("show");
					}).on('focusout', function(event) {
						$(dom).popover("hide");
					});
				}
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
			var result = SUI.Util.validate(validate, value);
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