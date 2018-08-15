;(function(){
	$(".box").height($(document).height())
	
	function bindEvent(){
		$(".send").on("click",function(){
			var phone=$("#phone").val();
			// console.log(phon)
			if(parseInt(phone).toString().length!=11){
				return alert("请输入11位手机号码")
			}
			$.ajax({
				url:"http://yyyhyt.jia86.cn:81/auth/registersms",
				type:"post",
				dataType:"json",
				"contentType": "application/json; charset=utf-8",
				data:JSON.stringify({
					phone_num:phone
				}),
				success:function(data){
					console.log(data)
					if(data.api_errorcode==0){
						alert("发送成功")
					}else{
						alert("发送成功，但是"+data.api_message)

					}
				},
				error:function(){
					alert("系统错误，请联系管理员")
				}
			})

		})
	}

	function run(){
		bindEvent()
	}
	run()
})()