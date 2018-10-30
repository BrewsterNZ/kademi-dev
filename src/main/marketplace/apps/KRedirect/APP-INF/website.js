function kredirectResolver(rf, groupName, groupVal, mapOfGroups) {
    log.info('kredirectResolver > {} {} {} {}', rf, groupName, groupVal, mapOfGroups);
    var excludes = ['.css', '.js', '.png', '.jpg', '.ico', '.map', '.ttf', '.otf', '.woff2', '.woff', '.eot', '.svg', '.cur'];
    var shouldCheck = true;
    for (var i in excludes) {
        if (groupVal.indexOf(excludes[i]) != -1) {
            shouldCheck = false;
            break;
        }
    }
    if (shouldCheck) {
        var website = rf.websiteName;
        var path = '/' + groupVal;
        var id = [website, path].join('@');
        log.info('id {}', id);
        var recordId = encodeURIComponent(id);
        var db = getDB(rf);
        var record = db.child(recordId);
        log.info('record {}', record);
        return record;
    }
    return null;
}

function redirectUrl(page, params) {
    var kredirect = page.attributes.kredirect;
    if (kredirect && kredirect.status && kredirect.targetUrl) {
        // 301 Moved Permanently
        return views.redirectView(kredirect.targetUrl, true);
    }
}

function findRecord(page, id) {
    var recordId = encodeURIComponent(id);
    var db = getDB(page);
    var record = db.child(recordId);
    return record;
}