/* global controllerMappings, applications */

(function (g) {
    // Menu Mappings
    controllerMappings
            .menuController()
            .parentId('menuRoot')
            .type('website')
            .method('_genWebsiteMenus')
            .build();

    g._genWebsiteMenus = function (rootFolder, parent) {
        var app = applications.get('TravelDeals');

        var val = app.getSetting('rootPath') || g._config.DEFAULT_PATHS['rootPath'];
        var title = app.getSetting('rootMenuTitle') || g._config.DEFAULT_MENU_TITLE;

        parent.getOrCreate('travelDealsList', title, '/' + val + '/').setOrdering(12);
    };

    // Component Mappings
    controllerMappings
            .addComponent('travelDeals/components', 'travelDealDetails', 'html', 'Shows the Travel Deals Content', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealImage', 'html', 'Shows the Travel Deals Banner', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealSummary', 'html', 'Shows the Travel Deals Summary', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealEnquiry', 'html', 'Shows the Travel Deals enquiry button', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealRelated', 'html', 'Shows related travel deals', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealCategories', 'html', 'Shows categories', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealTags', 'html', 'Shows tags related to the Travel Deal', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealFiles', 'html', 'Shows files attached to a deal', 'Travel Deals')
            .addComponent('travelDeals/components', 'travelDealList', 'html', 'Shows a list of travel deals', 'Travel Deals');
})(this);