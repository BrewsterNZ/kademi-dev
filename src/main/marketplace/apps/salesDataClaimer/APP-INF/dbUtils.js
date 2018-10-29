function getDB(page) {
    log.info('getDB > page={}', page);

    var jsonDB = page.find('/jsondb/');
    if (isNull(jsonDB)) {
        page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }

    var db = jsonDB.child(DB_NAME);

    if (isNull(db)) {
        db = jsonDB.createDb(DB_NAME, DB_TITLE, DB_NAME);
        saveMapping(db);
    }

    if (!db.allowAccess) {
        setAllowAccess(db, true);
    }

    return db;
}

function updateMapping(page, params) {
    log.info('updateMapping > page={}, prams={}', params);

    var result = {
        status: true
    };

    try {
        var db = getDB(page);
        saveMapping(db, page);
    } catch (e) {
        result.status = false;
        result.messages = ['Error in updating mapping: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result))
}

function saveMapping(db, page) {
    log.info('saveMapping');

    var mapBuilder = formatter.newMapBuilder();
    for (var name in DB_MAPPINGS) {
        if (page && name == TYPE_RECORD){
            var customMapping = getExtraFieldsMappping(page);
            if (Object.keys(customMapping).length){
                for (var key in customMapping){
                    DB_MAPPINGS[name].properties[key] = customMapping[key];
                }
            }
        }
        mapBuilder.field(name, JSON.stringify(DB_MAPPINGS[name]));
    }

    db.updateTypeMappings(mapBuilder);
}

function getExtraFieldsMappping(page) {
    var extraFields = getSalesDataExtreFields(page);
    var arr = {};
    for (var i = 0; i < extraFields.length; i++) {
        var ex = extraFields[i];
        var fieldName = 'field_' + ex.name;
        var type = ex.type;
        log.info('field name={} type={}', ex.name, ex.type);
        arr[fieldName] = {
            type: type || 'text',
            store: true
        }
    }
    return arr;
}

function setAllowAccess(db, allowAccess) {
    transactionManager.runInTransaction(function () {
        db.setAllowAccess(allowAccess);
    });
}

function doDBSearch(page, queryJson) {
    log.info('doDBSearch > page={}', page);

    var db = getDB(page);
    var queryString = JSON.stringify(queryJson);
    log.info('query={}', queryString);

    var searchResult = db.search(queryString);
    if (isNull(searchResult)) {
        log.info('searchResult=null');
    } else {
        // log.info('searchResult={}', searchResult);
    }

    return searchResult;
}
