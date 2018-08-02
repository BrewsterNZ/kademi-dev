/*global controllerMappings, views, log, formatter, applications, eventManager, RECORD_STATUS, TYPE_CLAIM_ITEM, services, fileManager, TYPE_RECORD*/

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
        .addMethod('POST', 'processImageClaim', 'processImageClaim')
        .addMethod('POST', 'imageClaim', 'imageClaim')
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
        .path('/salesDataClaimsProducts/tagClaim')
        .addMethod('POST', 'createImageClaimTagging')
        .enabled(true)
        .build();

function getAllClaims(page, params) {
    log.info('getAllClaims > page={}, params={}', page, params);

    if (!params.claimId) {
        var db = getDB(page);

        page.attributes.claims = db.findByType(TYPE_RECORD);
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
        ids = formatter.split(ids);

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null) {
                    claim.jsonObject.status = status;
                    claim.save();

                    // BM: Removed claim processed goal triggering which was causing an error
                    // And goals should be based on items, not the claim as a whole
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

            log.info("approveClaims: ids={}", ids.length);
            for (var i = 0; i < ids.length; i++) {
                (function (id) {
                    var claim = db.child(id);

                    if (claim !== null) {
                        log.info("approveClaims: found claim={}", claim.name);

                        var claimOb = claim.jsonObject;
                        var claimsItems = claimOb.claimItems;
                        log.info("approveClaims: found claim items={}", claimsItems.length);

                        log.info("approveClaims: claim items={}", claimOb.claimItems.length);
                        for (var counter = 0; counter < claimOb.claimItems.length; counter++) {
                            var claimItem = claimOb.claimItems[counter];

                            var soldByUser = services.userManager.findById(claimItem.soldById);

                            var dp = services.dataSeriesManager.newDataPoint();
                            dp.series = dataSeries;
                            dp.amount = formatter.toBigDecimal(claimItem.amount);
                            dp.periodFrom = formatter.toDate(Date.parse(claimItem.soldDate).toString());
                            dp.attributedTo = soldByUser;
                            dp.entered = dp.periodFrom; // should be claim date
                            dp.productSku = claimItem.productSku;

                            if (isNotNull(claimOb.enteredById)) {
                                var enteredBy = services.userManager.findById(claimOb.enteredById);
                                dp.enteredBy = enteredBy;
                            }

                            services.dataSeriesManager.insertDataPoint(dp);

                            var custProfileBean = services.userManager.toProfileBean(soldByUser);
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

function processImageClaim(page, params, files) {
    log.info('processImageClaim(): {} {}', page, files);

    var result = {
        status: true
    };
    try {
        var db = getDB(page);
        var claimId = params.id;

        var claim = db.child(claimId);

        if (claim !== null && typeof claim !== 'undefined') {
            var claimJson = JSON.parse(claim.json);
            var rows = params.rows;

            if (isNotNull(rows)) {
                var rowsJson = JSON.parse(rows);
                if (rowsJson.length > 0) {
                    var dataManager = services.dataSeriesManager;
                    var settings = getAppSettings(page);
                    var selectedDataSeries = settings.get('dataSeries');
                    var dataSeries = dataManager.dataSeries(selectedDataSeries);

                    var claimItems = [];

                    log.info("processImageClaim: rows={}", rowsJson.length);
                    for (var i = 0; i < rowsJson.length; i++) {
                        var row = rowsJson[i];

                        var claimItem = {};

                        for (var o = 0; o < row.cells.length; o++) {
                            var cell = row.cells[o];

                            switch (cell.column) {
                                case 'amount':
                                    claimItem.amount = parseFloat(cell.value);
                                    break;
                                case 'productSku':
                                    claimItem.productSku = cell.value;
                                    break;
                                case 'entered':
                                    break;
                                case 'attributedTo':
                                    var participant = findParticipant(cell.value, dataSeries);
                                    if (isNotNull(participant)) {
                                        claimItem.soldBy = participant.name;
                                        claimItem.soldById = participant.userId;
                                    }
                                    break;
                                case 'periodFrom':
                                    var periodFromDate = formatter.toDate(cell.value);
                                    var formattedDate = formatter.formatDateISO8601(periodFromDate);
                                    claimItem.soldDate = formattedDate;
                                    break;
                                case 'id':
                                    break;
                                case 'tags':
                                    break;
                            }
                        }

                        if (!claimItem.hasOwnProperty('soldDate')) {
                            claimItem.soldDate = claimJson.enteredDate;
                        }

                        claimItems.push(claimItem);
                    }
                    log.info("processImageClaim: claimItems={}", claimItems.length);
                    claimJson.processed = true;
                    createOrUpdateClaimItem(claim, claimJson, claimItems);

                    result.status = true;
                    result.messages = ['Successfully Processed'];
                } else {
                    result.status = false;
                    result.messages = ['No rows to process'];
                }
            } else {
                result.status = false;
                result.messages = ['No rows to process'];
            }
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

function saveImageClaims(page, params, files) {
    log.info('saveImageClaims(): {} {}', page, files);

    var result = {
        status: true,
        messages: []
    };

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

    /**
     * Update Claim Status & New XML hash
     */
    try {
        var db = getDB(page);
        var id = params.id;
        var claim = db.child(id);

        if (claim !== null) {
            var claimJson = JSON.parse(claim.json);

            claimJson.modifiedDate = formatter.formatDateISO8601(formatter.now);
            claimJson.ocrFileHash = result.XMLDocumentHash;

            // Parse extra fields
            var extraFields = getSalesDataExtreFields(page);
            for (var i = 0; i < extraFields.length; i++) {
                var ex = extraFields[i];
                var fieldName = 'field_' + ex.name;

                claimJson[fieldName] = params.get(fieldName) || '';
            }

            claim.update(JSON.stringify(claimJson), TYPE_RECORD);
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

    if (isNull(st) || st === "SALES_PROFILE") {
        var mr = services.userManager.newProfileMatchRequest();
        mr.email(entityName).or().userName(entityName);
        var profileBeans = services.userManager.findMatching(mr);
        if (profileBeans.size() === 0) {
            return null;
        } else {
            return profileBeans.get(0).entityObject(); // convert bean to Profile
        }
    } else {
        // TODO
    }

}