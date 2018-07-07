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



function post(page, params, files, form) {
    transactionManager.runInTransaction(function () {
        var newPost = form.cleanedParam("newPost");
        services.forumManager.post( newPost);

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