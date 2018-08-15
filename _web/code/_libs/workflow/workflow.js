(function(prefer){
	var ctx = function(){
		var _this = this;
		var initConfig = {
			"workItemId": "",
			"process": "",
			"entityType": "",
			"loadWorkFlowBiz": "com.sudytech.portalone.base.workflow.queryWorkFlow.biz.ext",
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
			if(!initConfig.workItemId && !initConfig.process){
				this.initUI(callback);
				return;
			}
			this.loadWorkFlow(function(){
				_this.loadEntity(function(){
					_this.initUI(callback);
				});
				
			});
		};
		
		//加载流程
		this.loadWorkFlow = function(callback){
			var biz = initConfig.loadWorkFlowBiz;
			$.ajax({
				type: 'POST',
				url: biz,
				data: jsonString({workItemId: initConfig.workItemId, process:initConfig.process}),
				contentType: "text/json",
				success: function(data) {
					_this.workflow = data;
					if(callback) callback(data, _this);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
		};
		
		//初始化ui界面
		this.initUI = function(callback){
			
			//初始化下一步
			var actions = this.workflow.nextAcitivities;
			var select = $(".wf-actions");
			select.html(" ");
			actions = actions || [];
			for(var i = 0; i < actions.length; i++){
				 select.append("<option value='"+actions[i].id+"'>"+actions[i].name+"</option>");
			}
			select.change();
			
			$(".wf-title").text(wf.workflow.activity.name);
			
			//初始化字典
			var dictTypes = [];
			var dicts = $(".wf-dict").each(function(i){
				dictTypes[i] = $(this).attr("wf-type");
			});
			if(dictTypes.length){
				$.ajax({
					async: false,
					type: 'POST',
					url: "com.sudytech.portalone.base.ui.queryDict.biz.ext",
					data: jsonString({dictTypes: dictTypes}),
					contentType: "text/json",
					success: function(data) {
						var options = data.options;
						dicts.each(function(){
							var e = $(this);
							e.html('<option value="">请选择</option>');
							var type = e.attr("wf-type");
							for(var i = 0; i < options.length; i++){
								if(options[i].type == type){
									e.append("<option value='"+options[i].VALUE+"'>"+options[i].NAME+"</option>");
								}
							}
						});
					}
				});
			}
			
						
			//回填数据
			var entity = this.entity;
			var form = $("#" + initConfig.form);
			for(var name in entity){
				form.find("[name='"+name+"']").val(entity[name]);
			}
			
			//设置ui属性
			var extAttrs = parseAttr(this.workflow.acitityExtAttrs);
			var hide = extAttrs.hide;//隐藏
			if(hide){
				var hides = hide.split(",");
				for(var i = 0; i < hides.length; i++){
					$("#" + hides[i]).hide();
				}
			}
			var editable = extAttrs.editable//可编辑
			if(editable){
				editables = editable.split(",");
				for(var i = 0; i < editables.length; i++){
					var name = editables[i];
					if(!name) continue;
					var input = form.find("[name='"+name+"']");
					input.removeAttr("readOnly");
					if(input.length > 0 && input.get(0).tagName.toUpperCase() == "SELECT"){
						input.removeAttr("disabled");
					}
				}
			}			
			if(callback) callback(this);
		};
		
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
					_this.entity.__type = data.type;
					if(callback) callback(data, _this);
				},
				error: function(msg){
					if(callback) callback({Exception: msg});
				}
			});
		};
		//将form转换为json实体，如果type为空，则不绑定实体
		this.toDataJson = function(type,formId){
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
				relativeData: {} //相关数据
			}
		*/
		this.startWorkFlow = function(params, callback){
			params.process = params.process || initConfig.process; 
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
				workItemId:1, //工作项id
				opinion: {}, //意见
				shareSigns: {"signs": {key: 'userId', value: ""}}, //格式：{会签字段名：{key: 会签key, value: 会签数据}}
				mode: "override"  // 覆盖模式还是修改模式 override || update, 默认是update
			}

		*/
		this.finishWorkItem = function(params, opinionList, callback){
			params.workItemId = params.workItemId || initConfig.workItemId;
			params.mode = params.mode || "update";
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
			for(var i in opinionList){
				if(params.updateProperties.indexOf(opinionList[i])!=-1){
					var key = opinionList[i];
					var opinionStr = params.entity[opinionList[i]];
					try{
						var t = JSON.parse(opinionStr);
						if(t['opinion']){
							params.opinion={
									dealOpinion: t['opinion'],
									dealResult: ""
							}
						}else{
							var hq="";
							for(user in t){
								hq += t[user].userName + ":" +  t[user].opinion +";"
							}
							params.opinion={
									dealOpinion: hq,
									dealResult: ""
							}
						}

					}catch(e){
						params.opinion={
								dealOpinion: params.entity[opinionList[i]],
								dealResult: ""
						}
				  }

				}
			}

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
	
	window[prefer||"wf"] = new ctx();
})();