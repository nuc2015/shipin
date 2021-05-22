/**
 * 南丁格尔图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
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
        }
    }
    exports('ndgechart', obj);
});