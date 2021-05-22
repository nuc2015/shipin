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
            var labelposition = styleBox.labelposition ? styleBox.labelposition : 'center';
            var formatter = styleBox.formatter ? styleBox.formatter : '{d}%';  //{a} \n{b}: {c} ({d}%)
            var radiusIn = styleBox.radiusIn;
            var seriesItemLength = radiusIn ? radiusIn.split(",").length : 1;
            // var radiusOut = styleBox.radiusOut;
            // var radius = radiusIn && radiusOut ? [radiusIn, radiusOut] : ["50%", "70%"];

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
                        // radius: radius,
                        label: {
                            normal: {
                                position: labelposition,
                                padding: [15, 0, 0, 0],
                                //verticalAlign: 'middle',
                                formatter: formatter,   //{a} \n{b}: {c} ({d}%)  params.seriesName  params.name  params.value  params.percent
                                // formatter: function(params){
                                //     debugger;
                                //     var res = '';
                                //     if(params.dataIndex==0){
                                //         res += params.percent+"%"+"\n"+params.seriesName;
                                //     }
                                //     return res;
                                // },
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