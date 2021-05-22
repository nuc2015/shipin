/**
 * 散点图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            var styleBox = eval('(' + entityBox + ')');

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
        }
    }
    exports('basicscatterchart', obj);
});