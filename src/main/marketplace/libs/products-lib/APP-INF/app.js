function findTopPurchased(displayedItems, startDate, endDate) {
    var queryJson = {
        "stored_fields": ["productName", "productTitle", "quantity"],
        "size": 10000,
        "sort": [
            {
                "orderedDate": "desc"
            }
        ],
        "aggregations": {
            "productName": {
                "terms": {
                    "field": "productName",
                    "size": displayedItems,
                    "order": [
                        {
                            "totalQuantity": "desc"
                        }
                    ]
                },
                "aggs": {
                    "totalQuantity": {
                        "sum": {
                            "field": "quantity"
                        }
                    },
                    "productTitleHit": {
                        "top_hits": {
                            "_source": {
                                "includes": [
                                    "productTitle"
                                ]
                            },
                            "size" : 1
                        }
                    }
                }
            }
        },
        "query": {
            "bool": {
                "must": [
                    {
                        "type": {
                            "value": "productorder"
                        }
                    }
                ]
            }
        }
    };
    
    if (startDate && endDate) {
        queryJson.query.filtered.filter.bool.must.push({
            "range": {
                "orderedDate": {
                    "gte":  new Date(formatter.formatDateISO8601(startDate)).toISOString(),
                    "lte": new Date(formatter.formatDateISO8601(endDate)).toISOString()
                }
            }
        });
    }
    
    var searchResults = services.searchManager.search(JSON.stringify(queryJson), "productorders");
    
    return searchResults;
}