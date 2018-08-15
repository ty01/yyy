/*
机构人员公共页面
用法：在需要显示页面的button，input，textarea等加上 data-toggle="modal" data-target="#people-selector"   这两个属性
格式要求，在这个属性的前面要有<input type="hidden" value="" id="">传参，有一个textarea或者input type=text 显示名称
返回参数格式：[{"RYGH":"人员工号","RYID":"人员ID","BMID":"部门ID","BMMC":"部门名称","RYMC":"人员名称"},{"RYGH":"","RYID":"","BMID":"","BMMC":"","RYMC":""}...]

*/

var basePath = "/default/base/";
document.write('<link href="' + basePath + '_libs/plugins/iCheck/all.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + basePath + '_libs/plugins/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + basePath + '_libs/plugins/iCheck/icheck.js"></script>');
document.write('<script src="' + basePath + '_libs/plugins/zTree/js/jquery.ztree.all.js"></script>');
$(function(){
	var cont = '<div class="modal fade bs-example-modal-lg" id="people-selector" tabindex="-1" role="dialog" aria-labelledby="people-selector-title" data-backdrop="static">\
	  <div class="modal-dialog modal-lg" role="document">\
		<div class="modal-content">\
		  <div class="modal-header">\
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
			<h4 class="modal-title" id="people-selector-title">选择人员</h4>\
		  </div>\
		  <div class="modal-body">\
				<div class="row">\
					<div class="col-md-4">\
					  <div class="box box-solid">\
						<div class="box-header with-border">\
						  <i class="glyphicon glyphicon-object-align-left"></i>\
						  <h3 class="box-title">选择机构</h3>\
						</div>\
						<div class="box-body">\
						   <div class="form-group">\
							   <input type="text" id="ssry" class="form-control" placeholder="搜索人员">\
						   </div>\
						   <ul id="people-selector-tree" class="ztree" style="overflow:auto;max-height: 300px;">加载中...</ul>\
						</div>\
					  </div>\
					</div>\
					<div class="col-md-4">\
					  <div class="box box-solid">\
						<div class="box-header with-border">\
						  <i class="glyphicon glyphicon-object-align-left"></i>\
						  <h3 class="box-title">待选人员</h3>\
						</div>\
						<div class="box-body">\
						   <div id="people-selector-unselected" style="overflow:auto;max-height: 349px;">\
						   </div>\
						</div>\
					  </div>\
					</div>\
					<div class="col-md-4">\
					  <div class="box box-solid">\
						<div class="box-header with-border">\
						  <i class="glyphicon glyphicon-object-align-left"></i>\
						  <h3 class="box-title">已选人员</h3>\
						</div>\
						<div class="box-body">\
						   <div id="people-selector-selected" style="overflow:auto;max-height: 349px;">\
						   </div>\
						</div>\
					  </div>\
					</div>\
				</div>\
		  </div>\
		  <div class="modal-footer">\
			<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>\
			<button type="button" name="RYSubmit" class="btn btn-primary">确定</button>\
		  </div>\
		</div>\
	  </div>\
	</div>';
	$('body').append(cont);
	$('button[name="RYSubmit"]').on('click',function(){
		getSelectPeople();
	});
	addTree();//增加机构人员树数
	$("#ssry").blur(function(){//查询人员
		getPeopleByKeyWord();
	});
	
	function selectPeople(obj){//点击人员将人员移到已经选择人员
		var value = $(obj).attr('data-value');
		var s=value.split("+");
		var id=s[1];
		$(obj).remove();
		if($("#people-selector-selected #"+id).length==0){
			$("#people-selector-selected").append(obj);
		}
		$('#people-selector-selected button[name="DXRY"]').on('click',function(){
				selectPeopleByRight(this);
		});
	}
	
	function selectPeopleByRight(obj){//点击人员将人员移到已经选择人员
		var value = $(obj).attr('data-value');
		var s=value.split("+");
		var id=s[1];
		$(obj).remove();
		if($("#people-selector-unselected #"+id).length==0){
			$("#people-selector-unselected").append(obj);
		}
		$('#people-selector-unselected button[name="DXRY"]').on('click',function(){
				selectPeople(this);
		});
	}
	function getSelectPeople(){//点击确定将人员放入textarea下
		var obj = $("#people-selector-selected button");
		var names = '';
		var jsonList = new Array();
		for(var i=0;i<obj.length;i++){
			var value=$(obj[i]).attr('data-value');
			var shuzu=value.split("+");
			var json = {};
			json.RYGH = shuzu[0];
			json.RYID = shuzu[1];
			json.BMID = shuzu[2];
			json.BMMC = shuzu[3];
			json.RYMC = shuzu[4];
			jsonList.push(JSON.stringify(json));
			names += shuzu[4]+',';
		}
		if(names.length > 0){
			names = names.substring(0,names.length-1);
		}
		var $button = $("button", event.relatedTarget); // 获取触发元素
		var $parent = $button.parent();
		if($parent.find('textarea')){
			$parent.find('textarea').html(names);
		}
		if($parent.find('input[type="text"]')){
			$parent.find('input[type="text"]').val(names);
		}
		if($parent.find('input[type="hidden"]')){
			$parent.find('input[type="hidden"]').val("["+jsonList+"]");
		}
		
		$("#people-selector-selected").html("");
		$("#people-selector-unselected").html("");
		
		$('#people-selector').modal('hide');
	}
	function getPeopleByKeyWord(){//查询人员
		var keyword=$.trim($("#ssry").val());
		if(keyword!=""){
			$.ajax({
		type: "POST",
		url: "com.sudytech.portalone.base.db.queryBySql.biz.ext",
		data: wf.jsonString({
			pagecond:{isCount:false,length:50},
			params :{keyword:keyword},
			permission : "ALL",
			scope : "ALL",
			querySqlId:"com.sudytech.portalone.base.util.queryEmployeeByParams"

		}),
		contentType: "text/json",
		success: function(data){
			var html="";
			$.each(data.list, function(index, val) {
				var value=""+val.EMPCODE+"+"+val.EMPID+"+"+val.OID+"+"+val.ORGNAME+"+"+val.EMPNAME+"";
				html+="<button class='btn btn-default btn-block' id='"+val.EMPID+"' name='DXRY' data-value='"+value+"'>"+val.EMPNAME+"</button>";
			});
			$("#people-selector-unselected").html(html);
			
			$('button[name="DXRY"]').on('click',function(){
				selectPeople(this);
			});
		}
		});
		}
		
	}
	
	function getTreePeople(treeId, treeNode, clickFlag){//获得机构下的人员
		$.ajax({
		type: "POST",
		url: "com.sudytech.portalone.base.db.queryBySql.biz.ext",
		data: wf.jsonString({
			pagecond :{isCount:false,length:1000},
			permission : "ALL",
			scope : "ALL",
			params :{orgId :treeNode.id},
			countSqlId : "com.sudytech.portalone.base.role.role.queryEmployeeByOrgSql",
			querySqlId : "com.sudytech.portalone.base.role.role.queryEmployeeByOrgSql"

		}),
		contentType: "text/json",
		success: function(data){
			var html="";
			$.each(data.list, function(index, val) {
				var value=""+val.EMPCODE+"+"+val.EMPID+"+"+treeNode.id+"+"+treeNode.name+"+"+val.EMPNAME+"";
				html+="<button class='btn btn-default btn-block' id='"+val.EMPID+"' name='DXRY' data-value='"+value+"'>"+val.EMPNAME+"</button>";
			});
			$("#people-selector-unselected").html(html);
			
			$('button[name="DXRY"]').on('click',function(){
				selectPeople(this);
			});
		}
		});
	}
	
	
	function addTree(){
		
		$("#people-selector-selected").html("");
		$("#people-selector-unselected").html("");
			var setting = {
			async: {
			enable: true,
			url: 'com.sudytech.portalone.base.role.role.queryOrgByParentId.biz.ext',
			autoParam:["id"],
			dataFilter:function(treeId, parentNode, responseData){
				var out = [];
				$.each(responseData.list, function(index, val) {
				
					out.push({
						name: val.ORGNAME,
						id: val.ORGID,
						isParent: "true"
					})
				});
				return out;
			}
			},
			callback: {
					beforeClick: getTreePeople
			}
			};
	var zNodes =[
		
	];
	$.fn.zTree.init($("#people-selector-tree"), setting, zNodes);
		
	}
});
	
	
