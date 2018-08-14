/* global controllerMappings, views, transactionManager, applications, formatter, Utils, fileManager */

(function (g) {
    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/badges/(?<badgeId>[^/]*)')
            .addMethod('GET', 'checkRedirect')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/badges/(?<badgeId>[^/]*)/')
            .addPathResolver('topicId', 'resolveTopicId')
            .addPathResolver('badgeId', 'resolveBadgeId')

            /* Badge */
            .addMethod('POST', '_updateBadge', 'updateBadge')
            .addMethod('POST', '_uploadBadgeImage', 'uploadBadgeImage')
            .addMethod('POST', '_removeBadgeImage', 'removeBadgeImage')
            .addMethod('POST', '_applyImage', 'applyImage')

            /* Badge Assets */
            .addMethod('POST', '_createAssetForRecognition', 'createAssetType')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageBadge.html'))
            .build();

    /**
     * API for updating a badge
     *
     * @param {type} page
     * @param {type} params
     * @returns {undefined}
     */
    g._updateBadge = function (page, params) {
        var topic = page.attributes.topicId;
        var badge = page.attributes.badgeId;

        var m = {
            name: Utils.safeString(params.name),
            title: Utils.safeString(params.title),
            colour: Utils.safeString(params.colour)
        };

        // Check for an existing badge
        var existingBadge = topic.getBadge(m.name);
        if (m.name !== Utils.safeString(badge.name) && Utils.isNotNull(existingBadge)) {
            return page.jsonResult(false, 'A badge with the name ' + m.name + ' already exists');
        }

        transactionManager.runInTransaction(function () {
            page.dataBind(badge, m);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API to delete an award
     *
     * @param {type} page
     * @param {type} params
     * @returns {undefined}
     */
    g._createAssetForRecognition = function (page, params) {
        var assetTypeToCreate = Utils.safeString(params.createAssetType);
        var topic = page.attributes.topicId;

        var contentType = services.assetManager.assetTypeManager.getContentType(assetTypeToCreate);

        var badge = page.attributes.badgeId;

        transactionManager.runInTransaction(function () {
            services.recognitionManager.createAssetForRecognition(badge, contentType);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API for uploading badge images
     *
     * @param {type} page
     * @param {type} params
     * @param {type} files
     * @returns {undefined}
     */
    g._uploadBadgeImage = function (page, params, files) {
        var badge = page.attributes.badgeId;
        log.info("_uploadBadgeImage Badge={}", badge);

        if (params.containsKey('overwrite')) {
            var file = files.get('badgeImg');
            var hash;

            transactionManager.runInTransaction(function () {
                hash = fileManager.uploadFile(file);
                var m = {
                    imageHash: hash
                };

                page.dataBind(badge, m);
            });

            return page.jsonResult(true, 'Uploaded', '/_hashes/files/' + hash);
        } else if (params.containsKey('crop')) {
            var newHash = g.cropImage(null, params);

            transactionManager.runInTransaction(function () {
                var m = {
                    imageHash: newHash
                };

                page.dataBind(badge, m);
            });

            return page.jsonResult(true, 'cropped', '/_hashes/files/' + newHash);
        }
    };

    /**
     * API for removing an image fron a badge
     *
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._removeBadgeImage = function (page, params) {
        var badge = page.attributes.badgeId;

        transactionManager.runInTransaction(function () {
            var m = {
                imageHash: null
            };

            page.dataBind(badge, m);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * Used with the image cropper
     *
     * @param {type} page
     * @returns {unresolved}
     */
    g._applyImage = function (page) {
        return page.jsonResult(true);
    };
})(this);