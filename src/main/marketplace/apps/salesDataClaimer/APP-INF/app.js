controllerMappings.addQuery("/APP-INF/queries/claimsOverTime.query.json", ["kongo-salesDataClaimer"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/claimsTable.query.json", ["kongo-salesDataClaimer"], ["ReportsViewer"]);

controllerMappings.addComponent("salesDataClaimer/components", "claimsList", "html", "Displays list of claims in table format", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsMade", "html", "Displays a number of claims made", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsPending", "html", "Displays a number of pending claims", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsTotalAmount", "html", "Displays the total amount $ of claims", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimForm", "html", "Displays claim form", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsOverTime", "html", "Displays histogram of claims over time", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsTable", "html", "Table of dealers that shows date of claim, dealer name, product purhcased, sale amount, status i.e. pending or approved", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimRegisterProduct", "html", "Register products form", "Sales Data Claimer");

controllerMappings.addComponent("salesDataClaimer/components", "claimTracking", "html", "Enables check claim status", "Sales Data Claimer");

controllerMappings.addComponent("salesDataClaimer/components", "claimsTag", "html", "Display untagged claims for tagging", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsTagTraining", "html", "Display untagged claims for Training tagging", "Sales Data Claimer");

controllerMappings.addComponent("salesDataClaimer/components", "salesDataImageClaimerForm", "html", "Upload new claim by OCR scanner", "Sales Data Claimer");

controllerMappings.addEventListener('ScanJobEvent', true, 'handleScanJobEvent');

controllerMappings.addTableDef("tableOCRManagerRows", "OCR Manager Rows", "getRows")
        .addHeader("Sales by")
        .addHeader("Date")
        .addHeader("Confidence")
        .addHeader("Row")
        .addHeader("Text");

controllerMappings.addGoalNodeType("claimSubmittedGoal", "salesDataClaimer/claimSubmittedGoalNode.js", "checkSubmittedGoal");

function checkSubmittedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('checkSubmittedGoal > lead={}, funnel={}, eventParams={}, customNextNodes={}, customSettings={}, event={}', lead, funnel, eventParams, customNextNodes, customSettings, event);

    if (customSettings && customSettings.claimType && eventParams.claimType != customSettings.claimType) {
        return false;
    }

    if (eventParams.claimType) {
        attributes.put(CLAIM_TYPE, eventParams.claimType);
    }

    if (eventParams.points) {
        attributes.put("points", eventParams.points);
    }

    if (!lead) {
        attributes.put(LEAD_CLAIM_ID, eventParams.claim);

        return true;
    }

    var claimId = attributes.get(LEAD_CLAIM_ID);

    if (isNotBlank(claimId)) {
        // Process only for this claim ID
        return safeString(eventParams.claim) === safeString(claimId);
    } else {
        attributes.put(LEAD_CLAIM_ID, eventParams.claim);

        return true;
    }

    return false;
}

controllerMappings.addGoalNodeType("claimProcessedGoal", "salesDataClaimer/claimProcessedGoalNode.js", "checkProcessedGoal");

function checkProcessedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('checkProcessedGoal > lead={}, funnel={}, eventParams={}, customNextNodes={}, customSettings={}, event={}, event.parameters={}', lead, funnel, eventParams, customNextNodes, customSettings, event, event.parameters);
    if (!lead) {
        return true;
    }

    var claimId = attributes.get(LEAD_CLAIM_ID);
    var claimStatus = event.parameters.status;

    if (isNull(claimStatus)) {
        claimStatus = RECORD_STATUS.APPROVED;
    } else {
        claimStatus = parseInt(claimStatus);
    }

    var nextNode;

    switch (claimStatus) {
        case RECORD_STATUS.APPROVED: // Approved
        case RECORD_STATUS.APPROVED + '':
            nextNode = customNextNodes.nodeIdApproved || false;
            break;
        case RECORD_STATUS.REJECTED: // Rejected
        case RECORD_STATUS.REJECTED + '':
            nextNode = customNextNodes.nodeIdRejected || false;
            break;
        default:
            nextNode = customNextNodes.nodeIdApproved || false;
    }

    log.info('checkProcessedGoal > status={}', claimStatus);

    if (isNotBlank(claimId)) {
        // Process only for this claim ID
        if (safeString(eventParams.claim) === safeString(claimId)) {
            return nextNode;
        }
    } else {
        attributes.put(LEAD_CLAIM_ID, eventParams.claim);

        return nextNode;
    }

    return false;
}

controllerMappings.addGoalNodeType("claimGroupSubmittedGoal", "salesDataClaimer/claimGroupSubmittedGoalNode.js", "checkGroupSubmittedGoal");

function checkGroupSubmittedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('checkGroupSubmittedGoal > lead={}, funnel={}, eventParams={}, customNextNodes={}, customSettings={}, event={}', lead, funnel, eventParams, customNextNodes, customSettings, event);

    if (!lead) {
        log.info('checkGroupSubmittedGoal > No Lead Found');

        return true;
    }

    //var submitted = false;

    /*if (isNotBlank(claimId)) {
     // Process only for this claim ID
     submitted = safeString(eventParams.claim) === safeString(claimId);
     } else {
     attributes.put(LEAD_CLAIM_GROUP_ID, eventParams.claim);
     
     submitted = true;
     }*/


    log.info('checkGroupSubmittedGoal > Added claim group id {}', eventParams.claimGroup);

    //if (submitted) {
    lead.setFieldValue("claim_group_recordId", eventParams.claimGroup);
    //}

    return true;
}

function initSalesDataClaimerApp(orgRoot, webRoot, enabled) {
    log.info("initApp SalesDataClaimer > orgRoot={}, webRoot={}", orgRoot, webRoot);

    var dbs = orgRoot.find(JSON_DB);
    if (isNull(dbs)) {
        log.error('ERROR: KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }

    var db = dbs.child(DB_NAME);
    if (isNull(db)) {
        log.info('{} does not exist!', DB_TITLE);
        db = dbs.createDb(DB_NAME, DB_TITLE, DB_NAME);

        if (!db.allowAccess) {
            setAllowAccess(db, true);
        }
    }

    saveMapping(db);

    // Default config for app
    if (webRoot) {
        var website = webRoot.website;
        var alertsApp = applications.alerts;

        var claimerGroupName = "sales-claimer";
        var claimerGroup = orgRoot.find("groups").child(claimerGroupName);
        if (claimerGroup == null) {
            claimerGroup = orgRoot.createGroup(claimerGroupName);
            orgRoot.addRoles(claimerGroup, "SalesClaimEditor");
            orgRoot.addRoles(claimerGroup, website, "Content Viewer");
            orgRoot.addGroupToWebsite(claimerGroup, website);
            log.info("Created '" + claimerGroupName + "' group: {}", claimerGroup);

            if (alertsApp) {
                alertsApp.createAdminAlert("Sales Data Claimer", "We've created a group called " + claimerGroup.name + " for Sales Data Claimer. Please be sure to <a href='/groups/" + claimerGroupName + "'>check the settings here</a>. You might want to allow public registration to this group.");
            }
        }

        var claimAdminGroupName = "sales-claim-admin";
        var claimAdminGroup = orgRoot.find("groups").child(claimAdminGroupName);
        if (claimAdminGroup == null) {
            claimAdminGroup = orgRoot.createGroup(claimAdminGroupName);
            orgRoot.addRoles(claimAdminGroup, "SalesClaimAdmin");
            orgRoot.addRoles(claimAdminGroup, website, "Content Viewer");
            orgRoot.addGroupToWebsite(claimAdminGroup, website);
            log.info("Created '" + claimAdminGroupName + "' group: {}", claimAdminGroup);

            if (alertsApp) {
                alertsApp.createAdminAlert("Sales Data Claimer", "We've created a group called " + claimAdminGroup.name + " for Sales Data Claimer. Please be sure to <a href='/groups/" + claimAdminGroupName + "'>check the settings here</a>. You might want to allow public registration to this group.");
            }
        }

        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, claimAdminGroup);

        var dataSeriesName = "sales-claims";
        var dataSeriesTitle = "Sales Claims";
        var dataSeries = orgRoot.find("sales").child(dataSeriesName);
        if (dataSeries == null) {
            dataSeries = applications.salesData.createSeries('sales-claims', dataSeriesTitle, claimerGroup);
            log.info("Created '" + dataSeriesName + "' data series: {}", dataSeries);

            if (alertsApp) {
                alertsApp.createAdminAlert("Sales Data Claimer", "We've created a data series called " + dataSeriesTitle + " for Sales Data Claimer. Please be sure to <a href='/sales/" + dataSeriesName + "'>check the settings here</a>.");
            }
        }

        orgRoot.find('/manageApps/').setAppSetting(APP_NAME, 'dataSeries', dataSeriesName);
    }
}

function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);

    // BM: we must not do this! https://github.com/Kademi/kademi-dev/issues/4987
    if (page.is("apps") == false && page.is("websiteVersion") == false) {
        page = page.find('/manageApps/');
    }

    transactionManager.runInTransaction(function () {
        if (params.dataSeries) {
            var dataSeries = params.dataSeries || '';
            page.setAppSetting(APP_NAME, 'dataSeries', dataSeries);
        }

        if (params.claimTypes) {
            var claimTypes = params.claimTypes || '';
            page.setAppSetting(APP_NAME, 'claimTypes', claimTypes);
        }

        if (params.dataSeries) {
            var allowAnonymous = params.allowAnonymous || '';
            page.setAppSetting(APP_NAME, 'allowAnonymous', allowAnonymous);
        }

        if (params.highConfidenceFrom) {
            page.setAppSetting(APP_NAME, 'highConfidenceFrom', params.highConfidenceFrom);
        }

        if (params.highConfidenceTo) {
            page.setAppSetting(APP_NAME, 'highConfidenceTo', params.highConfidenceTo);
        }

        if (params.mediumConfidenceFrom) {
            page.setAppSetting(APP_NAME, 'mediumConfidenceFrom', params.mediumConfidenceFrom);
        }

        if (params.mediumConfidenceTo) {
            page.setAppSetting(APP_NAME, 'mediumConfidenceTo', params.mediumConfidenceTo);
        }

        if (params.lowConfidenceFrom) {
            page.setAppSetting(APP_NAME, 'lowConfidenceFrom', params.lowConfidenceFrom);
        }

        if (params.lowConfidenceTo) {
            page.setAppSetting(APP_NAME, 'lowConfidenceTo', params.lowConfidenceTo);
        }

        if (params.defaultColumns) {
            page.setAppSetting(APP_NAME, 'defaultColumns', params.defaultColumns);
        }

        if (params.autoRejectThreshold) {
            page.setAppSetting(APP_NAME, 'autoRejectThreshold', params.autoRejectThreshold);
        }
    });

    return views.jsonResult(true);
}


function getAppSettings(page) {
    log.info('getAppSettings > page={}', page);

    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;

    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }

    var app = applications.get(APP_NAME);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }

    return null;
}

function isAnonymousAllowed(page) {
    log.info('isAnonymousAllowed > page={}', page);

    var allowAnonymous = false;
    var settings = getAppSettings(page);

    if (isNotNull(settings)) {
        allowAnonymous = settings.allowAnonymous === 'true';
    }

    return allowAnonymous;
}

function getAutoRejectThreshold(page) {
    log.info('getAutoRejectThreshold > page={}', page);

    var settings = getAppSettings(page);
    if (isNotNull(settings)) {
        var autoRejectThreshold = settings.autoRejectThreshold;
        return safeFloat(autoRejectThreshold);
    }

    return 0;
}

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }

    return views.redirectView(href);
}

controllerMappings.addTableDef("tableClaims", "Table claims", "loadTableClaims")
        .addHeader("Date")
        .addHeader("Dealer")
        .addHeader("Product SKU")
        .addHeader("Amount")
        .addHeader("Status");


function loadTableClaims(start, maxRows, rowsResult, rootFolder) {
    var resp = queryService.runQuery("claimsTable");
    for (var i in resp.hits.hits) {
        rowsResult.addRow();
        var hit = resp.hits.hits[i];
        rowsResult.addCell(formatter.formatDate(formatter.toDate(hit.source.soldDate)));
        var user = applications.userApp.findUserResource(hit.source.soldBy);
        if (user) {
            rowsResult.addCell(user.firstName + " " + user.surName);
        } else {
            rowsResult.addCell("-");
        }
        rowsResult.addCell(hit.source.productSku);
        rowsResult.addCell(hit.source.amount);
        var statusArr = {'0': 'New', '1': 'Approved', '-1': 'Rejected'};
        rowsResult.addCell(statusArr[hit.source.status]);
    }
}

controllerMappings.addTableDef("tableClaimsOverTime", "Claims over time", "loadTableClaimsOverTime")
        .addHeader("Date")
        .addHeader("Total");


function loadTableClaimsOverTime(start, maxRows, rowsResult, rootFolder) {
    var resp = queryService.runQuery("claimsOverTime");
    var buckets1 = resp.aggregations.get('claims_over_time').buckets;
    for (var i in buckets1) {
        rowsResult.addRow();
        rowsResult.addCell(formatter.formatDateISO8601(buckets1[i].key));
        rowsResult.addCell(buckets1[i].aggregations.get('totalAmount').value);
    }
}

function handleScanJobEvent(rf, event) {
    log.info('handleScanJobEvent(): {}', event);
    var autoRejectThreshold = getAutoRejectThreshold(rf);
    var totalConfidence = event.generatedOCRTable.getTotalConfidence();

    var autoReject = totalConfidence < autoRejectThreshold;

    var XMLDocumentString = '<?xml version="1.0" encoding="UTF-8"?>\n';

    XMLDocumentString += '<rows totalConfidence="' + totalConfidence + '">';

    var rows = {
        index: 0,
        iterator: event.generatedOCRTable.getRows().iterator()
    }

    while (rows.iterator.hasNext()) {
        log.info("New row");
        XMLDocumentString += '<row index="' + formatter.toString(rows.index) + '">\n';

        var row = rows.iterator.next();

        var cells = {
            iterator: row.getCells().iterator()
        };

        while (cells.iterator.hasNext()) {
            var cell = cells.iterator.next();
            XMLDocumentString += '<cell>\n';
            XMLDocumentString += '<text>' + formatter.htmlEncode(formatter.toString(cell.text).trim()) + '</text>\n';
            XMLDocumentString += '<confidence>' + formatter.toString(cell.confidence).trim() + '</confidence>\n';
            XMLDocumentString += '</cell>\n';
        }

        rows.index++;
        XMLDocumentString += '</row>\n';
    }

    XMLDocumentString += '</rows>';
    log.info("XMLDocumentString: {}", XMLDocumentString);

//    Dummy XML with multi-columns
//    XMLDocumentString = dummyXML();
//    log.info("XMLDocumentString: {}", XMLDocumentString);

    var XMLDocumentHash = fileManager.upload(XMLDocumentString.getBytes());

    log.info("XMLDocumentHash: {}", XMLDocumentHash);

    /**
     * Update Claim with retrieved Hash
     */
    try {
        var page = rf;
        var id = "claim-" + event.jobId;
        var params = event;
        log.info("id: {}", id);

        var db = getDB(page);
        var claim = db.child(id);

        if (claim !== null) {
            var claimJson = JSON.parse(claim.json);

            claimJson.ocrFileHash = XMLDocumentHash;
            claimJson.modifiedDate = formatter.formatDateISO8601(formatter.now);

            log.info("handleScanJobEvent: obj {} ocrFileHash {}", claimJson.recordId, claimJson.ocrFileHash);

            // Parse extra fields
            var extraFields = getSalesDataExtreFields(page);
            log.info("handleScanJobEvent.2");
            for (var i = 0; i < extraFields.length; i++) {
                var ex = extraFields[i];
                var fieldName = 'field_' + ex.name;

//                obj[fieldName] = params.get(fieldName) || '';
            }
            log.info("handleScanJobEvent.3");

            securityManager.runAsUser(claim.modifiedBy, function () {
                log.info("handleScanJobEvent.4");
                claim.update(JSON.stringify(claimJson), TYPE_RECORD);
            });
            log.info("handleScanJobEvent.5");

            if (autoReject) {
                claimJson.status = RECORD_STATUS.REJECTED;
                claim.save(JSON.stringify(claimJson), TYPE_RECORD);

                var enteredUser = applications.userApp.findUserResourceById(claim.jsonObject.soldById);
                if (isNotNull(enteredUser)) {
                    var custProfileBean = enteredUser.extProfileBean;
                    eventManager.goalAchieved('claimProcessedGoal', custProfileBean, {'claim': id, 'status': RECORD_STATUS.REJECTED});
                } else {
                    eventManager.goalAchieved('claimProcessedGoal', {'claim': id, 'status': RECORD_STATUS.REJECTED});
                }
            }
        } else {
            log.error('This claim does not exist');
        }
    } catch (e) {
        log.error('Error when updating claim: ' + e, e);
    }
}
