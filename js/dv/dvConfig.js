//组件属性加载方法
function createAttributeInput(element) {
    var attrHtml = '<div class="cf bdb1 pdb-10" style="margin-top:8px;">';
    attrHtml += '<span class="fl mgt-5" style="width:60px;margin-top: 0px">' + element['name'] + '</span>';

    if (element['type'] == 'text') {
        if (element['defValue'] == null || element['defValue'] == "") {
            attrHtml += '<input type="text" name="' + element['code'] + '" id="'
                + element['code'] + '" />';
        } else {
            attrHtml += '<input value="' + element['defValue'] + '" type="text" name="' + element['code'] + '" id="'
                + element['code'] + '" />';
        }
    } else if (element['type'] == 'textarea') {
        debugger;
        if (element['defValue'] == null || element['defValue'] == "") {
            attrHtml += '<textarea rows="3" cols="25" name="' + element['code'] + '" id="'
                + element['code'] + '" ></textarea>';
        } else {
            attrHtml += '<textarea rows="3" cols="20" name="' + element['code'] + '" id="'
                + element['code'] + '" value="' + element['defValue'].replace(/"/g,"'") + '">' + element['defValue'].replace(/"/g,"'") + '</textarea>';
        }
    } else if (element['type'] == 'boolean') {
        if (element['defValue'] == null || element['defValue'] == "") {
            attrHtml += '<select name="'
                + element['code']
                + '" id="'
                + element['code']
                + '"><option value="1">是</option><option  value="0" selected>否</option></select>';
        } else if (element['defValue'] == "1") {
            attrHtml += '<select name="'
                + element['code']
                + '" id="'
                + element['code']
                + '"><option  value="1" selected>是</option><option value="0">否</option></select>';
        } else if (element['defValue'] == "0") {
            attrHtml += '<select name="'
                + element['code']
                + '" id="'
                + element['code']
                + '"><option value="1">是</option><option value="0" selected>否</option></select>';
        }
    } else if (element['type'] == 'select') {
        attrHtml += '<select name="' + element['code'] + '" id="' + element['code'] + '">';
        $.ajax({
            url: "dict",
            type: "get",
            dataType: "json",
            contentType: "application/json",
            async: false,
            data: {
                dictCode: element['dictCode']
            },
            success: function (xdata) {
                if (element['defValue'] == null || element['defValue'] == "") {
                    for (var key in xdata) {
                        attrHtml += '<option value="' + key + '">' + xdata[key]
                            + '</option>';
                    }
                } else {
                    for (var key in xdata) {
                        if (element['defValue'] == key) {
                            attrHtml += '<option selected value="' + key + '">' + xdata[key]
                                + '</option>';
                        } else {
                            attrHtml += '<option value="' + key + '">' + xdata[key]
                                + '</option>';
                        }
                    }
                }

                //$.each(xdata,function(xelement,xidx){
                //	attrHtml += '<option value="'++'">';
                //});
            }
        });
        attrHtml += '</select>';
    } else if (element['type'] == 'chooseColor') {
        attrHtml += '<input class="jscolor" value="ab2567" >';
    } else if (element['type'] == 'number') {
        attrHtml += '<input type="number" name="' + element['code'] + '" size="7" id="'
            + element['code'] + '" />';
    }

    attrHtml += '</div>';
    return attrHtml;
}
// 动态改变html节点defchart属性
function changeChartType() {
    var chartType = $('#chartType').val();

    var cntId = $('#cntId').val();
    var pageId = $('#pageId').val();

    // $.ajax({
    // url : "updatePageCmp",
    // type : "post",
    // dataType : "json",
    // async : false,
    // data : {
    // 	pageId:pageId,
    // 	cmpId:chartType,
    // 	cntId:cntId
    // },
    // success : function(data) {
    /*提交操作放到点击保存配置按钮时提交*/
    $('#' + cntId).attr("defChart", chartType);
    window.frames['modelframe'].setCntDefchart(cntId, chartType);
    var instId = $('#instId').val();
    createComponentAttribute(chartType, cntId, instId);
    // 	}
    // });
}

/*<![CDATA[*/
function saveRele() {
    //循环检测选中组件的ID
    var checkBos = document.getElementsByClassName("releCB");
    var instIds = "";
    for (var g = 0; g < checkBos.length; g++) {
        if (checkBos[g].checked) {
            instIds += checkBos[g].value + ",";
        }  //如果选中，将value添加到变量s中
    }
    instIds = instIds.substring(0, instIds.length - 1);
    //pageId、cntId查询instId

    if (instIds == "" || $('#paraName').val() == "") {
        alert("请填写组件关联配置");
        return;
    }
    $.ajax({
        type: "get",
        url: "savaReleInst",
        data: {
            pageId: $('#pageId').val(),
            cntId: $('#cntId').val(),
            instIds: instIds,
            paraName: $('#paraName').val()
        },
        success: function (data) {
            if (data.responseCode == 200) {
                alert("组件关联设置成功！");
                document.getElementById('modelframe').contentWindow.location.reload();
                //window.frames['modelframe'].document.getElementById(cntId).click();
                //refreshCntContend($('#pageId').val(), $('#cntId').val(), 12)
            }
        }
    })
}
//关联功能先注释
function loadReleSetting(data) {
    // //生成页面样式
    // var formData = [];
    // var selfLocation = self.location.href;
    // if (selfLocation.indexOf("eparchy_code") > 0) {
    //     var a = selfLocation.substr(selfLocation.length - 4);
    //     formData.push({name: 'eparchy_code', value: a});
    // }
    //
    // $('input[type="hidden"]').each(function () {
    //     formData.push({name: $(this).attr('id'), value: $(this).val()});
    // });
    //
    // var cntId = $('#cntId').val();
    //
    // //配置页面生效，预览页面不生效
    // if (top.location != self.location) {
    //     //清空组件关联配置页面
    //     document.getElementById("saveRele").innerHTML = "";
    //     //根据模版生成配置页面
    //     var relePage = "<div id = 'hiddiv'>";
    //     relePage += "<span class=\"fl mgr-10 mgt-5\"></span>";
    //     relePage += "<dl class=\"list-down\">";
    //     relePage += "<dt class=\"cf\">";
    //     relePage += "<span class=\"list-name\">关联配置</span>";
    //     relePage += "</dt>";
    //     relePage += "<dd>";
    //     relePage += "<div style=\"margin-top:8px;\">选择关联组件</div>";
    //     relePage += "<div class=\"cf bdb1 pdb-10\" style=\"margin-top:8px;\">";
    //     //循环列出可关联组件
    //     for (var p = 0; p < data.cmpInsts.length; p++) {
    //         if (data.cmpInsts[p].cmpId != "kpi" && data.cmpInsts[p].cmpId != "list") {
    //             if (data.cmpInsts[p].cntId != cntId) {
    //                 if (data.cmpInsts[p].hasOwnProperty("id")) {
    //                     var entity=eval('(' + data.cmpInsts[p].entity + ')');
    //                     if (entity.title == "") {
    //                         relePage += "<input name='releInsts' class='releCB' type='checkbox' id='" + data.cmpInsts[p].id + "' value='" + data.cmpInsts[p].id + "'>无标题图形<br>";
    //                     } else {
    //                         relePage += "<input name='releInsts' class='releCB' type='checkbox' id='" + data.cmpInsts[p].id + "' value='" + data.cmpInsts[p].id + "'>" + entity.title + "<br>";
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     relePage += "</div>";
    //
    //     if (relePage.indexOf("input")) {
    //         relePage += "<div class=\"cf\" style=\"margin-top:8px;\">\n" +
    //             "<div class=\"cf bdb1 pdb-10\" style=\"margin-top:8px;\">\n" +
    //             "<span class=\"fl mgt-5\">关联参数</span><input id='paraName' class=\"fl mgl-25 \"/>\n" +
    //             "</div>\n" +
    //             "</div>";
    //         relePage += "<a id=\"cfgBtn\" onclick=\"previewPage()\" class=\"page-link-blue fr mgt-15 js_template_name\">预览</a>" +
    //             "<a id=\"saveReleBtn\" onclick=\"saveRele()\" style=\"margin-right: 6px;\" class=\"page-link-blue fr mgt-15 js_template_name\">保存关联配置</a>";
    //     }
    //     relePage += "</dd>";
    //     relePage += "</dl>";
    //     relePage += "</div>";
    //     document.getElementById("saveRele").innerHTML = relePage;
    // }
    //
    // //加载已经保存的数据
    // var pageId = $('#visualmoduleid').val();
    // var cntId = $('#cntId').val();
    // if (pageId != null && pageId != "" && cntId != "" && cntId != null) {
    //     $.ajax({
    //         type: "get",
    //         url: "loadReleInst",
    //         data: {
    //             pageId: $('#pageId').val(),
    //             cntId: $('#cntId').val(),
    //         },
    //         success: function (data) {
    //             if (data.rele != null && data.rele != "") {
    //                 var rele = eval('(' + data.rele + ')');
    //                 var releInstIds = rele.instIds.split(",|，");
    //                 for (var i = 0; i < releInstIds.length; i++) {
    //                     document.getElementById(releInstIds[i]).checked = true;
    //                 }
    //                 $('#paraName').val(rele.paraName);
    //             }
    //
    //         }
    //     })
    // } else {
    //
    // }
}

/*]]>*/

/*<![CDATA[*/
function createComponentAttribute(cmpId, cntId, instId) {
    $('#cmpId').val(cmpId);
    $('#cntId').val(cntId);
    $('#instId').val(instId);
    //点击组件时显示组件关联配置页面
    //组件关联配置页面面改到tplInfo里的clickToAddCmp()中
    //初始化组件关联
    /*  $("#hiddiv").removeAttr("style");
        var ckbox=document.getElementsByClassName("releCB");
        for (var x=0;x<ckbox.length;x++){
            ckbox[x].checked=null;
        }
        console.log(ckbox);
        $('#paraName').val("");
        $('#paraValue').val("");*/

    $.ajax({
        url: "cmpInst",
        type: "get",
        dataType: "json",
        async: false,
        data: {
            cmpId: cmpId,
            instId: instId,
            pageId: $('#pageId').val()
        },
        success: function (data) {
            console.log(data);
            // console.log(data.cfg);
            // var cfg = $.parseJSON(data.cmpCfg);
            var cfg = eval('(' + data.cmpCfg + ')')

            $('#dataType').val(data.dataType);
            console.log("-----"+data.dataType);

            if(data.dataType =='rest'){
                $('#sqlData').hide();
                $("#dsType").hide();
                $('#restType').show();
                $('#btn').show();
                $('#restUrl').val(data.dataEntity);
                getDataEntity();
            }if(data.dataType =='ds'){
                $('#restType').hide();
                $('#sqlData').show();
                $("#dsType").show();
                $('#btn').show();
                $('#sqlText').val(data.dataEntity);
                $('#datasource').val(data.datasource);
                getDataEntity();
            } if(data.dataType =="static"){
               // $('#dataCnt').show();
                $('#btn').hide();
                $('#dataCnt').val(data.dataEntity);
            }
            else{
                $('#dataCnt').val(data.dataEntity);
            }

            if (data.cmpType == 'ds') {
                $('#dsType').show();
                $('#datasource').val(data.datasource);
            }

            var cfgHtml = '<div style="margin:5px 10px 5px 30px;"><span class="fl mgt-5" style="width:60px;margin-top: 0px">切换图形</span><select onchange="changeChartType()" id="chartType" name="chartType">';
            $.each(data.cmps, function (idx, element) {
                if (element.selected) {
                    cfgHtml += '<option selected value="' + element.id + '">' + element.name + '</option>';
                } else {
                    cfgHtml += '<option value="' + element.id + '">' + element.name + '</option>';
                }
            });
            cfgHtml += '</select></div>';

            cfgHtml += '<div class="cf bdb1 pdl-30 pdr-30 pdt-15 pdb-15"><span class="fl fs-16" id="chartName">' + data.cmpName + '<font class="fs-12">v1.0.1</font></span></div>';
            //$('#chartName').html(data.name);
            $.each(cfg, function (idx, element) {

                cfgHtml += '<dl class="list-down">';
                cfgHtml += '<dt class="cf">';

                if (idx == 0) {
                    cfgHtml += '<span class="list-name">' + element.name
                        + '</span>';
                    cfgHtml += '</dt>';

                    cfgHtml += '<dd>';
                } else {
                    cfgHtml += '<span class="list-name active">' + element.name
                        + '</span>';
                    cfgHtml += '</dt>';

                    cfgHtml += '<dd style="display:none;">';
                }

                //cfgHtml += createAttributeInput(element);
                $.each(element.clms, function (idx, celement) {
                    if (celement != null) {
                        cfgHtml += createAttributeInput(celement);
                    }
                })

                cfgHtml += '</dd>';
                cfgHtml += '</dl>';
            });

            $('#propContainer').html(cfgHtml);

            $(".list-down").on("click", ".list-show", function (event) {
                event.stopPropagation();
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            });
            $(".list-down").on("click", "dt", function () {
                if ($(this).children(".list-name").hasClass("active")) {
                    $(this).children(".list-name").removeClass("active");
                    $(this).siblings("dd").slideDown();
                } else {
                    $(this).children(".list-name").addClass("active");
                    $(this).siblings("dd").slideUp();
                }
            })
        }
    });

}

/*]]>*/
function getPageProps(pageId) {
    // var pageId = $('#pageId').val();

    $.ajax({
        url: "pageProperties",
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: {pageId: pageId},
        success: function (data) {
            // var pageTitle = data.pageName;
            var pageTitle = data.pageTitle;
            $('#pageTitle').val(pageTitle);
            if (data.pageEntity != null&& data.pageEntity!='') {
                var pageJsons = $.parseJSON(data.pageEntity);
                pageFontSize = pageJsons['fontSize'];
                $('#fontSize').val(pageFontSize);

            }

            if (data.dateValue != null) {
                if (data.pageCycle == "d") {
                    $("#selectDate").find("option[value='d']").attr("selected", true);
                } else if (data.pageCycle == "m") {
                    $("#selectDate").find("option[value='m']").attr("selected", true);
                }
                $("#dateInterval").attr("disabled", false);
                $("#dateInterval").val((data.dateValue).substr(1));
            }
        }
    });
}