/**
 * 打点地图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (mapLoc) {
            // return {
            //     title: {
            //         show: false
            //     }
            // };
            var defOptions =
                {
                    geo: [{
                        layoutCenter: ['50%', '50%'],
                        layoutSize: 490,
                        map: mapLoc,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0.7,//区域边框宽度
                                borderColor: '#32FCB1',//区域边框颜色
                                areaColor: '#09233C',
                                shadowBlur: 10,
                                shadowColor: '#32FCB1'
                            },
                            emphasis: {
                                areaColor: '#2B91B7',
                            }
                        },
                    }, {
                        map: mapLoc,
                        layoutCenter: ['50%', '50%'],
                        layoutSize: 490,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0.2,//区域边框宽度
                                borderColor: '#32FCB1',//区域边框颜色
                                // areaColor:"#ffefd5",//区域颜色
                                areaColor: '#09233C',
                            }
                        },
                    }],
                    title: {
                        show: false,
                        text: '',
                        subtext: '',
                        left: 'center',
                        textStyle: {
                            color: '#222'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(100,149,237,1)',
                        borderColor: '#FFFFCC',
                        showDelay: 0,
                        hideDelay: 0,
                        enterable: true,
                        transitionDuration: 0,
                        extraCssText: 'z-index:100',
                        textStyle:{
                            align:'left'
                        },
                        formatter: function (params, ticket, callback) {
                            //根据业务自己拓展要显示的内容
                            var res = "";
                            var name = params.name;
                            var value = params.value;
                            res = "<span style='color:#fff;'>" + name + "</span>" + value[2];
                            return res;
                        }
                    },
                }

            return defOptions;
        }
    }
    exports('pmMapScatter', obj);
});