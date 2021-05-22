var mapStack = [];
var curMap = {};
var mapData;
var intervalCmp = [];
//地图轮播定时器
var timeTicket = null;
var timeticket = null;

//地图数据配置项，用于显示自定义tooltip
var pmMapSeries = null;

//点击添加组件 (放在初始化首，首先第一步就添加点击）

function clicktoAddCmp() {
    $(".echarts-box-hover,.echarts-box-hover2").on("click", function () {
        $(".echarts-box-hover").removeClass("active");
        $(this).addClass("active").siblings("li");

        self.parent.createComponentAttribute($(this).attr("defChart"), $(this).attr("id"), $(this).attr("id"));
        // self.parent.loadReleSetting(data);
    })
}

function setInstId(cnt, instId) {
    $('#' + cnt).attr("instId", instId);
}

/*<![CDATA[*/
function addPageCmp(pageId) {
    //地市编号
    // var chooselocation = '370000';

    var selfLocation = self.location.href;

    if (selfLocation.indexOf("previewPageId") < 0) {
        //如果不是预览界面再执行
        clicktoAddCmp();
        self.parent.getPageProps(pageId);
    }

    var formData = [];

    if (selfLocation.indexOf("eparchy_code") > 0) {
        formData.push({name: 'eparchy_code', value: selfLocation.substr(selfLocation.length - 4)});
    }
    // formData.push({name: 'pageId', value: pageId?pageId:$('#pageId').val()});
    formData.push({name: 'pageId', value: pageId});//现在传来的pageId一定是有值
    $('input[type="hidden"]').each(function () {
        if ($(this).attr('id') != 'pageId') {
            formData.push({name: $(this).attr('id'), value: $(this).val()});
        }
    });

    $.ajax({
        url: "../pageChartOptions",
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: formData,
        success: function (data) {
            if (selfLocation.indexOf("previewPageId") < 0) {
                //如果不是预览界面
                self.parent.loadReleSetting(data);
            }
            var location = ($('#location').val()?$('#location').val():'370000');

            var pageTitle = data.dataVisPage.pageTitle;

            $('#pageTitle').html(data.dataVisPage.pageTitle);//原empty().append()
            $('#pageTitle').val(pageTitle);//地图上的标题设置

            $('#appTitle').html(data.dataVisPage.pageName);
            //location获取不到，暂时注释 2019-01-23
            // if ($('#appSubTitle').text() != null && $('#appSubTitle').text().length > 0) {
            //     $('#appSubTitle').html(cityMap[location]);
            // }
            // $('#ssmapTitle').html(data.divMaxorContainers[0].chartOptions.title.text);
            var dataVisPageEntity = data.dataVisPage.pageEntity;//里面只包括fontSize，或者为空
            var pageFontSize = ( dataVisPageEntity ? ($.parseJSON(dataVisPageEntity)['fontSize'] ? $.parseJSON(dataVisPageEntity)['fontSize'] : '12') : '12' );
            //data.dataVisPage.entity和data.cmpInst.entity.的区分：dataVisPage.entity里若有数据就是字体大小fontsize

            var container;

            $.each(data.cmpInsts, function (idx, element) {
                try {
                    //cntId是html页面上有echarts-box-hover属性的标签的id
                    container = element.cntId;
                    $('#' + element.cntId).attr("defChart", element.cmpChartImpl);
                    //需要重新设定一下宽高
                    $('#' + container).css("width", $('#' + container).width() + "px").css("height", $('#' + container).height() + "px");
                    // 用idx来区分是初始化、刷新、组件传值还是最大化:初始化 idx>=0；刷新 idx=-1；组件传值 idx=-2；最大化 idx=-3；
                    data.idx = idx;
                    commonSetOption(data);
                }catch (e) {
                    window.alert("组件数据读取时发生错误！");
                }

                //定时刷新组件（pageId，cntId，pageFontSize）
                if (element.chartOptions.refreshItv) {
                    intervalCmp.push({
                        pageId: pageId,
                        container: container,
                        pageFontSize: pageFontSize
                    });
                }

            });


            $(".echarts-box-hover").addClass("page-body-item");
            $(".echarts-box-hover2").addClass("page-body-item");
        }
    });

    //自动刷新
    if (intervalCmp.length > 0) {
        var intervalTimes = $('#intervalTimes').val();
        intervalTimes = intervalTimes ? intervalTimes : '120000';
        setInterval(initRefreshCnt, parseInt(intervalTimes));
    }
}

//DIV放大全屏
function divMax(cntid, pageid) {
    // alert(cntid);
    var divMax = document.createElement("div");
    divMax.id = "divMax";
    // divMax.style.background = "blue";
    // divMax.style.zIndex = "99999";
    divMax.style.height = "80%";
    divMax.style.width = "80%";
    divMax.style.margin = "0%";
    divMax.style.padding = "0%";
    divMax.style.position = "fixed";
    var first = document.body.firstChild;//得到页面的第一个元素
    document.body.insertBefore(divMax, first);//在得到的第一个元素之前插入

    //解决模板关联最大化不生效
    var xformData = [];
    xformData.push({name: 'cntId', value: cntid});
    xformData.push({name: 'pageId', value: pageid});
    //遍历input取出隐藏值
    $('input[type="hidden"]').each(function () {
        if ($(this).attr('id') != 'location' && $(this).attr('id') != 'cntId' && $(this).attr('id') != 'pageId') {
            xformData.push({name: $(this).attr('id'), value: $(this).val()});
        }
    });
    $.ajax({
        type: "get",
        url: "../pageChartOption",
        data: xformData,
        success: function (data) {
            data.idx = -3;
            commonSetOption(data);

        }
    });
    //最大化窗口样式，在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        , area: ['90%', '90%']
        , skin: 'addFri'
        , shade: 0.8 //遮罩透明度
        , maxmin: false //允许全屏最小化
        , anim: 5 //0-6的动画形式，-1不开启
        , content: $("#divMax")
        , end: function () {
            $("#divMax").remove();
        }
    });
}

/*]]>*/
function initRefreshCnt() {
    for (var i = 0; i < intervalCmp.length; i++) {
        refreshCntContend(intervalCmp[i].pageId, intervalCmp[i].container, intervalCmp[i].pageFontSize);
    }
}


function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}
//为什么必须放在tplInfo里面才能行
function setCntDefchart(cntId, defChart) {
    $('#' + cntId).attr("defChart", defChart);
}

/**
 * 刷新图形
 * @param pageId
 * @param container
 * @returns
 */
function refreshCntContend(pageId, container, pageFontSize) {
    $('#' + container).css("width", $('#' + container).width() + "px").css("height", $('#' + container).height() + "px");

    var formData = [];
    formData.push({name: 'pageId', value: pageId});
    formData.push({name: 'cntId', value: container});

    $('input[type="hidden"]').each(function () {
        if ($(this).attr('id') != 'cntId' && $(this).attr('id') != 'pageId') {
            formData.push({name: $(this).attr('id'), value: $(this).val()});
        }
    });

    $.ajax({
        url: "../pageChartOption",
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: formData,
        success: function (data) {
            try {
                data.idx = -1;
                commonSetOption(data);
                // window.alert("操作成功！")
            }catch (e) {
                // window.alert("组件数据设置有误！");
            }

        }
    });
}

//模板关联方法
//关联功能先注释
function pageRelation() {
    // window.alert("模板关联方法！");
    // var localhref = decodeURI(window.location.search);
    // var localarr = localhref.split('?')[1].split('&');
    // var tempObj = {};
    // for (var i = 0; i < localarr.length; i++) {
    //     if (tempObj[localarr[i].split('=')[0]] = 'url') {
    //         tempObj[localarr[i].split('=')[0]] = decodeURIComponent(localarr[i].split('=')[1]);
    //     } else {
    //         tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
    //     }
    // }
    // pageRelation = document.createElement("div");
    // pageRelation.setAttribute("id", "pageRelation");
    // pageRelation.style.height = "15px";
    // pageRelation.style.zIndex = "99999";
    // var first = document.body.firstChild;//得到页面的第一个元素
    // document.body.insertBefore(pageRelation, first);//在得到的第一个元素之前插入
    // $('#pageRelation').html("<input type=\"hidden\" value=" + tempObj.value + " id=\"" + tempObj.relationcode + "\" />");
    //
    // if (tempObj.url != null || tempObj.length > 0) {
    //     $('#pageRelation').append("<a onclick='returnBack(\"" + tempObj.url + "\")' target=\"_parent\" class=\"initBtnB initBtn\" style='float: right;padding-right: 3%'>返回上一模板</a>");
    //     //href=\""+tempObj.url+"\"
    // }
}

function returnBack(url) {
    if (self.frameElement && self.frameElement.tagName == "IFRAME" && self.frameElement.name != "modelframe") {
        self.frameElement.src = url;
        self.frameElement.document.location.reload;
    } else {
        window.open(url);
        window.close();
    }
}

//组件关联传值方法
//关联功能先注释
function instReleSendValue(value, container, pageId) {
    // // window.alert("组件传值！");
    // if (pageId != null && pageId != "" && container != "" && container != null) {
    //     $.ajax({
    //         type: "get",
    //         url: "../loadReleInst",
    //         data: {
    //             pageId: pageId,
    //             cntId: container,
    //         },
    //         success: function (data) {
    //             if (data.rele != null) {
    //                 var ids = $.parseJSON(data.rele).instIds;
    //                 var paraName = $.parseJSON(data.rele).paraName;
    //                 var paraValue = value;
    //
    //                 var selfLocation = self.location.href;
    //
    //                 if (selfLocation.indexOf("previewPageId") < 0) {
    //                     self.parent.getPageProps(pageId);
    //                 }
    //
    //                 var formData = [];
    //
    //                 if (selfLocation.indexOf("eparchy_code") > 0) {
    //                     var a = selfLocation.substr(selfLocation.length - 4);
    //                     formData.push({name: 'eparchy_code', value: a});
    //                 }
    //
    //                 if (pageId == null)
    //                     formData.push({name: 'pageId', value: $('#pageId').val()});
    //                 else {
    //                     formData.push({name: 'pageId', value: pageId});
    //                 }
    //
    //                 $('input[type="hidden"]').each(function () {
    //                     if ($(this).attr('id') != 'pageId') {
    //                         formData.push({name: $(this).attr('id'), value: $(this).val()});
    //                     }
    //                 });
    //
    //                 var idlist = ids.split(",");
    //                 for (var l = 0; l < idlist.length; l++) {
    //                     $.ajax({
    //                         url: "../reInstData",
    //                         type: "get",
    //                         dataType: "json",
    //                         contentType: "application/json",
    //                         async: false,
    //                         data: {
    //                             cntId: idlist[l],
    //                             paraName: paraName,
    //                             paraValue: paraValue,
    //                             formData: formData
    //                         },
    //                         success: function (data) {
    //                             container = data.cntId;
    //                             data.idx = -2;
    //                             commonSetOption(data);
    //                         }
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // }
    // /*else{
    //         alert("缺少相关信息！");
    //     }*/
}

//页面刷新--预览和编辑页面
function reLoad() {
    if (top.location != self.location) {
        window.parent.document.getElementById('modelframe').contentWindow.location.reload(true);
    } else {
        window.location.reload(true);
    }
}

//清除联动按钮自动隐藏
var tip;
var mouseState = 0;
var time;
$(function () {
    $('body').attr('onmousemove', 'mouseMove()');
    $('body').attr('onmouseover', 'mouseIn()');
    $('body').attr('onmouseout', 'mouseOut()');
})

function mouseIn() {
    time = window.setInterval(eve, 1000);
}

function mouseOut() {
    window.clearInterval(time);
}

function mouseMove() {
    mouseState = 1;
    $('.initBtn').css('display', 'block');
}

var eve = function () {
    if (mouseState == 0) {
        $('.initBtn').css('display', 'none');
    }
    mouseState = 0;
}


//地图打点大小（数值，处理比例）
function dealSymbolSize(value, proportion) {
    var dealVal = 10;
    if (value <= 10) {
        dealVal = 10 - value / 10;
    } else if (value <= 100) {
        dealVal = 10 + (value - 10) / 20;
    } else if (value <= 500) {
        dealVal = 14.5 + (value - 100) / 100;
    } else if (value <= 1000) {
        dealVal = 18.5 + (value - 500) / 100;
    } else if (value <= 6000) {
        dealVal = 23.5 + (value - 1000) / 1000;
    } else {
        dealVal = 30;
    }
    return eval(dealVal * proportion);
}
function commonSetOption(data){
    var idx = data.idx;//大于0 初始化；-1 刷新；-2 模板关联传值；-3 divMax
    var chooselocation = '370000';//地市编号（370000为山东）

    var element = ( idx < 0 ? data : data.cmpInsts[idx]);//当idx<0时，element即是data；idx>0时，element为cmpInsts[idx]
    var container = element.cntId;

    //页面属性，初始化返回名为dataVisPage；其余情况返回名为page,包括创建人、创建时间、页面id、tpl等
    var dataVisPage = ( idx < 0 ? data.page : data.dataVisPage );

    var pageId = dataVisPage.pageId;

    var divMaxorContainer = (idx == -3 ? 'divMax' : container);//初始化与divMax时container不一样

    var cmpJsDir = element.cmp.cmpDir;
    if(!cmpJsDir){  //如果组件的js地址为空
        alert(element.cmp.cmpName + "组件【" + element.cmp.cmpChartImpl + "】相关js的地址为空！");
        return;
    }
    var cmpModuleName = cmpJsDir.substring(cmpJsDir.lastIndexOf("/")+1,cmpJsDir.lastIndexOf("."));
    if(!cmpModuleName){
        //如果组件js中的文件名为空
        alert("没有从" + element.cmp.cmpName + "组件【" + element.cmp.cmpChartImpl + "】js的地址中获取到文件名，请检查数据配置！");
        return;
    }
    //目前仅支持js文件配置
    if(cmpJsDir.substring(cmpJsDir.lastIndexOf("."))!=".js"){
        alert(element.cmp.cmpName + "【" + element.cmp.cmpChartImpl + "】的配置文件不是js文件，请检查数据配置！");
        return;
    }

    if(element.cmp && element.cmp.parentType &&element.cmp.parentType=="echarts"){
        layui.use(['echartsCommon'], function(){  //echarts类型组件，统一先经过echartsCommon.js处理
            var echartsCommon = layui.echartsCommon;
            echartsCommon.render(element,divMaxorContainer,cmpModuleName,data);
        });
    }else{  //非echarts类型组件
        layui.use([cmpModuleName], function(){
            var cmpModule = layui[cmpModuleName];  //各模块名在layui_config.js中配置
            cmpModule.render(idx,element,divMaxorContainer);
        });
    }

    /**
     * 样式有点问题,先注释
     * 2019-02-26
     * ---start---
     */
    //样式有点问题
    // if (element.cmp.cmpType != "kpi" && idx != -3 && $("#" + container).children('.echart-set').length == 0) {
    //     var idname = "max_" + container;
    //     var echartset = "<div class='echart-set' style='z-index:9999' id='" + idname + "' onclick='divMax(\"" + container + "\",\"" + pageId + "\")'> </div>";
    //     $("#" + container).append(echartset);
    //     $("#" + idname).append("<img src='../static/visual/images/icon-amplifica.png' style=\"width: 20px;\" title=\"放大\"/>");
    // }
    /**
     * 样式有点问题,先注释
     * ---stop---
     */
    // var ignorePageId = new RegExp('[112]');
    if (element.cmp.id == "basicbar" && pageId != 112 && pageId != 118) {    //basicbar类型的图表全部往左平移15px
        $('#' + container).children(":first").children().css({'left':'-15px'});
    }
}
