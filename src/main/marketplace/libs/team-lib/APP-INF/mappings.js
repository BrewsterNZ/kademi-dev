controllerMappings
    .websiteController()
    .path('/team/(?<member>[^/]*)/')
    .enabled(true)
    .addPathResolver('member', 'resolveMember')
    .title(function (page) {
        return "Team member: " + page.attributes.member.formattedName;
    })
    .defaultView(views.templateView('/theme/apps/team/viewMember.html'))
    .addMethod('GET', 'getTeamMember')
    .addMethod('POST', 'saveMember')
    .build();

controllerMappings
    .websiteController()
    .path('/team/(?<member>[^/]*)')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }

    return views.redirectView(href);
}

function resolveMember(rf, groupName, groupVal, mapOfGroups) {
    log.info('groupVal={}', groupVal);
    if (groupVal && !isNaN(groupVal)){
        var ur = applications.userApp.findUserResourceById(groupVal);
        return ur;
    }
    return null;
}

function getTeamMember(page, params) {
    var profile = page.attributes.member.thisProfile;
    var leads = services.criteriaBuilders.get("lead")
        .eq("assignedToProfile", profile)
        .execute(100);
    page.attributes.leads = leads;
}


function saveMember(page, params) {
    log.info('saveMember={}', page.attributes.member);
    transactionManager.runInTransaction(function () {
        var profile = page.attributes.member.thisProfile;
        log.info('saveMember profile={} params={}', profile, params);
        profile.firstName = params.firstName;
        profile.surName = params.surName;
        profile.nickName = params.nickName;
        profile.phone = params.phone;
        services.userManager.updateUser(profile);
        services.userManager.storeExtrFields(profile, params);

    });
    return views.jsonView(true, "Profile updated");
}