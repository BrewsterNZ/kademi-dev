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
        var recordId = [website, sourceUrl].join('@');
        recordId = encodeURIComponent(recordId);
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


function deleteRecord(page, params) {
    log.info('deleteRecord {}', params.deleteRecord);
    var arr = params.deleteRecord.split(',');
    var db = getDB(page);
    for (var i in arr){
        var id = arr[i];
        var res = db.child(id);
        if (res){
            res.delete();
        }
    }
    return views.jsonResult(true);
}


