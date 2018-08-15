function ZTree(option) {
    var rightClickHtml = '<div id="rMenu">\
                            <ul>\
                                <li id="m_add">增加</li>\
                                <li id="m_del" >删除</li>\
                                <li id="m_edit">编辑</li>\
                            </ul>\
                        </div>';

    var textStyle = 'div#rMenu {position:absolute; visibility:hidden; top:0; background-color: #555;text-align: left;padding: 2px;}div#rMenu ul li{margin: 1px 0;padding: 0 5px;cursor: pointer;list-style: none outside none;background-color: #DFDFDF;}div#rMenu ul li:hover{background:#a09e9e;}ul{margin:0;padding:0}';
    var styleLoadCount = 0,
        addCount = 1,
        self = this;
    var IDMark_A = "_a";

    function ajaxInit(option) {
        var config = {
            url: '',
            type: 'get',
            data: {},
            success: function (data) {

            },
            error: function (err) {

            }
        };

        var settings = $.extend(true, config, option);

        $.ajax(settings);

    }
    // 添加样式，并且绑定事件
    function showMenu(event, treeId, treeNode) {
        if (styleLoadCount === 0) loadStyleString(textStyle);
    }
    // 按钮显示位置
    function showRMenu(type, x, y, treeNode) {
        var divMenu = $('div#rMenu');
        if (divMenu.length === 0) {
            $('body').append(rightClickHtml);
        }
        rMenu = $("#rMenu");

        y += document.body.scrollTop;
        x += document.body.scrollLeft;
        if (type == 'root') {
            rMenu.hide()
        } else {
            if (treeNode.isParent) {
                $('#m_add').show()
            } else {
                $('#m_add').hide()
            }
        }

        rMenu.css({
            "top": y + "px",
            "left": x + "px",
            "visibility": "visible"
        });

        $('body').on("mousedown", onBodyMouseDown);
    }
    // 隐藏菜单
    function onBodyMouseDown(event) {
        event.stopPropagation();
        var rMenu = $('div#rMenu');
        console.log()
        if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
            rMenu.css({
                "visibility": "hidden"
            });
        }
    }
    // 动态添加css样式
    function loadStyleString(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        var head = document.getElementsByTagName("head")[0];
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        head.appendChild(style);
        styleLoadCount++;
    }

    // 隐藏右键菜单
    function hideRMenu() {
        if (rMenu) rMenu.css({
            "visibility": "hidden"
        });
        $("body").unbind("mousedown", onBodyMouseDown);
    }
    // 递归获取名称
    function getNewNameFile(treeNode, name) {
        var newName;
        var childrens = treeNode.children;
        if (childrens) {
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].name == name) {
                    newName = 'new File' + (addCount++);
                    return getNewNameFile(treeNode, newName);
                }
            }
        }
        return name;
    }

    $(document).on('click', '#m_add', function (e) {
        addCount = 1;
        e.stopPropagation()
        var zTree = $.fn.zTree.getZTreeObj('treeDemo');
        hideRMenu();
        var newNode = {
            name: getNewNameFile(zTree.getSelectedNodes()[0], 'new File')
        };

        if (zTree.getSelectedNodes()[0]) {
            ajaxInit({
                url: option.isEdit.urlData.addData.url,
                type: option.isEdit.urlData.addData.type,
                data: {
                    id: zTree.getSelectedNodes()[0].id,
                    name: newNode.name
                },
                success: function (data) {
                    if (data.resultCode === 0) {
                        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
                    }
                }
            })
        }
    })

    $(document).on('click', '#m_del', function (e) {
        e.stopPropagation()
        hideRMenu();
        var zTree = $.fn.zTree.getZTreeObj('treeDemo');

        var nodes = zTree.getSelectedNodes();
        ajaxInit({
            url: option.isEdit.urlData.deleteData.url,
            type: option.isEdit.urlData.deleteData.type,
            data: {
                id: nodes.id,
                node: nodes
            },
            success: function (data) {
                if (data.resultCode === 0) {
                    zTree.removeNode(nodes[0]);
                    //alert(data.errorMsg);
                }
            }
        })
    })

    $(document).on('click', '#m_edit', function (e) {
        e.stopPropagation()
        hideRMenu();
        var zTree = $.fn.zTree.getZTreeObj('treeDemo');
        zTree.editName(zTree.getSelectedNodes()[0]);
    })
    // zTree初始化数据
    function dataFilter(treeId, parentNode, responseData) {
        var nodes = [],
            childNodes,
            iconFloder,
            iconFile;
        if (option.icon) {
            if (option.icon.floder) {
                iconFloder = {
                    parentIcon: option.icon.floder.parentIcon,
                    parentIconOpen: option.icon.floder.parentIconOpen,
                    parentIconClose: option.icon.floder.parentIconClose
                }
            }
            if (option.icon.file) {
                iconFile = option.icon.file.icon;
            }
        }
        if (responseData.resultCode === 0) {

            childNodes = responseData.result.data;
            if (!childNodes) return null;

            for (var i = 0, l = childNodes.length; i < l; i++) {
                childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
                if (childNodes[i].isParent) {
                    nodes.push({
                        id: childNodes[i].id,
                        name: childNodes[i].name,
                        open: childNodes[i].open,
                        isParent: childNodes[i].isParent,
                        data: childNodes[i],
                        icon: iconFloder ? iconFloder.parentIcon : '',
                        iconOpen: iconFloder ? iconFloder.parentIconOpen : '',
                        iconClose: iconFloder ? iconFloder.parentIconClose : ''
                    })
                } else {
                    nodes.push({
                        id: childNodes[i].id,
                        name: childNodes[i].name,
                        open: childNodes[i].open,
                        isParent: childNodes[i].isParent,
                        data: childNodes[i],
                        icon: iconFile ? iconFile : ''
                    })
                }

            }

        }

        return nodes;
    }
    // 拖拽 -- 拖拽上方
    function dropPrev(treeId, nodes, targetNode) {
        var parentNode = targetNode.getParentNode();
        if (option.drog.siblingDrag) {
            for (var i = 0, l = curDragNodes.length; i < l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode()) {
                    return false;
                }
            }
        }

        return true;
    }
    // 拖拽 -- 拖拽中间（子节点变成父节点）
    function dropInner(treeId, nodes, targetNode) {
        return !(targetNode && targetNode.isParent !== true);
    }
    // 拖拽 -- 拖拽下方
    function dropNext(treeId, nodes, targetNode) {
        var parentNode = targetNode.getParentNode();
        if (option.drog.siblingDrag) {
            for (var i = 0, l = curDragNodes.length; i < l; i++) {
                var curPNode = curDragNodes[i].getParentNode();
                if (curPNode && curPNode !== targetNode.getParentNode()) {
                    return false;
                }
            }
        }

        return true;
    }
    // 拖拽 -- 拖拽开始之前
    function beforeDrag(treeId, treeNodes) {
        curDragNodes = treeNodes;
        return true;
    }
    // 暴露点击事件
    function onClick(event, treeId, treeNode) {
        var ajaxData = treeNode.data;
        if (option.onClick) option.onClick(event, treeId, treeNode, ajaxData);
    }

    function onRename(event, treeId, treeNode, isCancel) {
        ajaxInit({
            url: option.isEdit.urlData.editData.url,
            type: option.isEdit.urlData.editData.type,
            data: {
                id: treeNode.id,
                newname: treeNode.name
            },
            success: function (data) {
                if (data.resultCode === 0) {
                    //alert(data.errorMsg);
                }
            }
        })
    }

    function onDrop(event, treeId, treeNodes, targetNode, moveType) {
        $.ajax({
            url: option.drog.drogAsync.url,
            data: {
                targetNode: targetNode,
                drogNode: treeNodes
            },
            type: option.drog.drogAsync.url.type,
            success: function (data) {
                if (data.resultCode === 0) {
                    //alert(data.result);
                }
            }
        })
    }

    function onCheck(e, treeId, treeNode) {
        var ajaxData = treeNode.data;
        if (option.onCheck) {
            option.onCheck(e, treeId, treeNode, ajaxData);
        }
    }

    function addDiyDom(treeId, treeNode) {
        var aObj = $("#" + treeNode.tId + IDMark_A);
        if (treeNode.isParent) {
            var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" + treeNode.id + "' onfocus='this.blur();'></input>";
            aObj.before(editStr);
            var btn = $("#checkbox_" + treeNode.id);
            if (btn) btn.bind("change", function () {
                if (option.allCheckBing) {
                    option.allCheckBing.allCheckboxBind ? option.allCheckBing.allCheckboxBind(treeNode, btn) : null;
                }
            });
        } else {
            var id = treeNode.getParentNode() ? treeNode.getParentNode().id : 'root'
            var editStr = "<input type='radio' class='radioBtn' id='radio_" + treeNode.id + "' name='radio_" + id + "' onfocus='this.blur();'></input>";
            aObj.before(editStr);
            var btn = $("#radio_" + treeNode.id);
            if (btn) btn.bind("click", function () {
                if (option.allCheckBing) {
                    option.allCheckBing.allRadioBind ? option.allCheckBing.allRadioBind(treeNode, btn) : null;
                }
            });
        }
    }

    function onAsyncSuccess(event, treeId, treeNode, msg) {
    }

    function throttle(fn,context,delay,text,mustApplyTime){
        clearTimeout(fn.timer);
        fn._cur=Date.now();  //记录当前时间
       
        if(!fn._start){      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
          fn._start=fn._cur;
        }
        if(fn._cur-fn._start>mustApplyTime){             //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
           fn.call(context,text);
           fn._start=fn._cur;
        }else{
          fn.timer=setTimeout(function(){
          fn.call(context,text);
          },delay);
        }
      }

    function searchAjax(value) {
        var ztree = document.getElementById('treeDemo');
        var search = document.getElementById('searchResult');
        $.ajax({
            url: option.search.ajax.url,
            type: 'get',
            data: {
                displayName: value
            },
            success: function (data) {
                ztree.style.display = 'none';
                search.style.display = 'block';
                console.log(data);
                if (data.resultCode === 0) {
                    var list = data.result.data;
                    var html = '<ul id="list">';
                    for (var i = 0; i < list.length; i++) {
                        html += '<li class="list-li">';
                        html += '<span>'+ list[i].moduleName +'</span>';
                        html += '<ul>';
                        for (var j = 0; j < list[i].list.length; j++) {
                            html += '<li data-id="'+ list[i].list[j].fileId +'"><img src="">'+ list[i].list[j].fileName +'</li>'
                        }
                        html += '</ul>';
                        html += '</li>';
                    }
                    html += '</ul>';
                }
                search.innerHTML = html;
                $('#list').on('click', function (e){
                    if (e.target.nodeName === 'LI') {
                        option.search.onClick(e, e.target);
                    }
                });
            }
        })
    }
    var _ztree = (function (option) {
        var edit = { // ajax 请求
            enable: true,
            url: '../data/ztree.json',
            type: 'get',
            otherParam: [],
            autoParam: [],
            dataFilter: dataFilter
        };
        var content = document.getElementById('ztree-content');
        var ztreeDiv = document.createElement('div');
        ztreeDiv.id = option.el;
        ztreeDiv.className= 'ztree';
        content.appendChild(ztreeDiv);

        var newCount = 0;
        /**
         * async ztree 初始化变量
         * curDragNodes 拖拽的目标节点
         * isDrog   判断是否开始拖拽
         * isEdit   判断是否开启编辑功能
         * view     开启编辑功能的初始化参数
         * newView  开启编辑功能 不同样式的初始化参数
         */
        var async = $.extend({}, edit, option.async),
            curDragNodes,
            isDrog,
            isEdit,
            view,
            newView,
            radioType,
            check,
            allCheckState;
        // 判断是否需要拖拽
        if (option.drog) {
            isDrog = option.drog.openDrog ? option.drog.openDrog : false
        }
        // 判断是否需要编辑
        view = {
            addHoverDom: function () {
                return null
            },
            removeHoverDom: function () {
                return null
            },
            onRightClick: function (event, treeId, treeNode) {
                return null
            }
        }
        // console.log(option.isEdit)
        if (option.isEdit && option.isEdit.openEdit) {
            if (option.isEdit.editStyle === 1) {
                // 样式一
                newView = {
                    addHoverDom: function (treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var sObj = $("#" + treeNode.tId + "_span");

                        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId + "_add").length > 0) return;
                        if (treeNode.editNameFlag || $("#deleteBtn_" + treeNode.tId + "_delete").length > 0) return;
                        if (treeNode.editNameFlag || $("#editBtn_" + treeNode.tId + "_edit").length > 0) return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                            "_add' title='add node' onfocus='this.blur();'></span>";

                        var deleteStr = "<span class='button remove' id='deleteBtn_" + treeNode.tId +
                            "_delete' title='remove node' onfocus='this.blur();'></span>";

                        var editStr = "<span class='button edit' id='editBtn_" + treeNode.tId +
                            "_edit' title='edit node' onfocus='this.blur();'></span>";

                        sObj.after(deleteStr);
                        sObj.after(editStr);
                        if (treeNode.isParent) {
                            sObj.after(addStr);

                        }


                        var addBtn = $("#addBtn_" + treeNode.tId + "_add");
                        var deleteBtn = $("#deleteBtn_" + treeNode.tId + "_delete");
                        var editBtn = $("#editBtn_" + treeNode.tId + "_edit")

                        if (addBtn) addBtn.bind("click", function () {
                            var newNode = {
                                name: getNewNameFile(treeNode, 'new File')
                            }
                            addCount = 1;

                            ajaxInit({
                                url: option.isEdit.urlData.addData.url,
                                type: option.isEdit.urlData.addData.type,
                                data: {
                                    id: treeNode.id,
                                    name: newNode.name
                                },
                                success: function (data) {
                                    if (data.resultCode === 0) {
                                        zTree.addNodes(treeNode, newNode);
                                    }
                                }
                            })

                            return false;

                        });

                        if (deleteBtn) deleteBtn.bind("click", function (e) {
                            e.stopPropagation();
                            ajaxInit({
                                url: option.isEdit.urlData.deleteData.url,
                                type: option.isEdit.urlData.deleteData.type,
                                data: {
                                    id: treeNode.id,
                                    node: treeNode
                                },
                                success: function (data) {
                                    if (data.resultCode === 0) {
                                        zTree.removeNode(treeNode);
                                        //alert(data.errorMsg);
                                    }
                                }
                            })
                        })

                        if (editBtn) editBtn.bind("click", function () {

                            zTree.editName(treeNode);

                        })

                    },

                    removeHoverDom: function (treeId, treeNode) {
                        $("#addBtn_" + treeNode.tId + "_add").unbind().remove();
                        $("#deleteBtn_" + treeNode.tId + "_delete").unbind().remove();
                        $("#editBtn_" + treeNode.tId + "_edit").unbind().remove();
                    }
                };
                view = $.extend({}, view, newView);
                console.log(view);
            } else {
                newView = {
                    onRightClick: function (event, treeId, treeNode) {
                        var ztree = $.fn.zTree.getZTreeObj('treeDemo');

                        if (treeNode) {
                            ztree.selectNode(treeNode);
                            showRMenu("node", event.clientX, event.clientY, treeNode);
                        }
                        showMenu(event, treeId, treeNode);
                    }
                };

                view = $.extend({}, view, newView);
                console.log('view', view);
            }

        }
        // 是否开启checkbox 或 radio

        if (option.check) {
            if (option.check.enable && option.check.all) {
                check = {}
                allCheckState = true;
            } else {
                option.check.checkStyle === 'radio' && option.check.radioType ? (radioType = option.check.radioType) : (radio = null)
                check = {
                    enable: option.check.enable,
                    chkStyle: option.check.checkStyle,
                    radioType: radioType
                }
            }
        }

        if (option.search) {
            if (option.search.enable) {
                
                var div = document.createElement('div');
                var divSearch = document.createElement('div');
                var input = '<div class="input-group">\
                <input type="text" class="form-control" placeholder="搜索">\
                <span class="input-group-btn">\
                    <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i></button>\
                  </span>\
              </div>';
                div.id = 'search';
                divSearch.id = 'searchResult';
                divSearch.style.display = 'none';
                // input.type = 'text';
                $(div).html(input);
                var tree = document.getElementById(option.el);
                content.insertBefore(div, tree);
                content.insertBefore(divSearch, tree);
                $(document).on('keyup',"#search input", function (e) {
                    var searchResult = $.trim($("#search input").val());
                    if (searchResult === '') {
                        ztreeDiv.style.display = "block";
                        divSearch.style.display = 'none';
                        return false;
                    }
                    throttle(searchAjax, null, 500, searchResult, 1000);
                });
                $(document).on('click',"#search button", function (e) {
                    var searchResult = $.trim($("#search input").val());
                    if (searchResult === '') {
                        ztreeDiv.style.display = "block";
                        divSearch.style.display = 'none';
                        return false;
                    }
                    throttle(searchAjax, null, 500, searchResult, 1000);
                })
            }
        }

        setting = {
            el: option.el,
            data: {
                simpleData: {
                    enable: true // 开始简单数据模式
                },
                keep: {
                    leaf: true,
                    parent: true
                }
            },
            check: check,
            edit: {
                enable: isDrog,
                drag: {
                    autoExpandTrigger: true,
                    prev: dropPrev,
                    next: dropNext,
                    inner: dropInner
                },
                showRemoveBtn: false,
                showRenameBtn: false
            },
            view: {
                showIcon: option.show.showIcon,
                showLine: option.show.showLine,
                showTile: option.show.showTile,
                addHoverDom: view.addHoverDom,
                removeHoverDom: view.removeHoverDom,
                addDiyDom: allCheckState ? addDiyDom : false
            },
            async: async,
            callback: {
                beforeDrag: beforeDrag,
                onAsyncSuccess: onAsyncSuccess,
                onRightClick: option.isEdit.editStyle === 2 ? view.onRightClick : null,
                onRename: onRename,
                onDrop: onDrop,
                onClick: onClick,
                onCheck: onCheck
            }
        };

        $.fn.zTree.init($('#'+setting.el), setting);

        function getZtreeApi() {
            var dom = setting.el;
            return $.fn.zTree.getZTreeObj(dom);
        }

        function getZtree() {
            return $.fn.zTree;
        }

        return {
            getZtree: getZtree,
            getZtreeApi: getZtreeApi
        }

    })(option);

    return _ztree;
}
var option = {
    el: "treeDemo",
    show: {
        showIcon: true,
        showLine: true,
        showTitle: true
    },
    icon: {
        floder: {
            parentIcon: '',
            parentIconOpen: '',
            parentIconClose: ''
        },
        file: {
            icon: ''
        }
    },
    async: { // ajax 请求
        enable: true,
        url: '_api/ztree.json',
        type: 'get',
        otherParam: [],
        autoParam: []
    },
    check: { // 是否开启checkbox和radio
        enable: true,
        all: false,
        checkStyle: 'radio', // truecheckbox 和 radio
        radioType: 'all' // radio 选中是否分组。'level' 同级 或者 'all' 全局
    },
    drog: { // 是否开启拖拽排序
        openDrog: true,
        siblingDrag: true,
        drogAsync: {
            url: '',
            type: 'get'
        }
    },
    isEdit: { // 是否开启增删改功能
        openEdit: false,
        editStyle: 1, // 1  或  2   1：鼠标移入移除，出现功能按钮。2：鼠标右击，出现功能按钮
        urlData: {
            addData: {
                url: '_api/ztree.json',
                type: 'get'
            },
            deleteData: {
                url: '_api/ztree.json',
                type: 'get'
            },
            editData: {
                url: '_api/ztree.json',
                type: 'get'
            }
        }
    },
    search: {
        enable: true,
        ajax: {
            url: '_api/search.json',
            type: 'post'
        },
        onClick: function (e, node) {
            console.log(e, node);
        }
    },
    onClick: function (event, treeId, treeNode, ajaxData) {
        event.preventDefault();
        var option = treeNode,
            ajaxData = ajaxData;
        t.setData([
            { "id":1, "pId":0, "name":"父节点1", "open":true, "isParent":true},
            { "id":2, "pId":0, "name":"父节点2", "open":true},
            { "id":3, "pId":0, "name":"父节点3", "open":false}
            ],'.origin-list .list-content');
    },
    onDrop: function (event, treeId, treeNode, ajaxData) {
        console.log('ajaxData', ajaxData);
    },
    onCheck: function (e, treeId, treeNode, ajaxData) {
        console.log('ajaxData', ajaxData);
    },
    allCheckBing: {
        allCheckboxBind: function (treeNode, btn) {
            console.log(treeNode, btn);
        },
        allRadioBind: function (treeNode, btn) {
            console.log(treeNode, btn);
        }
    }
}
var newZtree = ZTree(option);

$(document).on("click",".tab_click a",function(e){
    $(".tab-content .active").html('<div id="ztree-content"></div>');
    $(".tab-content .active").siblings().html("");
    ZTree(option)
  })


