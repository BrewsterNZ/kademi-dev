controllerMappings
    .websiteController()
    .enabled(true)
    .isPublic(false)
    .path('/leadOrgTypes')
    .addMethod('GET', 'getLeadOrgTypes')
    .postPriviledge("READ_CONTENT")
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