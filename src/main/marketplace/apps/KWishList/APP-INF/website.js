function getWishList(page, params) {
    if (securityManager.currentUser) {
        var db = getDB(page);
        var websiteName = page.find('/').websiteName;
        var user = securityManager.currentUser.userId;
        var queryJson = {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                user: user
                            }
                        },
                        {
                            term: {
                                website: websiteName
                            }
                        }
                    ]
                }
            },
            size: 100
        }

        var searchResult = db.search(JSON.stringify(queryJson));

        page.attributes.wishList = searchResult;
    }
}

function isInWishList(page, product, store) {
    if (securityManager.currentUser) {
        var db = getDB(page);
        var user = securityManager.currentUser.userId;
        var websiteName = page.find('/').websiteName;
        var recordId = [websiteName, user, store, product].join('-');
        var res = db.child(recordId);
        return !formatter.isNull(res);
    }

    return false;
}

function toggleWishList(page, params) {
    log.info('toggleWishList {}', params.toggleWishList);
    if (securityManager.currentUser){
        var db = getDB(page);
        var user = securityManager.currentUser.userId;
        var product = params.product;
        var store = params.store;
        var path = params.path;
        var websiteName = page.find('/').websiteName;
        var recordId = [websiteName, user, store, product].join('-');
        var res = db.child(recordId);
        if (res) {
            res.delete();
        } else {
            var json = {
                user: securityManager.currentUser.userId,
                product: product,
                store: store,
                path: path,
                website: websiteName
            };
            db.createNew(recordId, JSON.stringify(json), 'record');
        }

        return views.jsonResult(true);
    }


    return views.jsonResult(false);
}