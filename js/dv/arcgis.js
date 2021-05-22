var arcgisMap;

function loadArcgisMap(data, container) {
	var paras = $.parseJSON(data.entity);
	var arcgisServer = paras.mapServer;
	var cood = paras.defCoor;
	var zoom = paras.zoom;
	if(arcgisServer != null && arcgisServer != ""){
		require([
			"esri/map", "esri/toolbars/draw", "esri/graphic","esri/layers/FeatureLayer", "esri/InfoTemplate",
		     "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
		     "esri/renderers/UniqueValueRenderer","esri/renderers/HeatmapRenderer","esri/Color",
		     "dojo/domReady!"
		], function (Map, Draw, Graphic,FeatureLayer, InfoTemplate,
	    	     SimpleLineSymbol, SimpleFillSymbol,
	    	     UniqueValueRenderer,HeatmapRenderer, Color) {
			$('#'+container).empty();
			arcgisMap = new Map(container ,{ratio:0.5,center: cood.split(','),zoom:zoom});
			
			//arcgisMap = new Map(container,{ratio:0.5,center: [116.995,36.65],zoom:13});
			
			var MyTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer
	          (arcgisServer);
			arcgisMap.addLayer(MyTiledMapServiceLayer);
		});
	}
}

function loadArcgisMap2(data, container) {
	var paras = $.parseJSON(data.entity);
	var arcgisServer = paras.mapServer;
	var cood = paras.defCoor;
	var coodArray = cood.split(',');
	var zoom = paras.zoom;
	
	if(arcgisServer != null && arcgisServer != ""){
		alert('sss-->');
		//arcgisMap = new Map(container ,{ratio:0.5,center: [parseFloat(coodArray[0]), parseFloat(coodArray[1])],zoom:parseInt(zoom)});
		arcgisMap = new Map("3_parent_5",{ratio:0.5,center: [116.995,36.65],zoom:13});
		
		alert('ss2s');
		var MyTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer(arcgisServer);
		alert('ss2s');
		arcgisMap.addLayer(MyTiledMapServiceLayer);
	}
}
