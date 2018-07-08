controllerMappings.addComponent("KForums/components",
        "socialWall", "html", "Displays a facebook style wall of actitivy", "Forums");


controllerMappings
        .websiteController()
        .path('/kforums')
        .addMethod('POST', 'post', 'newPost')
        .addMethod('POST', 'vote', 'voteId')
        .addMethod('POST', 'replyToPost', 'replyToPostId')
        .enabled(true)
        .build();


controllerMappings
        .websiteController()
        .enabled(true)
        .path('/teams/(?<teamOrgId>[^/]*)/')
        .addPathResolver('teamOrgId', 'resolveTeam')
        .defaultView(views.templateView('/theme/apps/KForums/viewTeamWall.html'))
        .build();

controllerMappings.addEventListenerForType('co.kademi.server.recognition.ShareableItemEvent', true, "onShareableItemEvent");

function onShareableItemEvent(rf, raae) {
    if ( raae.isShareable() ) {
        var teamOrg = findTeamOrg(raae.sourceProfile);
        var newItem = services.forumManager.newWallSharedItem(teamOrg, raae);
        log.info("onShareableItemEvent: Created RAP ID={}", newItem.getId());
    }    
}

function resolveTeam(page, groupName, teamOrgId) {
    var teamOrg = page.find("/").orgData.childOrg(teamOrgId);
    return teamOrg;
}


function post(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var newPost = form.cleanedParam("newPost");
        var teamOrgId = form.longParam("teamOrgId"); // nullable, long
        var teamOrg;
        if( teamOrgId == null ) {
            var currentUser = securityManager.currentUser;
            teamOrg = findTeamOrg(currentUser.thisProfile);
        } else {
            teamOrg = page.find("/").childOrg(teamOrgId);
        }
        services.forumManager.post(teamOrg, newPost);

    });
    return views.jsonView(true, "Posted");
}

function vote(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var postId = form.longParam("voteId");
        var upVote = form.booleanParam("isUp");

        services.forumManager.vote(postId, upVote);
    });
    return views.jsonView(true, "Voted");
}

function replyToPost(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var postId = form.longParam("replyToPostId");
        log.info("replyToPost postId={}", postId);
        var text = form.cleanedParam("replyText");

        services.forumManager.replyToPost(postId, text);
    });
    return views.jsonView(true, "Commented");
}

function findTeamOrgs(profile) {
    var orgTypeSetting = findOrgTypeSetting();
    // Find organisations in memberships with the given type
    var profileBean = services.userManager.toProfileBean(profile);
    var wallOrgs = profileBean.allMemberships().filterByOrgType(orgTypeSetting).toOrgsList();
    
    // TODO: should integrate with selectedOrg framework
    
    // Now find the highest hierarchyally
    var orgsList =  services.userManager.toOrgList(wallOrgs);
    return orgsList;
}

function findTeamOrg(profile) {
    var orgTypeSetting = findOrgTypeSetting();
    // Find organisations in memberships with the given type
    var profileBean = services.userManager.toProfileBean(profile);
    var wallOrgs = profileBean.allMemberships().filterByOrgType(orgTypeSetting).toOrgsList();
    
    // TODO: should integrate with selectedOrg framework
    
    // Now find the highest hierarchyally
    var orgsList =  services.userManager.toOrgList(wallOrgs);
    var highest = services.userManager.findHighest(orgsList);
    return highest;
}

function findOrgTypeSetting() {
    return "wall-org"; // todo make this a setting
}