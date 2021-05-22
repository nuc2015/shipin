/**
 * 饼状图
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
                series: [
                    {
                        radius: '60%'
                        //  center: ['50%', '60%'],

                    }
                ]
            };
        }
    }
    exports('piechart', obj);
});