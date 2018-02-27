(function (g) {
    var APP_NAME = 'linkedin-lib';

    controllerMappings
            .websitePortletController()
            .portletSection('header')
            .templatePath('/theme/apps/linkedin-lib/header.html')
            .method('getLinkedInSettings')
            .enabled(true)
            .build();

    g.getLinkedInSettings = function (page, params, contextMap) {
        log.info('getLinkedInSettings > page={}, params={}, context={}', [page, params, contextMap]);

        var appSettings = g.getAppSettings(page);

        contextMap.put('appSettings', appSettings);
    };

    g.saveSettings = function (page, params) {
        var apiKey = params.apiKey || '';

        page.setAppSetting(APP_NAME, 'apiKey', apiKey);

        return views.jsonResult(true);
    };

    g.getAppSettings = function (page) {
        var websiteFolder = page.closest('websiteVersion');
        var org = page.organisation;
        var branch = null;

        if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
            branch = websiteFolder.branch;
        }

        var app = applications.get(APP_NAME);
        if (app !== null) {
            var settings = app.getAppSettings(org, branch);
            return settings;
        }

        return null;
    };
})(this);