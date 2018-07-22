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

function getLastClaimGroupId(page) {
    var queryJson = {
        "stored_fields": [
            "claimGroupId"
        ],
        "size": 1,
        "sort": [
            {
                "enteredDate": "desc"
            }
        ],
        "query": {
            "bool": {
                "must": [
                    {"type": {"value": TYPE_CLAIM_GROUP}}
                ]
            }
        }
    };
    
    searchResult = doDBSearch(page, queryJson);
    
    log.info("getLastClaimGroupId {}", searchResult);
    
    if (searchResult.hits.hits.length > 0) {
        return searchResult.hits.hits[0].fields.claimGroupId.value;
    } else {
        return null;
    }
}

function getSearchClaimsQuery(page, status, user, claimForm) {
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
            'productSku',
            'claimGroupId',
            'ocrFileHash'
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

    if (isNotBlank(claimForm)) {
        queryJson.query.bool.must.push({
            'term': {'claimGroupId': claimForm}
        });
    }    
    
    return queryJson;
}

function getSearchClaimItemsQuery(page, claimRecordId, user) {
    var queryJson = {
        'stored_fields': [
            'recordId',
            'claimRecordId',
            'soldDate',
            'soldBy',
            'soldById',
            'modifiedDate',
            'amount',
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
                    {'type': {'value': TYPE_CLAIM_ITEM}}
                ]
            }
        }
    };

    if (claimRecordId) {
        queryJson.query.bool.must.push({
            'term': {'claimRecordId': claimRecordId}
        });
    }

    if (user) {
        queryJson.query.bool.must.push({
            'term': {'soldBy': user.name}
        });
    }
    
    return queryJson;
}

function getSearchClaimGroupsQuery(page, claimForm) {
    var queryJson = {        
        'size': 10000,        
        'query': {
            'bool': {
                'must': [
                    {'type': {'value': TYPE_CLAIM_GROUP}}
                ]
            }
        }
    };

    if (isNotBlank(claimForm)) {
        queryJson.query.bool.must.push({
            'term': {'claimGroupId': claimForm}
        });
    }
    
    return queryJson;
}

function totalAmountOfClaims(page, status, user) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimItemsQuery(page, null, user);
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

function searchClaims(page, status, user, claimForm) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimsQuery(page, status, user, claimForm);
        searchResult = doDBSearch(page, queryJson);
    } catch (e) {
        if(e instanceof Error) {
            log.error('ERROR in searchClaims: {}', e.stack);   
        } else {
            log.error('ERROR in searchClaims: {}', e, e);
        }
    }
    log.info("searchClaims {}", searchResult);
    return searchResult;
}

function searchClaimItems(page, claimRecordId, user) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimItemsQuery(page, claimRecordId, user);
        searchResult = doDBSearch(page, queryJson);
    } catch (e) {
        log.error('ERROR in searchClaimItems: ' + e, e);
    }
    log.info("searchClaimItems {}", searchResult);
    return searchResult;
}

function searchClaimGroups(page, claimGroup) {
    var searchResult = null;

    try {
        var queryJson = getSearchClaimGroupsQuery(page, claimGroup);
        log.info(queryJson)
        searchResult = doDBSearch(page, queryJson);
    } catch (e) {
        log.error('ERROR in searchClaimGroups: ' + e, e);
    }
    log.info("searchClaimGroups {}", searchResult);
    return searchResult;
}

function getClaimItems(page, params){
    log.info('getClaimItems > page={}, params={}', page, params);
    
    var result = {
        status: true
    };
    
    try {
        var queryJson = getSearchClaimItemsQuery(page, page.attributes.claimId);
        var searchResult = doDBSearch(page, queryJson);
        
        result.data = searchResult.toString();
    } catch(e) {
        result.status = false;
        result.messages = ['Error when getting claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result));
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

function getClaimOCRFile(page, params) {
    log.info('getClaimOCRFile > page={}, params={}', page, params);
    
    var result = {
        status: true,
        hash: params.hash
    };
    
    var OCRFileByteArray = fileManager.getAsByteArray(params.hash);
     
    var OCRFileXML = formatter.format(OCRFileByteArray);
    
    log.info('OCRFileXML: {}', OCRFileXML);
    
    result.OCRFileXML = OCRFileXML;
     
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
