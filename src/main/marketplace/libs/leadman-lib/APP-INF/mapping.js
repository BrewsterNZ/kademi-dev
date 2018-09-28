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

controllerMappings
    .websiteController()
    .enabled(true)
    .isPublic(false)
    .path('/leadProduct')
    .addMethod("GET", "findLeadProducts", "th")
    .addMethod('POST', 'addProduct', "addProduct")
    .addMethod("POST", "removeProduct", "removeProduct")
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

function addProduct(page, params, files, form) {
    var leadId = form.longParam("leadId");
    var prodCode = form.cleanedParam("addProduct");
    var p = services.catalogManager.findProductByName(prodCode);
    if( p == null) {
        return views.jsonResult(false, "Couldnt find product " + prodCode);
    }
    var lead = services.criteriaBuilders.getBuilder("lead").get(leadId);
    if( lead == null ) {
        return views.jsonResult(false, "Couldnt find lead " + leadId);
    }
    var lp;
    transactionManager.runInTransaction(function () {
        lp = lead.addProduct(p);
    });
    return views.jsonResult(true, "Added lead product ID=" + lp.id);
}

function removeProduct(page, params, files, form) {
    var leadId = form.longParam("leadId");
    var prodCode = form.cleanedParam("removeProduct");
    var p = services.catalogManager.findProductByName(prodCode);
    if( p == null) {
        return views.jsonResult(false, "Couldnt find product " + prodCode);
    }
    var lead = services.criteriaBuilders.getBuilder("lead").get(leadId);
    if( lead == null ) {
        return views.jsonResult(false, "Couldnt find lead " + leadId);
    }
    transactionManager.runInTransaction(function () {
        lead.removeProduct(p);
    });
    return views.jsonResult(true, "Removed lead product ID=" + p.id);
}

function findLeadProducts(page, params, files, form) {
    log.info('findLeadProducts {}');
    var query = params.q;
    var queryJson = {
        query: {
            "match_all": {}
        },
        size: 15
    };
    if (query){
        queryJson.query = {
            bool: {
                must: {
                    "multi_match": {
                        "query": query,
                        "fields": ["name^2", "title^2", "webName^3", "supplierTitle"],
                        "type": "phrase_prefix"
                    }
                }
            }
        }
    }
    var queryText = JSON.stringify(queryJson);
    log.info('findLeadProducts query {}', queryText);
    var results = services.searchManager.search(queryText, 'products');
    var arr = [];
    for (var i in results.hits.hits){
        var product = results.hits.hits[i];
        arr.push({name: product.source.name, id: product.source.id, title: product.source.title, supplier: product.source.supplierTitle});
    }
    return views.jsonObjectView(JSON.stringify({status: true, data: arr}));
}