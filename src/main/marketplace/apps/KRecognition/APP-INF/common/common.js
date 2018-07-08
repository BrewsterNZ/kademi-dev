/* global log, views, applications, Utils, formatter, fileManager */

(function (g) {
    g.initApp = function (orgRoot, webRoot, enabled) {
        log.info("initApp KRecognition: orgRoot={}", orgRoot);
    };

    g.saveSettings = function (page, params) {
        log.info('saveSettings > page={}, params={}', page, params);

        return views.jsonResult(true);

    };

    g.getAppSettings = function (page) {
        log.info('getAppSettings > page={}', page);

        var websiteFolder = page.closest('websiteVersion');
        var org = page.organisation;
        var branch = null;

        if (Utils.isNotNull(websiteFolder)) {
            branch = websiteFolder.branch;
        }

        var app = applications.get(g.APP_NAME);
        if (app !== null) {
            var settings = app.getAppSettings(org, branch);
            return settings;
        }

        return null;
    };

    /**
     * A URL Resolver for topicId
     * @param {type} page
     * @param {type} groupName
     * @param {type} groupValue
     * @returns {unresolved}
     */
    g.resolveTopicId = function (page, groupName, groupValue) {
        var id = formatter.toLong(groupValue);
        
        page.attributes.topicId = applications.userApp.recognitionService.getTopic(id);
        
        return page.attributes.topicId;
    };

    /**
     * A URL Resolver for badgeId
     * @param {type} page
     * @param {type} groupName
     * @param {type} groupValue
     * @returns {unresolved}
     */
    g.resolveBadgeId = function (page, groupName, groupValue) {
        var id = formatter.toLong(groupValue);
        return page.attributes.topicId.getBadge(id);
    };

    /**
     * Redirect to an absolute URL
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g.checkRedirect = function (page, params) {
        var href = page.href;
        if (!href.endsWith('/')) {
            href = href + '/';
        }

        return views.redirectView(href);
    };

    g.cropImage = function (name, params) {
        var hash = Utils.safeString(params.uploadedHref).replace('/_hashes/files/', '');
        var imageDim = fileManager.utils.getImageDimensions(hash);

        var x = Utils.safeInt(params.x);
        var y = Utils.safeInt(params.y);
        var w = Utils.safeInt(params.w);
        var h = Utils.safeInt(params.h);

        if (w > imageDim.width) {
            w = imageDim.width;
        }

        if (h > imageDim.height) {
            h = imageDim.height;
        }

        var fileExt = (Utils.isStringNotBlank(name) ? formatter.fileExt(name) : null);
        return fileManager.utils.cropImage(hash, x, y, w, h, fileExt);
    };
})(this);