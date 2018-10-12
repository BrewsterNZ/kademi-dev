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
    .pathSegmentName('manageSaleDataClaimer.csv')
    .addMethod('GET', 'exportCSV')
    .addMethod('POST', 'importCSV')
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

        var claimsQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "range": {
                                "enteredDate": {
                                    "gte": services.queryManager.commonStartDate.time,
                                    "lte": services.queryManager.commonFinishDate.time
                                }
                            }
                        }
                    ]
                }
            },
            "size" : "9000"
        };


        var claimsQueryResp = db.search(JSON.stringify(claimsQuery));
        var claims = formatter.newArrayList();
        formatter.foreach(claimsQueryResp.hits.hits, function (hit) {
            log.info("Add claim", hit, hit.source.id);
            var record = db.child(hit.id);
            claims.add(record);
        });


        page.attributes.claims = claims;
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
                            log.info("approveClaims: soldby={} name={}", claimItem.soldById, soldByUser.formattedName);

                            var dp = services.dataSeriesManager.newDataPoint();
                            dp.series = dataSeries;
                            dp.amount = formatter.toBigDecimal(claimItem.amount);
                            dp.periodFrom = formatter.toDate(Date.parse(claimItem.soldDate).toString());
                            dp.attributedTo = soldByUser;
                            dp.entered = dp.periodFrom; // should be claim date
                            dp.productSku = claimItem.productSku;

                            // Add salesTeam - #5781
                            var salesTeamOrgId = claimOb.salesTeamOrgId;
                            if (isNotNull(salesTeamOrgId)) {
                                dp.salesTeam = services.organisationManager.findOrg(salesTeamOrgId);
                            }

                            if (isNotNull(claimOb.enteredById)) {
                                var enteredBy = services.userManager.findById(claimOb.enteredById);
                                dp.enteredBy = enteredBy;
                            }

                            // populate extra fields
                            var extrFields = formatter.newMap();
                            for (var key in claimOb){
                                if (key.indexOf('field_') == 0){
                                    extrFields.put(key.replace('field_', ''), claimOb[key]);
                                }
                            }

                            dp.fields = extrFields;
                            log.info('db.fields {}', dp.fields);

                            services.dataSeriesManager.insertDataPoint(dp);

                        }
                        var enteredUser = services.userManager.findById(claim.enteredById);
                        var enteredUserBean = services.userManager.toProfileBean(enteredUser);
                        eventManager.goalAchieved('claimProcessedGoal', enteredUserBean, {'claim': id, 'status': RECORD_STATUS.APPROVED});
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
            var enteredBy = services.userManager.findById(claimJson.enteredById);
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

                        var didSetAttributedTo = false;
                        for (var o = 0; o < row.cells.length; o++) {
                            var cell = row.cells[o];

                            switch (cell.column) {
                                case 'amount':
                                    var recordAmount = parseFloat(cell.value);
                                    if (isNotNull(recordAmount)) {
                                        claimItem.amount = recordAmount;
                                    } else {
                                        log.info("parseFloat {} {}", cell.value, recordAmount);
                                        result.status = false;
                                        result.messages = ["Invalid amount " + cell.value + " on row " + i];
                                        return views.jsonObjectView(JSON.stringify(result));
                                    }
                                    break;
                                case 'productSku':
                                    claimItem.productSku = cell.value;
                                    break;
                                case 'entered':
                                    break;
                                case 'attributedTo':
                                    didSetAttributedTo = true;
                                    var participant = findParticipant(cell.value, dataSeries);
                                    if (isNotNull(participant)) {
                                        log.info("processImageClaim: soldById={}", participant.id);
                                        claimItem.soldBy = participant.name;
                                        claimItem.soldById = participant.id;
                                    } else {
                                        result.status = false;
                                        result.messages = ["Couldnt find participant " + cell.value + " on row " + i];
                                        return views.jsonObjectView(JSON.stringify(result));
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

                        if( !didSetAttributedTo ) {
                            claimItem.soldBy = enteredBy.name;
                            claimItem.soldById = claimJson.enteredById;
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

    if (isNull(st) || st == "SALES_PROFILE") {
        var mr = services.userManager.newProfileMatchRequest();
        mr
                .or()
                .email(entityName)
                .userName(entityName);

        var profileBeans = services.userManager.findMatching(mr);
        if (profileBeans.size() === 0) {
            log.info("findParticipant: not found");
            return null;
        } else {
            var p = profileBeans.get(0).entityObject(); // convert bean to Profile
            log.info("findParticipant: found {}", p.id);
            return p;
        }
    } else {
        // TODO
        log.warn("findParticipant: sales type not supported {}", st);
        return null;
    }

}

function exportCSV(page, params) {
    var extraFields = getSalesDataExtreFields(page);
    var db = getDB(page);
    var claims = db.findByType("record");
    var arr = [];
    for (var i in claims){
        var claim = claims[i].jsonObject;
        var items = claim.claimItems;
        if (items && items.length > 0){
            for (var j = 0; j < items.length; j ++){
                var item = items[j];
                var rowObj = item;
                // sale claim item id
                rowObj.claimItemId = item.recordId;
                log.info('claim {} {}', i, item);
                rowObj.recordId = claim.recordId;
                rowObj.enteredDate = claim.enteredDate;
                rowObj.enteredUser = claim.enteredUser;
                rowObj.modifiedDate = claim.modifiedDate;
                rowObj.status = claim.status;
                rowObj.salesTeamOrgId = claim.salesTeamOrgId;
                findClaimExtraFields(claim, rowObj);
                arr.push(rowObj);
                log.info('arr length {}', arr.length);
            }
        }
    }

    var csvArr = [];
    if ( arr.length ){
        var keys = ['recordId', 'amount', 'productSku', 'soldDate', 'soldBy', 'soldById', 'modifiedDate', 'claimItemId', 'enteredDate', 'enteredUser', 'enteredById', 'modifiedDate', 'status', 'salesTeamOrgId', 'ocrFileHash', 'processed', 'receipt', 'claimType', 'claimField1', 'claimField2', 'claimField3', 'claimField4', 'claimField5', 'taggedFromSalesRecordId'];
        for (var i in extraFields){
            keys.push('field_'+extraFields[i].name);
        }
        csvArr.push(keys);

        for (var i = 0; i < arr.length; i ++){
            var row = [];
            for (var j = 0; j < keys.length; j++){
                row.push(arr[i][keys[j]]);
            }
            csvArr.push(row);
        }
    }

    return views.csvView(csvArr)
}

function findClaimExtraFields(claim, obj) {
    for(var key in claim){
        if (key.indexOf('field_') === 0){
            obj[key] = claim[key];
        }
    }
}

function importCSV(page, params, files) {
    var db = getDB(page);
    var file = files.get('file');
    log.info('file {}', file);
    var csvArr = fileManager.fromCsv(file);
    log.info('csvArr {}', csvArr);
    var headerRow = [];
    var insertedCount = 0;
    var updatedCount = 0;
    if (csvArr.size() > 0){
        headerRow = csvArr[0];
        var claimItemFields = ['claimItemId', 'soldDate', 'modifiedDate', 'amount', 'soldBy', 'soldById', 'productSku'];

        for (var i in csvArr){
            if (i > 0) {
                var row = csvArr[i];
                log.info('row {}', row);

                var recordId = row[0];
                log.info('record id {}', recordId);

                if (recordId) {
                    // update record
                    var record = db.child(recordId);
                    if (record) {
                        log.info('record found {}', record);
                        var claimJson = JSON.parse(record.json);
                        var claimItemObj = {};
                        for (var j in headerRow){
                            var field = headerRow[j];
                            if (claimItemFields.indexOf(field) == -1){
                                claimJson[field] = row[j];
                            } else {
                                if (field == 'claimItemId'){
                                    claimItemObj['recordId'] = row[j];
                                } else {
                                    claimItemObj[field] = row[j];
                                }
                            }
                        }

                        // Find claim item if exists

                        if (claimJson.claimItems && claimJson.claimItems.length > 0){
                            var found = false;
                            for (var j in claimJson.claimItems){
                                var item = claimJson.claimItems[j];
                                if (item.recordId == claimItemObj.claimItemId){
                                    // update claim item
                                    item.soldDate = claimItemObj.soldDate;
                                    item.modifiedDate = claimItemObj.modifiedDate || Date.now();
                                    item.amount = claimItemObj.amount;
                                    item.soldBy = claimItemObj.soldBy;
                                    item.soldById = claimItemObj.soldById;
                                    item.productSku = claimItemObj.productSku;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                log.info('not found {}', claimJson.claimItems);
                                // insert new item
                                claimJson.claimItems.push(claimItemObj);
                            }
                        } else {
                            claimJson.claimItems = [claimItemObj];
                        }
                        // save record
                        record.update(JSON.stringify(claimJson));
                        updatedCount ++;
                    } else {
                        // Insert new record with given id
                        var claimItemObj = {};
                        var claimObj = {};
                        for (var j in headerRow){
                            if (claimItemFields.indexOf(headerRow[j]) != -1){
                                if (headerRow[j] == 'claimItemId'){
                                    claimItemObj['recordId'] = row[j];
                                } else {
                                    claimItemObj[headerRow[j]] = row[j];
                                }
                            } else {
                                claimObj[headerRow[j]] = row[j];
                            }
                        }
                        claimObj.claimItems = [claimItemObj];
                        var claim = db.createNew(recordId, JSON.stringify(claimObj), TYPE_RECORD);
                        if (claim){
                            insertedCount ++;
                        }
                    }
                } else {
                    // insert new claim
                    var claimItemObj = {};
                    var claimObj = {};
                    for (var j in headerRow){
                        if (claimItemFields.indexOf(headerRow[j]) != -1){
                            if (headerRow[j] == 'claimItemId'){
                                claimItemObj['recordId'] = 'claimItem-' + generateRandomText(32);;
                            } else {
                                claimItemObj[headerRow[j]] = row[j];
                            }
                        } else {
                            claimObj[headerRow[j]] = row[j];
                        }
                    }
                    claimObj.claimItems = [claimItemObj];
                    var id = 'claim-' + generateRandomText(32);
                    claimObj.recordId = id;
                    var claim = db.createNew(id, JSON.stringify(claimObj), TYPE_RECORD);
                    if (claim){
                        insertedCount ++;
                    }
                }
            }
        }
    }


    return views.jsonObjectView(JSON.stringify({status: true, data: {insertedCount: insertedCount, updatedCount: updatedCount}}));
}