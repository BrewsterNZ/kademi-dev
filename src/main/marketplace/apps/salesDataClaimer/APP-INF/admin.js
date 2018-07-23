controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer')
        .addMethod('GET', 'checkRedirect')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/updateMappingSaleDataClaimer')
        .addMethod('POST', 'updateMapping')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/settingSaleDataClaimer')
        .addMethod('POST', 'saveSettings')
        .postPriviledge('READ_CONTENT')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer/')
        .defaultView(views.templateView('/theme/apps/salesDataClaimer/viewClaims.html'))
        .addMethod('GET', 'getAllClaims')
        .addMethod('POST', 'approveClaims', 'approveClaims')
        .addMethod('POST', 'rejectClaims', 'rejectClaims')
        .addMethod('POST', 'deleteClaims', 'deleteClaims')
        .addMethod('POST', 'createClaim', 'createClaim')
        .addMethod('POST', 'saveImageClaims')
        .postPriviledge('READ_CONTENT')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer/(?<claimId>[^/]*)')
        .addMethod('GET', 'checkRedirect')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer/(?<claimId>[^/]*)/')
        .addMethod('GET', 'getClaimItems', 'claimItems')
        .addMethod('GET', 'getClaim')
        .addMethod('POST', 'updateClaim', 'updateClaim')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer/ocrFile/(?<claimId>[^/]*)')
        .addMethod('GET', 'checkRedirect')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .path('/manageSaleDataClaimer/ocrFile/(?<claimId>[^/]*)/')
        .addMethod('GET', 'getClaimOCRFile')
        .enabled(true)
        .build();

controllerMappings
        .adminController()
        .pathSegmentName('getSearchClaimItemsResult')
        .enabled(true)
        .addMethod('GET', 'getSearchClaimItemsResult')
        .build();

controllerMappings
        .adminController()
        .path('/salesDataClaimsProducts/tagClaim')
        .addMethod('POST', 'createImageClaimTagging')
        .enabled(true)
        .build();

function getAllClaims(page, params) {
    log.info('getAllClaims > page={}, params={}', page, params);

    if (!params.claimId) {
        var results = searchClaims(page, params.status, undefined, params.claimGroup);
        var claimGroupsResult = searchClaimGroups(page, params.claimGroup);
        page.attributes.searchResult = results;
        page.attributes.searchClaimGroupsResult = claimGroupsResult;
        page.attributes.settings = getAppSettings(page);
    }
}

function getSearchClaimItemsResult(page, params) {
    var searchClaimItemsResult = searchClaimItems(page, params.claimRecordId, null);
    var result = {"status": true, "data": []};

    var hits = searchClaimItemsResult.hits;
    var hitsList = hits.getHits();
    for (counter = 0; counter < hits.totalHits(); counter++) {
        var soldDate = "";
        var modifiedDate = "";
        var productSku = "";

        if (hitsList[counter].getField('soldDate') !== null) {
            soldDate = hitsList[counter].getField('soldDate').value;
        }
        if (hitsList[counter].getField('modifiedDate') !== null) {
            modifiedDate = hitsList[counter].getField('modifiedDate').value;
        }
        if (hitsList[counter].getField('productSku') !== null) {
            productSku = hitsList[counter].getField('productSku').value;
        }

        var row = {
            "amount": hitsList[counter].getField('amount').value,
            "productSku": productSku,
            "soldDate": {
                "value": soldDate,
                "formatDateISO8601": formatter.toDate(soldDate),
                "formatTimeLong": formatter.formatTimeLong(soldDate, page.organisation.timezone)
            },
            "soldBy": hitsList[counter].getField('soldBy').value,
            "modifiedDate": {
                "value": modifiedDate,
                "formatDateISO8601": formatter.toDate(modifiedDate),
                "formatTimeLong": formatter.formatTimeLong(modifiedDate, page.organisation.timezone)
            },
            "soldById": hitsList[counter].getField('soldById').value
        };

        result.data.push(row);
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function changeClaimsStatus(status, page, params, callback) {
    log.info('changeClaimsStatus > status={}, page={}, params={}', status, page, params, callback);

    var result = {
        status: true
    };

    var action;
    switch (status) {
        case RECORD_STATUS.APPROVED:
            action = 'approving';
            break;

        case RECORD_STATUS.REJECTED:
            action = 'rejecting';
            break;
    }

    try {
        var db = getDB(page);
        var ids = params.ids;
        ids = formatter.split(ids);

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null) {
                    claim.jsonObject.status = status;
                    claim.save();

                    var enteredUser = applications.userApp.findUserResourceById(claim.jsonObject.soldById);
                    if (isNotNull(enteredUser)) {
                        var custProfileBean = enteredUser.extProfileBean;
                        eventManager.goalAchieved('claimProcessedGoal', custProfileBean, {'claim': id, 'status': status});
                    } else {
                        eventManager.goalAchieved('claimProcessedGoal', {'claim': id, 'status': status});
                    }
                }
            })(ids[i]);
        }

        if (typeof callback === 'function') {
            callback(result);
        }
    } catch (e) {
        log.error('Error in ' + action + ': ' + e, e);
        result.status = false;
        result.messages = ['Error in ' + action + ': ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function approveClaims(page, params) {
    log.info('approveClaims > page={}, params={}', page, params);

    return changeClaimsStatus(RECORD_STATUS.APPROVED, page, params, function (result) {
        try {
            var db = getDB(page);
            var ids = params.ids;
            ids = formatter.split(ids);

            var settings = getAppSettings(page);
            var selectedDataSeries = settings.get('dataSeries');
            var dataSeries = applications.salesData.getSalesDataSeries(selectedDataSeries);

            for (var i = 0; i < ids.length; i++) {
                (function (id) {
                    var claim = db.child(id);

                    if (claim !== null) {
                        var queryJson = {
                            'stored_fields': [
                                'recordId',
                                'claimRecordId',
                                'modifiedDate',
                                'soldBy',
                                'soldById',
                                'amount',
                                'productSku',
                                'soldDate'
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
                                        {'type': {'value': TYPE_CLAIM_ITEM}},
                                        {'term': {'claimRecordId': claim.jsonObject.recordId}}
                                    ]
                                }
                            }
                        };

                        var claim_items = doDBSearch(page, queryJson);
                        var hits = claim_items.hits;
                        var hitsList = hits.getHits();

                        for (counter = 0; counter < hits.totalHits(); counter++) {
                            var soldById = hitsList[counter].getField('soldById').value;
                            var amount = hitsList[counter].getField('amount').value;
                            var soldDate = hitsList[counter].getField('soldDate').value;
                            var productSku = hitsList[counter].getField('productSku').value;

                            amount = formatter.toBigDecimal(amount);
                            soldDate = formatter.toDate(Date.parse(soldDate).toString());
                            enteredDate = formatter.toDate(Date.parse(claim.jsonObject.enteredDate).toString());

                            var obj = {
                                soldById: soldById,
                                amount: amount,
                                soldDate: soldDate,
                                enteredDate: enteredDate,
                                productSku: productSku
                            };

                            var enteredUser = applications.userApp.findUserResourceById(obj.soldById);
                            var custProfileBean = enteredUser.extProfileBean;
                            applications.salesData.insertDataPoint(dataSeries, obj.amount, obj.soldDate, obj.soldDate, enteredUser.thisUser, enteredUser.thisUser, obj.enteredDate, obj.productSku);

                            eventManager.goalAchieved('claimProcessedGoal', custProfileBean, {'claim': id, 'status': RECORD_STATUS.APPROVED});
                        }
                    }
                })(ids[i]);
            }
        } catch (e) {
            log.error('Error in approving: ' + e, e);
            result.status = false;
            result.messages = ['Error in approving: ' + e];
        }
    });
}

function rejectClaims(page, params) {
    log.info('rejectClaims > page={}, params={}', page, params);

    return changeClaimsStatus(RECORD_STATUS.REJECTED, page, params);
}

function deleteClaims(page, params) {
    log.info('deleteClaims > page={}, params={}', page, params);
    var result = {
        status: true
    };

    try {
        var db = getDB(page);
        var ids = params.ids;

        ids = formatter.split(ids);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];

            var claim = db.child(id);

            if (claim !== null) {
                claim.delete();
            }

            // Delete any claim items as well
            var resp = db.search(JSON.stringify({
                'stored_fields': ['recordId', 'claimRecordId'],
                'query': {
                    'bool': {
                        'must': [
                            {'type': {'value': TYPE_CLAIM_ITEM}},
                            {'term': {'claimRecordId': id}}
                        ]
                    }
                }
            }));

            var respJson = JSON.parse(resp.toString());
            for (var i = 0; i < respJson.hits.hits.length; i++) {
                var hit = respJson.hits.hits[i];
                var claimItemId = hit.fields.recordId;

                var claimItem = db.child(claimItemId);
                if (claimItem !== null) {
                    claimItem.delete();
                }
            }
        }

        if (typeof callback === 'function') {
            callback(result);
        }
    } catch (e) {
        log.error('Error in deleteClaims: ' + e, e);
        result.status = false;
        result.messages = ['Error in deleteClaims: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function createImageClaimTagging(page, params, files) {
    log.info('createImageClaimTagging(): {} {}', page, files);

    var response = [];

    var salesDataIds = formatter.split(params.salesDataIds);

//    log.info("params.salesDataIds: {}", params.salesDataIds);

    for (counter = 0; counter < salesDataIds.length; counter++) {
        var params_temp = {
            salesDataId: salesDataIds[counter]
        };

        response.push({
            "salesDataId": salesDataIds[counter],
            "response": createClaimTaggingInner(page, params_temp, files)
        });
    }

    return views.jsonObjectView(response);
}

function saveImageClaims(page, params, files) {
    log.info('saveImageClaims(): {} {}', page, files);

    var result = {
        status: true
    }

    var rows = JSON.parse(params.rows);

    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

    xml += '<rows totalConfidence="' + params.totalConfidence + '" oldHash="' + params.old_hash + '">';

    for (var rows_counter = 0; rows_counter < rows.length; rows_counter++) {
        var row = rows[rows_counter];

        xml += '<row index="' + row['index'] + '">\n';
        for (cells_counter = 0; cells_counter < row['cells'].length; cells_counter++) {
            var cell = row['cells'][cells_counter];

            xml += '<cell>\n';
            xml += '<' + cell['column'] + '>' + formatter.htmlEncode(formatter.toString(cell['value']).trim()) + '</' + cell['column'] + '>\n';
            xml += '<confidence>' + formatter.toString(cell['confidence']).trim() + '</confidence>\n';
            xml += '</cell>\n';
        }
        xml += '</row>\n';
    }


    xml += '</rows>';

    result.XMLDocumentHash = fileManager.upload(xml.getBytes());

    if (params.action == "approve") {
        log.info("processImageClaims: approve");

        var dataManager = services.dataSeriesManager;
        var settings = getAppSettings(page);
        var selectedDataSeries = settings.get('dataSeries');
        var dataSeries = dataManager.dataSeries(selectedDataSeries);

        for (var rows_counter = 0; rows_counter < rows.length; rows_counter++) {
            var row = rows[rows_counter];
            var dp = dataManager.newDataPoint();
            dp.series = dataSeries;
            dp.saleDate = formatter.now;
            dp.attributedTo = securityManager.currentUser.thisProfile;
            dp.fields = formatter.newMap();

            log.info("cells.. {}", row['cells'].length);
            for (var cells_counter = 0; cells_counter < row['cells'].length; cells_counter++) {
                var key = rows[rows_counter]['cells'][cells_counter]['column'];
                var val = formatter.toString(rows[rows_counter]['cells'][cells_counter]['value']).trim();
                log.info("processing key={} val={}", key, val);
                if (key == "productSku") {
                    dp.productSku = val;
                } else if (key == "attributedTo") {
                    dp.attributedTo = findParticipant(val, dp.series);
                } else if (key == "amount") {
                    dp.amount = formatter.toBigDecimal(val);
                } else if (key == "periodFrom") {
                    dp.periodFrom = formatter.toDate(val);
                } else {
                    dp.fields.put(key, val);
                }
            }

            dataManager.insertDataPoint(dp);
        }
    }

    /**
     * Update Claim Status & New XML hash
     */
    try {
        var db = getDB(page);
        var id = params.id;
        var claim = db.child(id);

        if (claim !== null) {
            var obj = {
                recordId: id,
//                soldBy: claim.jsonObject.soldBy,
//                soldById: claim.jsonObject.soldById,
//                amount: claim.jsonObject.amount,
//                soldDate: claim.jsonObject.soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: formatter.formatDateISO8601(formatter.now),
//                productSku: claim.jsonObject.productSku,
                status: claim.jsonObject.status,
                receipt: claim.jsonObject.receipt,
                ocrFileHash: result.XMLDocumentHash
            };

            if (params.action == "approve") {
                obj.status = RECORD_STATUS.APPROVED;
            } else {
                obj.status = claim.jsonObject.status;
            }

            // Parse extra fields
            var extraFields = getSalesDataExtreFields(page);
            for (var i = 0; i < extraFields.length; i++) {
                var ex = extraFields[i];
                var fieldName = 'field_' + ex.name;

                obj[fieldName] = params.get(fieldName) || '';
            }

            claim.update(JSON.stringify(obj), TYPE_RECORD);
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

function findParticipant(entityName, series) {
    var st = series.salesType;
    log.info("findParticipant {} {}", entityName, st);

    if (st == null || st == "SALES_PROFILE") {
        var mr = services.userManager.newProfileMatchRequest();
        mr.email(entityName).or().userName(entityName);
        var profileBeans = services.userManager.findMatching(mr);
        if (profileBeans.size() == 0) {
            return null;
        } else {
            return profileBeans.get(0).entityObject(); // convert bean to Profile
        }
    } else {
        // TODO
    }

}