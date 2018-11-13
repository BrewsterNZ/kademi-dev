controllerMappings
        .adminController()
        .path("/kfeedback/")
        .enabled(true)
        .defaultView(views.templateView("kfeedback/index.html"))
        .build();

controllerMappings
        .adminController()
        .path("/kfeedback/uploadFiles")
        .enabled(true)
        .addMethod("POST", "uploadFile")
        .build();

controllerMappings
        .adminController()
        .path("/kfeedback/feedbacks/")
        .enabled(true)
        .addMethod("GET", "getFeedbackBySurvey")
        .build();

controllerMappings
        .adminController()
        .path("/kfeedback/surveys/")
        .enabled(true)
        .addMethod("GET", "getAllSurveys")
        .addMethod("POST", "createSurvey")
        .build();

/**
 * front end mapping
 */
controllerMappings
        .websiteController()
        .path("/send-feedback/")
        .enabled(true)
        .isPublic(true)
        .defaultView(views.templateView("kfeedback/index.html"))
        .build();

controllerMappings
        .websiteController()
        .path("/send-feedback-api/")
        .enabled(true)
        .isPublic(true)
        .addMethod("GET", "getSurvey")
        .addMethod("POST", "createFeedback")
        .postPriviledge("READ_CONTENT")
        .build();

controllerMappings.addGoalNodeType("kfeedbackSubmittedGoal", "kfeedback/jb/kfeedbackSubmittedGoalNode.js", null);

controllerMappings.addComponent("kfeedback", "kfeedbackEmail", "email", "Shows emoticons with links", "Kfeedback App component");
controllerMappings.addComponent("kfeedback", "kfeedbackForm", "html", "Shows kfeedbackForm", "Kfeedback App component");

controllerMappings.addTextJourneyField("kfeedback-result", "KFeedback result", "getLastFeedbackResult"); // see function below


//TODO: finish implementation and uncomment
//controllerMappings.addEngagementScoringFactorType("kFeedbackEngagment", "K Feedback Engagment", "appendQuery", "indexFeedBack", "appendMappings", "getProperties");

function appendQuery(searchRequestBuilder, boosters, boost, factorProperties) {
    log.info('kfeedback:: appendQuery searchRequestBuilder={} boosters={} boost={} factorProperties={}', [searchRequestBuilder, boosters, boost, factorProperties]);

    boosters.should();
    return null;
}

function indexFeedBack(funnel, lead, builder) {
    log.info('kfeedback:: indexFeedBack funnel={} lead={} builder={}', [funnel, lead, builder]);
    if (lead.getProfile() == null) {
        return;
    }

    //TODO: Implement using real data!!!!
    var data =
            {
                website: "website",
                survey_id: "survey_id",
                option_slug: "option_slug",
                createdDate: new Date()
            };

    builder.addData("feedback", JSON.stringify(data));
}

function appendMappings(builder) {
    log.info('kfeedback:: appendMappings builder={}', [builder]);
    builder.startObjectMapping("feedback")
            .textField("website")
            .textField("survey_id")
            .textField("option_slug")
            .dateField("createdDate")
            .endObjectMapping();
}

function engagementScoringProperty(name, text) {
    return {name: name, text: text};
}

function getProperties() {
    log.info('kfeedback:: getProperties');
    var properties = [];
    properties.push(engagementScoringProperty("website", "Website"));
    properties.push(engagementScoringProperty("surveyId", "Survey Id"));
    return properties;
}

function getLastFeedbackResult(profile, vars) {
    log.info('getLastFeedbackResult profile={} vars={}', profile, vars);
    var profileId = profile.id;
    log.info("getLastFeedbackResult: profileid={}", profileId);
    var jsonDB = applications.KongoDB.findDatabase(dbName);
    log.info('jsondb is {}', jsonDB);

    var db = jsonDB;
    if (db == null) {
        log.error("Could not find database " + dbName);
        return null;
    }
    var queryJson = {
        '_source': ['option_slug'],
        'query': {
            'bool': {
                'must': {
                    "term": {"profileId": profileId}
                }
            }
        },
        'size': 1,
        'sort': [
            {"created": "desc"}
        ]
    };

    if (vars != null && vars['surveyId'] != null) {
        queryJson['query']['bool']['filter'] = [
            {
                "term": {
                    "survey_id": vars['surveyId']
                }
            }
        ];
    }

    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    //log.info('search hit {}', searchResult.hits.totalHits);
    if (searchResult.hits.totalHits > 0) {
        var hit = searchResult.hits.hits[0];
        //log.info('option slug return {}', hit.source.option_slug);
        return hit.source.option_slug;
    }
}

function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp Kfeedback: orgRoot={}", orgRoot);

    var dbs = orgRoot.find(JSON_DB);
    if (isNull(dbs)) {
        orgRoot.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }
    var db = dbs.child(dbName);

    if (isNull(db)) {
        log.info('{} does not exist!', dbTitle);
        db = dbs.createDb(dbName, dbTitle, dbName);

        if (!db.allowAccess) {
            setAllowAccess(db, true);
        }
    }

    saveMapping(db);
}

function setAllowAccess(db, allowAccess) {
    transactionManager.runInTransaction(function () {
        db.setAllowAccess(allowAccess);
    });
}

function uploadFile(page, params, files) {
    log.info('uploadFile > page {} params {} files {}', page, params, files);
    if (files !== null || !files.isEmpty()) {
        var filesArray = files.entrySet().toArray();

        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i].getValue();
            var fileHash = fileManager.uploadFile(file);

            return views.jsonObjectView({
                type: file.contentType,
                size: file.size,
                uploaded: new Date(),
                hash: fileHash
            });
        }
    }
}


controllerMappings.setUserTimelineFunction('generateTimelineItems');

function generateTimelineItems(page, user, list){
    log.info('getUserFeedback {}', user);
    var sumissions =  getUserFeedback(page, user.userId);
    var db = getDB(page);
    if (sumissions.hits.totalHits > 0){
        for (var i in sumissions.hits.hits){
            var hit = sumissions.hits.hits[i];
            var survey = db.child(hit.source.survey_id);
            var sentiment = hit.source.option_text;
            var icon = 'fa-smile-o';
            if (sentiment.search(/sad/ig) != -1){
                icon = 'fa-frown-o';
            } else if (sentiment.search(/neutral/ig) != -1){
                icon = 'fa-meh-o';
            } else if (sentiment.search(/happy/ig) != -1){
                icon = 'fa-smile-o';
            } else {
                icon = 'fa-trophy';
            }
            var streamItem = applications.stream.streamEventBuilder()
                .profile(user)
                .title('Submitted feedback question: ' + survey.jsonObject.question)
                .desc('Answer text selected: ' + hit.source.option_text)
                .date(formatter.toDate(hit.source.created))
                .category('info')
                .inbound(true)
                // .path('/ksurvey/' + survey.name + '/result/?profileId=' + user.userId)
                .icon(icon)
                .build();

            list.add(streamItem);
        }

    }
}

function getUserFeedback(page, profileId) {
    var queryJson = {
        'query': {
            'bool': {
                'must': [
                    { 'type': { 'value': TYPE_FEEDBACK } },
                    { 'term': { 'profileId': profileId } }
                ]
            }
        }

    };
    var searchResult = doDBSearch(page, queryJson);

    return searchResult;
}