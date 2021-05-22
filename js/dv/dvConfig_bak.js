function createAttributeInput(element) {
	var attrHtml = '<div class="cf bdb1 pdb-10" style="margin-top:8px;">';
	attrHtml += '<span class="fl mgt-5" style="width:60px;margin-top: 0px">' + element['name'] + '</span>';

	if (element['type'] == 'text') {
		if(element['defValue'] == null || element['defValue'] == ""){
			attrHtml += '<input type="text" name="' + element['code'] + '" id="'
			+ element['code'] + '" />';
		}else{
			attrHtml += '<input value="'+ element['defValue'] +'" type="text" name="' + element['code'] + '" id="'
			+ element['code'] + '" />';
		}
	} else if (element['type'] == 'boolean') {
		if(element['defValue'] == null || element['defValue'] == ""){
			attrHtml += '<select name="'
				+ element['code']
				+ '" id="'
				+ element['code']
				+ '"><option value="1">是</option><option value="0">否</option></select>';
		}else if(element['defValue'] == "1"){
			attrHtml += '<select name="'
				+ element['code']
				+ '" id="'
				+ element['code']
				+ '"><option selected value="1">是</option><option value="0">否</option></select>';
		}else if(element['defValue'] == "0"){
			attrHtml += '<select name="'
				+ element['code']
				+ '" id="'
				+ element['code']
				+ '"><option>是</option><option value="0" selected>否</option></select>';
		}
	} else if (element['type'] == 'select') {
		attrHtml += '<select name="' + element['code'] + '" id="' + element['code']+ '">';
		$.ajax({
			url : "dict",
			type : "get",
			dataType : "json",
			contentType : "application/json",
			async : false,
			data : {
				dictCode : element['dictCode']
			},
			success : function(xdata) {
				if(element['defValue'] == null || element['defValue'] == ""){
					for ( var key in xdata) {
						attrHtml += '<option value="' + key + '">' + xdata[key]
								+ '</option>';
					}
				}else{
					for ( var key in xdata) {
						if(element['defValue'] == key){
							attrHtml += '<option selected value="' + key + '">' + xdata[key]
								+ '</option>';
						}else{
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
	}

	attrHtml += '</div>';
	return attrHtml;
}

function changeChartType(){
	var chartType = $('#chartType').val();
	
	var cntId = $('#cntId').val();
	var pageId = $('#pageId').val();
	
	$.ajax({
		url : "updatePageCmp",
		type : "post",
		dataType : "json",
		async : false,
		data : {
			pageId:pageId,
			cmpId:chartType,
			cntId:cntId
		},
		success : function(data) {
			$('#'+cntId).attr("defChart", chartType);
			
			window.frames['modelframe'].setCntDefchart(cntId, chartType);
			
			createComponentAttribute(chartType, cntId, instId);
		}
	});
}

function createComponentAttribute(cmpId, cntId, instId) {
	$('#cmpId').val(cmpId);
	$('#cntId').val(cntId);
	$('#instId').val(instId);
	
	$.ajax({
		url : "cmpInst",
		type : "get",
		dataType : "json",
		async : false,
		data : {
			cmpId:cmpId,
			instId:cntId,
			pageId:$('#pageId').val()
		},
		success : function(data) {
			debugger;
			var cfg = $.parseJSON(data.cfg);

			$('#dataType').val(data.dataType);
			$('#dataCnt').val(data.dataEntity);
			
			if(data.dataType == 'ds'){
				$('#dsType').show();
				$('#datasource').val(data.datasource);
			}
			
			var cfgHtml = '<div style="margin:5px 10px 5px 30px;"><span class="fl mgt-5" style="width:60px;margin-top: 0px">切换图形</span><select onchange="changeChartType()" id="chartType" name="chartType">';
			$.each(data.cmps, function(idx, element){
				if(element.selected){
					cfgHtml += '<option selected value="'+element.id+'">' + element.name + '</option>';
				}else{
					cfgHtml += '<option value="'+element.id+'">' + element.name + '</option>';
				}
			});
			cfgHtml += '</select></div>';
			
			cfgHtml += '<div class="cf bdb1 pdl-30 pdr-30 pdt-15 pdb-15"><span class="fl fs-16" id="chartName">'+data.name+'<font class="fs-12">v1.0.1</font></span></div>';
			//$('#chartName').html(data.name);
			$.each(cfg, function(idx, element) {
				
				cfgHtml += '<dl class="list-down">';
				cfgHtml += '<dt class="cf">';
				
				if(idx == 0){
					cfgHtml += '<span class="list-name">' + element.name
					+ '</span>';
					cfgHtml += '</dt>';

					cfgHtml += '<dd>';
				}else{
					cfgHtml += '<span class="list-name active">' + element.name
					+ '</span>';
					cfgHtml += '</dt>';

					cfgHtml += '<dd style="display:none;">';
				}
				
				//cfgHtml += createAttributeInput(element);
				$.each(element.clms,function(idx,celement){
					if(celement != null){
						cfgHtml += createAttributeInput(celement);
					}
				})
				
				cfgHtml += '</dd>';
				cfgHtml += '</dl>';
			});

			$('#propContainer').html(cfgHtml);
			
			$(".list-down").on("click",".list-show",function(event){
                event.stopPropagation();
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                }else{
                    $(this).addClass("active");
                }
            });
            $(".list-down").on("click","dt",function(){
                if($(this).children(".list-name").hasClass("active")){
                    $(this).children(".list-name").removeClass("active");
                    $(this).siblings("dd").slideDown();
                }else{
                    $(this).children(".list-name").addClass("active");
                    $(this).siblings("dd").slideUp();
                }
            })
		}
	});
}

function getPageProps(pageId){
    var pageId = $('#pageId').val();

    $.ajax({
        url: "./pageProperties",
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: {pageId:pageId},
        success: function (data) {
            if(data.entity != null){
                var pageJsons = $.parseJSON(data.entity);
                pageFontSize = pageJsons['fontSize'];
                $('#fontSize').val(pageFontSize);
            };
            if(data.dateValue!=null) {
                if (data.cycle == "d") {
                    $("#selectDate").find("option[value='d']").attr("selected", true);
                } else if (data.cycle == "m") {
                    $("#selectDate").find("option[value='m']").attr("selected", true);
                }
                $("#dateInterval").attr("disabled", false);
                $("#dateInterval").val((data.dateValue).substr(1));
            }
        }
    });
}