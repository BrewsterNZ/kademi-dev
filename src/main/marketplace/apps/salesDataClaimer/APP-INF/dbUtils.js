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
        saveMapping(db);
    } catch (e) {
        result.status = false;
        result.messages = ['Error in updating mapping: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result))
}

function saveMapping(db) {
    log.info('saveMapping');

    var mapBuilder = formatter.newMapBuilder();
    for (var name in DB_MAPPINGS) {
        mapBuilder.field(name, JSON.stringify(DB_MAPPINGS[name]));
    }

    db.updateTypeMappings(mapBuilder);
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
