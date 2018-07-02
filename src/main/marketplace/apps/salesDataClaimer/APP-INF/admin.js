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
        .addMethod('GET', 'getClaim')
        .enabled(true)
        .build();
        
controllerMappings
        .adminController()
        .pathSegmentName('manageSalesDataImageClaimer')
        .enabled(true)
        .defaultView(views.templateView('salesDataImageClaimer/manageSalesDataImageClaimer.html'))
        .addMethod('GET', 'getSalesDataImageClaimerRows') 
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
        ids = ids.split(',');

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null) {
                    claim.jsonObject.status = status;
                    claim.save();

                    var enteredUser = applications.userApp.findUserResourceById(claim.jsonObject.soldById);
                    var custProfileBean = enteredUser.extProfileBean;

//                    eventManager.goalAchieved('claimProcessedGoal', {'claim': id, 'status': status});

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

    return views.jsonObjectView(JSON.stringify(result))
}

function approveClaims(page, params) {
    log.info('approveClaims > page={}, params={}', page, params);

    return changeClaimsStatus(RECORD_STATUS.APPROVED, page, params, function (result) {
        try {
            var db = getDB(page);
            var ids = params.ids;
            ids = ids.split(',');

            var settings = getAppSettings(page);
            var selectedDataSeries = settings.get('dataSeries');
            var dataSeries = applications.salesData.getSalesDataSeries(selectedDataSeries);

            for (var i = 0; i < ids.length; i++) {
                (function (id) {
                    var claim = db.child(id);

                    if (claim !== null) {
                        var obj = {
                            soldById: claim.jsonObject.soldById,
                            amount: formatter.toBigDecimal(claim.jsonObject.amount),
                            soldDate: formatter.toDate(claim.jsonObject.soldDate),
                            enteredDate: formatter.toDate(claim.jsonObject.enteredDate),
                            productSku: claim.jsonObject.productSku
                        };

                        var enteredUser = applications.userApp.findUserResourceById(obj.soldById);
                        var custProfileBean = enteredUser.extProfileBean;
                        applications.salesData.insertDataPoint(dataSeries, obj.amount, obj.soldDate, obj.soldDate, enteredUser.thisUser, enteredUser.thisUser, obj.enteredDate, obj.productSku);

                        eventManager.goalAchieved('claimProcessedGoal', custProfileBean, {'claim': id, 'status': RECORD_STATUS.APPROVED});
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
        ids = ids.split(',');

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null) {
                    claim.delete();
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

function getSalesDataImageClaimerRows(page, params) {
    var claimedSalesIds = getClaimedSales(page);
    
    page.attributes.salesQuery = JSON.stringify({
            "stored_fields": [
                "profileId",
                "periodFrom",
                "confidence",
                "rowIndex",
                "text",
                "recordId"
            ],
            "query": { 
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "dataSeriesName": "ocr-series"
                                    }
                                },
                                {
                                    "range": {
                                        "periodFrom": {
                                            "gte": formatter.formatDate(queryManager.commonStartDate),
                                            "lte": formatter.formatDate(queryManager.commonFinishDate),
                                            "format":"dd/MM/yyyy"
                                        }
                                    }
                                }
                            ],
                            "must_not": [
                                {
                                    "terms": {
                                        "recordId": claimedSalesIds
                                    }
                                }
                            ]
                        }
                    },
            "size": 10000
        });
}

function createImageClaimTagging(page, params, files) {
    log.info('createImageClaimTagging(): {} {} {}', page, params, files);
    
    var response = [];
    
    var salesDataIds = params.salesDataIds.split(',');
    
    log.info("params.salesDataIds: {}", params.salesDataIds);
    
    for(counter = 0; counter < salesDataIds.length; counter++){
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