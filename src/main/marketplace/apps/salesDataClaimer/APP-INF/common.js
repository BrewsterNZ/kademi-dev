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
        if (e instanceof Error) {
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

function getClaimItems(page, params) {
    log.info('getClaimItems > page={}, params={}', page, params);

    var result = {
        status: true
    };

    try {
        var queryJson = getSearchClaimItemsQuery(page, page.attributes.claimId);
        var searchResult = doDBSearch(page, queryJson);

        result.data = searchResult.toString();
    } catch (e) {
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

function createClaim(page, params, files) {
    log.info('createClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    var org = page.organisation;

    try {
        var currentRoles = securityManager.getRoles();
        log.info('currentRoles={}', currentRoles);

        var enteredUser = null;
        var db = getDB(page);
        var id = 'claim-' + generateRandomText(32);

        if (params.email) {
            log.info('Anonymous with email={}, firstName={}', params.email, params.firstName);
            enteredUser = applications.userApp.findUserResource(params.email);

            if (isNull(enteredUser)) {
                log.info('Create new user with email={}, firstName={}', params.email, params.firstName);
                enteredUser = securityManager.createProfile(page.organisation, params.email, null, null);
                enteredUser = applications.userApp.findUserResource(enteredUser);
                log.info('Created user: {}', enteredUser);
                page.parent.orgData.updateProfile(enteredUser.profile, params.firstName, enteredUser.surName, enteredUser.phone);
            } else {
                log.info('Found existing user for anonymous: {}', enteredUser);
            }

            log.info('Profile for anonymous: userName={}, userId={}', enteredUser.name, enteredUser.userId);
            obj.soldBy = enteredUser.name;
            obj.soldById = enteredUser.userId;
        } else {
            enteredUser = securityManager.currentUser.profile;
        }

        var now = formatter.formatDateISO8601(formatter.now, org.timezone);

        var obj = {
            recordId: id,
            soldBy: params.soldBy,
            soldById: params.soldById,
            enteredDate: now,
            modifiedDate: now,
            status: RECORD_STATUS.NEW
        };

        if (params.claimType) {
            obj["claimType"] = params.claimType;
        }

        if (params.claimField1) {
            obj["claimField1"] = params.claimField1;
        }
        if (params.claimField2) {
            obj["claimField2"] = params.claimField2;
        }
        if (params.claimField3) {
            obj["claimField3"] = params.claimField3;
        }
        if (params.claimField4) {
            obj["claimField4"] = params.claimField4;
        }
        if (params.claimField5) {
            obj["claimField5"] = params.claimField5;
        }

        // Parse extra fields
        var extraFields = getSalesDataExtreFields(page);
        for (var i = 0; i < extraFields.length; i++) {
            var ex = extraFields[i];
            var fieldName = 'field_' + ex.name;

            obj[fieldName] = params.get(fieldName) || '';
        }

        // Upload receipt
        var uploadedFiles = uploadFile(page, params, files);
        if (uploadedFiles.length > 0) {
            obj.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
        }

        transactionManager.runInTransaction(function () {
            securityManager.runAsUser(enteredUser, function () {
                log.info("Run as user: {}", params.claimItemsLength);

                db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
                eventManager.goalAchieved("claimSubmittedGoal", {"claim": id, "claimType": params.claimType});

                var claimItems = [];

                for (counter = 0; counter < params.claimItemsLength; counter++) {
                    var params_amount = params['amount.' + counter];
                    var params_productSku = params['productSku.' + counter] || '';
                    var params_soldDate = params['soldDate.' + counter];

                    log.info('params_amount={}, params_productSku={}, params_soldDate={}', params_amount, params_productSku, params_soldDate);

                    var amount = +params_amount;
                    if (isNaN(amount)) {
                        result.status = false;
                        result.messages = ['Amount must be digits'];
                        return views.jsonObjectView(JSON.stringify(result));
                    }

                    var tempDateTime = params_soldDate;
                    var soldDateTmp = formatter.parseDate(tempDateTime);
                    var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);
                    log.info('createClaim > soldDate={}', soldDate);

                    claimItems.push({amount: amount, productSku: params_productSku, soldDate: soldDate, soldBy: params.soldBy, soldById: params.soldById});
                }

                createClaimItem(db, obj, claimItems);
            });
        });
    } catch (e) {
        log.error('Error when creating claim: ' + e, e);
        result.status = false;
        result.messages = ['Error when creating claim: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function updateClaim(page, params, files) {
    log.info('updateClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    try {
        var db = getDB(page);
        var id = page.attributes.claimId;
        var claim = db.child(id);

        if (claim !== null) {
            var org = page.organisation;
            var now = formatter.formatDateISO8601(formatter.now);
            var claimJson = JSON.parse(claim.json);

            claimJson.modifiedDate = now;

            if (params.claimType) {
                claimJson["claimType"] = params.claimType;
            }

            if (params.claimField1) {
                claimJson["claimField1"] = params.claimField1;
            }
            if (params.claimField2) {
                claimJson["claimField2"] = params.claimField2;
            }
            if (params.claimField3) {
                claimJson["claimField3"] = params.claimField3;
            }
            if (params.claimField4) {
                claimJson["claimField4"] = params.claimField4;
            }
            if (params.claimField5) {
                claimJson["claimField5"] = params.claimField5;
            }

            // Parse extra fields
            var extraFields = getSalesDataExtreFields(page);
            for (var i = 0; i < extraFields.length; i++) {
                var ex = extraFields[i];
                var fieldName = 'field_' + ex.name;

                claimJson[fieldName] = params.get(fieldName) || '';
            }

            // Upload receipt
            var uploadedFiles = uploadFile(page, params, files);
            if (uploadedFiles.length > 0) {
                claimJson.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
            }

            claim.update(JSON.stringify(claimJson), TYPE_RECORD);

            // Update Claim Items
            var claimItems = [];

            for (counter = 0; counter < params.claimItemsLength; counter++) {
                var params_amount = params['amount.' + counter];
                var params_productSku = params['productSku.' + counter] || '';
                var params_soldDate = params['soldDate.' + counter];
                var params_claimid = params['claimid.' + counter];

                log.info('params_amount={}, params_productSku={}, params_soldDate={}, params_claimid={}', params_amount, params_productSku, params_soldDate, params_claimid);

                var amount = +params_amount;
                if (isNaN(amount)) {
                    result.status = false;
                    result.messages = ['Amount must be digits'];
                    return views.jsonObjectView(JSON.stringify(result));
                }

                var tempDateTime = params_soldDate;
                var soldDateTmp = formatter.parseDate(tempDateTime);
                var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);
                log.info('updateClaim > soldDate={}', soldDate);

                var claimItem = db.child(params_claimid);

                log.info("ClaimItem: {} | {}", params_claimid, claimItem);

                if (claimItem === null || typeof claimItem === 'undefined') {
                    log.info('Creating Item');
                    // It's an existing record, Update it
                    claimItems.push({amount: amount, productSku: params_productSku, soldDate: soldDate, soldBy: params.soldBy, soldById: params.soldById});
                } else {
                    log.info('Updating Item: {}', params_claimid);
                    // It's a new record so create it
                    var claimItemJson = JSON.parse(claimItem.json);

                    claimItemJson.amount = amount;
                    claimItemJson.productSku = params_productSku;
                    claimItemJson.soldDate = soldDate;
                    claimItemJson.soldBy = params.soldBy;
                    claimItemJson.soldById = params.soldById;
                    claimItemJson.modifiedDate = now;

                    claimItem.update(JSON.stringify(claimItemJson), TYPE_CLAIM_ITEM);
                }
            }

            createClaimItem(db, claimJson, claimItems);
        } else {
            result.status = false;
            result.messages = ['This claim does not exist'];
        }
    } catch (e) {
        log.error('Error when updating claim: ' + e, e);
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
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
    if (settings != null) {
        var selectedDataSeries = settings.get('dataSeries');

        if (isNotNull(selectedDataSeries)) {
            extraFields = applications.salesData.getDataSeriesExtraFields(selectedDataSeries);
        }
    }

    return extraFields;
}
