/**
 * 
 * @authors Nat Liu (natcube@gmail.com)
 * @date    2016-05-24 14:33:42
 * @version 2016-05-24 14:33:42
 */

$(function(){

	$('.addon-favs').on('click',function(event) {
		event.preventDefault();
		$('.favs',this).toggleClass('favsed');
		var tip = "收藏";
		if($('.favs',this).hasClass('favsed')){
			tip = "已收藏";
		}
		$("span", this).html(tip);

	});

	$(".header-nav li").eq(1).addClass('cur');

})