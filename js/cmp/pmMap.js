/**
 * 数据地图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox,series) {
            var styleBox = eval('(' + entityBox + ')');

            var tipFontSize = styleBox.tipFontSize ? styleBox.tipFontSize : 14; //悬浮信息字体大小
            var tipFontColor = styleBox.tipFontSize ? styleBox.tipFontColor : '#fff'; //悬浮信息字体颜色
            var tipBgColor = styleBox.tipFontSize ? styleBox.tipBgColor : 'rgba(50,50,50,0.7)'; //悬浮信息背景颜色

            //


            return {
                visualMap: {
                    min: 0,
                    max: 1000,
                    left: 'right',
                    top: 'bottom',
                    text: ['高', '低'],           // 文本，默认为数值文本
                    calculable: true,
                    itemHeight: 80,
                    textStyle: {
                        color: '#fff',
                        fontSize: fontSize + ''
                    },
                    padding: [0, 26]
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: tipBgColor,
                    // padding: [20, 10],
                    // formatter: "{a} <br/>{b}: {c} ({d}%)",
                    formatter: function (params) {
                        var res = params.name + '<br/>';
                        var myseries = series;
                        for (var i = 0; i < myseries.length; i++) {
                            for (var j = 0; j < myseries[i].data.length; j++) {
                                if (myseries[i].data[j].name == params.name) {
                                    res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>';
                                }
                            }
                        }
                        return res.replace("<br/>", "").length > 0 ? res : "暂无数据";

                    },
                    textStyle: {
                        color: tipFontColor,
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
        }
    }
    exports('pmMap', obj);
});