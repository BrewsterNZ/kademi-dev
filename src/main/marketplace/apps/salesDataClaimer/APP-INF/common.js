function uploadFile(page, params, files) {
    log.info('uploadFile > page {} params {} files {}', page, params, files);

    var result = [];

    if (files !== null || !files.isEmpty()) {
        var filesArray = files.entrySet().toArray();

        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i].getValue();
            var fileHash = fileManager.uploadFile(file);

            result.push({
                fileName: fileHash,
                type: file.contentType,
                size: file.size,
                uploaded: new Date(),
                hash: fileHash
            });
        }
    }

    return result;
}

function getSearchClaimsQuery(page, status, user) {
    var queryJson = {
        'stored_fields': [
            'receipt',
            'recordId',
            'soldDate',
            'soldBy',
            'soldById',
            'enteredDate',
            'modifiedDate',
            'amount',
            'status',
            'productSku'
        ],
        'size': 10000,
        'sort': [
            {
                'soldDate': 'desc'
            }
        ],
        'query': {
            'bool': {
                'must': [
                    {'type': {'value': TYPE_RECORD}}
                ]
            }
        }
    };

    if (user) {
        queryJson.query.bool.must.push({
            'term': {'soldBy': user.name}
        });
    }

    if (isNotBlank(status) && !isNaN(status)) {
        queryJson.query.bool.must.push({
            'term': {'status': +status}
        });
    }
    return queryJson;
}

function totalAmountOfClaims(page, status, user) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimsQuery(page, status, user);
        queryJson.aggregations = {
            "total": {
                "sum": {
                    "field": "amount"
                }
            }
        };

        searchResult = doDBSearch(page, queryJson);
    } catch (e) {
        log.error('ERROR in totalAmountOfClaims: ' + e, e);
    }
    log.info("totalAmountOfClaims {}", searchResult);
    return searchResult;
}

function searchClaims(page, status, user) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimsQuery(page, status, user);
        searchResult = doDBSearch(page, queryJson);
    } catch (e) {
        log.error('ERROR in searchClaims: ' + e, e);
    }
    log.info("searchClaims {}", searchResult);
    return searchResult;
}

function getClaim(page, params) {
    log.info('getClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    try {
        var db = getDB(page);
        var claim = db.child(page.attributes.claimId);

        if (claim !== null) {
            result.data = claim.jsonObject + '';
        } else {
            result.status = false;
            result.messages = ['This claim does not exist'];
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error when getting claim: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function deleteClaims(page, params) {
    log.info('deleteClaims > page={}, params={}', page, params);

    var result = {
        status: true
    };

    try {
        var db = getDB(page);
        var ids = params.ids;
        ids = ids.split(',');

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null && +claim.jsonObject.status === RECORD_STATUS.NEW) {
                    claim.delete();
                }
            })(ids[i]);
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error in deleting: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result))
}

function getSalesDataExtreFields(page) {
    var extraFields = [];    
    var settings = getAppSettings(page);
    if( settings != null ) {
        var selectedDataSeries = settings.get('dataSeries');

        if (isNotNull(selectedDataSeries)) {
            extraFields = applications.salesData.getDataSeriesExtraFields(selectedDataSeries);
        }
    }

    return extraFields;
}
