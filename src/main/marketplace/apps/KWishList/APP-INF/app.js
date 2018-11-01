controllerMappings.addComponent("KWishList/components", "wishList", "html", "Displays user's wishlist", "KWishList App");

controllerMappings
	.websiteController()
	.path("/wishlist/")
	.enabled(true)
    .isPublic(false)
	.defaultView(views.templateView("/theme/apps/KWishList/wishlist.html"))
	.addMethod("GET", "getWishList")
	.addMethod("POST", "toggleWishList", "toggleWishList")
    .postPriviledge("READ_CONTENT")
    .addType("controllerResource")
	.build();

controllerMappings
    .websiteController()
    .path('/wishlist')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }

    return views.redirectView(href);
}

controllerMappings
        .websitePortletController()
        .portletSection('wishlistAddProduct')
        .templatePath('/theme/apps/KWishList/wishlistAddProductPortlet.html')
        .enabled(true)
        .build();

controllerMappings
    .websitePortletController()
    .portletSection('wishlistAddProductList')
    .templatePath('/theme/apps/KWishList/wishlistAddProductListPortlet.html')
    .enabled(true)
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