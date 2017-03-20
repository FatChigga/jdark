var epgdomain = typeof Authentication == "undefined" ? "" : Authentication.CTCGetConfig("EPGDomain");
//var epgdomain = "";
var host = epgdomain.replace(/(http:\/\/(\w|\.|:)*\/)(.*)/g, '$1');

function small_play(code,top,left,width,height){
	if(typeof top == "undefined"){
		//top = 0;
		top = $('#win-player').offset().top;
	}
	if(typeof left == "undefined"){
		//left = 0;
		left = $('#win-player').offset().left;
	}
	if(typeof width == "undefined"){
		width = 620;
	}
	if(typeof height == "undefined"){
		height = 313;
	}

	var type = 'hw';
	$('.play .vid').find('img').hide();

	if(type == 'hw'){
		var urlhw = host + "EPG/jsp/tools/playControl/playUrlInVas.jsp?CODE="+code+"&PLAYTYPE=1&CONTENTTYPE=0&BUSINESSTYPE=1&SPID=20001041&USERID=&USERTOKEN=";

		$.get(urlhw, {}, function(data) {
			data = jQuery.parseJSON(data);
			var playurl = data.retDesc.replace(/.*http/, "http");

			var nurl = basePath + "video/player?mediatype=1&playurl=" + escape(playurl) + "&left=" + left + "&top=" + top + "&width="+width+"&height="+height;

			$("#win-player").attr("src", nurl);
		})
	}
}

function full_play(code){
	$("#win-player").attr("src","");

    var backUrl=basePath+"home/index";
    var urlhw = host + "EPG/jsp/tools/playControl/play_pageControl.jsp?CODE="+code+"&PROGID=&PLAYTYPE=1&CONTENTTYPE=0&BUSINESSTYPE=1&PREVIEWFLAG=1&TYPE_ID=&FATHERSERIESID=-1&BOOKMARKTIME=0&SPID=20001041&ISAUTHORIZATION=0&PREVIEWTIME=0&BACKURL="+backUrl+"&ISSWITSONG=0&CONVERTIME=60";
    var urlzte = host + "iptvepg/frame262/uniform_play.jsp?telecomcode="+code+"&playtype=0&backurl="+backUrl;

    window.location.href = urlhw;
}