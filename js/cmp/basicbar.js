/**
 * 柱状图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function(type, fontSize, entityBox){
            var styleBox = eval('('+entityBox+')');
            var legendIsShow = styleBox.legendIsShow == 0?false:true;
            var legendLeft = styleBox.legendLeftVal?styleBox.legendLeftVal:'auto';
            var legendTop = styleBox.legendTopVal?styleBox.legendTopVal:'auto';
            var digitalUnit = styleBox.digitalUnit?styleBox.digitalUnit:'';
            var orientVal = styleBox.orientValType?styleBox.orientValType:'horizontal';
            var rotate = styleBox.rotate?styleBox.rotate:0;

            return {
                xAxis: {
                    axisLabel: {
                        rotate:rotate,
                        textStyle: {
                            // fontSize: fontSize,
                            color: '#fff'
                        }
                    }
                },
                yAxis: {
                    name:digitalUnit?('单位（'+digitalUnit+'）'):digitalUnit,
                    nameGap:10,
                    nameTextStyle:{
                        color:'#fff'
                    },
                    axisLabel: {
                        // formatter: '{value} '+digitalUnit,
                        formatter: '{value} ',
                        textStyle: {
                            fontSize: fontSize,
                            color: '#fff'
                        }
                    }
                },
                legend: {
                    //backgroundColor: '#FFF',
                    show: legendIsShow,
                    textStyle: {
                        fontSize: fontSize,
                        color: '#fff'
                    },
                    orient: orientVal,
                    left: legendLeft,
                    top: legendTop,
                    // x: '75%',
                    // top: '5%',
                    itemWidth: 5,
                    itemHeight: 3
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    top: '15%',
                    containLabel: true
                }
            };

        }
    }
    exports('basicbar', obj);
});