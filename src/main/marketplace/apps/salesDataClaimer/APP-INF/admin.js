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
        .addMethod('POST', 'processImageClaims')
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
        .pathSegmentName('manageSalesDataImageClaimer')
        .enabled(true)
//        .defaultView(views.templateView('salesDataImageClaimer/manageSalesDataImageClaimer.html'))
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
    log.info('createImageClaimTagging(): {} {}', page, files);
    
    var response = [];
    
    var salesDataIds = params.salesDataIds.split(',');
    
//    log.info("params.salesDataIds: {}", params.salesDataIds);
    
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
	
function processImageClaims(page, params, files){
    log.info('processImageClaims(): {} {}', page, files);

    var result = {
        status: true
    } 

    var rows = JSON.parse(params.rows);

    /**
     * Save data in new XML
     */
    var XMLDocumentString = '<?xml version="1.0" encoding="UTF-8"?>\n';

    XMLDocumentString += '<rows totalConfidence="' + params.totalConfidence + '" oldHash="' + params.old_hash + '">';

    for(rows_counter = 0; rows_counter < rows.length; rows_counter++){
        var row = rows[rows_counter];

        XMLDocumentString += '<row index="' + row['index'] + '">\n';
        for(cells_counter = 0; cells_counter < row['cells'].length; cells_counter++){
            var cell = row['cells'][cells_counter];

            XMLDocumentString += '<cell>\n';
            XMLDocumentString += '<' + cell['column'] + '>' + formatter.htmlEncode(formatter.toString(cell['value']).trim()) + '</' + cell['column'] + '>\n';
            XMLDocumentString += '<confidence>' + formatter.toString(cell['confidence']).trim() + '</confidence>\n';
            XMLDocumentString += '</cell>\n';
        } 
        XMLDocumentString += '</row>\n';
    }

    XMLDocumentString += '</rows>';

    result.XMLDocumentHash = fileManager.upload(XMLDocumentString.getBytes());

    if(params.action == "approve"){
        /**
         * Save data-series
         */
        var salesDataApp = applications.get("salesData");
        var ocrDataSeries = salesDataApp.getSalesDataSeries('sales-data-image-claim');

        for(rows_counter = 0; rows_counter < rows.length; rows_counter++){
            var fieldsMap = formatter.newMap();
            for(cells_counter = 0; cells_counter < rows[rows_counter]['cells'].length; cells_counter++){
                fieldsMap.put(rows[rows_counter]['cells'][cells_counter]['column'], formatter.toString(rows[rows_counter]['cells'][cells_counter]['value']).trim());
            }

            securityManager.runAsUser("mohamed-owda", function () {
                salesDataApp.insertOrUpdateDataPoint(ocrDataSeries, formatter.toBigDecimal(1), formatter.now, formatter.now, securityManager.currentUser.thisProfile, formatter.now, fieldsMap);
            });
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
                soldBy: claim.jsonObject.soldBy,
                soldById: claim.jsonObject.soldById,
                amount: claim.jsonObject.amount,
                soldDate: claim.jsonObject.soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: formatter.formatDateISO8601(formatter.now),
                productSku: claim.jsonObject.productSku,
                status: claim.jsonObject.status,
                receipt: claim.jsonObject.receipt,
                ocrFileHash: result.XMLDocumentHash
            }; 
            
            if(params.action == "approve"){
                obj.status = RECORD_STATUS.APPROVED;
            }else{
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