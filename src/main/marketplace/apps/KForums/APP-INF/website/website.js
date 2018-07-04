function doWallSearch(forum, pageFrom, pageSize) {
    log.info("doWallSearch", forum.id, pageFrom, pageSize);

    var query = {
        "stored_fields": [
            "name",
            "title",
            "postId",
            "content",
            "relatedAppName",
            "relatedId",
            "profileId",
            "postDate",
            "numInteractions"
        ],
        "from": pageFrom,
        "size": pageSize,
        "sort": [
            {
                "postDate": {
                    "order": "DESC"
                }
            }
        ],
    };
    appendCriteria(query, forum);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'forumPost');
    return results;
}


function appendCriteria(query, forum) {
    // TODO: Add constraint to limit to posts from current user and followers
    var must = [
        {"term": {"forumId": forum.id}}
    ];

    query.query = {
        "bool": {
            "must": must
        }
    };

}