/* global transactionManager, views, formatter, log, Utils, applications */

(function (g) {
    /**
     * This method gets called whenever the app get's enabled.
     * 
     * @param {OrganisationRootFolder} orf
     * @param {WebsiteRootFolder} wrf
     * @param {Boolean} enabled
     */
    g._onAppEnabled = function (orf, wrf, enabled) {
        // Get an instance of OrgData
        orgData = orf.orgData;

        // Make sure we have a JsonDB and the index is correct
        var db = g._getOrCreateUrlDb(orf);
        g._setAllowAccess(db, true);
        g._updateMappings(db);

        // Make sure we have the default group setup
        var defaultGroup = formatter.asGroup(g._config.DEFAULT_GROUP);
        if (Utils.isNull(defaultGroup)) {
            // We need to create one
            defaultGroup = orgData.createGroup(g._config.DEFAULT_GROUP);
        }
    };

    g._getOrCreateUrlDb = function (page) {
        var jsonDb = page.find('/jsondb');
        var db = jsonDb.child(g._config.DB_NAME);
        log.info("jsonDb = {} db = {}", jsonDb, db);
        if (isNull(db)) {
            db = jsonDb.createDb(g._config.DB_NAME, g._config.DB_TITLE, g._config.DB_NAME);

            _updateMappings(db);

            _setAllowAccess(db, true);
        }

        return db;
    };

    g._setAllowAccess = function (jsonDB, allowAccess) {
        transactionManager.runInTransaction(function () {
            jsonDB.setAllowAccess(allowAccess);
        });
    };

    g._checkRedirect = function (page, params) {
        var href = page.href;
        if (!href.endsWith('/')) {
            return views.redirectView(href + '/');
        }
    };

    g._updateMappings = function (db) {
        var b = formatter.newMapBuilder()
                .field(g._config.RECORD_TYPES.DEAL, JSON.stringify(dealMapping))
                .field(g._config.RECORD_TYPES.CATEGORY, JSON.stringify(categoryMapping))
                .field(g._config.RECORD_TYPES.ENQUIRY, JSON.stringify(enquiryMapping))
                .field(g._config.RECORD_TYPES.TAG, JSON.stringify(tagMapping));

        log.info('Update mappings for {} | {}', db, b);

        db.updateTypeMappings(b);
    };

    g._saveSettings = function (page, params) {
        var groupName = Utils.safeString(params.groupName);
        var rootPath = Utils.safeString(params.rootPath);
        var rootMenuTitle = Utils.safeString(params.rootMenuTitle);
        var categoryPath = Utils.safeString(params.categoryPath);
        var bannerImageDimensions = Utils.safeString(params.bannerImageDimensions);
        var previewImageDimensions = Utils.safeString(params.previewImageDimensions);

        // Check the group name!
        if (Utils.isStringBlank(groupName)) {
            groupName = g._config.DEFAULT_GROUP;
        }

        // Check the rootPath
        if (Utils.isStringBlank(rootPath)) {
            rootPath = g._config.DEFAULT_ROOT_PATH;
        }

        // Check Menu Item Title
        if (Utils.isStringBlank(rootMenuTitle)) {
            rootMenuTitle = g._config.DEFAULT_MENU_TITLE;
        }

        // Check the Category root path
        if (Utils.isStringBlank(categoryPath)) {
            categoryPath = g._config.DEFAULT_CATEGORYPATH;
        }

        // Check Banner Image Dimensions
        if (Utils.isStringBlank(bannerImageDimensions)) {
            bannerImageDimensions = g._config.DEFAULT_BANNER_DIMENSIONS;
        } else {
            // Parse the dimensions
            var parts = Utils.safeArray(bannerImageDimensions, 'x');
            if (parts.length < 2) {
                return false;
            } else {
                bannerImageDimensions = Utils.safeString(parts[0]) + 'x' + Utils.safeString(parts[1]);
            }
        }
        
        // Check Preview Image Dimensions
        if (Utils.isStringBlank(previewImageDimensions)) {
            previewImageDimensions = g._config.DEFAULT_PREVIEW_DIMENSIONS;
        } else {
            // Parse the dimensions
            var parts = Utils.safeArray(previewImageDimensions, 'x');
            if (parts.length < 2) {
                return false;
            } else {
                previewImageDimensions = Utils.safeString(parts[0]) + 'x' + Utils.safeString(parts[1]);
            }
        }

        page.setAppSetting(g._config.APP_ID, 'groupName', groupName);
        page.setAppSetting(g._config.APP_ID, 'rootPath', rootPath);
        page.setAppSetting(g._config.APP_ID, 'rootMenuTitle', rootMenuTitle);
        page.setAppSetting(g._config.APP_ID, 'categoryPath', categoryPath);
        page.setAppSetting(g._config.APP_ID, 'bannerImageDimensions', bannerImageDimensions);
        page.setAppSetting(g._config.APP_ID, 'previewImageDimensions', previewImageDimensions);

        return true;
    };

    /*==== Resolvers ====*/
    g._resolveDealName = function (rf, groupName, groupVal) {
        var db = _getOrCreateUrlDb(rf);

        var dealName = g._config.RECORD_NAMES.DEAL(groupVal);
        return db.child(dealName);
    };

    g._resolveCategory = function (rf, groupName, groupVal) {
        var db = _getOrCreateUrlDb(rf);

        var cat = g._config.RECORD_NAMES.CATEGORY(groupVal);

        return db.child(cat);
    };

    g._resolveDynamicUrl = function (rf, groupName, groupVal) {
        var app = applications.get('TravelDeals');

        var val = app.getSetting(groupName) || g._config.DEFAULT_PATHS[groupName];

        if (Utils.isStringNotBlank(val) && val === groupVal) {
            return val;
        }

        return null;
    };
})(this);

var dealMapping = {
    "properties": {
        "name": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "title": {
            "type": "text",
            "store": true,
            "fielddata": true,
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "store": true
                }
            }
        },
        "website": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "brief": {
            "type": "text",
            "store": true,
            "fielddata": true,
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "store": true
                }
            }
        },
        "description": {
            "type": "text",
            "store": true,
            "fielddata": true
        },
        "category": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "tags": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "cost": {
            "type": "double",
            "store": true
        },
        "featured": {
            "type": "boolean",
            "store": true
        },
        "createdDate": {
            "type": "date",
            "format": "dd/MM/yyyy HH:mm",
            "store": true
        },
        "createdBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "startDate": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        },
        "validBetweenStart": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        },
        "validBetweenEnd": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        },
        "blackoutConditions": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "externalReference": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "bookByDate": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        },
        "daysIncluded": {
            "type": "long",
            "store": true
        },
        "published": {
            "type": "boolean",
            "store": true
        },
        "tips": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "long",
                    "store": true
                },
                "order": {
                    "type": "long",
                    "store": true
                },
                "text": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        },
        "recommendedLinks": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "long",
                    "store": true
                },
                "order": {
                    "type": "long",
                    "store": true
                },
                "url": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "text": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        },
        "files": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "hash": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "contentType": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        },
        "previewImage": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "hash": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "contentType": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        },
        "bannerImage": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "hash": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "contentType": {
                    "type": "keyword",
                    "store": true,
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        }
    }
};

var categoryMapping = {
    "properties": {
        "name": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "title": {
            "type": "text",
            "store": true,
            "fielddata": true,
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "store": true
                }
            }
        }
    }
};

var tagMapping = {
    "properties": {
        "name": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "title": {
            "type": "text",
            "store": true,
            "fielddata": true,
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "store": true
                }
            }
        }
    }
};

var enquiryMapping = {
    "properties": {
        "deal": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "firstName": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "surName": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "email": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "mobile": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "landline": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "message": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "adults": {
            "type": "long",
            "store": true
        },
        "children": {
            "type": "long",
            "store": true
        },
        "enquireDate": {
            "type": "date",
            "store": true
        },
        "departureDate": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        },
        "returnDate": {
            "type": "date",
            "format": "dd/MM/yyyy",
            "store": true
        }
    }
};