/**
 * 折柱混合
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function(type, fontSize, entityBox){
            var styleBox = eval('('+entityBox+')');
            var coordinateUnit = styleBox.coordinateUnit ? (styleBox.coordinateUnit).split(",") : ['','','',''];

            return {
                yAxis: [
                    {
                        type: 'value',
                        name: coordinateUnit[0],
                        axisLabel: {
                            formatter: '{value}'+coordinateUnit[1]
                        },
                        splitLine:{
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        name: coordinateUnit[2],
                        axisLabel: {
                            formatter: '{value}'+coordinateUnit[3]
                        },
                        splitLine:{
                            show: false
                        }
                    }
                ]
            };

        }
    }

    exports('barline', obj);
});