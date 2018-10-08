controllerMappings
    .addReport("userVisitReport", "User Active report", "User Active report", "/theme/apps/reporting/userVisitsReport.html", "generateUserVisitReportCsv", "text/csv", "csv");

controllerMappings
    .addQuery("/APP-INF/queries/userVisit.query.json", ["log"],	["Administrator"]);
controllerMappings
    .addQuery("/APP-INF/queries/userVisits.query.json", ["uservisit"],	["Administrator"]);
controllerMappings
    .addQuery("/APP-INF/queries/userDetailedVisits.query.json", ["log"],[]);
controllerMappings
    .addQuery("/APP-INF/queries/websiteRequests.query.json", ["log"],[]);

controllerMappings.addTableDef("tableUserVisit", "User Visits Table", "loadUserVisits")
    .addHeader("Full name")
    .addHeader("Number of visits")
    .addHeader("Last visit date");

controllerMappings.addTableDef("tableUserDetailedVisits", "User Detailed Visits Table", "loadUserDetailedVisits")
    .addHeader("Visit date")
    .addHeader("Visited page");


controllerMappings.addTableDef("tableWebsiteRequests", "Website requests table", "loadWebsiteRequests")
    .addHeader("Full name")
    .addHeader("Number of visits")
    .addHeader("Last visit date");


function loadUserVisits(start, maxRows, rowsResult, rootFolder) {
    var resp = queryManager.runQuery("userVisits");
    var data = [];
    var byUsers = resp.aggregations.get("byUsers").buckets;
    for (var i in byUsers) {
        var byUser = byUsers[i];
        var top_hit = byUser.aggregations.get("top_hit").hits;
        var ur = applications.userApp.findUserResourceById(byUser.key);
        rowsResult.addRow();
        var link = "<a href='/custs/" + ur.name + "'>" + ur.thisUser.formattedName + "</a>";
        rowsResult.addCell(link);
        rowsResult.addCell(byUser.docCount);
        if (top_hit.totalHits > 0){
            rowsResult.addCell(formatter.formatDate(formatter.toDate(top_hit.hits[0].source.visitDate)));
        } else {
            rowsResult.addCell('');
        }
    }
}



function loadUserDetailedVisits(start, maxRows, rowsResult, rootFolder) {
    var paramsMap = formatter.newMap();
    var profileId = http.request.params.profileId;
    paramsMap.put("prorileId", profileId)
    var resp = queryManager.runQuery("userDetailedVisits", paramsMap);
    for (var index in resp.hits.hits) {
        rowsResult.addRow();

        var userVisit = resp.hits.hits[index];

        rowsResult.addCell(formatter.formatDateTime(formatter.toDate(userVisit.fields.reqDate.value)));
        rowsResult.addCell(userVisit.fields.reqUrl.value);

        rowsResult.flush();
    }
}


function loadWebsiteRequests(start, maxRows, rowsResult, rootFolder) {
    var resp = queryManager.runQuery("websiteRequests");

    rowsResult.addRow();
    for (var i=0; i<resp.hits.hits.length; i++) {
        var hit = resp.hits.hits[i];
        rowsResult.addRow();
        var userName = hit.fields.reqUser;
        rowsResult.addCell(userName);
        rowsResult.addCell(hit.fields.url.value);
        rowsResult.flush();
    }
    rowsResult.setNumRows(resp.hits.totalHits);
    rowsResult.flush();
}
