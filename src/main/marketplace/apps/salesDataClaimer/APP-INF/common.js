/* global log, fileManager, TYPE_CLAIM_GROUP, TYPE_RECORD, views, formatter, securityManager, applications, RECORD_STATUS, transactionManager, eventManager, services */

function uploadFile(page, params, files) {
    log.info('uploadFile > page {} params {} files {}', page, params, files);

    var result = [];

    if (files !== null || !files.isEmpty()) {
        var filesArray = files.entrySet().toArray();

        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i].getValue();
            var fileHash = fileManager.uploadFile(file);

            result.push({
                originalFileName : file.name,
                originalContentType : file.contentType,
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
        '_source': true,
        'size': 10000,
        'sort': [
            {
                'enteredDate': 'desc'
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
            'term': {'claimItems.soldBy': user.name}
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
        var queryJson = getSearchClaimsQuery(page, null, user);
        queryJson.aggregations = {
            "total": {
                "sum": {
                    "field": "claimItems.amount"
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
    //log.info("searchClaims {}", searchResult);
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

function createClaim(page, params, files, form) {
    log.info('createClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    var org = page.organisation;

    try {
        var currentRoles = securityManager.getRoles();
        log.info('currentRoles={}', currentRoles);

        var now = formatter.formatDateISO8601(formatter.now, org.timezone);
        var db = getDB(page);
        var id = 'claim-' + generateRandomText(32);

        var currentUser = securityManager.currentUser.profile;

        var obj = {
            recordId: id,
            enteredDate: now,
            enteredUser: (isNotNull(currentUser) ? currentUser.userId : params.soldById),
            modifiedDate: now,
            status: RECORD_STATUS.NEW
        };

        appendSalesTeam(page, params, obj);

        var anonUser = null;

        if (params.email) {
            log.info('Anonymous with email={}, firstName={}', params.email, params.firstName);
            anonUser = applications.userApp.findUserResource(params.email);

            if (isNull(anonUser)) {
                log.info('Create new user with email={}, firstName={}', params.email, params.firstName);
                anonUser = securityManager.createProfile(page.organisation, params.email, null, null);
                anonUser = applications.userApp.findUserResource(anonUser);
                log.info('Created user: {}', anonUser);
                page.parent.orgData.updateProfile(anonUser.profile, params.firstName, anonUser.surName, anonUser.phone);
            } else {
                log.info('Found existing user for anonymous: {}', anonUser);
            }

            if (isNotNull(anonUser)) {
                log.info('Profile for anonymous: userName={}, userId={}', anonUser.name, anonUser.userId);
                if (isNull(obj.enteredUser)) {
                    obj.enteredUser = anonUser.userId;
                }
            }

        }

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

            obj[fieldName] = params.get(ex.name) || '';
        }

        // Upload receipt
        var uploadedFiles = uploadFile(page, params, files);
        if (uploadedFiles.length > 0) {
            obj.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
        }

        transactionManager.runInTransaction(function () {
            securityManager.runAsUser(anonUser || currentUser, function () {
                log.info("Run as user: {}", params.claimItemsLength);

                var claim = db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
                eventManager.goalAchieved("claimSubmittedGoal", {"claim": id, "claimType": params.claimType});

                var soldBy, soldById = null;

                if (isNotBlank(params.soldBy)) {
                    soldBy = params.soldBy;
                }
                if (isNotBlank(params.soldById)) {
                    soldById = params.soldById;
                }

                if (isBlank(soldBy) || isBlank(soldById)) {
                    if (isNotNull(anonUser)) {
                        soldBy = anonUser.name;
                        soldById = anonUser.userId;
                    } else if (isNotNull(currentUser)) {
                        soldBy = currentUser.name;
                        soldById = currentUser.userId;
                    }
                }

                var claimItems = [];

                for (var counter = 0; counter < params.claimItemsLength; counter++) {
                    var params_amount = params['amount.' + counter];
                    if( formatter.isNotEmpty(params_amount)) {
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

                        claimItems.push({amount: amount, productSku: params_productSku, soldDate: soldDate, soldBy: soldBy, soldById: soldById});
                    }
                }

                createOrUpdateClaimItem(claim, obj, claimItems);
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

            appendSalesTeam(page, params, claimJson, true);

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

                claimJson[fieldName] = params.get(ex.name) || '';
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

                var claimItem = getClaimItem(claimJson, params_claimid);

                log.info("ClaimItem: {} | {}", params_claimid, claimItem);

                if (isNull(claimItem)) {
                    log.info('Creating Item');
                    claimItem = {
                        amount: amount,
                        productSku: params_productSku,
                        soldDate: soldDate,
                        soldBy: params.soldBy,
                        soldById: params.soldById
                    };

                    claimItems.push(claimItem);
                } else {
                    log.info('Updating Item: {}', params_claimid);
                    claimItem.amount = amount;
                    claimItem.productSku = params_productSku;
                    claimItem.soldDate = soldDate;
                    claimItem.soldBy = params.soldBy;
                    claimItem.soldById = params.soldById;
                    claimItem.modifiedDate = now;

                    claimItems.push(claimItem);
                }
            }
            // Empty the list so just the sent items are saved
            claimJson.claimItems = [];


            createOrUpdateClaimItem(claim, claimJson, claimItems);
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

function getClaimItem(claimJson, claimId) {
    if (isNull(claimJson) || isNull(claimJson.claimItems) || isNull(claimId)) {
        return null;
    }

    for (var i = 0; i < claimJson.claimItems.length; i++) {
        var claimItem = claimJson.claimItems[i];

        if (claimItem.recordId === claimId) {
            return claimItem;
        }
    }

    return null;
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
            var id = ids[i];

            var claim = db.child(id);

            if (claim !== null && +claim.jsonObject.status === RECORD_STATUS.NEW) {
                claim.delete();
            }
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error in deleting: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function getSalesDataExtreFields(page) {
    var extraFields = [];
    var settings = getAppSettings(page);
    if (isNotNull(settings)) {
        var selectedDataSeries = settings.get('dataSeries');

        if (isNotNull(selectedDataSeries)) {
            extraFields = applications.salesData.getDataSeriesExtraFields(selectedDataSeries);
        }
    }

    return extraFields;
}

function createOrUpdateClaimItem(claimObj, claimJson, claimItems) {
    log.info('createOrUpdateClaimItem() - {} - {}', claimObj.recordId, claimItems.length);

    var enteredUser = securityManager.currentUser;
    var soldBy = enteredUser.name;
    var soldById = enteredUser.userId;

    var existingClaimItems = [];
    if (isNotNull(claimJson.claimItems)) {
        existingClaimItems = claimJson.claimItems;
    }

    for (var i = 0; i < claimItems.length; i++) {
        var claimItem = claimItems[i];

        claimItem.modifiedDate = claimJson.modifiedDate;

        if (isBlank(claimItem.recordId)) {
            claimItem.recordId = 'claimItem-' + generateRandomText(32);
        }

        if (isBlank(claimItem.soldBy)) {
            claimItem.soldBy = soldBy;
        }

        if (isNull(claimItem.soldById)) {
            claimItem.soldById = soldById;
        }

        // Replace or add it to the claim
        var found = false;
        for (var a = 0; a < existingClaimItems.length; a++) {
            var eci = existingClaimItems[a];
            if (safeString(eci.recordId) === safeString(claimItem.recordId)) {
                existingClaimItems[a] = claimItem;
                found = true;
                break;
            }
        }
        if (!found) {
            // We didn't find it, So add it to the list
            existingClaimItems.push(claimItem);
        }
    }

    // Set claim items
    claimJson.claimItems = existingClaimItems;

    // Update
    claimObj.update(JSON.stringify(claimJson));
}

function getSalesTeam(page, params) {
    // Check if it's a website
    var website = page.closest('website');
    var isWebsite = isNotNull(website);
    var salesTeam = null;

    if (isWebsite) {
        salesTeam = services.queryManager.currentTeamOrg;
    } else if (isNotBlank(params.salesTeam)) {
        salesTeam = services.organisationManager.findOrg(params.salesTeam);
    }

    return salesTeam;
}

function appendSalesTeam(page, params, json, useNull) {
    var salesTeam = getSalesTeam(page, params);

    if (isNotNull(salesTeam)) {
        json.salesTeamOrgId = salesTeam.orgId;
    } else if (useNull) {
        json.salesTeamOrgId = null;
    }

    return json;
}