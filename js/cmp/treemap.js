/**
 * 矩形树图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            return {
                //color:['#2ecc71','#1abc9c','#1abc9c','#4ba477','#3bbf7c'],
                series: [{
                    squareRatio: 1.2,
                    roam: false,
                    nodeClick: false
                }]
            };
        }
    }
    exports('treemap', obj);
});