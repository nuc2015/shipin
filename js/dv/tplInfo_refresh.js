/**
 * @author: huxl_oup
 * @author: mayan_mci
 * @description: 设置个别组件刷新时间,!!!注意：本文件覆盖tplInfo.js的部分函数!!!
 * @date: 2019/3/11 9:49
 */
var defaultIntervalTime = 5 * 1000 * 60;// 单位（ms）组件的默认刷新间隔5分钟；单独设置某组件的刷新时间请找到setTimeMap()函数
var intervalTimeMap = new Map();// key:区域id(class="echarts-box-hover"), value:刷新时间间隔

/**
 * 设置某些组件的刷新时间
 */
function setTimeMap() {
    // 例子: 设置某组件刷新间隔是4秒
    // intervalTimeMap.set('16_parent_2', 4000);// 参数{参数1:class为echarts-box-hover的div的id,参数2:刷新时间}
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
                    intervalTimeMap.set(container, defaultIntervalTime);// 用默认刷新时间初始化map
                }

            });


            $(".echarts-box-hover").addClass("page-body-item");
            $(".echarts-box-hover2").addClass("page-body-item");
        }
    });

    //自动刷新
    if (intervalCmp.length > 0) {
        var intervalTimes = $('#intervalTimes').val();
        initRefreshCnt();
    }
}

/*]]>*/
function initRefreshCnt() {
    setTimeMap();
    var tenantIds = selfLocation.indexOf("tenantId");// 获取到的值
    for (var k = 0; tenantIds.length; k++) {
        for (var i = 0; i < intervalCmp.length; i++) {
            (function (j) {// 闭包记录for循环过程下标i,记录为j
                var containerId = intervalCmp[j].container;
                var intervalTime = intervalTimeMap.get(containerId);// 刷新组件的时间By区域id

                if (isNaN(intervalTime) ) {// 如果不是数字,
                    try {
                        intervalTime = parseInt(intervalTime);
                    } catch (e) {
                        console.error('echarts-box-hover的Id为' + containerId + '的刷新间隔不是数字:' + intervalTime);
                        intervalTime = defaultIntervalTime;// 使用默认时间
                    }
                }
                setInterval(function () {// 传递refreshCntContend参数
                    // console.log('echarts-box-hover的Id————>刷新时间intervalTime:   ' + containerId + '————>' + intervalTime);
                    refreshCntContend(intervalCmp[j].pageId, containerId, intervalCmp[j].pageFontSize, tenantIds[k]);
                }, intervalTime);
            })(i);
        }
    }
}

/**
 * 刷新图形
 * @param pageId
 * @param container
 * @returns
 */
function refreshCntContend(pageId, container, pageFontSize, tenantId) {
    $('#' + container).css("width", $('#' + container).width() + "px").css("height", $('#' + container).height() + "px");

    var formData = [];
    formData.push({name: 'pageId', value: pageId});
    formData.push({name: 'cntId', value: container});
    formData.push({name: 'tenantId', value: tenantId});

    $('input[type="hidden"]').each(function () {
        if ($(this).attr('id') != 'cntId' && $(this).attr('id') != 'pageId') {
            formData.push({name: $(this).attr('id'), value: $(this).val()});
        }
    });

    // /**
    //  * @author: mayan_mci
    //  * @description: 测试数据是否改变（可删掉）
    //  * @date: 2019/3/11 10:06
    //  */
    // if (intervalTimeMap.has(container)) {
    //     console.log('echarts-box-hover的Id：' + container);
    //     debugger;
    // }

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