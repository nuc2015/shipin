/**
 * 视频
 */
layui.define(['jquery'], function(exports) {
    var $ = layui.jquery;
    var obj = {
        render: function (idx,element, divMaxorContainer) {
            var videohtml = '';
            //<video src="../static/visual/demo/demo1.mp4" style="width: 100%;height: 100%;" autoplay="autoplay" muted loop controls ></video>
            //非echarts组件，首先移除_echarts_instance_属性
            $('#' + divMaxorContainer).removeAttr('_echarts_instance_');
            $('#' + divMaxorContainer).prev().html(element.chartOptions.title.text);
            if (element.cmpInstEntity != undefined) {
                var tableStyle = eval('(' + element.cmpInstEntity + ')');
                $('#' + divMaxorContainer).prev().attr("style", "font-size:" + tableStyle.titlefont + "px;" + "color:" + tableStyle.titlecolor);

                var autoplay = tableStyle && tableStyle.autoplay == 1 ? "autoplay" : "";  //如果出现该属性，则视频在就绪后马上播放。
                var controls = tableStyle && tableStyle.controls == 1 ? "controls" : "";  //如果出现该属性，则向用户显示控件，比如播放按钮。
                var muted = tableStyle && tableStyle.muted == 1 ? "muted" : "";           //规定视频的音频输出应该被静音。
                var loop = tableStyle && tableStyle.loop == 1 ? "loop" : "";              //如果出现该属性，则当媒介文件完成播放后再次开始播放。
                var src = tableStyle && tableStyle.src ? tableStyle.src : "";        //要播放的视频的 URL。

                videohtml += '<video src="' + src +
                    '" style="width: 100%;height: 100%;" ' + autoplay + ' ' + controls + ' ' + muted + ' ' + loop + ' '
                    + '></video>';

            }
            $('#' + divMaxorContainer).html(videohtml);
        }
    }
    exports('video', obj);
});