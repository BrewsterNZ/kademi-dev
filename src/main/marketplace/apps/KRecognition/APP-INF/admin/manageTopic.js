/* global controllerMappings, views, transactionManager, applications, formatter, Utils, fileManager */

(function (g) {
    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)')
            .addMethod('GET', 'checkRedirect')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/')
            .addPathResolver('topicId', 'resolveTopicId')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageTopic.html'))
            /* Process Levels */
            .addMethod('POST', '_processLevels', 'processLevels')

            .addMethod('POST', '_updateTopic', 'saveDetails')
            .addMethod('DELETE', '_deleteTopic')
            /* Images */
            .addMethod('POST', '_applyImage', 'applyImage')
            /* Badges */
            .addMethod('POST', '_createBadge', 'createBadge')
            .addMethod('POST', '_deleteBadge', 'deleteBadge')
            .addMethod('POST', '_updateBadge', 'updateBadge')
            .addMethod('POST', '_createAssetForRecognition', 'createAssetType')
            .addMethod('POST', '_uploadBadgeImage', 'uploadBadgeImage')
            .addMethod('POST', '_removeBadgeImage', 'removeBadgeImage')
            /* Levels */
            .addMethod('POST', '_createLevel', 'createLevel')
            .addMethod('POST', '_deleteLevel', 'deleteLevel')
            .addMethod('POST', '_updateLevel', 'updateLevel')
            .addMethod('POST', '_uploadLevelImage', 'uploadLevelImage')
            .addMethod('POST', '_removeLevelImage', 'removeLevelImage')
            /* Build the controller */
            .build();

    /**
     * API for updating a topic
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._updateTopic = function (page, params) {
        var topic = page.attributes.topicId;
        var newParams = formatter.newMap();
        newParams.putAll(params);

        // Check for dataSeries
        if (Utils.isStringNotBlank(newParams.dataSeries)) {
            var dataSeriesName = newParams.dataSeries;
            newParams.put('pointsBucket', null);

            var sds = applications.salesData.getSalesDataSeries(dataSeriesName);
            newParams.put('dataSeries', sds);
        }
        // Check for pointsBucket
        else if (Utils.isStringNotBlank(newParams.pointsBucket)) {
            var pointsBucketName = newParams.pointsBucket;
            newParams.put('dataSeries', null);

            var pointsBuckets = applications.rewards.getPointsBucket(pointsBucketName);
            newParams.put('pointsBucket', pointsBuckets);
        } else {
            newParams.put('dataSeries', null);
            newParams.put('pointsBucket', null);
        }

        transactionManager.runInTransaction(function () {
            page.dataBind(topic, newParams);
        });

        return views.jsonResult(true, 'Saved ' + topic.title);
    };

    /**
     * API for deleting a topic
     * 
     * @param {type} page
     * @returns {undefined}
     */
    g._deleteTopic = function (page) {
        var topic = page.attributes.topicId;

        transactionManager.runInTransaction(function () {
            applications.userApp.recognitionService.deleteTopic(topic.id);
        });

        return page.jsonResult(true, 'Deleted ' + topic.title);
    };

    /**
     * API to create a new badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._createBadge = function (page, params) {
        var topic = page.attributes.topicId;

        var badgeName = Utils.safeString(params.newName);
        var badgeTitle = Utils.safeString(params.title);

        // Check for an existing badge
        var existingBadge = topic.getBadge(badgeName);
        if (Utils.isNotNull(existingBadge)) {
            return views.jsonResult(false, 'A badge with the name ' + badgeName + ' already exists');
        }

        var newBadge;

        transactionManager.runInTransaction(function () {
            newBadge = applications.userApp.recognitionService.createBadge(topic, badgeName, badgeTitle);
        });

        return page.jsonResult(true, 'Created ' + newBadge.title);
    };

    /**
     * API to delete a badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._deleteBadge = function (page, params) {
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.deleteBadge));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.deleteBadge);
        }

        transactionManager.runInTransaction(function () {
            applications.userApp.recognitionService.deleteBadge(topic, badge);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API for updating a badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {undefined}
     */
    g._updateBadge = function (page, params) {
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.badgeid));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find level with ID: ' + params.badgeid);
        }

        var m = {
            name: Utils.safeString(params.newName),
            title: Utils.safeString(params.title)
        };

        // Check for an existing badge
        var existingLevel = topic.getBadge(m.name);
        if (m.name !== Utils.safeString(badge.name) && Utils.isNotNull(existingLevel)) {
            return page.jsonResult(false, 'A badge with the name ' + m.name + ' already exists');
        }

        transactionManager.runInTransaction(function () {
            page.dataBind(badge, m);
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
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.badgeid));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.badgeid);
        }

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
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.removeBadgeImage));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.removeBadgeImage);
        }

        transactionManager.runInTransaction(function () {
            var m = {
                imageHash: null
            };

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
        
        var badge = topic.getBadge(Utils.safeInt(params.badgeid));
        
        transactionManager.runInTransaction(function () {
            services.catalogManager.createAssetForRecognition(badge, contentType);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API to create a new level
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._createLevel = function (page, params) {
        var topic = page.attributes.topicId;

        var levelName = Utils.safeString(params.newName);
        var levelTitle = Utils.safeString(params.title);
        var levelAmount = formatter.toBigDecimal(params.levelAmount, 2);

        // Check for an existing level
        var existingBadge = topic.getLevel(levelName);
        if (Utils.isNotNull(existingBadge)) {
            return views.jsonResult(false, 'A level with the name ' + levelName + ' already exists');
        }

        var newLevel;

        transactionManager.runInTransaction(function () {
            newLevel = applications.userApp.recognitionService.createLevel(topic, levelName, levelTitle, levelAmount);
        });

        return page.jsonResult(true, 'Created ' + newLevel.title);
    };

    /**
     * API to delete a level
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._deleteLevel = function (page, params) {
        var topic = page.attributes.topicId;
        var level = topic.getLevel(Utils.safeInt(params.deleteLevel));

        if (Utils.isNull(level)) {
            return page.jsonResult(false, 'Could not find level with ID: ' + params.deleteLevel);
        }

        transactionManager.runInTransaction(function () {
            applications.userApp.recognitionService.deleteLevel(topic, level);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API for updating a level
     * 
     * @param {type} page
     * @param {type} params
     * @returns {undefined}
     */
    g._updateLevel = function (page, params) {
        var topic = page.attributes.topicId;
        var level = topic.getLevel(Utils.safeInt(params.levelid));

        if (Utils.isNull(level)) {
            return page.jsonResult(false, 'Could not find level with ID: ' + params.levelid);
        }

        var m = {
            name: Utils.safeString(params.newName),
            title: Utils.safeString(params.title),
            levelAmount: formatter.toBigDecimal(params.levelAmount, 2),
            colour: Utils.safeString(params.colour)
        };

        // Check for an existing level
        var existingLevel = topic.getLevel(m.name);
        if (m.name !== Utils.safeString(level.name) && Utils.isNotNull(existingLevel)) {
            return page.jsonResult(false, 'A level with the name ' + m.name + ' already exists');
        }

        transactionManager.runInTransaction(function () {
            page.dataBind(level, m);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * API for uploading level images
     * 
     * @param {type} page
     * @param {type} params
     * @param {type} files
     * @returns {undefined}
     */
    g._uploadLevelImage = function (page, params, files) {
        var topic = page.attributes.topicId;
        var level = topic.getLevel(Utils.safeInt(params.levelid));

        if (Utils.isNull(level)) {
            return page.jsonResult(false, 'Could not find level with ID: ' + params.levelid);
        }

        if (params.containsKey('overwrite')) {
            var file = files.get('levelImg');
            var hash;

            transactionManager.runInTransaction(function () {
                hash = fileManager.uploadFile(file);
                var m = {
                    imageHash: hash
                };

                page.dataBind(level, m);
            });

            return page.jsonResult(true, 'Uploaded', '/_hashes/files/' + hash);
        } else if (params.containsKey('crop')) {
            var newHash = g.cropImage(null, params);

            transactionManager.runInTransaction(function () {
                var m = {
                    imageHash: newHash
                };

                page.dataBind(level, m);
            });

            return page.jsonResult(true, 'cropped', '/_hashes/files/' + newHash);
        }
    };

    /**
     * API for removing an image fron a level
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._removeLevelImage = function (page, params) {
        var topic = page.attributes.topicId;
        var level = topic.getLevel(Utils.safeInt(params.removeLevelImage));

        if (Utils.isNull(level)) {
            return page.jsonResult(false, 'Could not find level with ID: ' + params.removeLevelImage);
        }

        transactionManager.runInTransaction(function () {
            var m = {
                imageHash: null
            };

            page.dataBind(level, m);
        });

        return page.jsonResult(true, 'Success');
    };

    g._processLevels = function (page, params) {
        log.info("processLevels {}", page.attributes.topicId);
        var topic = page.attributes.topicId;

        if (Utils.isStringBlank(topic.dataSeries) && Utils.isStringBlank(topic.pointsBucket)) {
            return page.jsonResult(false, 'No Data Series or Points Bucket configured');
        }


        applications.userApp.recognitionService.scanLevels(topic);
        return page.jsonResult(true, 'Done scan levels');

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