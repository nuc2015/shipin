/**
 * 进度条
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (type, fontSize, entityBox) {
            return {
                title: {
                    x: '50%',
                    y: '45%',
                    textAlign: "center",
                    textStyle: {
                        fontWeight: 'normal',
                        color: 'blue'
                    },
                    subtextStyle: {
                        fontWeight: 'bold',
                        color: '#3ea1ff',
                        fontSize: 24
                    }
                },
                series: [
                    {
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        startAngle: 225,
                        hoverAnimation: false,
                        legendHoverLink: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    },
                    {
                        radius: ['52%', '68%'],
                        startAngle: 317,
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        legendHoverLin: false,
                        clockwise: false,
                        itemStyle: {
                            normal: {
                                borderColor: "transparent",
                                borderWidth: "20"
                            },
                            emphasis: {
                                borderColor: "transparent",
                                borderWidth: "20"
                            }
                        }
                        ,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }

                ]
            };
        }
    }

    exports('progressbar', obj);
});