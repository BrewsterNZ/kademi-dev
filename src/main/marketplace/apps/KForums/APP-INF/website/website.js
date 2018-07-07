/**
 * 
 * @param {type} currentOrg - if the user is viewing the wall for a particular org/team provide it here, otherwise null
 * @param {type} pageFrom
 * @param {type} pageSize
 * @returns {unresolved}
 */
function doWallSearch(currentOrg, pageFrom, pageSize) {
    log.info("doWallSearch", currentOrg, pageFrom, pageSize);
 
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
                    "order": "DESC" // TODO, need to use engagement scoring mechanism
                }
            }
        ],
    };
    appendCriteria(query, currentOrg);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'comments');
    log.info("hits", results);
    return results;
}


function appendCriteria(query, currentOrg) {
    return;
    // TODO: Add constraint to limit to posts from current user and followers
    var must = [
        {"term": {"forumId": currentOrg.id}}
    ];

    query.query = {
        "bool": {
            "must": must
        }
    };

}