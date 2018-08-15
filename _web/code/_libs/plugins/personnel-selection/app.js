   /**
    * 穿梭框组件
  */
  function Transfer() {
     this.targetList = [];
     this.originList = [];
     this.init();
  }
  var T = Transfer.prototype;

  /**
    * 初始化函数，初始化动作这里执行
  */
  T.init = function () {
    // 使用iCkeck美化checkbox
    this.beauteCheckBox();
    this.moveHandle();
    // checkbox美化比较慢，将checkbox绑定的事件放在下一次的事件循环中
    (function (that) {
      setTimeout(function () {
         that.toggleAllCheck();
      }, 0)
    })(this)
  }
  /**
    * 从外部将源列表的数据注入组件
  */
  T.setData = function (arr, el) {
    if (!arr) return;
    if (el == '.origin-list .list-content') {
       this.originList = arr;
    }
     if (el == '.target-list .list-content' && arr != "") {
      this.targetList = arr;
    }
    for(var i = 0;i < this.targetList.length;i++){
      for(var j = 0;j < this.originList.length;j++){
        if(this.targetList[i].id == this.originList[j].id ){
          this.originList.splice(j,1)
        }
      }
    }
    this.renderList(this.originList, '.origin-list .list-content');
    this.renderList(this.targetList, '.target-list .list-content');
  }

  /**
    * 切换全选/全不选
  */
  T.toggleAllCheck = function () {
    var _this = this;
    $(document).on('ifChecked', '.origin-list-checkAll, .target-list-checkAll', function () {
       var $this = $(this);
       var $listsCheckbox = $this.parents('.list-box').find('.list-content-item > label');
       $listsCheckbox.iCheck('check');
    })
    $(document).on('ifUnchecked', '.origin-list-checkAll, .target-list-checkAll', function () {
       var $this = $(this);
       var $listsCheckbox = $this.parents('.list-box').find('.list-content-item > label');
       $listsCheckbox.iCheck('uncheck');
    })
  }
  /**
    * 列表渲染
  */
  T.renderList = function (arr, el) {
    if (!arr || !arr.length) {
       $(el).html("");
    };
    var ret = ''
    $.each(arr, function (index, value) {
      ret += '<li class="list-content-item">\
                <label>\
                  <input class="transfer-checkbox" type="checkbox"  value="' + value.id + '">\
                  <span class="text">' + value.name + '</span>\
                </label>\
              </li>';
    });
    $(el).html(ret);
     // 美化checkbox
    this.beauteCheckBox();
    this.canMove();
    $('.origin-list-checkAll, .target-list-checkAll').iCheck('uncheck');
     //图标显示处理
    $('.origin-list-checkAll, .target-list-checkAll').hover(function(e){
      $('.origin-list .list-content .list-content-item').find("img").remove();
      $('.target-list .list-content .list-content-item').find("img").remove();
    })
    $('.origin-list .list-content .list-content-item label').mouseenter(function (e) {
      if ($(this).parent().find(".add").length == 0) {
        $(this).parent().append('<img class="add" data-tool="right" style="float:right;position:relative;top:8px;cursor:pointer;" src="img/add.png">');
        $(this).parent().siblings().find(".add").remove();
      }
      e.stopPropagation();
    })
    $('.origin-list .list-content .list-content-item').mouseenter(function (e) {
       $('.origin-list .list-content .list-content-item').find(".add").remove();
       if ($(this).find(".add").length == 0) {
         $(this).append('<img class="add" data-tool="right" style="float:right;position:relative;top:8px;cursor:pointer;" src="img/add.png">');
         $(this).parent().siblings().find(".reduce").remove();
       }
       e.stopPropagation();
    });

    $('.origin-list .list-content .list-content-item').mouseleave(function (e) {
      if ($(this).find(".add").length > 0) {
        $(this).find(".add").remove();
      }
      e.stopPropagation();
    })

    $('.target-list .list-content .list-content-item label').mouseenter(function (e) {
      if ($(this).parent().find(".reduce").length == 0) {
        $(this).parent().append('<img class="reduce" data-tool="left" style="float:right;position:relative;top:8px;cursor:pointer;" src="img/reduce.png"/>');
        $(this).parent().siblings().find(".reduce").remove();
      }
      e.stopPropagation();
    });

    $('.target-list .list-content .list-content-item').mouseenter(function (e) {
      $('.origin-list .list-content .list-content-item').find(".add").remove();
      if ($(this).find(".reduce").length == 0) {
         $(this).append('<img class="reduce" data-tool="left" style="float:right;position:relative;top:8px;cursor:pointer;" src="img/reduce.png"/>');
         $(this).siblings().find(".reduce").remove();
      }
      e.stopPropagation();
    });

    $('.target-list .list-content .list-content-item').mouseleave(function (e) {
      if ($(this).find(".reduce").length > 0) {
        $(this).find(".reduce").remove();
      }
      e.stopPropagation();
    })
  }

  /**
    * 点击按钮移动节点的事件回调
  */
  T.moveHandle = function () {
    var _this = this;
    $(document).on('click', '.btn-right, .btn-left', function () {
       var dir = $(this).data('tool');
       dir = dir[0].toUpperCase() + dir.substr(1);
       _this['move' + dir]();
    });
    //单个右移
    $(document).on('click', '.add', function () {
       _this.moveOneRight(this)
    });
    //单个左移
    $(document).on('click', '.reduce', function () {
       _this.moveOneLeft(this);
    });
  }
  /**
    * 单个左移
  */
  T.moveOneLeft = function (e) {
    var _this = this;
    var obj = {};
    obj.name = $(e).parent().find("span").text();
    obj.id = $(e).parent().find('input').val();
    _this.originList.push(obj);
    for (var i = 0; i < _this.targetList.length; i++) {
      if (_this.targetList[i].id == obj.id) {
         _this.targetList.splice(i, 1)
      }
    }
    var hash = {};
    _this.originList = _this.originList.reduce(function (item, next) {
       hash[next.id] ? '' : hash[next.id] = true && item.push(next);
       return item
    }, [])
    _this.setData(_this.originList, '.origin-list .list-content');
  }

  /**
    * 左移
  */
  T.moveLeft = function () {
    var _this = this;
    $('.target-list .list-content .checked').each(function () {
      var obj = {};
      obj.name = $(this).next("span").text();
      obj.id = $(this).find('input').val();
      _this.originList.push(obj);
      for (var i = 0; i < _this.targetList.length; i++) {
        if (_this.targetList[i].id == obj.id) {
           _this.targetList.splice(i, 1)
        }
      }
    });
    var hash = {};
    _this.originList = _this.originList.reduce(function (item, next) {
       hash[next.id] ? '' : hash[next.id] = true && item.push(next);
       return item
    }, [])
    _this.setData(_this.originList, '.origin-list .list-content');
  }

  /**
    * 单个右移
  */
  T.moveOneRight = function (e) {
    var _this = this;
    var obj = {};
    obj.name = $(e).parent().find("span").text();
    obj.id = $(e).parent().find('input').val();
    _this.targetList.push(obj);
    for (var i = 0; i < _this.originList.length; i++) {
      if (_this.originList[i].id == obj.id) {
         _this.originList.splice(i, 1)
      }
    }
    var hash = {};
    _this.targetList = _this.targetList.reduce(function (item, next) {
       hash[next.id] ? '' : hash[next.id] = true && item.push(next);
       return item
    }, [])
    _this.setData(_this.targetList, '.target-list .list-content');
  }

  /**
    * 右移
  */
  T.moveRight = function () {
    var _this = this;
    $('.origin-list .list-content .checked').each(function () {
      var obj = {};
      obj.name = $(this).next("span").text();
      obj.id = $(this).find('input').val();
      _this.targetList.push(obj);
      for (var i = 0; i < _this.originList.length; i++) {
        if (_this.originList[i].id == obj.id) {
           _this.originList.splice(i, 1)
        }
      }
    });
    var hash = {};
    _this.targetList = _this.targetList.reduce(function (item, next) {
       hash[next.id] ? '' : hash[next.id] = true && item.push(next);
       return item
    }, [])
    _this.setData(_this.targetList, '.target-list .list-content');
  }

  /**
  * 检查是否可以左移或者右移了
  */
  T.canMove = function () {
    var $btnLeft = $('.btn-left');
    var $btnRight = $('.btn-right');
    if (this.targetList.length) {
       $btnLeft.prop('disabled', false);
    } else {
       $btnLeft.prop('disabled', true)
    }
    if (this.originList.length) {
       $btnRight.prop('disabled', false);
    } else {
       $btnRight.prop('disabled', true)
    }
  }

  T.beauteCheckBox = function () {
    var check = $('.transfer-checkbox').iCheck({
       checkboxClass: 'icheckbox_flat-blue',
       radioClass: 'iradio_flat-blue'
    });
  }
  //实例
  var t = new Transfer();
  //点击人员选择
  $(document).on("click","#username",function(e){
    var targetdata;
    if($("#selected-value").val() != ""){
      targetdata = JSON.parse($("#selected-value").val());
    }else{
      targetdata = "";
    }
    t.setData(targetdata,'.target-list .list-content');
  })
   //提交人员信息
  $(document).on("click","#sure",function(){
    var username1 = "";
    var userid1 = "";
    var username,userid;
    var valuearr = [];
    if($(".target-list .list-content .list-content-item").length != 0){
       for(var i = 0;i < $(".target-list .list-content .list-content-item").length;i++){
         var obj = {};
         obj.id = $(".target-list .list-content .list-content-item:eq("+i+")").find("input").val();
         obj.name = $(".target-list .list-content .list-content-item:eq("+i+")").find("span").text();
         valuearr.push(obj);
         userid1 += $(".target-list .list-content .list-content-item:eq("+i+")").find("input").val() + ",";
         username1 += $(".target-list .list-content .list-content-item:eq("+i+")").find("span").text() + ","
      }
      username = username1.substr(0,username1.length-1);
      userid = userid1.substr(0,userid1.length-1);
      $("#users").val(username);
      $("#users").attr("data-id",userid);
      $("#selected-value").val(JSON.stringify(valuearr))
      $('#people-selector').modal('hide');
    }else{
      $("#users").val("");
      $("#users").attr("data-id","");
      $("#selected-value").val(JSON.stringify(""))
      $('#people-selector').modal('hide');
    }
  })