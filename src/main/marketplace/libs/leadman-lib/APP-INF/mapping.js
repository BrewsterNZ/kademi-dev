controllerMappings
    .websiteController()
    .enabled(true)
    .isPublic(false)
    .path('/leadOrgType')
    .addMethod('GET', 'getLeadOrgTypes')
    .addMethod('POST', 'newOrgType', "newOrgType")
    .addMethod('POST', 'addOrgType', "addOrgType")
    .addMethod('POST', 'removeOrgType', "removeOrgType")
    .postPriviledge("READ_CONTENT")
    .addType("leadManResource") // this is so the SalesRole will apply
    .build();

controllerMappings
    .websiteController()
    .enabled(true)
    .isPublic(false)
    .path('/leadCompany')
    .addMethod('POST', 'newCompany', "newCompany")
    .postPriviledge("READ_CONTENT")
    .addType("leadManResource") // this is so the SalesRole will apply
    .build();


function getLeadOrgTypes(page, params) {
    log.info('getLeadOrgTypes {} {}', page, params);

    var orgTypes = page.find('/').orgTypes;
    var arr = [];
    for (var i in orgTypes){
        arr.push({name: orgTypes[i].name, displayName: orgTypes[i].displayName});
    }
    return views.textView(JSON.stringify(arr), "application/json");
}

function addOrgType(page, params) {
    log.info('addOrgType {} {}', page, params);
    var addOrgType = params.addOrgType;
    var orgId = params.orgId;
    if (addOrgType && orgId){
        var rootFolder = page.find('/');
        rootFolder.addOrgType(orgId, addOrgType);
        return views.jsonObjectView({status: true});
    }

    return views.jsonObjectView({status: false});
}

function newOrgType(page, params) {
    log.info('newOrgType {} {}', page, params);
    var newOrgType = params.newOrgType;
    var orgId = params.orgId;
    if (newOrgType && orgId){
        var name = newOrgType.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-");
        var rootFolder = page.find('/');
        var orgType = rootFolder.createOrgType(name, newOrgType);
        if (orgType){
            rootFolder.addOrgType(orgId, orgType.name);
            return views.jsonObjectView({status: true});
        }
    }
    return views.jsonObjectView({status: false});
}

function removeOrgType(page, params) {
    log.info('removeOrgType {} {}', page, params);
    var removeOrgType = params.removeOrgType;
    var orgId = params.orgId;
    if (removeOrgType && orgId){
        var rootFolder = page.find('/');
        rootFolder.removeOrgType(orgId, removeOrgType);
        return views.jsonObjectView({status: true});
    }

    return views.jsonObjectView({status: false});
}

function newCompany(page, params) {
    log.info('newCompany {} {}', page, params);
    var newCompany = params.newCompany;
    if (newCompany){
        var orgId = newCompany.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-");
        var rootFolder = page.find('/');
        transactionManager.runInTransaction(function () {
            var org = services.organisationManager.createOrg(null, orgId, newCompany);
            if (org){
                var ortType = applications.leadMan.leadsOrgType;
                rootFolder.addOrgType(org.orgId, ortType.name);
            }
        });
        return views.jsonObjectView({status: true});
    }
    return views.jsonObjectView({status: false});
}