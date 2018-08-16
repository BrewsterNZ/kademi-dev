(function (g) {
    var APP_NAME = 'KConfirmDetails';

    g._saveSettings = function (page, params) {
        var groupName = params.groupName || '';
        var showTC = params.showTC || '';
        var tcURL = params.tcURL || '';
        var tcText = params.tcText || '';
        var showExtraFields = params.showExtraFields || '';

        page.setAppSetting(APP_NAME, 'groupName', groupName);
        page.setAppSetting(APP_NAME, 'showTC', showTC);
        page.setAppSetting(APP_NAME, 'tcURL', tcURL);
        page.setAppSetting(APP_NAME, 'tcText', tcText);
        page.setAppSetting(APP_NAME, 'showExtraFields', showExtraFields);

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

    g.getKConfirmDetails = function (page, params, context) {
        log.info('KConfirmDetails > page={}, params={}, context={}', [page, params, context]);

        var appSettings = g.getAppSettings(page);

        context.put('appSettings', appSettings);
    }

// ============================================================================
// Portlet
// ============================================================================
    controllerMappings
            .websitePortletController()
            .portletSection('endOfPage')
            .templatePath('/theme/apps/KConfirmDetails/kConfirmDetails.html')
            .method('getKConfirmDetails')
            .enabled(true)
            .build();


    controllerMappings
            .websiteController()
            .path('/confirm-details')
            .addMethod('POST', 'updateUser')
            .isPublic(true)
            .postPriviledge('READ_CONTENT')
            .enabled(true)
            .build();

    g.updateUser = function (page, params) {
        log.info('updateUser > page={}, params={}', page, params);

        var userName = params.userName;
        var groupName = params.groupName;
        var result = {
            status: true
        };

        var group;
        try {
            var rootFolder = page.closest("website");
            group = rootFolder.group(groupName);
            if( group == null ) {
                group = orgData.createGroup(groupName);
            }
        } catch (e) {
            log.error('Error when looking for group: ' + groupName + ' - ' + e, e);
            result.status = false;
            result.messages = ['Error when finding group: ' + e];
            return result;
        }

        try {
            transactionManager.runInTransaction(function () {
                securityManager.addToGroup(userName, group);
            });
            return views.jsonObjectView(JSON.stringify(result));
        } catch (e) {
            log.error('Error when updating user: ' + e, e);
            result.status = false;
            result.messages = ['Error when updating user: ' + e];
            return result;
        }
    };

})(this);