/**
 * 表格
 */
layui.define(['jquery'], function(exports) {
    var $ = layui.jquery;
    var obj = {
        render: function (idx,element, divMaxorContainer) {
            //非echarts组件，首先移除_echarts_instance_属性
            $('#' + divMaxorContainer).removeAttr('_echarts_instance_');

            //加标题，divMax状态下标题在parent().prev()节点
            if (idx == -3) {
                $('#divMax').parent().prev().html(element.chartOptions.title.text);
            } else {
                $('#' + divMaxorContainer).prev().html(element.chartOptions.title.text);
            }
            $('#' + divMaxorContainer).addClass("scrollBar");
            //取颜色
            //类似titlecolor非驼峰命名为页面标题颜色样式，titleColor驼峰命名为table的颜色样式，textColor1和textColor2为单双行
            if (element.cmpInstEntity != undefined) {

                var tableStyle = eval('(' + element.cmpInstEntity + ')');

                $('#' + divMaxorContainer).prev().attr("style", "font-size:" + tableStyle.titlefont + "px;" + "color:" + tableStyle.titlecolor);
                var thColor = ( tableStyle.titleColor ? tableStyle.titleColor : "white" );
                var trColor1 = ( tableStyle.textColor1 ? tableStyle.textColor1 : "transparent" );
                var trColor2 = ( tableStyle.textColor2 ? tableStyle.textColor2 : "transparent" );
                var fontColor = ( tableStyle.fontColor ? tableStyle.fontColor : "#333" );
                var tableType = ( tableStyle.tableType ? tableStyle.tableType : "normal" );

            }
            if (element.chartOptions.data != undefined) {
                if (tableType == "move") {
                    $('#' + divMaxorContainer).css("overflow", "hidden");
                    var table = "";
                    for (var y = 0; y < element.chartOptions.data.length; y++) {
                        if (y == 0) {   //首行为表头th
                            for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                                table += "<div style='float:left;text-align:center;color:" + thColor + ";width: " + $('#' + divMaxorContainer).width() / element.chartOptions.data[y].length + "px;'><b>";
                                table += element.chartOptions.data[y][x];
                                table += "</b></div>";
                            }
                            table += "<marquee direction='up' scrollamount=2  height='" + $('#' + divMaxorContainer).height() + "'><table style='color:" + fontColor + ";text-align: center;height: " + $('#' + divMaxorContainer).height() + "px;width: " + $('#' + divMaxorContainer).width() + "px;'>";
                        } else {
                            if (y % 2 == 1) {
                                table += "<tr class='tdclass' style='background-color: " + trColor1 + "'>";
                            } else {
                                table += "<tr class='tdclass' style='background-color: " + trColor2 + "'>";
                            }
                            for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                                table += "<td style='text-align:center;color:" + fontColor + ";width: " + $('#' + divMaxorContainer).width() / element.chartOptions.data[y].length + "px;'>";
                                table += element.chartOptions.data[y][x];
                                table += "</td>";
                            }
                            table += "</tr>";
                        }
                    }
                    table += "</table>";
                    table += " </marquee>";
                } else if (tableType == "normal") {
                    $('#' + divMaxorContainer).css("overflow", "auto");
                    var table = "<table style='color:" + fontColor + ";text-align: center;height: " + $('#' + divMaxorContainer).height() + "px;width: " + $('#' + divMaxorContainer).width() + "px;'>";
                    for (var y = 0; y < element.chartOptions.data.length; y++) {
                        if (y == 0) {
                            table += "<thead>";
                            table += "<tr style='color: " + thColor + "'>";
                            for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                                table += "<th>";
                                table += element.chartOptions.data[y][x];
                                table += "</th>";
                            }
                            table += "</tr>";
                            table += "</thead>";
                        } else {
                            if (y % 2 == 1) {
                                table += "<tr class='tdclass' style='background-color: " + trColor1 + "'>";
                            } else {
                                table += "<tr class='tdclass' style='background-color: " + trColor2 + "'>";
                            }
                            for (var x = 0; x < element.chartOptions.data[y].length; x++) {
                                table += "<td>";
                                table += element.chartOptions.data[y][x];
                                table += "</td>";
                            }
                            table += "</tr>";
                        }
                    }
                    table += "</table>";
                }
            }

            $('#' + divMaxorContainer).html(table);
        }
    }
    exports('list', obj);
});