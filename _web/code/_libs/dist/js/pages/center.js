/**
 * 
 * @authors Nat Liu (natcube@gmail.com)
 * @date    2016-05-24 13:33:56
 * @version 2016-05-24 13:33:56
 */

$(function(){

	$(".center-list .box").hover(function() {
		$(this).addClass('hover').siblings().removeClass('hover');
	}, function() {
		$(this).removeClass('hover');
	});

	$(".header-nav li").eq(1).addClass('cur');

})