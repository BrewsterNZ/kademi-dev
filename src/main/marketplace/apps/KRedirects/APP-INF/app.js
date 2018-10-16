controllerMappings
	.adminController()
	.path("/redirects/")
	.enabled(true)
	.defaultView(views.templateView("/theme/apps/redirects-app/redirects.html"))
	.addMethod("GET", "getRedirects")
	.addMethod("POST", "addNewRedirect", "newRedirect")
	.addMethod("POST", "deleteRedirects", "deleteRedirect")
	.build();

function initRedirectsApp(orgRoot, webRoot, enabled){
	log.info("initRedirectsApp: orgRoot={}", orgRoot);
	if(webRoot){
		log.info("Website {}", webRoot.websiteName);
		var dbSystem = orgRoot.find('jsondb');
		var dbName = "redirectsDB";
		var dbInstance = dbSystem.child(dbName);

		if(dbInstance === null){
			log.info("No database {} for website {}",dbName, webRoot.websiteName);
			dbInstance = dbSystem.createDb(dbName, "Redirects Database", "");
			dbInstance.website = webRoot.websiteName;
		}
		else{
			log.info("Database {} for website {} exists",dbName,webRoot.websiteName);  
		}
	}
}