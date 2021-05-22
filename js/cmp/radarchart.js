/**
 * 雷达图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
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
        }
    }
    exports('radarchart', obj);
});