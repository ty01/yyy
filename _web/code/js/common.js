var totalSize = 0;
;(function(){
	function Tree(json){//下拉树插件
		var _this=this

		this.creatdom=function(data){//拼接dom
			var html='<ul class="tree">'
            for (var i = 0; i < data.length; i++) {
                var item=data[i];
                html += '<li data-id="'+item.id+'" class="'+(item.children?"haschild":"nochild")+' closed"><span class="tree_name">'+item.name +'</span>'
                if(item.children){
                    html += _this.creatdom(item.children)
                }
                html +='</li>'
            }
            html += '</ul>'
            return html
		}

		this.getfirst=function($dom){
			if($dom.hasClass('haschild')){
				return _this.getfirst($dom.children('ul:first-of-type').children("li:first-of-type"))
			}else{
				return $dom.data("id")
			}
		}

		this.bindEvent=function(){
			$(document).on("click",".tree li.haschild .tree_name",function(){
				json.callback($(this).parent('li').data("id"))
			})


			$(document).on("click",".tree li",function(e){
				e.stopPropagation();
				e.preventDefault();
				$(".tree li").removeClass('checked')
				$(this).addClass('checked')

				if($(this).hasClass('haschild')){
					if($(this).hasClass('closed')){
						$(this).removeClass('closed').siblings('li').addClass('closed')
					}else{
						$(this).addClass('closed')
					}
				}
			})
		}

		this.init=function(){
			var html=_this.creatdom(json.data)
			$(json.dom).html(html)//渲染dom


			if(json.chected || json.checkedfirst){//默认打开的
				if(json.chected){
					var id=json.chected
				}else{
					var id=_this.getfirst($(json.dom).children('.tree').children('li:first-of-type'))
				}
				$(".tree li").each(function(index, el) {
					if($(this).data("id")==id){
						$(this).addClass('checked').parents('li.haschild').removeClass('closed')
					}
				});
			}

			_this.bindEvent()

		}

		this.init()
	}
	var commom={
		url:{
        },
		//jquery ajax
		getAjax:function(options){
            if(options.data){
                for(var i in options.data) {
                    if ((typeof options.data[i]=='string') && options.data[i].constructor==String) {
                        options.data[i] = options.data[i].replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); //过滤脚本攻击
                    }
                }
            }
			var settings = {
				type:'get',
				dataType: "json",
				success: function (data) {
                    console.log(data);
                },
                error: function (xhr, erroType, error, msg) {
                    layer.alert('接口暂时不能访问，请联系管理员！');
                }
			}
			var opt = $.extend(true, settings, options);
			$.ajax(opt)
		},
		//初始化表格
		creatTable:function(el,options){
			var _parameter = options['param'] || function(){
                return {};
            };
			var settings={
				"bProcessing": true,
                "lengthChange": false, // 选择设置每页显示多少条
                "searching": false,
                "ordering": false,
                "autoWidth": true,
                "bServerSide": true,
                "info": true,
                "numbers_length": 3,
                "sScrollX": true, // 设置允许出现横向滚动条
                "iDisplayLength": 10, // 每页显示多少条，默认10
                "destroy": true,
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) { // 每行渲染后的回调,一般用于绑定事件
                    var table = this;
                    $("[data-toggle]", nRow).on('click', function (event) {
                        event.preventDefault();
                        fnMsg[$(this).data("toggle")](table, aData);
                    });
                },
                "fnDrawCallback": function (oSettings) { // 表格渲染完成回调
                    var table = this;
                    // 多选
                    var twrap = oSettings.nTableWrapper;
                    SUI.init();
                    $("input[type='checkbox'].check-all").prop("checked", false);
                    $("input[type=checkbox]", twrap).iCheck({
                        checkboxClass: 'icheckbox_minimal-blue',
                        radioClass: 'iradio_minimal-blue'
                    }).on("ifChecked", function () {
                        if (this.value === "-1") {
                            $("input[type=checkbox]", twrap).iCheck("check");
                        }
                    }).on("ifUnchecked", function () {
                        if (this.value !== "-1") {
                            $("input.check-all", twrap).iCheck("uncheck");
                        } else {
                            $("input[type=checkbox]", twrap).not(".check-all").iCheck("uncheck");
                        }
                    });
                },
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) { // 数据过滤处理，以符合datatables要求
                    var table = this;
                    var _aoData = {}; // 过滤 dataTables 原始参数
                    $.each(aoData, function (index, val) {
                        _aoData[val.name] = val.value;
                    });
                    var sortFiled = _aoData['mDataProp_' + _aoData.iSortCol_0];
                    // 接口入参
                    var params = _parameter();
                    params.length = _aoData.iDisplayLength;
                    params.totalSize = totalSize;
                    params.begin = Math.ceil(_aoData.iDisplayStart / _aoData.iDisplayLength) * _aoData.iDisplayLength;
                    oSettings.jqXHR = $.ajax({
                        dataType: 'json',
                        type: 'get',
                        "timeout": 30000,
                        "url": sSource,
                        "data": params,
                        "success": function (data) {  // 过滤接口返回的数据，处理成符合datatable格式
                            var othe={
                                iTotalRecords: 0, // 总数
                                iTotalDisplayRecords: 0  // 过滤后总数
                            }
                            
                            othe.iTotalRecords=data.total
                            othe.iTotalDisplayRecords=data.total
                            
                            $.extend(true, data,othe);
                            try{
                                totalSize=data.total;
                                if (data === undefined) {
                                    data = [];
                                }
                            }catch(err){
                                console.log("出错啦")
                            }
                            fnCallback(data);
                        },
                        error: function (err) {
                            console.log(err)
                        },
                        complete: function (r, s) {
                            if (s === 'timeout') {
                                parent.layer.msg('请求已超时！', {time: 2000})
                            }
                        }

                    });
                }
			}
			var opt = $.extend(true, settings, options);
            return $(el).DataTable(opt);
		},
		//获取地址栏参数
		getQueryString:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null){
            	return unescape(r[2]);
            }
            return null;
        },
        getLayer: function (options) {      //layer方法  弹出ifram
            var settings = {
                type: 2,
                title: '标题',
                shadeClose: true,
                scrollbar:false,
                shade: 0.4,
                area: ['800px', '600px'],
                move:false,
                
            };
            var opt = $.extend(true, settings, options);
            layer.open(opt)
        },
        getSelectdId : function(type){ // 获取选中id   type=1 是删除  type=2是修改
            var arr = [];
            $('.icheckbox_minimal-blue.checked').find('input:checked').each(function () {
                if ($(this).val() != -1) {
                    arr.push($(this).val()*1);
                }
            });
            if(arr.length == 0) {
                layer.alert("请选择一条数据");
                return false;
            }
            if(type == 2){
                if(arr.length>=2){
                    layer.alert('该操作只能选择一条数据，请重新选择！')
                    return false;
                }
                return arr[0];
            } 
            if(type == 1){
                return JSON.stringify(arr);
            }
        },
        choosedepart:function(){
            var domm=parent.U.getLayer({
                title:"选择部门",
                content:"choosedepart.html",
                area:["710px","540px"]
            })
            return domm
        }
	}
	window.Tree=Tree;
	window.U = commom;
})()