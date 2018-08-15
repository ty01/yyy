$(function() {
	initCalendar();
	initTeachingWeeksInfo();
/*	 //获取日历左边的数字日期
	var dayNum = $("h3.box-title").html();
	console.log("当前日期： "+dayNum);
	var click = '<a href="javascript:retsetWeek()">'+dayNum+'</a>';
	console.log("当前事件： "+click);
	 $("h3.box-title").html(click);*/
});
// 初始化日历
function initCalendar() {
	$("#sudyclndr").sudyclndr({
		lunar : true,
		lunarAlign : "left"
	});
}
// 初始化校历、日程、记事、课程
var termStart = ""; var termEnd = "";  var termHoliday = "";// 本学期的相关信息
var totalZc=0;// 学期总共的教学周次
function initTeachingWeeksInfo(){
	layer.load();
	var xn = "";var xq = ""; var zc = "";
	var curStart = ""; var curEnd = ""; var curHoliday = "";// 当前周的相关信息
	getSchoolCalendar().done(function(cal){
		if(cal == "" || cal == null){
		//	layer.msg("获取教学周数据出错！");
			layer.closeAll("loading");
		}else{
			if(cal.isjxz){// 是教学周
				xn = cal.xn; xq = cal.xq; zc = cal.zc;
				 $(".clndr-select-lunar").html('第'+zc+'教学周')
				var lst = cal.lis;
				if(lst == null){
			//		layer.msg("获取教学周详细信息出错！");
					layer.closeAll("loading");
				}else{
					termStart = lst[0].QSRQ; termEnd = lst[lst.length - 1].JSRQ;
					curStart = lst[zc].QSRQ; curEnd = lst[zc].JSRQ; curHoliday = lst[zc].JJR;// 本周的起、始日期和节假日信息
					var str = "";
					for(var i = 0; i < lst.length; i++){//每周的信息
						termHoliday += lst[i].JJR;
						str+='<li><a href="javascript:selectTeachingWeek(\''+lst[i].QSRQ+'\','+'\''+lst[i].JSRQ+'\','+'\''+lst[i].JJR+'\','+'\''+lst[i].ZC+
						     '\','+'\''+curStart+'\','+'\''+curEnd+'\','+'\''+zc+'\','+'\''+lst[i].XN+'\','+'\''+lst[i].XQ+'\',\''+xn+'\')">'+'第'+lst[i].ZC+'教学周</a></li>';
					}
					$("#selectOpt").html(str);	
    	    	}
    	    	$(".dropdown-toggle").css("display","");
    	    	$("#schoolYear").html(xn);
    	    	var span = '<span class="fa fa-caret-down"></span>';
    	    	$("#wText").html('第'+zc+'教学周'+span);
    	    	/*****************************************横向切换周次****************************************************/
    	    	totalZc = lst.length-1;// 本学期教学周的总周次
    	    	$("#preWeek").attr('onclick',"gotoPreWeek("+zc+")").css('display','inline-block');
    	    	$("#nextWeek").attr('onclick',"gotoNextWeek("+zc+")").css('display','inline-block');
    	    	/*****************************************横向切换周次****************************************************/
    	    	layer.closeAll("loading");
			}else{
				/*****************************************横向切换周次****************************************************/
				 $("#preWeek").removeAttr('onclick').css('display','none');
    	    	 $("#nextWeek").removeAttr('onclick').css('display','none');
    	    	 /*****************************************横向切换周次****************************************************/
				 var nowMonth = (parseDate(selectDay)).getMonth() + 1;
				 nowMonth=nowMonth.toString();
		//		 console.log("nowMonth="+nowMonth);
				 if(nowMonth=='1' || nowMonth=='2' || nowMonth=='3'){
					 $(".clndr-select-lunar").html('寒假');
				 }
				 if(nowMonth=='6' || nowMonth=='7' || nowMonth=='8' || nowMonth == '9'){
					 $(".clndr-select-lunar").html('暑假');
				 }
				 var span = '<span class="fa fa-caret-down"></span>';
				$("#wText").html(cal.day+span);
				
    	        $(".dropdown-toggle").css("display","none");
    	    	var myd = datetostr(new Date());
    	    	myDate = parseDate(myd);
    	    	var weekday = myDate.getDay();
    	    	if(weekday == 0){
    	    		weekday = 7;
    	    	}else{
    	    		weekday = weekday;
    	    	}
    	    	// 这一周的开始日期（从周一）开始
    	    	var mys = myDate.getTime();
    	    	var sts = mys - (weekday-1)*24*3600000;
    	    	var ens = mys + (7-weekday)*24*3600000;
    	    	var weekstart= new Date(sts);
    	    	var weekend = new Date(ens);
     	        initWeekTable(datetostr(weekstart),datetostr(weekend),"",'');
     	        layer.closeAll("loading");
			}
		}	
		selectDayFn(datetostr(new Date()));
	});
}
/*****************************************横向切换周次****************************************************/
function gotoPreWeek(zc){
//	alert("Pre--当前周次： "+zc+"--"+"总的周次： "+totalZc);
	if(zc == 0){
		alert("已到第"+zc+"周，不能再往前切换！");
		return;
	}
	var event = $("#selectOpt>li").eq(zc-1).children("a").attr("href");
	$("#preWeek").attr('onclick',event).css('display','block');
	$("#preWeek").click();
	$("#preWeek").attr('onclick',"gotoPreWeek("+(zc-1)+")").css('display','inline-block');
	$("#nextWeek").attr('onclick',"gotoNextWeek("+(zc-1)+")").css('display','inline-block');
	
}
function gotoNextWeek(zc){
//	alert("Next--当前周次： "+zc+"--"+"总的周次： "+totalZc);
	if(zc == totalZc){
		alert("已到第"+zc+"周，不能再往后切换！");
		return;
	}
	var event = $("#selectOpt>li").eq(zc+1).children("a").attr("href");
	$("#nextWeek").attr('onclick',event);
	$("#nextWeek").click();
	$("#nextWeek").attr('onclick',"gotoNextWeek("+(zc+1)+")").css('display','inline-block');
	$("#preWeek").attr('onclick',"gotoPreWeek("+(zc+1)+")").css('display','inline-block');
}

/*****************************************横向切换周次****************************************************/
//下拉框
function selectTeachingWeek(weekStart,weekEnd,weekHoliday,weekZC,curStart,curEnd,curZc,xn,xq,thisXn){
	layer.load();
	// 首先加载 
	var span = '<span class="fa fa-caret-down"></span>';
	$("#schoolYear").html(thisXn); 
	$("#wText").html('第'+weekZC+'教学周'+span);
	/**************************************横向切换周次*******************************************/
	$("#preWeek").attr('onclick',"gotoPreWeek("+weekZC+")").css('display','inline-block');
	$("#nextWeek").attr('onclick',"gotoNextWeek("+weekZC+")").css('display','inline-block');
	/**************************************横向切换周次*******************************************/
	if(weekStart <= datetostr(new Date()) && weekEnd>=datetostr(new Date())){
		  $(".z-today").removeAttr("onclick");
		  $(".z-today").addClass("disabled");
	    }else{
		  $(".z-today").attr("onclick","resetWeek()");
		  $(".z-today").removeClass("disabled");
	}
	var qDate = parseDate(weekStart);//一周的起始日期  #cf2a34
    var qDates = qDate.getTime();//一周起始日期的时间戳 
    var days = 24*3600000;//一天的毫秒数
    var str = "";var currilum="",metting='';
    for(var i=1; i<8; i++){
   	 var dates = qDates + (i-1)*days;//一星期中每天的毫秒数
   	 var date = new Date(dates);//将毫秒转换为日期
   	 var day = date.getDate();
   	 $("#weekday"+i).html(day);
   	 /**********************************周表表格点击**********************************/
     $("#weekday_"+i).html(datetostr(date));
     /**********************************周表表格点击**********************************/
   }
	if(isCurrilum){
		if(isMeetting){// 会议是选中状态
			getCurrilum(xn, xq, weekZC).done(function(curL){
				if(curL!="" && curL!=null){
					currilum = curL;
				}
				getMetting(xn, xq, weekZC).done(function(mettingL){
					if(mettingL!="" && mettingL!=null){
						metting = mettingL;
					}
					initWeekTable(weekStart, weekEnd, currilum,metting);
				})
			})
		}else{
			getCurrilum(xn, xq, weekZC).done(function(curL){
				if(curL!="" && curL!=null){
					currilum = curL;
				}
				initWeekTable(weekStart, weekEnd, currilum,metting);
			})
		}
	}else{
		if(isMeetting){
			getMetting(xn, xq, weekZC).done(function(mettingL){
				if(mettingL!="" && mettingL!=null){
					metting = mettingL;
				}
				initWeekTable(weekStart, weekEnd, currilum,metting);
			})
		}else{
			initWeekTable(weekStart, weekEnd, currilum,metting);
		}
	}
    
}

function minusOneDay(day){
	var minusday = "";
	var qDate = parseDate(day);//一周的起始日期  #cf2a34
    var qDates = qDate.getTime();//一周起始日期的时间戳 
    var days = 24*3600000;
    var date = new Date(qDates-days);
    minusday = datetostr(date);
    return minusday;
}

//日历事件
var selectedDate = "";
function selectDayFn(selectDay){
	selectedDate = selectDay;
//	alert("selectedDate--"+selectedDate);
	// 首先要判断是否在教学周内
	layer.load();
	judgeChecked();// 获取个人、校历及课程表的选中情况
	// 获取所有有日程的日期并在日历上显示
	if(isHd){
		getHdList(selectDay);
	}else{
		$('#hdList').html('');
	}
	getAllScheduleDays(selectDay);
	
	if(termStart!="" && termEnd!="" && selectDay <= termEnd && selectDay >= termStart){// 在教学周内
		var startTime = "";var endTime = "";
		var personalSchedule = "", schoolJS = "", metting = "";
		// 加载校历
//		alert("isP--"+isPerson+"--isS--"+isSchool+"--isC--"+isCurrilum)
		getSchoolCalendar().done(function(cal){
		     // 获取selectDay所在周在教学周中的周数
			var ws = getTeachingWeeks(termStart, selectDay);
			 $(".clndr-select-lunar").html('第'+ws+'教学周');
		    /*************************************周表表格点击事件**************************************/
			 json.jxzc = ws;
			 json.xl = cal;
			/*************************************周表表格点击事件**************************************/
			/*****************************************横向切换周次******************************************/
			  $("#preWeek").attr('onclick',"gotoPreWeek("+ws+")").css('display','inline-block');
			  $("#nextWeek").attr('onclick',"gotoNextWeek("+ws+")").css('display','inline-block');
			/*****************************************横向切换周次******************************************/
			// 判断选择状态
			if(isPerson && isSchool){
				getPersonalSchedule(selectDay).done(function(personalsch){
					if(personalsch != "" && personalsch != null){
						personalSchedule = personalsch;
					}
					getSchoolJS(startTime,endTime,selectDay).done(function(schooljs){
						if(schooljs != "" && schooljs !=null){
							schoolJS = schooljs;
						}
						initShowSchedules(selectDay,cal,ws,personalSchedule,schoolJS);
					});
				});
				//加载校历记事
			}else if(isPerson && !isSchool){
				getPersonalSchedule(selectDay).done(function(personalsch){
					if(personalsch != "" && personalsch != null){
						personalSchedule = personalsch;
					}
					initShowSchedules(selectDay,cal,ws,personalSchedule,schoolJS);
				});
			}else if(!isPerson && isSchool){
				getSchoolJS(startTime,endTime,selectDay).done(function(schooljs){
					if(schooljs != "" && schooljs !=null){
						schoolJS = schooljs;
					}
					initShowSchedules(selectDay,cal,ws,personalSchedule,schoolJS);
				});
			}else{
				initShowSchedules(selectDay,cal,ws,personalSchedule,schoolJS);
			}
		});
	}else{
		 /****************************横向切换周次***************************/
		  $("#preWeek").removeAttr('onclick').css('display','none');
		  $("#nextWeek").removeAttr('onclick').css('display','none');
		/****************************横向切换周次***************************/
		 var nowMonth = (parseDate(selectDay)).getMonth() + 1;
		 nowMonth=nowMonth.toString();
//		 console.log("nowMonth="+nowMonth);
		 if(nowMonth=='1' || nowMonth=='2' || nowMonth=='3'){
			 $(".clndr-select-lunar").html('寒假');
		 }
		 if(nowMonth=='6' || nowMonth=='7' || nowMonth=='8' || nowMonth == '9'){
			 $(".clndr-select-lunar").html('暑假');
		 }
		
		if(selectDay == datetostr(new Date())){
	  		  $(".z-today").removeAttr("onclick");
	  		  $(".z-today").addClass("disabled");
	  	    }else{
	  		  $(".z-today").attr("onclick","resetWeek()");
	  		  $(".z-today").removeClass("disabled");
	  	    }
	  	loadWeekTableByDate(selectDay);
	  	
		var personalSchedule = ""; var schoolJS = "";
		if(isPerson && isSchool){
			getPersonalSchedule(selectDay).done(function(personalsch){
				if(personalsch != "" && personalsch != null){
					personalSchedule = personalsch;
				}
				getSchoolJS(startTime,endTime,selectDay).done(function(schooljs){
					if(schooljs != "" && schooljs !=null){
						schoolJS = schooljs;
					}
					showPersonalScheduleAndSchoolJS(personalSchedule,schoolJS);
				});
			});
			//加载校历记事
		}else if(isPerson && !isSchool){
			getPersonalSchedule(selectDay).done(function(personalsch){
				if(personalsch != "" && personalsch != null){
					personalSchedule = personalsch;
				}
				showPersonalScheduleAndSchoolJS(personalSchedule,schoolJS);
			});
		}else if(!isPerson && isSchool){
			getSchoolJS(startTime,endTime,selectDay).done(function(schooljs){
				if(schooljs != "" && schooljs !=null){
					schoolJS = schooljs;
				}
				showPersonalScheduleAndSchoolJS(personalSchedule,schoolJS);
			});
		}else{
			showPersonalScheduleAndSchoolJS(personalSchedule,schoolJS);
		}
	}
}

// 选中教学周 根据本周的起始日期和结束日期初始化日期表
function check(QSRQ,JSRQ,JJR,zc,date,xn,xq){
	
}


// 处理判断
function initShowSchedules(selectDay,cal,ws,personalSchedule,schoolJS){
	 var curZC = ""; var curXN = "";
	 // 获取ws周的相关信息
	 var selStart = ""; var selEnd = ""; var selHoliday = ""; 
	 // 本周信息
	 var curStart = ""; var curEnd = ""; var curHoliday = ""; var xn = ""; var xq = "";
	 if(cal == "" || cal == null){
//		layer.msg("获取教学周数据出错！");
		layer.closeAll("loading");
	 }else{
		curZC = cal.zc; curXN = cal.xn;
		var lst = cal.lis;
		if(lst == null){
	//		layer.msg("获取教学周的数据出错！");
			layer.closeAll("loading");
		}else{
			selStart =  lst[ws].QSRQ; selEnd = lst[ws].JSRQ; selHoliday = lst[ws].JJR;	xn = lst[ws].XN; xq = lst[ws].XQ;		
		    curStart =  lst[curZC].QSRQ; curEnd = lst[curZC].JSRQ; curHoliday = lst[curZC].JJR;	
		    beginToShowSchedules(selectDay,selStart,selEnd,selHoliday,ws,curStart,curEnd,curHoliday,xn,xq,personalSchedule,schoolJS,curXN);
		}
	}
}

// 判断课程是否展示
function beginToShowSchedules(selectDay,selStart,selEnd,selHoliday,ws,curStart,curEnd,curHoliday,xn,xq,personalSchedule,schoolJS,curXN){
	var currilum = "",metting = "";
	var today = datetostr(new Date());
    if(today>=curStart && today<= curEnd){
     	today = today;
    }else{
     	todays = curStart;
    }
 	if(selectDay ==today){
		  $(".z-today").removeAttr("onclick");
		  $(".z-today").addClass("disabled");
	    }else{
		  $(".z-today").attr("onclick","resetWeek()");
		  $(".z-today").removeClass("disabled");
	    }
 	$(".dropdown-toggle").css("display","");
 	$("#schoolYear").html(curXN);
 	 var span = '<span class="fa fa-caret-down"></span>';
 	$("#wText").html('第'+ws+'教学周'+span);
	if(isCurrilum){
		if(isMeetting){// 会议是选中状态
			getCurrilum(xn, xq, ws).done(function(curL){
				if(curL!="" && curL!=null){
					currilum = curL;
				}
				getMetting(xn, xq, ws).done(function(mettingL){
					if(mettingL!="" && mettingL!=null){
						metting = mettingL;
					}
					showSchedules(selectDay,selStart,selEnd,personalSchedule,schoolJS,currilum,selHoliday,metting);
				})
			})
		}else{
			getCurrilum(xn, xq, ws).done(function(curL){
				if(curL!="" && curL!=null){
					currilum = curL;
				}
				showSchedules(selectDay,selStart,selEnd,personalSchedule,schoolJS,currilum,selHoliday,metting);
			})
		}
	}else{
		if(isMeetting){
			getMetting(xn, xq, ws).done(function(mettingL){
				if(mettingL!="" && mettingL!=null){
					metting = mettingL;
				}
				showSchedules(selectDay,selStart,selEnd,personalSchedule,schoolJS,currilum,selHoliday,metting);
			})
		}else{
			showSchedules(selectDay,selStart,selEnd,personalSchedule,schoolJS,currilum,selHoliday,metting);
		}
	}
}
//展示个人日程、校历、记事及课程表
function showSchedules(selectDay,selStart,selEnd,personalSchedule,schoolJS,currilum,selHoliday,metting){
	var str = "";
	// 展示个人
	if(personalSchedule!="" && personalSchedule!=null){
//		alert("selectDay----"+selectDay+"--personalSchedule--"+personalSchedule.success+"--schoolJS--"+schoolJS);
		 if(personalSchedule.success){
			  var arr=personalSchedule.data;
			  for(var i=0;i<arr.length;i++){
				  var event=arr[i].events;
				  for(var j=0;j<event.length;j++){
					  var startTime=event[j].startTime;
					  var endTime=event[j].endTime;
					  var sdate=parseDate(startTime);
					  var edate=parseDate(endTime);
					  var color="#99c168";
					  var content=event[j].title;
					  if(content.length>50){
						  content = content.replace(/\n/g,"");
						  content=content.substring(0,50)+"...";
					  }
					  if(categoryids!=""){
					  var  contents = event[j].content.replace(/\n/g,"<br/>");
					  var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
					  str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
					  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
					  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
					  }
				  }
			  }
		  }else{
			  layer.closeAll("loading");
			  alert(result.error_msg);
		  }
	}
	// 展示校历记事
	if(schoolJS!="" && schoolJS!=null){
	    for(var j = 0; j<schoolJS.length;j++){
			var content = "";
			var JSS = schoolJS[j].JS;
			var JSS1 = schoolJS[j].JS;
			JSS = JSS.replace(/\n/g,"<br/>");
			if(JSS1.length > 50){
				 content=JSS1.replace(/\n/g,"").substring(0,50)+"...";
			}else{
				 content = JSS1.replace(/\n/g,"");
			}
		   var id = 'jss'+j;
		   str+='<li id="'+id+'"  onmouseleave="closeschooltipsIndex(\''+id+'\')" onmouseenter="schooltips(\''+JSS+'\',\''+id+'\')" class="event-item" ><div style="background-color:#cf2a34;">校'+'</div>'
			      +content+'<span></li>'; 
	   }
	}
	var now = parseDate(selectDay);
	// 加载节假日
	var qDate = parseDate(selStart);//一周的起始日期  #cf2a34
    var qDates = qDate.getTime();//一周起始日期的时间戳 
    var days = 24*3600000;//一天的毫秒数
    for(var i=0; i<8; i++){
   	 var dates = qDates + (i-1)*days;//一星期中每天的毫秒数
   	 var date = new Date(dates);//将毫秒转换为日期
   	 var day = date.getDate();
   	 var nows= now.getTime();
   	 $("#weekday"+i).html(day);
   	 /**********************************周表表格点击**********************************/
     $("#weekday_"+i).html(datetostr(date));
     /**********************************周表表格点击**********************************/
   	 if(isSchool){
   		/* $("#weekday"+i).parent("th").css("background-color","#fff");*/
   		 if(dates == nows){
   			 if(selHoliday.charAt(i-1) == "1"){
       			 var hol = "今天是节假日！";
       			 str+='<li id="holiday"  onmouseleave="closeschooltipsIndex('+"holiday"+')" onmouseenter=\'schooltips('+'"'+hol+'"'+',"holiday")\'class="event-item" ><div style="background-color:#cf2a34;">'+'假'+'</div>'
  				     +"节假日"+'<span></li>';
   			 }
   		 }
   	
   	 }
    }
	
    var thisweekdays = now.getDay();
    if(thisweekdays == 0){
    	thisweekdays = 7;
    }
    // 加载课程表
    if(currilum!="" && currilum!=null){
    	var kc = null;
        kc = currilum[thisweekdays-1].kc;
        if(kc!=null){
        	 var kcdetail = kc.kcDetail;
        	 for(var d=0; d<kcdetail.length;d++){
  				var dtmp = kcdetail[d];
  				var kcId = 'kc'+d;
  				var jsName = dtmp.jsmc;
 				if(jsName == null){
 					jsName = '';
 				}
  				 var obj="{\'kcName\':\'"+dtmp.kcmc+"\',\'teacher\':\'"+dtmp.jzgxm+"\',\'time\':\'"+dtmp.kcjc+"节\',\'location\':\'"+dtmp.jsmc+"\'}";
  	     		str+='<li id="'+kcId+'"  onmouseleave="closekctips(\''+kcId+'\')" onmouseenter="kctips('+obj+',\''+kcId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">课'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
  				   +dtmp.kcmc+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+dtmp.kcjc+'节</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+jsName+'</div></li>'; 
  			}
     	 }
    }
    // 加载会议
    if(metting != "" && metting != null){
    	var hy = metting.hyDetail;
    	if(hy != undefined && hy != null){
    		var hyDetail = hy[thisweekdays-1];
    		var swHys = "", xwHys = "", wjHys = "";
    		var swHy = "", xwHy = "", wjHy = "";
    		if(hyDetail != null && hyDetail != undefined){
    			// 上午会议
    			swHys = hyDetail.sw;
    			if(swHys.length > 0){
    				for(var h = 0; h<swHys.length; h++){
    					var temp = swHys[h];
    					var sdate=parseDate(temp.hykssj+":00");
    					var edate=parseDate(temp.hyjssj+":00");
    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
    				    var tipsId = 'swhy'+h;
    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
    				}
    			}
    			// 下午会议
    			xwHys = hyDetail.xw;
                if(xwHys.length > 0){
                	for(var h = 0; h<xwHys.length; h++){
                		var temp = xwHys[h];
    					var sdate=parseDate(temp.hykssj+":00");
    					var edate=parseDate(temp.hyjssj+":00");
    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
    				    var tipsId = 'xwhy'+h;
    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
    				}
    			} 
                // 晚间会议
    			wjHys = hyDetail.wj;
                if(wjHys.length > 0){
                	for(var h = 0; h<wjHys.length; h++){
                		var temp = wjHys[h];
                		var sdate=parseDate(temp.hykssj+":00");
    					var edate=parseDate(temp.hyjssj+":00");
    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
    				    var tipsId = 'wjhy'+h;
    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
    				}
    			}
    		}
    	}
    }
    $("#stacked").html(str);
    initWeekTable(selStart,selEnd,currilum,metting);
}

function openWindows_two(newName, id, width, height) {
	index = layer.open({
		type: 2,
		title: newName,
		shadeClose: false,
		maxmin: true,
		shade: 0.6,
		area: [(Number(width) + 50) + "px", height + "px"],
		scrollbar: true,
		closeBtn: 1,
		content: ('http://work.gench.edu.cn/default/portalone/hyxt/hyjbxx.jsp?hdid='+id), //iframe的url
        success: function (index,layero){
             $(".layui-layer-max").trigger("click");
        }
	});
}

//加载非教学周的周列表
function loadWeekTableByDate(selectDay){
	 if(termStart == "" && termEnd == ""){
		  $(".dropdown-toggle").css("display","none");
	 }else{
		  $(".dropdown-toggle").css("display","");
	 }
	$("#schoolYear").html("");
	 var span = '<span class="fa fa-caret-down"></span>';
 	$("#wText").html(selectDay+span);
 	var myDate = parseDate(selectDay);
	//获取myDate当天是星期几
	var weekday = myDate.getDay();
	if(weekday == 0){
		weekday = 7;
	}else{
		weekday = weekday;
	}
	// 这一周的开始日期（从周一）开始
	var mys = myDate.getTime();
	var sts = mys - (weekday-1)*24*3600000;
	var ens = mys + (7-weekday)*24*3600000;
	var weekstart= new Date(sts);
	var weekend = new Date(ens);
    var qDates = weekstart.getTime();//一周起始日期的时间戳 
    var days = 24*3600000; //一天的毫秒数
    var str = "";
/*    $("#weekday1").parent("th").css("background-color","#969696");
	$("#weekday2").parent("th").css("background-color","#969696");
	$("#weekday3").parent("th").css("background-color","#969696");
	$("#weekday4").parent("th").css("background-color","#969696");
	$("#weekday5").parent("th").css("background-color","#969696");
	$("#weekday6").parent("th").css("background-color","#cf2a34");
    $("#weekday7").parent("th").css("background-color","#cf2a34");*/
    for(var i=1; i<8; i++){
   	   var dates = qDates + (i-1)*days;//一星期中每天的毫秒数
   	   var date = new Date(dates);//将毫秒转换为日期
   	   var day = date.getDate();
   	   $("#weekday"+i).html(day);
    }
   var zc="";var xn="";var xq =""; var currilum = null;
   initWeekTable(datetostr(weekstart),datetostr(weekend),currilum,'');
}
// 加载不在教学周内的校历记事和个人日程
function showPersonalScheduleAndSchoolJS(personalSchedule,schoolJS){
	var str="";
    if(personalSchedule!=null && personalSchedule!=""){
        if(personalSchedule.success){
				var arr=personalSchedule.data;
				for(var i=0;i<arr.length;i++){
					var event=arr[i].events;
					for(var j=0;j<event.length;j++){
						var startTime=event[j].startTime;
						var endTime=event[j].endTime;
						var sdate=parseDate(startTime);
						var edate=parseDate(endTime);
						var color="#99c168";
						var content=event[j].title;
						if(content.length>50){
							content = content.replace(/\n/g,"");
							content=content.substring(0,50)+"...";
						}
						if(categoryids!=""){
					    var  contents = event[j].content.replace(/\n/g,"<br/>");
						var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
					    str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
						  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
						  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
						}
						 }
					}
				//	  $("#stacked").append(str);
			}else{
				layer.closeAll("loading");
				alert(result.error_msg);
			}
      }
     	if(isSchool){
      	  if(schoolJS != null && schoolJS != ""){
 				for(var j = 0; j<schoolJS.length;j++){
 					 var content = "";
      				 var JSS = schoolJS[j].JS;
      				 JSS = JSS.replace(/\n/g,"<br/>");
      				 if(JSS.length > 50){
      				   content=JSS.replace("<br/>","").substring(0,50)+"...";
      				 }else{
      					content = JSS.replace("<br/>","");
      				 }
          		    str+='<li id="jss"  onmouseleave="closeschooltipsIndex('+"jss"+')" onmouseenter="schooltips(\''+JSS+'\',\'jss\')" class="event-item" ><div style="background-color:#cf2a34;">校'+'</div>'
     				  +content+'<span></li>'; 
 				  }
     		} 
      	 }
      layer.closeAll("loading");
      $("#stacked").html(str);
}
var json = JSON.parse("{}");
// 加载周表格
function initWeekTable(start,end,currilum,metting){
//	console.log("table start="+start+"--end="+end);
	 var lists = "";  var culList = "",hdList="";
	 var startTime = start; var endTime = end; var time ="";
	 if(currilum == ""||currilum==null){
    	    culList = null; 			 
      }else{
    	  culList = currilum;
      }
	 // 获取校历记事
//	 console.log("table1 start="+start+"--end="+end);
	 getSchoolJS(startTime, endTime, time).done(function(data){
		 lists = data;
		 getHd(start,end).done(function(data1){
			 hdList = data1;
			 $.ajax({
		   		  type:"POST",
		   		  data:{start:start,end:end,categoryids:categoryids,type:1},
		   		  url:getMyduty,
		   		  success:function(data){
	   			  if(data!="" || data!=null){
	   				 var result=eval("("+data+")");
	   		/***************************周表表格点击事件传参******************************/	
	   				 json.hd = hdList;
	   				 json.currilum = culList;
	   				 json.metting = metting;
	   				 json.person = result;
	   				 json.xljs = lists;
	   				 json.weekstart = start;
		   /***************************周表表格点击事件传参******************************/		 		  
	   				  if(result.success){
	   					  var arr=result.data;
	   					  var morning ="<tr><td class=\"text-center\"style='width:70px;cursor:default;'>上午</td>";
	   					  var afternoon ="<tr><td class=\"text-center\" style='width:70px;cursor:default;'>下午</td>";
	   					  var evening ="<tr><td class=\"text-center\" style='width:70px;cursor:default;'>晚间</td>";
	   					  for(var i=0;i<arr.length;i++){
	   						  var jscontent ="";
	   						  var dat = arr[i].date;
	       					  var date = parseDate(dat);
	       					  var morContent = "";
	       					  var afterContent = "";
	       					  var nightContent = "";
	       					  var morHy = '',afterHy='',nightHy='';
	       					  var morHd = '',afterHd='',nightHd='';
	       					  // 记事
	       					  if(isSchool){
	       						  if(lists!=null){
	       							//  alert("lists--"+lists);
	       							  for(var j = 0;j<lists.length;j++){
	          							   var qsrq = lists[j].QSRQ;
	          							   var jsrq = lists[j].JSRQ;
	          							   /* var qsrqdate = parseDate(qsrq);
	          							   var jsrqdate = parseDate(jsrq); */
	          							   if(dat >= qsrq && dat <=jsrq){
	          								//   alert("dat--"+dat+"--qsrq--"+qsrq+"--jsrq--"+jsrq);
	          								  var  jsdaycontent = "";
	          								  jsdaycontent = lists[j].JS;
	          								   if(jsdaycontent!=""){
	          									if(jsdaycontent.length > 20){
	          										  jsdaycontent = jsdaycontent.replace(/\n/g,"");
	           						    		  jsdaycontent = jsdaycontent.substring(0,20)+"...";
	       							    		  jscontent+="<p>"+jsdaycontent+"</p>";
	       							    	 }else{
	       							    		 jsdaycontent = jsdaycontent.replace(/\n/g,"");
	       							    		 jsdaycontent =jsdaycontent;
	       							    		 jscontent+="<p>"+jsdaycontent+"</p>";
	       							    	 }
	          								   }
	          							   }
	          						   } 
	       						  }
	       					  }
	       					  if(isMeetting){
	       						  if(metting!="" && metting!=null){
	       					    	var hy = metting.hyDetail;
	       					    	if(hy != undefined && hy != null){
	       					    		var hyDetail = hy[i];
	       					    		var swHys = "", xwHys = "", wjHys = "";
	       					    		var swHy = "", xwHy = "", wjHy = "";
	       					    		// 上午会议
	       					    		if(hyDetail != null && hyDetail != undefined){
	       					    			swHys = hyDetail.sw;
	       					    			if(swHys.length > 0){
	       					    				for(var h = 0; h<swHys.length; h++){
	       					    					var temp = swHys[h];
	       					    					swHy+=temp.hymc+";"
	       					    				}
	       					    			}
	       					    			xwHys = hyDetail.xw;
	       					                if(xwHys.length > 0){
	       					                	for(var h = 0; h<xwHys.length; h++){
	       					                		var temp = xwHys[h];
	       					                		xwHy+=temp.hymc+";"
	       					    				}
	       					    			} 
	       					    			wjHys = hyDetail.wj;
	       					                if(wjHys.length > 0){
	       					                	for(var h = 0; h<wjHys.length; h++){
	       					                		var temp = wjHys[h];
	       					                		wjHy+=temp+";";
	       					    				}
	       					    			}
	       					    		}
	       					    		if(swHy!=""){
	       					    			if(swHy.length>15){
	       					    				swHy=swHy.substring(0,15)+'...';
	       					    			}
	       					    			morHy+='<p>'+swHy+'</p>';
	       					    		}
										if(xwHy!=""){
											if(xwHy.length>15){
												xwHy=xwHy.substring(0,15)+'...';
	       					    			}  	
											afterHy+='<p>'+xwHy+'</p>';
										}
										if(wjHy!=""){
											if(wjHy.length>15){
												wjHy=wjHy.substring(0,15)+'...';
	       					    			}	
											nightHy+='<p>'+wjHy+'</p>';
										}
	       					    	}
	       					    
	       						  }
	       					  }
	       					  if(isHd){
	       						  if(hdList != "" && hdList != null){
	       							  var hd = hdList[i];
	       							  // 上午活动 下午活动 晚间活动
	       							  var swHd = "",xwHd='',wjHd='';
	       							  if(hd!=null && hd!=undefined){
	       								  var dayHd = hd.kc;
	       								  swHd = dayHd.sw;
	       								  xwHd = dayHd.xw;
	       								  wjHd = dayHd.wj;
	       							  }
	       							  if(swHd!=""){
	       								  if(swHd.length>15){
	       									  swHd=swHd.substring(0,15)+"...";
	       								  }
	       								  morHd+='<p>'+swHd+'</p>';
	       							  }
	       							  if(xwHd!=""){
	       								  if(xwHd.length>15){
	       									xwHd=xwHd.substring(0,15)+"...";
	       								  }
	       								  afterHd+='<p>'+xwHd+'</p>';
	       							  }
	       							  if(wjHd!=""){
	       								  if(wjHd.length>15){
	       									wjHd=wjHd.substring(0,15)+"...";
	       								  }
	       								  nightHd+='<p>'+wjHd+'</p>';
	       							  }
	       						  }
	       					  }
	   						  if(isCurrilum){
	   							  if(culList!= null){
	           							  var kc = culList[i].kc;
	           							  var kcdetail = kc.kcDetail;
	           							  var swCon = '',xwCon='',wjCon='';
	           							  for(var d=0; d<kcdetail.length; d++){
	           								  var dtemp = kcdetail[d];
	           								  if(dtemp.time == 'sw'){// 上午
	           									 swCon+= '<span>'+dtemp.kcmc+'</span>'+'<br/>'+'<span>'+dtemp.kcjc+'节</span>';
	           								  }else if(dtemp.time=='xw'){ // 下午
	           									xwCon+= '<span>'+dtemp.kcmc+'</span>'+'<br/>'+'<span>'+dtemp.kcjc+'节</span>';
	           								  }else{ // 晚上
	           									wjCon+= '<span>'+dtemp.kcmc+'</span>'+'<br/>'+'<span>'+dtemp.kcjc+'节</span>';
	           								  }
	           							  }
	           							 if(swCon!=''){
	            							morContent+='<p style="text-align:center">'+swCon+'</p>';
	            						 }
	            						 if(xwCon!=''){
	            							afterContent+='<p style="text-align:center">'+xwCon+'</p>';
	            						 }
	            						 if(wjCon!=''){
	            							nightContent+='<p style="text-align:center">'+wjCon+'</p>';
	            						 }
	   
	           					}
	   						}
	   						  
		       					      // 课程表
		   						      var event=arr[i].events;
		    						  var mflag=true;
		    						  var aflag=true;
		    						  var eflag=true;
		    						  var index1 = 1;// 使校历和课表事件只加载1次
		    						  var index2 = 1;
		    						  var index3 = 1;
		    						  for(var j=0;j<event.length;j++){
		    							  var startTime=event[j].startTime;
		    							  var endTime=event[j].endTime;
		    							  var sdate=parseDate(startTime);
		    							  var edate=parseDate(endTime);
		    							  var hours=sdate.getHours();
		    							  var content=event[j].title;
		    							  var isCurr = false;
		    							  if(date == datetostr(new Date())){
		    								  isCurr =true;
	               					      }
		    							  if(content.length>20){
		    								  content = content.replace(/\n/g, "");
		    								  content=content.substring(0,20)+"...";
		    							  }
		    							  var obj="{&quot;id&quot;:"+event[j].id+",&quot;title&quot;:&quot;"+event[j].title+"&quot;,&quot;content&quot;:&quot;"+event[j].content+"&quot;,"
		    							  +"&quot;startTime&quot;:&quot;"+event[j].startTime+"&quot;,&quot;endTime&quot;:&quot;"+event[j].endTime+"&quot;,&quot;location&quot;:&quot;"+event[j].location+"&quot;,&quot;shortName&quot;:&quot;"+event[j].shortName+"&quot;}";
		    							 if(categoryids!=""){
		    							  if(hours<=12 && hours>=1){//上午
		    								  if(mflag){
		    									  morning +="<td onclick='todayInfor(1,"+i+")' class='hasEvent'>";  
		    									  if(index1 == 1){
		    										  index1--;
		    										  if(jscontent!=""){
		    											  morning +=jscontent;
		    										  }
		    										  if(morContent!=""){
		    											  morning+=morContent;
		    										  } 
		    										  if(morHy!=""){
		    											  morning+=morHy;
		    										  }
		    										  if(morHd!=""){
		    											  morning+=morHd;
		    										  }
		    									  }
		    									  morning += "<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value=\""+obj+"\" />";
		    									  mflag=false;
		    								  }else{
		    									  if(index1 == 1){
		    										  index1--;
		    										  if(jscontent!=""){
		    											  morning +=jscontent;
		    										  }
		    										  if(morContent!=""){
		    											  morning+=morContent;
		    										  }
		    										  if(morHy!=""){
		    											  morning+=morHy;
		    										  }
		    										  if(morHd!=""){
		    											  morning+=morHd;
		    										  }
		    									  }	  
		    									  morning +="<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value=\""+obj+"\" />";
		    								  }
		    								  
		    							  }else if(hours>12 && hours<=18){
		    								  //下午
		    								  if(aflag){
		    									  afternoon +="<td onclick='todayInfor(2,"+i+")' class='hasEvent'>"; 
		    									  if(index2 == 1){
		    										  index2--;
		    										  if(afterContent!=""){
		    											 afternoon+=afterContent;
		    										 } 
		    										 if(afterHy!=""){
		    											 afternoon+=afterHy;
		    										 }
		    										 if(afterHd!=""){
		    											 afternoon+=afterHd;
		    										 }
		    									  }
		    									  afternoon+="<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value='"+obj+"' />";
										  		  aflag=false;
		    								  }else{
		    									  if(index2 == 1){
		    										  index2--;
		    										  if(afterContent!=""){
		    											 afternoon+=afterContent;
		    										  }
		    										  if(afterHy!=""){
		    											  afternoon+=afterHy;
		    										  }
		    										  if(afterHd!=""){
			    									      afternoon+=afterHd;
			    								      }
		    									  }
		    									  afternoon +="<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value='"+obj+"' />";
		    								  }
		    							  }else{
		    								  //晚间
		    								  if(eflag){
		    										evening +="<td onclick='todayInfor(3,"+i+")' class='hasEvent'>"; 
		    									    if(index3== 1){
		    									    	index3--;
		    									    	if(nightContent!=""){
	 	    											  evening+=nightContent;
	 	    										    }
		    									    	if(nightHy!=""){
		    									    		evening+=nightHy;
			    										}
		    									    	if(nightHd!=""){
		    									    		evening+=nightHd;
			    										}
		    									    }
		    									  evening+="<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value='"+obj+"' />";
									  			  eflag=false;
		    								  }else{
		    									  if(index3 == 1){
		    										  index3--;
		    									      if(nightContent!=""){
		    											  evening+=nightContent;
		    										  }
		    									      if(nightHy!=""){
			    									      evening+=nightHy;
				    								  }
		    									      if(nightHd!=""){
			    									      evening+=nightHd;
				    								   }
		    									    }
		    									  evening +="<a class='sheduleContent' onclick='javascript:viewDetails("+event[j].id+")'><p>"+content+"</p></a><input type='hidden' value='"+obj+"' />";
		    								  }
		    							  }
		    						    }
		    						  }
		    						  if(mflag){
		    							 // 校历和课表都显示
		    							 if(jscontent!=""||morContent!=""||morHy!=""||morHd!=""){
	  										 morning +="<td onclick='todayInfor(1,"+i+")' class='hasEvent'>";  
		    								 morning +=jscontent;
		    								 morning +=morContent;
		    								 morning +=morHy;
		    								 morning +=morHd;
		    							}else{
		    								morning+="<td onclick='todayInfor(1,"+i+")' >"; 
		    						    }
		    							morning+="</td>";
		    						  }else{
		    							  morning+="</td>";
		    						  }
		    						  // 下午
		    						  if(aflag){
		    								  if(afterContent!="" || afterHy!="" || afterHd!=""){
		    									  afternoon +="<td onclick='todayInfor(2,"+i+")' class='hasEvent'>"; 
		    									  afternoon +=afterContent;
		    									  afternoon +=afterHy;
		    									  afternoon +=afterHd;
		    								  }else{
		    									 afternoon +="<td onclick='todayInfor(2,"+i+")'>"; 
		    								  }
		    							  afternoon+="</td>";
		    						  }else{
		    							  afternoon+="</td>";
		    						  }
		    						  // 晚上
		    						  if(eflag){
		    								  if(nightContent!="" || nightHy!="" || nightHd!=""){
		    									  evening+="<td onclick='todayInfor(3,"+i+")' class='hasEvent'>";
		    									  evening +=nightContent;
		    									  evening +=nightHy;
		    									  evening +=nightHd;
		    								  }else{
		    									evening+="<td onclick='todayInfor(3,"+i+")'>";
		    								  }
		    							  evening+="</td>";
		    						  }else{
		    							  evening+="</td>";
		    						  } 
	   					  }
	   					  morning+="</tr>";
	   					  afternoon+="</tr>";
	   					  evening+="</tr>";
	   					  if(date == datetostr(new Date())){
	   						  $(".text-center").addClass("bgColor");
	   					  }else{
	   						  $(".text-center").removeClass("bgColor");
	   					  }
	   					  //绑定a标签时间
	   					  $("#weekTable").html(morning+afternoon+evening);
	   					  colorToday(start,end);
	   					  layer.closeAll("loading");
//	   					 $("#weekTable>tr>td:gt(0)").on('click',function(e){
//	   						alert("sb……"); 
//	   					 });
	   				  }else{
	   					  colorToday(start,end);
	   					  layer.closeAll("loading");
	//   					  alert(result.error_msg);
	   				  }
	   			  }
	   		  }
			 })
		 })
	  })
}
// 给星期表中的当天 栏着色
function colorToday(start,end){
	  var today = new Date();
	  var thistoday = datetostr(today);
 	  var weekdays = today.getDay();
 	  if(weekdays==0){
 		  weekdays = 7;
 	  }
 	  var weekdays1 = weekdays+1;
 	  if(thistoday<=end && thistoday>=start){
 		/* $("#weekday"+weekdays).parent("th").css("color","#c00005");*/
 		 $("#weekday"+weekdays).parent("th").addClass("todaycolor");
 		 $(" .z-table-tbody tr:nth-child(1) td:nth-child("+weekdays1+")").addClass("currentColor");  
	   	 $(" .z-table-tbody tr:nth-child(2) td:nth-child("+weekdays1+")").addClass("currentColor");  
	   	 $(" .z-table-tbody tr:nth-child(3) td:nth-child("+weekdays1+")").addClass("currentColor"); 
 	  }else{
 		 $("#weekday"+weekdays).parent("th").removeClass("todaycolor");
 	  }
}

//获取所有有日程的日期并在日历上显示
function getAllScheduleDays(selectDay){
	// 获取selectDay所在月的起始日期
	var monthStart = ""; var monthEnd = "";var personalSchedule = ""; var monthHoliday ="";
	var seldate = parseDate(selectDay);
	var month = seldate.getMonth();
	var year = seldate.getFullYear();
	if((month +1) < 10){
		monthStart = year + "-0" +(month+1)+"-01";//  本月第一天
	}else{
		monthStart = year + "-" +(month+1)+"-01";//  本月第一天
	}
	if(month == 11){
		monthEnd = year + "-12-31";//  本月最后一天
	}else{
		var nextMonth =year + "-"+ (month +2) +"-01";
		var nextMonthDate = parseDate(nextMonth);
		var times = nextMonthDate.getTime() - 24*3600000;
	//	alert("nextMonth--"+ nextMonthDate);
		monthEnd = datetostr(new Date(times));
	}
	// 获取本月的节假日信息
	monthHoliday = getAllHolidayDates(termStart,termEnd,termHoliday,monthStart,monthEnd);
	
	// 获取本月中有个人日程的日期
	if(isPerson){
        var promise = $.ajax({
         	type:'post',
         	data:{start:monthStart,end:monthEnd,categoryids:"",type:1},
         	url:getMyduty2,
         	success:function(result){
         		var dates= eval("("+result+")");
         		personalSchedule = dates.toString();
         	}
         });
        promise.done(function(data){
        	getAllSchoolJSDates(monthStart,monthEnd,personalSchedule,monthHoliday);
        })
 	}else{
 		getAllSchoolJSDates(monthStart,monthEnd,personalSchedule,monthHoliday);
 	}
}
//获取本月所有有节假日的日期
function getAllHolidayDates(termstart,termend,holidays,monthstart,monthend){
	//本月的前半部分可能不在教学周内  节假日字符串本月的第一个下标为termstart,最后一个下标为monthend
	var monthHoliday = "";
	var startday="",endday="",startIndex="",endIndex="";
	if(monthstart>=termstart && monthend >=termstart){
		startday = termstart; endday = monthend;
	}else
	//本月饿后半部分可能不在教学周内 节假日字符串本月的第一个下标为monthstart,最后一个下标为termend
	if(monthend>=termend && monthstart<=termend){
		startday = monthstart; endday = termend;
	}else
	// 本月完全在教学周内  节假日字符串本月的第一个下标为monthstart,最后一个下标为monthend
	if(monthstart>=termstart && monthend<=termend){
		startday = monthstart; endday = monthend;
	}
    // 获取startday与endday在holidays字符串中的下标
	var startdate = parseDate(startday); var startdatetimes = startdate.getTime();
	var enddate = parseDate(endday); var enddatetime = enddate.getTime();
	var termstartdate = parseDate(termstart); var termstartdatetime = termstartdate.getTime();
	var daytime = 24*3600000;
	startIndex =  Math.ceil((startdatetimes - termstartdatetime)/daytime);
	endIndex =  Math.ceil((enddatetime-termstartdatetime)/daytime);
	for(var i = startIndex; i < endIndex+1;i++){
		if(holidays.charAt(i) == "1"){
			var holidaydatetime = termstartdatetime + i*daytime;
			var holidaydate = new Date(holidaydatetime);
			monthHoliday+= datetostr(holidaydate) + ",";
		}
	}
	if(monthHoliday!=""){
		monthHoliday = monthHoliday.substring(0,monthHoliday.length-1);
	}
	return monthHoliday;
}

// 获取本月有校历记事的日期
function getAllSchoolJSDates(start,end,personalSchedule,monthHoliday){
	var schoolJSDates = ""; var lists = null;
	  if(isSchool){
   		 var time = "";
   		 getSchoolJS(start, end, time).done(function(data){
            lists = data;      			 
           var monthArry = new Array();
        	  if(lists != null){
        		for(var i = 0;i < lists.length; i++){
          		  var jsqsrq = lists[i].QSRQ;
          		  var jsjsrq = lists[i].JSRQ;
          		  var jsqsrqs = (parseDate(jsqsrq)).getTime();
          		  var jsjsrqs = (parseDate(jsjsrq)).getTime();
          		  var days = (jsjsrqs - jsqsrqs)/(24*3600000)+1;
          	      for(var j = 0; j<days; j++){
          			  var date = datetostr(new Date(jsqsrqs + j*24*3600000));
          			  if(date<=end && date>=start){
          				schoolJSDates+=date+",";
          			  }
          		  } 
          		  
          	  }
        	  }else{
        		  schoolJSDates = "";
      	  }
        	  getAllScheduleDates(personalSchedule,schoolJSDates,start,end,monthHoliday);
   		 })	 
  	 }else{
  		 schoolSchedule = "";
  		getAllScheduleDates(personalSchedule,schoolJSDates,start,end,monthHoliday);
  	 }
}

// 处理所有有日程和记事的日期
function getAllScheduleDates(personalSchedule,schoolJSDates,start,end,monthHoliday){
	var scheduleStr = "";
	 if(personalSchedule!="" && schoolJSDates !=""){
  	  scheduleStr = personalSchedule +","+schoolJSDates;
    }else if(personalSchedule == "" && schoolJSDates != ""){
  	  scheduleStr = schoolJSDates;
    }else if(personalSchedule !="" && schoolJSDates == ""){
  	  scheduleStr = personalSchedule;
    }else if(personalSchedule == "" && schoolJSDates == ""){
  	  scheduleStr = "";
    }
	 colorCalendar(scheduleStr,start,end,monthHoliday);
}
// 在日历上着色
function colorCalendar(scheduleStr,start,end,monthHoliday){
	  $("div.day-box").each(function(){
		  var tdclass = $(this).parent("td").attr("class");
		  var date = $(this).attr("data-date");
		  $(this).children("a").removeClass("scheduleAndHoliday");
	 	  $(this).children("a").removeClass("onlySchedule");
	 	  $(this).children("a").removeClass("onlyMonthHoliday");
		  if(tdclass.indexOf("clndr-day-out") == -1){
			  if(date<=end && date>=start && date !=(datetostr(new Date()))){
				  if(scheduleStr.indexOf(date)>-1){// 只有记事
					  $(this).children("a").addClass("onlySchedule");
				  }
				 /* if(scheduleStr.indexOf(date)>-1 && monthHoliday.indexOf(date)==-1){// 只有记事
					  $(this).children("a").addClass("onlySchedule");
				  }else if(scheduleStr.indexOf(date)==-1 && monthHoliday.indexOf(date)>-1){// 只有节假日
					  $(this).children("a").addClass("onlyMonthHoliday");
				  }else if(scheduleStr.indexOf(date)>-1 && monthHoliday.indexOf(date)>-1){// 既有节假日又有记事
					  $(this).children("a").addClass("scheduleAndHoliday");
				  }*/
			  }
		  }
 	 });
}

// 重置日程
function resetWeek(){
	  selectDayFn(datetostr(new Date()));
	  $(".z-today").removeAttr("onclick");
      $(".z-today").addClass("disabled");  
}


function getTeachingWeeks(start,selectDay){
	var weeks = "";
	var terms = (parseDate(start)).getTime();
	var sels = (parseDate(selectDay)).getTime();
	var days = 7*24*3600000;
	weeks =  Math.ceil((sels - terms + 24*3600000)/days)-1;// 因为教学周从0开始，故需要加-1
	return weeks;
}

function selectcategory(){
	  $('input[name=category]').on('ifChanged', function(event){
		  var arr=new Array();
  	  $("input[name='category']:checked").each(function(){
  		  arr.push($(this).val());
  	  });
  	  categoryids=arr.join(",");
  	var promise = $.ajax({
  		  url:saveMyOption,
  		  type:"POST",
  		  data:{categoryids:categoryids},
  		  success:function(data){
  			  if(data!="success"){
  		//		  layer.msg('保存个人设置失败！');
  			  }
  		  }
  	  });
  	promise.done(function(data){
  		 selectDayFn(selectedDate);
  	})
  	
	  }); 
}

// 判断个人、校历、课程表是否选中
var isSchool = false,isPerson = false,isCurrilum = false,isMeetting = false,isHd=false;
function judgeChecked(){
	$.ajax({
		type:'post',
		async:false,
		url:isContainsSchool,
		success:function(result){
			var result=eval("("+result+")");
			if(result == null){
	//			layer.msg("查询日程分类的选中状态出错！")
			}else{
				if(result.isSchool == true){
					isSchool=true;
				}else{
					isSchool = false;
				}
				if(result.isPerson == true){
					isPerson = true;
				}else{
					isPerson = false;
				}
				if(result.isCurrilum == true){
					isCurrilum = true;
				}else{
					isCurrilum = false;
				}
				if(result.isMeetting == true){
					isMeetting = true;
				}else{
					isMeetting = false;
				}
				if(result.isActivity == true){
					isHd = true;
				}else{
					isHd = false;
				}
			}
		}
	});
}

// 获取校历
 function getSchoolCalendar() {
	var def = $.Deferred();
	$.ajax({
		type : 'get',
		dataType : 'jsonp',
		jsonp : "callback",
		// url:"http://170.18.10.204:8084/default/portalone/xl/ajaxXL.jsp",
		url : 'http://work.gench.edu.cn/default/portalone/xl/ajaxXL.jsp',
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			layer.closeAll("loading");
//			alert("获取教学周出错！");
		},
		success : function(result) {
			var results = "";
			if (result == null) {
				layer.closeAll("loading");
//				layer.msg("初始化教学周失败！");
			} else {// 首先判断是否是教学周
				results = result.result;
			}
			def.resolve(results);
		}
	});
	return def.promise();
}

// 获取校历记事
function getSchoolJS(start,end,time) {
	var def = $.Deferred();
	$.ajax({
		type : 'get',
		dataType : 'jsonp',
		jsonp : "callback",
		// url:"http://170.18.10.204:8084/default/portalone/xl/ajaxXLJS.jsp",
		url : 'http://work.gench.edu.cn/default/portalone/xl/ajaxXLJS.jsp',
		data : {
			startTime : start,
			endTime : end,
			time : time
		},
		success : function(data) {
			var list = "";
			if (data == null) {

			} else {
				list = data.list;
			}
			def.resolve(list);
		}
	});
	return def.promise();
}

// 获取个人日程
function getPersonalSchedule(selectDay) {
	var def = $.Deferred();
	$.ajax({
		type : "POST",
		data : {
			start : selectDay,
			end : selectDay,
			categoryids : categoryids,
			type : 1
		},
		async : false,
		url : getMyduty,
		success : function(data) {
			var result = "";
			if (data != "" || data != null) {
				result = eval("(" + data + ")");
			}
			def.resolve(result);
		}
	});
	return def.promise();
}

// 获取课程表
function getCurrilum(xn, xq, zc) {
	var def = $.Deferred();
//	var au = auxId;
	if (isCurrilum) {
		$.ajax({
					type : "get",
					// url:"http://170.18.10.204:8084/default/portalone/jskcb/ajaxjskcb.jsp",
					url : "http://work.gench.edu.cn/default/portalone/jskcb/ajaxjskcb.jsp",
					dataType : 'jsonp',
					jsonp : "callback",
					data : {
						xn : xn,
						xq : xq,
						gh : auxId,
						/*  xn:"2014-2015", 
						  xq:"2", 
						  gh:"02029",*/
						  skzc : zc
					},
					success : function(data) {
						var list = "";
						if (data.result == "1") {
							list = data.data;
						} else {
							layer.closeAll("loading");
							/*layer.alert(data.reason, {
								closeBtn : 0,
								title : '提示',
								shade : 0.1
							});*/
							// return;
						}
						def.resolve(list);
					}
				});
	} else {
	     def.resolve("");
	}
	return def.promise();
}
// 获取会议
function getMetting(xn, xq, zc){
	var def = $.Deferred();
	if (xn != "" && xq != "" && zc != "" && auxId != null && isMeetting) {
		   $.ajax({
					type : "get",
//					url : "http://work.gench.edu.cn/default/portalone/jskcb/queryMhHy.jsp",
					url : 'http://work.gench.edu.cn/default/portalone/hyxt/queryMhHy.jsp',
					dataType : 'jsonp',
					jsonp : "callback",
					data : {
						gh : auxId, 
						xn : xn,
						xq : xq,
						zc : zc
//						gh :'03070',
//						xn : '2016-2017',     
//						xq : 1,     
//						zc : 17     
					},
					error:function(){
						layer.closeAll("loading");
						alert('获取会议出错！');
					},
					success : function(data) {
						var list = "";
						if (data.data.result == 1) {
							list = data.data;
						} else {
							layer.closeAll("loading");
							/*layer.alert(data.data.reason, {
								closeBtn : 0,
								title : '提示',
								shade : 0.1
							});*/
							// return;
						}
						def.resolve(list);
					}
				});
	} else {
	     def.resolve("");
	}
//	  def.resolve("");
	return def.promise();
}

// 获取一周的活动
function getHd(start,end){
	var def = $.Deferred();
	if(isHd){
		$.ajax({
			type : 'get',
			dataType : 'jsonp',
			jsonp : "callback",
			url : 'http://work.gench.edu.cn/default/portalone/hd/ajaxRCHDXcs.jsp',
			data : {
				begin : start,
				  end : end
			},
			success : function(data) {
				var list = "";
				if (data == null) {

				} else {
					if(data.result == 1){
						list = data.data;
					}else{
						layer.closeAll("loading");
						/*layer.alert(data.reason, {
							closeBtn : 0,
							title : '提示',
							shade : 0.1
						});*/
					}
				}
				def.resolve(list);
			}
		});
	}else{
		def.resolve("");
	}
//	  def.resolve("");
	return def.promise();
}
// 获取当天的活动列表
function getHdList(selectDay){
	if(isHd){
		$.ajax({
			type : "get",
			dataType : 'jsonp',
			jsonp : "callback",
			url : 'http://work.gench.edu.cn/default/portalone/hd/ajaxRCHDXcDetails.jsp',
			data : {
				time : selectDay
			},
			success : function(data) {
				if(data.result == 1){
					var str='';
					var hdList = data.data;
					if(hdList.length > 0){
						var index = 0;
						for(var i =0; i<hdList.length;i++){
							var htemp = hdList[i];
							var xcList = htemp.xcs;
							if(xcList.length>0){
								for(var j = 0; j<xcList.length; j++){
									var xtemp = xcList[j];
									var hdName = htemp.HDMC;
									var sdate=parseDate(xtemp.KSSJ+":00");
									var edate=parseDate(xtemp.JSSJ+":00");
									var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
								    var tipsId = 'hd'+index;
									str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
					  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
									index++;
								}
							}
						}
					}
					$('#hdList').html(str);
					layer.closeAll("loading");
				}else{
					layer.closeAll("loading");
					/*layer.alert(data.reason, {
						closeBtn : 0,
						title : '提示',
						shade : 0.1
					});*/
				}
			}
		});
	}else{
		 $('#hdList').html('');
		 layer.closeAll("loading");
	 }
}

// 转换时间    pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)
function datetodaystr(date) {
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	var hour = date.getHours();
	if (hour < 10) {
		hour = '0' + hour;
	}
	var min = date.getMinutes();
	if (min < 10) {
		min = '0' + min;
	}
	return month + "/" + day + " " + hour + ":" + min;
}

 function datetostr(date){
	  var year=date.getFullYear(); 
	  var month=date.getMonth()+1;       
	  var day=date.getDate();
	  if(day<10){
		  day = '0'+day;
	  }
	  if(month<10){
		  month = '0'+month;
	  }
	  return year+"-"+month+"-"+day;
 }
 function parseDate(dateStringInRange) {
	  var isoExps = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/;
	  var isoExpl =/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
	      date = new Date(NaN), month,
	      parts = isoExps.exec(dateStringInRange);
	  var flag=true;
	  if(parts==null){
		  flag=false;
		parts = isoExpl.exec(dateStringInRange);
	   }

	   if(parts) {
	     month = +parts[2];
	     date.setFullYear(parts[1], month - 1, parts[3]);
	  	 if(!flag){
   	  	 date.setHours(parts[4]);
       	 date.setMinutes(parts[5]);
       	 date.setSeconds(0); 
	  	 }
   	 
	     if(month != date.getMonth() + 1) {
	       date.setTime(NaN);
	     }
	   }
	   return date;
	 }
 /****************************************周表表格点击事件***********************************/
 // type:0--全天； 1--上午；2--下午； 3--晚间；
 function todayInfor(type,weekIndex){
	 layer.load();
	 var selectDay = $('#weekday_'+(weekIndex+1)).html();
	 var str = "";
	 if(type!=0){
		 getSelHdList(selectDay,type);
		 $('#weekTable td').removeClass('selActive');
		 $('th').removeClass('todaycolorhead');
		 $('#weekTable').children('tr').eq(type-1).children('td').eq(weekIndex+1).addClass('selActive'); 
	 }else{
		 $('th').removeClass('todaycolorhead');
		 $('#weekday'+(weekIndex+1)).parent('th').addClass('todaycolorhead');
		 $('#weekTable td').removeClass('selActive');
		 $('#weekTable').children('tr').eq(0).children('td').eq(weekIndex+1).addClass('selActive');
		 $('#weekTable').children('tr').eq(1).children('td').eq(weekIndex+1).addClass('selActive');
		 $('#weekTable').children('tr').eq(2).children('td').eq(weekIndex+1).addClass('selActive');
		 getHdList(selectDay);
	 }
	 if(type==0){
		// 上午；
    	 // 获取个人：
    	 var persons = json.person;
         if(isPerson){
        	      var arr=persons.data;
				  var event=arr[weekIndex].events;
				  for(var j=0;j<event.length;j++){
					  var startTime=event[j].startTime;
					  var endTime=event[j].endTime;
					  var sdate=parseDate(startTime);
					  var edate=parseDate(endTime);
					  var hours=sdate.getHours();
					  
					  var color="#99c168";
					  var content=event[j].title;
					  if(content.length>50){
						  content = content.replace(/\n/g,"");
						  content=content.substring(0,50)+"...";
					  }
						  if(categoryids!=""){
							  var  contents = event[j].content.replace(/\n/g,"<br/>");
							  var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
							  str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
						   }
				  }
			 
         }
         // 获取校历记事和节假日； 默认在上午显示
         if(isSchool){
        	    var schoolJS = json.xljs;
        	   if(schoolJS!=""&&schoolJS!=null){
        		   for(var j = 0; j<schoolJS.length;j++){
        				var content = "";
        				var JSS = schoolJS[j].JS;
        				var JSS1 = schoolJS[j].JS;
        				var qsrq =  schoolJS[j].QSRQ;
        				var jsrq = schoolJS[j].JSRQ;
        				if(selectDay >= qsrq && selectDay<= jsrq){
        					JSS = JSS.replace(/\n/g,"<br/>");
            				if(JSS1.length > 50){
            					 content=JSS1.replace(/\n/g,"").substring(0,50)+"...";
            				}else{
            					 content = JSS1.replace(/\n/g,"");
            				}
            			   var id = 'jss'+j;
            			   str+='<li id="'+id+'"  onmouseleave="closeschooltipsIndex(\''+id+'\')" onmouseenter="schooltips(\''+JSS+'\',\''+id+'\')" class="event-item" ><div style="background-color:#cf2a34;">校'+'</div>'
            				      +content+'<span></li>'; 
        				}
        		   }
        	   }
        	 // 加载节假日 
     		 var zc = json.jxzc;
       	     var xl = json.xl;
       	     if(xl!="" && xl!=null){
       	    	 var list = xl.lis;
          	     var selStart =list[zc].QSRQ;
          	     var selHoliday = list[zc].JJR;
          		 var now = parseDate(selectDay);
          		 // 加载节假日
          		 var qDate = parseDate(selStart);//一周的起始日期  #cf2a34
          	     var qDates = qDate.getTime();//一周起始日期的时间戳 
          	     var days = 24*3600000;//一天的毫秒数
          	   	 var dates = qDates + (weekIndex)*days;//一星期中每天的毫秒数
          	   	 var date = new Date(dates);//将毫秒转换为日期
          	   	 var day = date.getDate();
          	   	 var nows= now.getTime();
          	   	 if(dates == nows){
          	   		 if((selHoliday.charAt(weekIndex) == "1")){
          	   			 var hol = "今天是节假日！";
      	       			 str+='<li id="holiday"  onmouseleave="closeschooltipsIndex('+"holiday"+')" onmouseenter=\'schooltips('+'"'+hol+'"'+',"holiday")\'class="event-item" ><div style="background-color:#cf2a34;">'+'假'+'</div>'
      	  				     +"节假日"+'<span></li>'; 
          	   		 }
          	   	 } 
       	     }
         }
         // 加载会议
         if(isMeetting){
        	 var metting = json.metting;
        	    if(metting != "" && metting != null){
        	    	var hy = metting.hyDetail;
        	    	if(hy != undefined && hy != null){
        	    		var hyDetail = hy[weekIndex];
        	    		var swHys = "", xwHys = "", wjHys = "";
        	    		var swHy = "", xwHy = "", wjHy = "";
        	    		if(hyDetail != null && hyDetail != undefined){
        	    			// 上午会议
        	       			swHys = hyDetail.sw;
        	    			if(swHys.length > 0){
        	    				for(var h = 0; h<swHys.length; h++){
        	    					var temp = swHys[h];
        	    					var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
        	    				    var tipsId = 'swhy'+h;
        	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
        	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
        	    				}
        	    			}
        	    			// 下午会议
        	    			xwHys = hyDetail.xw;
        	                if(xwHys.length > 0){
        	                	for(var h = 0; h<xwHys.length; h++){
        	                		var temp = xwHys[h];
        	    					var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
        	    				    var tipsId = 'xwhy'+h;
        	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
        	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
        	    				}
        	    			} 
        	                // 晚间会议
        	    			wjHys = hyDetail.wj;
        	                if(wjHys.length > 0){
        	                	for(var h = 0; h<wjHys.length; h++){
        	                		var temp = wjHys[h];
        	                		var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
        	    				    var tipsId = 'wjhy'+h;
        	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
        	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
        	    				}
        	    			}
        	    		}
        	    	}
        	    }
         }
         // 加载课程表
         if(isCurrilum){
        	 var currilum = json.currilum;
        	    if(currilum!="" && currilum!=null){
        	    	var kc = null;
        	        kc = currilum[weekIndex].kc;
        	        if(kc!=null){
        	        	 var kcdetail = kc.kcDetail;
        	        	 for(var d=0; d<kcdetail.length;d++){
        	  				var dtmp = kcdetail[d];
        	  					var kcId = 'kc'+d;
            	  				var jsName = dtmp.jsmc;
            	 				if(jsName == null){
            	 					jsName = '';
            	 				}
            	  				 var obj="{\'kcName\':\'"+dtmp.kcmc+"\',\'teacher\':\'"+dtmp.jzgxm+"\',\'time\':\'"+dtmp.kcjc+"节\',\'location\':\'"+dtmp.jsmc+"\'}";
            	  	     		str+='<li id="'+kcId+'"  onmouseleave="closekctips(\''+kcId+'\')" onmouseenter="kctips('+obj+',\''+kcId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">课'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
            	  				   +dtmp.kcmc+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+dtmp.kcjc+'节</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+jsName+'</div></li>'; 
        	  			}
        	     	 }
        	    }
         }
     
	 }
     if(type == 1){// 上午；
    	 // 获取个人：
    	 var persons = json.person;
         if(isPerson){
        	      var arr=persons.data;
				  var event=arr[weekIndex].events;
				  for(var j=0;j<event.length;j++){
					  var startTime=event[j].startTime;
					  var endTime=event[j].endTime;
					  var sdate=parseDate(startTime);
					  var edate=parseDate(endTime);
					  var hours=sdate.getHours();
					  
					  var color="#99c168";
					  var content=event[j].title;
					  if(content.length>50){
						  content = content.replace(/\n/g,"");
						  content=content.substring(0,50)+"...";
					  }
					  if(hours<=12 && hours>=1){
						  if(categoryids!=""){
							  var  contents = event[j].content.replace(/\n/g,"<br/>");
							  var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
							  str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
						   }
					  }
				  }
			 
         }
         // 获取校历记事和节假日； 默认在上午显示
         if(isSchool){
        	    var schoolJS = json.xljs;
        	   if(schoolJS!=""&&schoolJS!=null){
        		   for(var j = 0; j<schoolJS.length;j++){
        				var content = "";
        				var JSS = schoolJS[j].JS;
        				var JSS1 = schoolJS[j].JS;
        				var qsrq =  schoolJS[j].QSRQ;
        				var jsrq = schoolJS[j].JSRQ;
        				if(selectDay >= qsrq && selectDay<= jsrq){
        					JSS = JSS.replace(/\n/g,"<br/>");
            				if(JSS1.length > 50){
            					 content=JSS1.replace(/\n/g,"").substring(0,50)+"...";
            				}else{
            					 content = JSS1.replace(/\n/g,"");
            				}
            			   var id = 'jss'+j;
            			   str+='<li id="'+id+'"  onmouseleave="closeschooltipsIndex(\''+id+'\')" onmouseenter="schooltips(\''+JSS+'\',\''+id+'\')" class="event-item" ><div style="background-color:#cf2a34;">校'+'</div>'
            				      +content+'<span></li>'; 
        				}
        		   }
        	   }
        	 // 加载节假日 
     		 var zc = json.jxzc;
       	     var xl = json.xl;
       	     if(xl!="" && xl!=null){
       	    	 var list = xl.lis;
          	     var selStart =list[zc].QSRQ;
          	     var selHoliday = list[zc].JJR;
          		 var now = parseDate(selectDay);
          		 // 加载节假日
          		 var qDate = parseDate(selStart);//一周的起始日期  #cf2a34
          	     var qDates = qDate.getTime();//一周起始日期的时间戳 
          	     var days = 24*3600000;//一天的毫秒数
          	   	 var dates = qDates + (weekIndex)*days;//一星期中每天的毫秒数
          	   	 var date = new Date(dates);//将毫秒转换为日期
          	   	 var day = date.getDate();
          	   	 var nows= now.getTime();
          	   	 if(dates == nows){
          	   		 if((selHoliday.charAt(weekIndex) == "1")){
          	   			 var hol = "今天是节假日！";
      	       			 str+='<li id="holiday"  onmouseleave="closeschooltipsIndex('+"holiday"+')" onmouseenter=\'schooltips('+'"'+hol+'"'+',"holiday")\'class="event-item" ><div style="background-color:#cf2a34;">'+'假'+'</div>'
      	  				     +"节假日"+'<span></li>'; 
          	   		 }
          	   	 } 
       	     }
         }
         // 加载会议
         if(isMeetting){
        	 var metting = json.metting;
        	    if(metting != "" && metting != null){
        	    	var hy = metting.hyDetail;
        	    	if(hy != undefined && hy != null){
        	    		var hyDetail = hy[weekIndex];
        	    		var swHys = "", xwHys = "", wjHys = "";
        	    		var swHy = "", xwHy = "", wjHy = "";
        	    		if(hyDetail != null && hyDetail != undefined){
        	    			// 上午会议
        	    			swHys = hyDetail.sw;
        	    			if(swHys.length > 0){
        	    				for(var h = 0; h<swHys.length; h++){
        	    					var temp = swHys[h];
        	    					var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var hours=sdate.getHours();
        	    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
        	    				    var tipsId = 'swhy'+h;
        	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
        	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
    	    					
        	    				}
        	    			}
        	    		}
        	    	}
        	    }
         }
         // 加载课程表
         if(isCurrilum){
        	 var currilum = json.currilum;
        	    if(currilum!="" && currilum!=null){
        	    	var kc = null;
        	        kc = currilum[weekIndex].kc;
        	        if(kc!=null){
        	        	 var kcdetail = kc.kcDetail;
        	        	 for(var d=0; d<kcdetail.length;d++){
        	  				var dtmp = kcdetail[d];
        	  				if(dtmp.time == "sw"){
        	  					var kcId = 'kc'+d;
            	  				var jsName = dtmp.jsmc;
            	 				if(jsName == null){
            	 					jsName = '';
            	 				}
            	  				 var obj="{\'kcName\':\'"+dtmp.kcmc+"\',\'teacher\':\'"+dtmp.jzgxm+"\',\'time\':\'"+dtmp.kcjc+"节\',\'location\':\'"+dtmp.jsmc+"\'}";
            	  	     		str+='<li id="'+kcId+'"  onmouseleave="closekctips(\''+kcId+'\')" onmouseenter="kctips('+obj+',\''+kcId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">课'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
            	  				   +dtmp.kcmc+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+dtmp.kcjc+'节</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+jsName+'</div></li>'; 
        	  				}
        	  			}
        	     	 }
        	    }
         }
     }	
     // 下午
     if(type == 2){
    	// 上午；
    	 // 获取个人：
    	 var persons = json.person;
         if(isPerson){
        	      var arr=persons.data;
				  var event=arr[weekIndex].events;
				  for(var j=0;j<event.length;j++){
					  var startTime=event[j].startTime;
					  var endTime=event[j].endTime;
					  var sdate=parseDate(startTime);
					  var edate=parseDate(endTime);
					  var hours=sdate.getHours();
					  
					  var color="#99c168";
					  var content=event[j].title;
					  if(content.length>50){
						  content = content.replace(/\n/g,"");
						  content=content.substring(0,50)+"...";
					  }
					  if(hours>12 && hours<=18){
						  if(categoryids!=""){
							  var  contents = event[j].content.replace(/\n/g,"<br/>");
							  var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
							  str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
						   }
					  }
				  }
			 
         }
         // 加载会议
         if(isMeetting){
        	 var metting = json.metting;
        	    if(metting != "" && metting != null){
        	    	var hy = metting.hyDetail;
        	    	if(hy != undefined && hy != null){
        	    		var hyDetail = hy[weekIndex];
        	    		var swHys = "", xwHys = "", wjHys = "";
        	    		var swHy = "", xwHy = "", wjHy = "";
        	    		if(hyDetail != null && hyDetail != undefined){
        	    			// 上午会议
        	    			swHys = hyDetail.xw;
        	    			if(swHys.length > 0){
        	    				for(var h = 0; h<swHys.length; h++){
        	    					var temp = swHys[h];
        	    					var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var hours=sdate.getHours();
        	    					var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
        	    				    var tipsId = 'swhy'+h;
        	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
        	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
    	    				 	
        	    				}
        	    			}
        	    		}
        	    	}
        	    }
         }
         // 加载课程表
         if(isCurrilum){
        	 var currilum = json.currilum;
        	    if(currilum!="" && currilum!=null){
        	    	var kc = null;
        	        kc = currilum[weekIndex].kc;
        	        if(kc!=null){
        	        	 var kcdetail = kc.kcDetail;
        	        	 for(var d=0; d<kcdetail.length;d++){
        	  				var dtmp = kcdetail[d];
        	  				if(dtmp.time == "xw"){
        	  					var kcId = 'kc'+d;
            	  				var jsName = dtmp.jsmc;
            	 				if(jsName == null){
            	 					jsName = '';
            	 				}
            	  				 var obj="{\'kcName\':\'"+dtmp.kcmc+"\',\'teacher\':\'"+dtmp.jzgxm+"\',\'time\':\'"+dtmp.kcjc+"节\',\'location\':\'"+dtmp.jsmc+"\'}";
            	  	     		str+='<li id="'+kcId+'"  onmouseleave="closekctips(\''+kcId+'\')" onmouseenter="kctips('+obj+',\''+kcId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">课'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
            	  				   +dtmp.kcmc+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+dtmp.kcjc+'节</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+jsName+'</div></li>'; 
        	  				}
        	  			}
        	     	 }
        	    }
         }
     
     }
     
     // 晚上
     if(type == 3){
    	// 上午；
    	 // 获取个人：
    	 var persons = json.person;
         if(isPerson){
        	      var arr=persons.data;
				  var event=arr[weekIndex].events;
				  for(var j=0;j<event.length;j++){
					  var startTime=event[j].startTime;
					  var endTime=event[j].endTime;
					  var sdate=parseDate(startTime);
					  var edate=parseDate(endTime);
					  var hours=sdate.getHours();
					  
					  var color="#99c168";
					  var content=event[j].title;
					  if(content.length>50){
						  content = content.replace(/\n/g,"");
						  content=content.substring(0,50)+"...";
					  }
					  if(hours>18 || hours<1){
						  if(categoryids!=""){
							  var  contents = event[j].content.replace(/\n/g,"<br/>");
							  var obj="{\"id\":"+event[j].id+",\"title\":\""+event[j].title+"\",\"content\":\""+contents+"\",\"beginTime\":\""+event[j].startTime+"\",\"location\":\""+event[j].location+"\",\"endTime\":\""+event[j].endTime+"\"}";
							  str+='<li onmouseleave="closetips('+event[j].id+')" onmouseenter=\'tips('+obj+',"li")\' id="li'+event[j].id+'" class="event-item" ><div style="background-color:'+color+';display:inline-block;width:2.5%;">'+event[j].shortName.substring(0,1)+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +event[j].title+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time"  style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;">'
							  +'<i class="glyphicon glyphicon-map-marker"  style="color:#c2c2c2;padding-right:5px;"></i>'+event[j].location+'</div></li>';
						   }
					  }
				  }
			 
         }
         // 加载会议
         if(isMeetting){
        	 var metting = json.metting;
        	    if(metting != "" && metting != null){
        	    	var hy = metting.hyDetail;
        	    	if(hy != undefined && hy != null){
        	    		var hyDetail = hy[weekIndex];
        	    		var swHys = "", xwHys = "", wjHys = "";
        	    		var swHy = "", xwHy = "", wjHy = "";
        	    		if(hyDetail != null && hyDetail != undefined){
        	    			
        	    			swHys = hyDetail.wj;
        	    			if(swHys.length > 0){
        	    				for(var h = 0; h<swHys.length; h++){
        	    					var temp = swHys[h];
        	    					var sdate=parseDate(temp.hykssj+":00");
        	    					var edate=parseDate(temp.hyjssj+":00");
        	    					var hours=sdate.getHours();
        	    						var obj="{\'name\':\'"+temp.hymc+"\',\'location\':\'"+temp.xccd+"\',\'beginTime\':\'"+temp.hykssj+"\',\'endTime\':\'"+temp.hyjssj+"\'}";
            	    				    var tipsId = 'swhy'+h;
            	    					str+='<li id="'+tipsId+'" onmouseleave="closehytipsIndex(\''+tipsId+'\')" onmouseenter="hytips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">会'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;"><a href="javascript:openWindows_two(\'会议详情\','+temp.id+',993,544)">'
            	    	  				   +temp.hymc+'</a></div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+pad(sdate.getHours(),2)+":"+pad(sdate.getMinutes(),2)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+temp.xccd+'</div></li>'; 
        	    				}
        	    			}
        	    		}
        	    	}
        	    }
         }
         // 加载课程表
         if(isCurrilum){
        	 var currilum = json.currilum;
        	    if(currilum!="" && currilum!=null){
        	    	var kc = null;
        	        kc = currilum[weekIndex].kc;
        	        if(kc!=null){
        	        	 var kcdetail = kc.kcDetail;
        	        	 for(var d=0; d<kcdetail.length;d++){
        	  				var dtmp = kcdetail[d];
        	  				if(dtmp.time == "wj"){
        	  					var kcId = 'kc'+d;
            	  				var jsName = dtmp.jsmc;
            	 				if(jsName == null){
            	 					jsName = '';
            	 				}
            	  				 var obj="{\'kcName\':\'"+dtmp.kcmc+"\',\'teacher\':\'"+dtmp.jzgxm+"\',\'time\':\'"+dtmp.kcjc+"节\',\'location\':\'"+dtmp.jsmc+"\'}";
            	  	     		str+='<li id="'+kcId+'"  onmouseleave="closekctips(\''+kcId+'\')" onmouseenter="kctips('+obj+',\''+kcId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">课'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
            	  				   +dtmp.kcmc+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+dtmp.kcjc+'节</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+jsName+'</div></li>'; 
        	  				}
        	  			}
        	     	 }
        	    }
         }
     
     }
     $("#stacked").html(str);
     
 }
 
//获取当天的活动列表
 function getSelHdList(selectDay,type){
	 if(isHd){
		 	$.ajax({
		 		type : "get",
		 		dataType : 'jsonp',
		 		jsonp : "callback",
		 		url : 'http://work.gench.edu.cn/default/portalone/hd/ajaxRCHDXcDetails.jsp',
		 		data : {
		 			time : selectDay
		 		},
		 		success : function(data) {
		 			if(data.result == 1){
		 				var str='';
		 				var hdList = data.data;
		 				if(hdList.length > 0){
		 					var index = 0;
		 					for(var i =0; i<hdList.length;i++){
		 						var htemp = hdList[i];
		 						var xcList = htemp.xcs;
		 						if(xcList.length>0){
		 							for(var j = 0; j<xcList.length; j++){
		 								var xtemp = xcList[j];
		 								var hdName = htemp.HDMC;
		 								var sdate=parseDate(xtemp.KSSJ+":00");
		 								var edate=parseDate(xtemp.JSSJ+":00");
		 								var start = datetostr(sdate);
		 								var end = datetostr(edate);
		 								var hours=sdate.getHours();
										var endHours = edate.getHours();
		 								if(type == 1){// 上午
											if(selectDay>start && end>selectDay){// 跨天的
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
		 									}else if(selectDay==start && end>selectDay){// 从今天开始跨天
											      if(hours<=12 && hours>=0){
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
			 	    	    					}			
		 									}else if(selectDay==end && start<selectDay){// 今天是跨天的最后一天
												 if(endHours>=0){
														var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
														var tipsId = 'hd'+index;
														str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
														   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
														index++;
												  }
											}else{ // 不跨天
												if(hours<=12 && hours>=0){
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
			 	    	    					}
											}		
		 								}
		 								if(type == 2){ // 下午
		 									if(selectDay>start && end>selectDay){// 跨天的
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
		 									}else if(selectDay==start && end>selectDay){// 从今天开始跨天
											        if(hours<=18){
														var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
														var tipsId = 'hd'+index;
														str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
															+hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
														index++;
													}			 													 										
		 									}else if(selectDay==end && start<selectDay){// 今天是跨天的最后一天
												 if(endHours>12){
														var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
														var tipsId = 'hd'+index;
														str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
														   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
														index++;
												  }
											}else if(selectDay==end && start == selectDay){ // 不跨天
												if(endHours>12 && endHours<=18){
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
			 	    	    					}
											}
		 								}
		 								if(type == 3){ // 晚上	
                                      //      alert('selectDay: '+selectDay+'---start: '+start+'--end: '+end+'--hours: '+hours);	
                                      									  
		 									if(selectDay>start && end>selectDay){// 跨天的												 										
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;			 	    	    					
		 									}else if(selectDay==start && end>selectDay){// 从今天开始跨天
											        if(hours<=23){
														var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
														var tipsId = 'hd'+index;
														str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
														   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
														index++;
													}		
		 									}else if(selectDay==end && start<selectDay){// 今天是跨天的最后一天
												 if(endHours>18 && endHours<23){
														var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
														var tipsId = 'hd'+index;
														str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
														   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
														index++;
												  }
											}else if(selectDay==end && start == selectDay){ // 不跨天
												if(endHours>18 && endHours<23){
			 										var obj="{\'name\':\'"+hdName+"\',\'location\':\'"+xtemp.CDMC+"\',\'beginTime\':\'"+xtemp.KSSJ+"\',\'hoster\':\'"+xtemp.FQR+"\',\'endTime\':\'"+xtemp.JSSJ+"\'}";
			 	 	 							    var tipsId = 'hd'+index;
			 	 	 								str+='<li id="'+tipsId+'" onmouseleave="closehdtipsIndex(\''+tipsId+'\')" onmouseenter="hdtips('+obj+',\''+tipsId+'\')" class="event-item" ><div style="background-color:#cf2a34;display:inline-block;width:2.5%;">活'+'</div><div style="width:24%;background-color:#fff;color:black;text-align:left;margin:0px;">'
			 	 	 				  				   +hdName+'</div><div style="display:inline-block;background-color:#fff;color:#393939;width:24%;margin:0px;text-align:left;"><i class="glyphicon glyphicon-time" style="color:#c2c2c2;padding-right:5px;"></i>'+datetodaystr(sdate)+"-"+datetodaystr(edate)+'</div> <div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-map-marker" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.CDMC+'</div><div style="display:inline-block;background-color:#fff;width:24%;margin:0px;color:#393939;text-align:left;"><i class="glyphicon glyphicon-education" style="color:#c2c2c2;padding-right:5px;"></i>'+xtemp.FQR+'</div></li>'; 
			 	 	 								index++;
			 	    	    					}
											}
		 								}
		 							}
		 						}
		 					}
		 				}
		 				$('#hdList').html(str);
		 				layer.closeAll("loading");
		 			}else{
		 				layer.closeAll("loading");
		 				/*layer.alert(data.reason, {
		 					closeBtn : 0,
		 					title : '提示',
		 					shade : 0.1
		 				});*/
		 			}
		 		}
		 	});
	 }else{
		 $('#hdList').html('');
		 layer.closeAll("loading");
	 }
 }
 /****************************************周表表格点击事件***********************************/