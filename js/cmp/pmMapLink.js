/**
 * 集聚地图
 */
layui.define(function(exports) {
    var obj = {
        chartOption: function (mapLoc) {
            var defOptions =
                {
                    geo: {
                        map: mapLoc,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#004882',
                                borderColor: '#20a6C7'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    }, title: {
                    text: '',
                    subtext: '',
                    left: 'center',
                    textStyle: {
                        color: '#222'
                    }
                },
                    tooltip: {
                        trigger: 'item'
                    }
                }

            return defOptions;

        }
    }

    exports('pmMapLink', obj);
});