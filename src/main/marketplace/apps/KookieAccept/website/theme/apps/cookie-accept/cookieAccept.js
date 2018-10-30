$(function(){

	initCookieAccept();
});

function initCookieAccept(){

	$(".cookie-decline").on("click", function(){
		$.removeCookie('cookie-accept', { path: '/' });  
		hideBanner();
	});

	$(".cookie-allow").on("click", function(){
		$.cookie('cookie-accept', 'true', { path: '/' });
		hideBanner();
	});

	$(".close-cookie-banner").on("click", function(){  
		hideBanner();
	});
}


function hideBanner(){
	var container = $(".accept-cookie-baner");  
	if(!container.hasClass("hide-banner")){
		container.addClass("hide-banner");
		setTimeout(function(){ 
			container.hide();
		}, 500);
	}
}