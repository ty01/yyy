(function($, SDM) {
//  $(".btn-box-tool").click(function() {
//    var _this=this;
//    if($(_this).find("i").hasClass('fa-minus')){
//      $(_this).find("i").removeClass('fa-minus');
//      $(_this).find("i").addClass('fa-plus')
//    }else{
//      $(_this).find("i").addClass('fa-minus');
//      $(_this).find("i").removeClass('fa-plus')
//    }
//  });

  /**
   * sortable
   * @return {[type]} [description]
   */
  function getAppInstallInfos() {
    //应用排序
    $(".appDiv").sortable({
      placeholder: "move_cls",
      cursor: "move",
      update : function(event, ui){
    	  var ids=$(this).sortable("toArray");
    	  var target=ui.item.attr("id");
    	  var bourn =0;
    	  for(var i=0;i<ids.length;i++){
    		  if(ids[i]==target &&i !=0){
    			  bourn=ids[i-1];
    		  }
    	  }
    	  $.ajax({
   	   		  type:"POST",
   	   		  data:{target:target,bourn:bourn},
   	   		  url:saveMyFavoriteAppsSort,
   	   		  dataType:"json",
   	   		  success:function(data){
   	   			  parent.initfavorites();
   	   			if(data.result==0){
   	   				alert(data.reason);
   	   			  }
   	   		  }
   	   });
      }
    });
    $(".appDiv").disableSelection();
  };
  getAppInstallInfos();

})(jQuery, $.SDM);

(function($,SDM){
  console.log($("#tab_1").width(),$("#tab_1").innerWidth(),$("#tab_1").outerWidth());
  var $width =0,$outerWidth=0,parentWidth=parseInt($("#tab_1").width()/100);
  $.each($(".z-app-first-shfw-row li"), function(index, item) {
    $width+=$(item).width();
    $outerWidth+=$(item).outerWidth();
  });
  console.log($width,$outerWidth,parentWidth);

  /*$(window).resize(function(){
    console.log($("#tab_1").width());
  });*/
})(jQuery,$.SDM);
