controllerMappings
	.adminController()
	.path("/kredirect/")
	.enabled(true)
	.defaultView(views.templateView("/theme/apps/KRedirect/redirects.html"))
	.addMethod("GET", "getAllRedirects")
	.addMethod("POST", "saveRecord", "sourceUrl")
	.addMethod("POST", "deleteRecord", "deleteRecord")
	.addMethod("POST", "changeStatus", "changeStatus")
	.build();

controllerMappings
    .websiteController()
    .path('/(?<kredirect>[^/]*)')
    .addPathResolver('kredirect', 'kredirectResolver')
    .enabled(true)
	.isPublic(true)
    .addMethod("GET", "redirectUrl")
    .build();

controllerMappings
    .websiteController()
    .path('/(?<kredirect>[^/]*)/')
    .addPathResolver('kredirect', 'kredirectResolver')
    .enabled(true)
    .isPublic(true)
    .addMethod("GET", "redirectUrl")
    .build();

function initKRedirectsApp(orgRoot, webRoot, enabled){
	log.info("initRedirectsApp: orgRoot={}", orgRoot);
    var dbs = orgRoot.find('jsondb');
    var db = dbs.child(DB_NAME);

    if (formatter.isNull(db)) {
        log.info('{} does not exist!', DB_TITLE);

        db = dbs.createDb(DB_NAME, DB_TITLE, DB_NAME);

        setAllowAccess(db, true);

        saveMapping(db);
    }
}