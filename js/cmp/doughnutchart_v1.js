/**
 * 环形图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            var styleBox = eval('(' + entityBox + ')');
            var legendIsShow = styleBox.legendIsShow == 0 ? false : true;
            var legendLeft = styleBox.legendLeftVal ? styleBox.legendLeftVal : 'auto';
            var legendTop = styleBox.legendTopVal ? styleBox.legendTopVal : 'auto';
            var lengths = styleBox.labellineShort ? [3, 3] : [15, 25];
            var orientVal = styleBox.orientValType ? styleBox.orientValType : 'horizontal';
            var radiusIn = styleBox.radiusIn;
            var radiusOut = styleBox.radiusOut;
            var radius = radiusIn && radiusOut ? [radiusIn, radiusOut] : ["50%", "70%"];

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
                        labelLine: {
                            normal: {
                                length: lengths[0],
                                length2: lengths[1]
                            }

                        }
                    }
                ]
            };
        }
    }
    exports('doughnutchart', obj);
});