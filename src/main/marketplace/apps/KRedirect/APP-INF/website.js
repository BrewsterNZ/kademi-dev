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
    if (page.attributes.kredirect){
        // 301 Moved Permanently
        return views.redirectView(page.attributes.kredirect.targetUrl, true);
    }
}