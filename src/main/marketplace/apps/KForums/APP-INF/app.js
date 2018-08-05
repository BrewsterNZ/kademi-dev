controllerMappings.addComponent("KForums/components",
        "socialWall", "html", "Displays a facebook style wall of actitivy", "Forums");


controllerMappings
        .websiteController()
        .path('/kforums')
        .addMethod('POST', 'post', 'newPost')
        .addMethod('POST', 'vote', 'voteId')
        .addMethod('POST', 'replyToPost', 'replyToPostId')
        .addMethod('POST', 'deletePost', 'deletePostId')
        .addMethod('POST', 'deleteVote', 'deleteVotePostId')
        .addMethod('POST', 'reportPost', 'reportPostId')
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
    if (raae.isShareable()) {
        if (raae.contentIds != null && !raae.contentIds.isEmpty()) {
            for (var contentIdIndex in raae.contentIds) {
                var contentId = raae.contentIds[contentIdIndex];
                
                var newItem = services.forumManager.newWallSharedItem(contentId, raae);
                log.info("onShareableItemEvent: Created RAP ID={}", newItem.getId());
            }
        } else {
            var teamOrg = findTeamOrg(raae.sourceProfile);
            var newItem = services.forumManager.newOrgWallSharedItem(teamOrg, raae);
            log.info("onShareableItemEvent: Created RAP ID={}", newItem.getId());
        }
    }
}

function resolveTeam(page, groupName, teamOrgId) {
    var teamOrg = page.find("/").orgData.childOrg(teamOrgId);
    return teamOrg;
}


function post(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var newPost = form.cleanedParam("newPost");
        var wallId = form.rawP("wallId"); // nullable, long
        
        if (wallId == null) {
            var currentUser = securityManager.currentUser;
            
            var teamOrg = findTeamOrg(currentUser.thisProfile);
            
            wallId = "wall-" + teamOrg.id;
        }
        
        var createdPost = services.forumManager.post(wallId, newPost);
        
        var taggedProfiles = form.listLongsParam("taggedProfiles");
        
        for (var profileIdIndex in taggedProfiles) {
            var profileId = taggedProfiles[profileIdIndex];
            var userResource = applications.userApp.findUserResourceById(profileId);
            
            if (userResource != null) {
                services.forumManager.tag(createdPost, userResource.thisProfile, null);
            }
        }
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

function deleteVote(page, params, files, form) {
    var postId = form.longParam("deleteVotePostId");
    
    var post = services.forumManager.findPost(postId);
    var vote = services.forumManager.findVote(post);
    
    var currentUser = securityManager.currentUser;
    
    if (vote == null) {
        return views.jsonView(true, "Deleted Vote");
    }

    if (!longEquality(vote.voterProfile.id, currentUser.thisUser.id)) {
        return views.jsonView(false, "You are not authorized to delete this vote");
    }

    transactionManager.runInTransaction(function () {
        services.forumManager.deleteVote(postId);
    });
    
    return views.jsonView(true, "Deleted Vote");
}

function replyToPost(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var postId = form.longParam("replyToPostId");
        log.info("replyToPost postId={}", postId);
        var text = form.cleanedParam("replyText");

        var createdPost = services.forumManager.replyToPost(postId, text);
        
        var taggedProfiles = form.listLongsParam("taggedProfiles");
        
        for (var profileIdIndex in taggedProfiles) {
            var profileId = taggedProfiles[profileIdIndex];
            var userResource = applications.userApp.findUserResourceById(profileId);
            
            if (userResource != null) {
                services.forumManager.tag(createdPost, userResource.thisProfile, null);
            }
        }
    });
    
    return views.jsonView(true, "Commented");
}

function deletePost(page, params, files, form) {
    var postId = form.longParam("deletePostId");

    var postToDelete = services.forumManager.findPost(postId);

    var currentUser = securityManager.currentUser;

    if (!longEquality(postToDelete.poster.id, currentUser.thisUser.id) && !longEquality(getTopLevelPost(postToDelete).poster.id, currentUser.thisUser.id)) {
        return views.jsonView(false, "You are not authorized to delete this post");
    }

    transactionManager.runInTransaction(function () {
        log.info("deletePost postId={}", postId);

        services.forumManager.deletePost(postToDelete);
    });

    return views.jsonView(true, "Deleted");
}

function reportPost(page, params, files, form) {
    var postId = form.longParam("reportPostId");
    var category = form.rawParam("category");
    var comment = form.rawParam("comment");

    var postToReport = services.forumManager.findPost(postId);
    
    transactionManager.runInTransaction(function () {
        log.info("reportPost: postId={}", postId);

        services.forumManager.report(postToReport, category, page.href, comment);
    });
    
    return views.jsonView(true, "Reported");
}


function findTeamOrgs(profile) {
    var orgTypeSetting = findOrgTypeSetting();
    // Find organisations in memberships with the given type
    var profileBean = services.userManager.toProfileBean(profile);
    var wallOrgs = profileBean.allMemberships().filterByOrgType(orgTypeSetting).toOrgsList();

    // TODO: should integrate with selectedOrg framework

    // Now find the highest hierarchyally
    var orgsList = services.userManager.toOrgList(wallOrgs);
    return orgsList;
}

function findTeamOrg(profile) {
    var orgTypeSetting = findOrgTypeSetting();
    // Find organisations in memberships with the given type
    var profileBean = services.userManager.toProfileBean(profile);
    var wallOrgs = profileBean.allMemberships().filterByOrgType(orgTypeSetting).toOrgsList();

    // TODO: should integrate with selectedOrg framework

    // Now find the highest hierarchyally
    var orgsList = services.userManager.toOrgList(wallOrgs);
    var highest = services.userManager.findHighest(orgsList);
    return highest;
}

function findOrgTypeSetting() {
    return "wall-org"; // todo make this a setting
}

function getTopLevelPost(post) {
    if (post.parent != null) {
        return getTopLevelPost(post.parent);
    }

    return post;
}

function longEquality(number1, number2) {
    return number1 + 0 === number2 + 0;
}