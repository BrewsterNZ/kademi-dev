/**
 * 
 * @param {type} currentOrg - if the user is viewing the wall for a particular org/team provide it here, otherwise null
 * @param {type} pageFrom
 * @param {type} pageSize
 * @returns {unresolved}
 */
function doWallSearch(page, contentId, pageFrom, pageSize) {
    log.info("doWallSearch {} {} {}", contentId, pageFrom, pageSize);
    
    var profile;
    
    if (page.attributes.participantId) {
       profile = applications.userApp.findUserResourceById(page.attributes.participantId).thisProfile;
    }

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
        ]
    };
    appendWallCriteria(query, contentId, profile);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'comments');
    log.info("hits", results);
    return results;
}

/**
 * 
 * @param {type} currentOrg - if the user is viewing the wall for a particular org/team provide it here, otherwise null
 * @param {type} pageFrom
 * @param {type} pageSize
 * @returns {unresolved}
 */
function doOrgWallSearch(currentOrgId, pageFrom, pageSize) {
    log.info("doOrgWallSearch {} {} {}", currentOrgId, pageFrom, pageSize);

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
        ]
    };
    appendOrgWallCriteria(query, currentOrgId, securityManager.currentUser.thisProfile);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'comments');
    log.info("hits", results);
    return results;
}

/**
 * 
 * @param {type} currentOrg - if the user is viewing the wall for a particular org/team provide it here, otherwise null
 * @param {type} pageFrom
 * @param {type} pageSize
 * @returns {unresolved}
 */
function doPostsFeedSearch(currentOrgId, pageFrom, pageSize) {
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
        ]
    };
    appendPostsFeedCriteria(query, currentOrgId, securityManager.currentUser.thisProfile);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'comments');
    log.info("hits", results);
    return results;
}

function appendWallCriteria(query, contentId, profile) {
    log.info("appendCriteria: {}", contentId);
    
    var profiles = [];
    
    if (profile) {
        profiles.push(profile.id);
    }
    
    var queryBody = {
            "should": [
                {
                    "term": {
                        "contentId": contentId
                    }
                },
                {
                    "terms": {
                        "taggedProfileIds": profiles
                    }
                }
            ],
            "minimum_should_match": 1
        };

    query.query = {
        "bool": queryBody
    };

}

function appendOrgWallCriteria(query, currentOrgId, profile) {
    log.info("appendCriteria: {}", currentOrgId);
    var orgs = [];
    
    if (currentOrgId == null) {
        orgs = [];
        var list = findTeamOrgs(profile);
        for (var i = 0; i < list.size(); i++) {
            orgs.push(list.get(i).id);
        }
    } else {
        orgs.push(currentOrgId);
    }
    
    log.info("appendCriteria: {}", orgs);
    
    var must = [
        {"terms": {"teamOrgId": orgs}}
    ];

    query.query = {
        "bool": {
            "must": must
        }
    };

}

function appendPostsFeedCriteria(query, currentOrgId, profile) {
    log.info("appendCriteria: {}", currentOrgId);
    var orgs = [];
    
    if (currentOrgId == null) {
        orgs = [];
        var list = findTeamOrgs(profile);
        for (var i = 0; i < list.size(); i++) {
            orgs.push(list.get(i).id);
        }
    } else {
        orgs.push(currentOrgId);
    }
    
    log.info("appendCriteria: {}", orgs);

    query.query = {
        "bool": {
            "should": [
                {
                    "terms": {
                        "teamOrgId": orgs
                    }
                },
                {
                    "terms": {
                        "profileId": [profile.id]
                    }
                },
                {
                    "terms": {
                        "taggedProfileIds": [profile.id]
                    }
                }
            ],
            "minimum_should_match": 1
        }
    };

}