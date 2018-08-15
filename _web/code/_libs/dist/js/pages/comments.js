/**
 * 
 * @authors Nat Liu (natcube@gmail.com)
 * @date    2016-05-25 15:37:08
 * @version 2016-05-25 15:37:08
 */

$(function(){

	$(".header-nav li").eq(1).addClass('cur');

	$("[data-toggle=countbar]").each(function(index, el) {
		$.SDM.countBar(el);
	});

	$("#comment-post").on("shown.bs.modal", function(){
		$("[data-toggle=stars]").each(function(index, el) {
			$.SDM.stars(el);
		});
	});

	$('#post-comment').on('click', function () {
		var _this = this;
		var _text = $(this).html();
	    $(this).html('提交中...');
	    setTimeout(function(){
	    	$(_this).html(_text);
	    	$("#comment-post").modal('hide');
	    },1000);

	})
})