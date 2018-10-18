function kredirectResolver(rf, groupName, groupVal, mapOfGroups) {
    log.info('kredirectResolver > {} {} {} {}', rf, groupName, groupVal, mapOfGroups);
    var website = rf.websiteName;
    var path = '/' + groupVal;
    var id = [website, path].join('@');
    log.info('id {}', id);
    var recordId = encodeURIComponent(id);
    var db = getDB(rf);
    var record = db.child(recordId);
    return record;
}

function redirectUrl(page, params) {
    if (page.attributes.kredirect && page.attributes.kredirect.status && page.attributes.kredirect.targetUrl){
        // 301 Moved Permanently
        return views.redirectView(page.attributes.kredirect.targetUrl, true);
    }
}

function findRecord(page, id) {
    var recordId = encodeURIComponent(id);
    var db = getDB(page);
    var record = db.child(recordId);
    return record;
}