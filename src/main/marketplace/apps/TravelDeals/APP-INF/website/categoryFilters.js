/* global controllerMappings, formatter, views, applications */

(function (g) {

    /*==== Category Controller ====*/
    var categoryController = controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(true)
            .pathSegmentResolver('catName', '_resolveCategory')
            .defaultView(views.templateView('/theme/apps/travelDeals/viewTravelDealsCategory.html'))
            .addMethod('GET', '_viewCategory')
            .title(function (page) {
                return page.attributes.catName.jsonObject.title;
            });

    /*==== Root Category Controller ====*/
    controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(true)
            .pathSegmentResolver('categoryPath', '_resolveDynamicUrl')
            .addMethod('GET', '_redirectCategory')
            .child(categoryController)
            .build();

    g._viewCategory = function (page, params) {
        var cat = page.attributes.catName;

        params.put('categories', cat.jsonObject.name);
    };

    g._redirectCategory = function () {
        var app = applications.get('TravelDeals');

        var val = app.getSetting('rootPath') || g._config.DEFAULT_PATHS['rootPath'];
        return views.redirectView('/' + val + '/');
    };

})(this);