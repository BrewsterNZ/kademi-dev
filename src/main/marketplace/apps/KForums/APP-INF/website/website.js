/**
 * 
 * @param {type} currentOrg - if the user is viewing the wall for a particular org/team provide it here, otherwise null
 * @param {type} pageFrom
 * @param {type} pageSize
 * @returns {unresolved}
 */
function doWallSearch(currentOrgId, pageFrom, pageSize) {
    log.info("doWallSearch {} {} {}", currentOrgId, pageFrom, pageSize);

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
    appendCriteria(query, currentOrgId);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'comments');
    log.info("hits", results);
    return results;
}


function appendCriteria(query, currentOrgId) {
    return;
    // TODO: Add constraint to limit to posts from current user and followers
    var must = [
        {"term": {"forumId": currentOrgId}}
    ];

    query.query = {
        "bool": {
            "must": must
        }
    };

}