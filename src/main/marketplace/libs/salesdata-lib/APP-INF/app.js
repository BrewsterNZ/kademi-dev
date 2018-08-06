controllerMappings.addComponent("salesdata/components", "topSkus", "html", "Shows top SKUs of data series in table format", "Sales data");
controllerMappings.addComponent("salesdata/components", "panelKpiTarget", "html", "Shows total amounts of last and period, KPI Target and an indicator for on track or not", "Sales data");
controllerMappings.addComponent("salesdata/components", "salesTable", "html", "Displays sales data in a table", "Sales data");
controllerMappings.addComponent("salesdata/components", "salesDataCompare", "html", "Displays chart to compare sale amount between last year and current", "Sales data");
controllerMappings.addComponent("salesdata/components", "salesLeaderboardWeb", "html", "Displays sales data leaderboard", "Sales data");
controllerMappings.addComponent("salesdata/components", "onTrackAllKpis", "html", "Shows indicators if the user is on track to achieve all available KPIs", "Sales data");


controllerMappings.addComponent("salesdata/components", "kpiLeaderboardEDM")
        .addType("edm")
        .desc("Shows a leaderboard that includes current participant, for a selected KPI")
        .categories("Sales data")
        .addDefaultAtt("header-bg-color", "#eeeeee")
        .addDefaultAtt("body-bg-color", "#fafafa")
        .addDefaultAtt("cell-padding", "5")
        .build();

controllerMappings
        .websiteController()
        .enabled(true)
        .path('/getTopSkus')
        .addMethod('GET', 'getTopSkus')
        .build();

controllerMappings
        .websiteController()
        .enabled(true)
        .path('/topSkus.csv')
        .addMethod('GET', 'getTopSkusCSV')
        .defaultView(views.textTemplateView('/theme/apps/3mExtraComponents/csv.html', 'text/csv'))
        .build();

controllerMappings
        .adminController()
        .enabled(true)
        .path('/sales-incentives.csv')
        .addMethod('GET', 'exportSalesIncentives')
        .build();


function exportSalesIncentives(page, params) {

    var paginator = formatter.paginator(900).skipToStart(false);
    var query = buildSalesIncentQuery();
    var totalRecs = formatter.safeGet(query.rowCount("count").execute(1), 0);
    paginator.totalRecords(totalRecs);

    query = buildSalesIncentQuery();
    query.sortAsc("createdDate");
    var recs = services.queryManager.newRowsResult();
    var pages = paginator.allPageSearchProps;

    recs.addRow();
    recs.addCell("Allocation ID");
    recs.addCell("Allocation source");
    recs.addCell("Allocation date");
    recs.addCell("Points");
    recs.addCell("Sales record IDs");
    recs.addCell("Sales amount");
    recs.addCell("Sales by");
    recs.addCell("Sales date");
    recs.addCell("Sales series");
    recs.addCell("Product SKU");
    recs.addCell("Sales team");
    recs.addCell("Sales territory");

    formatter.foreach(pages, function (searchProps) {
        log.info("Process page {}", searchProps.startPos);
        var allocs = query.execute(searchProps);

        var mapOfSalesRecs = findSalesRecs(allocs);

        formatter.foreach(allocs, function (alloc) {
            recs.addRow();
            recs.addCell(alloc.id);
            recs.addCell(alloc.source.title);
            recs.addCell(alloc.createdDate);
            recs.addCell(alloc.pointsAmount);
            recs.addCell(alloc.salesDataRecordIds);
            
            var ids = formatter.toList(formatter.split(alloc.salesDataRecordIds));
            var salesRecs = getSalesRecs(mapOfSalesRecs, ids);

            var i = 0;
            formatter.foreach(salesRecs, function (rec) {
                if (i++ > 0) {
                    recs.addRow();
                    recs.addCell("");
                    recs.addCell("");
                    recs.addCell("");
                    recs.addCell("");
                }
                recs.addCell(rec.amount);
                recs.addCell(rec.salesBy.formattedName);
                recs.addCell(rec.periodFrom);
                recs.addCell(rec.series.title);
                recs.addCell(rec.productSku);
                if (rec.salesTeam != null) {
                    recs.addCell(rec.salesTeam.formattedName);
//                    if (formatter.isBlank(rec.salesTeam.organisation.adminDomain)) {
                        recs.addCell(rec.salesTeam.organisation.formattedName);
//                    }
                }
            });
            recs.flush();
        });
    });

    return views.rowsResultCsvView(recs);
}


function getSalesRecs(mapOfSalesRecs, ids) {
    var listOfSalesRecs = formatter.newArrayList();
    formatter.foreach(ids, function (id) {
        id = formatter.toLong(id);
        var rec = mapOfSalesRecs.get(id);
        if (rec == null) {
            rec = services.criteriaBuilders.getBuilder("pointsAllocation").get(id);
            log.info("getSalesRecs: record not found {} map size={} looked up={}", id, mapOfSalesRecs.size(), rec);
        }
        if( rec != null) {
            listOfSalesRecs.add(rec);
        }
    });
    return listOfSalesRecs;
}

/**
 * Pre-load sales records by ID for performance
 *
 * @param {type} allocs
 * @returns {undefined}
 */
function findSalesRecs(allocs) {
    var listOfIds = formatter.newArrayList();
    for (var i = 0; i < allocs.size(); i++) {
        var alloc = allocs[i];
        var ids = formatter.toList(formatter.split(alloc.salesDataRecordIds));
        formatter.foreach(ids, function (id) {
            listOfIds.add(formatter.toLong(id));
        });
    }
    var salesRecs = services.criteriaBuilders.get("salesDataRecord").in("id", listOfIds).execute(1000);
    var map = formatter.newMap();
    for (var r = 0; r < salesRecs.size(); r++) {
        var rec = salesRecs[r];
        //log.info("Add item to map: {}", rec.id);
        map.put(rec.id, rec);
    }
    return map;
}

function buildSalesIncentQuery() {
    var query = services.criteriaBuilders.get("pointsAllocation")
        .ge("createdDate", services.queryManager.commonStartDate)
        .lt("createdDate", services.queryManager.commonFinishDate);
    return query;
}

function getTopSkusData(page, params) {
    log.info('getTopSkusData > page={}, params={}, queryService={}', page, params, queryService);
    var selectedOrgs = [];

    for (var key in queryService.selectedOrgIds) {
        selectedOrgs.push(queryService.selectedOrgIds[key]);
    }

    var dataSerialName = params.dataSerialName;

    var queryJson = {
        "stored_fields": ["productSku", "amount", "qty"],
        "size": 10,
        "aggregations": {
            "skuCodeShare": {
                "terms": {
                    "field": "productSku",
                    "size": 5,
                    "order": [
                        {
                            "totalPoints": "desc"
                        }
                    ]
                },
                "aggs": {
                    "totalPoints": {
                        "sum": {
                            "field": "amount"
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
                            "value": "dataSeriesRecord"
                        }
                    },
                    {
                        "terms": {
                            "assignedToOrgs": selectedOrgs
                        }
                    },
                    {
                        "terms": {
                            "dataSeriesName": [
                                dataSerialName
                            ]
                        }
                    },
                    {
                        "range": {
                            "amount": {
                                "gt": "0"
                            }
                        }
                    }
                ]
            }
        }
    };

    var displayedItems = params.displayedItems;
    if (displayedItems && $.trim(displayedItems).length > 0) {
        queryJson.aggregations.skuCode = {
            "terms": {
                "field": "productSku",
                "size": params.displayedItems,
                "order": [
                    {
                        "totalPoints": "desc"
                    }
                ]
            },
            "aggs": {
                "totalPoints": {
                    "sum": {
                        "field": "amount"
                    }
                },
                "skuQuantity": {
                    "top_hits": {
                        "_source": {
                            "includes": [
                                "qty"
                            ]
                        },
                        "size": 1
                    }
                }
            }
        };
    }

    var startDate = params.startDate;
    var endDate = params.endDate;
    if (startDate && endDate) {
        queryJson.query.bool.must.push({
            "range": {
                "periodFrom": {
                    "gte": new Date(formatter.formatDateISO8601(startDate)).toISOString(),
                    "lte": new Date(formatter.formatDateISO8601(endDate)).toISOString()
                }
            }
        });
    }

    var query = params.query;
    if (query && $.trim(query).length > 0) {
        queryJson.query.bool.must.push({
            'multi_match': {
                "query": query,
                "type": "cross_fields",
                "fields": ["productSku"]
            }
        });
    }

    var queryString = JSON.stringify(queryJson);
    log.info('Query String: {}', queryString);


    var searchResults = applications.search.searchManager.search(queryString, "dataseries");
    // log.info('Search results: {}', searchResults);

    return searchResults;
}

function getTopSkus(page, params) {
    log.info('getTopSkus > page={}, params={}', page, params);

    var searchResults = getTopSkusData(page, params);
    log.info('---------- getTopSkus searchResults > {}', searchResults);
    var productsApp = applications.productsApp;
    var buckets = searchResults.aggregations.get('skuCode').buckets;
    var skuMap = {};
    for (var i in buckets) {
        var bucket = buckets[i];
        var prodSku = productsApp.getProductSku(bucket.key);
        if (prodSku) {
            skuMap[bucket.key] = prodSku.title;
        } else {
            skuMap[bucket.key] = bucket.key;
        }
    }
    var json = {
        skuMap: skuMap,
        searchResults: searchResults.toString()
    }
    return views.jsonObjectView(json);
}

function getTopSkusCSV(page, params) {
    log.info('getTopSkusCSV > page={}, params={}', page, params);

    var searchResults = getTopSkusData(page, params);
    var csvLines = formatter.newArrayList();

    // CSV Headers
    var headers = formatter.newArrayList();
    // headers.add('Category');
    headers.add('Item/SKU');
    headers.add('Product');
    headers.add('Sales');
    csvLines.add(headers);
    var buckets = searchResults.aggregations.get('skuCode').buckets;
    var productsApp = applications.productsApp;
    for (var i in buckets) {
        var bucket = buckets[i];

        var values = formatter.newArrayList();
        // values.add(safeString(bucket.aggregations.get('skuCategory').hits.hits[0].source.category));
        values.add(safeString(bucket.key));
        var prodSku = productsApp.getProductSku(bucket.key);
        if (prodSku) {
            values.add(prodSku.title);
        } else {
            values.add(safeString(bucket.key));
        }

        values.add(bucket.aggregations.get('totalPoints').value);
        csvLines.add(values);
    }

    page.attributes.csvValues = csvLines;
}

function getLastYearSale(userResource, dataSeries, currentStartDate, currentEndDate) {
    log.info('getLastYearSale > dataSeries={}, currentStartDate={}, currentEndDate={}', dataSeries, currentStartDate, currentEndDate);

    var lastStartDate = formatter.addYears(currentStartDate, -1);
    var lastEndDate = formatter.addYears(currentEndDate, -1);
    var selectedOrgs = [];
    for (var i = 0; i < queryManager.selectedOrgIds.length; i++) {
        selectedOrgs.push(queryManager.selectedOrgIds[i]);
    }

    var query = {
        "stored_fields": [
            "amount",
            "assignedTo",
            "category",
            "country",
            "dateEntered",
            "kpi",
            "kpiName",
            "kpiTitle",
            "orgId",
            "periodFrom",
            "periodTo",
            "assignedToOrgTitle",
            "assignedToOrgs",
            "recordId",
            "tags"
        ],
        "query": {
            "bool": {
                "must": [
                    {
                        "type": {
                            "value": "dataSeriesRecord"
                        }
                    },
                    {
                        "term": {
                            "dataSeriesName": dataSeries
                        }
                    },
                    {
                        "range": {
                            "periodFrom": {
                                "gte": new Date(formatter.formatDateISO8601(lastStartDate)).toISOString(),
                                "lte": new Date(formatter.formatDateISO8601(lastEndDate)).toISOString()
                            }
                        }
                    },
                    {
                        "term": {
                            "profileId": userResource.userId
                        }
                    }
                ]
            }
        },
        "aggs": {
            "totalSales": {
                "sum": {
                    "field": "amount"
                }
            }
        },
        "size": 1
    };

    var queryString = JSON.stringify(query);
    log.info('getLastYearSale > queryString={}', queryString);

    var searchResults = applications.search.searchManager.search(queryString, "dataseries");
    log.info('getLastYearSale > searchResults={}', searchResults);

    return searchResults;
}
