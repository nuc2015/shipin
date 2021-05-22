/**
 * 漏斗图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
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
        }
    }
    exports('funnelchart', obj);
});