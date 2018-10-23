controllerMappings
    .websiteController()
    .path('/team/(?<member>[^/]*)/')
    .enabled(true)
    .addPathResolver('member', 'resolveMember')
    .title(function (page) {
        return "Team member: " + page.attributes.member.formattedName;
    })
    .defaultView(views.templateView('/theme/apps/team/viewMember.html'))
    .postPriviledge("WRITE_ACL")
    .addMethod('GET', 'getTeamMember')
    .addMethod('POST', 'saveMember')
    //.addType("leadManResource") // this is so the SalesRole will apply
    .addType("userAdminResource") // this is so UserAdminRole and UserViewerRole will apply
    .addType("userAdminLimitedView") // needed so we dont apply a check on the account org
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

    // check the user has useradmin role on any of the teams this user is in
    var teamOrgType = services.organisationManager.getOrgType(applications.team.selectedOrgTypeName);
    var teams = services.teamManager.teamsForUser(page.attributes.member.thisProfile, teamOrgType);
    var roleFound = false;
    var currentUser = securityManager.currentProfile;
    formatter.foreach(teams, function(team) {
        var currentUserRoles = securityManager.findApplicableRoles(team, currentUser);
        if( securityManager.containsRole(currentUserRoles, "User Administrator") ) {
            roleFound = true; 
        }
    });

    if( !roleFound ) {
        return views.jsonView(false, "Permission denied");
    }

    transactionManager.runInTransaction(function () {
        var profile = page.attributes.member.thisProfile;
        log.info('saveMember profile={} params={}', profile, params);
        profile.firstName = params.firstName;
        profile.surName = params.surName;
        profile.nickName = params.nickName;
        profile.phone = params.phone;
        profile.email = params.email;
        services.userManager.updateUser(profile);
        services.userManager.storeExtrFields(profile, params);

    });
    return views.jsonView(true, "Profile updated");
}