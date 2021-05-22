
//config的设置是全局的
layui.config({
      base: '../file/cmp/' //存放拓展模块的根目录，组件新增时的上传目录，可以不用设定别名，以文件名作为模块名
}).extend({ //设定模块别名
    //工程中已有的组件模块
    // echartsCommon: '../../static/js/cmp/echartsCommon', //相对于base路径
    echartsCommon: '{/}../static/js/cmp/echartsCommon', //{/}的意思即代表采用自有路径，即不跟随 base 路径
    barline: '{/}../static/js/cmp/barline',
    basicbar: '{/}../static/js/cmp/basicbar',
    basicscatterchart : '{/}../static/js/cmp/basicscatterchart',
    doughnutchart: '{/}../static/js/cmp/doughnutchart',
    funnelchart: '{/}../static/js/cmp/funnelchart',
    horizonbar: '{/}../static/js/cmp/horizonbar',
    kpi: '{/}../static/js/cmp/kpi',
    list: '{/}../static/js/cmp/list',
    nestedpie: '{/}../static/js/cmp/nestedpie',
    piechart: '{/}../static/js/cmp/piechart',
    pmbar: '{/}../static/js/cmp/pmbar',
    pmMap: '{/}../static/js/cmp/pmMap',
    pmMapLink: '{/}../static/js/cmp/pmMapLink',
    pmMapScatter: '{/}../static/js/cmp/pmMapScatter',
    progressbar: '{/}../static/js/cmp/progressbar',
    radarchart: '{/}../static/js/cmp/radarchart',
    stackedbar: '{/}../static/js/cmp/stackedbar',
    treemap: '{/}../static/js/cmp/treemap',
    video: '{/}../static/js/cmp/video',
    wordCloud: '{/}../static/js/cmp/wordCloud',
    wordCloud2: '{/}../static/js/cmp/wordCloud2',
    zfbar: '{/}../static/js/cmp/zfbar'
});
// layui.use(['kpi'], function(){
//     var kpi = layui["kpi"];
//     kpi.render('qq','aa','dd');
// });
