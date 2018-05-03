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

function validateProductClaim(page, params, files) {
    var result = {
        status: true
    };
    log.info('----> here');
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

function createClaim(page, params, files) {
    log.info('createClaim > page={}, params={}', page, params);

    var result = {
        status: true
    };

    var org = page.organisation;

    try {
        var currentRoles = securityManager.getRoles();
        log.info('currentRoles={}', currentRoles);

        var db = getDB(page);
        var id = 'claim-' + generateRandomText(32);

        var amount = +params.amount;
        if (isNaN(amount)) {
            result.status = false;
            result.messages = ['Amount must be digits'];
            return views.jsonObjectView(JSON.stringify(result));
        }

        var tempDateTime = params.soldDate;
        var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
        var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
        var soldDateTmp = formatter.parseDate(tempDateTime);
        var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);
        log.info('createClaim > soldDate={}', soldDate);
        var now = formatter.formatDateISO8601(formatter.now, org.timezone);

        var obj = {
            recordId: id,
            soldBy: params.soldBy,
            soldById: params.soldById,
            amount: amount,
            soldDate: soldDate,
            enteredDate: now,
            modifiedDate: now,
            productSku: params.productSku || '',
            status: RECORD_STATUS.NEW
        };

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
            if (params.email) {
                log.info('Anonymous with email={}, firstName={}', params.email, params.firstName);
                var enteredUser = applications.userApp.findUserResource(params.email);

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

            securityManager.runAsUser(enteredUser, function () {
                db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
                eventManager.goalAchieved("claimSubmittedGoal", {"claim": id});
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
            var amount = +params.amount;
            if (isNaN(amount)) {
                result.status = false;
                result.messages = ['Amount must be digits'];
                return views.jsonObjectView(JSON.stringify(result));
            }

            var tempDateTime = params.soldDate;
            var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
            var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
            var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
            var now = formatter.formatDateISO8601(formatter.now);

            var obj = {
                recordId: id,
                soldBy: claim.jsonObject.soldBy,
                soldById: claim.jsonObject.soldById,
                amount: amount,
                soldDate: soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: now,
                productSku: params.productSku || '',
                status: claim.jsonObject.status,
                receipt: claim.jsonObject.receipt
            };

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
            //var productModelNumber = params["prod"+ (i+1) +"-model-number"];
            //var productIndoorModelNumber = params["prod"+ (i+1) +"-indoor-model-number"];
            var productIndoorSerialNumber = params["prod"+ (i+1) +"-indoor-serial-number"];
            
            indoorSerialNumbersToCheck[indoorSerialNumbersToCheck.length] = productIndoorSerialNumber;
            
            var salesDataExtraFields = formatter.newMap();
            salesDataExtraFields.put("serial-no", productIndoorSerialNumber);

            var salesDataRecord = salesDataApp.findDataPoint(salesDateSeries, null, null, salesDataExtraFields);
            
            if(salesDataRecord == null){
                log.error('Sales Data record with serial number: ' + productIndoorSerialNumber +' not found');
                result.status = false;
                result.messages = ['Invalid products indoor serial number: ' + productIndoorSerialNumber];
                
                return views.jsonObjectView(JSON.stringify(result));
            }
            
            log.info("Claim Products data - input: {} - output: {} , {}", productIndoorSerialNumber, salesDataRecord.id, salesDataRecord.productSku);
            productsSKUs.push(salesDataRecord.productSku);
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
                    amount: 1,
                    status: RECORD_STATUS.NEW,
                    productSku: productsSKUs[i],
                    soldDate: soldDate,
                    soldBy: soldBy,
                    soldById: soldById,
                    claimGroupId: claimGroupId
                };
    
                securityManager.runAsUser(enteredUser, function () {
                    db.createNew(claimId, JSON.stringify(claimObj), TYPE_RECORD);
                    eventManager.goalAchieved("claimSubmittedGoal", {"claim": claimId});
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