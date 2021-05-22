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
                    $('#' + element.cntId).attr("defChart", element.cmpId);
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

function getMapLoation(mapName) {
    for (key in cityMap) {
        if (cityMap[key] == mapName) {
            return key;
        }
    }
    return null;
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

// function getFontOption(fontSize){
// 	return {
// 	    xAxis:{
// 	    	axisLabel: {
// 	    		textStyle: {
// 	    			fontSize:fontSize
// 	    		}
// 	    	}
// 	    },
// 	    yAxis:{
// 	    	axisLabel: {
// 	    		textStyle: {
// 	    			fontSize:fontSize
// 	    		}
// 	    	}
// 	    },
// 	    legend:{
// 	            textStyle:{
// 	                fontSize:fontSize
// 	        }
// 	    }
// 	    //,
//         //visualMap: {
//         //    textStyle: {
//         //         fontSize:fontSize+''
//         //    },
// 		//	}
// 	}
// }
//
// function  getMapFontOption(fontSize) {
//     visualMap: {
//        textStyle: {
//             fontSize:fontSize
// 	   }
// 	}
// }

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

var lineAdvanceStyle = function (entityBox) {
    
}

var chartOption = function (type, fontSize, entityBox) {
    var styleBox = eval('('+entityBox+')');

    // var radiusIn = styleBox.radiusIn;
    // var radiusOut = styleBox.radiusOut;
    // var radius = radiusIn&&radiusOut ? [radiusIn,radiusOut]:["50%","70%"];
    // var orientVal = styleBox.orientValType?styleBox.orientValType:'horizontal';
    var legendIsShow = styleBox.legendIsShow == 0?false:true;
    var legendLeft = styleBox.legendLeftVal?styleBox.legendLeftVal:'auto';
    var legendTop = styleBox.legendTopVal?styleBox.legendTopVal:'auto';
    var lengths = styleBox.labellineShort ? [3,3] : [15,25];
    var coordinateUnit = styleBox.coordinateUnit ? (styleBox.coordinateUnit).split(",") : ['','','',''];
    var tipFontSize = styleBox.tipFontSize?styleBox.tipFontSize: 14; //悬浮信息字体大小
    var tipFontColor = styleBox.tipFontSize?styleBox.tipFontColor: '#fff'; //悬浮信息字体颜色
    var tipBgColor = styleBox.tipFontSize?styleBox.tipBgColor:'rgba(50,50,50,0.7)'; //悬浮信息背景颜色
    var tipIsShow = styleBox.legendIsShow == 0?false:true;

    switch (type) {
        case "basicbar":
            var digitalUnit = styleBox.digitalUnit?styleBox.digitalUnit:'';
            var orientVal = styleBox.orientValType?styleBox.orientValType:'horizontal';
                return {
                    xAxis: {
                        axisLabel: {
                            // textStyle: {
                            //     fontSize: fontSize
                            // }
                        }
                    },
                    yAxis: {
                        axisLabel: {
                            formatter: '{value} '+digitalUnit,
                            textStyle: {
                                fontSize: fontSize
                            }
                        }
                    },
                    legend: {
                        //backgroundColor: '#FFF',
                        show: legendIsShow,
                        textStyle: {
                            fontSize: fontSize
                        },
                        orient: orientVal,
                        left: legendLeft,
                        top: legendTop,
                        // x: '75%',
                        // top: '5%',
                        itemWidth: 5,
                        itemHeight: 3
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '3%',
                        top: '15%',
                        containLabel: true
                    }
                };
                break;
        case "barline":
            return {
                yAxis: [
                    {
                        type: 'value',
                        name: coordinateUnit[0],
                        axisLabel: {
                            formatter: '{value}'+coordinateUnit[1]
                        },
                        splitLine:{
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        name: coordinateUnit[2],
                        axisLabel: {
                            formatter: '{value}'+coordinateUnit[3]
                        },
                        splitLine:{
                            show: false
                        }
                    }
                ]
            };
            break;
        case "radarchart":
            return {
                radar: {
                    name: {
                        textStyle: {
                            fontSize: fontSize,
                        }
                    },
                    nameGap: 2
                },
                legend: {
                    textStyle: {fontSize: fontSize},
                    orient: 'vertical',
                    x: 'right',
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                }
            };
            break;
        case "pmbar":
            return {
                xAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    }
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            };
            break;
        case "pmMap":
            return {
                visualMap: {
                    min: 0,
                    max: 1000,
                    left: 'right',
                    top: 'bottom',
                    text: ['高', '低'],           // 文本，默认为数值文本
                    calculable: true,
                    itemHeight:80,
                    textStyle: {
                        color: '#fff',
                        fontSize: fontSize + ''
                    },
                    padding: [0, 26]
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor:  tipBgColor,
                    // padding: [20, 10],
                    // formatter: "{a} <br/>{b}: {c} ({d}%)",
                    formatter: function (params) {
                        var res = params.name+'<br/>';
                        var myseries = pmMapSeries;
                        for (var i = 0; i < myseries.length; i++) {
                            for(var j=0;j<myseries[i].data.length;j++){
                                if(myseries[i].data[j].name==params.name){
                                    res+=myseries[i].name +' : '+myseries[i].data[j].value+'</br>';
                                }
                            }
                        }
                        return res.replace("<br/>","").length>0?res:"暂无数据";

                    },
                    textStyle: {
                        color : tipFontColor,
                        fontSize: tipFontSize
                    }
                },
                series: [{
                    itemStyle: {
                        // 默认状态下地图的文字
                        normal: {label: {show: true}},
                        // 鼠标放到地图上面显示文字
                        emphasis: {label: {show: true}}
                    }
                }]
            };
            break;
        case "piechart":
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                label: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    normal: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        formatter: '{b}\n {d}%',
                        fontSize: fontSize
                    }
                },
                series : [
                    {
                        radius : '60%'
                      //  center: ['50%', '60%'],

                    }
                ]
            };
            break;
        case "nestedpie":
            var labTxt = styleBox.labTxt;
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left'

                },
                series: [
                    {
                        name:labTxt,
                        type:'pie',
                        radius: ['0', '30%'],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    },
                    {
                        name:labTxt,
                        type:'pie',
                        radius: ['40%', '55%'],
                        label: {
                            normal: {
                                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                backgroundColor: '#eee',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                // shadowBlur:3,
                                // shadowOffsetX: 2,
                                // shadowOffsetY: 2,
                                // shadowColor: '#999',
                                // padding: [0, 7],
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: fontSize,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        }
                    }
                ]
            };
            break;
        case "horizonbar":
            return {
                legend: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    orient: 'vertical',
                    x: 'right',
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    axisLabel: {
                        formatter: '{value} '+digitalUnit,
                        textStyle: {
                            fontSize: fontSize
                        }
                    },
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    },
                    type: 'category'
                }
            };
            break;
        case "stackedbar":
            return {
                legend: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    orient: 'vertical',
                    x: 'right',
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    },
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    },
                    type: 'category'
                },
                series: [{
                    barCategoryGap: 8
                }]
            };
            break;
        case "doughnutchart":
            var orientVal = styleBox.orientValType?styleBox.orientValType:'horizontal';
            var radiusIn = styleBox.radiusIn;
            var radiusOut = styleBox.radiusOut;
            var radius = radiusIn&&radiusOut ? [radiusIn,radiusOut]:["50%","70%"];
            return {
                legend: {
                    show: legendIsShow,
                    textStyle: {
                        fontSize: fontSize
                    },
                    orient: orientVal,
                    top: legendTop,
                    left: legendLeft,
                    // x: 'right',
                    // top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top: '10%',
                    containLabel: true
                },
                series: [
                    {
                        radius: radius,

                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%',
                                textStyle: {
                                    fontSize: fontSize
                                }
                            }
                        },
                        labelLine:{
                            normal:{
                                length: lengths[0],
                                length2: lengths[1]
                            }

                        }
                    }
                ]
            };
            break;
        case "zfbar":
            return {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value'
                }],
                yAxis: [{
                    type: 'category',
                    axisTick: {show: false}
                }],
                legend: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    orient: 'vertical',
                    x: 'right',
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                series: [
                    {
                        barWidth:styleBox.barWidth
                    }
                ]
            };
            break;
        case "ndgechart":
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                label: {
                    textStyle: {},
                    normal: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        formatter: '{b}\n {d}%',
                        fontSize: fontSize
                    }
                }
            };
            break;
        case "funnelchart":
            return {
                legend: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                label: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    normal: {
                        fontSize: fontSize
                    }
                }
            };
            break;
        case "wordCloud":
            return {
                tooltip: {},
                series: [{
                    type: 'wordCloud',
                    //size: ['9%', '99%'],
                    sizeRange: [12, 80],
                    //textRotation: [0, 45, 90, -45],
                    rotationRange: [-45, 90],
                    //shape: 'circle',
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 6
                    },
                    textStyle: {
                        normal: {
                            color: function() {
                                return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }
                }]
            };
            break;
        case "funnelchart":
            return {
                legend: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                label: {
                    textStyle: {
                        fontSize: fontSize
                    },
                    normal: {
                        fontSize: fontSize
                    }
                }
            };
            break;
        case "basicscatterchart":
            return {
                xAxis:
                    {
                        type: 'value',
                    },
                yAxis:
                    {
                        type: 'value',
                    }
            };
            break;
        case "treemap":
            return {
                //color:['#2ecc71','#1abc9c','#1abc9c','#4ba477','#3bbf7c'],
                series: [{
                    squareRatio:1.2,
                    roam: false,
                    nodeClick: false
                }]
            };
            break;
        case "pmMapScatter":
            return {
                title: {
                    show: false
                }
            };
            break;
        case "progressbar":
            return {
                title: {
                    x: '50%',
                    y: '45%',
                    textAlign: "center",
                    textStyle: {
                        fontWeight: 'normal',
                        color: 'blue'
                    },
                    subtextStyle: {
                        fontWeight: 'bold',
                        color: '#3ea1ff',
                        fontSize: 24
                    }
                },
                series: [
                    {
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 225,
                        hoverAnimation: false,
                        legendHoverLink: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    },
                    {
                        radius: ['52%', '68%'],
                        startAngle: 317,
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        legendHoverLin: false,
                        clockwise: false,
                        itemStyle: {
                            normal: {
                                borderColor: "transparent",
                                borderWidth: "20"
                            },
                            emphasis: {
                                borderColor: "transparent",
                                borderWidth: "20"
                            }
                        }
                        ,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }

                ]
            };
            break;
        default:
            return {};

    }
}
function cycleSetSeries(entity,option) {

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

function loadPMLinkMap(location, data, myChart, pageId, container) {
    $.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
        if (xdata) {
            echarts.registerMap("map" + location, xdata);
        }

        var option = getPMLinkMapOption("map" + location);
        $.extend(true, option, data.chartOptions);

        var ration = parseInt(data.ratio);

        option.series[1].symbolSize = function (val) {
            return 3 + val[2] / 10000;
        };
        option.title.text = '';

        option.backgroundColor = '';
        myChart.setOption(option, true);
        myChart.on('click', function (params) {
            instReleSendValue(params.name, container, pageId);
        });
    });
}

function getPMLinkMapOption(mapLoc) {
    var defOptions =
        {
            geo: {
                map: mapLoc,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#004882',
                        borderColor: '#20a6C7'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            }, title: {
                text: '',
                subtext: '',
                left: 'center',
                textStyle: {
                    color: '#222'
                }
            },
            tooltip: {
                trigger: 'item'
            }
        }

    return defOptions;
}

function loadPMMapScatter(location, data, myChart, pageId, container) {
    $.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
        if (xdata) {
            echarts.registerMap("map" + location, xdata);
        }

        var option = getPMMapScatterOption("map" + location);
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

function getPMMapScatterOption(mapLoc) {
    var defOptions =
        {
            geo: [{
                layoutCenter: ['50%', '50%'],
                layoutSize: 490,
                map: mapLoc,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 0.7,//区域边框宽度
                        borderColor: '#32FCB1',//区域边框颜色
                        areaColor: '#09233C',
                        shadowBlur: 10,
                        shadowColor: '#32FCB1'
                    },
                    emphasis: {
                        areaColor: '#2B91B7',
                    }
                },
            }, {
                map: mapLoc,
                layoutCenter: ['50%', '50%'],
                layoutSize: 490,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 0.2,//区域边框宽度
                        borderColor: '#32FCB1',//区域边框颜色
                        // areaColor:"#ffefd5",//区域颜色
                        areaColor: '#09233C',
                    }
                },
            }],
            title: {
                show: false,
                text: '',
                subtext: '',
                left: 'center',
                textStyle: {
                    color: '#222'
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(100,149,237,1)',
                borderColor: '#FFFFCC',
                showDelay: 0,
                hideDelay: 0,
                enterable: true,
                transitionDuration: 0,
                extraCssText: 'z-index:100',
                textStyle:{
                    align:'left'
                },
                formatter: function (params, ticket, callback) {
                    //根据业务自己拓展要显示的内容
                    var res = "";
                    var name = params.name;
                    var value = params.value;
                    res = "<span style='color:#fff;'>" + name + "</span>" + value[2];
                    return res;
                }
            },
        }

    return defOptions;
}

function loadMap(location, data, myChart) {
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
        var option = chartOption(data.cmp.cmpId,'12', data.cmpInstEntity);

        $.extend(true, option, data.chartOptions);
        option.title.text = '';
        option.backgroundColor = '';
        myChart.setOption(option, true);

        //用于自定义tooltip
        pmMapSeries = series;

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
    //location 改为从当前数据中获取 2019-01-23
    //var location = ($('#location').val()?$('#location').val():'370000');

    var element = ( idx < 0 ? data : data.cmpInsts[idx]);//当idx<0时，element即是data；idx>0时，element为cmpInsts[idx]
    var container = element.cntId;

    var location = '370000';
    if(element && element.cmpInstEntity){
        var settings = eval('(' + element.cmpInstEntity + ')');
        if(settings && settings.chooseolocation){
            location = settings.chooseolocation;
        }
    }

    var xtheme = (data.theme?data.theme:'');

    //页面属性，初始化返回名为dataVisPage；其余情况返回名为page,包括创建人、创建时间、页面id、tpl等
    var dataVisPage = ( idx < 0 ? data.page : data.dataVisPage );
    var pageFontSize = ( dataVisPage.pageEntity ?
        ($.parseJSON(dataVisPage.pageEntity)['fontSize'] ?
            $.parseJSON(dataVisPage.pageEntity)['fontSize'] : '12') : '12' );

    var pageId = dataVisPage.pageId;

    var option = chartOption(element.cmpId,pageFontSize,element.cmpInstEntity);

    var divMaxorContainer = (idx == -3 ? 'divMax' : container);//初始化与divMax时container不一样

    if (element.cmp.cmpType == "kpi") {
        //非echarts组件，首先移除_echarts_instance_属性

        $('#' + container ).removeAttr('_echarts_instance_');

        var kpi = element.chartOptions.kpi;

        if (element.chartOptions.kpiShowType == "stress") {
            $('#' + container).prev().html(element.chartOptions.title.text);
            var tableStyle = eval('(' + element.cmpInstEntity + ')');
            $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
            if (kpi != null && kpi.length > 0) {
                var kpiHtml = "";
                if (kpi.length == 4) {
                    var kpiChar = kpi[2] + "";
                    if (kpi[3].indexOf('-') >= 0) {
                        for (var x = 0; x < kpiChar.length; x++) {
                            kpiHtml += '<span class="num">' + kpiChar.charAt(x) + '</span>';
                        }
                        kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                        kpiHtml += '<span>环比下降</span>';
                        kpiHtml += '<span class="color-green fs-14">' + kpi[3] + '</span>';
                    } else {
                        for (var x = 0; x < kpiChar.length; x++) {
                            kpiHtml += '<span class="num">' + kpiChar.charAt(x) + '</span>';
                        }
                        kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                        kpiHtml += '<span>环比上升</span>';
                        kpiHtml += '<span class="color-red fs-14">' + kpi[3] + '</span>';
                    }
                } else if (kpi.length == 3) {
                    for (var x = 0; x < kpi[2].length; x++) {
                        kpiHtml += '<span class="num">' + kpi[2].charAt(x) + '</span>';
                    }
                    kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                }
                $('#' + container).empty().html(kpiHtml);
            }
        } else if (element.chartOptions.kpiShowType == "multiple") {//标准：一个或者多个指标并列展示
            $('#' + container).prev().html(element.chartOptions.title.text);
            var tableStyle = eval('(' + element.cmpInstEntity + ')');
            $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
            if (kpi != null && kpi.length > 0) {
                var kpihtml="";
                if(tableStyle.fontsize==""){
                    tableStyle.fontsize="12";
                }
                if(tableStyle.fontcolor==""){
                    tableStyle.fontcolor="black";
                }
                kpihtml+="<span style='font-size: "+tableStyle.fontsize+"px;color: "+tableStyle.fontcolor+"'>";
                for (var i=0;i<kpi.length;i++){
                    kpihtml+=kpi[i];
                }
                kpihtml+="</span>";
                $('#' + container).html(kpihtml);
            }
        } else if (element.chartOptions.kpiShowType == "inwardLevel") {

        }
        else {
            $('#' + container).prev().html(element.chartOptions.title.text);
            var tableStyle = eval('(' + element.cmpInstEntity + ')');
            $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
            if (kpi != null && kpi.length > 0) {
                if (kpi.length == 4) {
                    $('#' + container + " span.num1").html(toThousands(kpi[2]));

                    if (kpi[3].indexOf('-') >= 0) {
                        $('#' + container + " span.unit").html(kpi[1] + '<font class="color-green mgl-10">↓</font><font class="color-green">' + kpi[3] + '</font>');
                    } else {
                        $('#' + container + " span.unit").html(kpi[1] + '<font class="color-red mgl-10">↑</font><font class="color-red">' + kpi[3] + '</font>');
                    }
                } else if (kpi.length == 3) {
                    $('#' + container + " span.num1").html(toThousands(kpi[2]));
                    $('#' + container + " span.unit").html(kpi[1]);
                }
            }
        }
    } else if (element.cmp.cmpType == "list") {

        //非echarts组件，首先移除_echarts_instance_属性
        $('#' + container ).removeAttr('_echarts_instance_');

        //加标题，divMax状态下标题在parent().prev()节点
        if ( idx == -3){
            $('#divMax').parent().prev().html(element.chartOptions.title.text);
        }else {
            $('#' + container).prev().html(element.chartOptions.title.text);
        }
        $('#' + divMaxorContainer).addClass("scrollBar");
        //取颜色
        //类似titlecolor非驼峰命名为页面标题颜色样式，titleColor驼峰命名为table的颜色样式，textColor1和textColor2为单双行
        if (element.cmpInstEntity != undefined) {

            var tableStyle = eval('(' + element.cmpInstEntity + ')');

            $('#' + container).prev().attr("style", "font-size:" + tableStyle.titlefont + "px;" + "color:" + tableStyle.titlecolor);
            var thColor = ( tableStyle.titleColor ? tableStyle.titleColor : "white" );
            var trColor1 = ( tableStyle.textColor1 ? tableStyle.textColor1 : "transparent" );
            var trColor2 = ( tableStyle.textColor2 ? tableStyle.textColor2 : "transparent" );
            var fontColor = ( tableStyle.fontColor ? tableStyle.fontColor : "#333" );
            var tableType = ( tableStyle.tableType ? tableStyle.tableType : "normal" );

        }
        if (element.chartOptions.data != undefined) {
            if (tableType == "move") {
                $('#' + divMaxorContainer).css("overflow", "hidden");
                var table = "";
                for (var y = 0; y < element.chartOptions.data.length; y++) {
                    if (y == 0) {   //首行为表头th
                        for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                            table += "<div style='float:left;text-align:center;color:" + thColor + ";width: " + $('#' + divMaxorContainer).width() / element.chartOptions.data[y].length + "px;'><b>";
                            table += element.chartOptions.data[y][x];
                            table += "</b></div>";
                        }
                        table += "<marquee direction='up' scrollamount=2  height='" + $('#' + divMaxorContainer).height() + "'><table style='color:" + fontColor + ";text-align: center;height: " + $('#' + divMaxorContainer).height() + "px;width: " + $('#' + divMaxorContainer).width() + "px;'>";
                    } else {
                        if (y % 2 == 1) {
                            table += "<tr class='tdclass' style='background-color: " + trColor1 + "'>";
                        } else {
                            table += "<tr class='tdclass' style='background-color: " + trColor2 + "'>";
                        }
                        for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                            table += "<td style='text-align:center;color:" + fontColor + ";width: " + $('#' + divMaxorContainer).width() / element.chartOptions.data[y].length + "px;'>";
                            table += element.chartOptions.data[y][x];
                            table += "</td>";
                        }
                        table += "</tr>";
                    }
                }
                table += "</table>";
                table += " </marquee>";
            } else if (tableType == "normal") {
                $('#' + divMaxorContainer).css("overflow", "auto");
                var table = "<table style='color:" + fontColor + ";text-align: center;height: " + $('#' + divMaxorContainer).height() + "px;width: " + $('#' + divMaxorContainer).width() + "px;'>";
                for (var y = 0; y < element.chartOptions.data.length; y++) {
                    if (y == 0) {
                        table += "<thead>";
                        table += "<tr style='color: " + thColor + "'>";
                        for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                            table += "<th>";
                            table += element.chartOptions.data[y][x];
                            table += "</th>";
                        }
                        table += "</tr>";
                        table += "</thead>";
                    } else {
                        if (y % 2 == 1) {
                            table += "<tr class='tdclass' style='background-color: " + trColor1 + "'>";
                        } else {
                            table += "<tr class='tdclass' style='background-color: " + trColor2 + "'>";
                        }
                        for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                            table += "<td>";
                            table += element.chartOptions.data[y][x];
                            table += "</td>";
                        }
                        table += "</tr>";
                    }
                }
                table += "</table>";
            }
        }

        $('#' + divMaxorContainer).html(table);

    }
    else if (element.cmp.cmpType == "video") {
        var videohtml = '';
        //<video src="../static/visual/demo/demo1.mp4" style="width: 100%;height: 100%;" autoplay="autoplay" muted loop controls ></video>
        //非echarts组件，首先移除_echarts_instance_属性
        $('#' + divMaxorContainer ).removeAttr('_echarts_instance_');
        $('#' + divMaxorContainer).prev().html(element.chartOptions.title.text);
        if (element.cmpInstEntity != undefined) {
            var tableStyle = eval('(' + element.cmpInstEntity + ')');
            $('#' + container).prev().attr("style", "font-size:" + tableStyle.titlefont + "px;" + "color:" + tableStyle.titlecolor);

            var autoplay = tableStyle && tableStyle.autoplay==1?"autoplay":"";  //如果出现该属性，则视频在就绪后马上播放。
            var controls = tableStyle && tableStyle.controls==1?"controls":"";  //如果出现该属性，则向用户显示控件，比如播放按钮。
            var muted = tableStyle && tableStyle.muted==1?"muted":"";           //规定视频的音频输出应该被静音。
            var loop = tableStyle && tableStyle.loop==1?"loop":"";              //如果出现该属性，则当媒介文件完成播放后再次开始播放。
            var src = tableStyle && tableStyle.src?tableStyle.src:"";        //要播放的视频的 URL。

            videohtml += '<video src="'+ src +
                '" style="width: 100%;height: 100%;" ' + autoplay + ' ' + controls + ' ' + muted + ' ' + loop + ' '
                + '></video>';

        }
        $('#' + divMaxorContainer).html(videohtml);
    }else {
        // 获取echarts实例
            /*echarts组件切换为list、kpi时，container节点的_echarts_instance_属性默认仍为绑定状态，默认绑定状态下echarts不再向节点添加canvas
        需在切换为list、kpi时手动removeAttr(_echarts_instance_)*/
            //某个节点有没有echarts实例 是通过看该节点有没有_echarts_instance_属性，_echarts_instance_属性被移走，将无法再通过节点寻找此实例
        var myChart;

        if ( echarts.getInstanceByDom(document.getElementById(divMaxorContainer)) ){
            myChart = echarts.getInstanceByDom(document.getElementById(divMaxorContainer));
        }
        else {
            if (xtheme) {
                myChart = echarts.init(document.getElementById(divMaxorContainer), xtheme);
            } else {
                myChart = echarts.init(document.getElementById(divMaxorContainer));
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
                loadMap(map.mapCode, map.mapOptions, myChart);
                // console.log(map);
            });

            $.extend(true, option, element.chartOptions);
            option.title.text = '';
            loadMap(location, element, myChart);

            mapStack.push({
                mapCode: location,
                mapOptions: element
            });

            $('#contextMenu').hide();
            myChart.on('click', function (params) {
                var name = params.name;
                instReleSendValue(params.name, container, pageId);
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
                            loadMap(selLocation, xxdata, myChart);

                            $('#contextMenu').show();
                        }
                    })
                }
            });
        } else if (element.cmp.cmpType == "smap") {
            // loadPMLinkMap(location, element, myChart, pageId, container);
            loadPMLinkMap(location, element, myChart, pageId, container);
        } else if (element.cmp.cmpType == "ssmap") {
            var pageJsons = $.parseJSON(element.cmpInstEntity);
            if (pageJsons['chooselocation'] != null && pageJsons['chooselocation'] !="") {
                chooselocation = pageJsons['chooselocation'];
            }
            loadPMMapScatter(chooselocation, element, myChart, pageId, container);
        } else if (element.cmp.cmpType == "radar") {
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
                instReleSendValue(params.name, container, pageId);
            });
        }  else {
            // 设置标题
            if ( element.chartOptions.linkurl ) {
                $('#' + container).prev().html(element.chartOptions.title.text + '<span class="linkMore"><a href="' + element.chartOptions.linkurl + '" target="_blank">更多...</a></span>');
            } else {
                $('#' + container).prev().html(element.chartOptions.title.text);
                if ( element.cmpInstEntity ) {
                    var entity = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().attr("style", "font-size:" + entity.titlefont + "px;" + "color:" + entity.titlecolor);
                }
            }

            $.extend(true, option, element.chartOptions);

            if ( eval('(' + element.cmpInstEntity + ')').simplifyBar != undefined && eval('(' + element.cmpInstEntity + ')').simplifyBar == "1" ){

                option.yAxis.splitLine.show = false;
                option.xAxis.splitLine.show = false;

                $.extend(true,option,basicbarThemeSimplify(element.cmpInstEntity));

                for ( i = 0; i < option.series.length; i++ ){
                    $.extend(true,option.series[i],labelOption(element.cmpInstEntity));
                }
            }
            //barline已删除
            if (element.cmp.cmpType == "line"){
                var entity = eval('(' + element.cmpInstEntity + ')');
                if (entity.smooth=="1"){//折线图平滑显示
                    for (var i=0;i<option.series.length;i++){
                        option.series[i]["smooth"]=true;
                    }
                }
                if (entity.gcColor!=""&&entity.gcColor!=undefined){//折线图渐变阴影
                    if(entity.gcColor=="transparent"){
                        for (var i=0;i<option.series.length;i++){
                            option.series[i].itemStyle.normal["areaStyle"]={};
                        }
                    }else {
                        var gcColor=entity.gcColor.toString().split("\,");
                        for (var i=0;i<option.series.length;i++){
                            option.series[i].itemStyle.normal["areaStyle"]={color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 2,
                                    [
                                        {offset: 0, color: gcColor[i%gcColor.length]},
                                        {offset: 1, color: 'transparent'}
                                    ]
                                )};
                        }
                    }
                }
                if(entity.isLegend=="0"&&entity.isLegend!=undefined){
                    option.legend={};
                }
            }
            if (element.cmp.cmpId=="stackedbar"&&eval('(' + element.cmpInstEntity + ')').axisdirection=="vertical"){
                var axistemp=option.yAxis;
                option.yAxis=option.xAxis;
                option.xAxis=axistemp;
            }

            option.title.text = '';
            option.backgroundColor = '';
            myChart.setOption(option, true);


            myChart.on('click', function (params) {
                instReleSendValue(params.name, container, pageId);
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
    }
    // console.log($("#" + container).children('.echart-set').length ? true : false );
    // console.log($("#" + container).children('.echart-set') ? $("#" + container).children('.echart-set').attr('id') : false );
    //样式有点问题
    // if (element.cmp.cmpType != "kpi" && idx != -3 && $("#" + container).children('.echart-set').length == 0) {
    //     var idname = "max_" + container;
    //     var echartset = "<div class='echart-set' style='z-index:9999' id='" + idname + "' onclick='divMax(\"" + container + "\",\"" + pageId + "\")'> </div>";
    //     $("#" + container).append(echartset);
    //     $("#" + idname).append("<img src='../static/visual/images/icon-amplifica.png' style=\"width: 20px;\" title=\"放大\"/>");
    // }
    // var ignorePageId = new RegExp('[112]');
    if (element.cmp.id == "basicbar" && pageId != 112 && pageId != 118) {    //basicbar类型的图表全部往左平移15px
        $('#' + container).children(":first").children().css({'left':'-15px'});
    }
}
