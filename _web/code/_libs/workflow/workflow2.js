(function(prefer){
	var ctx = function(){
		var _this = this;
		var initConfig = {
			"workItemId": "",
			"process": "",
			"entityType": "",
			"loadWorkFlowBiz": "com.sudytech.portalone.base.workflow.queryEnv.biz.ext",
			"loadEntityBiz": "com.sudytech.portalone.base.workflow.queryEntityByWorkItemId.biz.ext",
			"startWorkFlowBiz": "com.sudytech.portalone.base.workflow.start.biz.ext",
			"finishWorkItemBiz": "com.sudytech.portalone.base.workflow.finishWorkItem.biz.ext",
			"form": "form"
		};
		
		this.workflow = {};
		this.entity = {};
		
		//初始化
		this.init = function(config, callback){
			initConfig = config ? $.extend(initConfig, config) : initConfig;
			if(!initConfig.workItemId && !initConfig.process && !initConfig.processInstId){
				this.initUI(callback);
				return;
			}
			this.loadWorkFlow(function(){
				_this.initUI(callback);
			});
		};
		
		//加载流程
		this.loadWorkFlow = function(callback){
			var biz = initConfig.loadWorkFlowBiz;
			$.ajax({
				type: 'POST',
				url: biz,
				data: jsonString({workItemId: initConfig.workItemId, process:initConfig.process, processInstId:initConfig.processInstId}),
				contentType: "text/json",
				success: function(data) {
					_this.workflow = data.data;
					_this.entity = data.data.entity || {};
					buildTree(_this.workflow.activityTree);
					if(callback) callback(data, _this);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
			function buildTree(tree){
				if(!tree){
					return;
				}
				if(tree.children){
					for(var i = 0; i < tree.children.length; i++){
						var node = tree.children[i];
						node.parent = tree;
						buildTree(node);
					}
				}
			}
		};
		
		//初始化ui界面
		this.initUI = function(callback){
			var userObject = this.workflow.userObject;
			SUI.Util.context.user = userObject;
			//初始化字典
			var dictTypes = [];
			var dicts = $(".wf-dict").each(function(i){
				dictTypes[i] = $(this).attr("wf-type");
			});
			if(dictTypes.length){
				$.ajax({
					type: 'POST',
					url: "com.sudytech.portalone.base.ui.queryDict.biz.ext",
					data: jsonString({dictTypes: dictTypes}),
					contentType: "text/json",
					success: function(data) {
						var options = data.options;
						dicts.each(function(){
							var e = $(this);
							var dataSource = [];
							var type = e.attr("wf-type");
							for(var i = 0; i < options.length; i++){
								if(options[i].type == type){
									dataSource[dataSource.length] = {value:options[i].value, name: options[i].name};
									continue;
								}
								if(options[i].TYPE == type){//oracle字段为大写
									dataSource[dataSource.length] = {value:options[i].VALUE, name: options[i].NAME};
								}
							}
							if(this.zoo){
								var config = this.zoo.getConfig();
								config.properties.dataSource = dataSource;
								this.zoo.setConfig(config);
							}
						});
					}
				});
			}
			
			var form = $("#" + initConfig.form);
			
			//设置ui属性
			var extAttrs = this.workflow.activityExt? this.workflow.activityExt.attrs : {};
			
			var editable = extAttrs.editable;//可编辑
			if(editable){
				editables = editable.split(",");
				$.each(editables,function(i, name){
					if(!name) return;
					var com = form.find("[name='"+name+"']");
					com.attr("mode", "editable");
				});
			}
			var hide = extAttrs.hide;//隐藏
			if(hide){
				var hides = hide.split(",");
				for(var i = 0; i < hides.length; i++){
					$("#" + hides[i]).hide();
				}
				$.each(hides, function(i, name){
					var com = $("[name='"+name+"']");
					if(com.sui()){
						com.attr("mode", "hide");
					}else{
						com.hide();
					}
				});
			}
			if(initConfig.processInstId){
				var ext = this.workflow.processDefExt.attrs || {};
				hide = ext.previewHide;//隐藏
				$("#selectParticipatesDiv").hide();
				$("#post").hide();
				if(hide){
					var hides = hide.split(",");
					for(var i = 0; i < hides.length; i++){
						$("#" + hides[i]).hide();
					}
					$.each(hides, function(i, name){
						var com = $("[name='"+name+"']");
						if(com.sui()){
							com.attr("mode", "hide");
						}else{
							com.hide();
						}
					});
				}
			}
			if(this.workflow.activity){
				$(".wf-title").text(" >> " + this.workflow.activity.name);
			}
			var entity = $.extend(true, {}, this.entity);
			SUI.init(function(){
				//回填数据
				if(callback) callback(entity,function(data){
					form.sui().setValue(data);
					var workItem = _this.workflow.workItem ||{};
					//初始化下一步
					var activityTree = _this.workflow.activityTree;
					var partis = $(".sui-participates").sui();
					partis && activityTree && partis.setConfig({
						tree: activityTree, 
						process: workItem.processDefName, 
						processInstId: workItem.processInstID
					});
					
				});
			});
		};

		
		/**
		*   动态创建一个或者多个与流程相关的sui控件。可以由流程控制其状态。
		*  调用方法：
		*	var sInput = wf2.suiBuild('<div class="sui-input" name="testName" validate="{require:true}"></div>');
		*   sInput.sui().setValue('222');
		*  
		**/
		this.suiBuild=function(html){//任意html
			var extAttrs = this.workflow.activityExt? this.workflow.activityExt.attrs : {};
			var $div =  $(html);
			var editable = extAttrs.editable;//可编辑
			if(editable){
				editables = editable.split(",");
				$.each(editables,function(i, name){
					if(!name) return;
					var com = $div.find("[name='"+name+"']");
					com.attr("mode", "editable");
				});
			}
			var hide = extAttrs.hide;//隐藏
			if(hide){
				var hides = hide.split(",");
				for(var i = 0; i < hides.length; i++){
					$("#" + hides[i]).hide();
				}
				$.each(hides, function(i, name){
					var com = $("[name='"+name+"']", $div);
					if(com.sui()){
						com.attr("mode", "hide");
					}else{
						com.hide();
					}
				});
			}
			SUI.init(null, $div);
			return $div;
		}
		
		//根据流程实例id 加载数据实体
		this.loadEntity = function(callback){
			var biz = initConfig.loadEntityBiz;
			$.ajax({
				type: 'POST',
				url: biz,
				data: jsonString({workItemId: initConfig.workItemId, process: initConfig.process}),
				contentType: "text/json",
				success: function(data) {
					_this.entity = data.entity;
					if(callback) callback(data, _this);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
		};
		//将form转换为json实体，如果type为空，则不绑定实体
		this.toDataJson = function(type, formId){
			var data = {};
			if(type){
				data.__type = "sdo:" + type;
			}else{
				data.__type = "sdo:" + "com.sudytech.portalone.base.dataset.FormEntity";
			}
			formId = formId || initConfig.form;
			var arry = $("#" + formId).serializeArray();
			for(var i = 0; i < arry.length; i++){
				data[arry[i].name] = arry[i].value;
			}
			return data;
		};
		
		//启动工作流 entity 实体, process 流程, relativeData 相关数据, callback 回调方法
		/*
		  启动工作流
			params{
				entity: {}, //实体
				process: "",
				title: "",
				desc: "",
				relativeData: {}, //相关数据
				aferRelData:{}, //启动工作流之后设置的相关数据
				entityNO: {}
			}
		*/
		this.startWorkFlow = function(params, callback){
			params.process = params.process || initConfig.process; 
			params.entity.__type = "sdo:com.sudytech.portalone.base.dataset.FormEntity";
			params.entityNO = params.entityNO || {};
			var exts = SUI.Util.parseJSON(params.entity._ext);
			for(var name in exts){
				var ext = exts[name];
				if(ext.type == "sequence"){
					params.entityNO.type = ext.value;
					params.entityNO.field = name;
				}
			}
			var post = jsonString(params);
			var biz = initConfig.startWorkFlowBiz;
			$.ajax({
				type: 'POST',
				url: biz,
				data: post,
				contentType: "text/json",
				success: function(data) {
				  if(callback) callback(data);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
		};
		
		/*
		 完成工作项
			params {
				entity:{}, //实体
				relativeData:{}, 相关数据
				aferRelData:{}, //完成工作项之后设置的相关数据
				workItemId:1, //工作项id
				opinion: {}, //意见
				shareSigns: {"signs": {key: 'userId', value: ""}}, //格式：{会签字段名：{key: 会签key, value: 会签数据}}
				mode: "override"  // 覆盖模式还是修改模式 override || update, 默认是update
			}

		*/
		this.finishWorkItem = function(params, callback){
			params.workItemId = params.workItemId || initConfig.workItemId;
			params.mode = params.mode || "update";
			params.entity.__type = "sdo:com.sudytech.portalone.base.dataset.FormEntity";
			if(params.mode == "update"){
				var updateProperties = [];
				for(var name in this.entity){
					if(name == "__type"){
						continue;
					}
					if(!compare(this.entity[name], params.entity[name])){
						updateProperties[updateProperties.length] = name;
					}
				}
				params.updateProperties = updateProperties;
			}
			//
			params.opinion = params.opinion || {};
			params.shareSigns = params.shareSigns || {};
			var exts = SUI.Util.parseJSON(params.entity._ext);
			$.each(params.updateProperties, function(i, name){
				var ext = exts[name];
				if(!ext){
					return;
				}
				if(ext.type =="multiOpinion"){
					params.shareSigns[name] = ext.value;
					params.opinion.dealOpinion = ext.value.value.opinion;
					return;
				}
				if(ext.type == "opinion"){
					params.opinion.dealOpinion = ext.value.opinion;
				}
			});

			var biz = initConfig.finishWorkItemBiz ;
			var post = jsonString(params);
			$.ajax({
				type: 'POST',
				url: biz,
				data: post,
				contentType: "text/json",
				success: function(data) {
				   if(callback) callback(data);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
		};
		this.jsonString = jsonString;
		this.merge =function(data){
			var temp = $.extend({}, this.entity);
			return $.extend(temp, data);
		}
		
		function jsonString(data){
			return JSON.stringify(data);
		}
		
		//比较是否相等
		function compare(v1, v2){
			v1 = v1 || "";
			v2 = v2 || "";
			return v1 == v2;
		}
		
		function parseAttr(attr){
			if(!attr){
				return {};
			}
			var xml = $.parseXML(attr);
			var doc = $(xml);
			var data = {};
			try{
				doc.find("extendNode").each(function(){
					var item = $(this);
					var key = item.find("key").text();
					var value = item.find("value").text();
					data[key] = value;
				});
			}catch(e){
				console.log(e);
			}
			
			return data;
		}
	};
	
	window[prefer||"wf2"] = new ctx();
})();