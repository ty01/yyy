(function($) {
  'use strict';

  $.fn.extend({
    zmaxlength: function(options, callback) {
      var el = $(this),
        _b = $(this).next(".tatext").find("span"),
        _ztext= $(this).next(".tatext").find("b"),
        _maxlength = options.cusumemax;
      $(this).next(".tatext").css({
        "text-align":"right"
      })
      _ztext.text(0);
      _b.text("/"+_maxlength);
      console.debug(el,_b,_ztext);

      function zwpd(val) { //全角字符判断函数
        var hxc_len = 0; //声明变量并赋值
        var qjreg = /[^\x00-\xff]/ig; //声明全角正则表达式
        for (var i = 0; i < val.length; i++) { //建立for循环，为了判断每个输入的字符
          if (val[i].match(qjreg) != null) { //如果输入的字符是全角字符（=null说明是半角）则字符数为2
            hxc_len += 2;
          } else { //否的话为1
            hxc_len += 1;
          };
        };
        return hxc_len; //弹出该值
      };

      function max_content(val, max) { //函数：弹出textarea内容在规定长度下的值
        var return_val = ""; //声明并赋值
        var count = 0;
        var qjreg = /[^\x00-\xff]/ig;
        for (var i = 0; i < val.length; i++) { //与上面类似不赘述
          if (val[i].match(qjreg) != null) {
            count += 2;
          } else {
            count += 1;
          };
          if (count > max) { //当数字大约最大字符数时，跳出该循环
            break;
          };
          return_val += val[i]; //值自增
        };
        return return_val; //弹出值
      };

      el.on('input', function() { //为textarea文本输入框绑定事件
        var hxc_val = $(this).val(); //获取textarea的值
        var hxc_text = $(this).next(".tatext").find("b");
        var b_count = zwpd(hxc_val); //获取函数zwpd的值
        if (b_count == 0) { //如果textarea没有内容，则输出为0
          hxc_text.text(0);
        } else if (b_count <= _maxlength) { //如果textarea的字符数小于等于最大限制字符数，则正常输出值
          hxc_text.text(b_count);
        } else { //如果textarea的字符数大于最大值，则最大限制字符数打印出，内容仅取textarea中最大字符数对应的内容
          hxc_text.text(_maxlength);
          $(this).val(max_content(hxc_val, _maxlength));
        };
        if (b_count >= _maxlength - 10) { //还差10个字符数达到最大限制字符数时，红色高亮提醒用户
          hxc_text.css("color", "red");
        } else { //反之不提醒
          hxc_text.css("color", "#000");
        };
      });

    }
  })
}(jQuery));