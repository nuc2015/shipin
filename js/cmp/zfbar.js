/**
 * 正负条形图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
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
                        barWidth: styleBox.barWidth
                    }
                ]
            };
        }
    }
    exports('zfbar', obj);
});