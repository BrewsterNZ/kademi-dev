/* global controllerMappings, securityManager, formatter, views, Utils, fileManager, log, applications */

(function (g) {
    /*==== Handlers ====*/
    g._manageTravelDeal = function (page) {
        var db = g._getOrCreateUrlDb(page);
        var record = page.attributes.dealName;

        page.attributes.categories = db.findByType(g._config.RECORD_TYPES.CATEGORY);
        page.attributes.tags = db.findByType(g._config.RECORD_TYPES.TAG);

        var enquiryQ = {
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "deal": record.name
                            }
                        },
                        {
                            "type": {
                                "value": g._config.RECORD_TYPES.ENQUIRY
                            }
                        }
                    ]
                }
            }
        };

        page.attributes.enquiries = db.search(JSON.stringify(enquiryQ));
    };

    g._saveDeal = function (page, params) {
        var db = g._getOrCreateUrlDb(page);
        var record = page.attributes.dealName;

        var json = JSON.parse(record.json);

        var newTitle = Utils.safeString(params.title);
        var oldTitle = json.title;

        var newName = null;
        var name = replaceYuckyChars(newTitle);
        var count = 1;
        if (newTitle != oldTitle) {
            newName = name;
            while (isNotNull(db.child(g._config.RECORD_NAMES.DEAL(newName)))) {
                newName = name + '-' + count;
                count++;
            }
            json.name = newName;
        }

        var description = json.description;

        params.remove('tags_checkbox');

        // Parse dates correctly
        params.startDate = params.startDate || null;
        params.validBetweenStart = params.validBetweenStart || null;
        params.validBetweenEnd = params.validBetweenEnd || null;
        params.bookByDate = params.bookByDate || null;

        json = populateFields(params, json);
        json.description = description;
        json.featured = Utils.safeBool(params.featured);

        // Parse Tags
        var tagsString = Utils.safeArray(params.tags);
        json.tags = tagsString;

        if (Utils.isNull(json.createdBy)) {
            var curUser = securityManager.currentUser;
            if (isNotNull(curUser)) {
                json.createdBy = curUser.name;
            }
        }

        if (Utils.isNull(newName)) {
            record.update(JSON.stringify(json));

            return page.jsonResult(true, 'Updated');
        } else {
            record.delete();

            db.createNew(g._config.RECORD_NAMES.DEAL(newName), JSON.stringify(json), g._config.RECORD_TYPES.DEAL);

            return page.jsonResult(true, 'Updated', '/travelDeals/' + newName + '/');
        }
    };

    g._publishDeal = function (page, params) {
        var publish = Utils.safeBool(params.publish);

        var record = page.attributes.dealName;
        var json = JSON.parse(record.json);
        json.published = publish;
        record.update(JSON.stringify(json));

        if (publish) {
            return page.jsonResult(true, 'Successfully published');
        } else {
            return page.jsonResult(true, 'Successfully unpublished');
        }
    };

    /*==== Tips ====*/
    g._addTip = function (page, params) {
        var record = page.attributes.dealName;

        var tips = record.tips;
        if (Utils.isNull(tips)) {
            tips = formatter.newArrayList();
            record.tips = tips;
        }

        var newId = 0;
        var nextOrder = 0;
        for (var i = 0; i < tips.length; i++) {
            var tip = tips[i];
            if (tip.order > nextOrder) {
                nextOrder = tip.order;
            }
            if (tip.id > newId) {
                newId = tip.id;
            }
        }
        newId++;
        nextOrder++;

        var d = {
            id: newId,
            order: nextOrder,
            text: Utils.safeString(params.text)
        };

        tips.add(d);

        record.tips = tips;

        record.save();

        return page.jsonResult(true, 'Tip Added');
    };

    g._reorderTip = function (page, params) {
        var record = page.attributes.dealName;

        var tips = record.tips;

        var curId = Utils.safeInt(params.id);
        var prevItemId = Utils.safeInt(params.prevId);

        var curItemOrder = getOrder(tips, curId);
        var prevItemOrder = getOrder(tips, prevItemId);

        var movingDown = curItemOrder < prevItemOrder;

        var newOrder = formatter.toInteger(Utils.isNotNull(prevItemOrder) ? prevItemOrder + 1 : 1);

        for (var i = 0; i < tips.length; i++) {
            var t = tips[i];
            if (t.id === curId) {
                t.order = newOrder;
            } else {
                if (!movingDown) {
                    t.order = formatter.toInteger(t.order + 1);
                }
            }
        }

        var sortedList = formatter.sortByProperty(tips, 'order');

        for (var i = 0; i < sortedList.length; i++) {
            var tip = sortedList[i];
            var n = i + 1;
            tip.order = n;
        }

        record.tips = sortedList;

        record.save();

        return page.jsonResult(true, 'Tip Saved');
    };

    g._deleteTip = function (page, params) {
        var record = page.attributes.dealName;

        var tips = record.tips;

        var curId = Utils.safeInt(params.deleteTip);

        var tip = getById(tips, curId);

        tips.remove(tip);

        var sortedList = formatter.sortByProperty(tips, 'order');

        for (var i = 0; i < sortedList.length; i++) {
            var tip = sortedList[i];
            var n = i + 1;
            tip.order = n;
        }

        record.tips = sortedList;

        record.save();

        return page.jsonResult(true, 'Tip Deleted');
    };

    function getOrder(a, id) {
        for (var i = 0; i < a.length; i++) {
            var b = a[i];
            if (b.id == id) {
                return b.order;
            }
        }
        return null;
    }

    function getById(a, id) {
        for (var i = 0; i < a.length; i++) {
            var b = a[i];
            if (b.id == id) {
                return b;
            }
        }
        return null;
    }

    /*==== Recommended Links ====*/
    g._addLink = function (page, params) {
        var record = page.attributes.dealName;

        var links = record.recommendedLinks;
        if (Utils.isNull(links)) {
            links = formatter.newArrayList();
            record.recommendedLinks = links;
        }

        var newId = 0;
        var nextOrder = 0;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.order > nextOrder) {
                nextOrder = link.order;
            }
            if (link.id > newId) {
                newId = link.id;
            }
        }
        newId++;
        nextOrder++;

        var d = {
            id: newId,
            order: nextOrder,
            text: Utils.safeString(params.text),
            url: Utils.safeString(params.url)
        };

        links.add(d);

        record.recommendedLinks = links;

        record.save();

        return page.jsonResult(true, 'Link Added');
    };

    g._reorderLink = function (page, params) {
        var record = page.attributes.dealName;

        var links = record.recommendedLinks;

        var curId = Utils.safeInt(params.id);
        var prevItemId = Utils.safeInt(params.prevId);

        var curItemOrder = getOrder(links, curId);
        var prevItemOrder = getOrder(links, prevItemId);

        var movingDown = curItemOrder < prevItemOrder;

        var newOrder = formatter.toInteger(Utils.isNotNull(prevItemOrder) ? prevItemOrder + 1 : 1);

        for (var i = 0; i < links.length; i++) {
            var t = links[i];
            if (t.id === curId) {
                t.order = newOrder;
            } else {
                if (!movingDown) {
                    t.order = formatter.toInteger(t.order + 1);
                }
            }
        }

        var sortedList = formatter.sortByProperty(links, 'order');

        for (var i = 0; i < sortedList.length; i++) {
            var l = sortedList[i];
            l.order = i + 1;
        }

        record.recommendedLinks = sortedList;

        record.save();

        return page.jsonResult(true, 'Link Saved');
    };

    g._deleteLink = function (page, params) {
        var record = page.attributes.dealName;

        var links = record.recommendedLinks;

        var curId = Utils.safeInt(params.deleteLink);

        var link = getById(links, curId);

        links.remove(link);

        var sortedList = formatter.sortByProperty(links, 'order');

        for (var i = 0; i < sortedList.length; i++) {
            var l = sortedList[i];
            var n = i + 1;
            l.order = n;
        }

        record.recommendedLinks = sortedList;

        record.save();

        return page.jsonResult(true, 'Link Deleted');
    };

    /*==== Images ====*/
    g._uploadBanner = function (page, params, files) {
        log.info('_handleBannerImage params={} - files={}', params, files.get('banner'));

        var record = page.attributes.dealName;

        if (params.containsKey('overwrite')) {
            var file = files.get('banner');
            var hash = fileManager.uploadFile(file);

            record.tempBannerImage = {
                name: file.name,
                hash: hash,
                contentType: file.contentType
            };

            record.save();

            return page.jsonResult(true, 'Uploaded', '/_hashes/files/' + hash);
        } else if (params.containsKey('crop')) {
            var newHash = cropImage(record.tempBannerImage.name, params);

            record.bannerImage = {
                name: record.tempBannerImage.name,
                hash: newHash,
                contentType: record.tempBannerImage.contentType
            };

            record.tempBannerImage = null;

            record.save();

            return page.jsonResult(true, 'cropped', '/_hashes/files/' + newHash);
        }
    };

    g._removeBanner = function (page) {
        var record = page.attributes.dealName;

        record.remove('bannerImage');

        record.save();

        return page.jsonResult(true);
    };

    g._uploadPreview = function (page, params, files) {
        log.info('_handleBannerImage params={} - files={}', params, files.get('banner'));

        var record = page.attributes.dealName;

        if (params.containsKey('overwrite')) {
            var file = files.get('preview');
            var hash = fileManager.uploadFile(file);

            record.tempPreviewImage = {
                name: file.name,
                hash: hash,
                contentType: file.contentType
            };

            record.save();

            return page.jsonResult(true, 'Uploaded', '/_hashes/files/' + hash);
        } else if (params.containsKey('crop')) {
            var newHash = cropImage(record.tempPreviewImage.name, params);

            record.previewImage = {
                name: record.tempPreviewImage.name,
                hash: newHash,
                contentType: record.tempPreviewImage.contentType
            };

            record.tempPreviewImage = null;

            record.save();

            return page.jsonResult(true, 'cropped', '/_hashes/files/' + newHash);
        }
    };

    g._removePreview = function (page) {
        var record = page.attributes.dealName;

        record.remove('previewImage');

        record.save();

        return page.jsonResult(true);
    };

    g._deleteDeal = function (page) {
        var record = page.attributes.dealName;
        log.info('delete deal - {}', record);
        record.delete();
        return page.jsonResult(true);
    };

    g._uploadFiles = function (page, params, files) {
        //log.info('_handleUploadFiles params={} - files={}', params, files.get('file'));

        var record = page.attributes.dealName;
        var rfiles = record.files;
        if (isNull(rfiles)) {
            rfiles = formatter.newArrayList();
            record.files = rfiles;
        }

        if (params.containsKey('overwrite')) {
            var file = files.get('file');
            log.info('file uploaded {}', file)
            var hash = fileManager.uploadFile(file);
            var hashExisted = false;
            for (var i = 0; i < rfiles.length; i++) {
                var f = rfiles[i];
                if (f.hash === hash) {
                    log.info('hash {} hash {}', f.hash, hash);
                    hashExisted = true;
                    break;
                }
            }
            if (!hashExisted) {
                rfiles.add({
                    name: file.name,
                    hash: hash,
                    contentType: file.contentType,
                    createdDate: formatter.formatDateISO8601(formatter.now)
                });
            }

            record.files = rfiles;
            record.save();
            log.info('files hereeeeeeeeeeee {}', record.files);
            return page.jsonResult(true, 'uploaded', '/_hashes/files/' + hash);
        }
    };

    g._removeFiles = function (page, params) {
        var record = page.attributes.dealName;
        var rfiles = record.files;
        var fileName = params.removeFiles;
        var index = -1;
        if (Utils.isStringNotBlank(fileName)) {
            for (var i = 0; i < rfiles.length; i++) {
                var f = rfiles[i];
                if (f.name === fileName) {
                    index = i;
                    break;
                }
            }
        }
        if (index > -1) {
            rfiles.remove(index);
        }
        record.files = rfiles;
        record.save();
        return page.jsonResult(true, 'Successfully deleted ' + fileName);
    };

    g._duplicateDeal = function (page) {
        var db = g._getOrCreateUrlDb(page);
        var record = page.attributes.dealName;
        log.info('duplicate deal - {}', record);

        var json = JSON.parse(record.json);
        var newTitle = json.title + " DUPLICATED";
        
        var count = 1;
        var uniqueTitle = newTitle;
        var uniqueName = replaceYuckyChars(newTitle);
        while (Utils.isNotNull(db.child(g._config.RECORD_NAMES.DEAL(uniqueName)))) {
            uniqueTitle = newTitle + '-' + count;
            uniqueName = replaceYuckyChars(uniqueTitle);
            count++;
        }
        
        var curUser = securityManager.currentUser;
        if (Utils.isNotNull(curUser)) {
            json.createdBy = curUser.name;
        }
        json.title = uniqueTitle;
        json.name = uniqueName;
        json.published = false;

        db.createNew(g._config.RECORD_NAMES.DEAL(uniqueName), JSON.stringify(json), g._config.RECORD_TYPES.DEAL);

        return page.jsonResult(true, 'Updated', '/travelDeals/' + uniqueName + '/');
    };

    g._gotoEditor = function (page) {
        var record = page.attributes.dealName;

        if (Utils.isStringNotBlank(record.jsonObject.website)) {
            var currentUser = securityManager.currentUser.profile;
            var loginToken = securityManager.generateLoginToken(record.jsonObject.website, true, currentUser);

            var app = applications.get("TravelDeals");
            var rootPath = app.getSetting('rootPath');
            if (Utils.isStringBlank(rootPath)) {
                rootPath = 'ourDeals';
            }

            var website = formatter.asWebsite(record.jsonObject.website);

            //var redirectURL = 'http://' + formatter.getDomainName(website, true) + '/' + rootPath + '/' + record.jsonObject.name + '/contenteditor?useHash=true&' + loginToken;
            var redirectURL = 'http://' + formatter.getDomainName(website, true) + '/' + rootPath + '/' + record.jsonObject.name + '/contenteditor?useHash=true';

            return views.redirectView(redirectURL);
        }
    };
})(this);