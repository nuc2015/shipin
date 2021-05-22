/**
 * 横向柱状图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            var styleBox = eval('('+entityBox+')');
            var digitalUnit = styleBox.digitalUnit?styleBox.digitalUnit:'';
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
                        formatter: '{value} ' + digitalUnit,
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
        }
    }
    exports('horizonbar', obj);
});