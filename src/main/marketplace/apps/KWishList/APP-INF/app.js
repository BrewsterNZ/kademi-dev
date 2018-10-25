controllerMappings.addComponent("KWishList/components", "wishList", "html", "Displays user's wishlist", "KWishList App");

controllerMappings
	.websiteController()
	.path("/wishlist/")
	.enabled(true)
	.defaultView(views.templateView("/theme/apps/KWishList/wishlist.html"))
	.addMethod("GET", "getWishList")
	.addMethod("POST", "toggleWishList", "toggleWishList")
	.build();

function initKWishListsApp(orgRoot, webRoot, enabled){
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