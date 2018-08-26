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
						$(this).parents('li.haschild').removeClass('closed')
					}
				});
			}

			_this.bindEvent()

		}

		this.init()
	}
	window.Tree=Tree
})()