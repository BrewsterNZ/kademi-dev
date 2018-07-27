/* global controllerMappings, views, applications, formatter */

(function (g) {
    /* Travel Deal Preview Image Controller */
    var previewImageController = controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(true)
            .pathSegmentName('previewImage')
            .addMethod('GET', '_viewDealPreviewImage');

    /* Travel Deal Banner Image Controller */
    var bannerImageController = controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(true)
            .pathSegmentName('bannerImage')
            .addMethod('GET', '_viewDealBannerImage');

    /* Travel Deal Content Editor Controller */
    var contentEditorController = controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(false)
            .pathSegmentName('contenteditor')
            .addType("editor")
            .defaultView(views.contentEditorView())
            .addMethod('GET', '_editTravelDeal')
            .addMethod('POST', '_saveDescription')
            .addType("html")
            .postPriviledge('WRITE_CONTENT');

    /* Travel Deal Controller */
    var travelDealMapping = controllerMappings
            .websiteController()
            .enabled(true)
            .isPublic(true)
            .mountRepository(g._config.REPO_NAME)
            .pathSegmentResolver('dealName', '_resolveDealName')
            .defaultView(views.templateView('/theme/apps/travelDeals/viewTravelDeal.html'))
            .title(function (page) {
                return page.attributes.dealName.jsonObject.title;
            })
            .seoContent('_genDealSeoContent')
            .addMethod('GET', '_viewTravelDeal')
            .addMethod('POST', '_saveDescription', 'body')
            .addMethod('POST', '_enquireDeal')
            .postPriviledge('READ_CONTENT')
            .child(previewImageController)
            .child(bannerImageController)
            .child(contentEditorController);

    /* Root Controller */
    controllerMappings
            .websiteController()
            .isPublic(true)
            .enabled(true)
            .pathSegmentResolver('rootPath', '_resolveDynamicUrl')
            .defaultView(views.templateView('/theme/apps/travelDeals/viewTravelDeals.html'))
            .addMethod('GET', '_viewTravelDeals')
            .child(travelDealMapping)
            .build();
    /**
     *
     * @param {type} page
     * @param {type} params 
     * @returns {JsonResult}
     */
    g._viewTravelDeals = function (page, params) {
        var result = g.getTravelDeals(page, params);

        page.attributes.deals = result.deals;
        page.attributes.categories = result.categories;
    };

    g._viewTravelDeal = function (page, params) {
        var db = _getOrCreateUrlDb(page);

        var record = page.attributes.dealName;

        var json = record.jsonObject;
        if (isNotBlank(json.category)) {
            var category = json.category;

            var now = formatter.formatDate(formatter.now);

            var q = {
                "stored_fields": ["name", "title", "cost", "brief", "daysIncluded", "category"],
                "size": 4,
                "sort": {
                    "startDate": {
                        "order": "desc"
                    }
                },
                query: {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "published": "true"
                                }
                            },
                            {
                                "term": {
                                    "category": category
                                }
                            },
                            {
                                "range": {
                                    "startDate": {
                                        "lte": now
                                    }
                                }
                            },
                            {
                                "range": {
                                    "bookByDate": {
                                        "gte": now
                                    }
                                }
                            },
                            {
                                "type": {
                                    "value": g._config.RECORD_TYPES.DEAL
                                }
                            }
                        ],
                        "must_not": [
                            {
                                "term": {
                                    "name": json.name
                                }
                            }
                        ]
                    }
                }
            };

            page.attributes.related = db.search(JSON.stringify(q)).hits.hits;
        }
    };

    g._enquireDeal = function (page, params) {
        var record = page.attributes.dealName;
        var wrf = page.closest('websiteVersion');
        var orgData = wrf.orgData;

        var recaptchaApp = applications.GoogleRecaptcha;
        if (isNotNull(recaptchaApp)) {
            var isValid = recaptchaApp.verify(wrf, params);
            if (!isValid) {
                return page.jsonResult(false, 'Invalid Captcha');
            }
        }


        var email = safeString(params.email);
        email = email.toLowerCase();
        params.email = email;

        /* Locate a profile or create it*/
        var profileBean = orgData.findProfile(email);
        if (Utils.isNull(profileBean)) {
            var mb = orgData.createMembership(null, email, orgData, 'dealEnquires');
            profileBean = mb.profile();
            log.info('Created a profile: {}', profileBean);
        } else {
            log.info('Located a profile: {}', profileBean);
        }

        var db = securityManager.runAsUser(profileBean, function () {
            return _getOrCreateUrlDb(page);
        });

        var enquiry = populateExtraFields(params, {
            deal: record.name,
            enquireDate: formatter.formatDateISO8601(formatter.now)
        });

        var enquiryRecord = securityManager.runAsUser(profileBean, function () {
            return db.createNew(_config.RECORD_NAMES.ENQUIRY(), JSON.stringify(enquiry), _config.RECORD_TYPES.ENQUIRY);
        });

        var attributes = formatter.newMap();
        attributes.put('enquiry', enquiryRecord);
        attributes.put('deal', record);

        eventManager.fireTrigger(profileBean, wrf.websiteName, 'receivedEnquiry', attributes);
        eventManager.goalAchieved('travelDealReceivedEnquiryGoal', profileBean, attributes);

        return page.jsonResult(true, 'Thank you for your enquiry, We will contact you shortly.');
    };

    g._genDealSeoContent = function (page, seoBean) {
        var record = page.attributes.dealName;
        var json = record.jsonObject;

        // Get base URL
        var baseUrl = formatter.getBaseWebsiteUrl();

        // Get the description
        var desc = Utils.safeString(formatter.textFromHtml(json.brief));
        if (Utils.isStringBlank(desc)) {
            desc = Utils.safeString(formatter.textFromHtml(json.title));
        }

        // Get the keywords
        var keywords = [];
        if (Utils.isNotNull(json.tags)) {
            for (var i = 0; i < json.tags.length; i++) {
                var tagTitle = g.getTagTitle(page, json.tags[i]);
                if (Utils.isStringNotBlank(tagTitle)) {
                    keywords.push(tagTitle);
                }
            }
        }
        if (Utils.isStringNotBlank(json.category)) {
            var cat = g.getCategoryTitle(page, json.category);
            if (Utils.isStringNotBlank(cat)) {
                keywords.push(cat);
            }
        }


        seoBean
                .withDescription(desc)
                .withKeywords(keywords)
                .withCanonical(baseUrl + page.href);
    };

    g._viewDealPreviewImage = function (page) {
        var record = page.attributes.dealName;

        var json = record.jsonObject;

        if (isNotNull(json.previewImage)) {
            return views.fileView(json.previewImage.hash, json.previewImage.contentType);
        }

        return views.redirectView('/theme/apps/travelDeals/noimg-360-232.png');
    };

    g._viewDealBannerImage = function (page) {
        var record = page.attributes.dealName;

        var json = record.jsonObject;

        if (isNotNull(json.bannerImage)) {
            return views.fileView(json.bannerImage.hash, json.bannerImage.contentType);
        }

        return views.redirectView('/theme/apps/travelDeals/noimg-900-300.png');
    };

    g._editTravelDeal = function (page, params) {
        g._viewTravelDeal(page, params);

        page.attributes.editFile = {
            title: page.attributes.dealName.jsonObject.title,
            body: page.attributes.dealName.jsonObject.description
        };
    };

    g._saveDescription = function (page, params) {
        var record = page.attributes.dealName;
        var description = params.body;

        record.description = description;
        record.save();

        return page.jsonResult(true);
    };
})(this);