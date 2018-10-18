function getAllRedirects(page, params) {
    var db = getDB(page);
    var records = db.findByType("record");
    page.attributes.records = records;
}

function saveRecord(page, params) {
    log.info('saveRecord {} {}', page, params);
    var db = getDB(page);
    var sourceUrl = params.sourceUrl;
    var targetUrl = params.targetUrl;
    var website = params.website;
    var notes = params.notes;

    var result;
    if (sourceUrl && targetUrl && website){
        // Find existing source
        var recordId = [website, sourceUrl].join('-');
        var existing = db.child(recordId);
        if (existing){
            // found, so just update record
            existing.targetUrl = targetUrl;
            existing.save();
            result = views.jsonResult(true, "Updated");
        } else {
            // Should create new record
            var curUSer = securityManager.currentUser;
            var json = {
                sourceUrl: sourceUrl,
                targetUrl: targetUrl,
                website: website,
                notes: notes,
                status: true,
                createdDate: Date.now(),
                modifiedDate: Date.now(),
                createdBy: curUSer.userId,
                modifiedBy: curUSer.userId
            }

            db.createNew(recordId, JSON.stringify(json), 'record');
            result = views.jsonResult(true, "Created");
        }
    } else {
        result = views.jsonResult(false, "Missing params");
    }

    return result;
}


