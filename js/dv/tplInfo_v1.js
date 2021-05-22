//echarts map stack
var mapStack = [];
var curMap = {};
var mapData;
var intervalCmp = [];

function addCmpClick(){
	$(".echarts-box-hover,.echarts-box-hover2").on("click",function(){
		$(".echarts-box-hover").removeClass("active");
		$(this).addClass("active").siblings("li");
		
		self.parent.createComponentAttribute($(this).attr("defChart"), $(this).attr("id"), $(this).attr("id"));
		self.parent.getPageProps();
	})
	
	var editPageId = $('#editPageId').val();
	if(editPageId != null && editPageId != ""){
		addPageCmp(editPageId);
	}
}

function setInstId(cnt, instId){
	$('#' + cnt).attr("instId", instId);
}

function addPageCmp(pageId){

    var selfLocation = self.location.href;
    if(selfLocation.indexOf("editPageId")>0){
        self.parent.getPageProps();
    }

    var formData = [];
	
	if(pageId == null)
		formData.push({name:'pageId',value:$('#pageId').val()});
	else{
		formData.push({name:'pageId',value:pageId});
	}
	
	$('input[type="hidden"]').each(function(idx, element){
		if($(this).attr('id') != 'pageId'){
			formData.push({name:$(this).attr('id'),value:$(this).val()});
		}
	});
	
	$.ajax({
		url : "../pageChartOptions",
		type : "get",
		dataType : "json",
		contentType : "application/json",
		async : false,
		data : formData,
		success : function(data) {
			var location = $('#location').val();
			if(location == null || location == ""){
				location = '100000';
			}
			
			$('#appTitle').html(data.dataVisPage.name);
			if($('#appSubTitle').text() != null && $('#appSubTitle').text().length > 0){
				$('#appSubTitle').html(cityMap[location]);
			}
			
			var xtheme = data.theme;

			var pageFontSize = '12';
			if(data.dataVisPage.entity != null){
				var pageJsons = $.parseJSON(data.dataVisPage.entity);
				if(pageJsons['fontSize'] != null){
					pageFontSize = pageJsons['fontSize'];
				}
			}
			
			$.each(data.cmpInsts, function(idx,element){
				var container = element.cntId;
				
				$('#'+element.cntId).attr("defChart", element.cmpId);
				if(element.chartOptions.refreshItv){
					intervalCmp.push({
						pageId:pageId,
						container:container,
						pageFontSize:pageFontSize
					});
				}
				
				//alert("==================="+$('#' + container).height());
				
				$('#'+container).css("width", $('#' + container).width()+"px").css("height", $('#' + container).height()+"px");

				
				var option;
                if(pageFontSize == null){
                    option = chartOption(element.cmpId, '12');
                }else{
                    option = chartOption(element.cmpId, pageFontSize);
                }
				
				//$.extend(true, option, xlable);
				
				if(element.cmp.type == "kpi"){
					//$('#'+container).prev().html(element.chartOptions.title.text);
					var kpi = element.chartOptions.kpi;
					
					if(element.chartOptions.kpiShowType == "stress"){
						$('#'+container).prev().html(element.chartOptions.title.text);
						if(kpi != null && kpi.length > 0){
							
							var kpiHtml = "";
							if(kpi.length == 4){
								var kpiChar = kpi[2]+"";
								if(kpi[3].indexOf('-') >= 0){
									for(var x=0;x<kpiChar.length; x++){
										kpiHtml += '<span class="num">'+kpiChar.charAt(x)+'</span>';
									}
									kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
									kpiHtml += '<span>环比下降</span>';
									kpiHtml += '<span class="color-green fs-14">'+kpi[3]+'</span>';
								}else{
									for(var x=0;x<kpiChar.length; x++){
										kpiHtml += '<span class="num">'+kpiChar.charAt(x)+'</span>';
									}
									kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
									kpiHtml += '<span>环比上升</span>';
									kpiHtml += '<span class="color-red fs-14">'+kpi[3]+'</span>';
								}
							}else if(kpi.length == 3){
								for(var x=1;x<kpi[2].length; x++){
									kpiHtml += '<span class="num">'+kpi[2].charAt(x)+'</span>';
								}
								kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
							}
							$('#'+container).empty().html(kpiHtml);
						}
					}else{
						$('#'+container).prev().html(element.chartOptions.title.text);
						if(kpi != null && kpi.length > 0){
							if(kpi.length == 4){
								$('#'+container + " span.num1").html(toThousands(kpi[2]));
								
								if(kpi[3].indexOf('-') >= 0){
									$('#'+container + " span.unit").html(kpi[1] + '<font class="color-green mgl-10">↓</font><font class="color-green">'+kpi[3]+'</font>');
								}else{
									$('#'+container + " span.unit").html(kpi[1] + '<font class="color-red mgl-10">↑</font><font class="color-red">'+kpi[3]+'</font>');
								}
							}else if(kpi.length == 3){
								$('#'+container + " span.num1").html(toThousands(kpi[2]));
								$('#'+container + " span.unit").html(kpi[1]);
							}
						}
					}
				}else if(element.cmp.type == "table"){
					var tableHtml = "<table class='xtable' width='100%'>";
					if(element.chartOptions && element.chartOptions.tableLists){
						$.each(element.chartOptions.tableLists, function(idx, element){
							if(idx == 0){
								tableHtml += '<tr>';
								for(var i=0; i<element.length; i++){
									tableHtml += "<th>" + element[i] + "</th>";
								}
								tableHtml += '</tr>';
							}else{
								tableHtml += '<tr>';
								for(var i=0; i<element.length; i++){
									tableHtml += "<td>" + element[i] + "</td>";
								}
								tableHtml += '</tr>';
							}
						});
					}
					tableHtml += '</table>';
					$('#'+container).prev().html(element.chartOptions.title.text);
					
					$('#'+container).html(tableHtml);
				}else{ 
					var myChart ;
					
					if(xtheme != null && xtheme.length > 0){
						myChart = echarts.init(document.getElementById(container), xtheme);
					}else{
						myChart = echarts.init(document.getElementById(container));
					}
					if(element.cmp.type == "map"){
						$('#contextMenu').on('click', function () {
							$(this).hide();
							var map = mapStack[0];
							if (!mapStack.length && !map) {
							    alert('已经到达最上一级地图了');
								return;
							}
							loadMap(map.mapCode, map.mapOptions, myChart);
						});


						$.extend(true, option, element.chartOptions);
						option.title.text = '';
						
						loadMap(location, element, myChart);
						
						mapStack.push({
							mapCode: location,
							mapOptions: element
						});
						
						$('#contextMenu').hide();
						
						myChart.on('click', function(params) {
							var name = params.name;
							
							var selLocation = getMapLoation(name);
							if(selLocation != null){
								var xformData = [];
								//xformData.push({name:'pageId',value:pageId});
								xformData.push({name:'cntId',value:container});
								
								$('input[type="hidden"]').each(function(idx, felement){
									if($(this).attr('id') != 'location'){
										xformData.push({name:$(this).attr('id'),value:$(this).val()});
									}
								});
								xformData.push({name:'location',value:selLocation});
								
								$.ajax({
									url : "../pageChartOption",
									type : "get",
									dataType : "json",
									contentType : "application/json",
									async : false,
									data : xformData,
									success : function(xxdata) {
										$.extend(true, option, xxdata.chartOptions);
										loadMap(selLocation, xxdata, myChart);
										
										$('#contextMenu').show();
									}
								})
							}
						});
					}else if(element.cmp.type == "smap"){
						
						loadPMLinkMap(location, element, myChart);
					}else if ((element.cmp.type == "radar")) {
						//雷达图样式
                        $('#'+container).prev().html(element.chartOptions.title.text);
                        $.extend(true, option, element.chartOptions);

                        var fontOption = getRadarFontOption();
                        if(pageFontSize != null){
                            var fontOption = getRadarFontOption(pageFontSize);
                            $.extend(true, option, fontOption);
                        }
                        option.title.text = '';
                        option.backgroundColor = '';
                        myChart.setOption(option, true);
                    }else {
						if(element.chartOptions.linkurl && element.chartOptions.linkurl != null){
							$('#'+container).prev().html(element.chartOptions.title.text + '<span class="linkMore"><a href="'+ element.chartOptions.linkurl +'" target="_blank">更多...</a>');
						}else{
							$('#'+container).prev().html(element.chartOptions.title.text);
						}
						
						$.extend(true, option, element.chartOptions);
						
						// if(pageFontSize != null){
						// 	var fontOption = getFontOption(pageFontSize);
						// 	$.extend(true, option, fontOption);
						// }else{
						// 	var fontOption = getFontOption('11');
						// 	$.extend(true, option, fontOption);
						// }
						option.title.text = '';
						option.backgroundColor = '';
						
						//alert(option.lable.normal.textStyle.fontsize);
						myChart.setOption(option, true);
					}
				}
			});
		}
	});
	
	if(intervalCmp.length > 0){
		var intervalTimes = $('#intervalTimes').val();
		if(intervalTimes == null || intervalTimes == ""){
			intervalTimes = "10000";
		}
		setInterval(initRefreshCnt, parseInt(intervalTimes));
	}
}

function initRefreshCnt(){
	for(var i=0; i<intervalCmp.length; i++){
		refreshCntContend(intervalCmp[i].pageId, intervalCmp[i].container, intervalCmp[i].pageFontSize);
	}
}

function getMapLoation(mapName){
	for(key in cityMap){
		if(cityMap[key] == mapName){
			return key;
		}
	}
	
	return null;
}

function getRadarFontOption(fontSize){
    return {
        radar: {
            name: {
                textStyle: {
                    fontSize: fontSize,
                }
            }
        },
        legend: {
            textStyle:{fontSize:fontSize},
        }
    }
}

// function getFontOption(fontSize){
// 	return {
// 	    xAxis:{
// 	    	axisLabel: {
// 	    		textStyle: {
// 	    			fontSize:fontSize
// 	    		}
// 	    	}
// 	    },
// 	    yAxis:{
// 	    	axisLabel: {
// 	    		textStyle: {
// 	    			fontSize:fontSize
// 	    		}
// 	    	}
// 	    },
// 	    legend:{
// 	            textStyle:{
// 	                fontSize:fontSize
// 	        }
// 	    }
// 	    //,
//         //visualMap: {
//         //    textStyle: {
//         //         fontSize:fontSize+''
//         //    },
// 		//	}
// 	}
// }
//
// function  getMapFontOption(fontSize) {
//     visualMap: {
//        textStyle: {
//             fontSize:fontSize
// 	   }
// 	}
// }

var chartOption = function(type,fontSize){
	switch (type) {
        case "basicbar":
            return {
                xAxis:{
                    axisLabel: {
                        textStyle: {
                            fontSize:fontSize
                        }
                    }
                },
                yAxis:{
                    axisLabel: {
                        textStyle: {
                            fontSize:fontSize
                        }
                    }
                },
                legend:{
                textStyle:{
                        fontSize:fontSize
                 },
                orient: 'vertical',
                x: 'right',
                top:'5%',
                itemWidth:5,
                itemHeight:3
            },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top:'10%',
                    containLabel: true
                }
        	};
            break;
        case "radarchart":
            return {
                radar:{
                    name: {
                        textStyle: {
                            fontSize: fontSize,
                        }
                    },
                    nameGap :2
				},
                legend:{
                    textStyle:{fontSize:fontSize},
                    orient: 'vertical',
                    x: 'right',
                    top:'5%',
                    itemWidth:5,
                    itemHeight:3
                }
            };
            break;
		case "pmbar":
			return {
			xAxis:{
                axisLabel: {
                    textStyle: {
                        fontSize:fontSize
                    }
                }
            },
            yAxis:{
                axisLabel: {
                    textStyle: {
                        fontSize:fontSize
                    }
                }
            },
			    grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
                }
            };
			break;
		case "pmMap":
			return {
				visualMap: {
			        min: 0,
			        max: 1000,
			        left: 'right',
			        top: 'bottom',
			        text: ['高','低'],           // 文本，默认为数值文本
			        calculable: true,
			        textStyle: {
			        	color:'#fff',
                        fontSize:fontSize+''
			        },
			        padding: [0, 26]
			    },
			    tooltip: {
			        trigger: 'item'
			    }
			};
			break;
        case "piechart":
            return {tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
                             },
                label: {
                    textStyle:{
                        fontSize:fontSize
                    },
                    normal: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        formatter: '{b}\n {d}%'
                    }
                }};
            break;
        case "horizonbar":
        return {
            legend:{
                textStyle:{
                    fontSize:fontSize
                },
                orient: 'vertical',
                x: 'right',
                top:'5%',
                itemWidth:5,
                itemHeight:3
            },
            grid: {
                left: '0%',
                right: '15%',
                bottom: '3%',
                top:'10%',
                containLabel: true
            },
            xAxis: {
                axisLabel: {
                    textStyle: {
                        fontSize:fontSize
                    }
                },
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                axisLabel: {
                    textStyle: {
                        fontSize:fontSize
                    }
                },
                type: 'category'
            }
        };
        break;
        case "stackedbar":
            return {
                legend:{
                    textStyle:{
                        fontSize:fontSize
                    },
                    orient: 'vertical',
                    x: 'right',
                    top:'5%',
                    itemWidth:5,
                    itemHeight:3
                },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top:'10%',
                    containLabel: true
                },
                xAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize:fontSize
                        }
                    },
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize:fontSize
                        }
                    },
                    type: 'category'
                },
				series:[{
                    barCategoryGap:8
				}]
            };
            break;
        case "doughnutchart":
            return {
                legend:{
                    textStyle:{
                        fontSize:fontSize
                    },
                    orient: 'vertical',
                    x: 'right',
                    top:'5%',
                    itemWidth:5,
                    itemHeight:3
                },
                grid: {
                    left: '0%',
                    right: '15%',
                    bottom: '3%',
                    top:'10%',
                    containLabel: true
                },
				series:[
                    {
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%',
                                textStyle: {
                                    fontSize: fontSize
                                }
                            }
                        }
                    }
				]
            };
            break;
        case "zfbar":
            return {
                 grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                 },
                 xAxis : [{
                      type : 'value'
                 }],
                 yAxis : [{
                    type : 'category',
                    axisTick : {show: false}
                    }],
                 legend:{
                    textStyle:{
                        fontSize:fontSize
                    },
                        orient: 'vertical',
                        x: 'right',
                        top:'5%',
                        itemWidth:5,
                        itemHeight:3
                 }
            };
            break;
		default:
			return {};
	}
}

function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

function setCntDefchart(cntId, defChart){
	$('#' + cntId).attr("defChart", defChart);
}

/**
 * 刷新图形
 * @param pageId
 * @param container
 * @returns
 */
function refreshCntContend(pageId, container, pageFontSize){
	$('#'+container).css("width", $('#'+container).width()+"px").css("height", $('#' + container).height()+"px");
	
	var formData = [];
	formData.push({name:'pageId',value:pageId});
	formData.push({name:'cntId',value:container});
	
	$('input[type="hidden"]').each(function(idx, element){
		formData.push({name:$(this).attr('id'),value:$(this).val()});
	});
	
	$.ajax({
		url : "../pageChartOption",
		type : "get",
		dataType : "json",
		contentType : "application/json",
		async : false,
		data : formData,
		success : function(data) {
			debugger;
			if(data.cmp.type == "kpi"){
				var kpi = data.chartOptions.kpi;
				
				if(data.chartOptions.kpiShowType == "stress"){
					$('#'+container).prev().html(data.chartOptions.title.text);
					if(kpi != null && kpi.length > 0){
						
						var kpiHtml = "";
						if(kpi.length == 4){
							var kpiChar = kpi[2]+"";
							if(kpi[3].indexOf('-') >= 0){
								for(var x=0;x<kpiChar.length; x++){
									kpiHtml += '<span class="num">'+kpiChar.charAt(x)+'</span>';
								}
								kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
								kpiHtml += '<span>环比下降</span>';
								kpiHtml += '<span class="color-green fs-14">'+kpi[3]+'</span>';
							}else{
								for(var x=0;x<kpiChar.length; x++){
									kpiHtml += '<span class="num">'+kpiChar.charAt(x)+'</span>';
								}
								kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
								kpiHtml += '<span>环比上升</span>';
								kpiHtml += '<span class="color-red fs-14">'+kpi[3]+'</span>';
							}
						}else if(kpi.length == 3){
							for(var x=1;x<kpi[2].length; x++){
								kpiHtml += '<span class="num">'+kpi[2].charAt(x)+'</span>';
							}
							kpiHtml += '<span class="unit">'+kpi[1]+'</span>';
						}
						
						$('#'+container).html(kpiHtml);
					}
				}else{
					$('#'+container).prev().html(data.chartOptions.title.text);
					if(kpi != null && kpi.length > 0){
						if(kpi.length == 4){
							$('#'+container + " span.num1").html(toThousands(kpi[2]));
							
							if(kpi[3].indexOf('-') >= 0){
								$('#'+container + " span.unit").html(kpi[1] + '<font class="color-green mgl-10">↓</font><font class="color-green">'+kpi[3]+'</font>');
							}else{
								$('#'+container + " span.unit").html(kpi[1] + '<font class="color-red mgl-10">↑</font><font class="color-red">'+kpi[3]+'</font>');
							}
						}else if(kpi.length == 3){
							$('#'+container + " span.num1").html(toThousands(kpi[2]));
							$('#'+container + " span.unit").html(kpi[1]);
						}
					}
				}
			}else{
				var myChart ;
				var xtheme = data.theme;
				
				if(xtheme != null && xtheme.length > 0){
					myChart = echarts.init(document.getElementById(container), xtheme);
				}else{
					myChart = echarts.init(document.getElementById(container));
				}
				
				if(data.cmp.type == "map"){
				
					var location = $('#location').val();
					if(location == null || location == ""){
						location = '100000';
					}
					
                    var option ;
                    if(pageFontSize){
                        option = chartOption(data.cmp.id, pageFontSize);
                    }else{
                        option = chartOption(data.cmp.id, '12');
                    }

                    $.extend(true, option, data.chartOptions);
					
					loadMap(location, data, myChart);
				}else if(data.cmp.type == "smap"){
					var location = $('#location').val();
					if(location == null || location == ""){
						location = '100000';
					}
					loadPMLinkMap(location, data, myChart);
				}else{
                    var option ;
                    if(pageFontSize){
                        option = chartOption(data.cmp.id, pageFontSize);
                    }else{
                        option = chartOption(data.cmp.id, '12');
                    }
					
					$.extend(true, option, data.chartOptions);
					
					//alert("option.title.text:"+option.title.text);
					
					if(data.chartOptions.linkurl && data.chartOptions.linkurl != null){
						$('#'+container).prev().html(data.chartOptions.title.text + '<span class="linkMore"><a href="'+ data.chartOptions.linkurl +'" target="_blank">更多...</a>');
					}else{
						$('#'+container).prev().html(data.chartOptions.title.text);
					}
					
					option.title.text = '';
					option.backgroundColor = '';
					myChart.setOption(option, true);
				}
			}
		}
	});
}

function loadPMLinkMap(location, data, myChart) {
	$.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
		if(xdata){
			echarts.registerMap("map"+location, xdata);
		}
		
		var option = getPMLinkMapOption("map"+location);
		$.extend(true, option, data.chartOptions);
		
		var ration = parseInt(data.ratio);
		
		option.series[1].symbolSize = function(val) {
            return 3 + val[2] / 10000;
        };
        option.title.text = '';
        
        option.backgroundColor = '';
		myChart.setOption(option, true);
	});
}

function getPMLinkMapOption(mapLoc){
	var defOptions = 
	{geo:{
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
	    },title : {
	        text: '',
	        subtext: '',
	        left: 'center',
	        textStyle : {
	            color: '#222'
	        }
	    },
	    tooltip : {
	        trigger: 'item'
	    }
	}
	
	return defOptions;
}

function loadMap(location, data, myChart) {
	$.getJSON('../static/js/ec/map/china-main-city/' + location + '.json', function (xdata) {
		if(xdata){
			echarts.registerMap("map"+location, xdata);
		}
		
		var series = data.chartOptions.series;
		for(var i=0; i<series.length; i++){
			series[i].mapType = 'map' + location;
		}
		
		$.each(data.chartOptions.series, function(idx,element){
			element.itemStyle = myChart._theme.map.itemStyle;
			element.label = myChart._theme.map.label;
		});
		
		var option = chartOption(data.cmp.id);
		
		$.extend(true, option, data.chartOptions);
		option.title.text = '';
		option.backgroundColor = '';
		myChart.setOption(option, true);
		
		curMap = {
			mapCode: location,
			mapName: cityMap[location]
		};
	});
}
