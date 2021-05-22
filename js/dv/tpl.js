function queryTpls(){
	$.ajax({
		url : "tpls",
		type : "get",
		dataType : "json",
		contentType : "application/json",
		async : false,
		data : {},
		success : function(data) {
			var tplHtml = '';
			var xurl = '';
			
			$.each(data, function(idx,element){
				xurl = element.icon;
				xurl = xurl?xurl.replace("..", ".").replace("..", "."):'';
				debugger;
				// tplHtml += '<li id="'+element.tplId+'"><div class="template-img"><img src="'+xurl+'" /></div>';
				// tplHtml += '<div class="template-text"><h3>'+element.tplName+'</h3><p>比例尺寸</p><p>'+element.tplSize+'</p></div>';
				// tplHtml += '</li>';
                tplHtml += '<li class="item" id="'+element.tplId+'" data-tplName="'+element.tplName+'" data-tplSize="'+element.tplSize+'"><div><img src="'+xurl+'" /></div>';
                tplHtml += '<div class="change"></div></li>';
			});
			
			$('.template-list').append(tplHtml);
		}
	});
}