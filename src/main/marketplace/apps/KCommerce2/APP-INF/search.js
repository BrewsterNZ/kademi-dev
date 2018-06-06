

/**
 * Returns the ES result object
 *
 * @param {type} store
 * @param {type} category
 * @param {type} query
 * @returns {unresolved}
 */
function productSearch(store, category, query, attributePairs, pageFrom, pageSize) {
    
    // TODO: Pagination
    if (!pageFrom || isNaN(pageFrom)){
        pageFrom = 0;
    } else {
        pageFrom = parseInt(pageFrom);
    }
    if (!pageSize || isNaN(pageSize)){
        pageSize = 12;
    } else {
        pageSize = parseInt(pageSize);
    }
    var queryJson = {
        "stored_fields": [
            "name",
            "path",
            "finalCost",
            "storeId",
            "title",
            "webName",
            "primaryImageHref",
            "content"
        ],
        "from": pageFrom,
        "size": pageSize,
        "aggregations": {
            "maxPrice": {"max": {"field": "finalCost"}},
            "minPrice": {"min": {"field": "finalCost"}},
            "attNames": {"terms": {"field": "attributeNames"}},
        }
    };

    appendCriteria(queryJson, store, category, query, attributePairs);

    var queryText = JSON.stringify(queryJson);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'ecommercestore');

    return results;
}

function findAttributesQuery(store, category, query, minPrice, maxPrice, numBuckets, attNameBuckets) {
    var width = ((maxPrice + 10) - minPrice) / numBuckets;

    var ranges = [];
    for (var i = 1; i <= numBuckets; i++) {
        var from = roundDownToNearestTen((width * i));
        var to = roundDownToNearestTen(width * (i + 1));
        ranges.push({
            "from": from,
            "to": to}
        );
    }


    var queryJson = {
        "size": 0,
        "aggs": {
            "priceRanges": {
                "range": {
                    "field": "finalCost",
                    "ranges": ranges
                }
            }
        }
    };
//            "attributes" : {
//                "terms" : {
//                    "field" : "skus.options.paramName"
//                },
//                "aggs" : {
//                    "values" : {
//                        "terms" : {
//                            "field" : "skus.options.optName"
//                        }
//                    }
//                }
//            }
    // Add an aggregation for each attribute name
    var aggs = queryJson.aggs;
    for( var i=0; i<attNameBuckets.length; i++ ) {
        var att = attNameBuckets[i].key;
        log.info("Add att {}", att);
        aggs[att + "Att"] = {
                "terms" : {
                    "field" : att
                }
        };
    }



    appendCriteria(queryJson, store, category, query);

    var s = JSON.stringify(queryJson);
    log.info("price range query {}", s);
    var results = services.searchManager.search(s, 'ecommercestore');
    return results;
}

function roundDownToNearestTen(num) {
    num = formatter.toLong(num / 10);
    return num * 10;
}

/**
 * Get a list of categories
 *
 * If no parent is given returns a list of top level cats, otherwise returns child cats
 * of the given cat
 *
 * In either case only categories with products are returned
 *
 * @param {type} store
 * @param {type} parentCategory
 * @returns {undefined}
 */
function listCategories(store, parentCategory) {
    // todo: limit this to only cats with products in the store
    // ideally we'd have an ES index just for this as part of ecom
    var crit = services.criteriaBuilders.get("category");
    if (parentCategory == null) {
        crit.isNull("parentCategory");
    } else {
        crit.eq("parentCategory", parentCategory);
    }
    crit.sortAsc("title");
    var list = crit.execute(100);
    log.info("listCategories list={}", list);
    return list;
}

/**
 * Used for the suggestions list
 *
 * @param {type} store
 * @param {type} category
 * @param {type} query
 * @returns {Array|productInCategorySearch.list}
 */
function productInCategorySearch(store, category, query) {
    var queryJson = {
        "size": 0,
        "aggregations": {
            "prods": {
                "terms": {
                    "field": "product"
                },
                "aggs": {
                    "cats": {
                        "terms": {
                            "field": "categoryIds"
                        }
                    }
                }
            }
        }
    };

    appendCriteria(queryJson, store, category, query);

    var queryText = JSON.stringify(queryJson);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'ecommercestore');

    //log.info("cat results {} - {}", results, results.class);
    // need to lookup cat id's to get titles
    var productsAgg = results.aggregations.asMap.prods;
 
    // log.info("prods results {}", productsAgg.buckets);
    var catBuilder = services.criteriaBuilders.getBuilder("category");
    var prodBuilder = services.criteriaBuilders.getBuilder("product");
    var list = [];
    for (var i = 0; i < productsAgg.buckets.size(); i++) {
        var bucket = productsAgg.buckets[i];
        // log.info(" - productsAgg bucket {} = {} = {}", bucket, bucket.keyAsNumber, bucket.docCount);
        var id = formatter.toLong(bucket.keyAsNumber);
        var prod = prodBuilder.get(id);
        if (prod != null) {
            var catsAgg = bucket.aggregations.asMap.cats;
            log.info(" - catsAgg {} {}", catsAgg, catsAgg.buckets.size());
            if (catsAgg.buckets.size() > 0) {
                for (var c = 0; c < catsAgg.buckets.size(); c++) {
                    log.info("  -- cat bucket {}", catsAgg.buckets[c]);
                    var catBucket = catsAgg.buckets[c];
                    var catId = formatter.toLong(catBucket.keyAsNumber);
                    var category = catBuilder.get(catId);
                    if (category != null) {
                        list.push({
                            product: prod,
                            category: category,
                            count: catBucket.docCount,
                            searchPath: searchPath(store, prod, category)
                        })
                    }
                }
            } else {
                list.push({
                    product: prod,
                    count: bucket.docCount,
                    searchPath: searchPath(store, prod)
                })
            }
        }
    }
    return list;
}


function appendCriteria(queryJson, store, category, query, attributePairs) {
    // todo filter by store and category
    var must = [
        {"term": {"storeId": store.id}}
    ];
    if (category != null) {
        must.push({"term": {"categoryIds": category.id}});
    }
    queryJson.query = {
        "bool": {
            "must": must
        }
    };
    if (query != null) {
        must.push({
            "multi_match": {
                "query": query,
                "fields": ["name^2", "title^2", "tags", "productCode^3", "supplierName", "content"],
                "type": "phrase_prefix"
            }
        });
    }
    log.info("appendCriteria {}", attributePairs);
    if( attributePairs != null ) {
        log.info("appendCriteria {}", attributePairs.length);
        for( var i=0; i<attributePairs.length; i++) {
            var nvp = attributePairs[i];
            log.info("appendCriteria {} {} {}", i, nvp.name, nvp.value);
            var term = {};
            term[nvp.name] = nvp.value;
            must.push({"term": term});
        }
    }
}

function searchPath(store, prod, category) {
    var path = "/" + store.name + "/";
    if (category != null) {
        path += category.name; // todo, support sub-cats
    }
    path += "/?q=" + prod.title;
    return path;
}