controllerMappings.addComponent("cookie-accept/components", "cookieAccept", "html", "Add banner notice ask users for permission to use cookies", "Cookie");

controllerMappings
    .websitePortletController()
    .portletSection('cookieAccept')
    .templatePath('/theme/apps/cookie-accept/cookieAcceptPorlet.html')
    .method('getCookieAccept')
    .enabled(true) 
    .build();

function getCookieAccept(){
	
}