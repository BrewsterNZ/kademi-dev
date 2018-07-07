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

function resolveTeam(page, groupName, teamOrgId) {
    var teamOrg = page.find("/").orgData.childOrg(teamOrgId);
    return teamOrg;
}

function post(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var newPost = form.cleanedParam("newPost");
        var teamOrgId = form.longParam("teamOrgID"); // nullable, long
        var teamOrg = null;
        services.forumManager.post(teamOrgId, newPost);

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