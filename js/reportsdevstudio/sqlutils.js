
var marketid="test";
var reportid="test1";

//$s对应的查询条件
function getquery_dates()
{
    var query_dates = new Array();

    var querycomment_strarray=document.getElementsByName("querycomment_str");//
    var timetype_strarray=document.getElementsByName("timetype_str");
    var timeformat_strarray=document.getElementsByName("timeformat_str");
    var timestr_steparray=document.getElementsByName("timestr_step");

    for(var q=0;querycomment_strarray!=null&&q<querycomment_strarray.length;q++) {
        var query_datestr = {querycomment: querycomment_strarray[q].value, timetype:timetype_strarray[q].value,timeformat:timeformat_strarray[q].value,timestr_step:timestr_steparray[q].value};
        query_dates.push(query_datestr);
    }
    return query_dates;

}





//获取[]分区属性
function getquery_partion()
{
    var partion=new Array();
   var partioncomment_strarray=document.getElementsByName("partioncomment_str");
   var partionformat_strarray=document.getElementsByName("partionformat");
    for(var q=0;partioncomment_strarray!=null&&q<partioncomment_strarray.length;q++) {
        var query_datestr = {partioncomment: partioncomment_strarray[q].value,partionformat:partionformat_strarray[p].value};
        partion.push(query_datestr)

    }
    return partion;
}

function openbaseinfo(collectid)
{

    //     return alert("R")
    art.dialog.open("/SqlDevBaseConfig", {
        id : "SqlDevBaseConfig",
        title : "报表基本信息",

        drag : true,
        background: 'idialog', // 背景色
        opacity: 0.31, // 透明度
        width : "50%",
        success: function(str) {
            art.dialog.list['addDialog'].close();

        }}, false);
    return true;



}

function getQueryInfoJson()
{
   var  query_dates= getquery_dates();
   var  query_partion=getquery_partion();


   var query_data={};
    query_data["query_dates"]=query_dates;
    query_data["query_partion"]=query_partion;
    return query_data;
}


function getQuerySqlColumnMetaInfoJson()
{

    var SqlColumnMetadata={};
    SqlColumnMetadata["tableMetaList"]=getTableMeta_datas();
    SqlColumnMetadata["subtotal"]="N";
    SqlColumnMetadata["delcheckindex"]="";
    SqlColumnMetadata["total"]="N";
    SqlColumnMetadata["sumitem"]="";
    SqlColumnMetadata["needsum"]="";

    return SqlColumnMetadata;



}



function saveQuerySqlColumnMeta()
{


    var sqldevform={};
    sqldevform.marketid=marketid;
    sqldevform.reportid=reportid;
    sqldevform.collectid="";
    sqldevform.creatorid="";
    sqldevform.sqlColumnMetadata=getQuerySqlColumnMetaInfoJson();
     //sqlColumnMetadata




    $.ajax({
        url: "/api/sqldev/savequerysqlcolumnmeta",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend:function (request) {
            ///  request.setRequestHeader("accessToken",accessToken);
        },
        async: false,
        data: JSON.stringify(sqldevform),
        success: function callbackFun(data) {
            //解析json
            if (data.responseCode == 200) {
                // alert(data.responseDesc)
                $("#avisqlinfo").attr({"data-content":data.responseDesc});
                $("#avisqlinfo").mouseover()

            }

            else {
                alert(data.responseDesc);
                return;
            }
        }
    });




}





function saveQuerySql()
{

    var sqldevform={};
    sqldevform.marketid=marketid;
    sqldevform.reportid=reportid;
    sqldevform.collectid="";
    sqldevform.creatorid="";
    sqldevform.getdatamethod="s";
    sqldevform.pname="";
    sqldevform.layout="1";
    sqldevform.advanceanalysis="";
    sqldevform.preday=$("#preday").val();
    sqldevform.premonth=$("#premonth").val();
    sqldevform.preyear=$("#preyear").val();

    sqldevform.sql=$("#querysqlid").val();
    sqldevform.databasesource=$("#databasesource").val();
    //   sqldevform.query_dates=getQueryInfoJson()["query_dates"];
    sqldevform.querydata=getQueryInfoJson();

    $.ajax({
        url: "/api/sqldev/savequerysql",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend:function (request) {
            ///  request.setRequestHeader("accessToken",accessToken);
        },
        async: false,
        data: JSON.stringify(sqldevform),
        success: function callbackFun(data) {
            //解析json
            if (data.responseCode == 200) {
                // alert(data.responseDesc)
                $("#avisqlinfo").attr({"data-content":data.responseDesc});
                $("#avisqlinfo").mouseover()
            }

            else {
                alert(data.responseDesc);
                return;
            }
        }
    });






}




//SQL验证
function avisql()
{
    var sqldevform = {};
  //  dataArray["sql"] =$("#querysqlid").val();

    sqldevform.preday=$("#preday").val();
    sqldevform.premonth=$("#premonth").val();
    sqldevform.preyear=$("#preyear").val();



    sqldevform.sql=$("#querysqlid").val();
    sqldevform.databasesource=$("#databasesource").val();
 //   sqldevform.query_dates=getQueryInfoJson()["query_dates"];
    sqldevform.querydata=getQueryInfoJson();


    $.ajax({
        url: "/api/sqldev/validsql",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend:function (request) {
            ///  request.setRequestHeader("accessToken",accessToken);
        },
        async: false,
        data: JSON.stringify(sqldevform),
        success: function callbackFun(data) {
            //解析json
            if (data.responseCode == 200) {
              // alert(data.responseDesc)
                $("#avisqlinfo").attr({"data-content":data.responseDesc});
                $("#avisqlinfo").mouseover()
                if(data.responseDesc=="true")
                {
                   // alert(data.columnmetalist.length)
                    wordcloud(data);
                    tbody_content="";
                    $.each( data.columnmetalist, function( index, val ) {
                           var columncomments=val.columncomment==null?"":val.columncomment;

                        if(index%5==0)
                        tbody_content+="<tr class='active'>";
                        else if(index%5==1)
                            tbody_content+="<tr class='success'>";
                        else if(index%5==2)
                            tbody_content+="<tr class='info'>";
                        else if(index%5==3)
                            tbody_content+="<tr class='warning'>";
                        else if(index%5==4)
                            tbody_content+="<tr class='danger'>";
                        tbody_content+='<td class="center">'+(index+1)+'</td>';

                        tbody_content+='<td class="hidden-xs" nowrap="nowrap">';
                        tbody_content+='<div class="checkbox-table">';
                        tbody_content+='<label >';
                        tbody_content+='    <input type="checkbox" class="flat-grey foocheck" checked onclick="javascript:changeCheckValue(this,\"'+index+'\")"> <input type="hidden" name="displayornot" value="" />/';
                        tbody_content+='</label>';
                        tbody_content+='<label >';
                        tbody_content+='    <input type="checkbox" name="group"  class="flat-grey foocheck" onclick="javascript:changeGroupCheckValue(this,\"'+index+'\")" /> <input type="hidden" name="groupornot" value="" />/';
                        tbody_content+='</label >';
                        tbody_content+='<label >';
                        tbody_content+='    <input type="checkbox" name="ifdel"  class="flat-grey foocheck"  onclick="javascript:changeDelCheckValue(this,,\"'+index+'\")" /> <input type="hidden" name="delornot" value="y" />';
                        tbody_content+='</label>';
                        tbody_content+=' </div></td>';


                        tbody_content+='<td class="hidden-xs" title="'+val.columntype+'">'+val.columnname+'</td>';
                        tbody_content+='<input type="hidden" name="targetwindowcode" value=""/><input type="hidden" name="targetwindowname" value=""/><input type="hidden" name="operate" value=""/><input type="hidden" name="columnname" value="'+val.columnname+'"/> <input type="hidden" name="columnmoreanalyse" value="" /> <input type="hidden" name="columntype" value="'+val.columntype+'" />';
                      //  tbody_content+='<td class="hidden-xs"> <span class="input-icon"><input class="form-control" type="text" name="columncomment" value="'+columncomments+'" /><i class="fa fa-hand-o-right"></i> </span></td>';
                        tbody_content+='<td class="hidden-xs"> <input class="form-control" type="text" name="columncomment" value="'+columncomments+'" /></td>';

                        tbody_content+='<td class="hidden-xs"><select name="ifdrill"><option value="0">不钻取</option></select></td>';
                        tbody_content+='<td class="hidden-xs" style="display:none"><select name="drilltarget"><option value="">请选择</option></select></td>';


                        tbody_content+='<td class="hidden-xs" nowrap="nowrap" style="display:none">自定义 <input type="hidden" name="multidrillmetainfo" value=""/></td>';
                        tbody_content+='<td class="hidden-xs" style="display:none"><select name="drillfiltersqlitemtemp"><option value="">--选项--</option></select> <input type="hidden" name="drillfiltersqlitem" value="" /></td>';
                        tbody_content+='<td class="hidden-xs" nowrap="nowrap">告警 格式   <input type="hidden" name="alertexpression" value="" /> <input type="hidden" name="formatexpression" value=""/></td>';
                        tbody_content+='<td class="hidden-xs"><select name="ifedit"><option value="N">不可编辑</option><option value="Y">可编辑</option></select></td>';
                        tbody_content+="</tr>";
                    });


                    $("#columnmetabody").html(tbody_content);
                }
            }

        else {
            alert(data.responseDesc);
    return;
}
}
});

}


function wordcloud(objectdata)
{
 //  alert(objectdata.wordCloudChartData);
    var chart = echarts.init(document.getElementById('wordcloudchart'));

    var option = {
        tooltip: {},
        series: [ {
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [12, 50],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            width: 300,
            height: 300,
            drawOutOfBound: true,
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
            },
            data: strToJson("["+objectdata.wordCloudChartData+"]")
        } ]
    };

    chart.setOption(option);

    window.onresize = chart.resize;

}
function strToJson(str){
    var json = eval('(' + str + ')');
    return json;
}
function getTableMeta_datas()
{
var columnnamearray=document.getElementsByName("columnname");
var columnmoreanalysearray=document.getElementsByName("columnmoreanalyse");
var columncommentarray=document.getElementsByName("columncomment");
var alertexpressionarray=document.getElementsByName("alertexpression");
var formatexpressionarray=document.getElementsByName("formatexpression");
var  columntypearray=document.getElementsByName("columntype");
var ifdrillarray=document.getElementsByName("ifdrill");
var ifeditarray=document.getElementsByName("ifedit");
var drilltargetarray=document.getElementsByName("drilltarget");
var drillfiltersqlitemarray=document.getElementsByName("drillfiltersqlitem");
var displayornotarray=document.getElementsByName("displayornot");
var groupornotarray=document.getElementsByName("groupornot");
var delornotarray=document.getElementsByName("delornot");
var multidrillmetainfoarray=document.getElementsByName("multidrillmetainfo");
var targetwindowcodearray=document.getElementsByName("targetwindowcode");
var targetwindownamearray=document.getElementsByName("targetwindowname");
var operatearray=document.getElementsByName("operate");

var meta_data=new Array();


    for(var q=0;columnnamearray!=null&&q<columnnamearray.length;q++) {
        var meta_str = {columnname: columnnamearray[q].value, columntype:columntypearray[q].value,columnmoreanalyse:columnmoreanalysearray[q].value,columncomment:columncommentarray[q].value,alertexpression: alertexpressionarray[q].value, formatexpression:formatexpressionarray[q].value,ifdrill:ifdrillarray[q].value,ifedit:ifeditarray[q].value,drilltarget: drilltargetarray[q].value, drillfiltersqlitem:drillfiltersqlitemarray[q].value,displayornot:displayornotarray[q].value,groupornot:groupornotarray[q].value, delornot:delornotarray[q].value,multidrillmetainfo:multidrillmetainfoarray[q].value,targetwindowcode:targetwindowcodearray[q].value,targetwindowname:targetwindownamearray[q].value,operate:operatearray[q].value};
        meta_data.push(meta_str);
    }





return meta_data;




}

function changeCheckValue(object,index)
{
    if(object.checked!=true)
    {
        document.getElementsByName("displayornot")[index].value="none";
    }
    else
    {
        document.getElementsByName("displayornot")[index].value="";
    }
    setAllDisplayColumnToSumItem();
}
function setAllDisplayColumnToSumItem()
{
    var ifsumcheckobject=document.getElementById("ifsum");
    var ifsubtotalobject=document.getElementById("ifsubtotal");
    if(ifsumcheckobject.checked==true||ifsubtotalobject.checked==true)
    {
        var itemshtml="";
        var displayarray=document.getElementsByName("display");
        for(var d=0;displayarray!=null&&d<displayarray.length;d++)
        {
            if(displayarray[d].checked==true)
            {
                var columnname=document.getElementsByName("columnmetaname")[d].value;
                itemshtml+="&nbsp &nbsp<input type='checkbox' checked name='sumitem' value='"+d+"'>&nbsp"+columnname+"&nbsp<select style='width:60px'><option value='SUM'>SUM</option></select>";
            }
        }
        document.getElementById("sumitems").innerHTML=itemshtml;
    }
}
function changeDelCheckValue(object,index)
{

    if(object.checked!=true)
    {
        document.getElementsByName("delornot")[index].value="";
    }
    else
    {
        document.getElementsByName("delornot")[index].value="y";
        document.getElementsByName("displayornot")[index].value="";
        document.getElementsByName("displayornot").checked=true;
    }

    var ifdelarray=document.getElementsByName("ifdel");
    var checkhtml="";
    for(var d=0;ifdelarray!=null&&d<ifdelarray.length;d++)
    {
        var comment=document.getElementsByName("columndescript")[d].value;
        if(comment=="")
            comment=document.getElementsByName("columnmetaname")[d].value;

        if(ifdelarray[d].checked==true)
        {

            checkhtml+="<input type='checkbox' checked name='delcheck' value='"+d+"'/>"+comment;
        }
    }
    document.getElementById("delcheckinfo").innerHTML=checkhtml;
//alert(checkhtml);

}
//有个原则是如果是分组的字段则一定要显示的
function changeGroupCheckValue(object,index)
{
    if(object.checked!=true)
    {
        document.getElementsByName("groupornot")[index].value="";
    }
    else
    {
        document.getElementsByName("groupornot")[index].value="y";
        document.getElementsByName("displayornot")[index].value="";
        document.getElementsByName("displayornot").checked=true;
    }
}

function jsTrim(str)
{
    return str;
}
var querycomment_str=new Array();
var timetype_str=new Array();
var timeformat_str=new Array();
var timestr_step=new Array();
var relatetablename=new Array();//
var relatetableid=new Array();//
var editcomment=new Array();
var editvalue=new Array();
var editnumcomment=new Array();
var editnumvalue=new Array();
var editlikecomment=new Array();
var editlikevalue=new Array();
var partioncomment_str=new Array();
var partionformat=new Array();
//
var relatetablenamesource=new Array();
var relatetabledescriptsource=new Array();
var relatetableidsource=new Array();
//

loaddatabasesource(null);
//SQL验证
function loaddatabasesource(databasesourceid)
{
    var dataArray = {};
    dataArray["databasesourceid"] =databasesourceid;

    $.ajax({
        url: "/api/sqldev/databasesourceinfo",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend:function (request) {
            ///  request.setRequestHeader("accessToken",accessToken);
        },
        async: false,
        data: JSON.stringify(dataArray),
        success: function callbackFun(data) {
            //解析json
            if (data.responseCode == 200) {
             var  databasesourceselectobject=document.getElementById("databasesource");
                   databasesourceselectobject.options.length=0;
                //   databasesourceselectobject.options.add(new Option("缺省数据源","200"));
                var info=data.data;
                $.each( info, function( index, val ) {
                   // alert(val.databasesourcename)
                    databasesourceselectobject.options.add(new Option(val.databasesourcename,val.id));
                   // $("#databasesource").append("<option value='"+val.databasesourceid+"'>"+val.databasesourcename+"</option>");
                   // relatetablenamesource[index]=val.databasesourcename;
                  //  relatetabledescriptsource[index]=val.databasesourcename;
                 //   relatetableidsource[index]=val.databasesourceid;
                });

            }

            else {
                alert(data.responseDesc);
                return;
            }
        }
    });

}

function viewUpdateInfo(pobject)
{
    var updatestr="";
    updatestr+='<table class="table table-bordered table-striped">';
    updatestr+='<thead>';
    updatestr+='<tr>';
    updatestr+='<th style="text-align: center;width: 30%">标签</th>';
    updatestr+='<th style="text-align: center;width: 70%">属性</th>';
    updatestr+='</tr>';
    updatestr+='</thead>';
    updatestr+='<tbody>';

    var insertSqlValue=jsTrim(pobject.value);
    var partionstrsplitarray=insertSqlValue.split("]");
    var datetimestrsplitarray=insertSqlValue.split("$s");//字符型日期
    var datetimedatesplitarray=insertSqlValue.split("$d");//日期类型

    var ralalteinoperationarray=insertSqlValue.split("$r");
    var editoperationarray=insertSqlValue.split("$e");
    var editnumoperationarray=insertSqlValue.split("$n");
    var editlikeoperationarray=insertSqlValue.split("$l");

  //  alert(datetimestrsplit.length+"---"+datetimedatesplit.length)

    var partioncount=parseInt(partionstrsplitarray.length-1);
    var $scount=parseInt(datetimestrsplitarray.length-1);
    var $dcount=parseInt(datetimedatesplitarray.length-1);
    var $rcount=parseInt(ralalteinoperationarray.length-1);
    var $ecount=parseInt(editoperationarray.length-1);
    var $ncount=parseInt(editnumoperationarray.length-1);
    var $lcount=parseInt(editlikeoperationarray.length-1);
    var updateitemcount=partioncount+$scount+$dcount+$rcount+$ecount+$ncount+$lcount;


   // if(updateitemcount>0)
    //    document.getElementById("updateparameter").style.display="";

//用户来识日期是字符串的类型还是日期类型
    for(var index=0;index<partioncount;index++)
    {
        var tempindex=index;
        var bindex=partionstrsplitarray[index].indexOf("[");
        var formatstr=partionstrsplitarray[index].substring(bindex+1,partionstrsplitarray[index].length);
        updatestr+="<tr>";
        var pastpcomment=partioncomment_str[index];

        if(typeof(pastpcomment)=="undefined")
            updatestr+='<td><input type="text" size=10 maxlength=50 style="width:75px"  placeholder="分区标签" onblur="javascript:getLastestPastInfo()" value="" name="partioncomment_str" ></td>';
        else
            updatestr+='<td><input type="text" size=10 maxlength=50 style="width:75px"  placeholder="分区标签" name="partioncomment_str" onblur="javascript:getLastestPastInfo()" value='+pastpcomment+' ></td>';

        updatestr+='<td><input type="text" size=10 maxlength=50 style="width:100px"  title="类[yyyy/yyyyMM/yyMM/yyyyMMdd,+/-.dd]" placeholder="如yyyyMM-1" name="partionformat"  readonly onblur="javascript:getLastestPastInfo()" value='+formatstr+' ></td>';
    }
    if(partioncount>0)
        updatestr+="</tr>";

//用户来识日期是字符串的类型还是日期类型
    for(var index=0;index<$scount;index++)
    {
        var tempindex=index;
        var pastcommnet=querycomment_str[index];
        var pasttype=timetype_str[index];
        var pastformat=timeformat_str[index];
        var pasttimestr_step=timestr_step[index];
        updatestr+="<tr>";
        if(typeof(pastcommnet)=="undefined")
            updatestr+='<td><input type="text" size=10 maxlength=50 style="width:75px"  placeholder="日期标签" name="querycomment_str" onblur="javascript:getLastestPastInfo()" value="" ></td><td ><select style="width:100px" onchange="javascript:changeTimeFormat();getLastestPastInfo()" name="timetype_str"';
        else
        {

            updatestr+='<td><input type="text" size=10 maxlength=50 style="width:75px"  placeholder="日期标签" name="querycomment_str" onblur="javascript:getLastestPastInfo()" value='+pastcommnet+' ></td><td ><select style="width:100px" onchange="javascript:changeTimeFormat();getLastestPastInfo()" name="timetype_str"';
        }
        if(typeof(pasttype)=="undefined")
        {
            updatestr+='><option value="0">日</option><option value="1">月</option><option value="2">年</option><option value="3">时</option><option value="4">分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维</option></select>';
        }
        else
        {
            if(pasttype=="0")
                updatestr+='><option value="0" selected>日</option><option value="1">月</option><option value="2">年</option><option value="3">时</option><option value="4">分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="1")
                updatestr+='><option value="0" >日</option><option value="1" selected>月</option><option value="2">年</option><option value="3">时</option><option value="4">分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="2")
                updatestr+='><option value="0" >日</option><option value="1" >月</option><option value="2" selected>年</option><option value="3">时</option><option value="4">分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="3")
                updatestr+='><option value="0" >日</option><option value="1">月</option><option value="2">年</option><option value="3" selected>时</option><option value="4">分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="4")
                updatestr+='><option value="0" >日</option><option value="1" >月</option><option value="2">年</option><option value="3">时</option><option value="4" selected>分</option><option value="5">秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="5")
                updatestr+='><option value="0" >日</option><option value="1" >月</option><option value="2" >年</option><option value="3">时</option><option value="4">分</option><option value="5" selected>秒</option><option value="6" >周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="6")
                updatestr+='><option value="0" >日</option><option value="1" >月</option><option value="2" >年</option><option value="3">时</option><option value="4">分</option><option value="5" >秒</option><option value="6" selected>周</option><option value="7">多维日期组件</option></select>';
            if(pasttype=="7")
                updatestr+='><option value="0" >日</option><option value="1" >月</option><option value="2" >年</option><option value="3">时</option><option value="4">分</option><option value="5" >秒</option><option value="6" >周</option><option value="7" selected>多维日期组件</option></select>';


        }

        if(typeof(pastformat)=="undefined")
            updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyMMdd">yyyyMMdd</option><option value="yyyy-MM-dd" >yyyy-MM-dd</option></select>';
        else
        {
            if(pastformat=="yyyy-MM-dd")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd" selected>yyyy-MM-dd</option><option value="yyyyMMdd">yyyyMMdd</option></select>';
            else if(pastformat=="yyyyMMdd")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd" >yyyy-MM-dd</option><option value="yyyyMMdd" selected>yyyyMMdd</option></select>';
            else if(pastformat=="yyyyMM")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyMM" selected>yyyyMM</option><option value="yyyyMMdd" >yyyyMMdd</option></select>';
            else if(pastformat=="yyyy")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy" selected>yyyy</option></select>';
            else if(pastformat=="yyyy-MM-dd HH:mm:ss")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd HH:mm:ss" selected>yyyy-MM-dd HH:mm:ss</option></select>';
            else if(pastformat=="yyyyMMdd HH:mm:ss")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyMMdd HH:mm:ss" selected>yyyyMMdd HH:mm:ss</option></select>';
            else if(pastformat=="yyyy-MM-dd HH:mm")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd HH:mm" selected>yyyy-MM-dd HH:mm</option></select>';
            else if(pastformat=="yyyyMMdd HH:mm")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyMMdd HH:mm" selected>yyyyMMdd HH:mm</option></select>';
            else if(pastformat=="yyyy-MM-dd HH")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd HH" selected>yyyy-MM-dd HH</option></select>';
            else if(pastformat=="yyyyMMdd HH")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyMMdd HH" selected>yyyyMMdd HH</option></select>';
            else if(pastformat=="yyyyWW")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="yyyyWW" selected>yyyyWW</option></select>';
            else if(pastformat=="MDate")
                updatestr+='<select name="timeformat_str" style="width:100px" onchange="javascript:getLastestPastInfo()"><option value="MDate" selected>MDate</option></select>';

        }
        if(typeof(pasttimestr_step)=="undefined")
            updatestr+='<input type="text" style="width:100px" name="timestr_step" onblur="javascript:getLastestPastInfo()" value="0" size=3>';
        else
            updatestr+='<input type="text" style="width:100px" name="timestr_step" onblur="javascript:getLastestPastInfo()" value='+pasttimestr_step+' size=3>';


        updatestr+="</td></tr>";
    }


    for(var index=0;index<$dcount;index++)
    {
        var tempindex=index;

        updatestr+='<input type="text" size=10 maxlength=50 name="querycomment_date" onblur="javascript:getLastestPastInfo()" value="" ><select onchange="javascript:changeTimeFormat();getLastestPastInfo()" name="timetype_date"';
        updatestr+='><option value="0">日</option><option value="1">月</option><option value="2">年</option></select>';

        updatestr+='<select name="timeformat_date" onchage="javascript:getLastestPastInfo()"><option value="yyyy-MM-dd">yyyy-MM-dd</option><option value="yyyyMMdd">yyyyMMdd</option></select><br>';
    }


    for(var index=0;index<$rcount;index++)
    {
        var tempindex=index;

        var tempcomment="";
        if(relatetablename!=null&&relatetablename.length>index)
            tempindex=relatetablename[index];
        var  temptableid="";
        if(relatetableid!=null&&relatetableid.length>index)
            temptableid= relatetableid[index];

        updatestr+="<tr>";
        if(typeof(tempcomment)=="undefined")
            updatestr+="<td><input type='text' value='' placeholder=\"下拉标签\"   style='width:75px'  name='relatetablename' size=10 value='' onblur='javascript:getLastestPastInfo()' maxlength=50 ></td><td><select name='relatetableid' style=\"width:100px\" onchange='javascript:getLastestPastInfo()'>"
        else
            updatestr+="<td><input type='text'  placeholder=\"下拉标签\" name='relatetablename' style='width:75px' size=10 maxlength=50 onblur='javascript:getLastestPastInfo()' value="+tempcomment+" ></td><td><select name='relatetableid' style=\"width:100px\" onchange='javascript:getLastestPastInfo()'>"
        for(var r=0;relatetableidsource !=null&&r<relatetableidsource.length;r++)
        {

            var id=relatetableidsource[r] ;
            var relatename=relatetablenamesource[r];
            var relatedescript=relatetabledescriptsource[r];
            relatename=(relatedescript==null)?relatename:relatedescript;
            if(typeof(temptableid)==undefined||temptableid!=id)
            {
                updatestr+="<option value='"+id+"'>"+relatename+"</option>";
            }
            else if(temptableid==id)
            {
                updatestr+="<option value='"+id+"' selected>"+relatename+"</option>";
            }

        }
        updatestr+="</select></td></tr>";
    }



    for(var index=0;index<$ecount;index++)
    {
        updatestr+="<tr>";
        var tempcomment=editcomment[index];
        var tempvalue=editvalue[index];

        if(typeof(tempcomment)=="undefined")
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editcomment" onblur="javascript:getLastestPastInfo()" value="字符匹配'+(parseInt(index)+1)+'" ></td>';
        else
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editcomment"  onblur="javascript:getLastestPastInfo()" value='+tempcomment+' ></td>';
        if(typeof(tempvalue)=="undefined")
            updatestr+='<td><input type="text" style="width:100px" size=10 maxlength=50 name="editvalue"  onblur="javascript:getLastestPastInfo()"  value="" ></td>';
        else
            updatestr+='<td><input type="text"  style="width:100px" size=10 maxlength=50 name="editvalue"  onblur="javascript:getLastestPastInfo()"  value='+tempvalue+' ></td>';
    }

    if($ecount>0)
        updatestr+="</tr>";

    for(var index=0;index<$ncount;index++)
    {
        var tempcomment=editnumcomment[index];
        var tempvalue=editnumvalue[index];
        updatestr+="<tr>";
        if(typeof(tempcomment)=="undefined")
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editnumcomment" onblur="javascript:getLastestPastInfo()" value="数值匹配'+(parseInt(index)+1)+'" ></td>';
        else
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editnumcomment" onblur="javascript:getLastestPastInfo()" value='+tempcomment+' ></td>';

        if(typeof(tempvalue)=="undefined")
        {
            updatestr+='<td><input type="text"  style="width:100px" size=10 maxlength=50 name="editnumvalue"  onblur="javascript:getLastestPastInfo()" value="" ></td>';
        }
        else
        {
            updatestr+='<td><input type="text"  style="width:100px" size=10 maxlength=50 name="editnumvalue"  onblur="javascript:getLastestPastInfo()"  value='+tempvalue+' ></td>';

        }
    }

    if($ncount>0)
        updatestr+="</tr>";

    for(var index=0;index<$lcount;index++)
    {
        updatestr+="<tr>";
        var tempcomment=editlikecomment[index];
        var tempvalue=editlikevalue[index];
        if(typeof(tempcomment)=="undefined")
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editlikecomment" onblur="javascript:getLastestPastInfo()" value="模糊匹配'+(parseInt(index)+1)+'" ></td>';
        else
            updatestr+='<td><input type="text" style="width:75px" size=10 maxlength=50 name="editlikecomment" onblur="javascript:getLastestPastInfo()" value='+tempcomment+' ></td>';
        if(typeof(tempvalue)=="undefined")
            updatestr+='<td><input type="text" style="width:100px" size=10 maxlength=50 name="editlikevalue"  onblur="javascript:getLastestPastInfo()"  value="" ></td>';
        else
            updatestr+='<td><input type="text" style="width:100px" size=10 maxlength=50 name="editlikevalue"  onblur="javascript:getLastestPastInfo()" value='+tempvalue+' ></td>';
    }

    if($lcount>0)
        updatestr+="</tr>";

    updatestr+="</tbody>";
    updatestr+="</table>";
   // if(updatestr!="")
   //  alert(updatestr)
    document.getElementById("updateinfo").innerHTML=updatestr;
  ///  getLastestPastInfo();
}

//获取最新的
function getLastestPastInfo()
{
    to_array(document.getElementsByName("partioncomment_str"),partioncomment_str);
    to_array(document.getElementsByName("partionformat"),partionformat);
    to_array(document.getElementsByName("querycomment_str"),querycomment_str);
    to_array(document.getElementsByName("timetype_str"),timetype_str);
    to_array(document.getElementsByName("timestr_step"),timestr_step);
    to_array(document.getElementsByName("timeformat_str"),timeformat_str);
    //alert(document.getElementsByName("relatetablename")[0].value+"----"+document.getElementsByName("relatetableid")[0].value)
    to_array(document.getElementsByName("relatetablename"),relatetablename);
    to_array(document.getElementsByName("relatetableid"),relatetableid);
    to_array(document.getElementsByName("editcomment"),editcomment);
    to_array(document.getElementsByName("editvalue"),editvalue);
    to_array(document.getElementsByName("editnumcomment"),editnumcomment);
    to_array(document.getElementsByName("editnumvalue"),editnumvalue);
    to_array(document.getElementsByName("editlikecomment"),editlikecomment);
    to_array(document.getElementsByName("editlikevalue"),editlikevalue);
}

function to_array(cobject,parray)
{
    if(cobject!=null)
    {

        for(var c=0;cobject!=null&&c<cobject.length;c++)
        {
            parray[c]=cobject[c].value;

        }

    }
    else
    {
        parray=new Array();
    }


}

