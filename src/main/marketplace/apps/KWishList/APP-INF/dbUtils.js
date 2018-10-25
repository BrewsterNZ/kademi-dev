var DB_NAME = 'KWishListDb';
var DB_TITLE = 'KWishList DB';
var DB_MAPPINGS = {
    record: recordMapping,
};

function getDB(page) {
    log.info('getDB > page={}', page);

    var jsonDB = page.find('/jsondb/');
    if (formatter.isNull(jsonDB)) {
        page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }

    var db = jsonDB.child(DB_NAME);

    if (!db.allowAccess) {
        setAllowAccess(db, true);
    }

    return db;
}

function saveMapping(db) {
    log.info('saveMapping > db={}, typeName={}, mapping={}', db);

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
    // log.info('query={}', queryString);

    var searchResult = db.search(queryString);
    if (formatter.isNull(searchResult)) {
        log.info('searchResult=null');
    } else {
        // log.info('searchResult={}', searchResult);
    }

    return searchResult;
}
