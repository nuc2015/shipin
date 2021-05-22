/**
 * 词云图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            return {
                tooltip: {},
                series: [{
                    type: 'wordCloud',
                    //size: ['9%', '99%'],
                    sizeRange: [12, 80],
                    //textRotation: [0, 45, 90, -45],
                    rotationRange: [-45, 90],
                    //shape: 'circle',
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 6
                    },
                    textStyle: {
                        normal: {
                            color: function () {
                                return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }
                }]
            };
        }
    }
    exports('wordCloud', obj);
});