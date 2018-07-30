/* global formatter, log, _config, Utils, http, fileManager, applications */

(function (g) {
    g.getDealStatus = function (deal) {
        var fields = deal.fields;
        var isPublished = isNotNull(fields.published) ? safeBoolean(fields.published.value) : false;
        var startDate = formatter.parseDate(fields.startDate.value);
        var bookByDate = isNotNull(fields.bookByDate) ? formatter.endofDay(formatter.parseDate(fields.bookByDate.value)) : null;
        var now = formatter.now;
        var endOfYesterday = formatter.parseDate(formatter.formatDate(now));
        var endOfToday = formatter.endofDay(now);

        var hasStarted = endOfYesterday.compareTo(startDate) >= 0;
        var hasEnded = isNotNull(bookByDate) ? endOfToday.compareTo(bookByDate) > 0 : false;

        if (!isPublished) {
            return "Draft";

        } else {
            if (hasStarted) {
                if (hasEnded) {
                    return "Expired";
                } else {
                    return "Active";
                }
            } else if (!hasStarted) {
                return "Published";
            }
        }

        return "Unknown";
    };

    g.generateDealStatus = function (deal) {
        var status = getDealStatus(deal);

        var icon = "";
        switch (status) {
            case "Draft":
            {
                icon = "fa-pencil-square text-muted";
                break;
            }
            case "Published":
            {
                icon = "fa-check-circle text-muted";
                break;
            }
            case "Active":
            {
                icon = "fa-check-circle text-success";
                break;
            }
            case "Expired":
            {
                icon = "fa-times-circle text-danger";
                break;
            }
        }

        return '<td class="icon" title="' + status + '">'
                + '    <i class="fa ' + icon + '"></i>'
                + '</td>';
    };

    g.generateFileIcon = function (fileName) {
        var fileExt = Utils.safeString(formatter.fileExt(fileName)).toLowerCase();

        var icon = g.getClassNameForFileExtension(fileExt);

        return icon;
    };

    g.getCategory = function (page, catName) {
        if (Utils.isNull(catName) || Utils.isStringBlank(catName)) {
            return null;
        }

        var db = _getOrCreateUrlDb(page);

        return  db.child(_config.RECORD_NAMES.CATEGORY(catName));
    };

    g.getCategoryTitle = function (page, catName) {
        var cat = g.getCategory(page, catName);
        if (Utils.isNull(cat)) {
            return null;
        }

        return cat.jsonObject.title;
    };

    g.getTag = function (page, tagName) {
        if (Utils.isStringBlank(tagName)) {
            return null;
        }
        var db = _getOrCreateUrlDb(page);

        return  db.child(_config.RECORD_NAMES.TAG(tagName));
    };

    g.getTagTitle = function (page, tagName) {
        var tag = g.getTag(page, tagName);

        if (Utils.isNull(tag)) {
            return null;
        }

        return tag.jsonObject.title;
    };

    g.getAllTags = function (page) {
        var db = _getOrCreateUrlDb(page);

        var tags = db.findByType(_config.RECORD_TYPES.TAG);

        return tags;
    };

    g.bannerImageDimensions = function () {
        var app = applications.get('TravelDeals');

        var bannerImageDimensions = app.getSetting('bannerImageDimensions');

        if (Utils.isStringNotBlank(bannerImageDimensions)) {
            return bannerImageDimensions;
        }

        return g._config.DEFAULT_BANNER_DIMENSIONS;
    };

    g.previewImageDimensions = function () {
        var app = applications.get('TravelDeals');

        var previewImageDimensions = app.getSetting('previewImageDimensions');

        if (Utils.isStringNotBlank(previewImageDimensions)) {
            return previewImageDimensions;
        }

        return g._config.DEFAULT_PREVIEW_DIMENSIONS;
    };

    g.allDeals = function (page) {
        var db = _getOrCreateUrlDb(page);

        var now = formatter.now;
        var startOfDay = formatter.startOfDay(now);
        var endofDay = formatter.endofDay(now);

        var q = {
            "stored_fields": ["name"],
            size: 1000,
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
                            "range": {
                                "startDate": {
                                    "lte": formatter.formatDate(startOfDay),
                                    "time_zone": "Pacific/Auckland"
                                }
                            }
                        },
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "range": {
                                            "bookByDate": {
                                                "gte": formatter.formatDate(endofDay.time),
                                                "time_zone": "Pacific/Auckland"
                                            }
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": [
                                                {
                                                    "exists": {
                                                        "field": "bookByDate"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "type": {
                                "value": _config.RECORD_TYPES.DEAL
                            }
                        }
                    ]
                }
            },
            "aggregations": {
                "categories": {
                    "terms": {
                        "field": "category"
                    }
                }
            }
        };

        return db.search(JSON.stringify(q));
    };

    g.latestDeals = function (page, size, featuredOnly) {
        log.info('latestDeals Page={} | Size={}', page, size);

        var results = [];
        var db = _getOrCreateUrlDb(page);

        if (Utils.isNull(db)) {
            return results;
        }

        var now = formatter.now;
        var startOfDay = formatter.startOfDay(now);
        var endofDay = formatter.endofDay(now);

        var es = {
            "_source": ["*"],
            "query": {
                "bool": {
                    "must": [
                        {
                            "type": {
                                "value": _config.RECORD_TYPES.DEAL
                            }
                        },
                        {
                            "term": {
                                "published": "true"
                            }
                        },
                        {
                            "range": {
                                "startDate": {
                                    "lte": formatter.formatDate(startOfDay),
                                    "time_zone": "Pacific/Auckland"
                                }
                            }
                        },
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "range": {
                                            "bookByDate": {
                                                "gte": formatter.formatDate(endofDay.time),
                                                "time_zone": "Pacific/Auckland"
                                            }
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": [
                                                {
                                                    "exists": {
                                                        "field": "bookByDate"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            "sort": {
                "startDate": {
                    "order": "desc"
                }
            }
        };

        if (Utils.isNotNull(size) && size >= 0) {
            es["size"] = Utils.safeInt(size);
        }

        if (Utils.safeBool(featuredOnly)) {
            es.query.bool.must.push({
                "bool": {
                    "minimum_should_match": 1,
                    "should": [
                        {
                            "term": {
                                "featured": false
                            }
                        },
                        {
                            "bool": {
                                "must_not": [
                                    {
                                        "exists": {
                                            "field": "featured"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            });
        }

        var resp = db.search(JSON.stringify(es));

        if (Utils.isNotNull(resp)) {
            var respJson = JSON.parse(resp.toString());

            for (var i = 0; i < respJson.hits.hits.length; i++) {
                results.push(respJson.hits.hits[i]._source);
            }
        }

        return results;
    };

    g.getTravelDeals = function (page, params) {
        var db = _getOrCreateUrlDb(page);
        var params = params;

        if (Utils.isNull(params)) {
            if (Utils.isNotNull(http.request)) {
                params = http.request.params;
            }

            if (Utils.isNull(params)) {
                params = {};
            }
        }

        var versionedSite = false;

        var website = page.closest('website');
        if (Utils.isNotNull(website)) {
            versionedSite = page.closest('website').versioned;
        }

        var queryString = Utils.safeString(params.q);
        var tagsList = Utils.safeArray(params.tags);
        var categoryList = Utils.safeArray(params.categories);
        var startAt = Utils.safeInt(params.startAt);
        var fetchCount = Utils.safeInt(params.fetchCount);
        var orderBy = Utils.safeArray(params.orderBy, '-');

        if (startAt < 1) {
            startAt = 0;
        }

        if (fetchCount < 1) {
            fetchCount = 100;
        }

        var now = formatter.now;
        var startOfDay = formatter.startOfDay(now);
        var endofDay = formatter.endofDay(now);

        var q = {
            "_source": true,
            "size": fetchCount,
            "from": startAt,
            "sort": {
                "startDate": {
                    "order": "desc"
                }
            },
            "query": {
                "bool": {
                    "must": [
                        {
                            "range": {
                                "startDate": {
                                    "lte": formatter.formatDate(startOfDay),
                                    "time_zone": "Pacific/Auckland"
                                }
                            }
                        },
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "range": {
                                            "bookByDate": {
                                                "gte": formatter.formatDate(endofDay.time),
                                                "time_zone": "Pacific/Auckland"
                                            }
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": [
                                                {
                                                    "exists": {
                                                        "field": "bookByDate"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "type": {
                                "value": "DEAL"
                            }
                        }
                    ]
                }
            },
            "aggregations": {
                "categories": {
                    "terms": {
                        "field": "category"
                    }
                }
            }
        };

        if (!versionedSite) {
            q.query.bool.must.push({
                "term": {
                    "published": "true"
                }
            });
        }

        if (Utils.isStringNotBlank(queryString)) {
            q.query.bool.must.push({
                "bool": {
                    "minimum_should_match": 1,
                    "should": [
                        {
                            "common": {
                                "title": {
                                    "query": queryString
                                }
                            }
                        },
                        {
                            "common": {
                                "brief": {
                                    "query": queryString
                                }
                            }
                        },
                        {
                            "common": {
                                "description": {
                                    "query": queryString
                                }
                            }
                        },
                        {
                            "multi_match": {
                                "query": queryString,
                                "type": "phrase_prefix",
                                "fields": ["title", "brief", "message"]
                            }
                        }
                    ]
                }
            });
        }

        if (Utils.isNotNull(tagsList) && tagsList.length > 0) {
            var newTagsList = [];

            for (var i = 0; i < tagsList.length; i++) {
                var s = Utils.safeString(tagsList[i]).toLowerCase();
                if (Utils.isStringNotBlank(s)) {
                    newTagsList.push(s);
                }
            }

            if (newTagsList.length > 0) {
                q.query.bool.must.push({
                    "terms": {
                        "tags": newTagsList
                    }
                });
            }
        }

        if (Utils.isNotNull(categoryList) && categoryList.length > 0) {
            var newCategoryList = [];

            for (var i = 0; i < categoryList.length; i++) {
                var s = Utils.safeString(categoryList[i]).toLowerCase();
                if (Utils.isStringNotBlank(s)) {
                    newCategoryList.push(s);
                }
            }

            if (newCategoryList.length > 0) {
                q.query.bool.must.push({
                    "terms": {
                        "category": newCategoryList
                    }
                });
            }
        }

        if (Utils.isNotNull(orderBy) && orderBy.length === 2) {
            var dir = orderBy[0];
            var field = orderBy[1];

            if (dir !== 'asc' && dir !== 'desc') {
                dir = 'asc';
            }

            var sortBy = {};
            sortBy[field] = {"order": dir};

            q.sort = sortBy;
        }

        var result = db.search(JSON.stringify(q));
        var catBuckets = result.aggregations.get('categories').buckets;

        var categories = formatter.newArrayList();

        for (var i in catBuckets) {
            var b = catBuckets[i];
            var cat = formatter.newMap();
            var catTitle = getCategoryTitle(page, b.key);
            cat.put('name', b.key);
            cat.put('title', catTitle);

            categories.add(cat);
        }

        categories = formatter.sortByProperty(categories, 'title');

        return {
            deals: result.hits.hits,
            categories: categories
        };
    };

    g.getCategories = function (page) {
        var db = _getOrCreateUrlDb(page);

        var versionedSite = false;

        var website = page.closest('website');
        if (Utils.isNotNull(website)) {
            versionedSite = page.closest('website').versioned;
        }

        var now = formatter.now;
        var startOfDay = formatter.startOfDay(now);
        var endofDay = formatter.endofDay(now);

        var q = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "range": {
                                "startDate": {
                                    "lte": formatter.formatDate(startOfDay),
                                    "time_zone": "Pacific/Auckland"
                                }
                            }
                        },
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "range": {
                                            "bookByDate": {
                                                "gte": formatter.formatDate(endofDay.time),
                                                "time_zone": "Pacific/Auckland"
                                            }
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": [
                                                {
                                                    "exists": {
                                                        "field": "bookByDate"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "type": {
                                "value": "DEAL"
                            }
                        }
                    ]
                }
            },
            "aggregations": {
                "categories": {
                    "terms": {
                        "field": "category"
                    }
                }
            }
        };

        if (!versionedSite) {
            q.query.bool.must.push({
                "term": {
                    "published": "true"
                }
            });
        }

        var result = db.search(JSON.stringify(q));
        var catBuckets = result.aggregations.get('categories').buckets;

        var categories = formatter.newArrayList();

        for (var i in catBuckets) {
            var b = catBuckets[i];
            var cat = formatter.newMap();
            var catTitle = getCategoryTitle(page, b.key);
            cat.put('name', b.key);
            cat.put('title', catTitle);
            cat.put('count', b.docCount);

            categories.add(cat);
        }

        return formatter.sortByProperty(categories, 'title');
    };
})(this);