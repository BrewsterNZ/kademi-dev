controllerMappings
        .websiteController()
        .path('/salesDataClaims')
        .addMethod('GET', 'checkRedirect')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/salesDataClaims/')
        .defaultView(views.templateView('/theme/apps/salesDataClaimer/viewClaims.html'))
        .addMethod('POST', 'createClaim', 'createClaim')
        .addMethod('POST', 'deleteClaims', 'deleteClaims')
        .addMethod("POST", 'imageClaim')
        .postPriviledge('READ_CONTENT')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/salesDataClaims/(?<claimId>[^/]*)')
        .addMethod('GET', 'checkRedirect')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/salesDataClaims/(?<claimId>[^/]*)/')
        .addMethod('GET', 'getClaimItems', 'claimItems')
        .addMethod('GET', 'getClaim')
        .addMethod('POST', 'updateClaim', 'updateClaim')
        .postPriviledge('READ_CONTENT')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/salesDataClaimsProducts/')
        .addMethod('GET', 'searchProducts')
        .addMethod('POST', 'validateProductClaim', 'validate')
        .addMethod('POST', 'saveProductClaim', 'promotion')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/salesDataClaimsProducts/tagClaim')
        .addMethod('POST', 'createClaimTagging')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/trackClaimGroup/')
        .addMethod('GET', 'trackClaimGroup')
        .enabled(true)
        .build();

function trackClaimGroup(page, params) {
    var claimGroupContactRequest = getClaimGroupContactRequest(page, params.claimId);

    if (claimGroupContactRequest == null || claimGroupContactRequest.hits == null || claimGroupContactRequest.hits.hits == null || claimGroupContactRequest.hits.hits.length === 0) {
        var result = {
            status: false
        };

        return views.jsonObjectView(JSON.stringify(result));
    }

    var email = claimGroupContactRequest.hits.hits[0].source.email;

    if (email == null) {
        var result = {
            status: false
        };

        return views.jsonObjectView(JSON.stringify(result));
    }

    var user = applications.userApp.findUserResource(email);

    var userLeads = applications.funnels.getLeadsForProfile(user.thisProfile);

    var selectedLead;

    for (index in userLeads) {
        var lead = userLeads[index];

        if (lead.funnel.name === 'claim-form-tracking') {
            selectedLead = lead;
        }
    }

    if (selectedLead != null) {
        var result = {
            status: true,
            data: {
                claimId: params.claimId,
                stageName: selectedLead.getFieldValue('display_for_customers'),
                stageDescription: selectedLead.getFieldValue('description_for_customers')
            }
        };
    } else {
        var result = {
            status: false
        };
    }

    return views.jsonObjectView(JSON.stringify(result));

}

function validateProductClaim(page, params, files) {
    var result = {
        status: true
    };
    if(params.serialNumber){
        var serialNumber = params.serialNumber;
        var serialNumberArray = [serialNumber];
        var duplicateNumbers = contactRequestWithProductNumbersExists(page, serialNumberArray);
        if(duplicateNumbers.length > 0){
            log.error('Product serial number already exist');
            result.status = false;
            result.messages = ['Product serial number already exist'];
        }
        if( !checkIfProductNumberExists(serialNumber) ){
            log.error('Wrong product serial number');
            result.status = false;
            result.messages = ['Wrong product serial number'];
        }

    }else if(params.address){
        var address = params.address;
        if( contactRequestWithSameAddressExists(page, address) ){
            log.error('Address already exist');
            result.status = false;
            result.messages = ['Address already exist'];
        }
    }else{
        log.error('neither serial numbers nor address sent: ' + e, e);
        result.status = false;
        result.messages = ['neither serial numbers nor address sent: ' + e];
    }
    return views.jsonObjectView(JSON.stringify(result));
}

function contactRequestWithSameAddressExists(page, address) {
    var contactReuqests = page.find("/contactRequests");
    var requests = contactReuqests.contactRequests;

    for (var i = 0; i < requests.size(); i++) {
        var request = requests[i].contactRequest

        if (address == request.fields["address1"]) {
            return true;
        }
    }

    return false;
}

function checkIfProductNumberExists(productNumber){
    var salesDataApp = applications.get("salesData");
    var salesDateSeries = salesDataApp.getSalesDataSeries('allowed-ac-models');

    var salesDataExtraFields = formatter.newMap();
    salesDataExtraFields.put("serial-no", productNumber);

    var salesDataRecord = salesDataApp.findDataPoint(salesDateSeries, null, null, salesDataExtraFields);

    if(salesDataRecord == null){
        return false;
    }else{
        return true;
    }
}

function contactRequestWithProductNumbersExists(page, numbers) {
    var contactReuqests = page.find("/contactRequests");
    var requests = contactReuqests.contactRequests;
    var duplicateNumbers = [];

    for (var i = 0; i < requests.size(); i++) {
        var request = requests[i].contactRequest

        for (var numberKey in numbers) {
            var number = numbers[numberKey];
            if (number == request.fields["prod1-indoor-serial-number"]) {
                duplicateNumbers[duplicateNumbers.length] = number;
            } else if (number == request.fields["prod2-indoor-serial-number"]) {
                duplicateNumbers[duplicateNumbers.length] = number;
            } else if (number == request.fields["prod3-indoor-serial-number"]) {
                duplicateNumbers[duplicateNumbers.length] = number;
            }
        }
    }

    return duplicateNumbers;
}

function getOwnClaims(page, params) {
    log.info('getOwnClaims > page={}, params={}', page, params);

    if (!params.claimId) {
        var currentUser = securityManager.getCurrentUser();
        return searchClaims(page, params.status, currentUser);
    }
}

function getClaims(page, params) {
    log.info('getClaims > page={}, params={}', page, params);
    return searchClaims(page, null, null);
}

function getPendingClaims(page) {
    log.info('getPendingClaims > page={}', page);
    return searchClaims(page, 0, null);
}

function getTotalAmountOfClaims(page, params) {
    log.info('getPendingClaims > page={}, params={}', page, params);
    var searchResult = totalAmountOfClaims(page, null, null);
    //log.info('getPendingClaims > searchResult={}', searchResult.aggregations.get("total"));
    if (searchResult.aggregations === undefined) {
        log.warn('getPendingClaims no aggregations > searchResult={}');
        return 0;
    } else {
        return searchResult.aggregations.get("total").value;
    }
}

function searchProducts(page, params) {
    log.info('searchProducts > page={}, params={}', page, params);

    var q = params.q;
    var prods = applications.productsApp.searchProducts(q, null);

    return views.jsonObjectView(prods);
}

function saveProductClaim(page, params, files) {
    log.info('saveProductClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    try {
        var org = page.organisation;
        var db = getDB(page);
        var contactFormService = services.contactFormService;
        log.info("contactFormService: {}", contactFormService);

        var salesDataApp = applications.get("salesData");
        var salesDateSeries = salesDataApp.getSalesDataSeries('allowed-ac-models');
        var productsNumber = params['claims-number'];
        var productsSKUs = [];
        var soldBy = "";
        var soldById = "";

        // if(params['supplier-orgId']){
        //     soldBy = params['supplier-orgId'];
        // }else if (params['installer-orgId']){
        //     soldBy = params['installer-orgId'];
        // }else{
        //     log.error('Please select Supplier/Installer name');
        //     result.status = false;
        //     result.messages = ['Please select Supplier/Installer name'];
        //     return views.jsonObjectView(JSON.stringify(result));
        // }

        // if(page.parent.orgData.childOrg(soldBy)){
        //     soldById = page.parent.orgData.childOrg(soldBy).id;
        // }else{
        //     log.error('Supplier/Installer id: ' + soldBy + 'is invalid');
        //     result.status = false;
        //     result.messages = ['Supplier/Installer name is invalid'];
        //     return views.jsonObjectView(JSON.stringify(result));
        // }

        var indoorSerialNumbersToCheck = [];

        for( var i = 0; i < productsNumber; i++ ){
            var productModelNumber = params["prod"+ (i+1) +"-model-number"];
            //var productIndoorModelNumber = params["prod"+ (i+1) +"-indoor-model-number"];
            var productIndoorSerialNumber = params["prod"+ (i+1) +"-indoor-serial-number"];

            indoorSerialNumbersToCheck[indoorSerialNumbersToCheck.length] = productIndoorSerialNumber;

            var salesDataExtraFields = formatter.newMap();
            salesDataExtraFields.put("serial-no", productIndoorSerialNumber);

            // var salesDataRecord = salesDataApp.findDataPoint(salesDateSeries, null, null, salesDataExtraFields);

            // if(salesDataRecord == null){
            //     log.error('Sales Data record with serial number: ' + productIndoorSerialNumber +' not found');
            //     result.status = false;
            //     result.messages = ['Invalid products indoor serial number: ' + productIndoorSerialNumber];

            //     return views.jsonObjectView(JSON.stringify(result));
            // }

            //log.info("Claim Products data - input: {} - output: {} , {}", productIndoorSerialNumber, salesDataRecord.id, productModelNumber);
            productsSKUs.push(productModelNumber);
        }

        var existanceCheck = contactRequestWithProductNumbersExists(page, indoorSerialNumbersToCheck);

        if (existanceCheck.length > 0) {
            result.status = false;
            result.messages = ['The following serials have already been submitted before: ' + existanceCheck.join(", ")];

            return views.jsonObjectView(JSON.stringify(result));
        }

        if (contactRequestWithSameAddressExists(page, params['address1'])) {
            result.status = false;
            result.messages = ['A previous claim was submitted from this address, only one claim form can be submitted per address'];

            return views.jsonObjectView(JSON.stringify(result));
        }

        var claimGroupId = "";

        transactionManager.runInTransaction(function () {

            var cr = contactFormService.processContactRequest(page, params, files);
            var enteredUser = applications.userApp.findUserResource(cr.profile);
            var now = formatter.formatDateISO8601(formatter.now, org.timezone);

            claimGroupId = getLastClaimGroupId(page);

            if (claimGroupId != null) {
                var number = formatter.toString(formatter.toInteger(claimGroupId.substring(5)) + 1).replace(".0", "");

                claimGroupId = 'MHI-W' + formatter.padWith('0', number, 5);
            } else {
                claimGroupId = 'MHI-W00001';
            }

            var claimGroupObj = {
                claimGroupId: claimGroupId,
                enteredDate: now,
                contactRequest: cr.id
            };

            var tempDateTime = params['purchase-date'];
            var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
            var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
            var soldDateTmp = formatter.parseDate(tempDateTime);
            var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);

            log.info('createClaim > soldDate={}', soldDate);

            for(var i = 0; i < productsSKUs.length; i++) {
                var claimId = 'claim-' + generateRandomText(32);
                var claimObj = {
                    recordId: claimId,
                    enteredDate: now,
                    modifiedDate: now,
                    receipt: cr.attachments.length > 0 ? ('/_hashes/files/' + cr.attachments[0].attachmentHash) : null,
//                    amount: 1,
                    status: RECORD_STATUS.NEW,
//                    productSku: productsSKUs[i],
//                    soldDate: soldDate,
//                    soldBy: soldBy,
//                    soldById: soldById,
                    claimGroupId: claimGroupId
                };

                securityManager.runAsUser(enteredUser, function () {
                    db.createNew(claimId, JSON.stringify(claimObj), TYPE_RECORD);
                    eventManager.goalAchieved("claimSubmittedGoal", {"claim": claimId});

                    var claimItems = [
                        {amount: 1, productSku: productsSKUs[i], soldDate: soldDate, soldBy: soldBy, soldById: soldById}
                    ];

                    createClaimItem(db, claimObj, claimItems);
                });
            }

            securityManager.runAsUser(enteredUser, function () {
                db.createNew(claimGroupId, JSON.stringify(claimGroupObj), TYPE_CLAIM_GROUP);
                eventManager.goalAchieved("claimGroupSubmittedGoal", {"claimGroup": claimGroupId});
            });

            result.data = {};
            result.data.claimGroupId = claimGroupId;
        });

    } catch (e) {
        log.error('Error when saving claim: ' + e, e);
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}

function getClaimSalesById(salesDataId){
    var salesQuery = {
            "stored_fields": [
                "periodFrom",
                "type",
                "recordId",
                "points"
            ],
            "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "recordId": salesDataId
                                    }
                                }
                            ]
                        }
                    },
            "size": 1
        };

    var sm = applications.search.searchManager;
    var salesDataResp = sm.search(JSON.stringify(salesQuery), 'dataseries');

    var record = {};
    if(salesDataResp.hits.hits.length > 0){
        var hit = salesDataResp.hits.hits[0];
        record = {
            "periodFrom": hit.fields.periodFrom.value,
            "recordId": hit.fields.recordId.value
        };

        if(hit.fields.type){
            record['type'] = hit.fields.type.value
        }
        if(hit.fields.points){
            record['points'] = hit.fields.points.value
        }

    }
    return record;
}

function createClaimTagging(page, params, files) {
    log.info('createClaimTagging > page={}, params={}', page, params);

    var result = createClaimTaggingInner(page, params, files);

    return views.jsonObjectView(JSON.stringify(result));
}

function createClaimTaggingInner(page, params, files){
    var result = {
        status: true
    };

    try {
        var org = page.organisation;
        var db = getDB(page);
        var contactFormService = services.contactFormService;
        var salesDataId = params.salesDataId;
        var salesDataRecord = getClaimSalesById(salesDataId)

        transactionManager.runInTransaction(function () {
//            var cr = contactFormService.processContactRequest(page, params, files);
//            var enteredUser = applications.userApp.findUserResource(cr.profile);
            var enteredUser = securityManager.currentUser;
            var now = formatter.formatDateISO8601(formatter.now, org.timezone);

            var tempDateTime = salesDataRecord.periodFrom;
            var soldDateTmp = formatter.parseDate(tempDateTime);
            var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);
            var soldBy = enteredUser.name;
            var soldById = enteredUser.userId;
            var custProfileBean = enteredUser.extProfileBean;

            var claimId = 'claim-' + generateRandomText(32);
            var claimObj = {
                recordId: claimId,
                enteredDate: now,
                modifiedDate: now,
//                amount: 1,
                status: RECORD_STATUS.APPROVED,
//                soldBy: soldBy,
//                soldById: soldById,
//                soldDate: soldDate,
                taggedFromSalesRecordId: salesDataId
            };

            if(salesDataRecord.type){
                claimObj['claimType'] = salesDataRecord.type
            }

            securityManager.runAsUser(enteredUser, function () {
                db.createNew(claimId, JSON.stringify(claimObj), TYPE_RECORD);
                var nodeParams = {"claim": claimId, "claimType": salesDataRecord.type}
                if(salesDataRecord.points){
                    nodeParams["points"] = salesDataRecord.points;
                }
                eventManager.goalAchieved("claimSubmittedGoal", nodeParams);
                eventManager.goalAchieved("claimProcessedGoal", custProfileBean, {"claim": claimId, "claimType": salesDataRecord.type, 'status': RECORD_STATUS.APPROVED});

                var claimItems = [
                    {amount: 1, productSku: null, soldDate: soldDate, soldBy: soldBy, soldById: soldById}
                ];

                createClaimItem(db, claimObj, claimItems);
            });

            result.data = {};
            result.data.claimId = claimId;
        });

    } catch (e) {
        log.error('Error when saving claim: ' + e, e);
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
    }

    return result;
}

function getClaimGroupContactRequest(rf, claimGroupId) {
    log.info("claimGroupId ---=> {} ", claimGroupId);

    var claimGroup = findClaimGroupById(rf, claimGroupId);

    log.info("contact request ---=> {} ", claimGroup.contactRequest);

    var query = {
        "query":{
            "bool":{
               "must":[
                    {
                        "term":{
                            "_type":"contactRequest"
                        }
                    },
                    {
                       "term":{
                            "contactRequest": claimGroup.contactRequest
                        }
                    }
                ]
            }
        }
    };

    var queryRes = applications.search.searchManager.search(JSON.stringify(query), 10000, 'profile');

    return queryRes;
}

function findClaimGroupById(rf, claimGroupId) {
    var db = getDB(rf);
    var claimGroup = db.child(claimGroupId);

    return claimGroup;
}

function getClaimedSales(rf, userId){

    var query = {
               "query":{
                  "bool":{
                     "must":[
                        {
                           "exists":{
                              "field":"taggedFromSalesRecordId"
                           }
                        }
                     ]
                  }
               }
            }

    if(userId){
        query.query.bool.must.push(
            {
                "term": {
                    "soldById": userId
                }
            }
        )
    }

    var db = getDB(rf);
    var queryResults = db.search(JSON.stringify(query));


    var claimedSalesIds = [];
    for (var index in queryResults.hits.hits) {
        var hit = queryResults.hits.hits[index];
        var ClaimSalesId = hit.source.taggedFromSalesRecordId;

        claimedSalesIds.push(ClaimSalesId );
    }

    return claimedSalesIds
}

function getUnclaimedSales(rf, dataSeriesName, extraFields, filteringParams, allowMultipleClaims) {
    var claimedSalesIds = []
    if(allowMultipleClaims){
        var cr = services.contactFormService.processContactRequest(rf, {}, {});
        var enteredUser = applications.userApp.findUserResource(cr.profile);
        var userId = enteredUser.userId;
        claimedSalesIds = getClaimedSales(rf, userId);

    }else{
        claimedSalesIds = getClaimedSales(rf, null);
    }

    var primaryMemberShipsIds = []
    var primaryMemberShips = securityManager.currentUser.primaryMemberships
    for(var i=0; i < primaryMemberShips.length; i++){
        primaryMemberShipsIds.push(primaryMemberShips[i].org.id)
    }

    var salesQuery = {
            "stored_fields": [
                "periodFrom",
                "recordId"
            ],
            "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "dataSeriesName": dataSeriesName
                                    }
                                },
                                {
                                    "terms": {
                                        "assignedToOrg": primaryMemberShipsIds
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
        };

    if (extraFields != null) {
        for (var fieldIndex in extraFields) {
            salesQuery.stored_fields.push(extraFields[fieldIndex]);
        }
    }

    /*if (filteringParams != null) {
        for (var filterIndex in filteringParams) {
            var filter = filteringParams[filterIndex];

            salesQuery.query.bool.must.push(filter);
        }
    } */

    var sm = applications.search.searchManager;
    var salesDataResp = sm.search(JSON.stringify(salesQuery), 'dataseries');

    var data = [];

    for (var index in salesDataResp.hits.hits) {
        var hit = salesDataResp.hits.hits[index];
        var record = {
            "periodFrom": hit.fields.periodFrom.value,
            "recordId": hit.fields.recordId.value.toString()
        };

        if (extraFields != null) {
            for (var fieldIndex in extraFields) {
                if(hit.fields[extraFields[fieldIndex]]){
                    record[extraFields[fieldIndex]] = hit.fields[extraFields[fieldIndex]].value;
                }
            }
        }

        data.push(record);
    }

    return data;
}

function getclaimedSales(rf, dataSeriesName, extraFields, filteringParams) {
    var userId = securityManager.currentUser.userId
    var claimedSalesIds = getClaimedSales(rf, userId);

    var primaryMemberShipsIds = []
    var primaryMemberShips = securityManager.currentUser.primaryMemberships
    for(var i=0; i < primaryMemberShips.length; i++){
        primaryMemberShipsIds.push(primaryMemberShips[i].org.id)
    }

    var salesQuery = {
            "stored_fields": [
                "periodFrom",
                "recordId"
            ],
            "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "dataSeriesName": dataSeriesName
                                    }
                                },
                                {
                                    "terms": {
                                        "recordId": claimedSalesIds
                                    }
                                },
                                {
                                    "terms": {
                                        "assignedToOrg": primaryMemberShipsIds
                                    }
                                }/*,
                                {
                                    "range": {
                                        "periodFrom": {
                                            "gte": formatter.formatDate(queryManager.commonStartDate),
                                            "lte": formatter.formatDate(queryManager.commonFinishDate),
                                            "format":"dd/MM/yyyy"
                                        }
                                    }
                                }*/
                            ]
                        }
                    },
            "size": 10000
        };

    if (extraFields != null) {
        for (var fieldIndex in extraFields) {
            salesQuery.stored_fields.push(extraFields[fieldIndex]);
        }
    }

    /*if (filteringParams != null) {
        for (var filterIndex in filteringParams) {
            var filter = filteringParams[filterIndex];

            salesQuery.query.bool.must.push(filter);
        }
    } */

    var sm = applications.search.searchManager;
    var salesDataResp = sm.search(JSON.stringify(salesQuery), 'dataseries');

    var data = [];

    for (var index in salesDataResp.hits.hits) {
        var hit = salesDataResp.hits.hits[index];
        var record = {
            "periodFrom": hit.fields.periodFrom.value,
            "recordId": hit.fields.recordId.value.toString()
        };

        if (extraFields != null) {
            for (var fieldIndex in extraFields) {
                record[extraFields[fieldIndex]] = hit.fields[extraFields[fieldIndex]].value;
            }
        }

        data.push(record);
    }

    return data;
}

function imageClaim(page, params, files) {
    log.info('imageClaim(): {}, {}', page, params);

    var scanJobId;
    var uploadedFiles = uploadFile(page, params, files);
    if (uploadedFiles.length > 0) {
        scanJobId = services.ocrManager.scanToTable(uploadedFiles[0].hash);
        log.info('imageClaim(): scanJobId {}', scanJobId);

        /**
         * Create Claim
         */
        try {
            var rf = page;
            var org = rf.organisation;
            var db = getDB(rf);

            transactionManager.runInTransaction(function () {
                var enteredUser = securityManager.currentUser;
                var now = formatter.formatDateISO8601(formatter.now, org.timezone);
                var custProfileBean = enteredUser.extProfileBean;

                var claimId = 'claim-' + scanJobId;
                log.info('imageClaim(): claimId {}', claimId);

                var claimObj = {
                    recordId: claimId,
                    enteredDate: now,
                    modifiedDate: now,
                    status: RECORD_STATUS.NEW,
                    receipt: '/_hashes/files/' + uploadedFiles[0].hash
                };

                db.createNew(claimId, JSON.stringify(claimObj), TYPE_RECORD);
                eventManager.goalAchieved("claimSubmittedGoal", {"claim": claimId});
                eventManager.goalAchieved("claimProcessedGoal", custProfileBean, {"claim": claimId, 'status': RECORD_STATUS.NEW});

                var claimItems = [
                    {amount: 1, productSku: null, soldDate: null}
                ];

                createClaimItem(db, claimObj, claimItems);
            });
        } catch (e) {
            log.error('imageClaim(): Error when saving claim: ' + e, e);
            return views.jsonResult(false, "Error saving claim: " + e);
        }
    }
    return views.jsonResult(true, "Submitted job ID " + scanJobId);
}

function createClaimItem(db, claimObj, claimItems){
    log.info('imageClaim(): claimId {}, createClaimItem()', claimObj.recordId);

    var enteredUser = securityManager.currentUser;
    var soldBy = enteredUser.name;
    var soldById = enteredUser.userId;

    for(counter = 0; counter < claimItems.length; counter++){
        var claimItem = claimItems[counter];

        var claimItemObj = {};

        claimItemObj.recordId = 'claimItem-' + generateRandomText(32);
        claimItemObj.claimRecordId = claimObj.recordId;

        claimItemObj.modifiedDate = claimObj.modifiedDate;
        claimItemObj.soldBy = soldBy;
        claimItemObj.soldById = soldById;

        claimItemObj.amount = claimItem.amount;
        claimItemObj.productSku = claimItem.productSku;
        claimItemObj.soldDate = claimItem.soldDate;

        if(claimItem.hasOwnProperty('soldBy')){
            claimItemObj.soldBy = claimItem.soldBy;
        }
        if(claimItem.hasOwnProperty('soldById')){
            claimItemObj.soldById = claimItem.soldById;
        }

        db.createNew(claimItemObj.recordId, JSON.stringify(claimItemObj), TYPE_CLAIM_ITEM);
    }
}