function productSearchAggs(page, store, category, query) {
    if( store == null ) {
        return null;
    }
    // Do aggregation search
    var aggsQuery = {
        "size": 0,
        "aggregations": {
            "maxPrice": {"max": {"field": "finalCost"}},
            "minPrice": {"min": {"field": "finalCost"}},
            "attNames": {"terms": {"field": "attributeNames"}},
            "brands": {"terms": {"field": "brandId"}},
        }
    };
    var facetFields = formatter.newMap();
    page.attributes.facetFields = facetFields;
    var aggs = aggsQuery.aggregations;
    if (aggs != null) {
        var atm = services.assetManager.assetTypeManager;
        var cts = atm.contentTypes;
        if (cts != null) {
            formatter.foreach(cts.assetTypes, function (at) {
                if (atm.is(at, "product")) {
                    if (at.fields) {
                        formatter.foreach(at.fields, function (field) {
                            if (field.facet) {
                                aggs[field.name] = {"terms": {"field": field.name}};
                                facetFields[field.name] = field;
                            }
                        });
                    }
                }
            });
        }
    }

    appendCriteria(aggsQuery, store, category, query, null, null, null, null);
    var aggsQueryText = JSON.stringify(aggsQuery);
    var aggregationResults = services.searchManager.search(aggsQueryText, 'ecommercestore');
    // page.attributes.searchAggs = aggregationResults;
    return aggregationResults;
}

/**
 * Returns the ES result object
 *
 * @param {type} store
 * @param {type} category
 * @param {type} query
 * @returns {unresolved}
 */
function productSearch(page, store, category, query, attributePairs, otherCats, brands, priceRanges, pageFrom, pageSize, sortBy, sortDirection) {
    if( store == null ) {
        return null;
    }
    
    // Do product search with pagination
    if (!pageFrom || isNaN(pageFrom)) {
        pageFrom = 0;
    } else {
        pageFrom = parseInt(pageFrom);
    }
    if (!pageSize || isNaN(pageSize)) {
        pageSize = 12;
    } else {
        // If pageSize is provided from query string, just use it
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
            "content",
            "product",
            "brandId",
            "brandName",
            "brandTitle",
            "supplerName",
            "supplierOrgId"
        ],
        "from": pageFrom,
        "size": pageSize
    };

    appendCriteria(queryJson, store, category, query, attributePairs, otherCats, brands, priceRanges);

    if (!formatter.isNull(sortBy)){
        var sort = {};
        sort[sortBy] = {"order" : sortDirection};
        queryJson.sort = sort;
    }
    var queryText = JSON.stringify(queryJson);
    log.info('query text {}', queryText);
    var results = services.searchManager.search(queryText, 'ecommercestore');

    return results;
}

function findAttributesQuery(store, category, query, minPrice, maxPrice, numBuckets, attNameBuckets) {
    if( store == null ) {
        return null;
    }
    
    var width = ((maxPrice + 10) - minPrice) / numBuckets;

    var ranges = [];
    for (var i = 0; i <= numBuckets; i++) {
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
    for (var i = 0; i < attNameBuckets.length; i++) {
        var att = attNameBuckets[i].key;
//        log.info("Add att {}", att);
        aggs[att + "Att"] = {
            "terms": {
                "field": att
            }
        };
    }



    appendCriteria(queryJson, store, category, query);

    var s = JSON.stringify(queryJson);
    //log.info("price range query {}", s);
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
    //log.info("listCategories list={}", list);
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
    if( store == null ) {
        return null;
    }
    
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
    //log.info("query: {}", queryText);
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
            // log.info(" - catsAgg {} {}", catsAgg, catsAgg.buckets.size());
            if (catsAgg.buckets.size() > 0) {
                for (var c = 0; c < catsAgg.buckets.size(); c++) {
                    // log.info("  -- cat bucket {}", catsAgg.buckets[c]);
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


function appendCriteria(queryJson, store, category, query, attributePairs, otherCategorys, brands, priceRanges) {    
    // todo filter by store and category
    var must = [
        {"term": {"storeId": store.id}}
    ];
    // category is also used in the brand attribute, so match on either
    if (category != null) {
        must.push({
            "bool": {
                "should": [
                    {"term": {"categoryIds": category.id}},
                    {"term": {"brandId": category.id}}
                ]
            }
        });
    }

    // this is a supplemental list of categories
    if (otherCategorys != null ) {
        formatter.foreach(otherCategorys, function (otherCat) {
            must.push({
                "term": {"categoryIds": otherCat.id}
            });
        });
    }

    if (brands != null && brands.size() > 0 )  {

        var arrBrandIds = [];
        formatter.foreach(brands, function (brandCat) {
            arrBrandIds.push( brandCat.id );
        });
        must.push({
            "terms" : { "brandId" : arrBrandIds}
        });
    }


    if (priceRanges != null && priceRanges.length > 0 )  {
        var should = [];
        priceRanges.forEach(function (range) {
            should.push({
                "range" : {
                    "finalCost": {
                        "gte": range.startPrice,
                        "lte": range.endPrice
                    }
                }
            })
        })
        var bool = {
            "bool": {
                "should": should
            }
        }
        must.push(bool);
    }

    queryJson.query = {
        "bool": {
            "must": must
        }
    };
    if (!formatter.isNull(query)) {
        must.push({
            "multi_match": {
                "query": query,
                "fields": ["name^2", "title^2", "tags", "productCode^3", "supplierName", "content"],
                "type": "phrase_prefix"
            }
        });
    }
    if (attributePairs != null) {
        for (var i = 0; i < attributePairs.length; i++) {
            var nvp = attributePairs[i];
            var arr = nvp.value.split(',');
            var terms = {};
            terms[nvp.name] = [];
            arr.forEach(function (item) {
                if (item){
                    terms[nvp.name].push(item);
                }
            });
            must.push({"terms": terms});
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

function getCategoriesInStore(store, cat) {
    var queryJson = {
        query: {
            bool: {
                must: [
                    {
                        term: {
                            storeId: store.id
                        }
                    }
                ]
            }
        },
        aggs: {
            catAggs: {
                terms: {
                    field: "categoryIds",
                    size: 1000
                }
            }
        },
        size: 0
    };

    var cats;
    if (!formatter.isNull(cat)){
        queryJson.query.bool.must.push({
            term: {
                categoryIds: cat.id
            }
        });
        cats = services.criteriaBuilders.get("category").eq("parentCategory", cat).execute(1000);
    } else {
        cats = services.criteriaBuilders.get("category").isNull("parentCategory").execute(1000);
    }

    var queryText = JSON.stringify(queryJson);
    log.info("getCategoriesInStore query: {}", queryText);

    var results = services.searchManager.search(queryText, 'ecommercestore');

    var arr = formatter.newArrayList();
    var buckets = results.aggregations.get("catAggs").buckets;
    for (var i in buckets){
        var buck = buckets[i];

        var catItem = findCatById(cats, buck.key);
        if (catItem) {
            var map = formatter.newMap();
            map.put('category', catItem);
            map.put('totalProducts', buck.docCount);
            arr.add(map);
        }
    }
    return arr;
}

function findCatById(cats, id) {
    for (var i in cats){
        if (cats[i].id.equals(id)) return cats[i];
    }

    return null;
}
