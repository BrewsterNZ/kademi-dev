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
        .addMethod('POST', 'saveProductClaim')
        .enabled(true)
        .build();



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
        transactionManager.runInTransaction(function () {
            var cr = contactFormService.processContactRequest(page, params, files);
            var enteredUser = applications.userApp.findUserResource(cr.profile);

            var amount = +params.amount;
            if (isNaN(amount)) {
                result.status = false;
                result.messages = ['Amount must be digits'];
                return views.jsonObjectView(JSON.stringify(result));
            }

            var tempDateTime = params.soldDate;
            var soldDateTmp = formatter.parseDate(tempDateTime);
            var soldDate = formatter.formatDateISO8601(soldDateTmp, org.timezone);
            log.info('saveProductClaim > soldDate={}', soldDate);
            var now = formatter.formatDateISO8601(formatter.now, org.timezone);

            // Save each provided product, possibly validating against existing data
            // model-number, indoor-model-number, indoor-serial-number

            var id = 'claim-' + generateRandomText(32);
            var obj = {
                recordId: id,
                enteredDate: now,
                modifiedDate: now,
                status: RECORD_STATUS.NEW
            };

            securityManager.runAsUser(enteredUser, function () {
                db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
                eventManager.goalAchieved("claimSubmittedGoal", {"claim": id});
            });
        });

    } catch (e) {
        log.error('Error when saving claim: ' + e, e);
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result));
}