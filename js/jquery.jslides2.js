
$(function(){
	var numpic = $('#slides li').size()-1;
	var nownow = 0;
	var inout = 0;
	var TT = 0;
	var SPEED = 5000;


	$('#slides li').eq(0).siblings('li').css({'display':'none'});


	var ulstart = '<ul id="pagination">',
		ulcontent = '',
		ulend = '</ul>';
	ADDLI();
	var pagination = $('#pagination li');
	var paginationwidth = $('#pagination').width();
    var W = $(window).width();
	$('#pagination').css('left',(W/2-paginationwidth/2))
	$('.banner ul.search').css('left',(W/2-$('.banner ul.search').width()/2))
	
	
	pagination.eq(0).addClass('current')
		
	function ADDLI(){
		//var lilicount = numpic + 1;
		for(var i = 0; i <= numpic; i++){
			ulcontent += '<li>' + '<a href="#">' + (i+1) + '</a>' + '</li>';
		}
		
		$('#slides').after(ulstart + ulcontent + ulend);	
	}

	pagination.on('click',DOTCHANGE)
	
	
	function DOTCHANGE(){
		
		var changenow = $(this).index();
		
		$('#slides li').eq(nownow).css('z-index','900');
		$('#slides li').eq(changenow).css({'z-index':'800'}).show();
		pagination.eq(changenow).addClass('current').siblings('li').removeClass('current');
		$('#slides li').eq(nownow).fadeOut(400,function(){$('#slides li').eq(changenow).fadeIn(500);});
		nownow = changenow;
	}
	
	pagination.mouseenter(function(){
		inout = 1;
	})
	
	pagination.mouseleave(function(){
		inout = 0;
	})
	
	//function GOGO(){
//		
//		var NN = nownow+1;
//		if( inout == 1 ){
//			} else {
//			if(nownow < numpic){
//			$('#slides li').eq(nownow).css('z-index','900');
//			$('#slides li').eq(NN).css({'z-index':'800'}).show();
//			pagination.eq(NN).addClass('current').siblings('li').removeClass('current');
//			$('#slides li').eq(nownow).fadeOut(400,function(){$('#slides li').eq(NN).fadeIn(500);});
//			nownow += 1;
//
//		}else{
//			NN = 0;
//			$('#slides li').eq(nownow).css('z-index','900');
//			$('#slides li').eq(NN).stop(true,true).css({'z-index':'800'}).show();
//			$('#slides li').eq(nownow).fadeOut(400,function(){$('#slides li').eq(0).fadeIn(500);});
//			pagination.eq(NN).addClass('current').siblings('li').removeClass('current');
//
//			nownow=0;
//
//			}
//			$('.bannerTabArrow').animate({left:NN*150})
//		}
//		TT = setTimeout(GOGO, SPEED);
//	}
//	
//	TT = setTimeout(GOGO, SPEED); 
	
	var pagination2 = $('.bannerTab a');
	pagination2.on('click',DOTCHANGE)
	pagination2.on('click',DOTCHANGE2)
	pagination2.mouseenter(function(){
		inout = 1;
	})
	pagination2.mouseleave(function(){
		inout = 0;
	})
	function DOTCHANGE2(){
		var changenow = $(this).index();
		//$('.bannerTabArrow').css("left",changenow*150);
		$('.bannerTabArrow').animate({left:-425+changenow*150})
	}
// $(".bannerTab a").click(function(){
//	  DOTCHANGE();
//  });	
})