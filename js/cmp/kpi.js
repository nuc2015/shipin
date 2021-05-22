/**
 * 指标
 */
layui.define(['jquery'], function(exports) {
    var $ = layui.jquery;
    var obj = {
        render : function (idx,element,container) {
                //非echarts组件，首先移除_echarts_instance_属性
                $('#' + container ).removeAttr('_echarts_instance_');

                var kpi = element.chartOptions.kpi;

                if (element.chartOptions.kpiShowType == "stress") {
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    var tableStyle = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
                    if (kpi != null && kpi.length > 0) {
                        var kpiHtml = "";
                        $.each(kpi,function (i,kpi) {
                            if (kpi.length == 4) {
                                var kpiChar = kpi[2] + "";
                                if (kpi[3].indexOf('-') >= 0) {
                                    for (var x = 0; x < kpiChar.length; x++) {
                                        kpiHtml += '<span class="num">' + kpiChar.charAt(x) + '</span>';
                                    }
                                    kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                                    kpiHtml += '<span>环比下降</span>';
                                    kpiHtml += '<span class="color-green fs-14">' + kpi[3] + '</span>';
                                } else {
                                    for (var x = 0; x < kpiChar.length; x++) {
                                        kpiHtml += '<span class="num">' + kpiChar.charAt(x) + '</span>';
                                    }
                                    kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                                    kpiHtml += '<span>环比上升</span>';
                                    kpiHtml += '<span class="color-red fs-14">' + kpi[3] + '</span>';
                                }
                            }
                            else if (kpi.length == 3) {
                                for (var x = 0; x < kpi[2].length; x++) {
                                    kpiHtml += '<span class="num">' + kpi[2].charAt(x) + '</span>';
                                }
                                kpiHtml += '<span class="unit">' + kpi[1] + '</span>';
                            }
                            if(i!=element.chartOptions.kpi.length-1){
                                kpiHtml += '<br/>';
                            }
                        })
                        $('#' + container).empty().html(kpiHtml);
                    }
                } else if(element.chartOptions.kpiShowType == "simpleStress"){ //第二种强调类型
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    var tableStyle = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
                    if (kpi != null && kpi.length > 0) {
                        var kpiHtml = "";
                        $.each(kpi,function (i,kpi) {
                            if (kpi.length == 3) {
                                var kpiChar = kpi[1] + "";
                                kpiHtml += '<div class="mgt-20">';
                                kpiHtml += '<span class="dva fs-18 color-blue">' + kpi[0] + '</span>';
                                kpiHtml += '<span class="num-date js-num dva" data-num="' + kpiChar + '">';
                                for (var x = 0; x < kpiChar.length; x++) {
                                    kpiHtml += '<i class="num-b" data-num="' + kpiChar.charAt(x) + '">' + kpiChar.charAt(x) + '</i>';
                                }
                                kpiHtml += '</span>';
                                kpiHtml += '<span class="dva font-12">(' + kpi[2] + ')</span>';
                                kpiHtml += '</div>';
                                if(i!=element.chartOptions.kpi.length-1){
                                    kpiHtml += '<br/>';
                                }
                            }

                        })
                        $('#' + container).empty().html(kpiHtml);
                    }
                }
                else if (element.chartOptions.kpiShowType == "multiple") {//标准：一个或者多个指标并列展示
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    var tableStyle = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
                    if (kpi != null && kpi.length > 0) {
                        var kpihtml="";
                        $.each(kpi,function (i,kpi) {
                            if(tableStyle.fontsize==""){
                                tableStyle.fontsize="12";
                            }
                            if(tableStyle.fontcolor==""){
                                tableStyle.fontcolor="black";
                            }
                            kpihtml+="<span style='font-size: "+tableStyle.fontsize+"px;color: "+tableStyle.fontcolor+"'>";
                            for (var i=0;i<kpi.length;i++){
                                kpihtml+=kpi[i];
                            }
                            kpihtml+="</span>";
                            if(i!=element.chartOptions.kpi.length-1){
                                kpiHtml += '<br/>';
                            }
                        });
                        $('#' + container).html(kpihtml);
                    }
                } else if (element.chartOptions.kpiShowType == "inwardLevel") {

                } else if (element.chartOptions.kpiShowType == "custom") {
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    var tableStyle = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
                    if (kpi != null && kpi.length > 0) {
                        var tplCode = element.chartOptions.tplCode || "";
                        var kpiHtml = "";
                        /**
                         * //例如：tplCode为
                         * <div class='mgt-20'>
                         * <span class='dva fs-18 color-blue w-130'>{{list_value1}}</span>
                         * <span class='num-date js-num dva' data-num='001234'>
                         *     {{each list_value2}}<i class='num-b' data-num='0'>({{item_value}}</i>{{/each}}
                         * </span>
                         * <span class='dva font-12'>{{list_value3}})</span>
                         *</div>
                         * 赋值后html为：
                         * <div class="mgt-20">
                                <span class="dva fs-18 color-blue">当日任务总数</span>
                                <span class="num-date dva" data-num="009999"><i class="" data-num="0">0</i><i class="num-b">0</i><i class="num-b" data-num="9">9</i><i class="num-b" data-num="9">9</i><i class="num-b" data-num="9">9</i><i class="num-b" data-num="9">9</i></span>
                                <span class="dva font-12">(个)</span>
                         </div>
                         * 自定义代码模板的规则为：每一个变量值以{{list_valuei}}表示，其中i表示第几个变量
                         *                         特殊情况：数据值循环显示每一位，需要循环显示的代码包含在{{each list_valuei}}{{/each}}中，
                         *                         循环显示的代码中的变量以({{item_value}}表示
                         */
                        $.each(kpi,function (i,kpi) {
                            var tplCodeTemp = tplCode;
                            for (var i=0;i<kpi.length;i++){
                                if(tplCodeTemp.indexOf("{{each list_value"+(i+1)+"}}")!=-1){ //包含循环项
                                    if(tplCodeTemp.substring(tplCodeTemp.indexOf("list_value"+(i+1)+"}}")-5,tplCodeTemp.indexOf("list_value"+(i+1)+"}}")-1)=="each"){
                                        //特殊情况，一般是数字值每位单独显示
                                        var loopCode = ''; //需要循环显示的代码
                                        loopCode = tplCodeTemp.split("{{each list_value"+(i+1)+"}}")[1].split("{{/each}")[0];
                                        var kpiChar = kpi[i] + "";
                                        var replNewStr = "";
                                        for (var x = 0; x < kpiChar.length; x++) {
                                            replNewStr += loopCode.replace("{{item_value}}",kpiChar.charAt(x));
                                        }
                                        var replOldStr = "{{each list_value"+(i+1)+"}}" + loopCode + "{{/each}}";
                                        tplCodeTemp = tplCodeTemp.replace(replOldStr,replNewStr)
                                    }
                                }
                                else{
                                    tplCodeTemp = tplCodeTemp.replace("{{list_value"+(i+1)+"}}",kpi[i])
                                }
                            }
                            kpiHtml += tplCodeTemp;
                            // if(i!=element.chartOptions.kpi.length-1){
                            //     kpiHtml += '<br/>';
                            // }
                        });
                        $('#' + container).html(kpiHtml);
                    }
                }
                else {
                    $('#' + container).prev().html(element.chartOptions.title.text);
                    var tableStyle = eval('(' + element.cmpInstEntity + ')');
                    $('#' + container).prev().css("font-size", tableStyle.titlefont + "px").css("color", tableStyle.titlecolor);
                    if (kpi != null && kpi.length > 0) {
                        $.each(kpi,function (i,kpi) {
                            if (kpi.length == 4) {
                                $('#' + container + " span.num1").html(toThousands(kpi[2]));

                                if (kpi[3].indexOf('-') >= 0) {
                                    $('#' + container + " span.unit").html(kpi[1] + '<font class="color-green mgl-10">↓</font><font class="color-green">' + kpi[3] + '</font>');
                                } else {
                                    $('#' + container + " span.unit").html(kpi[1] + '<font class="color-red mgl-10">↑</font><font class="color-red">' + kpi[3] + '</font>');
                                }
                            }
                            else if (kpi.length == 3) {
                                $('#' + container + " span.num1").html(toThousands(kpi[2]));
                                $('#' + container + " span.unit").html(kpi[1]);
                            }
                        })
                    }
                }
        }

    };
    exports('kpi', obj);
});


