/**
 * echarts图表公共处理
 */
layui.define(['jquery'], function(exports) {
    var $ = layui.jquery;
    //地图轮播定时器
    var timeTicket = null;
    var timeticket = null;

    //地图数据配置项，用于显示自定义tooltip
    var pmMapSeries = null;

    var obj = {
        render: function (element, container,cmpModuleName,data) {
            var idx = data.idx;//大于0 初始化；-1 刷新；-2 模板关联传值；-3 divMax
            var xtheme = (data.theme?data.theme:'');

            //页面属性，初始化返回名为dataVisPage；其余情况返回名为page,包括创建人、创建时间、页面id、tpl等
            var dataVisPage = ( idx < 0 ? data.page : data.dataVisPage );
            var pageFontSize = ( dataVisPage.pageEntity ?
                ($.parseJSON(dataVisPage.pageEntity)['fontSize'] ?
                    $.parseJSON(dataVisPage.pageEntity)['fontSize'] : '12') : '12' );

            var pageId = dataVisPage.pageId;

            layui.use([cmpModuleName], function(){
                var location = '370000';
                if(element && element.cmpInstEntity){
                    var settings = eval('(' + element.cmpInstEntity + ')');
                    if(settings && settings.chooseolocation){
                        location = settings.chooseolocation;
                    }
                }
                var cmpModule = layui[cmpModuleName];
                var option = cmpModule.chartOption(element.cmpChartImpl,pageFontSize,element.cmpInstEntity);
                // 获取echarts实例
                /*echarts组件切换为list、kpi时，container节点的_echarts_instance_属性默认仍为绑定状态，默认绑定状态下echarts不再向节点添加canvas
            需在切换为list、kpi时手动removeAttr(_echarts_instance_)*/
                //某个节点有没有echarts实例 是通过看该节点有没有_echarts_instance_属性，_echarts_instance_属性被移走，将无法再通过节点寻找此实例
                var myChart;

                if (echarts.getInstanceByDom(document.getElementById(container))) {
                    myChart = echarts.getInstanceByDom(document.getElementById(container));
                }
                else {
                    if (xtheme) {
                        myChart = echarts.init(document.getElementById(container), xtheme);
                    } else {
                        myChart = echarts.init(document.getElementById(container));
                    }
                }
                if (element.cmp.cmpType == "map") {
                    $('#contextMenu').on('click', function () {
                        $(this).hide();
                        var map = mapStack[0];
                        if (!mapStack.length && !map) {
                            alert('已经到达最上一级地图了');
                            return;
                        }
                        loadMap(map.mapCode, map.mapOptions, myChart,cmpModule);
                        // console.log(map);
                    });

                    $.extend(true, option, element.chartOptions);
                    option.title.text = '';
                    loadMap(location, element, myChart,cmpModule);

                    mapStack.push({
                        mapCode: location,
                        mapOptions: element
                    });

                    $('#contextMenu').hide();
                    myChart.on('click', function (params) {
                        var name = params.name;
                        // instReleSendValue(params.name, container, pageId);
                        var selLocation = getMapLoation(name);
                        if (selLocation != null) {
                            var xformData = [];
                            //xformData.push({name:'pageId',value:pageId});
                            xformData.push({name: 'cntId', value: container});

                            $('input[type="hidden"]').each(function () {
                                if ($(this).attr('id') != 'location') {
                                    xformData.push({name: $(this).attr('id'), value: $(this).val()});
                                }
                            });
                            xformData.push({name: 'location', value: selLocation});

                            $.ajax({
                                url: "../pageChartOption",
                                type: "get",
                                dataType: "json",
                                contentType: "application/json",
                                async: false,
                                data: xformData,
                                success: function (xxdata) {
                                    $.extend(true, option, xxdata.chartOptions);
                                    loadMap(selLocation, xxdata, myChart,cmpModule);

                                    $('#contextMenu').show();
                                }
                            })
                        }
                    });
                }
                else if (element.cmp.cmpType == "smap") {
                    // loadPMLinkMap(location, element, myChart, pageId, container);
                    loadPMLinkMap(location, element, myChart, pageId, container,cmpModule);
                }
                else if (element.cmp.cmpType == "ssmap") {
                    var pageJsons = $.parseJSON(element.cmpInstEntity);
                    if (pageJsons['chooselocation'] != null && pageJsons['chooselocation'] != "") {
                        chooselocation = pageJsons['chooselocation'];
                    }
                    loadPMMapScatter(chooselocation, element, myChart, pageId, container,cmpModule);
                }
                else if (element.cmp.cmpType == "radar") {
                    //雷达图样式
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    if (element.cmpInstEntity != undefined) {
                        var entity = eval('(' + element.cmpInstEntity + ')');
                        $('#' + container).prev().attr("style", "font-size:" + entity.titlefont + "px;" + "color:" + entity.titlecolor);
                    }
                    $.extend(true, option, element.chartOptions);

                    var fontOption = getRadarFontOption();
                    if (pageFontSize != null) {
                        var fontOption = getRadarFontOption(pageFontSize);
                        $.extend(true, option, fontOption);
                    }
                    option.title.text = '';
                    option.backgroundColor = '';
                    myChart.setOption(option, true);
                    myChart.on('click', function (params) {
                        // instReleSendValue(params.name, container, pageId);
                    });
                }
                else {
                    // 设置标题
                    if (element.chartOptions.linkurl) {
                        $('#' + container).prev().html(element.chartOptions.title.text + '<span class="linkMore"><a href="' + element.chartOptions.linkurl + '" target="_blank">更多...</a></span>');
                    } else {
                        $('#' + container).prev().html(element.chartOptions.title.text);
                        if (element.cmpInstEntity) {
                            var entity = eval('(' + element.cmpInstEntity + ')');
                            $('#' + container).prev().attr("style", "font-size:" + entity.titlefont + "px;" + "color:" + entity.titlecolor);
                        }
                    }

                    if(element.cmp.cmpChartImpl=="doughnutchart"){ //环形图包含多个图形的情况
                        var seriesTemp = [];
                        if(option.series && option.series[0]){
                            seriesTemp = $.each(element.chartOptions.series,function(index,item){
                                //多个图形时分配颜色
                                if(item.color && item.data && item.color.length>item.data.length){
                                    if(item.color.length>=item.data.length*(index+1)){
                                        item.color = item.color.slice(item.data.length*index,item.data.length*(index+1));
                                    }

                                }
                                //区分数据项名称
                                if(item.data){
                                    $.each(item.data,function(i,ele){
                                        ele.name = ele.name + "（" + item.name + "）";
                                    })
                                }
                                $.extend(true, item, option.series[0]);
                            });

                        }
                        $.extend(true, option, element.chartOptions);
                        option.series = seriesTemp;
                    }else{
                        $.extend(true, option, element.chartOptions);
                    }


                    if (eval('(' + element.cmpInstEntity + ')').simplifyBar != undefined && eval('(' + element.cmpInstEntity + ')').simplifyBar == "1") {

                        option.yAxis.splitLine.show = false;
                        option.xAxis.splitLine.show = false;

                        $.extend(true, option, basicbarThemeSimplify(element.cmpInstEntity));

                        for (i = 0; i < option.series.length; i++) {
                            $.extend(true, option.series[i], labelOption(element.cmpInstEntity));
                        }
                    }
                    //barline已删除
                    if (element.cmp.cmpType == "line") {
                        var entity = eval('(' + element.cmpInstEntity + ')');
                        if (entity.smooth == "1") {//折线图平滑显示
                            for (var i = 0; i < option.series.length; i++) {
                                option.series[i]["smooth"] = true;
                            }
                        }
                        if (entity.gcColor != "" && entity.gcColor != undefined) {//折线图渐变阴影
                            if (entity.gcColor == "transparent") {
                                for (var i = 0; i < option.series.length; i++) {
                                    option.series[i].itemStyle.normal["areaStyle"] = {};
                                }
                            } else {
                                var gcColor = entity.gcColor.toString().split("\,");
                                for (var i = 0; i < option.series.length; i++) {
                                    option.series[i].itemStyle.normal["areaStyle"] = {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 2,
                                            [
                                                {offset: 0, color: gcColor[i % gcColor.length]},
                                                {offset: 1, color: 'transparent'}
                                            ]
                                        )
                                    };
                                }
                            }
                        }
                        if (entity.isLegend == "0" && entity.isLegend != undefined) {
                            option.legend = {};
                        }
                    }
                    if (element.cmp.cmpChartImpl == "stackedbar" && eval('(' + element.cmpInstEntity + ')').axisdirection == "vertical") {
                        var axistemp = option.yAxis;
                        option.yAxis = option.xAxis;
                        option.xAxis = axistemp;
                    }

                    option.title.text = '';
                    option.backgroundColor = '';
                    myChart.setOption(option, true);


                    myChart.on('click', function (params) {
                        // instReleSendValue(params.name, container, pageId);
                    });

                    /*if ( idx == -3){
                        //在divMax里面已经定义了次样式
                        //在这里面输入任何合法的js语句
                        layer.open({
                            type: 1 //Page层类型
                            , area: ['90%', '90%']
                            , skin: 'addFri'
                            , shade: 0.5 //遮罩透明度
                            , maxmin: false //允许全屏最小化
                            , anim: 5 //0-6的动画形式，-1不开启
                            , content: $("#divMax")
                            , end: function () {
                                $("#divMax").remove();
                            }
                        });
                    }*/
                }

            });

        }
    }

    function loadMap(location, data, myChart,cmpModule) {
        $.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
            if (xdata) {
                echarts.registerMap("map" + location, xdata);
            }

            var series = data.chartOptions.series;
            for (var i = 0; i < series.length; i++) {
                series[i].mapType = 'map' + location;
            }

            $.each(data.chartOptions.series, function (idx, element) {
                element.itemStyle = myChart._theme.map.itemStyle;
                element.label = myChart._theme.map.label;
            });
            // var option = chartOption(data.cmp.cmpChartImpl,'12', data.cmpInstEntity);
            var option = cmpModule.chartOption(data.cmp.cmpChartImpl,'12', data.cmpInstEntity,series);
            $.extend(true, option, data.chartOptions);
            option.title.text = '';
            option.backgroundColor = '';
            myChart.setOption(option, true);

            //用于自定义tooltip
            // pmMapSeries = series;

            curMap = {
                mapCode: location,
                mapName: cityMap[location]
            };
            var styleBox = eval('('+data.cmpInstEntity+')');
            //轮播效果
            if(styleBox && styleBox.autoHover && styleBox.autoHover==1){
                var dataLength = option.series[1].data.length;
                var time = styleBox && styleBox.interval?styleBox.interval:3000;  //轮播间隔时间
                mapAutoHover(dataLength,time,myChart);
            }else{  //清除之前的轮播
                timeticket && clearInterval(timeticket);
            }
        });
    }

//地图轮播设置   dataLength 设置的是需要轮播的次数      time 轮播间隔时间
    function mapAutoHover(dataLength,time,chart){
        var count = 0;
        timeticket && clearInterval(timeticket);
        timeticket = setInterval(function() {
            chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,

            });
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: (count) % dataLength
            });
            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: (count) % dataLength
            });
            count++;
        }, time);

        chart.on('mouseover', function(params) {
            clearInterval(timeticket);
            chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0
            });
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: params.dataIndex
            });
            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.dataIndex,
            });
        });
        chart.on('mouseout', function(params) {
            timeticket && clearInterval(timeticket);
            timeticket = setInterval(function() {
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                });
                chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: (count) % dataLength
                });
                chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: (count) % dataLength
                });
                count++;
            }, time);
        });

    }

    function getMapLoation(mapName) {
        for (key in cityMap) {
            if (cityMap[key] == mapName) {
                return key;
            }
        }
        return null;
    }

    function loadPMLinkMap(location, data, myChart, pageId, container,cmpModule) {
        $.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
            if (xdata) {
                echarts.registerMap("map" + location, xdata);
            }

            // var option = getPMLinkMapOption("map" + location);
            var option = cmpModule.chartOption("map" + location);
            $.extend(true, option, data.chartOptions);

            var ration = parseInt(data.ratio);

            option.series[1].symbolSize = function (val) {
                return 3 + val[2] / 10000;
            };
            option.title.text = '';

            option.backgroundColor = '';
            myChart.setOption(option, true);
            myChart.on('click', function (params) {
                // instReleSendValue(params.name, container, pageId);
            });
        });
    }

    function loadPMMapScatter(location, data, myChart, pageId, container,cmpModule) {
        $.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
            if (xdata) {
                echarts.registerMap("map" + location, xdata);
            }

            // var option = getPMMapScatterOption("map" + location);
            var option = cmpModule.chartOption("map" + location);
            $.extend(true, option, data.chartOptions);
            //数值范围大小
            option.series[0].symbolSize = function (val) {
                return dealSymbolSize(val[2], 0.25);
            };

            //气泡的大小
            option.series[2].symbolSize = function (val) {
                return dealSymbolSize(val[2], 1.3);
            };

            //扩散点的大小
            option.series[3].symbolSize = function (val) {
                return dealSymbolSize(val[2], 1);
            };

            //点名轮播展示业务数据
            var count = 0;
            var dataLength = option.series[1].data.length;
            clearInterval(timeTicket);
            timeTicket = setInterval(function () {
                // myChart.dispatchAction({
                //     type: 'downplay',
                //     seriesIndex: 1,
                // });
                // myChart.dispatchAction({
                //     type: 'highlight',
                //     seriesIndex: 1,
                //     dataIndex: (count) % dataLength
                // });
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: (count) % dataLength
                });
                count++;
            }, 5000);
            //换成新字段名
            myChart.on('click', function (params) {
                if (params.componentType=="series"){
                    instReleSendValue(params.name, container, pageId);
                    var city = params.name;
                    var entity = eval('(' + data.cmpInstEntity + ')');
                    var herf = encodeURIComponent(window.location.href);
                    if (entity.url != null && entity.url.length > 0) {
                        if (top.location == self.location) {
                            window.open(entity.url + '&relationcode=' + entity.relationcode + '&value=' + city + '&url=' + herf, '_parent');
                        }
                        if (self.frameElement && self.frameElement.tagName == "IFRAME" && self.frameElement.name != "modelframe") {
                            self.frameElement.src = entity.url + "&relationcode=" + entity.relationcode + "&value=" + city + "&url=" + herf;
                            // self.frameElement.document.location.reload;
                        }
                    }
                }
            });

            myChart.on('mouseover', function (params) {
                clearInterval(timeTicket);
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: params.dataIndex,
                });
            });
            myChart.on('mouseout', function (params) {
                clearInterval(timeTicket);
                timeTicket = setInterval(function () {
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: (count) % dataLength
                    });
                    count++;
                }, 5000);
            });
            myChart.setOption(option, true);
            // console.log(option);
        });
    }

    function getRadarFontOption(fontSize) {
        return {
            radar: {
                name: {
                    textStyle: {
                        fontSize: fontSize,
                    }
                }
            },
            legend: {
                textStyle: {fontSize: fontSize},
            }
        }
    }

    //bar的附加简化样式
    var basicbarThemeSimplify = function (entityBox) {
        var styleBox = eval('('+entityBox+')');
        var xFontSize = styleBox.xFontSize;
        var xFontColor = styleBox.xFontColor;
        var xAxisColor = styleBox.xAxisColor?styleBox.xAxisColor:'#333';
        return{
            xAxis: {
                type: 'category',
                axisTick : {show: true},
                axisLine : {
                    show: true,
                    lineStyle:{
                        color: xAxisColor,
                        opacity:0.8,
                    },
                },
                axisLabel : {
                    fontSize:xFontSize,
                    color:xFontColor,
                }
            },
            yAxis: {
                type: 'value',
                show:false,
                // axisTick : {show: false}
            },
        }
    }

    // 控制bar的宽度，位于每个series[i]内，(i=1 2 3...n)
    var labelOption =function (entityBox) {
        var styleBox = eval('('+entityBox+')');
        var barGapVal = styleBox.barGapVal?styleBox.barGapVal:'30%';
        var barWidth = styleBox.barWidthVal?styleBox.barWidthVal:'10';
        var barBorderRadius = styleBox.borRadius?parseInt(styleBox.borRadius):2;

        return{
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    distance: '10'
                }
            },
            itemStyle:{
                normal:{
                    barBorderRadius: barBorderRadius ,
                    shadowColor: 'rgba(125, 125, 125, 0.4)',
                    shadowBlur: 5
                }
            },
            barWidth:barWidth,
            barGap:barGapVal
        }
    }

    exports('echartsCommon', obj);
});